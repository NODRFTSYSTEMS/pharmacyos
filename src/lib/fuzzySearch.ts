export interface RankedResult<T> {
  item: T
  score: number
}

export function normalizeSearchValue(value: string | null | undefined): string {
  return (value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function tokenizeSearchQuery(query: string): string[] {
  const normalized = normalizeSearchValue(query)
  if (!normalized) return []
  return normalized.split(/\s+/).filter(Boolean)
}

export function isSubsequence(needle: string, haystack: string): boolean {
  if (!needle) return true
  let pos = 0
  for (const char of haystack) {
    if (char === needle[pos]) pos += 1
    if (pos === needle.length) return true
  }
  return false
}

export function fuzzyScore(candidate: string | null | undefined, query: string): number {
  const value = normalizeSearchValue(candidate)
  const q = normalizeSearchValue(query)
  if (!q) return 0
  if (!value) return 0
  if (value === q) return 100
  if (value.startsWith(q)) return 90
  if (value.includes(q)) return 75

  const tokens = tokenizeSearchQuery(q)
  if (tokens.length > 1 && tokens.every(token => value.includes(token))) return 70
  if (isSubsequence(q, value)) return 35
  return 0
}

export function fuzzyMatches(candidate: string | null | undefined, query: string, minimumScore = 35): boolean {
  return fuzzyScore(candidate, query) >= minimumScore
}

export function rankFuzzyResults<T>(
  items: T[],
  query: string,
  getFields: (item: T) => Array<string | null | undefined>,
): RankedResult<T>[] {
  return items
    .map(item => ({
      item,
      score: Math.max(...getFields(item).map(field => fuzzyScore(field, query)), 0),
    }))
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
}
