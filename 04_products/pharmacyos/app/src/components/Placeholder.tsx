import { useLocation } from 'react-router-dom'
import { PageHeader } from './PageHeader'
import type { BreadcrumbItem } from './Breadcrumb'

/**
 * Placeholder used by every route during the scaffold phase.
 * Real page components replace this one route at a time during the build phase —
 * never extend Placeholder for production behavior.
 */

function deriveBreadcrumb(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return []
  return segments.map((seg, i) => ({
    label: humanize(seg),
    to: i < segments.length - 1 ? '/' + segments.slice(0, i + 1).join('/') : undefined,
  }))
}

function humanize(segment: string): string {
  if (segment.startsWith(':')) return segment.slice(1).toUpperCase()
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
}

export function Placeholder({ title }: { title: string }) {
  const location = useLocation()
  const breadcrumb = deriveBreadcrumb(location.pathname)
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <PageHeader title={title} breadcrumb={breadcrumb} />
      <section className="flex-1 p-6">
        <div
          className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] p-12 text-center"
          style={{ borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)' }}
        >
          <p className="type-card-title text-[var(--color-text-primary)] mb-2">This screen is not yet implemented</p>
          <p className="type-body-sm text-[var(--color-text-secondary)]">
            Scaffold milestone — visual elevation in progress, feature work to follow.
          </p>
          {import.meta.env.DEV && (
            <p className="type-label text-[var(--color-text-disabled)] mt-6">
              <span className="type-mono-data">{location.pathname}</span>
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
