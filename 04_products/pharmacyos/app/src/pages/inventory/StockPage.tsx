import { Plus, Warning } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_STOCK } from '@/data/sample'

const TODAY = new Date('2026-05-08')
const SOON = new Date('2026-08-07') // 90-day expiry threshold

function expiryStatus(expiryDate: string) {
  const exp = new Date(expiryDate)
  if (exp < TODAY) return { variant: 'error' as const, label: 'Expired' }
  if (exp < SOON) return { variant: 'warning' as const, label: 'Expiring Soon' }
  return null
}

function stockStatus(qty: number, reorder: number) {
  if (qty === 0) return { variant: 'error' as const, label: 'Out of stock' }
  if (qty < reorder * 0.5) return { variant: 'error' as const, label: 'Critical' }
  if (qty <= reorder) return { variant: 'warning' as const, label: 'Low' }
  return { variant: 'success' as const, label: 'OK' }
}

export function StockPage() {
  const total = SAMPLE_STOCK.length
  const lowStock = SAMPLE_STOCK.filter((s) => s.qtyOnHand <= s.reorderPoint).length
  const expiring = SAMPLE_STOCK.filter((s) => expiryStatus(s.expiryDate)).length
  const schedule = SAMPLE_STOCK.filter((s) => s.isSchedule).length

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Stock Overview"
        subtitle={`${total} active SKUs · ${lowStock} below reorder · ${expiring} expiring · ${schedule} schedule drugs`}
        cta={
          <Button variant="primary" size="md">
            <Plus size={16} weight="bold" />
            Receive Stock
          </Button>
        }
      />
      <section className="flex-1 p-6 overflow-y-auto">
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-subtle border-b border-border">
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Drug</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">DIN</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Lot</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">On Hand</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">Reorder</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Expiry</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Supplier</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_STOCK.map((item) => {
                const stock = stockStatus(item.qtyOnHand, item.reorderPoint)
                const expiry = expiryStatus(item.expiryDate)
                return (
                  <tr key={item.id} className="h-11 border-b border-border-subtle hover:bg-bg-subtle transition-colors">
                    <td className="px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-text-primary">{item.drug}</span>
                        {item.isSchedule && <StatusPill variant="schedule">SCHED</StatusPill>}
                      </div>
                    </td>
                    <td className="px-4 type-mono-data text-text-secondary">{item.din}</td>
                    <td className="px-4 type-mono-data text-text-secondary">{item.lot}</td>
                    <td className="px-4 type-mono-data text-text-primary text-right">{item.qtyOnHand}</td>
                    <td className="px-4 type-mono-data text-text-secondary text-right">{item.reorderPoint}</td>
                    <td className="px-4">
                      <div className="flex items-center gap-2">
                        <span className="type-mono-data text-text-secondary">{item.expiryDate}</span>
                        {expiry && (
                          <Warning size={14} className={expiry.variant === 'error' ? 'text-error' : 'text-warning'} aria-label={expiry.label} />
                        )}
                      </div>
                    </td>
                    <td className="px-4 text-[12px] text-text-secondary">{item.supplier}</td>
                    <td className="px-4">
                      <StatusPill variant={stock.variant}>{stock.label}</StatusPill>
                    </td>
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

export default StockPage
