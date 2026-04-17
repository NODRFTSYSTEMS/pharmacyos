import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hasRole } from "./rbac";
import type { User, UserRole } from "@prisma/client";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

// --- Clerk swap-in point ---
// When @clerk/nextjs is installed, replace requireAuth with:
//
//   import { auth } from "@clerk/nextjs/server";
//
//   export async function requireAuth(
//     _request: NextRequest,
//     allowedRoles: UserRole[]
//   ): Promise<{ user: User } | NextResponse> {
//     const { userId: clerkId } = await auth();
//     if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     const user = await prisma.user.findUnique({ where: { clerkId } });
//     if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 });
//     if (!hasRole(user.role, allowedRoles)) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }
//     return { user };
//   }

async function getOrCreateDemoUser(): Promise<User> {
  const existing = await prisma.user.findUnique({ where: { id: DEMO_USER_ID } });
  if (existing) return existing;
  return prisma.user.create({
    data: {
      id: DEMO_USER_ID,
      clerkId: "demo_clerk_id",
      email: "demo@peo.internal",
      role: "seller_applicant",
    },
  });
}

async function getUserFromToken(token: string): Promise<User | null> {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session || !session.user) return null;
  if (session.expiresAt < new Date()) return null;
  return session.user;
}

/**
 * Server-side auth enforcement for API routes.
 *
 * Resolves the caller identity in this order:
 *   1. Authorization: Bearer <token> header → validated against Session table
 *   2. peo_session cookie → validated against Session table
 *   3. Demo fallback (DEMO_AUTH_ENABLED=true only) → returns or creates demo user
 *
 * Returns { user } on success, or a NextResponse (401/403) on failure.
 * Routes must check `if (result instanceof NextResponse) return result;` before use.
 */
export async function requireAuth(
  request: NextRequest,
  allowedRoles: UserRole[]
): Promise<{ user: User } | NextResponse> {
  let user: User | null = null;

  // 1. Authorization: Bearer <token>
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    user = await getUserFromToken(token);
  }

  // 2. peo_session cookie
  if (!user) {
    const cookie = request.cookies.get("peo_session");
    if (cookie?.value) {
      user = await getUserFromToken(cookie.value);
    }
  }

  // 3. Demo mode fallback (non-production only)
  if (!user && process.env.DEMO_AUTH_ENABLED === "true") {
    user = await getOrCreateDemoUser();
  }

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasRole(user.role, allowedRoles)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return { user };
}

/**
 * Ownership check — verifies the authenticated user owns the resource or is admin.
 * Returns a 403 NextResponse if the check fails, otherwise undefined.
 */
export function assertOwner(
  resourceUserId: string,
  user: User
): NextResponse | undefined {
  if (user.id === resourceUserId || user.role === "admin_internal") return undefined;
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
