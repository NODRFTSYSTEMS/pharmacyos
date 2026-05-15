import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Export, ArrowUp, ArrowDown, MagnifyingGlass, ClockCounterClockwise } from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { todayJamaica, toJamaicaBounds } from '../../lib/date'
import { PageHeader } from '../../components/Shell'
import type { StockMovementType } from '../../types/database'

// ── Types ─────────────────────────────────────────────────────────────────────

interface MovementRow {
  id: string
  product_id: string
  movement_type: StockMovementType
  quantity_delta: number
  quantity_after: number
  actor_name: string | null
  reference_type: string | null
  notes: string | null
  created_at: string
  product: { name: string; barcode: string | null } | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-JM', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function defaultRange() {
  const today = todayJamaica()
  const from  = new Date(today)
  from.setDate(from.getDate() - 29)
  return { from: from.toISOString().slice(0, 10), to: today }
}

const TYPE_LABELS: Record<StockMovementType, string> = {
  SALE:      'Sale',
  RECEIVE:   'Receive',
  ADJUST:    'Adjustment',
  RETURN:    'Return',
  WRITE_OFF: 'Write-off',
}

const TYPE_PILL: Record<StockMovementType, string> = {
  SALE:      'pill pill-blue',
  RECEIVE:   'pill pill-green',
  ADJUST:    'pill pill-yellow',
  RETURN:    'pill pill-purple',
  WRITE_OFF: 'pill pill-red',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function StockMovements() {
  const [range, setRange]    = useState(defaultRange)
  const [typeFilter, setTypeFilter] = useState<StockMovementType | 'ALL'>('ALL')
  const [search, setSearch]  = useState('')

  const { data, isLoading, isError } = useQuery<MovementRow[]>({
    queryKey: ['stock-movements', range],
    queryFn: async () => {
      const { gte: fromDt, lte: toDt } = toJamaicaBounds(range.from, range.to)
      const { data, error } = await supabase
        .from('stock_movements')
        .select('*, product:products(name, barcode)')
        .gte('created_at', fromDt)
        .lte('created_at', toDt)
        .order('created_at', { ascending: false })
        .limit(500)
      if (error) throw error
      return (data ?? []) as unknown as MovementRow[]
    },
  })

  const movements = data ?? []

  const filtered = useMemo(() => {
    return movements.filter(m => {
      if (typeFilter !== 'ALL' && m.movement_type !== typeFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          (m.product?.name ?? '').toLowerCase().includes(q) ||
          (m.actor_name ?? '').toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [movements, typeFilter, search])

  function exportCsv() {
    const rows = [
      ['Date', 'Product', 'Barcode', 'Type', 'Qty Change', 'Qty After', 'Staff', 'Source'],
      ...filtered.map(m => [
        fmtDateTime(m.created_at),
        m.product?.name ?? '',
        m.product?.barcode ?? '',
        TYPE_LABELS[m.movement_type] ?? m.movement_type,
        String(m.quantity_delta),
        String(m.quantity_after),
        m.actor_name ?? '',
        m.reference_type ?? '',
      ]),
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a   = document.createElement('a')
    a.href     = url
    a.download = `stock-movements-${range.from}-to-${range.to}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader
        title="Stock Movements"
        subtitle="Audit trail of all inventory changes"
        breadcrumb={['Inventory', 'Stock Movements']}
        cta={
          <button
            onClick={exportCsv}
            disabled={isLoading || filtered.length === 0}
            className="btn btn-ghost gap-1.5 text-xs"
            aria-label="Export stock movements as CSV"
          >
            <Export size={13} aria-hidden="true" />
            Export CSV
          </button>
        }
      />

      {/* Filters */}
      <div className="card p-3 mb-4 flex flex-wrap items-center gap-3">
        {/* Date range */}
        <div className="flex items-center gap-2">
          <label htmlFor="sm-from" className="text-xs text-gray-500 shrink-0">From</label>
          <input
            id="sm-from"
            type="date"
            value={range.from}
            onChange={e => setRange(r => ({ ...r, from: e.target.value }))}
            className="input text-xs h-8 py-0 w-36"
          />
          <span className="text-xs text-gray-400">to</span>
          <input
            id="sm-to"
            type="date"
            value={range.to}
            onChange={e => setRange(r => ({ ...r, to: e.target.value }))}
            className="input text-xs h-8 py-0 w-36"
          />
        </div>

        {/* Type filter */}
        <div className="flex gap-1" role="tablist" aria-label="Movement type filter">
          {(['ALL', 'SALE', 'RECEIVE', 'ADJUST', 'RETURN', 'WRITE_OFF'] as const).map(t => (
            <button
              key={t}
              role="tab"
              aria-selected={typeFilter === t}
              onClick={() => setTypeFilter(t)}
              className={`btn btn-ghost text-xs h-8 px-3 ${typeFilter === t ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
            >
              {t === 'ALL' ? 'All' : TYPE_LABELS[t as StockMovementType]}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative ml-auto">
          <MagnifyingGlass size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search product or actor…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-7 w-48 text-xs"
            aria-label="Search movements"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Stock movements">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty Change</th>
                <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty After</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                    <ClockCounterClockwise size={24} className="mx-auto mb-2 text-gray-200 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                    Loading movements…
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-sm text-red-600">
                    Failed to load movements. Check your connection.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                    No stock changes recorded in this period.
                  </td>
                </tr>
              )}
              {!isLoading && filtered.map(m => {
                const isOut = m.quantity_delta < 0
                return (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500 tabular-nums whitespace-nowrap">
                      {fmtDateTime(m.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-800">{m.product?.name ?? '—'}</p>
                      {m.product?.barcode && (
                        <p className="text-xs text-gray-400 font-mono">{m.product.barcode}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={TYPE_PILL[m.movement_type] ?? 'pill pill-gray'}>
                        {TYPE_LABELS[m.movement_type] ?? m.movement_type}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-mono text-sm font-semibold tabular-nums ${isOut ? 'text-red-600' : 'text-emerald-600'}`}>
                      <span className="inline-flex items-center gap-0.5">
                        {isOut
                          ? <ArrowDown size={12} aria-hidden="true" />
                          : <ArrowUp size={12} aria-hidden="true" />}
                        {Math.abs(m.quantity_delta)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-gray-700 tabular-nums">
                      {m.quantity_after}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {m.actor_name ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {m.reference_type ?? '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {!isLoading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
            {filtered.length} movement{filtered.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}
