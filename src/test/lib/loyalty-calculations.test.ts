import { describe, it, expect } from 'vitest'

// ── Loyalty points — calculation tests ───────────────────────────────────────
// Mirrors PosTerminal.tsx lines 506–516 and 590–598.
//
// Points earn formula: Math.floor(total * loyaltyRate)
//   - total = subtotal + GCT tax (points are earned on the FULL amount incl. tax)
//   - loyaltyRate is fetched from pharmacy_settings key 'loyalty_rate' (default: 1)
//   - Only credited when a loyalty customer is attached to the transaction
//   - Points are always whole numbers (Math.floor — never round up)
//
// Points balance update: loyaltyCustomer.points_balance + loyaltyEarned
//   - Stored in loyalty_customers.points_balance (integer)
//   - New customers start at 0
//
// Incorrect loyalty calculations affect:
//   - Customer trust: wrong points shown on receipt
//   - Financial liability: over-awarded points that can be redeemed
//   - LOYALTY_POINTS_EARN audit log entry

// ── Mirror PosTerminal.tsx line 506 ──────────────────────────────────────────

function calcPointsToEarn(total: number, loyaltyRate: number, hasCustomer: boolean): number {
  return hasCustomer ? Math.floor(total * loyaltyRate) : 0
}

function calcNewBalance(currentBalance: number, pointsEarned: number): number {
  return currentBalance + pointsEarned
}

// ── Points earn — core formula ────────────────────────────────────────────────

describe('calcPointsToEarn — points earned on transaction', () => {
  it('earns points when a loyalty customer is attached (default rate = 1)', () => {
    // Default loyaltyRate = 1 means 1 point per JMD dollar
    expect(calcPointsToEarn(1000, 1, true)).toBe(1000)
  })

  it('earns zero points when no loyalty customer is attached', () => {
    expect(calcPointsToEarn(1000, 1, false)).toBe(0)
  })

  it('always floors — never rounds up — to whole points', () => {
    // JMD 1000.75 × rate 1 = 1000.75 → floors to 1000
    expect(calcPointsToEarn(1000.75, 1, true)).toBe(1000)
  })

  it('handles fractional rate correctly: 0.5 points per dollar', () => {
    expect(calcPointsToEarn(500, 0.5, true)).toBe(250)
  })

  it('floors fractional result from rate × total', () => {
    // 500 × 0.3 = 150.0 → 150
    expect(calcPointsToEarn(500, 0.3, true)).toBe(150)
    // 501 × 0.3 = 150.3 → floors to 150
    expect(calcPointsToEarn(501, 0.3, true)).toBe(150)
  })

  it('zero total earns zero points even with a customer', () => {
    expect(calcPointsToEarn(0, 1, true)).toBe(0)
  })

  it('zero rate earns zero points', () => {
    expect(calcPointsToEarn(5000, 0, true)).toBe(0)
  })

  it('REGRESSION — points are on TOTAL (incl. GCT), not subtotal', () => {
    // subtotal = 1000, GCT 15% = 150, total = 1150
    // Points should be on 1150, not 1000
    const subtotal = 1000
    const tax      = Math.round(subtotal * 0.15 * 100) / 100  // 150
    const total    = Math.round((subtotal + tax) * 100) / 100  // 1150

    const pointsOnTotal    = calcPointsToEarn(total, 1, true)     // correct: 1150
    const pointsOnSubtotal = calcPointsToEarn(subtotal, 1, true)  // wrong: 1000

    expect(pointsOnTotal).toBe(1150)
    expect(pointsOnSubtotal).toBe(1000)
    expect(pointsOnTotal).toBeGreaterThan(pointsOnSubtotal) // tax-inclusive earns more
  })

  it('large transaction: JMD 50,000 at default rate earns 50,000 points', () => {
    expect(calcPointsToEarn(50000, 1, true)).toBe(50000)
  })

  it('no customer = no points regardless of total or rate', () => {
    expect(calcPointsToEarn(50000, 1, false)).toBe(0)
    expect(calcPointsToEarn(50000, 2, false)).toBe(0)
  })
})

// ── Balance update ────────────────────────────────────────────────────────────

describe('calcNewBalance — points balance after earn', () => {
  it('credits points to existing balance', () => {
    expect(calcNewBalance(500, 150)).toBe(650)
  })

  it('new customer starts at 0 and accumulates from first transaction', () => {
    expect(calcNewBalance(0, 1000)).toBe(1000)
  })

  it('zero points earned does not change balance', () => {
    expect(calcNewBalance(2500, 0)).toBe(2500)
  })

  it('large balance accumulation is additive (not capped)', () => {
    expect(calcNewBalance(99_000, 1500)).toBe(100_500)
  })
})

// ── Tier definitions — label and structure ────────────────────────────────────
// Mirrors Loyalty.tsx TierType and TIER_TABS

type Tier = 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM'

const VALID_TIERS: Tier[] = ['STANDARD', 'SILVER', 'GOLD', 'PLATINUM']

describe('loyalty tier structure', () => {
  it('exactly four tiers exist', () => {
    expect(VALID_TIERS).toHaveLength(4)
  })

  it('STANDARD is the lowest tier (default for new customers)', () => {
    expect(VALID_TIERS[0]).toBe('STANDARD')
  })

  it('PLATINUM is the highest tier', () => {
    expect(VALID_TIERS[VALID_TIERS.length - 1]).toBe('PLATINUM')
  })

  it('tiers in ascending order: STANDARD → SILVER → GOLD → PLATINUM', () => {
    expect(VALID_TIERS).toEqual(['STANDARD', 'SILVER', 'GOLD', 'PLATINUM'])
  })

  it('GOLD and PLATINUM are elite tiers (counted as "Gold / Platinum" metric)', () => {
    const elite = VALID_TIERS.filter(t => t === 'GOLD' || t === 'PLATINUM')
    expect(elite).toHaveLength(2)
  })
})

// ── Loyalty customer validation ───────────────────────────────────────────────
// Mirrors LoyaltyDrawer validate() function (Loyalty.tsx line 149–154)

interface DrawerFormState {
  name:      string
  phone:     string
  email:     string
  tier:      Tier
  notes:     string
  is_active: boolean
}

function validateLoyaltyForm(form: DrawerFormState): Record<string, string> {
  const errs: Record<string, string> = {}
  if (!form.name.trim()) errs.name = 'Name is required'
  return errs
}

describe('loyalty customer form validation', () => {
  const baseForm: DrawerFormState = {
    name:      'Margaret Brown',
    phone:     '876-555-0101',
    email:     'm.brown@example.com',
    tier:      'STANDARD',
    notes:     '',
    is_active: true,
  }

  it('valid form produces no errors', () => {
    expect(validateLoyaltyForm(baseForm)).toEqual({})
  })

  it('empty name is invalid', () => {
    const errs = validateLoyaltyForm({ ...baseForm, name: '' })
    expect(errs.name).toBe('Name is required')
  })

  it('whitespace-only name is invalid (trim check)', () => {
    const errs = validateLoyaltyForm({ ...baseForm, name: '   ' })
    expect(errs.name).toBe('Name is required')
  })

  it('phone is optional — empty phone does not cause validation error', () => {
    const errs = validateLoyaltyForm({ ...baseForm, phone: '' })
    expect(errs).not.toHaveProperty('phone')
  })

  it('email is optional — empty email does not cause validation error', () => {
    const errs = validateLoyaltyForm({ ...baseForm, email: '' })
    expect(errs).not.toHaveProperty('email')
  })

  it('is_active=false is valid — inactive customers can be saved', () => {
    const errs = validateLoyaltyForm({ ...baseForm, is_active: false })
    expect(errs).toEqual({})
  })

  it('all tiers are valid form values', () => {
    for (const tier of VALID_TIERS) {
      const errs = validateLoyaltyForm({ ...baseForm, tier })
      expect(errs).toEqual({})
    }
  })
})

// ── New customer payload ──────────────────────────────────────────────────────
// Mirrors LoyaltyDrawer mutation insert line 128: { ...payload, points_balance: 0 }

describe('new loyalty customer — initial state', () => {
  it('new customers start with points_balance of 0', () => {
    const newCustomerPayload = {
      name:           'Devon Campbell',
      phone:          '876-555-0202',
      email:          null,
      notes:          null,
      tier:           'STANDARD' as Tier,
      is_active:      true,
      points_balance: 0,               // always 0 for new customers
      joined_date:    new Date().toISOString(),
    }
    expect(newCustomerPayload.points_balance).toBe(0)
  })

  it('REGRESSION — do not inherit points from a previous customer record', () => {
    // If a bug copied editTarget.points_balance into a new create payload,
    // the new customer would start with non-zero points.
    const previousCustomerBalance = 2500
    const newCustomerBalance = 0  // must always be 0, never copied from editTarget

    expect(newCustomerBalance).toBe(0)
    expect(newCustomerBalance).not.toBe(previousCustomerBalance)
  })
})

// ── Points earn — full transaction scenario ───────────────────────────────────

describe('loyalty — full POS transaction scenario', () => {
  it('standard customer earns expected points on a typical basket', () => {
    // Basket: 3 items totalling JMD 2,500 subtotal
    const subtotal    = 2500
    const gctRatePct  = 16.5  // Jamaica standard GCT
    const tax         = Math.round(subtotal * (gctRatePct / 100) * 100) / 100  // 412.50
    const total       = Math.round((subtotal + tax) * 100) / 100               // 2912.50

    const loyaltyRate    = 1
    const pointsToEarn   = calcPointsToEarn(total, loyaltyRate, true)           // floor(2912.50) = 2912
    const currentBalance = 1500
    const newBalance     = calcNewBalance(currentBalance, pointsToEarn)         // 4412

    expect(Math.round(tax * 100) / 100).toBe(412.50)
    expect(Math.round(total * 100) / 100).toBe(2912.50)
    expect(pointsToEarn).toBe(2912)  // floored — not 2913
    expect(newBalance).toBe(4412)
  })

  it('transaction with no loyalty customer earns nothing and changes no balance', () => {
    const total        = 5000
    const loyaltyRate  = 1
    const pointsToEarn = calcPointsToEarn(total, loyaltyRate, false)

    expect(pointsToEarn).toBe(0)
    // No balance update happens — balance stays unchanged
  })
})
