"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
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

interface Consultant {
  name: string;
  role: string;
  phone: string;
  email: string;
  image: string;
}

const CONSULTANTS: Consultant[] = [
  {
    name: "Rahul",
    role: "Property consultant",
    phone: "+968 99190404",
    email: "rahul@gmail.com",
    image: "/Consult1.jpeg",
  },
  {
    name: "[Consultant Name]",
    role: "Property consultant",
    phone: "[Consultant Mob]",
    email: "[Consultant Email]",
    image: "/Consult2.png",
  },
];

export default function Consultants() {
  const { language } = useLanguage();

  return (
    <section id="consultants" className="scroll-mt-24 border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.28em] text-sky-400 uppercase">
            {language === "ar" ? "المستشارون العقاريون" : "Advisory Team"}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl rtl:font-[family-name:var(--font-cairo)] rtl:tracking-normal rtl:font-bold">
            {language === "ar" ? (
              <>
                مستشارو <span className="text-amber-500">العقارات</span>
              </>
            ) : (
              <>
                Property <span className="text-amber-500">Consultants</span>
              </>
            )}
          </h2>
          <p className="mt-4 text-slate-400">
            {language === "ar"
              ? "فريقنا المتخصص لتقديم استشارات عقارية شخصية ومساعدتك في اختيار العقار الأنسب."
              : "Dedicated professionals providing tailored advisory and high-touch guidance across Oman’s prime developments."}
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {CONSULTANTS.map((consultant, index) => {
            return (
              <motion.article
                key={consultant.name + index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/50 hover:shadow-[0_0_36px_rgba(56,189,248,0.18)] sm:flex-row sm:items-center sm:p-8"
              >
                {/* Circular Profile Image */}
                <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-full border-2 border-sky-400/40 bg-slate-950 p-1 shadow-[0_0_24px_rgba(56,189,248,0.2)] transition-colors group-hover:border-sky-300">
                  <div className="relative h-full w-full overflow-hidden rounded-full">
                    <Image
                      src={consultant.image}
                      alt={`${consultant.name} - ${consultant.role} at Garden City Properties Oman`}
                      fill
                      sizes="176px"
                      quality={85}
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Consultant Details */}
                <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-start">
                  <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-sky-300 uppercase">
                    {consultant.role}
                  </span>

                  <h3 className="mt-3 font-[family-name:var(--font-outfit)] text-2xl font-bold text-white transition-colors group-hover:text-sky-300">
                    {consultant.name}
                  </h3>

                  <p className="mt-1 text-xs tracking-wider text-slate-400 uppercase">
                    Garden City Properties
                  </p>

                  {/* Interactive Action Icon Buttons (No raw email text displayed) */}
                  <div className="mt-6 flex items-center gap-3">
                    <a
                      href={`tel:${consultant.phone}`}
                      aria-label={`Call ${consultant.name}`}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-950/70 text-sky-400 shadow-md backdrop-blur-md transition-all duration-200 hover:border-sky-400/60 hover:bg-sky-400/15 hover:text-white hover:shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                      title={consultant.phone}
                    >
                      <Phone className="h-5 w-5" />
                    </a>

                    <a
                      href={`mailto:${consultant.email}`}
                      aria-label={`Email ${consultant.name}`}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-950/70 text-sky-400 shadow-md backdrop-blur-md transition-all duration-200 hover:border-sky-400/60 hover:bg-sky-400/15 hover:text-white hover:shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                      title={consultant.email}
                    >
                      <Mail className="h-5 w-5" />
                    </a>

                    <a
                      href={getGeneralWhatsAppUrl(language === "ar" ? "ar" : "en")}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp ${consultant.name}`}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-950/70 text-emerald-400 shadow-md backdrop-blur-md transition-all duration-200 hover:border-emerald-400/60 hover:bg-emerald-400/15 hover:text-white hover:shadow-[0_0_20px_rgba(52,211,153,0.35)]"
                      title="Chat on WhatsApp"
                    >
                      <WhatsAppIcon className="h-5 w-5" />
                    </a>
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
