import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Export, Users, CurrencyCircleDollar } from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { todayJamaica } from '../../lib/date'
import { PageHeader, PrintHeader, MetricCard } from '../../components/Shell'
import { AUDIT_ACTIONS } from '../../constants/audit-actions'

// ── Helpers ───────────────────────────────────────────────────────────────────

function defaultRange() {
  const today = todayJamaica()
  const from  = new Date(today)
  from.setDate(1)  // first of current month
  return { from: from.toISOString().slice(0, 10), to: today }
}

function fmtJmd(n: number) {
  return new Intl.NumberFormat('en-JM', {
    style: 'currency', currency: 'JMD', minimumFractionDigits: 2,
  }).format(n)
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-JM', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

// Calculate gross earnings for a salary record within a date range.
// Uses calendar-day precision; payroll periods are approximated.
function computePeriodEarnings(
  salaryType: string,
  amount: number,
  rangeFrom: string,
  rangeTo: string,
  effectiveFrom: string,
  effectiveTo: string | null,
): number {
  const from = new Date(Math.max(new Date(rangeFrom).getTime(), new Date(effectiveFrom).getTime()))
  const to   = effectiveTo
    ? new Date(Math.min(new Date(rangeTo).getTime(), new Date(effectiveTo).getTime()))
    : new Date(rangeTo)

  if (from > to) return 0

  const days = Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1

  switch (salaryType) {
    case 'HOURLY':
      // Assumes 8-hour workday, 5-day week
      return (days / 7) * 5 * 8 * amount
    case 'WEEKLY':
      return (days / 7) * amount
    case 'FORTNIGHTLY':
      return (days / 14) * amount
    case 'MONTHLY':
    default:
      return (days / 30.44) * amount
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface SalaryRow {
  id:             string
  staff_id:       string
  staff_name:     string
  staff_role:     string
  salary_type:    string
  amount:         number
  currency:       string
  effective_from: string
  effective_to:   string | null
  notes:          string | null
}

interface StaffProfileRow {
  id:        string
  full_name: string
  role:      string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SalaryReport() {
  const [range,          setRange]          = useState(defaultRange)
  const [staffFilter,    setStaffFilter]    = useState<string>('ALL')

  // All salary records (ADMIN/MANAGER only via RLS)
  const { data: salaries = [], isLoading, isError } = useQuery<SalaryRow[]>({
    queryKey: ['salary-report', range],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_salaries')
        .select(`
          id, staff_id, amount, salary_type, currency, effective_from, effective_to, notes,
          staff_profiles!inner(full_name, role)
        `)
        .or(`effective_to.is.null,effective_to.gte.${range.from}`)
        .order('effective_from', { ascending: false })
      if (error) throw error
      return (data ?? []).map((r: Record<string, unknown>) => {
        const sp = r['staff_profiles'] as { full_name: string; role: string } | null
        return {
          id:             r['id'] as string,
          staff_id:       r['staff_id'] as string,
          staff_name:     sp?.full_name ?? '—',
          staff_role:     sp?.role ?? '—',
          salary_type:    r['salary_type'] as string,
          amount:         Number(r['amount']),
          currency:       r['currency'] as string,
          effective_from: r['effective_from'] as string,
          effective_to:   r['effective_to'] as string | null,
          notes:          r['notes'] as string | null,
        }
      })
    },
  })

  // Unique staff list for filter dropdown
  const staffOptions: StaffProfileRow[] = useMemo(() => {
    const seen = new Map<string, StaffProfileRow>()
    salaries.forEach(s => {
      if (!seen.has(s.staff_id)) {
        seen.set(s.staff_id, { id: s.staff_id, full_name: s.staff_name, role: s.staff_role })
      }
    })
    return Array.from(seen.values()).sort((a, b) => a.full_name.localeCompare(b.full_name))
  }, [salaries])

  const filtered = useMemo(() =>
    staffFilter === 'ALL'
      ? salaries
      : salaries.filter(s => s.staff_id === staffFilter),
  [salaries, staffFilter])

  // Compute period earnings for each record in the filtered set
  const rowsWithEarnings = useMemo(() =>
    filtered.map(s => ({
      ...s,
      periodEarnings: computePeriodEarnings(
        s.salary_type,
        s.amount,
        range.from,
        range.to,
        s.effective_from,
        s.effective_to,
      ),
    })),
  [filtered, range])

  // Aggregate totals
  const totalEarnings  = rowsWithEarnings.reduce((sum, r) => sum + r.periodEarnings, 0)
  const uniqueStaff    = new Set(filtered.map(r => r.staff_id)).size
  const avgEarnings    = uniqueStaff > 0 ? totalEarnings / uniqueStaff : 0

  async function exportCsv() {
    const { data: { user } } = await supabase.auth.getUser()
    const rows = [
      ['Staff Name', 'Role', 'Salary Type', 'Amount (JMD)', 'Effective From', 'Effective To', 'Period Earnings (Est.)', 'Notes'],
      ...rowsWithEarnings.map(r => [
        r.staff_name,
        r.staff_role,
        r.salary_type,
        r.amount.toFixed(2),
        r.effective_from,
        r.effective_to ?? 'Active',
        r.periodEarnings.toFixed(2),
        r.notes ?? '',
      ]),
    ]
    const csv = rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a   = document.createElement('a')
    a.href     = url
    a.download = `salary-report-${range.from}-to-${range.to}.csv`
    a.click()
    URL.revokeObjectURL(url)

    // Audit log — JDPA-sensitive export
    await supabase.from('audit_log').insert({
      actor_id:   user?.id ?? null,
      actor_name: user?.email ?? 'System',
      action:     AUDIT_ACTIONS.SALARY_REPORT_EXPORT,
      table_name: 'staff_salaries',
      record_id:  null,
      details:    { range_from: range.from, range_to: range.to, staff_filter: staffFilter },
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Salary Report"
        subtitle="Staff compensation records and estimated period earnings"
        breadcrumb={['Reports', 'Salary Report']}
        showSession
        cta={
          <button
            onClick={exportCsv}
            disabled={rowsWithEarnings.length === 0}
            className="btn btn-ghost gap-1.5"
          >
            <Export size={14} aria-hidden="true" />
            Export CSV
          </button>
        }
      />

      {/* Filters */}
      <div className="card p-4 flex flex-wrap items-end gap-4 print:hidden">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
          <input
            type="date"
            value={range.from}
            onChange={e => setRange(r => ({ ...r, from: e.target.value }))}
            className="input text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
          <input
            type="date"
            value={range.to}
            min={range.from}
            onChange={e => setRange(r => ({ ...r, to: e.target.value }))}
            className="input text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Staff Member</label>
          <select
            value={staffFilter}
            onChange={e => setStaffFilter(e.target.value)}
            className="input text-sm"
          >
            <option value="ALL">All staff</option>
            {staffOptions.map(s => (
              <option key={s.id} value={s.id}>{s.full_name} ({s.role})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          label="Staff Included"
          value={String(uniqueStaff)}
          sub="with active salary records"
          icon={Users}
          accent="blue"
        />
        <MetricCard
          label="Est. Total Payroll"
          value={fmtJmd(totalEarnings)}
          sub={`${range.from} – ${range.to}`}
          icon={CurrencyCircleDollar}
          accent="green"
        />
        <MetricCard
          label="Est. Avg. per Staff"
          value={fmtJmd(avgEarnings)}
          sub="for period"
          icon={CurrencyCircleDollar}
          accent="blue"
        />
      </div>

      {/* Print header */}
      <div className="hidden print:block">
        <PrintHeader
        reportTitle="Salary Report"
        period={`${fmtDate(range.from)} – ${fmtDate(range.to)}`}
      />
        <p className="text-xs text-gray-500 mt-1 italic">
          Earnings figures are estimates based on calendar days. Actual payroll may vary
          based on attendance, overtime, and deductions. Confidential — authorised personnel only.
        </p>
      </div>

      {/* Table */}
      {isError && (
        <div className="card p-4 text-sm text-red-600 bg-red-50">
          Failed to load salary records. You may not have access to view this report.
        </div>
      )}

      {!isError && (
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="py-12 text-center text-sm text-gray-400">Loading salary records…</div>
          ) : rowsWithEarnings.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">
              No salary records found for the selected period and filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-compact text-sm" aria-label="Salary report">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff Member</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Salary Type</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate (JMD)</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Effective</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Est. Period Earnings</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider print:hidden">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rowsWithEarnings.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-medium text-gray-800">{r.staff_name}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500 uppercase tracking-wide">{r.staff_role}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-600">{r.salary_type.charAt(0) + r.salary_type.slice(1).toLowerCase()}</td>
                      <td className="px-4 py-2.5 text-right num text-gray-800">{fmtJmd(r.amount)}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500">
                        {fmtDate(r.effective_from)}
                        {r.effective_to ? ` – ${fmtDate(r.effective_to)}` : ' – Present'}
                      </td>
                      <td className="px-4 py-2.5 text-right num font-semibold text-emerald-700">
                        {fmtJmd(r.periodEarnings)}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-400 max-w-48 truncate print:hidden">
                        {r.notes ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-gray-200 bg-gray-50">
                  <tr>
                    <td colSpan={5} className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                      Estimated Total
                    </td>
                    <td className="px-4 py-2.5 text-right num font-bold text-gray-900">
                      {fmtJmd(totalEarnings)}
                    </td>
                    <td className="print:hidden" />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400 print:block print:mt-4">
        <strong>Disclaimer:</strong> Estimated earnings are computed from calendar days in the selected period,
        salary type, and rate only. They do not account for deductions (NIS, income tax, absenteeism,
        overtime adjustments). Verify against payroll system before disbursement.
      </p>
    </div>
  )
}

export default SalaryReport
