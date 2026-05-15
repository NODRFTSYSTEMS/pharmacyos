import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash, Package, CheckCircle } from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { PageHeader } from '../../components/Shell'
import type { Product, RetailSupplier } from '../../types/database'

// ── Types ─────────────────────────────────────────────────────────────────────

interface LineItem {
  product_id: string
  product_name: string
  quantity_ordered: number | ''
  unit_cost: number | ''
  expiry_date: string
  batch_number: string
}

const BLANK_LINE: LineItem = {
  product_id: '',
  product_name: '',
  quantity_ordered: '',
  unit_cost: '',
  expiry_date: '',
  batch_number: '',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ReceiveStock() {
  const nav = useNavigate()
  const qc  = useQueryClient()
  const { data: user } = useCurrentUser()

  const [supplierId, setSupplierId]   = useState('')
  const [supplierName, setSupplierName] = useState('')
  const [notes, setNotes]             = useState('')
  const [lines, setLines]             = useState<LineItem[]>([{ ...BLANK_LINE }])
  const [success, setSuccess]         = useState(false)
  const [formError, setFormError]     = useState<string | null>(null)

  // ── Queries ─────────────────────────────────────────────────────────────────

  const { data: suppliers = [] } = useQuery<Pick<RetailSupplier, 'id' | 'name'>[]>({
    queryKey: ['suppliers-slim'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('retail_suppliers')
        .select('id, name')
        .eq('active', true)
        .order('name')
      if (error) throw error
      return (data ?? []) as Pick<RetailSupplier, 'id' | 'name'>[]
    },
    staleTime: 60_000,
  })

  const { data: products = [] } = useQuery<Pick<Product, 'id' | 'name' | 'barcode'>[]>({
    queryKey: ['products-slim'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, barcode')
        .eq('is_active', true)
        .order('name')
      if (error) throw error
      return (data ?? []) as Pick<Product, 'id' | 'name' | 'barcode'>[]
    },
    staleTime: 60_000,
  })

  // ── Line item helpers ────────────────────────────────────────────────────────

  function updateLine<K extends keyof LineItem>(idx: number, key: K, value: LineItem[K]) {
    setLines(prev => prev.map((l, i) => i === idx ? { ...l, [key]: value } : l))
  }

  function handleProductSelect(idx: number, productId: string) {
    const p = products.find(x => x.id === productId)
    setLines(prev => prev.map((l, i) =>
      i === idx ? { ...l, product_id: productId, product_name: p?.name ?? '' } : l
    ))
  }

  function addLine() { setLines(prev => [...prev, { ...BLANK_LINE }]) }

  function removeLine(idx: number) {
    setLines(prev => prev.filter((_, i) => i !== idx))
  }

  // ── Mutation ─────────────────────────────────────────────────────────────────

  const submit = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No authenticated user')

      const validLines = lines.filter(l => l.product_id && Number(l.quantity_ordered) > 0)
      if (validLines.length === 0) throw new Error('Add at least one product line with quantity > 0')

      const resolvedSupplierName =
        supplierId ? (suppliers.find(s => s.id === supplierId)?.name ?? 'Unknown Supplier') : supplierName.trim() || 'Direct Purchase'

      // 1. Create purchase order
      const { data: po, error: poErr } = await supabase
        .from('purchase_orders')
        .insert({
          supplier_id:     supplierId || null,
          supplier_name:   resolvedSupplierName,
          status:          'DRAFT',
          total_cost:      validLines.reduce((s, l) => s + (Number(l.unit_cost) || 0) * Number(l.quantity_ordered), 0),
          notes:           notes.trim() || null,
          created_by:      user.id,
          created_by_name: user.name,
        })
        .select('id')
        .single()
      if (poErr) throw poErr

      // 2. Insert line items
      const items = validLines.map(l => ({
        purchase_order_id: po.id,
        product_id:        l.product_id,
        product_name:      l.product_name,
        quantity_ordered:  Number(l.quantity_ordered),
        quantity_received: 0,
        unit_cost:         Number(l.unit_cost) || 0,
        line_total:        (Number(l.unit_cost) || 0) * Number(l.quantity_ordered),
        expiry_date:       l.expiry_date || null,
        batch_number:      l.batch_number.trim() || null,
      }))
      const { error: itemsErr } = await supabase.from('purchase_order_items').insert(items)
      if (itemsErr) throw itemsErr

      // 3. Mark received — updates stock_qty, writes stock_movements rows
      const { error: rpcErr } = await supabase.rpc('receive_stock_items', {
        p_po_id:      po.id,
        p_actor_id:   user.id,
        p_actor_name: user.name,
      })
      if (rpcErr) throw rpcErr
    },
    onSuccess: () => {
      setSuccess(true)
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-slim'] })
      qc.invalidateQueries({ queryKey: ['report-inventory'] })
      qc.invalidateQueries({ queryKey: ['stock-movements'] })
    },
    onError: (err: Error) => setFormError(err.message),
  })

  // ── Success state ────────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center">
        <CheckCircle size={48} weight="duotone" className="text-emerald-500 mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Stock received successfully</h2>
        <p className="text-sm text-gray-500 mb-6">Inventory levels have been updated and movements recorded.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => nav('/inventory/stock-movements')} className="btn btn-ghost">
            View Movements
          </button>
          <button onClick={() => { setSuccess(false); setLines([{ ...BLANK_LINE }]); setSupplierId(''); setNotes('') }} className="btn btn-primary">
            Receive Another
          </button>
        </div>
      </div>
    )
  }

  // ── Form ─────────────────────────────────────────────────────────────────────

  const totalCost = lines.reduce(
    (s, l) => s + (Number(l.unit_cost) || 0) * (Number(l.quantity_ordered) || 0), 0,
  )

  return (
    <div>
      <PageHeader
        title="Receive Stock"
        subtitle="Record incoming inventory from a supplier"
        breadcrumb={['Inventory', 'Receive Stock']}
      />

      <div className="max-w-3xl space-y-6">

        {/* Supplier */}
        <div className="card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Supplier Details</h3>

          <div>
            <label htmlFor="rs-supplier" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Supplier
            </label>
            <select
              id="rs-supplier"
              value={supplierId}
              onChange={e => {
                setSupplierId(e.target.value)
                setSupplierName('')
              }}
              className="input bg-white"
            >
              <option value="">Select supplier…</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              <option value="__other__">Other / Direct Purchase</option>
            </select>
          </div>

          {supplierId === '__other__' && (
            <div>
              <label htmlFor="rs-supplier-name" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Supplier Name
              </label>
              <input
                id="rs-supplier-name"
                type="text"
                value={supplierName}
                onChange={e => setSupplierName(e.target.value)}
                placeholder="Enter supplier name"
                className="input"
              />
            </div>
          )}

          <div>
            <label htmlFor="rs-notes" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Notes
            </label>
            <textarea
              id="rs-notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Invoice number, delivery reference…"
              rows={2}
              className="input h-auto py-2 resize-none"
            />
          </div>
        </div>

        {/* Line items */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Package size={15} weight="duotone" className="text-blue-500" aria-hidden="true" />
              Items Received
            </h3>
            <button onClick={addLine} className="btn btn-ghost gap-1.5 text-xs h-8">
              <Plus size={13} weight="bold" aria-hidden="true" />
              Add Item
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {lines.map((line, idx) => (
              <div key={idx} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Item {idx + 1}</p>
                  {lines.length > 1 && (
                    <button
                      onClick={() => removeLine(idx)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash size={14} aria-hidden="true" />
                    </button>
                  )}
                </div>

                <div>
                  <label htmlFor={`rs-product-${idx}`} className="block text-xs font-medium text-gray-500 mb-1">
                    Product *
                  </label>
                  <select
                    id={`rs-product-${idx}`}
                    value={line.product_id}
                    onChange={e => handleProductSelect(idx, e.target.value)}
                    className="input bg-white"
                  >
                    <option value="">Select product…</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`rs-qty-${idx}`} className="block text-xs font-medium text-gray-500 mb-1">
                      Qty Received *
                    </label>
                    <input
                      id={`rs-qty-${idx}`}
                      type="number"
                      min={1}
                      step={1}
                      value={line.quantity_ordered}
                      onChange={e => updateLine(idx, 'quantity_ordered', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor={`rs-cost-${idx}`} className="block text-xs font-medium text-gray-500 mb-1">
                      Unit Cost JMD
                    </label>
                    <input
                      id={`rs-cost-${idx}`}
                      type="number"
                      min={0}
                      step={0.01}
                      value={line.unit_cost}
                      onChange={e => updateLine(idx, 'unit_cost', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0.00"
                      className="input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`rs-expiry-${idx}`} className="block text-xs font-medium text-gray-500 mb-1">
                      Expiry Date
                    </label>
                    <input
                      id={`rs-expiry-${idx}`}
                      type="date"
                      value={line.expiry_date}
                      onChange={e => updateLine(idx, 'expiry_date', e.target.value)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor={`rs-batch-${idx}`} className="block text-xs font-medium text-gray-500 mb-1">
                      Batch / Lot No.
                    </label>
                    <input
                      id={`rs-batch-${idx}`}
                      type="text"
                      value={line.batch_number}
                      onChange={e => updateLine(idx, 'batch_number', e.target.value)}
                      placeholder="e.g. BT-2026-001"
                      className="input font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total row */}
          {lines.some(l => Number(l.unit_cost) > 0) && (
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-200 bg-gray-50">
              <span className="text-xs text-gray-500">Total Cost:</span>
              <span className="text-sm font-bold text-gray-800">
                {new Intl.NumberFormat('en-JM', { style: 'currency', currency: 'JMD' }).format(totalCost)}
              </span>
            </div>
          )}
        </div>

        {/* Error */}
        {formError && (
          <div className="card bg-red-50 border-red-200 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button type="button" onClick={() => nav(-1)} className="btn btn-ghost">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { setFormError(null); submit.mutate() }}
            disabled={submit.isPending}
            className="btn btn-primary gap-2"
          >
            {submit.isPending && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none" aria-hidden="true" />
            )}
            Confirm Receipt
          </button>
        </div>
      </div>
    </div>
  )
}
