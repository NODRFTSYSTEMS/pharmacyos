import { useMemo } from 'react'
import { Warning, Robot } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import {
  DASHBOARD_METRICS,
  SAMPLE_PRESCRIPTIONS,
  SAMPLE_ACTIVITY,
  SAMPLE_STOCK,
  SAMPLE_AI_JOBS,
  type RxStatus,
} from '@/data/sample'
import { usePermissionsStore } from '@/stores/permissions'
import { useStaffStore } from '@/stores/staff'
import { usePrescriptionStore } from '@/stores/prescriptions'
import { daysUntil } from '@/utils/formatDate'

/**
 * DashboardPage — design handoff Section 3.4 + 4.12.
 *
 * 4 metric cards row + role-specific contextual panels + recent activity.
 * Data sourced from sample arrays — replace with Supabase queries once backend is live.
 */

const RX_STATUS_BADGE: Record<RxStatus, string> = {
  Received:  'bg-rx-received-bg text-rx-received-fg',
  Verified:  'bg-rx-verified-bg text-rx-verified-fg',
  Filled:    'bg-rx-filled-bg text-rx-filled-fg',
  Dispensed: 'bg-rx-dispensed-bg text-rx-dispensed-fg',
}

const RX_COLUMNS: RxStatus[] = ['Received', 'Verified', 'Filled', 'Dispensed']

const METRICS: Array<{ label: string; value: string | number; note: string; to: string }> = [
  { label: 'Rx Queue',        value: DASHBOARD_METRICS.rxQueue,                              note: 'active',                  to: '/prescriptions' },
  { label: 'Stock Alerts',    value: DASHBOARD_METRICS.stockAlerts,                          note: 'items low or expiring',   to: '/inventory/alerts' },
  { label: 'Sales Today',     value: `JMD ${DASHBOARD_METRICS.salesTodayJmd.toLocaleString()}`, note: 'as of 10:00 AM',      to: '/pos/reports' },
  { label: 'Patients Served', value: DASHBOARD_METRICS.patientsServed,                       note: 'today',                  to: '/patients' },
]

export function DashboardPage() {
  const actingRole = usePermissionsStore((s) => s.actingRole)
  const prescriptions = usePrescriptionStore((s) => s.prescriptions)
  const staff = useStaffStore((s) => s.staff)

  const activeRx = prescriptions.filter((r) => r.status !== 'Dispensed')
  const stockAlerts = SAMPLE_STOCK.filter((s) => s.qtyOnHand <= s.reorderPoint)

  // Compliance flags for admin/manager dashboard card
  const complianceFlags = useMemo(() => {
    const flags: { severity: 'error' | 'warning'; message: string }[] = []
    staff.forEach((u) => {
      if (!u.licenseExpiry) return
      const days = daysUntil(u.licenseExpiry)
      if (days < 0) {
        flags.push({ severity: 'error', message: `${u.name} — license expired` })
      } else if (days <= 90) {
        flags.push({ severity: 'warning', message: `${u.name} — license expires in ${days} days` })
      }
      if (!u.twoFa && u.status === 'Active') {
        flags.push({ severity: 'warning', message: `${u.name} — 2FA not enrolled` })
      }
    })
    return flags
  }, [staff])

  // Latest compliance-monitor job
  const complianceJob = SAMPLE_AI_JOBS
    .filter((j) => j.type === 'compliance-monitor')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]

  const isAdmin = actingRole === 'admin'
  const isManager = actingRole === 'manager'
  const isPharmacist = actingRole === 'pharmacist'
  const isTech = actingRole === 'pharmacy_technician'
  const isFrontDesk = actingRole === 'front_desk_cashier'

  // Role-specific contextual title
  const contextualSubtitle = useMemo(() => {
    if (isPharmacist) return 'Prescriptions awaiting your verification'
    if (isTech) return 'Prescriptions ready to fill'
    if (isFrontDesk) return 'POS and patient services'
    if (isManager) return 'Operations overview and compliance status'
    if (isAdmin) return 'System health and staff management'
    return 'Winchester Global Pharmacy · Kingston'
  }, [actingRole])

  const rxToVerify = prescriptions.filter((r) => r.status === 'Received')
  const rxToFill = prescriptions.filter((r) => r.status === 'Verified')

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Dashboard" subtitle={`Winchester Global Pharmacy · Kingston · ${contextualSubtitle}`} />

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

        {/* ── Role-specific contextual section ── */}

        {/* Pharmacist: Rx to verify */}
        {isPharmacist && (
          <section className="bg-bg-surface rounded-card shadow-card p-4" aria-label="Prescriptions to verify">
            <div className="flex items-center justify-between mb-3">
              <h2 className="type-caption text-text-secondary">
                Rx Awaiting Verification ({rxToVerify.length})
              </h2>
              <Link to="/prescriptions" className="type-tiny text-primary hover:underline">View all →</Link>
            </div>
            {rxToVerify.length === 0 ? (
              <p className="type-label text-text-disabled italic">All caught up — no prescriptions awaiting verification</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {rxToVerify.slice(0, 5).map((rx) => (
                  <Link
                    key={rx.id}
                    to={`/prescriptions/${rx.id}`}
                    className="flex items-center justify-between px-3 py-2 rounded-control border border-border hover:border-primary/30 hover:bg-bg-subtle transition-all no-underline"
                  >
                    <div>
                      <p className="type-label font-semibold text-text-primary">{rx.patient}</p>
                      <p className="type-mono-data type-tiny text-text-secondary">{rx.rxNumber}</p>
                    </div>
                    <div className="flex gap-1">
                      {rx.isSchedule && <span className="inline-flex items-center px-1.5 py-px rounded type-tiny font-semibold bg-tag-schedule-bg text-tag-schedule-fg">SCHED</span>}
                      {rx.isNhf && <span className="inline-flex items-center px-1.5 py-px rounded type-tiny font-semibold bg-tag-nhf-bg text-tag-nhf-fg">NHF</span>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Technician: Rx to fill */}
        {isTech && (
          <section className="bg-bg-surface rounded-card shadow-card p-4" aria-label="Prescriptions to fill">
            <div className="flex items-center justify-between mb-3">
              <h2 className="type-caption text-text-secondary">
                Rx Ready to Fill ({rxToFill.length})
              </h2>
              <Link to="/prescriptions" className="type-tiny text-primary hover:underline">View all →</Link>
            </div>
            {rxToFill.length === 0 ? (
              <p className="type-label text-text-disabled italic">No prescriptions awaiting fill</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {rxToFill.slice(0, 5).map((rx) => (
                  <Link
                    key={rx.id}
                    to={`/prescriptions/${rx.id}`}
                    className="flex items-center justify-between px-3 py-2 rounded-control border border-border hover:border-primary/30 hover:bg-bg-subtle transition-all no-underline"
                  >
                    <p className="type-label font-semibold text-text-primary">{rx.patient}</p>
                    <p className="type-mono-data type-tiny text-text-secondary">{rx.rxNumber}</p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Front Desk: POS quick-launch */}
        {isFrontDesk && (
          <section className="bg-bg-surface rounded-card shadow-card p-4" aria-label="Quick actions">
            <h2 className="type-caption text-text-secondary mb-3">Quick Actions</h2>
            <div className="flex gap-3">
              <Link to="/pos" className="flex-1 flex flex-col items-center justify-center gap-1 h-20 rounded-card border border-border hover:border-primary/30 hover:bg-bg-subtle transition-all no-underline">
                <p className="type-label-strong text-text-primary">POS Terminal</p>
                <p className="type-tiny text-text-secondary">Open register</p>
              </Link>
              <Link to="/patients" className="flex-1 flex flex-col items-center justify-center gap-1 h-20 rounded-card border border-border hover:border-primary/30 hover:bg-bg-subtle transition-all no-underline">
                <p className="type-label-strong text-text-primary">Patient Lookup</p>
                <p className="type-tiny text-text-secondary">Search records</p>
              </Link>
              <Link to="/pos/loyalty" className="flex-1 flex flex-col items-center justify-center gap-1 h-20 rounded-card border border-border hover:border-primary/30 hover:bg-bg-subtle transition-all no-underline">
                <p className="type-label-strong text-text-primary">Loyalty</p>
                <p className="type-tiny text-text-secondary">Check member</p>
              </Link>
            </div>
          </section>
        )}

        {/* Admin/Manager: Compliance card + kanban */}
        {(isAdmin || isManager) && complianceFlags.length > 0 && (
          <section className="bg-bg-surface rounded-card shadow-card p-4 border-l-2 border-warning" aria-label="Compliance alerts">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Robot size={16} className="text-text-secondary" />
                <h2 className="type-caption text-text-secondary">
                  Compliance — {complianceFlags.length} issue{complianceFlags.length > 1 ? 's' : ''}
                </h2>
              </div>
              <Link to="/admin/users" className="type-tiny text-primary hover:underline">View all →</Link>
            </div>
            <div className="flex flex-col gap-1.5">
              {complianceFlags.slice(0, 4).map((flag, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Warning size={13} className={flag.severity === 'error' ? 'text-error shrink-0' : 'text-warning shrink-0'} aria-hidden="true" />
                  <p className={`type-body-xs ${flag.severity === 'error' ? 'text-error' : 'text-text-secondary'}`}>{flag.message}</p>
                </div>
              ))}
              {complianceFlags.length > 4 && (
                <p className="type-tiny text-text-disabled">+{complianceFlags.length - 4} more — view Users page</p>
              )}
            </div>
          </section>
        )}

        {/* Kanban + Alerts (for manager, admin, pharmacist, tech — not front desk) */}
        {!isFrontDesk && (
          <div className="grid grid-cols-5 gap-6">
            {/* Prescription mini-kanban (3/5) */}
            <section className="col-span-3 bg-bg-surface rounded-card shadow-card p-4" aria-label="Prescription board">
              <h2 className="type-caption text-text-secondary mb-3">Prescription Board</h2>
              <div className="grid grid-cols-4 gap-3">
                {RX_COLUMNS.map((col) => {
                  const items = activeRx.filter((r) => r.status === col)
                  return (
                    <div key={col}>
                      <div className={['inline-flex items-center px-2 py-0.5 rounded-pill type-tiny font-semibold mb-2', RX_STATUS_BADGE[col]].join(' ')}>
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
                            <p className="type-label font-semibold text-text-primary leading-tight">{rx.patient}</p>
                            <p className="type-mono-data type-tiny text-text-secondary mt-0.5">{rx.rxNumber}</p>
                            {(rx.isSchedule || rx.isNhf) && (
                              <div className="flex gap-1 mt-1">
                                {rx.isSchedule && <span className="inline-flex items-center px-1.5 py-px rounded type-tiny font-semibold bg-tag-schedule-bg text-tag-schedule-fg">SCHED</span>}
                                {rx.isNhf && <span className="inline-flex items-center px-1.5 py-px rounded type-tiny font-semibold bg-tag-nhf-bg text-tag-nhf-fg">NHF</span>}
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
            <section className="col-span-2 bg-bg-surface rounded-card shadow-card p-4" aria-label="Stock alerts">
              <h2 className="type-caption text-text-secondary mb-3">Stock Alerts</h2>
              {stockAlerts.length === 0 ? (
                <p className="text-sm text-text-secondary">No alerts</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {stockAlerts.map((item) => {
                    const isExpiringSoon = new Date(item.expiryDate) < new Date('2026-08-07')
                    const isCritical = item.qtyOnHand < item.reorderPoint * 0.5
                    return (
                      <div key={item.id} className="flex items-start gap-2 p-2 rounded-control border border-border">
                        <Warning size={14} className={`shrink-0 mt-0.5 ${isCritical ? 'text-error' : 'text-warning'}`} aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="type-body-xs font-medium text-text-primary leading-tight truncate">{item.drug}</p>
                          <p className="type-label text-text-secondary mt-0.5">
                            {item.qtyOnHand} on hand · reorder at {item.reorderPoint}
                            {isExpiringSoon && <span className="text-warning"> · Expiry {item.expiryDate}</span>}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Recent activity */}
        <section className="bg-bg-surface rounded-card shadow-card overflow-hidden" aria-label="Recent activity">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="type-caption text-text-secondary">Recent Activity</h2>
          </div>
          <table className="w-full">
            <caption className="sr-only">Recent pharmacy activity</caption>
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                {['Time', 'User', 'Role', 'Action', 'Target'].map((h) => (
                  <th key={h} scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLE_ACTIVITY.slice(0, 8).map((entry) => (
                <tr key={entry.id} className="h-9 border-b border-border-subtle hover:bg-bg-subtle transition-colors">
                  <td className="px-4 type-mono-data text-text-secondary whitespace-nowrap">{entry.timestamp.split(' ')[1]}</td>
                  <td className="px-4 type-body-sm text-text-primary">{entry.user}</td>
                  <td className="px-4 type-body-xs text-text-secondary">{entry.role}</td>
                  <td className="px-4 type-body-sm text-text-primary">{entry.action}</td>
                  <td className="px-4 type-body-xs text-text-secondary truncate max-w-[260px]">{entry.target}</td>
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
