import { NavLink, Outlet } from 'react-router-dom'

/**
 * Admin portal layout — fixed 240px sidebar + main content area.
 * Authority: design handoff Section 3.1, Section 4.1 (sidebar).
 *
 * Sidebar implementation here is a structural skeleton — sufficient for navigation testing.
 * Final styling and role-aware item filtering land during the build phase.
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

export function AdminPortalLayout() {
  return (
    <div className="min-h-screen flex bg-[--color-bg-base]">
      <aside
        className="w-60 shrink-0 sticky top-0 h-screen overflow-y-auto px-4 py-4 text-[--color-text-on-dark]"
        style={{ background: 'var(--color-bg-sidebar)' }}
      >
        <div className="mb-6 px-2">
          <p className="font-sans font-semibold text-base">PharmacyOS</p>
          <p className="font-sans text-xs text-[--color-text-secondary] mt-0.5">Winchester Global</p>
        </div>
        <nav className="flex flex-col gap-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-2 mb-1 text-[11px] font-medium uppercase tracking-wider text-[--color-text-secondary]">
                {group.label}
              </p>
              <ul className="flex flex-col">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/dashboard'}
                      className={({ isActive }) =>
                        [
                          'block h-10 px-3 flex items-center text-sm rounded-[--radius-control]',
                          isActive
                            ? 'bg-[--color-bg-sidebar-hover] text-white border-l-[3px] border-[--color-primary]'
                            : 'hover:bg-[--color-bg-sidebar-hover]',
                        ].join(' ')
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
