import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { lintEventPayload, sanitizeEventPayload } from "@/lib/events/pii-lint";
import { getSessionContext } from "@/lib/auth/session";
import { requireRole, SELLER_ROLES } from "@/lib/auth/rbac";
import type { Prisma } from "@prisma/client";

const createSchema = z.object({
  address: z.string().min(1),
  goals: z.record(z.string(), z.unknown()).optional(),
  timeline: z.string().optional(),
  expectedSalePrice: z.coerce.number().min(0).optional(),
  mortgagePayoff: z.coerce.number().min(0).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session || !requireRole(session.role, SELLER_ROLES)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // PII lint on event-like payload
    const lint = lintEventPayload(body);
    if (!lint.clean) {
      return NextResponse.json(
        { error: "PII detected in payload", violations: lint.violations },
        { status: 400 }
      );
    }

    const app = await prisma.sellerApplication.create({
      data: {
        userId: session.userId,
        context: "seller_application",
        address: data.address,
        goals: (data.goals ?? {}) as unknown as Prisma.InputJsonValue,
        timeline: data.timeline,
        expectedSalePrice: data.expectedSalePrice,
        mortgagePayoff: data.mortgagePayoff,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "application_submit",
        resource: "seller_applications",
        resourceId: app.id,
        meta: sanitizeEventPayload({ address: data.address }) as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ application: app }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
