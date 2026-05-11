import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import {
  House, Pill, ShoppingBag, Users, ChartBar, Robot,
  Gear, Files, List, X, SignOut, CaretRight,
} from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'

interface NavItem {
  label: string
  href?: string
  icon: React.ElementType
  children?: { label: string; href: string }[]
}

const NAV: NavItem[] = [
  { label: 'Dashboard',    href: '/dashboard',      icon: House },
  { label: 'Prescriptions', icon: Pill, children: [
    { label: 'Queue',         href: '/prescriptions' },
    { label: 'New Rx',        href: '/prescriptions/new' },
    { label: 'Schedule Log',  href: '/prescriptions/schedule-log' },
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
  { label: 'Reports',     icon: ChartBar, children: [
    { label: 'Revenue',       href: '/reports/revenue' },
    { label: 'Dispensing',    href: '/reports/dispensing' },
    { label: 'Inventory',     href: '/reports/inventory' },
  ]},
  { label: 'AI Queue',    href: '/ai/queue',  icon: Robot },
  { label: 'Admin',       icon: Gear, children: [
    { label: 'Users',         href: '/admin/users' },
    { label: 'Audit Log',     href: '/admin/audit' },
    { label: 'Settings',      href: '/admin/settings' },
  ]},
]

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
  const nav = useNavigate()

  async function handleSignOut() {
    await supabase.auth.signOut()
    nav('/login', { replace: true })
  }

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 bg-[#111827] flex flex-col overflow-y-auto">
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Files size={20} weight="duotone" className="text-blue-400" />
          <span className="text-white font-bold text-sm tracking-tight">PharmacyOS</span>
        </div>
        <p className="text-gray-500 text-xs mt-0.5">Winchester Global Pharmacy</p>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV.map(item =>
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

      <div className="px-2 py-3 border-t border-white/10">
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

interface AppShellProps { children: React.ReactNode }

export function AppShell({ children }: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
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

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded text-gray-500 hover:bg-gray-100"
            aria-label="Open navigation"
          >
            <List size={20} />
          </button>
          <span className="font-bold text-sm text-gray-800">PharmacyOS</span>
        </div>

        <main className="flex-1 p-6 max-w-screen-2xl">
          {children}
        </main>
      </div>
    </div>
  )
}

export function ClosableAlert({
  message, variant = 'yellow',
}: { message: string; variant?: 'yellow' | 'red' | 'green' | 'blue' }) {
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
      <button onClick={() => setOpen(false)} className="shrink-0"><X size={14} /></button>
    </div>
  )
}
