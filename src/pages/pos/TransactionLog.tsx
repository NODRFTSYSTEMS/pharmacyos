import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  MagnifyingGlass, ArrowClockwise, Export, Receipt,
  Pill, Warning, CheckCircle,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { toJamaicaBounds, todayJamaica } from '../../lib/date'
import { PageHeader, Pill as StatusPill, MetricCard } from '../../components/Shell'
import type { RetailTransaction, RxTransaction, PaymentMethod } from '../../types/database'

type AnyTxn = (RetailTransaction | RxTransaction) & { _type: 'RETAIL' | 'RX' }

const PAY_LABEL: Record<PaymentMethod, string> = {
  CASH: 'Cash', CARD: 'Card', LYNK: 'Lynk', NHF: 'NHF', MIXED: 'Mixed',
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-JM', { style: 'currency', currency: 'JMD', minimumFractionDigits: 2 }).format(n)
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-JM', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-JM', { year: 'numeric', month: 'short', day: 'numeric' })
}

function useTodayTransactions(date: string) {
  // I-22: Jamaica-aware bounds (UTC-5, no DST)
  const bounds = toJamaicaBounds(date, date)

  const retail = useQuery({
    queryKey: ['retail-txns', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('retail_transactions')
        .select('*')
        .gte('created_at', bounds.gte)
        .lte('created_at', bounds.lte)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as RetailTransaction[]
    },
    refetchInterval: 30_000,
  })

  const rx = useQuery({
    queryKey: ['rx-txns', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rx_transactions')
        .select('*')
        .gte('created_at', bounds.gte)
        .lte('created_at', bounds.lte)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as RxTransaction[]
    },
    refetchInterval: 30_000,
  })

  return { retail, rx }
}

export default function TransactionLog() {
  // I-22: Use Jamaica timezone for default date
  const today = todayJamaica()
  const [date, setDate] = useState(today)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'ALL' | 'RETAIL' | 'RX' | 'VOID'>('ALL')

  const { retail, rx } = useTodayTransactions(date)

  const isLoading = retail.isLoading || rx.isLoading
  const isError   = retail.isError   || rx.isError

  const combined: AnyTxn[] = [
    ...(retail.data ?? []).map(t => ({ ...t, _type: 'RETAIL' as const })),
    ...(rx.data ?? []).map(t => ({ ...t, _type: 'RX' as const })),
  ].sort((a, b) => b.created_at.localeCompare(a.created_at))

  const filtered = combined.filter(t => {
    if (filter === 'RETAIL' && t._type !== 'RETAIL') return false
    if (filter === 'RX'     && t._type !== 'RX')     return false
    if (filter === 'VOID'   && !t.voided)             return false
    if (search) {
      const q = search.toLowerCase()
      const name = t._type === 'RX'
        ? (t as RxTransaction).patient_name
        : ''
      return t.ref_number.toLowerCase().includes(q) || name.toLowerCase().includes(q)
    }
    return true
  })

  const totalRetail = (retail.data ?? []).filter(t => !t.voided).reduce((s, t) => s + t.total, 0)
  const totalRx     = (rx.data ?? []).filter(t => !t.voided).reduce((s, t) => s + t.patient_copay, 0)
  const voidCount   = combined.filter(t => t.voided).length

  function exportCsv() {
    const rows = [
      ['Ref', 'Type', 'Time', 'Description', 'Payment', 'Total', 'Void'],
      ...filtered.map(t => [
        t.ref_number,
        t._type,
        fmtTime(t.created_at),
        t._type === 'RX' ? `${(t as RxTransaction).drug_name} — ${(t as RxTransaction).patient_name}` : t._type,
        t.payment_method ?? '',
        t._type === 'RX' ? String((t as RxTransaction).patient_copay) : String((t as RetailTransaction).total),
        t.voided ? 'YES' : 'NO',
      ]),
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a'); a.href = url
    a.download = `transactions-${date}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader
        title="Transaction Log"
        subtitle="Real-time record of all retail and Rx transactions"
        breadcrumb={['Retail POS', 'Transactions']}
        cta={
          <div className="flex gap-2">
            <button
              onClick={() => { retail.refetch(); rx.refetch() }}
              className="btn btn-ghost gap-1.5"
              title="Refresh"
            >
              <ArrowClockwise size={14} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button onClick={exportCsv} className="btn btn-ghost gap-1.5">
              <Export size={14} />
              Export CSV
            </button>
          </div>
        }
      />

      {/* Metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Retail Sales"
          value={fmtCurrency(totalRetail)}
          sub={`${(retail.data ?? []).filter(t => !t.voided).length} transactions`}
          icon={Receipt}
          accent="blue"
        />
        <MetricCard
          label="Rx Collections"
          value={fmtCurrency(totalRx)}
          sub={`${(rx.data ?? []).filter(t => !t.voided).length} dispensings`}
          icon={Pill}
          accent="green"
        />
        <MetricCard
          label="Combined Total"
          value={fmtCurrency(totalRetail + totalRx)}
          sub="excl. NHF subsidy"
          icon={CheckCircle}
          accent="blue"
        />
        <MetricCard
          label="Voided"
          value={String(voidCount)}
          sub="requires manager review"
          icon={Warning}
          accent={voidCount > 0 ? 'red' : 'gray' as 'red'}
        />
      </div>

      {/* Filters */}
      <div className="card p-3 mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <MagnifyingGlass size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search ref or patient…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-7 w-56 text-xs"
          />
        </div>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="input w-36 text-xs"
        />
        <div className="flex gap-1">
          {(['ALL', 'RETAIL', 'RX', 'VOID'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-ghost text-xs h-8 px-3 ${filter === f ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} records — {fmtDate(date)}</span>
      </div>

      {/* Table */}
      {isError && (
        <div className="card p-4 text-sm text-red-600 bg-red-50">
          Failed to load transactions. Check your connection and try again.
        </div>
      )}

      {!isError && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-compact text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ref</th>
                  <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="text-right px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                      Loading transactions…
                    </td>
                  </tr>
                )}
                {!isLoading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                      No transactions found for this date and filter.
                    </td>
                  </tr>
                )}
                {filtered.map(t => {
                  const isRx = t._type === 'RX'
                  const amount = isRx
                    ? (t as RxTransaction).patient_copay
                    : (t as RetailTransaction).total
                  const desc = isRx
                    ? `${(t as RxTransaction).drug_name} — ${(t as RxTransaction).patient_name}`
                    : `Retail sale`

                  return (
                    <tr key={t.id} className={`hover:bg-gray-50 ${t.voided ? 'opacity-50' : ''}`}>
                      <td className="px-4 font-mono text-xs text-gray-700">{t.ref_number}</td>
                      <td className="px-4">
                        <StatusPill
                          label={isRx ? 'Rx' : 'Retail'}
                          variant={isRx ? 'purple' : 'blue'}
                        />
                      </td>
                      <td className="px-4 font-mono text-xs text-gray-500">{fmtTime(t.created_at)}</td>
                      <td className="px-4 text-xs text-gray-700 max-w-48 truncate">{desc}</td>
                      <td className="px-4 text-xs text-gray-600">
                        {t.payment_method ? PAY_LABEL[t.payment_method] : '—'}
                      </td>
                      <td className="px-4 text-right font-mono text-xs font-medium">
                        {t.voided
                          ? <span className="line-through text-gray-400">{fmtCurrency(amount)}</span>
                          : fmtCurrency(amount)
                        }
                      </td>
                      <td className="px-4">
                        {t.voided
                          ? <StatusPill label="Voided" variant="red" />
                          : <StatusPill label="Complete" variant="green" />
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
