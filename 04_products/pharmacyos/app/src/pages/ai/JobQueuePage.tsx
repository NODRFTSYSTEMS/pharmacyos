import { useMemo, useState } from 'react'
import {
  Robot, FileText, Receipt,
  Flask, Package, ShieldCheck, ChartBar, UserCircleGear,
  Warning, Clock,
} from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_AI_JOBS, type JobStatus, type AIJob, type AgentType } from '@/data/sample'

const STATUS_VARIANT: Record<JobStatus, 'info' | 'success' | 'error' | 'warning'> = {
  Processing: 'info',
  Completed: 'success',
  Failed: 'error',
  'Review Required': 'warning',
}

const AGENT_LABELS: Record<AgentType, string> = {
  'rx-ocr':             'Rx Scan',
  'invoice-ocr':        'Invoice Scan',
  'drug-interaction':   'Drug Interaction',
  'inventory-intel':    'Inventory Intel',
  'compliance-monitor': 'Compliance Monitor',
  'report-synthesis':   'Report Synthesis',
  'patient-risk':       'Patient Risk',
}

function AgentIcon({ type, size = 14 }: { type: AIJob['type']; size?: number }) {
  const cls = 'text-text-secondary'
  switch (type) {
    case 'rx-ocr':             return <FileText size={size} className={cls} />
    case 'invoice-ocr':        return <Receipt size={size} className={cls} />
    case 'drug-interaction':   return <Flask size={size} className={cls} />
    case 'inventory-intel':    return <Package size={size} className={cls} />
    case 'compliance-monitor': return <ShieldCheck size={size} className={cls} />
    case 'report-synthesis':   return <ChartBar size={size} className={cls} />
    case 'patient-risk':       return <UserCircleGear size={size} className={cls} />
    default:                   return <Robot size={size} className={cls} />
  }
}

const AGENT_TYPE_OPTIONS: Array<{ value: AgentType | 'all'; label: string }> = [
  { value: 'all',              label: 'All agent types' },
  { value: 'rx-ocr',             label: 'Rx Scan' },
  { value: 'invoice-ocr',        label: 'Invoice Scan' },
  { value: 'drug-interaction',   label: 'Drug Interaction' },
  { value: 'inventory-intel',    label: 'Inventory Intel' },
  { value: 'compliance-monitor', label: 'Compliance Monitor' },
  { value: 'report-synthesis',   label: 'Report Synthesis' },
  { value: 'patient-risk',       label: 'Patient Risk' },
]

export function JobQueuePage() {
  const [typeFilter, setTypeFilter] = useState<AgentType | 'all'>('all')

  const filtered = useMemo(
    () => typeFilter === 'all' ? SAMPLE_AI_JOBS : SAMPLE_AI_JOBS.filter((j) => j.type === typeFilter),
    [typeFilter],
  )

  const processing = SAMPLE_AI_JOBS.filter((j) => j.status === 'Processing').length
  const reviewable  = SAMPLE_AI_JOBS.filter((j) => j.status === 'Review Required').length
  const flaggedCount = SAMPLE_AI_JOBS.filter((j) => j.flagged).length

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="AI Agent Queue"
        subtitle={`${SAMPLE_AI_JOBS.length} jobs · ${processing} processing · ${reviewable} need review · ${flaggedCount} flagged`}
        filterBar={
          <div className="flex items-center gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as AgentType | 'all')}
              aria-label="Filter by agent type"
              className="h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control text-text-primary focus:outline-none focus:border-primary"
            >
              {AGENT_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        }
      />
      <section className="flex-1 p-6 overflow-y-auto">
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <caption className="sr-only">AI agent job queue</caption>
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Job #</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Agent</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Target</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Output</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Status</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">Confidence</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Created</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Flag</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-text-secondary">
                    No agent jobs match the current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((job) => (
                  <tr key={job.id} className="h-11 border-b border-border-subtle hover:bg-bg-subtle transition-colors">
                    <td className="px-4 type-mono-data text-text-primary font-medium whitespace-nowrap">{job.jobNumber}</td>
                    <td className="px-4">
                      <span className="inline-flex items-center gap-1.5 type-body-xs text-text-primary whitespace-nowrap">
                        <AgentIcon type={job.type} />
                        {AGENT_LABELS[job.type]}
                      </span>
                    </td>
                    <td className="px-4 type-body-xs text-text-secondary max-w-[180px] truncate">{job.target}</td>
                    <td className="px-4 type-body-xs text-text-secondary max-w-[220px] truncate">
                      {job.outputSummary ? (
                        job.outputSummary
                      ) : job.status === 'Processing' ? (
                        <span className="inline-flex items-center gap-1 text-text-disabled">
                          <Clock size={12} />
                          In progress&hellip;
                        </span>
                      ) : (
                        <span className="text-text-disabled">&mdash;</span>
                      )}
                    </td>
                    <td className="px-4">
                      <StatusPill variant={STATUS_VARIANT[job.status]}>{job.status}</StatusPill>
                    </td>
                    <td className="px-4 type-mono-data text-text-primary text-right">
                      {job.confidence != null ? (
                        <span className={job.confidence < 0.85 ? 'text-warning' : ''}>
                          {(job.confidence * 100).toFixed(0)}%
                        </span>
                      ) : (
                        <span className="text-text-disabled">&mdash;</span>
                      )}
                    </td>
                    <td className="px-4 type-mono-data text-text-secondary whitespace-nowrap">{job.createdAt}</td>
                    <td className="px-4">
                      {job.flagged ? (
                        <span className="inline-flex items-center gap-1 type-body-xs text-warning" title={job.flagNote}>
                          <Warning size={12} weight="bold" />
                          {job.flagNote
                            ? job.flagNote.slice(0, 28) + (job.flagNote.length > 28 ? '…' : '')
                            : 'Flagged'}
                        </span>
                      ) : job.integrationPending?.length ? (
                        <span className="inline-flex items-center gap-1 type-body-xs text-primary/70">
                          Pending: {job.integrationPending[0]}
                        </span>
                      ) : (
                        <span className="type-body-xs text-text-disabled">&mdash;</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default JobQueuePage
