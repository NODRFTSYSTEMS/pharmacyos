export interface ExtractionAttempt {
  model: string
  confidence: number
  parseError?: string | null
}

export type ExtractionReviewStatus = 'ACCEPTED' | 'REVIEW_REQUIRED'

export const DEFAULT_EXTRACTION_ESCALATION_THRESHOLD = 0.7

export function normalizeConfidence(value: unknown, fallback = 0.5): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

export function shouldEscalateExtraction(
  attempt: ExtractionAttempt,
  threshold = DEFAULT_EXTRACTION_ESCALATION_THRESHOLD,
): boolean {
  return Boolean(attempt.parseError) || normalizeConfidence(attempt.confidence) < threshold
}

export function getExtractionReviewStatus(
  attempt: ExtractionAttempt,
  threshold = DEFAULT_EXTRACTION_ESCALATION_THRESHOLD,
): ExtractionReviewStatus {
  return shouldEscalateExtraction(attempt, threshold) ? 'REVIEW_REQUIRED' : 'ACCEPTED'
}

export function selectPreferredExtraction<T extends ExtractionAttempt>(
  primary: T,
  fallback: T | null,
): T {
  if (!fallback) return primary
  if (primary.parseError && !fallback.parseError) return fallback
  if (!primary.parseError && fallback.parseError) return primary
  if (normalizeConfidence(fallback.confidence) >= normalizeConfidence(primary.confidence)) return fallback
  return primary
}
