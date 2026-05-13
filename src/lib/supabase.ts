import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const url  = import.meta.env.VITE_SUPABASE_URL  as string | undefined
const key  = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// ⚠️  Do NOT throw here. A module-level throw fires before React mounts —
// AppErrorBoundary cannot catch it and the result is a blank white screen.
// Log the misconfiguration and fall back to placeholder values so React
// can at least render the error boundary or redirect to /login.
if (!url || !key) {
  console.error(
    '[PharmacyOS] FATAL: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.',
    '\nLocal dev → add to app/.env.local',
    '\nVercel → add under Project Settings → Environment Variables',
  )
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
export const supabase = createClient(
  url ?? 'https://placeholder.supabase.co',
  key ?? 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
) as unknown as SupabaseClient<any>

// Re-export Database for use in query result type assertions
export type { Database }
