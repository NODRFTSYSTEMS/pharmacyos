import { Plus } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_PRESCRIPTIONS, type RxStatus } from '@/data/sample'

const RX_COLUMNS: { key: RxStatus; label: string; description: string }[] = [
  { key: 'Received',  label: 'Received',  description: 'Awaiting pharmacist verification' },
  { key: 'Verified',  label: 'Verified',  description: 'Approved — ready to fill' },
  { key: 'Filled',    label: 'Filled',    description: 'Prepared — awaiting patient pickup' },
  { key: 'Dispensed', label: 'Dispensed', description: 'Delivered to patient' },
]

export function QueuePage() {
  const counts = RX_COLUMNS.reduce<Record<RxStatus, number>>((acc, c) => {
    acc[c.key] = SAMPLE_PRESCRIPTIONS.filter((r) => r.status === c.key).length
    return acc
  }, {} as Record<RxStatus, number>)

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Prescription Queue"
        subtitle={`${SAMPLE_PRESCRIPTIONS.length} active prescriptions across 4 stages`}
        cta={
          <Button variant="primary" size="md">
            <Plus size={16} weight="bold" />
            New Rx
          </Button>
        }
      />
      <section className="flex-1 p-6 overflow-hidden">
        <div className="grid grid-cols-4 gap-4 h-full">
          {RX_COLUMNS.map((col) => {
            const items = SAMPLE_PRESCRIPTIONS.filter((r) => r.status === col.key)
            return (
              <div key={col.key} className="flex flex-col bg-bg-surface rounded-card shadow-card overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <StatusPill variant={col.key.toLowerCase() as Lowercase<RxStatus>}>
                      {col.label} ({counts[col.key]})
                    </StatusPill>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-1.5">{col.description}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                  {items.length === 0 && (
                    <p className="text-[12px] text-text-disabled italic text-center mt-4">No prescriptions</p>
                  )}
                  {items.map((rx) => (
                    <article
                      key={rx.id}
                      className="rounded-control border border-border bg-bg-surface p-3 hover:shadow-card-hover hover:border-primary/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-[13px] font-semibold text-text-primary leading-tight truncate">{rx.patient}</p>
                        {rx.isSchedule && <StatusPill variant="schedule">SCHED</StatusPill>}
                      </div>
                      <p className="type-mono-data text-text-secondary text-[11px] mb-2">{rx.rxNumber}</p>
                      <ul className="text-[12px] text-text-primary leading-snug space-y-0.5">
                        {rx.drugs.map((d, i) => (
                          <li key={i} className="truncate">• {d}</li>
                        ))}
                      </ul>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-subtle">
                        <span className="text-[11px] text-text-secondary">{rx.prescriber}</span>
                        {rx.isNhf && <StatusPill variant="nhf">NHF</StatusPill>}
                      </div>
                      <p className="type-mono-data text-text-disabled text-[10px] mt-1">{rx.received}</p>
                    </article>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default QueuePage
