import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Export, Pill as PillIcon, CurrencyDollar, Warning, Printer,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { toJamaicaBounds } from '../../lib/date'
import { PageHeader, MetricCard, Pill as StatusPill, PrintHeader } from '../../components/Shell'
import type { RxTransaction } from '../../types/database'

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

function fmtDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-JM', {
    month: 'short', day: 'numeric',
  }) + ' ' + d.toLocaleTimeString('en-JM', {
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DispensingReport() {
  const [from, setFrom] = useState(nDaysAgo(7))
  const [to, setTo] = useState(toIsoDate(new Date()))

  const { data, isLoading, isError } = useQuery<RxTransaction[]>({
    queryKey: ['report-dispensing', from, to],
    queryFn: async () => {
      // I-22: Jamaica-aware bounds (UTC-5, no DST)
      const bounds = toJamaicaBounds(from, to)
      const { data, error } = await supabase
        .from('rx_transactions')
        .select('*')
        .gte('created_at', bounds.gte)
        .lte('created_at', bounds.lte)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as RxTransaction[]
    },
  })

  const records = data ?? []
  const nonVoided = records.filter(r => !r.voided)
  const voided = records.filter(r => r.voided)

  const totalRevenue = nonVoided.reduce((s, r) => s + r.patient_copay, 0)
  const totalNhf = nonVoided.reduce((s, r) => s + r.nhf_subsidy, 0)
  const totalQty = nonVoided.reduce((s, r) => s + r.quantity_dispensed, 0)

  // CSV export — full dispensing report
  function exportCsv() {
    const rows = [
      ['Ref', 'Drug', 'Patient', 'Prescriber', 'Qty', 'Copay', 'NHF Subsidy', 'Date', 'Status'],
      ...records.map(r => [
        r.ref_number,
        r.drug_name,
        r.patient_name,
        r.dispensed_by ?? '—',
        String(r.quantity_dispensed),
        r.patient_copay.toFixed(2),
        r.nhf_subsidy.toFixed(2),
        r.created_at.slice(0, 10),
        r.voided ? 'VOIDED' : 'DISPENSED',
      ]),
    ]
    const csv = rows.map(row => row.map(v => `"${v}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `dispensing-report-${from}-to-${to}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // C-2: NHF Claims export — filters to rows where nhf_subsidy > 0
  // NHF Card No column is included but requires the insurance fields migration
  // (pending worktree merge) to populate; shows — until available.
  function exportNhfCsv() {
    const nhfRows = nonVoided.filter(r => r.nhf_subsidy > 0)
    const rows = [
      ['Date', 'Rx Ref', 'Patient Name', 'NHF Card No', 'Drug Name', 'Qty', 'Copay (JMD)', 'NHF Subsidy (JMD)', 'Prescriber'],
      ...nhfRows.map(r => [
        r.created_at.slice(0, 10),
        r.ref_number,
        r.patient_name,
        '—',  // nhf_card_no — available after insurance fields migration merges
        r.drug_name,
        String(r.quantity_dispensed),
        r.patient_copay.toFixed(2),
        r.nhf_subsidy.toFixed(2),
        r.dispensed_by ?? '—',
      ]),
    ]
    const csv = rows.map(row => row.map(v => `"${v}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `nhf-claims-${from}-to-${to}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* ── Print-only header ─────────────────────────────────────────── */}
      <PrintHeader reportTitle="Dispensing Report" period={`${from} to ${to}`} />

      <PageHeader
        title="Dispensing Report"
        subtitle="Prescription dispensing activity and Rx collections"
        breadcrumb={['Reports', 'Dispensing']}
        showSession
      />

      {/* Date range + export row */}
      <div className="card p-3 mb-6 flex flex-wrap items-center gap-3 no-print">
        <div className="flex items-center gap-2">
          <label htmlFor="disp-from" className="text-xs text-gray-500 font-medium shrink-0">From</label>
          <input
            id="disp-from"
            type="date"
            value={from}
            onChange={e => setFrom(e.target.value)}
            className="input w-36 text-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="disp-to" className="text-xs text-gray-500 font-medium shrink-0">To</label>
          <input
            id="disp-to"
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
            disabled={isLoading || records.length === 0}
            aria-label="Export dispensing report as CSV"
          >
            <Export size={13} />
            Export CSV
          </button>
          <button
            onClick={exportNhfCsv}
            className="btn btn-ghost gap-1.5 text-xs"
            disabled={isLoading || nonVoided.filter(r => r.nhf_subsidy > 0).length === 0}
            aria-label="Export NHF claims as CSV"
            title={totalNhf === 0 ? 'No NHF subsidy rows in this period' : `Export ${nonVoided.filter(r => r.nhf_subsidy > 0).length} NHF claim row(s)`}
          >
            <Export size={13} />
            Export NHF Claims
          </button>
          <button
            onClick={() => window.print()}
            className="btn btn-ghost gap-1.5 text-xs"
            disabled={isLoading}
            aria-label="Print dispensing report"
          >
            <Printer size={13} />
            Print
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Total Dispensings"
          value={isLoading ? '—' : String(nonVoided.length)}
          sub="non-voided"
          icon={PillIcon}
          accent="blue"
        />
        <MetricCard
          label="Total Rx Revenue"
          value={isLoading ? '—' : fmtCurrency(totalRevenue)}
          sub="patient copay only"
          icon={CurrencyDollar}
          accent="green"
        />
        <MetricCard
          label="NHF Claims"
          value={isLoading ? '—' : fmtCurrency(totalNhf)}
          sub="subsidy billed to NHF"
          icon={CurrencyDollar}
          accent="yellow"
        />
        <MetricCard
          label="Voids"
          value={isLoading ? '—' : String(voided.length)}
          sub="requires review"
          icon={Warning}
          accent={voided.length > 0 ? 'red' : 'blue'}
        />
      </div>

      {/* Error state */}
      {isError && (
        <div className="card p-4 mb-4 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200">
          <Warning size={15} weight="duotone" aria-hidden="true" />
          Failed to load dispensing records. Check your connection and try again.
        </div>
      )}

      {/* Table */}
      {!isError && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-compact text-sm" aria-label="Dispensing records">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ref</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Drug</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dispensed By</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Copay</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">NHF</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">Loading…</td>
                  </tr>
                )}
                {!isLoading && records.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">No dispensing records in this date range.</td>
                  </tr>
                )}
                {!isLoading && records.map(r => (
                  <tr key={r.id} className={`hover:bg-gray-50 ${r.voided ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">{fmtDateTime(r.created_at)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">
                      {r.voided
                        ? <span className="line-through text-gray-400">{r.ref_number}</span>
                        : r.ref_number
                      }
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700 max-w-[140px] truncate">
                      {r.voided
                        ? <span className="line-through text-gray-400">{r.drug_name}</span>
                        : r.drug_name
                      }
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700 max-w-[120px] truncate">{r.patient_name}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{r.dispensed_by ?? '—'}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">{r.quantity_dispensed}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">
                      {r.voided
                        ? <span className="line-through text-gray-400">{fmtCurrency(r.patient_copay)}</span>
                        : fmtCurrency(r.patient_copay)
                      }
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-gray-600">
                      {r.voided
                        ? <span className="line-through text-gray-400">{fmtCurrency(r.nhf_subsidy)}</span>
                        : fmtCurrency(r.nhf_subsidy)
                      }
                    </td>
                    <td className="px-4 py-3">
                      {r.voided
                        ? <StatusPill label="Voided" variant="red" />
                        : <StatusPill label="Dispensed" variant="green" />
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
              {!isLoading && nonVoided.length > 0 && (
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Totals ({nonVoided.length} dispensed, {voided.length} voided)
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-800">{totalQty}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-bold text-blue-700">{fmtCurrency(totalRevenue)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-600">{fmtCurrency(totalNhf)}</td>
                    <td />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default DispensingReport
