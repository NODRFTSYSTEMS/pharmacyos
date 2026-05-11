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
 * Override reason (requireReason):
 *   When requireReason=true, a required textarea is shown.
 *   The confirm button is disabled until ≥10 chars are entered.
 *   The typed reason is passed back via onConfirm(reason).
 *   Used for pharmacist override documentation on allergy/interaction conflicts.
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
import { useEffect, useRef, useState } from 'react'
import { X, Warning, Trash } from '@phosphor-icons/react'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  body: string
  confirmLabel: string
  variant?: 'default' | 'warning' | 'destructive'
  /**
   * When true, shows a required reason textarea before confirm is enabled.
   * The reason is passed to onConfirm(reason). Use for clinical override documentation.
   */
  requireReason?: boolean
  /** Label shown above the reason textarea. */
  reasonLabel?: string
  /** Called with optional reason string (present when requireReason=true). */
  onConfirm: (reason?: string) => void
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
  requireReason = false,
  reasonLabel = 'Override reason',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const [reason, setReason] = useState('')

  // Reset reason state whenever dialog opens
  useEffect(() => {
    if (open) {
      setReason('')
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
  const reasonTrimmed = reason.trim()
  const reasonValid = !requireReason || reasonTrimmed.length >= 10

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

        {/* Override reason input — shown when requireReason=true */}
        {requireReason && (
          <div className="flex flex-col gap-1.5">
            <label className="type-label-strong text-text-primary">
              {reasonLabel} <span className="text-error" aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Document the clinical justification — minimum 10 characters required"
              rows={3}
              aria-required="true"
              aria-describedby="confirm-reason-hint"
              className="w-full px-3 py-2 text-sm border border-border rounded-control bg-bg-subtle text-text-primary resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
            <p id="confirm-reason-hint" className="type-label text-text-disabled">
              {reasonTrimmed.length > 0 && reasonTrimmed.length < 10 ? (
                <span className="text-error">{10 - reasonTrimmed.length} more characters required</span>
              ) : reasonValid ? (
                <span className="text-success">Reason documented — proceed with override</span>
              ) : (
                'This override will be recorded in the prescription audit trail'
              )}
            </p>
          </div>
        )}

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
            onClick={() => onConfirm(requireReason ? reasonTrimmed : undefined)}
            disabled={!reasonValid}
            aria-disabled={!reasonValid}
            className={[
              'px-5 py-2 type-label-strong rounded-control transition-colors',
              !reasonValid
                ? 'opacity-40 cursor-not-allowed bg-bg-subtle text-text-disabled border border-border'
                : CONFIRM_STYLES[variant],
            ].join(' ')}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
