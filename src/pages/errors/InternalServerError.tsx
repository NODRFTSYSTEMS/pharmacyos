// ── /500 Internal Server Error Page ──────────────────────────────────────────
// Rendered when:
//   1. The global AppErrorBoundary catches an unhandled React render error
//   2. A route explicitly navigates to /500 (e.g. after a fatal API failure)
// Provides a branded recovery screen with reload and dashboard fallback paths.

import { useNavigate } from 'react-router'
import { Files, Warning } from '@phosphor-icons/react'
import { usePageTitle } from '../../hooks/usePageTitle'

interface Props {
  /** Optional error message surfaced from the ErrorBoundary (dev-only display) */
  message?: string
  /** If true, renders without the navigate/reload buttons (used inside ErrorBoundary) */
  standalone?: boolean
}

export function InternalServerError({ message, standalone = false }: Props) {
  usePageTitle('System Error')
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Logo mark */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Files size={22} weight="duotone" className="text-blue-600" aria-hidden="true" />
          <span className="font-bold text-gray-800 text-base">PharmacyOS</span>
        </div>

        <div className="card p-10 text-center" role="alert" aria-live="assertive">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <Warning size={32} weight="duotone" className="text-red-500" aria-hidden="true" />
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
          <p className="text-sm text-gray-500 mb-1">
            PharmacyOS encountered an unexpected system error.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Your work may not have been saved. Reload the application to continue.
            If the problem persists, contact your system administrator.
          </p>

          {/* Dev-only error detail */}
          {import.meta.env.DEV && message && (
            <details className="mb-6 text-left">
              <summary className="text-xs text-gray-400 cursor-pointer mb-1">
                Error details (dev only)
              </summary>
              <pre className="text-xs text-red-600 bg-red-50 rounded p-3 overflow-auto max-h-32 whitespace-pre-wrap">
                {message}
              </pre>
            </details>
          )}

          {!standalone && (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary w-full"
              >
                Reload Application
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-ghost w-full"
              >
                Return to Dashboard
              </button>
            </div>
          )}

          {standalone && (
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary w-full"
            >
              Reload Application
            </button>
          )}
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          PharmacyOS · Error 500 · System Error
        </p>
      </div>
    </div>
  )
}

export default InternalServerError
