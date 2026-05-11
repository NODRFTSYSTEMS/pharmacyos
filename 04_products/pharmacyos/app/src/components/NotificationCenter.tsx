/**
 * NotificationCenter — persistent alert bell in the AdminPortalLayout header.
 *
 * Alerts are computed directly from sample data arrays (no hardcoded counts).
 * Each alert is actionable and links to the relevant page.
 *
 * Alert groups:
 *   Critical (red)  — compliance/safety items requiring immediate action
 *   Warning (amber) — items needing attention within days
 *   Info (blue)     — agent job completions and system events
 *
 * Swap-readiness: alert computation functions accept the data arrays directly.
 * When Supabase wires up (G2), replace SAMPLE_* imports with live query results
 * passed to the same computation functions.
 */
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Warning, ShieldWarning, Info, X, CheckCircle } from '@phosphor-icons/react'
import {
  SAMPLE_STAFF,
  SAMPLE_STOCK,
  SAMPLE_SCHEDULE_LOG,
  SAMPLE_AI_JOBS,
} from '@/data/sample'

// ─── Alert types ──────────────────────────────────────────────────────────────

export type AlertSeverity = 'critical' | 'warning' | 'info'

export interface Alert {
  id: string
  severity: AlertSeverity
  title: string
  detail: string
  href?: string
}

// ─── Alert computation ────────────────────────────────────────────────────────

const TODAY = new Date('2026-05-11')

function daysDiff(isoDate: string): number {
  const target = new Date(isoDate)
  return Math.round((target.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24))
}

function computeAlerts(): Alert[] {
  const alerts: Alert[] = []

  // ── Critical: unverified schedule log entries ─────────────────────────────
  const unverifiedLogs = SAMPLE_SCHEDULE_LOG.filter((e) => !e.verified)
  for (const log of unverifiedLogs) {
    alerts.push({
      id: `sched-unverified-${log.id}`,
      severity: 'critical',
      title: 'Unverified schedule log entry',
      detail: `${log.logNumber} — ${log.drug} dispensed ${log.date} requires pharmacist sign-off`,
      href: '/prescriptions/schedule-log',
    })
  }

  // ── Warning: staff licenses expiring within 90 days ───────────────────────
  for (const staff of SAMPLE_STAFF) {
    if (!staff.licenseExpiry || staff.status !== 'Active') continue
    const days = daysDiff(staff.licenseExpiry)
    if (days >= 0 && days <= 90) {
      alerts.push({
        id: `license-${staff.id}`,
        severity: 'warning',
        title: 'License expiry approaching',
        detail: `${staff.name} — license expires in ${days} day${days === 1 ? '' : 's'} (${staff.licenseExpiry})`,
        href: `/admin/users/${staff.id}`,
      })
    }
  }

  // ── Warning: inactive staff license expiring (separate from active) ───────
  for (const staff of SAMPLE_STAFF) {
    if (!staff.licenseExpiry || staff.status !== 'Inactive') continue
    const days = daysDiff(staff.licenseExpiry)
    if (days >= 0 && days <= 90) {
      alerts.push({
        id: `license-inactive-${staff.id}`,
        severity: 'warning',
        title: 'Inactive staff — license expiry',
        detail: `${staff.name} (inactive) — license expires in ${days} days. Renewal required to reactivate.`,
        href: `/admin/users/${staff.id}`,
      })
    }
  }

  // ── Warning: active staff missing 2FA ────────────────────────────────────
  const no2Fa = SAMPLE_STAFF.filter((s) => s.status === 'Active' && !s.twoFa)
  for (const staff of no2Fa) {
    alerts.push({
      id: `2fa-${staff.id}`,
      severity: 'warning',
      title: '2FA not enrolled',
      detail: `${staff.name} (${staff.role}) — two-factor authentication not enabled`,
      href: `/admin/users/${staff.id}`,
    })
  }

  // ── Warning: stock below reorder point ────────────────────────────────────
  const lowStock = SAMPLE_STOCK.filter((s) => s.qtyOnHand <= s.reorderPoint)
  if (lowStock.length > 0) {
    alerts.push({
      id: 'low-stock',
      severity: 'warning',
      title: `${lowStock.length} stock item${lowStock.length === 1 ? '' : 's'} below reorder threshold`,
      detail: lowStock.slice(0, 2).map((s) => `${s.drug} (${s.qtyOnHand} remaining)`).join(', ') +
        (lowStock.length > 2 ? ` + ${lowStock.length - 2} more` : ''),
      href: '/inventory/alerts',
    })
  }

  // ── Info: recent completed agent jobs ─────────────────────────────────────
  const completedJobs = SAMPLE_AI_JOBS
    .filter((j) => j.status === 'Completed' && j.completedAt?.startsWith('2026-05-11'))
    .slice(0, 3)
  for (const job of completedJobs) {
    alerts.push({
      id: `job-${job.id}`,
      severity: 'info',
      title: `${job.label} completed`,
      detail: job.outputSummary ?? job.target,
      href: '/ai/queue',
    })
  }

  // ── Info: flagged agent jobs needing review ────────────────────────────────
  const flaggedJobs = SAMPLE_AI_JOBS.filter((j) => j.flagged && j.status === 'Review Required')
  if (flaggedJobs.length > 0) {
    alerts.push({
      id: 'flagged-jobs',
      severity: 'info',
      title: `${flaggedJobs.length} AI job${flaggedJobs.length === 1 ? '' : 's'} require review`,
      detail: flaggedJobs.map((j) => j.target).join(', '),
      href: '/ai/queue',
    })
  }

  return alerts
}

// ─── Component ────────────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<AlertSeverity, {
  icon: React.ComponentType<{ size?: number; weight?: 'regular' | 'bold' | 'fill' | 'duotone'; className?: string }>
  badgeBg: string
  rowBg: string
  titleColor: string
  dotColor: string
}> = {
  critical: {
    icon: ShieldWarning,
    badgeBg: 'bg-error',
    rowBg: 'bg-error/5 border-error/20',
    titleColor: 'text-error',
    dotColor: 'bg-error',
  },
  warning: {
    icon: Warning,
    badgeBg: 'bg-warning',
    rowBg: 'bg-warning/5 border-warning/20',
    titleColor: 'text-warning',
    dotColor: 'bg-warning',
  },
  info: {
    icon: Info,
    badgeBg: 'bg-primary',
    rowBg: 'bg-primary/5 border-primary/20',
    titleColor: 'text-primary',
    dotColor: 'bg-primary',
  },
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()

  const alerts = computeAlerts()
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length
  const warningCount = alerts.filter((a) => a.severity === 'warning').length
  const totalCount = alerts.length

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // Escape to close
  useEffect(() => {
    if (!open) return
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  function handleAlertClick(alert: Alert) {
    setOpen(false)
    if (alert.href) navigate(alert.href)
  }

  // Badge color: red if any critical, amber if warning, blue if only info
  const badgeBg = criticalCount > 0 ? 'bg-error' : warningCount > 0 ? 'bg-warning' : 'bg-primary'

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications — ${totalCount} alert${totalCount === 1 ? '' : 's'}`}
        aria-expanded={open}
        aria-haspopup="true"
        className="relative flex items-center justify-center w-9 h-9 rounded-control text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
      >
        <Bell size={18} aria-hidden="true" />
        {totalCount > 0 && (
          <span
            aria-hidden="true"
            className={[
              'absolute top-1 right-1 min-w-[16px] h-4 rounded-full text-white text-[10px] font-bold leading-4 text-center px-1',
              badgeBg,
            ].join(' ')}
          >
            {totalCount > 9 ? '9+' : totalCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          role="region"
          aria-label="Notifications panel"
          className="absolute right-0 top-full mt-2 w-96 max-h-[480px] bg-bg-surface rounded-card shadow-modal border border-border z-50 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
            <p className="type-label-strong text-text-primary">Notifications</p>
            <div className="flex items-center gap-2">
              {totalCount === 0 && (
                <span className="type-label text-text-disabled">All clear</span>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="w-7 h-7 rounded-control flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Alert list */}
          <div className="overflow-y-auto flex-1">
            {totalCount === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
                <CheckCircle size={24} className="text-success" weight="duotone" aria-hidden="true" />
                <p className="type-body-sm text-text-secondary">No active alerts</p>
                <p className="type-label text-text-disabled">All systems operating normally</p>
              </div>
            ) : (
              <ul>
                {(['critical', 'warning', 'info'] as AlertSeverity[]).map((severity) => {
                  const group = alerts.filter((a) => a.severity === severity)
                  if (group.length === 0) return null
                  const config = SEVERITY_CONFIG[severity]
                  const SeverityIcon = config.icon
                  return (
                    <li key={severity}>
                      <p className="px-4 py-1.5 type-tiny uppercase tracking-wider text-text-disabled bg-bg-subtle border-b border-border-subtle">
                        {severity === 'critical' ? 'Critical' : severity === 'warning' ? 'Warning' : 'Info'}
                        {' '}({group.length})
                      </p>
                      <ul>
                        {group.map((alert) => (
                          <li key={alert.id}>
                            <button
                              type="button"
                              onClick={() => handleAlertClick(alert)}
                              className={[
                                'w-full text-left flex items-start gap-3 px-4 py-3 border-b border-border-subtle',
                                'hover:bg-bg-subtle transition-colors',
                                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-inset',
                              ].join(' ')}
                            >
                              <SeverityIcon
                                size={14}
                                weight="duotone"
                                className={`${config.titleColor} shrink-0 mt-0.5`}
                                aria-hidden="true"
                              />
                              <div className="flex-1 min-w-0">
                                <p className={`type-label-strong leading-snug ${config.titleColor}`}>
                                  {alert.title}
                                </p>
                                <p className="type-label text-text-secondary mt-0.5 leading-snug line-clamp-2">
                                  {alert.detail}
                                </p>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          {totalCount > 0 && (
            <div className="px-4 py-2.5 border-t border-border shrink-0">
              <button
                type="button"
                onClick={() => { setOpen(false); navigate('/admin/audit') }}
                className="type-label text-primary hover:text-primary-hover transition-colors"
              >
                View full audit log →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
