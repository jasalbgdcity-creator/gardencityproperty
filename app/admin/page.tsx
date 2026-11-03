"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import {
  AlertCircle,
  Building2,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  HardDrive,
  Image as ImageIcon,
  LogOut,
  Plus,
  RefreshCw,
  Ruler,
  Sparkles,
  Square,
  Trash2,
  Upload,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const MAX_PROJECT_MEDIA_BYTES = 40 * 1024 * 1024; // 40 MB total project media cap

function getTotalMediaBytes(
  main: File | null,
  gallery: File[],
  floorPlan: File | null,
): number {
  let sum = 0;
  if (main) sum += main.size;
  if (floorPlan) sum += floorPlan.size;
  for (const f of gallery) {
    sum += f.size;
  }
  return sum;
}

// Client-side in-browser canvas compression utility
async function compressImageFile(
  file: File,
  maxDimension = 2048,
  quality = 0.82,
): Promise<File> {
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/svg+xml" ||
    file.size < 500 * 1024
  ) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob && blob.size < file.size) {
            const compressed = new File(
              [blob],
              file.name.replace(/\.[^.]+$/, ".webp"),
              {
                type: "image/webp",
                lastModified: Date.now(),
              },
            );
            resolve(compressed);
          } else {
            resolve(file);
          }
        },
        "image/webp",
        quality,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

interface ProjectRecord {
  id: string;
  name: string;
  price: string;
  paymentPlan: string;
  area: string;
  developer: string;
  image: string;
  gallery_urls?: string[];
  floor_plan_url?: string;
  location?: string;
  completion_date?: string;
  construction_stage?: string;
  status?: string;
  type?: string;
  structure?: string;
  created_at?: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Property list state
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [deleteIdInProgress, setDeleteIdInProgress] = useState<string | null>(null);

  // Form input state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [paymentPlan, setPaymentPlan] = useState("");
  const [area, setArea] = useState("");
  const [developer, setDeveloper] = useState("");
  const [location, setLocation] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [constructionStage, setConstructionStage] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [structure, setStructure] = useState("");

  // Media files state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [floorPlanFile, setFloorPlanFile] = useState<File | null>(null);
  const [floorPlanPreview, setFloorPlanPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Derived media sizes & 40MB quota status
  const totalMediaBytes = getTotalMediaBytes(imageFile, galleryFiles, floorPlanFile);
  const totalMediaMB = (totalMediaBytes / (1024 * 1024)).toFixed(2);
  const isOverSizeLimit = totalMediaBytes > MAX_PROJECT_MEDIA_BYTES;
  const isNearSizeLimit = totalMediaBytes > 30 * 1024 * 1024 && !isOverSizeLimit;

  // Feedback banners
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [listMessage, setListMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  // Fetch projects from Supabase
  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    setListMessage(null);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Map database columns to ProjectRecord (supporting both snake_case payment_plan and camelCase)
        const mapped: ProjectRecord[] = data.map((item: Record<string, unknown>) => ({
          id: String(item.id || ""),
          name: String(item.name || ""),
          price: String(item.price || ""),
          paymentPlan: String(item.payment_plan || item.paymentPlan || ""),
          area: String(item.area || item.site_area || ""),
          developer: String(item.developer || ""),
          image: String(item.image || ""),
          gallery_urls: Array.isArray(item.gallery_urls)
            ? (item.gallery_urls as string[])
            : Array.isArray(item.galleryUrls)
            ? (item.galleryUrls as string[])
            : [],
          floor_plan_url:
            (typeof item.floor_plan_url === "string" && item.floor_plan_url.trim()) ||
            (typeof item.floorplan_url === "string" && item.floorplan_url.trim()) ||
            (typeof item.floorPlanUrl === "string" && item.floorPlanUrl.trim()) ||
            (typeof item.floor_plan === "string" && item.floor_plan.trim()) ||
            (typeof item.floorplan === "string" && item.floorplan.trim()) ||
            undefined,
          location: typeof item.location === "string" ? item.location : undefined,
          completion_date: typeof item.completion_date === "string" ? item.completion_date : undefined,
          construction_stage: typeof item.construction_stage === "string" ? item.construction_stage : undefined,
          status: typeof item.status === "string" ? item.status : undefined,
          type: typeof item.type === "string" ? item.type : typeof item.property_type === "string" ? item.property_type : undefined,
          structure: typeof item.structure === "string" ? item.structure : undefined,
          created_at: typeof item.created_at === "string" ? item.created_at : undefined,
        }));
        setProjects(mapped);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load projects.";
      setListMessage({ type: "error", text: msg });
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  // Check user session
  useEffect(() => {
    async function initAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.replace("/admin/login");
          return;
        }

        setUser(session.user);
        setAuthChecking(false);
        fetchProjects();
      } catch (err) {
        console.error("Auth init error:", err);
        router.replace("/admin/login");
      }
    }

    initAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/admin/login");
      } else {
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, fetchProjects]);

  // Handle image selection & preview
  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);

      // Instant 40MB limit verification
      const total = getTotalMediaBytes(file, galleryFiles, floorPlanFile);
      if (total > MAX_PROJECT_MEDIA_BYTES) {
        setFormError(
          "Total image size for this project exceeds the 40MB limit. Please compress or select smaller images.",
        );
      } else if (formError?.includes("exceeds the 40MB limit")) {
        setFormError(null);
      }
    }
  }

  // Handle gallery images selection & previews
  function handleGalleryChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setGalleryFiles(files);
      // Revoke previous URLs to avoid memory leaks
      galleryPreviews.forEach((url) => URL.revokeObjectURL(url));
      const previews = files.map((file) => URL.createObjectURL(file));
      setGalleryPreviews(previews);

      // Instant 40MB limit verification
      const total = getTotalMediaBytes(imageFile, files, floorPlanFile);
      if (total > MAX_PROJECT_MEDIA_BYTES) {
        setFormError(
          "Total image size for this project exceeds the 40MB limit. Please compress or select smaller images.",
        );
      } else if (formError?.includes("exceeds the 40MB limit")) {
        setFormError(null);
      }
    }
  }

  function handleRemoveGallery() {
    galleryPreviews.forEach((url) => URL.revokeObjectURL(url));
    setGalleryPreviews([]);
    setGalleryFiles([]);
    const galleryInput = document.getElementById(
      "project-gallery-input",
    ) as HTMLInputElement | null;
    if (galleryInput) galleryInput.value = "";

    const total = getTotalMediaBytes(imageFile, [], floorPlanFile);
    if (total <= MAX_PROJECT_MEDIA_BYTES && formError?.includes("exceeds the 40MB limit")) {
      setFormError(null);
    }
  }

  // Handle floor plan image selection & preview
  function handleFloorPlanChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFloorPlanFile(file);
      if (floorPlanPreview) {
        URL.revokeObjectURL(floorPlanPreview);
      }
      setFloorPlanPreview(URL.createObjectURL(file));

      // Instant 40MB limit verification
      const total = getTotalMediaBytes(imageFile, galleryFiles, file);
      if (total > MAX_PROJECT_MEDIA_BYTES) {
        setFormError(
          "Total image size for this project exceeds the 40MB limit. Please compress or select smaller images.",
        );
      } else if (formError?.includes("exceeds the 40MB limit")) {
        setFormError(null);
      }
    }
  }

  function handleRemoveFloorPlan() {
    if (floorPlanPreview) {
      URL.revokeObjectURL(floorPlanPreview);
    }
    setFloorPlanPreview(null);
    setFloorPlanFile(null);
    const fpInput = document.getElementById(
      "project-floor-plan-input",
    ) as HTMLInputElement | null;
    if (fpInput) fpInput.value = "";

    const total = getTotalMediaBytes(imageFile, galleryFiles, null);
    if (total <= MAX_PROJECT_MEDIA_BYTES && formError?.includes("exceeds the 40MB limit")) {
      setFormError(null);
    }
  }

  // Automatic client-side image compression helper
  async function handleAutoCompressImages() {
    setIsCompressing(true);
    setFormError(null);
    try {
      let newImageFile = imageFile;
      if (imageFile) {
        newImageFile = await compressImageFile(imageFile);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImageFile(newImageFile);
        setImagePreview(URL.createObjectURL(newImageFile));
      }

      const newGalleryFiles: File[] = [];
      const newGalleryPreviews: string[] = [];
      galleryPreviews.forEach((url) => URL.revokeObjectURL(url));
      for (const gFile of galleryFiles) {
        const compressed = await compressImageFile(gFile);
        newGalleryFiles.push(compressed);
        newGalleryPreviews.push(URL.createObjectURL(compressed));
      }
      setGalleryFiles(newGalleryFiles);
      setGalleryPreviews(newGalleryPreviews);

      let newFloorPlanFile = floorPlanFile;
      if (floorPlanFile) {
        newFloorPlanFile = await compressImageFile(floorPlanFile);
        if (floorPlanPreview) URL.revokeObjectURL(floorPlanPreview);
        setFloorPlanFile(newFloorPlanFile);
        setFloorPlanPreview(URL.createObjectURL(newFloorPlanFile));
      }

      const newTotal = getTotalMediaBytes(newImageFile, newGalleryFiles, newFloorPlanFile);
      if (newTotal <= MAX_PROJECT_MEDIA_BYTES) {
        setFormSuccess(
          `Images optimized successfully! Reduced total project media to ${(newTotal / (1024 * 1024)).toFixed(2)} MB.`,
        );
      }
    } catch (err) {
      console.error("Auto compression error:", err);
      setFormError("Auto-compression failed. Please select smaller images.");
    } finally {
      setIsCompressing(false);
    }
  }

  // Generate unique URL slug
  function generateSlug(title: string): string {
    const clean = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    return `${clean || "project"}-${randomSuffix}`;
  }

  // Submit new property
  async function handleAddProject(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!imageFile) {
      setFormError("Please select a primary main image for the property.");
      return;
    }

    // Strict 40 MB Total Project Media Limit Validation
    if (totalMediaBytes > MAX_PROJECT_MEDIA_BYTES) {
      setFormError(
        "Total image size for this project exceeds the 40MB limit. Please compress or select smaller images.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const slug = generateSlug(name);

      // 1. Upload main image to 'property-images' Supabase storage bucket
      const fileExt = imageFile.name.split(".").pop() || "jpg";
      const sanitizedExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, "");
      const storagePath = `properties/${slug}-${Date.now()}.${sanitizedExt}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(storagePath, imageFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Main image upload failed: ${uploadError.message}`);
      }

      // 2. Retrieve main image public URL
      const { data: publicUrlData } = supabase.storage
        .from("property-images")
        .getPublicUrl(storagePath);

      const publicImageUrl = publicUrlData.publicUrl;

      // 3. Upload gallery images if provided
      const galleryUrls: string[] = [];
      for (let i = 0; i < galleryFiles.length; i++) {
        const gFile = galleryFiles[i];
        const gExt = (gFile.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
        const gPath = `properties/${slug}-gallery-${i + 1}-${Date.now()}.${gExt}`;

        const { error: gUploadErr } = await supabase.storage
          .from("property-images")
          .upload(gPath, gFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (gUploadErr) {
          throw new Error(`Gallery image upload failed: ${gUploadErr.message}`);
        }

        const { data: gUrlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(gPath);
        if (gUrlData?.publicUrl) {
          galleryUrls.push(gUrlData.publicUrl);
        }
      }

      // 4. Upload floor plan image if provided
      let floorPlanUrl: string | null = null;
      if (floorPlanFile) {
        const fpExt = (floorPlanFile.name.split(".").pop() || "jpg")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");
        const fpPath = `properties/${slug}-floorplan-${Date.now()}.${fpExt}`;

        const { error: fpUploadErr } = await supabase.storage
          .from("property-images")
          .upload(fpPath, floorPlanFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (fpUploadErr) {
          throw new Error(`Floor plan upload failed: ${fpUploadErr.message}`);
        }

        const { data: fpUrlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(fpPath);
        floorPlanUrl = fpUrlData?.publicUrl || null;
      }

      // 5. Insert record into 'projects' table
      const { error: insertError } = await supabase.from("projects").insert([
        {
          id: slug,
          name: name.trim(),
          price: price.trim(),
          payment_plan: paymentPlan.trim(),
          area: area.trim(),
          developer: developer.trim(),
          image: publicImageUrl,
          gallery_urls: galleryUrls,
          floor_plan_url: floorPlanUrl,
          location: location.trim() || undefined,
          completion_date: completionDate.trim() || undefined,
          construction_stage: constructionStage.trim() || undefined,
          status: status.trim() || undefined,
          type: type.trim() || undefined,
          structure: structure.trim() || undefined,
        },
      ]);

      if (insertError) {
        throw new Error(`Database insert failed: ${insertError.message}`);
      }

      // 6. Success feedback and form reset
      setFormSuccess(
        `Successfully published "${name}" with all visuals to the database!`,
      );
      setName("");
      setPrice("");
      setPaymentPlan("");
      setArea("");
      setDeveloper("");
      setLocation("");
      setCompletionDate("");
      setConstructionStage("");
      setStatus("");
      setType("");
      setStructure("");
      setImageFile(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
      handleRemoveGallery();
      handleRemoveFloorPlan();

      // Reset file input element
      const fileInput = document.getElementById("project-image-input") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";

      // 7. Refresh properties list
      await fetchProjects();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish project.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  // Delete project
  async function handleDeleteProject(id: string, projectName: string) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${projectName}" from the database?`,
    );
    if (!confirmed) return;

    setDeleteIdInProgress(id);
    setListMessage(null);

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;

      setListMessage({
        type: "success",
        text: `"${projectName}" was successfully removed.`,
      });
      // Refresh list
      await fetchProjects();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete project.";
      setListMessage({ type: "error", text: msg });
    } finally {
      setDeleteIdInProgress(null);
    }
  }

  // Logout handler
  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } finally {
      router.replace("/admin/login");
    }
  }

  // Render loading state while checking session
  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
          <p className="text-sm font-medium tracking-wide text-slate-400">
            Authenticating administrator session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-main.jpeg"
              alt="Garden City Properties"
              className="h-10 w-10 rounded-xl object-contain shadow-md"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-wide text-white sm:text-lg">
                  GARDEN<span className="text-amber-500">CITY</span>
                </span>
                <span className="rounded-md border border-sky-400/30 bg-sky-500/10 px-2 py-0.5 text-[0.65rem] font-bold tracking-widest text-sky-400 uppercase">
                  Admin
                </span>
              </div>
              <span className="text-[0.65rem] tracking-[0.25em] text-cyan-400 uppercase">
                Properties Management
              </span>
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            {user?.email && (
              <span className="hidden text-xs text-slate-400 md:inline-block">
                Signed in as: <strong className="text-slate-200">{user.email}</strong>
              </span>
            )}

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-sky-400/40 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View Public Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/30 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-900/40 hover:text-white"
              title="Sign out of Admin Portal"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-[0.28em] text-sky-400 uppercase">
            Portfolio Control Desk
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-extrabold text-white sm:text-4xl">
            Project Inventory & Publishing
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Publish new developments directly to the live database, manage existing property
            listings, and upload media assets into your Supabase storage bucket.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* SECTION A: Add Property Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white">
                    Add New Property
                  </h2>
                  <p className="text-xs text-slate-400">Create a real estate listing in Supabase</p>
                </div>
              </div>

              {/* Form Feedback Alerts */}
              {formError && (
                <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-red-500/30 bg-red-950/40 p-3.5 text-xs text-red-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <p>{formError}</p>
                </div>
              )}

              {formSuccess && (
                <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 text-xs text-emerald-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <p>{formSuccess}</p>
                </div>
              )}

              <form onSubmit={handleAddProject} className="mt-6 space-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="prop-name"
                    className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                  >
                    Project Name *
                  </label>
                  <input
                    id="prop-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Sultan Haitham City"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                  />
                </div>

                {/* Developer */}
                <div>
                  <label
                    htmlFor="prop-dev"
                    className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                  >
                    Developer *
                  </label>
                  <input
                    id="prop-dev"
                    type="text"
                    required
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                    placeholder="e.g., Al Abrar Real Estate"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                  />
                </div>

                {/* Price & Area grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="prop-price"
                      className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                    >
                      Starting Price *
                    </label>
                    <input
                      id="prop-price"
                      type="text"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g., OMR 45,000+"
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="prop-area"
                      className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                    >
                      Starting Area *
                    </label>
                    <input
                      id="prop-area"
                      type="text"
                      required
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g., 67.5 sqm"
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    />
                  </div>
                </div>

                {/* Payment Plan */}
                <div>
                  <label
                    htmlFor="prop-plan"
                    className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                  >
                    Payment Plan *
                  </label>
                  <input
                    id="prop-plan"
                    type="text"
                    required
                    value={paymentPlan}
                    onChange={(e) => setPaymentPlan(e.target.value)}
                    placeholder="e.g., 20/80 or Flexible"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                  />
                </div>

                {/* Project Media Storage Quota Bar & Warning */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 transition">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <HardDrive
                        className={`h-4 w-4 ${
                          isOverSizeLimit
                            ? "text-red-400"
                            : isNearSizeLimit
                            ? "text-amber-400"
                            : "text-sky-400"
                        }`}
                      />
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Project Media Storage
                      </span>
                    </div>
                    <span
                      className={`text-xs font-mono font-bold ${
                        isOverSizeLimit
                          ? "text-red-400"
                          : isNearSizeLimit
                          ? "text-amber-400"
                          : "text-slate-300"
                      }`}
                    >
                      {totalMediaMB} MB / 40.00 MB
                    </span>
                  </div>

                  {/* Quota Progress Bar */}
                  <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isOverSizeLimit
                          ? "bg-red-500"
                          : isNearSizeLimit
                          ? "bg-amber-400"
                          : "bg-sky-400"
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (totalMediaBytes / MAX_PROJECT_MEDIA_BYTES) * 100,
                        )}%`,
                      }}
                    />
                  </div>

                  {/* Oversized batch warning & one-click optimization */}
                  {isOverSizeLimit && (
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-red-500/30 bg-red-950/50 p-2.5 text-xs text-red-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                        <span>
                          Total image size for this project exceeds the 40MB limit. Please compress or select smaller images.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAutoCompressImages}
                        disabled={isCompressing}
                        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-red-500/25 px-2.5 py-1 text-xs font-semibold text-red-100 hover:bg-red-500/40 transition disabled:opacity-50"
                      >
                        {isCompressing ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            <span>Optimizing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3 w-3 text-amber-300" />
                            <span>Auto-Compress All</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {!isOverSizeLimit && isNearSizeLimit && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-300">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                      <span>Approaching 40MB limit ({totalMediaMB} MB / 40.00 MB used).</span>
                    </div>
                  )}
                </div>

                {/* Main Image Upload Input */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="project-image-input"
                      className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                    >
                      Primary Main Image (Card Cover) *
                    </label>
                    {imageFile && (
                      <span className="text-[11px] font-mono text-sky-400">
                        {(imageFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5">
                    <label
                      htmlFor="project-image-input"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-slate-950/60 p-4 transition hover:border-sky-400/50 hover:bg-slate-950"
                    >
                      {imagePreview ? (
                        <div className="relative h-36 w-full overflow-hidden rounded-xl border border-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imagePreview}
                            alt="Selected upload preview"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                            <span className="text-xs font-semibold text-white bg-slate-950/80 px-2.5 py-1 rounded-md">
                              Click to change cover image
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center">
                          <Upload className="h-7 w-7 text-sky-400" />
                          <p className="mt-2 text-xs font-medium text-slate-300">
                            Upload main property cover
                          </p>
                          <p className="mt-0.5 text-[0.7rem] text-slate-500">
                            Single image (PNG, JPG, WEBP)
                          </p>
                        </div>
                      )}
                      <input
                        id="project-image-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Gallery Images Upload Input (Multiple) */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="project-gallery-input"
                      className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                    >
                      Gallery Slideshow Images (Optional)
                    </label>
                    <div className="flex items-center gap-2">
                      {galleryFiles.length > 0 && (
                        <span className="text-[11px] font-mono text-amber-300">
                          {(
                            galleryFiles.reduce((acc, f) => acc + f.size, 0) /
                            (1024 * 1024)
                          ).toFixed(2)}{" "}
                          MB
                        </span>
                      )}
                      {galleryPreviews.length > 0 && (
                        <button
                          type="button"
                          onClick={handleRemoveGallery}
                          className="text-[0.7rem] font-semibold text-red-400 hover:text-red-300 transition"
                        >
                          Clear ({galleryPreviews.length})
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-1.5">
                    <label
                      htmlFor="project-gallery-input"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-slate-950/60 p-4 transition hover:border-amber-400/50 hover:bg-slate-950"
                    >
                      {galleryPreviews.length > 0 ? (
                        <div className="w-full">
                          <div className="grid grid-cols-4 gap-2">
                            {galleryPreviews.map((preview, idx) => (
                              <div
                                key={idx}
                                className="relative h-16 w-full overflow-hidden rounded-lg border border-white/10"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={preview}
                                  alt={`Gallery preview ${idx + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                          <p className="mt-2 text-center text-xs font-medium text-amber-300">
                            {galleryPreviews.length} gallery image(s) selected (Click to replace)
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center">
                          <ImageIcon className="h-7 w-7 text-amber-400" />
                          <p className="mt-2 text-xs font-medium text-slate-300">
                            Upload multiple gallery photos
                          </p>
                          <p className="mt-0.5 text-[0.7rem] text-slate-500">
                            Select multiple files for modal slideshow
                          </p>
                        </div>
                      )}
                      <input
                        id="project-gallery-input"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGalleryChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Floor Plan Image Upload Input */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="project-floor-plan-input"
                      className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                    >
                      Floor Plan Image (Optional - Bento Modal)
                    </label>
                    <div className="flex items-center gap-2">
                      {floorPlanFile && (
                        <span className="text-[11px] font-mono text-emerald-400">
                          {(floorPlanFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      )}
                      {floorPlanPreview && (
                        <button
                          type="button"
                          onClick={handleRemoveFloorPlan}
                          className="text-[0.7rem] font-semibold text-red-400 hover:text-red-300 transition"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-1.5">
                    <label
                      htmlFor="project-floor-plan-input"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-slate-950/60 p-4 transition hover:border-emerald-400/50 hover:bg-slate-950"
                    >
                      {floorPlanPreview ? (
                        <div className="relative h-28 w-full overflow-hidden rounded-xl border border-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={floorPlanPreview}
                            alt="Floor plan preview"
                            className="h-full w-full object-contain p-2 bg-slate-900"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                            <span className="text-xs font-semibold text-white bg-slate-950/80 px-2.5 py-1 rounded-md">
                              Click to change floor plan
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center">
                          <Ruler className="h-7 w-7 text-emerald-400" />
                          <p className="mt-2 text-xs font-medium text-slate-300">
                            Upload Floor Plan architectural blueprint
                          </p>
                          <p className="mt-0.5 text-[0.7rem] text-slate-500">
                            PNG, JPG, WEBP (Displayed in Quick View modal)
                          </p>
                        </div>
                      )}
                      <input
                        id="project-floor-plan-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFloorPlanChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Additional Bento-Box Metadata */}
                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs font-semibold tracking-wider text-sky-400 uppercase mb-3">
                    Bento-Box Showcase Details (Optional)
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="prop-loc" className="block text-[11px] font-medium text-slate-400 uppercase">
                        Location
                      </label>
                      <input
                        id="prop-loc"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Muscat, Oman"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="prop-completion" className="block text-[11px] font-medium text-slate-400 uppercase">
                        Completion Date
                      </label>
                      <input
                        id="prop-completion"
                        type="text"
                        value={completionDate}
                        onChange={(e) => setCompletionDate(e.target.value)}
                        placeholder="e.g., Q4 2026"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="prop-stage" className="block text-[11px] font-medium text-slate-400 uppercase">
                        Construction Stage
                      </label>
                      <input
                        id="prop-stage"
                        type="text"
                        value={constructionStage}
                        onChange={(e) => setConstructionStage(e.target.value)}
                        placeholder="e.g., 75% Completed"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="prop-status" className="block text-[11px] font-medium text-slate-400 uppercase">
                        Status
                      </label>
                      <input
                        id="prop-status"
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        placeholder="e.g., Available / Off-plan"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="prop-type" className="block text-[11px] font-medium text-slate-400 uppercase">
                        Type
                      </label>
                      <input
                        id="prop-type"
                        type="text"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        placeholder="e.g., Luxury Villa"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="prop-structure" className="block text-[11px] font-medium text-slate-400 uppercase">
                        Structure
                      </label>
                      <input
                        id="prop-structure"
                        type="text"
                        value={structure}
                        onChange={(e) => setStructure(e.target.value)}
                        placeholder="e.g., G + 2 Floors"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting || isCompressing}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 py-3 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(56,189,248,0.35)] transition hover:shadow-[0_0_36px_rgba(56,189,248,0.55)] hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                      <span>Uploading & Publishing...</span>
                    </>
                  ) : isCompressing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                      <span>Optimizing Media...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Publish Property</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* SECTION B: Properties List */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white">
                    Live Properties ({projects.length})
                  </h2>
                  <p className="text-xs text-slate-400">
                    Real-time listings synchronized with Supabase
                  </p>
                </div>

                <button
                  onClick={() => fetchProjects()}
                  disabled={loadingProjects}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-sky-400/40 hover:text-white disabled:opacity-50"
                  title="Refresh properties list"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${loadingProjects ? "animate-spin text-sky-400" : ""}`}
                  />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Status Message */}
              {listMessage && (
                <div
                  className={`mt-4 flex items-start gap-2.5 rounded-2xl border p-3.5 text-xs ${
                    listMessage.type === "success"
                      ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-200"
                      : "border-red-500/30 bg-red-950/40 text-red-200"
                  }`}
                >
                  {listMessage.type === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  )}
                  <p>{listMessage.text}</p>
                </div>
              )}

              {/* Loading State */}
              {loadingProjects && projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
                  <p className="mt-3 text-xs text-slate-400">Loading properties from Supabase...</p>
                </div>
              ) : projects.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950 text-slate-500">
                    <ImageIcon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-[family-name:var(--font-outfit)] text-base font-semibold text-white">
                    No properties in the database yet
                  </h3>
                  <p className="mt-1 max-w-sm text-xs text-slate-400">
                    Use the form on the left to add your first property. It will be saved into
                    Supabase and displayed here immediately.
                  </p>
                </div>
              ) : (
                /* Projects List / Grid */
                <div className="mt-6 space-y-4">
                  {projects.map((project) => (
                    <article
                      key={project.id}
                      className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition-all duration-200 hover:border-sky-400/30 hover:bg-slate-950 sm:flex-row sm:items-center sm:gap-5"
                    >
                      {/* Image Thumbnail */}
                      <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-900 sm:h-24 sm:w-28">
                        {project.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={project.image}
                            alt={project.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-600">
                            <ImageIcon className="h-6 w-6" />
                          </div>
                        )}
                        <span className="absolute top-2 start-2 rounded-md bg-slate-950/80 px-2 py-0.5 text-[0.65rem] font-bold text-amber-400 backdrop-blur-md">
                          {project.price}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-[family-name:var(--font-outfit)] text-base font-bold text-white transition group-hover:text-sky-300">
                            {project.name}
                          </h3>
                        </div>

                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                          <Building2 className="h-3.5 w-3.5 text-sky-400/80" />
                          <span className="truncate">{project.developer}</span>
                        </p>

                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[0.7rem] text-slate-300">
                            <CalendarDays className="h-3 w-3 text-sky-400" />
                            <span>Plan: {project.paymentPlan || "N/A"}</span>
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[0.7rem] text-slate-300">
                            <Square className="h-3 w-3 text-sky-400" />
                            <span>{project.area || "N/A"}</span>
                          </span>

                          {project.gallery_urls && project.gallery_urls.length > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[0.7rem] text-amber-300">
                              <ImageIcon className="h-3 w-3 text-amber-400" />
                              <span>+{project.gallery_urls.length} gallery images</span>
                            </span>
                          )}

                          {project.floor_plan_url && (
                            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[0.7rem] text-emerald-300">
                              <Ruler className="h-3 w-3 text-emerald-400" />
                              <span>Floor plan</span>
                            </span>
                          )}

                          <span className="text-[0.65rem] text-slate-500 truncate">
                            id: {project.id}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end border-t border-white/5 pt-3 sm:border-0 sm:pt-0">
                        <button
                          onClick={() => handleDeleteProject(project.id, project.name)}
                          disabled={deleteIdInProgress === project.id}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/20 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-900/40 hover:text-white disabled:pointer-events-none disabled:opacity-50"
                          title={`Delete ${project.name}`}
                        >
                          {deleteIdInProgress === project.id ? (
                            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-300 border-t-transparent" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                          )}
                          <span>Delete</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
