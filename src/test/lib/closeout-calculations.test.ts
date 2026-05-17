import { describe, it, expect } from 'vitest'

// ── EOD Close-Out business logic — calculation tests ──────────────────────────
// Mirrors CloseOut.tsx query lines 75–86 and mutation payload lines 111–134.
//
// Incorrect EOD calculations affect:
//   - Compliance: incorrect status (SUBMITTED vs DISCREPANCY) written to eod_closeouts
//   - Audit: wrong variance persisted in cash_variance column
//   - Manager reports: aggregate totals and variance history

// ── totalSystem formula ───────────────────────────────────────────────────────
// Mirror CloseOut.tsx line 86: totalSystem = retailCash + retailCard + retailLynk + rxCash + rxCard
// NOTE: rxNhf is deliberately EXCLUDED — NHF is a government subsidy, not collected cash.

function calcTotalSystem(
  retailCash: number,
  retailCard: number,
  retailLynk: number,
  rxCash: number,
  rxCard: number,
): number {
  return retailCash + retailCard + retailLynk + rxCash + rxCard
}

describe('calcTotalSystem — EOD collected totals', () => {
  it('sums all five payment channels correctly', () => {
    expect(calcTotalSystem(5000, 3000, 1500, 2000, 800)).toBe(12300)
  })

  it('returns zero when all channels are zero', () => {
    expect(calcTotalSystem(0, 0, 0, 0, 0)).toBe(0)
  })

  it('excludes NHF subsidy — totalSystem does NOT include rxNhf', () => {
    // The NHF subsidy column exists in the data but is not added to totalSystem.
    // This is intentional: NHF is collected by the government, not by the pharmacy.
    const totalWithNhf   = calcTotalSystem(5000, 3000, 1500, 2000, 800) + 4000 // wrong old behavior
    const totalCorrect   = calcTotalSystem(5000, 3000, 1500, 2000, 800)         // correct
    expect(totalCorrect).toBe(12300)
    expect(totalWithNhf).toBe(16300)
    expect(totalCorrect).not.toBe(totalWithNhf)
  })

  it('handles decimal amounts correctly (JMD cents)', () => {
    expect(calcTotalSystem(1000.50, 500.25, 200.00, 300.75, 100.50)).toBeCloseTo(2102.00, 2)
  })

  it('cash-only shift: card and Lynk channels are zero', () => {
    expect(calcTotalSystem(8000, 0, 0, 1500, 0)).toBe(9500)
  })

  it('card-only shift: all cash and Lynk are zero', () => {
    expect(calcTotalSystem(0, 6000, 0, 0, 4000)).toBe(10000)
  })
})

// ── systemCash and expectedCashInDrawer ──────────────────────────────────────
// Mirror CloseOut.tsx lines 103–105:
//   systemCash = retailCash + rxCash  (card and Lynk never land in the drawer)
//   expectedCashInDrawer = openFloat + systemCash
//   cashVariance = actualCashCounted - expectedCashInDrawer

function calcSystemCash(retailCash: number, rxCash: number): number {
  return retailCash + rxCash
}

function calcExpectedCashInDrawer(openFloat: number, systemCash: number): number {
  return openFloat + systemCash
}

function calcCashVariance(actualCashCounted: number, expectedCashInDrawer: number): number {
  return actualCashCounted - expectedCashInDrawer
}

describe('cash reconciliation — drawer math', () => {
  it('systemCash is only retail cash + rx cash (not card or Lynk)', () => {
    // card and Lynk payments do not land in the cash drawer
    expect(calcSystemCash(5000, 2000)).toBe(7000)
  })

  it('expectedCashInDrawer = openFloat + systemCash', () => {
    const systemCash = calcSystemCash(5000, 2000)
    expect(calcExpectedCashInDrawer(3000, systemCash)).toBe(10000)
  })

  it('cashVariance is positive when drawer has MORE than expected (overage)', () => {
    // Cashier has JMD 100 more than expected — positive variance
    const expected = calcExpectedCashInDrawer(3000, calcSystemCash(5000, 2000)) // 10000
    expect(calcCashVariance(10100, expected)).toBe(100)
  })

  it('cashVariance is negative when drawer has LESS than expected (shortage)', () => {
    // Cashier is short JMD 200
    const expected = calcExpectedCashInDrawer(3000, calcSystemCash(5000, 2000)) // 10000
    expect(calcCashVariance(9800, expected)).toBe(-200)
  })

  it('cashVariance is zero when drawer matches exactly', () => {
    const expected = calcExpectedCashInDrawer(2000, calcSystemCash(4000, 1000)) // 7000
    expect(calcCashVariance(7000, expected)).toBe(0)
  })

  it('openFloat is included in expected drawer — it was there at start of shift', () => {
    // Float of 5000 + cash sales of 0 = expected 5000
    const expected = calcExpectedCashInDrawer(5000, calcSystemCash(0, 0))
    expect(expected).toBe(5000)
    // Counting the float as a "variance" would be wrong
    expect(calcCashVariance(5000, expected)).toBe(0)
  })
})

// ── VarianceBadge thresholds ─────────────────────────────────────────────────
// Mirror CloseOut.tsx VarianceBadge lines 18–21:
//   abs < 0.01  → 'balanced'
//   abs < 500   → 'warning'
//   abs >= 500  → 'discrepancy'

type VarianceLevel = 'balanced' | 'warning' | 'discrepancy'

function classifyVariance(variance: number): VarianceLevel {
  const abs = Math.abs(variance)
  if (abs < 0.01) return 'balanced'
  if (abs < 500)  return 'warning'
  return 'discrepancy'
}

describe('VarianceBadge — variance classification', () => {
  it('exact zero is balanced', () => {
    expect(classifyVariance(0)).toBe('balanced')
  })

  it('variance below 0.01 (sub-cent rounding) is balanced', () => {
    expect(classifyVariance(0.005)).toBe('balanced')
    expect(classifyVariance(-0.005)).toBe('balanced')
  })

  it('positive variance of JMD 100 is a warning (not discrepancy)', () => {
    expect(classifyVariance(100)).toBe('warning')
  })

  it('negative variance of JMD 200 is a warning (not discrepancy)', () => {
    expect(classifyVariance(-200)).toBe('warning')
  })

  it('variance of exactly JMD 499.99 is a warning', () => {
    expect(classifyVariance(499.99)).toBe('warning')
  })

  it('variance of exactly JMD 500 triggers discrepancy', () => {
    // boundary: >= 500 → discrepancy
    expect(classifyVariance(500)).toBe('discrepancy')
  })

  it('negative variance of JMD 500 also triggers discrepancy', () => {
    expect(classifyVariance(-500)).toBe('discrepancy')
  })

  it('large shortfall of JMD 2000 is discrepancy', () => {
    expect(classifyVariance(-2000)).toBe('discrepancy')
  })

  it('large overage of JMD 1000 is discrepancy', () => {
    expect(classifyVariance(1000)).toBe('discrepancy')
  })
})

// ── EOD submission status ─────────────────────────────────────────────────────
// Mirror CloseOut.tsx mutation payload line 130–132:
//   status = Math.abs(cashVariance) >= 500 ? 'DISCREPANCY' : 'SUBMITTED'
// Only applies when cashVariance is not null (i.e. actualCashCounted was entered)

type EodStatus = 'SUBMITTED' | 'DISCREPANCY'

function calcEodStatus(cashVariance: number | null): EodStatus {
  if (cashVariance === null) return 'SUBMITTED'
  return Math.abs(cashVariance) >= 500 ? 'DISCREPANCY' : 'SUBMITTED'
}

describe('EOD submission status', () => {
  it('balanced variance → SUBMITTED', () => {
    expect(calcEodStatus(0)).toBe('SUBMITTED')
  })

  it('small variance → SUBMITTED (under 500 threshold)', () => {
    expect(calcEodStatus(200)).toBe('SUBMITTED')
    expect(calcEodStatus(-300)).toBe('SUBMITTED')
  })

  it('variance at exactly 500 → DISCREPANCY', () => {
    expect(calcEodStatus(500)).toBe('DISCREPANCY')
  })

  it('variance over 500 → DISCREPANCY', () => {
    expect(calcEodStatus(750)).toBe('DISCREPANCY')
    expect(calcEodStatus(-800)).toBe('DISCREPANCY')
  })

  it('null variance (cashier count not entered) → SUBMITTED', () => {
    // When actualCashCounted is empty, cashVariance = null and status defaults to SUBMITTED
    expect(calcEodStatus(null)).toBe('SUBMITTED')
  })

  it('sub-cent floating point variance does not trigger discrepancy', () => {
    // 0.001 < 500 → SUBMITTED
    expect(calcEodStatus(0.001)).toBe('SUBMITTED')
  })

  it('REGRESSION — do not confuse overage and shortage: both use absolute value', () => {
    // A shortage of 500 is just as much a discrepancy as an overage of 500
    expect(calcEodStatus(-500)).toBe('DISCREPANCY')
    expect(calcEodStatus(500)).toBe('DISCREPANCY')
  })
})

// ── Full scenario: close-out day with mixed transactions ──────────────────────

describe('EOD — full shift scenario', () => {
  it('typical morning shift reconciles correctly', () => {
    // System records
    const retailCash = 12000
    const retailCard = 8500
    const retailLynk = 3200
    const rxCash     = 4500
    const rxCard     = 2800
    const rxNhf      = 15000 // government subsidy — excluded from totalSystem

    const totalSystem = calcTotalSystem(retailCash, retailCard, retailLynk, rxCash, rxCard)
    expect(totalSystem).toBe(31000) // nhf NOT included

    // Cashier count
    const openFloat   = 5000
    const systemCash  = calcSystemCash(retailCash, rxCash)  // 16500
    const expected    = calcExpectedCashInDrawer(openFloat, systemCash)  // 21500
    const actualCount = 21650   // cashier counts JMD 150 extra
    const variance    = calcCashVariance(actualCount, expected)  // +150

    expect(systemCash).toBe(16500)
    expect(expected).toBe(21500)
    expect(variance).toBe(150)
    expect(classifyVariance(variance)).toBe('warning')
    expect(calcEodStatus(variance)).toBe('SUBMITTED')   // 150 < 500

    // NHF is tracked separately but not in the variance calculation
    expect(rxNhf).toBe(15000)
  })

  it('shift with large shortage triggers DISCREPANCY status', () => {
    const retailCash = 8000
    const retailCard = 5000
    const retailLynk = 2000
    const rxCash     = 3000
    const rxCard     = 1500

    const totalSystem = calcTotalSystem(retailCash, retailCard, retailLynk, rxCash, rxCard)
    expect(totalSystem).toBe(19500)

    const openFloat  = 3000
    const systemCash = calcSystemCash(retailCash, rxCash)  // 11000
    const expected   = calcExpectedCashInDrawer(openFloat, systemCash)  // 14000
    const actual     = 13400  // JMD 600 short
    const variance   = calcCashVariance(actual, expected)  // -600

    expect(variance).toBe(-600)
    expect(classifyVariance(variance)).toBe('discrepancy')
    expect(calcEodStatus(variance)).toBe('DISCREPANCY')
  })
})
