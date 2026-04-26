import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionContext } from "@/lib/auth/session";
import { requireRole, SELLER_ROLES } from "@/lib/auth/rbac";

/* ------------------------------------------------------------------
 * GET /api/seller/applications — List seller applications
 * Authority: PMA · RCA · SCA
 * ------------------------------------------------------------------ */

const isDevBypass = process.env.NODE_ENV === "development" && process.env.ENABLE_DEV_BYPASS === "true";

export async function GET(_request: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session || !requireRole(session.role, SELLER_ROLES)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Dev bypass: no server-side persistence for synthetic apps
    if (isDevBypass) {
      return NextResponse.json({ applications: [] });
    }

    const apps = await prisma.sellerApplication.findMany({
      where: { userId: session.userId, context: "seller_application" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        address: true,
        status: true,
        expectedSalePrice: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Hydrate with default computed fields for the hub table
    const applications = apps.map((app) => ({
      id: app.id,
      address: app.address,
      status: app.status as "draft" | "submitted" | "under_review" | "approved" | "listed",
      estimatedArv: app.expectedSalePrice ?? 0,
      marketVelocity: "—",
      readinessScore: 0,
      createdAt: app.createdAt.toISOString(),
    }));

    return NextResponse.json({ applications });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
