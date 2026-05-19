import { useEffect, useState } from 'react'
import { X, Printer } from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ReceiptItem {
  product_name: string
  quantity:     number
  unit_price:   number
  line_total:   number
}

export interface SaleReceiptData {
  txnId:        string
  refNumber:    string
  items:        ReceiptItem[]
  subtotal:     number
  tax:          number
  total:        number
  payMethod:    string
  cashTendered: number | null
  changeDue:    number | null
  cashierName:  string | null
  saleAt:       string   // ISO timestamp
}

interface SaleReceiptProps {
  data:    SaleReceiptData
  onClose: () => void
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat('en-JM', {
    style: 'currency', currency: 'JMD', minimumFractionDigits: 2,
  }).format(n)
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-JM', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

interface PharmacySettings {
  pharmacy_name:    string
  pharmacy_address: string
  oic_reg_no:       string
  receipt_footer:   string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SaleReceipt({ data, onClose }: SaleReceiptProps) {
  const [settings, setSettings] = useState<PharmacySettings>({
    pharmacy_name:    'PharmacyOS',
    pharmacy_address: '',
    oic_reg_no:       '',
    receipt_footer:   '',
  })

  useEffect(() => {
    void supabase
      .from('pharmacy_settings')
      .select('key, value')
      .in('key', ['pharmacy_name', 'pharmacy_address', 'oic_reg_no', 'receipt_footer'])
      .then(({ data: rows }) => {
        if (!rows) return
        const map: Record<string, string> = {}
        rows.forEach(r => { map[r.key] = r.value })
        setSettings({
          pharmacy_name:    map['pharmacy_name']    ?? 'PharmacyOS',
          pharmacy_address: map['pharmacy_address'] ?? '',
          oic_reg_no:       map['oic_reg_no']       ?? '',
          receipt_footer:   map['receipt_footer']   ?? '',
        })
      })
  }, [])

  function printReceipt() {
    const printContent = document.getElementById('receipt-print-content')?.innerHTML ?? ''
    const win = window.open('', '_blank', 'width=400,height=700')
    if (!win) return
    win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Receipt ${data.refNumber}</title>
  <style>
    body { font-family: 'Courier New', monospace; font-size: 12px; margin: 0; padding: 16px; width: 300px; }
    .center { text-align: center; }
    .right  { text-align: right; }
    .bold   { font-weight: bold; }
    .line   { border-top: 1px dashed #000; margin: 6px 0; }
    .row    { display: flex; justify-content: space-between; margin-bottom: 2px; }
    .muted  { color: #666; }
    @page   { margin: 0; size: 80mm auto; }
  </style>
</head>
<body>${printContent}</body>
</html>`)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 300)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Sale receipt"
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col max-h-[90vh]">

          {/* Modal header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Sale Receipt</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-ghost gap-1.5 text-xs"
                onClick={printReceipt}
                aria-label="Print receipt"
              >
                <Printer size={14} aria-hidden="true" />
                Print
              </button>
              <button
                type="button"
                className="btn btn-ghost p-1.5"
                onClick={onClose}
                aria-label="Close receipt"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Receipt body — scrollable */}
          <div className="flex-1 overflow-y-auto p-5">
            <div id="receipt-print-content" className="font-mono text-xs space-y-3">

              {/* Pharmacy header */}
              <div className="text-center space-y-0.5">
                <p className="font-bold text-sm">{settings.pharmacy_name}</p>
                {settings.pharmacy_address && (
                  <p className="text-gray-500 text-[11px] whitespace-pre-wrap">{settings.pharmacy_address}</p>
                )}
                {settings.oic_reg_no && (
                  <p className="text-gray-500 text-[11px]">OIC Reg: {settings.oic_reg_no}</p>
                )}
              </div>

              <div className="border-t border-dashed border-gray-300" />

              {/* Transaction reference */}
              <div className="space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ref:</span>
                  <span className="font-semibold">{data.refNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span>{fmtDateTime(data.saleAt)}</span>
                </div>
                {data.cashierName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cashier:</span>
                    <span>{data.cashierName}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-gray-300" />

              {/* Line items */}
              <div className="space-y-1.5">
                {data.items.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between gap-2">
                      <span className="flex-1 truncate">{item.product_name}</span>
                      <span className="text-right shrink-0">{fmtCurrency(item.line_total)}</span>
                    </div>
                    <div className="text-gray-400 text-[11px]">
                      {item.quantity} × {fmtCurrency(item.unit_price)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-300" />

              {/* Totals */}
              <div className="space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{fmtCurrency(data.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">GCT</span>
                  <span>{fmtCurrency(data.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm mt-1">
                  <span>TOTAL</span>
                  <span>{fmtCurrency(data.total)}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300" />

              {/* Payment */}
              <div className="space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment</span>
                  <span>{data.payMethod}</span>
                </div>
                {data.cashTendered !== null && data.cashTendered !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cash tendered</span>
                    <span>{fmtCurrency(data.cashTendered)}</span>
                  </div>
                )}
                {data.changeDue !== null && data.changeDue !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Change due</span>
                    <span>{fmtCurrency(data.changeDue)}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              {settings.receipt_footer && (
                <>
                  <div className="border-t border-dashed border-gray-300" />
                  <p className="text-center text-gray-500 text-[11px] whitespace-pre-wrap">
                    {settings.receipt_footer}
                  </p>
                </>
              )}

              <p className="text-center text-gray-400 text-[10px]">
                Thank you for your purchase.
              </p>

            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-200">
            <button
              type="button"
              className="btn btn-ghost w-full"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
