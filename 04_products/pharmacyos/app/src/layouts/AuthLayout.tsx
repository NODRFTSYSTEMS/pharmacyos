import { Outlet } from 'react-router-dom'

/**
 * Auth layout — centered card on neutral background. Used by /login, /login/2fa.
 * Authority: design handoff Section 3.3.
 */
export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[--color-bg-base] p-4">
      <div className="mb-12 text-center">
        <p className="font-sans text-2xl font-semibold tracking-tight text-[--color-text-primary]">
          PharmacyOS
        </p>
        <p className="font-sans text-xs text-[--color-text-secondary] mt-1">Winchester Global</p>
      </div>
      <main
        className="w-full max-w-[400px] bg-[--color-bg-surface] p-8"
        style={{
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <Outlet />
      </main>
      <footer className="mt-8 text-xs text-[--color-text-secondary]">
        © Winchester Global Pharmacy {new Date().getFullYear()}
      </footer>
    </div>
  )
}
