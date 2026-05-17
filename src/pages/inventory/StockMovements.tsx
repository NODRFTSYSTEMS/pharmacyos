import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Export, ArrowUp, ArrowDown, MagnifyingGlass, ClockCounterClockwise, Plus, X } from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { todayJamaica, toJamaicaBounds } from '../../lib/date'
import { ProductImageThumb } from '../../components/MedicationVisualReference'
import { PageHeader } from '../../components/Shell'
import { useCurrentUser } from '../../hooks/useCurrentUser'
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
  product: { name: string; barcode: string | null; image_url: string | null; image_alt: string | null } | null
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

// ── Simple product row type for adjustment selector ────────────────────────

interface AdjProductRow {
  id: string
  name: string
  barcode: string | null
  stock_qty: number
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function StockMovements() {
  const qc = useQueryClient()
  const { data: currentUser } = useCurrentUser()

  const [range, setRange]    = useState(defaultRange)
  const [typeFilter, setTypeFilter] = useState<StockMovementType | 'ALL'>('ALL')
  const [search, setSearch]  = useState('')

  // ── Adjustment drawer state ──────────────────────────────────────────────
  const [showAdjust,    setShowAdjust]    = useState(false)
  const [adjSearch,     setAdjSearch]     = useState('')
  const [adjProductId,  setAdjProductId]  = useState('')
  const [adjProductName, setAdjProductName] = useState('')
  const [adjType,       setAdjType]       = useState<'ADJUST' | 'RETURN' | 'WRITE_OFF'>('ADJUST')
  const [adjQty,        setAdjQty]        = useState('')
  const [adjNotes,      setAdjNotes]      = useState('')

  // Product search for the adjustment form
  const { data: adjProducts = [] } = useQuery<AdjProductRow[]>({
    queryKey: ['adj-product-search', adjSearch],
    queryFn: async () => {
      let q = supabase
        .from('products')
        .select('id, name, barcode, stock_qty')
        .eq('is_active', true)
      if (adjSearch.trim()) {
        q = q.ilike('name', `%${adjSearch.trim()}%`)
      }
      const { data } = await q.order('name').limit(20)
      return (data ?? []) as AdjProductRow[]
    },
    enabled: showAdjust,
  })

  const adjustMutation = useMutation({
    mutationFn: async () => {
      const delta = parseInt(adjQty, 10)
      if (!adjProductId) throw new Error('Select a product before submitting.')
      if (isNaN(delta) || delta === 0) throw new Error('Quantity must be a non-zero integer.')
      const { error } = await supabase.rpc('adjust_product_stock', {
        p_product_id:    adjProductId,
        p_delta:         delta,
        p_movement_type: adjType,
        p_actor_id:      currentUser?.id ?? null,
        p_actor_name:    currentUser?.name ?? null,
        p_notes:         adjNotes.trim() || null,
      })
      if (error) throw error
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['stock-movements'] })
      void qc.invalidateQueries({ queryKey: ['pos-products'] })
      setShowAdjust(false)
      setAdjSearch('')
      setAdjProductId('')
      setAdjProductName('')
      setAdjType('ADJUST')
      setAdjQty('')
      setAdjNotes('')
    },
  })

  function resetAndCloseDrawer() {
    setShowAdjust(false)
    setAdjSearch('')
    setAdjProductId('')
    setAdjProductName('')
    setAdjType('ADJUST')
    setAdjQty('')
    setAdjNotes('')
    adjustMutation.reset()
  }

  const { data, isLoading, isError } = useQuery<MovementRow[]>({
    queryKey: ['stock-movements', range],
    queryFn: async () => {
      const { gte: fromDt, lte: toDt } = toJamaicaBounds(range.from, range.to)
      const { data, error } = await supabase
        .from('stock_movements')
        .select('*, product:products(name, barcode, image_url, image_alt)')
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
        showSession
        cta={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdjust(true)}
              className="btn btn-primary gap-1.5 text-xs"
              aria-label="Open new stock adjustment form"
            >
              <Plus size={13} aria-hidden="true" />
              New Adjustment
            </button>
            <button
              onClick={exportCsv}
              disabled={isLoading || filtered.length === 0}
              className="btn btn-ghost gap-1.5 text-xs"
              aria-label="Export stock movements as CSV"
            >
              <Export size={13} aria-hidden="true" />
              Export CSV
            </button>
          </div>
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
                      <div className="flex items-center gap-3">
                        <ProductImageThumb
                          productName={m.product?.name ?? 'Unknown product'}
                          imageUrl={m.product?.image_url}
                          imageAlt={m.product?.image_alt}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800">{m.product?.name ?? '—'}</p>
                          {m.product?.barcode && (
                            <p className="text-xs text-gray-400 font-mono">{m.product.barcode}</p>
                          )}
                        </div>
                      </div>
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

      {/* ── Manual stock adjustment drawer ─────────────────────────────────── */}
      {showAdjust && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            aria-hidden="true"
            onClick={resetAndCloseDrawer}
          />

          {/* Side panel */}
          <div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="New stock adjustment"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">New Stock Adjustment</h2>
              <button
                onClick={resetAndCloseDrawer}
                className="btn btn-ghost p-1.5"
                aria-label="Close adjustment panel"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

              {/* Product selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Product
                </label>
                {adjProductId ? (
                  <div className="flex items-center justify-between rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                    <span className="font-medium text-gray-800">{adjProductName}</span>
                    <button
                      type="button"
                      onClick={() => { setAdjProductId(''); setAdjProductName('') }}
                      className="text-gray-400 hover:text-gray-600 ml-2 text-xs"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative mb-2">
                      <MagnifyingGlass size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                      <input
                        type="text"
                        placeholder="Search by product name…"
                        value={adjSearch}
                        onChange={e => setAdjSearch(e.target.value)}
                        className="input pl-8 text-sm w-full"
                        autoFocus
                      />
                    </div>
                    <div className="border border-gray-200 rounded overflow-hidden max-h-48 overflow-y-auto">
                      {adjProducts.length === 0 && (
                        <p className="px-3 py-4 text-xs text-center text-gray-400">
                          {adjSearch ? 'No products match your search.' : 'Start typing to search products.'}
                        </p>
                      )}
                      {adjProducts.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 border-b border-gray-100 last:border-0 flex items-center justify-between"
                          onClick={() => { setAdjProductId(p.id); setAdjProductName(p.name) }}
                        >
                          <span className="font-medium text-gray-800 truncate">{p.name}</span>
                          <span className="text-xs text-gray-400 ml-2 shrink-0">stock: {p.stock_qty}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Movement type */}
              <div>
                <label htmlFor="adj-type" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Adjustment Type
                </label>
                <select
                  id="adj-type"
                  value={adjType}
                  onChange={e => setAdjType(e.target.value as 'ADJUST' | 'RETURN' | 'WRITE_OFF')}
                  className="input w-full"
                >
                  <option value="ADJUST">Adjustment — manual stock correction</option>
                  <option value="RETURN">Return — supplier or customer return</option>
                  <option value="WRITE_OFF">Write-off — expired or damaged stock</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="adj-qty" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Quantity Change
                </label>
                <input
                  id="adj-qty"
                  type="number"
                  step="1"
                  value={adjQty}
                  onChange={e => setAdjQty(e.target.value)}
                  className="input w-full"
                  placeholder="e.g. 10 to add, -5 to remove"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Positive = add stock. Negative = remove stock. Stock will not go below 0.
                </p>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="adj-notes" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Reason / Notes
                </label>
                <textarea
                  id="adj-notes"
                  value={adjNotes}
                  onChange={e => setAdjNotes(e.target.value)}
                  className="input w-full resize-none"
                  rows={3}
                  placeholder="Describe the reason for this adjustment…"
                />
              </div>

              {/* Error state */}
              {adjustMutation.isError && (
                <div role="alert" className="bg-red-50 border border-red-200 rounded px-3 py-2.5 text-sm text-red-700">
                  {(adjustMutation.error as Error)?.message ?? 'Adjustment failed. Please try again.'}
                </div>
              )}

              {/* Success state */}
              {adjustMutation.isSuccess && (
                <div role="status" className="bg-emerald-50 border border-emerald-200 rounded px-3 py-2.5 text-sm text-emerald-700">
                  Adjustment recorded successfully.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-200 flex gap-3">
              <button
                type="button"
                className="btn btn-ghost flex-1"
                onClick={resetAndCloseDrawer}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary flex-1"
                disabled={!adjProductId || !adjQty || adjustMutation.isPending}
                onClick={() => adjustMutation.mutate()}
              >
                {adjustMutation.isPending
                  ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  : 'Record Adjustment'
                }
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
