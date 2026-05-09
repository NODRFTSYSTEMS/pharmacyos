import { DownloadSimple } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_STOCK, SAMPLE_RECEIVES } from '@/data/sample'

const TODAY = new Date('2026-05-08')
const SOON = new Date('2026-08-07')

export function InventoryReportPage() {
  const totalSkus = SAMPLE_STOCK.length
  const totalUnits = SAMPLE_STOCK.reduce((s, x) => s + x.qtyOnHand, 0)
  const inventoryValue = SAMPLE_STOCK.reduce((s, x) => s + x.qtyOnHand * x.unitCostJmd, 0)
  const expiringSoon = SAMPLE_STOCK.filter((s) => {
    const e = new Date(s.expiryDate)
    return e >= TODAY && e < SOON
  })
  const lowStock = SAMPLE_STOCK.filter((s) => s.qtyOnHand <= s.reorderPoint)

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Inventory Report"
        subtitle="Stock movement, expiry, and lot summary"
        cta={
          <div className="flex items-center gap-2">
            <select className="h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
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
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <Kpi title="Total SKUs" value={totalSkus.toString()} note="active drug catalog" />
          <Kpi title="Total Units" value={totalUnits.toLocaleString()} note="on hand across all lots" />
          <Kpi title="Inventory Value" value={`JMD ${inventoryValue.toLocaleString()}`} note="at unit cost" />
          <Kpi title="Action Items" value={(expiringSoon.length + lowStock.length).toString()} note={`${lowStock.length} low · ${expiringSoon.length} expiring`} />
        </div>

        {/* Recent receives */}
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="type-caption text-text-secondary">Recent Stock Receives</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Receive #</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Date</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Supplier</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Drug</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">DIN</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Lot</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">Qty</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Expiry</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Received By</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_RECEIVES.map((r) => (
                <tr key={r.id} className="h-11 border-b border-border-subtle hover:bg-bg-subtle">
                  <td className="px-4 type-mono-data text-text-primary font-medium">{r.receiveNumber}</td>
                  <td className="px-4 type-mono-data text-text-secondary">{r.date}</td>
                  <td className="px-4 text-[12px] text-text-secondary">{r.supplier}</td>
                  <td className="px-4 text-[13px] text-text-primary">{r.drug}</td>
                  <td className="px-4 type-mono-data text-text-secondary">{r.din}</td>
                  <td className="px-4 type-mono-data text-text-secondary">{r.lot}</td>
                  <td className="px-4 type-mono-data text-text-primary text-right">{r.qtyReceived}</td>
                  <td className="px-4 type-mono-data text-text-secondary">{r.expiryDate}</td>
                  <td className="px-4 text-[12px] text-text-secondary">{r.receivedBy}</td>
                  <td className="px-4 type-mono-data text-text-secondary">{r.invoiceRef}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Expiring + low-stock callouts */}
        <div className="grid grid-cols-2 gap-4">
          <Callout title="Expiring Within 90 Days" items={expiringSoon.map((s) => ({ name: s.drug, detail: `Expiry ${s.expiryDate}`, tag: 'warning' }))} />
          <Callout title="Below Reorder Point" items={lowStock.map((s) => ({ name: s.drug, detail: `${s.qtyOnHand} on hand · reorder at ${s.reorderPoint}`, tag: 'error' }))} />
        </div>
      </section>
    </div>
  )
}

function Kpi({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="bg-bg-surface rounded-card shadow-card p-4">
      <p className="type-caption text-text-secondary">{title}</p>
      <p className="type-mono-metric text-text-primary leading-none mt-2">{value}</p>
      <p className="text-[11px] text-text-secondary mt-2">{note}</p>
    </div>
  )
}

function Callout({ title, items }: { title: string; items: { name: string; detail: string; tag: 'warning' | 'error' }[] }) {
  return (
    <div className="bg-bg-surface rounded-card shadow-card p-4">
      <p className="type-caption text-text-secondary mb-3">{title}</p>
      {items.length === 0 ? (
        <p className="text-sm text-text-secondary">None</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((it, i) => (
            <div key={i} className="flex items-start justify-between gap-2 p-2 rounded-control border border-border">
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{it.name}</p>
                <p className="text-xs text-text-secondary">{it.detail}</p>
              </div>
              <StatusPill variant={it.tag === 'error' ? 'error' : 'warning'}>{it.tag === 'error' ? 'Low' : 'Expiring'}</StatusPill>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default InventoryReportPage
