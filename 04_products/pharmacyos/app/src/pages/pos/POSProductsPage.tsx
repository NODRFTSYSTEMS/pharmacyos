import { Plus, MagnifyingGlass } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_POS_PRODUCTS } from '@/data/sample'

export function POSProductsPage() {
  const lowStock = SAMPLE_POS_PRODUCTS.filter((p) => p.stockQty < 10).length
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Retail Products"
        subtitle={`${SAMPLE_POS_PRODUCTS.length} SKUs · ${lowStock} below 10 units`}
        cta={
          <Button variant="primary" size="md">
            <Plus size={16} weight="bold" />
            Add Product
          </Button>
        }
        filterBar={
          <div className="w-full max-w-md relative">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="search"
              placeholder="Search by name, barcode, or category…"
              className="w-full h-10 pl-9 pr-3 type-body-sm bg-bg-surface border border-border rounded-control focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
            />
          </div>
        }
      />
      <section className="flex-1 p-6 overflow-y-auto">
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Product</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Barcode</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Category</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">Price (JMD)</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">Stock</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Rx</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_POS_PRODUCTS.map((p) => (
                <tr key={p.id} className="h-11 border-b border-border-subtle hover:bg-bg-subtle transition-colors cursor-pointer">
                  <td className="px-4 text-[13px] text-text-primary">{p.name}</td>
                  <td className="px-4 type-mono-data text-text-secondary">{p.barcode}</td>
                  <td className="px-4 text-[12px] text-text-secondary">{p.category}</td>
                  <td className="px-4 type-mono-data text-text-primary text-right">{p.priceJmd.toLocaleString()}</td>
                  <td className={`px-4 type-mono-data text-right ${p.stockQty < 10 ? 'text-warning' : 'text-text-primary'}`}>{p.stockQty}</td>
                  <td className="px-4">
                    {p.requiresRx ? <StatusPill variant="info">Rx</StatusPill> : <span className="text-[12px] text-text-disabled">—</span>}
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

export default POSProductsPage
