import { Link } from 'react-router-dom'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { Button } from '@/components/Button'

export function NotFoundPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-bg-base p-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-pill bg-bg-subtle text-text-disabled flex items-center justify-center mx-auto mb-4">
          <MagnifyingGlass size={32} />
        </div>
        <h1 className="type-page-title text-text-primary mb-2">Page not found</h1>
        <p className="text-text-secondary mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/dashboard">
          <Button variant="primary">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
