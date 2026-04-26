import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionContext } from "@/lib/auth/session";
import { lintEventPayload } from "@/lib/events/pii-lint";
import type { Prisma } from "@prisma/client";

const applySchema = z.object({
  companyName: z.string().min(1),
  services: z.array(z.string()).min(1),
  markets: z.array(z.string()).min(1),
  website: z.string().url().optional().or(z.literal("")),
  bio: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session || !session.isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = applySchema.safeParse(body);
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

    const data = parsed.data;

    const existing = await prisma.vendor.findUnique({
      where: { userId: session.userId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Vendor application already exists" },
        { status: 409 }
      );
    }

    const vendor = await prisma.vendor.create({
      data: {
        userId: session.userId,
        companyName: data.companyName,
        services: data.services,
        markets: data.markets,
        website: data.website || undefined,
        bio: data.bio,
        status: "pending",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "role_change",
        resource: "vendors",
        resourceId: vendor.id,
        meta: { fromRole: session.role, toRole: "vendor", status: "pending" } as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ vendor }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
