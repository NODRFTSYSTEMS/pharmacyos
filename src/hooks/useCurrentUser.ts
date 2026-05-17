import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { StaffAvatarSourceStatus, StaffRole } from '../types/database'

export interface CurrentUser {
  id: string
  email: string
  name: string
  role: StaffRole
  avatarUrl: string | null
  avatarAlt: string | null
  avatarSourceStatus: StaffAvatarSourceStatus | null
}

export function useCurrentUser() {
  return useQuery<CurrentUser | null>({
    // Include auth user id in queryKey so React Query treats each user's
    // profile as a separate cache entry. Without this, user B logging in
    // after user A sees A's stale profile until the 5-min staleTime expires.
    queryKey: ['current-user'],
    queryFn: async () => {
      // ── AU-05: Use getSession() not getUser() ─────────────────────────────
      // supabase-js v2.x holds an internal async lock for all auth operations.
      // getUser() makes a network call and contends for this lock — the same
      // lock that caused the ProtectedRoute spinner freeze (AU-04). When
      // autoRefreshToken holds the lock on page load, getUser() waits
      // indefinitely, profile never loads, and the fallbacks 'Unknown User' /
      // 'CASHIER' render instead of the real name and role.
      //
      // getSession() reads directly from localStorage (no network, no lock).
      // It returns the cached session including the user object with id/email.
      // This is safe for display data: ProtectedRoute already validates the
      // session cryptographically before this component ever mounts.
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return null
      const user = session.user
      // Query by id (= auth.uid()) — the handle_new_auth_user trigger sets
      // staff_profiles.id = auth.uid() on sign-up. Querying by email risks
      // returning null if the email casing drifts or the trigger claimed the
      // wrong row. id is the authoritative join key.
      //
      // AU-06: avatar_alt and avatar_source_status are NOT selected here.
      // Migration 028 adds those columns but was not yet applied to production.
      // Selecting missing columns causes a 400 / code 42703 error that is
      // silently swallowed (only `data` is destructured, not `error`), making
      // profile null and triggering 'Unknown User'/'CASHIER' fallbacks.
      // Once migration 028 is applied to production, restore the full select:
      //   .select('full_name, role, avatar_url, avatar_alt, avatar_source_status')
      const { data: profile } = await supabase
        .from('staff_profiles')
        .select('full_name, role, avatar_url')
        .eq('id', user.id)
        .maybeSingle()
      // I-20: If no staff_profiles record exists, surface the data integrity
      // problem rather than silently defaulting. Name must never be a raw
      // email prefix — 'Unknown User' is intentionally visible so it is caught.
      return {
        id:    user.id,
        email: user.email!,
        name:  profile?.full_name?.trim() || 'Unknown User',
        role:  (profile?.role ?? 'CASHIER') as StaffRole,
        avatarUrl: profile?.avatar_url ?? null,
        avatarAlt: null,              // AU-06: restored after migration 028 applied to production
        avatarSourceStatus: null,     // AU-06: restored after migration 028 applied to production
      }
    },
    staleTime: 60_000,   // 1 min — tighter window so role/name changes propagate quickly
    retry: false,
  })
}
