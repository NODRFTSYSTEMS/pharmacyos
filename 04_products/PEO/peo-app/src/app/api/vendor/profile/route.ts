import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionContext } from "@/lib/auth/session";
import { requireRole, VENDOR_ROLES } from "@/lib/auth/rbac";
import { lintEventPayload } from "@/lib/events/pii-lint";

const updateSchema = z.object({
  companyName: z.string().min(1).optional(),
  services: z.array(z.string()).optional(),
  markets: z.array(z.string()).optional(),
  website: z.string().url().optional().or(z.literal("")),
  bio: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getSessionContext();
    if (!session || !requireRole(session.role, VENDOR_ROLES)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId: session.userId },
      include: { leads: { orderBy: { createdAt: "desc" } }, reviews: { orderBy: { createdAt: "desc" } } },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ vendor });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session || !requireRole(session.role, VENDOR_ROLES)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const data = parsed.data;
    const vendor = await prisma.vendor.update({
      where: { userId: session.userId },
      data: {
        companyName: data.companyName,
        services: data.services,
        markets: data.markets,
        website: data.website || undefined,
        bio: data.bio,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ vendor });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
