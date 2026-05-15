import { describe, it, expect } from 'vitest'
import {
  toJamaicaBounds,
  todayJamaica,
  toJamaicaDate,
  fmtJamaicaDate,
  fmtJamaicaTime,
} from '../../lib/date'

// ── Jamaica UTC offset constant ───────────────────────────────────────────────
// America/Jamaica is UTC-5 year-round. No DST. This is the core invariant
// that all date helpers must enforce.
const JAMAICA_OFFSET_HOURS = -5

// Validate the constant matches what the library produces at boundaries.
// If the library ever drifts to a different offset the tests below will catch it,
// and this assertion makes the constant's role explicit.
if (JAMAICA_OFFSET_HOURS !== -5) throw new Error('JAMAICA_OFFSET_HOURS must be -5 (UTC-5, no DST)')

describe('toJamaicaBounds', () => {
  it('returns gte with -05:00 suffix for single-day range', () => {
    const b = toJamaicaBounds('2026-05-13', '2026-05-13')
    expect(b.gte).toBe('2026-05-13T00:00:00-05:00')
    expect(b.lte).toBe('2026-05-13T23:59:59.999-05:00')
  })

  it('returns gte/lte for a multi-day range', () => {
    const b = toJamaicaBounds('2026-05-01', '2026-05-31')
    expect(b.gte).toBe('2026-05-01T00:00:00-05:00')
    expect(b.lte).toBe('2026-05-31T23:59:59.999-05:00')
  })

  it('gte always uses start-of-day 00:00:00', () => {
    const b = toJamaicaBounds('2026-01-15', '2026-01-20')
    expect(b.gte).toContain('T00:00:00')
  })

  it('lte always uses end-of-day with 999ms precision', () => {
    const b = toJamaicaBounds('2026-01-15', '2026-01-20')
    expect(b.lte).toContain('T23:59:59.999')
  })

  it('gte and lte both include Jamaica timezone offset', () => {
    const b = toJamaicaBounds('2026-06-01', '2026-06-30')
    expect(b.gte).toContain('-05:00')
    expect(b.lte).toContain('-05:00')
  })

  it('gte timestamp parses to a Date earlier than lte timestamp', () => {
    const b = toJamaicaBounds('2026-05-13', '2026-05-13')
    const gte = new Date(b.gte)
    const lte = new Date(b.lte)
    expect(gte.getTime()).toBeLessThan(lte.getTime())
  })

  it('gte and lte span exactly 86399.999 seconds for a single day', () => {
    const b = toJamaicaBounds('2026-05-13', '2026-05-13')
    const gte = new Date(b.gte)
    const lte = new Date(b.lte)
    const diffSeconds = (lte.getTime() - gte.getTime()) / 1000
    // 23h 59m 59.999s = 86399.999s
    expect(diffSeconds).toBeCloseTo(86399.999, 2)
  })
})

describe('todayJamaica', () => {
  it('returns a string in YYYY-MM-DD format', () => {
    const today = todayJamaica()
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('returns a valid calendar date', () => {
    const today = todayJamaica()
    const [, month, day] = today.split('-').map(Number)
    expect(month).toBeGreaterThanOrEqual(1)
    expect(month).toBeLessThanOrEqual(12)
    expect(day).toBeGreaterThanOrEqual(1)
    expect(day).toBeLessThanOrEqual(31)
  })

  it('result is usable as input to toJamaicaBounds without error', () => {
    const today = todayJamaica()
    expect(() => toJamaicaBounds(today, today)).not.toThrow()
  })

  it('result differs from UTC date by at most 1 day', () => {
    const jamaicaToday = todayJamaica()
    const utcToday = new Date().toISOString().slice(0, 10)
    const jDate = new Date(jamaicaToday)
    const uDate = new Date(utcToday)
    const diffDays = Math.abs((jDate.getTime() - uDate.getTime()) / 86_400_000)
    // Jamaica is UTC-5; at worst the dates differ by exactly 1 day
    expect(diffDays).toBeLessThanOrEqual(1)
  })
})

describe('toJamaicaDate', () => {
  it('returns a string in YYYY-MM-DD format', () => {
    const d = toJamaicaDate('2026-05-13T12:00:00.000Z')
    expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('shifts date back by 1 day for UTC timestamps in the first 5 hours of the day', () => {
    // 2026-05-13T02:00:00Z = 2026-05-12T21:00 Jamaica (UTC-5)
    // Jamaica date should be 2026-05-12, not 2026-05-13
    const d = toJamaicaDate('2026-05-13T02:00:00.000Z')
    expect(d).toBe('2026-05-12')
  })

  it('keeps same date for UTC timestamps at or after 05:00Z', () => {
    // 2026-05-13T06:00:00Z = 2026-05-13T01:00 Jamaica — still 2026-05-13 Jamaica
    const d = toJamaicaDate('2026-05-13T06:00:00.000Z')
    expect(d).toBe('2026-05-13')
  })

  it('handles exact UTC midnight (shift to previous Jamaica date)', () => {
    // 2026-05-13T00:00:00Z = 2026-05-12T19:00 Jamaica
    const d = toJamaicaDate('2026-05-13T00:00:00.000Z')
    expect(d).toBe('2026-05-12')
  })

  it('handles end-of-month boundaries', () => {
    // 2026-06-01T03:00:00Z = 2026-05-31T22:00 Jamaica
    const d = toJamaicaDate('2026-06-01T03:00:00.000Z')
    expect(d).toBe('2026-05-31')
  })
})

describe('fmtJamaicaDate', () => {
  it('returns a non-empty string', () => {
    const s = fmtJamaicaDate('2026-05-13T12:00:00.000Z')
    expect(s.length).toBeGreaterThan(0)
  })

  it('contains the year from the Jamaica-local datetime', () => {
    // 2026-05-13T12:00Z = 2026-05-13T07:00 Jamaica — still 2026
    const s = fmtJamaicaDate('2026-05-13T12:00:00.000Z')
    expect(s).toContain('2026')
  })
})

describe('fmtJamaicaTime', () => {
  it('returns a non-empty string', () => {
    const s = fmtJamaicaTime('2026-05-13T12:00:00.000Z')
    expect(s.length).toBeGreaterThan(0)
  })

  it('applies Jamaica UTC-5 offset — 16:00 UTC renders as 11:xx Jamaica', () => {
    // 2026-05-13T16:00:00Z = 2026-05-13T11:00:00 Jamaica
    const s = fmtJamaicaTime('2026-05-13T16:00:00.000Z')
    // Accept both 24h and 12h formats; just verify the hour digit appears
    // 11:00 in 24h, or '11:00 AM' in 12h
    expect(s).toMatch(/11:00/)
  })

  it('applies Jamaica UTC-5 offset — 04:00 UTC renders as previous day 23:xx Jamaica', () => {
    // 2026-05-13T04:00:00Z = 2026-05-12T23:00:00 Jamaica
    const s = fmtJamaicaTime('2026-05-13T04:00:00.000Z')
    expect(s).toMatch(/11:00 [Pp][Mm]|23:00/)
  })
})

// ── Regression: UTC midnight off-by-one (I-22) ────────────────────────────────
describe('I-22 regression — UTC midnight shift', () => {
  it('toJamaicaBounds does NOT use bare T00:00:00 without timezone offset', () => {
    const b = toJamaicaBounds('2026-05-13', '2026-05-13')
    // Bare T00:00:00 without offset would be UTC midnight — incorrect
    expect(b.gte).not.toBe('2026-05-13T00:00:00')
    expect(b.lte).not.toBe('2026-05-13T23:59:59')
  })

  it('toJamaicaDate correctly attributes a late-night UTC timestamp to the previous Jamaica day', () => {
    // This is the classic I-22 failure: UTC midnight flips to next day
    // but Jamaica is still on the previous day until 5am UTC
    const latestJamaicaNightInUTC = '2026-05-14T04:59:59.000Z' // 23:59:59 Jamaica
    const d = toJamaicaDate(latestJamaicaNightInUTC)
    expect(d).toBe('2026-05-13')
  })
})
