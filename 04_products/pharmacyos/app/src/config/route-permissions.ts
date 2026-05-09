import { ALL_ROLES, type Role } from '@/types/auth'

/**
 * Authoritative role-to-route access matrix.
 * Authority: ADR Decision 7 — "must be a named constant in the codebase, not scattered across route components."
 * Source for explicit role assignments: pharmacyos-design-handoff-claude-design-2026-05-07.md Section 5.
 *
 * Where a route's role assignment is explicit in the handoff, ROLES is set accordingly.
 * Where the handoff does not specify, the assignment defaults to a conservative inference and is marked
 * with `INFERRED` — finalize during build phase with stakeholder review.
 */

export type RoutePermission = {
  readonly path: string
  readonly roles: readonly Role[]
  readonly inferred?: boolean
}

const PHARMACIST_TECH_MGR_ADMIN: readonly Role[] = ['pharmacist', 'pharmacy_technician', 'manager', 'admin']
const PHARMACIST_TECH: readonly Role[] = ['pharmacist', 'pharmacy_technician']
const MGR_ADMIN: readonly Role[] = ['manager', 'admin']
const POS_ROLES: readonly Role[] = ['front_desk_cashier', 'manager', 'admin']

export const ROUTE_PERMISSIONS = {
  // Auth — handoff: all authenticated
  '/profile': { path: '/profile', roles: ALL_ROLES },

  // Dashboard — handoff line 603: all (content varies by role)
  '/dashboard': { path: '/dashboard', roles: ALL_ROLES },

  // Inventory — handoff lines 614–657
  '/inventory': { path: '/inventory', roles: PHARMACIST_TECH_MGR_ADMIN },
  '/inventory/catalog': { path: '/inventory/catalog', roles: PHARMACIST_TECH_MGR_ADMIN },
  '/inventory/catalog/:id': { path: '/inventory/catalog/:id', roles: PHARMACIST_TECH_MGR_ADMIN },
  '/inventory/receive': { path: '/inventory/receive', roles: PHARMACIST_TECH },
  '/inventory/scanner': { path: '/inventory/scanner', roles: PHARMACIST_TECH },
  '/inventory/alerts': { path: '/inventory/alerts', roles: ALL_ROLES }, // handoff line 651: all (read); Tech/Mgr/Admin (act). Read access for all.
  '/inventory/suppliers': { path: '/inventory/suppliers', roles: PHARMACIST_TECH_MGR_ADMIN },

  // Prescriptions — handoff lines 665–690
  '/prescriptions': { path: '/prescriptions', roles: PHARMACIST_TECH },
  '/prescriptions/new': { path: '/prescriptions/new', roles: PHARMACIST_TECH },
  '/prescriptions/:id': { path: '/prescriptions/:id', roles: PHARMACIST_TECH }, // pharmacist verify/approve, tech fill
  '/prescriptions/scanner': { path: '/prescriptions/scanner', roles: PHARMACIST_TECH }, // tech captures, pharmacist confirms
  '/prescriptions/schedule-log': { path: '/prescriptions/schedule-log', roles: ['pharmacist', 'manager', 'admin'] }, // handoff line 690

  // Patients — handoff line 698: all (general); 703: all; 712: all; 718/721: INFERRED admin/jdpa-officer
  '/patients': { path: '/patients', roles: ALL_ROLES },
  '/patients/new': { path: '/patients/new', roles: ALL_ROLES },
  '/patients/:id': { path: '/patients/:id', roles: ALL_ROLES },
  '/patients/:id/insurance': { path: '/patients/:id/insurance', roles: ALL_ROLES, inferred: true },
  '/patients/:id/jdpa': { path: '/patients/:id/jdpa', roles: ['admin'], inferred: true }, // INFERRED — JDPA export/deletion is privileged

  // Reports — handoff line 727: Manager, Admin
  '/reports': { path: '/reports', roles: MGR_ADMIN },
  '/reports/inventory': { path: '/reports/inventory', roles: MGR_ADMIN, inferred: true },
  '/reports/dispensing': { path: '/reports/dispensing', roles: MGR_ADMIN, inferred: true },
  '/reports/schedule-log': { path: '/reports/schedule-log', roles: ['pharmacist', 'manager', 'admin'], inferred: true },
  '/reports/revenue': { path: '/reports/revenue', roles: MGR_ADMIN, inferred: true },

  // AI — handoff line 746: Pharmacist, Manager, Admin
  '/ai/queue': { path: '/ai/queue', roles: ['pharmacist', 'manager', 'admin'] },

  // POS — handoff line 755: Front Desk, Pharmacist, Manager
  '/pos': { path: '/pos', roles: ['front_desk_cashier', 'pharmacist', 'manager', 'admin'], inferred: true }, // admin INFERRED
  '/pos/products': { path: '/pos/products', roles: POS_ROLES, inferred: true },
  '/pos/products/:id': { path: '/pos/products/:id', roles: POS_ROLES, inferred: true },
  '/pos/inventory': { path: '/pos/inventory', roles: POS_ROLES, inferred: true },
  '/pos/suppliers': { path: '/pos/suppliers', roles: POS_ROLES, inferred: true },
  '/pos/reports': { path: '/pos/reports', roles: MGR_ADMIN, inferred: true },
  '/pos/loyalty': { path: '/pos/loyalty', roles: POS_ROLES, inferred: true },
  '/pos/loyalty/new': { path: '/pos/loyalty/new', roles: POS_ROLES, inferred: true },
  '/pos/loyalty/:id': { path: '/pos/loyalty/:id', roles: POS_ROLES, inferred: true },
  '/pos/loyalty/dashboard': { path: '/pos/loyalty/dashboard', roles: MGR_ADMIN }, // handoff line 785

  // Admin — admin only (BAP module description)
  '/admin/users': { path: '/admin/users', roles: ['admin'] },
  '/admin/audit': { path: '/admin/audit', roles: ['admin'] },
  '/admin/settings': { path: '/admin/settings', roles: ['admin'] },
  '/admin/security': { path: '/admin/security', roles: ['admin'] },
} as const satisfies Record<string, RoutePermission>

export type RoutePermissionKey = keyof typeof ROUTE_PERMISSIONS

export function rolesFor(key: RoutePermissionKey): readonly Role[] {
  return ROUTE_PERMISSIONS[key].roles
}
