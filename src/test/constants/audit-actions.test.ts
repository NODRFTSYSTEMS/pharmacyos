import { describe, it, expect } from 'vitest'
import { AUDIT_ACTIONS, AuditAction } from '../../constants/audit-actions'

// ── Registry contract tests ────────────────────────────────────────────────────
// These tests protect the audit_log schema from accidental regressions.
// Adding new categories: update these tests alongside the registry.

describe('AUDIT_ACTIONS registry', () => {
  it('contains all required POS / retail actions', () => {
    expect(AUDIT_ACTIONS.TRANSACTION_CREATE).toBeDefined()
    expect(AUDIT_ACTIONS.TRANSACTION_VOID).toBeDefined()
    expect(AUDIT_ACTIONS.LOYALTY_POINTS_EARN).toBeDefined()
    expect(AUDIT_ACTIONS.LOYALTY_POINTS_REDEEM).toBeDefined()
  })

  it('contains all required EOD actions', () => {
    expect(AUDIT_ACTIONS.EOD_SUBMIT).toBeDefined()
    expect(AUDIT_ACTIONS.EOD_APPROVE).toBeDefined()
    expect(AUDIT_ACTIONS.EOD_DISCREPANCY).toBeDefined()
  })

  it('contains all required prescription / Rx actions', () => {
    expect(AUDIT_ACTIONS.RX_CREATE).toBeDefined()
    expect(AUDIT_ACTIONS.RX_STATUS_ADVANCE).toBeDefined()
    expect(AUDIT_ACTIONS.RX_DISPENSE).toBeDefined()
    expect(AUDIT_ACTIONS.RX_CANCEL).toBeDefined()
    expect(AUDIT_ACTIONS.RX_TRANSACTION_CREATE).toBeDefined()
  })

  it('contains all required Schedule Drug Log actions (regulatory)', () => {
    // These are required by the Jamaica Dangerous Drugs Act audit trail
    expect(AUDIT_ACTIONS.SCHEDULE_DRUG_ENTRY).toBeDefined()
    expect(AUDIT_ACTIONS.SCHEDULE_DRUG_UPDATE).toBeDefined()
    expect(AUDIT_ACTIONS.SCHEDULE_DRUG_DELETE).toBeDefined()
  })

  it('contains all required inventory / stock actions', () => {
    expect(AUDIT_ACTIONS.STOCK_DECREMENT).toBeDefined()
    expect(AUDIT_ACTIONS.STOCK_RECEIVE).toBeDefined()
    expect(AUDIT_ACTIONS.STOCK_ADJUST).toBeDefined()
    expect(AUDIT_ACTIONS.PRODUCT_CREATE).toBeDefined()
    expect(AUDIT_ACTIONS.PRODUCT_UPDATE).toBeDefined()
  })

  it('contains all required patient actions (JDPA sensitive)', () => {
    expect(AUDIT_ACTIONS.PATIENT_CREATE).toBeDefined()
    expect(AUDIT_ACTIONS.PATIENT_UPDATE).toBeDefined()
    expect(AUDIT_ACTIONS.PATIENT_JDPA_CONSENT).toBeDefined()
    expect(AUDIT_ACTIONS.PATIENT_DATA_EXPORT).toBeDefined()
    expect(AUDIT_ACTIONS.PATIENT_DATA_DELETE).toBeDefined()
  })

  it('contains all required AI queue actions', () => {
    expect(AUDIT_ACTIONS.AI_EXTRACTION_ACCEPT).toBeDefined()
    expect(AUDIT_ACTIONS.AI_EXTRACTION_REJECT).toBeDefined()
  })

  it('contains all required staff and auth actions', () => {
    expect(AUDIT_ACTIONS.STAFF_CREATE).toBeDefined()
    expect(AUDIT_ACTIONS.STAFF_UPDATE).toBeDefined()
    expect(AUDIT_ACTIONS.STAFF_DEACTIVATE).toBeDefined()
    expect(AUDIT_ACTIONS.STAFF_LOGIN).toBeDefined()
    expect(AUDIT_ACTIONS.STAFF_LOGOUT).toBeDefined()
    expect(AUDIT_ACTIONS.STAFF_LOGIN_FAILED).toBeDefined()
    expect(AUDIT_ACTIONS.SESSION_TIMEOUT).toBeDefined()
  })

  it('contains all required settings actions', () => {
    expect(AUDIT_ACTIONS.SETTINGS_UPDATE).toBeDefined()
    expect(AUDIT_ACTIONS.PERMISSIONS_UPDATE).toBeDefined()
  })

  it('all action values are non-empty lowercase strings', () => {
    Object.entries(AUDIT_ACTIONS).forEach(([, value]) => {
      expect(typeof value).toBe('string')
      expect(value.length).toBeGreaterThan(0)
      expect(value).toBe(value.toLowerCase())
      // Should not contain spaces — only underscores as separators
      expect(value).not.toContain(' ')
    })
  })

  it('has at least 30 distinct action types across all categories', () => {
    expect(Object.keys(AUDIT_ACTIONS).length).toBeGreaterThanOrEqual(30)
  })

  it('all action values are unique (no duplicates)', () => {
    const values = Object.values(AUDIT_ACTIONS)
    const unique = new Set(values)
    expect(unique.size).toBe(values.length)
  })

  it('all action values contain an underscore (category_action convention)', () => {
    Object.entries(AUDIT_ACTIONS).forEach(([, value]) => {
      expect(value).toContain('_')
    })
  })
})

describe('AuditAction type', () => {
  it('EOD_APPROVE value is accepted as a valid AuditAction', () => {
    // TypeScript compile-time check: if this line compiles, the type is correct
    const action: AuditAction = AUDIT_ACTIONS.EOD_APPROVE
    expect(action).toBe('eod_approve')
  })

  it('RX_DISPENSE value is accepted as a valid AuditAction', () => {
    const action: AuditAction = AUDIT_ACTIONS.RX_DISPENSE
    expect(action).toBe('rx_dispense')
  })
})
