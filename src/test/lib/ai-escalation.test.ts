import { describe, it, expect } from 'vitest'

// ── AI Extraction Escalation Logic ───────────────────────────────────────────
// Tests the decision rules governing when Claude Haiku escalates to Sonnet,
// when extraction is blocked (no JDPA consent), and when access is denied
// (insufficient caller role). All logic mirrors extract-document/index.ts.
//
// These are pure-logic tests — no Supabase or network calls.

// ── Mirrors ──────────────────────────────────────────────────────────────────

const CONFIDENCE_ESCALATION_THRESHOLD = 0.70
const PERMITTED_ROLES_FOR_EXTRACT = ['PHARMACIST', 'TECHNICIAN']

/** Mirror of Haiku→Sonnet escalation decision in extract-document/index.ts */
function shouldEscalateToSonnet(confidence: number | null, haikusFailed: boolean): boolean {
  if (haikusFailed) return true                          // API error → escalate
  if (confidence === null) return false                   // no result yet
  return confidence < CONFIDENCE_ESCALATION_THRESHOLD   // low confidence → escalate
}

/** Mirror of JDPA consent validation logic */
function isJdpaConsentValid(jdpaConsentAt: string | null | undefined): boolean {
  return !!jdpaConsentAt
}

/** Mirror of caller role validation */
function isRolePermittedForExtraction(callerRole: string | null | undefined): boolean {
  if (!callerRole) return false
  return PERMITTED_ROLES_FOR_EXTRACT.includes(callerRole)
}

/** Mirror of extraction status decision */
function resolveExtractionStatus(
  confidence: number,
  parseErr: string | null,
  jdpaBlocked: boolean,
): 'REVIEW_REQUIRED' | 'ACCEPTED' {
  if (jdpaBlocked) return 'REVIEW_REQUIRED'
  if (parseErr !== null) return 'REVIEW_REQUIRED'
  if (confidence < CONFIDENCE_ESCALATION_THRESHOLD) return 'REVIEW_REQUIRED'
  return 'ACCEPTED'
}

/** Mirror of review note generation */
function buildReviewNote(
  parseErr: string | null,
  jdpaBlockedReason: string | null,
  confidence: number,
  usedModel: string,
): string | null {
  if (jdpaBlockedReason) return `JDPA COMPLIANCE: ${jdpaBlockedReason}`
  if (parseErr) return `JSON parse error — manual review required. Model: ${usedModel}`
  if (confidence < CONFIDENCE_ESCALATION_THRESHOLD) {
    return `Low confidence (${(confidence * 100).toFixed(0)}%) — pharmacist review required. Model: ${usedModel}`
  }
  return null
}

// ── Haiku → Sonnet escalation ─────────────────────────────────────────────────

describe('AI escalation — Haiku to Sonnet', () => {
  it('escalates immediately on Haiku API failure', () => {
    expect(shouldEscalateToSonnet(null, true)).toBe(true)
  })

  it('escalates when confidence is below 0.70 threshold', () => {
    expect(shouldEscalateToSonnet(0.69, false)).toBe(true)
  })

  it('escalates at exactly the threshold boundary (0.69)', () => {
    expect(shouldEscalateToSonnet(0.699, false)).toBe(true)
  })

  it('does NOT escalate when confidence is exactly 0.70', () => {
    expect(shouldEscalateToSonnet(0.70, false)).toBe(false)
  })

  it('does NOT escalate when confidence is above 0.70', () => {
    expect(shouldEscalateToSonnet(0.85, false)).toBe(false)
  })

  it('does NOT escalate at maximum confidence 1.0', () => {
    expect(shouldEscalateToSonnet(1.0, false)).toBe(false)
  })

  it('escalates even at 0.0 confidence without API failure', () => {
    expect(shouldEscalateToSonnet(0.0, false)).toBe(true)
  })

  it('returns false if confidence is null and no API failure', () => {
    // No result yet — cannot make an escalation decision
    expect(shouldEscalateToSonnet(null, false)).toBe(false)
  })
})

// ── Extraction status resolution ──────────────────────────────────────────────

describe('resolveExtractionStatus', () => {
  it('returns ACCEPTED when confidence ≥ 0.70 and no errors', () => {
    expect(resolveExtractionStatus(0.80, null, false)).toBe('ACCEPTED')
  })

  it('returns REVIEW_REQUIRED when confidence < 0.70', () => {
    expect(resolveExtractionStatus(0.65, null, false)).toBe('REVIEW_REQUIRED')
  })

  it('returns REVIEW_REQUIRED when parse error present', () => {
    expect(resolveExtractionStatus(0.90, 'Unexpected token', false)).toBe('REVIEW_REQUIRED')
  })

  it('returns REVIEW_REQUIRED when JDPA consent blocked — regardless of confidence', () => {
    expect(resolveExtractionStatus(0.95, null, true)).toBe('REVIEW_REQUIRED')
  })

  it('JDPA block overrides high confidence — compliance wins', () => {
    expect(resolveExtractionStatus(1.0, null, true)).toBe('REVIEW_REQUIRED')
  })
})

// ── JDPA consent validation ───────────────────────────────────────────────────

describe('JDPA consent validation', () => {
  it('allows extraction when jdpa_consent_at is a valid ISO timestamp', () => {
    expect(isJdpaConsentValid('2026-05-18T10:00:00Z')).toBe(true)
  })

  it('blocks extraction when jdpa_consent_at is null', () => {
    expect(isJdpaConsentValid(null)).toBe(false)
  })

  it('blocks extraction when jdpa_consent_at is undefined', () => {
    expect(isJdpaConsentValid(undefined)).toBe(false)
  })

  it('blocks extraction when jdpa_consent_at is empty string', () => {
    expect(isJdpaConsentValid('')).toBe(false)
  })

  it('allows extraction for any truthy timestamp string', () => {
    expect(isJdpaConsentValid('2020-01-01T00:00:00.000Z')).toBe(true)
  })
})

// ── Caller role validation ────────────────────────────────────────────────────

describe('caller role validation for AI extraction', () => {
  it('allows PHARMACIST to invoke extraction', () => {
    expect(isRolePermittedForExtraction('PHARMACIST')).toBe(true)
  })

  it('allows TECHNICIAN to invoke extraction', () => {
    expect(isRolePermittedForExtraction('TECHNICIAN')).toBe(true)
  })

  it('CRITICAL: blocks CASHIER from invoking extraction', () => {
    expect(isRolePermittedForExtraction('CASHIER')).toBe(false)
  })

  it('CRITICAL: blocks AUDITOR from invoking extraction', () => {
    expect(isRolePermittedForExtraction('AUDITOR')).toBe(false)
  })

  it('CRITICAL: blocks MANAGER from invoking extraction (not a clinical role)', () => {
    expect(isRolePermittedForExtraction('MANAGER')).toBe(false)
  })

  it('blocks null caller role (unauthenticated)', () => {
    expect(isRolePermittedForExtraction(null)).toBe(false)
  })

  it('blocks undefined caller role (JWT missing role claim)', () => {
    expect(isRolePermittedForExtraction(undefined)).toBe(false)
  })

  it('blocks empty string role', () => {
    expect(isRolePermittedForExtraction('')).toBe(false)
  })

  it('is case-sensitive — lowercase pharmacist is rejected', () => {
    expect(isRolePermittedForExtraction('pharmacist')).toBe(false)
  })

  it('is case-sensitive — mixed case is rejected', () => {
    expect(isRolePermittedForExtraction('Pharmacist')).toBe(false)
  })
})

// ── Review note generation ────────────────────────────────────────────────────

describe('buildReviewNote', () => {
  it('JDPA block note takes precedence over parse error', () => {
    const note = buildReviewNote('parse fail', 'Patient has not provided consent', 0.5, 'haiku')
    expect(note).toContain('JDPA COMPLIANCE')
    expect(note).not.toContain('parse error')
  })

  it('includes JDPA blocked reason in review note', () => {
    const reason = 'Patient has not provided JDPA consent for data processing'
    const note = buildReviewNote(null, reason, 0.9, 'haiku')
    expect(note).toBe(`JDPA COMPLIANCE: ${reason}`)
  })

  it('generates parse error note when no JDPA block', () => {
    const note = buildReviewNote('No JSON found in response', null, 0.5, 'claude-haiku-4-5')
    expect(note).toContain('JSON parse error')
    expect(note).toContain('claude-haiku-4-5')
  })

  it('generates low confidence note with correct percentage', () => {
    const note = buildReviewNote(null, null, 0.65, 'claude-haiku-4-5')
    expect(note).toContain('65%')
    expect(note).toContain('pharmacist review required')
  })

  it('returns null when confidence is acceptable and no errors', () => {
    const note = buildReviewNote(null, null, 0.85, 'claude-haiku-4-5')
    expect(note).toBeNull()
  })

  it('rounds confidence percentage correctly at 0.699', () => {
    const note = buildReviewNote(null, null, 0.699, 'claude-sonnet-4-6')
    // 0.699 * 100 = 69.9 → toFixed(0) = '70'
    expect(note).toContain('70%')
  })
})
