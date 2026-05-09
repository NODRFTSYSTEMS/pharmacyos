import * as Tooltip from '@radix-ui/react-tooltip'
import { SignOut } from '@phosphor-icons/react'
import { NavLink } from 'react-router-dom'

/**
 * Sidebar — design handoff Section 4.1.
 * 240px wide, --color-bg-sidebar background, logo zone (64px), nav groups, user account zone (sticky bottom, 56px).
 * Tooltip descriptions on every nav item (Radix Tooltip) — surfaces purpose without crowding the label.
 *
 * Routes harmonized to BAP scope. Role filtering is added when ProtectedRoute exposes session.user.role.
 */

interface NavItemDef {
  label: string
  path: string
  description: string
}

interface NavGroupDef {
  label: string
  items: NavItemDef[]
}

const NAV_GROUPS: NavGroupDef[] = [
  {
    label: 'Inventory',
    items: [
      { label: 'Stock', path: '/inventory', description: 'Current stock levels, reorder alerts, and expiry tracking' },
      { label: 'Catalog', path: '/inventory/catalog', description: 'Drug catalog with DIN codes and pricing' },
      { label: 'Receive', path: '/inventory/receive', description: 'Log incoming deliveries and verify supplier invoices' },
      { label: 'AI Scanner', path: '/inventory/scanner', description: 'Scan supplier invoices — Claude Vision auto-extracts line items' },
      { label: 'Alerts', path: '/inventory/alerts', description: 'Low stock + expiring lots requiring action' },
      { label: 'Suppliers', path: '/inventory/suppliers', description: 'Supplier contacts, pricing, and order history' },
    ],
  },
  {
    label: 'Prescriptions',
    items: [
      { label: 'Queue', path: '/prescriptions', description: 'Active prescriptions — Received → Verified → Filled → Dispensed' },
      { label: 'New', path: '/prescriptions/new', description: 'Enter a prescription manually' },
      { label: 'AI Scanner', path: '/prescriptions/scanner', description: 'Scan paper prescriptions — Claude Vision extracts fields' },
      { label: 'Schedule Log', path: '/prescriptions/schedule-log', description: 'Controlled-substance dispensing log — regulatory required' },
    ],
  },
  {
    label: 'Patients',
    items: [
      { label: 'Search', path: '/patients', description: 'Patient records, history, and contact details' },
      { label: 'New', path: '/patients/new', description: 'Register a new patient and capture JDPA consent' },
    ],
  },
  {
    label: 'Retail POS',
    items: [
      { label: 'Open Terminal', path: '/pos', description: 'Launch the point-of-sale terminal (fullscreen)' },
      { label: 'Products', path: '/pos/products', description: 'Retail products and pricing' },
      { label: 'Inventory', path: '/pos/inventory', description: 'POS stock levels separate from pharmacy inventory' },
      { label: 'Suppliers', path: '/pos/suppliers', description: 'Retail supplier directory' },
      { label: 'Reports', path: '/pos/reports', description: 'Daily sales, reconciliation, payment breakdown' },
      { label: 'Loyalty', path: '/pos/loyalty', description: 'Customer loyalty — points, tiers, redemptions' },
    ],
  },
  {
    label: 'Reporting',
    items: [
      { label: 'Hub', path: '/reports', description: 'All reports — pick type and date range' },
      { label: 'Inventory', path: '/reports/inventory', description: 'Stock movement, shrinkage, lot expiry' },
      { label: 'Dispensing', path: '/reports/dispensing', description: 'Prescription fill rates and dispensing activity' },
      { label: 'Schedule Log', path: '/reports/schedule-log', description: 'Regulatory controlled-substance activity report' },
      { label: 'Revenue', path: '/reports/revenue', description: 'Sales and payment method breakdown by period' },
    ],
  },
  {
    label: 'AI',
    items: [
      { label: 'Job Queue', path: '/ai/queue', description: 'Active and completed AI extraction jobs' },
    ],
  },
  {
    label: 'Admin',
    items: [
      { label: 'Users', path: '/admin/users', description: 'Manage staff accounts, roles, and access' },
      { label: 'Audit Log', path: '/admin/audit', description: 'System activity log — who did what and when' },
      { label: 'Settings', path: '/admin/settings', description: 'System configuration, thresholds, integrations' },
      { label: 'Security', path: '/admin/security', description: 'Two-factor auth, session controls, security policies' },
    ],
  },
]

function NavItemRow({ item }: { item: NavItemDef }) {
  return (
    <Tooltip.Root delayDuration={600}>
      <Tooltip.Trigger asChild>
        <NavLink
          to={item.path}
          end={item.path === '/dashboard'}
          className={({ isActive }) =>
            [
              'block h-9 px-4 type-body-sm leading-9 rounded-control transition-colors relative select-none truncate',
              isActive
                ? 'bg-bg-sidebar-hover text-white before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-[3px] before:rounded-r before:bg-primary'
                : 'text-text-on-dark hover:bg-bg-sidebar-hover',
            ].join(' ')
          }
        >
          {item.label}
        </NavLink>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="right"
          sideOffset={16}
          className="z-50 max-w-[240px] rounded bg-text-primary px-3 py-2 shadow-dropdown"
        >
          <p className="text-xs text-white leading-snug">{item.description}</p>
          <Tooltip.Arrow className="fill-text-primary" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}

// Demo user — replaced when ProtectedRoute exposes session.user.
const DEMO_USER = { name: 'A. Clarke', role: 'Pharmacist', initials: 'AC' }

export function Sidebar() {
  return (
    <Tooltip.Provider>
      <aside
        className="flex flex-col w-60 h-screen sticky top-0 bg-bg-sidebar shrink-0"
        aria-label="Main navigation"
      >
        {/* Logo zone — Section 4.1, 64px */}
        <div className="flex items-center gap-3 h-16 px-4 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/20 text-primary font-bold text-sm shrink-0">
            ℞
          </div>
          <div className="min-w-0">
            <p className="type-card-title text-white leading-tight truncate">PharmacyOS</p>
            <p className="type-tiny text-text-secondary leading-tight mt-px truncate">
              Built by NoDrftSystems
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4" aria-label="Primary">
          {/* Dashboard (top-level, no group) */}
          <Tooltip.Root delayDuration={600}>
            <Tooltip.Trigger asChild>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  [
                    'block h-9 px-4 type-body-sm font-medium leading-9 rounded-control transition-colors relative select-none',
                    isActive
                      ? 'bg-bg-sidebar-hover text-white before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-[3px] before:rounded-r before:bg-primary'
                      : 'text-text-on-dark hover:bg-bg-sidebar-hover',
                  ].join(' ')
                }
              >
                Dashboard
              </NavLink>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="right"
                sideOffset={16}
                className="z-50 max-w-[240px] rounded bg-text-primary px-3 py-2 shadow-dropdown"
              >
                <p className="text-xs text-white leading-snug">
                  Today's overview — metrics, alerts, prescription board
                </p>
                <Tooltip.Arrow className="fill-text-primary" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>

          {/* Groups */}
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="type-caption text-text-secondary px-4 mb-1">{group.label}</p>
              <div className="flex flex-col gap-px">
                {group.items.map((item) => (
                  <NavItemRow key={item.path} item={item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User account zone — Section 4.1, 56px sticky bottom */}
        <div className="flex items-center gap-3 h-14 px-4 border-t border-white/10 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-pill bg-primary/30 text-primary text-xs font-semibold shrink-0">
            {DEMO_USER.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="type-body-sm text-text-on-dark truncate">{DEMO_USER.name}</p>
            <p className="type-label text-text-secondary truncate">{DEMO_USER.role}</p>
          </div>
          <Tooltip.Root delayDuration={400}>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                className="text-text-secondary hover:text-text-on-dark transition-colors"
                aria-label="Sign out"
              >
                <SignOut size={18} />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content side="top" className="z-50 rounded bg-text-primary px-2 py-1 shadow-dropdown">
                <p className="text-xs text-white">Sign out</p>
                <Tooltip.Arrow className="fill-text-primary" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>
      </aside>
    </Tooltip.Provider>
  )
}
