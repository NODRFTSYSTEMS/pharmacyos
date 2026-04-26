import {
  calculateInvestorDeal,
  calculateRiskBand,
} from "./investor";
import type {
  InvestorAdvancedInputs,
  InvestorAdvancedOutputs,
  ScenarioOutputs,
  InvestorInputs,
  StressScenario,
  InvestorProfile,
} from "./types";

export function calculateRehabTotal(
  items: { quantity: number; unitCost: number; regionalMultiplier?: number }[],
  globalMultiplier: number
): number {
  return items.reduce((sum, item) => {
    const multiplier = item.regionalMultiplier ?? globalMultiplier ?? 1;
    return sum + item.quantity * item.unitCost * multiplier;
  }, 0);
}

export function calculateDscr(
  monthlyRent: number,
  operatingExpenseRate: number,
  monthlyDebtService: number
): number {
  if (monthlyDebtService <= 0) return Infinity;
  const noi = monthlyRent * (1 - operatingExpenseRate) * 12;
  return Number((noi / (monthlyDebtService * 12)).toFixed(2));
}

export function calculateRefiProceeds(arv: number, refiLtv: number): number {
  return Number((arv * refiLtv).toFixed(2));
}

export function calculateCashOnCash(
  annualCashFlow: number,
  cashInvested: number
): number {
  if (cashInvested <= 0) return 0;
  return Number(((annualCashFlow / cashInvested) * 100).toFixed(2));
}

export function calculateWholesaleSpread(
  contractPrice: number,
  mao: number
): number {
  return Number((contractPrice - mao).toFixed(2));
}

// ─── Sharpe Ratio ────────────────────────────────────────────────────────────

export function calculateSharpeRatio(
  roi: number,
  baseProfit: number,
  stressProfit: number
): { sharpeRatio: number; sharpeGrade: string } {
  // CV proxy = variability between base and stress scenario as % of base profit
  const base = Math.abs(baseProfit) > 0 ? baseProfit : 1;
  const cv = Math.max(0.1, Math.min(1.0, Math.abs(baseProfit - stressProfit) / Math.abs(base)));
  const sharpeRatio = Number(((roi / 100 - 0.05) / cv).toFixed(2));

  let sharpeGrade: string;
  if (sharpeRatio >= 1.0)       sharpeGrade = "Excellent";
  else if (sharpeRatio >= 0.5)  sharpeGrade = "Acceptable";
  else if (sharpeRatio >= 0)    sharpeGrade = "Poor";
  else                          sharpeGrade = "Negative";

  return { sharpeRatio, sharpeGrade };
}

// ─── 5-Scenario Expanded Stress Test (Advanced Only) ─────────────────────────

export function buildExpandedStressScenarios(
  inputs: InvestorAdvancedInputs,
  confidenceTier: string = "HIGH"
): StressScenario[] {
  const run = (arvMult: number, repairMult: number, holdDelta: number) => {
    const modified: InvestorInputs = {
      ...inputs,
      arv: inputs.arv * arvMult,
      repairs: inputs.repairs * repairMult,
      holdMonths: Math.max(1, inputs.holdMonths + holdDelta),
    };
    return calculateInvestorDeal(modified, confidenceTier);
  };

  const scenarios: Array<{ label: string; arvVariance: number; repairVariance: number; holdVariance: number; result: ReturnType<typeof calculateInvestorDeal> }> = [
    { label: "Conservative",       arvVariance: -0.10, repairVariance: +0.20, holdVariance: +3, result: run(0.90, 1.20, +3) },
    { label: "Aggressive",         arvVariance: +0.05, repairVariance: -0.10, holdVariance: -1, result: run(1.05, 0.90, -1) },
    { label: "Repair Overrun",     arvVariance:  0.00, repairVariance: +0.20, holdVariance:  0, result: run(1.00, 1.20,  0) },
    { label: "Timeline Extension", arvVariance:  0.00, repairVariance:  0.00, holdVariance: +3, result: run(1.00, 1.00, +3) },
    { label: "Exit Compression",   arvVariance: -0.10, repairVariance:  0.00, holdVariance:  0, result: run(0.90, 1.00,  0) },
  ];

  return scenarios.map(({ label, arvVariance, repairVariance, holdVariance, result }) => ({
    label,
    arvVariance,
    repairVariance,
    holdVariance,
    mao: result.mao,
    profit: result.profit,
    roi: result.roi,
    riskBand: result.riskBand,
    status: result.profit > 10000 ? "viable" : result.profit > 0 ? "marginal" : "negative",
  }));
}

// ─── Advanced Outputs Builder ────────────────────────────────────────────────

function buildAdvancedOutputs(
  inputs: InvestorAdvancedInputs,
  baseInvestorOutputs: ReturnType<typeof calculateInvestorDeal>,
  confidenceTier: string = "HIGH"
): InvestorAdvancedOutputs {
  const rehabTotal = calculateRehabTotal(
    inputs.rehabItems ?? [],
    inputs.globalRegionalMultiplier ?? 1
  );

  const refiLoanAmount = inputs.arv * inputs.refiLtv;
  const monthlyRefiRate = inputs.refiInterestRate / 12;
  const numPayments = inputs.refiTermYears * 12;
  const monthlyDebtService =
    numPayments > 0 && monthlyRefiRate > 0
      ? (refiLoanAmount * monthlyRefiRate) /
        (1 - Math.pow(1 + monthlyRefiRate, -numPayments))
      : 0;

  const annualCashFlow =
    inputs.monthlyRent * (1 - inputs.operatingExpenseRate) * 12 -
    monthlyDebtService * 12;

  const dscr = calculateDscr(inputs.monthlyRent, inputs.operatingExpenseRate, monthlyDebtService);
  const refiProceeds = calculateRefiProceeds(inputs.arv, inputs.refiLtv);
  const cashOnCash = calculateCashOnCash(annualCashFlow, inputs.cashInvested);
  const wholesaleSpread = calculateWholesaleSpread(inputs.contractPrice, baseInvestorOutputs.mao);

  const { sharpeRatio, sharpeGrade } = calculateSharpeRatio(
    baseInvestorOutputs.roi,
    baseInvestorOutputs.profit,
    baseInvestorOutputs.stressProfit
  );

  const stressScenarios = buildExpandedStressScenarios(inputs, confidenceTier);

  return {
    rehabTotal: Number(rehabTotal.toFixed(2)),
    dscr,
    refiProceeds,
    cashOnCash,
    wholesaleSpread,
    annualCashFlow: Number(annualCashFlow.toFixed(2)),
    stressScenarios,
    sharpeRatio,
    sharpeGrade,
    investorProfileUsed: (inputs.investorProfile ?? "balanced") as InvestorProfile,
  };
}

export function buildScenarios(
  inputs: InvestorAdvancedInputs
): ScenarioOutputs {
  const run = (mods: Partial<InvestorAdvancedInputs>) => {
    const merged = { ...inputs, ...mods };
    const investorOut = calculateInvestorDeal(merged as InvestorInputs, "HIGH");
    const advancedOut = buildAdvancedOutputs(merged, investorOut);
    return { ...investorOut, ...advancedOut };
  };

  return {
    base: run({}),
    upside: run({
      arv: inputs.arv * 1.1,
      repairs: inputs.repairs * 0.9,
      monthlyRent: inputs.monthlyRent * 1.1,
    }),
    downside: run({
      arv: inputs.arv * 0.9,
      repairs: inputs.repairs * 1.15,
      monthlyRent: inputs.monthlyRent * 0.9,
      holdMonths: inputs.holdMonths + 3,
    }),
  };
}

export function calculateInvestorAdvancedDeal(
  inputs: InvestorAdvancedInputs,
  confidenceTier: string = "HIGH"
): ReturnType<typeof calculateInvestorDeal> & InvestorAdvancedOutputs {
  const rehabTotal = calculateRehabTotal(
    inputs.rehabItems ?? [],
    inputs.globalRegionalMultiplier ?? 1
  );
  const effectiveRepairs = rehabTotal > 0 ? rehabTotal : inputs.repairs;

  // Base inputs always use effective repairs so all downstream calculations are consistent
  const baseInputs: InvestorAdvancedInputs = { ...inputs, repairs: effectiveRepairs };

  const baseOutputs = calculateInvestorDeal(baseInputs, confidenceTier);
  const advancedOutputs = buildAdvancedOutputs(baseInputs, baseOutputs, confidenceTier);
  const scenarios = buildScenarios(baseInputs);

  return {
    ...baseOutputs,
    ...advancedOutputs,
    scenarios,
  };
}
