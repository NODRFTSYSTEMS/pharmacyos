import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Trash, X, Plus, Minus, MagnifyingGlass } from '@phosphor-icons/react'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { usePOSCart } from '@/stores/posCart'
import { SAMPLE_POS_PRODUCTS, type PaymentMethod } from '@/data/sample'

/**
 * POS Terminal — design handoff Section 5.13.
 * 60/40 product+cart vs payment grid. Barcode-first UX: barcode input always
 * focused; tendered cash auto-calculates change in mono accent.
 */
export function POSTerminalPage() {
  const { items, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount } = usePOSCart()
  const [scan, setScan] = useState('')
  const [tender, setTender] = useState('')
  const [method, setMethod] = useState<PaymentMethod>('Cash')
  const [completed, setCompleted] = useState<{ change: number; total: number } | null>(null)
  const scanRef = useRef<HTMLInputElement | null>(null)

  // Keep barcode input focused for fast scanning.
  useEffect(() => {
    scanRef.current?.focus()
  }, [items.length, completed])

  const sub = subtotal()
  const tax = sub * 0.15
  const total = sub + tax

  function handleScan(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const code = scan.trim()
    if (!code) return
    const product = SAMPLE_POS_PRODUCTS.find((p) => p.barcode === code || p.id === code)
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        din: product.barcode,
        quantity: 1,
        unitPrice: product.priceJmd,
        requiresRx: product.requiresRx,
        isSchedule: false,
      })
    }
    setScan('')
  }

  function handleComplete() {
    const tenderNum = method === 'Cash' ? Number(tender) : total
    if (method === 'Cash' && (!tenderNum || tenderNum < total)) return
    setCompleted({ change: Math.max(0, tenderNum - total), total })
    clearCart()
    setTender('')
  }

  if (completed) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-base">
        <div className="bg-bg-surface rounded-card shadow-modal p-12 max-w-md w-full text-center">
          <div aria-hidden="true" className="w-16 h-16 rounded-pill bg-rx-filled-bg text-rx-filled-fg flex items-center justify-center mx-auto mb-4 font-bold text-2xl">✓</div>
          <p className="type-section text-text-primary mb-1">Transaction complete</p>
          <p className="text-sm text-text-secondary mb-6">Receipt printed</p>
          <dl className="grid grid-cols-2 gap-4 mb-6 text-left">
            <div className="bg-bg-subtle rounded-control p-3">
              <dt className="type-label text-text-secondary">Total Charged</dt>
              <dd className="type-mono-pos-tender text-text-primary">JMD {completed.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</dd>
            </div>
            <div className="bg-rx-filled-bg rounded-control p-3">
              <dt className="type-label text-rx-filled-fg">Change Due</dt>
              <dd className="type-mono-pos-tender text-rx-filled-fg">JMD {completed.change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</dd>
            </div>
          </dl>
          <div className="flex gap-2">
            <Button variant="secondary" size="lg" fullWidth>Email Receipt</Button>
            <Button variant="primary" size="lg" fullWidth onClick={() => setCompleted(null)}>Next Sale</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full grid grid-cols-[1.5fr_1fr] divide-x divide-border bg-bg-base">
      {/* LEFT: products + cart (60%) */}
      <div className="flex flex-col min-h-0">
        {/* Barcode bar */}
        <form onSubmit={handleScan} className="h-16 px-6 flex items-center gap-3 bg-bg-surface border-b border-border shrink-0">
          <MagnifyingGlass size={20} className="text-text-secondary shrink-0" />
          <input
            ref={scanRef}
            type="text"
            value={scan}
            onChange={(e) => setScan(e.target.value)}
            placeholder="Scan barcode or type product code…"
            className="flex-1 type-mono-input text-text-primary bg-transparent focus:outline-none focus:ring-[3px] focus:ring-primary/20 focus:bg-bg-subtle placeholder:text-text-disabled"
            autoFocus
          />
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="h-14 px-4 text-sm text-error hover:text-tag-schedule-fg flex items-center gap-1.5 rounded-control hover:bg-tag-schedule-bg transition-colors"
            >
              <Trash size={20} />
              Clear cart
            </button>
          )}
        </form>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-pill bg-bg-subtle text-text-disabled flex items-center justify-center mb-4">
                <MagnifyingGlass size={28} />
              </div>
              <p className="type-card-title text-text-primary mb-1">Empty cart</p>
              <p className="text-sm text-text-secondary">Scan a barcode or click a product below to begin.</p>

              <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-2xl">
                {SAMPLE_POS_PRODUCTS.slice(0, 6).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => addItem({ id: p.id, name: p.name, din: p.barcode, quantity: 1, unitPrice: p.priceJmd, requiresRx: p.requiresRx, isSchedule: false })}
                    className="bg-bg-surface rounded-card shadow-card p-3 text-left hover:shadow-card-hover hover:border-primary border border-transparent transition-all"
                  >
                    <p className="text-sm font-medium text-text-primary truncate">{p.name}</p>
                    <p className="type-mono-data text-text-secondary text-xs mt-0.5">{p.barcode}</p>
                    <p className="type-mono-metric text-text-primary text-base mt-2">JMD {p.priceJmd.toLocaleString()}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="bg-bg-surface rounded-card shadow-card p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
                    <p className="type-mono-data text-text-secondary text-xs">{item.din}</p>
                    {item.requiresRx && <StatusPill variant="info" className="mt-1">Rx required</StatusPill>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-14 h-14 rounded-control border border-border hover:bg-bg-subtle flex items-center justify-center text-text-secondary"
                    >
                      <Minus size={24} />
                    </button>
                    <span className="type-mono-data w-14 text-center text-text-primary">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-14 h-14 rounded-control border border-border hover:bg-bg-subtle flex items-center justify-center text-text-secondary"
                    >
                      <Plus size={24} />
                    </button>
                  </div>
                  <p className="type-mono-data text-text-primary w-24 text-right">
                    JMD {(item.unitPrice * item.quantity).toLocaleString()}
                  </p>
                  <button
                    type="button"
                    aria-label="Remove from cart"
                    onClick={() => removeItem(item.id)}
                    className="w-14 h-14 rounded-control hover:bg-tag-schedule-bg flex items-center justify-center text-error"
                  >
                    <X size={24} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: payment (40%) */}
      <div className="flex flex-col bg-bg-surface min-h-0">
        <div className="px-6 py-4 border-b border-border shrink-0">
          <p className="type-caption text-text-secondary">Payment</p>
          <p className="text-xs text-text-secondary mt-0.5">{itemCount()} items</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="space-y-2">
            <Row label="Subtotal" value={`JMD ${sub.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
            <Row label="GCT (General Consumption Tax) 15%" value={`JMD ${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
          </div>
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <p className="type-card-title text-text-primary">Total</p>
              <p className="type-mono-pos-tender text-text-primary">
                JMD {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Payment method */}
          <div>
            <p className="type-label text-text-secondary mb-2">Method</p>
            <div className="grid grid-cols-3 gap-2">
              {(['Cash', 'Card', 'Lynk'] as PaymentMethod[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={[
                    'h-12 rounded-control type-body-sm font-medium border transition-colors',
                    method === m
                      ? 'bg-primary text-white border-primary'
                      : 'bg-bg-surface text-text-primary border-border hover:bg-bg-subtle',
                  ].join(' ')}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Cash tender */}
          {method === 'Cash' && (
            <div>
              <label htmlFor="tender" className="type-label text-text-secondary block mb-2">Cash Tendered</label>
              <input
                id="tender"
                type="number"
                inputMode="decimal"
                step="0.01"
                value={tender}
                onChange={(e) => setTender(e.target.value)}
                placeholder="0.00"
                className="w-full h-14 px-4 type-mono-pos-tender text-right text-text-primary bg-bg-surface border border-border rounded-control focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
              />
              {Number(tender) > 0 && Number(tender) >= total && (
                <div className="mt-2 p-3 bg-rx-filled-bg rounded-control">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-rx-filled-fg uppercase tracking-wider">Change Due</p>
                    <p className="type-mono-pos-tender text-rx-filled-fg">
                      JMD {(Number(tender) - total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border shrink-0">
          <Button
            variant="primary"
            size="xl"
            fullWidth
            disabled={items.length === 0 || (method === 'Cash' && Number(tender) < total)}
            onClick={handleComplete}
          >
            Complete Sale
          </Button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className="type-mono-data text-text-primary">{value}</span>
    </div>
  )
}

export default POSTerminalPage
