import { Link } from 'react-router-dom'
import { ShieldWarning } from '@phosphor-icons/react'
import { Button } from '@/components/Button'

export function UnauthorizedPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-bg-base p-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-pill bg-tag-schedule-bg text-tag-schedule-fg flex items-center justify-center mx-auto mb-4">
          <ShieldWarning size={32} />
        </div>
        <h1 className="type-page-title text-text-primary mb-2">Access denied</h1>
        <p className="text-text-secondary mb-6">
          You do not have permission to view this page. Contact your administrator if you believe this is an error.
        </p>
        <Link to="/dashboard">
          <Button variant="primary">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

export default UnauthorizedPage
