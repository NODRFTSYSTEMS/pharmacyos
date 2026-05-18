import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Files, Eye, EyeSlash, Warning } from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function Login() {
  usePageTitle('Sign In')
  const queryClient = useQueryClient()
  const { search }  = useLocation()
  const sessionExpired = new URLSearchParams(search).get('reason') === 'session_expired'

  const [email,        setEmail]       = useState('')
  const [password,     setPassword]    = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading,      setLoading]     = useState(false)
  const [error,        setError]       = useState<string | null>(null)
  const [now,          setNow]         = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: authErr } = await supabase.auth.signInWithPassword({ email, password })
    if (authErr) {
      setLoading(false)
      setError(authErr.message)
      return
    }
    // Clear React Query cache so the previous user's profile is never served
    // to the incoming user. Redundant after a full reload but explicit.
    queryClient.clear()
    // I-09: Check if user has enrolled MFA — redirect to verify-mfa if AAL2 is required
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    // Full page reload on login — flushes Supabase JS SDK in-memory session state
    // and the React Query module singleton so this user starts from a clean slate.
    // SPA nav (nav()) keeps module-level singletons alive, which allows a window
    // where supabase.auth.getUser() resolves stale context from the previous user.
    // setLoading(false) omitted — page is about to fully reload.
    if (aal?.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
      window.location.replace('/verify-mfa')
    } else {
      window.location.replace('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-4">
          <Files size={28} weight="duotone" className="text-blue-600" />
          <div>
            <p className="font-bold text-gray-900 text-lg leading-tight">PharmacyOS</p>
            <p className="text-xs text-gray-500 leading-tight">Pharmacy Operations Platform</p>
          </div>
        </div>

        {/* Live clock */}
        <div className="text-center mb-6">
          <p className="text-2xl font-semibold text-gray-800 tabular-nums tracking-tight">
            {now.toLocaleTimeString('en-JM', { timeZone: 'America/Jamaica', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {now.toLocaleDateString('en-JM', { timeZone: 'America/Jamaica', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Session-expired notice — shown when ProtectedRoute redirected with ?reason=session_expired */}
        {sessionExpired && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 mb-4 text-sm text-amber-800"
          >
            <Warning size={16} weight="duotone" className="mt-0.5 shrink-0 text-amber-500" aria-hidden="true" />
            <p>Your session timed out due to inactivity. Please sign in again.</p>
          </div>
        )}

        <div className="card p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Sign in</h1>
          <p className="text-sm text-gray-500 mb-6">Use your staff account credentials.</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Reset password
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword
                    ? <EyeSlash size={18} aria-hidden="true" />
                    : <Eye size={18} aria-hidden="true" />
                  }
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" className="bg-red-50 border border-red-200 rounded px-3 py-2.5 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="btn btn-primary btn-lg w-full"
              aria-label={loading ? 'Signing in, please wait' : undefined}
            >
              {loading
                ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                : 'Sign in'
              }
            </button>
          </form>

        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 PharmacyOS · NoDrftSystems
        </p>
      </div>
    </div>
  )
}
