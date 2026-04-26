import { auth } from "@clerk/nextjs/server";
import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";

export interface SessionContext {
  userId: string;
  role: UserRole;
  isAuthenticated: boolean;
}

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const clerkConfigured =
  clerkKey.startsWith("pk_") && clerkKey !== "pk_test_replace_me" && clerkKey.length > 30;

const isDev = process.env.NODE_ENV === "development";
const devBypassEnabled = isDev && process.env.ENABLE_DEV_BYPASS === "true";

export async function getSessionContext(): Promise<SessionContext | null> {
  if (!clerkConfigured) {
    // Only create a dev user in local development with explicit bypass flag
    if (!devBypassEnabled) return null;
    const devUser = await prisma.user.upsert({
      where: { clerkId: "dev-bypass" },
      create: { clerkId: "dev-bypass", email: "dev@bypass.local", role: "anonymous_visitor" },
      update: {},
    });
    return { userId: devUser.id, role: devUser.role, isAuthenticated: true };
  }
  const session = await auth();
  const clerkUserId = session.userId;

  if (!clerkUserId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });

  if (!user) {
    return null;
  }

  return {
    userId: user.id,
    role: user.role,
    isAuthenticated: true,
  };
}
