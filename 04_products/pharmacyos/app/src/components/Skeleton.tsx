import type { CSSProperties } from 'react'

/**
 * Skeleton — shimmer placeholder for loading states.
 * Uses CSS gradient animation (no JS animation library).
 */

const shimmer =
  'bg-gradient-to-r from-bg-subtle via-bg-surface to-bg-subtle bg-[length:200%_100%] animate-shimmer'

export function Skeleton({
  width,
  height = '1rem',
  className = '',
  style,
  rounded = 'control',
}: {
  width?: string
  height?: string
  className?: string
  style?: CSSProperties
  rounded?: 'none' | 'control' | 'card' | 'pill' | 'full'
}) {
  const radius =
    rounded === 'none'
      ? 'rounded-none'
      : rounded === 'control'
        ? 'rounded-control'
        : rounded === 'card'
          ? 'rounded-card'
          : rounded === 'pill'
            ? 'rounded-pill'
            : 'rounded-full'

  return (
    <div
      className={`${shimmer} ${radius} ${className}`}
      style={{ width: width ?? '100%', height, ...style }}
      aria-hidden="true"
    />
  )
}

/** Horizontal flex row of skeleton blocks with gap. */
export function SkeletonRow({
  items,
  gap = '0.75rem',
  className = '',
}: {
  items: { width?: string; height?: string; flex?: string }[]
  gap?: string
  className?: string
}) {
  return (
    <div className={`flex items-center ${className}`} style={{ gap }}>
      {items.map((item, i) => (
        <Skeleton
          key={i}
          width={item.width}
          height={item.height ?? '1rem'}
          className={item.flex ? '' : ''}
          style={item.flex ? { flex: item.flex } : undefined}
        />
      ))}
    </div>
  )
}

/** Skeleton table row — 4–6 columns of varying widths. */
export function SkeletonTableRow({ cols = 5 }: { cols?: number }) {
  const widths = ['30%', '20%', '15%', '15%', '20%', '10%']
  return (
    <div className="flex items-center gap-4 px-4 py-2.5 border-b border-border-subtle">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} width={widths[i % widths.length]} height="0.75rem" />
      ))}
    </div>
  )
}

/** Skeleton card with header + body lines. */
export function SkeletonCard({
  lines = 3,
  header = true,
}: {
  lines?: number
  header?: boolean
}) {
  return (
    <div className="bg-bg-surface rounded-card shadow-card border border-border p-5 space-y-3">
      {header && <Skeleton width="40%" height="1rem" />}
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} height="0.875rem" />
      ))}
    </div>
  )
}

/** Metric card skeleton — big number + label. */
export function SkeletonMetricCard() {
  return (
    <div className="bg-bg-surface rounded-card shadow-card p-5 space-y-3">
      <Skeleton width="3rem" height="3rem" rounded="card" />
      <Skeleton width="40%" height="1.75rem" />
      <Skeleton width="60%" height="0.75rem" />
    </div>
  )
}

/** Kanban column skeleton — header + 3 card stubs. */
export function SkeletonKanbanColumn() {
  return (
    <div className="flex flex-col gap-2 min-w-0">
      <Skeleton width="60%" height="0.875rem" />
      <div className="bg-bg-surface rounded-card shadow-card border border-border p-3 space-y-2">
        <Skeleton width="80%" height="0.875rem" />
        <Skeleton width="50%" height="0.75rem" />
        <Skeleton width="30%" height="0.625rem" />
      </div>
      <div className="bg-bg-surface rounded-card shadow-card border border-border p-3 space-y-2">
        <Skeleton width="70%" height="0.875rem" />
        <Skeleton width="55%" height="0.75rem" />
        <Skeleton width="35%" height="0.625rem" />
      </div>
    </div>
  )
}

/** Form field skeleton — label + input. */
export function SkeletonFormField() {
  return (
    <div className="space-y-1.5">
      <Skeleton width="25%" height="0.75rem" />
      <Skeleton height="2.5rem" />
    </div>
  )
}

/** Page header skeleton — title + optional breadcrumb. */
export function SkeletonPageHeader({ breadcrumb = false }: { breadcrumb?: boolean }) {
  return (
    <div className="space-y-2 mb-2">
      {breadcrumb && <Skeleton width="30%" height="0.75rem" />}
      <Skeleton width="40%" height="1.5rem" />
    </div>
  )
}
