import { describe, it, expect } from "vitest";
import { runTriage } from "@/lib/triage/engine";

const baseInputs = {
  addressConfirmed: true,
  hasPropertyFacts: true,
  expectedSalePrice: 400000,
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
    qualifiedCompCount: 5,
    sameSubdivisionCompCount: 2,
    radiusMiles: 0.3,
    compQualityScore: 80,
    timeAdjustmentRequired: false,
  },
  valuation: {
    valueRangePercent: 8,
    strongCompSupport: true,
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
    expectedProfit: 50000,
    roi: 20,
    stressProfit: 50000,
    requiredProfitFloor: 30000,
  },
};

describe("Triage engine — 4-dimension confidence model", () => {
  it("returns HIGH confidence with all strong inputs", () => {
    const result = runTriage(baseInputs);
    expect(result.confidenceScore).toBeGreaterThanOrEqual(80);
    expect(result.confidenceTier).toBe("HIGH");
    expect(result.readinessStage).toBe("Ready");
    expect(result.passTriggered).toBe(false);
    expect(result.triggers).toHaveLength(0);
  });

  it("calculates individual dimension scores", () => {
    const result = runTriage(baseInputs);
    expect(result.dataConfidence).toBeGreaterThan(0);
    expect(result.compConfidence).toBeGreaterThan(0);
    expect(result.valuationConfidence).toBeGreaterThan(0);
    expect(result.modelConfidence).toBeGreaterThan(0);
  });

  it("flags insufficient comps and triggers Comp Expansion Review", () => {
    const result = runTriage({
      ...baseInputs,
      comp: { ...baseInputs.comp, qualifiedCompCount: 1 },
    });
    expect(result.flags).toContain("INSUFFICIENT_COMPS");
    expect(result.triggers).toContain("Comp Expansion Review");
  });

  it("flags unverified address", () => {
    const result = runTriage({
      ...baseInputs,
      addressConfirmed: false,
    });
    expect(result.flags).toContain("ADDRESS_UNVERIFIED");
    expect(result.readinessStage).not.toBe("Ready");
  });

  it("triggers Data Quality Review when data confidence is low", () => {
    const result = runTriage({
      ...baseInputs,
      data: {
        ...baseInputs.data,
        primarySource: false,
        noMaterialConflicts: false,
        estimatedFields: 5,
        dataAgeDays: 120,
      },
    });
    expect(result.triggers).toContain("Data Quality Review");
  });

  it("triggers Geographic Review when radius expanded > 1.0 mi", () => {
    const result = runTriage({
      ...baseInputs,
      comp: { ...baseInputs.comp, radiusMiles: 1.2 },
    });
    expect(result.triggers).toContain("Geographic Review");
  });

  it("triggers PASS when expected profit is too low", () => {
    const result = runTriage({
      ...baseInputs,
      pass: { ...baseInputs.pass, expectedProfit: 5000 },
    });
    expect(result.passTriggered).toBe(true);
    expect(result.passTriggers).toContain("Expected profit < $10,000");
  });

  it("triggers PASS when ROI is too low", () => {
    const result = runTriage({
      ...baseInputs,
      pass: { ...baseInputs.pass, roi: 2 },
    });
    expect(result.passTriggered).toBe(true);
    expect(result.passTriggers).toContain("ROI < 5%");
  });

  it("triggers PASS when stress case breaks the deal", () => {
    const result = runTriage({
      ...baseInputs,
      pass: { ...baseInputs.pass, stressProfit: 10000 },
    });
    expect(result.passTriggered).toBe(true);
    expect(result.passTriggers).toContain("Stress case breaks the deal");
  });

  it("triggers PASS when address cannot be geocoded", () => {
    const result = runTriage({
      ...baseInputs,
      pass: { ...baseInputs.pass, canGeocodeAddress: false },
    });
    expect(result.passTriggered).toBe(true);
    expect(result.passTriggers).toContain("Address cannot be geocoded");
  });

  it("triggers PASS when zero usable comps", () => {
    const result = runTriage({
      ...baseInputs,
      comp: { ...baseInputs.comp, qualifiedCompCount: 0 },
    });
    expect(result.passTriggered).toBe(true);
    expect(result.passTriggers).toContain("Zero usable comps after full cascade");
  });

  it("triggers Priority Review when overall confidence < 40", () => {
    const result = runTriage({
      ...baseInputs,
      data: { ...baseInputs.data, estimatedFields: 10, primarySource: false, noMaterialConflicts: false },
      comp: { ...baseInputs.comp, qualifiedCompCount: 0, timeAdjustmentRequired: true, sameSubdivisionCompCount: 0 },
      valuation: { ...baseInputs.valuation, valueRangePercent: 50, limitedMarketActivity: true },
      model: { ...baseInputs.model, allFormulasExecuted: false, defaultsTriggered: 3 },
    });
    expect(result.confidenceScore).toBeLessThan(40);
    expect(result.triggers).toContain("Priority Review");
    expect(result.confidenceTier).toBe("VERY_LOW");
  });

  it("triggers Methodology Review when time adjustment required", () => {
    const result = runTriage({
      ...baseInputs,
      comp: { ...baseInputs.comp, timeAdjustmentRequired: true },
    });
    expect(result.triggers).toContain("Methodology Review");
  });

  it("progresses readiness stage based on inputs", () => {
    const intake = runTriage({
      ...baseInputs,
      addressConfirmed: false,
      hasPropertyFacts: false,
      comp: { ...baseInputs.comp, qualifiedCompCount: 0 },
    });
    expect(intake.readinessStage).toBe("Intake");

    const facts = runTriage({
      ...baseInputs,
      comp: { ...baseInputs.comp, qualifiedCompCount: 0 },
    });
    expect(facts.readinessStage).toBe("Facts Collected");

    const ready = runTriage({
      ...baseInputs,
      comp: { ...baseInputs.comp, qualifiedCompCount: 3 },
    });
    expect(ready.readinessStage).toBe("Ready");
  });
});
