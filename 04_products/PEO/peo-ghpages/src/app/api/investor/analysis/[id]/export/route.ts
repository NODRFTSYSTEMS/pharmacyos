import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionContext } from "@/lib/auth/session";
import { requireRole, INVESTOR_ROLES } from "@/lib/auth/rbac";
import type { Prisma } from "@prisma/client";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionContext();
    if (!session || !requireRole(session.role, INVESTOR_ROLES)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const app = await prisma.sellerApplication.findUnique({
      where: { id, context: { in: ["investor_basic_analysis", "investor_advanced_analysis"] } },
      include: { triage: true },
    });

    if (!app) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!requireRole(session.role, ["admin_internal"]) && app.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Export permission: only investor_advanced and admin_internal may export
    if (!requireRole(session.role, ["investor_advanced", "admin_internal"])) {
      return NextResponse.json({ error: "Upgrade required to export reports" }, { status: 403 });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "export_download",
        resource: "investor_analysis_export",
        resourceId: app.id,
        meta: { context: app.context } as unknown as Prisma.InputJsonValue,
      },
    });

    const investorOutputs = (app.triage?.investorOutputs ?? {}) as Record<string, unknown>;
    const isAdvanced = app.context === "investor_advanced_analysis";

    const exportPayload = {
      watermark: "Peak Equity Optimizer — Investor Advanced Export",
      generatedAt: new Date().toISOString(),
      disclaimer:
        "This report is generated for informational purposes and is not an appraisal or legal advice.",
      analysisId: app.id,
      address: app.address,
      confidenceTier: app.triage?.confidenceTier,
      confidenceScore: app.triage?.confidenceScore,
      verifiedArv: investorOutputs.verifiedArv,
      marketArv: investorOutputs.marketArv,
      investorOutputs: {
        mao: investorOutputs.mao,
        seventyPercentMao: investorOutputs.seventyPercentMao,
        profit: investorOutputs.profit,
        roi: investorOutputs.roi,
        requiredProfit: investorOutputs.requiredProfit,
        totalCosts: investorOutputs.totalCosts,
        stressProfit: investorOutputs.stressProfit,
        riskBand: investorOutputs.riskBand,
        ...(isAdvanced
          ? {
              rehabTotal: investorOutputs.rehabTotal,
              dscr: investorOutputs.dscr,
              refiProceeds: investorOutputs.refiProceeds,
              cashOnCash: investorOutputs.cashOnCash,
              wholesaleSpread: investorOutputs.wholesaleSpread,
              annualCashFlow: investorOutputs.annualCashFlow,
              scenarios: investorOutputs.scenarios,
            }
          : {}),
      },
    };

    return NextResponse.json({ export: exportPayload });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
