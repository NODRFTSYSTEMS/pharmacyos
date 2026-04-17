export type DataInputs = {
  primarySource: boolean;
  noMaterialConflicts: boolean;
  dataAgeDays: number;
  secondarySource: boolean;
  materialConflictsResolved: boolean;
  estimatedFields: number;
};

export type CompInputs = {
  qualifiedCompCount: number;
  sameSubdivisionCompCount: number;
  radiusMiles: number;
  compQualityScore: number;
  timeAdjustmentRequired: boolean;
};

export type ValuationInputs = {
  valueRangePercent: number;
  strongCompSupport: boolean;
  recentMarketActivity: boolean;
  limitedMarketActivity: boolean;
};

export type ModelInputs = {
  allFormulasExecuted: boolean;
  defaultsTriggered: number;
  overrideEvents: number;
  keyAssumptionsConfirmed: boolean;
};

export type PassInputs = {
  canGeocodeAddress: boolean;
  propertyTypeReconcilable: boolean;
  expectedProfit: number;
  roi: number;
  stressProfit: number;
  requiredProfitFloor: number;
};

export type TriageInputs = {
  addressConfirmed: boolean;
  hasPropertyFacts: boolean;
  expectedSalePrice?: number;
  missingUploads: number;
  data: DataInputs;
  comp: CompInputs;
  valuation: ValuationInputs;
  model: ModelInputs;
  pass: PassInputs;
};

export type TriageOutputs = {
  confidenceScore: number;
  confidenceTier: "HIGH" | "MEDIUM" | "LOW" | "VERY_LOW";
  dataConfidence: number;
  compConfidence: number;
  valuationConfidence: number;
  modelConfidence: number;
  triggers: string[];
  passTriggers: string[];
  flags: string[];
  readinessStage: string;
  recommendation: string;
  passTriggered: boolean;
};

function calculateDataConfidence(data: DataInputs): number {
  let score = 0;
  if (data.primarySource) score += 10;
  if (data.noMaterialConflicts) score += 5;
  if (data.dataAgeDays <= 30) score += 5;
  else if (data.dataAgeDays <= 90) score += 2;
  if (data.secondarySource) score += 2;
  if (data.materialConflictsResolved) score += 2;
  if (data.estimatedFields === 0) score += 1;
  return score;
}

function calculateCompConfidence(comp: CompInputs): number {
  let score = 0;
  if (comp.qualifiedCompCount >= 3) score += 8;
  else if (comp.qualifiedCompCount >= 1) score += 3;
  if (comp.sameSubdivisionCompCount >= 1) score += 5;
  if (comp.radiusMiles <= 0.5) score += 5;
  else if (comp.radiusMiles <= 1.0) score += 2;
  if (comp.compQualityScore >= 70) score += 4;
  else if (comp.compQualityScore >= 50) score += 2;
  if (!comp.timeAdjustmentRequired) score += 3;
  return score;
}

function calculateValuationConfidence(valuation: ValuationInputs): number {
  let score = 0;
  if (valuation.valueRangePercent <= 10) score += 8;
  else if (valuation.valueRangePercent <= 20) score += 5;
  else if (valuation.valueRangePercent <= 30) score += 2;
  if (valuation.strongCompSupport) score += 5;
  if (valuation.recentMarketActivity) score += 5;
  if (!valuation.limitedMarketActivity) score += 2;
  return score;
}

function calculateModelConfidence(model: ModelInputs): number {
  let score = 0;
  if (model.allFormulasExecuted) score += 8;
  if (model.defaultsTriggered === 0) score += 5;
  else if (model.defaultsTriggered <= 2) score += 2;
  if (model.overrideEvents === 0) score += 5;
  if (model.keyAssumptionsConfirmed) score += 4;
  return score;
}

function determineTier(score: number): TriageOutputs["confidenceTier"] {
  if (score >= 80) return "HIGH";
  if (score >= 60) return "MEDIUM";
  if (score >= 40) return "LOW";
  return "VERY_LOW";
}

function determineReadinessStage(inputs: TriageInputs): string {
  if (!inputs.addressConfirmed || !inputs.hasPropertyFacts) return "Intake";
  if (inputs.comp.qualifiedCompCount < 3) return "Facts Collected";
  return "Ready";
}

function determineTriggers(
  inputs: TriageInputs,
  scores: {
    dataConfidence: number;
    compConfidence: number;
    valuationConfidence: number;
    modelConfidence: number;
    overallScore: number;
  }
): string[] {
  const triggers: string[] = [];

  if (scores.dataConfidence < 15) triggers.push("Data Quality Review");
  if (inputs.comp.radiusMiles > 1.0) triggers.push("Geographic Review");
  if (inputs.comp.timeAdjustmentRequired) triggers.push("Methodology Review");
  if (inputs.comp.qualifiedCompCount < 3) triggers.push("Comp Expansion Review");
  if (inputs.valuation.valueRangePercent > 25) triggers.push("Valuation Sensitivity Review");
  if (scores.overallScore < 60 && scores.overallScore >= 40) triggers.push("Standard Review");
  if (scores.overallScore < 40) triggers.push("Priority Review");
  if (inputs.model.overrideEvents > 0 || inputs.model.defaultsTriggered > 2) triggers.push("Model Override Review");
  if (!inputs.addressConfirmed) triggers.push("Address Verification Review");

  return triggers;
}

function determineFlags(inputs: TriageInputs): string[] {
  const flags: string[] = [];
  if (!inputs.addressConfirmed) flags.push("ADDRESS_UNVERIFIED");
  if (!inputs.hasPropertyFacts) flags.push("MISSING_PROPERTY_FACTS");
  if (inputs.missingUploads > 0) flags.push("MISSING_UPLOADS");
  if (inputs.comp.qualifiedCompCount < 3) flags.push("INSUFFICIENT_COMPS");
  return flags;
}

function evaluatePassTriggers(inputs: TriageInputs): string[] {
  const pass: string[] = [];

  if (!inputs.pass.canGeocodeAddress) pass.push("Address cannot be geocoded");
  if (!inputs.pass.propertyTypeReconcilable) pass.push("Property type not reconcilable");
  if (inputs.pass.expectedProfit < 10000) pass.push("Expected profit < $10,000");
  if (inputs.pass.roi < 5) pass.push("ROI < 5%");
  if (inputs.pass.stressProfit < inputs.pass.requiredProfitFloor) pass.push("Stress case breaks the deal");
  if (inputs.comp.qualifiedCompCount === 0) pass.push("Zero usable comps after full cascade");

  return pass;
}

function determineRecommendation(outputs: TriageOutputs): string {
  if (outputs.passTriggered) return "PASS — do not proceed";
  if (outputs.confidenceTier === "HIGH" && outputs.triggers.length === 0) return "Proceed";
  if (outputs.confidenceTier === "VERY_LOW") return "Reject or escalate";
  return "Proceed with conditions";
}

export function runTriage(inputs: TriageInputs): TriageOutputs {
  const dataConfidence = calculateDataConfidence(inputs.data);
  const compConfidence = calculateCompConfidence(inputs.comp);
  const valuationConfidence = calculateValuationConfidence(inputs.valuation);
  const modelConfidence = calculateModelConfidence(inputs.model);
  const overallScore = dataConfidence + compConfidence + valuationConfidence + modelConfidence;
  const confidenceTier = determineTier(overallScore);
  const readinessStage = determineReadinessStage(inputs);
  const flags = determineFlags(inputs);
  const triggers = determineTriggers(inputs, {
    dataConfidence,
    compConfidence,
    valuationConfidence,
    modelConfidence,
    overallScore,
  });
  const passTriggers = evaluatePassTriggers(inputs);
  const passTriggered = passTriggers.length > 0;

  const result: TriageOutputs = {
    confidenceScore: overallScore,
    confidenceTier,
    dataConfidence,
    compConfidence,
    valuationConfidence,
    modelConfidence,
    triggers,
    passTriggers,
    flags,
    readinessStage,
    recommendation: "",
    passTriggered,
  };

  result.recommendation = determineRecommendation(result);
  return result;
}
