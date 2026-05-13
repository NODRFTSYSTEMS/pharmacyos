// ── Jamaica Date Utilities ────────────────────────────────────────────────────
// Jamaica does not observe DST — UTC-5 year-round (America/Jamaica)
// All date boundary calculations in PharmacyOS must use these helpers
// to avoid off-by-one errors near midnight.

/**
 * Returns Supabase-compatible ISO bounds for a date range in Jamaica time.
 * Use for all .gte() / .lte() queries against timestamptz columns.
 */
export function toJamaicaBounds(from: string, to: string) {
  return {
    gte: `${from}T00:00:00-05:00`,
    lte: `${to}T23:59:59.999-05:00`,
  }
}

/**
 * Returns today's date string (YYYY-MM-DD) in Jamaica time.
 * Use instead of new Date().toISOString().slice(0, 10) which is UTC-based.
 */
export function todayJamaica(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Jamaica' })
}

/**
 * Converts any ISO timestamp to a Jamaica-local date string (YYYY-MM-DD).
 */
export function toJamaicaDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/Jamaica' })
}

/**
 * Formats an ISO timestamp as a Jamaica-local display date.
 */
export function fmtJamaicaDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleDateString('en-JM', {
    timeZone: 'America/Jamaica',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...opts,
  })
}

/**
 * Formats an ISO timestamp as a Jamaica-local time string.
 */
export function fmtJamaicaTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-JM', {
    timeZone: 'America/Jamaica',
    hour: '2-digit',
    minute: '2-digit',
  })
}
