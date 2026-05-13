import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Export, CurrencyDollar, Receipt, Pill as PillIcon, Printer,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { toJamaicaBounds } from '../../lib/date'
import { PageHeader, MetricCard, PrintHeader } from '../../components/Shell'
import type { RetailTransaction, RxTransaction, PaymentMethod } from '../../types/database'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat('en-JM', {
    style: 'currency',
    currency: 'JMD',
    minimumFractionDigits: 2,
  }).format(n)
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function nDaysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return toIsoDate(d)
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface DailyRow {
  date: string
  retail: number
  rx: number
  nhf: number
  total: number
}

interface PayMethodRow {
  method: string
  count: number
  total: number
}

const PAY_LABEL: Record<PaymentMethod, string> = {
  CASH: 'Cash', CARD: 'Card', LYNK: 'Lynk', NHF: 'NHF', MIXED: 'Mixed',
}

// ── Component ─────────────────────────────────────────────────────────────────

export function RevenueReport() {
  const [from, setFrom] = useState(nDaysAgo(7))
  const [to, setTo] = useState(toIsoDate(new Date()))

  const retailQuery = useQuery<RetailTransaction[]>({
    queryKey: ['report-retail', from, to],
    queryFn: async () => {
      // I-22: Jamaica-aware bounds (UTC-5, no DST)
      const bounds = toJamaicaBounds(from, to)
      const { data, error } = await supabase
        .from('retail_transactions')
        .select('*')
        .gte('created_at', bounds.gte)
        .lte('created_at', bounds.lte)
        .eq('voided', false)
      if (error) throw error
      return (data ?? []) as RetailTransaction[]
    },
  })

  const rxQuery = useQuery<RxTransaction[]>({
    queryKey: ['report-rx', from, to],
    queryFn: async () => {
      // I-22: Jamaica-aware bounds (UTC-5, no DST)
      const bounds = toJamaicaBounds(from, to)
      const { data, error } = await supabase
        .from('rx_transactions')
        .select('*')
        .gte('created_at', bounds.gte)
        .lte('created_at', bounds.lte)
        .eq('voided', false)
      if (error) throw error
      return (data ?? []) as RxTransaction[]
    },
  })

  const retail = retailQuery.data ?? []
  const rx = rxQuery.data ?? []
  const isLoading = retailQuery.isLoading || rxQuery.isLoading

  // Metric totals
  const totalRetail = retail.reduce((s, t) => s + t.total, 0)
  const totalRx = rx.reduce((s, t) => s + t.patient_copay, 0)
  const totalNhf = rx.reduce((s, t) => s + t.nhf_subsidy, 0)
  const grandTotal = totalRetail + totalRx

  // Daily breakdown — group by date
  const dailyMap = new Map<string, { retail: number; rx: number; nhf: number }>()

  for (const t of retail) {
    const d = t.created_at.slice(0, 10)
    const existing = dailyMap.get(d) ?? { retail: 0, rx: 0, nhf: 0 }
    dailyMap.set(d, { ...existing, retail: existing.retail + t.total })
  }
  for (const t of rx) {
    const d = t.created_at.slice(0, 10)
    const existing = dailyMap.get(d) ?? { retail: 0, rx: 0, nhf: 0 }
    dailyMap.set(d, {
      ...existing,
      rx: existing.rx + t.patient_copay,
      nhf: existing.nhf + t.nhf_subsidy,
    })
  }

  const dailyRows: DailyRow[] = Array.from(dailyMap.entries())
    .map(([date, v]) => ({
      date,
      retail: v.retail,
      rx: v.rx,
      nhf: v.nhf,
      total: v.retail + v.rx,
    }))
    .sort((a, b) => b.date.localeCompare(a.date))

  // Payment method breakdown — combine retail + rx
  const payMap = new Map<string, { count: number; total: number }>()

  for (const t of retail) {
    const m = PAY_LABEL[t.payment_method] ?? t.payment_method
    const existing = payMap.get(m) ?? { count: 0, total: 0 }
    payMap.set(m, { count: existing.count + 1, total: existing.total + t.total })
  }
  for (const t of rx) {
    if (!t.payment_method) continue
    const m = PAY_LABEL[t.payment_method] ?? t.payment_method
    const existing = payMap.get(m) ?? { count: 0, total: 0 }
    payMap.set(m, { count: existing.count + 1, total: existing.total + t.patient_copay })
  }

  const payRows: PayMethodRow[] = Array.from(payMap.entries())
    .map(([method, v]) => ({ method, count: v.count, total: v.total }))
    .sort((a, b) => b.total - a.total)

  // Totals for tfoot
  const dailyTotals = dailyRows.reduce(
    (acc, r) => ({ retail: acc.retail + r.retail, rx: acc.rx + r.rx, nhf: acc.nhf + r.nhf, total: acc.total + r.total }),
    { retail: 0, rx: 0, nhf: 0, total: 0 }
  )
  const payTotals = payRows.reduce(
    (acc, r) => ({ count: acc.count + r.count, total: acc.total + r.total }),
    { count: 0, total: 0 }
  )

  // CSV export
  function exportCsv() {
    const rows = [
      ['Date', 'Retail Sales', 'Rx Collections', 'NHF Subsidy', 'Total'],
      ...dailyRows.map(r => [
        r.date,
        r.retail.toFixed(2),
        r.rx.toFixed(2),
        r.nhf.toFixed(2),
        r.total.toFixed(2),
      ]),
      ['TOTAL', dailyTotals.retail.toFixed(2), dailyTotals.rx.toFixed(2), dailyTotals.nhf.toFixed(2), dailyTotals.total.toFixed(2)],
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `revenue-report-${from}-to-${to}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* ── Print-only header ─────────────────────────────────────────── */}
      <PrintHeader reportTitle="Revenue Report" period={`${from} to ${to}`} />

      <PageHeader
        title="Revenue Report"
        subtitle="Retail and Rx revenue by date range"
        breadcrumb={['Reports', 'Revenue']}
      />

      {/* Date range + export row */}
      <div className="card p-3 mb-6 flex flex-wrap items-center gap-3 no-print">
        <div className="flex items-center gap-2">
          <label htmlFor="rev-from" className="text-xs text-gray-500 font-medium shrink-0">From</label>
          <input
            id="rev-from"
            type="date"
            value={from}
            onChange={e => setFrom(e.target.value)}
            className="input w-36 text-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="rev-to" className="text-xs text-gray-500 font-medium shrink-0">To</label>
          <input
            id="rev-to"
            type="date"
            value={to}
            onChange={e => setTo(e.target.value)}
            className="input w-36 text-xs"
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={exportCsv}
            className="btn btn-ghost gap-1.5 text-xs"
            disabled={isLoading || dailyRows.length === 0}
            aria-label="Export revenue report as CSV"
          >
            <Export size={13} />
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="btn btn-ghost gap-1.5 text-xs"
            disabled={isLoading}
            aria-label="Print revenue report"
          >
            <Printer size={13} />
            Print
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Total Revenue"
          value={isLoading ? '—' : fmtCurrency(grandTotal)}
          sub="retail + Rx"
          icon={CurrencyDollar}
          accent="blue"
        />
        <MetricCard
          label="Retail Revenue"
          value={isLoading ? '—' : fmtCurrency(totalRetail)}
          sub={`${retail.length} transactions`}
          icon={Receipt}
          accent="blue"
        />
        <MetricCard
          label="Rx Revenue"
          value={isLoading ? '—' : fmtCurrency(totalRx)}
          sub={`${rx.length} dispensings`}
          icon={PillIcon}
          accent="green"
        />
        <MetricCard
          label="NHF Subsidy"
          value={isLoading ? '—' : fmtCurrency(totalNhf)}
          sub="not included in total"
          icon={CurrencyDollar}
          accent="yellow"
        />
      </div>

      {/* Daily breakdown */}
      <div className="mb-6">
        <h2 className="section-title mb-3">Daily Breakdown</h2>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-compact text-sm" aria-label="Daily revenue breakdown">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Retail Sales</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rx Collections</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">NHF Subsidy</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">Loading…</td>
                  </tr>
                )}
                {!isLoading && dailyRows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">No transactions in this date range.</td>
                  </tr>
                )}
                {!isLoading && dailyRows.map(row => (
                  <tr key={row.date} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{row.date}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">{fmtCurrency(row.retail)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">{fmtCurrency(row.rx)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-gray-500">{fmtCurrency(row.nhf)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-gray-800">{fmtCurrency(row.total)}</td>
                  </tr>
                ))}
              </tbody>
              {!isLoading && dailyRows.length > 0 && (
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td className="px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wide">Grand Total</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-800">{fmtCurrency(dailyTotals.retail)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-800">{fmtCurrency(dailyTotals.rx)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-500">{fmtCurrency(dailyTotals.nhf)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-bold text-blue-700">{fmtCurrency(dailyTotals.total)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* Payment method breakdown */}
      <div>
        <h2 className="section-title mb-3">Payment Method Breakdown</h2>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-compact text-sm" aria-label="Payment method breakdown">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Count</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-400">Loading…</td>
                  </tr>
                )}
                {!isLoading && payRows.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-400">No data.</td>
                  </tr>
                )}
                {!isLoading && payRows.map(row => (
                  <tr key={row.method} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">{row.method}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-gray-600">{row.count}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-gray-800">{fmtCurrency(row.total)}</td>
                  </tr>
                ))}
              </tbody>
              {!isLoading && payRows.length > 0 && (
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td className="px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wide">Total</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-800">{payTotals.count}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-bold text-blue-700">{fmtCurrency(payTotals.total)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RevenueReport
