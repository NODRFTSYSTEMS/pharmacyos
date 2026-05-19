import { AUDIT_ACTIONS, type AuditAction } from '../constants/audit-actions'

export interface AuditActor {
  id: string | null
  email?: string | null
  name?: string | null
}

export interface AuditPayload {
  actor_id: string | null
  actor_name: string
  action: AuditAction
  table_name: string
  record_id: string | null
  details: Record<string, unknown>
}

const ACTION_VALUES = new Set<string>(Object.values(AUDIT_ACTIONS))

export function isAuditAction(value: string): value is AuditAction {
  return ACTION_VALUES.has(value)
}

export function buildAuditPayload(args: {
  actor: AuditActor | null | undefined
  action: AuditAction
  tableName: string
  recordId?: string | null
  details?: Record<string, unknown>
}): AuditPayload {
  return {
    actor_id: args.actor?.id ?? null,
    actor_name: args.actor?.name ?? args.actor?.email ?? 'System',
    action: args.action,
    table_name: args.tableName,
    record_id: args.recordId ?? null,
    details: args.details ?? {},
  }
}

export function auditActorMatchesSession(actorId: string | null, sessionUserId: string | null): boolean {
  if (!actorId || !sessionUserId) return false
  return actorId === sessionUserId
}

export function redactAuditDetails(details: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  const copy = { ...details }
  for (const key of keys) {
    if (key in copy) copy[key] = '[redacted]'
  }
  return copy
}

export function auditCategory(action: AuditAction): string {
  if (action.startsWith('rx_')) return 'prescriptions'
  if (action.startsWith('patient_')) return 'patients'
  if (action.startsWith('loyalty_')) return 'loyalty'
  if (action.startsWith('timecard_')) return 'timecards'
  if (action.startsWith('stock_') || action.startsWith('product_')) return 'inventory'
  if (action.startsWith('eod_')) return 'eod'
  if (action.startsWith('ai_')) return 'ai'
  return 'system'
}
