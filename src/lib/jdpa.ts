export interface ConsentState {
  jdpa_consent_at?: string | null
}

export interface ExportDecision {
  allowed: boolean
  reason: string
}

export function hasJdpaConsent(patient: ConsentState | null | undefined): boolean {
  return !!patient?.jdpa_consent_at
}

export function decidePatientExport(
  patient: ConsentState | null | undefined,
  approvedLawfulBasis = false,
): ExportDecision {
  if (hasJdpaConsent(patient)) {
    return { allowed: true, reason: 'consent_recorded' }
  }
  if (approvedLawfulBasis) {
    return { allowed: true, reason: 'approved_lawful_basis' }
  }
  return { allowed: false, reason: 'missing_consent_or_lawful_basis' }
}

export function validateConsentConfirmation(checked: boolean): string | null {
  return checked ? null : 'Patient consent confirmation is required.'
}

export function maskPatientIdentifier(value: string | null | undefined): string {
  const raw = (value ?? '').trim()
  if (!raw) return 'unavailable'
  if (raw.length <= 4) return '*'.repeat(raw.length)
  return `${'*'.repeat(raw.length - 4)}${raw.slice(-4)}`
}

export function buildJdpaExportNotice(): string {
  return 'This data export is provided under the Jamaica Data Protection Act 2020. Handle in accordance with applicable data protection obligations.'
}

export function buildConsentAuditDetails(consentAt: string, source: string) {
  return {
    consent_at: consentAt,
    source,
  }
}
