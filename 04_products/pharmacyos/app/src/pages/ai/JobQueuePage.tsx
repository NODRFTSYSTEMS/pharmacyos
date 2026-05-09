import { Robot, FileText, Receipt, MagnifyingGlass } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_AI_JOBS, type JobStatus, type AIJob } from '@/data/sample'

const STATUS_VARIANT: Record<JobStatus, 'info' | 'success' | 'error' | 'warning'> = {
  Processing: 'info',
  Completed: 'success',
  Failed: 'error',
  'Review Required': 'warning',
}

function jobIcon(type: AIJob['type']) {
  if (type === 'Rx Scan') return <FileText size={14} className="text-text-secondary" />
  if (type === 'Invoice Scan') return <Receipt size={14} className="text-text-secondary" />
  return <Robot size={14} className="text-text-secondary" />
}

export function JobQueuePage() {
  const processing = SAMPLE_AI_JOBS.filter((j) => j.status === 'Processing').length
  const reviewable = SAMPLE_AI_JOBS.filter((j) => j.status === 'Review Required').length
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="AI Job Queue"
        subtitle={`${SAMPLE_AI_JOBS.length} jobs · ${processing} processing · ${reviewable} need review`}
      />
      <section className="flex-1 p-6 overflow-y-auto">
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-subtle border-b border-border">
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Job #</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Type</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Target</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Status</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">Confidence</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Created</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Completed</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Flagged</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_AI_JOBS.map((job) => (
                <tr key={job.id} className="h-11 border-b border-border-subtle hover:bg-bg-subtle transition-colors">
                  <td className="px-4 type-mono-data text-text-primary font-medium">{job.jobNumber}</td>
                  <td className="px-4">
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-text-primary">
                      {jobIcon(job.type)}
                      {job.type}
                    </span>
                  </td>
                  <td className="px-4 text-[12px] text-text-secondary">{job.target}</td>
                  <td className="px-4">
                    <StatusPill variant={STATUS_VARIANT[job.status]}>{job.status}</StatusPill>
                  </td>
                  <td className="px-4 type-mono-data text-text-primary text-right">
                    {job.confidence != null ? (
                      <span className={job.confidence < 0.85 ? 'text-warning' : ''}>{(job.confidence * 100).toFixed(0)}%</span>
                    ) : (
                      <span className="text-text-disabled">—</span>
                    )}
                  </td>
                  <td className="px-4 type-mono-data text-text-secondary whitespace-nowrap">{job.createdAt}</td>
                  <td className="px-4 type-mono-data text-text-secondary whitespace-nowrap">
                    {job.completedAt || <span className="text-text-disabled">—</span>}
                  </td>
                  <td className="px-4">
                    {job.flagged ? (
                      <span className="inline-flex items-center gap-1 text-[12px] text-warning">
                        <MagnifyingGlass size={12} />
                        {job.flagged}
                      </span>
                    ) : (
                      <span className="text-[12px] text-text-disabled">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default JobQueuePage
