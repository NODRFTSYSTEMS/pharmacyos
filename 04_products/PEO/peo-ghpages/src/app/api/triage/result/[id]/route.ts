import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionContext } from "@/lib/auth/session";
import { requireRole, SELLER_ROLES } from "@/lib/auth/rbac";

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
    const triage = await prisma.triageResult.findUnique({
      where: { id },
      include: { application: { select: { userId: true, context: true } } },
    });

    if (triage && triage.application.context !== "seller_application") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!triage) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!requireRole(session.role, ["admin_internal"]) && triage.application.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ triage });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
