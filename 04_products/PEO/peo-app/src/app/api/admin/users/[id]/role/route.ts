import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionContext } from "@/lib/auth/session";
import { requireRole, ADMIN_ROLES } from "@/lib/auth/rbac";
import type { Prisma } from "@prisma/client";

const roleSchema = z.object({
  role: z.enum([
    "anonymous_visitor",
    "free_user",
    "seller_applicant",
    "seller_verified",
    "investor_basic",
    "investor_advanced",
    "vendor",
    "admin_internal",
  ]),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionContext();
    if (!session || !requireRole(session.role, ADMIN_ROLES)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = roleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const previousRole = user.role;

    await prisma.user.update({
      where: { id },
      data: { role: parsed.data.role },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "role_change",
        resource: "users",
        resourceId: id,
        meta: { previousRole, newRole: parsed.data.role, changedBy: session.userId } as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
