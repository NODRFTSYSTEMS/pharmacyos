/**
 * Extended calculation engine ported from Deal Underwriter Pro prototype.
 * These functions supplement (not replace) the existing seller.ts / investor.ts modules.
 * All functions are pure — no DOM or localStorage dependencies.
 */

// ─── Constants ───────────────────────────────────────────────────────────────

const MAO_RULE_PCT = 0.70;
const DESIRED_PROFIT_PCT = 0.30;
const MIN_DESIRED_PROFIT = 30_000;
const HOLD_COST_PCT_MO = 0.007;
const TX_COST_BUY_PCT = 0.03;
const TX_COST_SELL_PCT = 0.09;

const REPAIR_RANGES: Record<string, { low: number; high: number }> = {
  C1: { low: 8, high: 15 },
  C2: { low: 18, high: 28 },
  C3: { low: 38, high: 58 },
  C4: { low: 72, high: 95 },
  C5: { low: 95, high: 140 },
};

const AGE_MULTIPLIERS: Array<{ maxAge: number; mult: number }> = [
  { maxAge: 5, mult: 1.0 },
  { maxAge: 15, mult: 1.05 },
  { maxAge: 30, mult: 1.12 },
  { maxAge: 50, mult: 1.28 },
  { maxAge: Infinity, mult: 1.45 },
];

// ─── Formatters / Utilities ───────────────────────────────────────────────────

export function fmt$(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function pct(n: number, decimals = 1): string {
  return `${(n * 100).toFixed(decimals)}%`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function toFiniteNumber(value: unknown, def = 0, min?: number, max?: number): number {
  const n = Number(value);
  const result = isFinite(n) ? n : def;
  if (min !== undefined && result < min) return min;
  if (max !== undefined && result > max) return max;
  return result;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Comp {
  price: number;
  sqft: number;
  daysOnMarket?: number;
  distanceMiles?: number;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  conditionClass?: string;
  soldDate?: string;
  isActive?: boolean;
}

export interface MAOInputs {
  arv: number;
  repairs: number;
  holdMonths?: number;
  desiredProfitOverride?: number;
  killSwitchAdjustment?: number;
}

export interface MAOResult {
  mao: number;
  mao70: number;
  maoFinal: number;
  desiredProfit: number;
  holdingCosts: number;
  txCosts: number;
  repairsUsed: number;
  holdMonths: number;
  rulePct: number;
}

export interface TieredARVResult {
  arv: number;
  confidence: "High" | "Medium" | "Low";
  tier: "community" | "radius" | "expanded";
  compCount: number;
}

export interface DualARVResult {
  soldARV: number;
  activeARV: number;
  blendedARV: number;
  deltaIndicator: "bullish" | "neutral" | "bearish";
  soldConfidence: "High" | "Medium" | "Low";
  activeConfidence: "High" | "Medium" | "Low";
}

export interface DealViabilityResult {
  score: number;
  grade: "A" | "B" | "C" | "D";
  confidence: "High" | "Medium" | "Low";
  flags: string[];
}

export interface StressScenario {
  name: string;
  arv: number;
  repairs: number;
  holdMonths: number;
  description: string;
  mao: number;
  profit: number;
}

export interface FlipProfitResult {
  profit: number;
  roi: number;
  cashIn: number;
  totalCost: number;
  interest: number;
  holdCarry: number;
  loanPoints: number;
  loan: number;
  downPayment: number;
  buyCosts: number;
  sellCosts: number;
  holdMonths: number;
  breakEvenPrice: number;
}

export interface DailyBurnResult {
  dailyInterest: number;
  dailyTax: number;
  dailyInsurance: number;
  dailyUtilities: number;
  dailyMaint: number;
  totalDailyBurn: number;
  thirtyDayCost: number;
  breakEvenDay: number;
}

export interface RepairEstimate {
  low: number;
  high: number;
  total: number;
  ageMult: number;
  table: { item: string; low: number; high: number }[];
}

export interface MarketVelocityResult {
  avgSoldDOM: number;
  avgActiveDOM: number;
  marketVelocity: "Fast" | "Normal" | "Slow";
  monthsOfInventory: number;
  absorptionRisk: "HIGH" | "MEDIUM" | "LOW";
  marketType: "Seller" | "Balanced" | "Buyer";
  expectedListToClose: number;
}

export interface PPSFStatsResult {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  subjectPPSF: number;
  zScore: number;
  isOutlier: boolean;
  position: "Below Market" | "At Market" | "Above Market";
  coeffVar: number;
  sampleSize: number;
}

export interface SharpeResult {
  sharpe: number;
  grade: "Excellent" | "Good" | "Fair" | "Poor";
  gradeClass: "is-pass" | "is-warn" | "is-stop";
}

export interface InsuranceRiskResult {
  label: string;
  note: string;
  level: "critical" | "elevated" | "standard";
}

export interface PermitRiskResult {
  estimatedDays: number;
  risk: string;
  riskClass: "is-pass" | "is-warn" | "is-stop";
}

export interface SeasonalFactorResult {
  month: number;
  monthName: string;
  factor: number;
  label: string;
  recommendation: string;
  isWinter: boolean;
  isPeak: boolean;
}

// ─── MAO ─────────────────────────────────────────────────────────────────────

export function calculateMAO(inputs: MAOInputs): MAOResult {
  const { arv, repairs, holdMonths = 6, desiredProfitOverride, killSwitchAdjustment = 0 } = inputs;

  const holdingCosts = arv * HOLD_COST_PCT_MO * holdMonths;
  const txCosts = arv * TX_COST_BUY_PCT + arv * TX_COST_SELL_PCT;
  const desiredProfit = desiredProfitOverride ?? Math.max(arv * DESIRED_PROFIT_PCT, MIN_DESIRED_PROFIT);

  const mao = arv - repairs - holdingCosts - txCosts - desiredProfit - killSwitchAdjustment;
  const mao70 = arv * MAO_RULE_PCT - repairs;
  const maoFinal = Math.min(mao, mao70);

  return {
    mao: roundCurrency(mao),
    mao70: roundCurrency(mao70),
    maoFinal: roundCurrency(maoFinal),
    desiredProfit: roundCurrency(desiredProfit),
    holdingCosts: roundCurrency(holdingCosts),
    txCosts: roundCurrency(txCosts),
    repairsUsed: repairs,
    holdMonths,
    rulePct: MAO_RULE_PCT,
  };
}

// ─── ARV / Comps ──────────────────────────────────────────────────────────────

function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function stdDev(nums: number[]): number {
  if (nums.length < 2) return 0;
  const mean = nums.reduce((s, n) => s + n, 0) / nums.length;
  const variance = nums.reduce((s, n) => s + (n - mean) ** 2, 0) / nums.length;
  return Math.sqrt(variance);
}

export function calculateARVFromComps(comps: Comp[], subjectSqft = 1800): { arv: number; avgPPSF: number; medianPPSF: number; compCount: number; confidence: "High" | "Medium" | "Low" } {
  const valid = comps.filter((c) => c.price > 0 && c.sqft > 0);
  if (valid.length === 0) return { arv: 0, avgPPSF: 0, medianPPSF: 0, compCount: 0, confidence: "Low" };

  const ppsfs = valid.map((c) => c.price / c.sqft);
  const med = median(ppsfs);
  const avg = ppsfs.reduce((s, n) => s + n, 0) / ppsfs.length;

  const confidence: "High" | "Medium" | "Low" =
    valid.length >= 5 ? "High" : valid.length >= 3 ? "Medium" : "Low";

  return {
    arv: roundCurrency(med * subjectSqft),
    avgPPSF: roundCurrency(avg),
    medianPPSF: roundCurrency(med),
    compCount: valid.length,
    confidence,
  };
}

export function calculateTieredARV(comps: Comp[]): TieredARVResult {
  const community = comps.filter((c) => (c.distanceMiles ?? 99) <= 0.5);
  const radius = comps.filter((c) => (c.distanceMiles ?? 99) <= 1.0);
  const expanded = comps;

  const best = community.length >= 3 ? { set: community, tier: "community" as const }
    : radius.length >= 3 ? { set: radius, tier: "radius" as const }
    : { set: expanded, tier: "expanded" as const };

  const result = calculateARVFromComps(best.set);

  return {
    arv: result.arv,
    confidence: result.confidence,
    tier: best.tier,
    compCount: best.set.length,
  };
}

export function calculateDualARV(soldComps: Comp[], activeComps: Comp[], sqft = 1800): DualARVResult {
  const sold = calculateARVFromComps(soldComps, sqft);
  const active = calculateARVFromComps(activeComps, sqft);

  const delta = active.arv > 0 ? (active.arv - sold.arv) / sold.arv : 0;
  const deltaIndicator: DualARVResult["deltaIndicator"] =
    delta > 0.03 ? "bullish" : delta < -0.03 ? "bearish" : "neutral";

  const blendedARV = sold.arv * 0.7 + active.arv * 0.3;

  return {
    soldARV: sold.arv,
    activeARV: active.arv,
    blendedARV: roundCurrency(blendedARV),
    deltaIndicator,
    soldConfidence: sold.confidence,
    activeConfidence: active.confidence,
  };
}

export function calculateConfidencePenalty(compStats: { tier: string; compCount: number; coeffVar?: number; avgAgeDays?: number }): number {
  let penalty = 0;

  if (compStats.tier === "expanded") penalty += 15;
  else if (compStats.tier === "radius") penalty += 8;

  if (compStats.compCount < 3) penalty += 15;
  else if (compStats.compCount < 5) penalty += 8;

  if ((compStats.coeffVar ?? 0) > 0.15) penalty += 10;
  if ((compStats.avgAgeDays ?? 0) > 180) penalty += 10;

  return clamp(penalty, 0, 40);
}

// ─── Deal Viability ───────────────────────────────────────────────────────────

export function calculateDealViability(
  metrics: { profit: number; roi: number; stressProfit?: number },
  confidencePenalty = 0
): DealViabilityResult {
  const flags: string[] = [];
  let score = 100;

  score -= confidencePenalty;

  if (metrics.profit < MIN_DESIRED_PROFIT) { flags.push("Profit below minimum threshold"); score -= 20; }
  if (metrics.roi < 0.12) { flags.push("ROI below 12%"); score -= 15; }
  if ((metrics.stressProfit ?? metrics.profit) < 0) { flags.push("Stress scenario shows a loss"); score -= 20; }

  score = clamp(score, 0, 100);

  const grade: DealViabilityResult["grade"] =
    score >= 80 ? "A" : score >= 65 ? "B" : score >= 50 ? "C" : "D";

  const confidence: DealViabilityResult["confidence"] =
    confidencePenalty <= 10 ? "High" : confidencePenalty <= 25 ? "Medium" : "Low";

  return { score, grade, confidence, flags };
}

// ─── Stress Scenarios ─────────────────────────────────────────────────────────

export function calculateStressScenarios(baseDeal: { arv: number; repairs: number; holdMonths: number }): StressScenario[] {
  const { arv, repairs, holdMonths } = baseDeal;

  const scenario = (name: string, a: number, r: number, h: number, description: string): StressScenario => {
    const m = calculateMAO({ arv: a, repairs: r, holdMonths: h });
    return { name, arv: a, repairs: r, holdMonths: h, description, mao: m.maoFinal, profit: a - r - m.holdingCosts - m.txCosts - baseDeal.arv * 0 };
  };

  return [
    scenario("Conservative", arv * 0.95, repairs, holdMonths, "5% ARV haircut — market softness at exit"),
    scenario("Aggressive", arv * 1.05, repairs * 0.9, holdMonths - 1, "5% ARV upside, 10% repair savings, 1 month faster"),
    scenario("Repair Overrun", arv, repairs * 1.25, holdMonths, "25% repair cost overrun"),
    scenario("Timeline Extension", arv * 0.97, repairs, holdMonths + 2, "2-month hold extension, 3% ARV softness"),
    scenario("Exit Compression", arv * 0.90, repairs, holdMonths + 3, "10% ARV decline, 3-month extended hold"),
  ];
}

// ─── Flip Profit ──────────────────────────────────────────────────────────────

export function projectFlipProfit(
  purchase: number,
  arv: number,
  repairs: number,
  holdMo: number,
  downPct = 0.2,
  finRate = 0.12,
  points = 2
): FlipProfitResult {
  const downPayment = purchase * downPct;
  const loan = purchase - downPayment;
  const buyCosts = purchase * TX_COST_BUY_PCT;
  const sellCosts = arv * TX_COST_SELL_PCT;
  const loanPoints = loan * (points / 100);
  const interest = loan * (finRate / 12) * holdMo;
  const holdCarry = purchase * HOLD_COST_PCT_MO * holdMo;

  const totalCost = purchase + repairs + buyCosts + sellCosts + loanPoints + interest + holdCarry;
  const cashIn = downPayment + repairs + buyCosts + loanPoints;
  const profit = arv - totalCost;
  const roi = cashIn > 0 ? profit / cashIn : 0;
  const breakEvenPrice = totalCost;

  return {
    profit: roundCurrency(profit),
    roi: roundCurrency(roi),
    cashIn: roundCurrency(cashIn),
    totalCost: roundCurrency(totalCost),
    interest: roundCurrency(interest),
    holdCarry: roundCurrency(holdCarry),
    loanPoints: roundCurrency(loanPoints),
    loan: roundCurrency(loan),
    downPayment: roundCurrency(downPayment),
    buyCosts: roundCurrency(buyCosts),
    sellCosts: roundCurrency(sellCosts),
    holdMonths: holdMo,
    breakEvenPrice: roundCurrency(breakEvenPrice),
  };
}

// ─── Mortgage / Daily Burn ────────────────────────────────────────────────────

export function mortgagePmt(principal: number, annualRate: number, years = 30): number {
  if (annualRate === 0) return principal / (years * 12);
  const r = annualRate / 12;
  const n = years * 12;
  return roundCurrency(principal * (r * (1 + r) ** n) / ((1 + r) ** n - 1));
}

export function calculateDailyBurn(
  purchasePrice: number,
  finRate: number,
  annualTax: number,
  annualInsurance: number,
  holdMo: number,
  downPct = 0.2
): DailyBurnResult {
  const loan = purchasePrice * (1 - downPct);
  const dailyInterest = (loan * finRate) / 365;
  const dailyTax = annualTax / 365;
  const dailyInsurance = annualInsurance / 365;
  const dailyUtilities = 8;
  const dailyMaint = purchasePrice * 0.0005 / 30;
  const totalDailyBurn = dailyInterest + dailyTax + dailyInsurance + dailyUtilities + dailyMaint;
  const thirtyDayCost = totalDailyBurn * 30;
  const breakEvenDay = holdMo * 30;

  return {
    dailyInterest: roundCurrency(dailyInterest),
    dailyTax: roundCurrency(dailyTax),
    dailyInsurance: roundCurrency(dailyInsurance),
    dailyUtilities: roundCurrency(dailyUtilities),
    dailyMaint: roundCurrency(dailyMaint),
    totalDailyBurn: roundCurrency(totalDailyBurn),
    thirtyDayCost: roundCurrency(thirtyDayCost),
    breakEvenDay,
  };
}

// ─── Repair Estimates ─────────────────────────────────────────────────────────

export function estimateRepairs(conditionClass: string, sqft: number, age: number): RepairEstimate {
  const range = REPAIR_RANGES[conditionClass] ?? REPAIR_RANGES.C3;
  const ageMult = AGE_MULTIPLIERS.find((a) => age <= a.maxAge)?.mult ?? 1.45;

  const low = range.low * sqft * ageMult;
  const high = range.high * sqft * ageMult;
  const total = (low + high) / 2;

  return {
    low: roundCurrency(low),
    high: roundCurrency(high),
    total: roundCurrency(total),
    ageMult,
    table: [
      { item: "Interior Finishes", low: roundCurrency(low * 0.3), high: roundCurrency(high * 0.3) },
      { item: "Kitchen / Baths", low: roundCurrency(low * 0.25), high: roundCurrency(high * 0.25) },
      { item: "Mechanical Systems", low: roundCurrency(low * 0.2), high: roundCurrency(high * 0.2) },
      { item: "Roof / Exterior", low: roundCurrency(low * 0.15), high: roundCurrency(high * 0.15) },
      { item: "Contingency", low: roundCurrency(low * 0.1), high: roundCurrency(high * 0.1) },
    ],
  };
}

// ─── Market Velocity ──────────────────────────────────────────────────────────

export function calculateMarketVelocity(soldComps: Comp[], listingComps: Comp[]): MarketVelocityResult {
  const soldDOMs = soldComps.map((c) => c.daysOnMarket ?? 45).filter((d) => d > 0);
  const activeDOMs = listingComps.map((c) => c.daysOnMarket ?? 60).filter((d) => d > 0);

  const avgSoldDOM = soldDOMs.length > 0 ? soldDOMs.reduce((s, d) => s + d, 0) / soldDOMs.length : 45;
  const avgActiveDOM = activeDOMs.length > 0 ? activeDOMs.reduce((s, d) => s + d, 0) / activeDOMs.length : 60;

  const monthsOfInventory = listingComps.length > 0
    ? (listingComps.length / Math.max(soldComps.length, 1)) * (avgSoldDOM / 30)
    : 6;

  const marketVelocity: MarketVelocityResult["marketVelocity"] =
    avgSoldDOM < 30 ? "Fast" : avgSoldDOM < 60 ? "Normal" : "Slow";

  const absorptionRisk: MarketVelocityResult["absorptionRisk"] =
    monthsOfInventory < 3 ? "LOW" : monthsOfInventory < 6 ? "MEDIUM" : "HIGH";

  const marketType: MarketVelocityResult["marketType"] =
    monthsOfInventory < 4 ? "Seller" : monthsOfInventory < 7 ? "Balanced" : "Buyer";

  return {
    avgSoldDOM: Math.round(avgSoldDOM),
    avgActiveDOM: Math.round(avgActiveDOM),
    marketVelocity,
    monthsOfInventory: roundCurrency(monthsOfInventory),
    absorptionRisk,
    marketType,
    expectedListToClose: Math.round(avgSoldDOM + 30),
  };
}

// ─── PPSF Stats ───────────────────────────────────────────────────────────────

export function calculatePPSFStats(soldComps: Comp[], subjectARV: number, subjectSqft: number): PPSFStatsResult {
  const valid = soldComps.filter((c) => c.price > 0 && c.sqft > 0);
  const ppsfs = valid.map((c) => c.price / c.sqft);

  if (ppsfs.length === 0) {
    return { mean: 0, median: 0, stdDev: 0, min: 0, max: 0, subjectPPSF: 0, zScore: 0, isOutlier: false, position: "At Market", coeffVar: 0, sampleSize: 0 };
  }

  const mean = ppsfs.reduce((s, n) => s + n, 0) / ppsfs.length;
  const med = median(ppsfs);
  const sd = stdDev(ppsfs);
  const min = Math.min(...ppsfs);
  const max = Math.max(...ppsfs);
  const subjectPPSF = subjectSqft > 0 ? subjectARV / subjectSqft : 0;
  const zScore = sd > 0 ? (subjectPPSF - mean) / sd : 0;
  const coeffVar = mean > 0 ? sd / mean : 0;

  const position: PPSFStatsResult["position"] =
    subjectPPSF < mean * 0.95 ? "Below Market" : subjectPPSF > mean * 1.05 ? "Above Market" : "At Market";

  return {
    mean: roundCurrency(mean),
    median: roundCurrency(med),
    stdDev: roundCurrency(sd),
    min: roundCurrency(min),
    max: roundCurrency(max),
    subjectPPSF: roundCurrency(subjectPPSF),
    zScore: roundCurrency(zScore),
    isOutlier: Math.abs(zScore) > 2,
    position,
    coeffVar: roundCurrency(coeffVar),
    sampleSize: valid.length,
  };
}

// ─── Deal Score ───────────────────────────────────────────────────────────────

export function calculateDealScore(data: {
  profit: number;
  roi: number;
  confidence: "High" | "Medium" | "Low";
  riskBand?: string;
  stressProfit?: number;
}): number {
  let score = 0;

  // Profit (30 pts)
  if (data.profit >= 60_000) score += 30;
  else if (data.profit >= 40_000) score += 22;
  else if (data.profit >= 25_000) score += 14;
  else if (data.profit > 0) score += 6;

  // ROI (25 pts)
  if (data.roi >= 0.25) score += 25;
  else if (data.roi >= 0.18) score += 18;
  else if (data.roi >= 0.12) score += 11;
  else if (data.roi > 0) score += 4;

  // Confidence (25 pts)
  if (data.confidence === "High") score += 25;
  else if (data.confidence === "Medium") score += 15;
  else score += 5;

  // Stress test (20 pts)
  const sp = data.stressProfit ?? data.profit;
  if (sp >= 30_000) score += 20;
  else if (sp >= 15_000) score += 13;
  else if (sp > 0) score += 6;

  return clamp(score, 0, 100);
}

// ─── Risk Assessment ──────────────────────────────────────────────────────────

export function assessInsuranceRisk(conditionClass: string): InsuranceRiskResult {
  const map: Record<string, InsuranceRiskResult> = {
    C1: { label: "Standard", note: "Normal insurance expected", level: "standard" },
    C2: { label: "Standard", note: "Minor deferred maintenance — manageable", level: "standard" },
    C3: { label: "Elevated", note: "Moderate rehab may affect insurability; obtain coverage before closing", level: "elevated" },
    C4: { label: "Elevated", note: "Full rehab condition — builder's risk policy likely required", level: "elevated" },
    C5: { label: "Critical", note: "Gut renovation — standard carriers may decline; specialized coverage required", level: "critical" },
  };
  return map[conditionClass] ?? map.C3;
}

export function assessPermitRisk(conditionClass: string, _state?: string): PermitRiskResult {
  const map: Record<string, PermitRiskResult> = {
    C1: { estimatedDays: 0, risk: "No permits expected", riskClass: "is-pass" },
    C2: { estimatedDays: 15, risk: "Minor work — cosmetic permits if required", riskClass: "is-pass" },
    C3: { estimatedDays: 30, risk: "Moderate scope — permits likely for systems work", riskClass: "is-warn" },
    C4: { estimatedDays: 45, risk: "Full rehab — multiple permit types expected", riskClass: "is-warn" },
    C5: { estimatedDays: 75, risk: "Gut renovation — extended permitting timeline; verify local requirements", riskClass: "is-stop" },
  };
  return map[conditionClass] ?? map.C3;
}

// ─── EMD ─────────────────────────────────────────────────────────────────────

export function calcSuggestedEMD(offerPrice: number): number {
  if (offerPrice >= 500_000) return roundCurrency(offerPrice * 0.02);
  if (offerPrice >= 200_000) return roundCurrency(offerPrice * 0.025);
  return roundCurrency(offerPrice * 0.03);
}

// ─── Seasonal Factor ──────────────────────────────────────────────────────────

export function calculateSeasonalFactor(): SeasonalFactorResult {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed

  const data: Array<{ name: string; factor: number; label: string; rec: string }> = [
    { name: "January", factor: 0.82, label: "Off-Peak", rec: "Strong buying window — less competition" },
    { name: "February", factor: 0.85, label: "Off-Peak", rec: "Market warming — good time to acquire" },
    { name: "March", factor: 0.95, label: "Ramp Up", rec: "Spring market begins — act before peak" },
    { name: "April", factor: 1.08, label: "Peak", rec: "High buyer demand — strong exit potential" },
    { name: "May", factor: 1.12, label: "Peak", rec: "Prime selling season — maximize ARV timing" },
    { name: "June", factor: 1.10, label: "Peak", rec: "Still strong — time rehab for fall close" },
    { name: "July", factor: 1.05, label: "Peak", rec: "Slightly softer — plan for August close" },
    { name: "August", factor: 0.98, label: "Tapering", rec: "Market moderating — price competitively" },
    { name: "September", factor: 0.94, label: "Tapering", rec: "Fall demand — motivated buyers still active" },
    { name: "October", factor: 0.90, label: "Off-Peak", rec: "Seasonal slowdown — negotiate harder on buy" },
    { name: "November", factor: 0.83, label: "Off-Peak", rec: "Buy season — sellers more flexible" },
    { name: "December", factor: 0.80, label: "Off-Peak", rec: "Best acquisition window — minimal competition" },
  ];

  const current = data[month];
  const isWinter = month === 11 || month === 0 || month === 1;
  const isPeak = month >= 3 && month <= 6;

  return {
    month: month + 1,
    monthName: current.name,
    factor: current.factor,
    label: current.label,
    recommendation: current.rec,
    isWinter,
    isPeak,
  };
}

export function calculateSharpeRatio(roi: number, coeffVar: number): SharpeResult {
  const riskFreeRate = 0.045;
  const sharpe = coeffVar > 0 ? (roi - riskFreeRate) / coeffVar : 0;

  const grade: SharpeResult["grade"] =
    sharpe >= 2 ? "Excellent" : sharpe >= 1 ? "Good" : sharpe >= 0.5 ? "Fair" : "Poor";

  const gradeClass: SharpeResult["gradeClass"] =
    sharpe >= 1 ? "is-pass" : sharpe >= 0.5 ? "is-warn" : "is-stop";

  return { sharpe: roundCurrency(sharpe), grade, gradeClass };
}
