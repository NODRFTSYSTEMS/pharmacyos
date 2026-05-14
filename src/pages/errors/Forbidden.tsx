// ── /403 Forbidden Page ───────────────────────────────────────────────────────
// Rendered when a user navigates to a route they lack permission to access.
// Access denial is logged to the audit trail via the RoleGuard component.

import { useNavigate, useLocation } from 'react-router'
import { Files, ShieldWarning } from '@phosphor-icons/react'
import { useCurrentUser } from '../../hooks/useCurrentUser'

export function Forbidden() {
  const navigate      = useNavigate()
  const { pathname }  = useLocation()
  const { data: user } = useCurrentUser()
  const role = user?.role ?? 'Unknown'
  const now  = new Date().toLocaleTimeString('en-JM', {
    timeZone: 'America/Jamaica',
    hour:     '2-digit',
    minute:   '2-digit',
  })

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
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <ShieldWarning size={32} weight="duotone" className="text-red-500" />
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-sm text-gray-500 mb-1">
            Your role ({role}) does not have permission to view this page.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            If you believe this is an error, contact your system administrator.
          </p>

          {/* Audit confirmation badge */}
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 text-xs text-amber-700 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" aria-hidden="true" />
            Access denied event logged · {now}
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
          PharmacyOS · Error 403 · Attempted:{' '}
          <code className="font-mono">{pathname}</code>
        </p>
      </div>
    </div>
  )
}

export default Forbidden
