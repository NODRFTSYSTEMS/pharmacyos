import { NavLink, Outlet } from 'react-router-dom'

/**
 * Admin portal layout — design handoff Section 3.1 + 4.1.
 * Sidebar: 240px fixed, --color-bg-sidebar, logo zone (64px), nav groups, user account zone (sticky bottom, 64px).
 *
 * Sidebar nav items hard-coded for now — Slice 4 will drive this from a navigation config that derives
 * from route-permissions.ts, so role-aware filtering is a single source of truth.
 */

type NavItem = { to: string; label: string }
type NavGroup = { label: string; items: NavItem[] }

const NAV_GROUPS: readonly NavGroup[] = [
  {
    label: 'Dashboard',
    items: [{ to: '/dashboard', label: 'Overview' }],
  },
  {
    label: 'Inventory',
    items: [
      { to: '/inventory', label: 'Stock' },
      { to: '/inventory/catalog', label: 'Catalog' },
      { to: '/inventory/receive', label: 'Receive' },
      { to: '/inventory/scanner', label: 'AI Scanner' },
      { to: '/inventory/alerts', label: 'Alerts' },
      { to: '/inventory/suppliers', label: 'Suppliers' },
    ],
  },
  {
    label: 'Prescriptions',
    items: [
      { to: '/prescriptions', label: 'Queue' },
      { to: '/prescriptions/new', label: 'New' },
      { to: '/prescriptions/scanner', label: 'AI Scanner' },
      { to: '/prescriptions/schedule-log', label: 'Schedule Log' },
    ],
  },
  {
    label: 'Patients',
    items: [
      { to: '/patients', label: 'Search' },
      { to: '/patients/new', label: 'New' },
    ],
  },
  {
    label: 'Retail POS',
    items: [
      { to: '/pos', label: 'Open Terminal' },
      { to: '/pos/products', label: 'Products' },
      { to: '/pos/inventory', label: 'Inventory' },
      { to: '/pos/suppliers', label: 'Suppliers' },
      { to: '/pos/reports', label: 'Reports' },
      { to: '/pos/loyalty', label: 'Loyalty' },
    ],
  },
  {
    label: 'Reporting',
    items: [
      { to: '/reports', label: 'Hub' },
      { to: '/reports/inventory', label: 'Inventory' },
      { to: '/reports/dispensing', label: 'Dispensing' },
      { to: '/reports/schedule-log', label: 'Schedule Log' },
      { to: '/reports/revenue', label: 'Revenue' },
    ],
  },
  {
    label: 'AI',
    items: [{ to: '/ai/queue', label: 'Job Queue' }],
  },
  {
    label: 'Admin',
    items: [
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/audit', label: 'Audit Log' },
      { to: '/admin/settings', label: 'Settings' },
      { to: '/admin/security', label: 'Security' },
    ],
  },
]

// Demo user — replaced when auth is wired (ProtectedRoute reads session, layout receives via prop or context).
const DEMO_USER = { name: 'Demo User', role: 'Administrator', initials: 'DU' }

export function AdminPortalLayout() {
  return (
    <div className="min-h-screen flex bg-[--color-bg-base]">
      <aside
        className="w-60 shrink-0 sticky top-0 h-screen flex flex-col text-[--color-text-on-dark]"
        style={{ background: 'var(--color-bg-sidebar)' }}
      >
        {/* Logo zone — Section 4.1, 64px */}
        <div className="h-16 px-4 flex flex-col justify-center shrink-0">
          <p className="type-card-title text-white tracking-tight">PharmacyOS</p>
          <p className="type-label text-[--color-text-secondary] mt-0.5">Winchester Global</p>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-0.5">
              <p className="type-caption text-[--color-text-secondary] px-3 mb-1">{group.label}</p>
              <ul className="flex flex-col">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/dashboard'}
                      className={({ isActive }) =>
                        [
                          'group relative flex items-center h-10 px-4 type-body-sm rounded-[--radius-control] transition-colors',
                          isActive
                            ? 'bg-[--color-bg-sidebar-hover] text-white'
                            : 'text-[--color-text-on-dark] hover:bg-[--color-bg-sidebar-hover]',
                        ].join(' ')
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* 3px primary left border on active — Section 4.1 */}
                          {isActive && (
                            <span
                              aria-hidden
                              className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-sm bg-[--color-primary]"
                            />
                          )}
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User account zone — Section 4.1, 64px sticky bottom */}
        <div
          className="h-16 px-3 flex items-center gap-3 shrink-0 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <div className="size-8 shrink-0 rounded-full bg-[--color-bg-sidebar-hover] flex items-center justify-center type-label text-white">
            {DEMO_USER.initials}
          </div>
          <div className="flex-1 min-w-0 leading-tight">
            <p className="type-body-sm text-white truncate">{DEMO_USER.name}</p>
            <p className="type-label text-[--color-text-secondary] truncate">{DEMO_USER.role}</p>
          </div>
          <button
            type="button"
            aria-label="Sign out"
            title="Sign out"
            className="size-8 rounded-[--radius-control] flex items-center justify-center text-[--color-text-secondary] hover:text-white hover:bg-[--color-bg-sidebar-hover]"
          >
            {/* Inline icon — Phosphor SignOut shape, weight regular */}
            <svg width="18" height="18" viewBox="0 0 256 256" fill="none" aria-hidden="true">
              <path
                d="M112 216H48a8 8 0 0 1-8-8V48a8 8 0 0 1 8-8h64M168 168l40-40-40-40M208 128h-96"
                stroke="currentColor"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}
