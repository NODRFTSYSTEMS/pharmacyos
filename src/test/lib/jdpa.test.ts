import { describe, expect, it } from 'vitest'
import {
  buildConsentAuditDetails,
  buildJdpaExportNotice,
  decidePatientExport,
  hasJdpaConsent,
  maskPatientIdentifier,
  validateConsentConfirmation,
} from '../../lib/jdpa'

describe('JDPA - consent state', () => {
  it.each([
    [{ jdpa_consent_at: '2026-05-17T10:00:00Z' }, true],
    [{ jdpa_consent_at: null }, false],
    [{ jdpa_consent_at: undefined }, false],
    [{}, false],
    [null, false],
    [undefined, false],
  ])('detects consent for %o', (patient, expected) => {
    expect(hasJdpaConsent(patient)).toBe(expected)
  })
})

describe('JDPA - export decisions', () => {
  it.each([
    [{ jdpa_consent_at: '2026-05-17T10:00:00Z' }, false, true, 'consent_recorded'],
    [{ jdpa_consent_at: '2026-05-17T10:00:00Z' }, true, true, 'consent_recorded'],
    [{ jdpa_consent_at: null }, true, true, 'approved_lawful_basis'],
    [{ jdpa_consent_at: undefined }, true, true, 'approved_lawful_basis'],
    [{}, true, true, 'approved_lawful_basis'],
    [{ jdpa_consent_at: null }, false, false, 'missing_consent_or_lawful_basis'],
    [null, false, false, 'missing_consent_or_lawful_basis'],
    [undefined, false, false, 'missing_consent_or_lawful_basis'],
  ])('decides export for %o lawful basis %s', (patient, lawfulBasis, allowed, reason) => {
    expect(decidePatientExport(patient, lawfulBasis)).toEqual({ allowed, reason })
  })
})

describe('JDPA - consent validation', () => {
  it.each([
    [true, null],
    [false, 'Patient consent confirmation is required.'],
    [Boolean(1), null],
    [Boolean(0), 'Patient consent confirmation is required.'],
    [!false, null],
  ])('validates checkbox state %s', (checked, expected) => {
    expect(validateConsentConfirmation(checked)).toBe(expected)
  })
})

describe('JDPA - masking identifiers', () => {
  it.each([
    ['8765551234', '******1234'],
    ['1234', '****'],
    ['abc', '***'],
    ['', 'unavailable'],
    [null, 'unavailable'],
  ])('masks %s', (value, expected) => {
    expect(maskPatientIdentifier(value)).toBe(expected)
  })
})

describe('JDPA - audit metadata', () => {
  it.each([
    ['2026-05-17T10:00:00Z', 'patient_registration'],
    ['2026-05-17T11:00:00Z', 'profile_update'],
    ['2026-05-17T12:00:00Z', 'migration_backfill'],
    ['2026-05-17T13:00:00Z', 'manual_review'],
  ])('builds consent audit details for source %s', (consentAt, source) => {
    expect(buildConsentAuditDetails(consentAt, source)).toEqual({
      consent_at: consentAt,
      source,
    })
    expect(buildJdpaExportNotice()).toContain('Jamaica Data Protection Act 2020')
  })
})
