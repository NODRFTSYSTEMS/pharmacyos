// ── Route Permission Map ──────────────────────────────────────────────────────
// Maps each protected route path to the permission key required to access it.
// Routes not listed here require only an active session (no specific permission).
// Used by RoleGuard to enforce access control at the route level.

export const ROUTE_PERMISSIONS: Record<string, string> = {
  // ── Prescriptions ──────────────────────────────────────────────────────────
  '/prescriptions':               'rx_dispense',
  '/prescriptions/new':           'rx_dispense',
  '/prescriptions/schedule-log':  'rx_schedule_log',

  // ── POS ────────────────────────────────────────────────────────────────────
  '/pos':                         'pos_terminal',
  '/pos/transactions':            'pos_terminal',
  '/pos/closeout':                'pos_closeout',
  '/pos/eod-report':              'eod_approve',
  '/pos/products':                'pos_terminal',
  '/pos/suppliers':               'inventory_manage',
  '/pos/loyalty':                 'loyalty_manage',
  '/pos/reports':                 'reports_view',

  // ── Patients ───────────────────────────────────────────────────────────────
  '/patients':                    'rx_dispense',
  '/patients/new':                'rx_dispense',

  // ── Reports ────────────────────────────────────────────────────────────────
  '/reports/revenue':             'reports_view',
  '/reports/dispensing':          'reports_view',
  '/reports/inventory':           'reports_view',

  // ── AI Queue ───────────────────────────────────────────────────────────────
  '/ai/queue':                    'ai_queue',

  // ── Admin ──────────────────────────────────────────────────────────────────
  '/admin/users':                 'staff_manage',
  '/admin/audit':                 'audit_view',
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
  Reports:       ['reports_view'],
  'AI Queue':    ['ai_queue'],
  Admin:         ['staff_manage', 'audit_view', 'settings_manage'],
}
