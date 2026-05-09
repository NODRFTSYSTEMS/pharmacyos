import { DownloadSimple } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_PRESCRIPTIONS, type RxStatus } from '@/data/sample'

export function DispensingReportPage() {
  const total = SAMPLE_PRESCRIPTIONS.length
  const dispensed = SAMPLE_PRESCRIPTIONS.filter((r) => r.status === 'Dispensed').length
  const inProgress = total - dispensed
  const fillRate = total === 0 ? 0 : Math.round((dispensed / total) * 100)

  // Group by prescriber
  const prescriberStats = new Map<string, { total: number; dispensed: number }>()
  for (const r of SAMPLE_PRESCRIPTIONS) {
    const cur = prescriberStats.get(r.prescriber) ?? { total: 0, dispensed: 0 }
    cur.total++
    if (r.status === 'Dispensed') cur.dispensed++
    prescriberStats.set(r.prescriber, cur)
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Dispensing Report"
        subtitle="Prescription fill rates and dispensing activity"
        cta={
          <div className="flex items-center gap-2">
            <select className="h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Year to date</option>
            </select>
            <Button variant="secondary" size="md">
              <DownloadSimple size={16} weight="bold" />
              Export
            </Button>
          </div>
        }
      />
      <section className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-4">
          <Kpi title="Total Rx" value={total.toString()} />
          <Kpi title="Dispensed" value={dispensed.toString()} note="completed pickups" />
          <Kpi title="In Progress" value={inProgress.toString()} note="across received/verified/filled" />
          <Kpi title="Fill Rate" value={`${fillRate}%`} note="dispensed ÷ total" />
        </div>

        {/* Status breakdown */}
        <div className="bg-bg-surface rounded-card shadow-card p-6">
          <p className="type-caption text-text-secondary mb-4">Status Breakdown</p>
          <div className="grid grid-cols-4 gap-4">
            {(['Received', 'Verified', 'Filled', 'Dispensed'] as RxStatus[]).map((status) => {
              const count = SAMPLE_PRESCRIPTIONS.filter((r) => r.status === status).length
              const pct = total === 0 ? 0 : Math.round((count / total) * 100)
              return (
                <div key={status}>
                  <StatusPill variant={status.toLowerCase() as Lowercase<RxStatus>}>{status}</StatusPill>
                  <p className="type-mono-metric text-text-primary leading-none mt-3">{count}</p>
                  <p className="text-xs text-text-secondary mt-1">{pct}% of total</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Prescriber breakdown */}
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="type-caption text-text-secondary">By Prescriber</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Prescriber</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">Total Rx</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">Dispensed</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">Fill Rate</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(prescriberStats.entries())
                .sort((a, b) => b[1].total - a[1].total)
                .map(([prescriber, stats]) => {
                  const rate = stats.total === 0 ? 0 : Math.round((stats.dispensed / stats.total) * 100)
                  return (
                    <tr key={prescriber} className="h-11 border-b border-border-subtle hover:bg-bg-subtle">
                      <td className="px-4 text-[13px] text-text-primary">{prescriber}</td>
                      <td className="px-4 type-mono-data text-text-primary text-right">{stats.total}</td>
                      <td className="px-4 type-mono-data text-text-primary text-right">{stats.dispensed}</td>
                      <td className="px-4 type-mono-data text-text-primary text-right">{rate}%</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function Kpi({ title, value, note }: { title: string; value: string; note?: string }) {
  return (
    <div className="bg-bg-surface rounded-card shadow-card p-4">
      <p className="type-caption text-text-secondary">{title}</p>
      <p className="type-mono-metric text-text-primary leading-none mt-2">{value}</p>
      {note && <p className="text-[11px] text-text-secondary mt-2">{note}</p>}
    </div>
  )
}

export default DispensingReportPage
