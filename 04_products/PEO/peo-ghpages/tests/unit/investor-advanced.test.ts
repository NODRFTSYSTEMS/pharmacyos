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
import type { InvestorAdvancedInputs } from "@/lib/formulas";

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

  it("returns Infinity DSCR when no debt service (all-cash deal)", () => {
    expect(calculateDscr(2000, 0.25, 0)).toBe(Infinity);
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

  it("uses rehab items in stress scenarios (not stale flat repairs)", () => {
    const inputsWithRehab: InvestorAdvancedInputs = {
      purchasePrice: 200000,
      arv: 350000,
      repairs: 10000, // stale flat number — should be ignored when rehab items present
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
        { category: "kitchen", description: "Full kitchen", quantity: 1, unitCost: 25000 },
        { category: "bath", description: "Bath remodel", quantity: 2, unitCost: 8000 },
      ],
      globalRegionalMultiplier: 1,
    };

    const inputsWithoutRehab: InvestorAdvancedInputs = {
      ...inputsWithRehab,
      rehabItems: [],
    };

    const withRehab = calculateInvestorAdvancedDeal(inputsWithRehab);
    const withoutRehab = calculateInvestorAdvancedDeal(inputsWithoutRehab);

    const rehabTotal = 25000 + 16000; // 41,000
    expect(withRehab.rehabTotal).toBe(rehabTotal);

    // With rehab items, effective repairs = 41k; without, it falls back to flat 10k
    // Therefore the base profit should be lower with rehab items
    expect(withRehab.profit).toBeLessThan(withoutRehab.profit);

    // Stress scenarios should also reflect the higher repair base
    // Repair Overrun with 41k base → 49.2k repairs → lower profit
    // Repair Overrun with 10k base → 12k repairs → higher profit
    const repairOverrunWith = withRehab.stressScenarios?.find((s) => s.label === "Repair Overrun");
    const repairOverrunWithout = withoutRehab.stressScenarios?.find((s) => s.label === "Repair Overrun");
    expect(repairOverrunWith).toBeDefined();
    expect(repairOverrunWithout).toBeDefined();
    expect(repairOverrunWith!.profit).toBeLessThan(repairOverrunWithout!.profit);

    // Scenarios (upside/downside) should also use effective repairs
    expect(withRehab.scenarios!.downside.profit).toBeLessThan(withoutRehab.scenarios!.downside.profit);
  });

  it("propagates down payment percentage into advanced deal", () => {
    const inputs: InvestorAdvancedInputs = {
      purchasePrice: 200000,
      arv: 350000,
      repairs: 25000,
      holdMonths: 6,
      purchaseClosingRate: 0.02,
      dispositionCostRate: 0.09,
      annualInterestRate: 0.12,
      pointsRate: 0.02,
      downPaymentPct: 0.25, // 25% down
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

    const result = calculateInvestorAdvancedDeal(inputs);
    // With 25% down, loan = 150k; points = 3k; interest = 150k * 0.12 / 12 * 6 = 9k
    // totalCosts = 4k + 31.5k + 3k + 9k = 47.5k
    // profit = 350k - 200k - 25k - 47.5k = 77.5k
    expect(result.profit).toBe(77500);
    // cashInvested = 50k down + 25k repairs + 4k closing + 3k points = 82k
    // roi = 77.5k / 82k * 100 = 94.51...
    expect(result.roi).toBeCloseTo(94.51, 1);
  });
});
