"use client";

import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { useEffect, type ReactNode } from "react";

function DirectedShell({ children }: { children: ReactNode }) {
  const { dir, language } = useLanguage();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = dir;
      document.documentElement.lang = language;
    }
  }, [dir, language]);

  return (
    <div
      dir={dir}
      lang={language}
      className={`flex min-h-full flex-col gap-0 m-0 p-0 bg-[#050816] ${
        language === "ar" ? "font-[family-name:var(--font-cairo)]" : ""
      }`}
    >
      {children}
    </div>
  );
}

export default function LanguageShell({
  children,
  locale,
}: {
  children: ReactNode;
  locale?: "en" | "ar";
}) {
  return (
    <LanguageProvider initialLanguage={locale}>
      <DirectedShell>{children}</DirectedShell>
    </LanguageProvider>
  );
}
