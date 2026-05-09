import type { ReactNode } from 'react'

/**
 * StatusPill — small rounded badge for entity status.
 * Authority: design handoff Section 4.5 + 4.6 status chips.
 */
export type StatusVariant =
  | 'received'
  | 'verified'
  | 'filled'
  | 'dispensed'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
  | 'schedule'
  | 'nhf'

const VARIANTS: Record<StatusVariant, string> = {
  received:  'bg-rx-received-bg text-rx-received-fg',
  verified:  'bg-rx-verified-bg text-rx-verified-fg',
  filled:    'bg-rx-filled-bg text-rx-filled-fg',
  dispensed: 'bg-rx-dispensed-bg text-rx-dispensed-fg',
  success:   'bg-rx-filled-bg text-rx-filled-fg',
  warning:   'bg-rx-verified-bg text-rx-verified-fg',
  error:     'bg-tag-schedule-bg text-tag-schedule-fg',
  info:      'bg-tag-nhf-bg text-tag-nhf-fg',
  neutral:   'bg-rx-dispensed-bg text-rx-dispensed-fg',
  schedule:  'bg-tag-schedule-bg text-tag-schedule-fg',
  nhf:       'bg-tag-nhf-bg text-tag-nhf-fg',
}

export function StatusPill({
  variant,
  children,
  className = '',
}: {
  variant: StatusVariant
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-pill text-[11px] font-semibold whitespace-nowrap ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
