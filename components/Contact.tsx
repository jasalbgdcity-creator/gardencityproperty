"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { dictionary } = useLanguage();
  const copy = dictionary.contact;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
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
          <h2 className="mt-3 font-[family-name:var(--font-outfit)] text-3xl font-semibold text-white">
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
              <input
                required
                type="tel"
                name="phone"
                className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-sky-400/50 focus:ring-4 focus:ring-sky-400/15"
                placeholder="+968 0000 0000"
              />
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
              href="tel:+96899190404"
              className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-sky-200 transition hover:border-sky-400/40"
            >
              <Phone size={18} />
              +968 99190404
            </a>
            <a
              href="https://maps.app.goo.gl/SxfCYnRDrHg7BQjCA"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-sky-200 transition hover:border-sky-400/40"
            >
              <MapPin size={18} className="mt-0.5 shrink-0 text-sky-400" />
              <span className="leading-snug break-words">
                Office No 11, Po Box 275, Pc 117, Mawelah North, Sultanate Oman
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
