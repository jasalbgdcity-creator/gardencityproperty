import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["en", "ar"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect localized admin paths (e.g. /en/admin, /ar/admin, /en/admin/login) to canonical /admin/
  for (const locale of LOCALES) {
    if (pathname === `/${locale}/admin` || pathname === `/${locale}/admin/`) {
      return NextResponse.redirect(new URL("/admin/", request.url), 301);
    }
    if (pathname.startsWith(`/${locale}/admin/`)) {
      const canonicalAdminPath = pathname.slice(`/${locale}`.length);
      return NextResponse.redirect(new URL(canonicalAdminPath, request.url), 301);
    }
  }

  // Skip static assets, API, admin, next internal files, and metadata files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.startsWith("/icon.png") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if pathname has a supported locale
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Root "/" or paths missing locale: check cookie or Accept-Language header
  const cookieLocale = request.cookies.get("gcp-language")?.value;
  const acceptLang = request.headers.get("accept-language") || "";
  const preferredLocale =
    cookieLocale === "ar" || (!cookieLocale && acceptLang.toLowerCase().includes("ar"))
      ? "ar"
      : "en";

  const targetPath = pathname === "/" ? `/${preferredLocale}` : `/${preferredLocale}${pathname}`;
  return NextResponse.redirect(new URL(targetPath, request.url));
}

export const config = {
  matcher: ["/((?!_next|api|admin|[\\w-]+\\.\\w+).*)"],
};
