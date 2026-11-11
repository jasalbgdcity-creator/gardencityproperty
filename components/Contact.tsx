"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import CountryCodeSelector from "@/components/CountryCodeSelector";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [countryCode, setCountryCode] = useState("+968");
  const { dictionary, language } = useLanguage();
  const isAr = language === "ar";
  const copy = dictionary.contact;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const rawPhone = String(formData.get("phone") || "").trim();
    const selectedCode = String(formData.get("country_code") || countryCode).trim();
    const phone = rawPhone.startsWith("+") ? rawPhone : `${selectedCode} ${rawPhone}`;
    const message = String(formData.get("message") || "").trim();

    const accessKey =
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY ||
      "fc593170-cd44-4fa4-a69b-20a1d29a08ca";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name,
          email,
          phone,
          message,
          from_name: "Garden City Properties Website",
          subject: `New Property Enquiry from ${name}`,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send enquiry.");
      }

      setStatusMessage({
        type: "success",
        text: copy.thanks || "Thank you. Your enquiry has been received.",
      });
      form.reset();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to deliver enquiry.";
      setStatusMessage({
        type: "error",
        text: `${errorMsg}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 border-t border-white/5 py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-8 md:p-10"
        >
          <p className="text-xs font-semibold tracking-[0.28em] text-sky-400 uppercase">
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl rtl:font-[family-name:var(--font-cairo)] rtl:tracking-normal rtl:font-bold">
            {copy.title}
          </h2>
          <p className="mt-3 text-sm text-slate-400">{copy.subtitle}</p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <label className="grid gap-2 text-sm text-slate-300">
              {copy.name}
              <input
                required
                name="name"
                className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none ring-sky-400/0 transition focus:border-sky-400/50 focus:ring-4 focus:ring-sky-400/15"
                placeholder={copy.namePlaceholder}
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              {copy.email}
              <input
                required
                type="email"
                name="email"
                className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-sky-400/50 focus:ring-4 focus:ring-sky-400/15"
                placeholder="you@company.com"
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              {copy.phone}
              <div className="flex gap-2">
                <CountryCodeSelector
                  value={countryCode}
                  onChange={setCountryCode}
                  isAr={isAr}
                />
                <input
                  required
                  type="tel"
                  name="phone"
                  dir="ltr"
                  className="flex-1 min-w-0 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-sky-400/50 focus:ring-4 focus:ring-sky-400/15"
                  placeholder={countryCode === "+968" ? "9123 4567" : "1234 5678"}
                />
              </div>
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              {copy.message}
              <textarea
                required
                name="message"
                rows={5}
                className="resize-y rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-sky-400/50 focus:ring-4 focus:ring-sky-400/15"
                placeholder={copy.messagePlaceholder}
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(56,189,248,0.35)] transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : copy.send}
            </button>
            {statusMessage && (
              <div
                className={`mt-2 rounded-xl p-3 text-xs leading-relaxed ${
                  statusMessage.type === "success"
                    ? "border border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
                    : "border border-red-500/30 bg-red-950/40 text-red-300"
                }`}
              >
                {statusMessage.text}
              </div>
            )}
          </form>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col justify-between rounded-3xl border border-sky-400/25 bg-gradient-to-br from-slate-900 to-slate-950 p-8"
        >
          <div>
            <h3 className="font-[family-name:var(--font-outfit)] text-2xl font-semibold text-white">
              {copy.direct}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{copy.directBody}</p>
            <a
              href="mailto:info@gardencityproperties.net"
              className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-sky-200 transition hover:border-sky-400/40"
            >
              <Mail size={18} />
              info@gardencityproperties.net
            </a>
            <a
              href="tel:+96897300200"
              className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-sky-200 transition hover:border-sky-400/40"
            >
              <Phone size={18} />
              +968 97300200
            </a>
            <a
              href={getGeneralWhatsAppUrl(dictionary.contact.location?.includes("عمان") ? "ar" : "en")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>WhatsApp Direct Desk</span>
            </a>
            <a
              href="https://maps.app.goo.gl/2hPDjkPfGt424wNA7?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={isAr ? "موقع المكتب على خرائط Google" : "Office Location on Google Maps"}
              className="mt-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200 transition hover:border-[#d4af37]/60 hover:bg-[#d4af37]/10 hover:text-white group cursor-pointer"
            >
              <MapPin size={18} className="mt-0.5 shrink-0 text-[#d4af37] transition-transform group-hover:scale-110" />
              <span className="leading-snug break-words transition-colors group-hover:text-[#d4af37]">
                {isAr
                  ? "مكتب رقم 11، ص.ب 275، الرمز البريدي 117، الموالح الشمالية، سلطنة عمان"
                  : "Office No 11, Po Box 275, Pc 117, Mawelah North, Sultanate Oman"}
              </span>
            </a>
          </div>
          <p className="mt-10 text-xs tracking-[0.2em] text-sky-200/80 uppercase">
            {copy.location}
          </p>
        </motion.aside>
      </div>
    </section>
  );
}
