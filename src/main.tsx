import './polyfills'
import { StrictMode, Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { supabaseConfigured } from './lib/supabase'
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

// Strip trailing slash so React Router v7 basename is always '/pharmacyos' not '/pharmacyos/'
// When base is '/' (Vercel), this resolves to '' which React Router treats as root.
const routerBase = import.meta.env.BASE_URL.replace(/\/$/, '')

// Visible config error screen rendered before Router/App when Supabase is unconfigured.
// Supabase module cannot throw at module level (blank screen before React mounts),
// so we check the exported flag here and short-circuit the full render tree.
function MissingConfigScreen() {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,.12)', maxWidth: '420px', width: '100%', padding: '40px', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <svg width="28" height="28" viewBox="0 0 256 256" aria-hidden="true"><path d="M236.8,188.09,149.35,36.22a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z" fill="#D97706"/></svg>
        </div>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>PharmacyOS — Configuration Required</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>
          This deployment is missing required environment variables.
        </p>
        <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '24px' }}>
          Add <code style={{ background: '#F3F4F6', padding: '1px 4px', borderRadius: '3px' }}>VITE_SUPABASE_URL</code> and <code style={{ background: '#F3F4F6', padding: '1px 4px', borderRadius: '3px' }}>VITE_SUPABASE_ANON_KEY</code> to your Vercel project under <strong>Settings → Environment Variables</strong>, then redeploy.
        </p>
        <a href="https://vercel.com/dashboard" style={{ display: 'inline-block', padding: '10px 20px', background: '#2563EB', color: '#fff', borderRadius: '6px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
          Open Vercel Dashboard
        </a>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {supabaseConfigured ? (
      <AppErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter basename={routerBase}>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </AppErrorBoundary>
    ) : (
      <MissingConfigScreen />
    )}
  </StrictMode>
)
