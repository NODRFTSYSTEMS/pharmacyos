import { Fragment, useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Export, MagnifyingGlass, CaretDown, CaretRight,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { todayJamaica, toJamaicaBounds, fmtJamaicaDate } from '../../lib/date'
import { PageHeader, Pill as StatusPill } from '../../components/Shell'
import type { PurchaseOrder, PurchaseOrderItem, PoStatus } from '../../types/database'

// ── Types ─────────────────────────────────────────────────────────────────────

type POWithItems = PurchaseOrder & { purchase_order_items: PurchaseOrderItem[] }
type StatusFilter = 'ALL' | PoStatus

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_FILTER_LABELS: Record<StatusFilter, string> = {
  ALL:       'All Statuses',
  DRAFT:     'Draft',
  SUBMITTED: 'Submitted',
  RECEIVED:  'Received',
  CANCELLED: 'Cancelled',
}

const STATUS_PILL: Record<PoStatus, { label: string; variant: 'green' | 'blue' | 'gray' | 'red' }> = {
  DRAFT:     { label: 'Draft',     variant: 'gray'  },
  SUBMITTED: { label: 'Submitted', variant: 'blue'  },
  RECEIVED:  { label: 'Received',  variant: 'green' },
  CANCELLED: { label: 'Cancelled', variant: 'red'   },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function defaultFrom(): string {
  const d = new Date()
  d.setDate(d.getDate() - 90)
  return d.toLocaleDateString('en-CA', { timeZone: 'America/Jamaica' })
}

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat('en-JM', {
    style: 'currency', currency: 'JMD', minimumFractionDigits: 2,
  }).format(n)
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-JM', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PurchaseOrders() {
  const today = todayJamaica()
  const [from,       setFrom]       = useState(defaultFrom())
  const [to,         setTo]         = useState(today)
  const [status,     setStatus]     = useState<StatusFilter>('ALL')
  const [search,     setSearch]     = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const bounds = toJamaicaBounds(from, to)

  const { data, isLoading, isError } = useQuery<POWithItems[]>({
    queryKey: ['purchase-orders', from, to, status],
    queryFn: async () => {
      let q = supabase
        .from('purchase_orders')
        .select('*, purchase_order_items(*)')
        .gte('created_at', bounds.gte)
        .lte('created_at', bounds.lte)
        .order('created_at', { ascending: false })
      if (status !== 'ALL') q = q.eq('status', status)
      const { data, error } = await q
      if (error) throw error
      return (data ?? []) as POWithItems[]
    },
  })

  const orders = data ?? []

  const filtered = useMemo(() => {
    if (!search) return orders
    const q = search.toLowerCase()
    return orders.filter(o =>
      o.ref_number.toLowerCase().includes(q) ||
      o.supplier_name.toLowerCase().includes(q)
    )
  }, [orders, search])

  function exportCsv() {
    const rows = [
      ['Ref Number', 'Date', 'Supplier', 'Items', 'Total Cost (JMD)', 'Status', 'Received By', 'Received At'],
      ...filtered.map(o => [
        o.ref_number,
        fmtJamaicaDate(o.created_at),
        o.supplier_name,
        String(o.purchase_order_items.length),
        o.total_cost.toFixed(2),
        o.status,
        o.received_by_name ?? '',
        o.received_at ? fmtJamaicaDate(o.received_at) : '',
      ]),
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `purchase-orders-${today}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader
        title="Purchase Orders"
        subtitle="Stock receipt history — click any row to view line items"
        breadcrumb={['Inventory', 'Purchase Orders']}
        cta={
          <button
            onClick={exportCsv}
            className="btn btn-ghost gap-1.5 text-xs"
            disabled={isLoading || filtered.length === 0}
            aria-label="Export purchase orders as CSV"
          >
            <Export size={13} />
            Export CSV
          </button>
        }
      />

      {/* Filters */}
      <div className="card p-3 mb-4 flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="po-from">From date</label>
        <input
          id="po-from"
          type="date"
          value={from}
          max={to}
          onChange={e => setFrom(e.target.value)}
          className="input text-xs w-36"
          aria-label="From date"
        />
        <span className="text-xs text-gray-400">to</span>
        <label className="sr-only" htmlFor="po-to">To date</label>
        <input
          id="po-to"
          type="date"
          value={to}
          min={from}
          max={today}
          onChange={e => setTo(e.target.value)}
          className="input text-xs w-36"
          aria-label="To date"
        />
        <label className="sr-only" htmlFor="po-status">Status</label>
        <select
          id="po-status"
          value={status}
          onChange={e => setStatus(e.target.value as StatusFilter)}
          className="input text-xs w-40"
          aria-label="Filter by order status"
        >
          {(Object.keys(STATUS_FILTER_LABELS) as StatusFilter[]).map(s => (
            <option key={s} value={s}>{STATUS_FILTER_LABELS[s]}</option>
          ))}
        </select>
        <div className="relative ml-auto">
          <MagnifyingGlass
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search ref or supplier…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-7 w-52 text-xs"
            aria-label="Search by reference number or supplier name"
          />
        </div>
        {!isLoading && (
          <span className="text-xs text-gray-400">
            {filtered.length} order{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Error state */}
      {isError && (
        <div className="card p-4 mb-4 text-sm text-red-700 bg-red-50 border border-red-200">
          Failed to load purchase orders. Check your connection and try again.
        </div>
      )}

      {/* Table */}
      {!isError && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-compact text-sm" aria-label="Purchase order history">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="w-8 px-4 py-3" aria-label="Expand row" />
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ref</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Cost</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Received By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                      Loading purchase orders…
                    </td>
                  </tr>
                )}
                {!isLoading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                      No purchase orders in this date range.
                    </td>
                  </tr>
                )}
                {!isLoading && filtered.map(o => {
                  const pill = STATUS_PILL[o.status]
                  const isExpanded = expandedId === o.id
                  return (
                    <Fragment key={o.id}>
                      {/* PO summary row */}
                      <tr
                        className={`cursor-pointer transition-colors ${
                          isExpanded ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setExpandedId(isExpanded ? null : o.id)}
                        aria-expanded={isExpanded}
                      >
                        <td className="px-4 py-3 text-gray-400">
                          {isExpanded
                            ? <CaretDown size={12} aria-hidden="true" />
                            : <CaretRight size={12} aria-hidden="true" />
                          }
                        </td>
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-700">
                          {o.ref_number}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          {fmtJamaicaDate(o.created_at)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 max-w-[220px] truncate">
                          {o.supplier_name}
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-gray-600 tabular-nums">
                          {o.purchase_order_items.length}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-gray-800">
                          {fmtCurrency(o.total_cost)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusPill label={pill.label} variant={pill.variant} />
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          {o.received_by_name ?? '—'}
                        </td>
                      </tr>

                      {/* Line items accordion */}
                      {isExpanded && (
                        <tr className="bg-blue-50">
                          <td colSpan={8} className="px-6 pb-4 pt-0">
                            <div className="rounded-lg border border-blue-200 overflow-hidden mt-2">
                              <table
                                className="w-full text-xs"
                                aria-label={`Line items for ${o.ref_number}`}
                              >
                                <thead className="bg-blue-100">
                                  <tr>
                                    <th scope="col" className="text-left px-3 py-2 font-semibold text-blue-800">Product</th>
                                    <th scope="col" className="text-right px-3 py-2 font-semibold text-blue-800">Ordered</th>
                                    <th scope="col" className="text-right px-3 py-2 font-semibold text-blue-800">Received</th>
                                    <th scope="col" className="text-right px-3 py-2 font-semibold text-blue-800">Unit Cost</th>
                                    <th scope="col" className="text-right px-3 py-2 font-semibold text-blue-800">Line Total</th>
                                    <th scope="col" className="text-left px-3 py-2 font-semibold text-blue-800">Expiry</th>
                                    <th scope="col" className="text-left px-3 py-2 font-semibold text-blue-800">Batch</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-100 bg-white">
                                  {o.purchase_order_items.length === 0 ? (
                                    <tr>
                                      <td colSpan={7} className="px-3 py-3 text-center text-gray-400">
                                        No line items recorded.
                                      </td>
                                    </tr>
                                  ) : (
                                    o.purchase_order_items.map(item => (
                                      <tr key={item.id} className="hover:bg-blue-50">
                                        <td className="px-3 py-2 font-medium text-gray-800">
                                          {item.product_name}
                                        </td>
                                        <td className="px-3 py-2 text-right font-mono text-gray-700">
                                          {item.quantity_ordered}
                                        </td>
                                        <td className="px-3 py-2 text-right font-mono text-gray-700">
                                          {item.quantity_received}
                                        </td>
                                        <td className="px-3 py-2 text-right font-mono text-gray-700">
                                          {fmtCurrency(item.unit_cost)}
                                        </td>
                                        <td className="px-3 py-2 text-right font-mono font-semibold text-gray-800">
                                          {fmtCurrency(item.line_total)}
                                        </td>
                                        <td className="px-3 py-2 text-gray-600">
                                          {fmtDate(item.expiry_date)}
                                        </td>
                                        <td className="px-3 py-2 font-mono text-gray-500">
                                          {item.batch_number ?? '—'}
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                                <tfoot className="bg-blue-100 border-t border-blue-200">
                                  <tr>
                                    <td colSpan={4} className="px-3 py-2 font-bold text-blue-800">
                                      Order Total
                                    </td>
                                    <td className="px-3 py-2 text-right font-mono font-bold text-blue-800">
                                      {fmtCurrency(o.total_cost)}
                                    </td>
                                    <td colSpan={2} />
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                            {o.notes && (
                              <p className="mt-2 text-xs text-gray-500 italic">
                                Note: {o.notes}
                              </p>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
