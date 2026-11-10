"use client";

import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  locale: "en" | "ar";
}

export default function Breadcrumbs({ items, locale }: BreadcrumbsProps) {
  const isAr = locale === "ar";
  const Separator = isAr ? ChevronLeft : ChevronRight;

  return (
    <nav
      aria-label={isAr ? "مسار التنقل" : "Breadcrumb"}
      className="mb-8 flex items-center text-xs md:text-sm text-slate-400"
    >
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href} className="flex items-center gap-1.5 sm:gap-2">
              {index > 0 && (
                <Separator className="h-3.5 w-3.5 shrink-0 text-slate-600" aria-hidden="true" />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-medium text-sky-300 truncate max-w-[200px] sm:max-w-xs md:max-w-none"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-sky-300 focus:outline-none focus:text-sky-300"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
