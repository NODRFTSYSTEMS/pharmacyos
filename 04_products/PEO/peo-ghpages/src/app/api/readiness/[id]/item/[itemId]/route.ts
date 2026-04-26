import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionContext } from "@/lib/auth/session";
import { requireRole, SELLER_ROLES } from "@/lib/auth/rbac";

const updateSchema = z.object({
  completed: z.boolean(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const session = await getSessionContext();
    if (!session || !requireRole(session.role, SELLER_ROLES)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const item = await prisma.readinessItem.findUnique({
      where: { id: itemId },
      include: {
        plan: {
          include: {
            application: { select: { userId: true, context: true } },
          },
        },
      },
    });

    if (item && item.plan.application.context !== "seller_application") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!requireRole(session.role, ["admin_internal"]) && item.plan.application.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.readinessItem.update({
      where: { id: itemId },
      data: {
        completed: parsed.data.completed,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ item: updated });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
