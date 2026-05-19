import { describe, expect, it } from 'vitest'
import { AUDIT_ACTIONS } from '../../constants/audit-actions'
import {
  auditActorMatchesSession,
  auditCategory,
  buildAuditPayload,
  isAuditAction,
  redactAuditDetails,
} from '../../lib/auditPayload'

describe('audit logging - action validation', () => {
  it.each([
    [AUDIT_ACTIONS.PATIENT_JDPA_CONSENT, true],
    [AUDIT_ACTIONS.EOD_APPROVE, true],
    [AUDIT_ACTIONS.ACCESS_DENIED, true],
    [AUDIT_ACTIONS.SYSTEM_ERROR, true],
    [AUDIT_ACTIONS.LOYALTY_CUSTOMER_CREATE, true],
    ['patient_jdpa_consent', true],
    ['unknown_action', false],
    ['', false],
  ])('validates audit action %s', (action, expected) => {
    expect(isAuditAction(action)).toBe(expected)
  })
})

describe('audit logging - payload shape', () => {
  it.each([
    ['patients', 'p1', AUDIT_ACTIONS.PATIENT_JDPA_CONSENT, 'Staff One'],
    ['eod_closeouts', 'e1', AUDIT_ACTIONS.EOD_APPROVE, 'manager@example.com'],
    ['route', null, AUDIT_ACTIONS.ACCESS_DENIED, 'System'],
    ['system_error_events', null, AUDIT_ACTIONS.SYSTEM_ERROR, 'System'],
    ['loyalty_customers', 'l1', AUDIT_ACTIONS.LOYALTY_CUSTOMER_UPDATE, 'Cashier'],
    ['products', 'prod1', AUDIT_ACTIONS.PRODUCT_UPDATE, 'Inventory Manager'],
    ['timecards', 't1', AUDIT_ACTIONS.TIMECARD_APPROVE, 'Manager'],
    ['extraction_queue', 'x1', AUDIT_ACTIONS.AI_EXTRACTION_ACCEPT, 'Pharmacist'],
  ])('builds payload for table %s action %s', (tableName, recordId, action, actorName) => {
    const payload = buildAuditPayload({
      actor: actorName === 'System' ? null : { id: 'u1', name: actorName },
      action,
      tableName,
      recordId,
      details: { source: 'test' },
    })
    expect(payload.table_name).toBe(tableName)
    expect(payload.record_id).toBe(recordId)
    expect(payload.action).toBe(action)
    expect(payload.actor_name).toBe(actorName)
  })
})

describe('audit logging - actor/session match', () => {
  it.each([
    ['u1', 'u1', true],
    ['u1', 'u2', false],
    [null, 'u1', false],
    ['u1', null, false],
  ])('compares actor %s to session %s', (actorId, sessionId, expected) => {
    expect(auditActorMatchesSession(actorId, sessionId)).toBe(expected)
  })
})

describe('audit logging - detail redaction', () => {
  it.each([
    [{ phone: '8765551234' }, ['phone'], '[redacted]'],
    [{ email: 'a@example.com' }, ['email'], '[redacted]'],
    [{ patient_name: 'Jane Doe' }, ['patient_name'], '[redacted]'],
    [{ amount: 100 }, ['amount'], '[redacted]'],
    [{ source: 'registration' }, ['missing'], 'registration'],
    [{ note: null }, ['note'], '[redacted]'],
  ])('redacts selected keys from %o', (details, keys, expected) => {
    const redacted = redactAuditDetails(details, keys)
    const key = Object.keys(details)[0]
    expect(redacted[key]).toBe(expected)
  })
})

describe('audit logging - category mapping', () => {
  it.each([
    [AUDIT_ACTIONS.RX_CREATE, 'prescriptions'],
    [AUDIT_ACTIONS.PATIENT_DATA_EXPORT, 'patients'],
    [AUDIT_ACTIONS.LOYALTY_POINTS_EARN, 'loyalty'],
    [AUDIT_ACTIONS.TIMECARD_CLOCK_IN, 'timecards'],
    [AUDIT_ACTIONS.STOCK_ADJUST, 'inventory'],
    [AUDIT_ACTIONS.EOD_DISCREPANCY, 'eod'],
  ])('maps action %s to category %s', (action, expected) => {
    expect(auditCategory(action)).toBe(expected)
  })
})
