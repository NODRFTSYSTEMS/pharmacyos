import { PageHeader } from '@/components/PageHeader'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_STOCK } from '@/data/sample'
import { Warning, Calendar } from '@phosphor-icons/react'

function daysUntil(date: string) {
  const diff = new Date(date).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const lowStock = SAMPLE_STOCK.filter((s) => s.qtyOnHand <= s.reorderPoint)
const expiryAlerts = SAMPLE_STOCK.filter((s) => {
  const d = daysUntil(s.expiryDate)
  return d <= 90
})

export function AlertsPage() {
  return (
    <div className="flex-1 p-6 space-y-6">
      <PageHeader title="Inventory Alerts" />

      {/* Low Stock */}
      <section className="bg-bg-surface rounded-card shadow-card border border-border">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Warning size={18} className="text-warning" />
          <h2 className="type-card-title text-text-primary">Low Stock</h2>
          <span className="type-body-xs text-text-secondary ml-2">{lowStock.length} items below reorder point</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">Low stock alerts — items below reorder point</caption>
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Drug</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">DIN</th>
                <th className="px-4 py-2 text-right type-caption text-text-secondary">On Hand</th>
                <th className="px-4 py-2 text-right type-caption text-text-secondary">Reorder</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Supplier</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((item) => (
                <tr key={item.id} className="border-b border-border-subtle hover:bg-bg-subtle">
                  <td className="px-4 py-2 type-body-sm font-medium text-text-primary">{item.drug}</td>
                  <td className="px-4 py-2 type-mono-data text-text-secondary">{item.din}</td>
                  <td className="px-4 py-2 type-mono-data text-right text-tag-schedule-fg font-medium">{item.qtyOnHand}</td>
                  <td className="px-4 py-2 type-mono-data text-right text-text-secondary">{item.reorderPoint}</td>
                  <td className="px-4 py-2 type-body-xs text-text-secondary">{item.supplier}</td>
                  <td className="px-4 py-2">
                    <StatusPill variant="warning">Low</StatusPill>
                  </td>
                </tr>
              ))}
              {lowStock.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-text-secondary type-body-xs">
                    No low stock alerts
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Expiry Alerts */}
      <section className="bg-bg-surface rounded-card shadow-card border border-border">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Calendar size={18} className="text-error" />
          <h2 className="type-card-title text-text-primary">Expiry Alerts</h2>
          <span className="type-body-xs text-text-secondary ml-2">{expiryAlerts.length} items expiring within 90 days</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">Expiry alerts — items expiring within 90 days</caption>
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Drug</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Lot #</th>
                <th className="px-4 py-2 text-right type-caption text-text-secondary">Qty</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Expiry</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Days Left</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {expiryAlerts.map((item) => {
                const days = daysUntil(item.expiryDate)
                return (
                  <tr key={item.id} className="border-b border-border-subtle hover:bg-bg-subtle">
                    <td className="px-4 py-2 type-body-sm font-medium text-text-primary">{item.drug}</td>
                    <td className="px-4 py-2 type-mono-data text-text-secondary">{item.lot}</td>
                    <td className="px-4 py-2 type-mono-data text-right text-text-primary">{item.qtyOnHand}</td>
                    <td className="px-4 py-2 type-mono-data text-text-secondary">{item.expiryDate}</td>
                    <td className="px-4 py-2 type-mono-data text-text-primary">{days}</td>
                    <td className="px-4 py-2">
                      <StatusPill variant={days < 30 ? 'error' : 'warning'}>
                        {days < 0 ? 'Expired' : days < 30 ? '< 30 days' : '< 90 days'}
                      </StatusPill>
                    </td>
                  </tr>
                )
              })}
              {expiryAlerts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-text-secondary type-body-xs">
                    No expiry alerts
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default AlertsPage
