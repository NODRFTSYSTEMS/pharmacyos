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
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    const page = Number(searchParams.get("page") || "1");
    const pageSize = 20;

    const users = await prisma.user.findMany({
      where: {
        ...(role ? { role: role as import("@prisma/client").UserRole } : {}),
        ...(search ? { email: { contains: search, mode: "insensitive" } } : {}),
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        clerkId: true,
        email: true,
        role: true,
        preferredLang: true,
        createdAt: true,
      },
    });

    const total = await prisma.user.count({
      where: {
        ...(role ? { role: role as import("@prisma/client").UserRole } : {}),
        ...(search ? { email: { contains: search, mode: "insensitive" } } : {}),
      },
    });

    return NextResponse.json({ users, total, page, pageSize });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
