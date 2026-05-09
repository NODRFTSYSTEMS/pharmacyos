import { DownloadSimple, Lock } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_SCHEDULE_LOG } from '@/data/sample'

export function ScheduleLogReportPage() {
  const total = SAMPLE_SCHEDULE_LOG.length
  const verified = SAMPLE_SCHEDULE_LOG.filter((e) => e.verified).length
  const totalUnits = SAMPLE_SCHEDULE_LOG.reduce((s, e) => s + e.qty, 0)

  // Group by drug
  const byDrug = new Map<string, { count: number; units: number }>()
  for (const e of SAMPLE_SCHEDULE_LOG) {
    const cur = byDrug.get(e.drug) ?? { count: 0, units: 0 }
    cur.count++
    cur.units += e.qty
    byDrug.set(e.drug, cur)
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Schedule Log Report"
        subtitle="Regulatory controlled-substance activity — Pharmacy Act compliance export"
        cta={
          <div className="flex items-center gap-2">
            <select className="h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control">
              <option>Current month</option>
              <option>Last quarter</option>
              <option>Year to date</option>
            </select>
            <Button variant="secondary" size="md">
              <DownloadSimple size={16} weight="bold" />
              Export PDF
            </Button>
          </div>
        }
      />
      <section className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
        <div className="bg-tag-schedule-bg/40 border border-tag-schedule-fg/30 rounded-card p-3 flex items-center gap-2">
          <Lock size={14} className="text-tag-schedule-fg shrink-0" />
          <p className="text-xs text-tag-schedule-fg">
            Regulatory record — exports are timestamped, signed, and submitted to the Pharmacy Council on request.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Kpi title="Log Entries" value={total.toString()} note="dispensed scheduled drugs" />
          <Kpi title="Pharmacist-Verified" value={`${verified} / ${total}`} note="dual sign-off" />
          <Kpi title="Total Units" value={totalUnits.toString()} note="across all entries" />
        </div>

        {/* By drug */}
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="type-caption text-text-secondary">By Drug</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Drug</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">Entries</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">Total Units</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(byDrug.entries())
                .sort((a, b) => b[1].units - a[1].units)
                .map(([drug, stats]) => (
                  <tr key={drug} className="h-11 border-b border-border-subtle hover:bg-bg-subtle">
                    <td className="px-4 type-body-sm text-text-primary">{drug}</td>
                    <td className="px-4 type-mono-data text-text-primary text-right">{stats.count}</td>
                    <td className="px-4 type-mono-data text-text-primary text-right">{stats.units}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Recent log entries (compact) */}
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="type-caption text-text-secondary">Recent Entries</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Log #</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Date</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Drug</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">Qty</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Patient</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Verified</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_SCHEDULE_LOG.slice(0, 10).map((e) => (
                <tr key={e.id} className="h-11 border-b border-border-subtle hover:bg-bg-subtle">
                  <td className="px-4 type-mono-data text-text-primary">{e.logNumber}</td>
                  <td className="px-4 type-mono-data text-text-secondary">{e.date}</td>
                  <td className="px-4 type-body-sm text-text-primary">{e.drug}</td>
                  <td className="px-4 type-mono-data text-text-primary text-right">{e.qty}</td>
                  <td className="px-4 type-body-sm text-text-primary">{e.patient}</td>
                  <td className="px-4">
                    <StatusPill variant={e.verified ? 'success' : 'warning'}>{e.verified ? 'Verified' : 'Pending'}</StatusPill>
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

function Kpi({ title, value, note }: { title: string; value: string; note?: string }) {
  return (
    <div className="bg-bg-surface rounded-card shadow-card p-4">
      <p className="type-caption text-text-secondary">{title}</p>
      <p className="type-mono-metric text-text-primary leading-none mt-2">{value}</p>
      {note && <p className="type-label text-text-secondary mt-2">{note}</p>}
    </div>
  )
}

export default ScheduleLogReportPage
