// ── RoleGuard Component ───────────────────────────────────────────────────────
// Route-level permission enforcement.
// Wraps a route element and redirects to /403 if the current user's role
// does not hold the required permission for that route.
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

import { Navigate, useLocation } from 'react-router'
import { usePermission } from '../hooks/usePermission'
import { useCurrentUser } from '../hooks/useCurrentUser'

interface RoleGuardProps {
  permission: string
  children: React.ReactNode
}

export function RoleGuard({ permission, children }: RoleGuardProps) {
  const { data: currentUser, isLoading } = useCurrentUser()
  const hasPermission = usePermission(permission)
  const location = useLocation()

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
