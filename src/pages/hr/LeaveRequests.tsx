import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Calendar, Plus, X, CheckCircle, XCircle, Clock,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { PageHeader, Pill as StatusPill } from '../../components/Shell'
import { usePermission } from '../../hooks/usePermission'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { AUDIT_ACTIONS } from '../../constants/audit-actions'

// ── Types ─────────────────────────────────────────────────────────────────────

type LeaveType   = 'ANNUAL' | 'SICK' | 'BEREAVEMENT' | 'STUDY' | 'MATERNITY' | 'PATERNITY' | 'OTHER'
type LeaveStatus = 'PENDING' | 'APPROVED' | 'DENIED' | 'CANCELLED'

interface LeaveRecord {
  id: string
  staff_id: string
  staff_name: string
  staff_role: string
  leave_type: LeaveType
  start_date: string
  end_date: string
  days_requested: number
  reason: string | null
  status: LeaveStatus
  reviewed_by_name: string | null
  reviewed_at: string | null
  review_note: string | null
  created_at: string
}

interface DrawerState {
  leave_type: LeaveType
  start_date: string
  end_date: string
  reason: string
}

const EMPTY_FORM: DrawerState = {
  leave_type: 'ANNUAL',
  start_date: '',
  end_date:   '',
  reason:     '',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-JM', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

const STATUS_VARIANT: Record<LeaveStatus, 'yellow' | 'green' | 'red' | 'gray'> = {
  PENDING:   'yellow',
  APPROVED:  'green',
  DENIED:    'red',
  CANCELLED: 'gray',
}

const LEAVE_LABELS: Record<LeaveType, string> = {
  ANNUAL:     'Annual',
  SICK:       'Sick',
  BEREAVEMENT:'Bereavement',
  STUDY:      'Study',
  MATERNITY:  'Maternity',
  PATERNITY:  'Paternity',
  OTHER:      'Other',
}

// ── Leave Request Drawer ──────────────────────────────────────────────────────

function LeaveDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const qc = useQueryClient()
  const { data: currentUser } = useCurrentUser()
  const [form, setForm] = useState<DrawerState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof DrawerState, string>>>({})

  function set<K extends keyof DrawerState>(k: K, v: DrawerState[K]) {
    setForm(prev => ({ ...prev, [k]: v }))
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: undefined }))
  }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.start_date) e.start_date = 'Start date is required'
    if (!form.end_date)   e.end_date   = 'End date is required'
    if (form.start_date && form.end_date && form.end_date < form.start_date)
      e.end_date = 'End date must be on or after start date'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: inserted, error } = await supabase
        .from('staff_leaves')
        .insert({
          staff_id:   currentUser?.id ?? user?.id,
          staff_name: currentUser?.name ?? user?.email ?? 'Unknown',
          staff_role: currentUser?.role ?? 'UNKNOWN',
          leave_type: form.leave_type,
          start_date: form.start_date,
          end_date:   form.end_date,
          reason:     form.reason.trim() || null,
          status:     'PENDING',
        })
        .select('id')
        .single()
      if (error) throw error
      const { error: auditError } = await supabase.from('audit_log').insert({
        actor_id:   user?.id ?? null,
        actor_name: user?.email ?? 'System',
        action:     AUDIT_ACTIONS.LEAVE_REQUEST_SUBMIT,
        table_name: 'staff_leaves',
        record_id:  inserted.id,
        details:    { leave_type: form.leave_type, start_date: form.start_date, end_date: form.end_date },
      })
      if (auditError) console.error('audit_log write failed', auditError)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff_leaves'] })
      setForm(EMPTY_FORM)
      onClose()
    },
  })

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-30" aria-hidden="true" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Request leave"
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-40 flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Request Leave</h2>
          <button className="btn btn-ghost p-2" onClick={onClose} aria-label="Close">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label htmlFor="lr-type" className="block text-sm font-medium text-gray-700 mb-1">
              Leave Type
            </label>
            <select
              id="lr-type"
              className="input w-full"
              value={form.leave_type}
              onChange={e => set('leave_type', e.target.value as LeaveType)}
            >
              {(Object.entries(LEAVE_LABELS) as [LeaveType, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="lr-start" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="lr-start"
                type="date"
                className={`input w-full ${errors.start_date ? 'border-red-400' : ''}`}
                value={form.start_date}
                onChange={e => set('start_date', e.target.value)}
              />
              {errors.start_date && <p className="mt-1 text-xs text-red-600" role="alert">{errors.start_date}</p>}
            </div>
            <div>
              <label htmlFor="lr-end" className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="lr-end"
                type="date"
                className={`input w-full ${errors.end_date ? 'border-red-400' : ''}`}
                value={form.end_date}
                min={form.start_date}
                onChange={e => set('end_date', e.target.value)}
              />
              {errors.end_date && <p className="mt-1 text-xs text-red-600" role="alert">{errors.end_date}</p>}
            </div>
          </div>

          {form.start_date && form.end_date && form.end_date >= form.start_date && (
            <p className="text-xs text-blue-600 font-medium">
              {Math.max(1,
                Math.round((new Date(form.end_date).getTime() - new Date(form.start_date).getTime()) / 86_400_000) + 1
              )} day{Math.max(1,
                Math.round((new Date(form.end_date).getTime() - new Date(form.start_date).getTime()) / 86_400_000) + 1
              ) !== 1 ? 's' : ''} requested
            </p>
          )}

          <div>
            <label htmlFor="lr-reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason <span className="text-xs text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="lr-reason"
              rows={3}
              className="input w-full resize-none"
              value={form.reason}
              onChange={e => set('reason', e.target.value)}
              placeholder="Brief description of reason for leave…"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button className="btn btn-ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={() => { if (validate()) mutation.mutate() }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Submitting…' : 'Submit Request'}
          </button>
        </div>
        {mutation.isError && (
          <p className="px-6 pb-3 text-xs text-red-600" role="alert">
            Failed to submit. Please try again.
          </p>
        )}
      </aside>
    </>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function LeaveRequests() {
  const qc = useQueryClient()
  const { data: currentUser } = useCurrentUser()
  const canManage = usePermission('timecard_manage')
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Own leave history
  const { data: myLeaves = [], isLoading: loadingOwn } = useQuery<LeaveRecord[]>({
    queryKey: ['staff_leaves', 'own', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return []
      const { data, error } = await supabase
        .from('staff_leaves')
        .select('*')
        .eq('staff_id', currentUser.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as LeaveRecord[]
    },
    enabled: !!currentUser?.id,
  })

  // All pending requests — managers only
  const { data: pendingAll = [] } = useQuery<LeaveRecord[]>({
    queryKey: ['staff_leaves', 'pending_all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_leaves')
        .select('*')
        .eq('status', 'PENDING')
        .order('created_at', { ascending: true })
      if (error) throw error
      return (data ?? []) as LeaveRecord[]
    },
    enabled: canManage,
  })

  const reviewMutation = useMutation({
    mutationFn: async ({ id, decision, note }: { id: string; decision: 'APPROVED' | 'DENIED'; note?: string }) => {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('staff_leaves')
        .update({
          status:           decision,
          reviewed_by_name: currentUser?.name ?? user?.email ?? 'Manager',
          reviewed_at:      new Date().toISOString(),
          review_note:      note ?? null,
          updated_at:       new Date().toISOString(),
        })
        .eq('id', id)
      if (error) throw error
      const action = decision === 'APPROVED'
        ? AUDIT_ACTIONS.LEAVE_REQUEST_APPROVE
        : AUDIT_ACTIONS.LEAVE_REQUEST_DENY
      const { error: auditError } = await supabase.from('audit_log').insert({
        actor_id:   user?.id ?? null,
        actor_name: user?.email ?? 'System',
        action,
        table_name: 'staff_leaves',
        record_id:  id,
        details:    { decision, note: note ?? null },
      })
      if (auditError) console.error('audit_log write failed', auditError)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff_leaves'] })
    },
  })

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('staff_leaves')
        .update({ status: 'CANCELLED', updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
      const { error: auditError } = await supabase.from('audit_log').insert({
        actor_id:   user?.id ?? null,
        actor_name: user?.email ?? 'System',
        action:     AUDIT_ACTIONS.LEAVE_REQUEST_CANCEL,
        table_name: 'staff_leaves',
        record_id:  id,
        details:    {},
      })
      if (auditError) console.error('audit_log write failed', auditError)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['staff_leaves'] }),
  })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Leave Requests"
        subtitle="Submit and track staff leave"
        breadcrumb={['HR', 'Leave Requests']}
        cta={
          <button className="btn btn-primary flex items-center gap-2" onClick={() => setDrawerOpen(true)}>
            <Plus size={18} aria-hidden="true" />
            Request Leave
          </button>
        }
      />

      {/* Pending approvals — managers only */}
      {canManage && pendingAll.length > 0 && (
        <section aria-labelledby="pending-heading">
          <h2 id="pending-heading" className="section-title mb-3 flex items-center gap-2">
            <Clock size={16} className="text-amber-500" aria-hidden="true" />
            Pending Approval ({pendingAll.length})
          </h2>
          <div className="card divide-y divide-gray-100">
            {pendingAll.map(leave => (
              <div key={leave.id} className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{leave.staff_name}
                    <span className="ml-2 text-xs text-gray-400 font-normal">{leave.staff_role}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {LEAVE_LABELS[leave.leave_type]} · {fmtDate(leave.start_date)} – {fmtDate(leave.end_date)}
                    {' '}({leave.days_requested} day{leave.days_requested !== 1 ? 's' : ''})
                  </p>
                  {leave.reason && <p className="text-xs text-gray-400 italic mt-0.5">"{leave.reason}"</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    className="btn btn-ghost text-xs gap-1.5 text-emerald-700 hover:bg-emerald-50"
                    onClick={() => reviewMutation.mutate({ id: leave.id, decision: 'APPROVED' })}
                    disabled={reviewMutation.isPending}
                  >
                    <CheckCircle size={14} aria-hidden="true" />
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost text-xs gap-1.5 text-red-600 hover:bg-red-50"
                    onClick={() => reviewMutation.mutate({ id: leave.id, decision: 'DENIED' })}
                    disabled={reviewMutation.isPending}
                  >
                    <XCircle size={14} aria-hidden="true" />
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Own leave history */}
      <section aria-labelledby="history-heading">
        <h2 id="history-heading" className="section-title mb-3">My Leave History</h2>
        <div className="card overflow-hidden">
          {loadingOwn ? (
            <div className="py-12 text-center text-sm text-gray-400">Loading…</div>
          ) : myLeaves.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar size={36} className="mx-auto text-gray-200 mb-3" aria-hidden="true" />
              <p className="text-sm text-gray-400">No leave requests on record.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-compact w-full" aria-label="My leave history">
                <thead>
                  <tr>
                    <th scope="col" className="text-left">Type</th>
                    <th scope="col" className="text-left">From</th>
                    <th scope="col" className="text-left">To</th>
                    <th scope="col" className="text-right">Days</th>
                    <th scope="col" className="text-left">Status</th>
                    <th scope="col" className="text-left">Reviewed by</th>
                    <th scope="col" className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myLeaves.map(leave => (
                    <tr key={leave.id}>
                      <td className="font-medium text-gray-800">{LEAVE_LABELS[leave.leave_type]}</td>
                      <td className="text-gray-600">{fmtDate(leave.start_date)}</td>
                      <td className="text-gray-600">{fmtDate(leave.end_date)}</td>
                      <td className="text-right num">{leave.days_requested}</td>
                      <td>
                        <StatusPill
                          label={leave.status.charAt(0) + leave.status.slice(1).toLowerCase()}
                          variant={STATUS_VARIANT[leave.status]}
                        />
                      </td>
                      <td className="text-gray-500 text-xs">
                        {leave.reviewed_by_name
                          ? `${leave.reviewed_by_name}${leave.reviewed_at ? ` · ${fmtDate(leave.reviewed_at)}` : ''}`
                          : '—'}
                      </td>
                      <td className="text-right">
                        {leave.status === 'PENDING' && (
                          <button
                            type="button"
                            className="btn btn-ghost text-xs text-red-500 hover:bg-red-50 p-1.5"
                            onClick={() => cancelMutation.mutate(leave.id)}
                            disabled={cancelMutation.isPending}
                            aria-label="Cancel this request"
                          >
                            <X size={14} aria-hidden="true" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <LeaveDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
