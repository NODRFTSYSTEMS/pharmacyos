// ── Route Permission Map ──────────────────────────────────────────────────────
// Maps each protected route path to the permission key required to access it.
// Routes not listed here require only an active session (no specific permission).
// Used by RoleGuard to enforce access control at the route level.

export const ROUTE_PERMISSIONS: Record<string, string> = {
  // ── Prescriptions ──────────────────────────────────────────────────────────
  '/prescriptions':               'rx_dispense',
  '/prescriptions/new':           'rx_dispense',
  '/prescriptions/schedule-log':  'rx_schedule_log',
  // Note: '/prescriptions/:id' is intentionally absent. Dynamic Rx detail routes
  // are accessible only from the queue page which already requires rx_dispense.
  // React Router v7 does not match literal ':id' patterns in this static map.

  // ── POS ────────────────────────────────────────────────────────────────────
  '/pos':                         'pos_terminal',
  '/pos/transactions':            'pos_terminal',
  '/pos/closeout':                'pos_closeout',
  '/pos/eod-report':              'pos_closeout',
  '/pos/products':                'pos_terminal',
  '/pos/suppliers':               'inventory_manage',
  '/pos/loyalty':                 'loyalty_manage',
  '/pos/reports':                 'reports_view',

  // ── Patients ───────────────────────────────────────────────────────────────
  '/patients':                    'rx_dispense',
  '/patients/new':                'rx_dispense',
  // Note: '/patients/:id' not listed — dynamic segments don't match this static map;
  // route access is enforced by the RoleGuard on the Route element in App.tsx.

  // ── Inventory ──────────────────────────────────────────────────────────────
  '/inventory/receive-stock':     'inventory_manage',
  '/inventory/stock-movements':   'inventory_manage',

  // ── Staff / Timecards ──────────────────────────────────────────────────────
  // Note: '/staff/timecard' (clock-in/out) is session-only — all authenticated
  // staff may clock in/out regardless of role. Not listed here by design.
  '/staff/timecards':             'timecard_manage',
  // timecard_view: own timecard history only (Employment Act — right to verify hours)
  '/staff/my-timecards':          'timecard_view',
  // HR Manager: full leave + salary management (ADMIN/MANAGER only)
  '/hr/manager':                  'staff_manage',

  // ── Reports ────────────────────────────────────────────────────────────────
  '/reports/revenue':             'reports_view',
  '/reports/dispensing':          'reports_view',
  '/reports/inventory':           'reports_view',
  '/reports/timecards':           'reports_view',

  // ── AI Queue ───────────────────────────────────────────────────────────────
  '/ai/queue':                    'ai_queue',

  // ── Admin ──────────────────────────────────────────────────────────────────
  '/admin/users':                 'staff_manage',
  '/admin/audit':                 'audit_view',
  // Security: audit_view is the minimum — AUDITOR can view; ADMIN/MANAGER also have audit_view
  '/admin/security':              'audit_view',
  // System Audit Report: aggregated self-audit analysis — same audience as raw audit log
  '/admin/audit-report':          'audit_view',
  '/admin/settings':              'settings_manage',
}

// ── Nav section → minimum permission for visibility ──────────────────────────
// Used by Sidebar to filter which nav groups are shown to the current user.
// A nav group is visible if the user has ANY of the listed permissions.
export const NAV_PERMISSIONS: Record<string, string[]> = {
  Prescriptions: ['rx_dispense', 'rx_schedule_log'],
  'Retail POS':  ['pos_terminal', 'pos_closeout', 'eod_approve', 'inventory_manage',
                  'reports_view', 'loyalty_manage'],
  Patients:      ['rx_dispense'],
  Inventory:     ['inventory_manage'],
  // Staff nav group: My Timecard is session-only (all staff). Timecards manager
  // requires timecard_manage. Group is always visible — filter done in useFilteredNav.
  Reports:       ['reports_view'],
  'AI Queue':    ['ai_queue'],
  Admin:         ['staff_manage', 'audit_view', 'settings_manage'],
}
