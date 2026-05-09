import { Warning } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import {
  DASHBOARD_METRICS,
  SAMPLE_PRESCRIPTIONS,
  SAMPLE_ACTIVITY,
  SAMPLE_STOCK,
  type RxStatus,
} from '@/data/sample'

/**
 * DashboardPage â€” design handoff Section 3.4 + 4.12.
 *
 * 4 metric cards row + (3/5) prescription mini-kanban + (2/5) stock alerts + recent activity table.
 *
 * Data is sourced from src/data/sample.ts â€” replace with live Supabase queries (TanStack Query
 * hooks under src/hooks/) once G2 (Supabase provisioning) is closed.
 */

const RX_STATUS_BADGE: Record<RxStatus, string> = {
  Received: 'bg-rx-received-bg text-rx-received-fg',
  Verified: 'bg-rx-verified-bg text-rx-verified-fg',
  Filled: 'bg-rx-filled-bg text-rx-filled-fg',
  Dispensed: 'bg-rx-dispensed-bg text-rx-dispensed-fg',
}

const RX_COLUMNS: RxStatus[] = ['Received', 'Verified', 'Filled', 'Dispensed']

const METRICS: Array<{ label: string; value: string | number; note: string; to: string }> = [
  { label: 'Rx Queue', value: DASHBOARD_METRICS.rxQueue, note: 'active', to: '/prescriptions' },
  { label: 'Stock Alerts', value: DASHBOARD_METRICS.stockAlerts, note: 'items low or expiring', to: '/inventory/alerts' },
  {
    label: 'Sales Today',
    value: `JMD ${DASHBOARD_METRICS.salesTodayJmd.toLocaleString()}`,
    note: 'as of 10:00 AM',
    to: '/pos/reports',
  },
  { label: 'Patients Served', value: DASHBOARD_METRICS.patientsServed, note: 'today', to: '/patients' },
]

export function DashboardPage() {
  const activeRx = SAMPLE_PRESCRIPTIONS.filter((r) => r.status !== 'Dispensed')
  const stockAlerts = SAMPLE_STOCK.filter((s) => s.qtyOnHand <= s.reorderPoint)

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Dashboard" subtitle="Winchester Global Pharmacy Â· Kingston" />

      <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
        {/* Metric cards — each links to its module */}
        <div className="grid grid-cols-4 gap-6">
          {METRICS.map((m) => (
            <Link
              key={m.label}
              to={m.to}
              className="bg-bg-surface rounded-card shadow-card p-4 flex flex-col justify-between h-24 hover:shadow-card-hover hover:border-primary/30 border border-transparent transition-all no-underline group"
            >
              <p className="type-caption text-text-secondary group-hover:text-text-primary transition-colors">{m.label}</p>
              <div>
                <p className="type-mono-metric text-text-primary leading-none">{m.value}</p>
                <p className="type-label text-text-secondary mt-0.5">{m.note}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Kanban + Alerts */}
        <div className="grid grid-cols-5 gap-6">
          {/* Prescription mini-kanban (3/5) */}
          <section
            className="col-span-3 bg-bg-surface rounded-card shadow-card p-4"
            aria-label="Prescription board"
          >
            <h2 className="type-caption text-text-secondary mb-3">Prescription Board</h2>
            <div className="grid grid-cols-4 gap-3">
              {RX_COLUMNS.map((col) => {
                const items = activeRx.filter((r) => r.status === col)
                return (
                  <div key={col}>
                    <div
                      className={[
                        'inline-flex items-center px-2 py-0.5 rounded-pill type-tiny font-semibold mb-2',
                        RX_STATUS_BADGE[col],
                      ].join(' ')}
                    >
                      {col} ({items.length})
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {items.length === 0 && (
                        <p className="type-label text-text-disabled italic">None</p>
                      )}
                      {items.map((rx) => (
                        <Link
                          key={rx.id}
                          to={`/prescriptions/${rx.id}`}
                          className="block rounded-control border border-border p-2 shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all no-underline"
                        >
                          <p className="type-label font-semibold text-text-primary leading-tight">
                            {rx.patient}
                          </p>
                          <p className="type-mono-data type-tiny text-text-secondary mt-0.5">
                            {rx.rxNumber}
                          </p>
                          {(rx.isSchedule || rx.isNhf) && (
                            <div className="flex gap-1 mt-1">
                              {rx.isSchedule && (
                                <span className="inline-flex items-center px-1.5 py-px rounded type-tiny font-semibold bg-tag-schedule-bg text-tag-schedule-fg">
                                  SCHED
                                </span>
                              )}
                              {rx.isNhf && (
                                <span className="inline-flex items-center px-1.5 py-px rounded type-tiny font-semibold bg-tag-nhf-bg text-tag-nhf-fg">
                                  NHF
                                </span>
                              )}
                            </div>
                          )}
                        </Link>
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
            <h2 className="type-caption text-text-secondary mb-3">Stock Alerts</h2>
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
                        <p className="type-body-xs font-medium text-text-primary leading-tight truncate">
                          {item.drug}
                        </p>
                        <p className="type-label text-text-secondary mt-0.5">
                          {item.qtyOnHand} on hand Â· reorder at {item.reorderPoint}
                          {isExpiringSoon && (
                            <span className="text-warning"> Â· Expiry {item.expiryDate}</span>
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
            <h2 className="type-caption text-text-secondary">Recent Activity</h2>
          </div>
          <table className="w-full">
            <caption className="sr-only">Recent pharmacy activity</caption>
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
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
                  <td className="px-4 type-body-sm text-text-primary">{entry.user}</td>
                  <td className="px-4 type-body-xs text-text-secondary">{entry.role}</td>
                  <td className="px-4 type-body-sm text-text-primary">{entry.action}</td>
                  <td className="px-4 type-body-xs text-text-secondary truncate max-w-[260px]">
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
