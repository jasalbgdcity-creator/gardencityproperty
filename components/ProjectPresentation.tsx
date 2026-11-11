"use client";

import { useState, useEffect, useCallback, useId, useMemo, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import PropertyImage from "@/components/PropertyImage";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Layers,
  MapPin,
  Phone,
  Ruler,
  Square,
  ArrowLeft,
  ArrowRight,
  Share2,
  Play,
  Maximize2,
  X,
  ShieldCheck,
  Sparkles,
  Car,
  Trees,
  Dumbbell,
  Waves,
  Compass,
  Clock,
  Coins,
  Percent,
  BedDouble,
  Bath,
  ExternalLink,
  Send,
  Landmark,
  Eye,
  Star,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  Languages,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { parseVideoUrl } from "@/lib/video";
import { YouTubeIcon, VimeoIcon } from "@/components/VideoIcons";
import {
  getProjectWhatsAppUrl,
  getConfigurationWhatsAppUrl,
  getGeneralWhatsAppUrl,
} from "@/lib/whatsapp";
import { renderAmenityIcon, renderMilestoneIcon } from "@/lib/projectIcons";
import AnimatedCounter from "@/components/AnimatedCounter";
import { toDirectDriveImageUrl, isGoogleDriveUrl } from "@/lib/projects";
import {
  hasArabicText,
  localizeToArabic,
  localizeField,
  localizeDeveloper,
  localizeProjectName,
  localizePropertyType,
  localizeStatus,
  localizePaymentPlan,
  localizeConstructionStage,
  localizeLocation,
} from "@/lib/localization";
import CountryCodeSelector from "@/components/CountryCodeSelector";

export interface PropertyConfiguration {
  id?: string;
  property_type?: string;
  type?: string;
  name?: string;
  title?: string;
  name_ar?: string;
  titleAr?: string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  balconies?: number | string;
  bua?: string;
  bua_sqm?: number | string;
  plot?: string;
  plot_sqm?: number | string;
  price?: string;
  currency?: string;
  availability?: string;
  availability_status?: string;
  furnishing?: string;
  furnishing_status?: string;
  parking?: string;
  parking_info?: string;
  features?: string[];
  floorPlanUrl?: string;
  floor_plan_url?: string;
  image_url?: string;
  images?: string[];
  description?: string;
  descriptionAr?: string;
  description_ar?: string;
  is_featured?: boolean;
}

export interface AmenityItem {
  id?: string;
  icon?: string;
  name: string;
  nameAr?: string;
  name_ar?: string;
  description?: string;
  descriptionAr?: string;
  description_ar?: string;
  category?: string;
  image_url?: string;
  display_order?: number;
  is_published?: boolean;
  is_active?: boolean;
}

export interface PaymentMilestone {
  id?: string;
  step_number?: number | string;
  title: string;
  title_ar?: string;
  titleAr?: string;
  percentage: string;
  description: string;
  description_ar?: string;
  descriptionAr?: string;
  detailed_description?: string;
  icon?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface NearbyLocation {
  id?: string;
  name: string;
  nameAr?: string;
  name_ar?: string;
  time?: string;
  timeAr?: string;
  travel_time_text?: string;
  travel_time_minutes?: number;
  category?: string;
  distance_km?: number | string;
  google_maps_url?: string;
}

export interface ProjectData {
  id: string;
  name: string;
  name_ar?: string;
  nameAr?: string;
  price?: string;
  payment_plan?: string;
  paymentPlan?: string;
  payment_plan_ar?: string;
  area?: string;
  site_area?: string;
  developer?: string;
  developer_ar?: string;
  image: string;
  gallery_urls?: string[];
  galleryUrls?: string[];
  floor_plan_url?: string;
  floorPlanUrl?: string;
  location?: string;
  location_ar?: string;
  completion_date?: string;
  completionDate?: string;
  construction_stage?: string;
  constructionStage?: string;
  construction_stage_ar?: string;
  status?: string;
  status_ar?: string;
  type?: string;
  type_ar?: string;
  property_type?: string;
  structure?: string;
  structure_ar?: string;
  description?: string;
  description_ar?: string;
  descriptionAr?: string;
  whatsapp_number?: string;
  hero_video_url?: string;
  brochure_url?: string;
  google_maps_url?: string;
  formatted_address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  amenities_enabled?: boolean;
  amenities_label?: string;
  amenities_label_ar?: string;
  amenities_heading?: string;
  amenities_heading_ar?: string;
  amenities_subtitle?: string;
  amenities_subtitle_ar?: string;
  amenities?: (AmenityItem | string)[];
  investment_enabled?: boolean;
  investment_label?: string;
  investment_label_ar?: string;
  investment_heading?: string;
  investment_heading_ar?: string;
  investment_subtitle?: string;
  investment_subtitle_ar?: string;
  payment_milestones?: PaymentMilestone[];
  mortgage_enabled?: boolean;
  mortgage_title?: string;
  mortgage_title_ar?: string;
  mortgage_status?: string;
  mortgage_status_ar?: string;
  mortgage_description?: string;
  mortgage_description_ar?: string;
  mortgage_banks?: string;
  mortgage_additional_info?: string;
  mortgage_display_order?: number;
  property_configurations?: PropertyConfiguration[];
  nearby_locations?: NearbyLocation[];
  property_highlights?: Array<{ label: string; labelAr?: string; value: string; icon?: string }>;
}

interface ProjectPresentationProps {
  project: ProjectData;
  relatedProjects: ProjectData[];
  locale: string;
}

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function ProjectPresentation({
  project,
  relatedProjects,
  locale,
}: ProjectPresentationProps) {
  const isAr = locale === "ar";
  const { dictionary } = useLanguage();
  const copy = dictionary.projects;

  // Unified specs & safe fallbacks with bilingual resolution and dictionary mapping
  const title = localizeProjectName(project.name, project.name_ar || project.nameAr, locale);

  const developer = localizeDeveloper(project.developer, project.developer_ar, locale);

  const price = isAr
    ? (project.price ? localizeToArabic(project.price, "السعر عند الطلب") : "السعر عند الطلب")
    : project.price || "Price on Application";

  const paymentPlan = localizePaymentPlan(
    project.payment_plan || project.paymentPlan,
    project.payment_plan_ar,
    locale
  );

  const area = isAr
    ? (project.area ? localizeToArabic(project.area, "تبدأ من 85 م²") : "تبدأ من 85 م²")
    : project.area || "From 85 m²";

  const location = localizeLocation(project.location, project.location_ar, locale);

  const completionDate = isAr
    ? localizeToArabic(project.completion_date || project.completionDate, "الربع الرابع 2026")
    : project.completion_date || project.completionDate || "Q4 2026";

  const constructionStage = localizeConstructionStage(
    project.construction_stage || project.constructionStage,
    project.construction_stage_ar,
    locale
  );

  const status = localizeStatus(project.status, project.status_ar, locale);

  const type = localizePropertyType(project.type || project.property_type, project.type_ar, locale);

  const structure = (isAr && project.structure_ar)
    ? project.structure_ar
    : isAr
    ? localizeToArabic(project.structure, "تشطيبات عصرية بمعايير عالمية فاخرة")
    : project.structure || "Contemporary Luxury Architectural Finishes";

  const rawFloorPlanUrl = project.floor_plan_url || project.floorPlanUrl;
  const floorPlanUrl = rawFloorPlanUrl ? toDirectDriveImageUrl(rawFloorPlanUrl) : undefined;

  // Full unified gallery
  const gallery: string[] = Array.from(
    new Set([project.image, ...(project.gallery_urls || project.galleryUrls || [])].filter(Boolean))
  );

  // Fallback / default configurations tailored to luxury Oman developments
  const defaultConfigurations: PropertyConfiguration[] = [
    {
      id: "conf-1",
      type: "1-Bedroom",
      title: "1-Bedroom Executive Residence",
      titleAr: "شقة تنفيذية غرفة وصالة فاخرة",
      bedrooms: 1,
      bathrooms: 2,
      bua: "78 m² (840 sq ft)",
      price: price,
      floorPlanUrl: floorPlanUrl || gallery[0],
      description: "Smart layout featuring floor-to-ceiling glass, en-suite master bedroom, powder room, and private sun balcony.",
      descriptionAr: "تصميم ذكي يتضمن واجهات زجاجية واسعة، غرفة ماستر مع حمام داخلي، حمام ضيوف، وشرفة بإطلالة ساحرة.",
    },
    {
      id: "conf-2",
      type: "2-Bedroom",
      title: "2-Bedroom Premium Suite",
      titleAr: "شقة عائلية غرفتين وصالة فاخرة",
      bedrooms: 2,
      bathrooms: 3,
      bua: "128 m² (1,377 sq ft)",
      price: isAr ? `ابتداءً من ${price}` : `From ${price}`,
      floorPlanUrl: floorPlanUrl || gallery[0],
      description: "Generous living and dining zones, bespoke Italian fitted kitchen, two en-suite bedrooms, and dedicated utility room.",
      descriptionAr: "مساحات معيشة واستقبال رحبة، مطبخ مجهز بتصاميم إيطالية راقية، غرفتي نوم بحمامات مستقلة، وغرفة غسيل.",
    },
    {
      id: "conf-3",
      type: "3-Bedroom",
      title: "3-Bedroom Horizon Sky Residence",
      titleAr: "شقة سكاي هورايزون 3 غرف وصالة",
      bedrooms: 3,
      bathrooms: 4,
      bua: "192 m² (2,066 sq ft)",
      price: isAr ? "عروض حصرية عند الطلب" : "Exclusive on Application",
      floorPlanUrl: floorPlanUrl || gallery[0],
      description: "Panoramic double-aspect corner views, maid's quarters with en-suite, expansive entertaining terrace, and dual parking spaces.",
      descriptionAr: "إطلالات بانورامية زاوية مزدوجة، غرفة مساعدة مع حمام، تراس ترفيهي فسيح، وموقفان مخصصان للسيارات.",
    },
    {
      id: "conf-4",
      type: "Townhouse/Villa",
      title: "4-Bedroom Signature Townhouse",
      titleAr: "تاون هاوس مستقل 4 غرف نوم",
      bedrooms: 4,
      bathrooms: 5,
      bua: "315 m² (3,390 sq ft)",
      plot: "360 m² (3,875 sq ft)",
      price: isAr ? "تواصل للاطلاع على السعر" : "Inquire for Pricing",
      floorPlanUrl: floorPlanUrl || gallery[0],
      description: "Multi-level private residence featuring landscaped private garden, rooftop entertainment terrace, private lift provision, and two-car garage.",
      descriptionAr: "مسكن مستقل متعدد المستويات بحديقة خاصة منسقة، تراس علوي للجلسات العائلية، وتجهيز لمصعد داخلي وموقف مغطى لسيارتين.",
    },
  ];

  const configurations =
    Array.isArray(project.property_configurations) && project.property_configurations.length > 0
      ? project.property_configurations
      : defaultConfigurations;

  // Selected configuration state
  const [selectedConfIndex, setSelectedConfIndex] = useState(0);
  const activeConf = configurations[selectedConfIndex] || configurations[0];

  // Configuration Detail Modal & Filter state
  const [selectedConfigModal, setSelectedConfigModal] = useState<PropertyConfiguration | null>(null);
  const [configModalTab, setConfigModalTab] = useState<"photos" | "floorplan">("photos");
  const [configModalPhotoIndex, setConfigModalPhotoIndex] = useState(0);
  const [configFilterType, setConfigFilterType] = useState<string>("All");
  const [modalFloorPlanError, setModalFloorPlanError] = useState(false);

  const openConfigModal = useCallback((conf: PropertyConfiguration) => {
    setSelectedConfigModal(conf);
    setConfigModalTab("photos");
    setConfigModalPhotoIndex(0);
    setModalFloorPlanError(false);
  }, []);

  const closeConfigModal = useCallback(() => {
    setSelectedConfigModal(null);
    setModalFloorPlanError(false);
  }, []);

  const configurationTypes = useMemo(() => {
    const set = new Set<string>();
    configurations.forEach((c) => {
      const t = c.property_type || c.type;
      if (t) set.add(t);
    });
    return Array.from(set);
  }, [configurations]);

  const filteredConfigurations = useMemo(() => {
    if (configFilterType === "All") return configurations;
    return configurations.filter((c) => (c.property_type || c.type) === configFilterType);
  }, [configurations, configFilterType]);

  const getConfigCoverImage = useCallback(
    (conf: PropertyConfiguration): string => {
      if (conf.image_url) return toDirectDriveImageUrl(conf.image_url);
      if (Array.isArray(conf.images) && conf.images.length > 0 && conf.images[0]) {
        return toDirectDriveImageUrl(conf.images[0]);
      }
      if (conf.floor_plan_url || conf.floorPlanUrl) {
        return toDirectDriveImageUrl(conf.floor_plan_url || conf.floorPlanUrl!);
      }
      return gallery[0] || project.image || "";
    },
    [gallery, project.image]
  );

  const getConfigGalleryPhotos = useCallback(
    (conf: PropertyConfiguration): string[] => {
      const photos: string[] = [];
      if (conf.image_url) {
        const cleaned = toDirectDriveImageUrl(conf.image_url);
        if (cleaned) photos.push(cleaned);
      }
      if (Array.isArray(conf.images)) {
        conf.images.forEach((img) => {
          const cleaned = toDirectDriveImageUrl(img);
          if (cleaned && !photos.includes(cleaned)) photos.push(cleaned);
        });
      }
      if (photos.length === 0) {
        if (gallery[0]) photos.push(gallery[0]);
        else if (project.image) photos.push(project.image);
      }
      return photos;
    },
    [gallery, project.image]
  );

  // Lightbox Modal state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prevLightboxImage = useCallback(() => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : gallery.length - 1));
  }, [gallery.length]);

  const nextLightboxImage = useCallback(() => {
    setLightboxIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : 0));
  }, [gallery.length]);

  // Floor plan enlarged preview modal state
  const [floorPlanModalOpen, setFloorPlanModalOpen] = useState(false);

  // Keyboard navigation for Lightbox and Modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedConfigModal) closeConfigModal();
        if (lightboxOpen) closeLightbox();
        if (floorPlanModalOpen) setFloorPlanModalOpen(false);
      }
      if (lightboxOpen) {
        if (e.key === "ArrowLeft") {
          if (isAr) nextLightboxImage();
          else prevLightboxImage();
        }
        if (e.key === "ArrowRight") {
          if (isAr) prevLightboxImage();
          else nextLightboxImage();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, selectedConfigModal, floorPlanModalOpen, isAr, closeConfigModal, prevLightboxImage, nextLightboxImage]);

  // Video player state & parsed video info
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [videoKey, setVideoKey] = useState(0);
  const videoUrl = project.hero_video_url;
  const parsedVideo = useMemo(() => parseVideoUrl(videoUrl), [videoUrl]);

  // Handle video loading timeout (e.g., 8 seconds if iframe hangs or connection is throttled)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (videoPlaying && videoLoading && !videoError) {
      timer = setTimeout(() => {
        // Dismiss loading spinner so user isn't stuck waiting indefinitely
        setVideoLoading(false);
      }, 8000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [videoPlaying, videoLoading, videoError, videoKey]);

  const handleStartVideo = () => {
    if (parsedVideo.isValid || videoUrl) {
      setVideoPlaying(true);
      setVideoLoading(true);
      setVideoError(false);
    } else {
      window.open(
        getWhatsAppInquiryUrl(
          isAr
            ? `مرحباً، أود طلب جولة افتراضية مسجلة بالفيديو لمشروع ${title}`
            : `Hello, I would like to request the virtual video walkthrough for ${title}`
        ),
        "_blank"
      );
    }
  };

  const handleRetryVideo = () => {
    setVideoLoading(true);
    setVideoError(false);
    setVideoKey((prev) => prev + 1);
  };

  // Form state
  const [enquiryConfig, setEnquiryConfig] = useState<string>(
    (activeConf
      ? isAr
        ? activeConf.name_ar || activeConf.titleAr || activeConf.name || activeConf.title
        : activeConf.name || activeConf.title
      : "") || ""
  );
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [inquiryCountryCode, setInquiryCountryCode] = useState("+968");

  // Brochure modal / feedback
  const [brochureRequested, setBrochureRequested] = useState(false);

  // Collapsible toggle for raw English overview text when viewing Arabic route
  const [showEnglishOverview, setShowEnglishOverview] = useState(false);

  // WhatsApp inquiry URL generator using centralized standard helper
  const getWhatsAppInquiryUrl = (customText?: string) => {
    if (customText) {
      return getGeneralWhatsAppUrl({
        message: customText,
        whatsapp_number: project.whatsapp_number,
      });
    }
    return getProjectWhatsAppUrl({
      projectName: title,
      location: location,
      startingPrice: price,
      developer: developer,
      whatsapp_number: project.whatsapp_number,
      language: isAr ? "ar" : "en",
    });
  };

  const getConfWhatsAppUrl = (conf: PropertyConfiguration) => {
    const confName = isAr
      ? conf.name_ar || conf.titleAr || conf.name || conf.title || "وحدة سكنية"
      : conf.name || conf.title || "Residential Unit";
    const confPrice = conf.price || price;
    const confBua = conf.bua_sqm || conf.bua || "";
    return getConfigurationWhatsAppUrl({
      projectName: title,
      propertyType: conf.property_type || conf.type,
      configurationName: confName,
      bedrooms: conf.bedrooms,
      bua: confBua,
      price: confPrice,
      whatsapp_number: project.whatsapp_number,
      language: isAr ? "ar" : "en",
    });
  };

  // Scroll to section helper
  const scrollToEnquiry = (confTitle?: string) => {
    if (confTitle) {
      setEnquiryConfig(confTitle);
    }
    const element = document.getElementById("project-enquiry-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle Enquiry Form Submit (Web3Forms)
  async function handleEnquirySubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormStatus(null);
    setFormSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const clientName = String(formData.get("name") || "").trim();
    const clientEmail = String(formData.get("email") || "").trim();
    const rawClientPhone = String(formData.get("phone") || "").trim();
    const selectedCountryCode = String(formData.get("country_code") || inquiryCountryCode).trim();
    const clientPhone = rawClientPhone.startsWith("+") ? rawClientPhone : `${selectedCountryCode} ${rawClientPhone}`;
    const preferredMethod = String(formData.get("preferred_method") || "WhatsApp").trim();
    const message = String(formData.get("message") || "").trim();

    const accessKey =
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "fc593170-cd44-4fa4-a69b-20a1d29a08ca";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          from_name: "Garden City Properties — Project Portal",
          subject: `New Development Enquiry: ${title} (${enquiryConfig || "General"}) from ${clientName}`,
          message: `Project: ${title} (ID: ${project.id})
Location: ${location}
Selected Configuration: ${enquiryConfig}
Preferred Contact: ${preferredMethod}
Client Note: ${message}`,
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Failed to submit enquiry.");
      }

      setFormStatus({
        type: "success",
        text: isAr
          ? "شكراً لتواصلك معنا. تم استلام استفسارك بنجاح وسيتواصل معك مستشارنا المختص خلال وقت وجيز."
          : "Thank you for registering your interest. Our real estate advisory desk will reach out shortly.",
      });
      form.reset();
    } catch (err: unknown) {
      setFormStatus({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : isAr
            ? "تعذر إرسال الاستفسار. يرجى المحاولة لاحقاً أو مراسلتنا مباشرة عبر واتساب."
            : "Failed to send enquiry. Please contact our desk directly via WhatsApp.",
      });
    } finally {
      setFormSubmitting(false);
    }
  }

  // Fallback default amenities
  const defaultAmenities: AmenityItem[] = [
    {
      icon: "Waves",
      name: "Infinity Edge Swimming Pool",
      nameAr: "مسبح إنفينيتي بإطلالة بانورامية",
      description: "Temperature-controlled swimming pool with dedicated resort-style sun deck.",
      descriptionAr: "مسبح يتم التحكم في درجة حرارته مع تراس استجمام شمسي على الطراز الفندقي.",
      is_active: true,
      display_order: 1,
    },
    {
      icon: "Dumbbell",
      name: "State-of-the-Art Fitness Center",
      nameAr: "صالة لياقة بدنية ونادٍ صحي متكامل",
      description: "Equipped with high-end cardio and strength machinery with personal trainer suites.",
      descriptionAr: "مجهزة بأحدث أجهزة تمارين اللياقة والقوة مع غرف تدريب متخصصة.",
      is_active: true,
      display_order: 2,
    },
    {
      icon: "Trees",
      name: "Landscaped Parks & Jogging Track",
      nameAr: "حدائق خضراء ومسارات مشي وركض",
      description: "Lush botanical gardens, shaded walking promenades, and serene open-air pavilions.",
      descriptionAr: "حدائق نباتية غناء ومسارات مشي مظللة وجلسات خارجية هادئة.",
      is_active: true,
      display_order: 3,
    },
    {
      icon: "ShieldCheck",
      name: "24/7 Gated Security & Concierge",
      nameAr: "أمن وحراسة على مدار الساعة وخدمة استقبال",
      description: "Access-controlled entry gates, AI-enhanced surveillance, and round-the-clock reception.",
      descriptionAr: "بوابات دخول ذكية، كاميرات مراقبة متطورة، وخدمة استقبال وضيافة على مدار الساعة.",
      is_active: true,
      display_order: 4,
    },
    {
      icon: "Car",
      name: "Covered Parking & EV Charging",
      nameAr: "مواقف سيارات مظللة وشواحن كهربائية",
      description: "Secured private basement parking with dedicated high-speed EV charging stations.",
      descriptionAr: "مواقف خاصة آمنة ومظللة مع محطات شحن سريعة للسيارات الكهربائية.",
      is_active: true,
      display_order: 5,
    },
    {
      icon: "Building2",
      name: "Boutique Retail & Dining Promenade",
      nameAr: "ممشى تجاري ومطاعم ومقاهٍ راقية",
      description: "Curated collection of artisan cafes, specialty grocery, and essential everyday conveniences.",
      descriptionAr: "تشكيلة مختارة من المقاهي العصرية ومنافذ التسوق والمرافق الخدمية اليومية.",
      is_active: true,
      display_order: 6,
    },
    {
      icon: "Sparkles",
      name: "Children's Adventure Play Zone",
      nameAr: "منطقة ألعاب آمنة وممتعة للأطفال",
      description: "Modern, secure outdoor and indoor play areas crafted with child-safe rubberized flooring.",
      descriptionAr: "مساحات ألعاب تفاعلية داخلية وخارجية صممت بأعلى معايير الأمان والسلامة.",
      is_active: true,
      display_order: 7,
    },
    {
      icon: "Compass",
      name: "Executive Lounge & Business Hub",
      nameAr: "صالة رجال الأعمال ومركز عمل متطور",
      description: "Quiet work lounges, private meeting rooms, and high-speed Wi-Fi infrastructure.",
      descriptionAr: "مساحات عمل مريحة وهادئة وغرف اجتماعات خاصة مجهزة ببنية اتصالات فائقة السرعة.",
      is_active: true,
      display_order: 8,
    },
  ];

  // Normalized amenities list supporting both rich objects and legacy string arrays
  const amenitiesList: AmenityItem[] = useMemo(() => {
    if (!Array.isArray(project.amenities) || project.amenities.length === 0) {
      return defaultAmenities;
    }
    return project.amenities
      .map((item, idx) => {
        if (typeof item === "string") {
          const str = item.trim();
          let icon = "Sparkles";
          const lower = str.toLowerCase();
          if (lower.includes("pool") || lower.includes("water") || lower.includes("مسبح") || lower.includes("سباح")) icon = "Waves";
          else if (lower.includes("gym") || lower.includes("fitness") || lower.includes("رياض") || lower.includes("لياق")) icon = "Dumbbell";
          else if (lower.includes("park") || lower.includes("garden") || lower.includes("حديق") || lower.includes("شجر") || lower.includes("ممشى")) icon = "Trees";
          else if (lower.includes("security") || lower.includes("guard") || lower.includes("أمن") || lower.includes("حراس")) icon = "ShieldCheck";
          else if (lower.includes("car") || lower.includes("park") || lower.includes("موقف") || lower.includes("سيار")) icon = "Car";
          else if (lower.includes("retail") || lower.includes("shop") || lower.includes("تسوق") || lower.includes("تجاري")) icon = "ShoppingBag";
          else if (lower.includes("cafe") || lower.includes("coffee") || lower.includes("مقه")) icon = "Coffee";
          else if (lower.includes("dine") || lower.includes("restaurant") || lower.includes("مطعم")) icon = "Utensils";
          else if (lower.includes("kid") || lower.includes("play") || lower.includes("طفل") || lower.includes("أطفال")) icon = "Baby";
          else if (lower.includes("smart") || lower.includes("home") || lower.includes("منزل") || lower.includes("ذكي")) icon = "Home";
          else if (lower.includes("beach") || lower.includes("sun") || lower.includes("شاطئ") || lower.includes("بحر")) icon = "Sun";
          else if (lower.includes("lounge") || lower.includes("business") || lower.includes("أعمال")) icon = "Building2";

          return {
            id: `legacy-${idx}`,
            name: str,
            nameAr: str,
            name_ar: str,
            description: isAr
              ? "مرفق سكني حصري مصمم لراحة ورفاهية الملاك والسكان بأعلى المعايير."
              : "Exclusive lifestyle facility designed for premium resident comfort and leisure.",
            descriptionAr: "مرفق سكني حصري مصمم لراحة ورفاهية الملاك والسكان بأعلى المعايير.",
            description_ar: "مرفق سكني حصري مصمم لراحة ورفاهية الملاك والسكان بأعلى المعايير.",
            icon: icon,
            is_active: true,
            display_order: idx + 1,
          };
        }
        return item;
      })
      .filter((item) => item && item.is_active !== false)
      .sort((a, b) => (Number(a.display_order) || 0) - (Number(b.display_order) || 0));
  }, [project.amenities, isAr]);

  // Fallback default milestones
  const defaultMilestones: PaymentMilestone[] = [
    {
      id: "ms-1",
      step_number: "01",
      title: "Down Payment",
      titleAr: "الدفعة الأولى",
      title_ar: "الدفعة الأولى",
      percentage: "10% - 20%",
      description: "Upon reservation and initial booking agreement confirmation",
      descriptionAr: "عند حجز الوحدة وتأكيد العقد المبدئي",
      description_ar: "عند حجز الوحدة وتأكيد العقد المبدئي",
      icon: "Coins",
      display_order: 1,
      is_active: true,
    },
    {
      id: "ms-2",
      step_number: "02",
      title: "Construction Linked",
      titleAr: "أثناء البناء",
      title_ar: "أثناء البناء",
      percentage: "30% - 40%",
      description: "Installments tied to verified construction progress milestones",
      descriptionAr: "أقساط موزعة وفق مراحل إنجاز البناء المعتمدة رسمياً",
      description_ar: "أقساط موزعة وفق مراحل إنجاز البناء المعتمدة رسمياً",
      icon: "Building2",
      display_order: 2,
      is_active: true,
    },
    {
      id: "ms-3",
      step_number: "03",
      title: "Handover Completion",
      titleAr: "عند الاستلام",
      title_ar: "عند الاستلام",
      percentage: "40% - 50%",
      description: "Upon final project handover, quality inspection and key delivery",
      descriptionAr: "عند إنجاز المشروع، المعاينة الفنية واستلام المفاتيح",
      description_ar: "عند إنجاز المشروع، المعاينة الفنية واستلام المفاتيح",
      icon: "KeyRound",
      display_order: 3,
      is_active: true,
    },
  ];

  // Normalized milestones list - returns empty array if no milestones configured, avoiding data fabrication
  const milestonesList: PaymentMilestone[] = useMemo(() => {
    if (!Array.isArray(project.payment_milestones) || project.payment_milestones.length === 0) {
      return [];
    }
    return project.payment_milestones
      .filter((m) => m && m.is_active !== false)
      .sort((a, b) => (Number(a.display_order) || 0) - (Number(b.display_order) || 0));
  }, [project.payment_milestones]);

  // Nearby landmarks
  const nearbyLandmarks: NearbyLocation[] =
    Array.isArray(project.nearby_locations) && project.nearby_locations.length > 0
      ? project.nearby_locations
      : [
          {
            name: "Muscat International Airport",
            nameAr: "مطار مسقط الدولي",
            time: "15 - 20 Mins",
            timeAr: "15 - 20 دقيقة",
            category: "Transit",
          },
          {
            name: "Mall of Oman / City Centre",
            nameAr: "مول عمان وسيتي سنتر",
            time: "10 - 12 Mins",
            timeAr: "10 - 12 دقيقة",
            category: "Retail",
          },
          {
            name: "Sultan Qaboos Grand Mosque",
            nameAr: "جامع السلطان قابوس الأكبر",
            time: "12 Mins",
            timeAr: "12 دقيقة",
            category: "Heritage",
          },
          {
            name: "Qurum Beach & Royal Opera House",
            nameAr: "شاطئ القرم ودار الأوبرا السلطانية",
            time: "18 Mins",
            timeAr: "18 دقيقة",
            category: "Lifestyle",
          },
          {
            name: "Leading International Schools & Clinics",
            nameAr: "أبرز المدارس الدولية والمراكز الطبية",
            time: "5 - 8 Mins",
            timeAr: "5 - 8 دقائق",
            category: "Education",
          },
        ];

  return (
    <div className="flex flex-col bg-[#050816] text-slate-100">
      {/* =========================================================================
          SECTION 1: CINEMATIC HERO
          ========================================================================= */}
      <section className="relative min-h-[85vh] lg:min-h-[92vh] w-full flex items-end overflow-hidden pb-16 pt-32">
        {/* Hero Background Image with Parallax Glow */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="relative h-full w-full"
            initial={{ scale: 1.07 }}
            animate={{ scale: 1.02 }}
            transition={{ duration: 7, ease: [0.16, 1, 0.3, 1] }}
          >
            <PropertyImage
              src={project.image}
              alt={title}
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover object-center"
              fallbackLabel={title}
              fallbackSublabel={developer}
            />
          </motion.div>
          {/* Multi-layered cinematic gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/70 to-[#050816]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050816]/90 via-[#050816]/50 to-transparent rtl:bg-gradient-to-l rtl:from-[#050816]/90 rtl:via-[#050816]/50 rtl:to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050816] to-transparent" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md"
          >
            <Link href={`/${locale}/`} className="transition hover:text-sky-300">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight className="h-3 w-3 rtl:rotate-180 text-slate-500" />
            <Link href={`/${locale}/projects/`} className="transition hover:text-sky-300">
              {isAr ? "المشاريع" : "Showcase"}
            </Link>
            <ChevronRight className="h-3 w-3 rtl:rotate-180 text-slate-500" />
            <span className="text-sky-400 font-semibold truncate max-w-[160px] sm:max-w-xs">
              {title}
            </span>
          </nav>

          {/* Badges Pill Row */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/15 px-3.5 py-1 text-xs font-semibold text-sky-300 backdrop-blur-md">
              <Building2 className="h-3.5 w-3.5" />
              {type}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3.5 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              {status}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/80 px-3.5 py-1 text-xs font-medium text-slate-300 backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5 text-sky-400" />
              {location}
            </span>
          </div>

          {/* Main Title & Developer */}
          <div className="max-w-4xl">
            <h1
              className={`${
                isAr
                  ? "font-[family-name:var(--font-cairo)] tracking-normal text-right leading-snug"
                  : "font-serif tracking-tight text-left leading-[1.1]"
              } text-4xl sm:text-5xl lg:text-6xl font-bold text-white`}
            >
              {title}
            </h1>
            <p className="mt-3 flex items-center gap-2 text-sm sm:text-base font-medium text-slate-300">
              <span className="text-slate-400">{isAr ? "المطور العقاري:" : "Developed by:"}</span>
              <span
                className="font-semibold text-sky-300 [unicode-bidi:isolate]"
                dir={hasArabicText(developer) ? "rtl" : "ltr"}
              >
                {developer}
              </span>
            </p>
          </div>

          {/* Hero Bottom Bar: Price & Action CTAs */}
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-t border-white/10 pt-6">
            <div>
              <span
                className={`text-xs font-bold text-amber-400 ${
                  isAr ? "tracking-normal font-[family-name:var(--font-cairo)]" : "uppercase tracking-wider"
                }`}
              >
                {isAr ? "السعر الابتدائي" : "Starting From"}
              </span>
              <div
                className={`${
                  isAr ? "font-[family-name:var(--font-cairo)] tracking-normal" : "font-[family-name:var(--font-outfit)]"
                } text-3xl sm:text-4xl font-black text-amber-400 mt-0.5`}
              >
                {price}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToEnquiry()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(56,189,248,0.35)] transition-all hover:brightness-110 active:scale-[0.98]"
              >
                <Send className="h-4 w-4" />
                <span>{isAr ? "طلب استشارة وحجز" : "Enquire Now"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (project.brochure_url) {
                    window.open(project.brochure_url, "_blank");
                  } else {
                    scrollToEnquiry(isAr ? "طلب الكتيب الرسمي" : "Official Brochure Request");
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-slate-900/80 px-5 py-3.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
              >
                <Download className="h-4 w-4 text-sky-400" />
                <span>{copy.downloadBrochure || (isAr ? "تحميل الكتيب" : "Download Brochure")}</span>
              </button>

              <a
                href={getWhatsAppInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-xs sm:text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition hover:bg-emerald-400 active:scale-[0.98]"
                aria-label="WhatsApp Inquiry"
              >
                <WhatsAppIcon className="h-4 w-4 fill-slate-950" />
                <span className="hidden sm:inline">{isAr ? "واتساب" : "WhatsApp"}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: PROJECT OVERVIEW (Editorial Split Narrative)
          ========================================================================= */}
      <section className="relative border-t border-white/10 py-20 bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            {/* Left Narrative Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div
                className={`inline-flex items-center gap-2 text-xs font-semibold ${
                  isAr ? "tracking-normal font-[family-name:var(--font-cairo)]" : "uppercase tracking-[0.25em]"
                } text-sky-400`}
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>{copy.overview || (isAr ? "نظرة عامة على المشروع" : "Project Overview")}</span>
              </div>
              <h2
                className={`${
                  isAr
                    ? "font-[family-name:var(--font-cairo)] tracking-normal text-right leading-snug"
                    : "font-[family-name:var(--font-outfit)] tracking-tight text-left leading-tight"
                } text-2xl sm:text-3xl lg:text-4xl font-bold text-white`}
              >
                {isAr
                  ? `أيقونة معمارية تجمع الفخامة والفرص الاستثمارية في قلب ${location}`
                  : `A Landmark Architectural Address in ${location}`}
              </h2>
              <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
                {(() => {
                  const descAr = (project.description_ar || project.descriptionAr || "").trim();
                  const descRaw = (project.description || "").trim();
                  const descRawHasAr = hasArabicText(descRaw);

                  if (isAr) {
                    if (descAr) {
                      return (
                        <div dir="rtl" className="text-right font-[family-name:var(--font-cairo)] space-y-4">
                          <p className="whitespace-pre-line leading-relaxed text-slate-200">{descAr}</p>
                        </div>
                      );
                    }
                    if (descRawHasAr) {
                      return (
                        <div dir="rtl" className="text-right font-[family-name:var(--font-cairo)] space-y-4">
                          <p className="whitespace-pre-line leading-relaxed text-slate-200">{descRaw}</p>
                        </div>
                      );
                    }

                    // Auto-Generated Arabic Overview Narrative Fallback as Primary Text
                    return (
                      <div className="space-y-4">
                        <div dir="rtl" className="text-right font-[family-name:var(--font-cairo)] space-y-4 leading-relaxed">
                          <p className="text-slate-200">
                            {`يقدم مشروع ${title} في ${location} وجهة سكنية واستثمارية استثنائية بتطوير من `}
                            <span
                              dir={hasArabicText(developer) ? "rtl" : "ltr"}
                              className="inline-block font-semibold text-sky-300 [unicode-bidi:isolate]"
                            >
                              {developer}
                            </span>
                            {`. صُمم المشروع ليجسد أرقى معايير الفخامة العصرية والتكامل المعماري، موفراً أسلوب حياة فريداً يجمع بين الراحة التامة والخصوصية العالية في قلب سلطنة عمان.`}
                          </p>
                          <p className="text-slate-300">
                            {`يتميز المشروع بموقعه الاستراتيجي الحيوي الذي يتيح سهولة وسرعة الوصول إلى أبرز الوجهات ومراكز الأعمال والترفيه في مسقط، مع توفير خطة سداد ميسرة (${paymentPlan}) وتاريخ تسليم متوقع بحلول ${completionDate}، مما يجعله فرصة استثمارية واعدة بعوائد مجزية وقيمة أصول متنامية على المدى الطويل.`}
                          </p>
                        </div>

                        {/* Subtle Collapsible Toggle for Raw English Overview if available */}
                        {descRaw && (
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => setShowEnglishOverview((prev) => !prev)}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-sky-400 hover:bg-white/[0.06] hover:text-sky-300 transition-all cursor-pointer"
                            >
                              <Languages className="h-3.5 w-3.5 text-sky-400" />
                              <span>
                                {showEnglishOverview
                                  ? "إخفاء النص الإنجليزي الأصلي"
                                  : "عرض النص الإنجليزي الأصلي (View Original English Text)"}
                              </span>
                              <ChevronDown
                                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                  showEnglishOverview ? "rotate-180" : ""
                                }`}
                              />
                            </button>

                            {showEnglishOverview && (
                              <div
                                dir="ltr"
                                className="mt-3 text-left font-sans space-y-2 [unicode-bidi:isolate] rounded-2xl bg-white/[0.02] border border-white/5 p-4 sm:p-5"
                              >
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 px-2.5 py-0.5 text-[10px] font-semibold text-sky-300 tracking-wider uppercase">
                                    Original English Overview
                                  </span>
                                </div>
                                <p className="whitespace-pre-line leading-relaxed text-slate-300 text-left text-xs sm:text-sm [direction:ltr]">
                                  {descRaw}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (descRaw) {
                    return (
                      <div dir="ltr" className="text-left font-sans space-y-4">
                        <p className="whitespace-pre-line leading-relaxed text-slate-200">{descRaw}</p>
                      </div>
                    );
                  }
                  if (descAr) {
                    return (
                      <div
                        dir="rtl"
                        className="text-right font-[family-name:var(--font-cairo)] space-y-4 [unicode-bidi:isolate] rounded-2xl bg-white/[0.02] border border-white/5 p-4 sm:p-5"
                      >
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300 tracking-wider uppercase mb-1">
                          الوصف بالعربية
                        </span>
                        <p className="whitespace-pre-line leading-relaxed text-slate-200">{descAr}</p>
                      </div>
                    );
                  }
                  return (
                    <div dir="ltr" className="text-left font-sans space-y-4 leading-relaxed">
                      <p>
                        {`Discover ${title}, an exceptional residential and investment destination set within the vibrant backdrop of ${location}, proudly developed by ${developer}. Crafted with exacting standards, the development merges contemporary aesthetics with enduring structural integrity, presenting a premier living environment tailored for discerning homeowners and international investors.`}
                      </p>
                      <p>
                        {`Centrally positioned for seamless connectivity to major commercial arteries, prestigious educational facilities, and leisure landmarks across Oman, ${title} establishes a new benchmark for capital appreciation, rental yield, and elevated everyday comfort.`}
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Garden City Properties Assurance Quote */}
              <div className="mt-8 rounded-2xl border border-amber-400/20 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent p-5 backdrop-blur-md">
                <p
                  className={`text-xs font-semibold text-amber-300 ${
                    isAr ? "tracking-normal font-[family-name:var(--font-cairo)]" : "uppercase tracking-wider"
                  }`}
                >
                  {isAr ? "رؤية جاردن سيتي بروبرتيز الاستشارية" : "Garden City Properties Investment Insight"}
                </p>
                <p
                  className={`mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed ${
                    isAr ? "font-[family-name:var(--font-cairo)] not-italic text-right" : "italic"
                  }`}
                >
                  {isAr
                    ? "«نختار لعملائنا مشاريع تجمع بين التميز المعماري والشفافية القانونية وخطة السداد المرنة، لضمان استثمار آمن ومستدام في السوق العقاري العماني الواعد.»"
                    : "“We curate developments that unite architectural distinction, rigorous legal compliance, and resilient financial schedules, guaranteeing enduring value in Oman’s expanding property sector.”"}
                </p>
              </div>
            </div>

            {/* Right Quick Facts Bento Box (5 cols) */}
            <div
              className={`lg:col-span-5 rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl ${
                isAr ? "font-[family-name:var(--font-cairo)]" : ""
              }`}
            >
              <h3 className="text-base font-bold text-white mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <span>{isAr ? "المواصفات الأساسية" : "Development Details"}</span>
                <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 border border-sky-400/20">
                  {type}
                </span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">{copy.developer || (isAr ? "المطور" : "Developer")}</span>
                  <span
                    className="font-semibold text-white rtl:text-left ltr:text-right [unicode-bidi:isolate]"
                    dir={hasArabicText(developer) ? "rtl" : "ltr"}
                  >
                    {developer}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">{copy.stage || (isAr ? "مرحلة البناء" : "Stage")}</span>
                  <span className="font-semibold text-amber-400 rtl:text-left ltr:text-right">{constructionStage}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">{copy.handover || (isAr ? "تاريخ التسليم" : "Handover")}</span>
                  <span className="font-semibold text-white rtl:text-left ltr:text-right">{completionDate}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">{copy.paymentPlan || (isAr ? "خطة السداد" : "Payment Plan")}</span>
                  <span
                    className="font-semibold text-white rtl:text-left ltr:text-right [unicode-bidi:isolate]"
                    dir={isAr ? "rtl" : "ltr"}
                  >
                    {paymentPlan}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">{isAr ? "حق الملكية" : "Ownership"}</span>
                  <span
                    className="font-semibold text-emerald-400 rtl:text-left ltr:text-right [unicode-bidi:isolate]"
                    dir={isAr ? "rtl" : "ltr"}
                  >
                    {copy.freehold || (isAr ? "تملك حر بنسبة \u200E100%\u200E" : "100% Freehold")}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-400">{copy.structure || (isAr ? "الهيكل الإنشائي" : "Structure")}</span>
                  <span className="font-semibold text-white rtl:text-left ltr:text-right">{structure}</span>
                </div>
              </div>

              {/* Consultation trigger inside facts */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <a
                  href="tel:+96897300200"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  <Phone className="h-4 w-4 text-sky-400" />
                  <span dir="ltr">+968 97300200</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: PROJECT HIGHLIGHTS (Metrics & Statistics Grid)
          ========================================================================= */}
      <section className="relative border-t border-white/10 py-16 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p
              className={`text-xs font-semibold ${
                isAr ? "tracking-normal font-[family-name:var(--font-cairo)]" : "uppercase tracking-[0.25em]"
              } text-sky-400`}
            >
              {copy.highlights || (isAr ? "أبرز مميزات المشروع" : "Project Highlights")}
            </p>
            <h2
              className={`mt-2 ${
                isAr
                  ? "font-[family-name:var(--font-cairo)] tracking-normal"
                  : "font-[family-name:var(--font-outfit)] tracking-tight"
              } text-2xl sm:text-3xl font-bold text-white`}
            >
              {isAr ? "أرقام ومؤشرات تعكس قوة الاستثمار" : "Key Project Indicators & Metrics"}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Stat 1: Price */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-md text-center transition hover:border-sky-400/40 hover:-translate-y-0.5"
            >
              <Coins className="h-6 w-6 text-amber-400 mx-auto mb-2" />
              <p className="text-[11px] font-medium text-slate-400">
                {copy.startingPrice || (isAr ? "السعر الابتدائي" : "Starting Price")}
              </p>
              <p
                className={`mt-1 ${
                  isAr ? "font-[family-name:var(--font-cairo)] tracking-normal" : "font-[family-name:var(--font-outfit)]"
                } text-lg sm:text-xl font-bold text-white`}
              >
                {price}
              </p>
            </motion.div>

            {/* Stat 2: Area */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-md text-center transition hover:border-sky-400/40 hover:-translate-y-0.5"
            >
              <Square className="h-6 w-6 text-sky-400 mx-auto mb-2" />
              <p className="text-[11px] font-medium text-slate-400">
                {copy.startingArea || (isAr ? "المساحة الابتدائية" : "Starting Area")}
              </p>
              <p
                className={`mt-1 ${
                  isAr ? "font-[family-name:var(--font-cairo)] tracking-normal" : "font-[family-name:var(--font-outfit)]"
                } text-lg sm:text-xl font-bold text-white`}
              >
                {area}
              </p>
            </motion.div>

            {/* Stat 3: Handover */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-md text-center transition hover:border-sky-400/40 hover:-translate-y-0.5"
            >
              <CalendarDays className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-[11px] font-medium text-slate-400">
                {copy.handover || (isAr ? "تاريخ التسليم" : "Handover")}
              </p>
              <p
                className={`mt-1 ${
                  isAr ? "font-[family-name:var(--font-cairo)] tracking-normal" : "font-[family-name:var(--font-outfit)]"
                } text-lg sm:text-xl font-bold text-white`}
              >
                {completionDate}
              </p>
            </motion.div>

            {/* Stat 4: Stage */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-md text-center transition hover:border-sky-400/40 hover:-translate-y-0.5"
            >
              <Layers className="h-6 w-6 text-amber-400 mx-auto mb-2" />
              <p className="text-[11px] font-medium text-slate-400">
                {copy.stage || (isAr ? "مرحلة البناء" : "Stage")}
              </p>
              <p
                className={`mt-1 ${
                  isAr ? "font-[family-name:var(--font-cairo)] tracking-normal" : "font-[family-name:var(--font-outfit)]"
                } text-sm sm:text-base font-bold text-amber-300`}
              >
                {constructionStage}
              </p>
            </motion.div>

            {/* Stat 5: Freehold */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-md text-center transition hover:border-sky-400/40 hover:-translate-y-0.5"
            >
              <ShieldCheck className="h-6 w-6 text-sky-400 mx-auto mb-2" />
              <p className="text-[11px] font-medium text-slate-400">
                {isAr ? "سند الملكية" : "Title Deed"}
              </p>
              <p
                className={`mt-1 ${
                  isAr ? "font-[family-name:var(--font-cairo)] tracking-normal" : "font-[family-name:var(--font-outfit)]"
                } text-sm sm:text-base font-bold text-emerald-400`}
              >
                <AnimatedCounter value={isAr ? "تملك حر دائم \u200E100%\u200E" : "100% Freehold"} />
              </p>
            </motion.div>

            {/* Stat 6: Yield Potential */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-md text-center transition hover:border-sky-400/40 hover:-translate-y-0.5"
            >
              <Percent className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
              <p className="text-[11px] font-medium text-slate-400">
                {isAr ? "عائد متوقع" : "Projected ROI"}
              </p>
              <p
                className={`mt-1 ${
                  isAr ? "font-[family-name:var(--font-cairo)] tracking-normal" : "font-[family-name:var(--font-outfit)]"
                } text-lg sm:text-xl font-bold text-cyan-300`}
              >
                <AnimatedCounter value="8 - 10%" />
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: PROPERTY TYPES & AVAILABLE UNITS (VISUAL CARDS & MODAL)
          ========================================================================= */}
      <section className="relative border-t border-white/10 py-20 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <p
                className={`text-xs font-semibold ${
                  isAr ? "tracking-normal font-[family-name:var(--font-cairo)]" : "uppercase tracking-[0.25em]"
                } text-sky-400`}
              >
                {copy.availableUnits || (isAr ? "نماذج ومخططات الوحدات المتاحة" : "Property Types & Available Units")}
              </p>
              <h2
                className={`mt-2 ${
                  isAr
                    ? "font-[family-name:var(--font-cairo)] tracking-normal"
                    : "font-[family-name:var(--font-outfit)] tracking-tight"
                } text-2xl sm:text-3xl font-bold text-white`}
              >
                {isAr ? "خيارات سكنية واستثمارية مصممة بعناية" : "Bespoke Living Spaces & Floor Layouts"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-2 md:mt-0">
              {copy.configurationsSubtitle ||
                (isAr
                  ? "استكشف المساحات والمخططات المعمارية المتاحة للوحدات السكنية والتجارية."
                  : "Explore available floor plans, dimensions and unit layouts.")}
            </p>
          </div>

          {/* Category Filter Pills (if multiple categories exist) */}
          {configurationTypes.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-white/10 pb-4">
              <button
                type="button"
                onClick={() => setConfigFilterType("All")}
                className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  configFilterType === "All"
                    ? "bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                    : "bg-slate-900/80 text-slate-300 border border-white/10 hover:bg-white/10"
                }`}
              >
                {isAr ? `جميع النماذج (${configurations.length})` : `All Units (${configurations.length})`}
              </button>
              {configurationTypes.map((typeKey) => {
                const count = configurations.filter((c) => (c.property_type || c.type) === typeKey).length;
                const label = isAr ? localizeToArabic(typeKey, typeKey) : typeKey;
                return (
                  <button
                    key={typeKey}
                    type="button"
                    onClick={() => setConfigFilterType(typeKey)}
                    className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                      configFilterType === typeKey
                        ? "bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                        : "bg-slate-900/80 text-slate-300 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Visual Property Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredConfigurations.map((conf, idx) => {
              const confTitle: string =
                (isAr
                  ? conf.name_ar ||
                    conf.titleAr ||
                    (hasArabicText(conf.name || conf.title)
                      ? conf.name || conf.title
                      : localizeToArabic(conf.name || conf.title, "وحدة سكنية فاخرة"))
                  : conf.name || conf.title) || (isAr ? "وحدة سكنية فاخرة" : "Luxury Residence");
              const rawConfDesc = conf.description || "";
              const hasConfAr = Boolean(conf.description_ar || conf.descriptionAr) || hasArabicText(rawConfDesc);
              const confDesc = isAr
                ? conf.description_ar || conf.descriptionAr || rawConfDesc
                : rawConfDesc;
              const isConfDescEnglishFallback = isAr && !hasConfAr && Boolean(rawConfDesc);
              const coverImg = getConfigCoverImage(conf);
              const photos = getConfigGalleryPhotos(conf);
              const propType = isAr ? localizeToArabic(conf.property_type || conf.type, "شقة سكنية") : (conf.property_type || conf.type || "Apartment");
              const availStatus = isAr ? localizeToArabic(conf.availability_status || conf.availability) : (conf.availability_status || conf.availability);

              return (
                <div
                  key={conf.id || idx}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-md transition-all duration-300 hover:border-sky-400/40 hover:bg-slate-900/90 hover:shadow-[0_12px_40px_rgba(56,189,248,0.15)]"
                >
                  {/* Visual Cover Photo Container */}
                  <div
                    onClick={() => openConfigModal(conf)}
                    className="relative h-60 w-full overflow-hidden bg-slate-950 cursor-pointer"
                  >
                    {coverImg ? (
                      <PropertyImage
                        src={coverImg}
                        alt={confTitle}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={85}
                        fallbackLabel={confTitle}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950 text-slate-600">
                        <Building2 className="h-10 w-10 text-slate-500 mb-2" />
                        <span className="text-xs text-slate-400">{isAr ? "صورة النموذج قيد التحديث" : "Render Preview"}</span>
                      </div>
                    )}

                    {/* Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="rounded-full bg-slate-950/80 border border-sky-400/30 px-2.5 py-1 text-[11px] font-bold text-sky-300 backdrop-blur-md shadow">
                          {propType}
                        </span>
                        {conf.is_featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/25 border border-amber-400/40 px-2.5 py-1 text-[10px] font-extrabold text-amber-300 backdrop-blur-md shadow uppercase tracking-wide">
                            <Star className="h-2.5 w-2.5 fill-amber-300" />
                            <span>{isAr ? "نموذج مميز" : "Featured"}</span>
                          </span>
                        )}
                      </div>

                      {availStatus && (
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur-md shadow ${
                          availStatus.toLowerCase().includes("sold") || availStatus.includes("بيع")
                            ? "bg-rose-500/20 border border-rose-400/30 text-rose-300"
                            : availStatus.toLowerCase().includes("limited") || availStatus.includes("محدود")
                            ? "bg-amber-500/20 border border-amber-400/30 text-amber-300"
                            : "bg-emerald-500/20 border border-emerald-400/30 text-emerald-300"
                        }`}>
                          {availStatus}
                        </span>
                      )}
                    </div>

                    {/* Bottom Photo Count & Zoom Hint */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs text-white">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-950/75 border border-white/10 px-2.5 py-1 text-[11px] font-medium backdrop-blur-md text-slate-300">
                        <ImageIcon className="h-3 w-3 text-sky-400" />
                        <span>{photos.length > 0 ? `${photos.length} ${isAr ? "صور" : "Photos"}` : (isAr ? "معاينة" : "Preview")}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-lg bg-sky-500/20 border border-sky-400/30 px-2.5 py-1 text-[11px] font-semibold text-sky-300 backdrop-blur-md opacity-90 group-hover:opacity-100 transition">
                        <Eye className="h-3 w-3" />
                        <span>{isAr ? "عرض التفاصيل" : "View Details"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3
                        onClick={() => openConfigModal(conf)}
                        className="font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-lg sm:text-xl font-bold text-white transition-colors group-hover:text-sky-300 cursor-pointer"
                        dir={isAr && !hasArabicText(confTitle) ? "ltr" : undefined}
                      >
                        {confTitle}
                      </h3>

                      {confDesc && (
                        <p
                          dir={isConfDescEnglishFallback ? "ltr" : undefined}
                          className={`mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed ${
                            isConfDescEnglishFallback
                              ? "text-left [unicode-bidi:isolate]"
                              : ""
                          }`}
                        >
                          {confDesc}
                        </p>
                      )}
                    </div>

                    {/* Quick Specs Grid */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 text-xs">
                      {/* Bedrooms */}
                      <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/50 border border-white/5 text-center">
                        <div className="flex items-center gap-1 text-slate-400 text-[11px] mb-0.5">
                          <BedDouble className="h-3.5 w-3.5 text-sky-400" />
                          <span>{isAr ? "غرف" : "Beds"}</span>
                        </div>
                        <span className="font-bold text-white text-xs sm:text-sm">
                          {Number(conf.bedrooms) === 0 || propType === "Studio"
                            ? (isAr ? "استوديو" : "Studio")
                            : conf.bedrooms ?? 1}
                        </span>
                      </div>

                      {/* Bathrooms */}
                      <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/50 border border-white/5 text-center">
                        <div className="flex items-center gap-1 text-slate-400 text-[11px] mb-0.5">
                          <Bath className="h-3.5 w-3.5 text-sky-400" />
                          <span>{isAr ? "حمامات" : "Baths"}</span>
                        </div>
                        <span className="font-bold text-white text-xs sm:text-sm">
                          {conf.bathrooms ?? 1}
                        </span>
                      </div>

                      {/* BUA */}
                      <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/50 border border-white/5 text-center">
                        <div className="flex items-center gap-1 text-slate-400 text-[11px] mb-0.5">
                          <Square className="h-3.5 w-3.5 text-emerald-400" />
                          <span>{isAr ? "المساحة" : "BUA"}</span>
                        </div>
                        <span className="font-bold text-white text-xs sm:text-sm">
                          {conf.bua_sqm || conf.bua ? `${conf.bua_sqm || conf.bua} ${isAr ? "م²" : "sqm"}` : (isAr ? "عند الطلب" : "On Request")}
                        </span>
                      </div>
                    </div>

                    {/* Price & Actions Footer */}
                    <div className="space-y-3 pt-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                          {isAr ? "السعر الابتدائي" : "Starting Price"}
                        </span>
                        <span className="font-[family-name:var(--font-outfit)] text-base sm:text-lg font-extrabold text-amber-400">
                          {conf.price || price}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openConfigModal(conf)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-500/15 border border-sky-400/30 px-3.5 py-2.5 text-xs font-bold text-sky-300 hover:bg-sky-500/30 transition active:scale-[0.98]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>{isAr ? "تفاصيل الوحدة" : "View Details"}</span>
                        </button>

                        <a
                          href={getConfWhatsAppUrl(conf)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition shadow-[0_0_15px_rgba(16,185,129,0.25)] active:scale-[0.98]"
                          title={isAr ? "استفسر عبر واتساب" : "Enquire on WhatsApp"}
                        >
                          <WhatsAppIcon className="h-4 w-4 fill-slate-950" />
                          <span className="hidden sm:inline">{isAr ? "واتساب" : "WhatsApp"}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE CONFIGURATION DETAIL MODAL / LIGHTBOX
          ========================================================================= */}
      {selectedConfigModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-6 backdrop-blur-md overflow-y-auto"
          onClick={closeConfigModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-sky-400/30 bg-slate-900 p-5 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] text-slate-100"
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={closeConfigModal}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/80 border border-white/15 text-slate-400 hover:text-white hover:bg-slate-900 transition"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="pr-10 pb-4 border-b border-white/10">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-full bg-sky-500/15 border border-sky-400/30 px-3 py-1 text-xs font-bold text-sky-300 uppercase">
                  {isAr
                    ? localizeToArabic(selectedConfigModal.property_type || selectedConfigModal.type, "شقة سكنية")
                    : (selectedConfigModal.property_type || selectedConfigModal.type || "Apartment")}
                </span>
                {(selectedConfigModal.availability_status || selectedConfigModal.availability) && (
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                    {isAr
                      ? localizeToArabic(selectedConfigModal.availability_status || selectedConfigModal.availability)
                      : (selectedConfigModal.availability_status || selectedConfigModal.availability)}
                  </span>
                )}
                {selectedConfigModal.is_featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-400/30 px-2.5 py-1 text-xs font-bold text-amber-300 uppercase">
                    <Star className="h-3 w-3 fill-amber-300" /> {isAr ? "نموذج مميز" : "Featured"}
                  </span>
                )}
              </div>

              <h3
                className="font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-2xl sm:text-3xl font-extrabold text-white"
                dir={isAr && !hasArabicText(selectedConfigModal.name_ar || selectedConfigModal.titleAr || selectedConfigModal.name || selectedConfigModal.title) ? "ltr" : undefined}
              >
                {isAr
                  ? selectedConfigModal.name_ar ||
                    selectedConfigModal.titleAr ||
                    (hasArabicText(selectedConfigModal.name || selectedConfigModal.title)
                      ? selectedConfigModal.name || selectedConfigModal.title
                      : localizeToArabic(selectedConfigModal.name || selectedConfigModal.title, "وحدة سكنية فاخرة"))
                  : selectedConfigModal.name || selectedConfigModal.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-sky-400" />
                <span>{title} • {location}</span>
              </p>
            </div>

            {/* Modal Media Showcase */}
            {(() => {
              const modalPhotos = getConfigGalleryPhotos(selectedConfigModal);
              const rawModalFloorPlan =
                selectedConfigModal.floor_plan_url ||
                selectedConfigModal.floorPlanUrl ||
                (selectedConfigModal as Record<string, unknown>).floor_plan ||
                (selectedConfigModal as Record<string, unknown>).floorplan_url ||
                (selectedConfigModal as Record<string, unknown>).floorplan ||
                floorPlanUrl;
              const hasFloorPlan = Boolean(rawModalFloorPlan);
              const activePhoto = modalPhotos[configModalPhotoIndex] || modalPhotos[0];
              const resolvedFloorPlan = rawModalFloorPlan
                ? toDirectDriveImageUrl(String(rawModalFloorPlan))
                : gallery[0] || project.image || "";
              const isDriveOrExt =
                isGoogleDriveUrl(resolvedFloorPlan) ||
                (typeof resolvedFloorPlan === "string" && resolvedFloorPlan.startsWith("http"));

              return (
                <div className="mt-5 space-y-3">
                  {/* Media Tabs Switcher (if floor plan exists) */}
                  {hasFloorPlan && (
                    <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                      <button
                        type="button"
                        onClick={() => setConfigModalTab("photos")}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                          configModalTab === "photos"
                            ? "bg-sky-500 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.35)]"
                            : "bg-slate-950 text-slate-400 border border-white/10 hover:text-white"
                        }`}
                      >
                        <ImageIcon className="h-3.5 w-3.5" />
                        <span>{isAr ? `معرض الصور (${modalPhotos.length})` : `Photography (${modalPhotos.length})`}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfigModalTab("floorplan")}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                          configModalTab === "floorplan"
                            ? "bg-sky-500 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.35)]"
                            : "bg-slate-950 text-slate-400 border border-white/10 hover:text-white"
                        }`}
                      >
                        <Ruler className="h-3.5 w-3.5" />
                        <span>{isAr ? "المخطط المعماري" : "Floor Plan Blueprint"}</span>
                      </button>
                    </div>
                  )}

                  {/* Active Media Container */}
                  {configModalTab === "photos" ? (
                    <div className="space-y-3">
                      <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
                        {activePhoto ? (
                          <Image
                            src={activePhoto}
                            alt={selectedConfigModal.name || "Configuration preview"}
                            fill
                            sizes="(max-width: 1024px) 100vw, 600px"
                            quality={90}
                            unoptimized={isGoogleDriveUrl(activePhoto)}
                            className="object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-500 text-xs">
                            <ImageIcon className="h-10 w-10 text-slate-600 mb-2" />
                            <span>{isAr ? "لا توجد صور متوفرة" : "No photos available"}</span>
                          </div>
                        )}
                      </div>

                      {/* Gallery Thumbnail Row */}
                      {modalPhotos.length > 1 && (
                        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                          {modalPhotos.map((pUrl, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => setConfigModalPhotoIndex(pIdx)}
                              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border transition-all ${
                                configModalPhotoIndex === pIdx
                                  ? "border-sky-400 ring-2 ring-sky-400/50 scale-105"
                                  : "border-white/10 opacity-70 hover:opacity-100"
                              }`}
                            >
                              <Image
                                src={pUrl}
                                alt={`Thumbnail ${pIdx + 1}`}
                                fill
                                sizes="96px"
                                quality={75}
                                unoptimized={isGoogleDriveUrl(pUrl)}
                                className="object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
                      {modalFloorPlanError || !resolvedFloorPlan ? (
                        <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-br from-slate-950 via-[#070d1e] to-slate-900">
                          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-500/10 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                            <Ruler className="h-7 w-7 text-sky-400" />
                          </div>
                          <p className="font-[family-name:var(--font-outfit)] text-sm font-semibold text-white">
                            {isAr ? "المخطط المعماري قيد التحديث" : "Architectural Blueprint In Progress"}
                          </p>
                          <p className="text-xs text-slate-400 mt-1 max-w-sm">
                            {isAr
                              ? "تواصل مع مستشارنا العقاري للحصول على ملف المخطط بصيغة PDF عالية الدقة"
                              : "Contact our property consultant to receive the high-resolution blueprint PDF directly."}
                          </p>
                          <a
                            href={getConfWhatsAppUrl(selectedConfigModal)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400 transition"
                          >
                            <Send className="h-3.5 w-3.5" />
                            <span>{isAr ? "طلب المخطط عبر واتساب" : "Request Blueprint via WhatsApp"}</span>
                          </a>
                        </div>
                      ) : (
                        <>
                          <Image
                            src={resolvedFloorPlan}
                            alt={`${selectedConfigModal.name || selectedConfigModal.title || title} Floor Plan`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 800px"
                            quality={85}
                            unoptimized={isDriveOrExt}
                            className="object-contain p-3 cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                            onClick={() => setFloorPlanModalOpen(true)}
                            onError={() => setModalFloorPlanError(true)}
                          />
                          <button
                            type="button"
                            onClick={() => setFloorPlanModalOpen(true)}
                            className="absolute bottom-4 right-4 z-10 rounded-xl bg-slate-950/85 px-3.5 py-2 text-xs font-semibold text-sky-400 border border-white/15 backdrop-blur-md hover:bg-slate-900 hover:text-sky-300 transition flex items-center gap-1.5 shadow-lg"
                          >
                            <Maximize2 className="h-3.5 w-3.5" />
                            <span>{copy.viewFloorPlan || (isAr ? "تكبير المخطط" : "Enlarge Blueprint")}</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Specifications Grid */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                {isAr ? "المواصفات الهندسية والتفاصيل" : "Architectural Specifications & Details"}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {/* Bedrooms */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <BedDouble className="h-4 w-4 text-sky-400" />
                    <span>{isAr ? "غرف النوم" : "Bedrooms"}</span>
                  </div>
                  <span className="font-bold text-white text-base">
                    {Number(selectedConfigModal.bedrooms) === 0 || (selectedConfigModal.property_type || selectedConfigModal.type) === "Studio"
                      ? (isAr ? "استوديو" : "Studio")
                      : selectedConfigModal.bedrooms ?? 1}
                  </span>
                </div>

                {/* Bathrooms */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Bath className="h-4 w-4 text-sky-400" />
                    <span>{isAr ? "دورات المياه" : "Bathrooms"}</span>
                  </div>
                  <span className="font-bold text-white text-base">
                    {selectedConfigModal.bathrooms ?? 1}
                  </span>
                </div>

                {/* BUA */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Square className="h-4 w-4 text-emerald-400" />
                    <span>{isAr ? "مساحة البناء (BUA)" : "Built-Up Area"}</span>
                  </div>
                  <span className="font-bold text-white text-base">
                    {selectedConfigModal.bua_sqm || selectedConfigModal.bua ? `${selectedConfigModal.bua_sqm || selectedConfigModal.bua} ${isAr ? "م²" : "sqm"}` : (isAr ? "عند الطلب" : "On Request")}
                  </span>
                </div>

                {/* Plot / Balconies */}
                {(selectedConfigModal.plot_sqm || selectedConfigModal.plot) ? (
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Ruler className="h-4 w-4 text-amber-400" />
                      <span>{isAr ? "مساحة الأرض" : "Plot Area"}</span>
                    </div>
                    <span className="font-bold text-white text-base">
                      {selectedConfigModal.plot_sqm || selectedConfigModal.plot} {isAr ? "م²" : "sqm"}
                    </span>
                  </div>
                ) : (selectedConfigModal.balconies && Number(selectedConfigModal.balconies) > 0) ? (
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                      <span>{isAr ? "الشرفات" : "Balconies"}</span>
                    </div>
                    <span className="font-bold text-white text-base">
                      {selectedConfigModal.balconies}
                    </span>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Building2 className="h-4 w-4 text-cyan-400" />
                      <span>{isAr ? "النوع" : "Category"}</span>
                    </div>
                    <span className="font-bold text-white text-base">
                      {isAr
                        ? localizeToArabic(selectedConfigModal.property_type || selectedConfigModal.type, "شقة سكنية")
                        : (selectedConfigModal.property_type || selectedConfigModal.type || "Apartment")}
                    </span>
                  </div>
                )}

                {/* Furnishing Status if present */}
                {(selectedConfigModal.furnishing_status || selectedConfigModal.furnishing) && (
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Building2 className="h-4 w-4 text-cyan-400" />
                      <span>{isAr ? "حالة التأثيث" : "Furnishing"}</span>
                    </div>
                    <span className="font-semibold text-white text-xs truncate block">
                      {isAr
                        ? localizeToArabic(selectedConfigModal.furnishing_status || selectedConfigModal.furnishing, selectedConfigModal.furnishing_status || selectedConfigModal.furnishing)
                        : (selectedConfigModal.furnishing_status || selectedConfigModal.furnishing)}
                    </span>
                  </div>
                )}

                {/* Parking if present */}
                {(selectedConfigModal.parking_info || selectedConfigModal.parking) && (
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Car className="h-4 w-4 text-sky-400" />
                      <span>{isAr ? "مواقف السيارات" : "Parking"}</span>
                    </div>
                    <span className="font-semibold text-white text-xs truncate block">
                      {isAr
                        ? localizeToArabic(selectedConfigModal.parking_info || selectedConfigModal.parking, selectedConfigModal.parking_info || selectedConfigModal.parking)
                        : (selectedConfigModal.parking_info || selectedConfigModal.parking)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Narrative Description & Features */}
            {(() => {
              const rawModalDesc = selectedConfigModal.description || "";
              const modalDescAr = selectedConfigModal.description_ar || selectedConfigModal.descriptionAr;
              const hasModalAr = Boolean(modalDescAr) || hasArabicText(rawModalDesc);
              const desc = isAr ? (modalDescAr || rawModalDesc) : rawModalDesc;
              const isFallbackEnInAr = isAr && !hasModalAr && Boolean(rawModalDesc);
              const features = selectedConfigModal.features;

              return (
                <div className="mt-6 space-y-4">
                  {desc && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        {isAr ? "نبذة عن النموذج" : "Overview & Layout Description"}
                      </h4>
                      <div
                        dir={isFallbackEnInAr ? "ltr" : undefined}
                        className={`text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-white/5 ${
                          isFallbackEnInAr
                            ? "text-left font-sans [unicode-bidi:isolate]"
                            : isAr
                            ? "text-right font-[family-name:var(--font-cairo)]"
                            : "text-left"
                        }`}
                      >
                        {isFallbackEnInAr && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 px-2 py-0.5 text-[10px] font-semibold text-sky-300 tracking-wider uppercase mb-2">
                            English Layout Details
                          </span>
                        )}
                        <p className="whitespace-pre-line">{desc}</p>
                      </div>
                    </div>
                  )}

                  {Array.isArray(features) && features.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        {isAr ? "الميزات الحصرية" : "Key Unit Features"}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {features.map((feat, fIdx) => (
                          <span
                            key={fIdx}
                            dir="auto"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500/10 border border-sky-400/20 px-3 py-1.5 text-xs font-medium text-sky-300"
                          >
                            <Sparkles className="h-3 w-3 text-sky-400" />
                            <span>{feat}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Bottom Sticky Action / Pricing Bar */}
            <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  {isAr ? "السعر الابتدائي للوحدة" : "Starting Price for this Layout"}
                </span>
                <span className="font-[family-name:var(--font-outfit)] text-2xl font-black text-amber-400 mt-0.5 block">
                  {selectedConfigModal.price || price}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={getConfWhatsAppUrl(selectedConfigModal)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition hover:bg-emerald-400 active:scale-[0.98]"
                >
                  <WhatsAppIcon className="h-4 w-4 fill-slate-950" />
                  <span>{isAr ? "استفسر عبر واتساب" : "Enquire on WhatsApp"}</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    const confTitle = isAr
                      ? selectedConfigModal.name_ar || selectedConfigModal.titleAr || selectedConfigModal.name || selectedConfigModal.title
                      : selectedConfigModal.name || selectedConfigModal.title;
                    closeConfigModal();
                    scrollToEnquiry(confTitle);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-slate-950 px-5 py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  <Send className="h-4 w-4" />
                  <span>{isAr ? "طلب حجز واستشارة" : "Register Interest"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 5: AMENITIES & FACILITIES
          ========================================================================= */}
      {project.amenities_enabled !== false && amenitiesList.length > 0 && (
        <section id="project-amenities" className="relative border-t border-white/10 py-20 bg-slate-950/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p
                className={`text-xs font-semibold ${
                  isAr ? "tracking-normal font-[family-name:var(--font-cairo)]" : "uppercase tracking-[0.25em]"
                } text-sky-400`}
              >
                {isAr
                  ? project.amenities_label_ar || project.amenities_label || copy.amenities || "المرافق والخدمات الحصرية"
                  : project.amenities_label || copy.amenities || "Amenities & Facilities"}
              </p>
              <h2
                className={`mt-2 ${
                  isAr
                    ? "font-[family-name:var(--font-cairo)] tracking-normal"
                    : "font-[family-name:var(--font-outfit)] tracking-tight"
                } text-2xl sm:text-3xl font-bold text-white`}
              >
                {isAr
                  ? project.amenities_heading_ar || project.amenities_heading || "مرافق عالمية مصممة لأرقى أساليب الحياة"
                  : project.amenities_heading || "Curated World-Class Lifestyle Privileges"}
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-400">
                {isAr
                  ? project.amenities_subtitle_ar ||
                    project.amenities_subtitle ||
                    copy.amenitiesSubtitle ||
                    "مرافق استثنائية صُممت لأسلوب حياة راقٍ يجمع بين الراحة والرفاهية والهدوء."
                  : project.amenities_subtitle ||
                    copy.amenitiesSubtitle ||
                    "Curated lifestyle amenities designed for comfort, leisure and wellness."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {amenitiesList.map((item, idx) => {
                const itemName = isAr
                  ? item.name_ar || item.nameAr || localizeToArabic(item.name, item.name)
                  : item.name;
                const rawItemDesc = item.description || "";
                const itemDescAr = item.description_ar || item.descriptionAr;
                const hasItemAr = Boolean(itemDescAr) || hasArabicText(rawItemDesc);
                const itemDesc = isAr ? (itemDescAr || rawItemDesc) : rawItemDesc;
                const isFallbackEnInAr = isAr && !hasItemAr && Boolean(rawItemDesc);
                const itemCat = isAr ? localizeToArabic(item.category, item.category) : item.category;

                return (
                  <div
                    key={item.id || idx}
                    className="group rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/40 hover:bg-slate-900/90 hover:shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-400/20 group-hover:bg-sky-500/20 group-hover:scale-110 transition-transform">
                        {renderAmenityIcon(item.icon, "h-6 w-6")}
                      </div>
                      <h3
                        className="mt-4 font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-base font-bold text-white"
                        dir={isAr && !hasArabicText(itemName) ? "ltr" : undefined}
                      >
                        {itemName}
                      </h3>
                      {itemDesc && (
                        <p
                          dir={isFallbackEnInAr ? "ltr" : undefined}
                          className={`mt-2 text-xs text-slate-400 leading-relaxed ${
                            isFallbackEnInAr ? "text-left [unicode-bidi:isolate]" : ""
                          }`}
                        >
                          {itemDesc}
                        </p>
                      )}
                    </div>
                    {itemCat && (
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <span className="text-[10px] font-medium tracking-wider uppercase text-sky-400/70">
                          {itemCat}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 6: PROJECT GALLERY & LIGHTBOX
          ========================================================================= */}
      <section className="relative border-t border-white/10 py-20 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p
                className={`text-xs font-semibold ${
                  isAr ? "tracking-normal font-[family-name:var(--font-cairo)]" : "uppercase tracking-[0.25em]"
                } text-sky-400`}
              >
                {copy.gallery || (isAr ? "معرض صور المشروع" : "Project Gallery")}
              </p>
              <h2
                className={`mt-2 ${
                  isAr
                    ? "font-[family-name:var(--font-cairo)] tracking-normal"
                    : "font-[family-name:var(--font-outfit)] tracking-tight"
                } text-2xl sm:text-3xl font-bold text-white`}
              >
                {isAr ? "استكشف التفاصيل المعمارية الراقية" : "Visual Storytelling & Interior Aesthetics"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-2 md:mt-0">
              {copy.gallerySubtitle ||
                (isAr
                  ? "استكشف الرؤية المعمارية والتفاصيل والتصاميم الداخلية الراقية."
                  : "Immerse yourself in the architectural vision and interior spaces.")}
            </p>
          </div>

          {/* Gallery Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {gallery.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(idx)}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900 cursor-pointer shadow-lg transition-all hover:border-sky-400/50 ${
                  idx === 0 ? "sm:col-span-2 lg:col-span-2 h-[320px] sm:h-[420px]" : "h-[260px] sm:h-[320px]"
                }`}
              >
                <PropertyImage
                  src={imgUrl}
                  alt={`${title} visual ${idx + 1}`}
                  fill
                  sizes={
                    idx === 0
                      ? "(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  }
                  quality={85}
                  loading="lazy"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  fallbackLabel={title}
                  fallbackSublabel={`Gallery Image ${idx + 1}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-slate-950/80 px-3.5 py-1.5 text-xs font-semibold text-white border border-white/15 backdrop-blur-md">
                    <Maximize2 className="h-3.5 w-3.5 text-sky-400" />
                    <span>{isAr ? "عرض الصورة كاملة" : "Expand Image"}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: ARCHITECTURAL FLOOR PLANS
          ========================================================================= */}
      <section className="relative border-t border-white/10 py-20 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            {/* Floor Plan Blueprint Frame (7 cols) */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl border border-white/15 bg-slate-950 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-emerald-400" />
                    <h3 className="font-[family-name:var(--font-outfit)] text-base font-bold text-white">
                      {copy.floorPlans || (isAr ? "المخططات الهندسية المعتمدة" : "Architectural Blueprints")}
                    </h3>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                    {isAr ? "معتمد رسمياً" : "Official Layout"}
                  </span>
                </div>

                <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                  {(() => {
                    const section7Plan = floorPlanUrl || gallery[0] || project.image || "";
                    const resolvedPlan = toDirectDriveImageUrl(section7Plan) || section7Plan;
                    const isDriveOrExt =
                      isGoogleDriveUrl(resolvedPlan) ||
                      (typeof resolvedPlan === "string" && resolvedPlan.startsWith("http"));

                    return (
                      <>
                        <Image
                          src={resolvedPlan}
                          alt={`${title} Architectural Blueprint`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          quality={85}
                          unoptimized={isDriveOrExt}
                          className="object-contain cursor-pointer transition-transform duration-500 hover:scale-[1.02] p-3"
                          onClick={() => setFloorPlanModalOpen(true)}
                        />
                        <button
                          type="button"
                          onClick={() => setFloorPlanModalOpen(true)}
                          className="absolute top-4 right-4 z-10 rounded-xl bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-sky-400 border border-white/10 backdrop-blur-md hover:bg-slate-900 transition flex items-center gap-1.5 shadow"
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                          <span>{isAr ? "تكبير" : "Enlarge"}</span>
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Description & Action (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <p
                className={`text-xs font-semibold ${
                  isAr ? "tracking-normal font-[family-name:var(--font-cairo)]" : "uppercase tracking-[0.25em]"
                } text-emerald-400`}
              >
                {isAr ? "الدقة المعمارية وتوزيع المساحات" : "Spatial Precision & Engineering"}
              </p>
              <h2
                className={`text-2xl sm:text-3xl font-bold text-white ${
                  isAr
                    ? "font-[family-name:var(--font-cairo)] tracking-normal"
                    : "font-[family-name:var(--font-outfit)] tracking-tight"
                }`}
              >
                {isAr ? "مخططات هندسية تعظم الاستفادة من كل متر مربع" : "Intelligently Engineered Layouts"}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {isAr
                  ? "روعي في تخطيط الوحدات توفير أقصى درجات الراحة والانسيابية مع تهوية طبيعية مثالية وإطلالات مدروسة، وتوزيع متوازن للغرف ومساحات التخزين والمعيشة."
                  : "Engineered to maximize usable living space, optimize natural sunlight, and facilitate gracious transitions between private sleeping suites and open-concept hospitality areas."}
              </p>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{isAr ? "مخططات معتمدة لدى وزارة الإسكان والتخطيط العمراني" : "Approved by Oman Ministry of Housing"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{isAr ? "مرونة إمكانية التعديل الداخلي في المراحل الإنشائية الأولى" : "Customization options available during early construction"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{isAr ? "عزل صوتي وحراري فائق الجودة متوافق مع كود البناء العماني" : "High-performance thermal and acoustic insulation"}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setFloorPlanModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition hover:brightness-110 active:scale-[0.98]"
                >
                  <Ruler className="h-4 w-4" />
                  <span>{isAr ? "استعراض المخطط بالحجم الكامل" : "View High-Res Blueprint"}</span>
                </button>

                <a
                  href={getWhatsAppInquiryUrl(
                    isAr
                      ? `مرحباً، أود الحصول على نسخة PDF من المخططات الهندسية لمشروع ${title}`
                      : `Hello, please provide the complete PDF floor plan blueprints for ${title}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-slate-900 px-5 py-3 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
                >
                  <Download className="h-4 w-4 text-sky-400" />
                  <span>{isAr ? "طلب ملف المخططات PDF" : "Request PDF Plans"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: VIDEO PRESENTATION
          ========================================================================= */}
      <section className="relative border-t border-white/10 py-20 bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p
              className={`text-xs font-semibold ${
                isAr ? "tracking-normal font-[family-name:var(--font-cairo)]" : "uppercase tracking-[0.25em]"
              } text-sky-400`}
            >
              {copy.videoPresentation || (isAr ? "العرض المرئي للمشروع" : "Video Presentation")}
            </p>
            <h2
              className={`mt-2 ${
                isAr
                  ? "font-[family-name:var(--font-cairo)] tracking-normal"
                  : "font-[family-name:var(--font-outfit)] tracking-tight"
              } text-2xl sm:text-3xl font-bold text-white`}
            >
              {isAr ? "جولة سينمائية تفاعلية في رحاب المشروع" : "Cinematic Video Walkthrough & Tour"}
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-400">
              {copy.videoSubtitle ||
                (isAr
                  ? "جولة سينمائية تفاعلية في رحاب المشروع."
                  : "Experience a cinematic walkthrough of the development.")}
            </p>
          </div>

          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-slate-900 shadow-2xl">
            {videoUrl && videoPlaying ? (
              <div className="relative aspect-video w-full bg-slate-950">
                {/* Top overlay toolbar: Direct Watch on YouTube / External link & Close */}
                <div className="absolute top-3 right-3 left-3 z-20 flex items-center justify-between pointer-events-none">
                  {parsedVideo.watchUrl ? (
                    <a
                      href={parsedVideo.watchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md border border-white/15 hover:bg-slate-900 hover:border-sky-400/60 transition"
                      title={isAr ? "مشاهدة مباشرة على المنصة الأصلية" : "Watch on original platform"}
                    >
                      {parsedVideo.provider === "youtube" ? (
                        <span className="flex items-center gap-1.5 text-red-500">
                          <YouTubeIcon className="h-4 w-4 fill-red-500 text-red-500" />
                          <span className="text-white font-medium">
                            {isAr ? "مشاهدة على يوتيوب" : "Watch on YouTube"}
                          </span>
                        </span>
                      ) : parsedVideo.provider === "vimeo" ? (
                        <span className="flex items-center gap-1.5 text-sky-400">
                          <VimeoIcon className="h-3.5 w-3.5 fill-sky-400 text-sky-400" />
                          <span className="text-white font-medium">
                            {isAr ? "مشاهدة على فيميو" : "Watch on Vimeo"}
                          </span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-sky-400">
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span className="text-white font-medium">
                            {isAr ? "فتح الرابط الخارجي" : "Open Video Directly"}
                          </span>
                        </span>
                      )}
                      <ExternalLink className="h-3 w-3 text-slate-400 ml-0.5 rtl:mr-0.5 rtl:ml-0" />
                    </a>
                  ) : <div />}

                  <button
                    type="button"
                    onClick={() => {
                      setVideoPlaying(false);
                      setVideoLoading(false);
                      setVideoError(false);
                    }}
                    className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-slate-300 shadow-lg backdrop-blur-md border border-white/15 hover:text-white hover:bg-slate-900 hover:border-white/30 transition"
                    title={isAr ? "العودة للغلاف" : "Back to preview"}
                  >
                    <X className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{isAr ? "إغلاق المشغل" : "Close Player"}</span>
                  </button>
                </div>

                {/* Loading state overlay with luxury spinner */}
                {videoLoading && !videoError && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm transition-opacity duration-300">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute -inset-2 rounded-full bg-sky-500/20 blur-md animate-pulse" />
                      <Loader2 className="h-10 w-10 animate-spin text-sky-400 relative z-10" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-white tracking-wide">
                      {isAr ? "جارٍ تحميل العرض السينمائي..." : "Loading Cinematic Tour..."}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {isAr ? "الاتصال بالبث المباشر عالي الدقة" : "Connecting to high-definition video stream"}
                    </p>
                  </div>
                )}

                {/* Fallback error overlay */}
                {videoError || (!parsedVideo.isValid && videoPlaying) ? (
                  <div className="absolute inset-0 z-15 flex flex-col items-center justify-center bg-slate-950/95 p-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
                      <AlertCircle className="h-7 w-7" />
                    </div>
                    <h4 className="mt-4 text-lg font-bold text-white">
                      {isAr ? "تعذر تشغيل العرض المضمن مباشرة" : "Direct Video Player Unavailable"}
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
                      {isAr
                        ? "قد تفرض قيود الشبكة أو المتصفح حظراً على التضمين الداخلي للمقطع. يمكنك مشاهدة العرض السينمائي كاملاً مباشرة على المنصة الأصلية."
                        : "Your browser or network policy may restrict direct video embedding. You can view the full cinematic presentation in high definition on the source platform."}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      {parsedVideo.watchUrl && (
                        <a
                          href={parsedVideo.watchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:brightness-110 active:scale-95 transition"
                        >
                          {parsedVideo.provider === "youtube" ? (
                            <YouTubeIcon className="h-4 w-4 fill-slate-950" />
                          ) : (
                            <ExternalLink className="h-4 w-4" />
                          )}
                          <span>
                            {isAr ? "فتح العرض على يوتيوب ↗" : "Watch Directly on YouTube ↗"}
                          </span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={handleRetryVideo}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>{isAr ? "إعادة المحاولة" : "Retry Player"}</span>
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Active Player Renderers */}
                {parsedVideo.provider === "youtube" && parsedVideo.embedUrl ? (
                  <iframe
                    key={`yt-player-${videoKey}`}
                    src={parsedVideo.embedUrl}
                    title={`${title} Video Tour`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    loading="lazy"
                    onLoad={() => setVideoLoading(false)}
                    onError={() => {
                      setVideoLoading(false);
                      setVideoError(true);
                    }}
                    className="h-full w-full border-0"
                  />
                ) : parsedVideo.provider === "vimeo" && parsedVideo.embedUrl ? (
                  <iframe
                    key={`vimeo-player-${videoKey}`}
                    src={parsedVideo.embedUrl}
                    title={`${title} Video Tour`}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    loading="lazy"
                    onLoad={() => setVideoLoading(false)}
                    onError={() => {
                      setVideoLoading(false);
                      setVideoError(true);
                    }}
                    className="h-full w-full border-0"
                  />
                ) : (
                  <video
                    src={parsedVideo.embedUrl || videoUrl}
                    controls
                    autoPlay
                    onLoadedData={() => setVideoLoading(false)}
                    onError={() => {
                      setVideoLoading(false);
                      setVideoError(true);
                    }}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            ) : (
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={gallery[1] || gallery[0] || project.image}
                  alt={`${title} Video Preview`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <button
                    type="button"
                    onClick={handleStartVideo}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 shadow-[0_0_35px_rgba(56,189,248,0.5)] transition hover:scale-110 active:scale-95"
                    aria-label="Play Video"
                  >
                    <Play className="h-8 w-8 fill-slate-950 ml-1 rtl:mr-1 rtl:ml-0" />
                  </button>
                  <h3 className="mt-5 font-[family-name:var(--font-outfit)] text-xl sm:text-2xl font-bold text-white">
                    {videoUrl
                      ? isAr
                        ? "تشغيل العرض المرئي الكامل"
                        : "Play Cinematic Presentation"
                      : isAr
                      ? "طلب جولة افتراضية خاصة عبر الفيديو"
                      : "Request Private Virtual Video Walkthrough"}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-md">
                    {videoUrl
                      ? isAr
                        ? "استمتع بمشاهدة التفاصيل المعمارية والمرافق بأعلى درجات الدقة."
                        : "Watch high-definition architectural renderings and community vistas."
                      : isAr
                      ? "تواصل مع خبرائنا للحصول على جولة مصورة حصرية ومباشرة للمشروع."
                      : "Connect with our advisory consultants for an exclusive private video consultation."}
                  </p>

                  {/* Secondary direct YouTube action if URL is available */}
                  {parsedVideo.isValid && parsedVideo.watchUrl && (
                    <div className="mt-4">
                      <a
                        href={parsedVideo.watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/60 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm hover:border-sky-400/50 hover:text-white transition"
                      >
                        {parsedVideo.provider === "youtube" ? (
                          <YouTubeIcon className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                        ) : (
                          <ExternalLink className="h-3.5 w-3.5 text-sky-400" />
                        )}
                        <span>
                          {isAr ? "أو شاهد مباشرة على يوتيوب" : "Or open directly on YouTube"}
                        </span>
                        <ExternalLink className="h-3 w-3 text-slate-400" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: PROJECT LOCATION & CONNECTIVITY
          ========================================================================= */}
      <section className="relative border-t border-white/10 py-20 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            {/* Left Location Landmarks Grid (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div
                className={`inline-flex items-center gap-2 text-xs font-semibold ${
                  isAr ? "tracking-normal font-[family-name:var(--font-cairo)]" : "uppercase tracking-[0.25em]"
                } text-sky-400`}
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  {copy.nearbyAttractions || (isAr ? "الموقع والمعالم القريبة" : "Location & Nearby Attractions")}
                </span>
              </div>
              <h2
                className={`text-2xl sm:text-3xl font-bold text-white ${
                  isAr
                    ? "font-[family-name:var(--font-cairo)] tracking-normal"
                    : "font-[family-name:var(--font-outfit)] tracking-tight"
                }`}
              >
                {isAr
                  ? `موقع استراتيجي متميز في ${project.formatted_address || location}`
                  : `Strategic Position & Prime Connectivity in ${project.formatted_address || location}`}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {copy.nearbyAttractionsSubtitle ||
                  (isAr
                    ? "استكشف أبرز المرافق الحيوية ووجهات الترفيه وشبكات النقل المحيطة بالمشروع."
                    : "Explore essential amenities, transit connections and cultural landmarks surrounding this development.")}
              </p>

              {/* Precise Coordinates & Address Badge if available */}
              {(project.formatted_address || (project.latitude && project.longitude)) && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {project.formatted_address && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 text-slate-300">
                      <MapPin className="h-3.5 w-3.5 text-sky-400" />
                      <span>{project.formatted_address}</span>
                    </span>
                  )}
                  {project.latitude && project.longitude && (
                    <span className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 font-mono text-[11px] text-sky-400">
                      <span>{project.latitude.toFixed(4)}, {project.longitude.toFixed(4)}</span>
                    </span>
                  )}
                </div>
              )}

              {/* Surrounding Attractions & Travel Time Cards */}
              <div className="space-y-3 pt-2">
                {nearbyLandmarks.map((lm, idx) => {
                  const placeName = isAr
                    ? lm.name_ar || lm.nameAr || localizeToArabic(lm.name, lm.name)
                    : lm.name;
                  const timeDisplay = isAr
                    ? lm.timeAr ||
                      (lm.travel_time_text
                        ? localizeToArabic(lm.travel_time_text)
                        : lm.time
                        ? localizeToArabic(lm.time)
                        : undefined)
                    : lm.travel_time_text || lm.time;
                  const placeCat = isAr ? localizeToArabic(lm.category, lm.category) : lm.category;

                  return (
                    <div
                      key={lm.id || idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-3.5 backdrop-blur-md transition hover:border-sky-400/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                          <Compass className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-xs sm:text-sm font-semibold text-white"
                              dir={isAr && !hasArabicText(placeName) ? "ltr" : undefined}
                            >
                              {placeName}
                            </span>
                            {placeCat && (
                              <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[9px] font-bold text-sky-300 uppercase">
                                {placeCat}
                              </span>
                            )}
                          </div>
                          {lm.distance_km && (
                            <span className="font-mono text-[11px] text-amber-400">
                              {lm.distance_km} {copy.distanceKm || (isAr ? "كم" : "km")}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        {timeDisplay && (
                          <span
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-300"
                            dir={isAr && !hasArabicText(timeDisplay) ? "ltr" : undefined}
                          >
                            <Clock className="h-3.5 w-3.5 text-amber-400" />
                            <span>{timeDisplay}</span>
                          </span>
                        )}

                        {lm.google_maps_url && (
                          <a
                            href={lm.google_maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-sky-400 hover:bg-sky-500/20 transition"
                          >
                            <span>{copy.navigateThere || (isAr ? "الاتجاهات" : "Directions")}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <a
                  href={
                    project.google_maps_url ||
                    (project.latitude && project.longitude
                      ? `https://www.google.com/maps/search/?api=1&query=${project.latitude},${project.longitude}`
                      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${title} ${location}`)}`)
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition underline underline-offset-4"
                >
                  <span>{copy.openInGoogleMaps || (isAr ? "فتح الموقع على خرائط جوجل" : "Open Location in Google Maps")}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Right Map Preview Box (6 cols) */}
            <div className="lg:col-span-6 relative">
              <div className="relative h-[380px] sm:h-[450px] w-full overflow-hidden rounded-3xl border border-white/15 bg-slate-950 shadow-2xl">
                {/* Styled iframe / interactive map preview */}
                <iframe
                  title={`${title} Map View`}
                  src={
                    project.latitude && project.longitude
                      ? `https://maps.google.com/maps?q=${project.latitude},${project.longitude}&z=14&output=embed`
                      : `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`
                  }
                  className="h-full w-full border-0 filter invert contrast-[0.9] opacity-80"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-slate-950/90 p-4 backdrop-blur-md border border-white/10">
                  <div className="min-w-0 pr-2">
                    <p className="truncate text-xs font-bold text-white">{title}</p>
                    <p className="truncate text-[11px] text-slate-400">{project.formatted_address || location}</p>
                  </div>
                  <a
                    href={
                      project.google_maps_url ||
                      (project.latitude && project.longitude
                        ? `https://www.google.com/maps/search/?api=1&query=${project.latitude},${project.longitude}`
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${title} ${location}`)}`)
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400 transition"
                  >
                    {isAr ? "عرض الخريطة" : "Explore Map"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: INVESTMENT INFORMATION & PAYMENT MILESTONES
          ========================================================================= */}
      {project.investment_enabled !== false && (milestonesList.length > 0 || project.mortgage_enabled === true) && (
        <section id="project-investment" className="relative border-t border-white/10 py-20 bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p
                className={`text-xs font-semibold ${
                  isAr ? "tracking-normal font-[family-name:var(--font-cairo)]" : "uppercase tracking-[0.25em]"
                } text-amber-400`}
              >
                {isAr
                  ? project.investment_label_ar ||
                    project.investment_label ||
                    copy.investment ||
                    "الاستثمار وخطة السداد"
                  : project.investment_label || copy.investment || "Investment & Payment Plan"}
              </p>
              <h2
                className={`mt-2 ${
                  isAr
                    ? "font-[family-name:var(--font-cairo)] tracking-normal"
                    : "font-[family-name:var(--font-outfit)] tracking-tight"
                } text-2xl sm:text-3xl font-bold text-white`}
              >
                {isAr
                  ? project.investment_heading_ar ||
                    project.investment_heading ||
                    "دفعات ميسرة وفرص استثمارية واعدة"
                  : project.investment_heading || "Transparent Milestones & Investor Security"}
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-400">
                {isAr
                  ? project.investment_subtitle_ar ||
                    project.investment_subtitle ||
                    copy.investmentSubtitle ||
                    "دفعات ميسرة وفرص تملك استثمارية ذات عوائد مجزية ومستدامة."
                  : project.investment_subtitle ||
                    copy.investmentSubtitle ||
                    "Flexible payment milestones and high-yield ownership opportunities."}
              </p>
            </div>

            {/* Dynamic Payment Milestone Cards & Mortgage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
              {milestonesList.map((m, idx) => {
                const stepNum = m.step_number || String(idx + 1).padStart(2, "0");
                const mTitle = isAr
                  ? m.title_ar || m.titleAr || localizeToArabic(m.title, m.title)
                  : m.title;
                const rawMDesc = m.description || "";
                const mDescAr = m.description_ar || m.descriptionAr;
                const hasMAr = Boolean(mDescAr) || hasArabicText(rawMDesc);
                const mDesc = isAr ? (mDescAr || rawMDesc) : rawMDesc;
                const isFallbackEnInAr = isAr && !hasMAr && Boolean(rawMDesc);

                return (
                  <div
                    key={m.id || idx}
                    className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md relative overflow-hidden group hover:border-sky-400/30 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-[family-name:var(--font-outfit)] text-4xl font-extrabold text-sky-400/20 absolute top-4 right-4 rtl:left-4 rtl:right-auto">
                        {stepNum}
                      </span>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 border border-sky-400/20">
                          {renderMilestoneIcon(m.icon, "h-4 w-4")}
                        </div>
                        <p className="text-xs font-bold uppercase tracking-wider text-sky-400">
                          {isAr ? `المرحلة ${stepNum}: ${mTitle}` : `Step ${stepNum}: ${mTitle}`}
                        </p>
                      </div>
                      <p className="font-[family-name:var(--font-outfit)] text-3xl font-black text-white mt-2">
                        {m.percentage}
                      </p>
                      {mDesc && (
                        <p
                          dir={isFallbackEnInAr ? "ltr" : undefined}
                          className={`mt-2 text-xs text-slate-400 leading-relaxed ${
                            isFallbackEnInAr ? "text-left [unicode-bidi:isolate]" : ""
                          }`}
                        >
                          {mDesc}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Optional Independent Bank Mortgage Card */}
              {project.mortgage_enabled === true && (
                <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent p-6 backdrop-blur-md relative overflow-hidden group hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <span className="font-[family-name:var(--font-outfit)] text-4xl font-extrabold text-amber-400/20 absolute top-4 right-4 rtl:left-4 rtl:right-auto">
                      🏦
                    </span>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400/30">
                        <Landmark className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        {isAr
                          ? project.mortgage_title_ar || "التمويل البنكي"
                          : project.mortgage_title || "Bank Mortgages"}
                      </p>
                    </div>
                    <p className="font-[family-name:var(--font-outfit)] text-2xl font-black text-amber-300 mt-2">
                      {isAr
                        ? project.mortgage_status_ar || localizeToArabic(project.mortgage_status, "معتمد بنكياً")
                        : project.mortgage_status || "Bank Approved"}
                    </p>
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                      {isAr
                        ? project.mortgage_description_ar ||
                          "تسهيلات تمويلية ميسرة وخيارات مرنة عبر البنوك العمانية الرائدة."
                        : project.mortgage_description ||
                          "Mortgage eligibility and financing facilitation across leading Omani banks."}
                    </p>
                  </div>
                  {project.mortgage_banks && (
                    <div className="mt-4 pt-3 border-t border-amber-400/20">
                      <p className="text-[11px] font-semibold text-amber-200/90 leading-tight" dir="auto">
                        {project.mortgage_banks}
                      </p>
                      {project.mortgage_additional_info && (
                        <p className="mt-1 text-[10px] text-slate-400 leading-relaxed" dir="auto">
                          {project.mortgage_additional_info}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 4 Pillars of Oman Investment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <ShieldCheck className="h-6 w-6 text-emerald-400 mb-3" />
                <h3 className="font-[family-name:var(--font-outfit)] text-sm font-bold text-white">
                  {copy.freehold || (isAr ? "تملك حر بنسبة 100%" : "100% Freehold Ownership")}
                </h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {copy.freeholdDesc ||
                    (isAr
                      ? "متاح للمواطنين والخليجيين والمستثمرين الدوليين."
                      : "Available for Omani, GCC and international investors.")}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <Sparkles className="h-6 w-6 text-sky-400 mb-3" />
                <h3 className="font-[family-name:var(--font-outfit)] text-sm font-bold text-white">
                  {copy.residency || (isAr ? "إقامة مستثمر عقاري" : "Investor Residency")}
                </h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {copy.residencyDesc ||
                    (isAr
                      ? "مؤهل للحصول على تأشيرة الإقامة العقارية في سلطنة عمان للمشترين."
                      : "Qualifies for Oman investor visa upon purchase.")}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <Building2 className="h-6 w-6 text-amber-400 mb-3" />
                <h3 className="font-[family-name:var(--font-outfit)] text-sm font-bold text-white">
                  {copy.escrow || (isAr ? "حساب ضمان مصرفي معتمد" : "Escrow Account Protection")}
                </h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {copy.escrowDesc ||
                    (isAr
                      ? "حماية كاملة لأموال المشترين تحت إشراف وزارة الإسكان والتخطيط العمراني."
                      : "Regulated development safeguards under Oman Housing Ministry.")}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <Coins className="h-6 w-6 text-cyan-400 mb-3" />
                <h3 className="font-[family-name:var(--font-outfit)] text-sm font-bold text-white">
                  {copy.zeroTax || (isAr ? "إعفاء ضريبي 0%" : "0% Personal Income Tax")}
                </h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {copy.zeroTaxDesc ||
                    (isAr
                      ? "لا توجد ضريبة على الدخل الشخصي أو الأرباح الرأسمالية في سلطنة عمان."
                      : "No personal income or capital gains tax in Oman.")}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 11: BROCHURE DOWNLOAD
          ========================================================================= */}
      <section className="relative border-t border-white/10 py-16 bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 p-8 sm:p-12 shadow-2xl">
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-8 space-y-3">
                <span
                  className={`rounded-full bg-amber-400/10 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-300 ${
                    isAr ? "tracking-normal font-[family-name:var(--font-cairo)]" : "uppercase"
                  }`}
                >
                  {copy.brochure || (isAr ? "كتيب المشروع الرسمي" : "Official Project Brochure")}
                </span>
                <h2
                  className={`text-2xl sm:text-3xl font-extrabold text-white ${
                    isAr
                      ? "font-[family-name:var(--font-cairo)] tracking-normal text-right"
                      : "font-[family-name:var(--font-outfit)] tracking-tight text-left"
                  }`}
                >
                  {isAr
                    ? `احصل على الكتيب التعريفي الشامل لمشروع ${title}`
                    : `Download the Comprehensive Brochure for ${title}`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {copy.brochureSubtitle ||
                    (isAr
                      ? "تحميل المواصفات الكاملة والمخطط العام ومخططات الطوابق وقائمة الأسعار المحدثة."
                      : "Download complete specifications, master plans, floor layouts, and updated price lists.")}
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (project.brochure_url) {
                      window.open(project.brochure_url, "_blank");
                    } else {
                      setBrochureRequested(true);
                      scrollToEnquiry(isAr ? "طلب الكتيب التعريفي الكامل PDF" : "Full PDF Brochure Request");
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-4 text-xs sm:text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(251,191,36,0.35)] transition hover:brightness-110 active:scale-[0.98]"
                >
                  <Download className="h-4 w-4" />
                  <span>
                    {copy.downloadBrochure || (isAr ? "تحميل الكتيب الآن" : "Download PDF Brochure")}
                  </span>
                </button>

                <a
                  href={getWhatsAppInquiryUrl(
                    isAr
                      ? `مرحباً، أرجو تزويدي بالكتيب التعريفي الشامل لمشروع ${title} بصيغة PDF`
                      : `Hello, please send the official PDF brochure for ${title}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
                >
                  <WhatsAppIcon className="h-4 w-4 fill-slate-200" />
                  <span>{isAr ? "طلب الكتيب عبر واتساب" : "Request via WhatsApp"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 12: PROJECT ENQUIRY FORM
          ========================================================================= */}
      <section
        id="project-enquiry-section"
        className="relative scroll-mt-24 border-t border-white/10 py-20 bg-[#050816]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 rounded-3xl border border-white/15 bg-slate-900/80 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
              <p
                className={`text-xs font-semibold ${
                  isAr ? "tracking-normal font-[family-name:var(--font-cairo)]" : "uppercase tracking-[0.25em]"
                } text-sky-400`}
              >
                {copy.enquiryTitle || (isAr ? "سجّل اهتمامك بالمشروع" : "Register Your Interest")}
              </p>
              <h2
                className={`mt-2 ${
                  isAr
                    ? "font-[family-name:var(--font-cairo)] tracking-normal"
                    : "font-[family-name:var(--font-outfit)] tracking-tight"
                } text-2xl sm:text-3xl font-bold text-white`}
              >
                {isAr ? "تواصل مباشرة مع فريق المستشارين" : "Connect with Our Advisory Desk"}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-400">
                {copy.enquirySubtitle ||
                  (isAr
                    ? "تواصل مباشرة مع مستشارينا لمعرفة التوافر والحصول على استشارة عقارية مجانية."
                    : "Connect directly with our real estate advisory team for availability and offers.")}
              </p>

              {/* Status Alert */}
              {formStatus && (
                <div
                  className={`mt-6 rounded-2xl p-4 text-xs font-semibold ${
                    formStatus.type === "success"
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                  }`}
                >
                  {formStatus.text}
                </div>
              )}

              <form onSubmit={handleEnquirySubmit} className="mt-6 space-y-4">
                {/* Pre-filled Project Title & Configuration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block text-xs font-medium text-slate-300">
                    {isAr ? "المشروع المحدد" : "Selected Property"}
                    <input
                      type="text"
                      readOnly
                      value={title}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-xs font-semibold text-sky-400 outline-none"
                    />
                  </label>

                  <label className="block text-xs font-medium text-slate-300">
                    {isAr ? "نموذج الوحدة المفضل" : "Preferred Configuration"}
                    <select
                      value={enquiryConfig}
                      onChange={(e) => setEnquiryConfig(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-xs font-semibold text-white outline-none focus:border-sky-400/50"
                    >
                      <option value="General Inquiry">
                        {isAr ? "استفسار عام عن المشروع" : "General Project Inquiry"}
                      </option>
                      {configurations.map((c, i) => (
                        <option
                          key={i}
                          value={isAr ? c.titleAr || c.title : c.title}
                        >
                          {isAr ? c.titleAr || c.title : c.title}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {/* Name */}
                <label className="block text-xs font-medium text-slate-300">
                  {isAr ? "الاسم الكامل" : "Full Name"} *
                  <input
                    required
                    name="name"
                    placeholder={isAr ? "أدخل اسمك الكريم" : "Your full name"}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10"
                  />
                </label>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block text-xs font-medium text-slate-300">
                    {isAr ? "البريد الإلكتروني" : "Email Address"} *
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="name@company.com"
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10"
                    />
                  </label>

                  <label className="block text-xs font-medium text-slate-300">
                    {isAr ? "رقم الهاتف / واتساب" : "Phone / WhatsApp Number"} *
                    <div className="mt-1.5 flex gap-2">
                      <CountryCodeSelector
                        value={inquiryCountryCode}
                        onChange={setInquiryCountryCode}
                        isAr={isAr}
                      />
                      <input
                        required
                        type="tel"
                        name="phone"
                        dir="ltr"
                        placeholder={inquiryCountryCode === "+968" ? "9123 4567" : "1234 5678"}
                        className="flex-1 min-w-0 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10"
                      />
                    </div>
                  </label>
                </div>

                {/* Preferred Contact Method */}
                <label className="block text-xs font-medium text-slate-300">
                  {isAr ? "وسيلة التواصل المفضلة" : "Preferred Contact Method"}
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {["WhatsApp", isAr ? "اتصال هاتفي" : "Phone Call", "Email"].map((method, idx) => (
                      <label
                        key={idx}
                        className="flex cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 p-2.5 text-xs text-slate-300 transition hover:bg-white/5 has-[:checked]:border-sky-400 has-[:checked]:bg-sky-500/10 has-[:checked]:text-sky-300"
                      >
                        <input
                          type="radio"
                          name="preferred_method"
                          value={method}
                          defaultChecked={idx === 0}
                          className="sr-only"
                        />
                        <span>{method}</span>
                      </label>
                    ))}
                  </div>
                </label>

                {/* Message */}
                <label className="block text-xs font-medium text-slate-300">
                  {isAr ? "ملاحظات أو استفسارات خاصة (اختياري)" : "Message or Inquiries (Optional)"}
                  <textarea
                    rows={3}
                    name="message"
                    placeholder={
                      isAr
                        ? "أخبرنا عن متطلباتك وموعد الانتقال أو الاستثمار المتوقع..."
                        : "Tell us about your requirements, timeline, or preferred payment options..."
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10"
                  />
                </label>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 px-6 py-4 text-xs sm:text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(56,189,248,0.35)] transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>
                    {formSubmitting
                      ? isAr
                        ? "جاري إرسال الاستفسار..."
                        : "Submitting Enquiry..."
                      : isAr
                      ? "إرسال الاستفسار الآن"
                      : "Submit Property Enquiry"}
                  </span>
                </button>
              </form>
            </div>

            {/* Direct Contact & WhatsApp Help Card (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 sm:p-8 backdrop-blur-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 mb-4 shadow-lg shadow-emerald-500/20">
                  <WhatsAppIcon className="h-7 w-7" />
                </div>
                <h3 className="font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-xl font-bold text-white">
                  {isAr ? "محادثة فورية مع مستشاري العقار" : "Direct WhatsApp Brokerage Desk"}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {isAr
                    ? "هل تفضل الرد الفوري المباشر؟ تواصل معنا مباشرة عبر واتساب لتلقي الأسعار والمخططات فوراً."
                    : "Prefer immediate answers? Message our licensed property brokers directly on WhatsApp for real-time availability."}
                </p>

                <a
                  href={getWhatsAppInquiryUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-emerald-500 px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition hover:bg-emerald-400 active:scale-[0.98]"
                >
                  <WhatsAppIcon className="h-4 w-4 fill-slate-950" />
                  <span>{isAr ? "مراسلة عبر واتساب الآن" : "Message on WhatsApp Now"}</span>
                </a>
              </div>

              {/* Office Address & Phone Card */}
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                  {isAr ? "مقر الشركة والخط المباشر" : "Direct Headquarters Lines"}
                </h4>
                <div className="space-y-3 text-xs sm:text-sm">
                  <a
                    href="tel:+96897300200"
                    className="flex items-center gap-3 text-slate-200 hover:text-sky-300 transition"
                  >
                    <Phone className="h-4 w-4 text-sky-400 shrink-0" />
                    <span dir="ltr">+968 97300200</span>
                  </a>
                  <a
                    href="mailto:info@gardencityproperties.net"
                    className="flex items-center gap-3 text-slate-200 hover:text-sky-300 transition"
                  >
                    <FileText className="h-4 w-4 text-sky-400 shrink-0" />
                    <span>info@gardencityproperties.net</span>
                  </a>
                  <a
                    href="https://maps.app.goo.gl/2hPDjkPfGt424wNA7?g_st=aw"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={isAr ? "موقع مقر الشركة على خرائط Google" : "Headquarters Location on Google Maps"}
                    className="flex items-start gap-3 text-slate-200 hover:text-[#d4af37] transition group cursor-pointer"
                  >
                    <MapPin className="h-4 w-4 text-[#d4af37] shrink-0 mt-0.5 transition-transform group-hover:scale-110" />
                    <span className="leading-snug break-words transition-colors group-hover:text-[#d4af37] group-hover:underline underline-offset-4 decoration-[#d4af37]/40">
                      {isAr
                        ? "مكتب رقم 11، ص.ب 275، الرمز البريدي 117، الموالح الشمالية، سلطنة عمان"
                        : "Office No 11, Po Box 275, Pc 117, Mawelah North, Sultanate Oman"}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 13: RELATED PROJECTS
          ========================================================================= */}
      {relatedProjects && relatedProjects.length > 0 && (
        <section className="relative border-t border-white/10 py-20 bg-slate-950/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
                  {copy.relatedProjects || (isAr ? "مشاريع وتطويرات مشابهة" : "Related Developments")}
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-2xl sm:text-3xl font-bold text-white">
                  {isAr ? "فرص استثمارية أخرى مميزة في محفظتنا" : "Explore More Opportunities in Oman"}
                </h2>
              </div>
              <Link
                href={`/${locale}/projects/`}
                className="mt-3 md:mt-0 text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1.5 transition"
              >
                <span>{isAr ? "عرض جميع المشاريع" : "View All Developments"}</span>
                {isAr ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.slice(0, 3).map((rel) => (
                <article
                  key={rel.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/40 hover:shadow-2xl"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                    <PropertyImage
                      src={rel.image}
                      alt={rel.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={85}
                      fallbackLabel={rel.name}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 right-3 text-xs font-semibold text-amber-400">
                      {localizeField(rel.price, locale, rel.price)}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <h3
                        className="font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-lg font-bold text-white line-clamp-1"
                        dir={isAr && !hasArabicText(localizeProjectName(rel.name, rel.name_ar || rel.nameAr, locale)) ? "ltr" : undefined}
                      >
                        {localizeProjectName(rel.name, rel.name_ar || rel.nameAr, locale)}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                        <span
                          dir={hasArabicText(localizeDeveloper(rel.developer, rel.developer_ar, locale)) ? "rtl" : "ltr"}
                          className="[unicode-bidi:isolate]"
                        >
                          {localizeDeveloper(rel.developer, rel.developer_ar, locale)}
                        </span>
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                      <Link
                        href={`/${locale}/projects/${rel.id}/`}
                        prefetch={true}
                        className="inline-flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300 transition"
                      >
                        <span>{isAr ? "تفاصيل المشروع" : "Explore Project"}</span>
                        {isAr ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                      </Link>

                      <a
                        href={getProjectWhatsAppUrl({
                          projectName: localizeProjectName(rel.name, rel.name_ar || rel.nameAr, locale),
                          location: localizeLocation(rel.location, rel.location_ar, locale),
                          price: localizeField(rel.price, locale, rel.price),
                          developer: localizeDeveloper(rel.developer, rel.developer_ar, locale),
                          whatsapp_number: rel.whatsapp_number,
                          locale: isAr ? "ar" : "en",
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-emerald-500/20 border border-emerald-500/30 p-2 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition"
                        aria-label="WhatsApp"
                      >
                        <WhatsAppIcon className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          FULL-SCREEN GALLERY LIGHTBOX MODAL
          ========================================================================= */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-xl p-4 sm:p-6"
            onClick={closeLightbox}
          >
            {/* Top Toolbar */}
            <div
              className="flex w-full max-w-7xl items-center justify-between z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-xs font-medium text-slate-300">
                <span className="font-bold text-white">{title}</span> —{" "}
                <span>
                  {lightboxIndex + 1} {copy.imageOf || (isAr ? "من" : "of")} {gallery.length}
                </span>
              </div>
              <button
                type="button"
                onClick={closeLightbox}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Lightbox Image Stage with Prev/Next Controls */}
            <div
              className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button */}
              <button
                type="button"
                onClick={prevLightboxImage}
                className="absolute left-2 sm:left-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-slate-950/70 border border-white/20 text-white hover:bg-slate-900 transition"
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6 rtl:rotate-180" />
              </button>

              {/* Main Image */}
              <div className="relative h-full w-full max-h-[75vh] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={gallery[lightboxIndex]}
                  alt={`${title} enlarged`}
                  className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
                />
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={nextLightboxImage}
                className="absolute right-2 sm:right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-slate-950/70 border border-white/20 text-white hover:bg-slate-900 transition"
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6 rtl:rotate-180" />
              </button>
            </div>

            {/* Thumbnail Strip along Bottom */}
            <div
              className="flex w-full max-w-4xl items-center justify-center gap-2 overflow-x-auto py-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {gallery.map((thumb, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    lightboxIndex === idx ? "border-sky-400 scale-105" : "border-white/20 opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={thumb}
                    alt={`thumb ${idx}`}
                    fill
                    sizes="80px"
                    quality={75}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          FULL-SCREEN FLOOR PLAN BLUEPRINT MODAL
          ========================================================================= */}
      <AnimatePresence>
        {floorPlanModalOpen && (() => {
          const currentModalPlanCandidate =
            selectedConfigModal?.floor_plan_url ||
            selectedConfigModal?.floorPlanUrl ||
            (selectedConfigModal as Record<string, unknown> | null)?.floor_plan ||
            (selectedConfigModal as Record<string, unknown> | null)?.floorplan_url ||
            (selectedConfigModal as Record<string, unknown> | null)?.floorplan ||
            activeConf?.floor_plan_url ||
            activeConf?.floorPlanUrl ||
            floorPlanUrl ||
            gallery[0] ||
            project.image ||
            "";
          const currentFullscreenPlan: string =
            typeof currentModalPlanCandidate === "string"
              ? toDirectDriveImageUrl(currentModalPlanCandidate) || currentModalPlanCandidate
              : "";
          const unitTitle = selectedConfigModal
            ? (isAr
                ? selectedConfigModal.name_ar || selectedConfigModal.titleAr || selectedConfigModal.name || selectedConfigModal.title
                : selectedConfigModal.name || selectedConfigModal.title)
            : title;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-6"
              onClick={() => setFloorPlanModalOpen(false)}
            >
              <div
                className="relative flex flex-col w-full max-w-6xl max-h-[92vh] rounded-3xl border border-white/15 bg-slate-950 p-6 overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-emerald-400" />
                    <h3 className="font-[family-name:var(--font-outfit)] text-base font-bold text-white">
                      {unitTitle} — {copy.floorPlans || (isAr ? "المخطط الهندسي الكامل" : "Architectural Blueprint")}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFloorPlanModalOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="relative flex-1 w-full min-h-[300px] sm:min-h-[500px] flex items-center justify-center bg-slate-900 rounded-2xl p-4 overflow-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentFullscreenPlan}
                    alt={`${unitTitle} Blueprint Fullscreen`}
                    className="max-h-[70vh] max-w-full object-contain"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {isAr ? "مخطط معتمد عالي الدقة" : "High-Resolution Architectural Drawing"}
                  </span>
                  <a
                    href={currentFullscreenPlan}
                    download={`${unitTitle}-floorplan`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 font-bold text-slate-950 hover:bg-emerald-400 transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{isAr ? "تحميل المخطط" : "Download Blueprint"}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
