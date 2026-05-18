import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Export, Package, Warning, MagnifyingGlass, Printer, ArrowClockwise,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { PageHeader, MetricCard, Pill as StatusPill, PrintHeader } from '../../components/Shell'
import { ReportAssistant } from '../../components/ReportAssistant'
import { PrintPreviewModal } from '../../components/PrintPreviewModal'
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
type ExpiryStatus = 'EXPIRED' | 'EXPIRING_SOON' | 'OK' | null

function getStockStatus(product: Product): StockStatus {
  if (product.stock_qty === 0) return 'OUT_OF_STOCK'
  if (product.stock_qty <= product.reorder_level) return 'LOW_STOCK'
  return 'IN_STOCK'
}

function getExpiryStatus(expiry_date: string | null): ExpiryStatus {
  if (!expiry_date) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const in30  = new Date(today); in30.setDate(today.getDate() + 30)
  const d = new Date(expiry_date)
  if (d < today) return 'EXPIRED'
  if (d <= in30) return 'EXPIRING_SOON'
  return 'OK'
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-JM', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

type FilterTab = 'ALL' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'IN_STOCK' | 'EXPIRING_SOON' | 'REORDER'

const TAB_LABELS: Record<FilterTab, string> = {
  ALL:           'All',
  LOW_STOCK:     'Low Stock',
  OUT_OF_STOCK:  'Out of Stock',
  IN_STOCK:      'In Stock',
  EXPIRING_SOON: 'Expiring Soon',
  REORDER:       'Reorder',
}

// ── Reorder recommendation type (matches get_reorder_recommendations() RPC) ──

interface ReorderRec {
  product_id:      string
  product_name:    string
  category:        string | null
  stock_qty:       number
  reorder_level:   number
  avg_daily_sales: number
  days_to_stockout: number | null
  urgency:         'OUT_OF_STOCK' | 'CRITICAL' | 'LOW'
}

const URGENCY_PILL: Record<ReorderRec['urgency'], { label: string; variant: 'red' | 'yellow' | 'gray' }> = {
  OUT_OF_STOCK: { label: 'Out of Stock', variant: 'red'    },
  CRITICAL:     { label: 'Critical',     variant: 'red'    },
  LOW:          { label: 'Low Stock',    variant: 'yellow' },
}

// ── Component ─────────────────────────────────────────────────────────────────

export function InventoryReport() {
  const [tab, setTab] = useState<FilterTab>('ALL')
  const [search, setSearch] = useState('')
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false)

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
    enabled: tab !== 'REORDER',
  })

  const { data: reorderData, isLoading: reorderLoading, isError: reorderError } = useQuery<ReorderRec[]>({
    queryKey: ['reorder-recommendations'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_reorder_recommendations')
      if (error) throw error
      return (data ?? []) as ReorderRec[]
    },
    enabled: tab === 'REORDER',
    staleTime: 2 * 60 * 1000,
  })

  const products = data ?? []

  // Pre-annotate with stock + expiry status
  const annotated = useMemo(
    () => products.map(p => ({
      ...p,
      _status:       getStockStatus(p),
      _expiryStatus: getExpiryStatus(p.expiry_date),
    })),
    [products],
  )

  // Metrics
  const inStockCount      = annotated.filter(p => p._status === 'IN_STOCK').length
  const lowStockCount     = annotated.filter(p => p._status === 'LOW_STOCK').length
  const outOfStockCount   = annotated.filter(p => p._status === 'OUT_OF_STOCK').length
  const expiringSoonCount = annotated.filter(
    p => p._expiryStatus === 'EXPIRING_SOON' || p._expiryStatus === 'EXPIRED'
  ).length

  // Filter + search
  const filtered = useMemo(() => {
    return annotated.filter(p => {
      const matchesTab =
        tab === 'ALL' ||
        (tab === 'LOW_STOCK'     && p._status === 'LOW_STOCK') ||
        (tab === 'OUT_OF_STOCK'  && p._status === 'OUT_OF_STOCK') ||
        (tab === 'IN_STOCK'      && p._status === 'IN_STOCK') ||
        (tab === 'EXPIRING_SOON' && (
          p._expiryStatus === 'EXPIRING_SOON' || p._expiryStatus === 'EXPIRED'
        ))

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

  // AI context summary for ReportAssistant
  const dataSummary = useMemo((): string => {
    if (products.length === 0) return ''
    return (
      `Inventory snapshot: ${products.length} active products. ` +
      `${inStockCount} in stock, ${lowStockCount} low stock, ${outOfStockCount} out of stock, ` +
      `${expiringSoonCount} expiring within 30 days. ` +
      `Total stock value: ${fmtCurrency(totalStockValue)}. ` +
      `Current filter tab: ${TAB_LABELS[tab]}.`
    )
  }, [products.length, inStockCount, lowStockCount, outOfStockCount, expiringSoonCount, totalStockValue, tab])

  // CSV export (all products, not just filtered, for completeness)
  function exportCsv() {
    const rows = [
      ['Product', 'Barcode', 'Category', 'Unit Price', 'Stock Qty', 'Stock Value', 'Reorder Level', 'Expiry Date', 'Batch No', 'Status'],
      ...annotated.map(p => [
        p.name,
        p.barcode ?? '',
        p.category ?? '',
        p.unit_price.toFixed(2),
        String(p.stock_qty),
        (p.unit_price * p.stock_qty).toFixed(2),
        String(p.reorder_level),
        p.expiry_date ?? '',
        p.batch_number ?? '',
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
      <PrintHeader reportTitle="Inventory Report" />

      <PageHeader
        title="Inventory Report"
        subtitle="Current stock levels and reorder status"
        breadcrumb={['Reports', 'Inventory']}
        showSession
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
              onClick={() => setPrintPreviewOpen(true)}
              className="btn btn-ghost gap-1.5 text-xs no-print"
              disabled={isLoading || filtered.length === 0}
              aria-label="Print inventory report"
            >
              <Printer size={13} />
              Print
            </button>
          </div>
        }
      />

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <MetricCard
          label="Total Products"
          value={isLoading ? '—' : String(products.length)}
          sub="active products"
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
          sub="no units in stock"
          icon={Warning}
          accent={outOfStockCount > 0 ? 'red' : 'blue'}
        />
        <MetricCard
          label="Expiring Soon"
          value={isLoading ? '—' : String(expiringSoonCount)}
          sub="within 30 days or expired"
          icon={Warning}
          accent={expiringSoonCount > 0 ? 'red' : 'green'}
        />
      </div>

      {/* AI Report Assistant */}
      {dataSummary && <ReportAssistant dataSummary={dataSummary} reportType="Inventory" />}

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

        {/* Search — hidden on Reorder tab (RPC result is already filtered) */}
        {tab !== 'REORDER' && (
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
        )}

        {!isLoading && tab !== 'REORDER' && (
          <span className="text-xs text-gray-400">
            {filtered.length} of {products.length} products
          </span>
        )}
        {tab === 'REORDER' && !reorderLoading && (
          <span className="text-xs text-gray-400 ml-auto">
            {(reorderData ?? []).length} item{(reorderData ?? []).length !== 1 ? 's' : ''} need reordering
          </span>
        )}
      </div>

      {/* Error states */}
      {isError && tab !== 'REORDER' && (
        <div className="card p-4 mb-4 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200">
          <Warning size={15} weight="duotone" aria-hidden="true" />
          Failed to load inventory. Check your connection and try again.
        </div>
      )}
      {reorderError && tab === 'REORDER' && (
        <div className="card p-4 mb-4 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200">
          <Warning size={15} weight="duotone" aria-hidden="true" />
          Failed to load reorder recommendations. Check your connection and try again.
        </div>
      )}

      {/* Reorder recommendations table */}
      {tab === 'REORDER' && !reorderError && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-compact text-sm" aria-label="Reorder recommendations">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Urgency</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock Qty</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reorder At</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Daily Sales</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Days to Stockout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reorderLoading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                      <ArrowClockwise size={14} className="inline mr-1 animate-spin" aria-hidden="true" />
                      Loading reorder recommendations…
                    </td>
                  </tr>
                )}
                {!reorderLoading && (reorderData ?? []).length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                      No products need reordering at this time.
                    </td>
                  </tr>
                )}
                {!reorderLoading && (reorderData ?? []).map(rec => {
                  const pill = URGENCY_PILL[rec.urgency]
                  const daysClass =
                    rec.days_to_stockout === null           ? 'text-gray-400'
                    : rec.days_to_stockout <= 3             ? 'text-red-600 font-semibold'
                    : rec.days_to_stockout <= 7             ? 'text-amber-700 font-semibold'
                    : 'text-gray-700'
                  const rowBg =
                    rec.urgency === 'OUT_OF_STOCK' ? 'bg-red-50 hover:bg-red-100'
                    : rec.urgency === 'CRITICAL'   ? 'bg-amber-50 hover:bg-amber-100'
                    : 'hover:bg-gray-50'
                  return (
                    <tr key={rec.product_id} className={rowBg}>
                      <td className="px-4 py-3">
                        <StatusPill label={pill.label} variant={pill.variant} />
                      </td>
                      <td className="px-4 py-3 font-medium text-sm text-gray-800 max-w-[200px] truncate">
                        {rec.product_name}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {rec.category ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-gray-800 tabular-nums">
                        {rec.stock_qty}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-gray-500 tabular-nums">
                        {rec.reorder_level}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-gray-600 tabular-nums">
                        {rec.avg_daily_sales > 0
                          ? `${rec.avg_daily_sales.toFixed(1)} /day`
                          : '—'
                        }
                      </td>
                      <td className={`px-4 py-3 text-right font-mono text-xs tabular-nums ${daysClass}`}>
                        {rec.days_to_stockout !== null
                          ? `${Math.round(rec.days_to_stockout)} days`
                          : '—'
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products table — all tabs except REORDER */}
      {tab !== 'REORDER' && !isError && (
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
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Batch</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-sm text-gray-400">Loading inventory…</td>
                  </tr>
                )}
                {!isLoading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-sm text-gray-400">No products match your filter.</td>
                  </tr>
                )}
                {!isLoading && filtered.map(p => {
                  const rowBg =
                    p._status === 'OUT_OF_STOCK'
                      ? 'bg-red-50 hover:bg-red-100'
                      : p._status === 'LOW_STOCK'
                        ? 'bg-amber-50 hover:bg-amber-100'
                        : p._expiryStatus === 'EXPIRED'
                          ? 'bg-red-50 hover:bg-red-100'
                          : p._expiryStatus === 'EXPIRING_SOON'
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

                  const expiryClass =
                    p._expiryStatus === 'EXPIRED'       ? 'text-red-600 font-semibold'
                    : p._expiryStatus === 'EXPIRING_SOON' ? 'text-amber-700'
                    : 'text-gray-600'

                  return (
                    <tr key={p.id} className={rowBg}>
                      <td className="px-4 py-3 font-medium text-sm text-gray-800 max-w-[200px] truncate">{p.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.barcode ?? '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{p.category ?? '—'}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">{fmtCurrency(p.unit_price)}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-gray-800">{p.stock_qty}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">{fmtCurrency(p.unit_price * p.stock_qty)}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-gray-500">{p.reorder_level}</td>
                      <td className={`px-4 py-3 text-xs tabular-nums ${expiryClass}`}>
                        {fmtDate(p.expiry_date)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.batch_number ?? '—'}</td>
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
                    <td colSpan={4} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}
      <PrintPreviewModal
        open={printPreviewOpen}
        reportTitle="Inventory Report"
        description={`${filtered.length} product${filtered.length !== 1 ? 's' : ''} · ${TAB_LABELS[tab]} filter`}
        onConfirm={() => { setPrintPreviewOpen(false); window.print() }}
        onCancel={() => setPrintPreviewOpen(false)}
      />
    </div>
  )
}

export default InventoryReport
