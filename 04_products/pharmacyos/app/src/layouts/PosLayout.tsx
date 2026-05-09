import { Outlet, Link } from 'react-router-dom'
import { X } from '@phosphor-icons/react'
import { SkipLink } from '@/components/SkipLink'

/**
 * POS Terminal layout — fullscreen, no sidebar. Authority: design handoff Section 3.2.
 * The 60/40 product+cart vs payment grid is enforced by the /pos page itself, not the layout.
 */
export function PosLayout() {
  return (
    <div className="flex flex-col h-screen w-full bg-bg-base overflow-hidden">
      <SkipLink />
      <header className="h-12 flex items-center justify-between px-6 bg-bg-surface border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <span className="type-caption text-text-secondary">POS Terminal</span>
          <span className="text-text-disabled">·</span>
          <span className="text-xs text-text-secondary">PharmacyOS · Winchester</span>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          <X size={14} />
          Close Terminal
        </Link>
      </header>
      <main id="main-content" className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
