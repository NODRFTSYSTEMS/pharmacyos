/**
 * Role values are snake_case strings — consistent across JWT custom claim,
 * RLS policies, Edge Function checks, and frontend route guards.
 * Authority: ADR Decision 7.
 */
export const ROLES = [
  'pharmacist',
  'pharmacy_technician',
  'front_desk_cashier',
  'manager',
  'admin',
] as const

export type Role = (typeof ROLES)[number]

export const ALL_ROLES: readonly Role[] = ROLES

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value)
}
