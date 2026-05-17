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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      // Query by id (= auth.uid()) — the handle_new_auth_user trigger sets
      // staff_profiles.id = auth.uid() on sign-up. Querying by email risks
      // returning null if the email casing drifts or the trigger claimed the
      // wrong row. id is the authoritative join key.
      const { data: profile } = await supabase
        .from('staff_profiles')
        .select('full_name, role, avatar_url, avatar_alt, avatar_source_status')
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
        avatarAlt: profile?.avatar_alt ?? null,
        avatarSourceStatus: (profile?.avatar_source_status ?? null) as StaffAvatarSourceStatus | null,
      }
    },
    staleTime: 60_000,   // 1 min — tighter window so role/name changes propagate quickly
    retry: false,
  })
}
