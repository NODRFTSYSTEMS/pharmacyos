import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Missing Supabase environment variables. Copy app/.env.example to app/.env.local and fill in the values from the Supabase dashboard.',
  )
}

// Untyped client until the database schema is generated.
// After DSS produces migrations, run `supabase gen types typescript` and add the Database
// generic: createClient<Database>(url, anonKey, ...).
export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
