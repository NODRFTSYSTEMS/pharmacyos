import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle, Info, WarningCircle, X } from '@phosphor-icons/react'

/**
 * Toast — lightweight notification surface.
 * Hand-built (no Radix Toast dep) — context + viewport pattern.
 * Use via:
 *   const toast = useToast()
 *   toast.show('Settings saved', { variant: 'success' })
 */

type ToastVariant = 'success' | 'error' | 'info'

type ToastEntry = {
  id: number
  message: string
  variant: ToastVariant
}

type ToastContextValue = {
  show: (message: string, opts?: { variant?: ToastVariant; durationMs?: number }) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((cur) => cur.filter((t) => t.id !== id))
  }, [])

  const show = useCallback<ToastContextValue['show']>(
    (message, opts = {}) => {
      const id = Date.now() + Math.random()
      const variant = opts.variant ?? 'success'
      const durationMs = opts.durationMs ?? 4000
      setToasts((cur) => [...cur, { id, message, variant }])
      setTimeout(() => dismiss(id), durationMs)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

function ToastViewport({ toasts, onDismiss }: { toasts: ToastEntry[]; onDismiss: (id: number) => void }) {
  return (
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: ToastEntry; onDismiss: () => void }) {
  const Icon = toast.variant === 'success' ? CheckCircle : toast.variant === 'error' ? WarningCircle : Info
  const accentClass = {
    success: 'border-l-rx-filled-fg',
    error: 'border-l-error',
    info: 'border-l-primary',
  }[toast.variant]
  const iconClass = {
    success: 'text-rx-filled-fg',
    error: 'text-error',
    info: 'text-primary',
  }[toast.variant]
  return (
    <div
      role="status"
      className={[
        'pointer-events-auto min-w-[280px] max-w-md',
        'bg-bg-surface rounded-card shadow-modal border-l-4',
        'pl-4 pr-3 py-3 flex items-center gap-3',
        accentClass,
      ].join(' ')}
    >
      <Icon size={18} weight="fill" className={`shrink-0 ${iconClass}`} aria-hidden="true" />
      <p className="flex-1 text-sm text-text-primary">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="shrink-0 w-6 h-6 rounded-control flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-subtle"
      >
        <X size={14} />
      </button>
    </div>
  )
}
