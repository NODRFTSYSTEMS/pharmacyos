import { useQuery } from '@tanstack/react-query'
import {
  CurrencyDollar, Receipt, ClockCounterClockwise, Warning,
} from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'
import { todayJamaica, toJamaicaBounds, fmtJamaicaTime } from '../lib/date'
import { PageHeader, MetricCard, Pill as StatusPill } from '../components/Shell'
import { usePermission } from '../hooks/usePermission'
import { usePharmacyName } from '../hooks/usePharmacyName'
import type {
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

// ── Component ─────────────────────────────────────────────────────────────────

export function Dashboard() {
  // I-22: todayJamaica() uses America/Jamaica timezone — not UTC
  const today = todayJamaica()

  const pharmacyName = usePharmacyName()

  // I-21: Role-filtered dashboard sections
  const canViewReports = usePermission('reports_view')
  const canViewRx      = usePermission('rx_dispense')

  const retailQ       = useTodayRetail(today)
  const rxQ           = useTodayRx(today)
  const prescriptionsQ = usePendingPrescriptions()
  const lowStockQ     = useLowStockProducts()

  // Derived metrics
  const retailRevenue  = (retailQ.data ?? []).reduce((s, t) => s + t.total, 0)
  const rxRevenue      = (rxQ.data ?? []).reduce((s, t) => s + t.patient_copay, 0)
  const totalRevenue   = retailRevenue + rxRevenue
  const txnCount       = (retailQ.data ?? []).length + (rxQ.data ?? []).length
  const pendingRxCount = (prescriptionsQ.data ?? []).length
  const lowStockCount  = (lowStockQ.data ?? []).length

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
          <MetricCard
            label="Pending Prescriptions"
            value={String(pendingRxCount)}
            sub="Received, verifying, or ready"
            icon={ClockCounterClockwise}
            accent={pendingRxCount > 0 ? 'yellow' : 'blue'}
          />
          <MetricCard
            label="Low Stock Items"
            value={String(lowStockCount)}
            sub="At or below reorder level"
            icon={Warning}
            accent={lowStockCount > 0 ? 'red' : 'blue'}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <MetricCard
            label="Pending Prescriptions"
            value={String(pendingRxCount)}
            sub="Received, verifying, or ready"
            icon={ClockCounterClockwise}
            accent={pendingRxCount > 0 ? 'yellow' : 'blue'}
          />
          <MetricCard
            label="Low Stock Items"
            value={String(lowStockCount)}
            sub="At or below reorder level"
            icon={Warning}
            accent={lowStockCount > 0 ? 'red' : 'blue'}
          />
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
      <section aria-labelledby="rx-queue-heading">
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
                  <tr key={p.id} className="hover:bg-gray-50">
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
    </div>
  )
}

export default Dashboard
