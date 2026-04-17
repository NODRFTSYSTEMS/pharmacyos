import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateSellerNet, calculateInvestorDeal } from "@/lib/formulas";
import { calculateRefiProceeds, calculateCashOnCash, calculateWholesaleSpread } from "@/lib/formulas/investor-advanced";
import { mortgagePmt } from "@/lib/formulas/calculations";
import { lintEventPayload } from "@/lib/events/pii-lint";

const sellerSchema = z.object({
  mode: z.literal("seller"),
  expectedSalePrice: z.coerce.number().min(0),
  mortgagePayoff: z.coerce.number().min(0),
  prepCosts: z.coerce.number().min(0),
  saleCostRate: z.coerce.number().min(0).max(1),
  concessions: z.coerce.number().min(0),
});

const investorSchema = z.object({
  mode: z.literal("investor"),
  purchasePrice: z.coerce.number().min(0),
  arv: z.coerce.number().min(0),
  repairs: z.coerce.number().min(0),
  holdMonths: z.coerce.number().min(0).max(120),
  purchaseClosingRate: z.coerce.number().min(0).max(1),
  dispositionCostRate: z.coerce.number().min(0).max(1),
  annualInterestRate: z.coerce.number().min(0).max(2),
  pointsRate: z.coerce.number().min(0).max(1),
});

const brrrrSchema = z.object({
  mode: z.literal("brrrr"),
  purchasePrice: z.coerce.number().min(0),
  repairs: z.coerce.number().min(0),
  arv: z.coerce.number().min(0),
  refiLtv: z.coerce.number().min(0).max(1).default(0.75),
  refiInterestRate: z.coerce.number().min(0).max(2).default(0.075),
  monthlyRent: z.coerce.number().min(0).default(0),
  operatingExpenseRate: z.coerce.number().min(0).max(1).default(0.35),
});

const wholesaleSchema = z.object({
  mode: z.literal("wholesale"),
  askPrice: z.coerce.number().min(0),
  arv: z.coerce.number().min(0),
  repairs: z.coerce.number().min(0),
  assignmentFee: z.coerce.number().min(0).default(15000),
});

const requestSchema = z.union([sellerSchema, investorSchema, brrrrSchema, wholesaleSchema]);

function calcSuggestedEMD(offerPrice: number): number {
  if (offerPrice >= 500_000) return Math.round(offerPrice * 0.02);
  if (offerPrice >= 200_000) return Math.round(offerPrice * 0.025);
  return Math.round(offerPrice * 0.03);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // PII lint on all estimator payloads
    const lint = lintEventPayload(body);
    if (!lint.clean) {
      return NextResponse.json(
        { error: "PII detected in payload", violations: lint.violations },
        { status: 400 }
      );
    }

    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (data.mode === "seller") {
      const result = calculateSellerNet({
        expectedSalePrice: data.expectedSalePrice,
        mortgagePayoff: data.mortgagePayoff,
        prepCosts: data.prepCosts,
        saleCostRate: data.saleCostRate,
        concessions: data.concessions,
      });
      return NextResponse.json({ mode: "seller", result });
    }

    if (data.mode === "investor") {
      const result = calculateInvestorDeal({
        purchasePrice: data.purchasePrice,
        arv: data.arv,
        repairs: data.repairs,
        holdMonths: data.holdMonths,
        purchaseClosingRate: data.purchaseClosingRate,
        dispositionCostRate: data.dispositionCostRate,
        annualInterestRate: data.annualInterestRate,
        pointsRate: data.pointsRate,
      });
      return NextResponse.json({ mode: "investor", result });
    }

    if (data.mode === "brrrr") {
      const totalCost = data.purchasePrice + data.repairs;
      const refiProceeds = calculateRefiProceeds(data.arv, data.refiLtv);
      const cashLeftIn = Math.max(0, totalCost - refiProceeds);
      const monthlyPayment = mortgagePmt(refiProceeds, data.refiInterestRate, 30);
      const monthlyCashFlow = data.monthlyRent * (1 - data.operatingExpenseRate) - monthlyPayment;
      const cashOnCash = cashLeftIn > 0 ? calculateCashOnCash(monthlyCashFlow * 12, cashLeftIn) : 0;
      const equityCapture = data.arv - totalCost;

      return NextResponse.json({
        mode: "brrrr",
        result: {
          refiProceeds: Math.round(refiProceeds),
          cashLeftIn: Math.round(cashLeftIn),
          monthlyPayment: Math.round(monthlyPayment),
          monthlyCashFlow: Math.round(monthlyCashFlow),
          cashOnCash: Number(cashOnCash.toFixed(2)),
          equityCapture: Math.round(equityCapture),
        },
      });
    }

    // wholesale
    const maxOffer = calculateWholesaleSpread(data.askPrice, 0) <= 0
      ? data.arv * 0.7 - data.repairs - data.assignmentFee
      : data.arv * 0.7 - data.repairs - data.assignmentFee;

    const spread = calculateWholesaleSpread(data.askPrice, maxOffer);
    const emd = calcSuggestedEMD(maxOffer > 0 ? maxOffer : data.askPrice);
    const viable = spread >= 5000;

    return NextResponse.json({
      mode: "wholesale",
      result: {
        maxOffer: Math.round(maxOffer),
        spread: Math.round(spread),
        assignmentFee: data.assignmentFee,
        emd: Math.round(emd),
        viability: viable ? 1 : 0,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
