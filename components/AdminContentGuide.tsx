"use client";

import { ComponentType, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  MapPin,
  Maximize2,
  Printer,
  Search,
  Sparkles,
  Video,
  X,
  AlertCircle,
  Building2,
  Compass,
  FileCheck,
  Globe,
  Sliders,
} from "lucide-react";

interface AdminContentGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GuideSection {
  id: string;
  number: string;
  title: string;
  category: "Required" | "Recommended" | "Optional";
  icon: ComponentType<{ className?: string }>;
  summary: string;
  fieldDetails: {
    name: string;
    status: "Required" | "Recommended" | "Optional";
    spec: string;
    description: string;
    example: string;
  }[];
  bestPractices: string[];
  commonMistakes: string[];
}

export default function AdminContentGuide({ isOpen, onClose }: AdminContentGuideProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "sec-1": true,
    "sec-2": true,
  });
  const [activeFilter, setActiveFilter] = useState<"All" | "Required" | "Recommended" | "Optional">("All");

  const guideSections: GuideSection[] = useMemo(
    () => [
      {
        id: "sec-1",
        number: "01",
        title: "Basic Project Information",
        category: "Required",
        icon: Building2,
        summary:
          "Defines the core identity, commercial starting parameters, and master developer profile for the development. Appears on the homepage showcase card, sticky header, and key metrics bar.",
        fieldDetails: [
          {
            name: "Project Name",
            status: "Required",
            spec: "Plain text · Max 80 chars",
            description: "The primary marketing name of the development in title casing.",
            example: "Sultan Heritage Residences",
          },
          {
            name: "Master Developer",
            status: "Required",
            spec: "Plain text · Max 60 chars",
            description: "The licensed real estate development entity behind the project.",
            example: "Oman Real Estate Investment & Development Co.",
          },
          {
            name: "Starting Price",
            status: "Required",
            spec: "Number or formatted text",
            description: "Entry-level acquisition price displayed with currency abbreviation.",
            example: "45,000 OMR (or 117,000 USD)",
          },
          {
            name: "Starting Area",
            status: "Required",
            spec: "Number or formatted text",
            description: "Minimum built-up area for the smallest configuration in square meters.",
            example: "85 SQM (915 SQFT)",
          },
          {
            name: "Payment Plan",
            status: "Required",
            spec: "Milestone breakdown string",
            description: "Commercial payment structure summarizing down payment and post-handover terms.",
            example: "10% Down Payment · 40% During Construction · 50% on Handover",
          },
          {
            name: "Construction Stage",
            status: "Recommended",
            spec: "Status tag text",
            description: "Physical stage of site development.",
            example: "Under Construction (Foundation Stage / 65% Completed)",
          },
          {
            name: "Handover Date",
            status: "Recommended",
            spec: "Quarter & Year string",
            description: "Projected completion and keys delivery date.",
            example: "Q4 2026",
          },
        ],
        bestPractices: [
          "Use accurate, certified pricing verified with the master developer.",
          "Keep payment plan descriptions clear and succinct for instant investor comprehension.",
          "Double check that the currency code matches client preferences (OMR is standard in Oman).",
        ],
        commonMistakes: [
          "Entering vague prices like 'Contact for price' instead of the baseline starting rate.",
          "Using non-standard abbreviations that confuse international buyers.",
        ],
      },
      {
        id: "sec-2",
        number: "02",
        title: "Main Project Cover Image",
        category: "Required",
        icon: ImageIcon,
        summary:
          "The most critical visual asset in the portfolio. Serves as the primary hero thumbnail on the homepage showcase cards and the grand backdrop of the dedicated project presentation.",
        fieldDetails: [
          {
            name: "Orientation",
            status: "Required",
            spec: "Strict Landscape (16:9 ratio)",
            description: "Landscape framing ensures the image fills the card without letterboxing or cropping.",
            example: "1920 × 1080 px or 2560 × 1440 px",
          },
          {
            name: "Recommended Resolution",
            status: "Required",
            spec: "Min 1600 × 900 px · Max 3840 × 2160 px",
            description: "High resolution preserves crispness on 4K retina displays.",
            example: "2048 × 1152 px at 72–150 DPI",
          },
          {
            name: "File Format",
            status: "Required",
            spec: "WebP, JPG, or PNG (Client auto-compresses to WebP)",
            description: "Modern web formats ensure fast loading. Note: ICO / BMP files are strictly prohibited.",
            example: "hero-cover.webp or exterior-main.jpg",
          },
          {
            name: "File Weight",
            status: "Recommended",
            spec: "Between 800 KB and 3.5 MB",
            description: "The admin client automatically compresses oversized files prior to Supabase Storage upload.",
            example: "1.8 MB (auto-compressed in-browser)",
          },
        ],
        bestPractices: [
          "Choose a dramatic architectural exterior rendering or dusk twilight elevation.",
          "Avoid heavy baked-in text, logos, watermarks, or phone numbers directly on the image canvas.",
          "Ensure the visual center of interest is positioned near the center-upper third to avoid overlap with bottom text gradient bars.",
        ],
        commonMistakes: [
          "Uploading a portrait/vertical mobile photo that gets awkwardly cropped.",
          "Uploading low-resolution blurred WhatsApp images (always request raw high-res master renders from developers).",
        ],
      },
      {
        id: "sec-3",
        number: "03",
        title: "Project Photography Gallery",
        category: "Recommended",
        icon: Maximize2,
        summary:
          "A comprehensive visual gallery showcasing the lifestyle, architectural craftsmanship, and spatial interiors of the development.",
        fieldDetails: [
          {
            name: "Gallery Count",
            status: "Recommended",
            spec: "6 to 18 photographs",
            description: "Provides comprehensive coverage without overwhelming the visitor.",
            example: "12 curated high-definition photographs",
          },
          {
            name: "Asset Types to Collect",
            status: "Recommended",
            spec: "Curated variety across 5 core zones",
            description: "1. Day & Night Architectural Elevations\n2. Master Living Room & Reception\n3. Chef Kitchen & Dining Suites\n4. Master En-suite Bedrooms\n5. Balconies, Landscaped Gardens & Infinity Pools",
            example: "3 exterior + 5 interior + 4 community amenities",
          },
          {
            name: "Individual File Limit",
            status: "Required",
            spec: "Max 5 MB per individual image",
            description: "Maintains optimal browser memory and prevents mobile network timeouts.",
            example: "Average 1.2 MB per photo",
          },
        ],
        bestPractices: [
          "Maintain a consistent colour grading and aspect ratio (16:9 or 3:2 landscape) throughout the gallery.",
          "Order images logically: Exterior grand arrival first, followed by living spaces, master bedrooms, and finally community amenities.",
          "Use the admin gallery delete tool (red trash icon) to purge unneeded or outdated test uploads.",
        ],
        commonMistakes: [
          "Uploading multiple near-identical duplicates from the same angle.",
          "Including blurry construction site progress photos in a luxury marketing presentation.",
        ],
      },
      {
        id: "sec-4",
        number: "04",
        title: "Property Configurations & Unit Mix",
        category: "Recommended",
        icon: Layers,
        summary:
          "Allows investors to explore every distinct unit typology within the development (e.g. 1-Bed Apartments, 2-Bed Duplexes, 4-Bed Signature Villas) with individual pricing, square meterage, and floor plan links.",
        fieldDetails: [
          {
            name: "Typology / Unit Type",
            status: "Required",
            spec: "Dropdown selector",
            description: "Select Apartment, Villa, Townhouse, Penthouse, Duplex, Studio, or Office.",
            example: "Apartment (or Luxury Villa)",
          },
          {
            name: "Configuration Name",
            status: "Required",
            spec: "Plain text",
            description: "Commercial marketing label for the layout.",
            example: "Type A · 2-Bedroom Executive Residence",
          },
          {
            name: "Bedrooms & Bathrooms",
            status: "Required",
            spec: "Numeric values (0 to 10)",
            description: "Counts displayed with dedicated real-estate luxury iconography.",
            example: "2 Bedrooms · 3 Bathrooms · 1 Balcony",
          },
          {
            name: "Built-up Area (BUA)",
            status: "Required",
            spec: "Square meters (SQM)",
            description: "Internal and usable floor area.",
            example: "128 SQM",
          },
          {
            name: "Plot Area",
            status: "Optional",
            spec: "Square meters (SQM) for villas/land",
            description: "Total land area for standalone properties.",
            example: "350 SQM (For standalone villas)",
          },
          {
            name: "Unit Price",
            status: "Required",
            spec: "Formatted price string",
            description: "Baseline rate for this specific typology.",
            example: "68,000 OMR",
          },
          {
            name: "Availability Status",
            status: "Recommended",
            spec: "Dropdown: Available / Limited / Sold Out",
            description: "Communicates real-time commercial urgency.",
            example: "Limited Availability (Only 3 Units Remaining)",
          },
          {
            name: "Dedicated Floor Plan URL",
            status: "Optional",
            spec: "Image or PDF URL",
            description: "Direct link to the blueprint for this specific unit.",
            example: "https://.../2bed-typeA-plan.jpg",
          },
        ],
        bestPractices: [
          "Add at least 2 to 4 distinct configurations to showcase the development's versatility.",
          "Mark the most attractive unit as 'Featured' to spotlight it at the top of the interactive configuration switcher.",
        ],
        commonMistakes: [
          "Leaving the unit price blank or using generic placeholders.",
          "Forgetting to update availability when units sell out.",
        ],
      },
      {
        id: "sec-5",
        number: "05",
        title: "Architectural Floor Plans",
        category: "Optional",
        icon: Sliders,
        summary:
          "High-resolution floor plans give serious buyers and institutional investors the structural clarity needed to make purchasing decisions.",
        fieldDetails: [
          {
            name: "Master Floor Plan Document",
            status: "Optional",
            spec: "PDF or High-Res Image (JPG/PNG/WebP)",
            description: "Overall floor layout or master site schematic for the development.",
            example: "sultan-heritage-master-layouts.pdf",
          },
          {
            name: "Recommended Dimensions",
            status: "Recommended",
            spec: "Min 2000 px on longest edge",
            description: "Allows visitors to zoom into room dimensions, door swings, and balcony boundaries.",
            example: "2400 × 1600 px at 300 DPI",
          },
        ],
        bestPractices: [
          "Ensure room measurements are labeled clearly in meters or feet.",
          "Clean architectural blueprints or 3D cutaway renderings perform significantly better than hand sketches.",
        ],
        commonMistakes: [
          "Uploading unreadable low-resolution scans with illegible dimension text.",
        ],
      },
      {
        id: "sec-6",
        number: "06",
        title: "Property Location & Coordinates",
        category: "Recommended",
        icon: MapPin,
        summary:
          "Enables visitors to explore the physical neighborhood, road connectivity, and precise GPS placement within the Sultanate of Oman.",
        fieldDetails: [
          {
            name: "Google Maps Share Link",
            status: "Recommended",
            spec: "Standard Google Maps URL or short link",
            description: "Paste a link directly from Google Maps (maps.app.goo.gl or google.com/maps).",
            example: "https://maps.app.goo.gl/2hPDjkPfGt424wNA7?g_st=aw",
          },
          {
            name: "Formatted Address",
            status: "Recommended",
            spec: "Street, District, City, Country",
            description: "Clean readable address displayed on contact and orientation maps.",
            example: "Al Mouj Street, Al Khoudh 6, Seeb, Muscat, Oman",
          },
          {
            name: "City & Country",
            status: "Required",
            spec: "Standard administrative locations",
            description: "Defaults to Muscat, Sultanate of Oman.",
            example: "Muscat, Oman",
          },
          {
            name: "GPS Coordinates (Lat / Long)",
            status: "Optional",
            spec: "Decimal degrees (e.g. 23.6143, 58.2567)",
            description: "Automatically derived from the Google Maps link or entered manually for precision map pin placement.",
            example: "Latitude: 23.6143 · Longitude: 58.2567",
          },
        ],
        bestPractices: [
          "Use the 'Resolve Google Maps' button in the dashboard to automatically test and fetch location coordinates.",
          "Verify the pin matches the exact development parcel rather than just a general city center.",
        ],
        commonMistakes: [
          "Entering a search term instead of a valid Google Maps URL.",
        ],
      },
      {
        id: "sec-7",
        number: "07",
        title: "Nearby Places & Attractions",
        category: "Recommended",
        icon: Compass,
        summary:
          "Highlights proximity to critical infrastructure: international airports, leading hospitals, prestigious universities, beaches, and luxury shopping destinations.",
        fieldDetails: [
          {
            name: "Categories Supported",
            status: "Recommended",
            spec: "Airport, Hospital, School, University, Mall, Landmark, Beach",
            description: "Each category receives a custom luxury real-estate icon.",
            example: "Airport, Shopping Mall, Beach",
          },
          {
            name: "Distance & Travel Time",
            status: "Recommended",
            spec: "Kilometers & Drive Minutes",
            description: "Gives prospective buyers an instant sense of lifestyle convenience.",
            example: "Muscat International Airport · 12 km (15 mins drive)",
          },
          {
            name: "Automatic Discovery",
            status: "Recommended",
            spec: "Built-in Nearby Places Generator",
            description: "Click 'Auto-Fetch Nearby Places' in Section 4 of the dashboard to generate nearby landmarks automatically.",
            example: "Auto-detected Sultan Qaboos Grand Mosque, City Centre Muscat",
          },
        ],
        bestPractices: [
          "Include a balanced mix: 1 airport, 1-2 shopping/retail centers, 1 hospital/healthcare, and 1 recreational/beach destination.",
          "Keep travel time descriptions realistic based on standard Muscat traffic conditions.",
        ],
        commonMistakes: [
          "Adding landmarks that are over 60 km away without specifying regional context.",
        ],
      },
      {
        id: "sec-8",
        number: "08",
        title: "Amenities & Lifestyle Facilities",
        category: "Recommended",
        icon: Sparkles,
        summary:
          "Select from 14 curated luxury amenities to highlight lifestyle privileges such as infinity swimming pools, private beach access, concierge service, and 24/7 security.",
        fieldDetails: [
          {
            name: "Curated Selection",
            status: "Recommended",
            spec: "14 Pre-configured one-click chips",
            description: "Swimming Pool, Private Beach, Fitness Center, Concierge, 24/7 Security, Children Play Area, Landscaped Parks, Resident Parking, Spa, BBQ Terrace, Smart Home, Retail Promenade, Business Lounge, Jogging Tracks.",
            example: "Click chips in Section 5 to toggle active state",
          },
          {
            name: "Custom Amenity Entry",
            status: "Optional",
            spec: "Text input with '+ Add' button",
            description: "Add bespoke features unique to the development.",
            example: "Private Marina Berth, Helipad, Rooftop Observatory",
          },
        ],
        bestPractices: [
          "Select amenities that genuinely exist or are contractually committed in the master development plan.",
          "Aim for 6 to 10 strong amenities to create a rich lifestyle grid.",
        ],
        commonMistakes: [
          "Selecting every single amenity indiscriminately for properties that do not offer them.",
        ],
      },
      {
        id: "sec-9",
        number: "09",
        title: "Cinematic Video & Walkthroughs",
        category: "Optional",
        icon: Video,
        summary:
          "Provides a cinematic walkthrough experience. Embedded seamlessly in the Project Presentation page with ambient background playback or interactive modal viewing.",
        fieldDetails: [
          {
            name: "Supported Formats",
            status: "Optional",
            spec: "Direct MP4 URL, YouTube Embed, or Vimeo Link",
            description: "Direct web-hosted video URLs or streaming platforms.",
            example: "https://www.youtube.com/watch?v=... or https://domain.com/walkthrough.mp4",
          },
          {
            name: "Recommended Video Quality",
            status: "Recommended",
            spec: "1080p Full HD or 4K at 30/60 fps",
            description: "Landscape 16:9 cinematic framing with professional architectural color grade.",
            example: "1920 × 1080 px video",
          },
        ],
        bestPractices: [
          "Use videos with serene architectural pacing and high-end drone establishment shots.",
          "If using YouTube, ensure the video is marked 'Public' or 'Unlisted' and embedding is permitted.",
        ],
        commonMistakes: [
          "Linking to private videos that require permission or show third-party ads.",
        ],
      },
      {
        id: "sec-10",
        number: "10",
        title: "Digital Brochure & Official Documents",
        category: "Optional",
        icon: FileText,
        summary:
          "Allows high-intent prospects and foreign investors to request or download the official marketing brochure, master floor plans, and specification sheets directly.",
        fieldDetails: [
          {
            name: "Brochure URL",
            status: "Optional",
            spec: "Direct HTTPS link to PDF document",
            description: "Enables one-click 'Download Digital Brochure' CTA buttons across the presentation.",
            example: "https://.../sultan-heritage-official-brochure.pdf",
          },
          {
            name: "Document Size",
            status: "Recommended",
            spec: "Under 25 MB",
            description: "Ensures mobile users on standard cellular networks can open the brochure instantly.",
            example: "14 MB PDF",
          },
        ],
        bestPractices: [
          "Ensure developer contact details and high-resolution floor plans are included inside the PDF.",
          "Host brochures on Supabase Storage or a reliable cloud CDN with SSL.",
        ],
        commonMistakes: [
          "Linking to local file paths (e.g. file:///C:/...) instead of a public HTTPS URL.",
        ],
      },
      {
        id: "sec-11",
        number: "11",
        title: "Editorial Narrative & Marketing Content",
        category: "Required",
        icon: BookOpen,
        summary:
          "The editorial storytelling that elevates a property listing into an inspiring luxury real-estate journey. Crafted in sophisticated prose with bilingual English & Arabic support.",
        fieldDetails: [
          {
            name: "Typology & Structure Description",
            status: "Recommended",
            spec: "Short narrative summary",
            description: "Describes structural aesthetics, facade finishes, and architectural movement.",
            example: "Contemporary Omani Architecture with Floor-to-Ceiling Thermal Glazing & Travertine Accents",
          },
          {
            name: "Full Project Narrative",
            status: "Required",
            spec: "Multi-paragraph markdown text (150 to 500 words)",
            description: "The core presentation story covering location heritage, interior craftsmanship, and investment exclusivity.",
            example: "Rising majestically along the coastline of Muscat, Sultan Heritage Residences sets a new benchmark in bespoke waterfront living...",
          },
          {
            name: "Arabic Translation (Optional/Dual)",
            status: "Recommended",
            spec: "Arabic prose matching corporate tone",
            description: "Enables complete immersion for GCC and local Omani clientele.",
            example: "يقدم مشروع سلطان هيريتيج ريزيدنس مفهوماً استثنائياً للحياة العصرية في مسقط...",
          },
        ],
        bestPractices: [
          "Focus on lifestyle benefits, privacy, architectural prestige, and capital appreciation potential.",
          "Avoid unrealistic or unsubstantiated return-on-investment promises (e.g. avoid 'Guaranteed 20% Net Return').",
        ],
        commonMistakes: [
          "Entering a single brief sentence that looks empty on a luxury presentation page.",
        ],
      },
      {
        id: "sec-12",
        number: "12",
        title: "SEO Metadata & Digital Visibility",
        category: "Required",
        icon: Globe,
        summary:
          "Controls how search engines (Google, Bing) and social platforms (WhatsApp, LinkedIn, Twitter) index and preview the project.",
        fieldDetails: [
          {
            name: "Project URL Slug",
            status: "Required",
            spec: "Lowercase hyphenated string · Auto-generated",
            description: "Defines the clean public URL path: gardencityproperties.net/en/projects/[slug]/",
            example: "sultan-heritage-residences",
          },
          {
            name: "Publishing Status",
            status: "Required",
            spec: "Boolean toggle (Live vs Draft)",
            description: "When toggled ON, the project appears live in the public portfolio. When OFF, it remains an internal draft.",
            example: "Published: Live on website",
          },
        ],
        bestPractices: [
          "Keep URL slugs concise, descriptive, and free of special punctuation.",
          "Use the auto-slug feature in the dashboard which derives clean slugs directly from the project name.",
        ],
        commonMistakes: [
          "Changing the slug after the project has been indexed by Google (causes 404 links unless redirected).",
        ],
      },
    ],
    []
  );

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    guideSections.forEach((s) => (all[s.id] = true));
    setExpandedSections(all);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  const filteredSections = useMemo(() => {
    return guideSections.filter((section) => {
      const matchesFilter =
        activeFilter === "All" || section.category === activeFilter;
      const matchesQuery =
        !searchQuery ||
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.fieldDetails.some(
          (f) =>
            f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.example.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesFilter && matchesQuery;
    });
  }, [guideSections, activeFilter, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex h-[94vh] w-full max-w-6xl flex-col rounded-3xl border border-white/10 bg-[#070b1e] shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex flex-col gap-4 border-b border-white/10 bg-slate-900/80 px-6 py-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-400 text-slate-950 shadow-lg shadow-sky-500/20">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">
                  Official Standard
                </span>
                <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-sky-300 uppercase">
                  12 Key Modules
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                Admin Content & Media Upload Guide
              </h2>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              title="Print or Save as PDF"
            >
              <Printer className="h-4 w-4 text-sky-400" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-red-500/20 hover:text-white hover:border-red-500/40"
              aria-label="Close guide"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col gap-3 border-b border-white/10 bg-slate-950/60 px-6 py-3.5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between shrink-0">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search instructions, specs, image sizes, examples..."
              className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills & Expand Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {(["All", "Required", "Recommended", "Optional"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                  activeFilter === cat
                    ? "bg-sky-400 text-slate-950 font-bold shadow-md shadow-sky-400/20"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}

            <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

            <button
              type="button"
              onClick={expandAll}
              className="text-[11px] font-medium text-slate-400 hover:text-sky-300 transition"
            >
              Expand All
            </button>
            <span className="text-slate-600 text-xs hidden sm:inline">·</span>
            <button
              type="button"
              onClick={collapseAll}
              className="text-[11px] font-medium text-slate-400 hover:text-sky-300 transition"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Scrollable Guide Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 space-y-6">
          {/* Quick Primer Card */}
          <div className="rounded-2xl border border-sky-400/30 bg-gradient-to-br from-sky-950/40 via-slate-900/60 to-slate-950/80 p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Publishing Philosophy & Content Quality
                </h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Garden City Properties presentations are visited by discerning investors and homebuyers across the Sultanate of Oman and the GCC. Every published development should convey architectural authority, financial transparency, and visual elegance. Use this 12-section guide as your official checklist before toggling any project live.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium text-sky-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Auto-Compression Enabled
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5 font-medium text-sky-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Supported: JPG, PNG, WebP, PDF
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5 font-medium text-sky-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 40 MB Total Media Quota
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section Accordions */}
          {filteredSections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <HelpCircle className="h-10 w-10 text-slate-500 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No matching guide topics found</p>
              <p className="text-xs text-slate-500 mt-1">Try clearing your search query or filter</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("All");
                }}
                className="mt-3 text-xs font-semibold text-sky-400 underline hover:text-sky-300"
              >
                Reset Search
              </button>
            </div>
          ) : (
            filteredSections.map((sec) => {
              const isExpanded = Boolean(expandedSections[sec.id]);
              const Icon = sec.icon;

              return (
                <div
                  key={sec.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md transition-all hover:border-white/20 shadow-lg"
                >
                  {/* Accordion Header */}
                  <button
                    type="button"
                    onClick={() => toggleSection(sec.id)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 border border-white/10 text-sky-400 shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold tracking-widest text-sky-400">
                            SECTION {sec.number}
                          </span>
                          <span
                            className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                              sec.category === "Required"
                                ? "bg-red-950/60 text-red-300 border border-red-500/30"
                                : sec.category === "Recommended"
                                ? "bg-sky-950/60 text-sky-300 border border-sky-500/30"
                                : "bg-slate-800 text-slate-400 border border-white/10"
                            }`}
                          >
                            {sec.category}
                          </span>
                        </div>
                        <h3 className="font-serif text-base sm:text-lg font-bold text-white mt-0.5">
                          {sec.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 shrink-0">
                      <span className="hidden sm:inline text-xs font-medium">
                        {isExpanded ? "Collapse" : "View Details"}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-sky-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </button>

                  {/* Accordion Body */}
                  {isExpanded && (
                    <div className="border-t border-white/10 px-5 py-5 space-y-5 bg-slate-950/40">
                      {/* Summary */}
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {sec.summary}
                      </p>

                      {/* Field Details Table */}
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-sky-400 mb-2.5">
                          Field Specifications & Guidelines
                        </h4>
                        <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/80">
                          <table className="w-full text-left text-xs text-slate-300">
                            <thead className="border-b border-white/10 bg-slate-900/80 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                              <tr>
                                <th className="px-3.5 py-2.5">Field Name</th>
                                <th className="px-3.5 py-2.5">Importance</th>
                                <th className="px-3.5 py-2.5">Format & Specs</th>
                                <th className="px-3.5 py-2.5">Description & Purpose</th>
                                <th className="px-3.5 py-2.5">Realistic Example</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-sans">
                              {sec.fieldDetails.map((f) => (
                                <tr key={f.name} className="hover:bg-white/[0.02]">
                                  <td className="px-3.5 py-3 font-semibold text-white whitespace-nowrap">
                                    {f.name}
                                  </td>
                                  <td className="px-3.5 py-3">
                                    <span
                                      className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                                        f.status === "Required"
                                          ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                          : f.status === "Recommended"
                                          ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                          : "bg-slate-800 text-slate-400 border border-white/10"
                                      }`}
                                    >
                                      {f.status}
                                    </span>
                                  </td>
                                  <td className="px-3.5 py-3 font-mono text-[11px] text-sky-200">
                                    {f.spec}
                                  </td>
                                  <td className="px-3.5 py-3 text-slate-300 leading-relaxed max-w-xs whitespace-pre-line">
                                    {f.description}
                                  </td>
                                  <td className="px-3.5 py-3 text-amber-300/90 font-mono text-[11px] bg-slate-900/30">
                                    {f.example}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Best Practices & Common Mistakes (2 cols) */}
                      <div className="grid gap-4 sm:grid-cols-2 pt-1">
                        {/* Best Practices */}
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4">
                          <h5 className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                            <CheckCircle2 className="h-4 w-4" /> Recommended Best Practices
                          </h5>
                          <ul className="space-y-1.5 text-xs text-slate-300">
                            {sec.bestPractices.map((bp, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                                <span className="leading-relaxed">{bp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Common Mistakes */}
                        <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-4">
                          <h5 className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
                            <AlertCircle className="h-4 w-4" /> Pitfalls to Avoid
                          </h5>
                          <ul className="space-y-1.5 text-xs text-slate-300">
                            {sec.commonMistakes.map((cm, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-red-400 mt-0.5 font-bold">✗</span>
                                <span className="leading-relaxed">{cm}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Bar */}
        <div className="flex flex-col gap-3 border-t border-white/10 bg-slate-900/90 px-6 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Garden City Properties · Internal Administrator Handbook</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Export Printable PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 px-5 py-2 text-xs font-bold text-slate-950 shadow-md shadow-sky-400/20 transition hover:brightness-110"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
