import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, X, ClipboardText } from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { todayJamaica } from '../../lib/date'
import { formatDrugName } from '../../lib/formatting'
import { PageHeader } from '../../components/Shell'

// ── Types ─────────────────────────────────────────────────────────────────────

interface SdlEntry {
  id: string
  entry_date: string
  drug_name: string
  strength: string | null
  quantity_in: number
  quantity_out: number
  balance: number
  patient_name: string | null
  prescriber_name: string | null
  prescriber_reg: string | null
  rx_ref: string | null
  pharmacist_name: string | null
  notes: string | null
  created_at: string
}

interface EntryForm {
  entry_date: string
  drug_name: string
  strength: string
  quantity_in: string
  quantity_out: string
  patient_name: string
  prescriber_name: string
  prescriber_reg: string
  rx_ref: string
  pharmacist_name: string
  notes: string
}

const EMPTY_FORM: EntryForm = {
  entry_date: todayJamaica(),
  drug_name: '',
  strength: '',
  quantity_in: '',
  quantity_out: '',
  patient_name: '',
  prescriber_name: '',
  prescriber_reg: '',
  rx_ref: '',
  pharmacist_name: '',
  notes: '',
}

// ── Add Entry Drawer ───────────────────────────────────────────────────────────

function AddEntryDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<EntryForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof EntryForm, string>>>({})

  function field<K extends keyof EntryForm>(k: K, v: EntryForm[K]) {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: undefined }))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof EntryForm, string>> = {}
    if (!form.drug_name.trim())    e.drug_name    = 'Required'
    if (!form.entry_date)          e.entry_date   = 'Required'
    const qIn  = parseInt(form.quantity_in  || '0')
    const qOut = parseInt(form.quantity_out || '0')
    if (isNaN(qIn)  || qIn  < 0)  e.quantity_in  = 'Must be 0 or more'
    if (isNaN(qOut) || qOut < 0)  e.quantity_out = 'Must be 0 or more'
    if (qIn === 0 && qOut === 0)   e.quantity_in  = 'At least one quantity required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const qIn  = parseInt(form.quantity_in  || '0')
      const qOut = parseInt(form.quantity_out || '0')
      const { error } = await supabase.from('schedule_drug_log').insert({
        entry_date:      form.entry_date,
        drug_name:       form.drug_name.trim(),
        strength:        form.strength.trim()        || null,
        quantity_in:     qIn,
        quantity_out:    qOut,
        balance:         qIn - qOut,
        patient_name:    form.patient_name.trim()    || null,
        prescriber_name: form.prescriber_name.trim() || null,
        prescriber_reg:  form.prescriber_reg.trim()  || null,
        rx_ref:          form.rx_ref.trim()           || null,
        pharmacist_name: form.pharmacist_name.trim()  || null,
        notes:           form.notes.trim()            || null,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule_drug_log'] })
      setForm(EMPTY_FORM)
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
        aria-label="Add schedule drug entry"
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-40 flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Add Entry</h2>
          <button className="btn btn-ghost p-2" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Date + Drug */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input type="date" className={`input w-full${errors.entry_date ? ' border-red-500' : ''}`}
                value={form.entry_date}
                onChange={e => field('entry_date', e.target.value)} />
              {errors.entry_date && <p className="mt-1 text-xs text-red-600">{errors.entry_date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Strength</label>
              <input type="text" className="input w-full" placeholder="e.g. 5mg"
                value={form.strength} onChange={e => field('strength', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Drug Name <span className="text-red-500">*</span>
            </label>
            <input type="text" className={`input w-full${errors.drug_name ? ' border-red-500' : ''}`}
              placeholder="e.g. Morphine Sulphate"
              value={form.drug_name} onChange={e => field('drug_name', e.target.value)} />
            {errors.drug_name && <p className="mt-1 text-xs text-red-600">{errors.drug_name}</p>}
          </div>

          {/* Quantities */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qty In</label>
              <input type="number" min="0" className={`input w-full${errors.quantity_in ? ' border-red-500' : ''}`}
                placeholder="0" value={form.quantity_in}
                onChange={e => field('quantity_in', e.target.value)} />
              {errors.quantity_in && <p className="mt-1 text-xs text-red-600">{errors.quantity_in}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qty Out</label>
              <input type="number" min="0" className={`input w-full${errors.quantity_out ? ' border-red-500' : ''}`}
                placeholder="0" value={form.quantity_out}
                onChange={e => field('quantity_out', e.target.value)} />
              {errors.quantity_out && <p className="mt-1 text-xs text-red-600">{errors.quantity_out}</p>}
            </div>
          </div>

          {/* Patient + Prescriber */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
            <input type="text" className="input w-full" placeholder="Full name"
              value={form.patient_name} onChange={e => field('patient_name', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prescriber</label>
              <input type="text" className="input w-full" placeholder="Dr. Name"
                value={form.prescriber_name} onChange={e => field('prescriber_name', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reg. No.</label>
              <input type="text" className="input w-full" placeholder="MC-XXXXX"
                value={form.prescriber_reg} onChange={e => field('prescriber_reg', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rx Ref</label>
              <input type="text" className="input w-full" placeholder="RX-XXXXXX"
                value={form.rx_ref} onChange={e => field('rx_ref', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacist</label>
              <input type="text" className="input w-full" placeholder="Full name"
                value={form.pharmacist_name} onChange={e => field('pharmacist_name', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea className="input w-full h-20 resize-none" placeholder="Any notes…"
              value={form.notes} onChange={e => field('notes', e.target.value)} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button className="btn btn-ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { if (validate()) mutation.mutate() }}
            disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : 'Save Entry'}
          </button>
        </div>
        {mutation.isError && (
          <p className="px-6 pb-3 text-xs text-red-600">Failed to save. Please try again.</p>
        )}
      </aside>
    </>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function ScheduleLog() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drugFilter, setDrugFilter] = useState('')

  const { data: entries = [], isLoading } = useQuery<SdlEntry[]>({
    queryKey: ['schedule_drug_log'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedule_drug_log')
        .select('*')
        .order('entry_date', { ascending: false })
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as SdlEntry[]
    },
  })

  const filtered = entries.filter(e =>
    !drugFilter || e.drug_name.toLowerCase().includes(drugFilter.toLowerCase())
  )

  function fmtDate(d: string) {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-JM', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Schedule Drug Log"
        subtitle="Controlled Substances Register — Jamaica Dangerous Drugs Act, Chapter 92 — Pharmacist signature required for all entries"
        breadcrumb={['Prescriptions', 'Schedule Log']}
        showSession
        cta={
          <button className="btn btn-primary flex items-center gap-2" onClick={() => setDrawerOpen(true)}>
            <Plus size={18} aria-hidden="true" />
            Add Entry
          </button>
        }
      />

      {/* Compliance notice */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <ClipboardText size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p>
          This is a controlled document under the Dangerous Drugs Act. All entries are permanent and auditable.
          Format sign-off pending (Gap G6). Do not use for live regulatory submission until pharmacist approval is recorded.
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <input
          type="text"
          className="input w-64"
          placeholder="Filter by drug name…"
          value={drugFilter}
          onChange={e => setDrugFilter(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-sm text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <ClipboardText size={40} className="mx-auto text-gray-300 mb-3" aria-hidden="true" />
            <p className="text-gray-500 text-sm">No entries yet. Add the first entry to begin the log.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-compact w-full text-sm" aria-label="Schedule drug log">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Drug / Strength</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">In</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Out</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Balance</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prescriber</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rx Ref</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pharmacist</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 font-mono text-xs text-gray-600">{fmtDate(e.entry_date)}</td>
                    <td className="px-4">
                      <p className="font-medium text-gray-900 text-xs">{formatDrugName(e.drug_name)}</p>
                      {e.strength && <p className="text-gray-400 text-xs">{e.strength}</p>}
                    </td>
                    <td className="px-4 text-right font-mono text-xs text-emerald-700">{e.quantity_in > 0 ? `+${e.quantity_in}` : '—'}</td>
                    <td className="px-4 text-right font-mono text-xs text-red-600">{e.quantity_out > 0 ? `-${e.quantity_out}` : '—'}</td>
                    <td className="px-4 text-right font-mono text-xs font-semibold text-gray-900">{e.balance}</td>
                    <td className="px-4 text-xs text-gray-600">{e.patient_name ?? '—'}</td>
                    <td className="px-4">
                      <p className="text-xs text-gray-600">{e.prescriber_name ?? '—'}</p>
                      {e.prescriber_reg && <p className="text-xs text-gray-400 font-mono">{e.prescriber_reg}</p>}
                    </td>
                    <td className="px-4 font-mono text-xs text-gray-500">{e.rx_ref ?? '—'}</td>
                    <td className="px-4 text-xs text-gray-600">{e.pharmacist_name ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddEntryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
