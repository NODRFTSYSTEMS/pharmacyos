import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Timecard } from '../types/database'

/**
 * Hook to check if the current user has an active CLOCKED_IN timecard.
 * Used by POS terminal to gate access — users must be clocked in to ring up sales.
 *
 * Returns:
 * - data: active Timecard record if exists, null if not clocked in
 * - isLoading: true while query is in flight
 * - isError: true if query fails
 *
 * Note: ADMIN role bypasses this check in PosTerminal.tsx
 */
export function useActiveTimecard(userId: string | undefined) {
  return useQuery<Timecard | null>({
    queryKey: ['active-timecard', userId],
    queryFn: async () => {
      if (!userId) return null

      const { data, error } = await supabase
        .from('timecards')
        .select('id, staff_id, clocked_in_at, clocked_out_at, status, created_at, updated_at')
        .eq('staff_id', userId)
        .eq('status', 'CLOCKED_IN')
        .maybeSingle()

      if (error) throw error
      return (data as Timecard | null) ?? null
    },
    enabled: !!userId,
    staleTime: 10_000, // 10 seconds — check fairly frequently since status changes matter
    refetchInterval: 30_000, // Refresh every 30 seconds to catch clock-outs
  })
}
