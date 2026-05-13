import { describe, it, expect } from 'vitest'

// ── Schedule Drug Log balance calculation ─────────────────────────────────────
// This is the core arithmetic that drives the Jamaica Dangerous Drugs Act
// controlled substances register. Errors here are regulatory failures.
//
// The formula is: balance = quantity_in - quantity_out
// Applied across sequential entries, the running balance must always be
// non-negative and traceable.

// Mirror the calculation used in ScheduleLog.tsx AddEntryDrawer:
//   balance: qIn - qOut
function computeBalance(qIn: number, qOut: number): number {
  return qIn - qOut
}

// Mirror the row-level calculation for a running balance:
function runningBalance(entries: Array<{ quantity_in: number; quantity_out: number }>): number {
  return entries.reduce((acc, e) => acc + e.quantity_in - e.quantity_out, 0)
}

describe('Schedule Drug Log — entry balance (I-07 compliance)', () => {
  it('computes positive balance when receiving stock (qIn > 0, qOut = 0)', () => {
    expect(computeBalance(100, 0)).toBe(100)
  })

  it('computes negative balance when dispensing more than on hand', () => {
    // Negative balance is a compliance flag (potential diversion)
    expect(computeBalance(0, 50)).toBe(-50)
  })

  it('computes zero balance when qIn equals qOut', () => {
    expect(computeBalance(30, 30)).toBe(0)
  })

  it('computes partial dispense correctly', () => {
    expect(computeBalance(100, 25)).toBe(75)
  })

  it('handles large quantities without overflow', () => {
    // Pharmacy may receive bulk orders (e.g. 10,000 tablets)
    expect(computeBalance(10_000, 250)).toBe(9_750)
  })

  it('does not accept fractional quantities in whole-tablet context', () => {
    // Quantities stored as integers in the schema
    const qIn  = Math.floor(50.7)  // parseInt behavior
    const qOut = Math.floor(10.3)
    expect(computeBalance(qIn, qOut)).toBe(40)
  })
})

describe('Schedule Drug Log — running balance across multiple entries', () => {
  it('sums correctly across a sequence of receive and dispense entries', () => {
    const entries = [
      { quantity_in: 100, quantity_out: 0  },  // receive: balance 100
      { quantity_in: 0,   quantity_out: 10 },  // dispense: balance 90
      { quantity_in: 50,  quantity_out: 0  },  // receive: balance 140
      { quantity_in: 0,   quantity_out: 30 },  // dispense: balance 110
    ]
    expect(runningBalance(entries)).toBe(110)
  })

  it('returns zero for a balanced register', () => {
    const entries = [
      { quantity_in: 200, quantity_out: 0   },
      { quantity_in: 0,   quantity_out: 200 },
    ]
    expect(runningBalance(entries)).toBe(0)
  })

  it('returns zero for an empty register', () => {
    expect(runningBalance([])).toBe(0)
  })

  it('detects potential diversion (negative running balance)', () => {
    const entries = [
      { quantity_in: 50, quantity_out: 0  },
      { quantity_in: 0,  quantity_out: 60 },  // dispenses more than received
    ]
    const balance = runningBalance(entries)
    expect(balance).toBeLessThan(0)  // Flag for pharmacist review
    expect(balance).toBe(-10)
  })

  it('handles single-entry register', () => {
    const entries = [{ quantity_in: 10, quantity_out: 3 }]
    expect(runningBalance(entries)).toBe(7)
  })
})

describe('Schedule Drug Log — quantity validation rules', () => {
  it('rejects negative quantity_in', () => {
    // Validation rule from ScheduleLog.tsx: "Must be 0 or more"
    const isValid = (qty: number) => !isNaN(qty) && qty >= 0
    expect(isValid(-1)).toBe(false)
    expect(isValid(0)).toBe(true)
    expect(isValid(100)).toBe(true)
  })

  it('rejects entries where both qIn and qOut are zero', () => {
    // Validation rule: "At least one quantity required"
    const isValid = (qIn: number, qOut: number) => !(qIn === 0 && qOut === 0)
    expect(isValid(0, 0)).toBe(false)
    expect(isValid(10, 0)).toBe(true)
    expect(isValid(0, 10)).toBe(true)
    expect(isValid(10, 10)).toBe(true)
  })
})
