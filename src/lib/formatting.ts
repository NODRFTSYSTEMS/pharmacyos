/** Convert a string to title case — capitalises each word's first letter. */
export function toTitleCase(s: string): string {
  if (!s) return s
  return s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

/** Capitalise the first character and lowercase the rest. */
export function toUpperFirst(s: string): string {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

/**
 * Medical "Last, First" display format in title case.
 * Used for patient name columns in clinical tables and search results.
 */
export function formatPatientName(first: string, last: string): string {
  return `${toTitleCase(last)}, ${toTitleCase(first)}`
}

/** Title-case and trim a drug name for consistent display. */
export function formatDrugName(name: string): string {
  if (!name) return name
  return toTitleCase(name.trim())
}
