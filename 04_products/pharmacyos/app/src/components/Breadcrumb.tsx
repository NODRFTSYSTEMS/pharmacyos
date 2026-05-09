import { Link } from 'react-router-dom'

/**
 * Breadcrumb — design handoff Section 4.17.
 * 12px secondary text, separator ›, last segment is the current page (not a link, primary text).
 */

export type BreadcrumbItem = {
  label: string
  to?: string
}

export function Breadcrumb({ items, className = '' }: { items: readonly BreadcrumbItem[]; className?: string }) {
  if (items.length === 0) return null
  return (
    <nav aria-label="Breadcrumb" className={`type-label ${className}`}>
      <ol className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && (
                <span aria-hidden className="text-[var(--color-text-secondary)]">
                  ›
                </span>
              )}
              {item.to && !isLast ? (
                <Link to={item.to} className="hover:text-[var(--color-text-primary)]">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-[var(--color-text-primary)]' : ''} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
