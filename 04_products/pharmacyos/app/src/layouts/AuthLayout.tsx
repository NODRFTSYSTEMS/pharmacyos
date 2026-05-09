import { Outlet } from 'react-router-dom'

/**
 * Auth layout — centered card on neutral background. Used by /login, /login/2fa.
 * Authority: design handoff Section 3.3.
 */
export function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-bg-base px-4">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-card bg-primary/10 mb-4">
          <span className="text-xl font-bold text-primary">℞</span>
        </div>
        <h1 className="type-section text-text-primary">PharmacyOS</h1>
        <p className="text-xs text-text-secondary mt-1">Secure pharmacy operations platform</p>
      </div>

      <main className="w-full max-w-[400px] bg-bg-surface rounded-card shadow-card p-8">
        <Outlet />
      </main>

      <p className="mt-8 text-xs text-text-disabled">
        © {new Date().getFullYear()} Winchester Global Pharmacy · Built by NoDrftSystems
      </p>
    </div>
  )
}
