import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Warning, Export, Users } from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { todayJamaica, toJamaicaBounds } from '../../lib/date'
import { PageHeader, Pill as StatusPill } from '../../components/Shell'
import type { Timecard, TimecardStatus } from '../../types/database'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-JM', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function fmtDuration(minutes: number | null): string {
  if (minutes == null) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function defaultRange() {
  const today = todayJamaica()
  const from  = new Date(today)
  from.setDate(from.getDate() - 6)
  return { from: from.toISOString().slice(0, 10), to: today }
}

const STATUS_VARIANT: Record<TimecardStatus, 'green' | 'yellow' | 'blue' | 'gray'> = {
  CLOCKED_IN:  'blue',
  CLOCKED_OUT: 'gray',
  FLAGGED:     'yellow',
  APPROVED:    'green',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TimecardManager() {
  const qc = useQueryClient()
  const { data: currentUser } = useCurrentUser()

  const [range, setRange]       = useState(defaultRange)
  const [statusFilter, setStatusFilter] = useState<TimecardStatus | 'ALL'>('ALL')
  const [staffSearch, setStaffSearch]   = useState('')

  const { data = [], isLoading, isError } = useQuery<Timecard[]>({
    queryKey: ['timecards-manager', range],
    queryFn: async () => {
      const { gte, lte } = toJamaicaBounds(range.from, range.to)
      const { data, error } = await supabase
        .from('timecards')
        .select('*')
        .gte('clocked_in_at', gte)
        .lte('clocked_in_at', lte)
        .order('clocked_in_at', { ascending: false })
        .limit(500)
      if (error) throw error
      return (data ?? []) as Timecard[]
    },
  })

  const timecards = data.filter(tc => {
    if (statusFilter !== 'ALL' && tc.status !== statusFilter) return false
    if (staffSearch) {
      const q = staffSearch.toLowerCase()
      return tc.staff_name.toLowerCase().includes(q)
    }
    return true
  })

  // ── Approve mutation ─────────────────────────────────────────────────────────

  const approve = useMutation({
    mutationFn: async (id: string) => {
      if (!currentUser) throw new Error('No authenticated user')
      const { error } = await supabase
        .from('timecards')
        .update({
          status:          'APPROVED',
          approved_by:     currentUser.id,
          approved_by_name: currentUser.name,
          approved_at:     new Date().toISOString(),
        })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['timecards-manager'] }),
  })

  // ── CSV export ───────────────────────────────────────────────────────────────

  function exportCsv() {
    const rows = [
      ['Staff', 'Role', 'Clocked In', 'Clocked Out', 'Duration (min)', 'Status', 'Anomaly Notes', 'Anomaly Detail'],
      ...timecards.map(tc => [
        tc.staff_name,
        tc.staff_role,
        fmtDateTime(tc.clocked_in_at),
        tc.clocked_out_at ? fmtDateTime(tc.clocked_out_at) : '',
        tc.total_minutes != null ? String(tc.total_minutes) : '',
        tc.status,
        [
          tc.ai_flag_overtime    ? 'OVERTIME'    : '',
          tc.ai_flag_short_shift ? 'SHORT_SHIFT' : '',
          tc.ai_flag_anomaly     ? 'ANOMALY'     : '',
        ].filter(Boolean).join(' | '),
        tc.ai_flag_reason ?? '',
      ]),
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a   = document.createElement('a')
    a.href     = url
    a.download = `timecards-${range.from}-to-${range.to}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  const flaggedCount = data.filter(tc => tc.status === 'FLAGGED').length

  return (
    <div>
      <PageHeader
        title="Timecard Management"
        subtitle="Review, approve, and flag staff timecards"
        breadcrumb={['Staff', 'Manage Timecards']}
        cta={
          <button
            onClick={exportCsv}
            disabled={isLoading || timecards.length === 0}
            className="btn btn-ghost gap-1.5 text-xs"
            aria-label="Export timecards as CSV"
          >
            <Export size={13} aria-hidden="true" />
            Export CSV
          </button>
        }
      />

      {/* Summary strip */}
      {!isLoading && flaggedCount > 0 && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded px-4 py-2.5 text-sm text-amber-800 mb-4">
          <Warning size={15} weight="duotone" aria-hidden="true" />
          <strong>{flaggedCount}</strong> timecard{flaggedCount !== 1 ? 's' : ''} flagged and awaiting review
        </div>
      )}

      {/* Filters */}
      <div className="card p-3 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="tc-from" className="text-xs text-gray-500 shrink-0">From</label>
          <input
            id="tc-from"
            type="date"
            value={range.from}
            onChange={e => setRange(r => ({ ...r, from: e.target.value }))}
            className="input text-xs h-8 py-0 w-36"
          />
          <span className="text-xs text-gray-400">to</span>
          <input
            id="tc-to"
            type="date"
            value={range.to}
            onChange={e => setRange(r => ({ ...r, to: e.target.value }))}
            className="input text-xs h-8 py-0 w-36"
          />
        </div>

        <div className="flex gap-1" role="tablist" aria-label="Status filter">
          {(['ALL', 'FLAGGED', 'CLOCKED_OUT', 'APPROVED', 'CLOCKED_IN'] as const).map(s => (
            <button
              key={s}
              role="tab"
              aria-selected={statusFilter === s}
              onClick={() => setStatusFilter(s)}
              className={`btn btn-ghost text-xs h-8 px-3 ${statusFilter === s ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
            >
              {s === 'ALL' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative ml-auto">
          <Users size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by staff name…"
            value={staffSearch}
            onChange={e => setStaffSearch(e.target.value)}
            className="input pl-7 w-44 text-xs"
            aria-label="Search by staff name"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Staff timecards">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Clocked In</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Clocked Out</th>
                <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Anomaly Notes</th>
                <th scope="col" className="px-4 py-3" aria-label="Actions" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">Loading timecards…</td></tr>
              )}
              {isError && (
                <tr><td colSpan={7} className="px-4 py-6 text-center text-sm text-red-600">Failed to load timecards.</td></tr>
              )}
              {!isLoading && timecards.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No timecards for this period.</td></tr>
              )}
              {!isLoading && timecards.map(tc => {
                const isFlagged = tc.status === 'FLAGGED'
                return (
                  <tr key={tc.id} className={isFlagged ? 'bg-amber-50 hover:bg-amber-100' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-800">{tc.staff_name}</p>
                      <p className="text-xs text-gray-400">{tc.staff_role}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 tabular-nums whitespace-nowrap">
                      {fmtDateTime(tc.clocked_in_at)}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 tabular-nums whitespace-nowrap">
                      {tc.clocked_out_at ? fmtDateTime(tc.clocked_out_at) : <span className="text-blue-500">Active</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-gray-700 tabular-nums">
                      {fmtDuration(tc.total_minutes)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill
                        label={tc.status.replace('_', ' ')}
                        variant={STATUS_VARIANT[tc.status] ?? 'gray'}
                      />
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      {tc.ai_flag_reason ? (
                        <p className="text-xs text-amber-700 truncate" title={tc.ai_flag_reason}>
                          {tc.ai_flag_reason}
                        </p>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isFlagged && (
                        <button
                          onClick={() => approve.mutate(tc.id)}
                          disabled={approve.isPending}
                          className="btn btn-ghost gap-1 text-xs h-7 text-emerald-700 hover:bg-emerald-50"
                          aria-label={`Approve timecard for ${tc.staff_name}`}
                        >
                          <CheckCircle size={13} aria-hidden="true" />
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {!isLoading && timecards.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
            {timecards.length} timecard{timecards.length !== 1 ? 's' : ''}
            {flaggedCount > 0 && ` · ${flaggedCount} flagged`}
          </div>
        )}
      </div>
    </div>
  )
}
