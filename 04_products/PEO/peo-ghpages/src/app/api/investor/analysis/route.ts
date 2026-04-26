import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionContext } from "@/lib/auth/session";
import { requireRole, INVESTOR_ROLES } from "@/lib/auth/rbac";
import { lintEventPayload } from "@/lib/events/pii-lint";
import { runInvestorAnalysis, filterInvestorResponse } from "@/lib/investor/engine";
import type { Prisma } from "@prisma/client";

const createSchema = z.object({
  address: z.string().min(1),
  purchasePrice: z.coerce.number().min(0),
  arv: z.coerce.number().min(0),
  repairs: z.coerce.number().min(0),
  holdMonths: z.coerce.number().min(0).default(6),
  purchaseClosingRate: z.coerce.number().min(0).default(0.02),
  dispositionCostRate: z.coerce.number().min(0).default(0.09),
  annualInterestRate: z.coerce.number().min(0).default(0.12),
  pointsRate: z.coerce.number().min(0).default(0.02),
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

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session || !requireRole(session.role, INVESTOR_ROLES)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createSchema.safeParse(body);
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

    const data = parsed.data;
    const isAdvanced = session.role === "investor_advanced" || session.role === "admin_internal";
    const context = isAdvanced ? "investor_advanced_analysis" : "investor_basic_analysis";

    const app = await prisma.sellerApplication.create({
      data: {
        userId: session.userId,
        context,
        address: data.address,
        investorInputs: data as unknown as Prisma.InputJsonValue,
      },
    });

    const baseInputs = {
      purchasePrice: data.purchasePrice,
      arv: data.arv,
      repairs: data.repairs,
      holdMonths: data.holdMonths,
      purchaseClosingRate: data.purchaseClosingRate,
      dispositionCostRate: data.dispositionCostRate,
      annualInterestRate: data.annualInterestRate,
      pointsRate: data.pointsRate,
    };

    const advancedInputs = isAdvanced ? {
      ...baseInputs,
      monthlyRent: data.monthlyRent ?? 0,
      operatingExpenseRate: data.operatingExpenseRate ?? 0,
      refiLtv: data.refiLtv ?? 0,
      refiInterestRate: data.refiInterestRate ?? 0,
      refiTermYears: data.refiTermYears ?? 0,
      contractPrice: data.contractPrice ?? 0,
      cashInvested: data.cashInvested ?? 0,
      rehabItems: data.rehabItems ?? [],
      globalRegionalMultiplier: data.globalRegionalMultiplier ?? 1,
    } : undefined;

    const result = await runInvestorAnalysis({
      applicationId: app.id,
      investorInputs: baseInputs,
      userId: session.userId,
      isAdvanced,
      advancedInputs,
    });

    return NextResponse.json(
      { analysis: filterInvestorResponse(result, session.role) },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session || !requireRole(session.role, INVESTOR_ROLES)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const analyses = await prisma.sellerApplication.findMany({
      where: {
        userId: session.userId,
        context: { in: ["investor_basic_analysis", "investor_advanced_analysis"] },
      },
      orderBy: { createdAt: "desc" },
      include: { triage: true },
    });

    return NextResponse.json({ analyses });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
