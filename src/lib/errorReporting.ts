import { supabase, supabaseConfigured } from './supabase'
import { AUDIT_ACTIONS } from '../constants/audit-actions'

type ErrorSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'

interface ErrorMetadata {
  [key: string]: unknown
}

const RECENT_REPORT_WINDOW_MS = 60_000
const recentReports = new Map<string, number>()

function toError(value: unknown): Error {
  if (value instanceof Error) return value
  return new Error(typeof value === 'string' ? value : JSON.stringify(value))
}

function shouldReport(source: string, message: string): boolean {
  const key = `${source}:${message.slice(0, 160)}`
  const last = recentReports.get(key) ?? 0
  const now = Date.now()
  if (now - last < RECENT_REPORT_WINDOW_MS) return false
  recentReports.set(key, now)
  return true
}

export async function reportAppError(
  source: string,
  errorLike: unknown,
  metadata: ErrorMetadata = {},
  severity: ErrorSeverity = 'ERROR',
) {
  const error = toError(errorLike)
  if (!shouldReport(source, error.message)) return

  console.error(`[PharmacyOS:${source}]`, error)

  if (!supabaseConfigured) return

  try {
    const { data: { user } } = await supabase.auth.getUser()
    const route = typeof window !== 'undefined'
      ? `${window.location.pathname}${window.location.search}`
      : null

    await supabase.from('system_error_events').insert({
      severity,
      source,
      message: error.message || 'Unknown application error',
      stack: error.stack ?? null,
      route,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      actor_id: user?.id ?? null,
      actor_email: user?.email ?? null,
      metadata,
    })

    await supabase.from('audit_log').insert({
      actor_id: user?.id ?? null,
      actor_name: user?.email ?? 'System',
      action: AUDIT_ACTIONS.SYSTEM_ERROR,
      table_name: 'system_error_events',
      record_id: null,
      details: {
        source,
        severity,
        message: error.message,
        route,
      },
    })

    if (severity === 'ERROR' || severity === 'CRITICAL') {
      await supabase.from('notifications').insert({
        role_target: 'ADMIN',
        type: 'system',
        title: 'System error detected',
        body: `${source}: ${error.message.slice(0, 180)}`,
        href: '/admin/security',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
    }
  } catch (reportingError) {
    console.error('[PharmacyOS:error-reporting-failed]', reportingError)
  }
}

export function registerGlobalErrorReporting() {
  if (typeof window === 'undefined') return

  window.addEventListener('error', event => {
    void reportAppError('window.error', event.error ?? event.message, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    })
  })

  window.addEventListener('unhandledrejection', event => {
    void reportAppError('window.unhandledrejection', event.reason, {
      type: 'unhandledrejection',
    })
  })
}
