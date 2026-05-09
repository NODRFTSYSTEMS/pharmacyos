import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'

/**
 * Admin portal layout — sidebar (240px) + main content area.
 * Authority: design handoff Section 3.1.
 * Sidebar is its own component (Section 4.1) so it can be reused and tested in isolation.
 */
export function AdminPortalLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-base">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
