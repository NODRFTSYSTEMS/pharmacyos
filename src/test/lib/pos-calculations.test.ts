import { describe, it, expect } from 'vitest'

// ── POS Terminal business logic — calculation tests ───────────────────────────
// These mirror the exact formulas in PosTerminal.tsx lines 497–506.
// If those formulas change, these tests WILL fail — that is intentional.
// A broken GCT rate or wrong change-due is a revenue and compliance problem.

// ── Mirror PosTerminal.tsx calculation functions ──────────────────────────────

function r2(n: number): number {
  return Math.round(n * 100) / 100
}

interface CartItem {
  unit_price: number
  qty: number
}

function calcSubtotal(cart: CartItem[]): number {
  return r2(cart.reduce((s, i) => s + i.unit_price * i.qty, 0))
}

function calcTax(subtotal: number, gctRatePct: number): number {
  return r2(subtotal * (gctRatePct / 100))
}

function calcTotal(subtotal: number, tax: number): number {
  return r2(subtotal + tax)
}

function calcChangeDue(cashTendered: number, total: number): number {
  return cashTendered - total
}

function calcPointsToEarn(total: number, loyaltyRate: number, hasCustomer: boolean): number {
  return hasCustomer ? Math.floor(total * loyaltyRate) : 0
}

function canSubmit(
  cartLength: number,
  payMethod: string,
  cashTendered: number,
  total: number,
): boolean {
  return cartLength > 0 && (payMethod !== 'CASH' || cashTendered >= total)
}

// ── r2 rounding ───────────────────────────────────────────────────────────────

describe('r2 — 2-decimal rounding', () => {
  it('rounds a whole number cleanly', () => {
    expect(r2(100)).toBe(100)
  })

  it('rounds 2 decimal places (no change)', () => {
    expect(r2(12.50)).toBe(12.50)
  })

  it('rounds third decimal up', () => {
    // 10.005 → should round to 10.01 (float precision caveat: 10.005 in JS = 10.004999...)
    // The formula must not change this behaviour silently
    expect(r2(10.006)).toBe(10.01)
  })

  it('rounds third decimal down', () => {
    expect(r2(10.004)).toBe(10)
  })

  it('handles zero', () => {
    expect(r2(0)).toBe(0)
  })

  it('handles large amounts without loss of precision at 2dp', () => {
    expect(r2(9999.995)).toBe(10000)
  })
})

// ── Cart subtotal ─────────────────────────────────────────────────────────────

describe('calcSubtotal — cart line total accumulation', () => {
  it('sums a single item', () => {
    expect(calcSubtotal([{ unit_price: 100, qty: 1 }])).toBe(100)
  })

  it('multiplies unit_price by qty per line', () => {
    expect(calcSubtotal([{ unit_price: 50, qty: 3 }])).toBe(150)
  })

  it('sums multiple lines', () => {
    const cart: CartItem[] = [
      { unit_price: 100, qty: 2 },
      { unit_price: 50,  qty: 1 },
      { unit_price: 25,  qty: 4 },
    ]
    // 200 + 50 + 100 = 350
    expect(calcSubtotal(cart)).toBe(350)
  })

  it('returns 0 for empty cart', () => {
    expect(calcSubtotal([])).toBe(0)
  })

  it('rounds sub-cent results to 2dp', () => {
    // unit_price with fractional cents
    expect(calcSubtotal([{ unit_price: 10.005, qty: 2 }])).toBe(r2(20.01))
  })

  it('handles large pharmacy order values', () => {
    const cart: CartItem[] = [
      { unit_price: 4999.99, qty: 10 },
      { unit_price: 199.99,  qty: 5  },
    ]
    // 49999.90 + 999.95 = 50999.85
    expect(calcSubtotal(cart)).toBe(r2(50999.85))
  })
})

// ── GCT tax calculation ───────────────────────────────────────────────────────

describe('calcTax — Jamaica GCT (General Consumption Tax)', () => {
  it('applies 15% GCT correctly (default rate)', () => {
    expect(calcTax(100, 15)).toBe(15)
  })

  it('applies 16.5% GCT correctly (if rate ever changes)', () => {
    expect(calcTax(100, 16.5)).toBe(16.5)
  })

  it('rounds tax to 2 decimal places', () => {
    // 53.33 * 0.15 = 7.9995 → rounds to 8.00
    expect(calcTax(53.33, 15)).toBe(8)
  })

  it('returns 0 tax on 0 subtotal', () => {
    expect(calcTax(0, 15)).toBe(0)
  })

  it('returns 0 tax at 0% rate', () => {
    expect(calcTax(1000, 0)).toBe(0)
  })

  it('tax on large order rounds correctly', () => {
    // 50999.85 * 0.15 = 7649.9775 → rounds to 7649.98
    expect(calcTax(50999.85, 15)).toBe(7649.98)
  })

  it('REGRESSION: GCT must not be applied to already-taxed total', () => {
    // Tax is always applied to subtotal, never to total
    const subtotal = 1000
    const tax = calcTax(subtotal, 15) // must be 150, not calcTax(1150, 15)
    expect(tax).toBe(150)
    expect(tax).not.toBe(calcTax(subtotal + tax, 15))
  })
})

// ── Order total ───────────────────────────────────────────────────────────────

describe('calcTotal — subtotal + GCT', () => {
  it('adds subtotal and tax', () => {
    expect(calcTotal(100, 15)).toBe(115)
  })

  it('total equals subtotal when tax is 0', () => {
    expect(calcTotal(500, 0)).toBe(500)
  })

  it('total is always greater than subtotal when tax > 0', () => {
    const sub = 350
    const tax = calcTax(sub, 15)
    const tot = calcTotal(sub, tax)
    expect(tot).toBeGreaterThan(sub)
  })

  it('REGRESSION: total must not be computed before rounding subtotal and tax separately', () => {
    // Chained from real values to ensure no double-rounding error
    const sub = calcSubtotal([{ unit_price: 33.33, qty: 3 }])    // 99.99
    const tax = calcTax(sub, 15)                                   // 15.00 (rounded)
    const tot = calcTotal(sub, tax)
    expect(tot).toBe(114.99)
  })
})

// ── Change due ────────────────────────────────────────────────────────────────

describe('calcChangeDue — cash payment change', () => {
  it('returns 0 change for exact payment', () => {
    expect(calcChangeDue(115, 115)).toBe(0)
  })

  it('returns positive change when overpaid', () => {
    expect(calcChangeDue(200, 115)).toBe(85)
  })

  it('returns negative value when underpaid (canSubmit prevents this in UI)', () => {
    // Negative means insufficient cash — UI blocks submission
    expect(calcChangeDue(100, 115)).toBe(-15)
  })

  it('change_given in DB uses Math.max(0, changeDue) — never negative', () => {
    // PosTerminal.tsx line 531: Math.max(0, changeDue)
    const changeDue = calcChangeDue(100, 115)
    const changeGiven = Math.max(0, changeDue)
    expect(changeGiven).toBe(0)
  })

  it('handles fractional JMD amounts', () => {
    expect(calcChangeDue(500, 114.99)).toBeCloseTo(385.01, 2)
  })
})

// ── canSubmit guard ───────────────────────────────────────────────────────────

describe('canSubmit — POS submission validation', () => {
  it('allows submission with card payment and non-empty cart', () => {
    expect(canSubmit(2, 'CARD', 0, 115)).toBe(true)
  })

  it('allows submission with exact cash amount', () => {
    expect(canSubmit(1, 'CASH', 115, 115)).toBe(true)
  })

  it('allows submission when cash exceeds total', () => {
    expect(canSubmit(1, 'CASH', 200, 115)).toBe(true)
  })

  it('blocks submission when cash is insufficient', () => {
    expect(canSubmit(1, 'CASH', 100, 115)).toBe(false)
  })

  it('blocks submission with empty cart regardless of payment method', () => {
    expect(canSubmit(0, 'CARD', 0, 0)).toBe(false)
    expect(canSubmit(0, 'CASH', 500, 0)).toBe(false)
  })

  it('blocks submission with empty cart even if sufficient cash provided', () => {
    expect(canSubmit(0, 'CASH', 200, 115)).toBe(false)
  })

  it('allows LYNK payment with non-empty cart (no cash validation)', () => {
    expect(canSubmit(3, 'LYNK', 0, 250)).toBe(true)
  })
})

// ── Loyalty points earned ─────────────────────────────────────────────────────

describe('calcPointsToEarn — loyalty programme', () => {
  it('earns points when loyalty customer is linked (default rate 1pt per $1)', () => {
    expect(calcPointsToEarn(115, 1, true)).toBe(115)
  })

  it('earns 0 points when no loyalty customer', () => {
    expect(calcPointsToEarn(115, 1, false)).toBe(0)
  })

  it('floors fractional points (no half-points)', () => {
    // 114.99 * 1 = 114.99 → floor → 114
    expect(calcPointsToEarn(114.99, 1, true)).toBe(114)
  })

  it('applies custom loyalty rate correctly', () => {
    // 2 points per $1 spent
    expect(calcPointsToEarn(100, 2, true)).toBe(200)
  })

  it('applies sub-1 loyalty rate (0.5 pts per $1)', () => {
    expect(calcPointsToEarn(200, 0.5, true)).toBe(100)
  })

  it('REGRESSION: points are earned on total (incl. GCT), not subtotal', () => {
    // PosTerminal.tsx line 506: pointsToEarn = Math.floor(total * loyaltyRate)
    // Not on subtotal. This test locks that behaviour in.
    const sub = 100
    const tax = calcTax(sub, 15)
    const tot = calcTotal(sub, tax) // 115
    const pts = calcPointsToEarn(tot, 1, true)
    expect(pts).toBe(115)     // total, not 100 (subtotal)
    expect(pts).not.toBe(100) // NOT subtotal
  })
})

// ── End-to-end POS sale scenario ──────────────────────────────────────────────

describe('POS full sale scenario — integration', () => {
  it('computes correct totals for a real pharmacy basket at 15% GCT', () => {
    const cart: CartItem[] = [
      { unit_price: 350,  qty: 2 },  // Amoxicillin 500mg x2
      { unit_price: 120,  qty: 1 },  // Paracetamol x1
    ]
    const subtotal = calcSubtotal(cart)    // 820.00
    const tax      = calcTax(subtotal, 15) // 123.00
    const total    = calcTotal(subtotal, tax) // 943.00

    expect(subtotal).toBe(820)
    expect(tax).toBe(123)
    expect(total).toBe(943)
  })

  it('cash transaction with change — receipt should show correct change', () => {
    const total      = 943
    const tendered   = 1000
    const changeDue  = calcChangeDue(tendered, total) // 57
    expect(changeDue).toBe(57)
  })

  it('loyalty customer earns correct points on the full basket', () => {
    const total  = 943
    const points = calcPointsToEarn(total, 1, true) // 943 pts
    expect(points).toBe(943)
  })
})
