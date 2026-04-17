import { describe, it, expect } from "vitest";
import {
  calculateSellerNet,
  calculateInvestorDeal,
  calculateRequiredProfit,
  calculateSeventyPercentMao,
  calculateCanonicalMao,
  calculateVerifiedArv,
  calculateMarketArv,
  calculateCompQualityScore,
  calculateStressProfit,
  calculateRiskBand,
} from "@/lib/formulas";

describe("Seller formulas (Layer E + F)", () => {
  it("calculates net proceeds with all inputs", () => {
    const result = calculateSellerNet({
      expectedSalePrice: 400000,
      mortgagePayoff: 200000,
      prepCosts: 5000,
      saleCostRate: 0.08,
      concessions: 3000,
    });
    expect(result.saleCosts).toBe(32000);
    expect(result.netBeforePayoff).toBe(360000);
    expect(result.netProceeds).toBe(160000);
  });

  it("calculates zero net proceeds when payoff equals net before payoff", () => {
    const result = calculateSellerNet({
      expectedSalePrice: 300000,
      mortgagePayoff: 276000,
      prepCosts: 0,
      saleCostRate: 0.08,
      concessions: 0,
    });
    expect(result.netProceeds).toBe(0);
  });

  it("handles zero prep costs and concessions", () => {
    const result = calculateSellerNet({
      expectedSalePrice: 500000,
      mortgagePayoff: 100000,
      prepCosts: 0,
      saleCostRate: 0.06,
      concessions: 0,
    });
    expect(result.saleCosts).toBe(30000);
    expect(result.netBeforePayoff).toBe(470000);
    expect(result.netProceeds).toBe(370000);
  });
});

describe("Investor formulas (Layer E + F)", () => {
  it("calculates required profit as 15% of ARV when above floor", () => {
    expect(calculateRequiredProfit(400000)).toBe(60000);
  });

  it("calculates required profit as floor when 15% is below $30,000", () => {
    expect(calculateRequiredProfit(100000)).toBe(30000);
  });

  it("calculates 70% rule MAO correctly", () => {
    expect(calculateSeventyPercentMao(400000, 50000)).toBe(230000);
  });

  it("calculates canonical MAO correctly", () => {
    // ARV 400k, repairs 50k, total costs 40k, required profit 60k
    // 400k - 50k - 40k - 60k = 250k
    expect(calculateCanonicalMao(400000, 50000, 40000)).toBe(250000);
  });

  it("returns full investor deal analysis", () => {
    const result = calculateInvestorDeal({
      purchasePrice: 200000,
      arv: 400000,
      repairs: 50000,
      holdMonths: 6,
      purchaseClosingRate: 0.02,
      dispositionCostRate: 0.09,
      annualInterestRate: 0.12,
      pointsRate: 0.02,
    });

    // purchase closing = 4,000
    // disposition = 36,000
    // points = 4,000
    // carry = 200,000 * 0.12 / 12 * 6 = 12,000
    // totalCosts = 56,000
    expect(result.totalCosts).toBe(56000);

    // requiredProfit = max(30k, 400k * 0.15) = 60,000
    expect(result.requiredProfit).toBe(60000);

    // canonicalMao = 400k - 50k - 56k - 60k = 234,000
    // seventyPercentMao = 400k * 0.7 - 50k = 230,000
    // mao = min(234k, 230k) = 230,000
    expect(result.seventyPercentMao).toBe(230000);
    expect(result.mao).toBe(230000);

    // profit = 400k - 200k - 50k - 56k = 94,000
    expect(result.profit).toBe(94000);

    // roi = 94k / 200k * 100 = 47%
    expect(result.roi).toBe(47);

    // stressProfit = (400k * 0.95) - 200k - (50k * 1.15) - 56k = 380k - 200k - 57.5k - 56k = 66,500
    expect(result.stressProfit).toBe(66500);
    expect(result.riskBand).toBe("Low");
  });

  it("uses canonical MAO when it is lower than 70% MAO", () => {
    const result = calculateInvestorDeal({
      purchasePrice: 100000,
      arv: 300000,
      repairs: 20000,
      holdMonths: 3,
      purchaseClosingRate: 0.02,
      dispositionCostRate: 0.09,
      annualInterestRate: 0.12,
      pointsRate: 0.02,
    });

    // totalCosts = 2,000 + 27,000 + 2,000 + 3,000 = 34,000
    expect(result.totalCosts).toBe(34000);

    // requiredProfit = max(30k, 300k * 0.15) = 45,000
    expect(result.requiredProfit).toBe(45000);

    // canonicalMao = 300k - 20k - 34k - 45k = 201,000
    // seventyPercentMao = 300k * 0.7 - 20k = 190,000
    // mao = min(201k, 190k) = 190,000
    expect(result.mao).toBe(190000);
    expect(result.riskBand).toBe("Low");
  });

  it("handles edge case with zero purchase price for ROI", () => {
    const result = calculateInvestorDeal({
      purchasePrice: 0,
      arv: 200000,
      repairs: 10000,
      holdMonths: 1,
      purchaseClosingRate: 0.02,
      dispositionCostRate: 0.09,
      annualInterestRate: 0.12,
      pointsRate: 0.02,
    });
    expect(result.roi).toBe(0);
  });

  it("calculates verified ARV as median of sold comps", () => {
    const comps = [
      { address: "A", salePrice: 300000, saleDate: "2026-01-01", squareFootage: 1500, bedrooms: 3, bathrooms: 2, distanceMiles: 0.2 },
      { address: "B", salePrice: 340000, saleDate: "2026-02-01", squareFootage: 1600, bedrooms: 3, bathrooms: 2, distanceMiles: 0.3 },
      { address: "C", salePrice: 320000, saleDate: "2026-03-01", squareFootage: 1550, bedrooms: 3, bathrooms: 2, distanceMiles: 0.4 },
    ];
    expect(calculateVerifiedArv(comps)).toBe(320000);
  });

  it("calculates market ARV as median of listings", () => {
    const listings = [
      { address: "A", listPrice: 310000, listingDate: "2026-03-01", squareFootage: 1500, bedrooms: 3, bathrooms: 2, distanceMiles: 0.2 },
      { address: "B", listPrice: 330000, listingDate: "2026-03-05", squareFootage: 1600, bedrooms: 3, bathrooms: 2, distanceMiles: 0.3 },
    ];
    expect(calculateMarketArv(listings)).toBe(320000);
  });

  it("scores comp quality based on distance, recency, and similarity", () => {
    const subject = { squareFootage: 1800, bedrooms: 3, bathrooms: 2, yearBuilt: 1995, propertyType: "Single Family", lotSize: 6500, taxAssessment: 320000, estimatedValue: 350000, lastSaleDate: "2020-01-01" };
    const comp = { address: "A", salePrice: 350000, saleDate: "2026-03-01", squareFootage: 1800, bedrooms: 3, bathrooms: 2, distanceMiles: 0.2 };
    const score = calculateCompQualityScore(comp, subject);
    expect(score).toBeGreaterThanOrEqual(80);
  });

  it("calculates stress profit correctly", () => {
    const inputs = {
      purchasePrice: 200000,
      arv: 400000,
      repairs: 50000,
      holdMonths: 6,
      purchaseClosingRate: 0.02,
      dispositionCostRate: 0.09,
      annualInterestRate: 0.12,
      pointsRate: 0.02,
    };
    // stress profit = (400k * 0.95) - 200k - (50k * 1.15) - 56k = 66500
    expect(calculateStressProfit(inputs)).toBe(66500);
  });

  it("assigns risk bands based on profit, ROI, and confidence", () => {
    expect(calculateRiskBand(50000, 20, "HIGH")).toBe("Low");
    expect(calculateRiskBand(50000, 20, "MEDIUM")).toBe("Moderate");
    expect(calculateRiskBand(20000, 10, "LOW")).toBe("Elevated");
    expect(calculateRiskBand(5000, 3, "VERY_LOW")).toBe("High");
  });
});
