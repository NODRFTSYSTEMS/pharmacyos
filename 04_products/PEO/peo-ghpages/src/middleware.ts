import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/navigation";

const intlMiddleware = createIntlMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/:locale/seller(.*)",
  "/:locale/seller/application(.*)",
  "/:locale/investor(.*)",
  "/:locale/vendor(.*)",
  "/api/seller(.*)",
  "/api/investor(.*)",
  "/api/vendor(.*)",
  "/api/triage(.*)",
  "/api/readiness(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/:locale/admin(.*)",
  "/api/admin(.*)",
]);

const isApiRoute = createRouteMatcher(["/api/(.*)"]);

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const clerkConfigured =
  clerkKey.startsWith("pk_") && clerkKey !== "pk_test_replace_me" && clerkKey.length > 30;

const isDev = process.env.NODE_ENV === "development";
const devBypassEnabled = isDev && process.env.ENABLE_DEV_BYPASS === "true";

// When Clerk keys are not yet configured (local dev / review), open all routes for visual review.
// Revert to the redirect pattern when auth is re-enabled.
function devBypassMiddleware(req: NextRequest) {
  // Block test and admin API routes even in dev bypass mode
  if (req.nextUrl.pathname.startsWith("/api/test/") || req.nextUrl.pathname.startsWith("/api/admin/")) {
    return new NextResponse("Not Found", { status: 404 });
  }
  if (isApiRoute(req)) return NextResponse.next();
  return intlMiddleware(req);
}

export default clerkConfigured
  ? clerkMiddleware(async (auth, req) => {
      if (isAdminRoute(req)) {
        await auth.protect();
        const { sessionClaims } = await auth();
        if (sessionClaims?.peoRole !== "admin_internal") {
          return new Response("Forbidden", { status: 403 });
        }
        if (isApiRoute(req)) return;
        return intlMiddleware(req);
      }
      if (isProtectedRoute(req)) {
        await auth.protect();
      }
      if (isApiRoute(req)) return;
      return intlMiddleware(req);
    })
  : devBypassMiddleware;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
