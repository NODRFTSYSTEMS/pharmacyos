import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Files, Eye, EyeSlash } from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const nav         = useNavigate()
  const queryClient = useQueryClient()
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
    // Clear any cached queries from a previous session so the incoming user
    // never sees another user's profile, role, or data mid-session.
    queryClient.clear()
    // I-09: Check if user has enrolled MFA — redirect to verify-mfa if AAL2 is required
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    setLoading(false)
    if (aal?.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
      nav('/verify-mfa', { replace: true })
    } else {
      nav('/dashboard', { replace: true })
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
            {now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

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
              <label htmlFor="login-password" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
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
            >
              {loading
                ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                : 'Sign in'
              }
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              to="/forgot-password"
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 PharmacyOS · NoDrftSystems
        </p>
      </div>
    </div>
  )
}
