"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

export type Language = "en" | "ar";

const dictionaries = {
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      services: "Services",
      projects: "Showcase",
      contact: "Contact",
      getStarted: "Get Started",
    },
    hero: {
      badge: "Oman · Consultancy · Assets",
      title: "Garden City Propeties\nYour Trusted Partner In Real Estate Brokerage In Oman.",
      subtitle:
        "•property sales •Expert valuation's •Smarter Investments.",
      explore: "Explore Services",
      contact: "Contact Us",
    },
    about: {
      eyebrow: "About Us",
      title: "GARDEN CITY PROPERTIES",
      body: "Established in 2007, one of Oman’s trusted names in real estate brokerage, valuation and consultancy, backed by a multidisciplinary team of engineers, surveyors, and property specialists.",
      stats: [
        { value: "Oman", label: "Market focus" },
        { value: "360°", label: "Asset advisory" },
        { value: "Bespoke", label: "Client solutions" },
      ],
      principleLabel: "Operating principle",
      principle:
        "Maximize asset value with disciplined, client-first execution.",
      leadershipEyebrow: "Management",
      leadershipTitle: "Leadership",
      managingDirector: "Managing Director",
      generalManager: "General Manager",
      leaders: [
        {
          src: "/MD.PNG",
          name: "MOHAMED AL HARTHY",
          title: "Managing Director",
          bio: (
            <>
              <p>The Founder and Managing Director of GARDEN CITY PROPERTIES Oman, I bring approximately 18 years of extensive professional experience in real estate brokerage, property management, asset valuation, and quantity surveying.</p>
              <p>Drawing on nearly two decades of industry expertise and an in-depth understanding of the Omani real estate market, I founded Garden City Properties with a vision to deliver comprehensive, innovative, and reliable real estate solutions. My focus is on identifying strategic investment opportunities, maximising property value, and providing tailored services that meet the needs of individuals, investors, businesses, and financial institutions.</p>
              <p>Driven by professionalism, integrity, and a commitment to excellence, I strive to build lasting client relationships and establish Garden City Properties as a trusted name in Oman&apos;s real estate sector, creating sustainable long-term value for our clients and partners.</p>
            </>
          ),
          email: "info@gardencityproperties.net",
          phone: "+968 97300200",
          phoneHref: "tel:+96897300200",
          whatsappHref: "https://wa.me/message/ZL2BXWHCXFCXN1",
        },
        {
          src: "/GM.jpeg",
          name: "ADAM AL HARTHY",
          title: "General Manager",
          bio: (
            <>
              <p>As the General Manager of GARDEN CITY PROPERTIES Oman, I oversee the daily operations and strategic execution across our core divisions, ensuring seamless delivery in property management, brokerage, and asset valuation.</p>
              <p>With a strong foundation in the Omani property market, my focus is on translating our corporate vision into measurable success for our clients. I lead our dedicated team in implementing innovative solutions and operational best practices, ensuring that every transaction is handled with precision, transparency, and a deep commitment to maximizing returns for our diverse portfolio of investors.</p>
              <p>Dedicated to fostering robust client relationships and upholding our standard of excellence, I work closely with our partners to navigate the evolving real estate landscape. My goal is to consistently exceed expectations and deliver sustainable growth across our entire portfolio.</p>
            </>
          ),
          email: "info@gardencityproperties.net",
          phone: "+968 77304446",
          phoneHref: "tel:+96877304446",
          whatsappHref: "https://wa.me/message/7HZWGQYG6I5GC1",
        },
      ],
    },
    services: {
      eyebrow: "Our Services",
      title: "",
      subtitle:
        "A consultancy-led suite designed for owners, investors, developers, and corporate occupiers.",
      core: "Core practice",
      items: [
        {
          title: "Property Consultant",
          description: [
            "Independent advisory for acquisitions, disposals, and portfolio strategy across Oman’s residential and commercial markets.",
          ],
        },
        {
          title: "Real Estate Brokerage",
          description: [
            "Connecting buyers and sellers with the right property opportunities.",
            "Professional support in buying, selling, and leasing properties across Oman.",
            "Your trusted partner for smooth and successful property transactions.",
          ],
        },
        {
          title: "Property Management",
          description: [
            "Professional management of residential and commercial properties.",
            "We handle tenant relations, rent collection, maintenance, and daily operations.",
            "Protecting your property value while maximising returns on your investment.",
          ],
        },
        {
          title: "Property Valuation",
          description: [
            "One of Oman’s leading property valuation companies.",
            "Approved by leading banks and financial institutions.",
            "Trusted expertise and reliable property valuations.",
          ],
        },
        {
          title: "Quantity Surveying",
          description: [
            "Professional quantity surveying services for residential and commercial buildings.",
            "Expert cost estimation, budgeting, and material measurement.",
            "Helping clients manage construction costs efficiently and accurately.",
          ],
        },
      ],
    },
    projects: {
      eyebrow: "Portfolio",
      title: "Showcase of Our Projects",
      subtitle:
        "Explore our exclusive portfolio of premium properties and strategic developments.",
      getDetails: "Get More Details",
      paymentPlan: "Payment Plan",
      startingArea: "Starting Area",
      developer: "Developer",
      loading: "Loading projects…",
      empty: "No projects are listed at the moment.",
      error: "Projects could not be loaded. Please try again shortly.",
      whatsapp: "Chat on WhatsApp",
    },
    contact: {
      eyebrow: "Contact",
      title: "Start a conversation.",
      subtitle:
        "Share a brief on your property, investment, or development mandate and our consultants will follow up.",
      name: "Name",
      namePlaceholder: "Your full name",
      email: "Email",
      phone: "Phone",
      message: "Message",
      messagePlaceholder: "Tell us about the property or mandate.",
      send: "Send enquiry",
      thanks: "Thank you. Your enquiry has been recorded in this session.",
      direct: "Direct lines",
      directBody:
        "Reach the GardencityProperties desk for consultancy, brokerage, and asset mandates in Oman.",
      location: "Muscat · Sultanate of Oman",
    },
    footer: {
      rights: "All rights reserved.",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      services: "خدماتنا",
      projects: "المشاريع",
      contact: "تواصل معنا",
      getStarted: "ابدأ الآن",
    },
    hero: {
      badge: "عمان · استشارات · أصول",
      title: "مستشارك العقاري وشريكك الموثوق في سلطنة عمان",
      subtitle:
        "نقدم حلولاً مهنية وموثوقة ومخصصة لتعظيم قيمة أصولك.",
      explore: "استكشف الخدمات",
      contact: "تواصل معنا",
    },
    about: {
      eyebrow: "من نحن",
      title: "استشارات عقارية بمعايير احترافية لسوق دقيق.",
      body: "جاردن سيتي بروبرتيز شركة استشارات عقارية موثوقة في سلطنة عمان. نلتزم بتقديم حلول مهنية وموثوقة ومخصصة تلبي احتياجات ملاك العقارات والمستثمرين والمطورين والعملاء من الشركات.",
      stats: [
        { value: "عمان", label: "تركيز السوق" },
        { value: "360°", label: "استشارات الأصول" },
        { value: "مخصص", label: "حلول العملاء" },
      ],
      principleLabel: "مبدأ العمل",
      principle: "تعظيم قيمة الأصول بتنفيذ منضبط يضع العميل أولاً.",
      leadershipEyebrow: "الإدارة",
      leadershipTitle: "فريق القيادة",
      managingDirector: "العضو المنتدب",
      generalManager: "المدير العام",
      leaders: [
        {
          src: "/MD.PNG",
          name: "الفاضل محمد الحارثي",
          title: "العضو المنتدب",
          bio: (
            <>
              <p>بصفتي العضو المنتدب ومؤسس شركة جاردن سيتي بروبرتيز عمان، أقدم خبرة واسعة في الوساطة العقارية، وإدارة العقارات، وتقييم الأصول، ومسح الكميات تمتد لنحو 18 عاماً.</p>
              <p>وبفضل الرؤية الاستراتيجية والفهم العميق لسوق العقارات العماني، أسست الشركة بهدف تقديم حلول عقارية شاملة ومبتكرة وموثوقة، مع التركيز على اقتناص الفرص الاستثمارية الواعدة وتعظيم قيمة الأصول وتقديم خدمات مخصصة تلبي متطلبات الأفراد والمستثمرين والشركات والمؤسسات المالية.</p>
              <p>إن التزامي الراسخ بالمهنية والنزاهة والتميز يدفعني لبناء شراكات وثيقة ومستدامة، وترسيخ اسم جاردن سيتي بروبرتيز كشريك عقاري موثوق في سلطنة عمان يحقق قيمة حقيقية وطويلة الأجل.</p>
            </>
          ),
          email: "info@gardencityproperties.net",
          phone: "+968 97300200",
          phoneHref: "tel:+96897300200",
          whatsappHref: "https://wa.me/message/ZL2BXWHCXFCXN1",
        },
        {
          src: "/GM.jpeg",
          name: "الفاضل آدم الحارثي",
          title: "المدير العام",
          bio: (
            <>
              <p>بصفتي المدير العام لشركة جاردن سيتي بروبرتيز عمان، أتولى الإشراف على العمليات اليومية والتنفيذ الاستراتيجي عبر قطاعاتنا الحيوية، لضمان أعلى درجات الكفاءة في إدارة العقارات والوساطة وتقييم الأصول.</p>
              <p>انطلاقاً من دراية عميقة بسوق العقارات العماني، أركز على ترجمة رؤيتنا المؤسسية إلى نجاحات ملموسة لعملائنا، حيث أقود فريقنا المتخصص لتطبيق حلول مبتكرة وأفضل الممارسات التشغيلية، مع إدارة كل معاملة بدقة وشفافية لتعظيم العوائد لمستثمرينا.</p>
              <p>ملتزمون بترسيخ علاقات وطيدة مع العملاء ومواصلة التميز، وأعمل بالتعاون مع شركائنا لمواكبة تطورات المشهد العقاري، بهدف تجاوز التوقعات وتحقيق نمو مستدام ومستمر لمحفظتنا الاستثمارية.</p>
            </>
          ),
          email: "info@gardencityproperties.net",
          phone: "+968 77304446",
          phoneHref: "tel:+96877304446",
          whatsappHref: "https://wa.me/message/7HZWGQYG6I5GC1",
        },
      ],
    },
    services: {
      eyebrow: "خدماتنا",
      title: "",
      subtitle:
        "مجموعة استشارية مصممة للملاك والمستثمرين والمطورين والشركات المستأجرة.",
      core: "الممارسة الأساسية",
      items: [
        {
          title: "الاستشارات العقارية",
          description:
            "استشارات مستقلة للاستحواذ والتصرف واستراتيجية المحفظة عبر الأسواق السكنية والتجارية في عمان.",
        },
        {
          title: "الوساطة العقارية",
          description:
            "وساطة راقية وسرية تربط المشترين والبائعين والمستأجرين المؤهلين بالفرص المناسبة.",
        },
        {
          title: "إدارة العقارات",
          description:
            "إشراف تشغيلي يحمي العائد وتجربة المستأجر والحالة طويلة الأمد لأصولك.",
        },
        {
          title: "تقييم العقارات",
          description:
            "تقييمات موثوقة للاستثمار والتمويل والتقارير المؤسسية استناداً إلى معرفة السوق المحلية.",
        },
        {
          title: "مسح الكميات",
          description:
            "تخطيط التكاليف ودعم التوريد والرقابة التجارية لبرامج التطوير والتشطيب.",
        },
      ],
    },
    projects: {
      eyebrow: "محفظة المشاريع",
      title: "عرض المشاريع",
      subtitle:
        "استكشف محفظتنا الحصرية من العقارات المتميزة والمشاريع الاستراتيجية.",
      getDetails: "المزيد من التفاصيل",
      paymentPlan: "خطة السداد",
      startingArea: "المساحة الابتدائية",
      developer: "المطور",
      loading: "جاري تحميل المشاريع…",
      empty: "لا توجد مشاريع معروضة حالياً.",
      error: "تعذر تحميل المشاريع. يرجى المحاولة بعد قليل.",
      whatsapp: "تواصل عبر واتساب",
    },
    contact: {
      eyebrow: "تواصل",
      title: "ابدأ محادثة.",
      subtitle:
        "أرسل موجزاً عن عقارك أو استثمارك أو مشروع التطوير وسيتواصل معك مستشارونا.",
      name: "الاسم",
      namePlaceholder: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      message: "الرسالة",
      messagePlaceholder: "أخبرنا عن العقار أو المهمة.",
      send: "إرسال الاستفسار",
      thanks: "شكراً لك. تم تسجيل استفسارك في هذه الجلسة.",
      direct: "خطوط مباشرة",
      directBody:
        "تواصل مع مكتب جاردن سيتي بروبرتيز للاستشارات والوساطة وإدارة الأصول في عمان.",
      location: "مسقط · سلطنة عمان",
    },
    footer: {
      rights: "جميع الحقوق محفوظة.",
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Language];

type LanguageContextValue = {
  language: Language;
  dir: "ltr" | "rtl";
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  dictionary: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const router = useRouter();
  const pathname = usePathname() || "";
  const [manualLang, setManualLang] = useState<Language | null>(null);

  // Derive language dynamically from URL pathname with fallback to manual/initial state
  const language: Language = useMemo(() => {
    if (pathname.startsWith("/ar")) return "ar";
    if (pathname.startsWith("/en")) return "en";
    if (manualLang) return manualLang;
    if (initialLanguage) return initialLanguage;
    return "en";
  }, [pathname, manualLang, initialLanguage]);

  useEffect(() => {
    try {
      const html = document.documentElement;
      html.lang = language;
      html.dir = language === "ar" ? "rtl" : "ltr";
      window.localStorage.setItem("gcp-language", language);
    } catch {
      // Ignore in SSR
    }
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setManualLang(next);
  }, []);

  const toggleLanguage = useCallback(() => {
    const next = language === "en" ? "ar" : "en";
    setManualLang(next);
    try {
      window.localStorage.setItem("gcp-language", next);
    } catch {
      // Ignore
    }
    let newPath = pathname;
    if (pathname.startsWith("/ar")) {
      newPath = pathname.replace(/^\/ar/, "/en") || "/en";
    } else if (pathname.startsWith("/en")) {
      newPath = pathname.replace(/^\/en/, "/ar") || "/ar";
    } else {
      newPath = `/${next}`;
    }
    router.push(newPath);
  }, [language, pathname, router]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      dir: language === "ar" ? "rtl" : "ltr",
      setLanguage,
      toggleLanguage,
      dictionary: dictionaries[language],
    }),
    [language, setLanguage, toggleLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
