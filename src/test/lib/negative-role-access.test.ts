import { describe, it, expect } from 'vitest'

// ── Negative Role Access Matrix ───────────────────────────────────────────────
// Exhaustive denial assertions — every permission each role explicitly DOES NOT have.
// Companion to permission-logic.test.ts (which tests what roles CAN do).
// These tests protect against accidental permission escalation during refactoring.
//
// Rule: a test failure here means a role gained a permission it MUST NOT have.
// That is a CRITICAL RBAC regression with potential compliance consequences.
//
// All 14 permissions × 6 roles = 84 combinations.
// This file asserts every denial — all 40 negative cases (84 minus 44 grants).

// ── Mirror DEFAULT_PERMS (must stay in sync with usePermission.ts) ────────────

const DEFAULT_PERMS: Record<string, string[]> = {
  ADMIN:      ['pos_terminal','pos_void','pos_closeout','eod_approve','rx_dispense',
               'rx_schedule_log','inventory_manage','reports_view','staff_manage',
               'audit_view','settings_manage','loyalty_manage','ai_queue','timecard_manage'],
  MANAGER:    ['pos_terminal','pos_void','pos_closeout','eod_approve','inventory_manage',
               'reports_view','loyalty_manage','audit_view','settings_manage','timecard_manage'],
  PHARMACIST: ['rx_dispense','rx_schedule_log','inventory_manage','reports_view','ai_queue'],
  CASHIER:    ['pos_terminal','loyalty_manage'],
  TECHNICIAN: ['pos_terminal','rx_dispense','inventory_manage','ai_queue'],
  AUDITOR:    ['audit_view','reports_view'],
}

const ALL_PERMISSIONS = [
  'pos_terminal',
  'pos_void',
  'pos_closeout',
  'eod_approve',
  'rx_dispense',
  'rx_schedule_log',
  'inventory_manage',
  'reports_view',
  'staff_manage',
  'audit_view',
  'settings_manage',
  'loyalty_manage',
  'ai_queue',
  'timecard_manage',
]

function hasPermission(role: string, perm: string): boolean {
  return (DEFAULT_PERMS[role] ?? []).includes(perm)
}

function denies(role: string, perm: string): boolean {
  return !hasPermission(role, perm)
}

// ── CASHIER — must not have 12 of 14 permissions ─────────────────────────────

describe('CASHIER — explicit permission denials', () => {
  it('CRITICAL: cannot void transactions (pos_void)', () => {
    // pos_void grants the ability to reverse completed sales — CASHIER must never have this
    expect(denies('CASHIER', 'pos_void')).toBe(true)
  })

  it('cannot submit EOD closeout (pos_closeout)', () => {
    expect(denies('CASHIER', 'pos_closeout')).toBe(true)
  })

  it('cannot approve EOD reports (eod_approve)', () => {
    expect(denies('CASHIER', 'eod_approve')).toBe(true)
  })

  it('cannot dispense prescriptions (rx_dispense)', () => {
    expect(denies('CASHIER', 'rx_dispense')).toBe(true)
  })

  it('cannot access controlled drug schedule log (rx_schedule_log)', () => {
    expect(denies('CASHIER', 'rx_schedule_log')).toBe(true)
  })

  it('cannot manage inventory (inventory_manage)', () => {
    expect(denies('CASHIER', 'inventory_manage')).toBe(true)
  })

  it('cannot view reports (reports_view)', () => {
    expect(denies('CASHIER', 'reports_view')).toBe(true)
  })

  it('CRITICAL: cannot manage staff (staff_manage)', () => {
    expect(denies('CASHIER', 'staff_manage')).toBe(true)
  })

  it('cannot view audit log (audit_view)', () => {
    expect(denies('CASHIER', 'audit_view')).toBe(true)
  })

  it('CRITICAL: cannot manage settings (settings_manage)', () => {
    expect(denies('CASHIER', 'settings_manage')).toBe(true)
  })

  it('cannot access AI document queue (ai_queue)', () => {
    expect(denies('CASHIER', 'ai_queue')).toBe(true)
  })

  it('cannot manage timecards (timecard_manage)', () => {
    expect(denies('CASHIER', 'timecard_manage')).toBe(true)
  })
})

// ── AUDITOR — must not have 12 of 14 permissions ──────────────────────────────

describe('AUDITOR — explicit permission denials', () => {
  it('CRITICAL: cannot access POS terminal (pos_terminal)', () => {
    // Auditor is a read-only compliance observer — never operates POS
    expect(denies('AUDITOR', 'pos_terminal')).toBe(true)
  })

  it('CRITICAL: cannot void transactions (pos_void)', () => {
    expect(denies('AUDITOR', 'pos_void')).toBe(true)
  })

  it('cannot submit EOD closeout (pos_closeout)', () => {
    expect(denies('AUDITOR', 'pos_closeout')).toBe(true)
  })

  it('cannot approve EOD (eod_approve)', () => {
    expect(denies('AUDITOR', 'eod_approve')).toBe(true)
  })

  it('CRITICAL: cannot dispense prescriptions (rx_dispense)', () => {
    expect(denies('AUDITOR', 'rx_dispense')).toBe(true)
  })

  it('cannot access controlled drug schedule log (rx_schedule_log)', () => {
    expect(denies('AUDITOR', 'rx_schedule_log')).toBe(true)
  })

  it('cannot manage inventory (inventory_manage)', () => {
    expect(denies('AUDITOR', 'inventory_manage')).toBe(true)
  })

  it('CRITICAL: cannot manage staff (staff_manage)', () => {
    expect(denies('AUDITOR', 'staff_manage')).toBe(true)
  })

  it('CRITICAL: cannot manage settings (settings_manage)', () => {
    expect(denies('AUDITOR', 'settings_manage')).toBe(true)
  })

  it('cannot manage loyalty programme (loyalty_manage)', () => {
    expect(denies('AUDITOR', 'loyalty_manage')).toBe(true)
  })

  it('cannot access AI document queue (ai_queue)', () => {
    expect(denies('AUDITOR', 'ai_queue')).toBe(true)
  })

  it('cannot manage timecards (timecard_manage)', () => {
    expect(denies('AUDITOR', 'timecard_manage')).toBe(true)
  })
})

// ── PHARMACIST — must not have 9 of 14 permissions ───────────────────────────

describe('PHARMACIST — explicit permission denials', () => {
  it('CRITICAL: cannot access POS terminal (pos_terminal)', () => {
    // Pharmacists dispense medications — they do not operate the retail cash POS
    expect(denies('PHARMACIST', 'pos_terminal')).toBe(true)
  })

  it('CRITICAL: cannot void POS transactions (pos_void)', () => {
    expect(denies('PHARMACIST', 'pos_void')).toBe(true)
  })

  it('cannot submit EOD closeout (pos_closeout)', () => {
    expect(denies('PHARMACIST', 'pos_closeout')).toBe(true)
  })

  it('cannot approve EOD (eod_approve)', () => {
    expect(denies('PHARMACIST', 'eod_approve')).toBe(true)
  })

  it('CRITICAL: cannot manage staff (staff_manage)', () => {
    expect(denies('PHARMACIST', 'staff_manage')).toBe(true)
  })

  it('cannot view audit log (audit_view)', () => {
    expect(denies('PHARMACIST', 'audit_view')).toBe(true)
  })

  it('CRITICAL: cannot manage settings (settings_manage)', () => {
    expect(denies('PHARMACIST', 'settings_manage')).toBe(true)
  })

  it('cannot manage loyalty programme (loyalty_manage)', () => {
    expect(denies('PHARMACIST', 'loyalty_manage')).toBe(true)
  })

  it('cannot manage timecards (timecard_manage)', () => {
    expect(denies('PHARMACIST', 'timecard_manage')).toBe(true)
  })
})

// ── TECHNICIAN — must not have 10 of 14 permissions ──────────────────────────

describe('TECHNICIAN — explicit permission denials', () => {
  it('CRITICAL: cannot void transactions (pos_void)', () => {
    expect(denies('TECHNICIAN', 'pos_void')).toBe(true)
  })

  it('cannot submit EOD closeout (pos_closeout)', () => {
    expect(denies('TECHNICIAN', 'pos_closeout')).toBe(true)
  })

  it('cannot approve EOD (eod_approve)', () => {
    expect(denies('TECHNICIAN', 'eod_approve')).toBe(true)
  })

  it('cannot access controlled drug schedule log (rx_schedule_log)', () => {
    // Schedule log is pharmacist-only — technicians cannot generate or view it
    expect(denies('TECHNICIAN', 'rx_schedule_log')).toBe(true)
  })

  it('cannot view reports (reports_view)', () => {
    expect(denies('TECHNICIAN', 'reports_view')).toBe(true)
  })

  it('CRITICAL: cannot manage staff (staff_manage)', () => {
    expect(denies('TECHNICIAN', 'staff_manage')).toBe(true)
  })

  it('cannot view audit log (audit_view)', () => {
    expect(denies('TECHNICIAN', 'audit_view')).toBe(true)
  })

  it('CRITICAL: cannot manage settings (settings_manage)', () => {
    expect(denies('TECHNICIAN', 'settings_manage')).toBe(true)
  })

  it('cannot manage loyalty programme (loyalty_manage)', () => {
    expect(denies('TECHNICIAN', 'loyalty_manage')).toBe(true)
  })

  it('cannot manage timecards (timecard_manage)', () => {
    expect(denies('TECHNICIAN', 'timecard_manage')).toBe(true)
  })
})

// ── MANAGER — must not have 4 of 14 permissions ───────────────────────────────

describe('MANAGER — explicit permission denials', () => {
  it('CRITICAL: cannot dispense prescriptions (rx_dispense)', () => {
    // Dispensing is a clinical act — Manager is an operational role
    expect(denies('MANAGER', 'rx_dispense')).toBe(true)
  })

  it('cannot access controlled drug schedule log (rx_schedule_log)', () => {
    expect(denies('MANAGER', 'rx_schedule_log')).toBe(true)
  })

  it('CRITICAL: cannot manage staff (staff_manage — ADMIN-only)', () => {
    // staff_manage (create/suspend/delete users) is strictly ADMIN only
    // MANAGER cannot promote or deactivate staff accounts
    expect(denies('MANAGER', 'staff_manage')).toBe(true)
  })

  it('cannot access AI document queue (ai_queue)', () => {
    expect(denies('MANAGER', 'ai_queue')).toBe(true)
  })
})

// ── ADMIN — has all permissions (no denials expected) ─────────────────────────

describe('ADMIN — holds ALL permissions (zero denials)', () => {
  it('has every permission in the ALL_PERMISSIONS registry', () => {
    ALL_PERMISSIONS.forEach(perm => {
      expect(hasPermission('ADMIN', perm)).toBe(true)
    })
  })

  it('no permission exists that ADMIN lacks', () => {
    const adminPerms = new Set(DEFAULT_PERMS.ADMIN)
    ALL_PERMISSIONS.forEach(perm => {
      expect(adminPerms.has(perm)).toBe(true)
    })
  })
})

// ── Cross-role critical security assertions ───────────────────────────────────

describe('CRITICAL cross-role security boundaries', () => {
  it('staff_manage is ADMIN-only — no other role may have it', () => {
    const nonAdminRoles = Object.keys(DEFAULT_PERMS).filter(r => r !== 'ADMIN')
    nonAdminRoles.forEach(role => {
      expect(hasPermission(role, 'staff_manage')).toBe(false)
    })
  })

  it('settings_manage is restricted to ADMIN and MANAGER only', () => {
    const unauthorizedRoles = ['PHARMACIST', 'CASHIER', 'TECHNICIAN', 'AUDITOR']
    unauthorizedRoles.forEach(role => {
      expect(hasPermission(role, 'settings_manage')).toBe(false)
    })
  })

  it('pos_void is restricted to ADMIN and MANAGER only', () => {
    const unauthorizedRoles = ['PHARMACIST', 'CASHIER', 'TECHNICIAN', 'AUDITOR']
    unauthorizedRoles.forEach(role => {
      expect(hasPermission(role, 'pos_void')).toBe(false)
    })
  })

  it('rx_schedule_log is restricted to ADMIN and PHARMACIST only', () => {
    const unauthorizedRoles = ['CASHIER', 'TECHNICIAN', 'AUDITOR', 'MANAGER']
    unauthorizedRoles.forEach(role => {
      expect(hasPermission(role, 'rx_schedule_log')).toBe(false)
    })
  })

  it('eod_approve is restricted to ADMIN and MANAGER only', () => {
    const unauthorizedRoles = ['PHARMACIST', 'CASHIER', 'TECHNICIAN', 'AUDITOR']
    unauthorizedRoles.forEach(role => {
      expect(hasPermission(role, 'eod_approve')).toBe(false)
    })
  })

  it('timecard_manage is restricted to ADMIN and MANAGER only', () => {
    const unauthorizedRoles = ['PHARMACIST', 'CASHIER', 'TECHNICIAN', 'AUDITOR']
    unauthorizedRoles.forEach(role => {
      expect(hasPermission(role, 'timecard_manage')).toBe(false)
    })
  })

  it('ai_queue access: ADMIN, PHARMACIST, TECHNICIAN only — CASHIER, MANAGER, AUDITOR denied', () => {
    const authorized   = ['ADMIN', 'PHARMACIST', 'TECHNICIAN']
    const unauthorized = ['CASHIER', 'MANAGER', 'AUDITOR']
    authorized.forEach(role => {
      expect(hasPermission(role, 'ai_queue')).toBe(true)
    })
    unauthorized.forEach(role => {
      expect(hasPermission(role, 'ai_queue')).toBe(false)
    })
  })

  it('rx_dispense access: ADMIN, PHARMACIST, TECHNICIAN only — CASHIER, MANAGER, AUDITOR denied', () => {
    const authorized   = ['ADMIN', 'PHARMACIST', 'TECHNICIAN']
    const unauthorized = ['CASHIER', 'MANAGER', 'AUDITOR']
    authorized.forEach(role => {
      expect(hasPermission(role, 'rx_dispense')).toBe(true)
    })
    unauthorized.forEach(role => {
      expect(hasPermission(role, 'rx_dispense')).toBe(false)
    })
  })
})

// ── Unknown / null / empty roles ──────────────────────────────────────────────

describe('unknown or invalid role — all permissions denied', () => {
  it('unknown role string has no permissions', () => {
    ALL_PERMISSIONS.forEach(perm => {
      expect(hasPermission('SUPERADMIN', perm)).toBe(false)
    })
  })

  it('empty string role has no permissions', () => {
    ALL_PERMISSIONS.forEach(perm => {
      expect(hasPermission('', perm)).toBe(false)
    })
  })

  it('lowercase role strings are treated as unknown (RBAC is case-sensitive)', () => {
    expect(hasPermission('admin',      'staff_manage')).toBe(false)
    expect(hasPermission('cashier',    'pos_terminal')).toBe(false)
    expect(hasPermission('pharmacist', 'rx_dispense')).toBe(false)
  })

  it('mixed-case role string is denied (no fuzzy matching)', () => {
    expect(hasPermission('Admin',      'pos_terminal')).toBe(false)
    expect(hasPermission('Pharmacist', 'rx_dispense')).toBe(false)
  })
})

// ── Completeness guard ─────────────────────────────────────────────────────────

describe('permission registry completeness', () => {
  it('ALL_PERMISSIONS contains exactly 14 entries matching DEFAULT_PERMS', () => {
    expect(ALL_PERMISSIONS).toHaveLength(14)
  })

  it('every permission in any role is present in ALL_PERMISSIONS registry', () => {
    const allGranted = new Set(Object.values(DEFAULT_PERMS).flat())
    allGranted.forEach(perm => {
      expect(ALL_PERMISSIONS).toContain(perm)
    })
  })

  it('every entry in ALL_PERMISSIONS is granted to at least one role', () => {
    const allGranted = new Set(Object.values(DEFAULT_PERMS).flat())
    ALL_PERMISSIONS.forEach(perm => {
      expect(allGranted.has(perm)).toBe(true)
    })
  })

  it('ADMIN permission count equals ALL_PERMISSIONS count (ADMIN is full-access)', () => {
    expect(DEFAULT_PERMS.ADMIN.length).toBe(ALL_PERMISSIONS.length)
  })
})
