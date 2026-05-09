import { useEffect } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { CaretDown, MagnifyingGlass, SignOut } from '@phosphor-icons/react'
import { NavLink, useLocation } from 'react-router-dom'
import { ROLES, type Role } from '@/types/auth'
import { type RoutePermissionKey } from '@/config/route-permissions'
import { usePermissionsStore } from '@/stores/permissions'

/** Trigger CommandPalette (which listens for Cmd/Ctrl+K on window). */
function openCommandPalette() {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))
}

/**
 * Sidebar — design handoff Section 4.1.
 * 240px wide, --color-bg-sidebar background, logo zone (64px), nav groups, user account zone.
 *
 * Role-aware filtering: each nav item's `path` is checked against the permissions store.
 * If the acting role doesn't have access to a route, the item is hidden. If a group has
 * zero accessible items, the entire group is hidden.
 *
 * Demo mode (VITE_DEMO_MODE=true): role switcher is visible so reviewers can act as any
 * role to verify the permissions matrix. In production (VITE_DEMO_MODE unset or false):
 * the switcher is hidden and a read-only identity row is shown instead — real session
 * data replaces this when auth wires (G2).
 */

const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

interface NavItemDef {
  label: string
  path: RoutePermissionKey
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
      { label: 'Permissions', path: '/admin/permissions', description: 'Role-to-route access matrix — what each role can access' },
      { label: 'Audit Log', path: '/admin/audit', description: 'System activity log — who did what and when' },
      { label: 'Settings', path: '/admin/settings', description: 'System configuration, thresholds, integrations' },
      { label: 'Security', path: '/admin/security', description: 'Two-factor auth, session controls, security policies' },
    ],
  },
]

const ROLE_LABELS: Record<Role, string> = {
  pharmacist: 'Pharmacist',
  pharmacy_technician: 'Pharmacy Technician',
  front_desk_cashier: 'Front Desk / Cashier',
  manager: 'Manager',
  admin: 'Admin',
}

const ROLE_INITIALS: Record<Role, string> = {
  pharmacist: 'PH',
  pharmacy_technician: 'PT',
  front_desk_cashier: 'FD',
  manager: 'MG',
  admin: 'AD',
}

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

interface SidebarProps {
  /** Whether the sidebar overlay is open on mobile (<md). */
  mobileOpen?: boolean
  /** Called when the sidebar should close (mobile only). */
  onMobileClose?: () => void
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const location = useLocation()
  const actingRole = usePermissionsStore((s) => s.actingRole)

  // Auto-close on mobile when the route changes (user tapped a nav link)
  useEffect(() => {
    if (mobileOpen) onMobileClose?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])
  const setActingRole = usePermissionsStore((s) => s.setActingRole)
  const canRoleAccess = usePermissionsStore((s) => s.canRoleAccess)

  // Filter nav by current role
  const visibleGroups = NAV_GROUPS
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canRoleAccess(actingRole, item.path)),
    }))
    .filter((group) => group.items.length > 0)

  const dashboardVisible = canRoleAccess(actingRole, '/dashboard')

  return (
    <Tooltip.Provider>
      <aside
        className={[
          'flex flex-col h-screen bg-bg-sidebar shrink-0',
          // Mobile: fixed overlay that slides in/out
          'fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-200 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop (≥md): back to normal flow, always visible
          'md:sticky md:top-0 md:w-60 md:translate-x-0',
        ].join(' ')}
        aria-label="Main navigation"
      >
        {/* Logo zone — Section 4.1, 64px */}
        <div className="flex items-center gap-3 h-16 px-4 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/20 text-primary font-bold text-sm shrink-0">
            ℞
          </div>
          <div className="min-w-0">
            <p className="type-card-title text-white leading-tight truncate">PharmacyOS</p>
            <p className="type-tiny text-text-on-dark-dim leading-tight mt-px truncate">
              Built by NoDrftSystems
            </p>
          </div>
        </div>

        {/* Cmd+K search affordance */}
        <div className="px-3 pt-3 shrink-0">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Open command palette (Ctrl+K)"
            className="w-full flex items-center gap-2 h-9 px-3 rounded-control bg-bg-sidebar-hover hover:bg-white/10 text-text-on-dark-dim hover:text-text-on-dark transition-colors group"
          >
            <MagnifyingGlass size={14} aria-hidden="true" />
            <span className="type-body-sm flex-1 text-left">Search…</span>
            <kbd className="inline-flex items-center px-1.5 rounded type-tiny font-mono bg-black/30 text-text-on-dark-dim group-hover:text-text-on-dark border border-white/10">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4" aria-label="Primary">
          {/* Dashboard (top-level, no group) */}
          {dashboardVisible && (
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
          )}

          {/* Groups */}
          {visibleGroups.map((group) => (
            <div key={group.label}>
              <p className="type-caption text-text-on-dark-dim px-4 mb-1">{group.label}</p>
              <div className="flex flex-col gap-px">
                {group.items.map((item) => (
                  <NavItemRow key={item.path} item={item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User account zone — Section 4.1, 64px sticky bottom */}
        <div className="border-t border-white/10 shrink-0">
          {/* Acting-as role switcher — demo mode only (VITE_DEMO_MODE=true).
              Hidden in production; replaced by read-only role display from real session. */}
          {IS_DEMO_MODE && (
            <div className="px-4 py-2 border-b border-white/5 bg-bg-sidebar-hover/40">
              <label className="block">
                <span className="type-tiny text-text-on-dark-dim uppercase tracking-wider">Acting as (demo)</span>
                <div className="mt-1 relative">
                  <select
                    value={actingRole}
                    onChange={(e) => setActingRole(e.target.value as Role)}
                    aria-label="Switch acting role for demo-mode permissions preview"
                    className="w-full appearance-none h-8 pl-2 pr-7 type-body-sm bg-bg-sidebar text-white border border-white/10 rounded-control focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r} className="bg-bg-sidebar text-white">
                        {ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                  <CaretDown
                    size={12}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text-on-dark-dim pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </label>
            </div>
          )}

          {/* User identity row */}
          <div className="flex items-center gap-3 h-14 px-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-pill bg-primary/30 text-primary text-xs font-semibold shrink-0">
              {ROLE_INITIALS[actingRole]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="type-body-sm text-text-on-dark truncate">Demo User</p>
              <p className="type-label text-text-on-dark-dim truncate">{ROLE_LABELS[actingRole]}</p>
            </div>
            <Tooltip.Root delayDuration={400}>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  className="text-text-on-dark-dim hover:text-text-on-dark transition-colors"
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
        </div>
      </aside>
    </Tooltip.Provider>
  )
}
