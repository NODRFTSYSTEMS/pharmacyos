import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Warning, Export, Users, Flag, X } from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { todayJamaica, toJamaicaBounds } from '../../lib/date'
import { PageHeader, Pill as StatusPill } from '../../components/Shell'
import { AUDIT_ACTIONS } from '../../constants/audit-actions'
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

// ── Flag Modal ────────────────────────────────────────────────────────────────

interface FlagModalProps {
  tc: Timecard
  note: string
  onNoteChange: (v: string) => void
  onConfirm: () => void
  onClose: () => void
  isPending: boolean
}

function FlagModal({ tc, note, onNoteChange, onConfirm, onClose, isPending }: FlagModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="flag-title">
      <div className="card w-full max-w-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="flag-title" className="text-sm font-semibold text-gray-800">Flag Timecard</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            <X size={15} aria-hidden="true" />
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1 border border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-500">Staff</span>
            <span className="font-medium">{tc.staff_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Role</span>
            <span>{tc.staff_role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Duration</span>
            <span className="font-mono">{fmtDuration(tc.total_minutes)}</span>
          </div>
        </div>

        <div>
          <label htmlFor="flag-note" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Reason *
          </label>
          <textarea
            id="flag-note"
            value={note}
            onChange={e => onNoteChange(e.target.value)}
            rows={3}
            placeholder="Describe why this shift needs review…"
            className="input h-auto py-2 resize-none"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={!note.trim() || isPending}
            className="btn bg-amber-600 text-white hover:bg-amber-700 border-amber-600 gap-1.5"
          >
            <Flag size={13} weight="fill" aria-hidden="true" />
            {isPending ? 'Flagging…' : 'Flag for Review'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TimecardManager() {
  const qc = useQueryClient()
  const { data: currentUser } = useCurrentUser()

  const [range, setRange]               = useState(defaultRange)
  const [statusFilter, setStatusFilter] = useState<TimecardStatus | 'ALL'>('ALL')
  const [staffSearch, setStaffSearch]   = useState('')
  const [flagTarget, setFlagTarget]     = useState<Timecard | null>(null)
  const [flagNote, setFlagNote]         = useState('')

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
    mutationFn: async (tc: Timecard) => {
      if (!currentUser) throw new Error('No authenticated user')
      const { error } = await supabase
        .from('timecards')
        .update({
          status:           'APPROVED',
          approved_by:      currentUser.id,
          approved_by_name: currentUser.name,
          approved_at:      new Date().toISOString(),
        })
        .eq('id', tc.id)
      if (error) throw error
      await supabase.from('audit_log').insert({
        actor_id:   currentUser.id,
        actor_name: currentUser.name,
        action:     AUDIT_ACTIONS.TIMECARD_APPROVE,
        table_name: 'timecards',
        record_id:  tc.id,
        details:    { staff_name: tc.staff_name, total_minutes: tc.total_minutes },
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['timecards-manager'] }),
  })

  // ── Flag mutation ────────────────────────────────────────────────────────────

  const flagMutation = useMutation({
    mutationFn: async ({ tc, note }: { tc: Timecard; note: string }) => {
      if (!currentUser) throw new Error('No authenticated user')
      const { error } = await supabase
        .from('timecards')
        .update({
          status:          'FLAGGED',
          ai_flag_anomaly:  true,
          ai_flag_reason:  `Manager flagged: ${note.trim()}`,
        })
        .eq('id', tc.id)
      if (error) throw error
      await supabase.from('audit_log').insert({
        actor_id:   currentUser.id,
        actor_name: currentUser.name,
        action:     AUDIT_ACTIONS.TIMECARD_FLAG,
        table_name: 'timecards',
        record_id:  tc.id,
        details:    { staff_name: tc.staff_name, note: note.trim() },
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['timecards-manager'] })
      setFlagTarget(null)
      setFlagNote('')
    },
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
  const anyPending   = approve.isPending || flagMutation.isPending

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
                const isFlagged    = tc.status === 'FLAGGED'
                const isClockdOut  = tc.status === 'CLOCKED_OUT'
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
                      <div className="flex items-center justify-end gap-1.5">
                        {isFlagged && (
                          <button
                            onClick={() => approve.mutate(tc)}
                            disabled={anyPending}
                            className="btn btn-ghost gap-1 text-xs h-7 text-emerald-700 hover:bg-emerald-50"
                            aria-label={`Approve timecard for ${tc.staff_name}`}
                          >
                            <CheckCircle size={13} aria-hidden="true" />
                            Approve
                          </button>
                        )}
                        {isClockdOut && (
                          <button
                            onClick={() => { setFlagNote(''); setFlagTarget(tc) }}
                            disabled={anyPending}
                            className="btn btn-ghost gap-1 text-xs h-7 text-amber-700 hover:bg-amber-50"
                            aria-label={`Flag timecard for ${tc.staff_name}`}
                          >
                            <Flag size={13} aria-hidden="true" />
                            Flag
                          </button>
                        )}
                      </div>
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

      {/* Flag modal */}
      {flagTarget && (
        <FlagModal
          tc={flagTarget}
          note={flagNote}
          onNoteChange={setFlagNote}
          onConfirm={() => flagMutation.mutate({ tc: flagTarget, note: flagNote })}
          onClose={() => { setFlagTarget(null); setFlagNote('') }}
          isPending={flagMutation.isPending}
        />
      )}
    </div>
  )
}
