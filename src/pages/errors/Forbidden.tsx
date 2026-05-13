// ── /403 Forbidden Page ───────────────────────────────────────────────────────
// Rendered when a user navigates to a route they lack permission to access.
// Access denial is logged to the audit trail via the RoleGuard component.

import { useNavigate } from 'react-router'
import { ShieldWarning } from '@phosphor-icons/react'

export function Forbidden() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
      <div className="card max-w-md w-full text-center p-10">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <ShieldWarning size={32} weight="duotone" className="text-red-500" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-sm text-gray-500 mb-1">
          Your role does not have permission to view this page.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          If you believe this is an error, contact your system administrator.
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

        <p className="text-xs text-gray-300 mt-6">Error 403 — PharmacyOS</p>
      </div>
    </div>
  )
}

export default Forbidden
