/**
 * IntegrationPendingBadge — indicates that a feature requires an external
 * integration that has not yet been connected.
 *
 * Usage:
 *   <IntegrationPendingBadge service="NHF" description="Claim submission" />
 *   <IntegrationPendingBadge service="Printer" />
 */
import { PlugsConnected } from '@phosphor-icons/react'

export interface IntegrationPendingBadgeProps {
  service: string
  description?: string
  /** 'badge' (inline pill) | 'banner' (full-width info bar). Default: 'badge' */
  variant?: 'badge' | 'banner'
}

export function IntegrationPendingBadge({
  service,
  description,
  variant = 'badge',
}: IntegrationPendingBadgeProps) {
  const label = description ? `${service} — ${description}` : `${service} — Integration Pending`

  if (variant === 'banner') {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-card text-sm text-text-secondary">
        <PlugsConnected size={16} className="text-primary shrink-0" aria-hidden="true" />
        <span>
          <span className="font-medium text-primary">{service}</span>
          {' '}connection pending
          {description && <span className="text-text-disabled"> — {description}</span>}
        </span>
        <span className="ml-auto type-tiny bg-primary/10 text-primary px-2 py-0.5 rounded-pill font-medium">
          Integration Pending
        </span>
      </div>
    )
  }

  return (
    <span
      title={label}
      className="inline-flex items-center gap-1 type-tiny bg-primary/10 text-primary px-2 py-0.5 rounded-pill font-medium whitespace-nowrap"
    >
      <PlugsConnected size={10} aria-hidden="true" />
      {service} — Pending
    </span>
  )
}
