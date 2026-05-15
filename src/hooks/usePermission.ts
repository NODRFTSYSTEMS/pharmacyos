// ── usePermission hook ────────────────────────────────────────────────────────
// Returns true if the current user's role has the given permission key.
// Permissions are loaded from pharmacy_settings.role_permissions JSON.
// Falls back to DEFAULT_PERMS if no saved record exists.
//
// Usage:
//   const canDispense = usePermission('rx_dispense')
//   if (!canDispense) return null   // or redirect

import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useCurrentUser } from './useCurrentUser'

// Default permission sets — mirrors Users.tsx DEFAULT_PERMS
// Source of truth is pharmacy_settings; this is a safe fallback only.
const DEFAULT_PERMS: Record<string, string[]> = {
  ADMIN:      ['pos_terminal','pos_void','pos_closeout','eod_approve','rx_dispense',
               'rx_schedule_log','inventory_manage','reports_view','staff_manage',
               'audit_view','settings_manage','loyalty_manage','ai_queue','timecard_manage'],
  MANAGER:    ['pos_terminal','pos_void','pos_closeout','eod_approve','inventory_manage',
               'reports_view','loyalty_manage','audit_view','settings_manage','timecard_manage'],
  PHARMACIST: ['rx_dispense','rx_schedule_log','inventory_manage','reports_view','ai_queue'],
  CASHIER:    ['pos_terminal','loyalty_manage'],
  TECHNICIAN: ['pos_terminal','rx_dispense','inventory_manage','ai_queue'],
  // pos_void is a page-action permission (void transaction within a session), not a
  // standalone route guard. Cashier explicitly excluded to prevent unauthorized voids.
}

function useRolePermissions() {
  return useQuery({
    queryKey: ['role-permissions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('pharmacy_settings')
        .select('value')
        .eq('key', 'role_permissions')
        .maybeSingle()
      if (!data?.value) return DEFAULT_PERMS
      try {
        return JSON.parse(data.value) as Record<string, string[]>
      } catch {
        return DEFAULT_PERMS
      }
    },
    staleTime: 300_000, // 5 min — same as useCurrentUser
    retry: false,
  })
}

/**
 * Returns true if the current user has the specified permission.
 * Returns false while loading or if the user has no session.
 */
export function usePermission(permissionKey: string): boolean {
  const { data: currentUser } = useCurrentUser()
  const { data: rolePerms }   = useRolePermissions()

  if (!currentUser || !rolePerms) return false

  const permsForRole = rolePerms[currentUser.role] ?? DEFAULT_PERMS[currentUser.role] ?? []
  return permsForRole.includes(permissionKey)
}

/**
 * Returns true if the current user has ANY of the specified permissions.
 * Useful for showing nav sections that require one of multiple permissions.
 */
export function useAnyPermission(permissionKeys: string[]): boolean {
  const { data: currentUser } = useCurrentUser()
  const { data: rolePerms }   = useRolePermissions()

  if (!currentUser || !rolePerms) return false

  const permsForRole = rolePerms[currentUser.role] ?? DEFAULT_PERMS[currentUser.role] ?? []
  return permissionKeys.some(k => permsForRole.includes(k))
}
