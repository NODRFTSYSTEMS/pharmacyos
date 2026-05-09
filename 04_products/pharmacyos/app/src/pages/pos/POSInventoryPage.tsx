import { PageHeader } from '@/components/PageHeader'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_POS_PRODUCTS } from '@/data/sample'

export function POSInventoryPage() {
  return (
    <div className="flex-1 p-6 space-y-6">
      <PageHeader title="POS Inventory" />

      <div className="bg-bg-surface rounded-card shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">POS retail product inventory</caption>
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Product</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Barcode</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Category</th>
                <th className="px-4 py-2 text-right type-caption text-text-secondary">Stock</th>
                <th className="px-4 py-2 text-right type-caption text-text-secondary">Reorder Pt</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_POS_PRODUCTS.map((p) => (
                <tr key={p.id} className="border-b border-border-subtle hover:bg-bg-subtle">
                  <td className="px-4 py-2 type-body-sm font-medium text-text-primary">{p.name}</td>
                  <td className="px-4 py-2 type-mono-data text-text-secondary">{p.barcode}</td>
                  <td className="px-4 py-2 type-body-xs text-text-secondary">{p.category}</td>
                  <td className="px-4 py-2 type-mono-data text-right text-text-primary">{p.stockQty}</td>
                  <td className="px-4 py-2 type-mono-data text-right text-text-secondary">10</td>
                  <td className="px-4 py-2">
                    {p.stockQty <= 10 ? (
                      <StatusPill variant="warning">Low</StatusPill>
                    ) : (
                      <StatusPill variant="success">OK</StatusPill>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default POSInventoryPage
