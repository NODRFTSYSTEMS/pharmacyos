import { StrictMode, Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
    },
  },
})

// ── Global Error Boundary (I-04) ──────────────────────────────────────────────
// Catches unhandled React render errors and displays a branded recovery screen
// instead of a blank white page. In a clinical environment, a staff member who
// encounters an error during a dispensing workflow needs a clear recovery path.

interface ErrorBoundaryState { hasError: boolean; message: string }

class AppErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
          <div
            className="bg-white rounded-lg shadow-md max-w-md w-full text-center p-10"
            role="alert"
            aria-live="assertive"
          >
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 256 256" fill="none" aria-hidden="true">
                <path d="M236.8,188.09,149.35,36.22a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z" fill="#EF4444"/>
              </svg>
            </div>
            <h1 className="text-lg font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-sm text-gray-500 mb-1">
              PharmacyOS encountered an unexpected error.
            </p>
            <p className="text-sm text-gray-400 mb-8">
              Your work may not have been saved. Reload the application to continue.
              If the problem persists, contact your system administrator.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              Reload Application
            </button>
            {import.meta.env.DEV && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-gray-400 cursor-pointer">Error details (dev only)</summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 rounded p-2 overflow-auto max-h-32 whitespace-pre-wrap">
                  {this.state.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// ─────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </AppErrorBoundary>
  </StrictMode>
)
