import { useState } from 'react'
import { Link } from 'react-router'
import { Files, ArrowLeft, CheckCircle } from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: authErr } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (authErr) {
      setError(authErr.message)
      return
    }
    setSent(true)
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
          {sent ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle size={24} className="text-green-600" weight="duotone" />
                </div>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Check your email</h1>
              <p className="text-sm text-gray-500">
                If <strong>{email}</strong> is registered, you'll receive a password reset link shortly.
              </p>
              <p className="text-xs text-gray-400">
                The link expires in 1 hour. Contact your system administrator if you do not receive it.
              </p>
              <Link
                to="/login"
                className="btn btn-primary w-full mt-2"
              >
                Return to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Reset password</h1>
              <p className="text-sm text-gray-500 mb-6">
                Enter your staff email address and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="fp-email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    id="fp-email"
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

                {error && (
                  <div role="alert" className="bg-red-50 border border-red-200 rounded px-3 py-2.5 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="btn btn-primary btn-lg w-full"
                >
                  {loading
                    ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    : 'Send Reset Link'
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
