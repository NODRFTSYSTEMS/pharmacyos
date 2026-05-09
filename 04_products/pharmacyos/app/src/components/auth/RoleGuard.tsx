import type { PropsWithChildren } from 'react'
import type { Role } from '@/types/auth'

type RoleGuardProps = PropsWithChildren<{
  roles: readonly Role[]
}>

/**
 * Role gate for role-restricted routes.
 *
 * STUB IMPLEMENTATION (2026-05-08):
 *   Passes children through unconditionally; the `roles` prop is recorded for the future implementation.
 *   When auth is wired (see ProtectedRoute):
 *     - Read role from session.user.app_metadata.role (custom JWT claim)
 *     - If role is in `roles` array: render children
 *     - If not: redirect to /unauthorized (a rendered screen, not a 404 — per ADR Decision 7)
 *
 * Note: this is the UI enforcement layer. RLS at the database and Edge Function JWT verification are
 * the actual security boundaries. UI route guarding is UX, not security.
 */
export function RoleGuard({ roles, children }: RoleGuardProps) {
  // TODO(auth): replace stub with real role check using session JWT claim
  void roles
  return <>{children}</>
}
