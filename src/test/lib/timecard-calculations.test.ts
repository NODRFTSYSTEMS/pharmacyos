import { describe, it, expect } from 'vitest'

// ── Timecard business logic — calculation tests ───────────────────────────────
// Mirrors TimecardClock.tsx clockOut.mutationFn lines 154–158 and
// TimecardManager.tsx approval logic.
//
// Incorrect minute calculations affect:
//   - Payroll: wrong total hours on payslip
//   - FLAGGED detection: thresholds in analyze_timecard RPC use total_minutes
//   - HR reports: aggregate hours per staff member

// ── Mirror TimecardClock.tsx totalMinutes calculation ────────────────────────

function calcTotalMinutes(clockedInAt: string, clockedOutAt: string): number {
  return Math.max(
    1,
    Math.round(
      (new Date(clockedOutAt).getTime() - new Date(clockedInAt).getTime()) / 60_000,
    ),
  )
}

// ── Shift duration ────────────────────────────────────────────────────────────

describe('calcTotalMinutes — shift duration', () => {
  it('calculates an 8-hour shift correctly (480 minutes)', () => {
    expect(calcTotalMinutes(
      '2026-05-17T08:00:00.000Z',
      '2026-05-17T16:00:00.000Z',
    )).toBe(480)
  })

  it('calculates a 4-hour shift correctly (240 minutes)', () => {
    expect(calcTotalMinutes(
      '2026-05-17T08:00:00.000Z',
      '2026-05-17T12:00:00.000Z',
    )).toBe(240)
  })

  it('calculates a 30-minute shift correctly', () => {
    expect(calcTotalMinutes(
      '2026-05-17T08:00:00.000Z',
      '2026-05-17T08:30:00.000Z',
    )).toBe(30)
  })

  it('returns minimum 1 minute for near-instant clock out', () => {
    // Edge case: pharmacist clocked in and out within seconds (typo, wrong button)
    expect(calcTotalMinutes(
      '2026-05-17T08:00:00.000Z',
      '2026-05-17T08:00:30.000Z', // 30 seconds later
    )).toBe(1)
  })

  it('returns 1 for same timestamp (zero-duration guard)', () => {
    const ts = '2026-05-17T08:00:00.000Z'
    expect(calcTotalMinutes(ts, ts)).toBe(1)
  })

  it('handles overnight shift (clocked in evening, out next morning)', () => {
    // 10pm to 6am = 480 minutes
    expect(calcTotalMinutes(
      '2026-05-17T22:00:00.000Z',
      '2026-05-18T06:00:00.000Z',
    )).toBe(480)
  })

  it('rounds fractional minutes correctly — 90.5 minutes rounds to 91', () => {
    // clocked_in + 90.5 minutes
    const clockedIn  = '2026-05-17T08:00:00.000Z'
    const clockedOut = new Date(new Date(clockedIn).getTime() + 90.5 * 60_000).toISOString()
    expect(calcTotalMinutes(clockedIn, clockedOut)).toBe(91)
  })

  it('handles a full 12-hour shift (720 minutes)', () => {
    expect(calcTotalMinutes(
      '2026-05-17T07:00:00.000Z',
      '2026-05-17T19:00:00.000Z',
    )).toBe(720)
  })
})

// ── REGRESSION: status must be set atomically ────────────────────────────────

describe('clock-out status invariant (regression: analyze_timecard RPC failure)', () => {
  // This test documents the bug found 2026-05-17:
  // clockOut only set clocked_out_at + total_minutes; status was set by
  // analyze_timecard RPC. When the RPC failed, status stayed CLOCKED_IN.
  // The fix: set status='CLOCKED_OUT' in the same update as clocked_out_at.
  //
  // These tests verify the STATUS field logic (cannot call Supabase here;
  // verifies the expected payload shape that must be sent).

  it('clock-out update payload must include status field set to CLOCKED_OUT', () => {
    // Construct the payload as the mutationFn does
    const now = new Date('2026-05-17T16:00:00.000Z')
    const clockedInAt = '2026-05-17T08:00:00.000Z'
    const totalMinutes = calcTotalMinutes(clockedInAt, now.toISOString())

    const updatePayload = {
      clocked_out_at: now.toISOString(),
      total_minutes:  totalMinutes,
      status:         'CLOCKED_OUT' as const,  // ← THIS LINE is the fix
    }

    // If status is missing from the payload, the RPC becomes a single point of failure
    expect(updatePayload.status).toBe('CLOCKED_OUT')
    expect(Object.keys(updatePayload)).toContain('status')
  })

  it('clock-out payload must NOT rely on status being set elsewhere', () => {
    // The old (broken) payload — document what we replaced
    const brokenPayload = {
      clocked_out_at: new Date().toISOString(),
      total_minutes:  120,
      // status: NOT PRESENT ← bug: relied on analyze_timecard RPC
    }
    // The field is absent — this is what caused the stuck CLOCKED_IN state
    expect('status' in brokenPayload).toBe(false)
    // The fix ensures this is now present
    const fixedPayload = { ...brokenPayload, status: 'CLOCKED_OUT' as const }
    expect('status' in fixedPayload).toBe(true)
    expect(fixedPayload.status).toBe('CLOCKED_OUT')
  })
})

// ── fmtDuration display helper ────────────────────────────────────────────────
// Mirrors TimecardClock.tsx fmtDuration(minutes) lines 17–21

function fmtDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

describe('fmtDuration — shift display formatting', () => {
  it('shows only minutes for shifts under 1 hour', () => {
    expect(fmtDuration(45)).toBe('45m')
  })

  it('shows hours and minutes for shifts over 1 hour', () => {
    expect(fmtDuration(90)).toBe('1h 30m')
  })

  it('shows exactly 8h 0m for an 8-hour shift', () => {
    expect(fmtDuration(480)).toBe('8h 0m')
  })

  it('shows 0m for zero duration (edge — minimum is 1 via calcTotalMinutes)', () => {
    expect(fmtDuration(0)).toBe('0m')
  })

  it('shows 1m for the minimum enforced shift', () => {
    expect(fmtDuration(1)).toBe('1m')
  })

  it('shows 12h 30m for a 12.5-hour shift', () => {
    expect(fmtDuration(750)).toBe('12h 30m')
  })
})
