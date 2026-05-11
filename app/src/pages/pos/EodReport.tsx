import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Printer, Export, CheckCircle, Warning,
  CurrencyDollar, Receipt, Pill, CalendarBlank,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { PageHeader, MetricCard, Pill as StatusPill } from '../../components/Shell'
import type { EodCloseout } from '../../types/database'

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-JM', { style: 'currency', currency: 'JMD', minimumFractionDigits: 2 }).format(n)
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-JM', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function eodStatus(status: EodCloseout['status']) {
  const map: Record<EodCloseout['status'], { label: string; variant: 'green' | 'yellow' | 'red' | 'blue' | 'gray' }> = {
    OPEN:        { label: 'Open',        variant: 'blue' },
    SUBMITTED:   { label: 'Submitted',   variant: 'yellow' },
    APPROVED:    { label: 'Approved',    variant: 'green' },
    DISCREPANCY: { label: 'Discrepancy', variant: 'red' },
  }
  return map[status] ?? { label: status, variant: 'gray' }
}

export default function EodReport() {
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)

  const { data: closeouts, isLoading, isError } = useQuery({
    queryKey: ['eod-report', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('eod_closeouts')
        .select('*')
        .eq('closeout_date', date)
        .order('created_at', { ascending: true })
      if (error) throw error
      return (data ?? []) as EodCloseout[]
    },
  })

  const { data: txnSummary } = useQuery({
    queryKey: ['eod-txn-summary', date],
    queryFn: async () => {
      const [retail, rx] = await Promise.all([
        supabase
          .from('retail_transactions')
          .select('total, payment_method, voided, created_at')
          .gte('created_at', `${date}T00:00:00`)
          .lte('created_at', `${date}T23:59:59`),
        supabase
          .from('rx_transactions')
          .select('patient_copay, nhf_subsidy, payment_method, voided, created_at')
          .gte('created_at', `${date}T00:00:00`)
          .lte('created_at', `${date}T23:59:59`),
      ])

      const rt = retail.data ?? []
      const rx_t = rx.data ?? []

      const hourlyMap: Record<number, number> = {}
      for (const t of [...rt, ...rx_t]) {
        if (!t.voided) {
          const hr = new Date(t.created_at).getHours()
          const val = 'total' in t ? (t.total ?? 0) : (t.patient_copay ?? 0)
          hourlyMap[hr] = (hourlyMap[hr] ?? 0) + val
        }
      }

      return {
        retailTotal:  rt.filter(t => !t.voided).reduce((s, t) => s + (t.total ?? 0), 0),
        rxTotal:      rx_t.filter(t => !t.voided).reduce((s, t) => s + (t.patient_copay ?? 0), 0),
        nhfTotal:     rx_t.reduce((s, t) => s + (t.nhf_subsidy ?? 0), 0),
        retailCount:  rt.filter(t => !t.voided).length,
        rxCount:      rx_t.filter(t => !t.voided).length,
        voidCount:    [...rt, ...rx_t].filter(t => t.voided).length,
        hourlyMap,
      }
    },
  })

  const totalCollected = (txnSummary?.retailTotal ?? 0) + (txnSummary?.rxTotal ?? 0)
  const peakHour = txnSummary
    ? Object.entries(txnSummary.hourlyMap).sort((a, b) => b[1] - a[1])[0]
    : null

  function printReport() {
    window.print()
  }

  function exportCsv() {
    if (!closeouts) return
    const rows = [
      ['Date', 'Shift', 'Status', 'Opening Float', 'System Total', 'Cash Variance',
       'Retail Txns', 'Rx Txns', 'Voids', 'Submitted By', 'Notes'],
      ...closeouts.map(c => [
        c.closeout_date, c.shift, c.status,
        String(c.opening_float), String(c.system_total), String(c.cash_variance ?? ''),
        String(c.retail_transaction_count), String(c.rx_transaction_count), String(c.void_count),
        c.closed_by, c.notes ?? '',
      ]),
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a'); a.href = url
    a.download = `eod-report-${date}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader
        title="End-of-Day Report"
        subtitle="Daily summary of transactions, collections, and close-out status"
        breadcrumb={['Retail POS', 'EOD Report']}
        cta={
          <div className="flex gap-2">
            <button onClick={printReport} className="btn btn-ghost gap-1.5">
              <Printer size={14} />
              Print
            </button>
            <button onClick={exportCsv} className="btn btn-ghost gap-1.5">
              <Export size={14} />
              Export
            </button>
          </div>
        }
      />

      {/* Date picker */}
      <div className="card p-3 mb-6 flex items-center gap-3 max-w-xs">
        <CalendarBlank size={16} className="text-gray-400" />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="input text-sm border-0 p-0 focus:ring-0 shadow-none"
        />
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Total Collected"
          value={fmtCurrency(totalCollected)}
          sub="retail + Rx co-pay"
          icon={CurrencyDollar}
          accent="blue"
        />
        <MetricCard
          label="Retail Sales"
          value={fmtCurrency(txnSummary?.retailTotal ?? 0)}
          sub={`${txnSummary?.retailCount ?? 0} transactions`}
          icon={Receipt}
          accent="blue"
        />
        <MetricCard
          label="Rx Collections"
          value={fmtCurrency(txnSummary?.rxTotal ?? 0)}
          sub={`${txnSummary?.rxCount ?? 0} dispensings`}
          icon={Pill}
          accent="green"
        />
        <MetricCard
          label="NHF Subsidy"
          value={fmtCurrency(txnSummary?.nhfTotal ?? 0)}
          sub="claimed from NHF (not cash)"
          icon={CheckCircle}
          accent="yellow"
        />
      </div>

      {/* Hourly breakdown */}
      {txnSummary && Object.keys(txnSummary.hourlyMap).length > 0 && (
        <div className="card p-5 mb-6">
          <h3 className="section-title mb-4">Hourly Sales Breakdown</h3>
          <div className="flex items-end gap-1 h-32">
            {Array.from({ length: 24 }, (_, h) => {
              const val  = txnSummary.hourlyMap[h] ?? 0
              const max  = Math.max(...Object.values(txnSummary.hourlyMap), 1)
              const pct  = (val / max) * 100
              const isPeak = peakHour && parseInt(peakHour[0]) === h
              return (
                <div key={h} className="flex-1 flex flex-col items-center gap-0.5" title={`${h}:00 — ${fmtCurrency(val)}`}>
                  <div
                    className={`w-full rounded-t transition-all ${isPeak ? 'bg-blue-600' : val > 0 ? 'bg-blue-200' : 'bg-gray-100'}`}
                    style={{ height: `${Math.max(pct, val > 0 ? 4 : 0)}%` }}
                  />
                  {h % 4 === 0 && (
                    <span className="text-gray-400" style={{ fontSize: '9px' }}>{h}h</span>
                  )}
                </div>
              )
            })}
          </div>
          {peakHour && (
            <p className="text-xs text-gray-500 mt-2">
              Peak hour: <strong>{peakHour[0]}:00</strong> — {fmtCurrency(parseFloat(peakHour[1] as string))}
            </p>
          )}
        </div>
      )}

      {/* Close-out records */}
      <div>
        <h2 className="section-title mb-3">Close-Out Records — {date}</h2>

        {isLoading && (
          <div className="card p-6 text-center text-sm text-gray-400">Loading close-out records…</div>
        )}
        {isError && (
          <div className="card p-4 text-sm text-red-600 bg-red-50">Failed to load EOD data.</div>
        )}

        {!isLoading && !isError && (closeouts ?? []).length === 0 && (
          <div className="card p-8 text-center">
            <Warning size={32} className="text-amber-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700">No close-out submitted for {date}</p>
            <p className="text-xs text-gray-400 mt-1">
              The cashier must complete close-out before this report is finalised.
            </p>
          </div>
        )}

        {(closeouts ?? []).map(c => {
          const status = eodStatus(c.status)
          const cashVar = c.cash_variance
          return (
            <div key={c.id} className="card p-5 mb-4">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800">
                      {c.shift.replace('_', ' ')} Shift
                    </h3>
                    <StatusPill label={status.label} variant={status.variant} />
                  </div>
                  <p className="text-xs text-gray-500">Submitted: {fmtDateTime(c.created_at)}</p>
                  {c.manager_approved_at && (
                    <p className="text-xs text-emerald-600">Approved: {fmtDateTime(c.manager_approved_at)}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Total Collected</p>
                  <p className="num-lg text-gray-900">{fmtCurrency(c.system_total)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-4">
                {[
                  { label: 'Opening Float',   val: fmtCurrency(c.opening_float) },
                  { label: 'Retail — Cash',   val: fmtCurrency(c.system_retail_cash) },
                  { label: 'Retail — Card',   val: fmtCurrency(c.system_retail_card) },
                  { label: 'Retail — Lynk',   val: fmtCurrency(c.system_retail_lynk) },
                  { label: 'Rx — Cash',       val: fmtCurrency(c.system_rx_cash) },
                  { label: 'Rx — Card',       val: fmtCurrency(c.system_rx_card) },
                  { label: 'NHF Subsidy',     val: fmtCurrency(c.system_rx_nhf) },
                  { label: 'Retail Txns',     val: String(c.retail_transaction_count) },
                  { label: 'Rx Txns',         val: String(c.rx_transaction_count) },
                  { label: 'Voids',           val: String(c.void_count) },
                ].map(row => (
                  <div key={row.label} className="bg-gray-50 rounded px-3 py-2">
                    <p className="text-gray-400 mb-0.5">{row.label}</p>
                    <p className="num font-medium text-gray-800">{row.val}</p>
                  </div>
                ))}
              </div>

              {/* Cashier actuals vs system */}
              {c.actual_cash_counted !== null && (
                <div className={`rounded px-4 py-3 border text-sm ${
                  cashVar === 0 ? 'bg-emerald-50 border-emerald-200'
                    : cashVar !== null && Math.abs(cashVar) < 500 ? 'bg-amber-50 border-amber-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                    Cash Reconciliation
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                    <div>
                      <p className="text-gray-400">Expected in drawer</p>
                      <p className="font-medium">{fmtCurrency(c.opening_float + c.system_retail_cash + c.system_rx_cash)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Cashier counted</p>
                      <p className="font-medium">{fmtCurrency(c.actual_cash_counted)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Variance</p>
                      <p className={`font-bold text-base ${
                        cashVar === 0 ? 'text-emerald-700'
                          : cashVar! < 0 ? 'text-red-700' : 'text-amber-700'
                      }`}>
                        {cashVar !== null ? (cashVar >= 0 ? '+' : '') + fmtCurrency(cashVar) : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {c.notes && (
                <div className="mt-3 text-xs text-gray-600 bg-gray-50 rounded px-3 py-2">
                  <span className="font-medium">Notes: </span>{c.notes}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
