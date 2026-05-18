// MyTimecards — staff self-service timecard history
// Route: /staff/my-timecards — guarded by timecard_view permission
// Employment Act (Jamaica): every employee has the right to review their own hours.
// This page shows ONLY the current user's own records. No other staff data is accessible.
// RLS policy on `timecards` enforces staff_id = auth.uid() for non-manager roles.

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Clock, CheckCircle, Warning, Timer, ArrowClockwise, Export } from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { todayJamaica, toJamaicaBounds } from '../../lib/date'
import { PageHeader, Pill as StatusPill } from '../../components/Shell'
import type { Timecard, TimecardStatus } from '../../types/database'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-JM', {
    timeZone: 'America/Jamaica',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-JM', {
    timeZone: 'America/Jamaica',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
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
  from.setDate(from.getDate() - 29)   // 30-day default window
  return { from: from.toISOString().slice(0, 10), to: today }
}

const STATUS_PILL_VARIANT: Record<TimecardStatus, 'green' | 'yellow' | 'blue' | 'gray'> = {
  CLOCKED_IN:  'blue',
  CLOCKED_OUT: 'gray',
  FLAGGED:     'yellow',
  APPROVED:    'green',
}

const STATUS_LABEL: Record<TimecardStatus, string> = {
  CLOCKED_IN:  'On Shift',
  CLOCKED_OUT: 'Clocked Out',
  FLAGGED:     'Flagged',
  APPROVED:    'Approved',
}

// ── Export CSV ────────────────────────────────────────────────────────────────

function exportCsv(records: Timecard[], staffName: string, from: string, to: string) {
  const rows = [
    ['Date', 'Clock In', 'Clock Out', 'Duration', 'Status', 'Notes'],
    ...records.map(tc => [
      fmtDate(tc.clocked_in_at),
      fmtTime(tc.clocked_in_at),
      tc.clocked_out_at ? fmtTime(tc.clocked_out_at) : '—',
      fmtDuration(tc.total_minutes),
      STATUS_LABEL[tc.status],
      tc.notes ?? '',
    ]),
  ]
  const csv = rows
    .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
  const a   = document.createElement('a')
  a.href     = url
  a.download = `my-timecards-${staffName.replace(/\s+/g, '-').toLowerCase()}-${from}-to-${to}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MyTimecards() {
  const { data: currentUser } = useCurrentUser()
  const [range, setRange]     = useState(defaultRange)

  const { data: timecards = [], isLoading, isError, refetch, isFetching } = useQuery<Timecard[]>({
    queryKey: ['my-timecards', currentUser?.id, range],
    queryFn: async () => {
      if (!currentUser?.id) return []
      const { gte, lte } = toJamaicaBounds(range.from, range.to)
      const { data, error } = await supabase
        .from('timecards')
        .select('*')
        .eq('staff_id', currentUser.id)
        .gte('clocked_in_at', gte)
        .lte('clocked_in_at', lte)
        .order('clocked_in_at', { ascending: false })
        .limit(500)
      if (error) throw error
      return (data ?? []) as Timecard[]
    },
    enabled: !!currentUser?.id,
    staleTime: 60_000,
  })

  // Aggregate stats for the period
  const totalMinutes   = timecards
    .filter(tc => tc.total_minutes != null)
    .reduce((sum, tc) => sum + (tc.total_minutes ?? 0), 0)
  const approvedCount  = timecards.filter(tc => tc.status === 'APPROVED').length
  const flaggedCount   = timecards.filter(tc => tc.status === 'FLAGGED').length
  const totalHoursInt  = Math.floor(totalMinutes / 60)
  const totalMinRem    = totalMinutes % 60

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Hours"
        subtitle="Your timecard history — clock-in/out records for your own shifts only"
        breadcrumb={['Staff', 'My Hours']}
        showSession
      />

      {/* Controls */}
      <div className="card p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between flex-wrap">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label htmlFor="mt-from" className="block text-xs font-medium text-gray-600 mb-1">From</label>
            <input
              id="mt-from"
              type="date"
              className="input"
              value={range.from}
              max={range.to}
              onChange={e => setRange(r => ({ ...r, from: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="mt-to" className="block text-xs font-medium text-gray-600 mb-1">To</label>
            <input
              id="mt-to"
              type="date"
              className="input"
              value={range.to}
              min={range.from}
              onChange={e => setRange(r => ({ ...r, to: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-ghost flex items-center gap-2 text-xs"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh timecards"
          >
            <ArrowClockwise
              size={15}
              aria-hidden="true"
              className={isFetching ? 'animate-spin' : ''}
              style={{ animationDuration: '600ms' }}
            />
            Refresh
          </button>
          {timecards.length > 0 && (
            <button
              className="btn btn-ghost flex items-center gap-2 text-xs"
              onClick={() => exportCsv(timecards, currentUser?.name ?? 'staff', range.from, range.to)}
              aria-label="Export my timecards as CSV"
            >
              <Export size={15} aria-hidden="true" />
              Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      {!isLoading && timecards.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Hours</p>
            <p className="num-lg">{(totalMinutes / 60).toFixed(1)}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {totalHoursInt}h {totalMinRem}m across {timecards.length} shift{timecards.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Approved</p>
            <p className="num-lg text-emerald-600">{approvedCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">shifts confirmed</p>
          </div>
          <div className="card p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Flagged</p>
            <p className={`num-lg ${flaggedCount > 0 ? 'text-amber-600' : 'text-gray-400'}`}>{flaggedCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">awaiting review</p>
          </div>
          <div className="card p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Period</p>
            <p className="text-sm font-semibold text-gray-800">{range.from}</p>
            <p className="text-xs text-gray-500 mt-0.5">to {range.to}</p>
          </div>
        </div>
      )}

      {/* Flagged notice */}
      {flaggedCount > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Warning size={18} className="mt-0.5 shrink-0 text-amber-500" aria-hidden="true" />
          <p>
            <strong>{flaggedCount} shift{flaggedCount !== 1 ? 's' : ''}</strong> flagged for review.
            Your manager will contact you to resolve the flag.
            Flagged shifts are excluded from payroll calculations until resolved.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading && (
          <div className="py-16 text-center text-gray-500 text-sm">Loading your timecard history…</div>
        )}
        {isError && (
          <div className="py-16 text-center text-red-500 text-sm">Failed to load timecards. Please try refreshing.</div>
        )}
        {!isLoading && !isError && timecards.length === 0 && (
          <div className="py-16 text-center">
            <Clock size={40} className="mx-auto text-gray-300 mb-3" aria-hidden="true" />
            <p className="text-gray-500 text-sm">No timecard records found for this period.</p>
            <p className="text-gray-400 text-xs mt-1">Clock in/out records will appear here once shifts are logged.</p>
          </div>
        )}
        {!isLoading && !isError && timecards.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table-compact w-full" aria-label={`Timecard history for ${currentUser?.name ?? 'staff member'}`}>
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Clock In</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Clock Out</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {timecards.map(tc => {
                  const hasFlag = tc.ai_flag_overtime || tc.ai_flag_short_shift || tc.ai_flag_anomaly
                  return (
                    <tr key={tc.id} className={`hover:bg-gray-50 ${hasFlag ? 'border-l-2 border-l-amber-400' : ''}`}>
                      <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">
                        {fmtDate(tc.clocked_in_at)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-mono whitespace-nowrap">
                        {fmtTime(tc.clocked_in_at)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-mono whitespace-nowrap">
                        {tc.clocked_out_at ? fmtTime(tc.clocked_out_at) : (
                          <span className="text-blue-600 font-medium text-xs">On shift</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="num text-gray-700 flex items-center gap-1.5">
                          <Timer size={13} className="text-gray-400" aria-hidden="true" />
                          {fmtDuration(tc.total_minutes)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {tc.status === 'APPROVED' && (
                            <CheckCircle size={13} className="text-emerald-500 shrink-0" weight="fill" aria-hidden="true" />
                          )}
                          {tc.status === 'FLAGGED' && (
                            <Warning size={13} className="text-amber-500 shrink-0" weight="fill" aria-hidden="true" />
                          )}
                          <StatusPill
                            label={STATUS_LABEL[tc.status]}
                            variant={STATUS_PILL_VARIANT[tc.status]}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 max-w-48 truncate">
                        {hasFlag && tc.ai_flag_reason && (
                          <span className="text-amber-600 font-medium mr-1" aria-hidden="true">⚑</span>
                        )}
                        {tc.notes ?? (hasFlag ? tc.ai_flag_reason ?? '—' : '—')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Period summary footer */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
              <span>
                {timecards.length} shift record{timecards.length !== 1 ? 's' : ''} — {range.from} to {range.to}
              </span>
              <span className="font-medium text-gray-700">
                Period total: {totalHoursInt}h {totalMinRem}m
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Employment Act disclosure */}
      <p className="text-xs text-gray-400 text-center">
        These records are read-only. To dispute a timecard entry, speak with your manager.
        Approved shifts are confirmed for payroll processing.
        Record-keeping is maintained as required by the Jamaican Employment Act.
      </p>
    </div>
  )
}

export default MyTimecards
