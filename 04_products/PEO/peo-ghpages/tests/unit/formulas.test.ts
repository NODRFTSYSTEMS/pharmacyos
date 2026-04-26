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
  calculateKillSwitchAdjustment,
  calculateDealGrade,
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
    // loan = 200k * 0.8 = 160k
    // points = 160k * 0.02 = 3,200
    // carry = 160k * 0.12 / 12 * 6 = 9,600
    // totalCosts = 4,000 + 36,000 + 3,200 + 9,600 = 52,800
    expect(result.totalCosts).toBe(52800);

    // requiredProfit = max(30k, 400k * 0.15) = 60,000
    expect(result.requiredProfit).toBe(60000);

    // canonicalMao = 400k - 50k - 52.8k - 60k = 237,200
    // seventyPercentMao = 400k * 0.7 - 50k = 230,000
    // mao = min(237.2k, 230k) = 230,000
    expect(result.seventyPercentMao).toBe(230000);
    expect(result.mao).toBe(230000);

    // profit = 400k - 200k - 50k - 52.8k = 97,200
    expect(result.profit).toBe(97200);

    // cashInvested = 40k down + 50k repairs + 4k closing + 3.2k points = 97,200
    // roi = 97.2k / 97.2k * 100 = 100%
    expect(result.roi).toBe(100);

    // stressProfit = (400k * 0.95) - 200k - (50k * 1.15) - 52.8k = 380k - 200k - 57.5k - 52.8k = 69,700
    expect(result.stressProfit).toBe(69700);
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

    // totalCosts = 2,000 + 27,000 + 1,600 + 2,400 = 33,000
    expect(result.totalCosts).toBe(33000);

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
    // cashInvested = 0 down + 10k repairs + 0 closing + 0 points = 10,000
    // profit = 200k - 0 - 10k - (0 + 18k + 0 + 0) = 172,000
    // roi = 172k / 10k * 100 = 1720%
    expect(result.roi).toBe(1720);
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
    // stress profit = (400k * 0.95) - 200k - (50k * 1.15) - 52.8k = 69700
    expect(calculateStressProfit(inputs)).toBe(69700);
  });

  it("assigns risk bands based on profit, ROI, and confidence", () => {
    expect(calculateRiskBand(50000, 20, "HIGH")).toBe("Low");
    expect(calculateRiskBand(50000, 20, "MEDIUM")).toBe("Moderate");
    expect(calculateRiskBand(20000, 10, "LOW")).toBe("Elevated");
    expect(calculateRiskBand(5000, 3, "VERY_LOW")).toBe("High");
  });

  it("deduplicates duplicate kill switch IDs", () => {
    // Two foundation switches should cost the same as one
    const single = calculateKillSwitchAdjustment(["foundation"]);
    const duplicate = calculateKillSwitchAdjustment(["foundation", "foundation"]);
    expect(single).toBe(duplicate);
    expect(single).toBe(31500); // (18000 + 45000) / 2
  });

  it("calculates kill switch adjustment for multiple switches", () => {
    const adjustment = calculateKillSwitchAdjustment(["foundation", "knob-tube", "lead-paint"]);
    // foundation: 31500, knob-tube: 13000, lead-paint: 4250
    expect(adjustment).toBe(48750);
  });

  it("applies kill switch adjustment to deal calculations", () => {
    const base = calculateInvestorDeal({
      purchasePrice: 200000,
      arv: 400000,
      repairs: 50000,
      holdMonths: 6,
      purchaseClosingRate: 0.02,
      dispositionCostRate: 0.09,
      annualInterestRate: 0.12,
      pointsRate: 0.02,
    });
    const withKillSwitch = calculateInvestorDeal({
      purchasePrice: 200000,
      arv: 400000,
      repairs: 50000,
      holdMonths: 6,
      purchaseClosingRate: 0.02,
      dispositionCostRate: 0.09,
      annualInterestRate: 0.12,
      pointsRate: 0.02,
      activeKillSwitches: ["foundation"],
    });
    expect(withKillSwitch.mao).toBeLessThan(base.mao);
    expect(withKillSwitch.profit).toBeLessThan(base.profit);
    expect(withKillSwitch.killSwitchAdjustment).toBe(31500);
  });

  it("grades deals using profile-aware thresholds", () => {
    // Same deal: 14% ROI, $25k profit, $10k stress profit
    // Conservative: requires 22% / $40k → penalized
    const conservative = calculateDealGrade(25000, 14, 10000, "HIGH", undefined, "conservative");
    expect(conservative.score).toBeLessThan(70); // ROI penalty + profit penalty

    // Balanced: requires 15% / $30k → penalized
    const balanced = calculateDealGrade(25000, 14, 10000, "HIGH", undefined, "balanced");
    expect(balanced.score).toBeLessThan(70);

    // Aggressive: requires 12% / $22k → NOT penalized (14% >= 12%, 25k >= 22k)
    const aggressive = calculateDealGrade(25000, 14, 10000, "HIGH", undefined, "aggressive");
    expect(aggressive.score).toBe(100);
  });

  it("handles zero and negative edge cases gracefully", () => {
    // Zero purchase price: no division by zero, ROI uses cash invested
    const zeroPurchase = calculateInvestorDeal({
      purchasePrice: 0,
      arv: 200000,
      repairs: 10000,
      holdMonths: 1,
      purchaseClosingRate: 0.02,
      dispositionCostRate: 0.09,
      annualInterestRate: 0.12,
      pointsRate: 0.02,
    });
    expect(zeroPurchase.roi).toBe(1720);
    expect(zeroPurchase.profit).toBe(172000);

    // Zero repairs: profit should be higher than same deal with repairs
    const baseInputs = {
      purchasePrice: 200000,
      arv: 400000,
      holdMonths: 6,
      purchaseClosingRate: 0.02,
      dispositionCostRate: 0.09,
      annualInterestRate: 0.12,
      pointsRate: 0.02,
    };
    const withRepairs = calculateInvestorDeal({ ...baseInputs, repairs: 50000 });
    const noRepairs = calculateInvestorDeal({ ...baseInputs, repairs: 0 });
    expect(noRepairs.profit).toBeGreaterThan(withRepairs.profit);
    expect(noRepairs.mao).toBeGreaterThan(withRepairs.mao);

    // Zero hold months: carry costs should be zero
    const noHold = calculateInvestorDeal({ ...baseInputs, repairs: 25000, holdMonths: 0 });
    // totalCosts = closing(4k) + disposition(36k) + points(3.2k) + carry(0) = 43,200
    expect(noHold.totalCosts).toBe(43200);
  });
});
