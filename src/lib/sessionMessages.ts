export interface LoginReasonMessage {
  title: string
  body: string
  tone: 'warning' | 'info'
}

const LOGIN_REASON_MESSAGES: Record<string, LoginReasonMessage> = {
  session_expired: {
    title: 'Session expired',
    body: 'You were signed out after a period of inactivity. Sign in again to continue.',
    tone: 'warning',
  },
}

export function getLoginReasonMessage(reason: string | null | undefined): LoginReasonMessage | null {
  if (!reason) return null
  return LOGIN_REASON_MESSAGES[reason] ?? null
}
