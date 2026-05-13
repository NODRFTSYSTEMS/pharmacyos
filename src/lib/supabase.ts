import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const url  = import.meta.env.VITE_SUPABASE_URL  as string
const key  = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !key) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars')
}

// TypeScript 6.0 + @supabase/supabase-js v2.105.3 compatibility issue:
// The Schema default type parameter in SupabaseClient uses a conditional type
// (`Database['public'] extends GenericSchema ? ... : never`) that TypeScript 6
// fails to resolve correctly in generic default position, causing Schema = never
// and all query operations to return `never` typed results.
//
// Workaround: cast to SupabaseClient<any> which satisfies the schema constraint
// and keeps auth/storage/realtime APIs typed. Query result types are asserted
// at point-of-use via `as` casts in each query function.
// Restore: upgrade to supabase-js with explicit TypeScript 6 support.
export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
}) as unknown as SupabaseClient<any>

// Re-export Database for use in query result type assertions
export type { Database }
