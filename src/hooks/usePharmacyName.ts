import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

/**
 * Returns the pharmacy name from pharmacy_settings, falling back to
 * 'PharmacyOS' so product-layer components stay tenant-agnostic.
 * Cache: 5 minutes (same as useCurrentUser).
 */
export function usePharmacyName(fallback = 'PharmacyOS'): string {
  const { data } = useQuery({
    queryKey: ['pharmacy-name'],
    queryFn: async () => {
      const { data } = await supabase
        .from('pharmacy_settings')
        .select('value')
        .eq('key', 'pharmacy_name')
        .maybeSingle()
      return data?.value ?? fallback
    },
    staleTime: 300_000,
    retry: false,
  })
  return data ?? fallback
}
