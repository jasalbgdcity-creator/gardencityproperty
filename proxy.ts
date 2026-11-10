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

  // Forward pathname to server components for locale and direction detection
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-current-path", pathname);

  // Allow root "/" to pass through to next.config.ts permanent 308 redirect
  if (pathname === "/") {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Check if pathname has a supported locale
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Paths missing locale: redirect directly with trailing slash
  const targetPath = `/en${pathname.endsWith("/") ? pathname : pathname + "/"}`;
  return NextResponse.redirect(new URL(targetPath, request.url), 308);
}

export const config = {
  matcher: ["/((?!_next|api|admin|[\\w-]+\\.\\w+).*)"],
};
