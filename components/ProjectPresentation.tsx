"use client";

import { useState, useEffect, useCallback, useId, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
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
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface PropertyConfiguration {
  id?: string;
  type: string;
  title: string;
  titleAr?: string;
  bedrooms: number | string;
  bathrooms: number | string;
  bua: string;
  plot?: string;
  price?: string;
  floorPlanUrl?: string;
  description?: string;
  descriptionAr?: string;
}

export interface AmenityItem {
  icon?: string;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
}

export interface NearbyLocation {
  name: string;
  nameAr?: string;
  time: string;
  timeAr?: string;
  category?: string;
}

export interface ProjectData {
  id: string;
  name: string;
  price?: string;
  payment_plan?: string;
  paymentPlan?: string;
  area?: string;
  site_area?: string;
  developer?: string;
  image: string;
  gallery_urls?: string[];
  galleryUrls?: string[];
  floor_plan_url?: string;
  floorPlanUrl?: string;
  location?: string;
  completion_date?: string;
  completionDate?: string;
  construction_stage?: string;
  constructionStage?: string;
  status?: string;
  type?: string;
  property_type?: string;
  structure?: string;
  description?: string;
  hero_video_url?: string;
  brochure_url?: string;
  amenities?: AmenityItem[];
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

  // Unified specs & safe fallbacks
  const title = project.name;
  const developer = project.developer || (isAr ? "مطور عقاري رائد" : "Premier Master Developer");
  const price = project.price || (isAr ? "السعر عند الطلب" : "Price on Application");
  const paymentPlan =
    project.payment_plan ||
    project.paymentPlan ||
    (isAr ? "20% مقدم / 80% على مراحل الإنجاز" : "20% Down / 80% Milestone Linked");
  const area = project.area || (isAr ? "تبدأ من 85 م²" : "From 85 m²");
  const location = project.location || (isAr ? "مسقط، سلطنة عمان" : "Muscat, Sultanate of Oman");
  const completionDate =
    project.completion_date || project.completionDate || (isAr ? "الربع الرابع 2026" : "Q4 2026");
  const constructionStage =
    project.construction_stage ||
    project.constructionStage ||
    (isAr ? "أعمال الأساسات والإنشاءات" : "Active Construction");
  const status = project.status || (isAr ? "متاح للحجز الحصري" : "Exclusive Pre-Launch");
  const type =
    project.type ||
    project.property_type ||
    (isAr ? "مشروع سكني واستثماري متكامل" : "Master-Planned Residential & Mixed-Use");
  const structure =
    project.structure ||
    (isAr ? "تشطيبات عصرية بمعايير عالمية فاخرة" : "Contemporary Luxury Architectural Finishes");

  const floorPlanUrl = project.floor_plan_url || project.floorPlanUrl;

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

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") isAr ? nextLightboxImage() : prevLightboxImage();
      if (e.key === "ArrowRight") isAr ? prevLightboxImage() : nextLightboxImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, isAr, prevLightboxImage, nextLightboxImage]);

  // Floor plan enlarged preview modal state
  const [floorPlanModalOpen, setFloorPlanModalOpen] = useState(false);

  // Video modal / state
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoUrl = project.hero_video_url;

  // Form state
  const [enquiryConfig, setEnquiryConfig] = useState<string>(
    activeConf ? (isAr ? activeConf.titleAr || activeConf.title : activeConf.title) : ""
  );
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  // Brochure modal / feedback
  const [brochureRequested, setBrochureRequested] = useState(false);

  // WhatsApp inquiry URL generator
  const getWhatsAppInquiryUrl = (customText?: string) => {
    const text =
      customText ||
      (isAr
        ? `مرحباً، أود الاستفسار عن تفاصيل مشروع ${title} في ${location}.`
        : `Hello Garden City Properties, I would like to inquire about ${title} in ${location}.`);
    return `https://wa.me/message/BACRFFVZ3LOXH1?text=${encodeURIComponent(text)}`;
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
    const clientPhone = String(formData.get("phone") || "").trim();
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

  // Amenities list
  const amenitiesList: AmenityItem[] =
    Array.isArray(project.amenities) && project.amenities.length > 0
      ? project.amenities
      : [
          {
            icon: "Waves",
            name: "Infinity Edge Swimming Pool",
            nameAr: "مسبح إنفينيتي بإطلالة بانورامية",
            description: "Temperature-controlled swimming pool with dedicated resort-style sun deck.",
            descriptionAr: "مسبح يتم التحكم في درجة حرارته مع تراس استجمام شمسي على الطراز الفندقي.",
          },
          {
            icon: "Dumbbell",
            name: "State-of-the-Art Fitness Center",
            nameAr: "صالة لياقة بدنية ونادٍ صحي متكامل",
            description: "Equipped with high-end cardio and strength machinery with personal trainer suites.",
            descriptionAr: "مجهزة بأحدث أجهزة تمارين اللياقة والقوة مع غرف تدريب متخصصة.",
          },
          {
            icon: "Trees",
            name: "Landscaped Parks & Jogging Track",
            nameAr: "حدائق خضراء ومسارات مشي وركض",
            description: "Lush botanical gardens, shaded walking promenades, and serene open-air pavilions.",
            descriptionAr: "حدائق نباتية غناء ومسارات مشي مظللة وجلسات خارجية هادئة.",
          },
          {
            icon: "ShieldCheck",
            name: "24/7 Gated Security & Concierge",
            nameAr: "أمن وحراسة على مدار الساعة وخدمة استقبال",
            description: "Access-controlled entry gates, AI-enhanced surveillance, and round-the-clock reception.",
            descriptionAr: "بوابات دخول ذكية، كاميرات مراقبة متطورة، وخدمة استقبال وضيافة على مدار الساعة.",
          },
          {
            icon: "Car",
            name: "Covered Parking & EV Charging",
            nameAr: "مواقف سيارات مظللة وشواحن كهربائية",
            description: "Secured private basement parking with dedicated high-speed EV charging stations.",
            descriptionAr: "مواقف خاصة آمنة ومظللة مع محطات شحن سريعة للسيارات الكهربائية.",
          },
          {
            icon: "Building2",
            name: "Boutique Retail & Dining Promenade",
            nameAr: "ممشى تجاري ومطاعم ومقاهٍ راقية",
            description: "Curated collection of artisan cafes, specialty grocery, and essential everyday conveniences.",
            descriptionAr: "تشكيلة مختارة من المقاهي العصرية ومنافذ التسوق والمرافق الخدمية اليومية.",
          },
          {
            icon: "Sparkles",
            name: "Children's Adventure Play Zone",
            nameAr: "منطقة ألعاب آمنة وممتعة للأطفال",
            description: "Modern, secure outdoor and indoor play areas crafted with child-safe rubberized flooring.",
            descriptionAr: "مساحات ألعاب تفاعلية داخلية وخارجية صممت بأعلى معايير الأمان والسلامة.",
          },
          {
            icon: "Compass",
            name: "Executive Lounge & Business Hub",
            nameAr: "صالة رجال الأعمال ومركز عمل متطور",
            description: "Quiet work lounges, private meeting rooms, and high-speed Wi-Fi infrastructure.",
            descriptionAr: "مساحات عمل مريحة وهادئة وغرف اجتماعات خاصة مجهزة ببنية اتصالات فائقة السرعة.",
          },
        ];

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
        <div className="absolute inset-0 z-0">
          <Image
            src={project.image}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          />
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
            <Link href={`/${locale}/#projects`} className="transition hover:text-sky-300">
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
            <h1 className="font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              {title}
            </h1>
            <p className="mt-3 flex items-center gap-2 text-sm sm:text-base font-medium text-slate-300">
              <span className="text-slate-400">{isAr ? "المطور العقاري:" : "Developed by:"}</span>
              <span className="font-semibold text-sky-300">{developer}</span>
            </p>
          </div>

          {/* Hero Bottom Bar: Price & Action CTAs */}
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-t border-white/10 pt-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {isAr ? "السعر الابتدائي" : "Starting From"}
              </span>
              <div className="font-[family-name:var(--font-outfit)] text-3xl sm:text-4xl font-black text-amber-400 mt-0.5">
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
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
                <Building2 className="h-3.5 w-3.5" />
                <span>{copy.overview || (isAr ? "نظرة عامة على المشروع" : "Project Overview")}</span>
              </div>
              <h2 className="font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {isAr
                  ? `أيقونة معمارية تجمع الفخامة والفرص الاستثمارية في قلب ${location}`
                  : `A Landmark Architectural Address in ${location}`}
              </h2>
              <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
                {project.description ? (
                  <p className="whitespace-pre-line">{project.description}</p>
                ) : (
                  <>
                    <p>
                      {isAr
                        ? `يقدم مشروع ${title} في ${location} تجربة استثنائية للعيش العصري والاستثمار العقاري المستدام بتطوير من ${developer}. صُمم المشروع بعناية فائقة ليمزج بين أحدث المعايير الهندسية والتشطيبات الفاخرة التي تلبي تطلعات العائلات والمستثمرين على حد سواء.`
                        : `Discover ${title}, an exceptional residential and investment destination set within the vibrant backdrop of ${location}, proudly developed by ${developer}. Crafted with exacting standards, the development merges contemporary aesthetics with enduring structural integrity, presenting a premier living environment tailored for discerning homeowners and international investors.`}
                    </p>
                    <p>
                      {isAr
                        ? `يتميز المشروع بموقعه الاستراتيجي الذي يضمن سهولة وسرعة الوصول إلى المعالم الحيوية ومراكز الأعمال والخدمات الرئيسية في سلطنة عمان، مع توفير بيئة متكاملة تضمن الخصوصية والراحة وارتفاع العائد الاستثماري على المدى الطويل.`
                        : `Centrally positioned for seamless connectivity to major commercial arteries, prestigious educational facilities, and leisure landmarks across Oman, ${title} establishes a new benchmark for capital appreciation, rental yield, and elevated everyday comfort.`}
                    </p>
                  </>
                )}
              </div>

              {/* Garden City Properties Assurance Quote */}
              <div className="mt-8 rounded-2xl border border-amber-400/20 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent p-5 backdrop-blur-md">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  {isAr ? "رؤية جاردن سيتي بروبرتيز الاستشارية" : "Garden City Properties Investment Insight"}
                </p>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                  {isAr
                    ? "«نختار لعملائنا مشاريع تجمع بين التميز المعماري والشفافية القانونية وخطة السداد المرنة، لضمان استثمار آمن ومستدام في السوق العقاري العماني الواعد.»"
                    : "“We curate developments that unite architectural distinction, rigorous legal compliance, and resilient financial schedules, guaranteeing enduring value in Oman’s expanding property sector.”"}
                </p>
              </div>
            </div>

            {/* Right Quick Facts Bento Box (5 cols) */}
            <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              <h3 className="text-base font-bold text-white mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <span>{isAr ? "المواصفات الأساسية" : "Development Details"}</span>
                <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 border border-sky-400/20">
                  {type}
                </span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">{copy.developer || (isAr ? "المطور" : "Developer")}</span>
                  <span className="font-semibold text-white">{developer}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">{copy.stage || (isAr ? "مرحلة البناء" : "Stage")}</span>
                  <span className="font-semibold text-amber-400">{constructionStage}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">{copy.handover || (isAr ? "تاريخ التسليم" : "Handover")}</span>
                  <span className="font-semibold text-white">{completionDate}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">{copy.paymentPlan || (isAr ? "خطة السداد" : "Payment Plan")}</span>
                  <span className="font-semibold text-white text-right">{paymentPlan}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">{isAr ? "حق الملكية" : "Ownership"}</span>
                  <span className="font-semibold text-emerald-400">
                    {copy.freehold || (isAr ? "تملك حر 100%" : "100% Freehold")}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-400">{copy.structure || (isAr ? "التشطيبات" : "Finishes")}</span>
                  <span className="font-semibold text-white text-right">{structure}</span>
                </div>
              </div>

              {/* Consultation trigger inside facts */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <a
                  href="tel:+96899190404"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  <Phone className="h-4 w-4 text-sky-400" />
                  <span dir="ltr">+968 99190404</span>
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
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
              {copy.highlights || (isAr ? "أبرز مميزات المشروع" : "Project Highlights")}
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-2xl sm:text-3xl font-bold text-white">
              {isAr ? "أرقام ومؤشرات تعكس قوة الاستثمار" : "Key Project Indicators & Metrics"}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Stat 1: Price */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-md text-center transition hover:border-sky-400/40">
              <Coins className="h-6 w-6 text-amber-400 mx-auto mb-2" />
              <p className="text-[11px] font-medium text-slate-400">
                {copy.startingPrice || (isAr ? "السعر الابتدائي" : "Starting Price")}
              </p>
              <p className="mt-1 font-[family-name:var(--font-outfit)] text-lg sm:text-xl font-bold text-white">
                {price}
              </p>
            </div>

            {/* Stat 2: Area */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-md text-center transition hover:border-sky-400/40">
              <Square className="h-6 w-6 text-sky-400 mx-auto mb-2" />
              <p className="text-[11px] font-medium text-slate-400">
                {copy.startingArea || (isAr ? "المساحة الابتدائية" : "Starting Area")}
              </p>
              <p className="mt-1 font-[family-name:var(--font-outfit)] text-lg sm:text-xl font-bold text-white">
                {area}
              </p>
            </div>

            {/* Stat 3: Handover */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-md text-center transition hover:border-sky-400/40">
              <CalendarDays className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-[11px] font-medium text-slate-400">
                {copy.handover || (isAr ? "تاريخ التسليم" : "Handover")}
              </p>
              <p className="mt-1 font-[family-name:var(--font-outfit)] text-lg sm:text-xl font-bold text-white">
                {completionDate}
              </p>
            </div>

            {/* Stat 4: Stage */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-md text-center transition hover:border-sky-400/40">
              <Layers className="h-6 w-6 text-amber-400 mx-auto mb-2" />
              <p className="text-[11px] font-medium text-slate-400">
                {copy.stage || (isAr ? "مرحلة البناء" : "Stage")}
              </p>
              <p className="mt-1 font-[family-name:var(--font-outfit)] text-sm sm:text-base font-bold text-amber-300">
                {constructionStage}
              </p>
            </div>

            {/* Stat 5: Freehold */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-md text-center transition hover:border-sky-400/40">
              <ShieldCheck className="h-6 w-6 text-sky-400 mx-auto mb-2" />
              <p className="text-[11px] font-medium text-slate-400">
                {isAr ? "سند الملكية" : "Title Deed"}
              </p>
              <p className="mt-1 font-[family-name:var(--font-outfit)] text-sm sm:text-base font-bold text-emerald-400">
                {isAr ? "تملك حر دائم" : "100% Freehold"}
              </p>
            </div>

            {/* Stat 6: Yield Potential */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-md text-center transition hover:border-sky-400/40">
              <Percent className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
              <p className="text-[11px] font-medium text-slate-400">
                {isAr ? "عائد متوقع" : "Projected ROI"}
              </p>
              <p className="mt-1 font-[family-name:var(--font-outfit)] text-lg sm:text-xl font-bold text-cyan-300">
                8 - 10%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: PROPERTY TYPES & CONFIGURATIONS
          ========================================================================= */}
      <section className="relative border-t border-white/10 py-20 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
                {copy.configurations || (isAr ? "نماذج ومخططات الوحدات" : "Property Types & Configurations")}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-2xl sm:text-3xl font-bold text-white">
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

          {/* Configuration Selection Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-white/10 pb-4">
            {configurations.map((conf, idx) => (
              <button
                key={conf.id || idx}
                type="button"
                onClick={() => setSelectedConfIndex(idx)}
                className={`rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                  selectedConfIndex === idx
                    ? "bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                    : "bg-slate-900/80 text-slate-300 border border-white/10 hover:bg-white/10"
                }`}
              >
                {isAr ? conf.titleAr || conf.title : conf.title}
              </button>
            ))}
          </div>

          {/* Active Configuration Showcase Card */}
          <div className="grid gap-8 lg:grid-cols-12 items-center rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            {/* Visual Floor Plan Preview (7 cols) */}
            <div className="lg:col-span-7 relative">
              <div className="relative h-64 sm:h-96 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950 flex items-center justify-center p-4">
                {activeConf.floorPlanUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeConf.floorPlanUrl}
                    alt={activeConf.title}
                    className="h-full w-full object-contain cursor-pointer transition hover:scale-105"
                    onClick={() => setFloorPlanModalOpen(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 text-xs">
                    <Ruler className="h-8 w-8 mb-2 text-slate-600" />
                    <span>{isAr ? "المخطط الهندي قيد التجهيز" : "Blueprint Available Upon Request"}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setFloorPlanModalOpen(true)}
                  className="absolute bottom-4 right-4 rounded-xl bg-slate-950/80 px-3.5 py-2 text-xs font-semibold text-sky-400 border border-white/10 backdrop-blur-md hover:bg-slate-900 transition flex items-center gap-1.5"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>{copy.viewFloorPlan || (isAr ? "تكبير المخطط" : "Enlarge Blueprint")}</span>
                </button>
              </div>
            </div>

            {/* Specifications & Direct Unit CTA (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <span className="rounded-full bg-sky-500/10 border border-sky-400/20 px-3 py-1 text-xs font-semibold text-sky-400 uppercase">
                  {activeConf.type}
                </span>
                <h3 className="font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-2xl font-bold text-white mt-3">
                  {isAr ? activeConf.titleAr || activeConf.title : activeConf.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {isAr
                    ? activeConf.descriptionAr || activeConf.description
                    : activeConf.description}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <BedDouble className="h-4 w-4 text-sky-400" />
                    <span>{copy.bedrooms || (isAr ? "غرف النوم" : "Bedrooms")}</span>
                  </div>
                  <span className="font-bold text-white text-sm">{activeConf.bedrooms}</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Bath className="h-4 w-4 text-sky-400" />
                    <span>{copy.bathrooms || (isAr ? "دورات المياه" : "Bathrooms")}</span>
                  </div>
                  <span className="font-bold text-white text-sm">{activeConf.bathrooms}</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Square className="h-4 w-4 text-emerald-400" />
                    <span>{copy.builtUpArea || (isAr ? "مساحة البناء" : "Built-Up Area")}</span>
                  </div>
                  <span className="font-bold text-white text-sm">{activeConf.bua}</span>
                </div>

                {activeConf.plot && (
                  <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Ruler className="h-4 w-4 text-amber-400" />
                      <span>{copy.plotArea || (isAr ? "مساحة الأرض" : "Plot Area")}</span>
                    </div>
                    <span className="font-bold text-white text-sm">{activeConf.plot}</span>
                  </div>
                )}
              </div>

              {/* Price & Unit Action */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-400">
                    {copy.startingPrice || (isAr ? "السعر" : "Price Range")}
                  </span>
                  <span className="font-[family-name:var(--font-outfit)] text-xl font-black text-amber-400">
                    {activeConf.price || price}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    scrollToEnquiry(
                      isAr ? activeConf.titleAr || activeConf.title : activeConf.title
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.3)] transition hover:brightness-110 active:scale-[0.98]"
                >
                  <Send className="h-4 w-4" />
                  <span>
                    {copy.enquireUnit || (isAr ? "استفسر عن هذه الوحدة" : "Enquire About This Unit")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: AMENITIES & FACILITIES
          ========================================================================= */}
      <section className="relative border-t border-white/10 py-20 bg-slate-950/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
              {copy.amenities || (isAr ? "المرافق والخدمات الحصرية" : "Amenities & Facilities")}
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-2xl sm:text-3xl font-bold text-white">
              {isAr ? "مرافق عالمية مصممة لأرقى أساليب الحياة" : "Curated World-Class Lifestyle Privileges"}
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-400">
              {copy.amenitiesSubtitle ||
                (isAr
                  ? "مرافق استثنائية صُممت لأسلوب حياة راقٍ يجمع بين الراحة والرفاهية والهدوء."
                  : "Curated lifestyle amenities designed for comfort, leisure and wellness.")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {amenitiesList.map((item, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/40 hover:bg-slate-900/90 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-400/20 group-hover:bg-sky-500/20 group-hover:scale-110 transition-transform">
                  {item.icon === "Waves" ? (
                    <Waves className="h-6 w-6" />
                  ) : item.icon === "Dumbbell" ? (
                    <Dumbbell className="h-6 w-6" />
                  ) : item.icon === "Trees" ? (
                    <Trees className="h-6 w-6" />
                  ) : item.icon === "Car" ? (
                    <Car className="h-6 w-6" />
                  ) : item.icon === "Building2" ? (
                    <Building2 className="h-6 w-6" />
                  ) : item.icon === "Sparkles" ? (
                    <Sparkles className="h-6 w-6" />
                  ) : item.icon === "Compass" ? (
                    <Compass className="h-6 w-6" />
                  ) : (
                    <ShieldCheck className="h-6 w-6" />
                  )}
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-base font-bold text-white">
                  {isAr ? item.nameAr || item.name : item.name}
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  {isAr ? item.descriptionAr || item.description : item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: PROJECT GALLERY & LIGHTBOX
          ========================================================================= */}
      <section className="relative border-t border-white/10 py-20 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
                {copy.gallery || (isAr ? "معرض صور المشروع" : "Project Gallery")}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-2xl sm:text-3xl font-bold text-white">
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={`${title} visual ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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

                <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 flex items-center justify-center p-3">
                  {floorPlanUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={floorPlanUrl}
                      alt={`${title} Architectural Blueprint`}
                      className="h-full w-full object-contain cursor-pointer transition hover:scale-105"
                      onClick={() => setFloorPlanModalOpen(true)}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={gallery[0]}
                      alt={`${title} Plan`}
                      className="h-full w-full object-contain cursor-pointer transition hover:scale-105"
                      onClick={() => setFloorPlanModalOpen(true)}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setFloorPlanModalOpen(true)}
                    className="absolute top-4 right-4 rounded-xl bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-sky-400 border border-white/10 backdrop-blur-md hover:bg-slate-900 transition flex items-center gap-1.5"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>{isAr ? "تكبير" : "Enlarge"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Description & Action (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                {isAr ? "الدقة المعمارية وتوزيع المساحات" : "Spatial Precision & Engineering"}
              </p>
              <h2 className="font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-2xl sm:text-3xl font-bold text-white">
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
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
              {copy.videoPresentation || (isAr ? "العرض المرئي للمشروع" : "Video Presentation")}
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-2xl sm:text-3xl font-bold text-white">
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
              <div className="relative aspect-video w-full">
                {videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be") ? (
                  <iframe
                    src={
                      videoUrl.includes("watch?v=")
                        ? videoUrl.replace("watch?v=", "embed/") + "?autoplay=1"
                        : videoUrl.includes("youtu.be/")
                        ? videoUrl.replace("youtu.be/", "www.youtube.com/embed/") + "?autoplay=1"
                        : videoUrl
                    }
                    title={`${title} Video Tour`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                ) : videoUrl.includes("vimeo.com") ? (
                  <iframe
                    src={videoUrl.replace("vimeo.com/", "player.vimeo.com/video/") + "?autoplay=1"}
                    title={`${title} Video Tour`}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                ) : (
                  <video src={videoUrl} controls autoPlay className="h-full w-full object-cover" />
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
                    onClick={() => {
                      if (videoUrl) {
                        setVideoPlaying(true);
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
                    }}
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
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            {/* Left Location Landmarks Grid (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  {copy.locationConnectivity || (isAr ? "الموقع وسهولة الوصول" : "Location & Connectivity")}
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-2xl sm:text-3xl font-bold text-white">
                {isAr
                  ? `موقع استراتيجي متميز في ${location}`
                  : `Strategic Position & Unmatched Connectivity in ${location}`}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {isAr
                  ? "يتمتع المشروع بقربه الاستراتيجي من شبكة الطرق السريعة الرئيسية في سلطنة عمان، مما يمنح السكان والمستثمرين وصولاً سلساً وفورياً إلى مراكز الأعمال والمطارات والمرافق الترفيهية."
                  : "Positioned at the nexus of major arterial expressways, the development ensures effortless commuting to central business districts, diplomatic quarters, international transport hubs, and coastline promenades."}
              </p>

              {/* Landmarks Time Cards */}
              <div className="space-y-3 pt-2">
                {nearbyLandmarks.map((lm, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/70 p-3.5 backdrop-blur-md transition hover:border-sky-400/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                        <Compass className="h-4 w-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-white">
                        {isAr ? lm.nameAr || lm.name : lm.name}
                      </span>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{isAr ? lm.timeAr || lm.time : lm.time}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${title} ${location}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition underline underline-offset-4"
                >
                  <span>{isAr ? "فتح الموقع على خرائط جوجل" : "Open Location in Google Maps"}</span>
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
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    location
                  )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  className="h-full w-full border-0 filter invert contrast-[0.9] opacity-80"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-slate-950/90 p-4 backdrop-blur-md border border-white/10">
                  <div>
                    <p className="text-xs font-bold text-white">{title}</p>
                    <p className="text-[11px] text-slate-400">{location}</p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${title} ${location}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400 transition"
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
      <section className="relative border-t border-white/10 py-20 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              {copy.investment || (isAr ? "الاستثمار وخطة السداد" : "Investment & Payment Plan")}
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-2xl sm:text-3xl font-bold text-white">
              {isAr ? "دفعات ميسرة وفرص استثمارية واعدة" : "Transparent Milestones & Investor Security"}
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-400">
              {copy.investmentSubtitle ||
                (isAr
                  ? "دفعات ميسرة وفرص تملك استثمارية ذات عوائد مجزية ومستدامة."
                  : "Flexible payment milestones and high-yield ownership opportunities.")}
            </p>
          </div>

          {/* Payment Milestone Stepper Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-14">
            {/* Step 1 */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md relative overflow-hidden">
              <span className="font-[family-name:var(--font-outfit)] text-4xl font-extrabold text-sky-400/20 absolute top-4 right-4 rtl:left-4 rtl:right-auto">
                01
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-400">
                {isAr ? "الدفعة الأولى" : "Step 1: Down Payment"}
              </p>
              <p className="font-[family-name:var(--font-outfit)] text-3xl font-black text-white mt-2">
                10% - 20%
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {isAr ? "عند حجز الوحدة وتأكيد العقد المبدئي" : "Upon reservation and initial booking"}
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md relative overflow-hidden">
              <span className="font-[family-name:var(--font-outfit)] text-4xl font-extrabold text-sky-400/20 absolute top-4 right-4 rtl:left-4 rtl:right-auto">
                02
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-400">
                {isAr ? "أثناء البناء" : "Step 2: Construction"}
              </p>
              <p className="font-[family-name:var(--font-outfit)] text-3xl font-black text-white mt-2">
                30% - 40%
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {isAr ? "أقساط موزعة وفق مراحل إنجاز البناء المعتمدة" : "Installments tied to verified construction milestones"}
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md relative overflow-hidden">
              <span className="font-[family-name:var(--font-outfit)] text-4xl font-extrabold text-sky-400/20 absolute top-4 right-4 rtl:left-4 rtl:right-auto">
                03
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-400">
                {isAr ? "عند الاستلام" : "Step 3: Handover"}
              </p>
              <p className="font-[family-name:var(--font-outfit)] text-3xl font-black text-white mt-2">
                40% - 50%
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {isAr ? "عند إنجاز المشروع واستلام المفاتيح" : "Upon project completion and key handover"}
              </p>
            </div>

            {/* Step 4: Financing Option */}
            <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/15 to-transparent p-6 backdrop-blur-md relative overflow-hidden">
              <span className="font-[family-name:var(--font-outfit)] text-4xl font-extrabold text-amber-400/20 absolute top-4 right-4 rtl:left-4 rtl:right-auto">
                04
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {isAr ? "التمويل البنكي" : "Bank Mortgages"}
              </p>
              <p className="font-[family-name:var(--font-outfit)] text-2xl font-black text-amber-300 mt-2">
                {isAr ? "معتمد بنكياً" : "Bank Approved"}
              </p>
              <p className="mt-2 text-xs text-slate-300">
                {isAr ? "تسهيلات تمويلية ميسرة عبر البنوك العمانية" : "Mortgage eligibility across leading Omani banks"}
              </p>
            </div>
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

      {/* =========================================================================
          SECTION 11: BROCHURE DOWNLOAD
          ========================================================================= */}
      <section className="relative border-t border-white/10 py-16 bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 p-8 sm:p-12 shadow-2xl">
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-8 space-y-3">
                <span className="rounded-full bg-amber-400/10 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-300 uppercase">
                  {copy.brochure || (isAr ? "كتيب المشروع الرسمي" : "Official Project Brochure")}
                </span>
                <h2 className="font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-2xl sm:text-3xl font-extrabold text-white">
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
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
                {copy.enquiryTitle || (isAr ? "سجّل اهتمامك بالمشروع" : "Register Your Interest")}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-2xl sm:text-3xl font-bold text-white">
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
                    <input
                      required
                      type="tel"
                      name="phone"
                      placeholder="+968 0000 0000"
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10"
                    />
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
                    href="tel:+96899190404"
                    className="flex items-center gap-3 text-slate-200 hover:text-sky-300 transition"
                  >
                    <Phone className="h-4 w-4 text-sky-400 shrink-0" />
                    <span dir="ltr">+968 99190404</span>
                  </a>
                  <a
                    href="mailto:info@gardencityproperties.net"
                    className="flex items-center gap-3 text-slate-200 hover:text-sky-300 transition"
                  >
                    <FileText className="h-4 w-4 text-sky-400 shrink-0" />
                    <span>info@gardencityproperties.net</span>
                  </a>
                  <div className="flex items-center gap-3 text-slate-400">
                    <MapPin className="h-4 w-4 text-sky-400 shrink-0" />
                    <span>{isAr ? "مسقط · سلطنة عمان" : "Muscat · Sultanate of Oman"}</span>
                  </div>
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
                href={`/${locale}/#projects`}
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rel.image}
                      alt={rel.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 right-3 text-xs font-semibold text-amber-400">
                      {rel.price}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <h3 className="font-[family-name:var(--font-outfit)] text-lg font-bold text-white line-clamp-1">
                        {rel.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                        <span>{rel.developer}</span>
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                      <Link
                        href={`/${locale}/projects/${rel.id}/`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300 transition"
                      >
                        <span>{isAr ? "تفاصيل المشروع" : "Explore Project"}</span>
                        {isAr ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                      </Link>

                      <a
                        href={`https://wa.me/message/BACRFFVZ3LOXH1?text=${encodeURIComponent(
                          isAr
                            ? `مرحباً، أود الاستفسار عن مشروع ${rel.name}`
                            : `Hello, I would like to inquire about ${rel.name}`
                        )}`}
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb} alt={`thumb ${idx}`} className="h-full w-full object-cover" />
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
        {floorPlanModalOpen && (
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
                    {title} — {copy.floorPlans || (isAr ? "المخطط الهندي الكامل" : "Architectural Blueprint")}
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
                  src={activeConf.floorPlanUrl || floorPlanUrl || gallery[0]}
                  alt={`${title} Blueprint Fullscreen`}
                  className="max-h-[70vh] max-w-full object-contain"
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {isAr ? "مخطط معتمد عالي الدقة" : "High-Resolution Architectural Drawing"}
                </span>
                <a
                  href={activeConf.floorPlanUrl || floorPlanUrl || gallery[0]}
                  download={`${title}-floorplan`}
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
        )}
      </AnimatePresence>
    </div>
  );
}
