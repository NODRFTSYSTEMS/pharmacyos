/**
 * useOpenFDAInteractions — fetch drug interaction warnings from the OpenFDA API.
 *
 * Uses the free, no-credentials-required openFDA drug label endpoint:
 *   https://api.fda.gov/drug/label.json?search=openfda.brand_name:"<name>"&limit=1
 *
 * Returns the `drug_interactions` section from the FDA drug label when found.
 * Results are cached per drug name for the session lifetime.
 *
 * Authority: Priority Fix List — OpenFDA integration (no credentials required).
 * Replace with a server-side proxy + Anthropic-summarized output once G2 closes.
 */

import { useEffect, useState } from 'react'

export type InteractionResult = {
  drug: string
  interactions: string | null
  error: string | null
  loading: boolean
}

type OpenFDALabelResult = {
  results?: Array<{
    drug_interactions?: string[]
    openfda?: {
      brand_name?: string[]
      generic_name?: string[]
    }
  }>
  error?: { message: string }
}

// Session-level cache — avoids re-fetching on re-renders.
const cache = new Map<string, string | null>()

async function fetchInteractions(drugName: string): Promise<string | null> {
  // Extract the base drug name — strip dosage/quantity suffixes like "500mg × 60"
  const base = drugName.split(/\s+\d+mg/i)[0].trim()
  const cacheKey = base.toLowerCase()

  if (cache.has(cacheKey)) return cache.get(cacheKey) ?? null

  try {
    const encoded = encodeURIComponent(`"${base}"`)
    const url = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:${encoded}&limit=1`
    const res = await fetch(url)
    if (!res.ok) {
      cache.set(cacheKey, null)
      return null
    }
    const data: OpenFDALabelResult = await res.json()
    const interactions = data.results?.[0]?.drug_interactions?.[0] ?? null
    // Truncate very long labels — full text can be thousands of characters.
    const truncated = interactions ? interactions.slice(0, 600) + (interactions.length > 600 ? '…' : '') : null
    cache.set(cacheKey, truncated)
    return truncated
  } catch {
    cache.set(cacheKey, null)
    return null
  }
}

/**
 * Fetches drug interaction text from OpenFDA for each drug in the list.
 * Only fires for prescriptions with ≥2 drugs — single-drug prescriptions
 * skip the API call (no cross-interaction possible with one drug).
 */
export function useOpenFDAInteractions(drugs: string[]): InteractionResult[] {
  const [results, setResults] = useState<InteractionResult[]>(
    drugs.map((d) => ({ drug: d, interactions: null, error: null, loading: drugs.length >= 1 }))
  )

  useEffect(() => {
    if (drugs.length === 0) return

    setResults(drugs.map((d) => ({ drug: d, interactions: null, error: null, loading: true })))

    drugs.forEach((drug, i) => {
      fetchInteractions(drug)
        .then((interactions) => {
          setResults((prev) => {
            const next = [...prev]
            next[i] = { drug, interactions, error: null, loading: false }
            return next
          })
        })
        .catch((err: unknown) => {
          setResults((prev) => {
            const next = [...prev]
            next[i] = {
              drug,
              interactions: null,
              error: err instanceof Error ? err.message : 'Unknown error',
              loading: false,
            }
            return next
          })
        })
    })
    // drugs is a dependency but we stringify to avoid re-fires on shallow array re-creation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drugs.join('|')])

  return results
}
