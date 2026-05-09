import { useParams } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_POS_PRODUCTS } from '@/data/sample'
import { Barcode, Package, CurrencyDollar, Stack } from '@phosphor-icons/react'

export function POSProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const product = SAMPLE_POS_PRODUCTS.find((p) => p.id === id)

  if (!product) {
    return (
      <div className="flex-1 p-6">
        <PageHeader title="Product not found" />
        <p className="text-text-secondary mt-4">No product matches ID {id}.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      <PageHeader
        title={product.name}
        breadcrumb={[{ label: 'POS Products', to: '/pos/products' }, { label: product.name }]}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-bg-surface rounded-card shadow-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-card bg-primary/10 text-primary flex items-center justify-center">
            <Package size={24} />
          </div>
          <div>
            <p className="type-label text-text-secondary">Category</p>
            <p className="type-card-title text-text-primary">{product.category}</p>
          </div>
        </div>
        <div className="bg-bg-surface rounded-card shadow-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-card bg-accent/10 text-accent flex items-center justify-center">
            <CurrencyDollar size={24} />
          </div>
          <div>
            <p className="type-label text-text-secondary">Price</p>
            <p className="type-mono-metric text-text-primary">JMD {product.priceJmd.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-bg-surface rounded-card shadow-card border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="type-card-title text-text-primary">Product Details</h2>
        </div>
        <div className="p-5 grid grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <p className="type-label text-text-secondary mb-1">Barcode</p>
            <p className="type-mono-data text-text-primary inline-flex items-center gap-1.5">
              <Barcode size={14} />
              {product.barcode}
            </p>
          </div>
          <div>
            <p className="type-label text-text-secondary mb-1">Stock Quantity</p>
            <p className={`type-mono-metric ${product.stockQty <= 10 ? 'text-tag-schedule-fg' : 'text-text-primary'}`}>
              {product.stockQty}
            </p>
          </div>
          <div>
            <p className="type-label text-text-secondary mb-1">Rx Required</p>
            {product.requiresRx ? (
              <StatusPill variant="info">Yes</StatusPill>
            ) : (
              <StatusPill variant="neutral">No</StatusPill>
            )}
          </div>
          <div>
            <p className="type-label text-text-secondary mb-1">Status</p>
            {product.stockQty <= 10 ? (
              <StatusPill variant="warning">Low Stock</StatusPill>
            ) : (
              <StatusPill variant="success">In Stock</StatusPill>
            )}
          </div>
        </div>
      </div>

      <div className="bg-bg-surface rounded-card shadow-card border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Stack size={18} className="text-text-secondary" />
          <h2 className="type-card-title text-text-primary">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">Recent POS transactions for this product</caption>
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Date</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Type</th>
                <th className="px-4 py-2 text-right type-caption text-text-secondary">Qty</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Ref</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border-subtle hover:bg-bg-subtle">
                <td className="px-4 py-2 type-body-xs text-text-secondary">2026-05-07</td>
                <td className="px-4 py-2 type-body-sm text-text-primary">Sale</td>
                <td className="px-4 py-2 type-mono-data text-right text-text-primary">-2</td>
                <td className="px-4 py-2 type-mono-data text-text-secondary">POS-2026-0315</td>
              </tr>
              <tr className="border-b border-border-subtle hover:bg-bg-subtle">
                <td className="px-4 py-2 type-body-xs text-text-secondary">2026-05-06</td>
                <td className="px-4 py-2 type-body-sm text-text-primary">Sale</td>
                <td className="px-4 py-2 type-mono-data text-right text-text-primary">-1</td>
                <td className="px-4 py-2 type-mono-data text-text-secondary">POS-2026-0308</td>
              </tr>
              <tr className="border-b border-border-subtle hover:bg-bg-subtle">
                <td className="px-4 py-2 type-body-xs text-text-secondary">2026-05-05</td>
                <td className="px-4 py-2 type-body-sm text-text-primary">Receive</td>
                <td className="px-4 py-2 type-mono-data text-right text-rx-filled-fg">+24</td>
                <td className="px-4 py-2 type-mono-data text-text-secondary">RCV-2026-0112</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default POSProductDetailPage
