"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import { COUNTRY_CODES, CountryCode } from "@/lib/countryCodes";
import CountryFlag from "@/components/CountryFlag";

interface CountryCodeSelectorProps {
  value: string;
  onChange: (dialCode: string) => void;
  isAr?: boolean;
  name?: string;
  className?: string;
}

export default function CountryCodeSelector({
  value,
  onChange,
  isAr = false,
  name = "country_code",
  className = "",
}: CountryCodeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Active country object
  const activeCountry = useMemo(() => {
    return (
      COUNTRY_CODES.find((c) => c.dialCode === value) ||
      COUNTRY_CODES[0] // fallback to Oman
    );
  }, [value]);

  // Filtered countries based on search
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return COUNTRY_CODES;
    const q = searchQuery.toLowerCase().trim();
    return COUNTRY_CODES.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.nameAr.includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus search when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  const handleSelect = (country: CountryCode) => {
    onChange(country.dialCode);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative shrink-0 ${className}`}>
      {/* Hidden input for form submissions */}
      <input type="hidden" name={name} value={activeCountry.dialCode} />

      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={isAr ? "رمز الدولة" : "Country code"}
        className="flex h-full min-h-[48px] items-center gap-2 rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-xs sm:text-sm font-medium text-white shadow-sm outline-none transition hover:border-sky-400/40 hover:bg-slate-900 focus:border-sky-400/60 focus:ring-4 focus:ring-sky-400/15"
      >
        <span className="flex shrink-0 items-center overflow-hidden rounded-[3px] border border-white/20 shadow-xs">
          <CountryFlag code={activeCountry.code} className="h-3.5 w-5 object-cover shrink-0" />
        </span>
        <span className="font-[family-name:var(--font-outfit)] font-semibold tracking-wide" dir="ltr">
          {activeCountry.dialCode}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-sky-400" : ""
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute top-full z-50 mt-2 w-72 max-w-[85vw] rounded-2xl border border-white/15 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-2xl ring-1 ring-black/50 ${
            isAr ? "right-0" : "left-0"
          }`}
        >
          {/* Quick Search Header */}
          <div className="relative mb-2 px-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 rtl:left-auto rtl:right-3" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "ابحث عن الدولة أو الرمز..." : "Search country or code..."}
              className="w-full rounded-lg border border-white/10 bg-slate-900/90 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-400 outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 rtl:pl-3 rtl:pr-8"
            />
          </div>

          {/* Scrollable Country List */}
          <div className="max-h-56 overflow-y-auto space-y-0.5 pr-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => {
                const isSelected = c.dialCode === activeCountry.dialCode;
                return (
                  <button
                    key={`${c.code}-${c.dialCode}`}
                    type="button"
                    onClick={() => handleSelect(c)}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs transition ${
                      isSelected
                        ? "bg-sky-500/20 text-sky-300 font-semibold"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="flex shrink-0 items-center overflow-hidden rounded-[2px] border border-white/20 shadow-xs">
                        <CountryFlag code={c.code} className="h-3.5 w-5 object-cover" />
                      </span>
                      <span className="truncate">{isAr ? c.nameAr : c.name}</span>
                    </div>
                    <span
                      className="ml-2 font-[family-name:var(--font-outfit)] text-[11px] font-semibold text-slate-400 shrink-0"
                      dir="ltr"
                    >
                      {c.dialCode}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-center text-xs text-slate-400">
                {isAr ? "لا توجد نتائج مطابقة" : "No matching countries"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
