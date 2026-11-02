import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const baseUrl = "https://www.gardencityproperties.net";

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", slug)
    .single();

  if (!project) {
    return {
      title: "Property Not Found | Garden City Properties",
    };
  }

  const title = `${project.name} | ${project.location || "Muscat"} Real Estate`;
  const description = `${project.name} developed by ${project.developer}. Starting at ${project.price} with ${project.payment_plan || "flexible"} payment schedule in Oman.`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: {
        "en-OM": `/en/projects/${slug}`,
        "ar-OM": `/ar/projects/${slug}`,
        "x-default": `/en/projects/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/projects/${slug}`,
      type: "article",
      images: [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: project.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [project.image],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const isAr = locale === "ar";

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", slug)
    .single();

  if (!project) notFound();

  // Structured Data Schema for Real Estate Listing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: project.name,
    description: `Prime property in ${project.location || "Muscat, Oman"}. Developed by ${project.developer}.`,
    url: `https://www.gardencityproperties.net/${locale}/projects/${slug}`,
    image: [project.image, ...(project.gallery_urls || [])],
    offers: {
      "@type": "Offer",
      price: String(project.price || "").replace(/[^0-9.]/g, "") || "45000",
      priceCurrency: "OMR",
      availability:
        project.status === "Available"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: project.location || "Muscat",
      addressCountry: "OM",
    },
  };

  return (
    <>
      <Script
        id="json-ld-project"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/#projects`}
          className="text-xs font-semibold tracking-wider text-sky-400 uppercase hover:underline"
        >
          ← {isAr ? "العودة إلى المشاريع" : "Back to Projects"}
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          {/* LCP-Optimized Main Visual */}
          <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
            <Image
              src={project.image}
              alt={project.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Details & Specs */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-bold text-sky-300 uppercase">
                {project.type || "Residential"}
              </span>
              <h1 className="mt-4 font-[family-name:var(--font-outfit)] text-4xl font-extrabold text-white">
                {project.name}
              </h1>
              <p className="mt-2 text-2xl font-bold text-amber-400">
                {project.price}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <span className="text-xs text-slate-400 uppercase">
                  {isAr ? "المساحة" : "Site Area"}
                </span>
                <p className="mt-1 font-bold text-white">{project.area}</p>
              </div>
              <div className="rounded-2xl bg-amber-500 p-4 text-slate-950 font-bold">
                <span className="text-xs uppercase">
                  {isAr ? "مرحلة البناء" : "Stage"}
                </span>
                <p className="mt-1">
                  {project.construction_stage || "Under Construction"}
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/message/BACRFFVZ3LOXH1?text=${encodeURIComponent(
                `Inquiry about ${project.name}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex w-full items-center justify-center rounded-xl bg-emerald-500 py-4 font-bold text-slate-950 transition hover:bg-emerald-400"
            >
              {isAr ? "تواصل عبر واتساب" : "Inquire via WhatsApp"}
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
