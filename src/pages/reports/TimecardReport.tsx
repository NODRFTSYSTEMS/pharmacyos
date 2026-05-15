import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Export, Users, ChartBar } from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { todayJamaica, toJamaicaBounds } from '../../lib/date'
import { PageHeader, PrintHeader } from '../../components/Shell'
import type { Timecard } from '../../types/database'

// ── Helpers ───────────────────────────────────────────────────────────────────

function defaultRange() {
  const today = todayJamaica()
  const from  = new Date(today)
  from.setDate(from.getDate() - 29)
  return { from: from.toISOString().slice(0, 10), to: today }
}

function fmtHours(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface StaffSummary {
  staffName: string
  staffRole: string
  shifts:    number
  totalMin:  number
  flagged:   number
  approved:  number
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TimecardReport() {
  const [range, setRange] = useState(defaultRange)

  const { data = [], isLoading, isError } = useQuery<Timecard[]>({
    queryKey: ['timecard-report', range],
    queryFn: async () => {
      const { gte, lte } = toJamaicaBounds(range.from, range.to)
      const { data, error } = await supabase
        .from('timecards')
        .select('*')
        .gte('clocked_in_at', gte)
        .lte('clocked_in_at', lte)
        .neq('status', 'CLOCKED_IN')
        .order('clocked_in_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as Timecard[]
    },
  })

  // Aggregate by staff
  const summaries: StaffSummary[] = useMemo(() => {
    const map = new Map<string, StaffSummary>()
    for (const tc of data) {
      const key = tc.staff_id ?? tc.staff_name
      if (!map.has(key)) {
        map.set(key, {
          staffName: tc.staff_name,
          staffRole: tc.staff_role,
          shifts:    0,
          totalMin:  0,
          flagged:   0,
          approved:  0,
        })
      }
      const s = map.get(key)!
      s.shifts++
      s.totalMin  += tc.total_minutes ?? 0
      if (tc.status === 'FLAGGED')   s.flagged++
      if (tc.status === 'APPROVED')  s.approved++
    }
    return Array.from(map.values()).sort((a, b) => a.staffName.localeCompare(b.staffName))
  }, [data])

  const totalShifts  = summaries.reduce((s, x) => s + x.shifts, 0)
  const totalMinutes = summaries.reduce((s, x) => s + x.totalMin, 0)
  const totalFlagged = summaries.reduce((s, x) => s + x.flagged, 0)

  function exportCsv() {
    const rows = [
      ['Staff', 'Role', 'Shifts', 'Total Hours', 'Total Minutes', 'Flagged', 'Approved'],
      ...summaries.map(s => [
        s.staffName,
        s.staffRole,
        String(s.shifts),
        fmtHours(s.totalMin),
        String(s.totalMin),
        String(s.flagged),
        String(s.approved),
      ]),
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a   = document.createElement('a')
    a.href     = url
    a.download = `timecard-report-${range.from}-to-${range.to}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PrintHeader
        reportTitle="Timecard Report"
        period={`${range.from} to ${range.to}`}
      />

      <PageHeader
        title="Timecard Report"
        subtitle="Shift hours and attendance summary by staff member"
        breadcrumb={['Reports', 'Timecards']}
        cta={
          <div className="flex items-center gap-2 no-print">
            <button
              onClick={exportCsv}
              disabled={isLoading || summaries.length === 0}
              className="btn btn-ghost gap-1.5 text-xs"
              aria-label="Export timecard report as CSV"
            >
              <Export size={13} aria-hidden="true" />
              Export CSV
            </button>
            <button
              onClick={() => window.print()}
              disabled={isLoading}
              className="btn btn-ghost text-xs"
              aria-label="Print timecard report"
            >
              Print
            </button>
          </div>
        }
      />

      {/* Date range */}
      <div className="card p-3 mb-6 flex flex-wrap items-center gap-3 no-print">
        <label htmlFor="tr-from" className="text-xs text-gray-500 shrink-0">Period</label>
        <input
          id="tr-from"
          type="date"
          value={range.from}
          onChange={e => setRange(r => ({ ...r, from: e.target.value }))}
          className="input text-xs h-8 py-0 w-36"
        />
        <span className="text-xs text-gray-400">to</span>
        <input
          id="tr-to"
          type="date"
          value={range.to}
          onChange={e => setRange(r => ({ ...r, to: e.target.value }))}
          className="input text-xs h-8 py-0 w-36"
        />
      </div>

      {/* Summary strip */}
      {!isLoading && (
        <div className="flex items-center gap-6 mb-5 text-sm text-gray-500">
          <span>
            <strong className="text-gray-800">{totalShifts}</strong> shifts
          </span>
          <span>
            <strong className="text-gray-800">{fmtHours(totalMinutes)}</strong> total
          </span>
          {totalFlagged > 0 && (
            <span className="text-amber-600">
              <strong>{totalFlagged}</strong> flagged
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Timecard summary by staff">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Users size={12} aria-hidden="true" />
                    Staff
                  </span>
                </th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Shifts</th>
                <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Hours</th>
                <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Flagged</th>
                <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Approved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">Loading report…</td></tr>
              )}
              {isError && (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-red-600">Failed to load report.</td></tr>
              )}
              {!isLoading && summaries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                    <ChartBar size={32} className="text-gray-200 mx-auto mb-2" aria-hidden="true" />
                    No completed timecards for this period.
                  </td>
                </tr>
              )}
              {!isLoading && summaries.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{s.staffName}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{s.staffRole}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm tabular-nums text-gray-700">{s.shifts}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm tabular-nums text-gray-700">{fmtHours(s.totalMin)}</td>
                  <td className={`px-4 py-3 text-right font-mono text-sm tabular-nums ${s.flagged > 0 ? 'text-amber-600 font-semibold' : 'text-gray-400'}`}>
                    {s.flagged || '—'}
                  </td>
                  <td className={`px-4 py-3 text-right font-mono text-sm tabular-nums ${s.approved > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {s.approved || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
            {!isLoading && summaries.length > 1 && (
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Totals — {summaries.length} staff member{summaries.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-800">{totalShifts}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-bold text-blue-700">{fmtHours(totalMinutes)}</td>
                  <td className={`px-4 py-3 text-right font-mono text-xs font-bold ${totalFlagged > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                    {totalFlagged || '—'}
                  </td>
                  <td className="px-4 py-3" />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}

export default TimecardReport
