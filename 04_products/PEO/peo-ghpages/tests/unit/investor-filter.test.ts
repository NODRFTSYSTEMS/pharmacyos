import { describe, it, expect } from "vitest";
import { filterInvestorResponse } from "@/lib/investor/engine";
import type { InvestorAnalysisResult } from "@/lib/investor/engine";

function makeResult(passTriggered: boolean): InvestorAnalysisResult {
  return {
    applicationId: "app-1",
    propertyFacts: { squareFootage: 1800, yearBuilt: 1995, bedrooms: 3, bathrooms: 2, lotSize: 6500, propertyType: "Single Family", estimatedValue: 350000, taxAssessment: 320000, lastSaleDate: "2020-01-01" },
    soldComps: [
      { address: "123 A St", salePrice: 300000, saleDate: "2026-01-01", squareFootage: 1800, bedrooms: 3, bathrooms: 2, distanceMiles: 0.2 },
    ],
    activeListings: [],
    verifiedArv: 310000,
    marketArv: 320000,
    compQualityScore: 85,
    confidenceScore: 88,
    confidenceTier: "HIGH",
    triggers: [],
    passTriggered,
    investorOutputs: {
      mao: 200000,
      seventyPercentMao: 210000,
      profit: 50000,
      roi: 25,
      requiredProfit: 46500,
      totalCosts: 45000,
      stressProfit: 40000,
      riskBand: "Low",
    },
    recommendation: "Proceed",
    isAdvanced: false,
  };
}

describe("Investor response filtering", () => {
  it("hides PASS trigger details and shows generic disclosure when passTriggered is true", () => {
    const result = filterInvestorResponse(makeResult(true));
    expect(result.analysisUnavailable).toBe(true);
    expect(result.passTriggered).toBe(true);
    expect(result).not.toHaveProperty("investorOutputs");
    expect(result).not.toHaveProperty("verifiedArv");
    expect((result as { disclosure?: string }).disclosure).toBeDefined();
  });

  it("exposes full investor outputs when passTriggered is false", () => {
    const result = filterInvestorResponse(makeResult(false));
    expect(result.passTriggered).toBe(false);
    expect(result.verifiedArv).toBe(310000);
    expect(result.marketArv).toBe(320000);
    expect(result.marketArvReference).toBe(true);
    const io = result.investorOutputs as { mao: number; stressProfit: number; riskBand: string };
    expect(io.mao).toBe(200000);
    expect(io.stressProfit).toBe(40000);
    expect(io.riskBand).toBe("Low");
  });

  it("includes confidence tier and score in both pass and normal cases", () => {
    const normal = filterInvestorResponse(makeResult(false));
    expect(normal.confidenceTier).toBe("HIGH");
    expect(normal.confidenceScore).toBe(88);

    const pass = filterInvestorResponse(makeResult(true));
    expect(pass.confidenceTier).toBe("HIGH");
  });
});
