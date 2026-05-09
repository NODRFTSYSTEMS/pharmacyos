import type { ReactNode } from 'react'
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb'

/**
 * Page header — design handoff Section 3.1.
 * 80px tall, --color-bg-surface, bottom border --color-border.
 * Title left (type-page-title), breadcrumb beneath (12px secondary), primary CTA right-aligned.
 */
type PageHeaderProps = {
  title: string
  breadcrumb?: readonly BreadcrumbItem[]
  cta?: ReactNode
}

export function PageHeader({ title, breadcrumb, cta }: PageHeaderProps) {
  return (
    <header className="h-20 px-6 flex items-center justify-between bg-[var(--color-bg-surface)] border-b border-[var(--color-border)] shrink-0">
      <div className="flex flex-col gap-0.5 min-w-0">
        <h1 className="type-page-title text-[var(--color-text-primary)] truncate">{title}</h1>
        {breadcrumb && breadcrumb.length > 0 && <Breadcrumb items={breadcrumb} />}
      </div>
      {cta && <div className="ml-4 shrink-0 flex items-center gap-2">{cta}</div>}
    </header>
  )
}
