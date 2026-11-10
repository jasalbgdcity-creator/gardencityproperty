import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import PropertyImage from "@/components/PropertyImage";
import { supabase } from "@/lib/supabase";
import {
  localizeField,
  localizeDeveloper,
  localizeProjectName,
  localizePropertyType,
  localizeStatus,
  localizePaymentPlan,
  localizeLocation,
} from "@/lib/localization";
import {
  Building2,
  CalendarDays,
  MapPin,
  Ruler,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  const baseUrl = "https://www.gardencityproperties.net";

  const title = isAr
    ? "المشاريع والعقارات | شركة جاردن سيتي بروبرتيز عمان"
    : "Projects & Property Portfolio | Garden City Properties Oman";

  const description = isAr
    ? "استكشف أحدث المشاريع العقارية الفاخرة والفرص الاستثمارية الحصرية في مسقط وسلطنة عمان. شقق وفلل ومكاتب تجارية بأفضل خطط الدفع."
    : "Browse premium real estate developments and exclusive property investments in Muscat and Oman. Apartments, luxury villas, and commercial spaces with flexible payment plans.";

  const canonicalUrl = `${baseUrl}/${locale}/projects/`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-OM": `${baseUrl}/en/projects/`,
        "ar-OM": `${baseUrl}/ar/projects/`,
        "x-default": `${baseUrl}/en/projects/`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      locale: isAr ? "ar_OM" : "en_OM",
      alternateLocale: [isAr ? "en_OM" : "ar_OM"],
      siteName: "Garden City Properties",
      images: [
        {
          url: "/Logo.jpeg",
          width: 1280,
          height: 532,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/Logo.jpeg"],
    },
  };
}

interface ProjectRecord {
  id: string;
  name?: string;
  price?: string;
  payment_plan?: string;
  paymentPlan?: string;
  area?: string;
  site_area?: string;
  developer?: string;
  image?: string;
  location?: string;
  type?: string;
  property_type?: string;
  status?: string;
  completion_date?: string;
  description?: string;
  whatsapp_number?: string;
}

export default async function ProjectsIndexPage({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const baseUrl = "https://www.gardencityproperties.net";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", href: `/${locale}/` },
    { name: isAr ? "المشاريع" : "Projects", href: `/${locale}/projects/` },
  ];

  // Fetch live projects from Supabase
  let projects: ProjectRecord[] = [];
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      projects = data as ProjectRecord[];
    }
  } catch (err) {
    console.error("ProjectsPage: Supabase fetch error", err);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}/${locale}/projects/#webpage`,
        url: `${baseUrl}/${locale}/projects/`,
        name: isAr ? "المشاريع والعقارات | جاردن سيتي بروبرتيز" : "Projects Directory | Garden City Properties",
        description: isAr
          ? "دليل المشاريع العقارية والاستثمارية المتاحة في سلطنة عمان."
          : "Directory of premium real estate projects and investment opportunities in Oman.",
        isPartOf: {
          "@id": `${baseUrl}/${locale}/#website`,
        },
        about: {
          "@id": `${baseUrl}/#organization`,
        },
        inLanguage: isAr ? "ar-OM" : "en-OM",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/${locale}/projects/#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isAr ? "الرئيسية" : "Home",
            item: `${baseUrl}/${locale}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isAr ? "المشاريع" : "Projects",
            item: `${baseUrl}/${locale}/projects/`,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${baseUrl}/${locale}/projects/#itemlist`,
        numberOfItems: projects.length,
        itemListElement: projects.map((p, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: localizeProjectName(p.name, (p as any).name_ar, locale) || `Project ${p.id}`,
          url: `${baseUrl}/${locale}/projects/${p.id}/`,
        })),
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#050816] text-slate-100">
      <Navbar />

      <Script
        id="projects-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1">
        {/* Page Hero Header */}
        <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-slate-950 via-[#050816] to-[#050816] py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <Breadcrumbs items={breadcrumbs} locale={isAr ? "ar" : "en"} />

            <div className="max-w-3xl">
              <span className="inline-block rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1 text-xs font-semibold tracking-wider text-sky-300 uppercase">
                {isAr ? "محفظة المشاريع" : "Property Showcase"}
              </span>
              <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl rtl:font-[family-name:var(--font-cairo)]">
                {isAr ? (
                  <>
                    مشاريع <span className="text-sky-400">حصرية ومتميزة</span> في سلطنة عمان
                  </>
                ) : (
                  <>
                    Exclusive <span className="text-sky-400">Projects & Developments</span> in Oman
                  </>
                )}
              </h1>
              <p className="mt-6 text-base md:text-lg leading-relaxed text-slate-300">
                {isAr
                  ? "تصفح أحدث المجمعات السكنية والتجارية والاستثمارية الرائدة في مسقط وسلطنة عمان. نوفر لعملائنا أفضل الفرص العقارية بخطط دفع مرنة ومعلومات تفصيلية شاملة."
                  : "Explore our curated collection of premier residential, commercial, and mixed-use developments in Muscat and across Oman. Review payment plans, site areas, developer profiles, and architectural floorplans."}
              </p>
            </div>
          </div>
        </section>

        {/* Projects Grid Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-[family-name:var(--font-outfit)]">
                  {isAr ? "جميع المشاريع المنشورة" : "All Published Developments"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {isAr
                    ? `عرض ${projects.length} مشروع متاح في المحفظة`
                    : `Displaying ${projects.length} active developments in the portfolio`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-xs text-sky-300 font-medium">
                  <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                  {isAr ? "بيانات حية ومحدثة" : "Live Real-Time Data"}
                </span>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-12 text-center">
                <Building2 className="mx-auto h-12 w-12 text-slate-500" />
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {isAr ? "جاري تحميل المشاريع..." : "Projects are currently loading..."}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  {isAr
                    ? "يرجى التحديث أو معاودة التحقق بعد لحظات."
                    : "Please refresh or check back shortly."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => {
                  const projectId = project.id;
                  const projectName =
                    localizeProjectName(project.name, (project as any).name_ar, locale) ||
                    "Garden City Development";
                  const price = localizeField(
                    project.price,
                    locale,
                    isAr ? "عند الطلب" : "Upon Request"
                  );
                  const paymentPlan = localizePaymentPlan(
                    project.payment_plan || project.paymentPlan,
                    (project as any).payment_plan_ar,
                    locale
                  );
                  const area = localizeField(
                    project.area || project.site_area,
                    locale,
                    isAr ? "متعدد المساحات" : "Various sizes"
                  );
                  const developer = localizeDeveloper(
                    project.developer,
                    (project as any).developer_ar,
                    locale
                  );
                  const location = localizeLocation(
                    project.location,
                    (project as any).location_ar,
                    locale
                  );
                  const status = project.status
                    ? localizeStatus(project.status, (project as any).status_ar, locale)
                    : null;
                  const completionDate = project.completion_date
                    ? localizeField(project.completion_date, locale, project.completion_date)
                    : null;
                  const detailHref = `/${locale}/projects/${projectId}/`;

                  return (
                    <article
                      key={projectId}
                      className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/50 hover:shadow-[0_0_36px_rgba(56,189,248,0.2)]"
                    >
                      {/* Project Image */}
                      <Link href={detailHref} className="relative block h-64 w-full overflow-hidden bg-slate-950">
                        <PropertyImage
                          src={project.image || "/Logo.jpeg"}
                          alt={`${projectName} - Real Estate in Oman`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

                        {status && (
                          <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-10">
                            <span className="rounded-full border border-sky-400/40 bg-slate-950/80 px-3 py-1 text-xs font-semibold text-sky-300 backdrop-blur-md">
                              {status}
                            </span>
                          </div>
                        )}

                        <div className="absolute bottom-4 left-4 right-4 z-10">
                          <p className="text-xs font-semibold tracking-wider text-sky-400 uppercase">
                            {developer}
                          </p>
                          <h3 className="mt-1 font-[family-name:var(--font-outfit)] text-xl font-bold text-white transition-colors group-hover:text-sky-300 truncate">
                            {projectName}
                          </h3>
                        </div>
                      </Link>

                      {/* Project Meta Details */}
                      <div className="flex flex-1 flex-col justify-between p-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-xs text-slate-300">
                            <MapPin className="h-4 w-4 shrink-0 text-sky-400" />
                            <span className="truncate">{location}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                              <p className="text-[0.7rem] uppercase text-slate-400">{isAr ? "السعر يبدأ من" : "Starting Price"}</p>
                              <p className="mt-0.5 text-xs sm:text-sm font-bold text-white truncate">{price}</p>
                            </div>
                            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                              <p className="text-[0.7rem] uppercase text-slate-400">{isAr ? "خطة الدفع" : "Payment Plan"}</p>
                              <p className="mt-0.5 text-xs sm:text-sm font-semibold text-sky-300 truncate">{paymentPlan}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                            <span className="inline-flex items-center gap-1.5">
                              <Ruler className="h-3.5 w-3.5 text-slate-500" />
                              {area}
                            </span>
                            {completionDate && (
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
                                {completionDate}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Link to Detail Page */}
                        <div className="mt-6 pt-4 border-t border-white/10">
                          <Link
                            href={detailHref}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-md transition-all hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] group-hover:from-sky-400 group-hover:to-cyan-300"
                          >
                            <span>{isAr ? "عرض التفاصيل الكاملة للمشروع" : "View Full Project Details"}</span>
                            <ArrowIcon className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Internal Link CTA Section */}
        <section className="border-t border-white/10 bg-slate-950/70 py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10 backdrop-blur-xl">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {isAr ? "هل لديك عقار ترغب في وساطته أو تقييمه؟" : "Have a Property to Broker, Manage, or Value?"}
                </h3>
                <p className="mt-2 text-slate-300 text-sm">
                  {isAr
                    ? "يقدم مستشارونا العقاريون المعتمدون في مسقط خدمات وساطة وإدارة وتقييم تلبي أعلى المعايير البنكية."
                    : "Our accredited Muscat real estate advisors provide certified valuation and brokerage services meeting the highest standards."}
                </p>
              </div>
              <div className="flex flex-wrap gap-4 shrink-0">
                <Link
                  href={`/${locale}/about/`}
                  className="rounded-full border border-sky-400/30 px-5 py-2.5 text-xs sm:text-sm font-semibold text-sky-300 hover:bg-sky-400/10"
                >
                  {isAr ? "نبذة عن الشركة" : "About Garden City"}
                </Link>
                <Link
                  href={`/${locale}/contact/`}
                  className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                >
                  {isAr ? "تواصل مع مستشار عقاري" : "Speak to an Advisor"}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
