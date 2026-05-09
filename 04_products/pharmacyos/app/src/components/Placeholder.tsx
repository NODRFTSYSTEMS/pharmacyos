import { useLocation } from 'react-router-dom'
import { PageHeader } from './PageHeader'
import type { BreadcrumbItem } from './Breadcrumb'

/**
 * Placeholder used by routes that haven't been implemented yet.
 * Replace per route as feature work lands — never extend this for production behavior.
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
        <div className="bg-bg-surface border border-border rounded-card shadow-card p-12 text-center">
          <p className="type-card-title text-text-primary mb-2">This screen is not yet implemented</p>
          <p className="type-body-sm text-text-secondary">
            Scaffold milestone — feature work lands route by route during the build phase.
          </p>
          {import.meta.env.DEV && (
            <p className="type-label text-text-disabled mt-6">
              <span className="type-mono-data">{location.pathname}</span>
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
