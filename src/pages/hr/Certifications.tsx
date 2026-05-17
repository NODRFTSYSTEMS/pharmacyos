import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Certificate, Plus, X, Warning, CheckCircle, PencilSimple,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { PageHeader, Pill as StatusPill } from '../../components/Shell'
import { usePermission } from '../../hooks/usePermission'
import { AUDIT_ACTIONS } from '../../constants/audit-actions'

// ── Types ─────────────────────────────────────────────────────────────────────

type CertStatus = 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'RENEWED'

interface CertRecord {
  id: string
  staff_id: string
  staff_name: string
  cert_type: string
  cert_number: string | null
  issued_by: string | null
  issued_date: string | null
  expiry_date: string
  alert_days: number
  status: CertStatus
  notes: string | null
  updated_at: string
}

interface StaffProfile {
  id: string
  full_name: string
  role: string
}

interface DrawerState {
  staff_id: string
  staff_name: string
  cert_type: string
  cert_number: string
  issued_by: string
  issued_date: string
  expiry_date: string
  alert_days: string
  notes: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-JM', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000)
}

const STATUS_VARIANT: Record<CertStatus, 'green' | 'yellow' | 'red' | 'blue'> = {
  VALID:          'green',
  EXPIRING_SOON:  'yellow',
  EXPIRED:        'red',
  RENEWED:        'blue',
}

// ── Add / Edit Certification Drawer ──────────────────────────────────────────

function CertDrawer({
  open,
  editTarget,
  staffList,
  onClose,
}: {
  open: boolean
  editTarget: CertRecord | null
  staffList: StaffProfile[]
  onClose: () => void
}) {
  const qc = useQueryClient()
  const [form, setForm] = useState<DrawerState>({
    staff_id: '', staff_name: '', cert_type: '', cert_number: '',
    issued_by: '', issued_date: '', expiry_date: '', alert_days: '60', notes: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof DrawerState, string>>>({})

  // Sync form when drawer opens
  useState(() => {
    if (open) {
      if (editTarget) {
        setForm({
          staff_id:   editTarget.staff_id,
          staff_name: editTarget.staff_name,
          cert_type:  editTarget.cert_type,
          cert_number: editTarget.cert_number ?? '',
          issued_by:  editTarget.issued_by ?? '',
          issued_date: editTarget.issued_date ?? '',
          expiry_date: editTarget.expiry_date,
          alert_days:  String(editTarget.alert_days),
          notes:       editTarget.notes ?? '',
        })
      } else {
        setForm({
          staff_id: '', staff_name: '', cert_type: '', cert_number: '',
          issued_by: '', issued_date: '', expiry_date: '', alert_days: '60', notes: '',
        })
      }
      setErrors({})
    }
  })

  function set<K extends keyof DrawerState>(k: K, v: DrawerState[K]) {
    setForm(prev => ({ ...prev, [k]: v }))
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: undefined }))
  }

  function handleStaffChange(staffId: string) {
    const staff = staffList.find(s => s.id === staffId)
    setForm(prev => ({ ...prev, staff_id: staffId, staff_name: staff?.full_name ?? '' }))
  }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.staff_id)    e.staff_id    = 'Staff member is required'
    if (!form.cert_type.trim()) e.cert_type = 'Certificate type is required'
    if (!form.expiry_date) e.expiry_date  = 'Expiry date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function computeStatus(expiry: string, alertDays: number): CertStatus {
    const days = daysUntil(expiry)
    if (days < 0)          return 'EXPIRED'
    if (days <= alertDays) return 'EXPIRING_SOON'
    return 'VALID'
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const alertDays = parseInt(form.alert_days, 10) || 60
      const status = computeStatus(form.expiry_date, alertDays)
      const payload = {
        staff_id:    form.staff_id,
        staff_name:  form.staff_name,
        cert_type:   form.cert_type.trim(),
        cert_number: form.cert_number.trim() || null,
        issued_by:   form.issued_by.trim()   || null,
        issued_date: form.issued_date        || null,
        expiry_date: form.expiry_date,
        alert_days:  alertDays,
        status,
        notes:       form.notes.trim()       || null,
        updated_at:  new Date().toISOString(),
      }

      if (editTarget) {
        const { error } = await supabase
          .from('staff_certifications')
          .update(payload)
          .eq('id', editTarget.id)
        if (error) throw error
        const { error: auditError } = await supabase.from('audit_log').insert({
          actor_id:   user?.id ?? null,
          actor_name: user?.email ?? 'System',
          action:     AUDIT_ACTIONS.CERT_UPDATE,
          table_name: 'staff_certifications',
          record_id:  editTarget.id,
          details:    { cert_type: payload.cert_type, expiry_date: payload.expiry_date, status },
        })
        if (auditError) console.error('audit_log write failed', auditError)
      } else {
        const { data: inserted, error } = await supabase
          .from('staff_certifications')
          .insert(payload)
          .select('id')
          .single()
        if (error) throw error
        const { error: auditError } = await supabase.from('audit_log').insert({
          actor_id:   user?.id ?? null,
          actor_name: user?.email ?? 'System',
          action:     AUDIT_ACTIONS.CERT_CREATE,
          table_name: 'staff_certifications',
          record_id:  inserted.id,
          details:    { staff_name: payload.staff_name, cert_type: payload.cert_type, expiry_date: payload.expiry_date },
        })
        if (auditError) console.error('audit_log write failed', auditError)
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff_certifications'] })
      onClose()
    },
  })

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-30" aria-hidden="true" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={editTarget ? 'Edit certification' : 'Add certification'}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-40 flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {editTarget ? 'Edit Certification' : 'Add Certification'}
          </h2>
          <button className="btn btn-ghost p-2" onClick={onClose} aria-label="Close">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Staff member */}
          <div>
            <label htmlFor="c-staff" className="block text-sm font-medium text-gray-700 mb-1">
              Staff Member <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <select
              id="c-staff"
              className={`input w-full ${errors.staff_id ? 'border-red-400' : ''}`}
              value={form.staff_id}
              onChange={e => handleStaffChange(e.target.value)}
              disabled={!!editTarget}
            >
              <option value="">— Select staff member —</option>
              {staffList.map(s => (
                <option key={s.id} value={s.id}>{s.full_name} ({s.role})</option>
              ))}
            </select>
            {errors.staff_id && <p className="mt-1 text-xs text-red-600" role="alert">{errors.staff_id}</p>}
          </div>

          {/* Certificate type */}
          <div>
            <label htmlFor="c-type" className="block text-sm font-medium text-gray-700 mb-1">
              Certificate / Licence Type <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="c-type"
              type="text"
              className={`input w-full ${errors.cert_type ? 'border-red-400' : ''}`}
              placeholder="e.g. Pharmacist Licence, CPD Certificate"
              value={form.cert_type}
              onChange={e => set('cert_type', e.target.value)}
            />
            {errors.cert_type && <p className="mt-1 text-xs text-red-600" role="alert">{errors.cert_type}</p>}
          </div>

          {/* Cert number + issued by */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="c-number" className="block text-sm font-medium text-gray-700 mb-1">
                Licence / Cert No.
              </label>
              <input
                id="c-number"
                type="text"
                className="input w-full font-mono"
                placeholder="e.g. PCJ-2024-00123"
                value={form.cert_number}
                onChange={e => set('cert_number', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="c-issuer" className="block text-sm font-medium text-gray-700 mb-1">
                Issued By
              </label>
              <input
                id="c-issuer"
                type="text"
                className="input w-full"
                placeholder="Issuing authority"
                value={form.issued_by}
                onChange={e => set('issued_by', e.target.value)}
              />
            </div>
          </div>

          {/* Issued date + expiry date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="c-issued" className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date
              </label>
              <input
                id="c-issued"
                type="date"
                className="input w-full"
                value={form.issued_date}
                onChange={e => set('issued_date', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="c-expiry" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="c-expiry"
                type="date"
                className={`input w-full ${errors.expiry_date ? 'border-red-400' : ''}`}
                value={form.expiry_date}
                onChange={e => set('expiry_date', e.target.value)}
              />
              {errors.expiry_date && <p className="mt-1 text-xs text-red-600" role="alert">{errors.expiry_date}</p>}
            </div>
          </div>

          {/* Alert days */}
          <div>
            <label htmlFor="c-alert" className="block text-sm font-medium text-gray-700 mb-1">
              Alert Before Expiry
            </label>
            <div className="flex items-center gap-2">
              <input
                id="c-alert"
                type="number"
                min={7}
                max={365}
                className="input w-24"
                value={form.alert_days}
                onChange={e => set('alert_days', e.target.value)}
              />
              <span className="text-sm text-gray-500">days before expiry</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="c-notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              id="c-notes"
              rows={2}
              className="input w-full resize-none"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button className="btn btn-ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={() => { if (validate()) mutation.mutate() }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
        {mutation.isError && (
          <p className="px-6 pb-3 text-xs text-red-600" role="alert">Failed to save. Please try again.</p>
        )}
      </aside>
    </>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Certifications() {
  const canManage = usePermission('staff_manage')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<CertRecord | null>(null)

  const { data: certs = [], isLoading } = useQuery<CertRecord[]>({
    queryKey: ['staff_certifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_certifications')
        .select('*')
        .order('expiry_date', { ascending: true })
      if (error) throw error
      return (data ?? []) as CertRecord[]
    },
  })

  const { data: staffList = [] } = useQuery<StaffProfile[]>({
    queryKey: ['staff_profiles_list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_profiles')
        .select('id, full_name, role')
        .eq('is_active', true)
        .order('full_name')
      if (error) throw error
      return (data ?? []) as StaffProfile[]
    },
    enabled: canManage,
  })

  const expired      = certs.filter(c => c.status === 'EXPIRED')
  const expiringSoon = certs.filter(c => c.status === 'EXPIRING_SOON')

  function openAdd() { setEditTarget(null); setDrawerOpen(true) }
  function openEdit(c: CertRecord) { setEditTarget(c); setDrawerOpen(true) }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Licences & Certifications"
        subtitle="Track staff professional credentials and renewal dates"
        breadcrumb={['HR', 'Certifications']}
        cta={canManage ? (
          <button className="btn btn-primary flex items-center gap-2" onClick={openAdd}>
            <Plus size={18} aria-hidden="true" />
            Add Certification
          </button>
        ) : undefined}
      />

      {/* Critical alerts */}
      {expired.length > 0 && (
        <div
          role="alert"
          className="flex items-start gap-3 bg-red-50 border border-red-300 rounded-lg px-4 py-3"
        >
          <Warning size={18} weight="duotone" className="text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              {expired.length} expired credential{expired.length !== 1 ? 's' : ''} — action required
            </p>
            <p className="text-xs text-red-700 mt-0.5">
              {expired.map(c => `${c.staff_name} — ${c.cert_type}`).join('; ')}
            </p>
          </div>
        </div>
      )}

      {expiringSoon.length > 0 && (
        <div
          role="alert"
          className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3"
        >
          <Warning size={18} weight="duotone" className="text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {expiringSoon.length} credential{expiringSoon.length !== 1 ? 's' : ''} expiring soon
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              {expiringSoon.map(c => {
                const days = daysUntil(c.expiry_date)
                return `${c.staff_name} — ${c.cert_type} (${days} day${days !== 1 ? 's' : ''})`
              }).join('; ')}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-gray-400">Loading…</div>
        ) : certs.length === 0 ? (
          <div className="py-12 text-center">
            <Certificate size={40} className="mx-auto text-gray-200 mb-3" aria-hidden="true" />
            <p className="text-sm text-gray-400 mb-4">No certifications on record.</p>
            {canManage && (
              <button className="btn btn-primary gap-2 text-sm" onClick={openAdd}>
                <Plus size={14} weight="bold" />
                Add First Certification
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-compact w-full" aria-label="Staff certifications">
              <thead>
                <tr>
                  <th scope="col" className="text-left">Staff Member</th>
                  <th scope="col" className="text-left">Credential</th>
                  <th scope="col" className="text-left">Licence No.</th>
                  <th scope="col" className="text-left">Issued By</th>
                  <th scope="col" className="text-left">Expiry</th>
                  <th scope="col" className="text-left">Days Left</th>
                  <th scope="col" className="text-left">Status</th>
                  {canManage && <th scope="col" className="text-right">Edit</th>}
                </tr>
              </thead>
              <tbody>
                {certs.map(c => {
                  const days = daysUntil(c.expiry_date)
                  return (
                    <tr key={c.id} className={c.status === 'EXPIRED' ? 'bg-red-50/40' : c.status === 'EXPIRING_SOON' ? 'bg-amber-50/30' : ''}>
                      <td className="font-medium text-gray-900">{c.staff_name}</td>
                      <td className="text-gray-800">{c.cert_type}</td>
                      <td className="font-mono text-xs text-gray-500">{c.cert_number ?? '—'}</td>
                      <td className="text-gray-500 text-xs">{c.issued_by ?? '—'}</td>
                      <td className="text-gray-600">{fmtDate(c.expiry_date)}</td>
                      <td>
                        {days < 0 ? (
                          <span className="text-xs font-semibold text-red-600">{Math.abs(days)}d overdue</span>
                        ) : (
                          <span className={`text-xs font-medium num ${days <= c.alert_days ? 'text-amber-600' : 'text-gray-600'}`}>
                            {days}d
                          </span>
                        )}
                      </td>
                      <td>
                        <StatusPill
                          label={
                            c.status === 'EXPIRING_SOON' ? 'Expiring Soon'
                            : c.status === 'VALID' ? 'Valid'
                            : c.status === 'EXPIRED' ? 'Expired'
                            : 'Renewed'
                          }
                          variant={STATUS_VARIANT[c.status]}
                        />
                      </td>
                      {canManage && (
                        <td className="text-right">
                          <button
                            className="btn btn-ghost p-1.5"
                            onClick={() => openEdit(c)}
                            aria-label={`Edit ${c.cert_type} for ${c.staff_name}`}
                          >
                            <PencilSimple size={15} aria-hidden="true" />
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Valid certs summary */}
      {certs.filter(c => c.status === 'VALID' || c.status === 'RENEWED').length > 0 && (
        <div className="flex items-center gap-2 text-xs text-emerald-700">
          <CheckCircle size={14} weight="duotone" aria-hidden="true" />
          {certs.filter(c => c.status === 'VALID' || c.status === 'RENEWED').length} credential{certs.filter(c => c.status === 'VALID' || c.status === 'RENEWED').length !== 1 ? 's' : ''} current
        </div>
      )}

      {canManage && (
        <CertDrawer
          open={drawerOpen}
          editTarget={editTarget}
          staffList={staffList}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </div>
  )
}
