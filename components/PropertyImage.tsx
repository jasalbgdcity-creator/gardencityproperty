"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { Building2 } from "lucide-react";
import { toDirectDriveImageUrl, isGoogleDriveUrl } from "@/lib/projects";

interface PropertyImageProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string | null;
  alt: string;
  fallbackLabel?: string;
  fallbackSublabel?: string;
}

export default function PropertyImage({
  src,
  alt,
  fallbackLabel = "Garden City Properties",
  fallbackSublabel = "Property Visual",
  className = "",
  fill,
  width,
  height,
  priority,
  loading,
  quality,
  sizes,
  ...props
}: PropertyImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const isInvalidSrc = !src || typeof src !== "string" || src.trim() === "";

  if (isInvalidSrc || hasError) {
    return (
      <div
        role="img"
        aria-label={`${alt} (Visual placeholder)`}
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-[#070d1e] to-slate-900 border border-amber-500/20 text-center p-4 overflow-hidden select-none ${
          fill ? "absolute inset-0 h-full w-full" : ""
        } ${className}`}
        style={!fill && width && height ? { width, height } : undefined}
      >
        {/* Subtle Luxury Pattern / Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.08),transparent_70%)]" />

        {/* Architectural Icon */}
        <div className="relative mb-2 flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
          <Building2 className="h-5 w-5 text-amber-400" />
        </div>

        {/* Brand / Fallback Label */}
        <span className="relative font-serif text-xs font-semibold tracking-wide text-amber-200/90 line-clamp-1">
          {fallbackLabel}
        </span>
        <span className="relative mt-0.5 text-[10px] font-medium tracking-wider text-slate-400 uppercase">
          {fallbackSublabel}
        </span>
      </div>
    );
  }

  const resolvedSrc = toDirectDriveImageUrl(src) || src;
  const isDrive = isGoogleDriveUrl(resolvedSrc);

  return (
    <>
      {/* Smooth Skeleton Pulse Placeholder while image loads */}
      {!isLoaded && !priority && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 z-0 bg-slate-900/80 animate-pulse pointer-events-none ${
            fill ? "h-full w-full" : ""
          }`}
          style={!fill && width && height ? { width, height } : undefined}
        />
      )}
      <Image
        src={resolvedSrc}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? undefined : (loading || "lazy")}
        sizes={sizes || (fill ? "100vw" : undefined)}
        quality={quality || 85}
        unoptimized={isDrive || props.unoptimized}
        className={`${className} transition-opacity duration-300 ease-out ${
          !isLoaded && !priority ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        {...props}
      />
    </>
  );
}
