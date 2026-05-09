import { Warning } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import {
  DASHBOARD_METRICS,
  SAMPLE_PRESCRIPTIONS,
  SAMPLE_ACTIVITY,
  SAMPLE_STOCK,
  type RxStatus,
} from '@/data/sample'

/**
 * DashboardPage — design handoff Section 3.4 + 4.12.
 *
 * 4 metric cards row + (3/5) prescription mini-kanban + (2/5) stock alerts + recent activity table.
 *
 * Data is sourced from src/data/sample.ts — replace with live Supabase queries (TanStack Query
 * hooks under src/hooks/) once G2 (Supabase provisioning) is closed.
 */

const RX_STATUS_BADGE: Record<RxStatus, string> = {
  Received: 'bg-rx-received-bg text-rx-received-fg',
  Verified: 'bg-rx-verified-bg text-rx-verified-fg',
  Filled: 'bg-rx-filled-bg text-rx-filled-fg',
  Dispensed: 'bg-rx-dispensed-bg text-rx-dispensed-fg',
}

const RX_COLUMNS: RxStatus[] = ['Received', 'Verified', 'Filled', 'Dispensed']

const METRICS = [
  { label: 'Rx Queue', value: DASHBOARD_METRICS.rxQueue, note: 'active' },
  { label: 'Stock Alerts', value: DASHBOARD_METRICS.stockAlerts, note: 'items low or expiring' },
  {
    label: 'Sales Today',
    value: `JMD ${DASHBOARD_METRICS.salesTodayJmd.toLocaleString()}`,
    note: 'as of 10:00 AM',
  },
  { label: 'Patients Served', value: DASHBOARD_METRICS.patientsServed, note: 'today' },
]

export function DashboardPage() {
  const activeRx = SAMPLE_PRESCRIPTIONS.filter((r) => r.status !== 'Dispensed')
  const stockAlerts = SAMPLE_STOCK.filter((s) => s.qtyOnHand <= s.reorderPoint)

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Dashboard" subtitle="Winchester Global Pharmacy · Kingston" />

      <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
        {/* Metric cards */}
        <div className="grid grid-cols-4 gap-6">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="bg-bg-surface rounded-card shadow-card p-4 flex flex-col justify-between h-24"
            >
              <p className="type-caption text-text-secondary">{m.label}</p>
              <div>
                <p className="type-mono-metric text-text-primary leading-none">{m.value}</p>
                <p className="text-[11px] text-text-secondary mt-0.5">{m.note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Kanban + Alerts */}
        <div className="grid grid-cols-5 gap-6">
          {/* Prescription mini-kanban (3/5) */}
          <section
            className="col-span-3 bg-bg-surface rounded-card shadow-card p-4"
            aria-label="Prescription board"
          >
            <p className="type-caption text-text-secondary mb-3">Prescription Board</p>
            <div className="grid grid-cols-4 gap-3">
              {RX_COLUMNS.map((col) => {
                const items = activeRx.filter((r) => r.status === col)
                return (
                  <div key={col}>
                    <div
                      className={[
                        'inline-flex items-center px-2 py-0.5 rounded-pill text-[10px] font-semibold mb-2',
                        RX_STATUS_BADGE[col],
                      ].join(' ')}
                    >
                      {col} ({items.length})
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {items.length === 0 && (
                        <p className="text-[11px] text-text-disabled italic">None</p>
                      )}
                      {items.map((rx) => (
                        <article
                          key={rx.id}
                          className="rounded-control border border-border p-2 shadow-card hover:shadow-card-hover transition-shadow cursor-default"
                        >
                          <p className="text-[11px] font-semibold text-text-primary leading-tight">
                            {rx.patient}
                          </p>
                          <p className="type-mono-data text-[10px] text-text-secondary mt-0.5">
                            {rx.rxNumber}
                          </p>
                          {(rx.isSchedule || rx.isNhf) && (
                            <div className="flex gap-1 mt-1">
                              {rx.isSchedule && (
                                <span className="inline-flex items-center px-1.5 py-px rounded text-[9px] font-semibold bg-tag-schedule-bg text-tag-schedule-fg">
                                  SCHED
                                </span>
                              )}
                              {rx.isNhf && (
                                <span className="inline-flex items-center px-1.5 py-px rounded text-[9px] font-semibold bg-tag-nhf-bg text-tag-nhf-fg">
                                  NHF
                                </span>
                              )}
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Stock alerts (2/5) */}
          <section
            className="col-span-2 bg-bg-surface rounded-card shadow-card p-4"
            aria-label="Stock alerts"
          >
            <p className="type-caption text-text-secondary mb-3">Stock Alerts</p>
            {stockAlerts.length === 0 ? (
              <p className="text-sm text-text-secondary">No alerts</p>
            ) : (
              <div className="flex flex-col gap-2">
                {stockAlerts.map((item) => {
                  const isExpiringSoon = new Date(item.expiryDate) < new Date('2026-08-07')
                  const isCritical = item.qtyOnHand < item.reorderPoint * 0.5
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-2 p-2 rounded-control border border-border"
                    >
                      <Warning
                        size={14}
                        className={`shrink-0 mt-0.5 ${isCritical ? 'text-error' : 'text-warning'}`}
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium text-text-primary leading-tight truncate">
                          {item.drug}
                        </p>
                        <p className="text-[11px] text-text-secondary mt-0.5">
                          {item.qtyOnHand} on hand · reorder at {item.reorderPoint}
                          {isExpiringSoon && (
                            <span className="text-warning"> · Expiry {item.expiryDate}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>

        {/* Recent activity */}
        <section
          className="bg-bg-surface rounded-card shadow-card overflow-hidden"
          aria-label="Recent activity"
        >
          <div className="px-4 py-3 border-b border-border">
            <p className="type-caption text-text-secondary">Recent Activity</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-bg-subtle border-b border-border">
                {['Time', 'User', 'Role', 'Action', 'Target'].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="h-9 px-4 text-left type-caption text-text-secondary"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLE_ACTIVITY.slice(0, 8).map((entry) => (
                <tr
                  key={entry.id}
                  className="h-9 border-b border-border-subtle hover:bg-bg-subtle transition-colors"
                >
                  <td className="px-4 type-mono-data text-text-secondary whitespace-nowrap">
                    {entry.timestamp.split(' ')[1]}
                  </td>
                  <td className="px-4 text-[13px] text-text-primary">{entry.user}</td>
                  <td className="px-4 text-[12px] text-text-secondary">{entry.role}</td>
                  <td className="px-4 text-[13px] text-text-primary">{entry.action}</td>
                  <td className="px-4 text-[12px] text-text-secondary truncate max-w-[260px]">
                    {entry.target}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}

export default DashboardPage
