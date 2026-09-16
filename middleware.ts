import { NextResponse, type NextRequest } from "next/server";
import { locales } from "@/lib/i18n";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "development-only-secret"
);

const DASHBOARD_PATTERN = /^\/[a-z]{2}\/dashboard/;
const AUTH_PATTERN = /^\/[a-z]{2}\/auth/;

async function getSessionUser(request: NextRequest) {
  const cookie = request.cookies.get("myupline_session")?.value;
  if (!cookie) return null;
  try {
    const { payload } = await jwtVerify(cookie, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");
  // Prevent MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  // XSS filter in older browsers
  response.headers.set("X-XSS-Protection", "1; mode=block");
  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // Permissions policy
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  // HSTS (only meaningful over HTTPS, harmless on HTTP)
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  // Basic CSP
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-eval in dev
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self'",
      "frame-ancestors 'none'"
    ].join("; ")
  );
  return response;
}

function noCacheResponse(response: NextResponse): NextResponse {
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("Surrogate-Control", "no-store");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- 1. Locale prefix handling ---
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  // Pass-through for Next.js internals, static assets, and API routes
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    const response = NextResponse.next();
    // Add security headers even to API responses
    return addSecurityHeaders(response);
  }

  // Redirect non-locale paths to /en/...
  if (!hasLocale) {
    request.nextUrl.pathname = `/en${pathname}`;
    const redirectResponse = NextResponse.redirect(request.nextUrl);
    return addSecurityHeaders(redirectResponse);
  }

  // --- 2. Session-based route guards ---
  const isDashboardRoute = DASHBOARD_PATTERN.test(pathname);
  const isAuthRoute = AUTH_PATTERN.test(pathname);

  if (isDashboardRoute || isAuthRoute) {
    const user = await getSessionUser(request);

    if (isDashboardRoute) {
      if (!user) {
        // Not authenticated — redirect to sign-in
        const locale = pathname.split("/")[1] || "en";
        const signInUrl = new URL(`/${locale}/auth/sign-in`, request.url);
        // Store where they were trying to go
        signInUrl.searchParams.set("next", pathname);
        const redirectResponse = NextResponse.redirect(signInUrl);
        return addSecurityHeaders(noCacheResponse(redirectResponse));
      }
      // Authenticated — allow through but no-cache so back button won't serve stale page
      const response = NextResponse.next();
      return addSecurityHeaders(noCacheResponse(response));
    }

    if (isAuthRoute) {
      if (user) {
        // Already logged in — redirect away from auth pages so back button doesn't show login
        const locale = pathname.split("/")[1] || "en";
        const roleSlug = (user.role as string || "member")
          .toLowerCase()
          .replace(/_/g, "-");
        const dashboardUrl = new URL(
          `/${locale}/dashboard/${roleSlug}`,
          request.url
        );
        const redirectResponse = NextResponse.redirect(dashboardUrl);
        return addSecurityHeaders(redirectResponse);
      }
      // Not logged in — allow auth pages through
      const response = NextResponse.next();
      return addSecurityHeaders(response);
    }
  }

  // Default: allow through with security headers
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"]
};
