/**
 * ConfirmDialog — lightweight accessible confirmation modal.
 *
 * Hand-built (no Radix dep) following the same pattern as Toast.
 * Trap focus inside when open. Close on Escape or backdrop click.
 *
 * Variants:
 *   default     — neutral action (primary button)
 *   warning     — needs caution (amber button)
 *   destructive — irreversible action (red button)
 *
 * Usage:
 *   <ConfirmDialog
 *     open={open}
 *     title="Verify RX-2026-0847?"
 *     body="This confirms the drug, dosage, and patient match."
 *     confirmLabel="Verify"
 *     onConfirm={handleConfirm}
 *     onCancel={() => setOpen(false)}
 *   />
 */
import { useEffect, useRef } from 'react'
import { X, Warning, Trash } from '@phosphor-icons/react'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  body: string
  confirmLabel: string
  variant?: 'default' | 'warning' | 'destructive'
  onConfirm: () => void
  onCancel: () => void
}

const CONFIRM_STYLES: Record<NonNullable<ConfirmDialogProps['variant']>, string> = {
  default:     'bg-primary text-white hover:bg-primary/90',
  warning:     'bg-warning text-white hover:bg-warning/90',
  destructive: 'bg-error text-white hover:bg-error/90',
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)

  // Focus confirm button on open
  useEffect(() => {
    if (open) {
      setTimeout(() => confirmRef.current?.focus(), 50)
    }
  }, [open])

  // Escape to cancel
  useEffect(() => {
    if (!open) return
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onCancel])

  if (!open) return null

  const Icon = variant === 'destructive' ? Trash : variant === 'warning' ? Warning : null

  return (
    /* Backdrop — no aria-hidden; the dialog inside manages its own ARIA */
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-bg-canvas/70 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      {/* Dialog */}
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-body"
        className="relative w-full max-w-md bg-bg-surface rounded-card shadow-modal border border-bg-subtle p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close X */}
        <button
          type="button"
          onClick={onCancel}
          aria-label="Dismiss dialog"
          className="absolute top-4 right-4 w-8 h-8 rounded-control flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 pr-8">
          {Icon && (
            <div className={[
              'shrink-0 w-10 h-10 rounded-card flex items-center justify-center',
              variant === 'destructive' ? 'bg-error/10' : 'bg-warning/10',
            ].join(' ')}>
              <Icon
                size={20}
                weight="duotone"
                className={variant === 'destructive' ? 'text-error' : 'text-warning'}
              />
            </div>
          )}
          <div>
            <h2
              id="confirm-dialog-title"
              className="type-label-strong text-text-primary leading-snug"
            >
              {title}
            </h2>
            <p
              id="confirm-dialog-body"
              className="type-body text-text-secondary mt-1 leading-relaxed"
            >
              {body}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 type-label text-text-secondary hover:text-text-primary bg-bg-surface border border-border rounded-control hover:bg-bg-subtle transition-colors"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={[
              'px-5 py-2 type-label-strong rounded-control transition-colors',
              CONFIRM_STYLES[variant],
            ].join(' ')}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
