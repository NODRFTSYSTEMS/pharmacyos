import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionContext } from "@/lib/auth/session";
import { requireRole, INVESTOR_ROLES } from "@/lib/auth/rbac";
import { filterInvestorResponse } from "@/lib/investor/engine";
import type { Prisma } from "@prisma/client";

export async function GET(
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

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "triage_view",
        resource: "investor_analysis",
        resourceId: app.id,
        meta: { tier: app.triage?.confidenceTier ?? null } as unknown as Prisma.InputJsonValue,
      },
    });

    const investorOutputs = (app.triage?.investorOutputs ?? {}) as Record<string, unknown>;
    const flags = (app.triage?.flags ?? []) as string[];
    const triggers = flags.filter((f) =>
      [
        "Data Quality Review",
        "Geographic Review",
        "Methodology Review",
        "Comp Expansion Review",
        "Valuation Sensitivity Review",
        "Standard Review",
        "Priority Review",
        "Model Override Review",
        "Address Verification Review",
      ].includes(f)
    );

    const isAdvanced = app.context === "investor_advanced_analysis";
    const isAdvancedRole = session.role === "investor_advanced" || session.role === "admin_internal";

    const result = {
      applicationId: app.id,
      propertyFacts: (app.propertyFacts ?? {}) as Record<string, unknown>,
      soldComps: [],
      activeListings: [],
      verifiedArv: (investorOutputs.verifiedArv as number) ?? 0,
      marketArv: (investorOutputs.marketArv as number) ?? 0,
      compQualityScore: (investorOutputs.compQualityScore as number) ?? 0,
      confidenceScore: app.triage?.confidenceScore ?? 0,
      confidenceTier: app.triage?.confidenceTier ?? "VERY_LOW",
      triggers,
      passTriggered: app.triage?.passTriggered ?? false,
      investorOutputs: {
        mao: (investorOutputs.mao as number) ?? 0,
        seventyPercentMao: (investorOutputs.seventyPercentMao as number) ?? 0,
        profit: (investorOutputs.profit as number) ?? 0,
        roi: (investorOutputs.roi as number) ?? 0,
        requiredProfit: (investorOutputs.requiredProfit as number) ?? 0,
        totalCosts: (investorOutputs.totalCosts as number) ?? 0,
        stressProfit: (investorOutputs.stressProfit as number) ?? 0,
        riskBand: (investorOutputs.riskBand as string) ?? "High",
        ...(isAdvancedRole ? {
          rehabTotal: (investorOutputs.rehabTotal as number) ?? 0,
          dscr: (investorOutputs.dscr as number) ?? 0,
          refiProceeds: (investorOutputs.refiProceeds as number) ?? 0,
          cashOnCash: (investorOutputs.cashOnCash as number) ?? 0,
          wholesaleSpread: (investorOutputs.wholesaleSpread as number) ?? 0,
          annualCashFlow: (investorOutputs.annualCashFlow as number) ?? 0,
          scenarios: (investorOutputs.scenarios as unknown) ?? undefined,
        } : {}),
      },
      recommendation: app.triage?.recommendation ?? "",
      isAdvanced,
    };

    return NextResponse.json({ analysis: filterInvestorResponse(result, session.role) });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
