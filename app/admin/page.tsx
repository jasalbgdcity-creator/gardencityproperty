"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import {
  AlertCircle,
  AlertTriangle,
  Building2,
  CalendarDays,
  CheckCircle2,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  HardDrive,
  Image as ImageIcon,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Ruler,
  Sparkles,
  Square,
  Trash2,
  Upload,
  UploadCloud,
  Video,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const MAX_PROJECT_MEDIA_BYTES = 40 * 1024 * 1024; // 40 MB total project media cap

// Strictly allowed MIME types and file extensions for real estate media
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

interface FileValidationResult {
  isValid: boolean;
  detectedMime: string | null;
  normalizedExt: string;
  isIco: boolean;
  errorMessage?: string;
}

/**
 * Robust client-side validation that inspects both file extension and magic byte headers.
 * Catches and rejects ICO files (image/x-icon) and unsupported formats.
 */
async function detectFileFormat(file: File): Promise<FileValidationResult> {
  const ext = (file.name.split(".").pop() || "").toLowerCase();

  // 1. Detect ICO by file extension
  if (ext === "ico") {
    return {
      isValid: false,
      detectedMime: "image/x-icon",
      normalizedExt: "ico",
      isIco: true,
      errorMessage: `"${file.name}" is an ICO icon file. ICO files cannot be used as property photographs. Please upload JPG, PNG, or WebP images.`,
    };
  }

  // 2. Inspect binary magic bytes
  try {
    const slice = file.slice(0, 12);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // ICO binary header: 0x00 0x00 0x01 0x00
    if (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01 && bytes[3] === 0x00) {
      return {
        isValid: false,
        detectedMime: "image/x-icon",
        normalizedExt: "ico",
        isIco: true,
        errorMessage: `"${file.name}" has an ICO binary format. Please upload JPG, PNG, or WebP images.`,
      };
    }

    // JPEG: 0xFF 0xD8 0xFF
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return {
        isValid: true,
        detectedMime: "image/jpeg",
        normalizedExt: ext === "jpeg" ? "jpeg" : "jpg",
        isIco: false,
      };
    }

    // PNG: 0x89 0x50 0x4E 0x47
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
      return {
        isValid: true,
        detectedMime: "image/png",
        normalizedExt: "png",
        isIco: false,
      };
    }

    // WebP: RIFF .... WEBP
    if (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    ) {
      return {
        isValid: true,
        detectedMime: "image/webp",
        normalizedExt: "webp",
        isIco: false,
      };
    }
  } catch (err) {
    console.warn("Magic byte inspection error:", err);
  }

  // 3. Fallback to MIME type and extension validation
  const rawMime = file.type.toLowerCase();
  if (ALLOWED_EXTENSIONS.includes(ext) || ALLOWED_MIME_TYPES.includes(rawMime) || rawMime === "image/jpg") {
    let normalizedMime = rawMime;
    if (ext === "jpg" || ext === "jpeg" || rawMime === "image/jpg") {
      normalizedMime = "image/jpeg";
    } else if (ext === "png") {
      normalizedMime = "image/png";
    } else if (ext === "webp") {
      normalizedMime = "image/webp";
    }

    return {
      isValid: true,
      detectedMime: normalizedMime,
      normalizedExt: ext === "jpeg" ? "jpeg" : ext === "png" ? "png" : ext === "webp" ? "webp" : "jpg",
      isIco: false,
    };
  }

  return {
    isValid: false,
    detectedMime: file.type || null,
    normalizedExt: ext,
    isIco: false,
    errorMessage: `"${file.name}" has an unsupported format (${file.type || ext}). Only JPG, JPEG, PNG, and WebP are supported.`,
  };
}

/**
 * Normalizes content type for Supabase storage uploads so invalid/unofficial types like "image/jpg"
 * or "image/x-icon" are never transmitted to the bucket.
 */
function getNormalizedContentType(file: File, validationMime?: string | null): string {
  if (validationMime && ALLOWED_MIME_TYPES.includes(validationMime)) {
    return validationMime;
  }
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (ext === "jpg" || ext === "jpeg" || file.type === "image/jpg" || file.type === "image/jpeg") {
    return "image/jpeg";
  }
  if (ext === "png" || file.type === "image/png") {
    return "image/png";
  }
  if (ext === "webp" || file.type === "image/webp") {
    return "image/webp";
  }
  return "image/jpeg";
}

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
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/svg+xml" ||
    file.type === "image/x-icon" ||
    ext === "ico" ||
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

interface StagedGalleryItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  format: string;
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
  description?: string;
  hero_video_url?: string;
  brochure_url?: string;
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

  // Edit mode state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [existingFloorPlanUrl, setExistingFloorPlanUrl] = useState<string | null>(null);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);

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
  const [description, setDescription] = useState("");
  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [brochureUrl, setBrochureUrl] = useState("");

  // Media files state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryItems, setGalleryItems] = useState<StagedGalleryItem[]>([]);
  const [floorPlanFile, setFloorPlanFile] = useState<File | null>(null);
  const [floorPlanPreview, setFloorPlanPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Upload progress & messaging
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
    stage: string;
  } | null>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  // Derived media sizes & 40MB quota status
  const galleryFiles = galleryItems.map((item) => item.file);
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
          description: typeof item.description === "string" ? item.description : undefined,
          hero_video_url: typeof item.hero_video_url === "string" ? item.hero_video_url : undefined,
          brochure_url: typeof item.brochure_url === "string" ? item.brochure_url : undefined,
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

  // Handle main cover image selection with strict validation
  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    setFormError(null);
    setValidationWarning(null);

    const file = e.target.files?.[0];
    if (!file) return;

    // Validate format & magic bytes
    const validation = await detectFileFormat(file);
    if (!validation.isValid) {
      setFormError(validation.errorMessage || "Unsupported image format.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    if (imagePreview && !imagePreview.startsWith("http")) {
      URL.revokeObjectURL(imagePreview);
    }
    const url = URL.createObjectURL(file);
    setImagePreview(url);

    // Instant 40MB limit check
    const total = getTotalMediaBytes(file, galleryFiles, floorPlanFile);
    if (total > MAX_PROJECT_MEDIA_BYTES) {
      setFormError(
        "Total media size for this project exceeds the 40MB limit. Please compress or select smaller images.",
      );
    }
  }

  // Handle gallery images selection (multi-file with individual validation, duplicate prevention, append support)
  async function handleGalleryChange(e: ChangeEvent<HTMLInputElement>) {
    const rawFiles = e.target.files ? Array.from(e.target.files) : [];
    if (rawFiles.length === 0) return;

    setFormError(null);
    setValidationWarning(null);

    const validNewItems: StagedGalleryItem[] = [];
    const skippedFiles: string[] = [];
    const duplicateFiles: string[] = [];

    for (const file of rawFiles) {
      // 1. Validate format
      const validation = await detectFileFormat(file);
      if (!validation.isValid) {
        skippedFiles.push(`${file.name} (${validation.isIco ? "ICO file" : file.type || "unsupported"})`);
        continue;
      }

      // 2. Prevent duplicate selection against existing staged items
      const isDuplicate = galleryItems.some(
        (existing) => existing.name === file.name && existing.size === file.size,
      );
      if (isDuplicate) {
        duplicateFiles.push(file.name);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      const ext = (file.name.split(".").pop() || "jpg").toUpperCase();
      validNewItems.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl,
        name: file.name,
        size: file.size,
        format: ext,
      });
    }

    // Build user-friendly feedback for skipped or duplicate files
    const notices: string[] = [];
    if (skippedFiles.length > 0) {
      notices.push(
        `Skipped ${skippedFiles.length} unsupported file(s): ${skippedFiles.join(", ")}. Supported formats: JPG, PNG, WebP.`,
      );
    }
    if (duplicateFiles.length > 0) {
      notices.push(`Ignored ${duplicateFiles.length} duplicate file(s): ${duplicateFiles.join(", ")}.`);
    }

    if (notices.length > 0) {
      setValidationWarning(notices.join(" | "));
    }

    // Append newly validated files to galleryItems
    if (validNewItems.length > 0) {
      const updatedItems = [...galleryItems, ...validNewItems];
      setGalleryItems(updatedItems);

      const newGalleryFiles = updatedItems.map((item) => item.file);
      const total = getTotalMediaBytes(imageFile, newGalleryFiles, floorPlanFile);
      if (total > MAX_PROJECT_MEDIA_BYTES) {
        setFormError(
          "Total media size for this project exceeds the 40MB limit. Please compress or remove images.",
        );
      }
    }

    // Reset input element value so the same file dialog can be opened again
    e.target.value = "";
  }

  // Remove a single staged gallery file
  function handleRemoveSingleGalleryItem(id: string) {
    const target = galleryItems.find((item) => item.id === id);
    if (target) {
      URL.revokeObjectURL(target.previewUrl);
    }

    const updated = galleryItems.filter((item) => item.id !== id);
    setGalleryItems(updated);

    const newGalleryFiles = updated.map((item) => item.file);
    const total = getTotalMediaBytes(imageFile, newGalleryFiles, floorPlanFile);
    if (total <= MAX_PROJECT_MEDIA_BYTES && formError?.includes("exceeds the 40MB limit")) {
      setFormError(null);
    }
  }

  // Remove a single existing gallery image (in edit mode)
  function handleRemoveSingleExistingGalleryUrl(index: number) {
    setExistingGalleryUrls((prev) => prev.filter((_, i) => i !== index));
  }

  // Clear all staged gallery files
  function handleRemoveAllGallery() {
    galleryItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setGalleryItems([]);

    const total = getTotalMediaBytes(imageFile, [], floorPlanFile);
    if (total <= MAX_PROJECT_MEDIA_BYTES && formError?.includes("exceeds the 40MB limit")) {
      setFormError(null);
    }
  }

  // Handle floor plan selection with strict validation
  async function handleFloorPlanChange(e: ChangeEvent<HTMLInputElement>) {
    setFormError(null);
    setValidationWarning(null);

    const file = e.target.files?.[0];
    if (!file) return;

    const validation = await detectFileFormat(file);
    if (!validation.isValid) {
      setFormError(validation.errorMessage || "Unsupported floor plan format. Please upload JPG, PNG, or WebP.");
      e.target.value = "";
      return;
    }

    setFloorPlanFile(file);
    if (floorPlanPreview && !floorPlanPreview.startsWith("http")) {
      URL.revokeObjectURL(floorPlanPreview);
    }
    setFloorPlanPreview(URL.createObjectURL(file));

    const total = getTotalMediaBytes(imageFile, galleryFiles, file);
    if (total > MAX_PROJECT_MEDIA_BYTES) {
      setFormError(
        "Total media size for this project exceeds the 40MB limit. Please compress or select smaller images.",
      );
    }
  }

  function handleRemoveFloorPlan() {
    if (floorPlanPreview && !floorPlanPreview.startsWith("http")) {
      URL.revokeObjectURL(floorPlanPreview);
    }
    setFloorPlanPreview(null);
    setFloorPlanFile(null);
    setExistingFloorPlanUrl(null);
    const fpInput = document.getElementById("project-floor-plan-input") as HTMLInputElement | null;
    if (fpInput) fpInput.value = "";

    const total = getTotalMediaBytes(imageFile, galleryFiles, null);
    if (total <= MAX_PROJECT_MEDIA_BYTES && formError?.includes("exceeds the 40MB limit")) {
      setFormError(null);
    }
  }

  // Auto-compress staged media
  async function handleAutoCompressImages() {
    setIsCompressing(true);
    setFormError(null);
    try {
      let newImageFile = imageFile;
      if (imageFile) {
        newImageFile = await compressImageFile(imageFile);
        if (imagePreview && !imagePreview.startsWith("http")) URL.revokeObjectURL(imagePreview);
        setImageFile(newImageFile);
        setImagePreview(URL.createObjectURL(newImageFile));
      }

      const updatedGalleryItems: StagedGalleryItem[] = [];
      for (const item of galleryItems) {
        const compressed = await compressImageFile(item.file);
        URL.revokeObjectURL(item.previewUrl);
        const newUrl = URL.createObjectURL(compressed);
        updatedGalleryItems.push({
          ...item,
          file: compressed,
          previewUrl: newUrl,
          size: compressed.size,
          format: "WEBP",
        });
      }
      setGalleryItems(updatedGalleryItems);

      let newFloorPlanFile = floorPlanFile;
      if (floorPlanFile) {
        newFloorPlanFile = await compressImageFile(floorPlanFile);
        if (floorPlanPreview && !floorPlanPreview.startsWith("http")) URL.revokeObjectURL(floorPlanPreview);
        setFloorPlanFile(newFloorPlanFile);
        setFloorPlanPreview(URL.createObjectURL(newFloorPlanFile));
      }

      const newTotal = getTotalMediaBytes(
        newImageFile,
        updatedGalleryItems.map((i) => i.file),
        newFloorPlanFile,
      );
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

  function generateSlug(title: string): string {
    const clean = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    return `${clean || "project"}-${randomSuffix}`;
  }

  function handleStartEdit(project: ProjectRecord) {
    setEditingProjectId(project.id);
    setName(project.name);
    setPrice(project.price);
    setPaymentPlan(project.paymentPlan);
    setArea(project.area);
    setDeveloper(project.developer);
    setLocation(project.location || "");
    setCompletionDate(project.completion_date || "");
    setConstructionStage(project.construction_stage || "");
    setStatus(project.status || "");
    setType(project.type || "");
    setStructure(project.structure || "");
    setDescription(project.description || "");
    setHeroVideoUrl(project.hero_video_url || "");
    setBrochureUrl(project.brochure_url || "");

    setExistingImageUrl(project.image);
    setImagePreview(project.image);
    setImageFile(null);

    setExistingFloorPlanUrl(project.floor_plan_url || null);
    setFloorPlanPreview(project.floor_plan_url || null);
    setFloorPlanFile(null);

    setExistingGalleryUrls(project.gallery_urls || []);
    // Clear staged files
    galleryItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setGalleryItems([]);

    setFormError(null);
    setFormSuccess(null);
    setValidationWarning(null);

    window.scrollTo({ top: 120, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingProjectId(null);
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
    setDescription("");
    setHeroVideoUrl("");
    setBrochureUrl("");

    setExistingImageUrl(null);
    if (imagePreview && !imagePreview.startsWith("http")) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setImageFile(null);

    setExistingFloorPlanUrl(null);
    if (floorPlanPreview && !floorPlanPreview.startsWith("http")) URL.revokeObjectURL(floorPlanPreview);
    setFloorPlanPreview(null);
    setFloorPlanFile(null);

    setExistingGalleryUrls([]);
    handleRemoveAllGallery();

    setFormError(null);
    setFormSuccess(null);
    setValidationWarning(null);
    setUploadProgress(null);
  }

  // Submit or update project with guaranteed MIME type normalization & explicit contentType
  async function handleSubmitProject(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setValidationWarning(null);

    const isEdit = Boolean(editingProjectId);

    if (!isEdit && !imageFile) {
      setFormError("Please select a primary cover image for the property.");
      return;
    }

    if (totalMediaBytes > MAX_PROJECT_MEDIA_BYTES) {
      setFormError(
        "Total media size for this project exceeds the 40MB limit. Please compress or remove images.",
      );
      return;
    }

    setSubmitting(true);
    const slug = isEdit ? editingProjectId! : generateSlug(name);

    try {
      let publicImageUrl = existingImageUrl || "";

      // 1. Upload main cover image if a new file was chosen
      if (imageFile) {
        setUploadProgress({ current: 1, total: 1 + galleryItems.length + (floorPlanFile ? 1 : 0), stage: "Uploading main cover image..." });
        
        const mainValidation = await detectFileFormat(imageFile);
        if (!mainValidation.isValid) {
          throw new Error(mainValidation.errorMessage || "Main image format is unsupported.");
        }

        const processedMain = await compressImageFile(imageFile);
        const mainContentType = getNormalizedContentType(processedMain, mainValidation.detectedMime);
        const mainExt = mainValidation.normalizedExt;
        const mainStoragePath = `properties/${slug}-${Date.now()}.${mainExt}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(mainStoragePath, processedMain, {
            contentType: mainContentType,
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Main image upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(mainStoragePath);
        publicImageUrl = publicUrlData.publicUrl;
      }

      // 2. Upload newly staged gallery images
      const newlyUploadedUrls: string[] = [];
      for (let i = 0; i < galleryItems.length; i++) {
        const item = galleryItems[i];
        const step = (imageFile ? 1 : 0) + i + 1;
        const totalSteps = (imageFile ? 1 : 0) + galleryItems.length + (floorPlanFile ? 1 : 0);

        setUploadProgress({
          current: step,
          total: totalSteps,
          stage: `Uploading gallery photo ${i + 1} of ${galleryItems.length} (${item.name})...`,
        });

        const validation = await detectFileFormat(item.file);
        if (!validation.isValid) {
          throw new Error(`File "${item.name}" rejected: ${validation.errorMessage}`);
        }

        const processedGFile = await compressImageFile(item.file);
        const gContentType = getNormalizedContentType(processedGFile, validation.detectedMime);
        const gExt = validation.normalizedExt;
        const gPath = `properties/${slug}-gallery-${Date.now()}-${i + 1}.${gExt}`;

        const { error: gUploadErr } = await supabase.storage
          .from("property-images")
          .upload(gPath, processedGFile, {
            contentType: gContentType,
            cacheControl: "3600",
            upsert: true,
          });

        if (gUploadErr) {
          throw new Error(`Gallery upload failed for "${item.name}": ${gUploadErr.message}`);
        }

        const { data: gUrlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(gPath);

        if (gUrlData?.publicUrl) {
          newlyUploadedUrls.push(gUrlData.publicUrl);
        }
      }

      // Combine existing images (if in edit mode) with newly uploaded images
      const finalGalleryUrls = isEdit
        ? [...existingGalleryUrls, ...newlyUploadedUrls]
        : newlyUploadedUrls;

      // 3. Upload floor plan image if provided
      let floorPlanUrl: string | null = existingFloorPlanUrl || null;
      if (floorPlanFile) {
        setUploadProgress({
          current: (imageFile ? 1 : 0) + galleryItems.length + 1,
          total: (imageFile ? 1 : 0) + galleryItems.length + 1,
          stage: "Uploading architectural floor plan...",
        });

        const fpValidation = await detectFileFormat(floorPlanFile);
        if (!fpValidation.isValid) {
          throw new Error(fpValidation.errorMessage || "Floor plan format is unsupported.");
        }

        const processedFpFile = await compressImageFile(floorPlanFile);
        const fpContentType = getNormalizedContentType(processedFpFile, fpValidation.detectedMime);
        const fpExt = fpValidation.normalizedExt;
        const fpPath = `properties/${slug}-floorplan-${Date.now()}.${fpExt}`;

        const { error: fpUploadErr } = await supabase.storage
          .from("property-images")
          .upload(fpPath, processedFpFile, {
            contentType: fpContentType,
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

      // 4. Construct payload (core columns + extended columns)
      const basePayload: Record<string, unknown> = {
        name: name.trim(),
        price: price.trim(),
        payment_plan: paymentPlan.trim(),
        area: area.trim(),
        developer: developer.trim(),
        image: publicImageUrl,
        gallery_urls: finalGalleryUrls,
        floor_plan_url: floorPlanUrl,
        location: location.trim() || null,
        completion_date: completionDate.trim() || null,
        construction_stage: constructionStage.trim() || null,
        status: status.trim() || null,
        type: type.trim() || null,
        structure: structure.trim() || null,
        description: description.trim() || null,
      };

      const extendedPayload = {
        ...basePayload,
        hero_video_url: heroVideoUrl.trim() || null,
        brochure_url: brochureUrl.trim() || null,
      };

      if (isEdit) {
        let updateResult = await supabase
          .from("projects")
          .update(extendedPayload)
          .eq("id", editingProjectId);

        if (updateResult.error && updateResult.error.message.includes("does not exist")) {
          updateResult = await supabase
            .from("projects")
            .update(basePayload)
            .eq("id", editingProjectId);
        }

        if (updateResult.error) {
          throw new Error(`Database update failed: ${updateResult.error.message}`);
        }

        setFormSuccess(`Successfully updated "${name}"!`);
        handleCancelEdit();
      } else {
        const insertExtended = { ...extendedPayload, id: slug };
        const insertBase = { ...basePayload, id: slug };

        let insertResult = await supabase.from("projects").insert([insertExtended]);

        if (insertResult.error && insertResult.error.message.includes("does not exist")) {
          insertResult = await supabase.from("projects").insert([insertBase]);
        }

        if (insertResult.error) {
          throw new Error(`Database insert failed: ${insertResult.error.message}`);
        }

        setFormSuccess(`Successfully published "${name}" to the catalog!`);
        handleCancelEdit();
      }

      await fetchProjects();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save project.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  }

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
      if (editingProjectId === id) {
        handleCancelEdit();
      }
      await fetchProjects();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete project.";
      setListMessage({ type: "error", text: msg });
    } finally {
      setDeleteIdInProgress(null);
    }
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } finally {
      router.replace("/admin/login");
    }
  }

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
                  GARDEN <span className="text-amber-500">CITY</span>
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
              href="/en/"
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
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-[0.28em] text-sky-400 uppercase">
            Portfolio Control Desk
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-extrabold text-white sm:text-4xl">
            Project Inventory & Media Management
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Publish new developments, manage presentations, edit details, and securely upload media
            assets (JPG, PNG, WebP) into Supabase Storage.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* SECTION A: Add / Edit Property Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      editingProjectId ? "bg-amber-500/15 text-amber-400" : "bg-sky-500/10 text-sky-400"
                    }`}
                  >
                    {editingProjectId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </div>
                  <div>
                    <h2 className="font-[family-name:var(--font-outfit)] text-lg sm:text-xl font-bold text-white">
                      {editingProjectId ? "Edit Property" : "Add New Property"}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {editingProjectId ? `Updating ID: ${editingProjectId}` : "Create a real estate listing in Supabase"}
                    </p>
                  </div>
                </div>

                {editingProjectId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>

              {/* Form Feedback Alerts */}
              {formError && (
                <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-red-500/30 bg-red-950/40 p-3.5 text-xs text-red-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <p className="flex-1">{formError}</p>
                </div>
              )}

              {validationWarning && (
                <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-950/40 p-3.5 text-xs text-amber-200">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <p className="flex-1">{validationWarning}</p>
                </div>
              )}

              {formSuccess && (
                <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 text-xs text-emerald-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <p>{formSuccess}</p>
                </div>
              )}

              {/* Real-time upload progress banner */}
              {uploadProgress && (
                <div className="mt-5 rounded-2xl border border-sky-500/30 bg-sky-950/40 p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-sky-300 mb-2">
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-400" />
                      <span>{uploadProgress.stage}</span>
                    </span>
                    <span className="font-mono">
                      {uploadProgress.current} / {uploadProgress.total}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-sky-400 transition-all duration-300"
                      style={{
                        width: `${Math.round((uploadProgress.current / uploadProgress.total) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitProject} className="mt-6 space-y-4">
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

                {/* Description Narrative */}
                <div>
                  <label
                    htmlFor="prop-desc"
                    className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                  >
                    Editorial Narrative / Overview
                  </label>
                  <textarea
                    id="prop-desc"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Comprehensive description of the development, architectural design, lifestyle and investment potential..."
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2 text-xs text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none"
                  />
                </div>

                {/* Project Media Storage Quota Bar */}
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

                  {isOverSizeLimit && (
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-red-500/30 bg-red-950/50 p-2.5 text-xs text-red-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                        <span>
                          Total image size exceeds 40MB limit. Auto-compress or select smaller images.
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
                </div>

                {/* 1. Primary Main Cover Image Upload (Strict accept & validation) */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="project-image-input"
                      className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                    >
                      Primary Main Cover Image *
                    </label>
                    <span className="text-[10px] text-sky-400/80 font-mono">JPG, PNG, WebP</span>
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
                              Click to replace cover
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center">
                          <Upload className="h-7 w-7 text-sky-400" />
                          <p className="mt-2 text-xs font-medium text-slate-300">
                            Upload main property cover photo
                          </p>
                          <p className="mt-0.5 text-[0.7rem] text-slate-500">
                            Supports JPG, JPEG, PNG, WebP
                          </p>
                        </div>
                      )}
                      <input
                        id="project-image-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* 2. Interactive Gallery Manager (Multiple Photos, Individual Removals, Staged Previews) */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <label className="block text-xs font-semibold tracking-wider text-slate-300 uppercase">
                        Property Gallery Slideshow
                      </label>
                      <p className="text-[11px] text-slate-400">
                        Select multiple high-resolution photos (JPG, PNG, WebP)
                      </p>
                    </div>

                    {galleryItems.length > 0 && (
                      <button
                        type="button"
                        onClick={handleRemoveAllGallery}
                        className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition"
                      >
                        Clear Staged ({galleryItems.length})
                      </button>
                    )}
                  </div>

                  {/* Existing Saved Gallery Images (if in edit mode) */}
                  {editingProjectId && existingGalleryUrls.length > 0 && (
                    <div className="mb-4 rounded-xl border border-white/10 bg-slate-900/60 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
                          Existing Saved Images ({existingGalleryUrls.length})
                        </span>
                        <span className="text-[10px] text-slate-400">Saved in Supabase</span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {existingGalleryUrls.map((url, idx) => (
                          <div
                            key={idx}
                            className="group relative h-20 w-full overflow-hidden rounded-lg border border-white/15 bg-slate-950"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt={`Existing gallery ${idx + 1}`}
                              className="h-full w-full object-cover"
                            />
                            {/* Individual Delete Button for Existing Photo */}
                            <button
                              type="button"
                              onClick={() => handleRemoveSingleExistingGalleryUrl(idx)}
                              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600/90 text-white shadow-md transition hover:bg-red-500"
                              title="Remove this image from project"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Staged New Gallery Images Grid */}
                  {galleryItems.length > 0 && (
                    <div className="mb-3 rounded-xl border border-sky-400/30 bg-sky-950/20 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold text-sky-300 uppercase tracking-wider">
                          New Images to Upload ({galleryItems.length})
                        </span>
                        <span className="text-[10px] text-sky-400 font-mono">
                          {(
                            galleryItems.reduce((acc, i) => acc + i.size, 0) /
                            (1024 * 1024)
                          ).toFixed(2)}{" "}
                          MB
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {galleryItems.map((item) => (
                          <div
                            key={item.id}
                            className="group relative flex flex-col overflow-hidden rounded-xl border border-white/15 bg-slate-900"
                          >
                            <div className="relative h-20 w-full overflow-hidden bg-slate-950">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.previewUrl}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                              {/* Format badge */}
                              <span className="absolute bottom-1 left-1 rounded bg-slate-950/80 px-1.5 py-0.5 text-[9px] font-bold text-sky-300 uppercase">
                                {item.format}
                              </span>
                              {/* Individual Remove Button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveSingleGalleryItem(item.id)}
                                className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950/80 text-red-400 border border-white/20 shadow-md transition hover:bg-red-600 hover:text-white"
                                title={`Remove ${item.name}`}
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <div className="p-1.5 bg-slate-950/90 text-[10px]">
                              <p className="truncate text-slate-200 font-medium">{item.name}</p>
                              <p className="text-slate-400 font-mono">
                                {(item.size / 1024).toFixed(0)} KB
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add / Upload Gallery Photos Trigger */}
                  <label
                    htmlFor="project-gallery-input"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 bg-slate-950/80 px-4 py-3 text-xs font-semibold text-slate-300 transition hover:border-sky-400 hover:text-white"
                  >
                    <UploadCloud className="h-4 w-4 text-sky-400" />
                    <span>
                      {galleryItems.length > 0 ? "Add More Photos" : "Choose Gallery Photos"}
                    </span>
                    <input
                      id="project-gallery-input"
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                      onChange={handleGalleryChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* 3. Floor Plan Architectural Blueprint Upload */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="project-floor-plan-input"
                      className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                    >
                      Architectural Floor Plan
                    </label>
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
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center">
                          <Ruler className="h-7 w-7 text-emerald-400" />
                          <p className="mt-2 text-xs font-medium text-slate-300">
                            Upload Blueprint / Floor Plan Drawing
                          </p>
                          <p className="mt-0.5 text-[0.7rem] text-slate-500">
                            Supports JPG, JPEG, PNG, WebP
                          </p>
                        </div>
                      )}
                      <input
                        id="project-floor-plan-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                        onChange={handleFloorPlanChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Multimedia & Document Links */}
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <p className="text-xs font-semibold tracking-wider text-sky-400 uppercase">
                    Multimedia & Document Links
                  </p>

                  <div>
                    <label htmlFor="prop-video" className="block text-[11px] font-medium text-slate-400 uppercase">
                      Hero Video URL (YouTube, Vimeo, or MP4)
                    </label>
                    <input
                      id="prop-video"
                      type="url"
                      value={heroVideoUrl}
                      onChange={(e) => setHeroVideoUrl(e.target.value)}
                      placeholder="e.g., https://www.youtube.com/watch?v=..."
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="prop-brochure" className="block text-[11px] font-medium text-slate-400 uppercase">
                      PDF Brochure URL
                    </label>
                    <input
                      id="prop-brochure"
                      type="url"
                      value={brochureUrl}
                      onChange={(e) => setBrochureUrl(e.target.value)}
                      placeholder="e.g., https://.../brochure.pdf"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Additional Metadata Grid */}
                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs font-semibold tracking-wider text-sky-400 uppercase mb-3">
                    Bento & Showcase Attributes
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
                        placeholder="e.g., Luxury Residential"
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
                      <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                      <span>{uploadProgress ? uploadProgress.stage : "Uploading & Saving..."}</span>
                    </>
                  ) : isCompressing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                      <span>Optimizing Media...</span>
                    </>
                  ) : editingProjectId ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Save Changes</span>
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

              {loadingProjects && projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
                  <p className="mt-3 text-xs text-slate-400">Loading properties from Supabase...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950 text-slate-500">
                    <ImageIcon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-[family-name:var(--font-outfit)] text-base font-semibold text-white">
                    No properties in the database yet
                  </h3>
                  <p className="mt-1 max-w-sm text-xs text-slate-400">
                    Use the form on the left to add your first property.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {projects.map((project) => (
                    <article
                      key={project.id}
                      className={`group flex flex-col gap-4 rounded-2xl border p-4 transition-all duration-200 sm:flex-row sm:items-center sm:gap-5 ${
                        editingProjectId === project.id
                          ? "border-amber-400/50 bg-amber-500/5"
                          : "border-white/10 bg-slate-950/60 hover:border-sky-400/30 hover:bg-slate-950"
                      }`}
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
                              <span>+{project.gallery_urls.length} gallery</span>
                            </span>
                          )}

                          {project.floor_plan_url && (
                            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[0.7rem] text-emerald-300">
                              <Ruler className="h-3 w-3 text-emerald-400" />
                              <span>Blueprint</span>
                            </span>
                          )}

                          <span className="text-[0.65rem] text-slate-500 truncate">
                            slug: {project.id}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-3 sm:border-0 sm:pt-0">
                        {/* Live Presentation View */}
                        <Link
                          href={`/en/projects/${project.id}/`}
                          target="_blank"
                          className="inline-flex items-center gap-1 rounded-xl border border-sky-400/30 bg-sky-500/10 px-2.5 py-1.5 text-xs font-semibold text-sky-300 hover:bg-sky-500/20 transition"
                          title="View live presentation page"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span className="hidden md:inline">View</span>
                        </Link>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleStartEdit(project)}
                          className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/15 transition"
                          title="Edit project"
                        >
                          <Edit className="h-3.5 w-3.5 text-amber-400" />
                          <span className="hidden md:inline">Edit</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteProject(project.id, project.name)}
                          disabled={deleteIdInProgress === project.id}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/20 px-2.5 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-900/40 hover:text-white disabled:pointer-events-none disabled:opacity-50"
                          title={`Delete ${project.name}`}
                        >
                          {deleteIdInProgress === project.id ? (
                            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-300 border-t-transparent" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                          )}
                          <span className="hidden md:inline">Delete</span>
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
