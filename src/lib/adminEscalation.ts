export const ADMIN_SUPPORT_EMAIL_SETTING = 'admin_support_email'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface AccessDeniedEscalationInput {
  supportEmail?: string | null
  role?: string | null
  attemptedPath: string
  requiredPermission?: string | null
}

export interface AccessDeniedEscalation {
  label: string
  body: string
  href: string | null
}

export function normalizeSupportEmail(value: string | null | undefined): string | null {
  const trimmed = value?.trim().toLowerCase() ?? ''
  return EMAIL_RE.test(trimmed) ? trimmed : null
}

export function buildAccessDeniedEscalation(input: AccessDeniedEscalationInput): AccessDeniedEscalation {
  const email = normalizeSupportEmail(input.supportEmail)
  const role = input.role?.trim() || 'Unknown'
  const requiredPermission = input.requiredPermission?.trim() || 'not provided'
  const attemptedPath = input.attemptedPath || '/'

  const body = [
    `Role: ${role}`,
    `Attempted page: ${attemptedPath}`,
    `Required permission: ${requiredPermission}`,
    'Request: Please review whether this staff account should have access.',
  ].join('\n')

  if (!email) {
    return {
      label: 'Contact an administrator',
      body: 'No admin escalation email is configured. Ask an ADMIN or MANAGER to review your role permissions.',
      href: null,
    }
  }

  const subject = `PharmacyOS access request: ${attemptedPath}`
  return {
    label: `Email administrator (${email})`,
    body,
    href: `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  }
}
