import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/navigation";

// ------------------------------------------------------------------
// PEO Proxy (Next.js 16 middleware convention)
// Authority: DSS · SCA · TVA
// Merges next-intl locale routing with custom RBAC + security headers
// ------------------------------------------------------------------

const intlMiddleware = createIntlMiddleware(routing);

/* ---------- Role hierarchy ---------- */
type UserRole =
  | "anonymous_visitor"
  | "free_user"
  | "seller"
  | "investor_core"
  | "investor_elite"
  | "vendor"
  | "admin_internal";

const ROLE_LEVEL: Record<UserRole, number> = {
  anonymous_visitor: 0,
  free_user: 1,
  seller: 2,
  investor_core: 3,
  investor_elite: 4,
  vendor: 5,
  admin_internal: 10,
};

function hasRole(userRole: UserRole, required: UserRole | UserRole[]): boolean {
  const userLevel = ROLE_LEVEL[userRole];
  const requiredRoles = Array.isArray(required) ? required : [required];
  const requiredLevel = Math.min(...requiredRoles.map((r) => ROLE_LEVEL[r]));
  return userLevel >= requiredLevel;
}

/* ---------- Route guards ---------- */
interface RouteGuard {
  pattern: RegExp;
  roles: UserRole[];
  redirectTo: string;
}

const GUARDS: RouteGuard[] = [
  {
    pattern: /^\/(en|es)?\/seller\/(application|dashboard)/,
    roles: ["seller", "admin_internal"],
    redirectTo: "/sign-in",
  },
  {
    pattern: /^\/(en|es)?\/investor\/(analyze|analysis)/,
    roles: ["investor_core", "investor_elite", "admin_internal"],
    redirectTo: "/pricing",
  },
  {
    pattern: /^\/(en|es)?\/investor$/,
    roles: ["investor_core", "investor_elite", "admin_internal"],
    redirectTo: "/pricing",
  },
  {
    pattern: /^\/(en|es)?\/vendor\//,
    roles: ["vendor", "admin_internal"],
    redirectTo: "/sign-in",
  },
  {
    pattern: /^\/(en|es)?\/admin\//,
    roles: ["admin_internal"],
    redirectTo: "/",
  },
  {
    pattern: /^\/(en|es)?\/app\//,
    roles: ["free_user", "seller", "investor_core", "investor_elite", "vendor", "admin_internal"],
    redirectTo: "/sign-in",
  },
];

/* ---------- Public routes ---------- */
const PUBLIC_PREFIXES = [
  "/_next",
  "/api/webhook",
  "/api/public",
  "/og-",
  "/favicon",
  "/robots.txt",
  "/sitemap",
  "/sign-in",
  "/sign-up",
  "/for-sellers",
  "/for-investors",
  "/how-it-works",
  "/pricing",
  "/faq",
  "/trust",
  "/legal",
  "/academy",
  "/estimator",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

/* ---------- Locale helpers ---------- */
function stripLocale(pathname: string): string {
  const first = pathname.split("/")[1];
  if (first === "en" || first === "es") {
    return pathname.slice(3) || "/";
  }
  return pathname;
}

function withLocale(pathname: string, locale: string): string {
  if (pathname.startsWith(`/${locale}`)) return pathname;
  return `/${locale}${pathname}`;
}

/* ---------- Auth helper ---------- */
function getRoleFromRequest(req: NextRequest): UserRole | null {
  // Dev bypass
  if (
    process.env.NODE_ENV === "development" &&
    process.env.ENABLE_DEV_BYPASS === "true"
  ) {
    return "admin_internal";
  }

  // Clerk session (if configured)
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
  const clerkConfigured =
    clerkKey.startsWith("pk_") && clerkKey !== "pk_test_replace_me" && clerkKey.length > 30;

  if (clerkConfigured) {
    const clerkSession = req.cookies.get("__session")?.value;
    if (clerkSession) return "free_user";
  }

  // PEO custom session
  const peoSession = req.cookies.get("peo_session")?.value;
  if (peoSession) return "free_user";

  // Demo mode
  if (process.env.DEMO_AUTH_ENABLED === "true") return "seller";

  return null;
}

/* ---------- Main proxy ---------- */
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const locale = req.cookies.get("NEXT_LOCALE")?.value ?? "en";

  // 1. Skip public assets
  if (isPublicPath(pathname)) {
    return intlMiddleware(req);
  }

  // 2. Let API routes pass through untouched
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const barePath = stripLocale(pathname);

  // 2. Locale redirect for root
  if (barePath === "/") {
    return intlMiddleware(req);
  }

  // 3. Check route guards
  for (const guard of GUARDS) {
    if (guard.pattern.test(pathname) || guard.pattern.test(barePath)) {
      const role = getRoleFromRequest(req);
      if (!role || !hasRole(role, guard.roles)) {
        const redirectPath = withLocale(guard.redirectTo, locale);
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
    }
  }

  // 4. Run next-intl middleware for locale handling
  const response = await intlMiddleware(req);

  // 5. Add security headers
  if (response instanceof NextResponse) {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("X-PEO-Edge-Guard", "active");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)",
    "/(api|trpc)(.*)",
  ],
};
