import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  MagnifyingGlass, ArrowClockwise, Export, Receipt,
  Pill, Warning, CheckCircle, X, ArrowBendUpLeft, Check,
  Key, LockKey,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { toJamaicaBounds, todayJamaica } from '../../lib/date'
import { PageHeader, Pill as StatusPill, MetricCard } from '../../components/Shell'
import { usePermission } from '../../hooks/usePermission'
import type { RetailTransaction, RxTransaction, PaymentMethod } from '../../types/database'

// ── Types ─────────────────────────────────────────────────────────────────────

type AnyTxn = (RetailTransaction | RxTransaction) & { _type: 'RETAIL' | 'RX' }
type FilterTab = 'ALL' | 'RETAIL' | 'RX' | 'VOID' | 'PENDING'

// ── Constants ─────────────────────────────────────────────────────────────────

const PAY_LABEL: Record<PaymentMethod, string> = {
  CASH: 'Cash', CARD: 'Card', LYNK: 'Lynk', NHF: 'NHF', MIXED: 'Mixed',
}

const VOID_REASONS = [
  { value: 'WRONG_ITEM',      label: 'Wrong item scanned' },
  { value: 'WRONG_QUANTITY',  label: 'Wrong quantity entered' },
  { value: 'WRONG_PRICE',     label: 'Price override error' },
  { value: 'PAYMENT_ERROR',   label: 'Wrong payment method recorded' },
  { value: 'CUSTOMER_RETURN', label: 'Customer return / changed mind' },
  { value: 'DUPLICATE',       label: 'Duplicate transaction' },
  { value: 'OTHER',           label: 'Other (describe below)' },
] as const

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-JM', {
    style: 'currency', currency: 'JMD', minimumFractionDigits: 2,
  }).format(n)
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-JM', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-JM', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

// ── Void Request Modal (cashier) ──────────────────────────────────────────────

interface VoidRequestModalProps {
  tx: RetailTransaction
  onClose: () => void
  onSubmit: (reason: string, note: string) => void
  isPending: boolean
}

function VoidRequestModal({ tx, onClose, onSubmit, isPending }: VoidRequestModalProps) {
  const [reason, setReason] = useState('')
  const [note, setNote]     = useState('')

  const needsNote = reason === 'OTHER'
  const isInvalid = !reason || (needsNote && !note.trim())

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="vr-title">
      <div className="card w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 id="vr-title" className="text-sm font-semibold text-gray-800">Request Void</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 text-xs border border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-500">Reference</span>
            <span className="font-mono font-medium">{tx.ref_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="font-semibold">{fmtCurrency(tx.total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span>{PAY_LABEL[tx.payment_method]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time</span>
            <span className="font-mono">{fmtTime(tx.created_at)}</span>
          </div>
        </div>

        <div>
          <label htmlFor="vr-reason" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Reason *
          </label>
          <select
            id="vr-reason"
            value={reason}
            onChange={e => { setReason(e.target.value); setNote('') }}
            className="input bg-white"
          >
            <option value="">Select reason…</option>
            {VOID_REASONS.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        {reason && (
          <div>
            <label htmlFor="vr-note" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              {needsNote ? 'Description *' : 'Additional Note (optional)'}
            </label>
            <textarea
              id="vr-note"
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              placeholder={needsNote ? 'Describe the error…' : 'Any additional context…'}
              className="input h-auto py-2 resize-none"
            />
          </div>
        )}

        <p className="text-xs text-gray-500">
          Your manager will be notified and must approve before the void takes effect. You will receive a notification when a decision is made.
        </p>

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button
            onClick={() => onSubmit(reason, note)}
            disabled={isInvalid || isPending}
            className="btn btn-primary"
          >
            {isPending ? 'Submitting…' : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Void Decision Modal (manager) ─────────────────────────────────────────────

interface VoidDecisionModalProps {
  tx: RetailTransaction
  onClose: () => void
  onApprove: () => void
  onDeny: (note: string) => void
  isPending: boolean
  issuedOtp: string | null   // set after OTP is generated — shows on manager's screen
}

function VoidDecisionModal({ tx, onClose, onApprove, onDeny, isPending, issuedOtp }: VoidDecisionModalProps) {
  const [denying,  setDenying]  = useState(false)
  const [denyNote, setDenyNote] = useState('')

  const reasonLabel = VOID_REASONS.find(r => r.value === tx.void_reason)?.label
    ?? tx.void_reason ?? 'Unknown'

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="vd-title">
      <div className="card w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 id="vd-title" className="text-sm font-semibold text-gray-800">Review Void Request</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 text-xs border border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-500">Reference</span>
            <span className="font-mono font-medium">{tx.ref_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="font-semibold">{fmtCurrency(tx.total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span>{PAY_LABEL[tx.payment_method]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time</span>
            <span className="font-mono">{fmtTime(tx.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Requested by</span>
            <span className="font-medium">{tx.void_requested_by_name ?? '—'}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-gray-500 shrink-0">Reason</span>
            <span className="text-right">{reasonLabel}</span>
          </div>
        </div>

        {/* OTP issued — show prominently to manager; they give this code to the cashier */}
        {issuedOtp ? (
          <div className="rounded-lg border-2 border-emerald-400 bg-emerald-50 p-5 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-sm">
              <LockKey size={18} aria-hidden="true" />
              Void Authorization Code
            </div>
            <p className="font-mono text-5xl font-bold tracking-[0.25em] text-emerald-800 select-all">
              {issuedOtp}
            </p>
            <p className="text-xs text-emerald-700">
              Give this code to the cashier verbally or on paper.
              They must enter it on their terminal to complete the void.
              Code expires in <strong>15 minutes</strong>.
            </p>
            <button onClick={onClose} className="btn btn-ghost text-xs mt-1">
              Done — close
            </button>
          </div>
        ) : !denying ? (
          <>
            <p className="text-xs text-gray-500">
              Approving generates a one-time authorization code that you will give to the cashier.
              The void executes only when the cashier enters that code. Both actions are recorded in the audit log.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDenying(true)} disabled={isPending} className="btn btn-ghost flex-1">
                Deny
              </button>
              <button onClick={onApprove} disabled={isPending} className="btn btn-primary flex-1 gap-2">
                {isPending
                  ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none" aria-hidden="true" />Generating code…</>
                  : <><Key size={14} weight="bold" aria-hidden="true" />Approve &amp; Generate Code</>
                }
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="vd-deny-note" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Reason for Denial (optional)
              </label>
              <textarea
                id="vd-deny-note"
                value={denyNote}
                onChange={e => setDenyNote(e.target.value)}
                rows={2}
                placeholder="Let the cashier know why this was denied…"
                className="input h-auto py-2 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDenying(false)} className="btn btn-ghost flex-1">Back</button>
              <button
                onClick={() => onDeny(denyNote)}
                disabled={isPending}
                className="btn flex-1 bg-red-600 text-white hover:bg-red-700 border-red-600"
              >
                {isPending ? 'Denying…' : 'Confirm Denial'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Void OTP Confirm Modal (cashier) ──────────────────────────────────────────

interface VoidOtpConfirmModalProps {
  tx: RetailTransaction
  onClose: () => void
  onConfirm: (otp: string) => void
  isPending: boolean
}

function VoidOtpConfirmModal({ tx, onClose, onConfirm, isPending }: VoidOtpConfirmModalProps) {
  const [otp, setOtp] = useState('')
  const invalid = otp.trim().length !== 6 || !/^\d{6}$/.test(otp.trim())

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="vc-title">
      <div className="card w-full max-w-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 id="vc-title" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <LockKey size={16} className="text-amber-600" aria-hidden="true" />
            Enter Authorization Code
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-xs border border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-500">Transaction</span>
            <span className="font-mono font-medium">{tx.ref_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="font-semibold">{fmtCurrency(tx.total)}</span>
          </div>
        </div>

        <div>
          <label htmlFor="vc-otp" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            6-Digit Code from Manager
          </label>
          <input
            id="vc-otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="input w-full text-center font-mono text-3xl tracking-[0.4em] py-3"
            placeholder="——————"
            autoFocus
            aria-describedby="vc-hint"
          />
          <p id="vc-hint" className="mt-1.5 text-xs text-gray-400 text-center">
            Enter the code your manager gave you. Code expires 15 minutes from issuance.
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn btn-ghost flex-1" disabled={isPending}>Cancel</button>
          <button
            onClick={() => onConfirm(otp.trim())}
            disabled={invalid || isPending}
            className="btn btn-primary flex-1 gap-2"
          >
            {isPending
              ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none" aria-hidden="true" />Processing…</>
              : <><Check size={14} weight="bold" aria-hidden="true" />Confirm Void</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Data hook ─────────────────────────────────────────────────────────────────

function useTodayTransactions(date: string) {
  const bounds = toJamaicaBounds(date, date)

  const retail = useQuery({
    queryKey: ['retail-txns', date],
    queryFn: async () => {
      // void_otp is intentionally excluded — it is a server-side secret communicated
      // out-of-band. Use void_otp_expires_at (non-secret metadata) to detect OTP state.
      const { data, error } = await supabase
        .from('retail_transactions')
        .select(`
          id, ref_number, cashier_id, transaction_type,
          subtotal, tax, discount, total, payment_method,
          cash_tendered, change_given,
          loyalty_customer_id, loyalty_points_earned, loyalty_points_redeemed,
          notes, voided, voided_by, voided_at,
          void_reason, void_requested_by, void_requested_by_name, void_requested_at,
          void_denied_by, void_denied_by_name, void_denied_at, void_denied_note,
          void_otp_expires_at, void_otp_issued_by_name,
          created_at
        `)
        .gte('created_at', bounds.gte)
        .lte('created_at', bounds.lte)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as RetailTransaction[]
    },
    refetchInterval: 30_000,
  })

  const rx = useQuery({
    queryKey: ['rx-txns', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rx_transactions')
        .select('*')
        .gte('created_at', bounds.gte)
        .lte('created_at', bounds.lte)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as RxTransaction[]
    },
    refetchInterval: 30_000,
  })

  return { retail, rx }
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TransactionLog() {
  const today = todayJamaica()
  const qc    = useQueryClient()
  const canVoid = usePermission('pos_void')

  const [date,           setDate]           = useState(today)
  const [search,         setSearch]         = useState('')
  const [filter,         setFilter]         = useState<FilterTab>('ALL')
  const [voidTarget,     setVoidTarget]     = useState<RetailTransaction | null>(null)
  const [decisionTarget, setDecisionTarget] = useState<RetailTransaction | null>(null)
  const [otpTarget,      setOtpTarget]      = useState<RetailTransaction | null>(null)
  const [issuedOtp,      setIssuedOtp]      = useState<string | null>(null)
  const [actionError,    setActionError]    = useState<string | null>(null)

  const { retail, rx } = useTodayTransactions(date)

  const isLoading = retail.isLoading || rx.isLoading
  const isError   = retail.isError   || rx.isError

  const combined: AnyTxn[] = [
    ...(retail.data ?? []).map(t => ({ ...t, _type: 'RETAIL' as const })),
    ...(rx.data ?? []).map(t => ({ ...t, _type: 'RX' as const })),
  ].sort((a, b) => b.created_at.localeCompare(a.created_at))

  const pendingVoidCount = (retail.data ?? []).filter(
    t => t.void_requested_at && !t.voided && !t.void_denied_at,
  ).length

  const filtered = combined.filter(t => {
    if (filter === 'RETAIL' && t._type !== 'RETAIL') return false
    if (filter === 'RX'     && t._type !== 'RX')     return false
    if (filter === 'VOID'   && !t.voided)             return false
    if (filter === 'PENDING') {
      if (t._type !== 'RETAIL') return false
      const rt = t as RetailTransaction
      if (!rt.void_requested_at || rt.voided || rt.void_denied_at) return false
    }
    if (search) {
      const q    = search.toLowerCase()
      const name = t._type === 'RX' ? (t as RxTransaction).patient_name : ''
      return t.ref_number.toLowerCase().includes(q) || name.toLowerCase().includes(q)
    }
    return true
  })

  const totalRetail = (retail.data ?? []).filter(t => !t.voided).reduce((s, t) => s + t.total, 0)
  const totalRx     = (rx.data ?? []).filter(t => !t.voided).reduce((s, t) => s + t.patient_copay, 0)
  const voidCount   = combined.filter(t => t.voided).length

  // ── Mutations ────────────────────────────────────────────────────────────────

  const requestVoid = useMutation({
    mutationFn: async ({ txId, reason, note }: { txId: string; reason: string; note: string }) => {
      const { error } = await supabase.rpc('request_void_transaction', {
        p_tx_id:  txId,
        p_reason: reason,
        p_note:   note || null,
      })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['retail-txns', date] })
      setVoidTarget(null)
      setActionError(null)
    },
    onError: (err: Error) => setActionError(err.message),
  })

  // Manager approves: issues OTP. Void executes only after cashier enters the OTP.
  const approveVoid = useMutation({
    mutationFn: async (txId: string) => {
      const { data: otp, error } = await supabase.rpc('issue_void_otp', { p_tx_id: txId })
      if (error) throw error
      return otp as string
    },
    onSuccess: (otp: string) => {
      // Keep modal open — show OTP to manager. Cashier will enter it separately.
      setIssuedOtp(otp)
      setActionError(null)
      // Refresh transaction list so cashier's view updates to "OTP Issued"
      qc.invalidateQueries({ queryKey: ['retail-txns', date] })
    },
    onError: (err: Error) => setActionError(err.message),
  })

  // Cashier confirms void by entering the OTP received from manager
  const confirmVoid = useMutation({
    mutationFn: async ({ txId, otp }: { txId: string; otp: string }) => {
      const { error } = await supabase.rpc('confirm_void_with_otp', { p_tx_id: txId, p_otp: otp })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['retail-txns', date] })
      setOtpTarget(null)
      setActionError(null)
    },
    onError: (err: Error) => setActionError(err.message),
  })

  const denyVoid = useMutation({
    mutationFn: async ({ txId, note }: { txId: string; note: string }) => {
      const { error } = await supabase.rpc('deny_void_transaction', {
        p_tx_id: txId,
        p_note:  note || null,
      })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['retail-txns', date] })
      setDecisionTarget(null)
      setActionError(null)
    },
    onError: (err: Error) => setActionError(err.message),
  })

  const anyPending = requestVoid.isPending || approveVoid.isPending || denyVoid.isPending || confirmVoid.isPending

  // ── Export ───────────────────────────────────────────────────────────────────

  function exportCsv() {
    const rows = [
      ['Ref', 'Type', 'Time', 'Description', 'Payment', 'Total', 'Status'],
      ...filtered.map(t => {
        const isRx   = t._type === 'RX'
        const amount = isRx
          ? String((t as RxTransaction).patient_copay)
          : String((t as RetailTransaction).total)
        const desc = isRx
          ? `${(t as RxTransaction).drug_name} — ${(t as RxTransaction).patient_name}`
          : 'Retail sale'
        const rt     = t._type === 'RETAIL' ? (t as RetailTransaction) : null
        const status = t.voided          ? 'Voided'
          : rt?.void_denied_at           ? 'Void Denied'
          : rt?.void_requested_at        ? 'Void Pending'
          : 'Complete'
        return [t.ref_number, t._type, fmtTime(t.created_at), desc, t.payment_method ?? '', amount, status]
      }),
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a   = document.createElement('a')
    a.href = url; a.download = `transactions-${date}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div>
      <PageHeader
        title="Transaction Log"
        subtitle="Real-time record of all retail and Rx transactions"
        breadcrumb={['Retail POS', 'Transactions']}
        showSession
        cta={
          <div className="flex gap-2">
            <button
              onClick={() => { retail.refetch(); rx.refetch() }}
              className="btn btn-ghost gap-1.5"
              title="Refresh"
            >
              <ArrowClockwise size={14} className={isLoading ? 'animate-spin' : ''} aria-hidden="true" />
              Refresh
            </button>
            <button onClick={exportCsv} className="btn btn-ghost gap-1.5">
              <Export size={14} aria-hidden="true" />
              Export CSV
            </button>
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Retail Sales"
          value={fmtCurrency(totalRetail)}
          sub={`${(retail.data ?? []).filter(t => !t.voided).length} transactions`}
          icon={Receipt}
          accent="blue"
        />
        <MetricCard
          label="Rx Collections"
          value={fmtCurrency(totalRx)}
          sub={`${(rx.data ?? []).filter(t => !t.voided).length} dispensings`}
          icon={Pill}
          accent="green"
        />
        <MetricCard
          label="Combined Total"
          value={fmtCurrency(totalRetail + totalRx)}
          sub="excl. NHF subsidy"
          icon={CheckCircle}
          accent="blue"
        />
        <MetricCard
          label="Voided"
          value={String(voidCount)}
          sub={pendingVoidCount > 0 ? `${pendingVoidCount} awaiting approval` : 'no pending requests'}
          icon={Warning}
          accent={voidCount > 0 ? 'red' : 'blue'}
        />
      </div>

      {/* Action error */}
      {actionError && (
        <div className="card bg-red-50 border-red-200 px-4 py-3 mb-4 text-sm text-red-700 flex items-center justify-between gap-3">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} aria-label="Dismiss error">
            <X size={14} className="text-red-400 hover:text-red-600" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="card p-3 mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <MagnifyingGlass size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search ref or patient…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-7 w-56 text-xs"
            aria-label="Search transactions"
          />
        </div>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="input w-36 text-xs"
          aria-label="Filter by date"
        />
        <div className="flex gap-1" role="group" aria-label="Filter transactions">
          {(['ALL', 'RETAIL', 'RX', 'VOID', 'PENDING'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-ghost text-xs h-8 px-3 relative ${filter === f ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
              aria-pressed={filter === f}
            >
              {f === 'PENDING' ? 'Pending' : f}
              {f === 'PENDING' && pendingVoidCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5" aria-label={`${pendingVoidCount} pending`}>
                  {pendingVoidCount}
                </span>
              )}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} records — {fmtDate(date)}</span>
      </div>

      {/* Table */}
      {isError && (
        <div className="card p-4 text-sm text-red-600 bg-red-50">
          Failed to load transactions. Check your connection and try again.
        </div>
      )}

      {!isError && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-compact text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ref</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                      Loading transactions…
                    </td>
                  </tr>
                )}
                {!isLoading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                      No transactions found for this date and filter.
                    </td>
                  </tr>
                )}
                {filtered.map(t => {
                  const isRx   = t._type === 'RX'
                  const amount = isRx
                    ? (t as RxTransaction).patient_copay
                    : (t as RetailTransaction).total
                  const desc = isRx
                    ? `${(t as RxTransaction).drug_name} — ${(t as RxTransaction).patient_name}`
                    : 'Retail sale'
                  const rt        = t._type === 'RETAIL' ? (t as RetailTransaction) : null
                  const isPending = !!(rt?.void_requested_at && !rt.voided && !rt.void_denied_at)
                  const isDenied  = !!(rt?.void_denied_at && !rt.voided)

                  return (
                    <tr key={t.id} className={`hover:bg-gray-50 transition-colors ${t.voided ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-700">{t.ref_number}</td>
                      <td className="px-4 py-2.5">
                        <StatusPill label={isRx ? 'Rx' : 'Retail'} variant={isRx ? 'purple' : 'blue'} />
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{fmtTime(t.created_at)}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-700 max-w-48 truncate">{desc}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-600">
                        {t.payment_method ? PAY_LABEL[t.payment_method] : '—'}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs font-medium">
                        {t.voided
                          ? <span className="line-through text-gray-400">{fmtCurrency(amount)}</span>
                          : fmtCurrency(amount)
                        }
                      </td>
                      {/* Status */}
                      <td className="px-4 py-2.5">
                        {t.voided ? (
                          <StatusPill label="Voided" variant="red" />
                        ) : isPending ? (() => {
                          // Detect OTP state via void_otp_expires_at — not the OTP value itself
                          const hasOtpActive = !!(rt?.void_otp_expires_at)
                          return hasOtpActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                              <LockKey size={9} aria-hidden="true" />
                              Code Issued
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                              Void Pending
                            </span>
                          )
                        })() : isDenied ? (
                          <StatusPill label="Void Denied" variant="gray" />
                        ) : (
                          <StatusPill label="Complete" variant="green" />
                        )}
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-2.5">
                        {rt && !rt.voided && (() => {
                          // Use void_otp_expires_at to detect OTP state — void_otp value is server-only
                          const hasOtp = !!(rt.void_otp_expires_at)

                          if (isPending) {
                            // OTP issued — cashier can now enter the code
                            if (hasOtp && !canVoid) {
                              return (
                                <button
                                  onClick={() => { setActionError(null); setOtpTarget(rt) }}
                                  disabled={anyPending}
                                  className="btn btn-ghost text-xs h-7 px-2.5 text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 gap-1"
                                >
                                  <LockKey size={11} aria-hidden="true" />
                                  Enter Code
                                </button>
                              )
                            }
                            // Manager review button
                            return canVoid ? (
                              <button
                                onClick={() => { setActionError(null); setIssuedOtp(null); setDecisionTarget(rt) }}
                                disabled={anyPending}
                                className="btn btn-ghost text-xs h-7 px-2.5 text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100"
                              >
                                {hasOtp ? 'View Code' : 'Review'}
                              </button>
                            ) : (
                              <span className="text-xs text-amber-600 font-medium">Awaiting manager</span>
                            )
                          }
                          if (isDenied) {
                            return (
                              <button
                                onClick={() => { setActionError(null); setVoidTarget(rt) }}
                                disabled={anyPending}
                                className="btn btn-ghost text-xs h-7 px-2.5 text-gray-500 gap-1"
                                title={rt.void_denied_note ? `Denied: ${rt.void_denied_note}` : 'Denied — click to re-request'}
                              >
                                <ArrowBendUpLeft size={11} aria-hidden="true" />
                                Re-request
                              </button>
                            )
                          }
                          return (
                            <button
                              onClick={() => { setActionError(null); setVoidTarget(rt) }}
                              disabled={anyPending}
                              className="btn btn-ghost text-xs h-7 px-2.5 text-gray-400 hover:text-gray-700 gap-1"
                            >
                              <ArrowBendUpLeft size={11} aria-hidden="true" />
                              Request Void
                            </button>
                          )
                        })()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {voidTarget && (
        <VoidRequestModal
          tx={voidTarget}
          onClose={() => { setVoidTarget(null); setActionError(null) }}
          onSubmit={(reason, note) => requestVoid.mutate({ txId: voidTarget.id, reason, note })}
          isPending={requestVoid.isPending}
        />
      )}
      {decisionTarget && (
        <VoidDecisionModal
          tx={decisionTarget}
          onClose={() => { setDecisionTarget(null); setIssuedOtp(null); setActionError(null) }}
          onApprove={() => approveVoid.mutate(decisionTarget.id)}
          onDeny={note => denyVoid.mutate({ txId: decisionTarget.id, note })}
          isPending={approveVoid.isPending || denyVoid.isPending}
          issuedOtp={issuedOtp}
        />
      )}
      {otpTarget && (
        <VoidOtpConfirmModal
          tx={otpTarget}
          onClose={() => { setOtpTarget(null); setActionError(null) }}
          onConfirm={otp => confirmVoid.mutate({ txId: otpTarget.id, otp })}
          isPending={confirmVoid.isPending}
        />
      )}
    </div>
  )
}
