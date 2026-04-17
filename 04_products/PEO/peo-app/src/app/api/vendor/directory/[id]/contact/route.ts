import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionContext } from "@/lib/auth/session";
import { lintEventPayload } from "@/lib/events/pii-lint";
import type { Prisma } from "@prisma/client";

const contactSchema = z.object({
  message: z.string().min(1).max(500),
  source: z.enum(["seller_app", "investor_basic", "investor_advanced"]),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionContext();
    if (!session || !session.isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const vendor = await prisma.vendor.findUnique({
      where: { id, status: "verified" },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
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

    const lead = await prisma.vendorLead.create({
      data: {
        vendorId: id,
        source: parsed.data.source,
        payload: {
          message: parsed.data.message,
          fromUserId: session.userId,
          timestamp: new Date().toISOString(),
        } as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
