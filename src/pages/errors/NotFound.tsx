// ── /404 Not Found Page ───────────────────────────────────────────────────────
// Rendered when a user navigates to a route that does not exist.

import { useNavigate, useLocation } from 'react-router'
import { Files, MagnifyingGlass } from '@phosphor-icons/react'

export function NotFound() {
  const navigate     = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Logo mark */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Files size={22} weight="duotone" className="text-blue-600" />
          <span className="font-bold text-gray-800 text-base">PharmacyOS</span>
        </div>

        <div className="card p-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <MagnifyingGlass size={32} weight="duotone" className="text-blue-400" />
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-sm text-gray-500 mb-1">
            The page you're looking for doesn't exist or may have moved.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Check the address bar, or use the button below to return to the dashboard.
          </p>

          {/* Attempted path display */}
          <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2 mb-8 text-left">
            <p className="text-xs text-gray-400 mb-0.5">Attempted path</p>
            <code className="text-xs font-mono text-gray-700 break-all">{pathname}</code>
          </div>

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
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          PharmacyOS · Page not found. If a link brought you here, report it to your administrator.
        </p>
      </div>
    </div>
  )
}

export default NotFound
