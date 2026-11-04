"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const quickLinks = [
    { href: `/${language}#home`, label: isAr ? "الرئيسية" : "Home" },
    { href: `/${language}#about`, label: isAr ? "من نحن" : "About Us" },
    { href: `/${language}#services`, label: isAr ? "خدماتنا" : "Services" },
    { href: `/${language}#projects`, label: isAr ? "المشاريع" : "Showcase" },
    { href: `/${language}#contact`, label: isAr ? "تواصل معنا" : "Contact Us" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/share/p/1DPo6XZnmB/",
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/gardencity.llc?vrfl=MXA4dmpqbnloeWIzMw==",
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@gardencityin?si=ldgdEsv7imiEtQGa",
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 9v6l5.194-3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#050816]/95 py-16 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Main 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          {/* COLUMN 1: BRAND & ABOUT */}
          <div className="flex flex-col items-start">
            <Link href={`/${language}#home`} className="inline-block focus:outline-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Logo.jpeg"
                alt="Garden City Properties - Real Estate Consultancy & Brokerage in Oman"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
              {isAr
                ? "جاردن سيتي بروبرتيز هي شركة استشارات عقارية رائدة في سلطنة عمان، تقدم خدمات وساطة وتقييم وإدارة أصول متخصصة لمساعدة العملاء على تحقيق أهدافهم العقارية."
                : "Garden City Properties is a premier real estate consultancy in Oman, offering expert brokerage, valuation, and management services to help clients achieve their property goals."}
            </p>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div>
            <h3 className="mb-4 font-[family-name:var(--font-outfit)] text-base font-semibold tracking-wide text-white">
              {isAr ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 transition-colors hover:text-sky-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: GET IN TOUCH */}
          <div>
            <h3 className="mb-4 font-[family-name:var(--font-outfit)] text-base font-semibold tracking-wide text-white">
              {isAr ? "تواصل معنا" : "Get In Touch"}
            </h3>
            <div className="space-y-3 text-sm text-slate-400">
              <a
                href="https://maps.app.goo.gl/SxfCYnRDrHg7BQjCA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 transition-colors hover:text-sky-400"
              >
                <MapPin className="h-4 w-4 shrink-0 text-sky-400 mt-0.5" />
                <span className="leading-snug break-words">
                  Office No 11, Po Box 275, Pc 117, Mawelah North, Sultanate Oman
                </span>
              </a>

              <a
                href="tel:+96899190404"
                className="flex items-center gap-3 transition-colors hover:text-sky-400"
              >
                <Phone className="h-4 w-4 shrink-0 text-sky-400" />
                <span dir="ltr">+968 99190404</span>
              </a>

              <a
                href="mailto:info@gardencityproperties.net"
                className="flex items-center gap-3 transition-colors hover:text-sky-400"
              >
                <Mail className="h-4 w-4 shrink-0 text-sky-400" />
                <span>info@gardencityproperties.net</span>
              </a>
            </div>

            {/* Social Media Row */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-400/50 hover:bg-sky-400/15 hover:text-sky-300 hover:shadow-[0_0_16px_rgba(56,189,248,0.25)]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div className="mt-12 border-t border-gray-800/50 pt-8 text-center text-xs text-slate-500">
          <p>© 2026 Garden City Properties. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
        </div>
      </div>
    </footer>
  );
}
