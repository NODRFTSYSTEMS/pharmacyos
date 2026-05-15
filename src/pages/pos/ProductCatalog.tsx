import { useState } from 'react'
import { Link } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, MagnifyingGlass, X, PencilSimple,
  Package, Warning, ArrowRight,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { PageHeader, Pill as StatusPill } from '../../components/Shell'
import type { Product } from '../../types/database'
import type { Supplier } from './RetailSuppliers'

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'OTC Medication',
  'Prescription',
  'Personal Care',
  'Vitamins & Supplements',
  'Baby & Maternal',
  'Medical Supplies',
  'Other',
] as const

type Category = (typeof CATEGORIES)[number]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtCurrency(amount: number): string {
  return new Intl.NumberFormat('en-JM', {
    style: 'currency',
    currency: 'JMD',
    minimumFractionDigits: 2,
  }).format(amount)
}

// ─── Draft type ───────────────────────────────────────────────────────────────

type ProductDraft = {
  name: string
  barcode: string
  category: Category | ''
  supplier_id: string
  unit_price: number | ''
  cost_price: number | ''
  stock_qty: number | ''
  reorder_level: number | ''
  expiry_date: string
  batch_number: string
  notes: string
  is_active: boolean
}

const BLANK: ProductDraft = {
  name: '',
  barcode: '',
  category: '',
  supplier_id: '',
  unit_price: '',
  cost_price: '',
  stock_qty: '',
  reorder_level: 5,
  expiry_date: '',
  batch_number: '',
  notes: '',
  is_active: true,
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

interface DrawerProps {
  initial: ProductDraft | null
  editingId: string | null
  onClose: () => void
}

function ProductDrawer({ initial, editingId, onClose }: DrawerProps) {
  const qc = useQueryClient()
  const [form, setForm] = useState<ProductDraft>(initial ?? { ...BLANK })
  const [errors, setErrors] = useState<Partial<Record<keyof ProductDraft, string>>>({})

  const { data: suppliers = [] } = useQuery<Pick<Supplier, 'id' | 'name'>[]>({
    queryKey: ['suppliers-slim'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('retail_suppliers')
        .select('id, name')
        .eq('active', true)
        .order('name')
      if (error) throw error
      return (data ?? []) as Pick<Supplier, 'id' | 'name'>[]
    },
    staleTime: 60_000,
  })

  function set<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
  }

  function validate(): boolean {
    const next: typeof errors = {}
    if (!form.name.trim()) next.name = 'Product name is required'
    if (form.unit_price === '' || Number(form.unit_price) < 0) {
      next.unit_price = 'Unit price must be 0 or greater'
    }
    if (form.stock_qty === '' || Number(form.stock_qty) < 0) {
      next.stock_qty = 'Stock quantity must be 0 or greater'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name:          form.name.trim(),
        barcode:       form.barcode.trim() || null,
        category:      form.category || null,
        supplier_id:   form.supplier_id || null,
        unit_price:    Number(form.unit_price),
        cost_price:    form.cost_price !== '' ? Number(form.cost_price) : null,
        stock_qty:     Number(form.stock_qty),
        reorder_level: form.reorder_level !== '' ? Number(form.reorder_level) : 5,
        expiry_date:   form.expiry_date || null,
        batch_number:  form.batch_number.trim() || null,
        notes:         form.notes.trim() || null,
        is_active:     form.is_active,
        updated_at:    new Date().toISOString(),
      }
      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('products')
          .insert([payload])
        if (error) throw error
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      onClose()
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) save.mutate()
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <button
        className="flex-1 bg-black/40"
        onClick={onClose}
        aria-label="Close drawer"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={editingId ? 'Edit product' : 'Add product'}
        className="w-full max-w-md bg-white shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <h2 className="font-semibold text-gray-800 text-base">
            {editingId ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="btn btn-ghost h-8 w-8 p-0" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Form body */}
        <form id="product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Product Name */}
          <div>
            <label htmlFor="p-name" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Product Name *
            </label>
            <input
              id="p-name"
              type="text"
              autoFocus
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Paracetamol 500mg Tabs x 24"
              className={`input ${errors.name ? 'border-red-400 focus:border-red-400' : ''}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Barcode */}
          <div>
            <label htmlFor="p-barcode" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Barcode
            </label>
            <input
              id="p-barcode"
              type="text"
              value={form.barcode}
              onChange={e => set('barcode', e.target.value)}
              placeholder="Scan or enter barcode"
              className="input font-mono"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="p-category" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              id="p-category"
              value={form.category}
              onChange={e => set('category', e.target.value as Category | '')}
              className="input bg-white"
            >
              <option value="">Select category…</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Supplier */}
          <div>
            <label htmlFor="p-supplier" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Supplier
            </label>
            {suppliers.length === 0 ? (
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                <span>No active suppliers.</span>
                <Link to="/pos/suppliers" className="underline font-medium">Add a supplier first →</Link>
              </div>
            ) : (
              <select
                id="p-supplier"
                value={form.supplier_id}
                onChange={e => set('supplier_id', e.target.value)}
                className="input bg-white"
              >
                <option value="">No supplier assigned</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Unit Price + Cost Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="p-unit-price" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Unit Price JMD *
              </label>
              <input
                id="p-unit-price"
                type="number"
                min={0}
                step={0.01}
                value={form.unit_price}
                onChange={e => set('unit_price', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0.00"
                className={`input ${errors.unit_price ? 'border-red-400 focus:border-red-400' : ''}`}
              />
              {errors.unit_price && <p className="text-xs text-red-500 mt-1">{errors.unit_price}</p>}
            </div>
            <div>
              <label htmlFor="p-cost-price" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Cost Price JMD
              </label>
              <input
                id="p-cost-price"
                type="number"
                min={0}
                step={0.01}
                value={form.cost_price}
                onChange={e => set('cost_price', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0.00"
                className="input"
              />
            </div>
          </div>

          {/* Stock Qty + Reorder Level */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="p-stock" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Stock Qty *
              </label>
              <input
                id="p-stock"
                type="number"
                min={0}
                step={1}
                value={form.stock_qty}
                onChange={e => set('stock_qty', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className={`input ${errors.stock_qty ? 'border-red-400 focus:border-red-400' : ''}`}
              />
              {errors.stock_qty && <p className="text-xs text-red-500 mt-1">{errors.stock_qty}</p>}
            </div>
            <div>
              <label htmlFor="p-reorder" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Reorder Level
              </label>
              <input
                id="p-reorder"
                type="number"
                min={0}
                step={1}
                value={form.reorder_level}
                onChange={e => set('reorder_level', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="5"
                className="input"
              />
            </div>
          </div>

          {/* Expiry Date + Batch/Lot Number */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="p-expiry" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Expiry Date
              </label>
              <input
                id="p-expiry"
                type="date"
                value={form.expiry_date}
                onChange={e => set('expiry_date', e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="p-batch" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Batch / Lot No.
              </label>
              <input
                id="p-batch"
                type="text"
                value={form.batch_number}
                onChange={e => set('batch_number', e.target.value)}
                placeholder="e.g. BT-2026-001"
                className="input font-mono"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="p-notes" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Notes
            </label>
            <textarea
              id="p-notes"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Storage instructions, expiry notes, supplier info…"
              rows={3}
              className="input h-auto py-2 resize-none"
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-700">Active product</p>
              <p className="text-xs text-gray-400">Inactive products are hidden from the POS terminal</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.is_active}
              onClick={() => set('is_active', !form.is_active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                form.is_active ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform motion-reduce:transition-none ${
                  form.is_active ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Server error */}
          {save.isError && (
            <div className="bg-red-50 border border-red-200 rounded px-3 py-2.5 text-sm text-red-700">
              {String((save.error as Error).message)}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={save.isPending}
            className="btn btn-primary flex-1 gap-2"
          >
            {save.isPending && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none" aria-hidden="true" />
            )}
            {editingId ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Expiry badge ─────────────────────────────────────────────────────────────

function ExpiryBadge({ date }: { date: string | null }) {
  if (!date) return <span className="text-gray-300 text-xs">—</span>
  const expiry = new Date(date)
  const today  = new Date()
  today.setHours(0, 0, 0, 0)
  const in30 = new Date(today); in30.setDate(today.getDate() + 30)
  const label = expiry.toLocaleDateString('en-JM', { day: '2-digit', month: 'short', year: 'numeric' })
  if (expiry < today)  return <span className="pill pill-red text-xs">{label}</span>
  if (expiry <= in30)  return <span className="pill pill-yellow text-xs">{label}</span>
  return <span className="text-xs text-gray-600 tabular-nums">{label}</span>
}

// ─── Stock status helpers ──────────────────────────────────────────────────────

function StockBadge({ qty, reorder }: { qty: number; reorder: number }) {
  if (qty <= 0) {
    return <StatusPill label="Out of stock" variant="red" />
  }
  if (qty <= reorder) {
    return <StatusPill label="Low stock" variant="yellow" />
  }
  return <StatusPill label="In stock" variant="green" />
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProductCatalog() {
  const [search, setSearch]           = useState('')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All')
  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [editing, setEditing]         = useState<Product | null>(null)

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true })
      if (error) throw error
      return (data ?? []) as Product[]
    },
  })

  const allProducts    = products ?? []
  const activeCount    = allProducts.filter(p => p.is_active).length
  const lowStockCount  = allProducts.filter(p => p.stock_qty <= p.reorder_level).length

  const filtered = allProducts.filter(p => {
    const matchesSearch = !search || (() => {
      const q = search.toLowerCase()
      return (
        p.name.toLowerCase().includes(q) ||
        (p.barcode ?? '').toLowerCase().includes(q)
      )
    })()
    const matchesCategory =
      categoryFilter === 'All' || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  function openAdd() {
    setEditing(null)
    setDrawerOpen(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setDrawerOpen(true)
  }

  function closeDrawer() {
    setDrawerOpen(false)
    setEditing(null)
  }

  const categoryTabs: Array<Category | 'All'> = ['All', ...CATEGORIES]

  return (
    <div>
      <PageHeader
        title="Product Catalog"
        subtitle="Manage retail inventory and pricing"
        breadcrumb={['Retail POS', 'Products']}
        cta={
          <div className="flex items-center gap-2">
            <Link to="/pos/suppliers" className="btn btn-ghost gap-1.5 text-sm">
              Manage Suppliers
              <ArrowRight size={13} />
            </Link>
            <button onClick={openAdd} className="btn btn-primary gap-2">
              <Plus size={14} weight="bold" />
              Add Product
            </button>
          </div>
        }
      />

      {/* Summary strip */}
      <div className="flex items-center gap-6 mb-5 text-sm text-gray-500">
        <span><strong className="text-gray-800">{allProducts.length}</strong> total products</span>
        <span className="text-emerald-600"><strong>{activeCount}</strong> active</span>
        {lowStockCount > 0 && (
          <span className="text-amber-600 flex items-center gap-1">
            <Warning size={13} aria-hidden="true" />
            <strong>{lowStockCount}</strong> low / out of stock
          </span>
        )}
      </div>

      {/* Search */}
      <div className="card p-3 mb-4 flex items-center gap-3 max-w-sm">
        <MagnifyingGlass size={14} className="text-gray-400 shrink-0" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search name or barcode…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input border-0 p-0 focus:ring-0 shadow-none text-sm flex-1"
          aria-label="Search products"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-gray-400 hover:text-gray-600 shrink-0"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category filter tabs */}
      <div
        className="flex flex-wrap gap-1.5 mb-4"
        role="tablist"
        aria-label="Filter by category"
      >
        {categoryTabs.map(cat => (
          <button
            key={cat}
            role="tab"
            aria-selected={categoryFilter === cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              categoryFilter === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error state */}
      {isError && (
        <div className="card p-4 text-sm text-red-600 bg-red-50 mb-4">
          Failed to load products. Check your connection and try again.
        </div>
      )}

      {/* Table */}
      {!isError && (
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="py-10 text-center text-sm text-gray-400">Loading products…</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Package size={36} className="text-gray-200 mx-auto mb-3" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-500">
                {search || categoryFilter !== 'All'
                  ? 'No products match your search'
                  : 'No products added yet'}
              </p>
              {!search && categoryFilter === 'All' && (
                <button onClick={openAdd} className="btn btn-primary gap-2 mt-4">
                  <Plus size={14} weight="bold" />
                  Add your first product
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-compact text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Barcode
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Stock Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Expiry
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800 text-sm">{p.name}</p>
                        {p.notes && (
                          <p className="text-xs text-gray-400 truncate max-w-52">{p.notes}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">
                        {p.barcode ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {p.category ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-800 tabular-nums">
                        {fmtCurrency(p.unit_price)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm tabular-nums text-gray-700">
                        {p.stock_qty}
                      </td>
                      <td className="px-4 py-3">
                        <StockBadge qty={p.stock_qty} reorder={p.reorder_level} />
                      </td>
                      <td className="px-4 py-3">
                        <ExpiryBadge date={p.expiry_date} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill
                          label={p.is_active ? 'Active' : 'Inactive'}
                          variant={p.is_active ? 'green' : 'gray'}
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openEdit(p)}
                          className="btn btn-ghost h-7 w-7 p-0"
                          aria-label={`Edit ${p.name}`}
                          title="Edit"
                        >
                          <PencilSimple size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit drawer */}
      {drawerOpen && (
        <ProductDrawer
          initial={editing ? {
            name:          editing.name,
            barcode:       editing.barcode ?? '',
            category:      (editing.category as Category | '') ?? '',
            supplier_id:   editing.supplier_id ?? '',
            unit_price:    editing.unit_price,
            cost_price:    editing.cost_price ?? '',
            stock_qty:     editing.stock_qty,
            reorder_level: editing.reorder_level,
            expiry_date:   editing.expiry_date ?? '',
            batch_number:  editing.batch_number ?? '',
            notes:         editing.notes ?? '',
            is_active:     editing.is_active,
          } : null}
          editingId={editing?.id ?? null}
          onClose={closeDrawer}
        />
      )}
    </div>
  )
}
