import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  BadgeDollarSign,
  Building2,
  Handshake,
  KeyRound,
  Ruler,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Landmark,
} from "lucide-react";

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
    ? "خدماتنا العقارية | تقييم معتمد ووساطة واستشارات في عمان"
    : "Real Estate Services | Valuation, Brokerage & Advisory Oman";

  const description = isAr
    ? "خدمات عقارية شاملة في سلطنة عمان: استشارات عقارية، وساطة موثوقة، إدارة أملاك، تقييم عقاري معتمد لدى كبرى البنوك، وحساب كميات للمشاريع."
    : "Comprehensive real estate solutions in Oman: Property consultancy, trusted brokerage, property management, bank-approved valuation, and quantity surveying.";

  const canonicalUrl = `${baseUrl}/${locale}/services/`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-OM": `${baseUrl}/en/services/`,
        "ar-OM": `${baseUrl}/ar/services/`,
        "x-default": `${baseUrl}/en/services/`,
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

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const baseUrl = "https://www.gardencityproperties.net";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", href: `/${locale}/` },
    { name: isAr ? "خدماتنا" : "Services", href: `/${locale}/services/` },
  ];

  const serviceList = [
    {
      id: "consultancy",
      icon: Building2,
      title: isAr ? "الاستشارات العقارية" : "Property Consultancy",
      badge: isAr ? "استشارات مستقلة" : "Independent Advisory",
      description: isAr
        ? "استشارات عقارية مستقلة ومتخصصة لعمليات الاستحواذ والتصرف وإدارة استراتيجيات المحافظ العقارية عبر مختلف القطاعات السكنية والتجارية في سلطنة عمان."
        : "Independent advisory for property acquisitions, disposals, and strategic portfolio positioning across Oman’s residential, commercial, and industrial markets.",
      points: isAr
        ? [
            "تحديد الفرص الاستثمارية ذات العوائد المجدية والمخاطر المدروسة.",
            "تحليل اتجاهات السوق العقاري العماني وتقديم رؤى مستقبلية دقيقة.",
            "إعادة هيكلة الأصول العقارية لتعظيم تدفقاتها النقدية وقيمتها الرأسمالية.",
          ]
        : [
            "Identifying high-yield investment opportunities with mitigated risk profiles.",
            "In-depth analysis of Omani property market trends and forward-looking intelligence.",
            "Asset repositioning to maximize ongoing cash flow and long-term capital appreciation.",
          ],
    },
    {
      id: "brokerage",
      icon: Handshake,
      title: isAr ? "الوساطة العقارية" : "Real Estate Brokerage",
      badge: isAr ? "شريكك الموثوق" : "Trusted Brokerage",
      description: isAr
        ? "ربط المشترين والبائعين والمستأجرين بأفضل الفرص العقارية المناسبة، مع تقديم دعم احترافي كامل لضمان معاملات سلسة وآمنة في جميع أنحاء عمان."
        : "Connecting buyers, sellers, and tenants with premier property opportunities, offering comprehensive professional guidance for smooth, transparent transactions.",
      points: isAr
        ? [
            "تسويق احترافي للأراضي والمباني السكنية والتجارية والمشاريع الفاخرة.",
            "إتمام الإجراءات القانونية ونقل الملكيات وفق الأنظمة المعمول بها في سلطنة عمان.",
            "التفاوض الاحترافي لتحقيق أفضل الشروط والأسعار للمستثمرين والملاك.",
          ]
        : [
            "Targeted marketing for residential, commercial, and prime development assets.",
            "Navigating regulatory documentation and conveyance in line with Omani law.",
            "Skilled transaction negotiation to secure optimal terms for both buyers and sellers.",
          ],
    },
    {
      id: "management",
      icon: KeyRound,
      title: isAr ? "إدارة الأملاك والأصول" : "Property & Asset Management",
      badge: isAr ? "إدارة متكاملة" : "Full-Cycle Management",
      description: isAr
        ? "إدارة احترافية شاملة للعقارات السكنية والتجارية. نتولى علاقات المستأجرين، تحصيل الإيجارات، المتابعة الدورية للصيانة، والعمليات اليومية لحماية قيمة عقارك."
        : "Professional management of residential and commercial assets. We manage tenant relations, rent collection, preventative maintenance, and day-to-day operations to protect asset value.",
      points: isAr
        ? [
            "تحصيل الإيجارات ومتابعة العقود والالتزامات المالية بدقة واحترافية.",
            "إشراف هندسي وصيانة وقائية دورية للحفاظ على كفاءة المبنى.",
            "تقليل فترات الشغور وتحقيق أعلى نسب إشغال مستدامة.",
          ]
        : [
            "Timely rent collection, lease administration, and strict financial accounting.",
            "Preventative maintenance and facilities oversight to maintain structural integrity.",
            "Minimizing vacancies and optimizing retention rates across your real estate portfolio.",
          ],
    },
    {
      id: "valuation",
      icon: BadgeDollarSign,
      title: isAr ? "التقييم العقاري المعتمد" : "Bank-Approved Property Valuation",
      badge: isAr ? "معتمد لدى كبرى البنوك" : "Approved by Leading Banks",
      highlight: true,
      description: isAr
        ? "تُعد جاردن سيتي بروبرتيز إحدى أبرز وأوثق شركات التقييم العقاري في سلطنة عمان، ومعتمدة لدى البنوك والمؤسسات المالية لتقديم تقارير دقيقة وموثوقة."
        : "Garden City Properties is recognized as one of Oman’s premier property valuation authorities, approved by leading commercial banks and financial institutions for certified asset appraisals.",
      points: isAr
        ? [
            "تقييم عقاري للأغراض التمويلية والرهن العقاري معتمد لدى البنوك العمانية.",
            "تقييم دقيق للأصول العقارية لأغراض إعداد الميزانيات، الاندماج، أو التصفية.",
            "معايير تقييم دولية ومهنية تعتمد على فحص ميداني شامل وتحليل بياني دقيق.",
          ]
        : [
            "Valuation reports for mortgage lending and corporate financing approved by top banks.",
            "Balance sheet asset valuations, corporate restructuring, and financial audit appraisals.",
            "Adherence to rigorous valuation standards based on comprehensive site inspections.",
          ],
    },
    {
      id: "surveying",
      icon: Ruler,
      title: isAr ? "حساب الكميات وإدارة التكاليف" : "Quantity Surveying",
      badge: isAr ? "دقة التكاليف" : "Cost Optimization",
      description: isAr
        ? "خدمات متخصصة في حساب الكميات للمباني السكنية والتجارية، وتقدير دقيق للتكاليف والميزانيات وقياس المواد، لمساعدة المطورين على إدارة نفقات البناء بكفاءة."
        : "Expert quantity surveying services for residential, commercial, and mixed-use structures. Detailed cost estimation, budget planning, and material take-offs to ensure cost control.",
      points: isAr
        ? [
            "إعداد جداول الكميات (BOQ) ومطابقتها للمخططات والمواصفات الهندسية.",
            "دراسة التكاليف التقديرية وتدقيق فواتير المقاولين ومستخلصات الدفع.",
            "المساعدة في تجنب تجاوز الميزانية وضمان الشفافية المالية طوال مراحل المشروع.",
          ]
        : [
            "Preparation of detailed Bills of Quantities (BOQ) aligned with engineering drawings.",
            "Pre-construction cost planning, contractor tender analysis, and interim valuations.",
            "Preventing budget overruns and maintaining transparent fiscal control through project completion.",
          ],
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemPage",
        "@id": `${baseUrl}/${locale}/services/#webpage`,
        url: `${baseUrl}/${locale}/services/`,
        name: isAr ? "خدماتنا العقارية | جاردن سيتي بروبرتيز" : "Real Estate Services | Garden City Properties",
        description: isAr
          ? "الخدمات العقارية والاستشارية والتقييم المعتمد وحساب الكميات في سلطنة عمان."
          : "Professional real estate consultancy, brokerage, asset management, valuation, and quantity surveying in Oman.",
        isPartOf: {
          "@id": `${baseUrl}/${locale}/#website`,
        },
        inLanguage: isAr ? "ar-OM" : "en-OM",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/${locale}/services/#breadcrumbs`,
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
            name: isAr ? "خدماتنا" : "Services",
            item: `${baseUrl}/${locale}/services/`,
          },
        ],
      },
      ...serviceList.map((service, index) => ({
        "@type": "Service",
        "@id": `${baseUrl}/${locale}/services/#${service.id}`,
        name: service.title,
        description: service.description,
        provider: {
          "@id": `${baseUrl}/#organization`,
        },
        areaServed: {
          "@type": "Country",
          name: isAr ? "سلطنة عمان" : "Oman",
        },
      })),
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#050816] text-slate-100">
      <Navbar />

      <Script
        id="services-jsonld"
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
                {isAr ? "الممارسات الأساسية" : "Core Practice Areas"}
              </span>
              <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl rtl:font-[family-name:var(--font-cairo)]">
                {isAr ? (
                  <>
                    خدمات عقارية <span className="text-sky-400">متكاملة ومعتمدة</span> في عمان
                  </>
                ) : (
                  <>
                    Comprehensive <span className="text-sky-400">Real Estate Services</span> in Oman
                  </>
                )}
              </h1>
              <p className="mt-6 text-base md:text-lg leading-relaxed text-slate-300">
                {isAr
                  ? "تقدم شركة جاردن سيتي بروبرتيز باقة متكاملة من الخدمات العقارية المصممة للمستثمرين، المطورين، ملاك العقارات، والجهات المصرفية في سلطنة عمان، مستندة إلى خبرة تزيد عن 18 عاماً وكادر هندسي وفني متخصص."
                  : "Garden City Properties delivers a multi-disciplinary suite of professional services designed for investors, developers, corporate occupiers, and financial institutions across Oman, grounded in nearly two decades of market expertise."}
              </p>
            </div>
          </div>
        </section>

        {/* 5 Core Services Grid */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="space-y-12">
              {serviceList.map((service, idx) => {
                const Icon = service.icon;
                const isHighlight = service.highlight;

                return (
                  <article
                    key={service.id}
                    id={service.id}
                    className={`scroll-mt-28 relative overflow-hidden rounded-3xl border p-8 md:p-12 transition-all duration-300 backdrop-blur-xl ${
                      isHighlight
                        ? "border-sky-400/60 bg-gradient-to-br from-slate-900/90 via-sky-950/20 to-slate-900/90 shadow-[0_0_40px_rgba(56,189,248,0.15)]"
                        : "border-white/10 bg-slate-900/50 hover:border-sky-400/30"
                    }`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Left Header / Icon */}
                      <div className="lg:col-span-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${
                            isHighlight
                              ? "border-sky-400/50 bg-sky-500/20 text-sky-300"
                              : "border-white/10 bg-slate-950/70 text-sky-400"
                          }`}>
                            <Icon size={26} />
                          </div>
                          <div>
                            <span className="inline-block rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-0.5 text-xs font-semibold text-sky-300 uppercase">
                              {service.badge}
                            </span>
                            <span className="block text-xs text-slate-500 mt-1">
                              {isAr ? `الممارسة 0${idx + 1}` : `Practice 0${idx + 1}`}
                            </span>
                          </div>
                        </div>

                        <h2 className="font-[family-name:var(--font-outfit)] text-2xl md:text-3xl font-bold text-white pt-2">
                          {service.title}
                        </h2>

                        <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                          {service.description}
                        </p>

                        {isHighlight && (
                          <div className="inline-flex items-center gap-2 rounded-xl border border-sky-400/30 bg-sky-950/50 px-4 py-2 text-xs font-medium text-sky-200">
                            <Landmark className="h-4 w-4 text-sky-400 shrink-0" />
                            <span>{isAr ? "معتمد لدى البنوك التجارية والمؤسسات المالية بالسلطنة" : "Certified for commercial banks and corporate lending in Oman"}</span>
                          </div>
                        )}
                      </div>

                      {/* Right Detail List */}
                      <div className="lg:col-span-7 rounded-2xl border border-white/5 bg-white/[0.02] p-6 md:p-8">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-4">
                          {isAr ? "ما نقدمه في هذه الخدمة" : "Key Deliverables & Scope"}
                        </h3>
                        <ul className="space-y-4">
                          {service.points.map((pt, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-3">
                              <CheckCircle2 className="h-5 w-5 shrink-0 text-sky-400 mt-0.5" />
                              <span className="text-sm md:text-base text-slate-300 leading-relaxed">
                                {pt}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                          <Link
                            href={`/${locale}/contact/`}
                            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-sky-300 hover:text-white transition-colors"
                          >
                            <span>{isAr ? "طلب استشارة لهذه الخدمة" : "Request Consultation for this Practice"}</span>
                            <ArrowIcon className="h-4 w-4" />
                          </Link>

                          <Link
                            href={`/${locale}/projects/`}
                            className="text-xs text-slate-400 hover:text-sky-300 transition-colors"
                          >
                            {isAr ? "استعراض المشاريع المرتبطة" : "Browse Relevant Projects"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Global CTA Section */}
        <section className="border-t border-white/10 bg-slate-950 py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="rounded-3xl border border-sky-400/30 bg-gradient-to-r from-sky-950/40 via-slate-900 to-sky-950/40 p-8 md:p-12 text-center max-w-4xl mx-auto backdrop-blur-xl">
              <ShieldCheck className="mx-auto h-12 w-12 text-sky-400 mb-4" />
              <h3 className="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-outfit)]">
                {isAr ? "جاهزون لمساعدتك في تحقيق أهدافك العقارية" : "Ready to Advance Your Property Strategy?"}
              </h3>
              <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                {isAr
                  ? "تواصل مع خبرائنا في مسقط للحصول على استشارة متخصصة أو تقرير تقييم عقاري معتمد."
                  : "Connect with our advisory and valuation specialists in Muscat for bespoke counsel tailored to your investment objectives."}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href={`/${locale}/contact/`}
                  className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-7 py-3 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(56,189,248,0.35)] transition-all hover:shadow-[0_0_36px_rgba(56,189,248,0.55)]"
                >
                  {isAr ? "تواصل معنا الآن" : "Contact Our Advisory Team"}
                </Link>
                <Link
                  href={`/${locale}/about/`}
                  className="rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  {isAr ? "عن جاردن سيتي بروبرتيز" : "Learn About Our Company"}
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
