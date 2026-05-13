// ── /404 Not Found Page ───────────────────────────────────────────────────────
// Rendered when a user navigates to a route that does not exist.
// Replaces the silent redirect to /dashboard.

import { useNavigate } from 'react-router'
import { MagnifyingGlass } from '@phosphor-icons/react'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
      <div className="card max-w-md w-full text-center p-10">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <MagnifyingGlass size={32} weight="duotone" className="text-blue-400" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-sm text-gray-500 mb-1">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Check the address bar, or use the button below to return to the dashboard.
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary w-full"
          >
            Return to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost w-full"
          >
            Go Back
          </button>
        </div>

        <p className="text-xs text-gray-300 mt-6">Error 404 — PharmacyOS</p>
      </div>
    </div>
  )
}

export default NotFound
