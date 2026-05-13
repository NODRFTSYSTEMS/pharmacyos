import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { StaffRole } from '../types/database'

export interface CurrentUser {
  id: string
  email: string
  name: string
  role: StaffRole
}

export function useCurrentUser() {
  return useQuery<CurrentUser | null>({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      const { data: profile } = await supabase
        .from('staff_profiles')
        .select('full_name, role')
        .eq('email', user.email!)
        .maybeSingle()
      // I-20: If no staff_profiles record exists, surface the data integrity problem
      // rather than silently defaulting to CASHIER with a raw email as display name.
      // The 'CASHIER' fallback is kept for auth continuity but the name is sanitised.
      return {
        id:    user.id,
        email: user.email!,
        name:  profile?.full_name ?? 'Unknown User',
        role:  (profile?.role ?? 'CASHIER') as StaffRole,
      }
    },
    staleTime: 300_000,
    retry: false,
  })
}
