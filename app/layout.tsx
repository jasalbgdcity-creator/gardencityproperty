/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import LanguageShell from "@/components/LanguageShell";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#050816",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default:
      "Garden City Properties | Trusted Real Estate & Property Consultants in Oman",
    template: "%s | Garden City Properties",
  },
  description:
    "Oman's leading real estate consultancy offering expert property valuation, brokerage, management, and quantity surveying. Maximize your asset value with Garden City Properties.",
  keywords: [
    "real estate Oman",
    "property valuation Oman",
    "property management Muscat",
    "real estate brokerage Muscat",
    "Garden City Properties",
    "investment opportunities Oman",
  ],
  authors: [{ name: "Garden City Properties" }],
  creator: "Garden City Properties",
  publisher: "Garden City Properties",
  metadataBase: new URL("https://www.gardencityproperties.net"),
  alternates: {
    canonical: "/en",
    languages: {
      "en-OM": "/en",
      "ar-OM": "/ar",
      "x-default": "/en",
    },
  },
  openGraph: {
    title:
      "Garden City Properties | Trusted Real Estate & Property Consultants in Oman",
    description:
      "Oman's leading real estate consultancy offering expert property valuation, brokerage, management, and quantity surveying. Maximize your asset value with Garden City Properties.",
    url: "https://www.gardencityproperties.net",
    type: "website",
    locale: "en_OM",
    alternateLocale: ["ar_OM"],
    siteName: "Garden City Properties",
    images: [
      {
        url: "/Logo.jpeg",
        width: 1280,
        height: 532,
        alt: "Garden City Properties | Trusted Real Estate & Property Consultants in Oman",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Garden City Properties | Trusted Real Estate & Property Consultants in Oman",
    description:
      "Oman's leading real estate consultancy offering expert property valuation, brokerage, management, and quantity surveying. Maximize your asset value with Garden City Properties.",
    images: ["/Logo.jpeg"],
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className="dark h-full antialiased"
    >
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="shortcut icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <Script
          id="json-ld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["RealEstateAgent", "LocalBusiness"],
              "name": "Garden City Properties",
              "url": "https://www.gardencityproperties.net",
              "image": "https://www.gardencityproperties.net/Logo.jpeg",
              "logo": "https://www.gardencityproperties.net/Logo.jpeg",
              "description": "Leading real estate consultancy and brokerage in Oman.",
              "telephone": "+96899190404",
              "email": "info@gardencityproperties.net",
              "priceRange": "$$",
              "currenciesAccepted": "OMR",
              "hasMap": "https://maps.app.goo.gl/SxfCYnRDrHg7BQjCA",
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 23.6143,
                "longitude": 58.2567,
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                  ],
                  "opens": "08:00",
                  "closes": "17:00",
                },
              ],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Office No 11, Mawelah North",
                "addressLocality": "Muscat",
                "addressCountry": "Oman",
                "postalCode": "117",
                "postOfficeBoxNumber": "275",
              },
              "founder": {
                "@type": "Person",
                "name": "Mohamed Al Harthy",
              },
              "areaServed": {
                "@type": "Country",
                "name": "Oman",
              },
            }),
          }}
        />
        <Script
          id="json-ld-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What real estate services does Garden City Properties provide in Oman?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Garden City Properties offers expert real estate brokerage, property management, property valuation, and quantity surveying across Oman.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "Where is Garden City Properties located?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our corporate office is located at Office No 11, Mawelah North, Muscat, Sultanate of Oman.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "Does Garden City Properties provide certified property valuations?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we are one of Oman's leading property valuation companies, approved by leading banks and financial institutions.",
                  },
                },
              ],
            }),
          }}
        />
        <Script
          id="theme-lang-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var lang = localStorage.getItem('gcp-language') || 'en';
                document.documentElement.lang = lang;
                document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
              } catch(e) {}
            })();`,
          }}
        />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground m-0 p-0">
        <LanguageShell>{children}</LanguageShell>
      </body>
    </html>
  );
}
