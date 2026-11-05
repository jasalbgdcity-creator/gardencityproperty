import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectPresentation from "@/components/ProjectPresentation";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const { data: projects } = await supabase
      .from("projects")
      .select("id");

    if (Array.isArray(projects) && projects.length > 0) {
      return projects.flatMap((p) => [
        { locale: "en", slug: String(p.id) },
        { locale: "ar", slug: String(p.id) },
      ]);
    }
  } catch (err) {
    console.warn("generateStaticParams: Supabase fetch skipped during build", err);
  }
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const isAr = locale === "ar";
  const baseUrl = "https://www.gardencityproperties.net";

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", slug)
    .single();

  if (!project) {
    return {
      title: isAr
        ? "المشروع غير موجود | جاردن سيتي بروبرتيز"
        : "Project Not Found | Garden City Properties",
    };
  }

  const title = isAr
    ? `${project.name} | مشاريع عقارية استثمارية في ${project.location || "مسقط"} عمان`
    : `${project.name} | Luxury Property Investment in ${project.location || "Muscat"} Oman`;

  const description = isAr
    ? `مشروع ${project.name} في ${project.location || "مسقط"} من تطوير ${project.developer}. ابتداءً من ${project.price} مع خطط سداد ميسرة في سلطنة عمان.`
    : `Discover ${project.name} in ${project.location || "Muscat"} by ${project.developer}. Starting from ${project.price} with flexible payment plans in Oman.`;

  const ogImages = project.image ? [{ url: project.image, width: 1200, height: 630, alt: project.name }] : [];

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}/projects/${slug}/`,
      languages: {
        "en-OM": `${baseUrl}/en/projects/${slug}/`,
        "ar-OM": `${baseUrl}/ar/projects/${slug}/`,
        "x-default": `${baseUrl}/en/projects/${slug}/`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/projects/${slug}/`,
      type: "article",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const isAr = locale === "ar";
  const baseUrl = "https://www.gardencityproperties.net";

  // Fetch target project
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", slug)
    .single();

  if (error || !project) {
    notFound();
  }

  // Fetch related projects (excluding current project)
  const { data: relatedProjects } = await supabase
    .from("projects")
    .select("*")
    .neq("id", slug)
    .limit(3);

  // Attempt to fetch configurations from relational table, fallback to JSON column
  let mergedConfigurations = project.property_configurations || [];
  try {
    const { data: configs } = await supabase
      .from("project_configurations")
      .select("*")
      .eq("project_id", slug)
      .order("display_order", { ascending: true });
    if (configs && configs.length > 0) {
      mergedConfigurations = configs;
    }
  } catch {
    // Relational table might not exist yet
  }

  // Attempt to fetch nearby places from relational table, fallback to JSON column
  let mergedNearbyPlaces = project.nearby_locations || [];
  try {
    const { data: places } = await supabase
      .from("project_nearby_places")
      .select("*")
      .eq("project_id", slug)
      .order("display_order", { ascending: true });
    if (places && places.length > 0) {
      mergedNearbyPlaces = places;
    }
  } catch {
    // Relational table might not exist yet
  }

  // Attempt to fetch payment milestones from relational table, fallback to JSON column
  let mergedMilestones = project.payment_milestones || [];
  try {
    const { data: milestones } = await supabase
      .from("project_payment_milestones")
      .select("*")
      .eq("project_id", slug)
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    if (milestones && milestones.length > 0) {
      mergedMilestones = milestones;
    }
  } catch {
    // Relational table might not exist yet
  }

  // Attempt to fetch amenities from relational table, fallback to JSON column
  let mergedAmenities = project.amenities || [];
  try {
    const { data: amenities } = await supabase
      .from("project_amenities")
      .select("*")
      .eq("project_id", slug)
      .order("display_order", { ascending: true });
    if (amenities && amenities.length > 0) {
      mergedAmenities = amenities;
    }
  } catch {
    // Relational table might not exist yet
  }

  const enrichedProject = {
    ...project,
    payment_milestones: mergedMilestones,
    amenities: mergedAmenities,
    property_configurations: mergedConfigurations,
    nearby_locations: mergedNearbyPlaces,
  };

  const location = project.location || (isAr ? "مسقط، سلطنة عمان" : "Muscat, Oman");
  const gallery: string[] = Array.from(
    new Set([project.image, ...(project.gallery_urls || project.galleryUrls || [])].filter(Boolean))
  );

  // Structured Data Schema for Real Estate Listing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: project.name,
    description: isAr
      ? `مشروع ${project.name} في ${location}. من تطوير ${project.developer}. ابتداءً من ${project.price}.`
      : `Prime property ${project.name} in ${location}. Developed by ${project.developer}. Starting from ${project.price}.`,
    url: `${baseUrl}/${locale}/projects/${slug}/`,
    image: gallery,
    offers: {
      "@type": "Offer",
      price: String(project.price || "").replace(/[^0-9.]/g, "") || "45000",
      priceCurrency: "OMR",
      availability:
        project.status === "Sold Out"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: location,
      addressCountry: "OM",
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#050816] text-slate-100">
      <Navbar />

      <Script
        id={`json-ld-project-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 w-full">
        <ProjectPresentation
          project={enrichedProject}
          relatedProjects={relatedProjects || []}
          locale={locale}
        />
      </main>

      <Footer />
    </div>
  );
}
