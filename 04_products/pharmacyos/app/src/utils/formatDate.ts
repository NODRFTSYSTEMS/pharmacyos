/**
 * formatDate.ts — Locale-aware date/time formatting utilities.
 *
 * No external library dependencies. All formatting is relative to the
 * `now` parameter (defaults to the current instant) so tests can pass a
 * fixed reference time and get deterministic output.
 */

/**
 * Returns a human-readable relative label for a past or future ISO timestamp.
 *
 * Examples:
 *   "just now"        — within the last 60 seconds
 *   "2 minutes ago"   — 2–59 minutes ago
 *   "1 hour ago"      — 1–23 hours ago
 *   "yesterday"       — same calendar date yesterday
 *   "3 days ago"      — 2–6 days ago
 *   "2 weeks ago"     — 7–29 days ago
 *   "in 47 days"      — future date within 12 months
 *   "May 7"           — older dates without year (same year)
 *   "May 7, 2025"     — dates in a different calendar year
 *
 * @param iso  ISO 8601 string: "YYYY-MM-DD" or "YYYY-MM-DD HH:mm"
 * @param now  Reference instant (defaults to Date.now()). Pass a fixed value in tests.
 */
export function formatRelative(iso: string, now: Date = new Date()): string {
  const date = parseIso(iso)
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffMs / 60_000)
  const diffHrs = Math.round(diffMs / 3_600_000)
  const diffDays = Math.round(diffMs / 86_400_000)

  // Future
  if (diffMs < 0) {
    const absDays = Math.abs(diffDays)
    if (absDays === 0) return 'later today'
    if (absDays === 1) return 'tomorrow'
    if (absDays < 7) return `in ${absDays} days`
    if (absDays < 31) return `in ${Math.round(absDays / 7)} week${Math.round(absDays / 7) === 1 ? '' : 's'}`
    if (absDays < 366) return `in ${Math.round(absDays / 30)} month${Math.round(absDays / 30) === 1 ? '' : 's'}`
    return formatDate(iso)
  }

  // Past
  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs === 1 ? '' : 's'} ago`

  // "yesterday" — compare calendar dates
  const nowDate = stripTime(now)
  const thenDate = stripTime(date)
  const calDiff = Math.round((nowDate.getTime() - thenDate.getTime()) / 86_400_000)
  if (calDiff === 1) return 'yesterday'
  if (calDiff < 7) return `${calDiff} days ago`
  if (calDiff < 30) return `${Math.round(calDiff / 7)} week${Math.round(calDiff / 7) === 1 ? '' : 's'} ago`
  if (calDiff < 365) return `${Math.round(calDiff / 30)} month${Math.round(calDiff / 30) === 1 ? '' : 's'} ago`

  return formatDate(iso)
}

/**
 * Returns a formatted absolute date string.
 *
 * Examples:
 *   "May 7, 2026"   — full date with year
 *   "May 7"         — same calendar year (omits year)
 *
 * @param iso  ISO 8601 string: "YYYY-MM-DD" or "YYYY-MM-DD HH:mm"
 * @param now  Reference instant for year comparison (defaults to Date.now()).
 */
export function formatDate(iso: string, now: Date = new Date()): string {
  const date = parseIso(iso)
  const sameYear = date.getFullYear() === now.getFullYear()
  const month = date.toLocaleString('en-JM', { month: 'long' })
  const day = date.getDate()
  return sameYear ? `${month} ${day}` : `${month} ${day}, ${date.getFullYear()}`
}

/**
 * Returns a compact date string in the format "MMM D" (e.g. "May 7").
 * Used for narrow contexts like table cells.
 */
export function formatDateShort(iso: string): string {
  const date = parseIso(iso)
  const month = date.toLocaleString('en-JM', { month: 'short' })
  return `${month} ${date.getDate()}`
}

/**
 * Returns days until a future ISO date string from now (negative = already passed).
 * Used for license expiry warnings.
 */
export function daysUntil(iso: string, now: Date = new Date()): number {
  const date = parseIso(iso)
  const diffMs = date.getTime() - stripTime(now).getTime()
  return Math.round(diffMs / 86_400_000)
}

/**
 * Returns a license expiry label with urgency tone.
 *   "Expires in 47 days"  (warning: 1–90 days)
 *   "Expired 3 days ago"  (error: past)
 *   "Valid until Jun 30"  (ok: > 90 days)
 */
export function formatLicenseExpiry(iso: string, now: Date = new Date()): {
  label: string
  tone: 'ok' | 'warning' | 'error'
} {
  const days = daysUntil(iso, now)
  if (days < 0) {
    return { label: `Expired ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`, tone: 'error' }
  }
  if (days <= 90) {
    return { label: `Expires in ${days} day${days === 1 ? '' : 's'}`, tone: 'warning' }
  }
  const date = parseIso(iso)
  const month = date.toLocaleString('en-JM', { month: 'short' })
  return { label: `Valid until ${month} ${date.getDate()}`, tone: 'ok' }
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Parse "YYYY-MM-DD" or "YYYY-MM-DD HH:mm" safely without timezone shift. */
function parseIso(iso: string): Date {
  // Replace space separator with T for ISO compliance; append :00 if seconds absent
  const normalised = iso.trim().replace(' ', 'T')
  // If only a date (no T), treat as local midnight
  if (!normalised.includes('T')) {
    const [y, m, d] = normalised.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  return new Date(normalised)
}

/** Strip hours/minutes/seconds to get a pure calendar date at local midnight. */
function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
