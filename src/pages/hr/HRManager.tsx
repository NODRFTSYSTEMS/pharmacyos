// HR Manager — Salaries, Leave Requests, Leave Calendar
// Jamaican Employment Act aligned: maintains salary and leave records required
// under the Minimum Wage Act and Employment (Termination and Redundancy Payments) Act.
// Access: staff_manage (ADMIN / MANAGER only)

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CurrencyDollar, CalendarBlank, ClipboardText, CheckCircle, XCircle, Plus, X,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { PageHeader, Pill as StatusPill, EmptyRow } from '../../components/Shell'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { AUDIT_ACTIONS } from '../../constants/audit-actions'

// ── Types ─────────────────────────────────────────────────────────────────────

type SalaryType   = 'HOURLY' | 'WEEKLY' | 'FORTNIGHTLY' | 'MONTHLY'
type LeaveType    = 'ANNUAL' | 'SICK' | 'BEREAVEMENT' | 'STUDY' | 'MATERNITY' | 'PATERNITY' | 'OTHER'
type LeaveStatus  = 'PENDING' | 'APPROVED' | 'DENIED' | 'CANCELLED'

interface StaffRow {
  id: string
  full_name: string
  role: string
  is_active: boolean
}

interface SalaryRecord {
  id: string
  staff_id: string
  salary_type: SalaryType
  amount: number
  currency: string
  effective_from: string
  effective_to: string | null
  notes: string | null
}

interface StaffWithSalary extends StaffRow {
  salary: SalaryRecord | null
}

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

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-JM', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

function fmtAmount(amount: number): string {
  return amount.toLocaleString('en-JM', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  ANNUAL: 'Annual', SICK: 'Sick', BEREAVEMENT: 'Bereavement',
  STUDY: 'Study', MATERNITY: 'Maternity', PATERNITY: 'Paternity', OTHER: 'Other',
}

const LEAVE_TYPE_COLORS: Record<LeaveType, 'blue' | 'yellow' | 'gray' | 'purple' | 'green' | 'red'> = {
  ANNUAL: 'blue', SICK: 'yellow', BEREAVEMENT: 'gray',
  STUDY: 'blue', MATERNITY: 'purple', PATERNITY: 'purple', OTHER: 'gray',
}

// ── Data hooks ────────────────────────────────────────────────────────────────

function useStaffWithSalaries(): { data: StaffWithSalary[]; isLoading: boolean } {
  const staffQ = useQuery<StaffRow[]>({
    queryKey: ['hr-staff-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_profiles')
        .select('id, full_name, role, is_active')
        .order('full_name')
      if (error) throw error
      return (data ?? []) as StaffRow[]
    },
    staleTime: 60_000,
  })

  const salaryQ = useQuery<SalaryRecord[]>({
    queryKey: ['hr-salaries'],
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10)
      const { data, error } = await supabase
        .from('staff_salaries')
        .select('id, staff_id, salary_type, amount, currency, effective_from, effective_to, notes')
        .or(`effective_to.is.null,effective_to.gte.${today}`)
        .order('effective_from', { ascending: false })
      if (error) throw error
      return (data ?? []) as SalaryRecord[]
    },
    staleTime: 60_000,
  })

  const data = useMemo(() => {
    const staff = staffQ.data ?? []
    const salaries = salaryQ.data ?? []
    // Map: one active salary per staff member (first match = most recent)
    const salaryMap = new Map<string, SalaryRecord>()
    for (const s of salaries) {
      if (!salaryMap.has(s.staff_id)) salaryMap.set(s.staff_id, s)
    }
    return staff.map(s => ({ ...s, salary: salaryMap.get(s.id) ?? null }))
  }, [staffQ.data, salaryQ.data])

  return { data, isLoading: staffQ.isLoading || salaryQ.isLoading }
}

function usePendingLeave() {
  return useQuery<LeaveRecord[]>({
    queryKey: ['hr-leave-pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_leaves')
        .select('id, staff_id, staff_name, staff_role, leave_type, start_date, end_date, days_requested, reason, status, reviewed_by_name, reviewed_at, review_note, created_at')
        .eq('status', 'PENDING')
        .order('created_at', { ascending: true })
      if (error) throw error
      return (data ?? []) as LeaveRecord[]
    },
    staleTime: 30_000,
  })
}

function useApprovedLeave(year: number, month: number) {
  return useQuery<LeaveRecord[]>({
    queryKey: ['hr-leave-approved', year, month],
    queryFn: async () => {
      const firstDay = `${year}-${String(month).padStart(2, '0')}-01`
      const lastDay  = new Date(year, month, 0).toISOString().slice(0, 10)
      const { data, error } = await supabase
        .from('staff_leaves')
        .select('id, staff_id, staff_name, staff_role, leave_type, start_date, end_date, days_requested, reason, status, reviewed_by_name, reviewed_at, review_note, created_at')
        .eq('status', 'APPROVED')
        .lte('start_date', lastDay)
        .gte('end_date', firstDay)
        .order('start_date')
      if (error) throw error
      return (data ?? []) as LeaveRecord[]
    },
    staleTime: 60_000,
  })
}

// ── SalaryForm ────────────────────────────────────────────────────────────────

interface SalaryFormProps {
  staff: StaffWithSalary
  onClose: () => void
}

function SalaryForm({ staff, onClose }: SalaryFormProps) {
  const { data: currentUser } = useCurrentUser()
  const qc = useQueryClient()

  const [salaryType,    setSalaryType]    = useState<SalaryType>(staff.salary?.salary_type ?? 'HOURLY')
  const [amount,        setAmount]        = useState(staff.salary ? String(staff.salary.amount) : '')
  const [effectiveFrom, setEffectiveFrom] = useState(staff.salary?.effective_from ?? new Date().toISOString().slice(0, 10))
  const [notes,         setNotes]         = useState(staff.salary?.notes ?? '')
  const [error,         setError]         = useState<string | null>(null)

  const saveMutation = useMutation({
    mutationFn: async () => {
      const parsedAmount = parseFloat(amount)
      if (isNaN(parsedAmount) || parsedAmount < 0) throw new Error('Enter a valid amount')

      // If updating existing active record, close it first
      if (staff.salary) {
        const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
        const { error: closeErr } = await supabase
          .from('staff_salaries')
          .update({ effective_to: yesterday })
          .eq('id', staff.salary.id)
        if (closeErr) throw closeErr
      }

      // Insert new salary record
      const { data: inserted, error: insertErr } = await supabase
        .from('staff_salaries')
        .insert({
          staff_id:       staff.id,
          salary_type:    salaryType,
          amount:         parsedAmount,
          currency:       'JMD',
          effective_from: effectiveFrom,
          notes:          notes.trim() || null,
          created_by:     currentUser?.id ?? null,
        })
        .select('id')
        .single()
      if (insertErr) throw insertErr

      // Audit
      await supabase.from('audit_log').insert({
        actor_id:   currentUser?.id ?? null,
        actor_name: currentUser?.name ?? 'System',
        action:     staff.salary ? AUDIT_ACTIONS.SALARY_UPDATE : AUDIT_ACTIONS.SALARY_CREATE,
        table_name: 'staff_salaries',
        record_id:  inserted.id,
        details:    { staff_name: staff.full_name, salary_type: salaryType, amount: parsedAmount },
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hr-salaries'] })
      onClose()
    },
    onError: (e: Error) => setError(e.message),
  })

  return (
    <div className="card p-5 border-l-4 border-l-blue-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 text-sm">
          {staff.salary ? 'Update Salary' : 'Set Salary'} — {staff.full_name}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Pay Type</label>
          <select
            className="input w-full"
            value={salaryType}
            onChange={e => setSalaryType(e.target.value as SalaryType)}
          >
            <option value="HOURLY">Hourly</option>
            <option value="WEEKLY">Weekly</option>
            <option value="FORTNIGHTLY">Fortnightly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Amount (JMD)</label>
          <input
            type="number"
            min={0}
            step={0.01}
            className="input w-full"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Effective From</label>
          <input
            type="date"
            className="input w-full"
            value={effectiveFrom}
            onChange={e => setEffectiveFrom(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">Notes (optional)</label>
        <input
          type="text"
          className="input w-full"
          placeholder="e.g. Probation rate, post-review increase"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>
      {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
      <div className="flex gap-2">
        <button
          className="btn btn-primary"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending || !amount}
        >
          {saveMutation.isPending ? 'Saving…' : 'Save'}
        </button>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}

// ── Tab: Salaries ─────────────────────────────────────────────────────────────

function SalariesTab() {
  const { data: staff, isLoading } = useStaffWithSalaries()
  const [editingId, setEditingId]   = useState<string | null>(null)

  return (
    <section aria-labelledby="salaries-heading">
      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm" aria-labelledby="salaries-heading">
          <caption id="salaries-heading" className="sr-only">Staff salary records</caption>
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Staff Member</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Role</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Pay Type</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500">Amount (JMD)</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Effective From</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">Loading…</td>
              </tr>
            )}
            {!isLoading && staff.length === 0 && (
              <EmptyRow colSpan={6} message="No staff members found." />
            )}
            {!isLoading && staff.map(s => (
              <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800">{s.full_name}</td>
                <td className="px-4 py-3">
                  <StatusPill variant="blue" label={s.role} />
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {s.salary ? s.salary.salary_type.charAt(0) + s.salary.salary_type.slice(1).toLowerCase() : '—'}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-800">
                  {s.salary ? `J$${fmtAmount(s.salary.amount)}` : <span className="text-gray-400">Not set</span>}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {s.salary ? fmtDate(s.salary.effective_from) : '—'}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setEditingId(editingId === s.id ? null : s.id)}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    aria-label={`${s.salary ? 'Edit' : 'Add'} salary for ${s.full_name}`}
                  >
                    {s.salary
                      ? <><ClipboardText size={12} />Edit</>
                      : <><Plus size={12} />Add</>
                    }
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inline salary form */}
      {editingId && (() => {
        const staffMember = staff.find(s => s.id === editingId)
        if (!staffMember) return null
        return (
          <div className="mt-4">
            <SalaryForm staff={staffMember} onClose={() => setEditingId(null)} />
          </div>
        )
      })()}

      <p className="mt-2 text-xs text-gray-400">
        Salary records are governed by the Jamaica Minimum Wage Act and Employment (Termination and
        Redundancy Payments) Act. Maintain accurate records for all permanent and contract staff.
      </p>
    </section>
  )
}

// ── Tab: Leave Requests ───────────────────────────────────────────────────────

function LeaveRequestsTab() {
  const { data: currentUser } = useCurrentUser()
  const qc = useQueryClient()
  const pendingQ = usePendingLeave()
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({})
  const [subTab, setSubTab] = useState<'pending' | 'history'>('pending')

  const historyQ = useQuery<LeaveRecord[]>({
    queryKey: ['hr-leave-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_leaves')
        .select('id, staff_id, staff_name, staff_role, leave_type, start_date, end_date, days_requested, reason, status, reviewed_by_name, reviewed_at, review_note, created_at')
        .in('status', ['APPROVED', 'DENIED', 'CANCELLED'])
        .order('created_at', { ascending: false })
        .limit(100)
      if (error) throw error
      return (data ?? []) as LeaveRecord[]
    },
    staleTime: 60_000,
    enabled: subTab === 'history',
  })

  const reviewMutation = useMutation({
    mutationFn: async ({ id, decision }: { id: string; decision: 'APPROVED' | 'DENIED' }) => {
      const { error } = await supabase
        .from('staff_leaves')
        .update({
          status:           decision,
          reviewed_by:      currentUser?.id ?? null,
          reviewed_by_name: currentUser?.name ?? 'Manager',
          reviewed_at:      new Date().toISOString(),
          review_note:      reviewNote[id]?.trim() || null,
        })
        .eq('id', id)
      if (error) throw error

      const action = decision === 'APPROVED' ? AUDIT_ACTIONS.LEAVE_REQUEST_APPROVE : AUDIT_ACTIONS.LEAVE_REQUEST_DENY
      await supabase.from('audit_log').insert({
        actor_id:   currentUser?.id ?? null,
        actor_name: currentUser?.name ?? 'System',
        action,
        table_name: 'staff_leaves',
        record_id:  id,
        details:    { decision, review_note: reviewNote[id] ?? null },
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hr-leave-pending'] })
      qc.invalidateQueries({ queryKey: ['hr-leave-history'] })
    },
  })

  const pending = pendingQ.data ?? []

  return (
    <section aria-label="Leave requests">
      {/* Sub-tab toggle */}
      <div className="flex gap-1 mb-4">
        {(['pending', 'history'] as const).map(t => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              subTab === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t === 'pending' ? `Pending (${pending.length})` : 'History'}
          </button>
        ))}
      </div>

      {subTab === 'pending' && (
        <>
          {pendingQ.isLoading && <p className="text-sm text-gray-400 py-4">Loading…</p>}
          {!pendingQ.isLoading && pending.length === 0 && (
            <div className="card p-8 text-center text-gray-400 text-sm">
              No pending leave requests.
            </div>
          )}
          <div className="space-y-3">
            {pending.map(r => (
              <div key={r.id} className="card p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{r.staff_name}</p>
                    <p className="text-xs text-gray-500">{r.staff_role}</p>
                  </div>
                  <StatusPill variant={LEAVE_TYPE_COLORS[r.leave_type]} label={LEAVE_TYPE_LABELS[r.leave_type]} />
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs text-gray-600 mb-3">
                  <div><span className="text-gray-400">From</span><br />{fmtDate(r.start_date)}</div>
                  <div><span className="text-gray-400">To</span><br />{fmtDate(r.end_date)}</div>
                  <div><span className="text-gray-400">Days</span><br />{r.days_requested}</div>
                </div>
                {r.reason && <p className="text-xs text-gray-500 mb-3 italic">"{r.reason}"</p>}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="input flex-1 text-xs"
                    placeholder="Review note (optional)"
                    value={reviewNote[r.id] ?? ''}
                    onChange={e => setReviewNote(prev => ({ ...prev, [r.id]: e.target.value }))}
                  />
                  <button
                    onClick={() => reviewMutation.mutate({ id: r.id, decision: 'APPROVED' })}
                    disabled={reviewMutation.isPending}
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700"
                  >
                    <CheckCircle size={12} />Approve
                  </button>
                  <button
                    onClick={() => reviewMutation.mutate({ id: r.id, decision: 'DENIED' })}
                    disabled={reviewMutation.isPending}
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-600 text-white text-xs font-medium hover:bg-red-700"
                  >
                    <XCircle size={12} />Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {subTab === 'history' && (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Staff</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Type</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Dates</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Days</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Reviewed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {historyQ.isLoading && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">Loading…</td></tr>
              )}
              {!historyQ.isLoading && (historyQ.data ?? []).length === 0 && (
                <EmptyRow colSpan={6} message="No leave history." />
              )}
              {(historyQ.data ?? []).map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-800 font-medium text-xs">{r.staff_name}</td>
                  <td className="px-4 py-3">
                    <StatusPill variant={LEAVE_TYPE_COLORS[r.leave_type]} label={LEAVE_TYPE_LABELS[r.leave_type]} />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {fmtDate(r.start_date)} – {fmtDate(r.end_date)}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{r.days_requested}</td>
                  <td className="px-4 py-3">
                    <StatusPill
                      variant={r.status === 'APPROVED' ? 'green' : r.status === 'DENIED' ? 'red' : 'gray'}
                      label={r.status.charAt(0) + r.status.slice(1).toLowerCase()}
                    />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{r.reviewed_by_name ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

// ── Tab: Leave Calendar ───────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function LeaveCalendarTab() {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)

  const { data: leaves = [], isLoading } = useApprovedLeave(year, month)

  const daysInMonth = new Date(year, month, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  function navigate(delta: number) {
    let m = month + delta
    let y = year
    if (m > 12) { m = 1;  y++ }
    if (m < 1)  { m = 12; y-- }
    setMonth(m)
    setYear(y)
  }

  // For each day, find leaves that overlap
  function leavesOnDay(day: number): LeaveRecord[] {
    const d = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return leaves.filter(l => l.start_date <= d && l.end_date >= d)
  }

  const LEAVE_COLORS: Record<LeaveType, string> = {
    ANNUAL:     'bg-blue-100 text-blue-700',
    SICK:       'bg-amber-100 text-amber-700',
    BEREAVEMENT:'bg-gray-100 text-gray-600',
    STUDY:      'bg-blue-50 text-blue-600',
    MATERNITY:  'bg-purple-100 text-purple-700',
    PATERNITY:  'bg-purple-50 text-purple-600',
    OTHER:      'bg-gray-50 text-gray-500',
  }

  return (
    <section aria-label="Leave calendar">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1.5 rounded text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          ← Prev
        </button>
        <h3 className="font-semibold text-gray-800">
          {MONTH_NAMES[month - 1]} {year}
        </h3>
        <button
          onClick={() => navigate(1)}
          className="px-3 py-1.5 rounded text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          Next →
        </button>
      </div>

      {isLoading && <p className="text-sm text-gray-400 py-4">Loading calendar…</p>}

      {!isLoading && (
        <>
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="bg-gray-50 py-1.5 text-center text-xs font-medium text-gray-500">{d}</div>
            ))}
            {/* Leading empty cells */}
            {Array.from({ length: new Date(year, month - 1, 1).getDay() }, (_, i) => (
              <div key={`empty-${i}`} className="bg-white min-h-[64px]" />
            ))}
            {days.map(day => {
              const dayLeaves = leavesOnDay(day)
              const isToday = year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate()
              return (
                <div key={day} className={`bg-white min-h-[64px] p-1.5 ${isToday ? 'ring-2 ring-inset ring-blue-400' : ''}`}>
                  <p className={`text-xs font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>{day}</p>
                  {dayLeaves.slice(0, 2).map(l => (
                    <div key={l.id} className={`text-[10px] rounded px-1 py-0.5 mb-0.5 truncate ${LEAVE_COLORS[l.leave_type]}`}>
                      {l.staff_name.split(' ')[0]}
                    </div>
                  ))}
                  {dayLeaves.length > 2 && (
                    <div className="text-[10px] text-gray-400">+{dayLeaves.length - 2} more</div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.entries(LEAVE_COLORS) as [LeaveType, string][]).map(([type, classes]) => (
              <span key={type} className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${classes}`}>
                {LEAVE_TYPE_LABELS[type]}
              </span>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function HRManager() {
  const [tab, setTab] = useState<'leave' | 'salaries' | 'calendar'>('leave')

  const TAB_CONFIG = [
    { key: 'leave'     as const, label: 'Leave Requests', icon: ClipboardText },
    { key: 'salaries'  as const, label: 'Salaries',       icon: CurrencyDollar },
    { key: 'calendar'  as const, label: 'Leave Calendar', icon: CalendarBlank },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="HR Manager"
        subtitle="Staff salaries, leave approvals, and leave calendar — Jamaican Employment Act aligned"
        breadcrumb={['Staff', 'HR Manager']}
      />

      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-gray-200 pb-0">
        {TAB_CONFIG.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t transition-colors ${
              tab === t.key
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-px bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <t.icon size={14} aria-hidden="true" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'leave'     && <LeaveRequestsTab />}
      {tab === 'salaries'  && <SalariesTab />}
      {tab === 'calendar'  && <LeaveCalendarTab />}
    </div>
  )
}

export default HRManager
