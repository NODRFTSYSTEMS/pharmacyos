import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import {
  CurrencyDollar, Receipt, ClockCounterClockwise, Warning,
  ShoppingBag, Robot, Clock, ArrowRight, Warehouse,
  Megaphone, Sun, Moon, ShieldCheck,
} from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'
import { todayJamaica, toJamaicaBounds, fmtJamaicaTime } from '../lib/date'
import { PageHeader, MetricCard, Pill as StatusPill, ClosableAlert } from '../components/Shell'
import { ConnectionStatus } from '../components/ConnectionStatus'
import { StaffAvatar } from '../components/StaffAvatar'
import { usePermission } from '../hooks/usePermission'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { usePharmacyName } from '../hooks/usePharmacyName'
import { useThemeMode } from '../hooks/useThemeMode'
import type {
  DailyInconsistencyReport,
  DashboardUpdate,
  RetailTransaction,
  RxTransaction,
  Prescription,
  Product,
  PrescriptionStatus,
} from '../types/database'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat('en-JM', {
    style: 'currency',
    currency: 'JMD',
    minimumFractionDigits: 2,
  }).format(n)
}


// ── Types ─────────────────────────────────────────────────────────────────────

type RecentTxn = {
  id: string
  ref_number: string
  _type: 'RETAIL' | 'RX'
  description: string
  amount: number
  created_at: string
}

const RX_PILL_MAP: Record<PrescriptionStatus, 'blue' | 'yellow' | 'green' | 'gray' | 'red'> = {
  RECEIVED:   'blue',
  VERIFYING:  'yellow',
  READY:      'green',
  DISPENSED:  'gray',
  CANCELLED:  'red',
}

const UPDATE_PILL_MAP: Record<DashboardUpdate['category'], 'blue' | 'yellow' | 'green' | 'red'> = {
  NEWS: 'blue',
  MESSAGE: 'green',
  UPDATE: 'yellow',
  ALERT: 'red',
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useTodayRetail(today: string) {
  return useQuery({
    queryKey: ['dashboard-retail', today],
    queryFn: async () => {
      // I-22: Use Jamaica-aware bounds (UTC-5) to avoid midnight off-by-one errors
      const bounds = toJamaicaBounds(today, today)
      const { data, error } = await supabase
        .from('retail_transactions')
        .select('*')
        .gte('created_at', bounds.gte)
        .lte('created_at', bounds.lte)
        .eq('voided', false)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as RetailTransaction[]
    },
    refetchInterval: 30_000,
  })
}

function useTodayRx(today: string) {
  return useQuery({
    queryKey: ['dashboard-rx', today],
    queryFn: async () => {
      // I-22: Use Jamaica-aware bounds (UTC-5) to avoid midnight off-by-one errors
      const bounds = toJamaicaBounds(today, today)
      const { data, error } = await supabase
        .from('rx_transactions')
        .select('*')
        .gte('created_at', bounds.gte)
        .lte('created_at', bounds.lte)
        .eq('voided', false)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as RxTransaction[]
    },
    refetchInterval: 30_000,
  })
}

function usePendingPrescriptions() {
  return useQuery({
    queryKey: ['dashboard-pending-rx'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .in('status', ['RECEIVED', 'VERIFYING', 'READY'])
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as Prescription[]
    },
    refetchInterval: 30_000,
  })
}

// Supabase JS client cannot do column-vs-column comparisons without RPC,
// so we fetch all active products and filter stock_qty <= reorder_level client-side.
function useLowStockProducts() {
  return useQuery({
    queryKey: ['dashboard-low-stock'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, stock_qty, reorder_level')
        .eq('is_active', true)
      if (error) throw error
      const rows = (data ?? []) as Pick<Product, 'id' | 'name' | 'stock_qty' | 'reorder_level'>[]
      return rows.filter(p => p.stock_qty <= p.reorder_level)
    },
    refetchInterval: 60_000,
  })
}

function useExpiringSoonCount() {
  return useQuery({
    queryKey: ['dashboard-expiring-soon'],
    queryFn: async () => {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() + 30)
      const { data, error } = await supabase
        .from('products')
        .select('id')
        .eq('is_active', true)
        .not('expiry_date', 'is', null)
        .lte('expiry_date', cutoff.toISOString().slice(0, 10))
      if (error) throw error
      return (data ?? []).length
    },
    refetchInterval: 300_000, // 5 min — expiry dates don't change often
  })
}

function useAIQueuePendingCount() {
  return useQuery({
    queryKey: ['dashboard-ai-queue-pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('extraction_queue')
        .select('id', { count: 'exact', head: true })
        .in('extraction_status', ['PENDING', 'REVIEW_REQUIRED'])
      if (error) throw error
      return (data as unknown as null | { count: number })?.count ?? 0
    },
    refetchInterval: 30_000,
  })
}

interface ReorderRecommendation {
  product_id: string
  product_name: string
  category: string
  stock_qty: number
  reorder_level: number
  avg_daily_sales: number
  days_to_stockout: number | null
  urgency: 'OUT_OF_STOCK' | 'CRITICAL' | 'LOW'
}

function useReorderRecommendations(enabled: boolean) {
  return useQuery<ReorderRecommendation[]>({
    queryKey: ['dashboard-reorder'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_reorder_recommendations')
      if (error) throw error
      return (data ?? []) as ReorderRecommendation[]
    },
    enabled,
    refetchInterval: 120_000, // 2 min — reorder state changes slowly
  })
}

function useTodayClockIn(userId: string | undefined) {
  const today = todayJamaica()
  return useQuery({
    queryKey: ['dashboard-clockin', userId, today],
    queryFn: async () => {
      if (!userId) return null
      const bounds = toJamaicaBounds(today, today)
      const { data } = await supabase
        .from('timecards')
        .select('clocked_in_at, clocked_out_at')
        .eq('staff_id', userId)
        .gte('created_at', bounds.gte)
        .lte('created_at', bounds.lte)
        .order('clocked_in_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      return data
    },
    enabled: !!userId,
    refetchInterval: 60_000,
  })
}

function useDashboardUpdates() {
  return useQuery<DashboardUpdate[]>({
    queryKey: ['dashboard-updates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dashboard_updates')
        .select('*')
        .eq('is_active', true)
        .lte('starts_at', new Date().toISOString())
        .or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`)
        .order('priority', { ascending: true })
        .order('starts_at', { ascending: false })
        .limit(8)
      if (error) throw error
      return (data ?? []) as DashboardUpdate[]
    },
    refetchInterval: 120_000,
  })
}

function useLatestInconsistencyReport(enabled: boolean) {
  return useQuery<DailyInconsistencyReport | null>({
    queryKey: ['latest-daily-inconsistency-report'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_inconsistency_reports')
        .select('*')
        .order('generated_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      return (data ?? null) as DailyInconsistencyReport | null
    },
    enabled,
    refetchInterval: 300_000,
  })
}

function getFinding(report: DailyInconsistencyReport | null | undefined, key: string): number {
  if (!report || !report.findings || typeof report.findings !== 'object' || Array.isArray(report.findings)) {
    return 0
  }
  const value = (report.findings as Record<string, unknown>)[key]
  return typeof value === 'number' ? value : Number(value ?? 0)
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Dashboard() {
  // I-22: todayJamaica() uses America/Jamaica timezone — not UTC
  const today    = todayJamaica()
  const navigate = useNavigate()

  const pharmacyName   = usePharmacyName()
  const { data: user } = useCurrentUser()
  const { theme, toggleTheme } = useThemeMode()

  // I-21: Role-filtered dashboard sections
  const canViewReports      = usePermission('reports_view')
  const canViewRx           = usePermission('rx_dispense')
  const canUsePOS           = usePermission('pos_terminal')
  const canViewAIQueue      = usePermission('ai_queue')
  const canManageInventory  = usePermission('inventory_manage')

  const retailQ        = useTodayRetail(today)
  const rxQ            = useTodayRx(today)
  const prescriptionsQ = usePendingPrescriptions()
  const lowStockQ      = useLowStockProducts()
  const expiringQ      = useExpiringSoonCount()
  const aiQueueQ       = useAIQueuePendingCount()
  const clockInQ       = useTodayClockIn(user?.id)
  const reorderQ       = useReorderRecommendations(canManageInventory)
  const updatesQ       = useDashboardUpdates()
  const dailyReportQ   = useLatestInconsistencyReport(canViewReports)

  const isCashier      = user?.role === 'CASHIER'
  const isPharmacist   = user?.role === 'PHARMACIST'
  const isClockedIn    = clockInQ.data !== null && !clockInQ.data?.clocked_out_at

  // Derived metrics
  const retailRevenue  = (retailQ.data ?? []).reduce((s, t) => s + t.total, 0)
  const rxRevenue      = (rxQ.data ?? []).reduce((s, t) => s + t.patient_copay, 0)
  const totalRevenue   = retailRevenue + rxRevenue
  const txnCount       = (retailQ.data ?? []).length + (rxQ.data ?? []).length
  const pendingRxCount = (prescriptionsQ.data ?? []).length
  const lowStockCount  = (lowStockQ.data ?? []).length
  const latestReport   = dailyReportQ.data ?? null

  // Recent transactions — last 5 combined, sorted newest first
  const recentTxns: RecentTxn[] = [
    ...(retailQ.data ?? []).map(t => ({
      id: t.id,
      ref_number: t.ref_number,
      _type: 'RETAIL' as const,
      description: 'Retail sale',
      amount: t.total,
      created_at: t.created_at,
    })),
    ...(rxQ.data ?? []).map(t => ({
      id: t.id,
      ref_number: t.ref_number,
      _type: 'RX' as const,
      description: `${t.drug_name} — ${t.patient_name}`,
      amount: t.patient_copay,
      created_at: t.created_at,
    })),
  ]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5)

  // Prescription queue — RECEIVED + VERIFYING only, max 5
  const rxQueue = (prescriptionsQ.data ?? [])
    .filter(p => p.status === 'RECEIVED' || p.status === 'VERIFYING')
    .slice(0, 5)

  const isLoadingTxns = retailQ.isLoading || rxQ.isLoading

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`${pharmacyName} — today's overview`}
        breadcrumb={['Dashboard']}
      />

      <div className="mb-6 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_auto] gap-4">
        <section className="card p-4 flex flex-wrap items-center gap-4" aria-label="Current user and system status">
          <StaffAvatar
            name={user?.name}
            email={user?.email}
            role={user?.role}
            avatarUrl={user?.avatarUrl}
            avatarAlt={user?.avatarAlt}
            size="lg"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Signed in user</p>
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {user?.name ?? 'Staff Member'}
            </h2>
            <p className="text-sm text-gray-500 truncate">
              {user?.role ?? 'SESSION'} {user?.email ? `- ${user.email}` : ''}
            </p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <ConnectionStatus />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
              <ShieldCheck size={13} weight="duotone" aria-hidden="true" />
              RBAC active
            </span>
          </div>
        </section>

        <section className="card p-4 flex items-center justify-between gap-4" aria-label="Dashboard display mode">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dashboard theme</p>
            <p className="text-sm text-gray-700">
              {theme === 'dark' ? 'Dark mode' : 'Light mode'}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost gap-2"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </section>
      </div>

      {(updatesQ.data?.length ?? 0) > 0 && (
        <section className="mb-6" aria-labelledby="company-updates-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="company-updates-heading" className="section-title flex items-center gap-2">
              <Megaphone size={16} weight="duotone" aria-hidden="true" />
              Company Updates
            </h2>
            <span className="text-xs text-gray-400">
              Admin configured
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {(updatesQ.data ?? []).map(update => (
              <article key={update.id} className="card p-4">
                <div className="mb-2 flex items-center gap-2">
                  <StatusPill label={update.category} variant={UPDATE_PILL_MAP[update.category]} />
                  {update.audience_role && (
                    <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                      {update.audience_role}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{update.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{update.body}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {canViewReports && latestReport && (
        <section className="card p-4 mb-6" aria-labelledby="daily-inconsistency-heading">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="daily-inconsistency-heading" className="section-title mb-1">
                Daily Inconsistency Report
              </h2>
              <p className="text-sm text-gray-500">
                {latestReport.report_date} - {latestReport.total_findings} finding{latestReport.total_findings === 1 ? '' : 's'} recorded
              </p>
            </div>
            <StatusPill
              label={latestReport.status}
              variant={latestReport.total_findings > 0 ? 'yellow' : 'green'}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 text-sm">
            {[
              ['EOD unresolved', 'open_or_unresolved_eod_closeouts'],
              ['Cash variance', 'cash_variance_closeouts'],
              ['Timecard flags', 'flagged_timecards'],
              ['Low stock', 'low_stock_products'],
              ['AI review', 'pending_ai_review_items'],
              ['Access denials', 'access_denials'],
            ].map(([label, key]) => (
              <div key={key} className="rounded border border-gray-200 bg-gray-50 px-3 py-2">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="num-lg text-gray-900">{getFinding(latestReport, key)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Expiry alert — dismissable, shown only when products are expiring within 30 days */}
      {(expiringQ.data ?? 0) > 0 && (
        <ClosableAlert
          variant="yellow"
          message={
            <>{expiringQ.data} product{expiringQ.data !== 1 ? 's' : ''} expiring within 30 days.{' '}
              <Link to="/reports/inventory" className="underline font-medium hover:opacity-75">
                Review the Inventory Report → Expiring Soon tab.
              </Link>
            </>
          }
        />
      )}

      {/* ── Role-specific quick action panel ──────────────────────────────── */}
      {isCashier && (
        <div className="card p-4 mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
            <Clock size={16} className={isClockedIn ? 'text-emerald-500' : 'text-gray-400'} />
            {isClockedIn
              ? <span className="text-emerald-700">Clocked in</span>
              : <span className="text-amber-600">Not clocked in today</span>
            }
          </div>
          <Link to="/staff/timecard" className="btn btn-ghost text-xs h-8 px-3">
            {isClockedIn ? 'View My Timecard' : 'Clock In'}
            <ArrowRight size={12} />
          </Link>
          {canUsePOS && (
            <Link to="/pos" className="btn btn-primary text-xs h-8 px-3 gap-1.5 ml-auto">
              <ShoppingBag size={14} />
              Open POS Terminal
            </Link>
          )}
        </div>
      )}

      {/* AI Queue alert for pharmacists/technicians with pending documents */}
      {canViewAIQueue && (aiQueueQ.data ?? 0) > 0 && !isCashier && (
        <ClosableAlert
          variant="blue"
          message={
            <>{aiQueueQ.data} document{(aiQueueQ.data ?? 0) !== 1 ? 's' : ''} in the extraction queue need{(aiQueueQ.data ?? 0) === 1 ? 's' : ''} review.{' '}
              <Link to="/ai/queue" className="underline font-medium hover:opacity-75">
                Go to Document Review →
              </Link>
            </>
          }
        />
      )}

      {/* ── Metric cards ───────────────────────────────────────────────────── */}
      {/* I-21: Revenue metrics visible to roles with reports_view; others see operational metrics */}
      {canViewReports ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Today's Revenue"
            value={fmtCurrency(totalRevenue)}
            sub={`Retail ${fmtCurrency(retailRevenue)} + Rx ${fmtCurrency(rxRevenue)}`}
            icon={CurrencyDollar}
            accent="green"
          />
          <MetricCard
            label="Transactions Today"
            value={String(txnCount)}
            sub={`${(retailQ.data ?? []).length} retail · ${(rxQ.data ?? []).length} Rx`}
            icon={Receipt}
            accent="blue"
          />
          <Link to="/prescriptions" className="block">
            <MetricCard
              label="Pending Prescriptions"
              value={String(pendingRxCount)}
              sub="Received, verifying, or ready"
              icon={ClockCounterClockwise}
              accent={pendingRxCount > 0 ? 'yellow' : 'blue'}
            />
          </Link>
          <Link to="/reports/inventory" className="block">
            <MetricCard
              label="Low Stock Items"
              value={String(lowStockCount)}
              sub="At or below reorder level"
              icon={Warning}
              accent={lowStockCount > 0 ? 'red' : 'blue'}
            />
          </Link>
        </div>
      ) : (
        <div className={`grid gap-4 mb-8 ${canViewAIQueue ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2'}`}>
          {canViewRx && (
            <Link to="/prescriptions" className="block">
              <MetricCard
                label="Prescriptions Awaiting Action"
                value={String(pendingRxCount)}
                sub="Received, verifying, or ready"
                icon={ClockCounterClockwise}
                accent={pendingRxCount > 0 ? 'yellow' : 'blue'}
              />
            </Link>
          )}
          {canViewAIQueue && (
            <Link to="/ai/queue" className="block">
              <MetricCard
                label="Documents for Review"
                value={String(aiQueueQ.data ?? 0)}
                sub="Pending extraction or review"
                icon={Robot}
                accent={(aiQueueQ.data ?? 0) > 0 ? 'yellow' : 'blue'}
              />
            </Link>
          )}
          {isPharmacist || !canViewRx ? (
            <Link to="/reports/inventory" className="block">
              <MetricCard
                label="Items Below Reorder Level"
                value={String(lowStockCount)}
                sub="At or below reorder level"
                icon={Warning}
                accent={lowStockCount > 0 ? 'red' : 'blue'}
              />
            </Link>
          ) : null}
          {isCashier && canUsePOS && (
            <Link to="/pos" className="block">
              <MetricCard
                label="Today's Transactions"
                value={String((retailQ.data ?? []).length)}
                sub="Retail sales today"
                icon={Receipt}
                accent="blue"
              />
            </Link>
          )}
        </div>
      )}

      {/* ── Recent Transactions — reports_view roles only ──────────────────── */}
      {canViewReports && (
      <section className="mb-8" aria-labelledby="recent-txns-heading">
        <h2 id="recent-txns-heading" className="section-title mb-3">
          Recent Transactions
        </h2>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-compact text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ref</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoadingTxns && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                      Loading transactions…
                    </td>
                  </tr>
                )}
                {!isLoadingTxns && recentTxns.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                      No transactions recorded today.
                    </td>
                  </tr>
                )}
                {recentTxns.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 font-mono text-xs text-gray-700">{t.ref_number}</td>
                    <td className="px-4">
                      <StatusPill
                        label={t._type}
                        variant={t._type === 'RX' ? 'purple' : 'blue'}
                      />
                    </td>
                    <td className="px-4 text-xs text-gray-700 max-w-56 truncate">{t.description}</td>
                    <td className="px-4 text-right font-mono text-xs font-medium text-gray-800">
                      {fmtCurrency(t.amount)}
                    </td>
                    <td className="px-4 font-mono text-xs text-gray-500">{fmtJamaicaTime(t.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      )}

      {/* ── Prescription Queue — rx_dispense roles only ────────────────────── */}
      {canViewRx && (
      <section aria-labelledby="rx-queue-heading" className="mb-8">
        <h2 id="rx-queue-heading" className="section-title mb-3">
          Prescription Queue
        </h2>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-compact text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ref</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Drug</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {prescriptionsQ.isLoading && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                      Loading queue…
                    </td>
                  </tr>
                )}
                {!prescriptionsQ.isLoading && rxQueue.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                      No prescriptions awaiting attention.
                    </td>
                  </tr>
                )}
                {rxQueue.map(p => (
                  <tr
                    key={p.id}
                    className="hover:bg-blue-50 cursor-pointer"
                    onClick={() => navigate(`/prescriptions/${p.id}`)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/prescriptions/${p.id}`) }}
                    tabIndex={0}
                    title="Open prescription"
                  >
                    <td className="px-4 font-mono text-xs text-gray-700">{p.ref_number}</td>
                    <td className="px-4 text-xs text-gray-700">{p.drug_name}</td>
                    <td className="px-4 text-xs text-gray-700">{p.patient_name}</td>
                    <td className="px-4">
                      <StatusPill
                        label={p.status}
                        variant={RX_PILL_MAP[p.status]}
                      />
                    </td>
                    <td className="px-4 font-mono text-xs text-gray-500">{fmtJamaicaTime(p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      )}

      {/* ── Reorder Recommendations — inventory_manage roles only ──────────── */}
      {canManageInventory && (reorderQ.data?.length ?? 0) > 0 && (
      <section aria-labelledby="reorder-heading">
        <div className="flex items-center justify-between mb-3">
          <h2 id="reorder-heading" className="section-title">
            Reorder Recommendations
          </h2>
          <Link
            to="/inventory/receive-stock"
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Receive Stock →
          </Link>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-compact text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Urgency</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">On Hand</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reorder At</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Days Left</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Daily Velocity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reorderQ.isLoading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                      Computing recommendations…
                    </td>
                  </tr>
                )}
                {(reorderQ.data ?? []).slice(0, 10).map(r => (
                  <tr key={r.product_id} className="hover:bg-gray-50">
                    <td className="px-4">
                      <div className="text-xs font-medium text-gray-800">{r.product_name}</div>
                      <div className="text-xs text-gray-400">{r.category}</div>
                    </td>
                    <td className="px-4">
                      {r.urgency === 'OUT_OF_STOCK' && (
                        <StatusPill variant="red" label="Out of Stock" />
                      )}
                      {r.urgency === 'CRITICAL' && (
                        <StatusPill variant="yellow" label="Critical" />
                      )}
                      {r.urgency === 'LOW' && (
                        <StatusPill variant="blue" label="Low" />
                      )}
                    </td>
                    <td className="px-4 text-right font-mono text-xs text-gray-700">{r.stock_qty}</td>
                    <td className="px-4 text-right font-mono text-xs text-gray-500">{r.reorder_level}</td>
                    <td className="px-4 text-right font-mono text-xs">
                      {r.days_to_stockout !== null
                        ? <span className={r.days_to_stockout <= 3 ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                            {r.days_to_stockout}d
                          </span>
                        : <span className="text-gray-400">—</span>
                      }
                    </td>
                    <td className="px-4 text-right font-mono text-xs text-gray-500">
                      {r.avg_daily_sales > 0
                        ? `${Number(r.avg_daily_sales).toFixed(1)}/day`
                        : '—'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(reorderQ.data?.length ?? 0) > 10 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
              <Warehouse size={14} className="text-gray-400" />
              Showing top 10 of {reorderQ.data?.length} items needing reorder.{' '}
              <Link to="/reports/inventory" className="text-indigo-600 hover:text-indigo-800 font-medium">
                View full inventory report →
              </Link>
            </div>
          )}
        </div>
      </section>
      )}
    </div>
  )
}

export default Dashboard
