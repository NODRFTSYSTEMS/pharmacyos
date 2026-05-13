import { useState } from 'react'
import { Link } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, MagnifyingGlass, X,
  Pill as PillIcon, CheckCircle, XCircle, Warning, ArrowClockwise, LockSimple,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { PageHeader, MetricCard, Pill as StatusPill } from '../../components/Shell'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import type { Prescription, PrescriptionStatus } from '../../types/database'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isToday(dateStr: string | null): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth()    === now.getMonth() &&
    d.getDate()     === now.getDate()
  )
}

function fmtDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-JM', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  })
}

// ─── Status pill variant map ───────────────────────────────────────────────────

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
  READY:     'Ready',
  DISPENSED: 'Dispensed',
  CANCELLED: 'Cancelled',
}

// ─── Action button ────────────────────────────────────────────────────────────

interface AdvanceButtonProps {
  rx: Prescription
  onAdvance: (id: string, next: PrescriptionStatus) => void
  isPending: boolean
  isPharmacist: boolean
}

function AdvanceButton({ rx, onAdvance, isPending, isPharmacist }: AdvanceButtonProps) {
  if (rx.status === 'RECEIVED') {
    return (
      <button
        onClick={() => onAdvance(rx.id, 'VERIFYING')}
        disabled={isPending}
        className="btn btn-ghost text-xs h-7 px-2.5 gap-1"
        aria-label={`Begin verification of prescription ${rx.ref_number}`}
      >
        <ArrowClockwise size={12} aria-hidden="true" />
        Begin Verification
      </button>
    )
  }
  if (rx.status === 'VERIFYING') {
    return (
      <button
        onClick={() => onAdvance(rx.id, 'READY')}
        disabled={isPending}
        className="btn btn-ghost text-xs h-7 px-2.5 gap-1"
        aria-label={`Mark prescription ${rx.ref_number} as ready to dispense`}
      >
        <CheckCircle size={12} aria-hidden="true" />
        Mark Ready to Dispense
      </button>
    )
  }
  if (rx.status === 'READY') {
    if (!isPharmacist) {
      return (
        <span
          className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium"
          title="Dispensing requires a Pharmacist"
        >
          <LockSimple size={12} aria-hidden="true" />
          Pharmacist only
        </span>
      )
    }
    return (
      <button
        onClick={() => onAdvance(rx.id, 'DISPENSED')}
        disabled={isPending}
        className="btn btn-primary text-xs h-7 px-2.5 gap-1"
        aria-label={`Dispense prescription ${rx.ref_number}`}
      >
        <PillIcon size={12} aria-hidden="true" />
        Dispense
      </button>
    )
  }
  return null
}

// ─── Main page ────────────────────────────────────────────────────────────────

const ALL_STATUSES: Array<PrescriptionStatus | 'ALL'> = [
  'ALL', 'RECEIVED', 'VERIFYING', 'READY', 'DISPENSED', 'CANCELLED',
]

export default function Queue() {
  const qc = useQueryClient()
  const { data: currentUser } = useCurrentUser()
  const isPharmacist = currentUser?.role === 'PHARMACIST'

  const [search, setSearch]         = useState('')
  const [statusFilter, setStatusFilter] = useState<PrescriptionStatus | 'ALL'>('ALL')

  const { data: prescriptions, isLoading, isError } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      if (error) throw error
      return (data ?? []) as Prescription[]
    },
  })

  const allRx = prescriptions ?? []

  // Metric counts
  const counts: Record<PrescriptionStatus, number> = {
    RECEIVED:  allRx.filter(r => r.status === 'RECEIVED').length,
    VERIFYING: allRx.filter(r => r.status === 'VERIFYING').length,
    READY:     allRx.filter(r => r.status === 'READY').length,
    DISPENSED: allRx.filter(r => r.status === 'DISPENSED').length,
    CANCELLED: allRx.filter(r => r.status === 'CANCELLED').length,
  }
  const dispensedToday  = allRx.filter(r => r.status === 'DISPENSED' && isToday(r.dispensed_at)).length
  const cancelledToday  = allRx.filter(r => r.status === 'CANCELLED' && isToday(r.updated_at)).length

  // Filtered list
  const filtered = allRx.filter(r => {
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter
    const matchesSearch = !search || (() => {
      const q = search.toLowerCase()
      return (
        r.ref_number.toLowerCase().includes(q)       ||
        r.patient_name.toLowerCase().includes(q)     ||
        r.drug_name.toLowerCase().includes(q)
      )
    })()
    return matchesStatus && matchesSearch
  })

  // Status advance mutation
  const advance = useMutation({
    mutationFn: async ({ id, next }: { id: string; next: PrescriptionStatus }) => {
      const patch: Partial<Prescription> & { updated_at: string } = {
        status:     next,
        updated_at: new Date().toISOString(),
      }
      if (next === 'DISPENSED') {
        const { data: { user } } = await supabase.auth.getUser()
        patch.dispensed_at = new Date().toISOString()
        patch.dispensed_by = user?.id ?? null
      }
      const { error } = await supabase
        .from('prescriptions')
        .update(patch)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['prescriptions'] })
    },
  })

  return (
    <div>
      <PageHeader
        title="Prescription Queue"
        subtitle="Track and process incoming prescriptions"
        breadcrumb={['Prescriptions', 'Queue']}
        cta={
          <Link to="/prescriptions/new" className="btn btn-primary gap-2">
            <Plus size={14} weight="bold" />
            New Prescription
          </Link>
        }
      />

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <MetricCard
          label="Received"
          value={String(counts.RECEIVED)}
          accent="blue"
          icon={Warning}
        />
        <MetricCard
          label="Verifying"
          value={String(counts.VERIFYING)}
          accent="yellow"
          icon={ArrowClockwise}
        />
        <MetricCard
          label="Ready"
          value={String(counts.READY)}
          accent="green"
          icon={CheckCircle}
        />
        <MetricCard
          label="Dispensed Today"
          value={String(dispensedToday)}
          accent="blue"
          icon={PillIcon}
        />
        <MetricCard
          label="Cancelled Today"
          value={String(cancelledToday)}
          accent="red"
          icon={XCircle}
        />
      </div>

      {/* Status filter tabs */}
      <div
        className="flex flex-wrap gap-1.5 mb-4"
        role="tablist"
        aria-label="Filter by prescription status"
      >
        {ALL_STATUSES.map(s => (
          <button
            key={s}
            role="tab"
            aria-selected={statusFilter === s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s === 'ALL' ? 'All' : STATUS_LABEL[s]}
            {s !== 'ALL' && (
              <span className="ml-1.5 opacity-70">
                {s === 'DISPENSED' ? dispensedToday : s === 'CANCELLED' ? cancelledToday : counts[s]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="card p-3 mb-4 flex items-center gap-3 max-w-sm">
        <MagnifyingGlass size={14} className="text-gray-400 shrink-0" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search ref, patient, drug…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input border-0 p-0 focus:ring-0 shadow-none text-sm flex-1"
          aria-label="Search prescriptions"
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

      {/* Error state */}
      {isError && (
        <div className="card p-4 text-sm text-red-600 bg-red-50 mb-4">
          Failed to load prescriptions. Check your connection and try again.
        </div>
      )}

      {/* Advance mutation error */}
      {advance.isError && (
        <div className="card p-3 text-sm text-red-600 bg-red-50 mb-4">
          Failed to update status: {String((advance.error as Error).message)}
        </div>
      )}

      {/* Table */}
      {!isError && (
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="py-10 text-center text-sm text-gray-400">Loading prescriptions…</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <PillIcon size={36} className="text-gray-200 mx-auto mb-3" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-500">
                {search || statusFilter !== 'ALL'
                  ? 'No prescriptions match your filters'
                  : 'No prescriptions in the queue'}
              </p>
              {!search && statusFilter === 'ALL' && (
                <Link to="/prescriptions/new" className="btn btn-primary gap-2 mt-4 inline-flex">
                  <Plus size={14} weight="bold" />
                  New Prescription
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-compact text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ref</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Drug</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dosage</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prescriber</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Received</th>
                    <th className="px-4 py-3" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(rx => (
                    <tr key={rx.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link to={`/prescriptions/${rx.id}`} className="font-mono text-xs font-medium text-blue-600 hover:underline">
                          {rx.ref_number}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {rx.patient_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {rx.drug_name}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {rx.dosage ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-sm text-gray-700">
                        {rx.quantity}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        <p>{rx.prescriber_name}</p>
                        {rx.prescriber_reg && (
                          <p className="text-gray-400 font-mono">{rx.prescriber_reg}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill
                          label={STATUS_LABEL[rx.status]}
                          variant={STATUS_VARIANT[rx.status]}
                        />
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {fmtDate(rx.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <AdvanceButton
                          rx={rx}
                          onAdvance={(id, next) => advance.mutate({ id, next })}
                          isPending={advance.isPending}
                          isPharmacist={isPharmacist}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
