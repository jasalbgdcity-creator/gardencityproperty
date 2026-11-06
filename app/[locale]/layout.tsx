import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { notFound } from "next/navigation";
import { LanguageProvider, type Language } from "@/context/LanguageContext";
import LanguageShell from "@/components/LanguageShell";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

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

  const titleText = isAr
    ? "جاردن سيتي بروبرتيز | عقارات فاخرة في مسقط عمان"
    : "Garden City Properties | Luxury Real Estate in Muscat";

  const description = isAr
    ? "استشارات عقارية رائدة وتقييم عقاري معتمد وخدمات وساطة موثوقة في مسقط، سلطنة عمان. نساعدك على تعظيم قيمة أصولك العقارية بنجاح."
    : "Premier real estate consultancy, certified property valuation, and brokerage services in Muscat, Sultanate of Oman. Maximize your asset value.";

  return {
    title: {
      default: titleText,
      template: isAr ? "%s | جاردن سيتي بروبرتيز" : "%s | Garden City Properties",
      absolute: titleText,
    },
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
      title: titleText,
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
          alt: titleText,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description,
      images: ["/Logo.jpeg"],
    },
    other: {
      "content-language": isAr ? "ar-OM, ar" : "en-OM, en",
      language: isAr ? "Arabic" : "English",
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
      <meta httpEquiv="content-language" content={isAr ? "ar-OM, ar" : "en-OM, en"} />
      <meta name="language" content={isAr ? "Arabic" : "English"} />
      <Script
        id={`json-ld-locale-${locale}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localeJsonLd),
        }}
      />
      <LanguageShell locale={lang}>
        {children}
        <FloatingWhatsApp />
      </LanguageShell>
    </LanguageProvider>
  );
}
