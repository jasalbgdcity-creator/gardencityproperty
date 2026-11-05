"use client";

import { motion } from "framer-motion";
import { Award, Compass, Target, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ValueItem {
  label: string;
  text: string;
}

interface ValueBlock {
  icon: typeof Award;
  badge: { en: string; ar: string };
  title: { en: string; ar: string };
  items: {
    en: ValueItem[];
    ar: ValueItem[];
  };
}

const BLOCKS: ValueBlock[] = [
  {
    icon: Award,
    badge: { en: "Excellence & Value", ar: "التميز والقيمة" },
    title: {
      en: "Why Choose Garden City Properties?",
      ar: "لماذا تختار جاردن سيتي بروبرتيز؟",
    },
    items: {
      en: [
        { label: "Expertise", text: "Extensive real estate market knowledge." },
        { label: "Trust", text: "Transparent and reliable service." },
        { label: "Quality", text: "Professional property solutions." },
        { label: "Opportunities", text: "Exclusive property investment opportunities." },
        { label: "Results", text: "Maximizing value for buyers and sellers." },
      ],
      ar: [
        { label: "الخبرة", text: "معرفة واسعة وعميقة بسوق العقارات." },
        { label: "الثقة", text: "خدمة شفافة وموثوقة بأعلى المعايير." },
        { label: "الجودة", text: "حلول عقارية متكاملة واحترافية." },
        { label: "الفرص", text: "فرص استثمارية عقارية حصرية ومجدية." },
        { label: "النتائج", text: "تعظيم القيمة الاستثمارية للمشترين والبائعين." },
      ],
    },
  },
  {
    icon: Compass,
    badge: { en: "Strategic Direction", ar: "التوجه الاستراتيجي" },
    title: {
      en: "Garden City – Our Vision",
      ar: "جاردن سيتي – رؤيتنا",
    },
    items: {
      en: [
        { label: "Leadership", text: "To be a leading real estate consultancy in Oman." },
        { label: "Trust", text: "Delivering reliable valuations and expert property solutions." },
        { label: "Growth", text: "Creating sustainable value through innovation and market expertise." },
      ],
      ar: [
        { label: "الريادة", text: "أن نكون شركة استشارات عقارية رائدة في سلطنة عمان." },
        { label: "الثقة", text: "تقديم تقييمات موثوقة وحلول عقارية متخصصة." },
        { label: "النمو", text: "خلق قيمة مستدامة من خلال الابتكار والخبرة السوقية." },
      ],
    },
  },
  {
    icon: Target,
    badge: { en: "Brokerage Mandate", ar: "رسالة الوساطة" },
    title: {
      en: "Garden City LLC – Property Brokerage Mission",
      ar: "شركة جاردن سيتي ش.م.م – رسالة الوساطة العقارية",
    },
    items: {
      en: [
        { label: "Connect", text: "Matching clients with the right properties." },
        { label: "Deliver", text: "Professional, transparent brokerage services." },
        { label: "Achieve", text: "Maximizing value for buyers and sellers." },
      ],
      ar: [
        { label: "التواصل", text: "التوفيق الدقيق بين العملاء والعقارات المناسبة." },
        { label: "التنفيذ", text: "خدمات وساطة احترافية وشفافة تسودها النزاهة." },
        { label: "الإنجاز", text: "تحقيق أعلى العوائد والمنافع للمشترين والبائعين." },
      ],
    },
  },
];

export default function CoreValues() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <section id="values" className="scroll-mt-24 border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.28em] text-sky-400 uppercase">
            {isAr ? "قيمنا ورسالتنا" : "Why Choose Us & Our Purpose"}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl rtl:font-[family-name:var(--font-cairo)] rtl:tracking-normal rtl:font-bold">
            {isAr ? (
              <>
                ركائز الثقة والريادة في <span className="text-amber-500">سلطنة عمان</span>
              </>
            ) : (
              <>
                Strategic Principles Built on <span className="text-amber-500">Trust & Performance</span>
              </>
            )}
          </h2>
          <p className="mt-4 text-slate-400">
            {isAr
              ? "نلتزم بتقديم حلول عقارية استشارية واستثمارية منضبطة تلبي تطلعات المستثمرين والشركات والملاك."
              : "Dedicated to disciplined execution, market intelligence, and delivering long-term value for every client mandate."}
          </p>
        </div>

        {/* 3-Column Responsive Grid (stacks on mobile: grid-cols-1 md:grid-cols-2 lg:grid-cols-3) */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          {BLOCKS.map((block, index) => {
            const Icon = block.icon;
            const items = isAr ? block.items.ar : block.items.en;

            return (
              <motion.article
                key={block.title.en}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/50 hover:shadow-[0_0_36px_rgba(56,189,248,0.18)]"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-block rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-sky-300 uppercase">
                      {isAr ? block.badge.ar : block.badge.en}
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-950/70 text-sky-400 shadow-md transition-colors group-hover:border-sky-400/50 group-hover:text-cyan-300">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mt-6 font-[family-name:var(--font-outfit)] text-xl font-bold leading-snug text-white transition-colors group-hover:text-sky-300 sm:text-2xl">
                    {isAr ? block.title.ar : block.title.en}
                  </h3>

                  {/* Bullet points with checkmarks */}
                  <ul className="mt-6 space-y-3.5">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-400 group-hover:text-cyan-300 transition-colors" />
                        <div>
                          <span className="font-semibold text-white">{item.label}: </span>
                          <span className="text-slate-300">{item.text}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 border-t border-white/5 pt-4">
                  <span className="text-[0.7rem] font-semibold tracking-[0.2em] text-cyan-400/80 uppercase">
                    Garden City Properties
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
