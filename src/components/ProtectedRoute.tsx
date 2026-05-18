import { useEffect, useRef, useState, useCallback } from 'react'
import { Navigate } from 'react-router'
import { supabase } from '../lib/supabase'

// ── Session timeout configuration (I-12) ─────────────────────────────────────
// Idle sessions are signed out after IDLE_TIMEOUT_MS of no user activity.
// A warning banner appears WARN_BEFORE_MS before sign-out.
// Resets on: mousemove, keydown, mousedown, touchstart, scroll.
const IDLE_TIMEOUT_MS = 20 * 60 * 1000  // 20 minutes
const WARN_BEFORE_MS  =  2 * 60 * 1000  //  2 minutes before timeout

// ── AAL check with timeout ────────────────────────────────────────────────────
// supabase-js v2.x uses an internal async lock for all auth operations.
// On page load, autoRefreshToken can hold this lock while refreshing the session,
// causing mfa.getAuthenticatorAssuranceLevel() to wait indefinitely — freezing
// the spinner. We race against a 3 s timeout and fail open (authed) so users
// with a valid session never see a permanently stuck spinner.
// Login.tsx already enforces MFA requirements before redirecting here,
// so failing open is safe for the common (no-MFA) path.
const AAL_TIMEOUT_MS = 3_000

type AalResult = Awaited<ReturnType<typeof supabase.auth.mfa.getAuthenticatorAssuranceLevel>>
function getAalWithTimeout(): Promise<AalResult> {
  const fallback: AalResult = { data: { currentLevel: 'aal1', nextLevel: 'aal1', currentAuthenticationMethods: [] }, error: null }
  return Promise.race([
    supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
    new Promise<AalResult>(resolve =>
      setTimeout(() => {
        console.warn('[ProtectedRoute] getAuthenticatorAssuranceLevel timed out — failing open')
        resolve(fallback)
      }, AAL_TIMEOUT_MS)
    ),
  ])
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<'loading' | 'authed' | 'mfa-required' | 'unauthed'>('loading')
  const [showWarning,  setShowWarning]  = useState(false)
  const [idleExpired,  setIdleExpired]  = useState(false)
  const [secondsLeft,  setSecondsLeft]  = useState<number | null>(null)
  const idleTimer    = useRef<ReturnType<typeof setTimeout>  | null>(null)
  const warnTimer    = useRef<ReturnType<typeof setTimeout>  | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const signOutIdle = useCallback(async () => {
    setShowWarning(false)
    setSecondsLeft(null)
    if (countdownRef.current) clearInterval(countdownRef.current)
    setIdleExpired(true)
    await supabase.auth.signOut()
    setState('unauthed')
  }, [])

  const resetTimers = useCallback(() => {
    setShowWarning(false)
    setSecondsLeft(null)
    if (countdownRef.current) clearInterval(countdownRef.current)
    if (idleTimer.current)    clearTimeout(idleTimer.current)
    if (warnTimer.current)    clearTimeout(warnTimer.current)

    warnTimer.current = setTimeout(() => {
      setShowWarning(true)
      const totalSecs = Math.floor(WARN_BEFORE_MS / 1000)
      setSecondsLeft(totalSecs)
      countdownRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s === null || s <= 1) {
            if (countdownRef.current) clearInterval(countdownRef.current)
            return null
          }
          return s - 1
        })
      }, 1_000)
    }, IDLE_TIMEOUT_MS - WARN_BEFORE_MS)

    idleTimer.current = setTimeout(signOutIdle, IDLE_TIMEOUT_MS)
  }, [signOutIdle])

  useEffect(() => {
    // ── Auth state + AAL check (I-09) ───────────────────────────────────────
    // IMPORTANT: resolveAuthState MUST be wrapped in try/catch.
    // `void resolveAuthState()` silently swallows thrown errors — if getSession
    // or getAuthenticatorAssuranceLevel throw (bad env vars, network failure, etc.)
    // the state stays at 'loading' forever and the user sees a blank spinner.
    async function resolveAuthState() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          console.error('[ProtectedRoute] getSession error:', sessionError.message)
          setState('unauthed')
          return
        }
        if (!session) {
          setState('unauthed')
          return
        }
        // If the user has enrolled MFA and the session is at AAL1, gate on MFA
        const { data: aal, error: aalError } = await getAalWithTimeout()
        if (aalError) {
          // MFA check failed — fail open (authed) rather than blocking login
          console.warn('[ProtectedRoute] MFA AAL check failed:', aalError.message)
          setState('authed')
          return
        }
        if (aal?.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
          setState('mfa-required')
        } else {
          setState('authed')
        }
      } catch (err) {
        // Unexpected throw (e.g. env vars missing, Supabase misconfigured)
        // Fail safe: redirect to login so the user sees something actionable.
        console.error('[ProtectedRoute] Auth resolution failed unexpectedly:', err)
        setState('unauthed')
      }
    }
    void resolveAuthState()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      try {
        if (!session) {
          setState('unauthed')
          return
        }
        const { data: aal } = await getAalWithTimeout()
        if (aal?.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
          setState('mfa-required')
        } else {
          setState('authed')
        }
      } catch (err) {
        console.error('[ProtectedRoute] onAuthStateChange handler error:', err)
        setState('unauthed')
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
      if (idleTimer.current)    clearTimeout(idleTimer.current)
      if (warnTimer.current)    clearTimeout(warnTimer.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [state, resetTimers])

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        {/* C-05: role="status" wraps spinner; spinner itself is aria-hidden; sr-only text announces state */}
        <div role="status" aria-label="Loading, please wait">
          <div
            className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <span className="sr-only">Loading…</span>
        </div>
      </div>
    )
  }

  if (state === 'unauthed') {
    return <Navigate to={idleExpired ? '/login?reason=session_expired' : '/login'} replace />
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
          role="status"
          aria-live="polite"
        >
          {/* M-04: role="status" + aria-live="polite" avoids screen-reader interruption on every
              countdown tick. The countdown value is wrapped in aria-live="off" so only the initial
              banner appearance is announced — not every second. */}
          <span>
            {secondsLeft !== null
              ? <>Session expires in <strong aria-live="off">{Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}</strong> — move your mouse or press any key to stay logged in.</>
              : <>Your session will expire shortly due to inactivity. Move your mouse or press any key to stay logged in.</>
            }
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
