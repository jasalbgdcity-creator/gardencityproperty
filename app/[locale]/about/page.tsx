import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import About from "@/components/About";
import Leadership from "@/components/Leadership";
import CoreValues from "@/components/CoreValues";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  const baseUrl = "https://www.gardencityproperties.net";

  const title = isAr
    ? "من نحن | شركة جاردن سيتي بروبرتيز عمان"
    : "About Us | Garden City Properties Oman";

  const description = isAr
    ? "تأسست في عام 2007، وهي إحدى الأسماء الموثوقة في عُمان في مجالات الوساطة والتقييم والاستشارات العقارية، بقيادة المؤسس ورئيس مجلس الإدارة الفاضل محمد الحارثي."
    : "Established in 2007, one of Oman’s trusted names in real estate brokerage, valuation and consultancy, led by Founder & Chairman Mohamed Al Harthy and General Manager Adam Al Harthy.";

  const canonicalUrl = `${baseUrl}/${locale}/about/`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-OM": `${baseUrl}/en/about/`,
        "ar-OM": `${baseUrl}/ar/about/`,
        "x-default": `${baseUrl}/en/about/`,
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

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const baseUrl = "https://www.gardencityproperties.net";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", href: `/${locale}/` },
    { name: isAr ? "من نحن" : "About Us", href: `/${locale}/about/` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${baseUrl}/${locale}/about/#webpage`,
        url: `${baseUrl}/${locale}/about/`,
        name: isAr ? "من نحن | شركة جاردن سيتي بروبرتيز" : "About Us | Garden City Properties",
        description: isAr
          ? "تأسست في عام 2007، وهي إحدى الأسماء الموثوقة في عُمان في مجالات الوساطة والتقييم والاستشارات العقارية، بدعم من فريق متعدد التخصصات من المهندسين والمساحين وخبراء العقارات."
          : "Established in 2007, one of Oman’s trusted names in real estate brokerage, valuation and consultancy, backed by a multidisciplinary team of engineers, surveyors, and property specialists.",
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
        "@id": `${baseUrl}/${locale}/about/#breadcrumbs`,
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
            name: isAr ? "من نحن" : "About Us",
            item: `${baseUrl}/${locale}/about/`,
          },
        ],
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#050816] text-slate-100">
      <Navbar />

      <Script
        id="about-jsonld"
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
                {isAr ? "الملف المؤسسي" : "Corporate Profile"}
              </span>
              <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl rtl:font-[family-name:var(--font-cairo)]">
                {isAr ? (
                  <>
                    عن <span className="text-sky-400">جاردن سيتي بروبرتيز</span> عمان
                  </>
                ) : (
                  <>
                    About <span className="text-sky-400">Garden City Properties</span> Oman
                  </>
                )}
              </h1>
              <p className="mt-6 text-base md:text-lg leading-relaxed text-slate-300">
                {isAr
                  ? "تأسست في عام 2007، وهي إحدى الأسماء الموثوقة في عُمان في مجالات الوساطة والتقييم والاستشارات العقارية، بدعم من فريق متعدد التخصصات من المهندسين والمساحين وخبراء العقارات."
                  : "Established in 2007, one of Oman’s trusted names in real estate brokerage, valuation and consultancy, backed by a multidisciplinary team of engineers, surveyors, and property specialists."}
              </p>
            </div>
          </div>
        </section>

        {/* Existing Interactive About Component (with audio & media) */}
        <About />

        {/* Strategic Purpose & Core Values */}
        <CoreValues />

        {/* Executive Leadership (Mohamed Al Harthy & Adam Al Harthy) */}
        <Leadership />

        {/* Contextual Internal Link Banner to Services & Contact */}
        <section className="border-t border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12 backdrop-blur-xl">
              <div className="max-w-2xl text-center md:text-start">
                <h3 className="font-[family-name:var(--font-outfit)] text-2xl md:text-3xl font-bold text-white rtl:font-[family-name:var(--font-cairo)]">
                  {isAr
                    ? "بوابتك للاستثمار العقاري في عُمان – اكتشف، استثمر وامتلك بثقة."
                    : "Your Gateway to Real Estate Investment in Oman – Discover, Invest & Own with Confidence."}
                </h3>
                <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed rtl:font-[family-name:var(--font-cairo)]">
                  {isAr
                    ? "استكشف محفظتنا المختارة من المشاريع الرائدة وخدماتنا الاستشارية المتكاملة، أو تواصل مباشرة مع فريقنا الاستشاري في مسقط اليوم."
                    : "Explore our curated portfolio of premier developments and advisory services, or connect with our consultancy team in Muscat today."}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
                <Link
                  href={`/${locale}/services/`}
                  className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/10 px-6 py-3 text-sm font-semibold text-sky-300 transition-all hover:bg-sky-500/20 hover:border-sky-400"
                >
                  <span>{isAr ? "استكشف خدماتنا" : "Explore Services"}</span>
                  <ArrowIcon className="h-4 w-4" />
                </Link>
                <Link
                  href={`/${locale}/contact/`}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(56,189,248,0.35)] transition-all hover:shadow-[0_0_36px_rgba(56,189,248,0.55)] hover:-translate-y-0.5"
                >
                  <span>{isAr ? "تواصل معنا" : "Contact Our Team"}</span>
                  <ArrowIcon className="h-4 w-4" />
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
