import { describe, it, expect } from "vitest";
import {
  calculateRehabTotal,
  calculateDscr,
  calculateRefiProceeds,
  calculateCashOnCash,
  calculateWholesaleSpread,
  buildScenarios,
  calculateInvestorAdvancedDeal,
} from "@/lib/formulas";

describe("Investor Advanced formulas", () => {
  it("calculates rehab total with regional multiplier", () => {
    const items = [
      { quantity: 1, unitCost: 10000, regionalMultiplier: 1.2 },
      { quantity: 2, unitCost: 500, regionalMultiplier: 1.0 },
    ];
    expect(calculateRehabTotal(items, 1.0)).toBe(13000);
  });

  it("uses global multiplier when item multiplier is missing", () => {
    const items = [{ quantity: 1, unitCost: 10000 }];
    expect(calculateRehabTotal(items, 1.5)).toBe(15000);
  });

  it("calculates DSCR correctly", () => {
    // monthly rent 2000, op ex 25%, monthly debt service 1200
    // NOI = 2000 * 0.75 * 12 = 18000
    // Debt service annual = 1200 * 12 = 14400
    // DSCR = 18000 / 14400 = 1.25
    expect(calculateDscr(2000, 0.25, 1200)).toBe(1.25);
  });

  it("returns 0 DSCR when no debt service", () => {
    expect(calculateDscr(2000, 0.25, 0)).toBe(0);
  });

  it("calculates refi proceeds", () => {
    expect(calculateRefiProceeds(400000, 0.75)).toBe(300000);
  });

  it("calculates cash-on-cash", () => {
    expect(calculateCashOnCash(15000, 75000)).toBe(20);
  });

  it("returns 0 cash-on-cash when no cash invested", () => {
    expect(calculateCashOnCash(15000, 0)).toBe(0);
  });

  it("calculates wholesale spread", () => {
    expect(calculateWholesaleSpread(250000, 200000)).toBe(50000);
  });

  it("builds base, upside, and downside scenarios", () => {
    const inputs = {
      purchasePrice: 200000,
      arv: 350000,
      repairs: 25000,
      holdMonths: 6,
      purchaseClosingRate: 0.02,
      dispositionCostRate: 0.09,
      annualInterestRate: 0.12,
      pointsRate: 0.02,
      monthlyRent: 2500,
      operatingExpenseRate: 0.25,
      refiLtv: 0.75,
      refiInterestRate: 0.07,
      refiTermYears: 30,
      contractPrice: 200000,
      cashInvested: 75000,
      rehabItems: [],
      globalRegionalMultiplier: 1,
    };
    const scenarios = buildScenarios(inputs);
    expect(scenarios.base.profit).toBeDefined();
    expect(scenarios.upside.profit).toBeGreaterThan(scenarios.base.profit);
    expect(scenarios.downside.profit).toBeLessThan(scenarios.base.profit);
    expect(scenarios.base.dscr).toBeGreaterThan(0);
    expect(scenarios.base.refiProceeds).toBe(262500);
  });

  it("calculates full advanced deal with rehab items replacing repairs", () => {
    const inputs = {
      purchasePrice: 200000,
      arv: 350000,
      repairs: 25000,
      holdMonths: 6,
      purchaseClosingRate: 0.02,
      dispositionCostRate: 0.09,
      annualInterestRate: 0.12,
      pointsRate: 0.02,
      monthlyRent: 2500,
      operatingExpenseRate: 0.25,
      refiLtv: 0.75,
      refiInterestRate: 0.07,
      refiTermYears: 30,
      contractPrice: 200000,
      cashInvested: 75000,
      rehabItems: [
        { category: "roof", description: "New roof", quantity: 1, unitCost: 15000 },
        { category: "hvac", description: "HVAC", quantity: 1, unitCost: 8000 },
      ],
      globalRegionalMultiplier: 1,
    };
    const result = calculateInvestorAdvancedDeal(inputs);
    expect(result.rehabTotal).toBe(23000);
    // effective repairs = 23000 (rehab total) instead of 25000
    expect(result.scenarios).toBeDefined();
    expect(result.dscr).toBeGreaterThan(0);
    expect(result.cashOnCash).toBeGreaterThanOrEqual(0);
  });
});
