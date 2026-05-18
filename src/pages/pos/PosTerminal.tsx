import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Receipt, Plus, Minus, X, ShoppingCart,
  MagnifyingGlass, ArrowRight, User, Trash,
  Tag, Clock, Star, Printer, CheckCircle,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { ProductImageThumb } from '../../components/MedicationVisualReference'
import { AUDIT_ACTIONS } from '../../constants/audit-actions'
import { normalizeMedicationKey, useMedicationVisualReferences } from '../../hooks/useMedicationVisualReferences'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useActiveTimecard } from '../../hooks/useActiveTimecard'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useNavigate } from 'react-router'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProductRow {
  id: string
  name: string
  barcode: string | null
  unit_price: number
  stock_qty: number
  reorder_level: number
  image_url: string | null
  image_alt: string | null
}

interface CartItem {
  product_id:   string       // real UUID for DB products; random UUID for custom items
  product_name: string
  barcode:      string | null
  unit_price:   number
  qty:          number
  is_custom?:   boolean      // true → null product_id in DB + skip stock decrement
}

type PayMethod = 'CASH' | 'CARD' | 'LYNK'

interface LoyaltyCustomerRow {
  id: string
  name: string
  phone: string | null
  points_balance: number
  tier: 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM'
}

const TIER_PILL: Record<LoyaltyCustomerRow['tier'], string> = {
  STANDARD: 'pill-gray',
  SILVER:   'pill-blue',
  GOLD:     'pill-yellow',
  PLATINUM: 'pill-purple',
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

// ── Receipt ───────────────────────────────────────────────────────────────────

interface ReceiptData {
  refNumber:       string
  items:           CartItem[]
  subtotal:        number
  tax:             number
  gctRatePct:      number
  total:           number
  payMethod:       PayMethod
  cashTendered:    number | null
  changeDue:       number | null
  loyaltyCustomer: LoyaltyCustomerRow | null
  loyaltyEarned:   number
  cashierName:     string | null
  timestamp:       string
}

function ReceiptModal({ data, onClose }: { data: ReceiptData; onClose: () => void }) {
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-JM', { style: 'currency', currency: 'JMD', minimumFractionDigits: 2 }).format(n)

  const dateStr = new Date(data.timestamp).toLocaleString('en-JM', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  // C-02: Focus trap — move focus to close button on open, trap Tab, Escape to close
  const dialogRef  = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null
    const id = setTimeout(() => closeBtnRef.current?.focus(), 0)

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      const el = dialogRef.current
      if (!el) return
      const focusable = Array.from(
        el.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      clearTimeout(id)
      document.removeEventListener('keydown', handleKeyDown)
      prevFocus?.focus()
    }
  }, [onClose])

  return (
    <>
      {/* Backdrop — hidden on print */}
      <div
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 print:hidden"
        onClick={onClose}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="receipt-modal-title"
          className="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle size={18} weight="duotone" aria-hidden="true" />
              <span id="receipt-modal-title" className="font-semibold text-sm">Sale Complete</span>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="btn btn-ghost p-1.5"
              aria-label="Close receipt"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          {/* Receipt body — pos-receipt-print class used by @media print to isolate this element */}
          <div className="pos-receipt-print px-5 py-4 font-mono text-sm space-y-3">
            {/* Pharmacy + ref */}
            <div className="text-center border-b border-dashed border-gray-300 pb-3">
              <p className="font-bold text-base text-gray-900 not-italic">Winchester Global Pharmacy</p>
              <p className="text-xs text-gray-500 mt-0.5">{dateStr}</p>
              <p className="text-xs text-gray-500">Ref: {data.refNumber}</p>
              {data.cashierName && (
                <p className="text-xs text-gray-500">Cashier: {data.cashierName}</p>
              )}
            </div>

            {/* Line items */}
            <div className="space-y-1.5 border-b border-dashed border-gray-300 pb-3">
              {data.items.map(item => (
                <div key={item.product_id} className="flex justify-between gap-2">
                  <span className="text-gray-800 flex-1 break-words leading-snug">
                    {item.product_name}
                    <span className="text-gray-400"> ×{item.qty}</span>
                  </span>
                  <span className="shrink-0 tabular-nums">{fmt(item.unit_price * item.qty)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1 border-b border-dashed border-gray-300 pb-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="tabular-nums">{fmt(data.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GCT ({data.gctRatePct.toFixed(0)}%)</span>
                <span className="tabular-nums">{fmt(data.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span className="tabular-nums">{fmt(data.total)}</span>
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-1">
              <div className="flex justify-between text-gray-600">
                <span>Payment</span>
                <span>{data.payMethod}</span>
              </div>
              {data.payMethod === 'CASH' && data.cashTendered !== null && (
                <>
                  <div className="flex justify-between text-gray-600">
                    <span>Tendered</span>
                    <span className="tabular-nums">{fmt(data.cashTendered)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-emerald-700">
                    <span>Change</span>
                    <span className="tabular-nums">{fmt(data.changeDue ?? 0)}</span>
                  </div>
                </>
              )}
              {data.loyaltyEarned > 0 && data.loyaltyCustomer && (
                <div className="flex justify-between text-amber-600 font-medium mt-1">
                  <span>Loyalty ({data.loyaltyCustomer.name})</span>
                  <span>+{data.loyaltyEarned} pts</span>
                </div>
              )}
            </div>

            <p className="text-center text-xs text-gray-400 pt-2 border-t border-dashed border-gray-300">
              Thank you for your purchase
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 px-5 pb-5">
            <button
              type="button"
              onClick={() => window.print()}
              className="btn btn-ghost flex-1 gap-2 text-sm"
            >
              <Printer size={15} aria-hidden="true" />
              Print
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-primary flex-1 gap-2 text-sm"
            >
              New Sale
            </button>
          </div>
        </div>
      </div>

      {/* Print-only styles: visibility approach avoids display:none on React root.
          body { visibility: hidden } hides all content; .pos-receipt-print and its
          children override to visible so only the receipt body prints. */}
      <style>{`
        @media print {
          body { visibility: hidden !important; }
          .pos-receipt-print,
          .pos-receipt-print * { visibility: visible !important; }
          .pos-receipt-print {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </>
  )
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
  usePageTitle('POS Terminal')
  const qc = useQueryClient()
  const navigate = useNavigate()
  const searchRef = useRef<HTMLInputElement>(null)

  // Load persisted preferences once on mount
  const [prefs] = useState<PosPrefs>(loadPrefs)

  const [cart,           setCart]           = useState<CartItem[]>([])
  const [search,         setSearch]         = useState('')
  const [payMethod,      setPayMethod]      = useState<PayMethod>(prefs.payMethod)
  const [cashInput,      setCashInput]      = useState('')
  const [toast,          setToast]          = useState<{ msg: string; ok: boolean; key: number } | null>(null)
  const [rightTab,       setRightTab]       = useState<'catalog' | 'add'>('catalog')
  const [customName,     setCustomName]     = useState('')
  const [customPrice,    setCustomPrice]    = useState('')
  const customNameRef    = useRef<HTMLInputElement>(null)
  const [loyaltyOpen,    setLoyaltyOpen]    = useState(false)
  const [loyaltySearch,  setLoyaltySearch]  = useState('')
  const [loyaltyCustomer, setLoyaltyCustomer] = useState<LoyaltyCustomerRow | null>(null)
  const loyaltySearchRef = useRef<HTMLInputElement>(null)
  const [receiptData,    setReceiptData]    = useState<ReceiptData | null>(null)

  // ── Cashier identity — reuses the shared useCurrentUser hook (F-2) ─────────
  // Eliminates the duplicate ['pos-cashier'] query that fetched staff_profiles
  // separately. useCurrentUser is already resolved from the app shell context.

  const { data: currentUser } = useCurrentUser()

  // ── Clock-in requirement check ─────────────────────────────────────────────
  // ADMIN role bypasses this check; all other staff must be clocked in to access POS
  const { data: activeTimecard, isLoading: timecardLoading } = useActiveTimecard(
    currentUser?.role !== 'ADMIN' ? currentUser?.id : undefined
  )

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

  // ── Loyalty rate from pharmacy_settings (points per $1 spent) ────────────

  const { data: loyaltyRate = 1 } = useQuery<number>({
    queryKey: ['setting-loyalty-rate'],
    queryFn: async () => {
      const { data } = await supabase
        .from('pharmacy_settings')
        .select('value')
        .eq('key', 'loyalty_rate')
        .maybeSingle()
      return data ? parseFloat(data.value) : 1
    },
    staleTime: 300_000,
  })

  // ── allow_over_sell setting — gates pre-flight stock check ──────────────────
  // Default: false (enforce stock). Admin can override in Settings → POS & Operations.

  const { data: allowOverSell = false } = useQuery<boolean>({
    queryKey: ['setting-allow-over-sell'],
    queryFn: async () => {
      const { data } = await supabase
        .from('pharmacy_settings')
        .select('value')
        .eq('key', 'allow_over_sell')
        .maybeSingle()
      return data?.value === 'true'
    },
    staleTime: 300_000,
  })

  // ── Loyalty customer search ───────────────────────────────────────────────

  const { data: loyaltyResults = [] } = useQuery<LoyaltyCustomerRow[]>({
    queryKey: ['pos-loyalty-search', loyaltySearch],
    queryFn: async () => {
      const q = loyaltySearch.trim()
      const { data, error } = await supabase
        .from('loyalty_customers')
        .select('id, name, phone, points_balance, tier')
        .eq('is_active', true)
        .or(`name.ilike.%${q}%,phone.ilike.%${q}%`)
        .order('name')
        .limit(8)
      if (error) throw error
      return (data ?? []) as LoyaltyCustomerRow[]
    },
    enabled: loyaltySearch.trim().length >= 2,
    staleTime: 10_000,
  })

  // ── Product search / browse ──────────────────────────────────────────────
  // Shows ALL active products by default; filtered by search when a query is entered.

  const {
    data: products = [],
    isFetching: searching,
    isError: productsError,
  } = useQuery<ProductRow[]>({
    queryKey: ['pos-products', search],
    queryFn: async () => {
      let q = supabase
        .from('products')
        .select('id, name, barcode, unit_price, stock_qty, reorder_level, image_url, image_alt')
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
    retry: 1,
  })
  const medicationReferences = useMedicationVisualReferences(products.map(p => p.name))

  // ── Cart state operations ────────────────────────────────────────────────

  function addToCart(p: ProductRow) {
    if (p.stock_qty <= 0) return
    setCart(prev => {
      const idx = prev.findIndex(x => x.product_id === p.id)
      if (idx >= 0) {
        // Item already in cart — increment qty, capped at available stock
        return prev.map((x, i) => i === idx ? { ...x, qty: Math.min(x.qty + 1, p.stock_qty) } : x)
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
    setCart(prev => prev.map(x => {
      if (x.product_id !== id) return x
      const maxQty = products?.find(p => p.id === id)?.stock_qty ?? Infinity
      return { ...x, qty: Math.min(x.qty + 1, maxQty) }
    }))
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
      // Clamp to available stock for real products; custom items (no product record) keep entered qty
      const maxQty = products?.find(p => p.id === id)?.stock_qty ?? qty
      const clamped = Math.min(qty, maxQty)
      setCart(prev => prev.map(x => x.product_id === id ? { ...x, qty: clamped } : x))
    }
  }

  function removeItem(id: string) {
    setCart(prev => prev.filter(x => x.product_id !== id))
  }

  function clearCart() {
    setCart([])
    setCashInput('')
    setLoyaltyCustomer(null)
    setLoyaltySearch('')
    setLoyaltyOpen(false)
  }

  function addCustomItem() {
    const name  = customName.trim()
    const price = parseFloat(customPrice)
    if (!name || isNaN(price) || price <= 0) return
    setCart(prev => [...prev, {
      product_id:   crypto.randomUUID(),
      product_name: name,
      barcode:      null,
      unit_price:   price,
      qty:          1,
      is_custom:    true,
    }])
    setCustomName('')
    setCustomPrice('')
    setTimeout(() => customNameRef.current?.focus(), 0)
  }

  // ── Payment method preference ────────────────────────────────────────────

  function selectPayMethod(m: PayMethod) {
    setPayMethod(m)
    savePrefs({ ...prefs, payMethod: m })
  }

  // ── Totals ───────────────────────────────────────────────────────────────

  const r2            = (n: number) => Math.round(n * 100) / 100
  const subtotal      = r2(cart.reduce((s, i) => s + i.unit_price * i.qty, 0))
  const gctRate       = gctRatePct / 100
  const tax           = r2(subtotal * gctRate)
  const total         = r2(subtotal + tax)
  const totalQty      = cart.reduce((s, i) => s + i.qty, 0)
  const cashTendered  = parseFloat(cashInput) || 0
  const changeDue     = cashTendered - total
  const canSubmit     = cart.length > 0 && (payMethod !== 'CASH' || cashTendered >= total)
  const pointsToEarn  = loyaltyCustomer ? Math.floor(total * loyaltyRate) : 0

  // ── Process sale mutation ────────────────────────────────────────────────

  const processSale = useMutation({
    mutationFn: async () => {
      // ── Pre-flight stock check (Pharmacy Act + inventory integrity) ──────────
      // Fires BEFORE any DB write. Throws if any non-custom cart item exceeds
      // current stock_qty — preventing oversell even under concurrent sales.
      // Client-side guards (incrementItem / setItemQty caps) prevent the condition
      // in normal use; this is the authoritative safety net.
      // Skipped only if admin has explicitly enabled allow_over_sell in Settings.
      if (!allowOverSell) {
        for (const item of cart) {
          if (item.is_custom) continue
          const product = products?.find(p => p.id === item.product_id)
          if (product && item.qty > product.stock_qty) {
            throw new Error(
              `Insufficient stock: ${item.product_name} — ${product.stock_qty} unit(s) available`
            )
          }
        }
      }

      // Generate ref number using Jamaica local date (UTC-5) — avoids UTC date mismatch for evening sales
      const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Jamaica' }).replace(/-/g, '')
      const refNumber = `TXN-${today}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`

      const loyaltyEarned = loyaltyCustomer ? Math.floor(total * loyaltyRate) : 0

      // Build JSONB cart items matching the process_retail_sale RPC schema.
      // is_custom items pass null product_id and skip stock decrement inside the RPC.
      const cartItems = cart.map(i => ({
        product_id:   i.is_custom ? null : i.product_id,
        product_name: i.product_name,
        barcode:      i.barcode ?? null,
        quantity:     i.qty,
        unit_price:   i.unit_price,
        line_total:   r2(i.unit_price * i.qty),
        is_custom:    !!i.is_custom,
      }))

      // Single atomic RPC — wraps header INSERT + line items INSERT + stock decrement
      // + stock_movements INSERT + audit_log INSERT in one Postgres transaction.
      // If any step fails, the entire transaction rolls back — no split-brain state.
      const { data: rpcResult, error: rpcError } = await supabase.rpc('process_retail_sale', {
        p_ref_number:            refNumber,
        p_cashier_id:            currentUser?.id ?? null,
        p_cashier_name:          currentUser?.name ?? null,
        p_payment_method:        payMethod,
        p_subtotal:              subtotal,
        p_tax:                   tax,
        p_total:                 total,
        p_cash_tendered:         payMethod === 'CASH' ? cashTendered : null,
        p_change_given:          payMethod === 'CASH' ? Math.max(0, changeDue) : null,
        p_loyalty_customer_id:   loyaltyCustomer?.id ?? null,
        p_loyalty_points_earned: loyaltyEarned,
        p_cart_items:            cartItems,
      })

      if (rpcError) throw new Error(rpcError.message)

      const result = rpcResult as { transaction_id: string; ref_number: string; stock_failures: string[] }
      const stockFailures = result.stock_failures ?? []

      // Credit loyalty points — post-sale, separate from the atomic RPC.
      // A loyalty update failure does not roll back the completed transaction.
      if (loyaltyCustomer && loyaltyEarned > 0) {
        const { error: pointsError } = await supabase
          .from('loyalty_customers')
          .update({
            points_balance: loyaltyCustomer.points_balance + loyaltyEarned,
            updated_at: new Date().toISOString(),
          })
          .eq('id', loyaltyCustomer.id)
        if (pointsError) console.error('loyalty points update failed', pointsError)

        const { error: loyaltyAuditError } = await supabase.from('audit_log').insert({
          actor_id:   currentUser?.id ?? null,
          actor_name: currentUser?.name ?? null,
          action:     AUDIT_ACTIONS.LOYALTY_POINTS_EARN,
          table_name: 'loyalty_customers',
          record_id:  loyaltyCustomer.id,
          details:    { points_earned: loyaltyEarned, transaction_id: result.transaction_id, customer_name: loyaltyCustomer.name },
        })
        if (loyaltyAuditError) console.error('audit_log write failed', loyaltyAuditError)
      }

      return { txnId: result.transaction_id, refNumber, stockFailures, loyaltyEarned }
    },
    onSuccess: ({ stockFailures, loyaltyEarned, refNumber }) => {
      // Capture receipt snapshot BEFORE clearing cart state
      setReceiptData({
        refNumber,
        items:           [...cart],
        subtotal,
        tax,
        gctRatePct,
        total,
        payMethod,
        cashTendered:    payMethod === 'CASH' ? cashTendered : null,
        changeDue:       payMethod === 'CASH' ? Math.max(0, changeDue) : null,
        loyaltyCustomer,
        loyaltyEarned,
        cashierName:     currentUser?.name ?? null,
        timestamp:       new Date().toISOString(),
      })
      clearCart()
      qc.invalidateQueries({ queryKey: ['retail-txns'] })
      qc.invalidateQueries({ queryKey: ['pos-products'] })
      if (loyaltyEarned > 0) qc.invalidateQueries({ queryKey: ['loyalty_customers'] })
      if (stockFailures.length > 0) {
        showToast(
          `Sale recorded. Stock count could not be updated for: ${stockFailures.join(', ')}. Please adjust stock in the Inventory module.`,
          false,
        )
      }
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

  // Show clock-in modal if not ADMIN and not clocked in
  const isAdmin = currentUser?.role === 'ADMIN'
  const clockedIn = !!activeTimecard
  const shouldShowClockInModal = !isAdmin && !clockedIn && !timecardLoading

  if (shouldShowClockInModal) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        role="presentation"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="clockin-modal-title"
          className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Clock size={32} weight="duotone" className="text-amber-600" aria-hidden="true" />
            </div>
            <h2 id="clockin-modal-title" className="text-lg font-bold text-gray-900 mb-2">
              Clock In Required
            </h2>
            <p className="text-sm text-gray-600">
              You must be clocked in to access the POS terminal. Clock in first and then return.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => navigate('/staff/timecard')}
              className="btn btn-primary w-full"
            >
              Clock In Now
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-ghost w-full"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>

      {/* ── Cashier identity bar ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-[#111827] text-white rounded-xl mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
            <User size={15} weight="duotone" />
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">{currentUser?.name ?? '…'}</p>
            {currentUser?.role && (
              <p className="text-xs text-gray-400 leading-none mt-0.5">{currentUser.role}</p>
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
            POS session open
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
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="ml-auto flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash size={12} />
                  Clear all
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="py-10 text-center">
                <ShoppingCart size={36} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm text-gray-400 mb-4">Cart is empty</p>
                <button
                  type="button"
                  onClick={() => { setRightTab('add'); setTimeout(() => customNameRef.current?.focus(), 50) }}
                  className="btn btn-primary gap-2 text-sm"
                >
                  <Plus size={14} weight="bold" />
                  Add Item
                </button>
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

          {/* Loyalty customer lookup */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Star size={15} weight="duotone" className="text-amber-500" />
                <h2 className="section-title mb-0 text-sm">Loyalty Customer</h2>
              </div>
              {!loyaltyCustomer && (
                <button
                  type="button"
                  onClick={() => {
                    setLoyaltyOpen(o => !o)
                    if (!loyaltyOpen) setTimeout(() => loyaltySearchRef.current?.focus(), 50)
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  {loyaltyOpen ? 'Cancel' : 'Attach'}
                </button>
              )}
            </div>

            {loyaltyCustomer ? (
              /* Customer attached — show summary */
              <div className="flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900">{loyaltyCustomer.name}</p>
                    <span className={`pill ${TIER_PILL[loyaltyCustomer.tier]} text-xs`}>
                      {loyaltyCustomer.tier.charAt(0) + loyaltyCustomer.tier.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {loyaltyCustomer.points_balance.toLocaleString()} pts current
                    {pointsToEarn > 0 && (
                      <span className="text-emerald-600 font-medium"> · +{pointsToEarn} pts this sale</span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setLoyaltyCustomer(null); setLoyaltySearch('') }}
                  className="p-1 text-gray-400 hover:text-gray-600 shrink-0"
                  aria-label="Remove loyalty customer"
                >
                  <X size={14} />
                </button>
              </div>
            ) : loyaltyOpen ? (
              /* Search panel */
              <div>
                <div className="relative mb-2">
                  <MagnifyingGlass size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    ref={loyaltySearchRef}
                    type="search"
                    placeholder="Name or phone number…"
                    value={loyaltySearch}
                    onChange={e => setLoyaltySearch(e.target.value)}
                    className="input pl-8 w-full text-sm"
                    aria-label="Search loyalty customer"
                  />
                </div>
                {loyaltySearch.trim().length >= 2 && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {loyaltyResults.length === 0 ? (
                      <p className="px-3 py-3 text-xs text-gray-400 text-center">No members found</p>
                    ) : (
                      loyaltyResults.map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => { setLoyaltyCustomer(c); setLoyaltySearch(''); setLoyaltyOpen(false) }}
                          className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800">{c.name}</p>
                            <p className="text-xs text-gray-500">
                              {c.phone ?? 'No phone'} · {c.points_balance.toLocaleString()} pts
                            </p>
                          </div>
                          <span className={`pill ${TIER_PILL[c.tier]} text-xs shrink-0`}>
                            {c.tier.charAt(0) + c.tier.slice(1).toLowerCase()}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
                {loyaltySearch.trim().length < 2 && (
                  <p className="text-xs text-gray-400">Type at least 2 characters to search members.</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No loyalty customer attached to this sale.</p>
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
                      J${v.toLocaleString()}
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

        {/* RIGHT — tabbed panel ────────────────────────────────────────── */}
        <div className="flex-[9] min-w-0">
          <div className="card overflow-hidden">

            {/* Tab bar — C-04: role="tablist" + role="tab" + aria-selected */}
            <div className="flex border-b border-gray-200" role="tablist" aria-label="POS panel">
              <button
                type="button"
                role="tab"
                id="pos-tab-catalog"
                aria-selected={rightTab === 'catalog'}
                aria-controls="pos-panel-catalog"
                onClick={() => setRightTab('catalog')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  rightTab === 'catalog'
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/40'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Tag size={14} aria-hidden="true" />
                Catalog
                {searching && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" aria-hidden="true" />}
              </button>
              <button
                type="button"
                role="tab"
                id="pos-tab-add"
                aria-selected={rightTab === 'add'}
                aria-controls="pos-panel-add"
                onClick={() => { setRightTab('add'); setTimeout(() => customNameRef.current?.focus(), 50) }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  rightTab === 'add'
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/40'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Plus size={14} weight="bold" aria-hidden="true" />
                Add Item
              </button>
            </div>

            {/* ── CATALOG TAB ── */}
            {rightTab === 'catalog' && (
              <div id="pos-panel-catalog" role="tabpanel" aria-labelledby="pos-tab-catalog" className="p-4">
                {/* Search */}
                <div className="relative mb-3">
                  <MagnifyingGlass size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="search"
                    placeholder="Search name or scan barcode…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="input pl-8 w-full text-sm"
                    aria-label="Search products"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => { setSearch(''); searchRef.current?.focus() }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  )}
                </div>

                {productsError && (
                  <div className="mb-3 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                    Cannot reach database. Switch to the <button type="button" className="underline font-medium" onClick={() => { setRightTab('add'); setTimeout(() => customNameRef.current?.focus(), 50) }}>Add Item</button> tab to add items manually.
                  </div>
                )}

                <div className="divide-y divide-gray-100 max-h-[520px] overflow-y-auto -mx-4 px-4">
                  {!searching && !productsError && products.length === 0 && (
                    <div className="py-10 text-center">
                      <Tag size={32} className="mx-auto text-gray-200 mb-3" />
                      <p className="text-sm text-gray-400 mb-4">
                        {search ? `No products match "${search}"` : 'No products in catalog yet.'}
                      </p>
                      {!search && (
                        <button
                          type="button"
                          onClick={() => { setRightTab('add'); setTimeout(() => customNameRef.current?.focus(), 50) }}
                          className="btn btn-primary gap-2 text-sm"
                        >
                          <Plus size={14} weight="bold" />
                          Add Item manually
                        </button>
                      )}
                    </div>
                  )}

                  {products.map(p => {
                    const outOfStock = p.stock_qty <= 0
                    const lowStock   = !outOfStock && p.stock_qty <= p.reorder_level
                    const inCart     = cart.find(i => i.product_id === p.id)
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => addToCart(p)}
                        disabled={outOfStock}
                        className={`w-full flex items-center gap-3 px-1 py-3 text-left transition-colors ${
                          outOfStock
                            ? 'opacity-40 cursor-not-allowed'
                            : inCart
                            ? 'bg-blue-50 hover:bg-blue-100'
                            : 'hover:bg-gray-50 active:bg-gray-100'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                          outOfStock ? 'bg-gray-100 text-gray-300'
                          : inCart   ? 'bg-blue-600 text-white'
                                     : 'bg-gray-100 text-gray-600'
                        }`}>
                          {inCart ? inCart.qty : '+'}
                        </div>
                        <ProductImageThumb
                          productName={p.name}
                          imageUrl={p.image_url}
                          imageAlt={p.image_alt}
                          fallbackReference={medicationReferences.data?.[normalizeMedicationKey(p.name)]}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                          <p className="text-xs text-gray-500 font-mono">{fmtCurrency(p.unit_price)}</p>
                        </div>
                        <div className="shrink-0">
                          {outOfStock
                            ? <span className="pill pill-red text-xs">Out of stock</span>
                            : lowStock
                            ? <span className="pill pill-yellow text-xs">Low: {p.stock_qty}</span>
                            : <span className="pill pill-green text-xs">{p.stock_qty}</span>}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {products.length > 0 && (
                  <p className="text-xs text-gray-400 text-center mt-3 pt-2 border-t border-gray-100">
                    {products.length} product{products.length !== 1 ? 's' : ''} · click row to add
                  </p>
                )}
              </div>
            )}

            {/* ── ADD ITEM TAB ── */}
            {rightTab === 'add' && (
              <div id="pos-panel-add" role="tabpanel" aria-labelledby="pos-tab-add" className="p-6">
                <p className="text-sm text-gray-500 mb-5">
                  Enter any item name and price — no database product required.
                </p>

                <div className="space-y-4">
                  <div>
                    {/* C-07: label htmlFor wired to input id */}
                    <label htmlFor="custom-item-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Item name <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      ref={customNameRef}
                      id="custom-item-name"
                      type="text"
                      placeholder="e.g. Paracetamol 500mg × 24"
                      value={customName}
                      onChange={e => setCustomName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addCustomItem()}
                      className="input w-full text-sm"
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label htmlFor="custom-item-price" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Price (JMD) <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="custom-item-price"
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                      value={customPrice}
                      onChange={e => setCustomPrice(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addCustomItem()}
                      className="input w-full font-mono text-sm"
                      aria-required="true"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addCustomItem}
                    disabled={!customName.trim() || !customPrice || parseFloat(customPrice) <= 0}
                    className="btn btn-primary w-full gap-2 text-sm"
                    style={{ minHeight: '48px' }}
                  >
                    <Plus size={16} weight="bold" />
                    Add to Cart
                  </button>
                </div>

                {cart.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">In cart</p>
                    <div className="space-y-1">
                      {cart.map(i => (
                        <div key={i.product_id} className="flex justify-between text-xs text-gray-600">
                          <span className="truncate mr-2">{i.product_name} ×{i.qty}</span>
                          <span className="font-mono shrink-0">{fmtCurrency(i.unit_price * i.qty)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-bold text-gray-800 pt-1 border-t border-gray-100 mt-1">
                        <span>Total</span>
                        <span className="font-mono">{fmtCurrency(total)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Receipt modal — shown after every successful sale */}
      {receiptData && (
        <ReceiptModal
          data={receiptData}
          onClose={() => { setReceiptData(null); searchRef.current?.focus() }}
        />
      )}
    </div>
  )
}
