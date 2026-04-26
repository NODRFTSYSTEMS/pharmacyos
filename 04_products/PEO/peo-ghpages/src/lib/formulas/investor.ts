import type {
  InvestorInputs,
  InvestorOutputs,
  KillSwitchId,
  KillSwitchDefinition,
  InvestorProfile,
  InvestorProfileThresholds,
} from "./types";
import type { CompRecord, PropertyFacts, ListingRecord } from "@/lib/property-data/stub";

// ─── Kill Switch Definitions ────────────────────────────────────────────────

export const KILL_SWITCH_DEFINITIONS: KillSwitchDefinition[] = [
  { id: "foundation",           label: "Foundation Issues",       severity: "CRITICAL", costMin: 18000, costMax: 45000 },
  { id: "knob-tube",            label: "Knob-and-Tube Wiring",    severity: "HIGH",     costMin: 8000,  costMax: 18000 },
  { id: "galvanized-plumbing",  label: "Galvanized Plumbing",     severity: "HIGH",     costMin: 6000,  costMax: 14000 },
  { id: "active-roof-leak",     label: "Active Roof Leak",        severity: "HIGH",     costMin: 5000,  costMax: 13000 },
  { id: "lead-paint",           label: "Lead Paint",              severity: "MEDIUM",   costMin: 1500,  costMax: 7000  },
  { id: "moisture-mold",        label: "Moisture / Mold",         severity: "HIGH",     costMin: 3000,  costMax: 12000 },
  { id: "unpermitted-work",     label: "Unpermitted Work",        severity: "MEDIUM",   costMin: 2000,  costMax: 10000 },
  { id: "failed-septic",        label: "Failed Septic System",    severity: "CRITICAL", costMin: 15000, costMax: 35000 },
  { id: "hvac-replacement",     label: "HVAC Replacement",        severity: "MEDIUM",   costMin: 5000,  costMax: 12000 },
];

export function getKillSwitchDefinition(id: KillSwitchId): KillSwitchDefinition | undefined {
  return KILL_SWITCH_DEFINITIONS.find((ks) => ks.id === id);
}

export function calculateKillSwitchAdjustment(activeIds: KillSwitchId[]): number {
  const uniqueIds = [...new Set(activeIds)];
  return uniqueIds.reduce((sum, id) => {
    const def = getKillSwitchDefinition(id);
    if (!def) return sum;
    return sum + (def.costMin + def.costMax) / 2;
  }, 0);
}

// ─── Investor Profile Thresholds ────────────────────────────────────────────

export const INVESTOR_PROFILES: Record<InvestorProfile, InvestorProfileThresholds> = {
  conservative: {
    minProfitFloor: 40000,
    targetProfitRate: 0.22,
    highRiskProfitThreshold: 20000,
    highRiskRoiThreshold: 10,
    elevatedRiskProfitThreshold: 50000,
    elevatedRiskRoiThreshold: 16,
  },
  balanced: {
    minProfitFloor: 30000,
    targetProfitRate: 0.15,
    highRiskProfitThreshold: 10000,
    highRiskRoiThreshold: 5,
    elevatedRiskProfitThreshold: 30000,
    elevatedRiskRoiThreshold: 15,
  },
  aggressive: {
    minProfitFloor: 22000,
    targetProfitRate: 0.12,
    highRiskProfitThreshold: 8000,
    highRiskRoiThreshold: 4,
    elevatedRiskProfitThreshold: 22000,
    elevatedRiskRoiThreshold: 12,
  },
};

function getProfileThresholds(profile?: InvestorProfile): InvestorProfileThresholds {
  return INVESTOR_PROFILES[profile ?? "balanced"];
}

// ─── Core Calculations ───────────────────────────────────────────────────────

export function calculateRequiredProfit(arv: number, profile?: InvestorProfile): number {
  const thresholds = getProfileThresholds(profile);
  return Math.max(thresholds.minProfitFloor, arv * thresholds.targetProfitRate);
}

export function calculateSeventyPercentMao(arv: number, repairs: number): number {
  return arv * 0.7 - repairs;
}

export function calculateCanonicalMao(
  arv: number,
  repairs: number,
  totalCosts: number,
  killSwitchAdjustment: number = 0,
  profile?: InvestorProfile
): number {
  const requiredProfit = calculateRequiredProfit(arv, profile);
  return arv - repairs - totalCosts - requiredProfit - killSwitchAdjustment;
}

export function calculateVerifiedArv(comps: CompRecord[]): number {
  if (comps.length === 0) return 0;
  const prices = comps.map((c) => c.salePrice).sort((a, b) => a - b);
  const mid = Math.floor(prices.length / 2);
  return prices.length % 2 === 0
    ? (prices[mid - 1] + prices[mid]) / 2
    : prices[mid];
}

export function calculateMarketArv(listings: ListingRecord[]): number {
  if (listings.length === 0) return 0;
  const prices = listings.map((l) => l.listPrice).sort((a, b) => a - b);
  const mid = Math.floor(prices.length / 2);
  return prices.length % 2 === 0
    ? (prices[mid - 1] + prices[mid]) / 2
    : prices[mid];
}

export function calculateCompQualityScore(
  comp: CompRecord,
  subject: PropertyFacts
): number {
  let score = 0;

  // Geography 30%
  if (comp.distanceMiles <= 0.3) score += 30;
  else if (comp.distanceMiles <= 0.5) score += 20;
  else if (comp.distanceMiles <= 1.0) score += 10;
  else score += 5;

  // Recency 25%
  const saleDate = new Date(comp.saleDate);
  const now = new Date();
  const monthsAgo =
    (now.getFullYear() - saleDate.getFullYear()) * 12 +
    (now.getMonth() - saleDate.getMonth());
  if (monthsAgo <= 6) score += 25;
  else if (monthsAgo <= 12) score += 15;
  else if (monthsAgo <= 24) score += 5;

  // GLA Similarity 20%
  if (subject.squareFootage && subject.squareFootage > 0) {
    const diff = Math.abs(comp.squareFootage - subject.squareFootage) / subject.squareFootage;
    if (diff <= 0.1) score += 20;
    else if (diff <= 0.2) score += 10;
    else score += 5;
  } else {
    score += 10;
  }

  // Physical Match 15%
  let physicalMatch = 0;
  if (subject.bedrooms !== undefined && comp.bedrooms === subject.bedrooms) physicalMatch += 8;
  else physicalMatch += 4;
  if (subject.bathrooms !== undefined && comp.bathrooms === subject.bathrooms) physicalMatch += 7;
  else physicalMatch += 3;
  score += physicalMatch;

  // Condition Match 10% — stubbed neutral (no condition grades on comps from Rentcast)
  score += 5;

  return Math.min(100, score);
}

export function calculateStressProfit(inputs: InvestorInputs): number {
  const downPct = inputs.downPaymentPct ?? 0.2;
  const loanAmount = inputs.purchasePrice * (1 - downPct);
  const purchaseClosingCosts = inputs.purchasePrice * inputs.purchaseClosingRate;
  const dispositionCosts = inputs.arv * inputs.dispositionCostRate;
  const points = loanAmount * inputs.pointsRate;
  const monthlyInterest = (loanAmount * inputs.annualInterestRate) / 12;
  const carryCosts = monthlyInterest * inputs.holdMonths;
  const totalCosts = purchaseClosingCosts + dispositionCosts + points + carryCosts;
  const killSwitchAdjustment = calculateKillSwitchAdjustment(inputs.activeKillSwitches ?? []);
  return inputs.arv * 0.95 - inputs.purchasePrice - inputs.repairs * 1.15 - totalCosts - killSwitchAdjustment;
}

export function calculateRiskBand(
  profit: number,
  roi: number,
  confidenceTier: string,
  profile?: InvestorProfile
): string {
  const t = getProfileThresholds(profile);
  if (profit < t.highRiskProfitThreshold || roi < t.highRiskRoiThreshold || confidenceTier === "VERY_LOW") return "High";
  if (profit < t.elevatedRiskProfitThreshold || roi < t.elevatedRiskRoiThreshold || confidenceTier === "LOW") return "Elevated";
  if (confidenceTier === "MEDIUM") return "Moderate";
  return "Low";
}

// ─── Deal Grade (A–D) ────────────────────────────────────────────────────────

export function calculateDealGrade(
  profit: number,
  roi: number,
  stressProfit: number,
  confidenceTier: string,
  dscr?: number,
  profile?: InvestorProfile
): { grade: string; score: number } {
  const t = getProfileThresholds(profile);
  let score = 100;

  if (roi < t.targetProfitRate * 100)          score -= 20;
  if (profit < t.minProfitFloor)               score -= 15;
  if (stressProfit < 0)                        score -= 25;
  if (dscr !== undefined && dscr < 1.25)       score -= 15;

  // Confidence penalty
  if (confidenceTier === "VERY_LOW") score -= 20;
  else if (confidenceTier === "LOW") score -= 10;
  else if (confidenceTier === "MEDIUM") score -= 5;

  score = Math.max(0, score);

  let grade: string;
  if (score >= 85)      grade = "A";
  else if (score >= 70) grade = "B";
  else if (score >= 50) grade = "C";
  else                  grade = "D";

  return { grade, score };
}

// ─── Main Deal Calculation ───────────────────────────────────────────────────

export function calculateInvestorDeal(
  inputs: InvestorInputs,
  confidenceTier: string = "HIGH"
): InvestorOutputs {
  const activeKillSwitches = inputs.activeKillSwitches ?? [];
  const killSwitchAdjustment = calculateKillSwitchAdjustment(activeKillSwitches);
  const profile = inputs.investorProfile;

  const downPct = inputs.downPaymentPct ?? 0.2;
  const loanAmount = inputs.purchasePrice * (1 - downPct);

  const purchaseClosingCosts = inputs.purchasePrice * inputs.purchaseClosingRate;
  const dispositionCosts = inputs.arv * inputs.dispositionCostRate;
  const points = loanAmount * inputs.pointsRate;

  // Interest-only carry on LOAN AMOUNT (not purchase price) for hold months
  const monthlyInterest = (loanAmount * inputs.annualInterestRate) / 12;
  const carryCosts = monthlyInterest * inputs.holdMonths;

  const totalCosts = purchaseClosingCosts + dispositionCosts + points + carryCosts;

  const requiredProfit = calculateRequiredProfit(inputs.arv, profile);

  // Kill switch adjustment reduces MAO BEFORE the 70% rule ceiling is applied
  const canonicalMao = calculateCanonicalMao(inputs.arv, inputs.repairs, totalCosts, killSwitchAdjustment, profile);
  const seventyPercentMao = calculateSeventyPercentMao(inputs.arv, inputs.repairs);
  const mao = Math.min(canonicalMao, seventyPercentMao);

  const profit = inputs.arv - inputs.purchasePrice - inputs.repairs - totalCosts - killSwitchAdjustment;

  // ROI denominator = cash actually invested (down payment + repairs + closing costs + points)
  const cashInvested = inputs.purchasePrice * downPct + inputs.repairs + purchaseClosingCosts + points;
  const roi = cashInvested > 0 ? (profit / cashInvested) * 100 : 0;

  const stressProfit = calculateStressProfit(inputs);
  const riskBand = calculateRiskBand(profit, roi, confidenceTier, profile);

  const { grade: dealGrade, score: dealScore } = calculateDealGrade(profit, roi, stressProfit, confidenceTier, undefined, profile);

  return {
    mao: Number(mao.toFixed(2)),
    seventyPercentMao: Number(seventyPercentMao.toFixed(2)),
    profit: Number(profit.toFixed(2)),
    roi: Number(roi.toFixed(2)),
    requiredProfit: Number(requiredProfit.toFixed(2)),
    totalCosts: Number(totalCosts.toFixed(2)),
    stressProfit: Number(stressProfit.toFixed(2)),
    riskBand,
    killSwitchAdjustment: Number(killSwitchAdjustment.toFixed(2)),
    killSwitchCount: activeKillSwitches.length,
    dealGrade,
    dealScore,
  };
}
