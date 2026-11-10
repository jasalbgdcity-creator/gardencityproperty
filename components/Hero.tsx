"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { dictionary } = useLanguage();
  const copy = dictionary.hero;
  const shouldReduceMotion = useReducedMotion();

  // Premium luxury easing curve
  const luxuryEase = [0.22, 1, 0.36, 1] as const;

  return (
    <section id="home" className="relative isolate min-h-[92vh] overflow-hidden m-0 -mt-[1px]">
      {/* Background Image Container with Cinematic Zoom */}
      <div className="absolute inset-0 z-0 bg-[#050816] overflow-hidden">
        <motion.div
          className="relative h-full w-full"
          initial={{ scale: shouldReduceMotion ? 1 : 1.07 }}
          animate={{ scale: 1 }}
          transition={{ duration: 7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/Oasis Fortress at Dusk.png"
            alt="Garden City Properties - Premium Real Estate Consultancy and Property Brokerage in Oman"
            fill
            priority={true}
            quality={90}
            sizes="100vw"
            className="object-cover object-[65%_center] md:object-center brightness-[0.92] contrast-[1.08]"
          />
        </motion.div>
      </div>

      {/* Refined Luxury Dark Overlays for Peak Legibility & Contrast */}
      <div className="absolute inset-0 z-0 bg-slate-950/35" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/20 rtl:bg-gradient-to-l" />
      <div className="absolute inset-x-0 top-0 z-0 h-32 bg-gradient-to-b from-slate-950/80 via-slate-950/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-0 h-32 bg-gradient-to-t from-[#050816] via-[#050816]/70 to-transparent" />

      {/* Foreground Content */}
      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 py-24 sm:py-28 md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: luxuryEase }}
          className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-sky-300 uppercase backdrop-blur-md rtl:tracking-normal rtl:font-[family-name:var(--font-cairo)]"
        >
          {copy.badge}
        </motion.p>
        <h1 className="max-w-4xl font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.12] tracking-normal sm:tracking-tight text-white drop-shadow-md rtl:font-[family-name:var(--font-cairo)] rtl:leading-snug rtl:tracking-normal rtl:font-bold">
          <span className="inline-block animate-hero-title">
            {copy.title}
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: luxuryEase }}
          className="mt-6 max-w-2xl font-sans text-base sm:text-lg lg:text-xl leading-relaxed text-slate-200/90 font-normal rtl:font-[family-name:var(--font-cairo)]"
        >
          {copy.subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.34, ease: luxuryEase }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <motion.a
            href="#projects"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(56,189,248,0.4)] transition hover:shadow-[0_0_40px_rgba(56,189,248,0.55)]"
          >
            {copy.explore}
            <ArrowRight size={16} className="rtl:rotate-180" />
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center rounded-full border border-sky-400/40 bg-white/5 px-7 py-3.5 text-sm font-semibold text-sky-200 backdrop-blur-md transition hover:border-sky-300/70 hover:bg-white/10"
          >
            {copy.contact}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
