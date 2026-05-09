import type { PropsWithChildren } from 'react'

/**
 * Authentication gate for protected routes.
 *
 * STUB IMPLEMENTATION (2026-05-08):
 *   This component currently passes children through unconditionally.
 *   Real auth check requires Supabase Auth wired up (project linked, schema migrated, JWT custom claim hook live).
 *   When auth is wired:
 *     - Read session via useSupabaseSession() hook
 *     - If no session: redirect to /login (preserve `from` location)
 *     - If session and not 2FA-verified yet: redirect to /login/2fa
 *     - Otherwise render children
 *   See ADR Decision 7 for the three-layer enforcement model.
 *
 * Until auth is wired, every route is treated as accessible. Do NOT deploy this build to any environment
 * with real user access.
 */
export function ProtectedRoute({ children }: PropsWithChildren) {
  // TODO(auth): replace stub with real session check
  return <>{children}</>
}
