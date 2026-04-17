import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionContext } from "@/lib/auth/session";
import { requireRole, INVESTOR_ROLES } from "@/lib/auth/rbac";
import { lintEventPayload } from "@/lib/events/pii-lint";
import { runInvestorAnalysis, filterInvestorResponse } from "@/lib/investor/engine";
import type { InvestorInputs, InvestorAdvancedInputs } from "@/lib/formulas/types";

const runSchema = z.object({
  purchasePrice: z.coerce.number().min(0).optional(),
  arv: z.coerce.number().min(0).optional(),
  repairs: z.coerce.number().min(0).optional(),
  holdMonths: z.coerce.number().min(0).optional(),
  purchaseClosingRate: z.coerce.number().min(0).optional(),
  dispositionCostRate: z.coerce.number().min(0).optional(),
  annualInterestRate: z.coerce.number().min(0).optional(),
  pointsRate: z.coerce.number().min(0).optional(),
  // Advanced fields
  monthlyRent: z.coerce.number().min(0).optional(),
  operatingExpenseRate: z.coerce.number().min(0).optional(),
  refiLtv: z.coerce.number().min(0).optional(),
  refiInterestRate: z.coerce.number().min(0).optional(),
  refiTermYears: z.coerce.number().min(0).optional(),
  contractPrice: z.coerce.number().min(0).optional(),
  cashInvested: z.coerce.number().min(0).optional(),
  rehabItems: z.array(z.object({
    category: z.string(),
    description: z.string(),
    quantity: z.coerce.number().min(0),
    unitCost: z.coerce.number().min(0),
    regionalMultiplier: z.coerce.number().optional(),
  })).optional(),
  globalRegionalMultiplier: z.coerce.number().min(0).optional(),
});

export async function POST(
  request: NextRequest,
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
    });

    if (!app) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!requireRole(session.role, ["admin_internal"]) && app.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = runSchema.safeParse(body);
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

    const existingInputs = (app.investorInputs ?? {}) as Partial<InvestorAdvancedInputs>;
    const isAdvanced = app.context === "investor_advanced_analysis";

    const baseInputs: InvestorInputs = {
      purchasePrice: parsed.data.purchasePrice ?? existingInputs.purchasePrice ?? 0,
      arv: parsed.data.arv ?? existingInputs.arv ?? 0,
      repairs: parsed.data.repairs ?? existingInputs.repairs ?? 0,
      holdMonths: parsed.data.holdMonths ?? existingInputs.holdMonths ?? 6,
      purchaseClosingRate: parsed.data.purchaseClosingRate ?? existingInputs.purchaseClosingRate ?? 0.02,
      dispositionCostRate: parsed.data.dispositionCostRate ?? existingInputs.dispositionCostRate ?? 0.09,
      annualInterestRate: parsed.data.annualInterestRate ?? existingInputs.annualInterestRate ?? 0.12,
      pointsRate: parsed.data.pointsRate ?? existingInputs.pointsRate ?? 0.02,
    };

    const advancedInputs: InvestorAdvancedInputs | undefined = isAdvanced ? {
      ...baseInputs,
      monthlyRent: parsed.data.monthlyRent ?? existingInputs.monthlyRent ?? 0,
      operatingExpenseRate: parsed.data.operatingExpenseRate ?? existingInputs.operatingExpenseRate ?? 0,
      refiLtv: parsed.data.refiLtv ?? existingInputs.refiLtv ?? 0,
      refiInterestRate: parsed.data.refiInterestRate ?? existingInputs.refiInterestRate ?? 0,
      refiTermYears: parsed.data.refiTermYears ?? existingInputs.refiTermYears ?? 0,
      contractPrice: parsed.data.contractPrice ?? existingInputs.contractPrice ?? 0,
      cashInvested: parsed.data.cashInvested ?? existingInputs.cashInvested ?? 0,
      rehabItems: parsed.data.rehabItems ?? existingInputs.rehabItems ?? [],
      globalRegionalMultiplier: parsed.data.globalRegionalMultiplier ?? existingInputs.globalRegionalMultiplier ?? 1,
    } : undefined;

    const result = await runInvestorAnalysis({
      applicationId: app.id,
      investorInputs: baseInputs,
      userId: session.userId,
      isAdvanced,
      advancedInputs,
    });

    return NextResponse.json({ analysis: filterInvestorResponse(result, session.role) });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
