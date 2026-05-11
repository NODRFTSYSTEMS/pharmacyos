import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { List, Info, X } from '@phosphor-icons/react'
import { Sidebar } from '@/components/Sidebar'
import { SkipLink } from '@/components/SkipLink'
import { NotificationCenter } from '@/components/NotificationCenter'

const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

/**
 * Admin portal layout — sidebar (240px) + main content area.
 * Authority: design handoff Section 3.1.
 * On desktop (≥768px): Sidebar is sticky in the flex row.
 * On mobile (<768px): Sidebar slides in as a fixed overlay with a backdrop.
 */
export function AdminPortalLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [demoBannerDismissed, setDemoBannerDismissed] = useState(
    () => sessionStorage.getItem('demoBannerDismissed') === 'true',
  )

  function dismissDemoBanner() {
    sessionStorage.setItem('demoBannerDismissed', 'true')
    setDemoBannerDismissed(true)
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-base">
      <SkipLink />

      {/* Mobile backdrop — tap to close sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <main id="main-content" className="flex-1 flex flex-col overflow-y-auto min-w-0">
        {/* Top bar — mobile: hamburger + logo; desktop: notification bell */}
        <div className="sticky top-0 z-30 flex items-center gap-3 h-14 px-4 bg-bg-sidebar border-b border-white/10 shrink-0">
          {/* Mobile: hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-control text-white hover:bg-white/10 transition-colors"
          >
            <List size={20} aria-hidden="true" />
          </button>
          {/* Mobile: logo mark */}
          <div className="md:hidden flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded bg-primary/20 text-primary font-bold text-xs">
              ℞
            </div>
            <p className="type-card-title text-white leading-tight">PharmacyOS</p>
          </div>
          {/* Spacer */}
          <div className="flex-1" />
          {/* Notification bell — visible on all breakpoints */}
          <div className="text-white [&_button]:text-white [&_button:hover]:text-white [&_button:hover]:bg-white/10">
            <NotificationCenter />
          </div>
        </div>

        {/* Demo Mode banner — shown when VITE_DEMO_MODE=true and not dismissed */}
        {IS_DEMO_MODE && !demoBannerDismissed && (
          <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-primary/10 border-b border-primary/20 text-xs text-text-secondary">
            <Info size={14} className="text-primary shrink-0" aria-hidden="true" />
            <span>
              <span className="font-medium text-primary">Demo Mode</span>
              {' '}— sample data only · Backend connections pending
            </span>
            <button
              type="button"
              onClick={dismissDemoBanner}
              aria-label="Dismiss demo mode banner"
              className="ml-auto text-text-disabled hover:text-text-secondary transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  )
}
