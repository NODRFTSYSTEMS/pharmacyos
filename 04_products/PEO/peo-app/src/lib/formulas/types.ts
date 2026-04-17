export interface SellerInputs {
  expectedSalePrice: number;
  mortgagePayoff: number;
  prepCosts: number;
  saleCostRate: number; // e.g., 0.08 for 8%
  concessions: number;
}

export interface SellerOutputs {
  netProceeds: number;
  saleCosts: number;
  netBeforePayoff: number;
}

export type KillSwitchSeverity = "CRITICAL" | "HIGH" | "MEDIUM";

export interface KillSwitchDefinition {
  id: string;
  label: string;
  severity: KillSwitchSeverity;
  costMin: number;
  costMax: number;
}

// Kill switch IDs the form sends
export type KillSwitchId =
  | "foundation"
  | "knob-tube"
  | "galvanized-plumbing"
  | "active-roof-leak"
  | "lead-paint"
  | "moisture-mold"
  | "unpermitted-work"
  | "failed-septic"
  | "hvac-replacement";

export type InvestorProfile = "conservative" | "balanced" | "aggressive";

export interface InvestorProfileThresholds {
  minProfitFloor: number;
  targetProfitRate: number;
  highRiskProfitThreshold: number;
  highRiskRoiThreshold: number;
  elevatedRiskProfitThreshold: number;
  elevatedRiskRoiThreshold: number;
}

export interface InvestorInputs {
  purchasePrice: number;
  arv: number;
  repairs: number;
  holdMonths: number;
  purchaseClosingRate: number; // e.g., 0.02
  dispositionCostRate: number; // e.g., 0.09
  annualInterestRate: number;  // e.g., 0.12
  pointsRate: number;          // e.g., 0.02
  // Optional kill switches (array of active kill switch IDs)
  activeKillSwitches?: KillSwitchId[];
  // Optional investor profile (used for threshold overrides)
  investorProfile?: InvestorProfile;
}

export interface InvestorOutputs {
  mao: number;
  seventyPercentMao: number;
  profit: number;
  roi: number;
  requiredProfit: number;
  totalCosts: number;
  stressProfit: number;
  riskBand: string;
  killSwitchAdjustment?: number;
  killSwitchCount?: number;
  dealGrade?: string;
  dealScore?: number;
}

export interface RehabLineItem {
  category: string;
  description: string;
  quantity: number;
  unitCost: number;
  regionalMultiplier?: number;
}

export interface InvestorAdvancedInputs extends InvestorInputs {
  monthlyRent: number;
  operatingExpenseRate: number;
  refiLtv: number;
  refiInterestRate: number;
  refiTermYears: number;
  contractPrice: number;
  cashInvested: number;
  rehabItems: RehabLineItem[];
  globalRegionalMultiplier: number;
}

// Named stress scenario (5 for Advanced)
export interface StressScenario {
  label: string;
  arvVariance: number;
  repairVariance: number;
  holdVariance: number;
  mao: number;
  profit: number;
  roi: number;
  riskBand: string;
  status: "viable" | "marginal" | "negative";
}

export interface ScenarioOutputs {
  base: InvestorOutputs & InvestorAdvancedOutputs;
  upside: InvestorOutputs & InvestorAdvancedOutputs;
  downside: InvestorOutputs & InvestorAdvancedOutputs;
}

export interface InvestorAdvancedOutputs {
  rehabTotal: number;
  dscr: number;
  refiProceeds: number;
  cashOnCash: number;
  wholesaleSpread: number;
  annualCashFlow: number;
  scenarios?: ScenarioOutputs;
  stressScenarios?: StressScenario[];
  sharpeRatio?: number;
  sharpeGrade?: string;
  investorProfileUsed?: InvestorProfile;
}
