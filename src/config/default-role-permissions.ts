import type { StaffRole } from '../types/database'

export type PermissionKey =
  | 'pos_terminal'
  | 'pos_void'
  | 'pos_closeout'
  | 'eod_approve'
  | 'rx_dispense'
  | 'rx_schedule_log'
  | 'inventory_manage'
  | 'reports_view'
  | 'staff_manage'
  | 'audit_view'
  | 'settings_manage'
  | 'loyalty_manage'
  | 'ai_queue'
  | 'timecard_manage'

export const DEFAULT_ROLE_PERMISSIONS: Record<StaffRole, PermissionKey[]> = {
  ADMIN: [
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
  ],
  MANAGER: [
    'pos_terminal',
    'pos_void',
    'pos_closeout',
    'eod_approve',
    'inventory_manage',
    'reports_view',
    'loyalty_manage',
    'audit_view',
    'settings_manage',
    'timecard_manage',
  ],
  PHARMACIST: [
    'rx_dispense',
    'rx_schedule_log',
    'inventory_manage',
    'reports_view',
    'ai_queue',
  ],
  CASHIER: [
    'pos_terminal',
    'loyalty_manage',
  ],
  TECHNICIAN: [
    'pos_terminal',
    'rx_dispense',
    'inventory_manage',
    'ai_queue',
  ],
  AUDITOR: [
    'audit_view',
    'reports_view',
  ],
}

export function roleHasPermission(
  role: StaffRole | string | null | undefined,
  permission: string,
  rolePermissions: Partial<Record<StaffRole, readonly string[]>> = DEFAULT_ROLE_PERMISSIONS,
): boolean {
  if (!role || !(role in DEFAULT_ROLE_PERMISSIONS)) return false
  return Boolean(rolePermissions[role as StaffRole]?.includes(permission))
}

export function deniedPermissionsForRole(
  role: StaffRole,
  permissions: readonly string[],
  rolePermissions: Partial<Record<StaffRole, readonly string[]>> = DEFAULT_ROLE_PERMISSIONS,
): string[] {
  return permissions.filter(permission => !roleHasPermission(role, permission, rolePermissions))
}
