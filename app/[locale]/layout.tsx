import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { LanguageProvider, type Language } from "@/context/LanguageContext";
import LanguageShell from "@/components/LanguageShell";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  const baseUrl = "https://www.gardencityproperties.net";

  const title = isAr
    ? "جاردن سيتي بروبرتيز | عقارات وتقييم أصول مسقط عمان"
    : "Garden City Properties | Real Estate & Valuation Muscat Oman";

  const description = isAr
    ? "استشارات عقارية رائدة وتقييم عقاري معتمد وخدمات وساطة موثوقة في مسقط، سلطنة عمان. نساعدك على تعظيم قيمة أصولك العقارية بنجاح."
    : "Premier real estate consultancy, certified property valuation, and brokerage services in Muscat, Sultanate of Oman. Maximize your asset value.";

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: isAr ? `${baseUrl}/ar/` : `${baseUrl}/en/`,
      languages: {
        "en-OM": `${baseUrl}/en/`,
        "ar-OM": `${baseUrl}/ar/`,
        "x-default": `${baseUrl}/`,
      },
    },
    openGraph: {
      title,
      description,
      url: isAr ? `${baseUrl}/ar/` : `${baseUrl}/en/`,
      type: "website",
      locale: isAr ? "ar_OM" : "en_OM",
      alternateLocale: [isAr ? "en_OM" : "ar_OM"],
      siteName: "Garden City Properties",
      images: [
        {
          url: "/Logo.jpeg",
          width: 1280,
          height: 532,
          alt: "Garden City Properties",
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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale !== "en" && locale !== "ar") {
    notFound();
  }

  const lang: Language = locale as Language;
  const isAr = lang === "ar";
  const baseUrl = "https://www.gardencityproperties.net";

  const localeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "RealEstateAgent", "LocalBusiness"],
        "@id": `${baseUrl}/#organization`,
        name: isAr ? "جاردن سيتي بروبرتيز" : "Garden City Properties",
        alternateName: isAr ? "Garden City Properties" : "جاردن سيتي بروبرتيز",
        url: `${baseUrl}/${locale}/`,
        logo: {
          "@type": "ImageObject",
          "@id": `${baseUrl}/#logo`,
          url: `${baseUrl}/Logo.jpeg`,
          caption: isAr ? "جاردن سيتي بروبرتيز" : "Garden City Properties",
        },
        image: `${baseUrl}/Logo.jpeg`,
        description: isAr
          ? "استشارات عقارية رائدة وتقييم عقاري معتمد وخدمات وساطة موثوقة في مسقط، سلطنة عمان. نساعدك على تعظيم قيمة أصولك العقارية بنجاح."
          : "Premier real estate consultancy, certified property valuation, and brokerage services in Muscat, Sultanate of Oman. Maximize your asset value.",
        telephone: "+96899190404",
        email: "info@gardencityproperties.net",
        priceRange: "$$",
        currenciesAccepted: "OMR",
        hasMap: "https://maps.app.goo.gl/SxfCYnRDrHg7BQjCA",
        geo: {
          "@type": "GeoCoordinates",
          latitude: 23.6143,
          longitude: 58.2567,
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: isAr ? "مكتب رقم 11، الموالح الشمالية" : "Office No 11, Mawelah North",
          addressLocality: isAr ? "مسقط" : "Muscat",
          addressRegion: isAr ? "محافظة مسقط" : "Muscat Governorate",
          addressCountry: "OM",
          postalCode: "117",
          postOfficeBoxNumber: "275",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+96899190404",
            contactType: "customer service",
            areaServed: "OM",
            availableLanguage: ["English", "Arabic"],
          },
        ],
        founder: {
          "@type": "Person",
          name: isAr ? "الفاضل محمد الحارثي" : "MOHAMED AL HARTHY",
          jobTitle: isAr ? "العضو المنتدب" : "Managing Director",
        },
        areaServed: {
          "@type": "Country",
          name: isAr ? "سلطنة عمان" : "Oman",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: `${baseUrl}/${locale}/`,
        name: isAr ? "جاردن سيتي بروبرتيز" : "Garden City Properties",
        alternateName: isAr ? "Garden City Properties" : "جاردن سيتي بروبرتيز",
        description: isAr
          ? "استشارات عقارية رائدة وتقييم عقاري معتمد وخدمات وساطة موثوقة في مسقط، سلطنة عمان."
          : "Premier real estate consultancy, certified property valuation, and brokerage services in Muscat, Sultanate of Oman.",
        publisher: {
          "@id": `${baseUrl}/#organization`,
        },
        inLanguage: isAr ? "ar-OM" : "en-OM",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/${locale}/?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <LanguageProvider initialLanguage={lang}>
      <LanguageShell locale={lang}>
        <script
          id={`json-ld-locale-${locale}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localeJsonLd),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.lang="${lang}";document.documentElement.dir="${isAr ? "rtl" : "ltr"}";`,
          }}
        />
        {children}
      </LanguageShell>
    </LanguageProvider>
  );
}
