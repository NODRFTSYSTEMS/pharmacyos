import { useEffect, useRef, useState, useCallback } from 'react'
import { Navigate } from 'react-router'
import { supabase } from '../lib/supabase'

// ── Session timeout configuration (I-12) ─────────────────────────────────────
// Idle sessions are signed out after IDLE_TIMEOUT_MS of no user activity.
// A warning banner appears WARN_BEFORE_MS before sign-out.
// Resets on: mousemove, keydown, mousedown, touchstart, scroll.
const IDLE_TIMEOUT_MS = 20 * 60 * 1000  // 20 minutes
const WARN_BEFORE_MS  =  2 * 60 * 1000  //  2 minutes before timeout

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<'loading' | 'authed' | 'mfa-required' | 'unauthed'>('loading')
  const [showWarning, setShowWarning] = useState(false)
  const idleTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warnTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)

  const signOutIdle = useCallback(async () => {
    setShowWarning(false)
    await supabase.auth.signOut()
    setState('unauthed')
  }, [])

  const resetTimers = useCallback(() => {
    setShowWarning(false)
    if (idleTimer.current)  clearTimeout(idleTimer.current)
    if (warnTimer.current)  clearTimeout(warnTimer.current)

    warnTimer.current  = setTimeout(() => setShowWarning(true), IDLE_TIMEOUT_MS - WARN_BEFORE_MS)
    idleTimer.current  = setTimeout(signOutIdle, IDLE_TIMEOUT_MS)
  }, [signOutIdle])

  useEffect(() => {
    // ── Auth state + AAL check (I-09) ───────────────────────────────────────
    async function resolveAuthState() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setState('unauthed')
        return
      }
      // If the user has enrolled MFA and the session is at AAL1, gate on MFA
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (aal?.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
        setState('mfa-required')
      } else {
        setState('authed')
      }
    }
    void resolveAuthState()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (!session) {
        setState('unauthed')
        return
      }
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (aal?.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
        setState('mfa-required')
      } else {
        setState('authed')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    // ── Idle timer — only active when authenticated ─────────────────────────
    if (state !== 'authed') return

    const events = ['mousemove','keydown','mousedown','touchstart','scroll'] as const
    const handler = () => resetTimers()

    events.forEach(e => window.addEventListener(e, handler, { passive: true }))
    resetTimers()

    return () => {
      events.forEach(e => window.removeEventListener(e, handler))
      if (idleTimer.current) clearTimeout(idleTimer.current)
      if (warnTimer.current) clearTimeout(warnTimer.current)
    }
  }, [state, resetTimers])

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
          aria-label="Loading…"
        />
      </div>
    )
  }

  if (state === 'unauthed') {
    return <Navigate to="/login" replace />
  }

  // I-09: User has a session but MFA is required — redirect to verify page
  if (state === 'mfa-required') {
    return <Navigate to="/verify-mfa" replace />
  }

  return (
    <>
      {showWarning && (
        <div
          className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-white text-sm
                     flex items-center justify-between gap-4 px-4 py-2.5 shadow-lg"
          role="alert"
          aria-live="assertive"
        >
          <span>
            Your session will expire in 2 minutes due to inactivity. Move your mouse or
            press any key to stay logged in.
          </span>
          <button
            onClick={resetTimers}
            className="shrink-0 px-3 py-1 rounded bg-white/20 hover:bg-white/30
                       text-white text-xs font-medium transition-colors"
          >
            Stay Logged In
          </button>
        </div>
      )}
      {children}
    </>
  )
}
