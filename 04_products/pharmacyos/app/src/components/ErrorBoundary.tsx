import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Warning } from '@phosphor-icons/react'
import { Button } from './Button'

/**
 * Global error boundary — catches render-time exceptions in the React tree.
 * Wraps the entire app in main.tsx. When real auth + Supabase wire up, this
 * is also where Sentry / production error reporting hooks in.
 */

type Props = { children: ReactNode; fallback?: ReactNode }
type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Production hook — wire Sentry / log shipper here once available.
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught:', error, info)
    }
  }

  reset = (): void => this.setState({ error: null })

  override render(): ReactNode {
    if (this.state.error) {
      return this.props.fallback ?? <DefaultErrorFallback error={this.state.error} reset={this.reset} />
    }
    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base p-6">
      <div className="max-w-md w-full bg-bg-surface rounded-card shadow-card p-8 text-center">
        <div className="w-12 h-12 rounded-pill bg-tag-schedule-bg text-tag-schedule-fg flex items-center justify-center mx-auto mb-4">
          <Warning size={24} weight="bold" />
        </div>
        <p className="type-section text-text-primary mb-2">Something went wrong</p>
        <p className="text-sm text-text-secondary mb-6">
          The application encountered an unexpected error. Try reloading the page; if the problem persists, contact support.
        </p>
        {import.meta.env.DEV && (
          <pre className="bg-bg-subtle border border-border rounded-control p-3 text-xs text-left text-text-primary overflow-auto max-h-40 mb-4">
            {error.message}
          </pre>
        )}
        <div className="flex gap-2 justify-center">
          <Button variant="secondary" size="md" onClick={() => location.reload()}>
            Reload
          </Button>
          <Button variant="primary" size="md" onClick={reset}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}
