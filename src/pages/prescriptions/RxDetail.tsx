import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as Tooltip from '@radix-ui/react-tooltip'
import {
  ArrowLeft, ArrowClockwise, CheckCircle, Pill as PillIcon,
  XCircle, LockSimple, Warning, ClockCounterClockwise,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { PageHeader, Pill } from '../../components/Shell'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { AUDIT_ACTIONS } from '../../constants/audit-actions'
import { fmtJamaicaDate, fmtJamaicaTime } from '../../lib/date'
import type { Prescription, PrescriptionStatus } from '../../types/database'

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_VARIANT: Record<PrescriptionStatus, 'blue' | 'yellow' | 'green' | 'gray' | 'red'> = {
  RECEIVED:  'blue',
  VERIFYING: 'yellow',
  READY:     'green',
  DISPENSED: 'gray',
  CANCELLED: 'red',
}

const STATUS_LABEL: Record<PrescriptionStatus, string> = {
  RECEIVED:  'Received',
  VERIFYING: 'Verifying',
  READY:     'Ready to Dispense',
  DISPENSED: 'Dispensed',
  CANCELLED: 'Cancelled',
}

// The four active workflow steps — CANCELLED is handled separately as an exit state
const WORKFLOW_STEPS: PrescriptionStatus[] = ['RECEIVED', 'VERIFYING', 'READY', 'DISPENSED']

// ─── Status Stepper ───────────────────────────────────────────────────────────

interface StepperProps {
  current: PrescriptionStatus
}

function StatusStepper({ current }: StepperProps) {
  const isCancelled = current === 'CANCELLED'
  const currentIndex = WORKFLOW_STEPS.indexOf(current)

  return (
    <div className="flex items-center gap-0 mb-6" role="list" aria-label="Prescription workflow steps">
      {WORKFLOW_STEPS.map((step, idx) => {
        const isCompleted = !isCancelled && currentIndex > idx
        const isActive    = !isCancelled && currentIndex === idx

        const dotCls = isCompleted
          ? 'bg-emerald-500 border-emerald-500'
          : isActive
            ? 'bg-blue-600 border-blue-600'
            : 'bg-white border-gray-300'

        const labelCls = isActive
          ? 'text-blue-700 font-semibold'
          : isCompleted
            ? 'text-emerald-600 font-medium'
            : 'text-gray-400'

        const lineCls = isCompleted
          ? 'bg-emerald-400'
          : 'bg-gray-200'

        return (
          <div key={step} className="flex items-center" role="listitem">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${dotCls}`}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? (
                  <CheckCircle size={14} weight="fill" className="text-white" aria-hidden="true" />
                ) : (
                  <span className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {idx + 1}
                  </span>
                )}
              </div>
              <span className={`text-[11px] whitespace-nowrap ${labelCls}`}>
                {step === 'RECEIVED'  ? 'Received'  :
                 step === 'VERIFYING' ? 'Verifying' :
                 step === 'READY'     ? 'Ready'     : 'Dispensed'}
              </span>
            </div>
            {idx < WORKFLOW_STEPS.length - 1 && (
              <div className={`h-0.5 w-12 sm:w-20 mx-1 mb-5 transition-colors ${lineCls}`} aria-hidden="true" />
            )}
          </div>
        )
      })}

      {isCancelled && (
        <div className="ml-4 flex items-center gap-1.5 text-red-500">
          <XCircle size={18} weight="fill" aria-hidden="true" />
          <span className="text-xs font-semibold text-red-600">Cancelled</span>
        </div>
      )}
    </div>
  )
}

// ─── Detail row ───────────────────────────────────────────────────────────────

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-40 shrink-0">
        {label}
      </dt>
      <dd className="text-sm text-gray-800">{children}</dd>
    </div>
  )
}

// ─── Cancel confirmation dialog ───────────────────────────────────────────────

interface CancelDialogProps {
  onConfirm: () => void
  onDismiss: () => void
  isPending: boolean
}

function CancelDialog({ onConfirm, onDismiss, isPending }: CancelDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
        <div className="flex items-start gap-3 mb-4">
          <Warning size={22} weight="fill" className="text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h2 id="cancel-dialog-title" className="text-sm font-semibold text-gray-900 mb-1">
              Cancel this prescription?
            </h2>
            <p className="text-sm text-gray-500">
              This action cannot be undone. The prescription will be marked as cancelled and
              no further workflow steps can be taken.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onDismiss}
            disabled={isPending}
            className="btn btn-ghost"
          >
            Keep Prescription
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="btn btn-danger"
          >
            {isPending ? 'Cancelling…' : 'Yes, Cancel'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function RxDetail() {
  const { id }               = useParams<{ id: string }>()
  const navigate             = useNavigate()
  const qc                   = useQueryClient()
  const { data: currentUser } = useCurrentUser()

  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const isPharmacist =
    currentUser?.role === 'PHARMACIST' || currentUser?.role === 'ADMIN'

  // ── Fetch prescription ─────────────────────────────────────────────────────

  const { data: rx, isLoading, isError } = useQuery<Prescription | null>({
    queryKey: ['prescription', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error) throw error
      return data as Prescription | null
    },
    enabled: !!id,
  })

  // ── Advance status mutation (RECEIVED→VERIFYING, VERIFYING→READY) ─────────

  const advanceMutation = useMutation({
    mutationFn: async (next: PrescriptionStatus) => {
      if (!rx || !currentUser) throw new Error('Missing prescription or user context')

      const { error } = await supabase
        .from('prescriptions')
        .update({ status: next, updated_at: new Date().toISOString() })
        .eq('id', rx.id)
      if (error) throw error

      const { error: auditError } = await supabase
        .from('audit_log')
        .insert({
          actor_id:   currentUser.id,
          actor_name: currentUser.name,
          action:     AUDIT_ACTIONS.RX_STATUS_ADVANCE,
          table_name: 'prescriptions',
          record_id:  rx.id,
          details:    { ref_number: rx.ref_number, from: rx.status, to: next },
        })
      if (auditError) throw auditError
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['prescriptions'] })
      qc.invalidateQueries({ queryKey: ['prescription', id] })
    },
  })

  // ── Dispense mutation (READY→DISPENSED + rx_transaction + audit) ──────────

  const dispenseMutation = useMutation({
    mutationFn: async () => {
      if (!rx || !currentUser) throw new Error('Missing prescription or user context')

      const now = new Date().toISOString()

      // 1. Create rx_transaction record
      const { error: txError } = await supabase
        .from('rx_transactions')
        .insert({
          prescription_id:   rx.id,
          ref_number:        `${rx.ref_number}-TX`,
          patient_name:      rx.patient_name,
          drug_name:         rx.drug_name,
          quantity_dispensed: rx.quantity,
          cashier_id:        null,
          dispensed_by:      currentUser.id,
          subtotal:          0,
          nhf_subsidy:       0,
          patient_copay:     0,
          payment_method:    'CASH',
          voided:            false,
          voided_by:         null,
          voided_at:         null,
        })
      if (txError) throw txError

      // 2. Advance prescription to DISPENSED
      const { error: rxError } = await supabase
        .from('prescriptions')
        .update({
          status:       'DISPENSED',
          dispensed_by: currentUser.id,
          dispensed_at: now,
          updated_at:   now,
        })
        .eq('id', rx.id)
      if (rxError) throw rxError

      // 3. Write audit entry
      const { error: auditError } = await supabase
        .from('audit_log')
        .insert({
          actor_id:   currentUser.id,
          actor_name: currentUser.name,
          action:     AUDIT_ACTIONS.RX_DISPENSE,
          table_name: 'prescriptions',
          record_id:  rx.id,
          details:    {
            ref_number:    rx.ref_number,
            patient_name:  rx.patient_name,
            drug_name:     rx.drug_name,
            quantity:      rx.quantity,
          },
        })
      if (auditError) throw auditError
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['prescriptions'] })
      qc.invalidateQueries({ queryKey: ['prescription', id] })
    },
  })

  // ── Cancel mutation ────────────────────────────────────────────────────────

  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!rx || !currentUser) throw new Error('Missing prescription or user context')

      const { error } = await supabase
        .from('prescriptions')
        .update({ status: 'CANCELLED', updated_at: new Date().toISOString() })
        .eq('id', rx.id)
      if (error) throw error

      const { error: auditError } = await supabase
        .from('audit_log')
        .insert({
          actor_id:   currentUser.id,
          actor_name: currentUser.name,
          action:     AUDIT_ACTIONS.RX_CANCEL,
          table_name: 'prescriptions',
          record_id:  rx.id,
          details:    { ref_number: rx.ref_number, cancelled_from_status: rx.status },
        })
      if (auditError) throw auditError
    },
    onSuccess: () => {
      setShowCancelDialog(false)
      qc.invalidateQueries({ queryKey: ['prescriptions'] })
      qc.invalidateQueries({ queryKey: ['prescription', id] })
    },
  })

  const anyMutationPending =
    advanceMutation.isPending || dispenseMutation.isPending || cancelMutation.isPending

  // ─── Render states ─────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-gray-400">
        <ClockCounterClockwise size={18} className="animate-spin mr-2" aria-hidden="true" />
        Loading prescription…
      </div>
    )
  }

  if (isError) {
    return (
      <div className="card p-6 max-w-md">
        <p className="text-sm font-semibold text-red-700 mb-1">Failed to load prescription</p>
        <p className="text-xs text-gray-500 mb-4">
          A database error occurred. Check your connection and try again.
        </p>
        <button onClick={() => navigate(-1)} className="btn btn-ghost gap-2">
          <ArrowLeft size={14} aria-hidden="true" />
          Go Back
        </button>
      </div>
    )
  }

  if (!rx) {
    return (
      <div className="card p-6 max-w-md">
        <p className="text-sm font-semibold text-gray-800 mb-1">Prescription not found</p>
        <p className="text-xs text-gray-500 mb-4">
          No prescription exists with this ID. It may have been removed or the link is incorrect.
        </p>
        <Link to="/prescriptions" className="btn btn-ghost gap-2">
          <ArrowLeft size={14} aria-hidden="true" />
          Back to Queue
        </Link>
      </div>
    )
  }

  const isTerminal = rx.status === 'DISPENSED' || rx.status === 'CANCELLED'

  // ─── Main render ──────────────────────────────────────────────────────────

  return (
    <Tooltip.Provider delayDuration={200}>
      <div>
        {showCancelDialog && (
          <CancelDialog
            onConfirm={() => cancelMutation.mutate()}
            onDismiss={() => setShowCancelDialog(false)}
            isPending={cancelMutation.isPending}
          />
        )}

        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Link
            to="/prescriptions"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={12} aria-hidden="true" />
            Back to Queue
          </Link>
        </div>

        <PageHeader
          title="Prescription Detail"
          breadcrumb={['Prescriptions', rx.ref_number]}
        />

        {/* Mutation error banners */}
        {advanceMutation.isError && (
          <div className="card p-3 text-sm text-red-700 bg-red-50 mb-4" role="alert">
            Failed to advance status: {(advanceMutation.error as Error).message}
          </div>
        )}
        {dispenseMutation.isError && (
          <div className="card p-3 text-sm text-red-700 bg-red-50 mb-4" role="alert">
            Dispense failed: {(dispenseMutation.error as Error).message}
          </div>
        )}
        {cancelMutation.isError && (
          <div className="card p-3 text-sm text-red-700 bg-red-50 mb-4" role="alert">
            Cancellation failed: {(cancelMutation.error as Error).message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Left column: details ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Status stepper */}
            <div className="card p-5">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Workflow Status
              </h2>
              <StatusStepper current={rx.status} />

              {/* Terminal messages */}
              {rx.status === 'DISPENSED' && (
                <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded px-4 py-3 text-sm text-gray-700">
                  <CheckCircle size={16} weight="fill" className="text-emerald-500 mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-gray-800">Prescription dispensed</p>
                    {rx.dispensed_at && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {fmtJamaicaDate(rx.dispensed_at)} at {fmtJamaicaTime(rx.dispensed_at)}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {rx.status === 'CANCELLED' && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded px-4 py-3 text-sm text-red-800">
                  <XCircle size={16} weight="fill" className="text-red-500 mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-medium">Prescription cancelled</p>
                    <p className="text-xs text-red-600 mt-0.5">No further actions are available.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Prescription details */}
            <div className="card p-5">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Prescription Details
              </h2>
              <dl>
                <DetailRow label="Reference No.">
                  <span className="font-mono text-sm font-semibold text-gray-900">
                    {rx.ref_number}
                  </span>
                </DetailRow>

                <DetailRow label="Status">
                  <Pill label={STATUS_LABEL[rx.status]} variant={STATUS_VARIANT[rx.status]} />
                </DetailRow>

                <DetailRow label="Patient">
                  {rx.patient_name}
                </DetailRow>

                <DetailRow label="Drug">
                  <span className="font-mono text-sm">{rx.drug_name}</span>
                </DetailRow>

                <DetailRow label="Dosage">
                  {rx.dosage ?? <span className="text-gray-400">Not specified</span>}
                </DetailRow>

                <DetailRow label="Quantity">
                  <span className="tabular-nums font-medium">{rx.quantity}</span>
                </DetailRow>

                <DetailRow label="Prescriber">
                  <span className="font-medium">{rx.prescriber_name}</span>
                  {rx.prescriber_reg && (
                    <span className="ml-2 font-mono text-xs text-gray-500">
                      Reg. {rx.prescriber_reg}
                    </span>
                  )}
                </DetailRow>

                <DetailRow label="Issue Date">
                  {rx.issue_date
                    ? fmtJamaicaDate(rx.issue_date)
                    : <span className="text-gray-400">Not set</span>}
                </DetailRow>

                <DetailRow label="Expiry Date">
                  {rx.expiry_date
                    ? fmtJamaicaDate(rx.expiry_date)
                    : <span className="text-gray-400">Not set</span>}
                </DetailRow>

                <DetailRow label="Received">
                  {fmtJamaicaDate(rx.created_at)} at {fmtJamaicaTime(rx.created_at)}
                </DetailRow>

                {rx.status === 'DISPENSED' && rx.dispensed_at && (
                  <DetailRow label="Dispensed At">
                    {fmtJamaicaDate(rx.dispensed_at)} at {fmtJamaicaTime(rx.dispensed_at)}
                  </DetailRow>
                )}
              </dl>
            </div>

          </div>

          {/* ── Right column: actions ─────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="card p-5">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Actions
              </h2>

              {isTerminal ? (
                <p className="text-sm text-gray-400 italic">
                  No further actions available.
                </p>
              ) : (
                <div className="space-y-3">

                  {/* RECEIVED → VERIFYING */}
                  {rx.status === 'RECEIVED' && (
                    <button
                      onClick={() => advanceMutation.mutate('VERIFYING')}
                      disabled={anyMutationPending}
                      className="btn btn-primary w-full gap-2"
                      aria-label="Begin verification of this prescription"
                    >
                      <ArrowClockwise
                        size={15}
                        className={advanceMutation.isPending ? 'animate-spin' : ''}
                        aria-hidden="true"
                      />
                      {advanceMutation.isPending ? 'Updating…' : 'Begin Verification'}
                    </button>
                  )}

                  {/* VERIFYING → READY */}
                  {rx.status === 'VERIFYING' && (
                    <button
                      onClick={() => advanceMutation.mutate('READY')}
                      disabled={anyMutationPending}
                      className="btn btn-success w-full gap-2"
                      aria-label="Mark prescription as ready to dispense"
                    >
                      <CheckCircle
                        size={15}
                        weight="fill"
                        className={advanceMutation.isPending ? 'animate-spin' : ''}
                        aria-hidden="true"
                      />
                      {advanceMutation.isPending ? 'Updating…' : 'Mark Ready to Dispense'}
                    </button>
                  )}

                  {/* READY → DISPENSED (pharmacist only) */}
                  {rx.status === 'READY' && (
                    isPharmacist ? (
                      <button
                        onClick={() => dispenseMutation.mutate()}
                        disabled={anyMutationPending}
                        className="btn btn-success w-full gap-2"
                        aria-label="Confirm prescription dispensed"
                      >
                        <PillIcon
                          size={15}
                          weight="duotone"
                          className={dispenseMutation.isPending ? 'animate-spin' : ''}
                          aria-hidden="true"
                        />
                        {dispenseMutation.isPending ? 'Processing…' : 'Confirm Dispensed'}
                      </button>
                    ) : (
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <span className="block w-full" tabIndex={0}>
                            <button
                              disabled
                              className="btn btn-success w-full gap-2 opacity-50 cursor-not-allowed pointer-events-none"
                              aria-disabled="true"
                              aria-describedby="dispense-tooltip"
                            >
                              <LockSimple size={15} aria-hidden="true" />
                              Confirm Dispensed
                            </button>
                          </span>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            id="dispense-tooltip"
                            side="top"
                            className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded shadow-lg z-50 max-w-[200px] text-center"
                          >
                            Pharmacist authorization required
                            <Tooltip.Arrow className="fill-gray-900" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    )
                  )}

                  {/* Cancel — available for all active statuses */}
                  <button
                    onClick={() => setShowCancelDialog(true)}
                    disabled={anyMutationPending}
                    className="btn btn-danger w-full gap-2"
                    aria-label="Cancel this prescription"
                  >
                    <XCircle size={15} aria-hidden="true" />
                    Cancel Prescription
                  </button>

                </div>
              )}
            </div>

            {/* Quick facts card */}
            <div className="card p-4 space-y-2">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Quick Reference
              </h2>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Quantity</span>
                <span className="font-semibold tabular-nums text-gray-900">{rx.quantity} units</span>
              </div>
              {rx.prescriber_reg && (
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Prescriber Reg.</span>
                  <span className="font-mono font-medium text-gray-800">{rx.prescriber_reg}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Current Status</span>
                <Pill label={STATUS_LABEL[rx.status]} variant={STATUS_VARIANT[rx.status]} />
              </div>
              {rx.expiry_date && (
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Expires</span>
                  <span className="font-medium text-gray-800">{fmtJamaicaDate(rx.expiry_date)}</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </Tooltip.Provider>
  )
}

export default RxDetail
