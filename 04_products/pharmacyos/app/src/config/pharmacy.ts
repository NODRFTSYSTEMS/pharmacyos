/**
 * Pharmacy deployment configuration.
 * Single source of truth for the deployed pharmacy's identity + operating defaults.
 *
 * Override per deployment by replacing this file at deploy time, or by reading from
 * environment variables / a `pharmacies` table once Supabase wires up. For Phase 1
 * (single-tenant Winchester deployment) the values below are the live config.
 */
export const pharmacyConfig = {
  // Identity — appears on receipts, prescriptions, reports, headers
  name: 'Winchester Global Pharmacy',
  shortName: 'Winchester Global',
  location: 'Kingston',

  // Contact + regulatory
  address: '42 Hope Road, Kingston 6, Jamaica',
  phone: '876-555-0142',
  pharmacyCouncilNumber: 'PCJ-2024-0817',

  // Operational defaults — overridable per drug from Settings
  defaults: {
    lowStockThreshold: 50,
    expiryAlertWindowDays: 90,
    blockExpiredDispensing: true,
    autoGeneratePurchaseOrders: false,
  },

  // Currency + locale
  currency: 'JMD',
  taxRatePercent: 15, // GCT
} as const

export type PharmacyConfig = typeof pharmacyConfig
