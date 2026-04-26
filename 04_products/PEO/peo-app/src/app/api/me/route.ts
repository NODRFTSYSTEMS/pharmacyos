import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth/session";

/* ------------------------------------------------------------------
 * GET /api/me — Returns current user session context
 * Authority: DSS · SCA
 * ------------------------------------------------------------------ */

export async function GET() {
  const session = await getSessionContext();

  if (!session) {
    return NextResponse.json(
      { userId: null, role: "anonymous_visitor", isAuthenticated: false },
      { status: 200 }
    );
  }

  return NextResponse.json({
    userId: session.userId,
    role: session.role,
    isAuthenticated: session.isAuthenticated,
  });
}
