import { Link, Outlet } from 'react-router-dom'

/**
 * POS terminal layout — fullscreen, no sidebar.
 * Authority: design handoff Section 3.2.
 *
 * The 60/40 product+cart vs payment grid is enforced by the /pos page itself,
 * not the layout. Other /pos/* routes (products, loyalty, reports) override the
 * grid as needed. The layout only provides the close-POS exit and the surface.
 */
export function PosLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[--color-bg-base]">
      <header className="h-14 px-6 flex items-center justify-between bg-[--color-bg-surface] border-b border-[--color-border]">
        <p className="font-sans font-semibold text-sm">PharmacyOS · Retail</p>
        <Link
          to="/dashboard"
          className="text-xs text-[--color-primary] hover:text-[--color-primary-hover]"
        >
          Close POS
        </Link>
      </header>
      <main className="flex-1 min-h-0">
        <Outlet />
      </main>
    </div>
  )
}
