import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ClipboardText,
  ArrowClockwise,
  Export,
  ShieldWarning,
  Users,
  ListChecks,
  WarningCircle,
  Printer,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { toJamaicaBounds, todayJamaica } from '../../lib/date'
import { PageHeader, MetricCard } from '../../components/Shell'
import { AUDIT_ACTIONS } from '../../constants/audit-actions'

// ── Types ─────────────────────────────────────────────────────────────────────

interface AuditEntry {
  id: string
  actor_id: string | null
  actor_name: string | null
  action: string
  table_name: string | null
  record_id: string | null
  details: unknown
  created_at: string
}

// ── Category Map ──────────────────────────────────────────────────────────────
// Groups every known AUDIT_ACTIONS value into a human-readable category.
// Used for the activity-by-category breakdown in the report.

const ACTION_CATEGORIES: Record<string, string> = {
  [AUDIT_ACTIONS.TRANSACTION_CREATE]:      'POS / Retail',
  [AUDIT_ACTIONS.TRANSACTION_VOID]:        'POS / Retail',
  [AUDIT_ACTIONS.LOYALTY_POINTS_EARN]:     'POS / Retail',
  [AUDIT_ACTIONS.LOYALTY_POINTS_REDEEM]:   'POS / Retail',
  [AUDIT_ACTIONS.LOYALTY_CUSTOMER_CREATE]: 'POS / Retail',
  [AUDIT_ACTIONS.LOYALTY_CUSTOMER_UPDATE]: 'POS / Retail',
  [AUDIT_ACTIONS.VOID_REQUEST]:            'POS / Retail',
  [AUDIT_ACTIONS.VOID_APPROVED]:           'POS / Retail',
  [AUDIT_ACTIONS.VOID_DENIED]:             'POS / Retail',

  [AUDIT_ACTIONS.EOD_SUBMIT]:              'End of Day',
  [AUDIT_ACTIONS.EOD_APPROVE]:             'End of Day',
  [AUDIT_ACTIONS.EOD_DISCREPANCY]:         'End of Day',

  [AUDIT_ACTIONS.RX_CREATE]:               'Prescriptions',
  [AUDIT_ACTIONS.RX_STATUS_ADVANCE]:       'Prescriptions',
  [AUDIT_ACTIONS.RX_DISPENSE]:             'Prescriptions',
  [AUDIT_ACTIONS.RX_CANCEL]:               'Prescriptions',
  [AUDIT_ACTIONS.RX_TRANSACTION_CREATE]:   'Prescriptions',
  [AUDIT_ACTIONS.SCHEDULE_DRUG_ENTRY]:     'Prescriptions',
  [AUDIT_ACTIONS.SCHEDULE_DRUG_UPDATE]:    'Prescriptions',
  [AUDIT_ACTIONS.SCHEDULE_DRUG_DELETE]:    'Prescriptions',

  [AUDIT_ACTIONS.DISPENSING_REPORT_EXPORT]: 'Reports & Exports',
  [AUDIT_ACTIONS.NHF_REPORT_EXPORT]:        'Reports & Exports',
  [AUDIT_ACTIONS.PATIENT_DATA_EXPORT]:      'Reports & Exports',

  [AUDIT_ACTIONS.PATIENT_CREATE]:          'Patient Data (JDPA)',
  [AUDIT_ACTIONS.PATIENT_UPDATE]:          'Patient Data (JDPA)',
  [AUDIT_ACTIONS.PATIENT_JDPA_CONSENT]:    'Patient Data (JDPA)',
  [AUDIT_ACTIONS.PATIENT_DATA_DELETE]:     'Patient Data (JDPA)',

  [AUDIT_ACTIONS.AI_EXTRACTION_ACCEPT]:                        'AI Queue',
  [AUDIT_ACTIONS.AI_EXTRACTION_REJECT]:                        'AI Queue',
  [AUDIT_ACTIONS.AI_EXTRACTION_BLOCKED_NO_CONSENT]:            'AI Queue',
  [AUDIT_ACTIONS.AI_EXTRACTION_DENIED_INSUFFICIENT_ROLE]:      'AI Queue',
  [AUDIT_ACTIONS.AI_EXTRACTION_DENIED_TECHNICIAN_UNAUTHORIZED]:'AI Queue',

  [AUDIT_ACTIONS.STOCK_DECREMENT]:         'Inventory',
  [AUDIT_ACTIONS.STOCK_RECEIVE]:           'Inventory',
  [AUDIT_ACTIONS.STOCK_ADJUST]:            'Inventory',
  [AUDIT_ACTIONS.PRODUCT_CREATE]:          'Inventory',
  [AUDIT_ACTIONS.PRODUCT_UPDATE]:          'Inventory',

  [AUDIT_ACTIONS.TIMECARD_CLOCK_IN]:       'Staff & HR',
  [AUDIT_ACTIONS.TIMECARD_CLOCK_OUT]:      'Staff & HR',
  [AUDIT_ACTIONS.TIMECARD_APPROVE]:        'Staff & HR',
  [AUDIT_ACTIONS.TIMECARD_FLAG]:           'Staff & HR',
  [AUDIT_ACTIONS.STAFF_CREATE]:            'Staff & HR',
  [AUDIT_ACTIONS.STAFF_UPDATE]:            'Staff & HR',
  [AUDIT_ACTIONS.STAFF_DEACTIVATE]:        'Staff & HR',
  [AUDIT_ACTIONS.LEAVE_REQUEST_SUBMIT]:    'Staff & HR',
  [AUDIT_ACTIONS.LEAVE_REQUEST_APPROVE]:   'Staff & HR',
  [AUDIT_ACTIONS.LEAVE_REQUEST_DENY]:      'Staff & HR',
  [AUDIT_ACTIONS.LEAVE_REQUEST_CANCEL]:    'Staff & HR',
  [AUDIT_ACTIONS.CERT_CREATE]:             'Staff & HR',
  [AUDIT_ACTIONS.CERT_UPDATE]:             'Staff & HR',
  [AUDIT_ACTIONS.SALARY_CREATE]:           'Staff & HR',
  [AUDIT_ACTIONS.SALARY_UPDATE]:           'Staff & HR',

  [AUDIT_ACTIONS.STAFF_LOGIN]:             'Authentication',
  [AUDIT_ACTIONS.STAFF_LOGOUT]:            'Authentication',
  [AUDIT_ACTIONS.SESSION_TIMEOUT]:         'Authentication',
  [AUDIT_ACTIONS.STAFF_LOGIN_FAILED]:      'Security Events',
  [AUDIT_ACTIONS.ACCESS_DENIED]:           'Security Events',

  [AUDIT_ACTIONS.SETTINGS_UPDATE]:         'Administration',
  [AUDIT_ACTIONS.PERMISSIONS_UPDATE]:      'Administration',

  [AUDIT_ACTIONS.SYSTEM_ERROR]:            'System',
}

// Actions that require explicit attention in the security/risk section.
const HIGH_SEVERITY_ACTIONS = new Set<string>([
  AUDIT_ACTIONS.STAFF_LOGIN_FAILED,
  AUDIT_ACTIONS.ACCESS_DENIED,
  AUDIT_ACTIONS.STAFF_DEACTIVATE,
  AUDIT_ACTIONS.SCHEDULE_DRUG_DELETE,
  AUDIT_ACTIONS.PATIENT_DATA_DELETE,
  AUDIT_ACTIONS.AI_EXTRACTION_BLOCKED_NO_CONSENT,
  AUDIT_ACTIONS.AI_EXTRACTION_DENIED_INSUFFICIENT_ROLE,
  AUDIT_ACTIONS.AI_EXTRACTION_DENIED_TECHNICIAN_UNAUTHORIZED,
  AUDIT_ACTIONS.PERMISSIONS_UPDATE,
  AUDIT_ACTIONS.VOID_DENIED,
  AUDIT_ACTIONS.EOD_DISCREPANCY,
  AUDIT_ACTIONS.SYSTEM_ERROR,
])

// Category display colour for the bar chart
const CATEGORY_COLORS: Record<string, string> = {
  'POS / Retail':          'bg-blue-500',
  'End of Day':            'bg-amber-500',
  'Prescriptions':         'bg-purple-500',
  'Patient Data (JDPA)':   'bg-red-500',
  'AI Queue':              'bg-indigo-500',
  'Inventory':             'bg-teal-500',
  'Staff & HR':            'bg-emerald-500',
  'Authentication':        'bg-gray-400',
  'Security Events':       'bg-rose-600',
  'Reports & Exports':     'bg-cyan-500',
  'Administration':        'bg-orange-500',
  'System':                'bg-gray-600',
  'Other':                 'bg-gray-300',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function defaultDateRange() {
  const today = todayJamaica()
  const from = new Date(today)
  from.setDate(from.getDate() - 29)   // 30-day default window
  return {
    from: from.toISOString().slice(0, 10),
    to:   today,
  }
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-JM', {
    timeZone: 'America/Jamaica',
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-JM', {
    timeZone: 'America/Jamaica',
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

// ── Aggregation ───────────────────────────────────────────────────────────────

interface UserActivity {
  id: string
  name: string
  count: number
  topAction: string
  lastSeen: string
  actionSet: Set<string>
}

interface ReportData {
  totalEvents: number
  uniqueUsers: number
  securityEvents: number
  dataExports: number
  byCategory: { category: string; count: number }[]
  byUser: UserActivity[]
  highSeverityEntries: AuditEntry[]
  mostActiveUser: string
}

function aggregate(entries: AuditEntry[]): ReportData {
  const categoryMap: Record<string, number> = {}
  const userMap: Record<string, UserActivity> = {}

  let securityEvents = 0
  let dataExports = 0

  for (const e of entries) {
    // Category
    const cat = ACTION_CATEGORIES[e.action] ?? 'Other'
    categoryMap[cat] = (categoryMap[cat] ?? 0) + 1

    // User
    const uid = e.actor_id ?? 'system'
    const name = e.actor_name ?? '(System)'
    if (!userMap[uid]) {
      userMap[uid] = { id: uid, name, count: 0, topAction: e.action, lastSeen: e.created_at, actionSet: new Set() }
    }
    userMap[uid].count++
    userMap[uid].actionSet.add(e.action)
    if (e.created_at > userMap[uid].lastSeen) {
      userMap[uid].lastSeen = e.created_at
      userMap[uid].topAction = e.action
    }

    // Counters
    if (cat === 'Security Events') securityEvents++
    if (e.action === AUDIT_ACTIONS.DISPENSING_REPORT_EXPORT ||
        e.action === AUDIT_ACTIONS.NHF_REPORT_EXPORT ||
        e.action === AUDIT_ACTIONS.PATIENT_DATA_EXPORT) dataExports++
  }

  const byCategory = Object.entries(categoryMap)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)

  const byUser = Object.values(userMap)
    .sort((a, b) => b.count - a.count)

  const highSeverityEntries = entries
    .filter(e => HIGH_SEVERITY_ACTIONS.has(e.action))
    .slice(0, 100)   // cap at 100 rows in the report view

  const mostActiveUser = byUser[0]?.name ?? '—'

  return {
    totalEvents: entries.length,
    uniqueUsers: byUser.length,
    securityEvents,
    dataExports,
    byCategory,
    byUser,
    highSeverityEntries,
    mostActiveUser,
  }
}

// ── Export CSV ────────────────────────────────────────────────────────────────

function exportReportCsv(entries: AuditEntry[], from: string, to: string) {
  const rows = [
    ['Timestamp (Jamaica)', 'Actor', 'Action', 'Category', 'Table', 'Record ID', 'Severity'],
    ...entries.map(e => [
      fmtDateTime(e.created_at),
      e.actor_name ?? e.actor_id ?? '—',
      e.action,
      ACTION_CATEGORIES[e.action] ?? 'Other',
      e.table_name ?? '—',
      e.record_id ?? '—',
      HIGH_SEVERITY_ACTIONS.has(e.action) ? 'HIGH' : 'NORMAL',
    ]),
  ]
  const csv = rows
    .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `pharmacyos-audit-report-${from}-to-${to}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Category Bar ──────────────────────────────────────────────────────────────

function CategoryBar({ category, count, max }: { category: string; count: number; max: number }) {
  const pct = max > 0 ? Math.max(4, Math.round((count / max) * 100)) : 4
  const colorCls = CATEGORY_COLORS[category] ?? 'bg-gray-400'
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-44 shrink-0 text-gray-700 text-xs truncate">{category}</span>
      <div className="flex-1 bg-gray-100 rounded h-3 overflow-hidden">
        <div
          className={`h-full rounded ${colorCls} transition-all duration-500`}
          style={{ width: `${pct}%` }}
          role="meter"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`${category}: ${count} events`}
        />
      </div>
      <span className="w-12 text-right text-xs font-mono text-gray-600 shrink-0">{count.toLocaleString()}</span>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function SystemAuditReport() {
  const defaults = defaultDateRange()
  const [dateFrom, setDateFrom]   = useState(defaults.from)
  const [dateTo, setDateTo]       = useState(defaults.to)
  const [generated, setGenerated] = useState(false)
  const [fetchKey, setFetchKey]   = useState(0)

  // Query only fires when "Generate Report" is clicked (enabled = generated)
  const { data: entries = [], isLoading, isFetching, error } = useQuery<AuditEntry[]>({
    queryKey: ['system-audit-report', dateFrom, dateTo, fetchKey],
    queryFn: async () => {
      const bounds = toJamaicaBounds(dateFrom, dateTo)
      const { data, error } = await supabase
        .from('audit_log')
        .select('id, actor_id, actor_name, action, table_name, record_id, details, created_at')
        .gte('created_at', bounds.gte)
        .lte('created_at', bounds.lte)
        .order('created_at', { ascending: false })
        .limit(5000)   // higher cap than raw log — report needs full period for aggregation
      if (error) throw error
      return (data ?? []) as AuditEntry[]
    },
    enabled: generated,
    staleTime: 60_000,
  })

  const report = useMemo(() => generated && entries.length > 0 ? aggregate(entries) : null, [entries, generated])

  function handleGenerate() {
    setFetchKey(k => k + 1)
    setGenerated(true)
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="flex flex-col gap-6 print:gap-4">
      <PageHeader
        title="System Audit Report"
        subtitle="Period activity analysis and compliance summary — generated from immutable audit log"
        breadcrumb={['Admin', 'Audit Report']}
        showSession
      />

      {/* Controls — hidden in print mode */}
      <div className="card p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between flex-wrap print:hidden">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label htmlFor="sar-from" className="block text-xs font-medium text-gray-600 mb-1">From</label>
            <input
              id="sar-from"
              type="date"
              className="input"
              value={dateFrom}
              max={dateTo}
              onChange={e => setDateFrom(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="sar-to" className="block text-xs font-medium text-gray-600 mb-1">To</label>
            <input
              id="sar-to"
              type="date"
              className="input"
              value={dateTo}
              min={dateFrom}
              onChange={e => setDateTo(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-ghost flex items-center gap-2 text-xs"
            onClick={handleGenerate}
            disabled={isLoading || isFetching}
          >
            <ArrowClockwise
              size={15}
              aria-hidden="true"
              className={isLoading || isFetching ? 'animate-spin' : ''}
              style={{ animationDuration: '600ms' }}
            />
            {isLoading || isFetching ? 'Generating…' : generated ? 'Regenerate' : 'Generate Report'}
          </button>
          {report && (
            <>
              <button
                className="btn btn-ghost flex items-center gap-2 text-xs"
                onClick={() => exportReportCsv(entries, dateFrom, dateTo)}
                aria-label="Export report as CSV"
              >
                <Export size={15} aria-hidden="true" />
                Export CSV
              </button>
              <button
                className="btn btn-ghost flex items-center gap-2 text-xs"
                onClick={handlePrint}
                aria-label="Print this report"
              >
                <Printer size={15} aria-hidden="true" />
                Print
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="card p-4 border border-red-200 bg-red-50 text-sm text-red-800 flex items-center gap-2">
          <WarningCircle size={18} aria-hidden="true" />
          Failed to load audit data: {String((error as Error).message ?? error)}
        </div>
      )}

      {/* Idle state — before first generate */}
      {!generated && !error && (
        <div className="card p-12 text-center print:hidden">
          <ClipboardText size={44} className="mx-auto text-gray-300 mb-4" aria-hidden="true" />
          <p className="text-gray-500 text-sm font-medium">Select a date range and click Generate Report</p>
          <p className="text-gray-400 text-xs mt-1">
            The report analyses up to 5,000 audit events and groups them by category, user, and risk level.
          </p>
        </div>
      )}

      {/* Empty period */}
      {generated && !isLoading && entries.length === 0 && (
        <div className="card p-12 text-center">
          <ClipboardText size={44} className="mx-auto text-gray-300 mb-4" aria-hidden="true" />
          <p className="text-gray-500 text-sm">No audit events recorded for this period.</p>
        </div>
      )}

      {/* Report body */}
      {report && (
        <div className="flex flex-col gap-6 print:gap-4">

          {/* Print header — only visible in print mode */}
          <div className="hidden print:block mb-2">
            <h1 className="text-xl font-bold text-gray-900">PharmacyOS — System Audit Report</h1>
            <p className="text-sm text-gray-600 mt-1">
              Period: {fmtDate(dateFrom + 'T00:00:00')} — {fmtDate(dateTo + 'T00:00:00')}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Generated: {fmtDateTime(new Date().toISOString())} Jamaica time
              &nbsp;·&nbsp; {report.totalEvents.toLocaleString()} events analysed
            </p>
            <hr className="mt-3 border-gray-200" />
          </div>

          {/* Section label: period context */}
          <p className="text-xs text-gray-500 -mb-3 print:hidden">
            Report period: <strong className="text-gray-700">{dateFrom}</strong> to <strong className="text-gray-700">{dateTo}</strong>
            &nbsp;·&nbsp; {report.totalEvents.toLocaleString()} events loaded
            {entries.length === 5000 && (
              <span className="text-amber-600 ml-1">
                (5,000 event cap reached — narrow the date range for complete data)
              </span>
            )}
          </p>

          {/* ── Summary Metrics ─────────────────────────────────────────────── */}
          <section aria-label="Summary metrics">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                label="Total Events"
                value={report.totalEvents.toLocaleString()}
                sub={`${dateFrom} to ${dateTo}`}
                icon={ListChecks}
                accent="blue"
              />
              <MetricCard
                label="Unique Users Active"
                value={report.uniqueUsers.toString()}
                sub={`Most active: ${report.mostActiveUser}`}
                icon={Users}
                accent="green"
              />
              <MetricCard
                label="Security Events"
                value={report.securityEvents.toString()}
                sub="Failed logins + access denials"
                icon={ShieldWarning}
                accent={report.securityEvents > 0 ? 'red' : 'green'}
              />
              <MetricCard
                label="Data Exports"
                value={report.dataExports.toString()}
                sub="Dispensing, NHF, patient exports"
                icon={Export}
                accent={report.dataExports > 0 ? 'yellow' : 'green'}
              />
            </div>
          </section>

          {/* ── Activity by Category ─────────────────────────────────────────── */}
          <section aria-label="Activity by category">
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ListChecks size={16} aria-hidden="true" className="text-blue-500" />
                Activity by Category
              </h2>
              <div className="space-y-2.5">
                {report.byCategory.map(({ category, count }) => (
                  <CategoryBar
                    key={category}
                    category={category}
                    count={count}
                    max={report.byCategory[0]?.count ?? 1}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ── Activity by User ─────────────────────────────────────────────── */}
          <section aria-label="Activity by user">
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Users size={16} aria-hidden="true" className="text-emerald-500" />
                  Activity by User
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="table-compact w-full" aria-label="User activity summary">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th scope="col" className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                      <th scope="col" className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Events</th>
                      <th scope="col" className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Distinct Actions</th>
                      <th scope="col" className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {report.byUser.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 text-sm font-medium text-gray-800">{u.name}</td>
                        <td className="px-5 py-3 text-right">
                          <span className="num text-gray-700 font-semibold">{u.count.toLocaleString()}</span>
                        </td>
                        <td className="px-5 py-3 text-xs text-gray-500">{u.actionSet.size} action type{u.actionSet.size !== 1 ? 's' : ''}</td>
                        <td className="px-5 py-3 text-xs text-gray-500 font-mono">{fmtDateTime(u.lastSeen)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ── Security & Risk Events ───────────────────────────────────────── */}
          <section aria-label="Security and risk events">
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <ShieldWarning size={16} aria-hidden="true" className="text-rose-500" />
                  Security &amp; Risk Events
                  {report.highSeverityEntries.length > 0 && (
                    <span className="ml-1 pill pill-red">{report.highSeverityEntries.length}</span>
                  )}
                </h2>
                {report.highSeverityEntries.length === 0 && (
                  <span className="text-xs text-emerald-600 font-medium">No high-severity events this period</span>
                )}
              </div>

              {report.highSeverityEntries.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-gray-400">
                  No security or risk events were recorded in this period.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table-compact w-full" aria-label="Security and risk events">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th scope="col" className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Timestamp</th>
                        <th scope="col" className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actor</th>
                        <th scope="col" className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                        <th scope="col" className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Table</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {report.highSeverityEntries.map(e => (
                        <tr key={e.id} className="hover:bg-rose-50 border-l-2 border-l-rose-400">
                          <td className="px-5 py-3 text-xs font-mono text-gray-600 whitespace-nowrap">
                            {fmtDateTime(e.created_at)}
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-700">
                            {e.actor_name ?? e.actor_id ?? '—'}
                          </td>
                          <td className="px-5 py-3">
                            <span className="pill pill-red" style={{ fontSize: '10px' }}>{e.action}</span>
                          </td>
                          <td className="px-5 py-3 text-xs text-gray-500">{e.table_name ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {report.highSeverityEntries.length === 100 && (
                    <p className="px-5 py-2 text-xs text-gray-500 border-t border-gray-100">
                      Showing first 100 security events. Export CSV for the complete list.
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Print footer */}
          <div className="hidden print:block mt-4 pt-4 border-t border-gray-200 text-xs text-gray-400 text-center space-y-1">
            <p>PharmacyOS — NoDrftSystems Proprietary</p>
            <p>
              This report is generated from the PharmacyOS immutable audit log.
              All records are system-generated and cannot be manually edited.
            </p>
            <p>
              Prepared for internal compliance review. Retain as required by applicable record-keeping obligations.
            </p>
          </div>

        </div>
      )}

    </div>
  )
}

export default SystemAuditReport
