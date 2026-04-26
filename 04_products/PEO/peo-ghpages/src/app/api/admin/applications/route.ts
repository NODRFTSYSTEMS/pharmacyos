import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionContext } from "@/lib/auth/session";
import { requireRole, ADMIN_ROLES } from "@/lib/auth/rbac";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session || !requireRole(session.role, ADMIN_ROLES)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const context = searchParams.get("context");
    const page = Number(searchParams.get("page") || "1");
    const pageSize = 20;

    const applications = await prisma.sellerApplication.findMany({
      where: {
        ...(context ? { context: context as import("@prisma/client").ApplicationContext } : {}),
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: { select: { id: true, email: true, role: true } },
        triage: true,
        readiness: true,
      },
    });

    const total = await prisma.sellerApplication.count({
      where: {
        ...(context ? { context: context as import("@prisma/client").ApplicationContext } : {}),
      },
    });

    return NextResponse.json({ applications, total, page, pageSize });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
