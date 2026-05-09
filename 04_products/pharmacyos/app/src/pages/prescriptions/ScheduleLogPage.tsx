import { DownloadSimple, Lock } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_SCHEDULE_LOG } from '@/data/sample'

/**
 * Schedule Drug Log â€” Jamaica Pharmacy Act regulated record.
 * Append-only per DSS schema plan; no edit/delete affordances on UI.
 * Pharmacist sign-off required for every entry (verified column).
 */
export function ScheduleLogPage() {
  const verified = SAMPLE_SCHEDULE_LOG.filter((e) => e.verified).length
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Schedule Drug Log"
        subtitle={`Regulatory record Â· ${SAMPLE_SCHEDULE_LOG.length} entries Â· ${verified} pharmacist-verified Â· append-only`}
        cta={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md">
              <DownloadSimple size={16} weight="bold" />
              Export PDF
            </Button>
            <Button variant="secondary" size="md">
              <DownloadSimple size={16} weight="bold" />
              Export CSV
            </Button>
          </div>
        }
      />
      <section className="flex-1 p-6 overflow-y-auto">
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-tag-schedule-bg/50 flex items-start gap-2">
            <Lock size={14} className="text-tag-schedule-fg shrink-0 mt-0.5" />
            <div>
              <p className="type-body-xs font-medium text-tag-schedule-fg">
                Jamaica Pharmacy Act — Controlled Substance Register (Schedule Drug Log)
              </p>
              <p className="type-label text-tag-schedule-fg/80 mt-0.5">
                Entries are append-only · Cannot be modified or deleted · Mandatory retention: 5 years minimum
                · Pharmacy (Miscellaneous Provisions) Act 1996, Regulation 14
              </p>
            </div>
          </div>
          <table className="w-full">
            <caption className="sr-only">Controlled substance dispensing log</caption>
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Log #</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Date Â· Time</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Drug</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">DIN</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">Qty</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Rx #</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Patient</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Prescriber</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Dispensed By</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Verified</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_SCHEDULE_LOG.map((entry) => (
                <tr key={entry.id} className="h-11 border-b border-border-subtle hover:bg-bg-subtle transition-colors">
                  <td className="px-4 type-mono-data text-text-primary font-medium">{entry.logNumber}</td>
                  <td className="px-4 type-mono-data text-text-secondary whitespace-nowrap">{entry.date} {entry.time}</td>
                  <td className="px-4 type-body-sm text-text-primary">{entry.drug}</td>
                  <td className="px-4 type-mono-data text-text-secondary">{entry.din}</td>
                  <td className="px-4 type-mono-data text-text-primary text-right">{entry.qty}</td>
                  <td className="px-4 type-mono-data text-text-secondary">{entry.rxNumber}</td>
                  <td className="px-4 type-body-sm text-text-primary">{entry.patient}</td>
                  <td className="px-4 type-body-xs text-text-secondary">{entry.prescriber}</td>
                  <td className="px-4 type-body-xs text-text-secondary">{entry.dispensedBy}</td>
                  <td className="px-4">
                    <StatusPill variant={entry.verified ? 'success' : 'warning'}>
                      {entry.verified ? 'Verified' : 'Pending'}
                    </StatusPill>
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

export default ScheduleLogPage
