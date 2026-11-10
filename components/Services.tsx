"use client";

import { motion } from "framer-motion";
import {
  BadgeDollarSign,
  Building2,
  Handshake,
  KeyRound,
  Ruler,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const icons: LucideIcon[] = [
  Building2,
  Handshake,
  KeyRound,
  BadgeDollarSign,
  Ruler,
];

export default function Services() {
  const { dictionary } = useLanguage();
  const copy = dictionary.services;

  return (
    <section id="services" className="scroll-mt-24 border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.28em] text-sky-400 uppercase">
            {copy.eyebrow}
          </p>
          {copy.title ? (
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl rtl:font-[family-name:var(--font-cairo)] rtl:tracking-normal rtl:font-bold">
              {copy.title}
            </h2>
          ) : null}
          <p className={`${copy.title ? "mt-4" : "mt-3"} text-slate-400`}>{copy.subtitle}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {copy.items.map((service, index) => {
            const Icon = icons[index];
            const isList = Array.isArray(service.description);

            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-sky-400/50 hover:shadow-[0_0_32px_rgba(56,189,248,0.2)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 text-sky-300 transition-colors group-hover:border-sky-400/40 group-hover:text-cyan-200">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 font-[family-name:var(--font-outfit)] text-xl font-semibold text-white">
                  {service.title}
                </h3>

                <div className="mt-4 flex flex-1 flex-col justify-start">
                  {isList ? (
                    <ul className="flex flex-col gap-3">
                      {(service.description as unknown as string[]).map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm leading-relaxed text-slate-300"
                        >
                          <svg
                            className="mt-0.5 h-4 w-4 shrink-0 text-sky-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm leading-relaxed text-slate-300">
                      {service.description as string}
                    </p>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
