import type { ReactNode } from 'react'
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb'

/**
 * Page header — design handoff Section 3.1.
 * 80px row: title left + (subtitle OR breadcrumb), CTA right.
 * Optional 64px filter bar beneath.
 *
 * - subtitle: short descriptive line under the title (e.g., "Winchester Global · Kingston")
 * - breadcrumb: navigation breadcrumb for nested routes (mutually exclusive with subtitle in practice)
 */
type PageHeaderProps = {
  title: string
  subtitle?: string
  breadcrumb?: readonly BreadcrumbItem[]
  cta?: ReactNode
  filterBar?: ReactNode
}

export function PageHeader({ title, subtitle, breadcrumb, cta, filterBar }: PageHeaderProps) {
  return (
    <div className="shrink-0">
      <header className="h-20 flex items-center justify-between px-6 bg-bg-surface border-b border-border">
        <div className="flex flex-col gap-0.5 min-w-0">
          <h1 className="type-page-title text-text-primary truncate">{title}</h1>
          {subtitle && <p className="text-xs text-text-secondary truncate">{subtitle}</p>}
          {breadcrumb && breadcrumb.length > 0 && <Breadcrumb items={breadcrumb} />}
        </div>
        {cta && <div className="ml-4 shrink-0 flex items-center gap-2">{cta}</div>}
      </header>
      {filterBar && (
        <div className="h-16 flex items-center px-6 bg-bg-surface border-b border-border">
          {filterBar}
        </div>
      )}
    </div>
  )
}
