import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Contact from "@/components/Contact";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Compass,
  ArrowRight,
  ArrowLeft,
  Building,
} from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

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
    ? "تواصل معنا | شركة جاردن سيتي بروبرتيز مسقط"
    : "Contact Us | Garden City Properties Muscat Oman";

  const description = isAr
    ? "تواصل مع شركة جاردن سيتي بروبرتيز في مسقط. مكتب رقم 11، الموالح الشمالية. هاتف: 97300200 968+، بريد إلكتروني، وواتساب مباشر لاستشاراتك العقارية."
    : "Get in touch with Garden City Properties in Muscat, Oman. Office 11, Mawelah North. Tel: +968 97300200. Direct WhatsApp, phone, email, and property advisory enquiry.";

  const canonicalUrl = `${baseUrl}/${locale}/contact/`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-OM": `${baseUrl}/en/contact/`,
        "ar-OM": `${baseUrl}/ar/contact/`,
        "x-default": `${baseUrl}/en/contact/`,
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

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const baseUrl = "https://www.gardencityproperties.net";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", href: `/${locale}/` },
    { name: isAr ? "تواصل معنا" : "Contact Us", href: `/${locale}/contact/` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${baseUrl}/${locale}/contact/#webpage`,
        url: `${baseUrl}/${locale}/contact/`,
        name: isAr ? "تواصل معنا | جاردن سيتي بروبرتيز" : "Contact Us | Garden City Properties",
        description: isAr
          ? "صفحة التواصل مع شركة جاردن سيتي بروبرتيز وموقع المكتب في الموالح الشمالية، مسقط، سلطنة عمان."
          : "Contact directory and office location of Garden City Properties in Mawelah North, Muscat, Oman.",
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
        "@id": `${baseUrl}/${locale}/contact/#breadcrumbs`,
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
            name: isAr ? "تواصل معنا" : "Contact Us",
            item: `${baseUrl}/${locale}/contact/`,
          },
        ],
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#050816] text-slate-100">
      <Navbar />

      <Script
        id="contact-jsonld"
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
                {isAr ? "خدمة العملاء والاستشارات" : "Direct Advisory Desk"}
              </span>
              <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl rtl:font-[family-name:var(--font-cairo)]">
                {isAr ? (
                  <>
                    تواصل مع <span className="text-sky-400">فريقنا العقاري</span> في مسقط
                  </>
                ) : (
                  <>
                    Get In Touch with <span className="text-sky-400">Our Real Estate Team</span>
                  </>
                )}
              </h1>
              <p className="mt-6 text-base md:text-lg leading-relaxed text-slate-300">
                {isAr
                  ? "سواء كنت ترغب في شراء أو بيع عقار، أو تحتاج إلى تقييم عقاري معتمد لبنك أو مؤسسة تمويل، أو تبحث عن استشارة لإدارة محفظتك، يسعد فريقنا في الموالح الشمالية بتقديم الدعم الكامل."
                  : "Whether you are looking to acquire property, require bank-certified asset valuation, or seek strategic portfolio management in Oman, our advisory team in Mawelah North is ready to assist."}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Quick Details Grid */}
        <section className="py-12 border-b border-white/5 bg-slate-950/40">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Address */}
              <a
                href="https://maps.app.goo.gl/2hPDjkPfGt424wNA7?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={isAr ? "موقع المكتب على خرائط Google" : "Office Location on Google Maps"}
                className="group block rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md transition-all hover:border-[#d4af37]/60 hover:bg-slate-900/90 hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] cursor-pointer"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37] mb-4 transition-all group-hover:bg-[#d4af37]/20 group-hover:scale-105">
                  <MapPin size={22} />
                </div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-[family-name:var(--font-outfit)] transition-colors group-hover:text-[#d4af37]">
                  {isAr ? "الموقع والمكتب" : "Office Address"}
                </h3>
                <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed transition-colors group-hover:text-white">
                  {isAr
                    ? "مكتب رقم 11، ص.ب 275، الرمز البريدي 117، الموالح الشمالية، سلطنة عمان"
                    : "Office No 11, Po Box 275, Pc 117, Mawelah North, Sultanate Oman"}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4af37] transition-colors group-hover:text-amber-300">
                  <span>{isAr ? "عرض على خرائط Google" : "View on Google Maps"}</span>
                  <Compass className="h-3.5 w-3.5" />
                </span>
              </a>

              {/* Telephone */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/10 text-sky-400 mb-4">
                  <Phone size={22} />
                </div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-[family-name:var(--font-outfit)]">
                  {isAr ? "الهاتف المباشر" : "Direct Phone"}
                </h3>
                <p className="mt-2 text-xs md:text-sm text-slate-300">
                  <a href="tel:+96897300200" className="hover:text-sky-300 font-semibold transition-colors" dir="ltr">
                    +968 97300200
                  </a>
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {isAr ? "خدمة العملاء والاستفسارات" : "Client Enquiries & Support"}
                </p>
              </div>

              {/* Email */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/10 text-sky-400 mb-4">
                  <Mail size={22} />
                </div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-[family-name:var(--font-outfit)]">
                  {isAr ? "البريد الإلكتروني" : "Official Email"}
                </h3>
                <p className="mt-2 text-xs md:text-sm text-slate-300 truncate">
                  <a href="mailto:info@gardencityproperties.net" className="hover:text-sky-300 font-medium transition-colors">
                    info@gardencityproperties.net
                  </a>
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {isAr ? "استجابة سريعة لطلبات التقييم" : "Fast turnaround for mandates"}
                </p>
              </div>

              {/* Working Hours */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/10 text-sky-400 mb-4">
                  <Clock size={22} />
                </div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-[family-name:var(--font-outfit)]">
                  {isAr ? "ساعات العمل الرسمية" : "Business Hours"}
                </h3>
                <p className="mt-2 text-xs md:text-sm text-slate-300">
                  {isAr ? "الأحد – الخميس: 8:00 ص – 5:00 م" : "Sun – Thu: 8:00 AM – 5:00 PM"}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {isAr ? "الجمعة والسبت: عطلة أسبوعية" : "Friday & Saturday: Closed"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Existing Working Form Component */}
        <Contact />

        {/* Interactive Google Maps Embed Section */}
        <section className="py-16 border-t border-white/10 bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-semibold tracking-wider text-sky-400 uppercase">
                  {isAr ? "خريطة الموقع" : "Head Office Location"}
                </span>
                <h2 className="mt-1 text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-outfit)]">
                  {isAr ? "مقر الشركة في الموالح الشمالية، مسقط" : "Our Office in Mawelah North, Muscat"}
                </h2>
              </div>
              <a
                href="https://maps.app.goo.gl/2hPDjkPfGt424wNA7?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#d4af37] hover:bg-[#d4af37]/20 hover:border-[#d4af37]/70 transition-all shrink-0 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.15)]"
              >
                <Compass className="h-4 w-4" />
                <span>{isAr ? "فتح الموقع في خرائط Google" : "Open in Google Maps"}</span>
              </a>
            </div>

            <div className="relative h-96 w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
              <iframe
                title="Garden City Properties Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14624.97544062539!2d58.2467!3d23.6143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDM2JzUxLjUiTiA1OMKwMTUnMjQuMSJF!5e0!3m2!1sen!2som!4v1680000000000!5m2!1sen!2som"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full grayscale contrast-125 opacity-90"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
