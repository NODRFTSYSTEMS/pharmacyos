import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CurrencyDollar, Warning, CheckCircle, LockSimple,
  ArrowRight, Calculator,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { PageHeader, MetricCard, Pill as StatusPill } from '../../components/Shell'
import type { EodCloseout, ShiftType } from '../../types/database'

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-JM', { style: 'currency', currency: 'JMD', minimumFractionDigits: 2 }).format(n)
}

function VarianceBadge({ variance }: { variance: number }) {
  const abs = Math.abs(variance)
  if (abs < 0.01) return <StatusPill label="Balanced" variant="green" />
  if (abs < 500)  return <StatusPill label={`${variance < 0 ? '-' : '+'}${fmtCurrency(abs)} variance`} variant="yellow" />
  return <StatusPill label={`DISCREPANCY ${fmtCurrency(abs)}`} variant="red" />
}

export default function CloseOut() {
  const today = new Date().toISOString().slice(0, 10)
  const [date]  = useState(today)
  const [shift, setShift] = useState<ShiftType>('FULL_DAY')

  const [openingFloat,      setOpeningFloat]      = useState('')
  const [actualCashCounted, setActualCashCounted] = useState('')
  const [actualCardTotal,   setActualCardTotal]   = useState('')
  const [actualLynkTotal,   setActualLynkTotal]   = useState('')
  const [notes,             setNotes]             = useState('')
  const [submitted,         setSubmitted]         = useState(false)

  const qc = useQueryClient()

  // Check if closeout already exists for this date + shift
  const { data: existing } = useQuery({
    queryKey: ['eod-closeout', date, shift],
    queryFn: async () => {
      const { data } = await supabase
        .from('eod_closeouts')
        .select('*')
        .eq('closeout_date', date)
        .eq('shift', shift)
        .maybeSingle()
      return data as EodCloseout | null
    },
  })

  // Live system totals from today's transactions
  const { data: systemTotals, isLoading: totalsLoading } = useQuery({
    queryKey: ['eod-system-totals', date, shift],
    queryFn: async () => {
      const [retail, rx] = await Promise.all([
        supabase
          .from('retail_transactions')
          .select('total, payment_method, voided')
          .gte('created_at', `${date}T00:00:00`)
          .lte('created_at', `${date}T23:59:59`),
        supabase
          .from('rx_transactions')
          .select('patient_copay, payment_method, nhf_subsidy, voided')
          .gte('created_at', `${date}T00:00:00`)
          .lte('created_at', `${date}T23:59:59`),
      ])

      const rt = (retail.data ?? []).filter(t => !t.voided)
      const rx_t = (rx.data ?? []).filter(t => !t.voided)

      const retailCash = rt.filter(t => t.payment_method === 'CASH').reduce((s, t) => s + (t.total ?? 0), 0)
      const retailCard = rt.filter(t => t.payment_method === 'CARD').reduce((s, t) => s + (t.total ?? 0), 0)
      const retailLynk = rt.filter(t => t.payment_method === 'LYNK').reduce((s, t) => s + (t.total ?? 0), 0)
      const rxCash     = rx_t.filter(t => t.payment_method === 'CASH').reduce((s, t) => s + (t.patient_copay ?? 0), 0)
      const rxCard     = rx_t.filter(t => t.payment_method === 'CARD').reduce((s, t) => s + (t.patient_copay ?? 0), 0)
      const rxNhf      = rx_t.reduce((s, t) => s + (t.nhf_subsidy ?? 0), 0)

      const retailCount = rt.length
      const rxCount     = rx_t.length
      const voidCount   = (retail.data ?? []).filter(t => t.voided).length + (rx.data ?? []).filter(t => t.voided).length

      const totalSystem = retailCash + retailCard + retailLynk + rxCash + rxCard

      return {
        retailCash, retailCard, retailLynk,
        rxCash, rxCard, rxNhf,
        retailCount, rxCount, voidCount,
        totalSystem,
      }
    },
    refetchInterval: 60_000,
  })

  const openFloat   = parseFloat(openingFloat)  || 0
  const cashCount   = parseFloat(actualCashCounted) || 0
  const cardCount   = parseFloat(actualCardTotal)   || 0
  const lynkCount   = parseFloat(actualLynkTotal)   || 0

  const systemCash = (systemTotals?.retailCash ?? 0) + (systemTotals?.rxCash ?? 0)
  const expectedCashInDrawer = openFloat + systemCash
  const cashVariance = actualCashCounted ? cashCount - expectedCashInDrawer : null

  const mutation = useMutation({
    mutationFn: async () => {
      if (!systemTotals) throw new Error('System totals not loaded')
      const { data: { user } } = await supabase.auth.getUser()
      const payload: Record<string, unknown> = {
        closeout_date:              date,
        shift,
        closed_by:                  user?.id ?? 'unknown',
        opening_float:              openFloat,
        system_retail_cash:         systemTotals.retailCash,
        system_retail_card:         systemTotals.retailCard,
        system_retail_lynk:         systemTotals.retailLynk,
        system_rx_cash:             systemTotals.rxCash,
        system_rx_card:             systemTotals.rxCard,
        system_rx_nhf:              systemTotals.rxNhf,
        system_total:               systemTotals.totalSystem,
        actual_cash_counted:        actualCashCounted ? cashCount : null,
        actual_card_total:          actualCardTotal   ? cardCount : null,
        actual_lynk_total:          actualLynkTotal   ? lynkCount : null,
        cash_variance:              cashVariance,
        retail_transaction_count:   systemTotals.retailCount,
        rx_transaction_count:       systemTotals.rxCount,
        void_count:                 systemTotals.voidCount,
        status:                     cashVariance !== null && Math.abs(cashVariance) >= 500
                                      ? 'DISCREPANCY'
                                      : 'SUBMITTED',
        notes: notes || null,
      }
      const { error } = await supabase.from('eod_closeouts').insert([payload])
      if (error) throw error
    },
    onSuccess: () => {
      setSubmitted(true)
      qc.invalidateQueries({ queryKey: ['eod-closeout', date, shift] })
    },
  })

  if (submitted || existing?.status === 'SUBMITTED' || existing?.status === 'APPROVED') {
    return (
      <div>
        <PageHeader
          title="End-of-Day Close-Out"
          breadcrumb={['Retail POS', 'Close Out']}
        />
        <div className="card p-8 max-w-xl text-center">
          <CheckCircle size={48} weight="duotone" className="text-emerald-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-800 mb-2">Close-out submitted</h2>
          <p className="text-sm text-gray-500 mb-1">
            Date: <strong>{date}</strong> — Shift: <strong>{shift}</strong>
          </p>
          {existing && (
            <p className="text-sm text-gray-500">
              Status: <StatusPill
                label={existing.status}
                variant={existing.status === 'APPROVED' ? 'green' : existing.status === 'DISCREPANCY' ? 'red' : 'yellow'}
              />
            </p>
          )}
          <p className="text-xs text-gray-400 mt-4">
            Pending manager review and approval.
          </p>
        </div>
      </div>
    )
  }

  const alreadyClosed = existing && existing.status !== 'OPEN'

  return (
    <div>
      <PageHeader
        title="End-of-Day Close-Out"
        subtitle={`${date} — ${shift.replace('_', ' ')} shift`}
        breadcrumb={['Retail POS', 'Close Out']}
      />

      {alreadyClosed && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded px-4 py-3 text-sm mb-6 flex items-center gap-2">
          <Warning size={16} />
          A close-out for this date and shift already exists (status: {existing.status}).
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: System totals */}
        <div className="space-y-4">
          <h2 className="section-title">System Totals</h2>

          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Shift" value={shift.replace('_', ' ')} icon={LockSimple} accent="blue" />
            <div className="card p-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date</p>
              <div className="flex gap-2">
                {(['MORNING', 'AFTERNOON', 'FULL_DAY'] as ShiftType[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setShift(s)}
                    className={`text-xs px-2 py-1 rounded border transition-colors ${
                      shift === s
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-200 text-gray-500 hover:border-blue-400'
                    }`}
                  >
                    {s === 'FULL_DAY' ? 'Full' : s === 'MORNING' ? 'AM' : 'PM'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {totalsLoading ? (
            <div className="card p-6 text-center text-sm text-gray-400">Loading system totals…</div>
          ) : systemTotals ? (
            <div className="card overflow-hidden">
              <table className="w-full table-compact text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                    <th className="text-right px-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { label: 'Retail — Cash',   value: systemTotals.retailCash },
                    { label: 'Retail — Card',   value: systemTotals.retailCard },
                    { label: 'Retail — Lynk',   value: systemTotals.retailLynk },
                    { label: 'Rx — Cash',       value: systemTotals.rxCash },
                    { label: 'Rx — Card',       value: systemTotals.rxCard },
                    { label: 'Rx — NHF',        value: systemTotals.rxNhf, note: 'subsidy (not collected)' },
                  ].map(row => (
                    <tr key={row.label} className="hover:bg-gray-50">
                      <td className="px-4 text-xs text-gray-600">
                        {row.label}
                        {row.note && <span className="text-gray-400 ml-1">({row.note})</span>}
                      </td>
                      <td className="px-4 text-right num text-gray-700">{fmtCurrency(row.value)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-4 text-xs text-gray-800">Total Collected</td>
                    <td className="px-4 text-right num text-gray-900">{fmtCurrency(systemTotals.totalSystem)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex gap-6 text-xs text-gray-500">
                <span>Retail txns: <strong>{systemTotals.retailCount}</strong></span>
                <span>Rx txns: <strong>{systemTotals.rxCount}</strong></span>
                {systemTotals.voidCount > 0 && (
                  <span className="text-red-500">Voids: <strong>{systemTotals.voidCount}</strong></span>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Right: Cashier count form */}
        <div className="space-y-4">
          <h2 className="section-title">Cashier Count</h2>

          <div className="card p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Opening Float (JMD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={openingFloat}
                onChange={e => setOpeningFloat(e.target.value)}
                className="input input-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Actual Cash Counted (JMD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Count the drawer and enter total"
                value={actualCashCounted}
                onChange={e => setActualCashCounted(e.target.value)}
                className="input input-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Card Terminal Total (JMD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Total from card machine report"
                value={actualCardTotal}
                onChange={e => setActualCardTotal(e.target.value)}
                className="input input-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Lynk Total (JMD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Total from Lynk terminal report"
                value={actualLynkTotal}
                onChange={e => setActualLynkTotal(e.target.value)}
                className="input input-mono"
              />
            </div>

            {/* Cash variance calculator */}
            {actualCashCounted && openingFloat && systemTotals && (
              <div className={`rounded px-4 py-3 border ${
                cashVariance === null ? 'bg-gray-50 border-gray-200'
                  : Math.abs(cashVariance!) < 0.01 ? 'bg-emerald-50 border-emerald-200'
                  : Math.abs(cashVariance!) < 500  ? 'bg-amber-50 border-amber-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Calculator size={14} className="text-gray-500" />
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Cash Reconciliation</span>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-gray-600">
                    <span>Opening float</span>
                    <span>{fmtCurrency(openFloat)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>+ System cash sales</span>
                    <span>{fmtCurrency(systemCash)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-700 border-t border-gray-200 pt-1 mt-1">
                    <span>= Expected in drawer</span>
                    <span>{fmtCurrency(expectedCashInDrawer)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Actual counted</span>
                    <span>{fmtCurrency(cashCount)}</span>
                  </div>
                  <div className={`flex justify-between font-bold text-base border-t border-gray-200 pt-1 mt-1 ${
                    cashVariance === 0 ? 'text-emerald-700'
                      : cashVariance! < 0 ? 'text-red-700' : 'text-amber-700'
                  }`}>
                    <span>Variance</span>
                    <span>{cashVariance! >= 0 ? '+' : ''}{fmtCurrency(cashVariance!)}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <VarianceBadge variance={cashVariance!} />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any discrepancies, incidents, or handover notes…"
                rows={3}
                className="input h-auto py-2"
              />
            </div>

            {mutation.isError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                Submission failed: {String((mutation.error as Error).message)}
              </p>
            )}

            <button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending || !openingFloat}
              className="btn btn-primary btn-lg w-full gap-2"
            >
              {mutation.isPending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ArrowRight size={16} />
              )}
              Submit Close-Out
            </button>
            <p className="text-xs text-gray-400 text-center">
              This will lock the shift for this date. A manager must approve before the register reopens.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
