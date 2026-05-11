import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Receipt, Plus, Minus, X, ShoppingCart,
  MagnifyingGlass, ArrowRight, User, Trash,
  Tag, Clock, PencilSimple,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProductRow {
  id: string
  name: string
  barcode: string | null
  unit_price: number
  stock_qty: number
  reorder_level: number
}

interface CartItem {
  product_id: string
  product_name: string
  barcode: string | null
  unit_price: number
  qty: number
}

type PayMethod = 'CASH' | 'CARD' | 'LYNK'

interface CashierInfo {
  id: string | null
  name: string
  role: string
}

// ── Preferences (persisted to localStorage) ────────────────────────────────

const PREFS_KEY = 'pharmacyos_pos_prefs_v1'

interface PosPrefs {
  payMethod: PayMethod
}

function loadPrefs(): PosPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (raw) return { payMethod: 'CASH', ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return { payMethod: 'CASH' }
}

function savePrefs(p: PosPrefs) {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(p)) } catch { /* ignore */ }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-JM', {
    style: 'currency', currency: 'JMD', minimumFractionDigits: 2,
  }).format(n)
}

function todayLabel() {
  return new Date().toLocaleDateString('en-JM', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

// ── CartRow ───────────────────────────────────────────────────────────────────

interface CartRowProps {
  item: CartItem
  onIncrement: (id: string) => void
  onDecrement: (id: string) => void
  onRemove: (id: string) => void
  onSetQty: (id: string, qty: number) => void
}

function CartRow({ item, onIncrement, onDecrement, onRemove, onSetQty }: CartRowProps) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{item.product_name}</p>
        <p className="text-xs text-gray-400 font-mono">{fmtCurrency(item.unit_price)} ea</p>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onDecrement(item.product_id)}
          className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-gray-300"
          aria-label={`Decrease quantity of ${item.product_name}`}
        >
          <Minus size={11} />
        </button>
        <input
          type="number"
          min={1}
          value={item.qty}
          onChange={e => {
            const v = parseInt(e.target.value, 10)
            if (!isNaN(v) && v >= 0) onSetQty(item.product_id, v)
          }}
          className="w-12 text-center font-mono text-sm border border-gray-200 rounded py-1 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
          aria-label={`Quantity for ${item.product_name}`}
        />
        <button
          type="button"
          onClick={() => onIncrement(item.product_id)}
          className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-gray-300"
          aria-label={`Increase quantity of ${item.product_name}`}
        >
          <Plus size={11} />
        </button>
      </div>

      <span className="num w-24 text-right text-sm font-semibold text-gray-800 shrink-0">
        {fmtCurrency(item.unit_price * item.qty)}
      </span>

      <button
        type="button"
        onClick={() => onRemove(item.product_id)}
        className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0"
        aria-label={`Remove ${item.product_name} from cart`}
      >
        <X size={13} />
      </button>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function PosTerminal() {
  const qc = useQueryClient()
  const searchRef = useRef<HTMLInputElement>(null)

  // Load persisted preferences once on mount
  const [prefs] = useState<PosPrefs>(loadPrefs)

  const [cart,           setCart]           = useState<CartItem[]>([])
  const [search,         setSearch]         = useState('')
  const [payMethod,      setPayMethod]      = useState<PayMethod>(prefs.payMethod)
  const [cashInput,      setCashInput]      = useState('')
  const [toast,          setToast]          = useState<{ msg: string; ok: boolean; key: number } | null>(null)
  const [showCustomAdd,  setShowCustomAdd]  = useState(false)
  const [customName,     setCustomName]     = useState('')
  const [customPrice,    setCustomPrice]    = useState('')

  // ── Cashier identity ─────────────────────────────────────────────────────

  const { data: cashier } = useQuery<CashierInfo>({
    queryKey: ['pos-cashier'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { id: null, name: 'Guest (not signed in)', role: '' }
      const { data: profile } = await supabase
        .from('staff_profiles')
        .select('full_name, role')
        .eq('email', user.email!)
        .maybeSingle()
      return {
        id:   user.id,
        name: profile?.full_name ?? user.email ?? user.id,
        role: profile?.role ?? 'CASHIER',
      }
    },
    staleTime: 300_000,
  })

  // ── GCT rate from pharmacy_settings ─────────────────────────────────────

  const { data: gctRatePct = 15 } = useQuery<number>({
    queryKey: ['setting-gct-rate'],
    queryFn: async () => {
      const { data } = await supabase
        .from('pharmacy_settings')
        .select('value')
        .eq('key', 'gct_rate')
        .maybeSingle()
      return data ? parseFloat(data.value) : 15
    },
    staleTime: 300_000,
  })

  // ── Product search / browse ──────────────────────────────────────────────
  // Shows ALL active products by default; filtered by search when a query is entered.

  const { data: products = [], isFetching: searching } = useQuery<ProductRow[]>({
    queryKey: ['pos-products', search],
    queryFn: async () => {
      let q = supabase
        .from('products')
        .select('id, name, barcode, unit_price, stock_qty, reorder_level')
        .eq('is_active', true)
        .order('name')
        .limit(80)
      if (search.trim()) {
        q = q.or(`name.ilike.%${search.trim()}%,barcode.ilike.%${search.trim()}%`)
      }
      const { data, error } = await q
      if (error) throw error
      return (data ?? []) as ProductRow[]
    },
    staleTime: 15_000,
  })

  // ── Cart state operations ────────────────────────────────────────────────

  function addToCart(p: ProductRow) {
    if (p.stock_qty <= 0) return
    setCart(prev => {
      const idx = prev.findIndex(x => x.product_id === p.id)
      if (idx >= 0) {
        // Item already in cart — increment qty
        return prev.map((x, i) => i === idx ? { ...x, qty: x.qty + 1 } : x)
      }
      // New item
      return [...prev, {
        product_id:   p.id,
        product_name: p.name,
        barcode:      p.barcode,
        unit_price:   p.unit_price,
        qty:          1,
      }]
    })
  }

  function incrementItem(id: string) {
    setCart(prev => prev.map(x => x.product_id === id ? { ...x, qty: x.qty + 1 } : x))
  }

  function decrementItem(id: string) {
    setCart(prev =>
      prev.flatMap(x =>
        x.product_id !== id ? [x] : x.qty > 1 ? [{ ...x, qty: x.qty - 1 }] : []
      )
    )
  }

  function setItemQty(id: string, qty: number) {
    if (qty <= 0) {
      setCart(prev => prev.filter(x => x.product_id !== id))
    } else {
      setCart(prev => prev.map(x => x.product_id === id ? { ...x, qty } : x))
    }
  }

  function removeItem(id: string) {
    setCart(prev => prev.filter(x => x.product_id !== id))
  }

  function clearCart() {
    setCart([])
    setCashInput('')
  }

  function addCustomItem() {
    const name  = customName.trim()
    const price = parseFloat(customPrice)
    if (!name || isNaN(price) || price <= 0) return
    setCart(prev => [...prev, {
      product_id:   `custom-${Date.now()}`,
      product_name: name,
      barcode:      null,
      unit_price:   price,
      qty:          1,
    }])
    setCustomName('')
    setCustomPrice('')
    setShowCustomAdd(false)
  }

  // ── Payment method preference ────────────────────────────────────────────

  function selectPayMethod(m: PayMethod) {
    setPayMethod(m)
    savePrefs({ ...prefs, payMethod: m })
  }

  // ── Totals ───────────────────────────────────────────────────────────────

  const subtotal      = cart.reduce((s, i) => s + i.unit_price * i.qty, 0)
  const gctRate       = gctRatePct / 100
  const tax           = subtotal * gctRate
  const total         = subtotal + tax
  const totalQty      = cart.reduce((s, i) => s + i.qty, 0)
  const cashTendered  = parseFloat(cashInput) || 0
  const changeDue     = cashTendered - total
  const canSubmit     = cart.length > 0 && (payMethod !== 'CASH' || cashTendered >= total)

  // ── Process sale mutation ────────────────────────────────────────────────

  const processSale = useMutation({
    mutationFn: async () => {
      // Insert transaction header
      const { data: txn, error: e1 } = await supabase
        .from('retail_transactions')
        .insert({
          transaction_type:        'RETAIL',
          payment_method:          payMethod,
          cashier_id:              cashier?.id ?? null,
          subtotal,
          tax,
          discount:                0,
          total,
          cash_tendered:           payMethod === 'CASH' ? cashTendered : null,
          change_given:            payMethod === 'CASH' ? Math.max(0, changeDue) : null,
          loyalty_points_earned:   0,
          loyalty_points_redeemed: 0,
          voided:                  false,
        })
        .select('id')
        .single()

      if (e1 || !txn) throw e1 ?? new Error('Transaction insert returned no data')

      // Insert line items
      const { error: e2 } = await supabase
        .from('retail_transaction_items')
        .insert(
          cart.map(i => ({
            transaction_id: txn.id,
            product_id:     i.product_id,
            product_name:   i.product_name,
            barcode:        i.barcode,
            quantity:       i.qty,
            unit_price:     i.unit_price,
            line_total:     i.unit_price * i.qty,
          }))
        )

      if (e2) throw e2

      // Atomically decrement stock for each cart line
      for (const item of cart) {
        const { error: e3 } = await supabase.rpc('decrement_product_stock', {
          p_product_id: item.product_id,
          p_qty:        item.qty,
        })
        if (e3) console.warn('Stock decrement failed for', item.product_name, e3.message)
      }

      return txn.id
    },
    onSuccess: () => {
      clearCart()
      qc.invalidateQueries({ queryKey: ['retail-txns'] })
      qc.invalidateQueries({ queryKey: ['pos-products'] })
      showToast('Sale processed successfully', true)
      searchRef.current?.focus()
    },
    onError: (e: Error) => showToast(`Sale failed: ${e.message}`, false),
  })

  // ── Toast helper ─────────────────────────────────────────────────────────

  function showToast(msg: string, ok: boolean) {
    const key = Date.now()
    setToast({ msg, ok, key })
    setTimeout(() => setToast(t => t?.key === key ? null : t), 4000)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div>

      {/* ── Cashier identity bar ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-[#111827] text-white rounded-xl mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
            <User size={15} weight="duotone" />
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">{cashier?.name ?? '…'}</p>
            {cashier?.role && (
              <p className="text-xs text-gray-400 leading-none mt-0.5">{cashier.role}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            {todayLabel()}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Session active
          </span>
        </div>
      </div>

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`mb-3 flex items-center justify-between gap-3 border rounded px-3 py-2.5 text-sm ${
            toast.ok
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <span>{toast.msg}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="shrink-0"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Two-panel layout ─────────────────────────────────────────────── */}
      <div className="flex gap-5 items-start">

        {/* LEFT — Cart + payment ────────────────────────────────────────── */}
        <div className="flex-[11] min-w-0 space-y-4">

          {/* Cart */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingCart size={16} weight="duotone" className="text-blue-500" />
              <h2 className="section-title mb-0">Cart</h2>
              {cart.length > 0 && (
                <span className="text-xs text-gray-400 ml-1">
                  {totalQty} item{totalQty !== 1 ? 's' : ''}
                </span>
              )}
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomAdd(v => !v)}
                  className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                    showCustomAdd
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                  aria-label="Add custom item"
                >
                  <PencilSimple size={12} />
                  Custom item
                </button>
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash size={12} />
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Custom item quick-add */}
            {showCustomAdd && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-end gap-2">
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Item name</label>
                  <input
                    type="text"
                    placeholder="e.g. Paracetamol 500mg"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustomItem()}
                    className="input w-full text-sm"
                    autoFocus
                  />
                </div>
                <div className="w-28 shrink-0">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Price (JMD)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    value={customPrice}
                    onChange={e => setCustomPrice(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustomItem()}
                    className="input w-full font-mono text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={addCustomItem}
                  disabled={!customName.trim() || !customPrice || parseFloat(customPrice) <= 0}
                  className="btn btn-primary h-9 px-3 shrink-0 gap-1 text-sm"
                >
                  <Plus size={13} weight="bold" />
                  Add
                </button>
              </div>
            )}

            {cart.length === 0 ? (
              <div className="py-10 text-center">
                <ShoppingCart size={36} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm text-gray-400">Browse or search products on the right, then press + to add</p>
              </div>
            ) : (
              <div>
                {cart.map(item => (
                  <CartRow
                    key={item.product_id}
                    item={item}
                    onIncrement={incrementItem}
                    onDecrement={decrementItem}
                    onRemove={removeItem}
                    onSetQty={setItemQty}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Totals + payment */}
          <div className="card p-4 space-y-4">

            {/* Totals */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="num">{fmtCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>GCT ({gctRatePct.toFixed(0)}%)</span>
                <span className="num">{fmtCurrency(tax)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-1">
                <span className="font-bold text-gray-900 text-base">Total</span>
                <span className="num-lg font-bold text-gray-900">{fmtCurrency(total)}</span>
              </div>
            </div>

            {/* Payment method — last choice remembered */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Payment Method
                <span className="ml-2 text-gray-400 font-normal normal-case tracking-normal">
                  (saved preference)
                </span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: 'CASH', label: 'Cash', available: true },
                  { key: 'CARD', label: 'Card', available: false, note: 'Card terminal setup required' },
                  { key: 'LYNK', label: 'Lynk', available: false, note: 'Lynk credentials pending' },
                ] as { key: PayMethod; label: string; available: boolean; note?: string }[]).map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => opt.available && selectPayMethod(opt.key)}
                    disabled={!opt.available}
                    title={opt.note}
                    className={`btn text-sm transition-colors ${
                      payMethod === opt.key
                        ? 'btn-primary'
                        : opt.available
                        ? 'btn-ghost'
                        : 'btn-ghost opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cash tendered */}
            {payMethod === 'CASH' && (
              <div>
                <label
                  htmlFor="cash-tendered"
                  className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
                >
                  Cash Tendered (JMD)
                </label>
                <input
                  id="cash-tendered"
                  type="number"
                  min={0}
                  step={50}
                  placeholder="0.00"
                  value={cashInput}
                  onChange={e => setCashInput(e.target.value)}
                  className="input w-full font-mono text-right text-lg"
                />

                {/* Quick denomination buttons */}
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {[500, 1000, 2000, 5000, 10000].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setCashInput(String(v))}
                      className="btn btn-ghost text-xs h-7 px-2"
                    >
                      ${v.toLocaleString()}
                    </button>
                  ))}
                  {total > 0 && (
                    <button
                      type="button"
                      onClick={() => setCashInput(total.toFixed(2))}
                      className="btn btn-ghost text-xs h-7 px-2.5 text-blue-600 border-blue-200"
                    >
                      Exact
                    </button>
                  )}
                </div>

                {cashTendered > 0 && total > 0 && (
                  <div className={`flex justify-between items-center mt-3 px-3 py-2.5 rounded text-sm font-semibold ${
                    changeDue >= 0
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-600'
                  }`}>
                    <span>{changeDue >= 0 ? 'Change due' : 'Short by'}</span>
                    <span className="num font-bold">{fmtCurrency(Math.abs(changeDue))}</span>
                  </div>
                )}
              </div>
            )}

            {/* Process Sale CTA */}
            <button
              type="button"
              onClick={() => processSale.mutate()}
              disabled={!canSubmit || processSale.isPending}
              className="btn btn-primary w-full gap-2 text-base font-semibold"
              style={{ minHeight: '56px' }}
            >
              {processSale.isPending ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Receipt size={18} weight="duotone" />
              )}
              {processSale.isPending ? 'Processing…' : 'Process Sale'}
              {!processSale.isPending && <ArrowRight size={16} />}
            </button>

            {processSale.isError && (
              <p className="text-xs text-red-600 text-center bg-red-50 rounded px-3 py-2">
                {(processSale.error as Error).message}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT — Product browse + search ─────────────────────────────── */}
        <div className="flex-[9] min-w-0">
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={15} weight="duotone" className="text-gray-500" />
              <h2 className="section-title mb-0">Products</h2>
              {searching && (
                <span className="text-xs text-gray-400 ml-auto animate-pulse">Searching…</span>
              )}
            </div>

            {/* Search input */}
            <div className="relative mb-3">
              <MagnifyingGlass
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={searchRef}
                type="search"
                autoFocus
                placeholder="Search name or scan barcode…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input pl-8 w-full text-sm"
                aria-label="Search products by name or barcode"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(''); searchRef.current?.focus() }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Product list */}
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto rounded">
              {!searching && products.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-400">
                    {search
                      ? `No products match "${search}"`
                      : 'No products in catalog. Add products via Product Catalog first.'}
                  </p>
                </div>
              )}

              {products.map(p => {
                const outOfStock = p.stock_qty <= 0
                const lowStock   = !outOfStock && p.stock_qty <= p.reorder_level
                const inCart     = cart.find(i => i.product_id === p.id)

                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-3 px-2 py-2.5 rounded transition-colors ${
                      outOfStock ? 'opacity-50' : inCart ? 'bg-blue-50/70' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-500 font-mono">
                        {fmtCurrency(p.unit_price)}
                        {p.barcode && (
                          <span className="text-gray-400 ml-2 text-xs">{p.barcode}</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {inCart && (
                        <span className="text-xs text-blue-600 font-semibold font-mono">
                          ×{inCart.qty}
                        </span>
                      )}
                      {outOfStock ? (
                        <span className="pill pill-red text-xs">Out of stock</span>
                      ) : lowStock ? (
                        <span className="pill pill-yellow text-xs">Low ({p.stock_qty})</span>
                      ) : (
                        <span className="pill pill-green text-xs">{p.stock_qty}</span>
                      )}
                      <button
                        type="button"
                        onClick={() => addToCart(p)}
                        disabled={outOfStock}
                        className={`w-7 h-7 rounded flex items-center justify-center transition-colors shrink-0 ${
                          outOfStock
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                        }`}
                        aria-label={
                          outOfStock
                            ? `${p.name} — out of stock`
                            : `Add ${p.name} to cart`
                        }
                      >
                        <Plus size={13} weight="bold" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {products.length > 0 && (
              <p className="text-xs text-gray-400 text-center mt-2 pt-2 border-t border-gray-100">
                {products.length} product{products.length !== 1 ? 's' : ''} · press + to add · click + again to increment
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
