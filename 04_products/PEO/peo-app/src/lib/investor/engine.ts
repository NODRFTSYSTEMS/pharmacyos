import { prisma } from "@/lib/db";
import { fetchPropertyFacts, fetchSoldComps, fetchActiveListings } from "@/lib/property-data/rentcast";
import type { CompRecord, ListingRecord, PropertyFacts } from "@/lib/property-data/stub";
import { runTriage } from "@/lib/triage/engine";
import {
  calculateInvestorDeal,
  calculateVerifiedArv,
  calculateMarketArv,
  calculateCompQualityScore,
  calculateInvestorAdvancedDeal,
} from "@/lib/formulas";
import type { InvestorInputs, InvestorAdvancedInputs } from "@/lib/formulas/types";
import type { Prisma } from "@prisma/client";

export interface RunInvestorAnalysisOptions {
  applicationId: string;
  investorInputs: InvestorInputs;
  userId: string;
}

export interface InvestorAnalysisResult {
  applicationId: string;
  propertyFacts: PropertyFacts;
  soldComps: CompRecord[];
  activeListings: ListingRecord[];
  verifiedArv: number;
  marketArv: number;
  compQualityScore: number;
  confidenceScore: number;
  confidenceTier: string;
  triggers: string[];
  passTriggered: boolean;
  investorOutputs: ReturnType<typeof calculateInvestorDeal> | (ReturnType<typeof calculateInvestorDeal> & import("@/lib/formulas/types").InvestorAdvancedOutputs);
  recommendation: string;
  isAdvanced: boolean;
}

export async function runInvestorAnalysis(
  options: RunInvestorAnalysisOptions & { isAdvanced?: boolean; advancedInputs?: InvestorAdvancedInputs }
): Promise<InvestorAnalysisResult> {
  const { applicationId, investorInputs, isAdvanced = false, advancedInputs } = options;

  const inputsForPass = advancedInputs ?? investorInputs;

  // Update application with investor inputs before fetching data
  const app = await prisma.sellerApplication.update({
    where: { id: applicationId },
    data: {
      investorInputs: inputsForPass as unknown as Prisma.InputJsonValue,
    },
  });

  // Fetch all property data in parallel — one round-trip batch to preserve API credits
  const [realPropertyFacts, realSoldComps, realActiveListings] = await Promise.all([
    fetchPropertyFacts(app.address),
    fetchSoldComps(app.address),
    fetchActiveListings(app.address),
  ]);

  // Update application with fetched facts
  await prisma.sellerApplication.update({
    where: { id: applicationId },
    data: {
      addressConfirmed: true,
      propertyFacts: realPropertyFacts as unknown as Prisma.InputJsonValue,
    },
  });

  // Calculate ARVs
  const verifiedArv = calculateVerifiedArv(realSoldComps);
  const marketArv = calculateMarketArv(realActiveListings);

  // Comp quality score (average across comps)
  const compQualityScore =
    realSoldComps.length > 0
      ? realSoldComps.reduce((sum, c) => sum + calculateCompQualityScore(c, realPropertyFacts), 0) /
        realSoldComps.length
      : 0;

  const baseDealForPass = isAdvanced && advancedInputs
    ? calculateInvestorAdvancedDeal(advancedInputs)
    : calculateInvestorDeal(investorInputs, "HIGH");

  // Triage engine
  const triageResult = runTriage({
    addressConfirmed: true,
    hasPropertyFacts: !!realPropertyFacts,
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
      qualifiedCompCount: realSoldComps.length,
      sameSubdivisionCompCount: 1,
      radiusMiles: 0.5,
      compQualityScore,
      timeAdjustmentRequired: false,
    },
    valuation: {
      valueRangePercent: 12,
      strongCompSupport: realSoldComps.length >= 3,
      recentMarketActivity: true,
      limitedMarketActivity: false,
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
      expectedProfit: baseDealForPass.profit,
      roi: baseDealForPass.roi,
      stressProfit: baseDealForPass.stressProfit,
      requiredProfitFloor: 30000,
    },
  });

  // Investor deal calculation
  const investorOutputs = isAdvanced && advancedInputs
    ? calculateInvestorAdvancedDeal(advancedInputs)
    : calculateInvestorDeal(investorInputs, triageResult.confidenceTier);

  // Persist triage result with investor outputs
  await prisma.triageResult.upsert({
    where: { applicationId },
    create: {
      applicationId,
      engineVersion: "1.1",
      formulaVersion: "1.0",
      confidenceScore: triageResult.confidenceScore,
      confidenceTier: triageResult.confidenceTier,
      flags: [...triageResult.flags, ...triageResult.triggers, ...triageResult.passTriggers] as unknown as Prisma.InputJsonValue,
      recommendation: triageResult.recommendation,
      passTriggered: triageResult.passTriggered,
      investorOutputs: {
        verifiedArv,
        marketArv,
        compQualityScore: Number(compQualityScore.toFixed(2)),
        ...investorOutputs,
      } as unknown as Prisma.InputJsonValue,
    },
    update: {
      confidenceScore: triageResult.confidenceScore,
      confidenceTier: triageResult.confidenceTier,
      flags: [...triageResult.flags, ...triageResult.triggers, ...triageResult.passTriggers] as unknown as Prisma.InputJsonValue,
      recommendation: triageResult.recommendation,
      passTriggered: triageResult.passTriggered,
      investorOutputs: {
        verifiedArv,
        marketArv,
        compQualityScore: Number(compQualityScore.toFixed(2)),
        ...investorOutputs,
      } as unknown as Prisma.InputJsonValue,
      updatedAt: new Date(),
    },
  });

  return {
    applicationId: app.id,
    propertyFacts: realPropertyFacts,
    soldComps: realSoldComps,
    activeListings: realActiveListings,
    verifiedArv,
    marketArv,
    compQualityScore: Number(compQualityScore.toFixed(2)),
    confidenceScore: triageResult.confidenceScore,
    confidenceTier: triageResult.confidenceTier,
    triggers: triageResult.triggers,
    passTriggered: triageResult.passTriggered,
    investorOutputs,
    recommendation: triageResult.recommendation,
    isAdvanced,
  };
}

export function filterInvestorResponse(result: InvestorAnalysisResult, role?: string) {
  if (result.passTriggered) {
    return {
      applicationId: result.applicationId,
      analysisUnavailable: true,
      disclosure:
        "This analysis cannot proceed based on the current inputs and market data. Adjust your assumptions or contact support.",
      confidenceTier: result.confidenceTier,
      passTriggered: true,
    };
  }

  const isAdvancedRole = role === "investor_advanced" || role === "admin_internal";

  const baseResponse: Record<string, unknown> = {
    applicationId: result.applicationId,
    propertyFacts: result.propertyFacts,
    soldComps: result.soldComps.map((c) => ({
      address: c.address,
      salePrice: c.salePrice,
      saleDate: c.saleDate,
      squareFootage: c.squareFootage,
      bedrooms: c.bedrooms,
      bathrooms: c.bathrooms,
      distanceMiles: c.distanceMiles,
      // Advanced role gets comp quality detail
      ...(isAdvancedRole ? { compQuality: calculateCompQualityScore(c, result.propertyFacts) } : {}),
    })),
    verifiedArv: result.verifiedArv,
    marketArv: result.marketArv,
    marketArvReference: true,
    compQualityScore: result.compQualityScore,
    confidenceScore: result.confidenceScore,
    confidenceTier: result.confidenceTier,
    triggers: result.triggers,
    recommendation: result.recommendation,
    investorOutputs: result.investorOutputs,
    passTriggered: false,
    isAdvanced: result.isAdvanced,
  };

  return baseResponse;
}
