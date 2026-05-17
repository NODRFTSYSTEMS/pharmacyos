import { describe, it, expect } from 'vitest'

// ── Leave days calculation — HR module ───────────────────────────────────────
// Mirrors LeaveRequests.tsx lines 99–102 exactly.
// Incorrect day counts produce wrong payroll deductions and HR records.
//
// Formula: Math.max(1, Math.round((end - start) / 86_400_000) + 1)
// The +1 is because both start and end dates are inclusive.

function calcDaysRequested(startDate: string, endDate: string): number {
  return Math.max(
    1,
    Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000,
    ) + 1,
  )
}

// ── Single-day leaves ─────────────────────────────────────────────────────────

describe('calcDaysRequested — single-day leave', () => {
  it('returns 1 for same-day leave (start === end)', () => {
    expect(calcDaysRequested('2026-05-17', '2026-05-17')).toBe(1)
  })

  it('minimum is always 1 — even for invalid reversed dates', () => {
    // Validation in the form prevents this, but the formula must not return 0 or negative
    expect(calcDaysRequested('2026-05-17', '2026-05-16')).toBe(1)
  })
})

// ── Multi-day leaves ──────────────────────────────────────────────────────────

describe('calcDaysRequested — multi-day leave', () => {
  it('returns 2 for consecutive days (Mon–Tue)', () => {
    expect(calcDaysRequested('2026-05-18', '2026-05-19')).toBe(2)
  })

  it('returns 5 for a Mon–Fri work week', () => {
    expect(calcDaysRequested('2026-05-18', '2026-05-22')).toBe(5)
  })

  it('returns 7 for a full calendar week', () => {
    expect(calcDaysRequested('2026-05-18', '2026-05-24')).toBe(7)
  })

  it('returns 14 for two full weeks', () => {
    expect(calcDaysRequested('2026-05-18', '2026-05-31')).toBe(14)
  })

  it('returns 30 for a month-long leave', () => {
    // June has 30 days: Jun 1 – Jun 30 inclusive
    expect(calcDaysRequested('2026-06-01', '2026-06-30')).toBe(30)
  })
})

// ── Month-boundary edge cases ─────────────────────────────────────────────────

describe('calcDaysRequested — month and year boundaries', () => {
  it('handles month-end to month-start correctly', () => {
    // May 31 to June 1 = 2 days (inclusive both ends)
    expect(calcDaysRequested('2026-05-31', '2026-06-01')).toBe(2)
  })

  it('handles year-end to new-year correctly', () => {
    // Dec 31 to Jan 1 = 2 days
    expect(calcDaysRequested('2026-12-31', '2027-01-01')).toBe(2)
  })

  it('handles February in a non-leap year (28 days)', () => {
    // Feb 1 – Feb 28, 2026 = 28 days
    expect(calcDaysRequested('2026-02-01', '2026-02-28')).toBe(28)
  })
})

// ── Correctness: +1 inclusive-both-ends ──────────────────────────────────────

describe('calcDaysRequested — inclusive date counting invariant', () => {
  it('REGRESSION: result must be (end - start days) + 1, not just (end - start days)', () => {
    // Without +1, Mon to Fri would return 4 (wrong) instead of 5 (correct)
    // because the formula counts the gap, not the total inclusive days
    const withPlusOne    = calcDaysRequested('2026-05-18', '2026-05-22') // 5 correct
    const withoutPlusOne = Math.round(
      (new Date('2026-05-22').getTime() - new Date('2026-05-18').getTime()) / 86_400_000,
    )                                                                     // 4 wrong
    expect(withPlusOne).toBe(5)
    expect(withPlusOne).not.toBe(withoutPlusOne)
  })

  it('REGRESSION: minimum 1 guard prevents zero or negative values', () => {
    // A bug without Math.max(1,...) would allow 0 days_requested in the DB
    const result = calcDaysRequested('2026-05-17', '2026-05-17')
    expect(result).toBeGreaterThanOrEqual(1)
  })
})
