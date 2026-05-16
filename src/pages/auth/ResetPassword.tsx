import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router'
import { Files, ArrowLeft, CheckCircle } from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'

type SessionState = 'loading' | 'ready' | 'invalid'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [sessionState, setSessionState] = useState<SessionState>('loading')
  const sessionRef = useRef<SessionState>('loading')

  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  useEffect(() => {
    // Supabase v2 auto-processes the URL hash (#access_token=...&type=recovery)
    // and emits PASSWORD_RECOVERY on the auth state change listener.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(event => {
      if (event === 'PASSWORD_RECOVERY') {
        sessionRef.current = 'ready'
        setSessionState('ready')
      }
    })

    // Also handle the case where the page reloads after the hash has already
    // been consumed (session already stored in client).
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session && sessionRef.current === 'loading') {
        sessionRef.current = 'ready'
        setSessionState('ready')
      }
    })

    // Safety timeout — if no auth event fires, the link is expired or invalid.
    const timer = setTimeout(() => {
      if (sessionRef.current === 'loading') {
        sessionRef.current = 'invalid'
        setSessionState('invalid')
      }
    }, 3000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timer)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    const { error: updateErr } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateErr) {
      setError(updateErr.message)
      return
    }

    setSuccess(true)
    // Clear the recovery session so the staff member signs in fresh.
    await supabase.auth.signOut()
    setTimeout(() => { navigate('/login', { replace: true }) }, 2500)
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Files size={28} weight="duotone" className="text-blue-600" />
          <div>
            <p className="font-bold text-gray-900 text-lg leading-tight">PharmacyOS</p>
            <p className="text-xs text-gray-500 leading-tight">Pharmacy Operations Platform</p>
          </div>
        </div>

        <div className="card p-8">

          {/* ── Success state ─────────────────────────────────────────────── */}
          {success && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle size={24} className="text-green-600" weight="duotone" />
                </div>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Password updated</h1>
              <p className="text-sm text-gray-500">
                Your password has been changed. Redirecting you to sign in…
              </p>
            </div>
          )}

          {/* ── Invalid / expired link ────────────────────────────────────── */}
          {!success && sessionState === 'invalid' && (
            <div className="text-center space-y-4">
              <h1 className="text-xl font-bold text-gray-900">Link expired</h1>
              <p className="text-sm text-gray-500">
                This password reset link has expired or is invalid. Request a new one from the
                sign-in page.
              </p>
              <Link to="/forgot-password" className="btn btn-primary w-full mt-2">
                Request a new link
              </Link>
            </div>
          )}

          {/* ── Loading — waiting for Supabase to process the URL token ──── */}
          {!success && sessionState === 'loading' && (
            <div className="text-center space-y-4 py-4">
              <span
                className="inline-block w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"
                aria-label="Verifying reset link…"
              />
              <p className="text-sm text-gray-500">Verifying reset link…</p>
            </div>
          )}

          {/* ── Password form ─────────────────────────────────────────────── */}
          {!success && sessionState === 'ready' && (
            <>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Set new password</h1>
              <p className="text-sm text-gray-500 mb-6">
                Enter a new password for your staff account. Minimum 8 characters.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="rp-password"
                    className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
                  >
                    New password
                  </label>
                  <input
                    id="rp-password"
                    type="password"
                    required
                    autoFocus
                    autoComplete="new-password"
                    minLength={8}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label
                    htmlFor="rp-confirm"
                    className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
                  >
                    Confirm password
                  </label>
                  <input
                    id="rp-confirm"
                    type="password"
                    required
                    autoComplete="new-password"
                    minLength={8}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className="input"
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <div role="alert" className="bg-red-50 border border-red-200 rounded px-3 py-2.5 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !password || !confirm}
                  className="btn btn-primary btn-lg w-full"
                >
                  {loading
                    ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    : 'Update password'
                  }
                </button>
              </form>

              <div className="mt-5 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft size={12} />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}

        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 PharmacyOS · NoDrftSystems
        </p>
      </div>
    </div>
  )
}
