import { useState } from 'react'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { Warning, CheckCircle, XCircle, FileImage } from '@phosphor-icons/react'

export interface AIField {
  label: string
  value: string
  confidence: number
  mono?: boolean
}

export function AIReviewPanel({
  title,
  fields: initialFields,
  onConfirm,
  onReject,
}: {
  title: string
  fields: AIField[]
  onConfirm: (fields: AIField[]) => void
  onReject: () => void
}) {
  const [fields, setFields] = useState(initialFields)
  const threshold = 85

  const flaggedCount = fields.filter((f) => f.confidence < threshold).length
  const allReviewed = flaggedCount === 0 || fields.every((f) => f.value.trim() !== '')

  function updateField(index: number, value: string) {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, value } : f)))
  }

  return (
    <div className="h-full grid grid-cols-[1fr_1fr] divide-x divide-border bg-bg-base">
      {/* Left — image placeholder */}
      <div className="flex flex-col items-center justify-center p-8 bg-bg-subtle">
        <div className="w-24 h-24 rounded-card bg-bg-surface border-2 border-dashed border-border flex items-center justify-center mb-4">
          <FileImage size={40} className="text-text-disabled" />
        </div>
        <p className="type-body-sm text-text-secondary text-center">{title}</p>
        <p className="type-body-xs text-text-tertiary text-center mt-1">Original document preview</p>
      </div>

      {/* Right — extracted fields */}
      <div className="flex flex-col min-h-0">
        <div className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="type-card-title text-text-primary">Extracted Fields</h2>
            {flaggedCount > 0 && (
              <span className="inline-flex items-center gap-1 type-body-xs text-warning">
                <Warning size={14} />
                {flaggedCount} field{flaggedCount > 1 ? 's' : ''} need review
              </span>
            )}
          </div>
          <p className="type-body-xs text-text-secondary mt-1">
            Auto-accept ≥ {threshold}% (system setting)
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {fields.map((field, i) => {
            const flagged = field.confidence < threshold
            return (
              <div key={field.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="type-label text-text-secondary uppercase tracking-wider">
                    {field.label}
                  </label>
                  <span className="inline-flex items-center gap-1 type-body-xs">
                    <span
                      className={`w-2 h-2 rounded-pill ${
                        field.confidence >= 90
                          ? 'bg-rx-filled-fg'
                          : field.confidence >= threshold
                            ? 'bg-rx-verified-fg'
                            : 'bg-tag-schedule-fg'
                      }`}
                    />
                    <span
                      className={
                        field.confidence >= 90
                          ? 'text-rx-filled-fg'
                          : field.confidence >= threshold
                            ? 'text-rx-verified-fg'
                            : 'text-tag-schedule-fg'
                      }
                    >
                      {field.confidence}%
                    </span>
                  </span>
                </div>
                <Input
                  value={field.value}
                  onChange={(e) => updateField(i, e.target.value)}
                  className={flagged ? 'border-warning focus:border-warning' : ''}
                />
                {flagged && (
                  <p className="type-body-xs text-warning inline-flex items-center gap-1">
                    <Warning size={12} />
                    Review required — confidence below {threshold}%
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <div className="px-6 py-4 border-t border-border shrink-0 flex items-center justify-between gap-3">
          <Button variant="destructive" onClick={onReject}>
            <XCircle size={16} className="mr-1" />
            Reject
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary">Save Draft</Button>
            <Button variant="primary" disabled={!allReviewed} onClick={() => onConfirm(fields)}>
              <CheckCircle size={16} className="mr-1" />
              Confirm All
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIReviewPanel
