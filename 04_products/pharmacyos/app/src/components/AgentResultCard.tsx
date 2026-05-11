/**
 * AgentResultCard — surfaces AI agent output inline within feature pages.
 *
 * Two display modes:
 *   compact  — narrow banner, used inside cards and sidebars
 *   full     — expanded card with confidence, integration pending, and action
 *
 * Usage:
 *   <AgentResultCard job={job} compact />
 *   <AgentResultCard job={job} onAction={() => navigate('/ai/queue')} actionLabel="View in Queue" />
 */
import {
  Robot, Warning, CheckCircle, X, ArrowRight,
  SpinnerGap, XCircle,
} from '@phosphor-icons/react'
import { IntegrationPendingBadge } from './IntegrationPendingBadge'
import { type AIJob } from '@/data/sample'

export interface AgentResultCardProps {
  job: AIJob
  /** Compact = inline banner. Full (default) = expanded card. */
  compact?: boolean
  onDismiss?: () => void
  onAction?: () => void
  actionLabel?: string
}

function StatusIcon({ status }: { status: AIJob['status'] }) {
  switch (status) {
    case 'Completed':
      return <CheckCircle size={16} weight="fill" className="text-success shrink-0" />
    case 'Failed':
      return <XCircle size={16} weight="fill" className="text-error shrink-0" />
    case 'Review Required':
      return <Warning size={16} weight="fill" className="text-warning shrink-0" />
    case 'Processing':
      return <SpinnerGap size={16} className="text-primary shrink-0 animate-spin" />
  }
}

const STATUS_BG: Record<AIJob['status'], string> = {
  Completed:        'bg-success/5 border-success/20',
  Failed:           'bg-error/5 border-error/20',
  'Review Required': 'bg-warning/5 border-warning/20',
  Processing:       'bg-primary/5 border-primary/20',
}

export function AgentResultCard({
  job,
  compact = false,
  onDismiss,
  onAction,
  actionLabel = 'View Details',
}: AgentResultCardProps) {
  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-control border text-sm ${STATUS_BG[job.status]}`}>
        <Robot size={14} className="text-text-secondary shrink-0" aria-hidden="true" />
        <StatusIcon status={job.status} />
        <span className="type-label text-text-secondary truncate flex-1">
          {job.label}
          {job.outputSummary && <span className="text-text-disabled"> — {job.outputSummary}</span>}
        </span>
        {job.integrationPending && job.integrationPending.length > 0 && (
          <IntegrationPendingBadge service={job.integrationPending[0]} />
        )}
        {onAction && (
          <button type="button" onClick={onAction} className="type-tiny text-primary hover:underline shrink-0">
            {actionLabel}
          </button>
        )}
        {onDismiss && (
          <button type="button" onClick={onDismiss} aria-label="Dismiss" className="text-text-disabled hover:text-text-secondary shrink-0">
            <X size={12} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={`rounded-card border p-4 flex flex-col gap-3 ${STATUS_BG[job.status]}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Robot size={16} className="text-text-secondary shrink-0" aria-hidden="true" />
          <div>
            <p className="type-label-strong text-text-primary">{job.label}</p>
            <p className="type-tiny text-text-disabled">{job.jobNumber} · {job.createdAt}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusIcon status={job.status} />
          <span className="type-label text-text-secondary">{job.status}</span>
          {onDismiss && (
            <button type="button" onClick={onDismiss} aria-label="Dismiss agent result" className="text-text-disabled hover:text-text-secondary">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Input */}
      <div>
        <p className="type-tiny text-text-disabled uppercase tracking-wide mb-0.5">Input</p>
        <p className="type-body-xs text-text-secondary">{job.inputSummary}</p>
      </div>

      {/* Output */}
      {job.outputSummary && (
        <div>
          <p className="type-tiny text-text-disabled uppercase tracking-wide mb-0.5">Result</p>
          <p className="type-body-sm text-text-primary">{job.outputSummary}</p>
        </div>
      )}

      {/* Flag */}
      {job.flagged && job.flagNote && (
        <div className="flex items-start gap-2 px-3 py-2 bg-warning/10 border border-warning/30 rounded-control text-sm">
          <Warning size={14} weight="fill" className="text-warning shrink-0 mt-0.5" aria-hidden="true" />
          <p className="type-body-xs text-text-secondary">{job.flagNote}</p>
        </div>
      )}

      {/* Confidence */}
      {job.confidence !== undefined && (
        <div className="flex items-center gap-2">
          <p className="type-tiny text-text-disabled">Confidence</p>
          <div className="flex-1 h-1.5 bg-bg-subtle rounded-pill overflow-hidden">
            <div
              className={`h-full rounded-pill ${job.confidence >= 0.8 ? 'bg-success' : job.confidence >= 0.5 ? 'bg-warning' : 'bg-error'}`}
              style={{ width: `${Math.round(job.confidence * 100)}%` }}
            />
          </div>
          <span className="type-tiny text-text-secondary font-medium">{Math.round(job.confidence * 100)}%</span>
        </div>
      )}

      {/* Integration Pending */}
      {job.integrationPending && job.integrationPending.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.integrationPending.map((svc) => (
            <IntegrationPendingBadge key={svc} service={svc} />
          ))}
        </div>
      )}

      {/* Action */}
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="self-start inline-flex items-center gap-1.5 type-label text-primary hover:text-primary-hover"
        >
          {actionLabel}
          <ArrowRight size={12} />
        </button>
      )}
    </div>
  )
}
