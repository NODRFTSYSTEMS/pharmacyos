import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Export, Package, Warning, MagnifyingGlass, Printer,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { PageHeader, MetricCard, Pill as StatusPill } from '../../components/Shell'
import type { Product } from '../../types/database'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat('en-JM', {
    style: 'currency',
    currency: 'JMD',
    minimumFractionDigits: 2,
  }).format(n)
}

type StockStatus = 'OUT_OF_STOCK' | 'LOW_STOCK' | 'IN_STOCK'

function getStockStatus(product: Product): StockStatus {
  if (product.stock_qty === 0) return 'OUT_OF_STOCK'
  if (product.stock_qty <= product.reorder_level) return 'LOW_STOCK'
  return 'IN_STOCK'
}

type FilterTab = 'ALL' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'IN_STOCK'

const TAB_LABELS: Record<FilterTab, string> = {
  ALL: 'All',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
  IN_STOCK: 'In Stock',
}

// ── Component ─────────────────────────────────────────────────────────────────

export function InventoryReport() {
  const [tab, setTab] = useState<FilterTab>('ALL')
  const [search, setSearch] = useState('')

  // Pharmacy name for print header
  const { data: settingsRows = [] } = useQuery<{ key: string; value: string }[]>({
    queryKey: ['pharmacy_settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('pharmacy_settings').select('key, value')
      if (error) throw error
      return data ?? []
    },
    staleTime: 300_000,
  })
  const pharmacyName = settingsRows.find(r => r.key === 'pharmacy_name')?.value || 'Winchester Global Pharmacy'

  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ['report-inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })
      if (error) throw error
      return (data ?? []) as Product[]
    },
  })

  const products = data ?? []

  // Pre-annotate with stock status
  const annotated = useMemo(
    () => products.map(p => ({ ...p, _status: getStockStatus(p) })),
    [products],
  )

  // Metrics
  const inStockCount    = annotated.filter(p => p._status === 'IN_STOCK').length
  const lowStockCount   = annotated.filter(p => p._status === 'LOW_STOCK').length
  const outOfStockCount = annotated.filter(p => p._status === 'OUT_OF_STOCK').length

  // Filter + search
  const filtered = useMemo(() => {
    return annotated.filter(p => {
      const matchesTab =
        tab === 'ALL' ||
        (tab === 'LOW_STOCK'    && p._status === 'LOW_STOCK') ||
        (tab === 'OUT_OF_STOCK' && p._status === 'OUT_OF_STOCK') ||
        (tab === 'IN_STOCK'     && p._status === 'IN_STOCK')

      if (!matchesTab) return false

      if (search) {
        const q = search.toLowerCase()
        return (
          p.name.toLowerCase().includes(q) ||
          (p.barcode ?? '').toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [annotated, tab, search])

  // Totals for tfoot
  const totalStockQty   = filtered.reduce((s, p) => s + p.stock_qty, 0)
  const totalStockValue = filtered.reduce((s, p) => s + p.unit_price * p.stock_qty, 0)

  const generatedAt = new Date().toLocaleString('en-JM', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  // CSV export (all products, not just filtered, for completeness)
  function exportCsv() {
    const rows = [
      ['Product', 'Barcode', 'Category', 'Unit Price', 'Stock Qty', 'Stock Value', 'Reorder Level', 'Status'],
      ...annotated.map(p => [
        p.name,
        p.barcode ?? '',
        p.category ?? '',
        p.unit_price.toFixed(2),
        String(p.stock_qty),
        (p.unit_price * p.stock_qty).toFixed(2),
        String(p.reorder_level),
        p._status === 'OUT_OF_STOCK' ? 'Out of Stock'
          : p._status === 'LOW_STOCK' ? 'Low Stock'
          : 'In Stock',
      ]),
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `inventory-report-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* ── Print-only header ─────────────────────────────────────────── */}
      <div className="print-only mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">{pharmacyName}</h1>
        <h2 className="text-lg font-semibold text-gray-700 mt-1">Inventory Report</h2>
        <div className="flex gap-8 mt-2 text-sm text-gray-600">
          <span>As at: <strong>{generatedAt}</strong></span>
          <span>Products shown: <strong>{filtered.length}</strong> of <strong>{products.length}</strong></span>
        </div>
        <div className="flex gap-8 mt-1 text-sm text-gray-600">
          <span>In stock: <strong>{inStockCount}</strong></span>
          <span>Low stock: <strong>{lowStockCount}</strong></span>
          <span>Out of stock: <strong>{outOfStockCount}</strong></span>
        </div>
      </div>

      <PageHeader
        title="Inventory Report"
        subtitle="Current stock levels and reorder status"
        breadcrumb={['Reports', 'Inventory']}
        cta={
          <div className="flex items-center gap-2">
            <button
              onClick={exportCsv}
              className="btn btn-ghost gap-1.5 text-xs no-print"
              disabled={isLoading || products.length === 0}
              aria-label="Export inventory report as CSV"
            >
              <Export size={13} />
              Export CSV
            </button>
            <button
              onClick={() => window.print()}
              className="btn btn-ghost gap-1.5 text-xs no-print"
              disabled={isLoading}
              aria-label="Print inventory report"
            >
              <Printer size={13} />
              Print
            </button>
          </div>
        }
      />

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Total Products"
          value={isLoading ? '—' : String(products.length)}
          sub="active only"
          icon={Package}
          accent="blue"
        />
        <MetricCard
          label="In Stock"
          value={isLoading ? '—' : String(inStockCount)}
          icon={Package}
          accent="green"
        />
        <MetricCard
          label="Low Stock"
          value={isLoading ? '—' : String(lowStockCount)}
          sub="at or below reorder level"
          icon={Warning}
          accent="yellow"
        />
        <MetricCard
          label="Out of Stock"
          value={isLoading ? '—' : String(outOfStockCount)}
          sub="stock qty = 0"
          icon={Warning}
          accent={outOfStockCount > 0 ? 'red' : 'blue'}
        />
      </div>

      {/* Filters row */}
      <div className="card p-3 mb-4 flex flex-wrap items-center gap-3 no-print">
        {/* Tab filters */}
        <div className="flex gap-1" role="tablist" aria-label="Stock status filter">
          {(Object.keys(TAB_LABELS) as FilterTab[]).map(t => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`btn btn-ghost text-xs h-8 px-3 ${
                tab === t ? 'bg-blue-50 border-blue-300 text-blue-700' : ''
              }`}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative ml-auto">
          <MagnifyingGlass
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="inv-search"
            type="text"
            placeholder="Search by name or barcode…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-7 w-52 text-xs"
            aria-label="Search products by name or barcode"
          />
        </div>

        {!isLoading && (
          <span className="text-xs text-gray-400">
            {filtered.length} of {products.length} products
          </span>
        )}
      </div>

      {/* Error state */}
      {isError && (
        <div className="card p-4 mb-4 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200">
          <Warning size={15} weight="duotone" aria-hidden="true" />
          Failed to load inventory. Check your connection and try again.
        </div>
      )}

      {/* Table */}
      {!isError && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-compact text-sm" aria-label="Inventory stock levels">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Barcode</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock Qty</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock Value</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reorder At</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">Loading inventory…</td>
                  </tr>
                )}
                {!isLoading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">No products match your filter.</td>
                  </tr>
                )}
                {!isLoading && filtered.map(p => {
                  const rowBg =
                    p._status === 'OUT_OF_STOCK'
                      ? 'bg-red-50 hover:bg-red-100'
                      : p._status === 'LOW_STOCK'
                        ? 'bg-amber-50 hover:bg-amber-100'
                        : 'hover:bg-gray-50'

                  const pillVariant =
                    p._status === 'OUT_OF_STOCK' ? 'red'
                    : p._status === 'LOW_STOCK'   ? 'yellow'
                    : 'green'

                  const pillLabel =
                    p._status === 'OUT_OF_STOCK' ? 'Out of Stock'
                    : p._status === 'LOW_STOCK'   ? 'Low Stock'
                    : 'In Stock'

                  return (
                    <tr key={p.id} className={rowBg}>
                      <td className="px-4 py-3 font-medium text-sm text-gray-800 max-w-[200px] truncate">{p.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.barcode ?? '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{p.category ?? '—'}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">{fmtCurrency(p.unit_price)}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-gray-800">{p.stock_qty}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">{fmtCurrency(p.unit_price * p.stock_qty)}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-gray-500">{p.reorder_level}</td>
                      <td className="px-4 py-3">
                        <StatusPill label={pillLabel} variant={pillVariant} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              {!isLoading && filtered.length > 0 && (
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Totals — {filtered.length} product{filtered.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-800">{totalStockQty.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-bold text-blue-700">{fmtCurrency(totalStockValue)}</td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryReport
