"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Coins,
  Edit,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Globe,
  HardDrive,
  Image as ImageIcon,
  Layers,
  Link as LinkIcon,
  Loader2,
  LogOut,
  MapPin,
  Maximize2,
  Navigation,
  Percent,
  Phone,
  Plus,
  RefreshCw,
  Ruler,
  Search,
  ShieldCheck,
  Sparkles,
  Square,
  Star,
  Trash2,
  Upload,
  UploadCloud,
  Video,
  X,
  BedDouble,
  Bath,
  Car,
  Landmark,
  KeyRound,
  CreditCard,
  Waves,
  Dumbbell,
  Trees,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import AdminContentGuide from "@/components/AdminContentGuide";
import {
  renderAmenityIcon,
  renderMilestoneIcon,
  AMENITY_ICON_OPTIONS,
  MILESTONE_ICON_OPTIONS,
} from "@/lib/projectIcons";
import { parseVideoUrl } from "@/lib/video";
import { YouTubeIcon, VimeoIcon } from "@/components/VideoIcons";

export interface AmenityRecord {
  id?: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  icon?: string;
  category?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface PaymentMilestone {
  id?: string;
  step_number?: string | number;
  title: string;
  title_ar?: string;
  percentage: string;
  description: string;
  description_ar?: string;
  detailed_description?: string;
  icon?: string;
  display_order?: number;
  is_active?: boolean;
}

const SUGGESTED_AMENITIES: AmenityRecord[] = [
  {
    name: "Infinity Edge Swimming Pool",
    name_ar: "مسبح إنفينيتي وتراسات استجمام",
    description: "Temperature-controlled swimming pool with dedicated resort-style sun deck.",
    description_ar: "مسبح يتم التحكم بدرجة حرارته مع تراس استجمام شمسي على الطراز الفندقي.",
    icon: "Waves",
    category: "Wellness & Leisure",
    is_active: true,
  },
  {
    name: "State-of-the-Art Fitness Center",
    name_ar: "صالة لياقة بدنية ونادٍ صحي متكامل",
    description: "Equipped with high-end cardio and strength machinery with personal trainer suites.",
    description_ar: "مجهزة بأحدث أجهزة تمارين اللياقة والقوة مع غرف تدريب متخصصة.",
    icon: "Dumbbell",
    category: "Sports & Fitness",
    is_active: true,
  },
  {
    name: "Landscaped Parks & Jogging Track",
    name_ar: "حدائق خضراء ومسارات مشي وركض",
    description: "Lush botanical gardens, shaded walking promenades, and serene open-air pavilions.",
    description_ar: "حدائق نباتية غناء ومسارات مشي مظللة وجلسات خارجية هادئة.",
    icon: "Trees",
    category: "Nature & Parks",
    is_active: true,
  },
  {
    name: "24/7 Gated Security & Concierge",
    name_ar: "أمن وحراسة وخدمة استقبال على مدار الساعة",
    description: "Access-controlled entry gates, AI-enhanced surveillance, and round-the-clock reception.",
    description_ar: "بوابات دخول ذكية، كاميرات مراقبة متطورة، وخدمة استقبال وضيافة على مدار الساعة.",
    icon: "ShieldCheck",
    category: "Security & Service",
    is_active: true,
  },
  {
    name: "Covered Parking & EV Charging",
    name_ar: "مواقف سيارات مظللة وشواحن كهربائية",
    description: "Secured private basement parking with dedicated high-speed EV charging stations.",
    description_ar: "مواقف خاصة آمنة ومظللة مع محطات شحن سريعة للسيارات الكهربائية.",
    icon: "Car",
    category: "Infrastructure",
    is_active: true,
  },
  {
    name: "Boutique Retail & Dining Promenade",
    name_ar: "ممشى تجاري ومطاعم ومقاهٍ راقية",
    description: "Curated collection of artisan cafes, specialty grocery, and essential conveniences.",
    description_ar: "تشكيلة مختارة من المقاهي العصرية ومنافذ التسوق والمرافق الخدمية اليومية.",
    icon: "ShoppingBag",
    category: "Retail & Dining",
    is_active: true,
  },
  {
    name: "Children's Adventure Play Zone",
    name_ar: "منطقة ألعاب آمنة وممتعة للأطفال",
    description: "Modern outdoor and indoor play areas crafted with child-safe rubberized flooring.",
    description_ar: "مساحات ألعاب تفاعلية داخلية وخارجية صممت بأعلى معايير الأمان والسلامة.",
    icon: "Baby",
    category: "Family & Kids",
    is_active: true,
  },
  {
    name: "Executive Lounge & Business Hub",
    name_ar: "صالة رجال الأعمال ومركز مؤتمرات",
    description: "Quiet work lounges, private meeting rooms, and high-speed Wi-Fi infrastructure.",
    description_ar: "مساحات عمل مريحة وهادئة وغرف اجتماعات خاصة مجهزة ببنية اتصالات فائقة السرعة.",
    icon: "Building2",
    category: "Business & Community",
    is_active: true,
  },
  {
    name: "Luxury Spa & Wellness Suites",
    name_ar: "سبا ومركز صحي فاخر",
    description: "Steam rooms, thermal saunas, and holistic wellness treatment suites.",
    description_ar: "غرف بخار، ساونا حرارية، ومرافق استرخاء صحي شاملة.",
    icon: "Sparkles",
    category: "Wellness & Leisure",
    is_active: true,
  },
  {
    name: "Private Beach & Lagoon Access",
    name_ar: "شاطئ رملي ولاجون خاص للمقيمين",
    description: "Direct frontage to pristine coastline with private water sports and cabana service.",
    description_ar: "إطلالة مباشرة على الشاطئ ومرافق مائية خاصة مع خدمات راقية.",
    icon: "Sun",
    category: "Wellness & Leisure",
    is_active: true,
  },
  {
    name: "Smart Home Automation Systems",
    name_ar: "أنظمة التحكم المنزلي الذكي المتطورة",
    description: "Integrated mobile controls for climate, lighting, security access, and energy efficiency.",
    description_ar: "تحكم ذكي متكامل عبر الهاتف بالإضاءة والتكييف وبوابات الدخول ومراقبة الطاقة.",
    icon: "Home",
    category: "Technology",
    is_active: true,
  },
  {
    name: "Dedicated Cycling & Fitness Tracks",
    name_ar: "مسارات مخصصة للدراجات الهوائية والرياضة",
    description: "Continuous paved and illuminated cycling loops winding through scenic greenspaces.",
    description_ar: "مسارات إسفلتية ممهدة ومضاءة للدراجات تمر عبر المسطحات الخضراء الساحرة.",
    icon: "Bike",
    category: "Sports & Fitness",
    is_active: true,
  },
];

const MAX_PROJECT_MEDIA_BYTES = 40 * 1024 * 1024; // 40 MB total project media cap

// Strictly allowed MIME types and file extensions for real estate media
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

const CURATED_AMENITIES = [
  "Swimming Pool & Cabanas",
  "Private Beach Access",
  "Fitness Center & Health Club",
  "Concierge & Valet Service",
  "24/7 Security & CCTV Surveillance",
  "Children's Play Area & Nursery",
  "Landscaped Parks & Gardens",
  "Covered Resident Parking",
  "Spa & Wellness Center",
  "BBQ & Entertainment Terrace",
  "Smart Home Automation",
  "Retail Promenade & Cafes",
  "Business Lounge & Meeting Rooms",
  "Jogging & Cycling Tracks",
];

const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Townhouse",
  "Penthouse",
  "Duplex",
  "Studio",
  "Plot",
  "Commercial",
  "Office",
  "Retail",
  "Other",
];

const NEARBY_CATEGORIES = [
  "Airport",
  "Hospital",
  "School",
  "University",
  "Shopping Mall",
  "Supermarket",
  "Restaurant",
  "Hotel",
  "Public Transport",
  "Landmark",
  "Beach",
  "Other",
];

export interface PropertyConfiguration {
  id: string;
  property_type: string;
  name: string;
  name_ar?: string;
  bedrooms: number;
  bathrooms: number;
  balconies?: number;
  bua_sqm: number | string;
  plot_sqm?: number | string;
  price: string;
  currency?: string;
  availability?: string;
  description?: string;
  description_ar?: string;
  features?: string[];
  furnishing?: string;
  parking?: string;
  floor_plan_url?: string;
  image_url?: string;
  images?: string[];
  is_featured?: boolean;
  display_order?: number;
}

export interface NearbyPlaceItem {
  id?: string;
  name: string;
  name_ar?: string;
  category: string;
  distance_km?: number | string;
  travel_time_text?: string;
  travel_time_minutes?: number;
  google_maps_url?: string;
  display_order?: number;
}

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
  whatsapp_number?: string;
  hero_video_url?: string;
  brochure_url?: string;
  created_at?: string;
  google_maps_url?: string;
  formatted_address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  property_configurations?: PropertyConfiguration[];
  nearby_locations?: NearbyPlaceItem[];
  amenities?: (AmenityRecord | string)[];
  amenities_enabled?: boolean;
  amenities_label?: string;
  amenities_label_ar?: string;
  amenities_heading?: string;
  amenities_heading_ar?: string;
  amenities_subtitle?: string;
  amenities_subtitle_ar?: string;
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
  is_published?: boolean;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Content Upload Guide Modal state
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Property list state
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [deleteIdInProgress, setDeleteIdInProgress] = useState<string | null>(null);

  // Edit mode state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [existingFloorPlanUrl, setExistingFloorPlanUrl] = useState<string | null>(null);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);

  // Section 1: Basic Information
  const [name, setName] = useState("");
  const [developer, setDeveloper] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("OMR");
  const [area, setArea] = useState("");
  const [paymentPlan, setPaymentPlan] = useState("");
  const [constructionStage, setConstructionStage] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  // Section 2: Overview & Narrative
  const [type, setType] = useState("Luxury Residential");
  const [structure, setStructure] = useState("");
  const [description, setDescription] = useState("");

  // Section 3: Configurations Builder
  const [configurations, setConfigurations] = useState<PropertyConfiguration[]>([]);
  const [editingConfigIndex, setEditingConfigIndex] = useState<number | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isUploadingConfigImage, setIsUploadingConfigImage] = useState(false);
  const [isUploadingConfigGallery, setIsUploadingConfigGallery] = useState(false);
  const [configMediaError, setConfigMediaError] = useState<string | null>(null);
  const [currentConfig, setCurrentConfig] = useState<PropertyConfiguration>({
    id: "",
    property_type: "Apartment",
    name: "",
    name_ar: "",
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    bua_sqm: "120",
    plot_sqm: "",
    price: "",
    currency: "OMR",
    availability: "Available",
    description: "",
    description_ar: "",
    features: [],
    furnishing: "Unfurnished",
    parking: "1 Dedicated Space",
    floor_plan_url: "",
    image_url: "",
    images: [],
    is_featured: false,
  });

  // Section 4: Location & Nearby Places
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");
  const [city, setCity] = useState("Muscat");
  const [country, setCountry] = useState("Oman");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [locationLegacy, setLocationLegacy] = useState("");
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [isFetchingNearby, setIsFetchingNearby] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlaceItem[]>([]);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceCategory, setNewPlaceCategory] = useState("Landmark");
  const [newPlaceDistance, setNewPlaceDistance] = useState("");
  const [newPlaceTime, setNewPlaceTime] = useState("");

  // Section 5: Investment & Payment Plan State
  const [investmentEnabled, setInvestmentEnabled] = useState(true);
  const [investmentLabel, setInvestmentLabel] = useState("Investment & Payment Plan");
  const [investmentLabelAr, setInvestmentLabelAr] = useState("الاستثمار وخطة السداد");
  const [investmentHeading, setInvestmentHeading] = useState("Transparent Milestones & Investor Security");
  const [investmentHeadingAr, setInvestmentHeadingAr] = useState("دفعات ميسرة وفرص استثمارية واعدة");
  const [investmentSubtitle, setInvestmentSubtitle] = useState("Flexible payment milestones and high-yield ownership opportunities.");
  const [investmentSubtitleAr, setInvestmentSubtitleAr] = useState("دفعات ميسرة وفرص تملك استثمارية ذات عوائد مجزية ومستدامة.");
  const [milestones, setMilestones] = useState<PaymentMilestone[]>([]);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestoneIndex, setEditingMilestoneIndex] = useState<number | null>(null);
  const [currentMilestone, setCurrentMilestone] = useState<PaymentMilestone>({
    step_number: "01",
    title: "",
    title_ar: "",
    percentage: "",
    description: "",
    description_ar: "",
    icon: "Coins",
    is_active: true,
  });

  // Independent Bank Mortgage Card State
  const [mortgageEnabled, setMortgageEnabled] = useState(true);
  const [mortgageTitle, setMortgageTitle] = useState("Bank Mortgages");
  const [mortgageTitleAr, setMortgageTitleAr] = useState("التمويل البنكي");
  const [mortgageStatus, setMortgageStatus] = useState("Bank Approved");
  const [mortgageStatusAr, setMortgageStatusAr] = useState("معتمد بنكياً");
  const [mortgageDescription, setMortgageDescription] = useState("Mortgage eligibility and financing facilitation across leading Omani banks.");
  const [mortgageDescriptionAr, setMortgageDescriptionAr] = useState("تسهيلات تمويلية ميسرة وخيارات مرنة عبر البنوك العمانية الرائدة.");
  const [mortgageBanks, setMortgageBanks] = useState("Bank Muscat, Bank Dhofar, Sohar International, National Bank of Oman");
  const [mortgageAdditionalInfo, setMortgageAdditionalInfo] = useState("Up to 80% financing available for eligible residents and investors.");

  // Section 6: Curated Amenities & Facilities State
  const [amenitiesEnabled, setAmenitiesEnabled] = useState(true);
  const [amenitiesLabel, setAmenitiesLabel] = useState("Amenities & Facilities");
  const [amenitiesLabelAr, setAmenitiesLabelAr] = useState("المرافق والخدمات الحصرية");
  const [amenitiesHeading, setAmenitiesHeading] = useState("Curated World-Class Lifestyle Privileges");
  const [amenitiesHeadingAr, setAmenitiesHeadingAr] = useState("مرافق عالمية مصممة لأرقى أساليب الحياة");
  const [amenitiesSubtitle, setAmenitiesSubtitle] = useState("Curated lifestyle amenities designed for comfort, leisure and wellness.");
  const [amenitiesSubtitleAr, setAmenitiesSubtitleAr] = useState("مرافق استثنائية صُممت لأسلوب حياة راقٍ يجمع بين الراحة والرفاهية والهدوء.");
  const [amenities, setAmenities] = useState<AmenityRecord[]>([]);
  const [isAmenityModalOpen, setIsAmenityModalOpen] = useState(false);
  const [editingAmenityIndex, setEditingAmenityIndex] = useState<number | null>(null);
  const [currentAmenity, setCurrentAmenity] = useState<AmenityRecord>({
    name: "",
    name_ar: "",
    description: "",
    description_ar: "",
    icon: "Sparkles",
    category: "Wellness & Leisure",
    is_active: true,
  });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [customAmenityInput, setCustomAmenityInput] = useState("");

  // Section 6: Media files state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryItems, setGalleryItems] = useState<StagedGalleryItem[]>([]);
  const [floorPlanFile, setFloorPlanFile] = useState<File | null>(null);
  const [floorPlanPreview, setFloorPlanPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Section 8: Video & Brochure
  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [brochureUrl, setBrochureUrl] = useState("");
  const parsedHeroVideo = useMemo(() => parseVideoUrl(heroVideoUrl), [heroVideoUrl]);

  // Section 9: SEO & Slug
  const [customSlug, setCustomSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // Section 10: Publishing
  const [status, setStatus] = useState("Available");
  const [isPublished, setIsPublished] = useState(true);

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
            undefined,
          location: typeof item.location === "string" ? item.location : undefined,
          completion_date: typeof item.completion_date === "string" ? item.completion_date : undefined,
          construction_stage: typeof item.construction_stage === "string" ? item.construction_stage : undefined,
          status: typeof item.status === "string" ? item.status : undefined,
          type: typeof item.type === "string" ? item.type : typeof item.property_type === "string" ? item.property_type : undefined,
          structure: typeof item.structure === "string" ? item.structure : undefined,
          description: typeof item.description === "string" ? item.description : undefined,
          whatsapp_number:
            typeof item.whatsapp_number === "string" && item.whatsapp_number.trim()
              ? item.whatsapp_number.trim()
              : typeof item.whatsappNumber === "string" && item.whatsappNumber.trim()
              ? item.whatsappNumber.trim()
              : undefined,
          hero_video_url: typeof item.hero_video_url === "string" ? item.hero_video_url : undefined,
          brochure_url: typeof item.brochure_url === "string" ? item.brochure_url : undefined,
          google_maps_url: typeof item.google_maps_url === "string" ? item.google_maps_url : undefined,
          formatted_address: typeof item.formatted_address === "string" ? item.formatted_address : undefined,
          city: typeof item.city === "string" ? item.city : undefined,
          country: typeof item.country === "string" ? item.country : undefined,
          latitude: typeof item.latitude === "number" ? item.latitude : undefined,
          longitude: typeof item.longitude === "number" ? item.longitude : undefined,
          property_configurations: Array.isArray(item.property_configurations) ? item.property_configurations : [],
          nearby_locations: Array.isArray(item.nearby_locations) ? item.nearby_locations : [],
          amenities: Array.isArray(item.amenities) ? item.amenities : [],
          is_published: item.is_published !== false,
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
    let isMounted = true;

    async function initAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (!session) {
          router.replace("/admin/login/");
          return;
        }

        setUser(session.user);
        setAuthChecking(false);
        fetchProjects();
      } catch (err) {
        console.error("Auth init error:", err);
        if (isMounted) {
          router.replace("/admin/login/");
        }
      }
    }

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (event === "SIGNED_OUT") {
        setUser(null);
        router.replace("/admin/login/");
      } else if (session) {
        setUser(session.user);
        setAuthChecking(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router, fetchProjects]);

  // Handle main cover image selection
  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    setFormError(null);
    setValidationWarning(null);

    const file = e.target.files?.[0];
    if (!file) return;

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

    const total = getTotalMediaBytes(file, galleryFiles, floorPlanFile);
    if (total > MAX_PROJECT_MEDIA_BYTES) {
      setFormError(
        "Total media size for this project exceeds the 40MB limit. Please compress or select smaller images.",
      );
    }
    e.target.value = "";
  }

  function handleRemoveCoverImage() {
    if (imagePreview && !imagePreview.startsWith("http")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
    const coverInput = document.getElementById("project-image-input") as HTMLInputElement | null;
    if (coverInput) coverInput.value = "";
  }

  // Handle gallery selection
  async function handleGalleryChange(e: ChangeEvent<HTMLInputElement>) {
    const rawFiles = e.target.files ? Array.from(e.target.files) : [];
    if (rawFiles.length === 0) return;

    setFormError(null);
    setValidationWarning(null);

    const validNewItems: StagedGalleryItem[] = [];
    const skippedFiles: string[] = [];
    const duplicateFiles: string[] = [];

    for (const file of rawFiles) {
      const validation = await detectFileFormat(file);
      if (!validation.isValid) {
        skippedFiles.push(`${file.name} (${validation.isIco ? "ICO file" : file.type || "unsupported"})`);
        continue;
      }

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

    e.target.value = "";
  }

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

  function handleRemoveSingleExistingGalleryUrl(index: number) {
    setExistingGalleryUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function handleRemoveAllExistingGallery() {
    setExistingGalleryUrls([]);
  }

  function handleRemoveAllGallery() {
    galleryItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setGalleryItems([]);

    const total = getTotalMediaBytes(imageFile, [], floorPlanFile);
    if (total <= MAX_PROJECT_MEDIA_BYTES && formError?.includes("exceeds the 40MB limit")) {
      setFormError(null);
    }
  }

  // Handle floor plan selection
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
    e.target.value = "";
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

  // Location Resolution via API
  async function handleResolveLocation() {
    if (!googleMapsUrl.trim()) {
      setFormError("Please enter a Google Maps link to fetch location data.");
      return;
    }

    setIsResolvingLocation(true);
    setFormError(null);

    try {
      const res = await fetch("/api/location/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: googleMapsUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to resolve location from map link.");
      }

      if (data.latitude && data.longitude) {
        setLatitude(String(data.latitude));
        setLongitude(String(data.longitude));
      }
      if (data.formattedAddress) {
        setFormattedAddress(data.formattedAddress);
        setLocationLegacy(data.formattedAddress);
      }
      if (data.city) setCity(data.city);
      if (data.country) setCountry(data.country);

      setFormSuccess("Google Maps location resolved and coordinates extracted successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resolve location.";
      setFormError(msg);
    } finally {
      setIsResolvingLocation(false);
    }
  }

  // Nearby Places Retrieval via API
  async function handleFetchNearbyPlaces() {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      setFormError("Valid latitude and longitude are required to fetch nearby places.");
      return;
    }

    setIsFetchingNearby(true);
    setFormError(null);

    try {
      const res = await fetch("/api/location/nearby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      });

      const data = await res.json();
      if (data.places && data.places.length > 0) {
        setNearbyPlaces(data.places);
        setFormSuccess(`Found and cataloged ${data.places.length} real nearby amenities & landmarks!`);
      } else if (data.message) {
        setValidationWarning(data.message);
      } else {
        setValidationWarning("No nearby places returned. You can add important landmarks manually below.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch nearby places.";
      setFormError(msg);
    } finally {
      setIsFetchingNearby(false);
    }
  }

  // Manual Nearby Place Addition
  function handleAddManualNearbyPlace() {
    if (!newPlaceName.trim()) return;

    const newPlace: NearbyPlaceItem = {
      id: `nearby-${Date.now()}`,
      name: newPlaceName.trim(),
      category: newPlaceCategory,
      distance_km: newPlaceDistance.trim() ? parseFloat(newPlaceDistance) : undefined,
      travel_time_text: newPlaceTime.trim() || undefined,
      display_order: nearbyPlaces.length + 1,
    };

    setNearbyPlaces((prev) => [...prev, newPlace]);
    setNewPlaceName("");
    setNewPlaceDistance("");
    setNewPlaceTime("");
  }

  function handleRemoveNearbyPlace(index: number) {
    setNearbyPlaces((prev) => prev.filter((_, i) => i !== index));
  }

  // Configuration Modal & Item Management
  function handleOpenNewConfigModal() {
    setEditingConfigIndex(null);
    setConfigMediaError(null);
    setCurrentConfig({
      id: `conf-${Date.now()}`,
      property_type: "Apartment",
      name: "",
      name_ar: "",
      bedrooms: 2,
      bathrooms: 2,
      balconies: 1,
      bua_sqm: "125",
      plot_sqm: "",
      price: price || "45,000",
      currency: currency || "OMR",
      availability: "Available",
      description: "",
      description_ar: "",
      features: [],
      furnishing: "Unfurnished",
      parking: "1 Dedicated Space",
      floor_plan_url: "",
      image_url: "",
      images: [],
      is_featured: false,
    });
    setIsConfigModalOpen(true);
  }

  function handleEditConfig(index: number) {
    setEditingConfigIndex(index);
    setConfigMediaError(null);
    const existing = configurations[index];
    const existingPrimary = existing.image_url || (Array.isArray(existing.images) && existing.images.length > 0 ? existing.images[0] : "");
    const existingImages = Array.isArray(existing.images) ? existing.images : (existingPrimary ? [existingPrimary] : []);
    setCurrentConfig({
      ...existing,
      image_url: existingPrimary,
      images: existingImages,
    });
    setIsConfigModalOpen(true);
  }

  async function handleConfigMainImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setConfigMediaError(null);
    setIsUploadingConfigImage(true);

    try {
      const validation = await detectFileFormat(file);
      if (!validation.isValid) {
        throw new Error(validation.errorMessage || "Image format is not supported.");
      }

      const compressed = await compressImageFile(file, 1920, 0.85);
      const isWebP = compressed.type === "image/webp";
      const contentType = isWebP ? "image/webp" : getNormalizedContentType(compressed, validation.detectedMime);
      const ext = isWebP ? "webp" : validation.normalizedExt;

      const projectSlug = editingProjectId
        ? editingProjectId
        : customSlug.trim()
        ? customSlug.trim().toLowerCase()
        : generateSlug(name) || "project";
      const configId = currentConfig.id || `conf-${Date.now()}`;
      const storagePath = `configurations/${projectSlug}/${configId}/cover-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(storagePath, compressed, {
          contentType,
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from("property-images")
        .getPublicUrl(storagePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Failed to generate public URL for configuration image.");
      }

      const publicUrl = publicUrlData.publicUrl;
      setCurrentConfig((prev) => {
        const prevImages = Array.isArray(prev.images) ? prev.images : [];
        const updatedImages = prevImages.length === 0 ? [publicUrl] : prevImages;
        return {
          ...prev,
          image_url: publicUrl,
          images: updatedImages,
        };
      });
    } catch (err: unknown) {
      console.error("Configuration image upload failed:", err);
      setConfigMediaError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setIsUploadingConfigImage(false);
      e.target.value = "";
    }
  }

  async function handleConfigGalleryUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setConfigMediaError(null);
    setIsUploadingConfigGallery(true);

    try {
      const projectSlug = editingProjectId
        ? editingProjectId
        : customSlug.trim()
        ? customSlug.trim().toLowerCase()
        : generateSlug(name) || "project";
      const configId = currentConfig.id || `conf-${Date.now()}`;
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const validation = await detectFileFormat(file);
        if (!validation.isValid) {
          throw new Error(`"${file.name}" rejected: ${validation.errorMessage}`);
        }

        const compressed = await compressImageFile(file, 1920, 0.85);
        const isWebP = compressed.type === "image/webp";
        const contentType = isWebP ? "image/webp" : getNormalizedContentType(compressed, validation.detectedMime);
        const ext = isWebP ? "webp" : validation.normalizedExt;
        const storagePath = `configurations/${projectSlug}/${configId}/gallery-${Date.now()}-${i + 1}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from("property-images")
          .upload(storagePath, compressed, {
            contentType,
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadErr) {
          throw new Error(`Failed to upload ${file.name}: ${uploadErr.message}`);
        }

        const { data: urlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(storagePath);

        if (urlData?.publicUrl) {
          newUrls.push(urlData.publicUrl);
        }
      }

      setCurrentConfig((prev) => {
        const prevImages = Array.isArray(prev.images) ? prev.images : [];
        const mergedImages = [...prevImages, ...newUrls];
        return {
          ...prev,
          image_url: prev.image_url || mergedImages[0] || "",
          images: mergedImages,
        };
      });
    } catch (err: unknown) {
      console.error("Configuration gallery upload failed:", err);
      setConfigMediaError(err instanceof Error ? err.message : "Failed to upload gallery images.");
    } finally {
      setIsUploadingConfigGallery(false);
      e.target.value = "";
    }
  }

  function handleRemoveConfigGalleryImage(index: number) {
    setCurrentConfig((prev) => {
      const prevImages = Array.isArray(prev.images) ? [...prev.images] : [];
      const removedUrl = prevImages[index];
      prevImages.splice(index, 1);
      const newPrimary = prev.image_url === removedUrl ? (prevImages[0] || "") : prev.image_url;
      return {
        ...prev,
        image_url: newPrimary,
        images: prevImages,
      };
    });
  }

  function handleRemoveConfigCoverImage() {
    setCurrentConfig((prev) => ({
      ...prev,
      image_url: "",
    }));
  }

  function handleSaveConfig() {
    if (!currentConfig.name.trim()) {
      alert("Please provide a name for this configuration (e.g. 2-Bedroom Executive Residence).");
      return;
    }

    if (editingConfigIndex !== null) {
      setConfigurations((prev) =>
        prev.map((item, idx) => (idx === editingConfigIndex ? currentConfig : item)),
      );
    } else {
      setConfigurations((prev) => [...prev, { ...currentConfig, display_order: prev.length + 1 }]);
    }

    setIsConfigModalOpen(false);
  }

  function handleDeleteConfig(index: number) {
    const item = configurations[index];
    if (window.confirm(`Delete configuration "${item.name}"?`)) {
      setConfigurations((prev) => prev.filter((_, i) => i !== index));
    }
  }

  function handleMoveConfig(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= configurations.length) return;

    setConfigurations((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  }

  // Amenity tag toggle
  function handleToggleAmenity(amenity: string) {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity],
    );
  }

  function handleAddCustomAmenity() {
    if (!customAmenityInput.trim()) return;
    if (!selectedAmenities.includes(customAmenityInput.trim())) {
      setSelectedAmenities((prev) => [...prev, customAmenityInput.trim()]);
    }
    setCustomAmenityInput("");
  }

  // Milestone Handlers
  function handleOpenNewMilestoneModal() {
    setEditingMilestoneIndex(null);
    setCurrentMilestone({
      id: `ms-${Date.now()}`,
      step_number: String(milestones.length + 1).padStart(2, "0"),
      title: "",
      title_ar: "",
      percentage: "",
      description: "",
      description_ar: "",
      detailed_description: "",
      icon: "Coins",
      display_order: milestones.length + 1,
      is_active: true,
    });
    setIsMilestoneModalOpen(true);
  }

  function handleEditMilestone(index: number) {
    setEditingMilestoneIndex(index);
    setCurrentMilestone(milestones[index]);
    setIsMilestoneModalOpen(true);
  }

  function handleSaveMilestone() {
    if (!currentMilestone.title.trim()) {
      alert("Please provide a title for this payment milestone (e.g. Down Payment).");
      return;
    }
    if (!currentMilestone.percentage.trim()) {
      alert("Please provide a percentage or payment amount (e.g. 10% or 20%).");
      return;
    }

    if (editingMilestoneIndex !== null) {
      setMilestones((prev) =>
        prev.map((item, idx) => (idx === editingMilestoneIndex ? currentMilestone : item))
      );
    } else {
      setMilestones((prev) => [
        ...prev,
        {
          ...currentMilestone,
          display_order: prev.length + 1,
          step_number: currentMilestone.step_number || String(prev.length + 1).padStart(2, "0"),
        },
      ]);
    }
    setIsMilestoneModalOpen(false);
  }

  function handleDeleteMilestone(index: number) {
    const item = milestones[index];
    if (window.confirm(`Delete milestone "${item.title}"?`)) {
      setMilestones((prev) => prev.filter((_, i) => i !== index));
    }
  }

  function handleMoveMilestone(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= milestones.length) return;

    setMilestones((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy.map((m, idx) => ({ ...m, display_order: idx + 1 }));
    });
  }

  function handleApplyMilestonePreset(presetType: "standard" | "offplan" | "posthandover") {
    if (milestones.length > 0 && !window.confirm("Replace current payment milestones with this preset?")) {
      return;
    }

    if (presetType === "standard") {
      setMilestones([
        {
          id: `ms-std-1`,
          step_number: "01",
          title: "Down Payment",
          title_ar: "الدفعة الأولى",
          percentage: "10% - 20%",
          description: "Upon reservation and initial booking agreement confirmation",
          description_ar: "عند حجز الوحدة وتأكيد العقد المبدئي",
          icon: "Coins",
          display_order: 1,
          is_active: true,
        },
        {
          id: `ms-std-2`,
          step_number: "02",
          title: "Construction Linked",
          title_ar: "أثناء مراحل البناء",
          percentage: "30% - 40%",
          description: "Installments tied to verified construction progress milestones",
          description_ar: "أقساط موزعة وفق مراحل إنجاز البناء المعتمدة رسمياً",
          icon: "Building2",
          display_order: 2,
          is_active: true,
        },
        {
          id: `ms-std-3`,
          step_number: "03",
          title: "Handover Completion",
          title_ar: "عند الاستلام النهائي",
          percentage: "40% - 50%",
          description: "Upon final project handover, quality inspection and key delivery",
          description_ar: "عند إنجاز المشروع، المعاينة الفنية واستلام المفاتيح",
          icon: "KeyRound",
          display_order: 3,
          is_active: true,
        },
      ]);
    } else if (presetType === "offplan") {
      setMilestones([
        {
          id: `ms-off-1`,
          step_number: "01",
          title: "Initial Booking Deposit",
          title_ar: "دفعة الحجز المبدئي",
          percentage: "20%",
          description: "Upon signing the Sales & Purchase Agreement (SPA)",
          description_ar: "عند توقيع اتفاقية البيع والشراء الأولية",
          icon: "Coins",
          display_order: 1,
          is_active: true,
        },
        {
          id: `ms-off-2`,
          step_number: "02",
          title: "Substructure & Foundation",
          title_ar: "إنجاز الأساسات الخرسانية",
          percentage: "20%",
          description: "Upon completion of basement foundations and piling",
          description_ar: "عند إتمام أعمال الأساسات والقواعد الخرسانية المعتمدة",
          icon: "Building2",
          display_order: 2,
          is_active: true,
        },
        {
          id: `ms-off-3`,
          step_number: "03",
          title: "Superstructure Envelope",
          title_ar: "اكتمال الهيكل الخرساني والواجهات",
          percentage: "20%",
          description: "Upon topping-out and completion of external facade glazing",
          description_ar: "عند اكتمال صب الهيكل والواجهات الخارجية",
          icon: "Building2",
          display_order: 3,
          is_active: true,
        },
        {
          id: `ms-off-4`,
          step_number: "04",
          title: "Final Handover & Title Deed",
          title_ar: "التسليم واستلام صك الملكية",
          percentage: "40%",
          description: "Upon receipt of occupancy certificate and key delivery",
          description_ar: "عند استلام شهادة إتمام البناء ومفاتيح الوحدة",
          icon: "KeyRound",
          display_order: 4,
          is_active: true,
        },
      ]);
    } else if (presetType === "posthandover") {
      setMilestones([
        {
          id: `ms-post-1`,
          step_number: "01",
          title: "Down Payment",
          title_ar: "دفعة المقدم",
          percentage: "10%",
          description: "Upon booking reservation confirmation",
          description_ar: "عند تأكيد حجز الوحدة المبدئي",
          icon: "Coins",
          display_order: 1,
          is_active: true,
        },
        {
          id: `ms-post-2`,
          step_number: "02",
          title: "During Construction",
          title_ar: "خلال فترة الإنشاء",
          percentage: "30%",
          description: "Flexible installments over construction milestones",
          description_ar: "دفعات موزعة طوال فترة تشييد المشروع",
          icon: "Building2",
          display_order: 2,
          is_active: true,
        },
        {
          id: `ms-post-3`,
          step_number: "03",
          title: "On Handover",
          title_ar: "دفعة استلام المفتاح",
          percentage: "20%",
          description: "Upon receiving keys and moving into the residence",
          description_ar: "عند استلام المفاتيح وبدء الإقامة في الوحدة",
          icon: "KeyRound",
          display_order: 3,
          is_active: true,
        },
        {
          id: `ms-post-4`,
          step_number: "04",
          title: "Year 1 Post-Handover",
          title_ar: "السنة الأولى بعد الاستلام",
          percentage: "20%",
          description: "Divided installments across 12 months after move-in",
          description_ar: "أقساط ميسرة على مدار 12 شهراً بعد الاستلام",
          icon: "CalendarDays",
          display_order: 4,
          is_active: true,
        },
        {
          id: `ms-post-5`,
          step_number: "05",
          title: "Year 2 Post-Handover",
          title_ar: "السنة الثانية بعد الاستلام",
          percentage: "20%",
          description: "Final extended installment plan across Year 2",
          description_ar: "الدفعات الختامية المتبقية خلال السنة الثانية",
          icon: "Percent",
          display_order: 5,
          is_active: true,
        },
      ]);
    }
  }

  // Amenity Handlers
  function handleOpenNewAmenityModal() {
    setEditingAmenityIndex(null);
    setCurrentAmenity({
      id: `amenity-${Date.now()}`,
      name: "",
      name_ar: "",
      description: "",
      description_ar: "",
      icon: "Sparkles",
      category: "Wellness & Leisure",
      display_order: amenities.length + 1,
      is_active: true,
    });
    setIsAmenityModalOpen(true);
  }

  function handleEditAmenity(index: number) {
    setEditingAmenityIndex(index);
    setCurrentAmenity(amenities[index]);
    setIsAmenityModalOpen(true);
  }

  function handleSaveAmenity() {
    if (!currentAmenity.name.trim()) {
      alert("Please provide an English name for this amenity (e.g. Swimming Pool).");
      return;
    }

    if (editingAmenityIndex !== null) {
      setAmenities((prev) =>
        prev.map((item, idx) => (idx === editingAmenityIndex ? currentAmenity : item))
      );
    } else {
      setAmenities((prev) => [
        ...prev,
        { ...currentAmenity, display_order: prev.length + 1 },
      ]);
    }
    setIsAmenityModalOpen(false);
  }

  function handleDeleteAmenity(index: number) {
    const item = amenities[index];
    if (window.confirm(`Delete amenity "${item.name}"?`)) {
      setAmenities((prev) => prev.filter((_, i) => i !== index));
    }
  }

  function handleMoveAmenity(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= amenities.length) return;

    setAmenities((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy.map((a, idx) => ({ ...a, display_order: idx + 1 }));
    });
  }

  function handleAddSuggestedAmenity(item: AmenityRecord) {
    const exists = amenities.some(
      (a) => a.name.toLowerCase().trim() === item.name.toLowerCase().trim()
    );
    if (exists) {
      alert(`"${item.name}" is already added to this project's amenities.`);
      return;
    }
    setAmenities((prev) => [
      ...prev,
      {
        ...item,
        id: `amenity-${Date.now()}-${prev.length}`,
        display_order: prev.length + 1,
      },
    ]);
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

  // Publishing Readiness Checklist evaluation (Task 4)
  const effectiveSlug = editingProjectId ? editingProjectId : customSlug.trim() ? customSlug.trim().toLowerCase() : (name.trim() ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : "");
  const checklistItems = [
    {
      id: "name",
      label: "Project Name",
      status: Boolean(name.trim()),
      importance: "Required" as const,
      hint: name.trim() ? name : "Missing development title",
      sectionAnchor: "sec-basic-info",
    },
    {
      id: "developer",
      label: "Master Developer",
      status: Boolean(developer.trim()),
      importance: "Required" as const,
      hint: developer.trim() ? developer : "Missing developer entity",
      sectionAnchor: "sec-basic-info",
    },
    {
      id: "price-area",
      label: "Pricing & Built-up Area",
      status: Boolean(price.trim() && area.trim()),
      importance: "Required" as const,
      hint: price.trim() && area.trim() ? `${price} · ${area}` : "Specify starting price & area",
      sectionAnchor: "sec-basic-info",
    },
    {
      id: "cover-image",
      label: "Main Cover Image",
      status: Boolean(imageFile || existingImageUrl),
      importance: "Required" as const,
      hint: imageFile || existingImageUrl ? "16:9 Cover asset ready" : "Upload primary landscape cover",
      sectionAnchor: "sec-media-cover",
    },
    {
      id: "description",
      label: "Editorial Narrative",
      status: Boolean(description.trim()),
      importance: "Required" as const,
      hint: description.trim() ? `${description.slice(0, 36)}...` : "Add project presentation copy",
      sectionAnchor: "sec-editorial",
    },
    {
      id: "slug",
      label: "SEO URL Slug",
      status: Boolean(effectiveSlug.trim()),
      importance: "Required" as const,
      hint: effectiveSlug.trim() ? `/projects/${effectiveSlug}` : "Slug not generated",
      sectionAnchor: "sec-seo",
    },
    {
      id: "configurations",
      label: "Unit Configurations",
      status: configurations.length > 0,
      importance: "Recommended" as const,
      hint: configurations.length > 0 ? `${configurations.length} unit typologies defined` : "Add unit types (villas, apartments)",
      sectionAnchor: "sec-configurations",
    },
    {
      id: "milestones",
      label: "Payment Milestones",
      status: milestones.length > 0,
      importance: "Recommended" as const,
      hint: milestones.length > 0 ? `${milestones.length} milestones configured` : "Define payment milestones",
      sectionAnchor: "sec-investment",
    },
    {
      id: "amenities",
      label: "Curated Amenities",
      status: amenities.length > 0 || selectedAmenities.length > 0,
      importance: "Recommended" as const,
      hint:
        (amenities.length > 0 ? amenities.length : selectedAmenities.length) > 0
          ? `${amenities.length || selectedAmenities.length} lifestyle privileges active`
          : "Add luxury amenities",
      sectionAnchor: "sec-amenities",
    },
    {
      id: "gallery",
      label: "Photography Gallery",
      status: galleryItems.length > 0 || existingGalleryUrls.length > 0,
      importance: "Recommended" as const,
      hint: galleryItems.length + existingGalleryUrls.length > 0 ? `${galleryItems.length + existingGalleryUrls.length} photos staged/stored` : "Upload exterior & interior photos",
      sectionAnchor: "sec-media-gallery",
    },
    {
      id: "location",
      label: "Google Maps Location",
      status: Boolean(googleMapsUrl.trim() || formattedAddress.trim()),
      importance: "Recommended" as const,
      hint: googleMapsUrl.trim() || formattedAddress.trim() ? "Coordinates / Maps linked" : "Paste Google Maps location link",
      sectionAnchor: "sec-location",
    },
    {
      id: "nearby",
      label: "Nearby Attractions",
      status: nearbyPlaces.length > 0,
      importance: "Recommended" as const,
      hint: nearbyPlaces.length > 0 ? `${nearbyPlaces.length} nearby places mapped` : "Click auto-fetch nearby places",
      sectionAnchor: "sec-location",
    },
    {
      id: "floorplan",
      label: "Architectural Floor Plan",
      status: Boolean(floorPlanFile || existingFloorPlanUrl),
      importance: "Optional" as const,
      hint: floorPlanFile || existingFloorPlanUrl ? "Master floor plan ready" : "Optional PDF or blueprint upload",
      sectionAnchor: "sec-floorplans",
    },
    {
      id: "video",
      label: "Cinematic Video Tour",
      status: Boolean(heroVideoUrl.trim() && parsedHeroVideo.isValid),
      importance: "Optional" as const,
      hint: heroVideoUrl.trim()
        ? parsedHeroVideo.isValid
          ? `Verified ${parsedHeroVideo.provider} (${parsedHeroVideo.videoId ? `ID: ${parsedHeroVideo.videoId}` : "active"})`
          : "Invalid video link format"
        : "Optional MP4/YouTube link",
      sectionAnchor: "sec-video-brochure",
    },
    {
      id: "brochure",
      label: "Digital Brochure PDF",
      status: Boolean(brochureUrl.trim()),
      importance: "Optional" as const,
      hint: brochureUrl.trim() ? "Official brochure link attached" : "Optional PDF download link",
      sectionAnchor: "sec-video-brochure",
    },
  ];

  const requiredChecklistItems = checklistItems.filter((i) => i.importance === "Required");
  const completedRequiredItems = requiredChecklistItems.filter((i) => i.status).length;
  const isReadyToPublish = completedRequiredItems === requiredChecklistItems.length;
  const totalCompletedChecklist = checklistItems.filter((i) => i.status).length;
  const readinessPercent = Math.round((totalCompletedChecklist / checklistItems.length) * 100);

  // Populate form for Editing
  async function handleStartEdit(project: ProjectRecord) {
    setEditingProjectId(project.id);
    setCustomSlug(project.id);
    setName(project.name);
    setPrice(project.price);
    setPaymentPlan(project.paymentPlan);
    setArea(project.area);
    setDeveloper(project.developer);
    setLocationLegacy(project.location || "");
    setCompletionDate(project.completion_date || "");
    setConstructionStage(project.construction_stage || "");
    setWhatsappNumber(project.whatsapp_number || "");
    setStatus(project.status || "Available");
    setType(project.type || "Luxury Residential");
    setStructure(project.structure || "");
    setDescription(project.description || "");
    setHeroVideoUrl(project.hero_video_url || "");
    setBrochureUrl(project.brochure_url || "");
    setGoogleMapsUrl(project.google_maps_url || "");
    setFormattedAddress(project.formatted_address || project.location || "");
    setCity(project.city || "Muscat");
    setCountry(project.country || "Oman");
    setLatitude(project.latitude ? String(project.latitude) : "");
    setLongitude(project.longitude ? String(project.longitude) : "");
    setIsPublished(project.is_published !== false);

    setExistingImageUrl(project.image);
    setImagePreview(project.image);
    setImageFile(null);

    setExistingFloorPlanUrl(project.floor_plan_url || null);
    setFloorPlanPreview(project.floor_plan_url || null);
    setFloorPlanFile(null);

    setExistingGalleryUrls(project.gallery_urls || []);
    galleryItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setGalleryItems([]);

    // Investment & Payment Plan
    setInvestmentEnabled(project.investment_enabled !== false);
    setInvestmentLabel(project.investment_label || "Investment & Payment Plan");
    setInvestmentLabelAr(project.investment_label_ar || "الاستثمار وخطة السداد");
    setInvestmentHeading(project.investment_heading || "Transparent Milestones & Investor Security");
    setInvestmentHeadingAr(project.investment_heading_ar || "دفعات ميسرة وفرص استثمارية واعدة");
    setInvestmentSubtitle(project.investment_subtitle || "Flexible payment milestones and high-yield ownership opportunities.");
    setInvestmentSubtitleAr(project.investment_subtitle_ar || "دفعات ميسرة وفرص تملك استثمارية ذات عوائد مجزية ومستدامة.");
    setMortgageEnabled(project.mortgage_enabled !== false);
    setMortgageTitle(project.mortgage_title || "Bank Mortgages");
    setMortgageTitleAr(project.mortgage_title_ar || "التمويل البنكي");
    setMortgageStatus(project.mortgage_status || "Bank Approved");
    setMortgageStatusAr(project.mortgage_status_ar || "معتمد بنكياً");
    setMortgageDescription(project.mortgage_description || "Mortgage eligibility across leading Omani banks.");
    setMortgageDescriptionAr(project.mortgage_description_ar || "تسهيلات تمويلية ميسرة وخيارات مرنة عبر البنوك العمانية الرائدة.");
    setMortgageBanks(project.mortgage_banks || "Bank Muscat, Bank Dhofar, Sohar International, National Bank of Oman");
    setMortgageAdditionalInfo(project.mortgage_additional_info || "Up to 80% financing available for eligible residents and investors.");

    // Milestones from relational table or JSON
    let loadedMilestones: PaymentMilestone[] = project.payment_milestones || [];
    try {
      const { data: mData } = await supabase
        .from("project_payment_milestones")
        .select("*")
        .eq("project_id", project.id)
        .order("display_order", { ascending: true });
      if (mData && mData.length > 0) {
        loadedMilestones = mData.map((m: Record<string, unknown>, idx: number) => ({
          id: String(m.id || `ms-${idx}`),
          step_number: String(m.step_number || String(idx + 1).padStart(2, "0")),
          title: String(m.title || ""),
          title_ar: typeof m.title_ar === "string" ? m.title_ar : undefined,
          percentage: String(m.percentage || ""),
          description: String(m.description || ""),
          description_ar: typeof m.description_ar === "string" ? m.description_ar : undefined,
          detailed_description: typeof m.detailed_description === "string" ? m.detailed_description : undefined,
          icon: String(m.icon || "Coins"),
          display_order: typeof m.display_order === "number" ? m.display_order : idx + 1,
          is_active: m.is_active !== false,
        }));
      }
    } catch {
      // Graceful fallback
    }
    setMilestones(loadedMilestones);

    // Amenities & Facilities
    setAmenitiesEnabled(project.amenities_enabled !== false);
    setAmenitiesLabel(project.amenities_label || "Amenities & Facilities");
    setAmenitiesLabelAr(project.amenities_label_ar || "المرافق والخدمات الحصرية");
    setAmenitiesHeading(project.amenities_heading || "Curated World-Class Lifestyle Privileges");
    setAmenitiesHeadingAr(project.amenities_heading_ar || "مرافق عالمية مصممة لأرقى أساليب الحياة");
    setAmenitiesSubtitle(project.amenities_subtitle || "Curated lifestyle amenities designed for comfort, leisure and wellness.");
    setAmenitiesSubtitleAr(project.amenities_subtitle_ar || "مرافق استثنائية صُممت لأسلوب حياة راقٍ يجمع بين الراحة والرفاهية والهدوء.");

    let loadedAmenities: AmenityRecord[] = [];
    try {
      const { data: aData } = await supabase
        .from("project_amenities")
        .select("*")
        .eq("project_id", project.id)
        .order("display_order", { ascending: true });
      if (aData && aData.length > 0) {
        loadedAmenities = aData.map((a: Record<string, unknown>, idx: number) => ({
          id: String(a.id || `am-${idx}`),
          name: String(a.name || ""),
          name_ar: typeof a.name_ar === "string" ? a.name_ar : undefined,
          description: typeof a.description === "string" ? a.description : undefined,
          description_ar: typeof a.description_ar === "string" ? a.description_ar : undefined,
          icon: String(a.icon || "Sparkles"),
          category: String(a.category || "General"),
          display_order: typeof a.display_order === "number" ? a.display_order : idx + 1,
          is_active: a.is_active !== false,
        }));
      }
    } catch {
      // Graceful fallback
    }

    if (loadedAmenities.length === 0 && Array.isArray(project.amenities)) {
      loadedAmenities = project.amenities.map((item, idx) => {
        if (typeof item === "string") {
          return {
            id: `legacy-${idx}`,
            name: item,
            name_ar: item,
            description: "Exclusive lifestyle facility designed for premium resident comfort.",
            description_ar: "مرفق سكني حصري مصمم لراحة ورفاهية الملاك والسكان.",
            icon: "Sparkles",
            category: "General",
            display_order: idx + 1,
            is_active: true,
          };
        }
        return item as AmenityRecord;
      });
    }
    setAmenities(loadedAmenities);

    const stringAmenities = Array.isArray(project.amenities)
      ? project.amenities.map((a) => (typeof a === "string" ? a : a.name))
      : [];
    setSelectedAmenities(stringAmenities);

    // Try fetching configurations from relational table first, fallback to JSON
    let loadedConfigs: PropertyConfiguration[] = project.property_configurations || [];
    try {
      const { data: cData } = await supabase
        .from("project_configurations")
        .select("*")
        .eq("project_id", project.id)
        .order("display_order", { ascending: true });
      if (cData && cData.length > 0) {
        loadedConfigs = cData.map((c: Record<string, unknown>) => ({
          id: String(c.id || ""),
          property_type: String(c.property_type || "Apartment"),
          name: String(c.name || ""),
          name_ar: typeof c.name_ar === "string" ? c.name_ar : undefined,
          bedrooms: Number(c.bedrooms ?? 1),
          bathrooms: Number(c.bathrooms ?? 1),
          balconies: Number(c.balconies ?? 0),
          bua_sqm: String(c.bua_sqm || ""),
          plot_sqm: typeof c.plot_sqm === "string" || typeof c.plot_sqm === "number" ? String(c.plot_sqm) : undefined,
          price: String(c.price || ""),
          currency: String(c.currency || "OMR"),
          availability: String(c.availability_status || c.availability || "Available"),
          description: typeof c.description === "string" ? c.description : undefined,
          description_ar: typeof c.description_ar === "string" ? c.description_ar : undefined,
          features: Array.isArray(c.features) ? (c.features as string[]) : [],
          furnishing: String(c.furnishing_status || c.furnishing || "Unfurnished"),
          parking: typeof c.parking_info === "string" ? c.parking_info : undefined,
          floor_plan_url: typeof c.floor_plan_url === "string" ? c.floor_plan_url : undefined,
          image_url: typeof c.image_url === "string" ? c.image_url : (Array.isArray(c.images) && c.images.length > 0 ? String(c.images[0]) : undefined),
          images: Array.isArray(c.images) ? (c.images as string[]) : [],
          is_featured: Boolean(c.is_featured),
        }));
      }
    } catch {
      // Gracefully fall back to JSON column
    }
    setConfigurations(loadedConfigs);

    // Try fetching nearby places from relational table, fallback to JSON
    let loadedPlaces: NearbyPlaceItem[] = project.nearby_locations || [];
    try {
      const { data: pData } = await supabase
        .from("project_nearby_places")
        .select("*")
        .eq("project_id", project.id)
        .order("display_order", { ascending: true });
      if (pData && pData.length > 0) {
        loadedPlaces = pData.map((p: Record<string, unknown>) => ({
          id: String(p.id || ""),
          name: String(p.name || ""),
          name_ar: typeof p.name_ar === "string" ? p.name_ar : undefined,
          category: String(p.category || "Landmark"),
          distance_km: typeof p.distance_km === "number" || typeof p.distance_km === "string" ? p.distance_km : undefined,
          travel_time_text: typeof p.travel_time_text === "string" ? p.travel_time_text : undefined,
          travel_time_minutes: typeof p.travel_time_minutes === "number" ? p.travel_time_minutes : undefined,
          google_maps_url: typeof p.google_maps_url === "string" ? p.google_maps_url : undefined,
          display_order: typeof p.display_order === "number" ? p.display_order : undefined,
        }));
      }
    } catch {
      // Gracefully fall back
    }
    setNearbyPlaces(loadedPlaces);

    setFormError(null);
    setFormSuccess(null);
    setValidationWarning(null);

    window.scrollTo({ top: 120, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingProjectId(null);
    setCustomSlug("");
    setName("");
    setPrice("");
    setCurrency("OMR");
    setPaymentPlan("");
    setArea("");
    setDeveloper("");
    setLocationLegacy("");
    setCompletionDate("");
    setConstructionStage("");
    setWhatsappNumber("");
    setStatus("Available");
    setType("Luxury Residential");
    setStructure("");
    setDescription("");
    setHeroVideoUrl("");
    setBrochureUrl("");
    setGoogleMapsUrl("");
    setFormattedAddress("");
    setCity("Muscat");
    setCountry("Oman");
    setLatitude("");
    setLongitude("");
    setConfigurations([]);
    setNearbyPlaces([]);
    setSelectedAmenities([]);
    setMilestones([]);
    setAmenities([]);
    setInvestmentEnabled(true);
    setInvestmentLabel("Investment & Payment Plan");
    setInvestmentLabelAr("الاستثمار وخطة السداد");
    setInvestmentHeading("Transparent Milestones & Investor Security");
    setInvestmentHeadingAr("دفعات ميسرة وفرص استثمارية واعدة");
    setInvestmentSubtitle("Flexible payment milestones and high-yield ownership opportunities.");
    setInvestmentSubtitleAr("دفعات ميسرة وفرص تملك استثمارية ذات عوائد مجزية ومستدامة.");
    setMortgageEnabled(true);
    setMortgageTitle("Bank Mortgages");
    setMortgageTitleAr("التمويل البنكي");
    setMortgageStatus("Bank Approved");
    setMortgageStatusAr("معتمد بنكياً");
    setMortgageDescription("Mortgage eligibility and financing facilitation across leading Omani banks.");
    setMortgageDescriptionAr("تسهيلات تمويلية ميسرة وخيارات مرنة عبر البنوك العمانية الرائدة.");
    setMortgageBanks("Bank Muscat, Bank Dhofar, Sohar International, National Bank of Oman");
    setMortgageAdditionalInfo("Up to 80% financing available for eligible residents and investors.");
    setAmenitiesEnabled(true);
    setAmenitiesLabel("Amenities & Facilities");
    setAmenitiesLabelAr("المرافق والخدمات الحصرية");
    setAmenitiesHeading("Curated World-Class Lifestyle Privileges");
    setAmenitiesHeadingAr("مرافق عالمية مصممة لأرقى أساليب الحياة");
    setAmenitiesSubtitle("Curated lifestyle amenities designed for comfort, leisure and wellness.");
    setAmenitiesSubtitleAr("مرافق استثنائية صُممت لأسلوب حياة راقٍ يجمع بين الراحة والرفاهية والهدوء.");
    setIsPublished(true);

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

  // Submit or update project
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
    const slug = isEdit ? editingProjectId! : customSlug.trim() ? customSlug.trim().toLowerCase() : generateSlug(name);

    try {
      let publicImageUrl = existingImageUrl || "";

      // 1. Upload main cover image if changed
      if (imageFile) {
        setUploadProgress({ current: 1, total: 1 + galleryItems.length + (floorPlanFile ? 1 : 0), stage: "Uploading main cover image..." });

        const mainValidation = await detectFileFormat(imageFile);
        if (!mainValidation.isValid) {
          throw new Error(mainValidation.errorMessage || "Main image format is unsupported.");
        }

        const processedMain = await compressImageFile(imageFile);
        const isWebP = processedMain.type === "image/webp";
        const mainContentType = isWebP ? "image/webp" : getNormalizedContentType(processedMain, mainValidation.detectedMime);
        const mainExt = isWebP ? "webp" : mainValidation.normalizedExt;
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

        if (!publicUrlData?.publicUrl) {
          throw new Error("Failed to generate public URL for main cover image.");
        }
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
        const isWebP = processedGFile.type === "image/webp";
        const gContentType = isWebP ? "image/webp" : getNormalizedContentType(processedGFile, validation.detectedMime);
        const gExt = isWebP ? "webp" : validation.normalizedExt;
        const gPath = `properties/${slug}-gallery-${Date.now()}-${i + 1}.${gExt}`;

        const { error: gUploadErr } = await supabase.storage
          .from("property-images")
          .upload(gPath, processedGFile, {
            contentType: gContentType,
            cacheControl: "3600",
            upsert: true,
          });

        if (gUploadErr) {
          throw new Error(`Gallery upload failed for "${item.name}" (${i + 1}/${galleryItems.length}): ${gUploadErr.message}`);
        }

        const { data: gUrlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(gPath);

        if (gUrlData?.publicUrl) {
          newlyUploadedUrls.push(gUrlData.publicUrl);
        } else {
          throw new Error(`Failed to generate public URL for gallery photo "${item.name}".`);
        }
      }

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
        const isWebP = processedFpFile.type === "image/webp";
        const fpContentType = isWebP ? "image/webp" : getNormalizedContentType(processedFpFile, fpValidation.detectedMime);
        const fpExt = isWebP ? "webp" : fpValidation.normalizedExt;
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

      // 4. Construct complete payload
      const effectiveLocation = formattedAddress.trim() || locationLegacy.trim() || (city ? `${city}, ${country}` : "Muscat, Oman");
      const numLat = latitude.trim() ? parseFloat(latitude) : null;
      const numLng = longitude.trim() ? parseFloat(longitude) : null;

      const basePayload: Record<string, unknown> = {
        name: name.trim(),
        price: price.trim(),
        payment_plan: paymentPlan.trim(),
        area: area.trim(),
        developer: developer.trim(),
        image: publicImageUrl,
        gallery_urls: finalGalleryUrls,
        floor_plan_url: floorPlanUrl,
        location: effectiveLocation,
        completion_date: completionDate.trim() || null,
        construction_stage: constructionStage.trim() || null,
        status: status.trim() || "Available",
        type: type.trim() || "Luxury Residential",
        structure: structure.trim() || null,
        description: description.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const richPayload: Record<string, unknown> = {
        ...basePayload,
        whatsapp_number: whatsappNumber.trim() || null,
        hero_video_url: heroVideoUrl.trim() || null,
        brochure_url: brochureUrl.trim() || null,
        google_maps_url: googleMapsUrl.trim() || null,
        formatted_address: formattedAddress.trim() || effectiveLocation,
        city: city.trim() || "Muscat",
        country: country.trim() || "Oman",
        latitude: numLat,
        longitude: numLng,
        amenities: amenities.length > 0 ? amenities : selectedAmenities,
        amenities_enabled: amenitiesEnabled,
        amenities_label: amenitiesLabel.trim() || null,
        amenities_label_ar: amenitiesLabelAr.trim() || null,
        amenities_heading: amenitiesHeading.trim() || null,
        amenities_heading_ar: amenitiesHeadingAr.trim() || null,
        amenities_subtitle: amenitiesSubtitle.trim() || null,
        amenities_subtitle_ar: amenitiesSubtitleAr.trim() || null,
        investment_enabled: investmentEnabled,
        investment_label: investmentLabel.trim() || null,
        investment_label_ar: investmentLabelAr.trim() || null,
        investment_heading: investmentHeading.trim() || null,
        investment_heading_ar: investmentHeadingAr.trim() || null,
        investment_subtitle: investmentSubtitle.trim() || null,
        investment_subtitle_ar: investmentSubtitleAr.trim() || null,
        payment_milestones: milestones,
        mortgage_enabled: mortgageEnabled,
        mortgage_title: mortgageTitle.trim() || null,
        mortgage_title_ar: mortgageTitleAr.trim() || null,
        mortgage_status: mortgageStatus.trim() || null,
        mortgage_status_ar: mortgageStatusAr.trim() || null,
        mortgage_description: mortgageDescription.trim() || null,
        mortgage_description_ar: mortgageDescriptionAr.trim() || null,
        mortgage_banks: mortgageBanks.trim() || null,
        mortgage_additional_info: mortgageAdditionalInfo.trim() || null,
        property_configurations: configurations,
        nearby_locations: nearbyPlaces,
        is_published: isPublished,
      };

      if (isEdit) {
        let updateResult = await supabase
          .from("projects")
          .update(richPayload)
          .eq("id", editingProjectId);

        if (updateResult.error && updateResult.error.message.includes("does not exist")) {
          // Fallback if schema migration hasn't added new columns yet
          updateResult = await supabase
            .from("projects")
            .update(basePayload)
            .eq("id", editingProjectId);
        }

        if (updateResult.error) {
          throw new Error(`Database update failed: ${updateResult.error.message}`);
        }
      } else {
        const insertRich = { ...richPayload, id: slug };
        const insertBase = { ...basePayload, id: slug };

        let insertResult = await supabase.from("projects").insert([insertRich]);

        if (insertResult.error && insertResult.error.message.includes("does not exist")) {
          insertResult = await supabase.from("projects").insert([insertBase]);
        }

        if (insertResult.error) {
          throw new Error(`Database insert failed: ${insertResult.error.message}`);
        }
      }

      // 5. Try updating relational tables (project_configurations & project_nearby_places) if they exist
      try {
        await supabase.from("project_configurations").delete().eq("project_id", slug);
        if (configurations.length > 0) {
          const configInserts = configurations.map((c, idx) => ({
            project_id: slug,
            property_type: c.property_type || "Apartment",
            name: c.name,
            name_ar: c.name_ar || null,
            bedrooms: c.bedrooms ?? 1,
            bathrooms: c.bathrooms ?? 1,
            balconies: c.balconies ?? 0,
            bua_sqm: c.bua_sqm ? parseFloat(String(c.bua_sqm)) : null,
            plot_sqm: c.plot_sqm ? parseFloat(String(c.plot_sqm)) : null,
            price: c.price || null,
            currency: c.currency || "OMR",
            availability_status: c.availability || "Available",
            description: c.description || null,
            description_ar: c.description_ar || null,
            features: c.features || [],
            furnishing_status: c.furnishing || "Unfurnished",
            parking_info: c.parking || null,
            floor_plan_url: c.floor_plan_url || null,
            image_url: c.image_url || (Array.isArray(c.images) && c.images.length > 0 ? c.images[0] : null),
            images: Array.isArray(c.images) && c.images.length > 0 ? c.images : (c.image_url ? [c.image_url] : []),
            is_featured: Boolean(c.is_featured),
            display_order: idx + 1,
          }));
          await supabase.from("project_configurations").insert(configInserts);
        }
      } catch (cErr) {
        console.warn("Relational project_configurations update skipped:", cErr);
      }

      try {
        await supabase.from("project_nearby_places").delete().eq("project_id", slug);
        if (nearbyPlaces.length > 0) {
          const placeInserts = nearbyPlaces.map((p, idx) => ({
            project_id: slug,
            name: p.name,
            name_ar: p.name_ar || null,
            category: p.category,
            distance_km: p.distance_km ? parseFloat(String(p.distance_km)) : null,
            travel_time_text: p.travel_time_text || null,
            travel_time_minutes: p.travel_time_minutes || null,
            google_maps_url: p.google_maps_url || null,
            display_order: idx + 1,
          }));
          await supabase.from("project_nearby_places").insert(placeInserts);
        }
      } catch (pErr) {
        console.warn("Relational project_nearby_places update skipped:", pErr);
      }

      // Synchronize relational payment milestones
      try {
        await supabase.from("project_payment_milestones").delete().eq("project_id", slug);
        if (milestones.length > 0) {
          const milestoneInserts = milestones.map((m, idx) => ({
            project_id: slug,
            step_number: m.step_number || String(idx + 1).padStart(2, "0"),
            title: m.title,
            title_ar: m.title_ar || null,
            percentage: m.percentage,
            description: m.description,
            description_ar: m.description_ar || null,
            detailed_description: m.detailed_description || null,
            icon: m.icon || "Coins",
            display_order: idx + 1,
            is_active: m.is_active !== false,
          }));
          await supabase.from("project_payment_milestones").insert(milestoneInserts);
        }
      } catch (mErr) {
        console.warn("Relational project_payment_milestones update skipped:", mErr);
      }

      // Synchronize relational amenities
      try {
        await supabase.from("project_amenities").delete().eq("project_id", slug);
        const amenitiesToInsert: AmenityRecord[] = amenities.length > 0
          ? amenities
          : selectedAmenities.map((sName, sIdx) => ({
              name: sName,
              category: "General",
              icon: "Sparkles",
              display_order: sIdx + 1,
              is_active: true,
            }));

        if (amenitiesToInsert.length > 0) {
          const amenityInserts = amenitiesToInsert.map((a, idx) => ({
            project_id: slug,
            name: a.name,
            name_ar: a.name_ar || null,
            description: a.description || null,
            description_ar: a.description_ar || null,
            icon: a.icon || "Sparkles",
            category: a.category || "General",
            display_order: idx + 1,
            is_active: a.is_active !== false,
          }));
          await supabase.from("project_amenities").insert(amenityInserts);
        }
      } catch (aErr) {
        console.warn("Relational project_amenities update skipped:", aErr);
      }

      setFormSuccess(
        isEdit
          ? `Successfully updated "${name}" and synchronized all media & configurations!`
          : `Successfully published "${name}" to the portfolio!`,
      );

      // Keep administrator in edit mode for this project — DO NOT reset form!
      setEditingProjectId(slug);
      setCustomSlug(slug);
      setExistingImageUrl(publicImageUrl);
      setImagePreview(publicImageUrl);
      setImageFile(null);

      setExistingGalleryUrls(finalGalleryUrls);
      galleryItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      setGalleryItems([]);

      setExistingFloorPlanUrl(floorPlanUrl);
      setFloorPlanPreview(floorPlanUrl);
      setFloorPlanFile(null);

      // Reset DOM file input values so user can immediately select new files if desired
      const coverInput = document.getElementById("project-image-input") as HTMLInputElement | null;
      if (coverInput) coverInput.value = "";
      const galleryInput = document.getElementById("project-gallery-input") as HTMLInputElement | null;
      if (galleryInput) galleryInput.value = "";
      const fpInput = document.getElementById("project-floor-plan-input") as HTMLInputElement | null;
      if (fpInput) fpInput.value = "";

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
      router.replace("/admin/login/");
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
    <div className="min-h-screen bg-[#050816] text-slate-100 font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
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
                  Admin Pro
                </span>
              </div>
              <span className="text-[0.65rem] tracking-[0.25em] text-cyan-400 uppercase">
                Portfolio Architecture & Control
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 shadow-sm transition hover:bg-amber-500/20 hover:border-amber-400 hover:text-white"
              title="Open Admin Content & Media Upload Guide"
            >
              <BookOpen className="h-4 w-4 text-amber-400" />
              <span className="hidden sm:inline">Admin Content</span> Guide
            </button>

            {user?.email && (
              <span className="hidden text-xs text-slate-400 lg:inline-block">
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
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-sky-400 uppercase">
              Portfolio Control Desk
            </p>
            <h1 className="mt-2 font-serif text-3xl font-extrabold text-white sm:text-4xl">
              Project Inventory, Configurations & Location Intelligence
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400 leading-relaxed font-sans">
              Publish and manage developments, define multiple unit configurations (Villas, Apartments, Studios),
              resolve Google Maps locations, fetch surrounding attractions across 11 categories, and manage media.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center gap-2 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/15 to-amber-500/5 px-4 py-3 text-xs font-bold text-amber-300 hover:border-amber-400 hover:bg-amber-500/25 hover:text-white transition shrink-0 self-start md:self-auto shadow-lg shadow-amber-500/10"
          >
            <BookOpen className="h-4 w-4 text-amber-400" />
            <span>Open Content Upload Guide</span>
          </button>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* =========================================================================
              LEFT COLUMN: 10 STRUCTURED SECTIONS FORM (7 cols)
              ========================================================================= */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-5">
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
                      {editingProjectId ? `Edit Project: ${name || editingProjectId}` : "Add New Development"}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {editingProjectId ? `Updating ID: ${editingProjectId}` : "10-Section Real Estate Presentation Builder"}
                    </p>
                  </div>
                </div>

                {editingProjectId && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1.5 rounded-xl border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:bg-sky-500/20 transition"
                      title="Switch to creating a new project"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>New Development</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Form Alerts */}
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

              {/* Progress Bar during upload */}
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

              <form onSubmit={handleSubmitProject} className="mt-6 space-y-8">
                {/* -------------------------------------------------------------
                    SECTION 1: BASIC PROJECT INFORMATION
                    ------------------------------------------------------------- */}
                <div id="sec-basic-info" className="rounded-2xl border border-white/10 bg-slate-950/50 p-5 space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-400">1</span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Basic Project Information</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase">Project Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Sultan Haitham City"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase">Master Developer *</label>
                      <input
                        type="text"
                        required
                        value={developer}
                        onChange={(e) => setDeveloper(e.target.value)}
                        placeholder="e.g., Al Abrar Real Estate"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase">Starting Price *</label>
                      <div className="mt-1.5 flex gap-2">
                        <input
                          type="text"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="e.g., 45,000"
                          className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                        />
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:border-sky-400 focus:outline-none"
                        >
                          <option value="OMR">OMR</option>
                          <option value="USD">USD</option>
                          <option value="AED">AED</option>
                          <option value="SAR">SAR</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase">Starting Area *</label>
                      <input
                        type="text"
                        required
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="e.g., 67.5 sqm (726 sq ft)"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase">Payment Plan *</label>
                      <input
                        type="text"
                        required
                        value={paymentPlan}
                        onChange={(e) => setPaymentPlan(e.target.value)}
                        placeholder="e.g., 20% Down / 80% on Handover"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase">Construction Stage</label>
                      <input
                        type="text"
                        value={constructionStage}
                        onChange={(e) => setConstructionStage(e.target.value)}
                        placeholder="e.g., Active Construction (75% Done)"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase">Handover Date</label>
                      <input
                        type="text"
                        value={completionDate}
                        onChange={(e) => setCompletionDate(e.target.value)}
                        placeholder="e.g., Q4 2026"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase">
                        Project WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="e.g., 96891234567"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                      />
                      <p className="mt-1 text-[11px] text-slate-400">
                        Enter with country code, e.g., 96891234567 (leave blank to use default corporate WhatsApp)
                      </p>
                    </div>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    SECTION 2: PROJECT OVERVIEW & NARRATIVE
                    ------------------------------------------------------------- */}
                <div id="sec-editorial" className="rounded-2xl border border-white/10 bg-slate-950/50 p-5 space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-400">2</span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Project Overview & Editorial Narrative</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase">Project Typology</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-sky-400 focus:outline-none"
                      >
                        <option value="Luxury Residential">Luxury Residential</option>
                        <option value="Master-Planned Community">Master-Planned Community</option>
                        <option value="Waterfront Living">Waterfront Living</option>
                        <option value="Commercial & Offices">Commercial & Offices</option>
                        <option value="Mixed-Use Development">Mixed-Use Development</option>
                        <option value="Exclusive Villas">Exclusive Villas</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase">Structure / Finishes</label>
                      <input
                        type="text"
                        value={structure}
                        onChange={(e) => setStructure(e.target.value)}
                        placeholder="e.g., G + 6 Floors, Italian Marble & Smart Living"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase">Editorial Story / Description</label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Comprehensive narrative detailing architectural vision, lifestyle advantages, and strategic investment potential in Oman..."
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    SECTION 3: PROPERTY TYPES & AVAILABLE UNITS (CONFIGURATIONS)
                    ------------------------------------------------------------- */}
                <div id="sec-configurations" className="rounded-2xl border border-sky-400/20 bg-slate-950/60 p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-400">3</span>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">Property Types & Available Units</h3>
                        <p className="text-[11px] text-slate-400">Add multiple configurations (Villas, 1-4 BR Apartments, Studios, Penthouses)</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenNewConfigModal}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500/15 border border-sky-400/30 px-3 py-1.5 text-xs font-bold text-sky-300 hover:bg-sky-500/30 transition"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>+ Add Configuration</span>
                    </button>
                  </div>

                  {configurations.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">
                      <Layers className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                      <p className="text-xs font-medium text-slate-300">No specific unit configurations added yet</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Click &quot;+ Add Configuration&quot; above to add specific layouts with bedrooms, bathrooms, BUA, and floor plans.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {configurations.map((conf, idx) => (
                        <div
                          key={conf.id || idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/80 p-3.5 transition hover:border-white/20"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 font-mono text-xs font-bold text-slate-400">
                              {idx + 1}
                            </span>
                            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-slate-950">
                              {conf.image_url || (Array.isArray(conf.images) && conf.images.length > 0) ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={conf.image_url || conf.images![0]}
                                  alt={conf.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center text-slate-600 bg-white/5">
                                  <ImageIcon className="h-4 w-4 text-slate-500" />
                                  <span className="text-[8px] text-slate-500 font-medium">No Image</span>
                                </div>
                              )}
                              {Array.isArray(conf.images) && conf.images.length > 1 && (
                                <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.2 text-[8px] font-bold text-sky-300">
                                  +{conf.images.length - 1}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-xs sm:text-sm">{conf.name}</span>
                                {conf.is_featured && (
                                  <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 uppercase">
                                    <Star className="h-2.5 w-2.5 fill-amber-300" /> Featured
                                  </span>
                                )}
                                <span className="rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-sky-400 uppercase">
                                  {conf.property_type}
                                </span>
                              </div>
                              <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                                <span>{conf.bedrooms === 0 ? "Studio" : `${conf.bedrooms} Beds`}</span>
                                <span>•</span>
                                <span>{conf.bathrooms} Baths</span>
                                <span>•</span>
                                <span>BUA: {conf.bua_sqm} sqm</span>
                                {conf.plot_sqm && (
                                  <>
                                    <span>•</span>
                                    <span>Plot: {conf.plot_sqm} sqm</span>
                                  </>
                                )}
                                <span>•</span>
                                <span className="font-semibold text-amber-400">{conf.price || "On Request"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => handleMoveConfig(idx, "up")}
                              disabled={idx === 0}
                              className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                              title="Move Up"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveConfig(idx, "down")}
                              disabled={idx === configurations.length - 1}
                              className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                              title="Move Down"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditConfig(idx)}
                              className="rounded-lg p-1.5 text-sky-400 hover:bg-sky-500/20 transition"
                              title="Edit Configuration"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteConfig(idx)}
                              className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/20 transition"
                              title="Delete Configuration"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* -------------------------------------------------------------
                    SECTION 4: PROPERTY LOCATION & NEARBY PLACES
                    ------------------------------------------------------------- */}
                <div id="sec-location" className="rounded-2xl border border-white/10 bg-slate-950/50 p-5 space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-400">4</span>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">Property Location & Automatic Nearby Places</h3>
                      <p className="text-[11px] text-slate-400">Paste a Google Maps link to automatically resolve coordinates, address & surrounding landmarks</p>
                    </div>
                  </div>

                  {/* Google Maps Link & Fetch Action */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase">Google Maps Link</label>
                    <div className="mt-1.5 flex gap-2">
                      <input
                        type="url"
                        value={googleMapsUrl}
                        onChange={(e) => setGoogleMapsUrl(e.target.value)}
                        placeholder="https://maps.app.goo.gl/... or https://google.com/maps/place/..."
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleResolveLocation}
                        disabled={isResolvingLocation || !googleMapsUrl.trim()}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 hover:brightness-110 disabled:opacity-50 transition"
                      >
                        {isResolvingLocation ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Navigation className="h-3.5 w-3.5" />
                        )}
                        <span>Fetch Location</span>
                      </button>
                    </div>
                  </div>

                  {/* Resolved Address & Coordinates Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 uppercase">Formatted Address / Street</label>
                      <input
                        type="text"
                        value={formattedAddress}
                        onChange={(e) => setFormattedAddress(e.target.value)}
                        placeholder="e.g., Al Mouj Street, Seeb, Muscat, Sultanate of Oman"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Muscat"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase">Country</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Oman"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase">Latitude</label>
                      <input
                        type="text"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        placeholder="e.g., 23.5880"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white font-mono placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase">Longitude</label>
                      <input
                        type="text"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        placeholder="e.g., 58.3829"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white font-mono placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Interactive Map Preview */}
                  {(latitude && longitude) && (
                    <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-950">
                      <div className="h-44 w-full">
                        <iframe
                          title="Property Coordinates Preview"
                          src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`}
                          className="h-full w-full border-0 filter invert contrast-[0.9] opacity-80"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}

                  {/* Nearby Places Section */}
                  <div className="pt-3 border-t border-white/10 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Surrounding Attractions & Landmarks</span>
                        <p className="text-[11px] text-slate-400">11 Categories: Airports, Hospitals, Schools, Malls, Beaches, etc.</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleFetchNearbyPlaces}
                        disabled={isFetchingNearby || !latitude || !longitude}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-50 transition"
                      >
                        {isFetchingNearby ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5 text-sky-400" />}
                        <span>Fetch Nearby Places</span>
                      </button>
                    </div>

                    {/* Nearby Places List */}
                    {nearbyPlaces.length > 0 && (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {nearbyPlaces.map((place, idx) => (
                          <div
                            key={place.id || idx}
                            className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/60 p-2 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-sky-500/15 px-1.5 py-0.5 text-[9px] font-bold text-sky-300 uppercase">
                                {place.category}
                              </span>
                              <span className="font-medium text-white">{place.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {place.distance_km && (
                                <span className="font-mono text-amber-400 text-[11px]">{place.distance_km} km</span>
                              )}
                              {place.travel_time_text && (
                                <span className="text-slate-400 text-[10px]">({place.travel_time_text})</span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveNearbyPlace(idx)}
                                className="text-slate-500 hover:text-red-400 p-0.5"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Manual Add Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5">
                      <input
                        type="text"
                        value={newPlaceName}
                        onChange={(e) => setNewPlaceName(e.target.value)}
                        placeholder="Place name (e.g. Muscat Int Airport)"
                        className="sm:col-span-2 rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                      <select
                        value={newPlaceCategory}
                        onChange={(e) => setNewPlaceCategory(e.target.value)}
                        className="rounded-xl border border-white/10 bg-slate-900 px-2 py-1.5 text-xs text-white focus:outline-none"
                      >
                        {NEARBY_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddManualNearbyPlace}
                        className="rounded-xl bg-white/10 border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/20 transition"
                      >
                        + Add Place
                      </button>
                    </div>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    SECTION 5: INVESTMENT & PAYMENT PLAN
                    ------------------------------------------------------------- */}
                <div id="sec-investment" className="rounded-2xl border border-amber-400/20 bg-slate-950/60 p-5 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">5</span>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">Investment & Payment Plan</h3>
                        <p className="text-[11px] text-slate-400">Configure milestones, installment schedules, and independent bank mortgage details</p>
                      </div>
                    </div>

                    {/* Section Enable Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-900 border border-white/10 px-3 py-1.5 rounded-xl">
                      <input
                        type="checkbox"
                        checked={investmentEnabled}
                        onChange={(e) => setInvestmentEnabled(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-white/20 bg-slate-950 text-amber-500"
                      />
                      <span className="text-xs font-semibold text-slate-300">
                        {investmentEnabled ? "Section Enabled" : "Section Disabled"}
                      </span>
                    </label>
                  </div>

                  {investmentEnabled && (
                    <>
                      {/* Section Headings & Subtitles (EN & AR) */}
                      <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">Section Header Customization</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase">Section Label (EN)</label>
                            <input
                              type="text"
                              value={investmentLabel}
                              onChange={(e) => setInvestmentLabel(e.target.value)}
                              placeholder="Investment & Payment Plan"
                              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase">Section Label (Arabic)</label>
                            <input
                              type="text"
                              value={investmentLabelAr}
                              onChange={(e) => setInvestmentLabelAr(e.target.value)}
                              placeholder="الاستثمار وخطة السداد"
                              dir="rtl"
                              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase">Main Heading (EN)</label>
                            <input
                              type="text"
                              value={investmentHeading}
                              onChange={(e) => setInvestmentHeading(e.target.value)}
                              placeholder="Transparent Milestones & Investor Security"
                              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase">Main Heading (Arabic)</label>
                            <input
                              type="text"
                              value={investmentHeadingAr}
                              onChange={(e) => setInvestmentHeadingAr(e.target.value)}
                              placeholder="دفعات ميسرة وفرص استثمارية واعدة"
                              dir="rtl"
                              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase">Subtitle (EN)</label>
                            <input
                              type="text"
                              value={investmentSubtitle}
                              onChange={(e) => setInvestmentSubtitle(e.target.value)}
                              placeholder="Flexible payment milestones and high-yield ownership opportunities."
                              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase">Subtitle (Arabic)</label>
                            <input
                              type="text"
                              value={investmentSubtitleAr}
                              onChange={(e) => setInvestmentSubtitleAr(e.target.value)}
                              placeholder="دفعات ميسرة وفرص تملك استثمارية ذات عوائد مجزية ومستدامة."
                              dir="rtl"
                              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Payment Milestones Builder */}
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Payment Milestones ({milestones.length})</h4>
                            <p className="text-[11px] text-slate-400">Order, percentage, and descriptions for each payment stage</p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* Quick Presets */}
                            <div className="flex items-center gap-1 bg-slate-900 border border-white/10 rounded-xl p-1 text-[11px]">
                              <span className="text-slate-400 px-1 font-semibold">Presets:</span>
                              <button
                                type="button"
                                onClick={() => handleApplyMilestonePreset("standard")}
                                className="px-2 py-0.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
                                title="Standard 3-Stage: 20% Down / 40% Construction / 40% Handover"
                              >
                                3-Stage
                              </button>
                              <button
                                type="button"
                                onClick={() => handleApplyMilestonePreset("offplan")}
                                className="px-2 py-0.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
                                title="Off-Plan 4-Stage: 20% / 20% / 20% / 40%"
                              >
                                4-Stage
                              </button>
                              <button
                                type="button"
                                onClick={() => handleApplyMilestonePreset("posthandover")}
                                className="px-2 py-0.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
                                title="Post-Handover 5-Stage"
                              >
                                5-Stage
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={handleOpenNewMilestoneModal}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/15 border border-amber-400/30 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>+ Add Milestone</span>
                            </button>
                          </div>
                        </div>

                        {milestones.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">
                            <Coins className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                            <p className="text-xs font-medium text-slate-300">No payment milestones defined yet</p>
                            <p className="text-[11px] text-slate-500 mt-1">
                              Click &quot;+ Add Milestone&quot; or choose a preset (3-Stage, 4-Stage, 5-Stage) above.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {milestones.map((m, idx) => (
                              <div
                                key={m.id || idx}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/80 p-3.5 transition hover:border-amber-400/30"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-400/20">
                                    {m.step_number || String(idx + 1).padStart(2, "0")}
                                  </span>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-white text-xs sm:text-sm">{m.title}</span>
                                      {m.title_ar && (
                                        <span className="text-xs text-slate-400">({m.title_ar})</span>
                                      )}
                                      <span className="rounded bg-amber-500/20 border border-amber-400/30 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                                        {m.percentage}
                                      </span>
                                      {!m.is_active && (
                                        <span className="rounded bg-slate-800 text-slate-400 px-1.5 py-0.5 text-[10px]">
                                          Hidden
                                        </span>
                                      )}
                                    </div>
                                    {m.description && (
                                      <p className="mt-1 text-[11px] text-slate-400 truncate max-w-md">
                                        {m.description}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 self-end sm:self-center">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveMilestone(idx, "up")}
                                    disabled={idx === 0}
                                    className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                                    title="Move Up"
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveMilestone(idx, "down")}
                                    disabled={idx === milestones.length - 1}
                                    className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                                    title="Move Down"
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleEditMilestone(idx)}
                                    className="rounded-lg p-1.5 text-amber-400 hover:bg-amber-500/20 transition"
                                    title="Edit Milestone"
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteMilestone(idx)}
                                    className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/20 transition"
                                    title="Delete Milestone"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Independent Bank Mortgage Card Configuration */}
                      <div className="rounded-xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 via-slate-900/60 to-transparent p-4 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-amber-400/20">
                          <div className="flex items-center gap-2">
                            <Landmark className="h-4 w-4 text-amber-400" />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                              Independent Bank Mortgage Card
                            </h4>
                          </div>

                          <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-2.5 py-1 rounded-lg border border-amber-400/30">
                            <input
                              type="checkbox"
                              checked={mortgageEnabled}
                              onChange={(e) => setMortgageEnabled(e.target.checked)}
                              className="h-3 w-3 rounded border-amber-400 text-amber-500"
                            />
                            <span className="text-[11px] font-semibold text-amber-200">
                              {mortgageEnabled ? "Card Visible" : "Card Hidden"}
                            </span>
                          </label>
                        </div>

                        {mortgageEnabled && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 uppercase">Card Title (EN)</label>
                              <input
                                type="text"
                                value={mortgageTitle}
                                onChange={(e) => setMortgageTitle(e.target.value)}
                                placeholder="Bank Mortgages"
                                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 uppercase">Card Title (Arabic)</label>
                              <input
                                type="text"
                                value={mortgageTitleAr}
                                onChange={(e) => setMortgageTitleAr(e.target.value)}
                                placeholder="التمويل البنكي"
                                dir="rtl"
                                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 uppercase">Status / Badge (EN)</label>
                              <input
                                type="text"
                                value={mortgageStatus}
                                onChange={(e) => setMortgageStatus(e.target.value)}
                                placeholder="Bank Approved"
                                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 uppercase">Status / Badge (Arabic)</label>
                              <input
                                type="text"
                                value={mortgageStatusAr}
                                onChange={(e) => setMortgageStatusAr(e.target.value)}
                                placeholder="معتمد بنكياً"
                                dir="rtl"
                                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-semibold text-slate-300 uppercase">Description (EN)</label>
                              <input
                                type="text"
                                value={mortgageDescription}
                                onChange={(e) => setMortgageDescription(e.target.value)}
                                placeholder="Mortgage eligibility and financing facilitation across leading Omani banks."
                                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-semibold text-slate-300 uppercase">Description (Arabic)</label>
                              <input
                                type="text"
                                value={mortgageDescriptionAr}
                                onChange={(e) => setMortgageDescriptionAr(e.target.value)}
                                placeholder="تسهيلات تمويلية ميسرة وخيارات مرنة عبر البنوك العمانية الرائدة."
                                dir="rtl"
                                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 uppercase">Eligible Banks</label>
                              <input
                                type="text"
                                value={mortgageBanks}
                                onChange={(e) => setMortgageBanks(e.target.value)}
                                placeholder="Bank Muscat, Bank Dhofar, Sohar International, National Bank of Oman"
                                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 uppercase">Additional Financing Info</label>
                              <input
                                type="text"
                                value={mortgageAdditionalInfo}
                                onChange={(e) => setMortgageAdditionalInfo(e.target.value)}
                                placeholder="Up to 80% financing available for eligible buyers"
                                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* -------------------------------------------------------------
                    SECTION 6: AMENITIES & FACILITIES
                    ------------------------------------------------------------- */}
                <div id="sec-amenities" className="rounded-2xl border border-sky-400/20 bg-slate-950/60 p-5 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-400">6</span>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">Curated Amenities & Facilities</h3>
                        <p className="text-[11px] text-slate-400">Manage luxury lifestyle features with bilingual titles, descriptions & icons</p>
                      </div>
                    </div>

                    {/* Section Enable Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-900 border border-white/10 px-3 py-1.5 rounded-xl">
                      <input
                        type="checkbox"
                        checked={amenitiesEnabled}
                        onChange={(e) => setAmenitiesEnabled(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-white/20 bg-slate-950 text-sky-500"
                      />
                      <span className="text-xs font-semibold text-slate-300">
                        {amenitiesEnabled ? "Section Enabled" : "Section Disabled"}
                      </span>
                    </label>
                  </div>

                  {amenitiesEnabled && (
                    <>
                      {/* Section Headings & Subtitles (EN & AR) */}
                      <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300">Section Header Customization</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase">Section Label (EN)</label>
                            <input
                              type="text"
                              value={amenitiesLabel}
                              onChange={(e) => setAmenitiesLabel(e.target.value)}
                              placeholder="Amenities & Facilities"
                              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase">Section Label (Arabic)</label>
                            <input
                              type="text"
                              value={amenitiesLabelAr}
                              onChange={(e) => setAmenitiesLabelAr(e.target.value)}
                              placeholder="المرافق والخدمات الحصرية"
                              dir="rtl"
                              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase">Main Heading (EN)</label>
                            <input
                              type="text"
                              value={amenitiesHeading}
                              onChange={(e) => setAmenitiesHeading(e.target.value)}
                              placeholder="Curated World-Class Lifestyle Privileges"
                              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase">Main Heading (Arabic)</label>
                            <input
                              type="text"
                              value={amenitiesHeadingAr}
                              onChange={(e) => setAmenitiesHeadingAr(e.target.value)}
                              placeholder="مرافق عالمية مصممة لأرقى أساليب الحياة"
                              dir="rtl"
                              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase">Subtitle (EN)</label>
                            <input
                              type="text"
                              value={amenitiesSubtitle}
                              onChange={(e) => setAmenitiesSubtitle(e.target.value)}
                              placeholder="Curated lifestyle amenities designed for comfort, leisure and wellness."
                              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase">Subtitle (Arabic)</label>
                            <input
                              type="text"
                              value={amenitiesSubtitleAr}
                              onChange={(e) => setAmenitiesSubtitleAr(e.target.value)}
                              placeholder="مرافق استثنائية صُممت لأسلوب حياة راقٍ يجمع بين الراحة والرفاهية والهدوء."
                              dir="rtl"
                              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Quick 1-Click Suggestions */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                            Quick 1-Click Suggestions (Bilingual + Icon)
                          </span>
                          <span className="text-[10px] text-slate-500">Click to add instantly</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {SUGGESTED_AMENITIES.map((item, idx) => {
                            const isAdded = amenities.some(
                              (a) => a.name.toLowerCase().trim() === item.name.toLowerCase().trim()
                            );
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleAddSuggestedAmenity(item)}
                                disabled={isAdded}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition ${
                                  isAdded
                                    ? "bg-slate-800/60 text-slate-500 border border-white/5 cursor-not-allowed"
                                    : "bg-slate-900 text-slate-300 border border-white/10 hover:border-sky-400 hover:text-white"
                                }`}
                              >
                                <span>{renderAmenityIcon(item.icon, "h-3.5 w-3.5")}</span>
                                <span>{item.name}</span>
                                {isAdded ? " ✓" : " +"}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Active Amenities List */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                              Project Amenities ({amenities.length})
                            </h4>
                            <p className="text-[11px] text-slate-400">Configured amenities for this development</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleOpenNewAmenityModal}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500/15 border border-sky-400/30 px-3 py-1.5 text-xs font-bold text-sky-300 hover:bg-sky-500/30 transition"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>+ Add Custom Amenity</span>
                          </button>
                        </div>

                        {amenities.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">
                            <Sparkles className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                            <p className="text-xs font-medium text-slate-300">No amenities configured yet</p>
                            <p className="text-[11px] text-slate-500 mt-1">
                              Click the Quick Suggestions above or &quot;+ Add Custom Amenity&quot; to configure luxury amenities.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {amenities.map((am, idx) => (
                              <div
                                key={am.id || idx}
                                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/80 p-3 transition hover:border-sky-400/30"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 border border-sky-400/20">
                                    {renderAmenityIcon(am.icon, "h-4 w-4")}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-white truncate">{am.name}</p>
                                    {am.name_ar && (
                                      <p className="text-[11px] text-slate-400 truncate">{am.name_ar}</p>
                                    )}
                                    {am.description && (
                                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{am.description}</p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveAmenity(idx, "up")}
                                    disabled={idx === 0}
                                    className="rounded p-1 text-slate-400 hover:text-white disabled:opacity-20"
                                    title="Move Up"
                                  >
                                    <ChevronUp className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveAmenity(idx, "down")}
                                    disabled={idx === amenities.length - 1}
                                    className="rounded p-1 text-slate-400 hover:text-white disabled:opacity-20"
                                    title="Move Down"
                                  >
                                    <ChevronDown className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleEditAmenity(idx)}
                                    className="rounded p-1 text-sky-400 hover:bg-sky-500/20"
                                    title="Edit Amenity"
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAmenity(idx)}
                                    className="rounded p-1 text-red-400 hover:bg-red-500/20"
                                    title="Delete Amenity"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* -------------------------------------------------------------
                    SECTION 7: PROJECT GALLERY & MEDIA MANAGEMENT
                    ------------------------------------------------------------- */}
                <div id="sec-media-gallery" className="rounded-2xl border border-white/10 bg-slate-950/50 p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-400">7</span>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">Project Gallery & Media</h3>
                    </div>
                    <span className="font-mono text-xs text-sky-400 font-bold">
                      {totalMediaMB} / 40.00 MB
                    </span>
                  </div>

                  {/* Primary Cover Image */}
                  <div id="sec-media-cover">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-300 uppercase">Primary Cover Image *</label>
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={handleRemoveCoverImage}
                          className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Remove Cover</span>
                        </button>
                      )}
                    </div>
                    <div className="mt-1.5">
                      <label
                        htmlFor="project-image-input"
                        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-slate-900 p-4 transition hover:border-sky-400/50"
                      >
                        {imagePreview ? (
                          <div className="relative h-36 w-full overflow-hidden rounded-xl border border-white/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imagePreview} alt="Selected cover" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                              <span className="text-xs font-semibold text-white bg-slate-950/80 px-2.5 py-1 rounded-md">
                                Replace Cover
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-center">
                            <Upload className="h-7 w-7 text-sky-400" />
                            <p className="mt-2 text-xs font-medium text-slate-300">Upload primary cover photo</p>
                            <p className="text-[10px] text-slate-500">Supports JPG, PNG, WebP (Strict validation)</p>
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
                      {imageFile && (
                        <p className="mt-1.5 text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>New cover selected: {imageFile.name} (will upload on save)</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Multi-Photo Gallery */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-slate-300 uppercase">High-Res Gallery Slideshow</label>
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

                    {/* Existing Saved Gallery Images (Edit Mode) */}
                    {editingProjectId && existingGalleryUrls.length > 0 && (
                      <div className="mb-3 rounded-xl border border-white/10 bg-slate-900/60 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider block">
                            Existing Saved Images ({existingGalleryUrls.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm("Remove all existing gallery images from this project? You can add fresh ones below.")) {
                                handleRemoveAllExistingGallery();
                              }
                            }}
                            className="text-[10px] font-semibold text-rose-400 hover:text-rose-300 transition flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Remove All Existing</span>
                          </button>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {existingGalleryUrls.map((url, idx) => (
                            <div key={idx} className="group relative h-16 rounded-lg overflow-hidden border border-white/10">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={url} alt={`Saved ${idx + 1}`} className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveSingleExistingGalleryUrl(idx)}
                                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600/90 text-white hover:bg-red-500 shadow-md transition"
                                title="Remove photo"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Staged New Gallery Images */}
                    {galleryItems.length > 0 && (
                      <div className="mb-3 rounded-xl border border-sky-400/30 bg-sky-950/20 p-3">
                        <span className="text-[10px] font-semibold text-sky-300 uppercase tracking-wider block mb-2">
                          Staged New Images ({galleryItems.length})
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {galleryItems.map((item) => (
                            <div key={item.id} className="relative h-16 rounded-lg overflow-hidden border border-white/15 bg-slate-950">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.previewUrl} alt={item.name} className="h-full w-full object-cover" />
                              <span className="absolute bottom-1 left-1 rounded bg-slate-950/80 px-1 py-0.2 text-[8px] font-bold text-sky-300">
                                {item.format}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSingleGalleryItem(item.id)}
                                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-950/90 text-red-400"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <label
                      htmlFor="project-gallery-input"
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 bg-slate-900 px-4 py-3 text-xs font-semibold text-slate-300 hover:border-sky-400 hover:text-white transition"
                    >
                      <UploadCloud className="h-4 w-4 text-sky-400" />
                      <span>{galleryItems.length > 0 ? "Add More Gallery Photos" : "Choose Gallery Photos (Multiple)"}</span>
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
                </div>

                {/* -------------------------------------------------------------
                    SECTION 8: ARCHITECTURAL FLOOR PLANS
                    ------------------------------------------------------------- */}
                <div id="sec-floorplans" className="rounded-2xl border border-white/10 bg-slate-950/50 p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-400">8</span>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">Architectural Floor Plans</h3>
                    </div>
                    {floorPlanPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveFloorPlan}
                        className="text-xs font-semibold text-red-400 hover:text-red-300"
                      >
                        Remove Plan
                      </button>
                    )}
                  </div>

                  <label
                    htmlFor="project-floor-plan-input"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-slate-900 p-4 transition hover:border-emerald-400/50"
                  >
                    {floorPlanPreview ? (
                      <div className="relative h-32 w-full overflow-hidden rounded-xl border border-white/10 p-2 bg-slate-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={floorPlanPreview} alt="Floor plan" className="h-full w-full object-contain" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center">
                        <Ruler className="h-7 w-7 text-emerald-400" />
                        <p className="mt-2 text-xs font-medium text-slate-300">Upload Blueprint or Master Architectural Drawing</p>
                        <p className="text-[10px] text-slate-500">JPG, PNG, WebP</p>
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

                {/* -------------------------------------------------------------
                    SECTION 9: VIDEOS & DIGITAL BROCHURES
                    ------------------------------------------------------------- */}
                <div id="sec-video-brochure" className="rounded-2xl border border-white/10 bg-slate-950/50 p-5 space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-400">9</span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Videos & Digital Brochures</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-slate-300 uppercase">Hero Video URL</label>
                        {heroVideoUrl.trim() && (
                          <button
                            type="button"
                            onClick={() => setHeroVideoUrl("")}
                            className="text-[10px] text-slate-400 hover:text-rose-400 transition"
                          >
                            Clear Video
                          </button>
                        )}
                      </div>
                      <input
                        type="url"
                        value={heroVideoUrl}
                        onChange={(e) => setHeroVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                        className={`mt-1.5 w-full rounded-xl border px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition ${
                          !heroVideoUrl.trim()
                            ? "border-white/10 bg-slate-900 focus:border-sky-400"
                            : parsedHeroVideo.isValid
                            ? "border-emerald-500/50 bg-emerald-950/20 focus:border-emerald-400"
                            : "border-amber-500/50 bg-amber-950/20 focus:border-amber-400"
                        }`}
                      />

                      {/* Video Validation & Format Info */}
                      <div className="mt-2">
                        {!heroVideoUrl.trim() ? (
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Supports YouTube (watch, share, shorts, embed), Vimeo, or direct MP4 video files.
                          </p>
                        ) : parsedHeroVideo.isValid ? (
                          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-2.5 space-y-1.5">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>
                                  {parsedHeroVideo.provider === "youtube"
                                    ? "Valid YouTube Video Stream"
                                    : parsedHeroVideo.provider === "vimeo"
                                    ? "Valid Vimeo Video Stream"
                                    : "Direct Video Stream Verified"}
                                </span>
                              </div>
                              {parsedHeroVideo.watchUrl && (
                                <a
                                  href={parsedHeroVideo.watchUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-400 hover:underline"
                                >
                                  <span>Test Link</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            {parsedHeroVideo.videoId && (
                              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                                <span className="font-mono bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-500/20">
                                  ID: {parsedHeroVideo.videoId}
                                </span>
                                <span className="text-slate-400 capitalize">
                                  Provider: {parsedHeroVideo.provider}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-2.5 space-y-1 text-xs">
                            <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                              <AlertCircle className="h-4 w-4" />
                              <span>Unrecognized Video Link</span>
                            </div>
                            <p className="text-[11px] text-slate-300">
                              Please provide a valid YouTube link (e.g. <span className="text-sky-300 font-mono">youtube.com/watch?v=...</span> or <span className="text-sky-300 font-mono">youtu.be/...</span>) or Vimeo link.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase">Official PDF Brochure URL</label>
                      <input
                        type="url"
                        value={brochureUrl}
                        onChange={(e) => setBrochureUrl(e.target.value)}
                        placeholder="https://.../brochure.pdf"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                      <p className="mt-2 text-[11px] text-slate-400">
                        Optional link to downloadable architectural brochure or investment deck.
                      </p>
                    </div>
                  </div>

                  {/* Live Interactive Preview Box */}
                  {heroVideoUrl.trim() && parsedHeroVideo.isValid && (
                    <div className="mt-4 rounded-xl border border-sky-400/30 bg-slate-900/90 p-4">
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          {parsedHeroVideo.provider === "youtube" ? (
                            <YouTubeIcon className="h-4 w-4 fill-red-500 text-red-500" />
                          ) : parsedHeroVideo.provider === "vimeo" ? (
                            <VimeoIcon className="h-4 w-4 fill-sky-400 text-sky-400" />
                          ) : (
                            <Video className="h-4 w-4 text-sky-400" />
                          )}
                          <span className="text-xs font-bold uppercase tracking-wider text-white">
                            Admin Live Video Preview
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Embed Verified
                        </span>
                      </div>

                      <div className="relative aspect-video max-w-xl mx-auto overflow-hidden rounded-xl border border-white/15 bg-black shadow-xl">
                        {parsedHeroVideo.provider === "youtube" && parsedHeroVideo.embedUrl ? (
                          <iframe
                            src={parsedHeroVideo.embedUrl}
                            title="Admin Video Preview"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="h-full w-full border-0"
                          />
                        ) : parsedHeroVideo.provider === "vimeo" && parsedHeroVideo.embedUrl ? (
                          <iframe
                            src={parsedHeroVideo.embedUrl}
                            title="Admin Vimeo Preview"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="h-full w-full border-0"
                          />
                        ) : (
                          <video
                            src={parsedHeroVideo.embedUrl || heroVideoUrl}
                            controls
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <p className="mt-2 text-center text-[11px] text-slate-400">
                        This preview confirms that the video stream functions smoothly and is ready for public display.
                      </p>
                    </div>
                  )}
                </div>

                {/* -------------------------------------------------------------
                    SECTION 10: SEO & PUBLISHING CONTROLS
                    ------------------------------------------------------------- */}
                <div id="sec-publishing" className="rounded-2xl border border-sky-400/30 bg-slate-950/80 p-5 space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">10</span>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">SEO & Publishing Controls</h3>
                    </div>
                  </div>

                  {/* SEO URL Slug */}
                  <div id="sec-seo" className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
                    <label className="block text-xs font-semibold text-slate-300 uppercase">Custom URL Slug</label>
                    <div className="mt-1.5 flex gap-2">
                      <input
                        type="text"
                        value={customSlug}
                        onChange={(e) => setCustomSlug(e.target.value)}
                        placeholder="e.g., sultan-haitham-city"
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setCustomSlug(generateSlug(name))}
                        className="shrink-0 rounded-xl bg-white/10 border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/20"
                      >
                        Generate Slug
                      </button>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Public URL: <span className="font-mono text-sky-400">/en/projects/{customSlug || "project-id"}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase">Availability Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="mt-1 rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="Available">Available for Purchase</option>
                        <option value="Under Construction">Under Construction</option>
                        <option value="Off-Plan">Exclusive Off-Plan</option>
                        <option value="Limited Units">Limited Units Remaining</option>
                        <option value="Sold Out">Sold Out</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer mt-3">
                      <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="h-4 w-4 rounded border-white/20 bg-slate-900 text-sky-500"
                      />
                      <span className="text-xs font-semibold text-white">Publish Live on Public Website</span>
                    </label>
                  </div>

                  {/* Publishing Readiness Checklist Widget (Task 4) */}
                  <div className="rounded-xl border border-white/10 bg-slate-900/80 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-sky-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Publishing Readiness Checklist
                        </h4>
                      </div>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                          isReadyToPublish
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {isReadyToPublish ? "Ready to Publish" : "Essentials Incomplete"}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>Readiness Score: <strong className="text-white">{readinessPercent}%</strong></span>
                        <span>{completedRequiredItems} of {requiredChecklistItems.length} Required Items Met</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-950">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isReadyToPublish ? "bg-gradient-to-r from-emerald-400 to-sky-400" : "bg-gradient-to-r from-amber-400 to-sky-400"
                          }`}
                          style={{ width: `${readinessPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Checklist Grid with Click-to-Scroll links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                      {checklistItems.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.sectionAnchor}`}
                          className={`flex items-start gap-2 rounded-lg p-2 transition ${
                            item.status
                              ? "bg-emerald-950/20 border border-emerald-500/20 hover:border-emerald-500/40"
                              : item.importance === "Required"
                              ? "bg-red-950/30 border border-red-500/30 hover:border-red-500/50"
                              : "bg-white/[0.02] border border-white/5 hover:border-white/10"
                          }`}
                          title={`Click to jump to ${item.label}`}
                        >
                          {item.status ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : item.importance === "Required" ? (
                            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                          ) : (
                            <div className="h-3.5 w-3.5 rounded-full border border-slate-600 shrink-0 mt-0.5" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className={`font-semibold truncate text-[11px] ${item.status ? "text-slate-200" : "text-white"}`}>
                                {item.label}
                              </span>
                              <span className={`text-[9px] uppercase px-1 rounded font-bold ${
                                item.importance === "Required"
                                  ? "text-red-400 bg-red-950/60"
                                  : "text-slate-500 bg-slate-950"
                              }`}>
                                {item.importance}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.hint}</p>
                          </div>
                        </a>
                      ))}
                    </div>

                    {!isReadyToPublish && (
                      <p className="text-[11px] text-amber-300/90 bg-amber-950/30 border border-amber-500/20 rounded-lg p-2 leading-relaxed">
                        ⚠️ Please complete all red required fields before publishing live. Optional or recommended fields will not block publishing.
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting || isCompressing}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(56,189,248,0.35)] hover:shadow-[0_0_36px_rgba(56,189,248,0.55)] transition disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                        <span>{uploadProgress ? uploadProgress.stage : "Saving & Synchronizing..."}</span>
                      </>
                    ) : isCompressing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                        <span>Optimizing Media...</span>
                      </>
                    ) : editingProjectId ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Save All Changes to Project</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Publish New Development</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: LIVE PROPERTIES CATALOG (5 cols)
              ========================================================================= */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8 max-h-[85vh] overflow-y-auto">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white">
                    Live Properties ({projects.length})
                  </h2>
                  <p className="text-xs text-slate-400">
                    Real-time Supabase Catalog
                  </p>
                </div>

                <button
                  onClick={() => fetchProjects()}
                  disabled={loadingProjects}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-sky-400/40 hover:text-white disabled:opacity-50 transition"
                  title="Refresh catalog"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingProjects ? "animate-spin text-sky-400" : ""}`} />
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
                  <p className="mt-3 text-xs text-slate-400">Loading catalog...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950 text-slate-500">
                    <ImageIcon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-[family-name:var(--font-outfit)] text-base font-semibold text-white">
                    No properties in catalog
                  </h3>
                  <p className="mt-1 max-w-sm text-xs text-slate-400">
                    Use the 10-section builder on the left to publish your first development.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {projects.map((project) => (
                    <article
                      key={project.id}
                      className={`group rounded-2xl border p-4 transition-all ${
                        editingProjectId === project.id
                          ? "border-amber-400/50 bg-amber-500/5"
                          : "border-white/10 bg-slate-950/70 hover:border-white/20"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                          {project.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={project.image}
                              alt={project.name}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-600">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="truncate font-bold text-white text-sm">{project.name}</h4>
                          <p className="truncate text-xs text-slate-400">{project.developer}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-amber-400">{project.price}</span>
                            <span className="text-[10px] text-slate-500">•</span>
                            <span className="text-[10px] text-slate-400">{project.area}</span>
                          </div>
                          {project.location && (
                            <p className="truncate text-[10px] text-slate-500 mt-1">{project.location}</p>
                          )}
                          {project.whatsapp_number && (
                            <p className="truncate text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1 font-mono">
                              <span>WhatsApp:</span>
                              <span>+{project.whatsapp_number.replace(/^\+/, "")}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                        <Link
                          href={`/en/projects/${project.id}/`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300 transition"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View Public Page</span>
                        </Link>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(project)}
                            className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:bg-amber-500/20 transition"
                          >
                            <Edit className="h-3 w-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProject(project.id, project.name)}
                            disabled={deleteIdInProgress === project.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-50 transition"
                          >
                            {deleteIdInProgress === project.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          MODAL: ADD / EDIT PROPERTY CONFIGURATION
          ========================================================================= */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-slate-900 p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base sm:text-lg">
                    {editingConfigIndex !== null ? "Edit Unit Configuration" : "Add Property Configuration"}
                  </h3>
                  <p className="text-xs text-slate-400">Specify bedrooms, built-up area, price & layout details</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              {/* Configuration Photography & Media */}
              <div className="rounded-2xl border border-sky-400/20 bg-slate-950/80 p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-sky-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Unit Photography & Media</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Primary Render / Interior Photo + Gallery</span>
                </div>

                {configMediaError && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-300">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                    <span>{configMediaError}</span>
                  </div>
                )}

                {/* Main Cover Image */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                    Main Unit Cover Photo (JPG, PNG, WebP)
                  </label>
                  {currentConfig.image_url ? (
                    <div className="relative overflow-hidden rounded-xl border border-sky-400/30 bg-slate-900 group">
                      <div className="relative h-44 w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={currentConfig.image_url}
                          alt="Configuration Cover"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        <span className="absolute top-2 left-2 rounded bg-sky-500/80 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                          Main Cover Photo
                        </span>
                        <div className="absolute bottom-2 right-2 flex items-center gap-2">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-sky-500/20 border border-sky-400/30 px-2.5 py-1 text-xs font-semibold text-sky-300 backdrop-blur hover:bg-sky-500/30 transition">
                            <Upload className="h-3 w-3" />
                            <span>{isUploadingConfigImage ? "Uploading..." : "Replace Photo"}</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              disabled={isUploadingConfigImage}
                              onChange={handleConfigMainImageUpload}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={handleRemoveConfigCoverImage}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-500/20 border border-red-400/30 px-2.5 py-1 text-xs font-semibold text-red-300 backdrop-blur hover:bg-red-500/30 transition"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-400/30 bg-sky-500/5 p-6 text-center cursor-pointer hover:border-sky-400/60 transition ${isUploadingConfigImage ? "opacity-60 pointer-events-none" : ""}`}>
                      {isUploadingConfigImage ? (
                        <div className="flex flex-col items-center py-2">
                          <Loader2 className="h-7 w-7 animate-spin text-sky-400 mb-2" />
                          <span className="text-xs font-semibold text-sky-300">Uploading to Supabase Storage...</span>
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="h-8 w-8 text-sky-400 mb-2" />
                          <span className="text-xs font-bold text-white">Click or Drag to Upload Unit Cover Photo</span>
                          <span className="text-[11px] text-slate-400 mt-0.5">High-res exterior render or luxury interior photo (WebP optimized)</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        disabled={isUploadingConfigImage}
                        onChange={handleConfigMainImageUpload}
                      />
                    </label>
                  )}

                  {/* Direct URL input fallback */}
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="url"
                      value={currentConfig.image_url || ""}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, image_url: e.target.value })}
                      placeholder="Or paste direct image URL (https://...)"
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Additional Gallery Photos */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase">
                      Additional Gallery Photos (Living, Master Bedroom, Terrace, etc.)
                    </label>
                    <label className="cursor-pointer inline-flex items-center gap-1 rounded bg-sky-500/15 border border-sky-400/30 px-2.5 py-1 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/30 transition">
                      {isUploadingConfigGallery ? (
                        <Loader2 className="h-3 w-3 animate-spin text-sky-400" />
                      ) : (
                        <Plus className="h-3 w-3" />
                      )}
                      <span>{isUploadingConfigGallery ? "Uploading..." : "+ Add Photos"}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        disabled={isUploadingConfigGallery}
                        onChange={handleConfigGalleryUpload}
                      />
                    </label>
                  </div>

                  {Array.isArray(currentConfig.images) && currentConfig.images.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                      {currentConfig.images.map((imgUrl, imgIdx) => (
                        <div key={imgIdx} className="relative group rounded-lg overflow-hidden border border-white/10 bg-slate-950 h-20">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imgUrl} alt={`Gallery ${imgIdx + 1}`} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveConfigGalleryImage(imgIdx)}
                            className="absolute top-1 right-1 rounded-full bg-slate-950/80 p-1 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition"
                            title="Remove photo"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          {currentConfig.image_url === imgUrl && (
                            <span className="absolute bottom-1 left-1 rounded bg-sky-500/90 px-1 py-0.2 text-[8px] font-bold text-white">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic">No additional photos uploaded yet.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Property Type *</label>
                  <select
                    value={currentConfig.property_type}
                    onChange={(e) => setCurrentConfig({ ...currentConfig, property_type: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Configuration Name *</label>
                  <input
                    type="text"
                    required
                    value={currentConfig.name}
                    onChange={(e) => setCurrentConfig({ ...currentConfig, name: e.target.value })}
                    placeholder="e.g., 2-Bedroom Executive Residence"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Arabic Name (Optional)</label>
                  <input
                    type="text"
                    value={currentConfig.name_ar || ""}
                    onChange={(e) => setCurrentConfig({ ...currentConfig, name_ar: e.target.value })}
                    placeholder="شقة غرفتين وصالة فاخرة"
                    dir="rtl"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Bedrooms</label>
                  <input
                    type="number"
                    min="0"
                    value={currentConfig.bedrooms}
                    onChange={(e) => setCurrentConfig({ ...currentConfig, bedrooms: parseInt(e.target.value) || 0 })}
                    placeholder="2 (0 for Studio)"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Bathrooms</label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={currentConfig.bathrooms}
                    onChange={(e) => setCurrentConfig({ ...currentConfig, bathrooms: parseFloat(e.target.value) || 1 })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Balconies</label>
                  <input
                    type="number"
                    min="0"
                    value={currentConfig.balconies || 0}
                    onChange={(e) => setCurrentConfig({ ...currentConfig, balconies: parseInt(e.target.value) || 0 })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">BUA Area (sqm) *</label>
                  <input
                    type="text"
                    value={currentConfig.bua_sqm}
                    onChange={(e) => setCurrentConfig({ ...currentConfig, bua_sqm: e.target.value })}
                    placeholder="e.g., 128"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Plot Area (sqm, optional for Villas)</label>
                  <input
                    type="text"
                    value={currentConfig.plot_sqm || ""}
                    onChange={(e) => setCurrentConfig({ ...currentConfig, plot_sqm: e.target.value })}
                    placeholder="e.g., 250"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Unit Price</label>
                  <input
                    type="text"
                    value={currentConfig.price}
                    onChange={(e) => setCurrentConfig({ ...currentConfig, price: e.target.value })}
                    placeholder="e.g., OMR 65,000"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Availability Status</label>
                  <select
                    value={currentConfig.availability || "Available"}
                    onChange={(e) => setCurrentConfig({ ...currentConfig, availability: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Limited availability">Limited Availability</option>
                    <option value="Sold out">Sold Out</option>
                    <option value="Coming soon">Coming Soon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Furnishing Status</label>
                  <select
                    value={currentConfig.furnishing || "Unfurnished"}
                    onChange={(e) => setCurrentConfig({ ...currentConfig, furnishing: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Semi-furnished">Semi-furnished</option>
                    <option value="Fully furnished">Fully furnished</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Parking Info</label>
                  <input
                    type="text"
                    value={currentConfig.parking || ""}
                    onChange={(e) => setCurrentConfig({ ...currentConfig, parking: e.target.value })}
                    placeholder="e.g., 2 Covered Parking Spaces"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Floor Plan Image URL</label>
                <input
                  type="url"
                  value={currentConfig.floor_plan_url || ""}
                  onChange={(e) => setCurrentConfig({ ...currentConfig, floor_plan_url: e.target.value })}
                  placeholder="https://.../unit-floorplan.jpg"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Configuration Summary</label>
                <textarea
                  rows={2}
                  value={currentConfig.description || ""}
                  onChange={(e) => setCurrentConfig({ ...currentConfig, description: e.target.value })}
                  placeholder="Smart layout featuring floor-to-ceiling glass, en-suite master bedroom, and private sun terrace..."
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={Boolean(currentConfig.is_featured)}
                  onChange={(e) => setCurrentConfig({ ...currentConfig, is_featured: e.target.checked })}
                  className="h-4 w-4 rounded border-white/20 bg-slate-950 text-amber-500"
                />
                <span className="text-xs font-semibold text-slate-200">Mark as Featured Configuration</span>
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveConfig}
                className="rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 px-5 py-2 text-xs font-bold text-slate-950 hover:brightness-110"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT PAYMENT MILESTONE
          ========================================================================= */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-400/30 bg-slate-900 p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base sm:text-lg">
                    {editingMilestoneIndex !== null ? "Edit Payment Milestone" : "Add Payment Milestone"}
                  </h3>
                  <p className="text-xs text-slate-400">Configure step sequence, percentage and payment conditions</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMilestoneModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Step Number *</label>
                  <input
                    type="text"
                    required
                    value={currentMilestone.step_number || "01"}
                    onChange={(e) => setCurrentMilestone({ ...currentMilestone, step_number: e.target.value })}
                    placeholder="01"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Percentage / Value *</label>
                  <input
                    type="text"
                    required
                    value={currentMilestone.percentage}
                    onChange={(e) => setCurrentMilestone({ ...currentMilestone, percentage: e.target.value })}
                    placeholder="e.g. 10% or 40% - 50%"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Milestone Title (EN) *</label>
                  <input
                    type="text"
                    required
                    value={currentMilestone.title}
                    onChange={(e) => setCurrentMilestone({ ...currentMilestone, title: e.target.value })}
                    placeholder="e.g. Down Payment"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Milestone Title (Arabic)</label>
                  <input
                    type="text"
                    value={currentMilestone.title_ar || ""}
                    onChange={(e) => setCurrentMilestone({ ...currentMilestone, title_ar: e.target.value })}
                    placeholder="الدفعة الأولى"
                    dir="rtl"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Milestone Icon</label>
                  <select
                    value={currentMilestone.icon || "Coins"}
                    onChange={(e) => setCurrentMilestone({ ...currentMilestone, icon: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    {MILESTONE_ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.value})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Short Description (EN)</label>
                  <input
                    type="text"
                    value={currentMilestone.description}
                    onChange={(e) => setCurrentMilestone({ ...currentMilestone, description: e.target.value })}
                    placeholder="Upon reservation and initial booking confirmation"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Short Description (Arabic)</label>
                  <input
                    type="text"
                    value={currentMilestone.description_ar || ""}
                    onChange={(e) => setCurrentMilestone({ ...currentMilestone, description_ar: e.target.value })}
                    placeholder="عند حجز الوحدة وتأكيد العقد المبدئي"
                    dir="rtl"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={currentMilestone.is_active !== false}
                  onChange={(e) => setCurrentMilestone({ ...currentMilestone, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-white/20 bg-slate-950 text-amber-500"
                />
                <span className="text-xs font-semibold text-slate-200">Active / Visible on public project page</span>
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setIsMilestoneModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMilestone}
                className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:brightness-110"
              >
                Save Milestone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT CURATED AMENITY
          ========================================================================= */}
      {isAmenityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-sky-400/30 bg-slate-900 p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base sm:text-lg">
                    {editingAmenityIndex !== null ? "Edit Project Amenity" : "Add Project Amenity"}
                  </h3>
                  <p className="text-xs text-slate-400">Configure bilingual name, description, category and icon</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAmenityModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Amenity Name (EN) *</label>
                  <input
                    type="text"
                    required
                    value={currentAmenity.name}
                    onChange={(e) => setCurrentAmenity({ ...currentAmenity, name: e.target.value })}
                    placeholder="e.g. Infinity Swimming Pool"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Amenity Name (Arabic)</label>
                  <input
                    type="text"
                    value={currentAmenity.name_ar || ""}
                    onChange={(e) => setCurrentAmenity({ ...currentAmenity, name_ar: e.target.value })}
                    placeholder="مسبح إنفينيتي بانورامي"
                    dir="rtl"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Amenity Icon</label>
                  <select
                    value={currentAmenity.icon || "Sparkles"}
                    onChange={(e) => setCurrentAmenity({ ...currentAmenity, icon: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    {AMENITY_ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.value})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Category</label>
                  <input
                    type="text"
                    value={currentAmenity.category || "Wellness & Leisure"}
                    onChange={(e) => setCurrentAmenity({ ...currentAmenity, category: e.target.value })}
                    placeholder="e.g. Wellness & Leisure, Sports, Security"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Description (EN)</label>
                  <textarea
                    rows={2}
                    value={currentAmenity.description || ""}
                    onChange={(e) => setCurrentAmenity({ ...currentAmenity, description: e.target.value })}
                    placeholder="Temperature-controlled swimming pool with dedicated resort-style sun deck."
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Description (Arabic)</label>
                  <textarea
                    rows={2}
                    value={currentAmenity.description_ar || ""}
                    onChange={(e) => setCurrentAmenity({ ...currentAmenity, description_ar: e.target.value })}
                    placeholder="مسبح يتم التحكم في درجة حرارته مع تراس استجمام شمسي على الطراز الفندقي."
                    dir="rtl"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={currentAmenity.is_active !== false}
                  onChange={(e) => setCurrentAmenity({ ...currentAmenity, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-white/20 bg-slate-950 text-sky-500"
                />
                <span className="text-xs font-semibold text-slate-200">Active / Visible on public project page</span>
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setIsAmenityModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAmenity}
                className="rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 px-5 py-2 text-xs font-bold text-slate-950 hover:brightness-110"
              >
                Save Amenity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Content & Media Upload Guide Modal (Task 3) */}
      <AdminContentGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
