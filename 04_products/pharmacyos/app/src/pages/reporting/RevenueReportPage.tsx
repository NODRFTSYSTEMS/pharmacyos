import { DownloadSimple, TrendUp, TrendDown } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_TRANSACTIONS, type PaymentMethod } from '@/data/sample'

const METHOD_VARIANT: Record<PaymentMethod, 'success' | 'info' | 'neutral'> = {
  Cash: 'success',
  Card: 'info',
  Lynk: 'neutral',
}

export function RevenueReportPage() {
  const totalRevenue = SAMPLE_TRANSACTIONS.reduce((s, t) => s + t.totalJmd, 0)
  const totalItems = SAMPLE_TRANSACTIONS.reduce((s, t) => s + t.items, 0)
  const txCount = SAMPLE_TRANSACTIONS.length
  const avgTx = txCount === 0 ? 0 : totalRevenue / txCount

  // By method
  const byMethod = new Map<PaymentMethod, { count: number; revenue: number }>()
  for (const t of SAMPLE_TRANSACTIONS) {
    const cur = byMethod.get(t.method) ?? { count: 0, revenue: 0 }
    cur.count++
    cur.revenue += t.totalJmd
    byMethod.set(t.method, cur)
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Revenue Report"
        subtitle="Sales and payment-method breakdown"
        cta={
          <div className="flex items-center gap-2">
            <select className="h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control">
              <option>Today</option>
              <option>Last 7 days</option>
              <option>Month to date</option>
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
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <Kpi title="Gross Revenue" value={`JMD ${totalRevenue.toLocaleString()}`} trend="+12.4%" trendUp />
          <Kpi title="Transactions" value={txCount.toString()} trend="+8" trendUp />
          <Kpi title="Items Sold" value={totalItems.toString()} trend="+24" trendUp />
          <Kpi title="Avg Transaction" value={`JMD ${avgTx.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} trend="-3.2%" />
        </div>

        {/* By method */}
        <div className="bg-bg-surface rounded-card shadow-card p-6">
          <p className="type-caption text-text-secondary mb-4">By Payment Method</p>
          <div className="grid grid-cols-3 gap-4">
            {(['Cash', 'Card', 'Lynk'] as PaymentMethod[]).map((m) => {
              const stats = byMethod.get(m) ?? { count: 0, revenue: 0 }
              const pct = totalRevenue === 0 ? 0 : Math.round((stats.revenue / totalRevenue) * 100)
              return (
                <div key={m}>
                  <StatusPill variant={METHOD_VARIANT[m]}>{m}</StatusPill>
                  <p className="type-mono-metric text-text-primary leading-none mt-3">JMD {stats.revenue.toLocaleString()}</p>
                  <p className="text-xs text-text-secondary mt-1">{stats.count} transactions · {pct}% of revenue</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="type-caption text-text-secondary">Recent Transactions</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Tx #</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Time</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Cashier</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">Items</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">Total (JMD)</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Method</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_TRANSACTIONS.slice(0, 12).map((t) => (
                <tr key={t.id} className="h-11 border-b border-border-subtle hover:bg-bg-subtle">
                  <td className="px-4 type-mono-data text-text-primary font-medium">{t.txNumber}</td>
                  <td className="px-4 type-mono-data text-text-secondary">{t.time}</td>
                  <td className="px-4 type-body-sm text-text-primary">{t.cashier}</td>
                  <td className="px-4 type-mono-data text-text-primary text-right">{t.items}</td>
                  <td className="px-4 type-mono-data text-text-primary text-right">{t.totalJmd.toLocaleString()}</td>
                  <td className="px-4">
                    <StatusPill variant={METHOD_VARIANT[t.method]}>{t.method}</StatusPill>
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

function Kpi({ title, value, trend, trendUp = false }: { title: string; value: string; trend: string; trendUp?: boolean }) {
  return (
    <div className="bg-bg-surface rounded-card shadow-card p-4">
      <p className="type-caption text-text-secondary">{title}</p>
      <p className="type-mono-metric text-text-primary leading-none mt-2">{value}</p>
      <p className={`type-label mt-2 inline-flex items-center gap-1 ${trendUp ? 'text-rx-filled-fg' : 'text-tag-schedule-fg'}`}>
        {trendUp ? <TrendUp size={12} weight="bold" /> : <TrendDown size={12} weight="bold" />}
        {trend} vs prior period
      </p>
    </div>
  )
}

export default RevenueReportPage
