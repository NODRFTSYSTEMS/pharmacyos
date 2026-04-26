import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionContext } from "@/lib/auth/session";
import { requireRole, VENDOR_ROLES } from "@/lib/auth/rbac";

export async function GET() {
  try {
    const session = await getSessionContext();
    if (!session || !requireRole(session.role, VENDOR_ROLES)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId: session.userId },
      include: { leads: { orderBy: { createdAt: "desc" } } },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ leads: vendor.leads });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
