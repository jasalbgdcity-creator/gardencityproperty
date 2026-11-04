"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { dictionary } = useLanguage();
  const copy = dictionary.hero;

  return (
    <section id="home" className="relative isolate min-h-[92vh] overflow-hidden m-0 -mt-[1px]">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 bg-[#050816]">
        <Image
          src="/bg1stpage.jpeg"
          alt="Garden City Properties - Premium Real Estate Consultancy and Property Brokerage in Oman"
          fill
          priority={true}
          quality={100}
          sizes="100vw"
          className="object-cover object-center brightness-110 contrast-125"
        />
      </div>

      {/* Refined Directional Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-950/90 via-slate-900/50 to-transparent rtl:bg-gradient-to-l" />
      <div className="absolute inset-x-0 bottom-0 z-0 h-28 bg-gradient-to-t from-[#050816] to-transparent" />

      {/* Foreground Content */}
      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 py-24 sm:py-28 md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-sky-300 uppercase backdrop-blur-md"
        >
          {copy.badge}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl font-[family-name:var(--font-outfit)] text-4xl leading-tight font-semibold text-white sm:text-5xl lg:text-6xl"
        >
          {copy.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300"
        >
          {copy.subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href="#projects"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(56,189,248,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(56,189,248,0.55)]"
          >
            {copy.explore}
            <ArrowRight size={16} className="rtl:rotate-180" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full border border-sky-400/40 bg-white/5 px-7 py-3.5 text-sm font-semibold text-sky-200 backdrop-blur-md transition hover:border-sky-300/70 hover:bg-white/10"
          >
            {copy.contact}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
