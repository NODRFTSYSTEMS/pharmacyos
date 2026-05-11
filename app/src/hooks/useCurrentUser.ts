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
      return {
        id:    user.id,
        email: user.email!,
        name:  profile?.full_name ?? user.email!,
        role:  (profile?.role ?? 'CASHIER') as StaffRole,
      }
    },
    staleTime: 300_000,
    retry: false,
  })
}
