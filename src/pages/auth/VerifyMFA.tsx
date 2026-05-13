import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Files, LockSimple, ArrowLeft } from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'

// ── VerifyMFA ──────────────────────────────────────────────────────────────────
// Rendered after password sign-in when the user has an enrolled TOTP factor
// and the session is at AAL1. Completing verification here upgrades to AAL2,
// at which point ProtectedRoute allows entry to the app.
//
// ⚠️  I-09: Requires "Multi-Factor Authentication (TOTP)" enabled in the
//     Supabase project's Authentication settings before this page has any effect.
//     If MFA is not enabled, users will never be redirected here.

export default function VerifyMFA() {
  const nav = useNavigate()
  const [code, setCode]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [factorId, setFactorId] = useState<string | null>(null)

  // Redirect to login if no session; redirect to dashboard if already AAL2
  useEffect(() => {
    async function checkState() {
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (!aal) {
        nav('/login', { replace: true })
        return
      }
      if (aal.currentLevel === 'aal2') {
        nav('/dashboard', { replace: true })
        return
      }
      // Load the first verified (enrolled) TOTP factor
      const { data: factors } = await supabase.auth.mfa.listFactors()
      const totp = factors?.totp.find(f => f.status === 'verified')
      if (!totp) {
        // No enrolled factor — user shouldn't be here; send to dashboard
        nav('/dashboard', { replace: true })
        return
      }
      setFactorId(totp.id)
    }
    void checkState()
  }, [nav])

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!factorId) return
    setError(null)
    setLoading(true)

    const { data: challenge, error: challengeErr } =
      await supabase.auth.mfa.challenge({ factorId })
    if (challengeErr || !challenge) {
      setError(challengeErr?.message ?? 'Could not initiate MFA challenge.')
      setLoading(false)
      return
    }

    const { error: verifyErr } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code: code.trim(),
    })
    setLoading(false)
    if (verifyErr) {
      setError('Incorrect code. Check your authenticator app and try again.')
    } else {
      nav('/dashboard', { replace: true })
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    nav('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Files size={28} weight="duotone" className="text-blue-600" />
          <div>
            <p className="font-bold text-gray-900 text-lg leading-tight">PharmacyOS</p>
            <p className="text-xs text-gray-500 leading-tight">Winchester Global Pharmacy</p>
          </div>
        </div>

        <div className="card p-8">
          <div className="flex items-center gap-2 mb-4">
            <LockSimple size={20} weight="duotone" className="text-blue-600 shrink-0" />
            <h1 className="text-xl font-bold text-gray-900">Two-Factor Verification</h1>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Open your authenticator app and enter the 6-digit code for PharmacyOS.
          </p>

          <form onSubmit={handleVerify} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="mfa-code"
                className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
              >
                Verification Code
              </label>
              <input
                id="mfa-code"
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                required
                autoFocus
                autoComplete="one-time-code"
                value={code}
                onChange={e => {
                  setCode(e.target.value.replace(/\D/g, ''))
                  if (error) setError(null)
                }}
                className={`input text-center text-lg tracking-[0.5em] font-mono ${
                  error ? 'border-red-400 focus:ring-red-300' : ''
                }`}
                placeholder="000000"
                aria-describedby={error ? 'mfa-error' : undefined}
              />
              {error && (
                <p id="mfa-error" role="alert" className="mt-1.5 text-xs text-red-600">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="btn btn-primary btn-lg w-full"
            >
              {loading
                ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                : 'Verify'
              }
            </button>
          </form>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 mx-auto mt-4 text-xs text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={12} />
          Sign in with a different account
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          © 2026 Winchester Global Pharmacy · Powered by PharmacyOS
        </p>
      </div>
    </div>
  )
}
