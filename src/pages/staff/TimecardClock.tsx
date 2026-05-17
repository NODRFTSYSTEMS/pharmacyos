import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Clock, ClockCounterClockwise, CheckCircle, Warning } from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { todayJamaica, toJamaicaBounds } from '../../lib/date'
import { PageHeader, Pill as StatusPill } from '../../components/Shell'
import { AUDIT_ACTIONS } from '../../constants/audit-actions'
import type { Timecard } from '../../types/database'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-JM', { hour: '2-digit', minute: '2-digit' })
}

function fmtDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-JM', { day: '2-digit', month: 'short', year: 'numeric' })
}

const STATUS_VARIANT: Record<string, 'green' | 'yellow' | 'blue' | 'gray'> = {
  CLOCKED_IN:  'blue',
  CLOCKED_OUT: 'gray',
  FLAGGED:     'yellow',
  APPROVED:    'green',
}

// ── Elapsed time counter ──────────────────────────────────────────────────────

function useElapsed(clockedInAt: string | undefined): string {
  const [elapsed, setElapsed] = useState('')

  useEffect(() => {
    if (!clockedInAt) { setElapsed(''); return }
    const clocked = clockedInAt
    function update() {
      const mins = Math.floor((Date.now() - new Date(clocked).getTime()) / 60_000)
      setElapsed(fmtDuration(mins))
    }
    update()
    const timer = setInterval(update, 30_000)
    return () => clearInterval(timer)
  }, [clockedInAt])

  return elapsed
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TimecardClock() {
  const qc = useQueryClient()
  const { data: user } = useCurrentUser()
  const [notes, setNotes] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)

  const today = todayJamaica()

  // Today's active clock-in (CLOCKED_IN status)
  const { data: activeShift, isLoading: loadingActive } = useQuery<Timecard | null>({
    queryKey: ['timecard-active', user?.id, today],
    queryFn: async () => {
      if (!user) return null
      const { gte, lte } = toJamaicaBounds(today, today)
      const { data } = await supabase
        .from('timecards')
        .select('*')
        .eq('staff_id', user.id)
        .eq('status', 'CLOCKED_IN')
        .gte('clocked_in_at', gte)
        .lte('clocked_in_at', lte)
        .maybeSingle()
      return (data ?? null) as Timecard | null
    },
    enabled: !!user,
    refetchInterval: 60_000,
  })

  // Recent timecards (last 7 days, excluding active)
  const { data: recent = [] } = useQuery<Timecard[]>({
    queryKey: ['timecards-recent', user?.id],
    queryFn: async () => {
      if (!user) return []
      const from = new Date()
      from.setDate(from.getDate() - 6)
      const { data } = await supabase
        .from('timecards')
        .select('*')
        .eq('staff_id', user.id)
        .gte('clocked_in_at', from.toISOString())
        .neq('status', 'CLOCKED_IN')
        .order('clocked_in_at', { ascending: false })
        .limit(14)
      return (data ?? []) as Timecard[]
    },
    enabled: !!user,
  })

  const elapsed = useElapsed(activeShift?.clocked_in_at)

  // ── Clock In mutation ────────────────────────────────────────────────────────

  const clockIn = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No authenticated user')
      // Guard against duplicate CLOCKED_IN entry for today (race condition defence)
      const { gte, lte } = toJamaicaBounds(today, today)
      const { data: existing } = await supabase
        .from('timecards')
        .select('id')
        .eq('staff_id', user.id)
        .eq('status', 'CLOCKED_IN')
        .gte('clocked_in_at', gte)
        .lte('clocked_in_at', lte)
        .maybeSingle()
      if (existing) throw new Error('You already have an open shift today. Please clock out first.')
      const { data: tc, error } = await supabase.from('timecards').insert({
        staff_id:     user.id,
        staff_name:   user.name,
        staff_role:   user.role,
        notes:        notes.trim() || null,
      }).select('id').single()
      if (error) throw error
      try {
        await supabase.from('audit_log').insert({
          actor_id:   user.id,
          actor_name: user.name,
          action:     AUDIT_ACTIONS.TIMECARD_CLOCK_IN,
          table_name: 'timecards',
          record_id:  tc?.id,
          details:    { date: todayJamaica() },
        })
      } catch { /* best-effort */ }
    },
    onSuccess: () => {
      setNotes('')
      setActionError(null)
      qc.invalidateQueries({ queryKey: ['timecard-active'] })
      qc.invalidateQueries({ queryKey: ['timecards-recent'] })
    },
    onError: (err: Error) => setActionError(err.message),
  })

  // ── Clock Out mutation ───────────────────────────────────────────────────────

  const clockOut = useMutation({
    mutationFn: async () => {
      if (!activeShift) throw new Error('No active shift')
      const now          = new Date()
      const totalMinutes = Math.max(
        1,
        Math.round((now.getTime() - new Date(activeShift.clocked_in_at).getTime()) / 60_000),
      )
      const { error: updateErr } = await supabase
        .from('timecards')
        .update({ clocked_out_at: now.toISOString(), total_minutes: totalMinutes })
        .eq('id', activeShift.id)
      if (updateErr) throw updateErr

      const { error: analyzeErr } = await supabase.rpc('analyze_timecard', {
        p_timecard_id: activeShift.id,
      })
      if (analyzeErr) throw analyzeErr

      try {
        await supabase.from('audit_log').insert({
          actor_id:   user?.id ?? null,
          actor_name: user?.name ?? null,
          action:     AUDIT_ACTIONS.TIMECARD_CLOCK_OUT,
          table_name: 'timecards',
          record_id:  activeShift.id,
          details:    { total_minutes: totalMinutes },
        })
      } catch { /* best-effort */ }
    },
    onSuccess: () => {
      setActionError(null)
      qc.invalidateQueries({ queryKey: ['timecard-active'] })
      qc.invalidateQueries({ queryKey: ['timecards-recent'] })
    },
    onError: (err: Error) => setActionError(err.message),
  })

  const isPending = clockIn.isPending || clockOut.isPending

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-xl">
      <PageHeader
        title="My Timecard"
        subtitle="Record your shift start and end"
        breadcrumb={['Staff', 'My Timecard']}
      />

      {/* Clock card */}
      <div className="card p-6 mb-6">
        {loadingActive ? (
          <div className="text-center py-4 text-sm text-gray-400">Loading…</div>
        ) : activeShift ? (
          // Active shift
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
              <Clock size={28} weight="duotone" className="text-blue-500" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Currently Clocked In</p>
            <p className="text-2xl font-bold text-gray-800 tabular-nums">{elapsed}</p>
            <p className="text-xs text-gray-400 mt-1">Since {fmtTime(activeShift.clocked_in_at)}</p>
          </div>
        ) : (
          // Not clocked in
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <ClockCounterClockwise size={28} weight="duotone" className="text-gray-400" aria-hidden="true" />
            </div>
            <p className="text-sm text-gray-500 mb-1">You are not clocked in</p>
            <p className="text-xs text-gray-400">{new Date().toLocaleDateString('en-JM', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
        )}

        {/* Notes field */}
        {!activeShift && (
          <div className="mt-5">
            <label htmlFor="tc-notes" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Notes (optional)
            </label>
            <textarea
              id="tc-notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Shift notes, coverage reason…"
              rows={2}
              className="input h-auto py-2 resize-none"
            />
          </div>
        )}

        {/* Error */}
        {actionError && (
          <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded px-3 py-2.5 text-sm text-red-700">
            <Warning size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
            {actionError}
          </div>
        )}

        {/* Action button */}
        <div className="mt-5">
          {activeShift ? (
            <button
              onClick={() => clockOut.mutate()}
              disabled={isPending}
              className="btn btn-primary w-full gap-2 bg-red-600 hover:bg-red-700 border-red-600"
            >
              {clockOut.isPending && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none" aria-hidden="true" />
              )}
              <ClockCounterClockwise size={16} weight="bold" aria-hidden="true" />
              Clock Out
            </button>
          ) : (
            <button
              onClick={() => clockIn.mutate()}
              disabled={isPending}
              className="btn btn-primary w-full gap-2"
            >
              {clockIn.isPending && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none" aria-hidden="true" />
              )}
              <Clock size={16} weight="bold" aria-hidden="true" />
              Clock In
            </button>
          )}
        </div>
      </div>

      {/* Recent timecards */}
      {recent.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Recent Shifts</h2>
          <div className="card overflow-hidden">
            <div className="divide-y divide-gray-100">
              {recent.map(tc => (
                <div key={tc.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm text-gray-700">{fmtDate(tc.clocked_in_at)}</p>
                    <p className="text-xs text-gray-400 tabular-nums">
                      {fmtTime(tc.clocked_in_at)}
                      {tc.clocked_out_at ? ` → ${fmtTime(tc.clocked_out_at)}` : ''}
                      {tc.total_minutes ? ` · ${fmtDuration(tc.total_minutes)}` : ''}
                    </p>
                    {tc.ai_flag_reason && (
                      <p className="text-xs text-amber-600 mt-0.5">{tc.ai_flag_reason}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {tc.status === 'APPROVED' && (
                      <CheckCircle size={14} className="text-emerald-500" aria-label="Approved" />
                    )}
                    <StatusPill
                      label={tc.status.replace('_', ' ')}
                      variant={STATUS_VARIANT[tc.status] ?? 'gray'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
