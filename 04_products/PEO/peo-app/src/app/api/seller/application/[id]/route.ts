import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { lintEventPayload } from "@/lib/events/pii-lint";
import { getSessionContext } from "@/lib/auth/session";
import { requireRole, SELLER_ROLES } from "@/lib/auth/rbac";
import type { Prisma } from "@prisma/client";

const updateSchema = z.object({
  address: z.string().min(1).optional(),
  goals: z.record(z.string(), z.unknown()).optional(),
  timeline: z.string().optional(),
  expectedSalePrice: z.coerce.number().min(0).optional(),
  mortgagePayoff: z.coerce.number().min(0).optional(),
  propertyFacts: z.record(z.string(), z.unknown()).optional(),
});

async function authorizeApplication(sessionUserId: string, role: import("@prisma/client").UserRole, appId: string) {
  if (requireRole(role, ["admin_internal"])) return true;
  const app = await prisma.sellerApplication.findUnique({
    where: { id: appId },
    select: { userId: true },
  });
  return app?.userId === sessionUserId;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionContext();
    if (!session || !requireRole(session.role, SELLER_ROLES)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const authorized = await authorizeApplication(session.userId, session.role, id);
    if (!authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const app = await prisma.sellerApplication.findUnique({
      where: { id, context: "seller_application" },
      include: { uploads: true, triage: true, readiness: { include: { items: true } } },
    });

    if (!app) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ application: app });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionContext();
    if (!session || !requireRole(session.role, SELLER_ROLES)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const authorized = await authorizeApplication(session.userId, session.role, id);
    if (!authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const lint = lintEventPayload(body);
    if (!lint.clean) {
      return NextResponse.json(
        { error: "PII detected in payload", violations: lint.violations },
        { status: 400 }
      );
    }

    const app = await prisma.sellerApplication.update({
      where: { id, context: "seller_application" },
      data: {
        ...parsed.data,
        updatedAt: new Date(),
        goals: parsed.data.goals ? (parsed.data.goals as unknown as Prisma.InputJsonValue) : undefined,
        propertyFacts: parsed.data.propertyFacts ? (parsed.data.propertyFacts as unknown as Prisma.InputJsonValue) : undefined,
      },
    });

    return NextResponse.json({ application: app });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
