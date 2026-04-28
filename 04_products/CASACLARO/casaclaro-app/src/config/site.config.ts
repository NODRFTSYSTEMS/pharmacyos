/**
 * Single source of truth for rates, thresholds, and regulatory values.
 * Update here when SMLMV changes, FX fallback shifts, or visa thresholds update.
 */
export const SITE_CONFIG = {
  /** Current Colombian minimum wage (SMLMV) — update January each year */
  smlmv_cop: 1_423_500,
  /** SMLMV in USD at approximate exchange rate — for display only */
  smlmv_usd_approx: 347,
  /** Year the SMLMV figure applies to */
  smlmv_year: 2026,

  /** FX fallback rate used when live API is unavailable */
  fx_fallback_cop_per_usd: 4_100,

  /** Investor visa minimum purchase threshold (USD) */
  investor_visa_min_usd: 145_000,

  /** Pensioner visa minimum pension (SMLMV multiples) */
  pensioner_visa_smlmv_multiple: 3,

  /** Standard income visa minimum (SMLMV multiples) */
  income_visa_smlmv_multiple: 10,

  /** Closing cost estimate as % of purchase price */
  closing_cost_pct: 0.025,

  /** Property transfer tax (impuesto de registro) estimate */
  transfer_tax_pct: 0.015,

  /** Notary fees estimate */
  notary_fee_pct: 0.003,

  /** Platform contact */
  contact_email: "hello@casaclaro.co",
  site_url: "https://casaclaro.co",

  /** Data freshness notice — update when auditing regulatory content */
  data_reviewed_date: "2026-03-29",
} as const;

export function smlmvToCop(multiples: number): number {
  return Math.round(SITE_CONFIG.smlmv_cop * multiples);
}

export function smlmvToUsd(multiples: number, rate = SITE_CONFIG.fx_fallback_cop_per_usd): number {
  return Math.round((SITE_CONFIG.smlmv_cop * multiples) / rate);
}
