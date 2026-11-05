import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import CoreValues from "@/components/CoreValues";
import Services from "@/components/Services";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import Leadership from "@/components/Leadership";
import Consultants from "@/components/Consultants";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  const baseUrl = "https://www.gardencityproperties.net";

  const title = isAr
    ? "جاردن سيتي بروبرتيز | عقارات فاخرة في مسقط عمان"
    : "Garden City Properties | Luxury Real Estate in Muscat";

  const description = isAr
    ? "استشارات عقارية رائدة وتقييم عقاري معتمد وخدمات وساطة موثوقة في مسقط، سلطنة عمان. نساعدك على تعظيم قيمة أصولك العقارية بنجاح."
    : "Premier real estate consultancy, certified property valuation, and brokerage services in Muscat, Sultanate of Oman. Maximize your asset value.";

  return {
    title: {
      absolute: title,
    },
    description,
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

export default function LocaleHomePage() {
  return (
    <div className="flex min-h-screen flex-col gap-0 m-0 p-0">
      {/* Gapless container ensuring Navbar and Hero sit completely flush */}
      <div className="w-full m-0 p-0">
        <Navbar />
        <Hero />
      </div>
      <main className="flex-1 m-0 p-0">
        <About />
        <ProjectsShowcase />
        <Services />
        <CoreValues />
        <Leadership />
        <Consultants />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
