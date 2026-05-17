import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Shield, ArrowLeft, MagnifyingGlass, X, LinkSimple } from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { PageHeader } from '../../components/Shell'
import { AUDIT_ACTIONS } from '../../constants/audit-actions'

// ─── Form state type ───────────────────────────────────────────────────────────

type RxDraft = {
  patient_name:     string
  prescriber_name:  string
  prescriber_reg:   string
  drug_name:        string
  dosage:           string
  quantity:         number | ''
  issue_date:       string
  expiry_date:      string
  notes:            string
}

const BLANK: RxDraft = {
  patient_name:    '',
  prescriber_name: '',
  prescriber_reg:  '',
  drug_name:       '',
  dosage:          '',
  quantity:        '',
  issue_date:      '',
  expiry_date:     '',
  notes:           '',
}

// ─── Ref number generator ─────────────────────────────────────────────────────

function generateRef(): string {
  const now   = new Date()
  const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, '')
  const rand  = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `RX-${yymmdd}-${rand}`
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function NewPrescription() {
  const navigate  = useNavigate()
  const [form, setForm]     = useState<RxDraft>({ ...BLANK })
  const [errors, setErrors] = useState<Partial<Record<keyof RxDraft, string>>>({})

  // Patient registry linkage (optional — C-1)
  const [linkedPatientId, setLinkedPatientId] = useState<string | null>(null)
  const [linkedPatientName, setLinkedPatientName] = useState<string | null>(null)
  const [patientSearch, setPatientSearch] = useState('')

  interface PatientResult { id: string; first_name: string; last_name: string; date_of_birth: string | null }

  const { data: patientResults = [] } = useQuery<PatientResult[]>({
    queryKey: ['patient-search-rx', patientSearch],
    queryFn: async () => {
      const q = patientSearch.trim()
      const { data, error } = await supabase
        .from('patients')
        .select('id, first_name, last_name, date_of_birth')
        .eq('is_active', true)
        .or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%`)
        .order('last_name')
        .limit(8)
      if (error) throw error
      return (data ?? []) as PatientResult[]
    },
    enabled: patientSearch.trim().length >= 2 && !linkedPatientId,
    staleTime: 10_000,
  })

  function linkPatient(p: PatientResult) {
    const fullName = `${p.first_name} ${p.last_name}`
    setLinkedPatientId(p.id)
    setLinkedPatientName(fullName)
    set('patient_name', fullName)
    setPatientSearch('')
  }

  function unlinkPatient() {
    setLinkedPatientId(null)
    setLinkedPatientName(null)
    setPatientSearch('')
  }

  function set<K extends keyof RxDraft>(key: K, value: RxDraft[K]) {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
  }

  function validate(): boolean {
    const next: typeof errors = {}
    if (!form.patient_name.trim())    next.patient_name    = 'Patient name is required'
    if (!form.prescriber_name.trim()) next.prescriber_name = 'Prescriber name is required'
    if (!form.drug_name.trim())       next.drug_name       = 'Drug name is required'
    if (form.quantity === '' || Number(form.quantity) < 1) {
      next.quantity = 'Quantity must be at least 1'
    }
    if (!form.issue_date) next.issue_date = 'Issue date is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = useMutation({
    mutationFn: async () => {
      const payload = {
        ref_number:      generateRef(),
        patient_name:    form.patient_name.trim(),
        prescriber_name: form.prescriber_name.trim(),
        prescriber_reg:  form.prescriber_reg.trim() || null,
        drug_name:       form.drug_name.trim(),
        dosage:          form.dosage.trim() || null,
        quantity:        Number(form.quantity),
        issue_date:      form.issue_date,
        expiry_date:     form.expiry_date || null,
        notes:           form.notes.trim() || null,
        status:          'RECEIVED' as const,
        patient_id:      linkedPatientId,
        dispensed_by:    null,
        dispensed_at:    null,
        extraction_queue_id: null,
        created_at:      new Date().toISOString(),
        updated_at:      new Date().toISOString(),
      }
      const { data: rx, error } = await supabase
        .from('prescriptions')
        .insert([payload])
        .select('id')
        .single()
      if (error) throw error
      const { data: { user } } = await supabase.auth.getUser()
      const { error: auditError } = await supabase.from('audit_log').insert({
        actor_id:   user?.id ?? null,
        actor_name: user?.email ?? 'System',
        action:     AUDIT_ACTIONS.RX_CREATE,
        table_name: 'prescriptions',
        record_id:  rx.id,
        details:    { ref_number: payload.ref_number, drug_name: payload.drug_name, quantity: payload.quantity },
      })
      if (auditError) console.error('audit_log write failed', auditError)
    },
    onSuccess: () => {
      navigate('/prescriptions')
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) submit.mutate()
  }

  return (
    <div>
      <PageHeader
        title="New Prescription"
        subtitle="Enter prescription details for processing"
        breadcrumb={['Prescriptions', 'New Rx']}
      />

      {/* Back link */}
      <Link
        to="/prescriptions"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5 transition-colors"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to Queue
      </Link>

      {/* JDPA notice banner */}
      <div
        role="note"
        aria-label="Data protection notice"
        className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 max-w-2xl"
      >
        <Shield
          size={18}
          weight="duotone"
          className="text-amber-600 shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <p className="text-sm text-amber-800 leading-relaxed">
          Patient names and prescriber details are collected under the{' '}
          <strong>Jamaica Data Protection Act 2020</strong> for the purpose of dispensing
          and records. Data is retained for a minimum of 2 years.
        </p>
      </div>

      {/* Form card */}
      <div className="card p-6 max-w-2xl">
        <form id="new-rx-form" onSubmit={handleSubmit} noValidate className="space-y-6">

          {/* Section: Prescription Details */}
          <section aria-labelledby="rx-details-heading">
            <h2 id="rx-details-heading" className="section-title mb-4">
              Prescription Details
            </h2>

            <div className="space-y-4">
              {/* Patient registry link (optional) */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <LinkSimple size={13} aria-hidden="true" />
                  Link to Patient Registry
                  <span className="font-normal normal-case text-gray-400">(optional)</span>
                </p>
                {linkedPatientId ? (
                  <div className="flex items-center justify-between gap-2 bg-blue-50 border border-blue-200 rounded px-3 py-2">
                    <span className="text-sm font-medium text-blue-800">{linkedPatientName}</span>
                    <button
                      type="button"
                      onClick={unlinkPatient}
                      className="p-1 text-blue-400 hover:text-blue-600"
                      aria-label="Unlink patient"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="relative">
                      <MagnifyingGlass size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true" />
                      <input
                        type="search"
                        placeholder="Search by name…"
                        value={patientSearch}
                        onChange={e => setPatientSearch(e.target.value)}
                        className="input pl-8 w-full text-sm"
                        aria-label="Search patient registry"
                      />
                    </div>
                    {patientSearch.trim().length >= 2 && (
                      <div className="border border-gray-200 rounded-lg mt-1 overflow-hidden bg-white">
                        {patientResults.length === 0 ? (
                          <p className="px-3 py-2.5 text-xs text-gray-400 text-center">No matching patients found</p>
                        ) : (
                          patientResults.map(p => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => linkPatient(p)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-800">{p.first_name} {p.last_name}</p>
                                {p.date_of_birth && (
                                  <p className="text-xs text-gray-400">DOB: {new Date(p.date_of_birth).toLocaleDateString('en-JM')}</p>
                                )}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                    {patientSearch.trim().length < 2 && (
                      <p className="text-xs text-gray-400 mt-1">Type at least 2 characters to search</p>
                    )}
                  </div>
                )}
              </div>

              {/* Patient Name — full width */}
              <div>
                <label htmlFor="rx-patient" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Patient Name *
                </label>
                <input
                  id="rx-patient"
                  type="text"
                  autoFocus
                  value={form.patient_name}
                  onChange={e => set('patient_name', e.target.value)}
                  placeholder="Full name as on prescription"
                  className={`input ${errors.patient_name ? 'border-red-400 focus:border-red-400' : ''}`}
                  aria-describedby={errors.patient_name ? 'rx-patient-err' : undefined}
                  aria-invalid={!!errors.patient_name}
                />
                {linkedPatientId && (
                  <p className="text-xs text-blue-600 mt-1">Linked to patient registry — edit to override name on this Rx.</p>
                )}
                {errors.patient_name && (
                  <p id="rx-patient-err" className="text-xs text-red-500 mt-1" role="alert">
                    {errors.patient_name}
                  </p>
                )}
              </div>

              {/* Prescriber Name + Reg # */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rx-prescriber" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Prescriber Name *
                  </label>
                  <input
                    id="rx-prescriber"
                    type="text"
                    value={form.prescriber_name}
                    onChange={e => set('prescriber_name', e.target.value)}
                    placeholder="Dr. Full Name"
                    className={`input ${errors.prescriber_name ? 'border-red-400 focus:border-red-400' : ''}`}
                    aria-describedby={errors.prescriber_name ? 'rx-prescriber-err' : undefined}
                    aria-invalid={!!errors.prescriber_name}
                  />
                  {errors.prescriber_name && (
                    <p id="rx-prescriber-err" className="text-xs text-red-500 mt-1" role="alert">
                      {errors.prescriber_name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="rx-reg" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Prescriber Reg #
                  </label>
                  <input
                    id="rx-reg"
                    type="text"
                    value={form.prescriber_reg}
                    onChange={e => set('prescriber_reg', e.target.value)}
                    placeholder="Medical Council number"
                    className="input font-mono"
                  />
                </div>
              </div>

              {/* Drug Name + Dosage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rx-drug" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Drug Name *
                  </label>
                  <input
                    id="rx-drug"
                    type="text"
                    value={form.drug_name}
                    onChange={e => set('drug_name', e.target.value)}
                    placeholder="e.g. Amoxicillin 500mg"
                    className={`input ${errors.drug_name ? 'border-red-400 focus:border-red-400' : ''}`}
                    aria-describedby={errors.drug_name ? 'rx-drug-err' : undefined}
                    aria-invalid={!!errors.drug_name}
                  />
                  {errors.drug_name && (
                    <p id="rx-drug-err" className="text-xs text-red-500 mt-1" role="alert">
                      {errors.drug_name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="rx-dosage" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Dosage / Instructions
                  </label>
                  <input
                    id="rx-dosage"
                    type="text"
                    value={form.dosage}
                    onChange={e => set('dosage', e.target.value)}
                    placeholder="e.g. 1 capsule three times daily"
                    className="input"
                  />
                </div>
              </div>

              {/* Quantity + Issue Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rx-qty" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Quantity *
                  </label>
                  <input
                    id="rx-qty"
                    type="number"
                    min={1}
                    step={1}
                    value={form.quantity}
                    onChange={e => set('quantity', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 21"
                    className={`input ${errors.quantity ? 'border-red-400 focus:border-red-400' : ''}`}
                    aria-describedby={errors.quantity ? 'rx-qty-err' : undefined}
                    aria-invalid={!!errors.quantity}
                  />
                  {errors.quantity && (
                    <p id="rx-qty-err" className="text-xs text-red-500 mt-1" role="alert">
                      {errors.quantity}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="rx-issue" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Issue Date *
                  </label>
                  <input
                    id="rx-issue"
                    type="date"
                    value={form.issue_date}
                    onChange={e => set('issue_date', e.target.value)}
                    className={`input ${errors.issue_date ? 'border-red-400 focus:border-red-400' : ''}`}
                    aria-describedby={errors.issue_date ? 'rx-issue-err' : undefined}
                    aria-invalid={!!errors.issue_date}
                  />
                  {errors.issue_date && (
                    <p id="rx-issue-err" className="text-xs text-red-500 mt-1" role="alert">
                      {errors.issue_date}
                    </p>
                  )}
                </div>
              </div>

              {/* Expiry Date */}
              <div className="max-w-xs">
                <label htmlFor="rx-expiry" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Expiry Date <span className="font-normal normal-case">(optional)</span>
                </label>
                <input
                  id="rx-expiry"
                  type="date"
                  value={form.expiry_date}
                  onChange={e => set('expiry_date', e.target.value)}
                  className="input"
                />
              </div>
            </div>
          </section>

          {/* Section: Additional */}
          <section aria-labelledby="rx-additional-heading">
            <h2 id="rx-additional-heading" className="section-title mb-4">
              Additional
            </h2>

            <div>
              <label htmlFor="rx-notes" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Notes
              </label>
              <textarea
                id="rx-notes"
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Allergies, special handling instructions, patient notes…"
                rows={3}
                className="input h-auto py-2 resize-none"
              />
            </div>
          </section>

          {/* Server error */}
          {submit.isError && (
            <div
              className="bg-red-50 border border-red-200 rounded px-3 py-2.5 text-sm text-red-700"
              role="alert"
            >
              Failed to add prescription: {String((submit.error as Error).message)}
            </div>
          )}

          {/* Submit */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              form="new-rx-form"
              disabled={submit.isPending}
              className="btn btn-primary w-full gap-2 justify-center"
            >
              {submit.isPending && (
                <span
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />
              )}
              {submit.isPending ? 'Adding to Queue…' : 'Add to Queue'}
            </button>
            <Link
              to="/prescriptions"
              className="block text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  )
}
