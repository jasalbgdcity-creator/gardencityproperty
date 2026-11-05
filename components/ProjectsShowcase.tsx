"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  RefreshCw,
  Ruler,
  Square,
  X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import { getProjectWhatsAppUrl } from "@/lib/whatsapp";

interface Project {
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
}

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function ProjectsShowcase() {
  const { language, dictionary } = useLanguage();
  const copy = dictionary.projects;

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Compute slide images for the modal
  const modalSlides: string[] = selectedProject
    ? selectedProject.gallery_urls && selectedProject.gallery_urls.length > 0
      ? Array.from(new Set([selectedProject.image, ...selectedProject.gallery_urls].filter(Boolean)))
      : [selectedProject.image].filter(Boolean)
    : [];

  // Automatic slideshow: transitions smoothly every 2 seconds
  useEffect(() => {
    if (!selectedProject || modalSlides.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % modalSlides.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedProject, modalSlides.length, isHovered]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      } else if (e.key === "ArrowLeft") {
        if (modalSlides.length > 1) {
          setCurrentSlide((prev) => (prev === 0 ? modalSlides.length - 1 : prev - 1));
        }
      } else if (e.key === "ArrowRight") {
        if (modalSlides.length > 1) {
          setCurrentSlide((prev) => (prev === modalSlides.length - 1 ? 0 : prev + 1));
        }
      }
    };
    if (selectedProject) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedProject, modalSlides.length]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const { data, error: fetchErr } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (ignore) return;

        if (fetchErr) {
          throw fetchErr;
        }

        if (data) {
          const mapped: Project[] = data.map((row: Record<string, unknown>) => ({
            id: String(row.id || ""),
            name: String(row.name || ""),
            price: String(row.price || ""),
            paymentPlan: String(row.payment_plan || row.paymentPlan || ""),
            area: String(row.area || row.site_area || ""),
            developer: String(row.developer || ""),
            image: String(row.image || ""),
            gallery_urls: Array.isArray(row.gallery_urls)
              ? (row.gallery_urls as string[])
              : Array.isArray(row.galleryUrls)
              ? (row.galleryUrls as string[])
              : [],
            floor_plan_url:
              (typeof row.floor_plan_url === "string" && row.floor_plan_url.trim()) ||
              (typeof row.floorplan_url === "string" && row.floorplan_url.trim()) ||
              (typeof row.floorPlanUrl === "string" && row.floorPlanUrl.trim()) ||
              (typeof row.floor_plan === "string" && row.floor_plan.trim()) ||
              (typeof row.floorplan === "string" && row.floorplan.trim()) ||
              undefined,
            location: typeof row.location === "string" ? row.location : undefined,
            completion_date: typeof row.completion_date === "string" ? row.completion_date : undefined,
            construction_stage: typeof row.construction_stage === "string" ? row.construction_stage : undefined,
            status: typeof row.status === "string" ? row.status : undefined,
            type: typeof row.type === "string" ? row.type : typeof row.property_type === "string" ? row.property_type : undefined,
            structure: typeof row.structure === "string" ? row.structure : undefined,
            description: row.description ? String(row.description) : undefined,
          }));
          setProjects(mapped);
        }
      } catch (err: unknown) {
        if (ignore) return;
        const msg =
          err instanceof Error ? err.message : copy.error || "Failed to load projects.";
        setError(msg);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [copy.error]);

  async function handleRetry() {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchErr) throw fetchErr;

      if (data) {
        const mapped: Project[] = data.map((row: Record<string, unknown>) => ({
          id: String(row.id || ""),
          name: String(row.name || ""),
          price: String(row.price || ""),
          paymentPlan: String(row.payment_plan || row.paymentPlan || ""),
          area: String(row.area || row.site_area || ""),
          developer: String(row.developer || ""),
          image: String(row.image || ""),
          gallery_urls: Array.isArray(row.gallery_urls)
            ? (row.gallery_urls as string[])
            : Array.isArray(row.galleryUrls)
            ? (row.galleryUrls as string[])
            : [],
          floor_plan_url:
            (typeof row.floor_plan_url === "string" && row.floor_plan_url.trim()) ||
            (typeof row.floorplan_url === "string" && row.floorplan_url.trim()) ||
            (typeof row.floorPlanUrl === "string" && row.floorPlanUrl.trim()) ||
            (typeof row.floor_plan === "string" && row.floor_plan.trim()) ||
            (typeof row.floorplan === "string" && row.floorplan.trim()) ||
            undefined,
          location: typeof row.location === "string" ? row.location : undefined,
          completion_date: typeof row.completion_date === "string" ? row.completion_date : undefined,
          construction_stage: typeof row.construction_stage === "string" ? row.construction_stage : undefined,
          status: typeof row.status === "string" ? row.status : undefined,
          type: typeof row.type === "string" ? row.type : typeof row.property_type === "string" ? row.property_type : undefined,
          structure: typeof row.structure === "string" ? row.structure : undefined,
          description: row.description ? String(row.description) : undefined,
        }));
        setProjects(mapped);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : copy.error || "Failed to load projects.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section id="projects" className="scroll-mt-24 border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.28em] text-sky-400 uppercase">
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl rtl:font-[family-name:var(--font-cairo)] rtl:tracking-normal rtl:font-bold">
            {language === "ar" ? (
              <>
                عرض <span className="text-amber-500">المشاريع</span>
              </>
            ) : (
              <>
                Showcase of Our <span className="text-amber-500">Projects</span>
              </>
            )}
          </h2>
          <p className="mt-4 text-slate-400">{copy.subtitle}</p>
        </div>

        {/* Loading Skeleton Grid */}
        {isLoading && (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="flex flex-col overflow-hidden rounded-xl border border-slate-700/60 bg-slate-800/60 shadow-lg animate-pulse"
              >
                {/* Image Skeleton */}
                <div className="h-[230px] w-full bg-slate-700/40" />

                {/* Card Body Skeleton */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="h-5 w-3/4 rounded bg-slate-700/60" />
                  <div className="mt-2 h-7 w-1/2 rounded bg-slate-700/80" />

                  <div className="mt-5 space-y-2.5">
                    <div className="h-3.5 w-4/5 rounded bg-slate-700/40" />
                    <div className="h-3.5 w-3/5 rounded bg-slate-700/40" />
                    <div className="h-3.5 w-2/3 rounded bg-slate-700/40" />
                  </div>

                  <div className="mt-6 flex items-center gap-2.5 pt-2">
                    <div className="h-10 flex-1 rounded-lg bg-slate-700/60" />
                    <div className="h-10 w-10 rounded-lg bg-slate-700/60" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-red-500/30 bg-red-950/30 p-8 text-center">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <h3 className="mt-3 font-[family-name:var(--font-outfit)] text-base font-semibold text-white">
              {copy.error}
            </h3>
            <p className="mt-1 text-xs text-red-200/80">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-900/40 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-800/60"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && projects.length === 0 && (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-900/40 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950 text-slate-500">
              <Building2 className="h-7 w-7 text-sky-400" />
            </div>
            <h3 className="mt-4 font-[family-name:var(--font-outfit)] text-base font-semibold text-white">
              {copy.empty}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              New property listings will appear here dynamically as they are published.
            </p>
          </div>
        )}

        {/* Dynamic Projects Grid */}
        {!isLoading && !error && projects.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const whatsappUrl = getProjectWhatsAppUrl({
                projectName: project.name,
                location: project.location,
                price: project.price,
                developer: project.developer,
                locale: language === "ar" ? "ar" : "en",
              });

              return (
                <article
                  key={project.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-slate-600 hover:shadow-2xl"
                >
                  {/* Project Image */}
                  <div className="relative h-[230px] w-full overflow-hidden bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image}
                      alt={`${project.name} - Luxury Property in Oman developed by ${project.developer}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Project Title (Gold/Amber) */}
                    <h3 className="font-serif text-lg font-medium text-amber-500 line-clamp-1 tracking-tight rtl:font-[family-name:var(--font-cairo)] rtl:tracking-normal rtl:font-bold">
                      {project.name}
                    </h3>

                    {/* Price (White, bold) */}
                    <p className="mt-1 text-2xl font-bold tracking-tight text-white">
                      {project.price}
                    </p>

                    {/* Details List */}
                    <ul className="mt-4 space-y-2 text-xs text-slate-400">
                      <li className="flex items-center gap-2">
                        <CalendarDays size={14} className="shrink-0 text-slate-400" />
                        <span className="truncate">
                          <span>{copy.paymentPlan}: </span>
                          <span className="font-medium text-slate-300">
                            {project.paymentPlan}
                          </span>
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Square size={14} className="shrink-0 text-slate-400" />
                        <span className="truncate">
                          <span>{copy.startingArea}: </span>
                          <span className="font-medium text-slate-300">
                            {project.area}
                          </span>
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Building2 size={14} className="shrink-0 text-slate-400" />
                        <span className="truncate">
                          <span>{copy.developer}: </span>
                          <span className="font-medium text-slate-300">
                            {project.developer}
                          </span>
                        </span>
                      </li>
                    </ul>

                    {/* Action Buttons: Primary + WhatsApp */}
                    <div className="mt-5 flex items-center gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProject(project);
                          setCurrentSlide(0);
                        }}
                        className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-white px-4 text-xs font-semibold text-slate-950 shadow-sm transition hover:bg-slate-200 active:scale-[0.99]"
                      >
                        {copy.getDetails}
                      </button>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${copy.whatsapp}: ${project.name}`}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-slate-950 shadow-sm transition hover:bg-slate-200 active:scale-[0.99]"
                      >
                        <WhatsAppIcon className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      {/* Quick View Bento-Box Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 md:p-6"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700/60 rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl relative max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Absolute Close Button */}
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/90 text-slate-400 transition hover:bg-slate-700 hover:text-white focus:outline-none shadow-md border border-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Bento Grid Two-Column Container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5 sm:p-7 lg:p-8">
              
              {/* LEFT COLUMN: Main Visual & Title */}
              <div className="flex flex-col justify-between">
                <div>
                  {/* Top Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-sky-300 uppercase">
                      {selectedProject.type || (language === "ar" ? "مشروع متميز" : "Prime Development")}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-300 uppercase">
                      {selectedProject.status || (language === "ar" ? "متاح للحجز" : "Available")}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white rtl:font-[family-name:var(--font-cairo)] rtl:tracking-normal">
                    {selectedProject.name}
                  </h3>

                  {/* Developer Subtitle */}
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <Building2 className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                    <span>{selectedProject.developer}</span>
                  </p>
                </div>

                {/* Main Visual Image (with automatic smooth slideshow support) */}
                <div
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="relative mt-4 h-72 sm:h-80 lg:h-[390px] w-full shrink-0 overflow-hidden rounded-2xl bg-slate-950 border border-white/10 shadow-lg select-none"
                >
                  {modalSlides.length > 0 ? (
                    modalSlides.map((slideUrl, idx) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={slideUrl + idx}
                        src={slideUrl}
                        alt={`${selectedProject.name} - View ${idx + 1}`}
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
                          idx === currentSlide
                            ? "opacity-100 z-10"
                            : "opacity-0 z-0 pointer-events-none"
                        }`}
                      />
                    ))
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.name}
                      className="h-full w-full object-cover"
                    />
                  )}

                  {/* Absolute White "Location" Badge Overlapping Bottom-Left */}
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-950 shadow-2xl backdrop-blur-md">
                    <MapPin className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>{selectedProject.location || "Muscat, Oman"}</span>
                  </div>

                  {/* Carousel Controls if multiple images exist */}
                  {modalSlides.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentSlide((prev) =>
                            prev === 0 ? modalSlides.length - 1 : prev - 1,
                          );
                        }}
                        aria-label="Previous photo"
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/70 text-white backdrop-blur-md transition hover:bg-slate-900 border border-white/10"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentSlide((prev) =>
                            prev === modalSlides.length - 1 ? 0 : prev + 1,
                          );
                        }}
                        aria-label="Next photo"
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/70 text-white backdrop-blur-md transition hover:bg-slate-900 border border-white/10"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <div className="absolute top-3 left-3 z-10 rounded-full bg-slate-950/80 px-2 py-0.5 text-[10px] font-semibold text-slate-200 backdrop-blur-md border border-white/10">
                        {currentSlide + 1} / {modalSlides.length}
                      </div>

                      {/* Dot Indicators */}
                      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5">
                        {modalSlides.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentSlide(idx);
                            }}
                            aria-label={`Go to slide ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              idx === currentSlide
                                ? "w-5 bg-amber-400"
                                : "w-1.5 bg-white/60 hover:bg-white"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Brief description */}
                <p className="mt-3 text-xs leading-relaxed text-slate-400 line-clamp-2">
                  {selectedProject.description ||
                    (language === "ar"
                      ? `فرصة استثمارية وسكنية متميزة من تطوير ${selectedProject.developer} بموقع استراتيجي في سلطنة عمان.`
                      : `Premium real estate opportunity developed by ${selectedProject.developer} in prime location across Oman.`)}
                </p>
              </div>

              {/* RIGHT COLUMN: Bento Grid Data */}
              <div className="flex flex-col justify-between gap-3.5">
                
                {/* 1. TOP ROW: Completion Date & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 backdrop-blur-md flex flex-col justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {language === "ar" ? "تاريخ الإنجاز" : "Completion Date"}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-sky-400 shrink-0" />
                      <p className="font-[family-name:var(--font-outfit)] text-base sm:text-lg font-bold text-white truncate">
                        {selectedProject.completion_date || "Q4 2026"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 backdrop-blur-md flex flex-col justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                      {language === "ar" ? "حالة المشروع" : "Status"}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <p className="font-[family-name:var(--font-outfit)] text-base sm:text-lg font-bold text-emerald-200 truncate">
                        {selectedProject.status || (language === "ar" ? "متاح للحجز" : "Available")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. MIDDLE SECTION: Bento Grid for Site Area, Construction Stage, Type, Structure */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Site Area Card */}
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5 flex flex-col justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {language === "ar" ? "المساحة" : "Site Area"}
                    </span>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Square className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                      <span className="font-[family-name:var(--font-outfit)] text-sm font-bold text-white truncate">
                        {selectedProject.area}
                      </span>
                    </div>
                  </div>

                  {/* Construction Stage Card (Highlighted solid orange accent) */}
                  <div className="rounded-2xl bg-amber-500 p-3.5 text-slate-950 shadow-[0_0_24px_rgba(245,158,11,0.25)] flex flex-col justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-950">
                      {language === "ar" ? "مرحلة البناء" : "Construction Stage"}
                    </span>
                    <p className="mt-1 font-[family-name:var(--font-outfit)] text-sm font-black text-slate-950 truncate">
                      {selectedProject.construction_stage || (language === "ar" ? "قيد الإنشاء" : "Under Construction")}
                    </p>
                  </div>

                  {/* Type Card */}
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5 flex flex-col justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {language === "ar" ? "النوع" : "Type"}
                    </span>
                    <p className="mt-1 font-[family-name:var(--font-outfit)] text-sm font-bold text-white truncate">
                      {selectedProject.type || (language === "ar" ? "سكني" : "Residential")}
                    </p>
                  </div>

                  {/* Structure Card */}
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5 flex flex-col justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {language === "ar" ? "الهيكل" : "Structure"}
                    </span>
                    <p className="mt-1 font-[family-name:var(--font-outfit)] text-sm font-bold text-white truncate">
                      {selectedProject.structure || "G + 2"}
                    </p>
                  </div>

                  {/* Developer Card */}
                  <div className="col-span-2 sm:col-span-2 rounded-2xl border border-white/10 bg-slate-950/60 p-3.5 flex flex-col justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {copy.developer}
                    </span>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                      <span className="font-[family-name:var(--font-outfit)] text-sm font-bold text-white truncate">
                        {selectedProject.developer}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. BOTTOM SECTION: Floor Plan Card (Floor Plan on left, Price & Details on right) */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur-md">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Floor Plan Visual */}
                    <div className="relative h-28 w-full sm:w-36 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-900 flex items-center justify-center group/fp">
                      {selectedProject.floor_plan_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={selectedProject.floor_plan_url}
                          alt="Floor Plan"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-3 text-center text-slate-500">
                          <Ruler className="h-6 w-6 text-emerald-400 mb-1" />
                          <span className="text-[10px] font-medium text-slate-400">
                            {language === "ar" ? "مخطط الطابق" : "Floor Plan"}
                          </span>
                        </div>
                      )}
                      <span className="absolute bottom-1 right-1 rounded bg-slate-950/85 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-300 backdrop-blur-sm border border-emerald-500/20">
                        {language === "ar" ? "مخطط الطابق" : "Floor Plan"}
                      </span>
                    </div>

                    {/* Price & Specs */}
                    <div className="flex-1 w-full flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                          {language === "ar" ? "السعر الابتدائي" : "Starting Price"}
                        </span>
                        <p className="font-[family-name:var(--font-outfit)] text-2xl sm:text-3xl font-extrabold text-amber-400">
                          {selectedProject.price}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center gap-2.5 text-xs text-slate-300">
                        <span className="inline-flex items-center gap-1">
                          <Square className="h-3 w-3 text-sky-400" />
                          <span>{selectedProject.area}</span>
                        </span>
                        <span className="text-slate-600">•</span>
                        <span>{selectedProject.paymentPlan}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action CTA Buttons: Transition to Dedicated Page & WhatsApp */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    href={`/${language}/projects/${selectedProject.id}/`}
                    className="flex w-full sm:flex-1 items-center justify-center gap-2 rounded-xl border border-sky-400/40 bg-sky-500/10 px-5 py-3.5 text-xs sm:text-sm font-semibold text-sky-300 backdrop-blur-md transition hover:border-sky-300/70 hover:bg-sky-500/20 active:scale-[0.99]"
                  >
                    <span>
                      {copy.viewFullPage ||
                        (language === "ar" ? "عرض كامل التفاصيل" : "View Full Details")}
                    </span>
                    <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                  </Link>
                  <a
                    href={getProjectWhatsAppUrl({
                      projectName: selectedProject.name,
                      location: selectedProject.location,
                      price: selectedProject.price,
                      developer: selectedProject.developer,
                      locale: language === "ar" ? "ar" : "en",
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full sm:flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-xs sm:text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(16,185,129,0.35)] transition hover:bg-emerald-400 active:scale-[0.99]"
                  >
                    <WhatsAppIcon className="h-5 w-5 fill-slate-950" />
                    <span>
                      {language === "ar"
                        ? "تسجيل الاهتمام"
                        : "Register Interest"}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </section>
  );
}
