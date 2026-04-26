// DEV-ONLY: Stateless investor analysis — no auth, no DB.
// Returns the same response shape as /api/investor/analysis so the form works end-to-end.
// Auto-disabled when NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is a real key.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  fetchPropertyFacts,
  fetchSoldComps,
  fetchActiveListings,
} from "@/lib/property-data/rentcast";
import { runTriage } from "@/lib/triage/engine";
import {
  calculateInvestorDeal,
  calculateInvestorAdvancedDeal,
  calculateVerifiedArv,
  calculateMarketArv,
  calculateCompQualityScore,
} from "@/lib/formulas";
import { calculateMarketVelocity } from "@/lib/formulas/calculations";

const killSwitchIds = [
  "foundation", "knob-tube", "galvanized-plumbing", "active-roof-leak",
  "lead-paint", "moisture-mold", "unpermitted-work", "failed-septic", "hvac-replacement",
] as const;

const schema = z.object({
  address: z.string().min(1),
  purchasePrice: z.coerce.number().min(0),
  arv: z.coerce.number().min(0),
  repairs: z.coerce.number().min(0),
  holdMonths: z.coerce.number().min(0).default(6),
  purchaseClosingRate: z.coerce.number().min(0).default(0.02),
  dispositionCostRate: z.coerce.number().min(0).default(0.09),
  annualInterestRate: z.coerce.number().min(0).default(0.12),
  pointsRate: z.coerce.number().min(0).default(0.02),
  activeKillSwitches: z.array(z.enum(killSwitchIds)).optional().default([]),
  investorProfile: z.enum(["conservative", "balanced", "aggressive"]).optional().default("balanced"),
  monthlyRent: z.coerce.number().min(0).optional(),
  operatingExpenseRate: z.coerce.number().min(0).optional(),
  refiLtv: z.coerce.number().min(0).optional(),
  refiInterestRate: z.coerce.number().min(0).optional(),
  refiTermYears: z.coerce.number().min(0).optional(),
  contractPrice: z.coerce.number().min(0).optional(),
  cashInvested: z.coerce.number().min(0).optional(),
  globalRegionalMultiplier: z.coerce.number().min(0).optional(),
  rehabItems: z.array(z.object({
    category: z.string(),
    description: z.string(),
    quantity: z.coerce.number().min(0),
    unitCost: z.coerce.number().min(0),
    regionalMultiplier: z.coerce.number().optional(),
  })).optional(),
});

function isDevEnv() {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
  const clerkConfigured = clerkKey.startsWith("pk_") && clerkKey !== "pk_test_replace_me" && clerkKey.length > 30;
  return !clerkConfigured && process.env.NODE_ENV === "development";
}

export async function POST(request: NextRequest) {
  if (!isDevEnv()) {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    return await handlePost(request);
  } catch (err) {
    console.error("[/api/test/analysis] Unhandled error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handlePost(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;
  const hasAdvanced = !!(data.monthlyRent || data.refiLtv || data.contractPrice);

  const [propertyFacts, soldComps, activeListings] = await Promise.all([
    fetchPropertyFacts(data.address),
    fetchSoldComps(data.address),
    fetchActiveListings(data.address),
  ]);

  const verifiedArv = calculateVerifiedArv(soldComps);
  const marketArv = calculateMarketArv(activeListings);
  const compQualityScore =
    soldComps.length > 0
      ? soldComps.reduce((sum, c) => sum + calculateCompQualityScore(c, propertyFacts), 0) / soldComps.length
      : 0;

  const baseInputs = {
    purchasePrice: data.purchasePrice,
    arv: data.arv,
    repairs: data.repairs,
    holdMonths: data.holdMonths,
    purchaseClosingRate: data.purchaseClosingRate,
    dispositionCostRate: data.dispositionCostRate,
    annualInterestRate: data.annualInterestRate,
    pointsRate: data.pointsRate,
    activeKillSwitches: data.activeKillSwitches,
    investorProfile: data.investorProfile,
  };

  const advancedInputs = hasAdvanced ? {
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

  const baseForTriage = hasAdvanced && advancedInputs
    ? calculateInvestorAdvancedDeal(advancedInputs)
    : calculateInvestorDeal(baseInputs, "HIGH");

  const triageResult = runTriage({
    addressConfirmed: true,
    hasPropertyFacts: Object.keys(propertyFacts).length > 0,
    expectedSalePrice: verifiedArv,
    missingUploads: 0,
    data: {
      primarySource: true,
      noMaterialConflicts: true,
      dataAgeDays: 15,
      secondarySource: false,
      materialConflictsResolved: true,
      estimatedFields: 0,
    },
    comp: {
      qualifiedCompCount: soldComps.length,
      sameSubdivisionCompCount: Math.min(1, soldComps.length),
      radiusMiles: 0.5,
      compQualityScore: Number(compQualityScore.toFixed(2)),
      timeAdjustmentRequired: false,
    },
    valuation: {
      valueRangePercent: 12,
      strongCompSupport: soldComps.length >= 3,
      recentMarketActivity: true,
      limitedMarketActivity: soldComps.length < 2,
    },
    model: {
      allFormulasExecuted: true,
      defaultsTriggered: 0,
      overrideEvents: 0,
      keyAssumptionsConfirmed: true,
    },
    pass: {
      canGeocodeAddress: true,
      propertyTypeReconcilable: true,
      expectedProfit: baseForTriage.profit,
      roi: baseForTriage.roi,
      stressProfit: baseForTriage.stressProfit,
      requiredProfitFloor: 0,
    },
  });

  const investorOutputs = hasAdvanced && advancedInputs
    ? calculateInvestorAdvancedDeal(advancedInputs, triageResult.confidenceTier)
    : calculateInvestorDeal(baseInputs, triageResult.confidenceTier);

  const marketVelocity = calculateMarketVelocity(
    soldComps.map((c) => ({
      price: c.salePrice,
      sqft: c.squareFootage,
      daysOnMarket: c.daysOnMarket,
      distanceMiles: c.distanceMiles,
    })),
    activeListings.map((l) => ({
      price: l.price || l.listPrice || 0,
      sqft: l.squareFootage || l.sqft || 0,
      daysOnMarket: l.daysOnMarket,
      distanceMiles: l.distanceMiles,
    }))
  );

  const applicationId = `dev-${Date.now()}`;

  if (triageResult.passTriggered) {
    return NextResponse.json({
      analysis: {
        applicationId,
        analysisUnavailable: true,
        disclosure: "This analysis cannot proceed based on the current inputs and market data. Adjust your assumptions or contact support.",
        confidenceTier: triageResult.confidenceTier,
        passTriggered: true,
      },
    }, { status: 201 });
  }

  return NextResponse.json({
    analysis: {
      applicationId,
      propertyFacts,
      soldComps: soldComps.map((c) => ({
        ...c,
        compQuality: Number(calculateCompQualityScore(c, propertyFacts).toFixed(2)),
      })),
      verifiedArv,
      marketArv,
      marketArvReference: true,
      compQualityScore: Number(compQualityScore.toFixed(2)),
      confidenceScore: triageResult.confidenceScore,
      confidenceTier: triageResult.confidenceTier,
      triggers: triageResult.triggers,
      recommendation: triageResult.recommendation,
      investorOutputs,
      marketVelocity,
      passTriggered: false,
      isAdvanced: hasAdvanced,
    },
  }, { status: 201 });
}
