// DEV-ONLY: Stateless seller analysis — no auth, no DB.
// Returns full seller-focused analysis: property facts, AVM, net proceeds, comps, listings, readiness.
// Auto-disabled when NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is a real key.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchPropertyFacts, fetchAvmData, fetchActiveListings } from "@/lib/property-data/rentcast";
import { runTriage } from "@/lib/triage/engine";
import { getDefaultItems } from "@/lib/readiness/generator";

const schema = z.object({
  address: z.string().min(1),
  expectedSalePrice: z.coerce.number().min(0).optional(),
  mortgagePayoff: z.coerce.number().min(0).optional(),
  timeline: z.string().optional(),
});

function isDevEnv() {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
  const clerkConfigured = clerkKey.startsWith("pk_") && clerkKey !== "pk_test_replace_me" && clerkKey.length > 30;
  return !clerkConfigured && process.env.NODE_ENV === "development";
}

function median(vals: number[]): number | null {
  if (!vals.length) return null;
  const sorted = [...vals].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export async function POST(request: NextRequest) {
  if (!isDevEnv()) {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }

    const data = parsed.data;

    const [propertyFacts, avmData, activeListings] = await Promise.all([
      fetchPropertyFacts(data.address),
      fetchAvmData(data.address),
      fetchActiveListings(data.address),
    ]);

    // Confidence scoring via triage engine (used for data quality indicator only)
    const triageResult = runTriage({
      addressConfirmed: true,
      hasPropertyFacts: Object.keys(propertyFacts).length > 0,
      expectedSalePrice: data.expectedSalePrice,
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
        qualifiedCompCount: avmData.comps.length,
        sameSubdivisionCompCount: Math.min(1, avmData.comps.length),
        radiusMiles: 0.5,
        compQualityScore: 75,
        timeAdjustmentRequired: false,
      },
      valuation: {
        valueRangePercent: 12,
        strongCompSupport: avmData.comps.length >= 3,
        recentMarketActivity: true,
        limitedMarketActivity: avmData.comps.length < 2,
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
        expectedProfit: 50000,
        roi: 20,
        stressProfit: 50000,
        requiredProfitFloor: 30000,
      },
    });

    // Net proceeds calculation
    const salePrice = data.expectedSalePrice ?? avmData.price ?? 0;
    const agentCommission = Math.round(salePrice * 0.06);
    const closingCosts = Math.round(salePrice * 0.02);
    const mortgagePayoff = data.mortgagePayoff ?? 0;
    const netProceeds = Math.round(salePrice - agentCommission - closingCosts - mortgagePayoff);

    // Market summary
    const compPrices = avmData.comps.map((c) => c.salePrice).filter((p) => p > 0);
    const compPpsf = avmData.comps
      .filter((c) => c.squareFootage > 0 && c.salePrice > 0)
      .map((c) => c.salePrice / c.squareFootage);

    const medianSoldPrice = median(compPrices);
    const avgPricePerSqft = compPpsf.length
      ? Math.round(compPpsf.reduce((a, b) => a + b, 0) / compPpsf.length)
      : null;

    const applicationId = `dev-${Date.now()}`;
    const readinessItems = getDefaultItems().map((item, i) => ({
      id: `dev-item-${i}`,
      category: item.category,
      title: item.title,
      description: item.description,
      completed: false,
    }));

    const application = {
      id: applicationId,
      status: "analysis_complete",
      address: data.address,
      askingPrice: salePrice || null,
      mortgagePayoff: data.mortgagePayoff ?? null,
      timeline: data.timeline ?? null,
      propertyFacts,
      avm: {
        price: avmData.price,
        priceRangeLow: avmData.priceRangeLow,
        priceRangeHigh: avmData.priceRangeHigh,
      },
      sellerNet: {
        salePrice,
        agentCommission,
        closingCosts,
        mortgagePayoff,
        netProceeds,
      },
      soldComps: avmData.comps,
      activeListings,
      marketSummary: {
        medianSoldPrice,
        avgPricePerSqft,
        compCount: avmData.comps.length,
        activeListingCount: activeListings.length,
      },
      confidence: {
        score: triageResult.confidenceScore,
        tier: triageResult.confidenceTier,
        flags: [...triageResult.flags, ...triageResult.triggers],
      },
      readiness: {
        id: `dev-plan-${applicationId}`,
        summary: "Complete these steps before listing your home.",
        items: readinessItems,
      },
    };

    return NextResponse.json({ application }, { status: 201 });
  } catch (err) {
    console.error("[/api/test/seller-analysis] Unhandled error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
