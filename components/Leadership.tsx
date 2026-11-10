"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Leadership() {
  const { dictionary } = useLanguage();
  const copy = dictionary.about;

  return (
    <section id="leadership" className="scroll-mt-24 border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.28em] text-sky-400 uppercase">
            {copy.leadershipEyebrow}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl rtl:font-[family-name:var(--font-cairo)] rtl:tracking-normal rtl:font-bold">
            {copy.leadershipTitle}
          </h2>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 items-stretch">
          {copy.leaders.map((leader, index) => {
            const isGM =
              leader.title.toLowerCase().includes("general manager") ||
              leader.title.includes("المدير العام") ||
              leader.src.includes("GM");
            const imageSrc = isGM ? "/GM.jpeg" : leader.src || "/MD.jpeg";

            return (
              <motion.article
                key={imageSrc}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col h-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl transition-all duration-300 hover:border-sky-400/50 hover:shadow-[0_0_36px_rgba(56,189,248,0.18)]"
              >
                {/* Leader Portrait */}
                <div className="relative h-80 w-full shrink-0 overflow-hidden bg-slate-950 sm:h-96">
                  {isGM ? (
                    <Image
                      src="/GM.jpeg"
                      alt={`${leader.name} - General Manager of Garden City Properties Oman`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                      quality={95}
                      priority
                      loading="eager"
                      className="object-cover object-[center_top] transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <Image
                      src="/MD.jpeg"
                      alt={`${leader.name} - ${leader.title} of Garden City Properties Oman`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                      quality={95}
                      priority
                      loading="eager"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80" />
                  <div className="absolute inset-x-0 bottom-0 p-6 flex justify-start">
                    <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/35 bg-slate-950/90 px-3.5 py-1.5 text-xs font-semibold tracking-[0.16em] text-sky-300 uppercase shadow-[0_0_20px_rgba(56,189,248,0.3)] backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      <span>{leader.title}</span>
                    </span>
                  </div>
                </div>

                {/* Profile Details with enhanced typography */}
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  {/* Name */}
                  <h3 className="font-[family-name:var(--font-outfit)] rtl:font-[family-name:var(--font-cairo)] text-2xl font-extrabold tracking-tight text-white transition-colors group-hover:text-sky-300 sm:text-3xl">
                    {leader.name}
                  </h3>

                  {/* Title */}
                  <p className="mt-1 text-sm font-semibold tracking-wide text-sky-400/95 sm:text-base">
                    {leader.title}
                  </p>

                  {/* Extended Biography */}
                  <div className="mt-5 flex-1 flex-grow space-y-4 font-sans text-sm font-normal leading-relaxed text-slate-200/90 antialiased tracking-normal sm:text-[15px] sm:leading-7">
                    {leader.bio}
                  </div>

                  {/* Contact Links */}
                  <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
                    <a
                      href={`mailto:${leader.email}`}
                      className="inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-xs font-medium text-slate-200 backdrop-blur-md transition-all duration-200 hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-sky-300 sm:text-sm shadow-sm"
                    >
                      <Mail size={16} className="shrink-0 text-sky-400" />
                      <span>{leader.email}</span>
                    </a>

                    <a
                      href={leader.phoneHref}
                      className="inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-xs font-medium text-slate-200 backdrop-blur-md transition-all duration-200 hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-sky-300 sm:text-sm shadow-sm"
                    >
                      <Phone size={16} className="shrink-0 text-sky-400" />
                      <span dir="ltr">{leader.phone}</span>
                    </a>

                    {leader.whatsappHref && (
                      <a
                        href={leader.whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Chat with ${leader.name} on WhatsApp`}
                        className="inline-flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-2.5 text-xs font-medium text-emerald-300 backdrop-blur-md transition-all duration-200 hover:border-emerald-400/60 hover:bg-emerald-400/15 hover:text-white sm:text-sm shadow-sm"
                      >
                        <WhatsAppIcon className="h-4 w-4 fill-emerald-400" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
