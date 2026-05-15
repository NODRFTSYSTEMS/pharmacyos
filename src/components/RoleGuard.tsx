// ── RoleGuard Component ───────────────────────────────────────────────────────
// Route-level permission enforcement.
// Wraps a route element and redirects to /403 if the current user's role
// does not hold the required permission for that route.
// Access denials are written to audit_log so Forbidden.tsx can truthfully
// display "this event has been logged."
//
// Usage in App.tsx:
//   <Route
//     path="/admin/users"
//     element={
//       <RoleGuard permission="staff_manage">
//         <UsersAdmin />
//       </RoleGuard>
//     }
//   />

import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router'
import { usePermission } from '../hooks/usePermission'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { supabase } from '../lib/supabase'
import { AUDIT_ACTIONS } from '../constants/audit-actions'

interface RoleGuardProps {
  permission: string
  children: React.ReactNode
}

export function RoleGuard({ permission, children }: RoleGuardProps) {
  const { data: currentUser, isLoading } = useCurrentUser()
  const hasPermission = usePermission(permission)
  const location = useLocation()

  // Log access denials to the audit trail so Forbidden.tsx can display
  // "this event has been logged" truthfully.
  useEffect(() => {
    if (isLoading || !currentUser || hasPermission) return
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('audit_log').insert({
        actor_id:   user.id,
        actor_name: currentUser.name || currentUser.email,
        action:     AUDIT_ACTIONS.ACCESS_DENIED,
        table_name: 'route',
        record_id:  null,
        details: {
          attempted_path:       location.pathname,
          required_permission:  permission,
          role:                 currentUser.role,
        },
      })
    })
  }, [isLoading, currentUser, hasPermission, location.pathname, permission])

  // Still loading — render nothing (ProtectedRoute already shows the spinner)
  if (isLoading || currentUser === undefined) return null

  // No user — ProtectedRoute handles redirect to /login
  if (!currentUser) return null

  // User lacks the required permission — redirect to /403
  if (!hasPermission) {
    return (
      <Navigate
        to="/403"
        state={{ attempted: location.pathname, required: permission }}
        replace
      />
    )
  }

  return <>{children}</>
}
