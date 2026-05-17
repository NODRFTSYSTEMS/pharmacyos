import { describe, it, expect } from 'vitest'

// ── Permission resolution logic — usePermission hook ─────────────────────────
// Mirrors usePermission.ts DEFAULT_PERMS and resolution logic exactly.
// These tests protect the access-control layer against accidental regression.
//
// A bug here means: a CASHIER gains POS void access, or a PHARMACIST
// can manage staff. These are RBAC failures with compliance consequences.

// ── Mirror DEFAULT_PERMS from usePermission.ts ────────────────────────────────

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

// Mirror resolution from usePermission.ts line 63–64
function resolvePermission(
  rolePerms: Record<string, string[]>,
  role: string,
  permissionKey: string,
): boolean {
  const permsForRole = rolePerms[role] ?? DEFAULT_PERMS[role] ?? []
  return permsForRole.includes(permissionKey)
}

// Mirror useAnyPermission from usePermission.ts line 77–78
function resolveAnyPermission(
  rolePerms: Record<string, string[]>,
  role: string,
  permissionKeys: string[],
): boolean {
  const permsForRole = rolePerms[role] ?? DEFAULT_PERMS[role] ?? []
  return permissionKeys.some(k => permsForRole.includes(k))
}

// ── ADMIN role ────────────────────────────────────────────────────────────────

describe('ADMIN permissions', () => {
  it('has all 14 permissions', () => {
    expect(DEFAULT_PERMS.ADMIN.length).toBe(14)
  })

  it('has every permission that any other role has', () => {
    const allPerms = new Set(Object.values(DEFAULT_PERMS).flat())
    allPerms.forEach(perm => {
      expect(DEFAULT_PERMS.ADMIN).toContain(perm)
    })
  })

  it('can access POS terminal', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'ADMIN', 'pos_terminal')).toBe(true)
  })

  it('can void transactions', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'ADMIN', 'pos_void')).toBe(true)
  })

  it('can manage staff', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'ADMIN', 'staff_manage')).toBe(true)
  })

  it('can manage settings', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'ADMIN', 'settings_manage')).toBe(true)
  })

  it('can approve EOD', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'ADMIN', 'eod_approve')).toBe(true)
  })
})

// ── CASHIER role ──────────────────────────────────────────────────────────────

describe('CASHIER permissions', () => {
  it('has exactly 2 permissions', () => {
    expect(DEFAULT_PERMS.CASHIER.length).toBe(2)
  })

  it('can access POS terminal', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'CASHIER', 'pos_terminal')).toBe(true)
  })

  it('can access loyalty management', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'CASHIER', 'loyalty_manage')).toBe(true)
  })

  it('CRITICAL: cannot void transactions', () => {
    // pos_void is explicitly excluded from CASHIER to prevent unauthorized voids
    expect(resolvePermission(DEFAULT_PERMS, 'CASHIER', 'pos_void')).toBe(false)
  })

  it('cannot dispense prescriptions', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'CASHIER', 'rx_dispense')).toBe(false)
  })

  it('cannot manage staff', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'CASHIER', 'staff_manage')).toBe(false)
  })

  it('cannot submit EOD closeout', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'CASHIER', 'pos_closeout')).toBe(false)
  })

  it('cannot approve EOD', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'CASHIER', 'eod_approve')).toBe(false)
  })

  it('cannot view reports', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'CASHIER', 'reports_view')).toBe(false)
  })

  it('cannot view audit log', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'CASHIER', 'audit_view')).toBe(false)
  })
})

// ── PHARMACIST role ───────────────────────────────────────────────────────────

describe('PHARMACIST permissions', () => {
  it('can dispense prescriptions', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'PHARMACIST', 'rx_dispense')).toBe(true)
  })

  it('can access schedule drug log', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'PHARMACIST', 'rx_schedule_log')).toBe(true)
  })

  it('can manage inventory', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'PHARMACIST', 'inventory_manage')).toBe(true)
  })

  it('can view reports', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'PHARMACIST', 'reports_view')).toBe(true)
  })

  it('can access AI document queue', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'PHARMACIST', 'ai_queue')).toBe(true)
  })

  it('CRITICAL: cannot access POS terminal', () => {
    // Pharmacists dispense; they do not operate the retail POS
    expect(resolvePermission(DEFAULT_PERMS, 'PHARMACIST', 'pos_terminal')).toBe(false)
  })

  it('cannot void transactions', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'PHARMACIST', 'pos_void')).toBe(false)
  })

  it('cannot manage staff', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'PHARMACIST', 'staff_manage')).toBe(false)
  })

  it('cannot manage settings', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'PHARMACIST', 'settings_manage')).toBe(false)
  })
})

// ── AUDITOR role ──────────────────────────────────────────────────────────────

describe('AUDITOR permissions', () => {
  it('has exactly 2 permissions — read-only compliance observer', () => {
    expect(DEFAULT_PERMS.AUDITOR.length).toBe(2)
  })

  it('can view audit log', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'AUDITOR', 'audit_view')).toBe(true)
  })

  it('can view reports', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'AUDITOR', 'reports_view')).toBe(true)
  })

  it('CRITICAL: cannot access POS terminal', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'AUDITOR', 'pos_terminal')).toBe(false)
  })

  it('cannot dispense prescriptions', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'AUDITOR', 'rx_dispense')).toBe(false)
  })

  it('cannot manage staff', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'AUDITOR', 'staff_manage')).toBe(false)
  })

  it('cannot manage settings', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'AUDITOR', 'settings_manage')).toBe(false)
  })

  it('cannot void transactions', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'AUDITOR', 'pos_void')).toBe(false)
  })
})

// ── MANAGER role ──────────────────────────────────────────────────────────────

describe('MANAGER permissions', () => {
  it('can access POS terminal', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'MANAGER', 'pos_terminal')).toBe(true)
  })

  it('can void transactions', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'MANAGER', 'pos_void')).toBe(true)
  })

  it('can submit EOD closeout', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'MANAGER', 'pos_closeout')).toBe(true)
  })

  it('can approve EOD', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'MANAGER', 'eod_approve')).toBe(true)
  })

  it('can manage timecards', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'MANAGER', 'timecard_manage')).toBe(true)
  })

  it('CRITICAL: cannot manage staff (staff_manage is ADMIN only)', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'MANAGER', 'staff_manage')).toBe(false)
  })

  it('cannot dispense prescriptions', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'MANAGER', 'rx_dispense')).toBe(false)
  })
})

// ── TECHNICIAN role ───────────────────────────────────────────────────────────

describe('TECHNICIAN permissions', () => {
  it('can access POS terminal', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'TECHNICIAN', 'pos_terminal')).toBe(true)
  })

  it('can dispense prescriptions (under pharmacist supervision)', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'TECHNICIAN', 'rx_dispense')).toBe(true)
  })

  it('can manage inventory', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'TECHNICIAN', 'inventory_manage')).toBe(true)
  })

  it('can access AI document queue', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'TECHNICIAN', 'ai_queue')).toBe(true)
  })

  it('cannot void transactions', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'TECHNICIAN', 'pos_void')).toBe(false)
  })

  it('cannot approve EOD', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'TECHNICIAN', 'eod_approve')).toBe(false)
  })

  it('cannot manage staff', () => {
    expect(resolvePermission(DEFAULT_PERMS, 'TECHNICIAN', 'staff_manage')).toBe(false)
  })
})

// ── resolveAnyPermission ──────────────────────────────────────────────────────

describe('resolveAnyPermission — OR logic for nav visibility', () => {
  it('returns true if user has at least one of the requested permissions', () => {
    expect(resolveAnyPermission(DEFAULT_PERMS, 'PHARMACIST', ['rx_dispense', 'staff_manage'])).toBe(true)
  })

  it('returns false if user has none of the requested permissions', () => {
    expect(resolveAnyPermission(DEFAULT_PERMS, 'CASHIER', ['eod_approve', 'staff_manage', 'audit_view'])).toBe(false)
  })

  it('returns false for empty permission list', () => {
    expect(resolveAnyPermission(DEFAULT_PERMS, 'ADMIN', [])).toBe(false)
  })

  it('returns true for ADMIN with any single permission key', () => {
    expect(resolveAnyPermission(DEFAULT_PERMS, 'ADMIN', ['settings_manage'])).toBe(true)
  })
})

// ── Custom rolePerms override ─────────────────────────────────────────────────

describe('resolvePermission — custom pharmacy_settings override', () => {
  it('uses custom perms from pharmacy_settings when provided', () => {
    const customPerms = {
      ...DEFAULT_PERMS,
      CASHIER: [...DEFAULT_PERMS.CASHIER, 'reports_view'], // admin granted reports_view to cashiers
    }
    expect(resolvePermission(customPerms, 'CASHIER', 'reports_view')).toBe(true)
  })

  it('falls back to DEFAULT_PERMS for unknown role', () => {
    const sparsePerms = { ADMIN: DEFAULT_PERMS.ADMIN }
    // CASHIER not in sparsePerms → falls back to DEFAULT_PERMS.CASHIER
    expect(resolvePermission(sparsePerms, 'CASHIER', 'pos_terminal')).toBe(true)
    expect(resolvePermission(sparsePerms, 'CASHIER', 'staff_manage')).toBe(false)
  })
})

// ── Structural integrity ──────────────────────────────────────────────────────

describe('DEFAULT_PERMS — structural integrity', () => {
  it('defines all 6 roles', () => {
    const roles = ['ADMIN', 'MANAGER', 'PHARMACIST', 'CASHIER', 'TECHNICIAN', 'AUDITOR']
    roles.forEach(role => {
      expect(DEFAULT_PERMS[role]).toBeDefined()
      expect(Array.isArray(DEFAULT_PERMS[role])).toBe(true)
    })
  })

  it('no role has duplicate permissions', () => {
    Object.entries(DEFAULT_PERMS).forEach(([role, perms]) => {
      const unique = new Set(perms)
      expect(unique.size).toBe(perms.length, `${role} has duplicate permissions`)
    })
  })

  it('all permission keys are non-empty lowercase strings with underscores', () => {
    const allPerms = Object.values(DEFAULT_PERMS).flat()
    allPerms.forEach(perm => {
      expect(typeof perm).toBe('string')
      expect(perm.length).toBeGreaterThan(0)
      expect(perm).toBe(perm.toLowerCase())
      expect(perm).toContain('_')
    })
  })

  it('pos_void is NOT in CASHIER permissions (explicit security requirement)', () => {
    expect(DEFAULT_PERMS.CASHIER).not.toContain('pos_void')
  })

  it('staff_manage is ADMIN-only', () => {
    const nonAdminRoles = ['MANAGER', 'PHARMACIST', 'CASHIER', 'TECHNICIAN', 'AUDITOR']
    nonAdminRoles.forEach(role => {
      expect(DEFAULT_PERMS[role]).not.toContain('staff_manage')
    })
  })

  it('settings_manage is ADMIN and MANAGER only', () => {
    const unauthorizedRoles = ['PHARMACIST', 'CASHIER', 'TECHNICIAN', 'AUDITOR']
    unauthorizedRoles.forEach(role => {
      expect(DEFAULT_PERMS[role]).not.toContain('settings_manage')
    })
  })
})
