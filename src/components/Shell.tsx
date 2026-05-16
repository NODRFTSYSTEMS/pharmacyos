import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useLocation, useNavigate } from 'react-router'
import {
  House, Pill as PillIcon, ShoppingBag, Users, ChartBar, Robot,
  Gear, Files, List, X, SignOut, CaretRight, LockSimple,
  Warehouse, Clock,
} from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useAnyPermission, usePermission } from '../hooks/usePermission'
import { usePharmacyName } from '../hooks/usePharmacyName'
import { NAV_PERMISSIONS } from '../config/route-permissions'
import { GlobalSearch } from './GlobalSearch'
import { NotificationBell } from './NotificationBell'
import { StaffAvatar } from './StaffAvatar'
import { ConnectionStatus, OfflineBanner } from './ConnectionStatus'

interface NavItem {
  label: string
  href?: string
  icon: React.ElementType
  children?: { label: string; href: string }[]
}

// Full nav definition — filtered at render time by useAnyPermission
const NAV: NavItem[] = [
  { label: 'Dashboard',    href: '/dashboard',      icon: House },
  { label: 'Prescriptions', icon: PillIcon, children: [
    { label: 'Queue',              href: '/prescriptions' },
    { label: 'New Prescription',   href: '/prescriptions/new' },
    { label: 'Schedule Log',       href: '/prescriptions/schedule-log' },
  ]},
  { label: 'Retail POS', icon: ShoppingBag, children: [
    { label: 'Terminal',      href: '/pos' },
    { label: 'Transactions',  href: '/pos/transactions' },
    { label: 'Close Out',     href: '/pos/closeout' },
    { label: 'EOD Report',    href: '/pos/eod-report' },
    { label: 'Products',      href: '/pos/products' },
    { label: 'Suppliers',     href: '/pos/suppliers' },
    { label: 'Loyalty',       href: '/pos/loyalty' },
    { label: 'Reports',       href: '/pos/reports' },
  ]},
  { label: 'Patients',    icon: Users, children: [
    { label: 'Patient List',  href: '/patients' },
    { label: 'New Patient',   href: '/patients/new' },
  ]},
  { label: 'Inventory',   icon: Warehouse, children: [
    { label: 'Receive Stock',   href: '/inventory/receive-stock' },
    { label: 'Stock Movements', href: '/inventory/stock-movements' },
  ]},
  { label: 'Staff',       icon: Clock, children: [
    { label: 'My Timecard',   href: '/staff/timecard' },
    { label: 'Manage Timecards', href: '/staff/timecards' },
  ]},
  { label: 'Reports',     icon: ChartBar, children: [
    { label: 'Revenue',       href: '/reports/revenue' },
    { label: 'Dispensing',    href: '/reports/dispensing' },
    { label: 'Inventory',     href: '/reports/inventory' },
    { label: 'Timecards',     href: '/reports/timecards' },
  ]},
  { label: 'Document Review', href: '/ai/queue', icon: Robot },
  { label: 'Admin',       icon: Gear, children: [
    { label: 'Users',         href: '/admin/users' },
    { label: 'Audit Log',     href: '/admin/audit' },
    { label: 'Security',      href: '/admin/security' },
    { label: 'Settings',      href: '/admin/settings' },
  ]},
]

// ── Role-filtered nav hook ─────────────────────────────────────────────────────
// Dashboard always shows (session-only). All other groups are filtered by
// NAV_PERMISSIONS: a group is visible only if the user has ≥1 required permission.
// Child items within a group may also be filtered by individual permissions
// (e.g. "Manage Timecards" requires timecard_manage; "My Timecard" is session-only).
function useFilteredNav(): NavItem[] {
  const showPrescriptions   = useAnyPermission(NAV_PERMISSIONS['Prescriptions'])
  const showPOS             = useAnyPermission(NAV_PERMISSIONS['Retail POS'])
  const showPatients        = useAnyPermission(NAV_PERMISSIONS['Patients'])
  const showInventory       = useAnyPermission(NAV_PERMISSIONS['Inventory'])
  const showReports         = useAnyPermission(NAV_PERMISSIONS['Reports'])
  const showDocumentReview  = useAnyPermission(NAV_PERMISSIONS['AI Queue'])
  const showAdmin           = useAnyPermission(NAV_PERMISSIONS['Admin'])
  const canManageTimecards  = usePermission('timecard_manage')
  const canManageStaff      = usePermission('staff_manage')
  const canManageSettings   = usePermission('settings_manage')

  return NAV
    .filter(item => {
      if (item.label === 'Dashboard')       return true
      if (item.label === 'Prescriptions')   return showPrescriptions
      if (item.label === 'Retail POS')      return showPOS
      if (item.label === 'Patients')        return showPatients
      if (item.label === 'Inventory')       return showInventory
      if (item.label === 'Staff')           return true  // My Timecard is session-only; all staff see Staff group
      if (item.label === 'Reports')         return showReports
      if (item.label === 'Document Review') return showDocumentReview
      if (item.label === 'Admin')           return showAdmin
      return false
    })
    .map(item => {
      // Filter children that require specific permissions
      if (item.label === 'Staff' && item.children) {
        return {
          ...item,
          children: item.children.filter(c =>
            c.label !== 'Manage Timecards' || canManageTimecards
          ),
        }
      }
      // Admin child filtering: Users and Security require staff_manage;
      // Settings requires settings_manage. Audit Log is visible to all
      // admin-group members (audit_view is sufficient for group visibility).
      if (item.label === 'Admin' && item.children) {
        return {
          ...item,
          children: item.children.filter(c => {
            if (c.label === 'Users' || c.label === 'Security') return canManageStaff
            if (c.label === 'Settings') return canManageSettings
            return true  // Audit Log — visible to all with any Admin permission
          }),
        }
      }
      return item
    })
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const { pathname } = useLocation()
  const active = pathname === href
  return (
    <Link
      to={href}
      className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
        active
          ? 'bg-white/10 text-white font-medium'
          : 'text-gray-400 hover:bg-white/6 hover:text-white'
      }`}
    >
      {children}
    </Link>
  )
}

function NavGroup({ item }: { item: NavItem }) {
  const { pathname } = useLocation()
  const isOpen = item.children?.some(c => pathname.startsWith(c.href)) ?? false
  const [open, setOpen] = useState(isOpen)

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-gray-400 hover:bg-white/6 hover:text-white transition-colors"
      >
        <item.icon size={16} weight="duotone" />
        <span className="flex-1 text-left">{item.label}</span>
        <CaretRight
          size={12}
          className={`transition-transform ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open && (
        <div className="ml-6 mt-0.5 space-y-0.5">
          {item.children!.map(c => (
            <NavLink key={c.href} href={c.href}>
              {c.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const nav            = useNavigate()
  const filteredNav    = useFilteredNav()
  const { data: user } = useCurrentUser()
  const pharmacyName   = usePharmacyName()

  // I-20: display name fallback — never show raw email as a person's name
  const displayName = user?.name && user.name !== user?.email
    ? user.name
    : user?.email
      ? 'Staff Member'   // fallback when profile name is missing
      : '—'

  async function handleSignOut() {
    await supabase.auth.signOut()
    nav('/login', { replace: true })
  }

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 bg-[#111827] flex flex-col overflow-y-auto">
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Files size={20} weight="duotone" className="text-blue-400" />
          <span className="text-white font-bold text-sm tracking-tight flex-1">PharmacyOS</span>
          <ConnectionStatus compact />
          <NotificationBell />
        </div>
        <p className="text-gray-400 text-xs mt-0.5">{pharmacyName}</p>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5" aria-label="Main navigation">
        {filteredNav.map(item =>
          item.href ? (
            <NavLink key={item.href} href={item.href}>
              <item.icon size={16} weight="duotone" />
              {item.label}
            </NavLink>
          ) : (
            <NavGroup key={item.label} item={item} />
          )
        )}
      </nav>

      {/* User identity + sign out */}
      <div className="px-3 py-3 border-t border-white/10 space-y-1">
        {user && (
          <div className="flex items-center gap-2 px-1 py-1.5 mb-1">
            <StaffAvatar
              name={displayName}
              email={user.email}
              role={user.role}
              avatarUrl={user.avatarUrl}
              avatarAlt={user.avatarAlt}
              size="sm"
            />
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-300 truncate">{displayName}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">{user.role}</p>
            </div>
          </div>
        )}
        {/* I-09: Security / MFA setup — available to all authenticated staff */}
        <NavLink href="/profile/security">
          <LockSimple size={16} />
          Security
        </NavLink>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-gray-400 hover:bg-white/6 hover:text-white transition-colors"
        >
          <SignOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  cta?: React.ReactNode
  breadcrumb?: string[]
}

export function PageHeader({ title, subtitle, cta, breadcrumb }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        {breadcrumb && (
          <p className="text-xs text-gray-400 mb-1">{breadcrumb.join(' › ')}</p>
        )}
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {cta && <div className="shrink-0">{cta}</div>}
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: string
  sub?: string
  trend?: number
  icon?: React.ElementType
  accent?: 'blue' | 'green' | 'yellow' | 'red'
}

export function MetricCard({ label, value, sub, trend, icon: Icon, accent = 'blue' }: MetricCardProps) {
  const accentMap = {
    blue:   'bg-blue-50 text-blue-600',
    green:  'bg-emerald-50 text-emerald-600',
    yellow: 'bg-amber-50 text-amber-600',
    red:    'bg-red-50 text-red-600',
  }
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</p>
          <p className="num-lg">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
          {trend !== undefined && (
            <p className={`text-xs mt-1 font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend >= 0 ? '+' : ''}{trend.toFixed(1)}% vs yesterday
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${accentMap[accent]}`}>
            <Icon size={18} weight="duotone" />
          </div>
        )}
      </div>
    </div>
  )
}

interface PillProps {
  label: string
  variant: 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'purple'
}

export function Pill({ label, variant }: PillProps) {
  return <span className={`pill pill-${variant}`}>{label}</span>
}

// ── EmptyRow ───────────────────────────────────────────────────────────────────
// Standard empty-state row for data tables. Prevents blank-table ambiguity.
// Usage: <EmptyRow colSpan={6} message="No transactions found for this period." />
interface EmptyRowProps {
  colSpan: number
  message?: string
}

export function EmptyRow({ colSpan, message = 'No records found.' }: EmptyRowProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-10 text-center text-sm text-gray-400"
      >
        {message}
      </td>
    </tr>
  )
}

interface AppShellProps { children: React.ReactNode }

export function AppShell({ children }: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      {/* WCAG 2.4.1 — skip link allows keyboard users to bypass sidebar nav */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-semibold focus:text-blue-700 focus:outline focus:outline-2 focus:outline-blue-700"
      >
        Skip to main content
      </a>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-60 shrink-0"><Sidebar /></div>
          <button
            className="flex-1 bg-black/50"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close navigation"
          />
        </div>
      )}

      {/* Main content — fills remaining height, scrolls internally */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded text-gray-500 hover:bg-gray-100"
            aria-label="Open navigation"
          >
            <List size={20} />
          </button>
          <span className="font-bold text-sm text-gray-800">PharmacyOS</span>
        </div>

        <main id="main-content" className="flex-1 overflow-y-auto p-6">
          <OfflineBanner />
          {children}
        </main>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}

export function ClosableAlert({
  message, variant = 'yellow',
}: { message: React.ReactNode; variant?: 'yellow' | 'red' | 'green' | 'blue' }) {
  const [open, setOpen] = useState(true)
  if (!open) return null
  const map = {
    yellow: 'bg-amber-50 border-amber-200 text-amber-800',
    red:    'bg-red-50 border-red-200 text-red-800',
    green:  'bg-emerald-50 border-emerald-200 text-emerald-800',
    blue:   'bg-blue-50 border-blue-200 text-blue-800',
  }
  return (
    <div className={`flex items-center justify-between gap-3 border rounded px-3 py-2.5 text-sm mb-4 ${map[variant]}`}>
      <span>{message}</span>
      <button onClick={() => setOpen(false)} aria-label="Dismiss alert" className="shrink-0"><X size={14} /></button>
    </div>
  )
}

// ── PrintHeader ───────────────────────────────────────────────────────────────
// Rendered only in print media. Shows pharmacy identity, OIC registration,
// report title, period, and generator on every printed report page.
// Wrap report pages with this component above the report content.
//
// Usage:
//   <PrintHeader
//     reportTitle="Revenue Report"
//     period="2026-05-01 to 2026-05-13"
//     generatedBy="Marcus Thompson — PHARMACIST"
//   />

interface PrintHeaderProps {
  reportTitle:  string
  period?:      string
  generatedBy?: string
}

export function PrintHeader({ reportTitle, period, generatedBy }: PrintHeaderProps) {
  const pharmacyName = usePharmacyName()
  const { data: currentUser } = useCurrentUser()
  const { data: pharmacyAddress } = useQuery({
    queryKey: ['pharmacy-address'],
    queryFn: async () => {
      const { data } = await supabase.from('pharmacy_settings').select('value').eq('key', 'pharmacy_address').maybeSingle()
      return data?.value ?? null
    },
    staleTime: 300_000,
    retry: false,
  })
  const { data: oicRegNo } = useQuery({
    queryKey: ['pharmacy-oic-reg-no'],
    queryFn: async () => {
      const { data } = await supabase.from('pharmacy_settings').select('value').eq('key', 'oic_reg_no').maybeSingle()
      return data?.value ?? null
    },
    staleTime: 300_000,
    retry: false,
  })
  const now = new Date().toLocaleString('en-JM', { timeZone: 'America/Jamaica' })
  const generatedByText = generatedBy
    ?? (currentUser ? `${currentUser.name} - ${currentUser.role}` : undefined)

  return (
    <div className="print-only mb-6 pb-4 border-b border-gray-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-bold text-base text-gray-900">{pharmacyName}</p>
          {pharmacyAddress && <p className="text-xs text-gray-600">{pharmacyAddress}</p>}
          {oicRegNo && <p className="text-xs text-gray-500 mt-0.5">OIC Registration: {oicRegNo}</p>}
        </div>
        <div className="text-right">
          <p className="font-semibold text-sm text-gray-800">{reportTitle}</p>
          {period && <p className="text-xs text-gray-500">Period: {period}</p>}
          <p className="text-xs text-gray-400">Generated: {now}</p>
          {generatedByText && <p className="text-xs text-gray-400">By: {generatedByText}</p>}
          <p className="text-xs text-gray-400">Format: PharmacyOS standard report</p>
        </div>
      </div>
    </div>
  )
}
