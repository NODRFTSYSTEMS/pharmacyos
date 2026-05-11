import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { supabase } from '../lib/supabase'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<'loading' | 'authed' | 'unauthed'>('loading')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(session ? 'authed' : 'unauthed')
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setState(session ? 'authed' : 'unauthed')
    })

    return () => subscription.unsubscribe()
  }, [])

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" aria-label="Loading…" />
      </div>
    )
  }

  if (state === 'unauthed') {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
