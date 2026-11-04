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

  return {
    title: isAr
      ? "جاردن سيتي بروبرتيز | عقارات وتقييم أصول مسقط عمان"
      : "Garden City Properties | Real Estate & Valuation Muscat Oman",
    description: isAr
      ? "استشارات عقارية رائدة وتقييم عقاري معتمد وخدمات وساطة في مسقط، سلطنة عمان. تعظيم قيمة أصولك العقارية."
      : "Premier real estate consultancy, certified property valuation, and brokerage services in Muscat, Sultanate of Oman. Maximize your asset value.",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: isAr ? `${baseUrl}/ar` : `${baseUrl}/en`,
      languages: {
        "en-OM": `${baseUrl}/en`,
        "ar-OM": `${baseUrl}/ar`,
        "x-default": `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: isAr
        ? "جاردن سيتي بروبرتيز | عقارات وتقييم أصول مسقط عمان"
        : "Garden City Properties | Real Estate & Valuation Muscat Oman",
      description: isAr
        ? "استشارات عقارية رائدة وتقييم عقاري معتمد وخدمات وساطة في مسقط، سلطنة عمان. تعظيم قيمة أصولك العقارية."
        : "Premier real estate consultancy, certified property valuation, and brokerage services in Muscat, Sultanate of Oman. Maximize your asset value.",
      url: isAr ? `${baseUrl}/ar` : `${baseUrl}/en`,
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
      title: isAr
        ? "جاردن سيتي بروبرتيز | عقارات وتقييم أصول مسقط عمان"
        : "Garden City Properties | Real Estate & Valuation Muscat Oman",
      description: isAr
        ? "استشارات عقارية رائدة وتقييم عقاري معتمد وخدمات وساطة في مسقط، سلطنة عمان. تعظيم قيمة أصولك العقارية."
        : "Premier real estate consultancy, certified property valuation, and brokerage services in Muscat, Sultanate of Oman. Maximize your asset value.",
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

  return (
    <LanguageProvider initialLanguage={lang}>
      <LanguageShell locale={lang}>
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
