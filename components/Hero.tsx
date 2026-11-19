"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { dictionary, language } = useLanguage();
  const copy = dictionary.hero;
  const isAr = language === "ar";
  const shouldReduceMotion = useReducedMotion();

  // Premium luxury easing curve
  const luxuryEase = [0.22, 1, 0.36, 1] as const;

  const whyInvestLeft = isAr
    ? [
        { num: "01", title: "الاستقرار السياسي والأمني" },
        { num: "02", title: "اقتصاد متنامٍ" },
        { num: "03", title: "رؤية عُمان 2040" },
        { num: "04", title: "التملك الحر" },
        { num: "05", title: "نمو رأس المال" },
      ]
    : [
        { num: "01", title: "Political Stability & Security" },
        { num: "02", title: "Growing Economy" },
        { num: "03", title: "Oman Vision 2040" },
        { num: "04", title: "Freehold Ownership" },
        { num: "05", title: "Capital Appreciation" },
      ];

  const whyInvestRight = isAr
    ? [
        { num: "06", title: "عوائد إيجارية مجزية" },
        { num: "07", title: "مدن المستقبل" },
        { num: "08", title: "موقع استراتيجي" },
        { num: "09", title: "جودة الحياة" },
        { num: "10", title: "فرص استثمارية متنوعة" },
      ]
    : [
        { num: "06", title: "Rental Returns" },
        { num: "07", title: "Future Cities" },
        { num: "08", title: "Strategic Location" },
        { num: "09", title: "Quality of Life" },
        { num: "10", title: "Diverse Investment Opportunities" },
      ];

  return (
    <section
      id="home"
      className="relative isolate min-h-[92vh] overflow-hidden m-0 -mt-[1px] bg-[#050816]"
    >
      {/* Background Image - Next.js Image positioned right behind hero and section content */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/Mainbg.jpeg"
          alt="Garden City Properties - Premium Real Estate Consultancy and Property Brokerage in Oman"
          fill
          priority={true}
          quality={95}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, (max-width: 1920px) 100vw, 100vw"
          className="object-cover object-center brightness-105 contrast-[1.02]"
        />
        {/* Soft, uniform background tint so sunset and cliffside view remains bright and clear */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-24 md:pb-16 md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: luxuryEase }}
          className="mb-3 sm:mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-slate-950/60 px-3.5 py-1 text-xs font-semibold tracking-[0.2em] text-sky-300 uppercase backdrop-blur-md shadow-lg rtl:tracking-normal rtl:font-[family-name:var(--font-cairo)]"
        >
          {copy.badge}
        </motion.p>
        <h1 className="max-w-4xl font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.14] tracking-normal sm:tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] rtl:font-[family-name:var(--font-cairo)] rtl:leading-snug rtl:tracking-normal rtl:font-bold">
          <span className="inline-block animate-hero-title">
            {copy.title}
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: luxuryEase }}
          className="mt-3 max-w-2xl font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-slate-100 font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] rtl:font-[family-name:var(--font-cairo)]"
        >
          {copy.subtitle}
        </motion.p>

        {/* Why Invest in Oman Section (Two-Column Grid Layout with Translucent Glassmorphism) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: luxuryEase }}
          className="my-5 sm:my-6 max-w-4xl rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/40 p-4 sm:p-5 sm:px-6 backdrop-blur-md shadow-2xl"
        >
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-0.5 text-[10px] sm:text-[11px] font-semibold tracking-wider text-sky-300 uppercase rtl:tracking-normal rtl:font-[family-name:var(--font-cairo)]">
              {isAr ? "الفرص العقارية الاستثمارية" : "Strategic Potential"}
            </span>
          </div>

          <h2 className="mt-2 font-serif text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white rtl:font-[family-name:var(--font-cairo)]">
            {isAr ? "لماذا الاستثمار في عُمان؟" : "Why Invest in Oman"}
          </h2>

          <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
            {/* Left Column (Points 1–5) */}
            <div className="flex flex-col gap-2 sm:gap-2.5">
              {whyInvestLeft.map((point) => (
                <div
                  key={point.num}
                  className="group flex items-center gap-2.5 sm:gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm transition-all duration-300 hover:border-sky-400/40 hover:bg-white/10 hover:shadow-[0_4px_20px_rgba(56,189,248,0.15)]"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 border border-sky-400/30 text-[11px] font-bold text-sky-300 transition-colors duration-300 group-hover:bg-sky-500/25 group-hover:border-sky-400/50">
                    {point.num}
                  </span>
                  <h3 className="text-xs sm:text-[13px] font-bold text-white tracking-wide drop-shadow-sm rtl:font-[family-name:var(--font-cairo)]">
                    {point.title}
                  </h3>
                </div>
              ))}
            </div>

            {/* Right Column (Points 6–10) */}
            <div className="flex flex-col gap-2.5 sm:gap-2.5">
              {whyInvestRight.map((point) => (
                <div
                  key={point.num}
                  className="group flex items-center gap-2.5 sm:gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm transition-all duration-300 hover:border-sky-400/40 hover:bg-white/10 hover:shadow-[0_4px_20px_rgba(56,189,248,0.15)]"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 border border-sky-400/30 text-[11px] font-bold text-sky-300 transition-colors duration-300 group-hover:bg-sky-500/25 group-hover:border-sky-400/50">
                    {point.num}
                  </span>
                  <h3 className="text-xs sm:text-[13px] font-bold text-white tracking-wide drop-shadow-sm rtl:font-[family-name:var(--font-cairo)]">
                    {point.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Closing Summary Block */}
          <div className="mt-3.5 rounded-xl border border-sky-400/30 bg-gradient-to-r from-sky-500/15 via-cyan-500/10 to-white/5 p-3 sm:p-3.5 text-center sm:text-start backdrop-blur-sm">
            <p className="font-[family-name:var(--font-outfit)] text-xs font-extrabold tracking-wider text-sky-200 uppercase rtl:font-[family-name:var(--font-cairo)]">
              {isAr
                ? "استثمر في عُمان اليوم.. وامتلك جزءاً من المستقبل."
                : "INVEST IN OMAN TODAY. OWN A PART OF TOMORROW."}
            </p>
            <p className="mt-0.5 text-xs text-slate-200/90 leading-relaxed rtl:font-[family-name:var(--font-cairo)]">
              {isAr
                ? "عُمان ليست مجرد مكان لشراء عقار؛ بل هي فرصة للاستثمار في اقتصاد واعد ومستقبل طموح."
                : "Oman is more than a place to buy property; it is an opportunity to invest in a growing economy and an ambitious future."}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.34, ease: luxuryEase }}
          className="mt-4 sm:mt-5 flex flex-col gap-3.5 sm:flex-row"
        >
          <motion.a
            href="#projects"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(56,189,248,0.4)] transition hover:shadow-[0_0_40px_rgba(56,189,248,0.55)]"
          >
            {copy.explore}
            <ArrowRight size={16} className="rtl:rotate-180" />
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center rounded-full border border-sky-400/40 bg-white/5 px-6 py-3 text-sm font-semibold text-sky-200 backdrop-blur-md transition hover:border-sky-300/70 hover:bg-white/10"
          >
            {copy.contact}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
