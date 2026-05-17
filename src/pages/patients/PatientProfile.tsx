import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import {
  User, Pill as PillIcon, Shield, Lock, CaretLeft,
  Warning, CheckCircle, Clock, Export,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { formatPatientName } from '../../lib/formatting'
import { MedicationReferenceThumb } from '../../components/MedicationVisualReference'
import { PageHeader, Pill as StatusPill } from '../../components/Shell'
import { normalizeMedicationKey, useMedicationVisualReferences } from '../../hooks/useMedicationVisualReferences'
import { AUDIT_ACTIONS } from '../../constants/audit-actions'
import type { Patient, Prescription, PrescriptionStatus } from '../../types/database'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-JM', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-JM', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const RX_STATUS_VARIANT: Record<PrescriptionStatus, 'blue' | 'yellow' | 'green' | 'red' | 'gray' | 'purple'> = {
  RECEIVED:   'blue',
  VERIFYING:  'yellow',
  READY:      'purple',
  DISPENSED:  'green',
  CANCELLED:  'red',
}

// ── Tab types ─────────────────────────────────────────────────────────────────

type Tab = 'details' | 'medication' | 'insurance' | 'jdpa'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'details',    label: 'Details',           icon: User },
  { id: 'medication', label: 'Medication History', icon: PillIcon },
  { id: 'insurance',  label: 'Insurance',          icon: Shield },
  { id: 'jdpa',       label: 'JDPA',               icon: Lock },
]

// ── Details tab ───────────────────────────────────────────────────────────────

function DetailsTab({ patient }: { patient: Patient }) {
  const fields: { label: string; value: string | null }[] = [
    { label: 'First Name',     value: patient.first_name },
    { label: 'Last Name',      value: patient.last_name },
    { label: 'Date of Birth',  value: fmtDate(patient.date_of_birth) },
    { label: 'Phone',          value: patient.phone },
    { label: 'Address',        value: patient.address },
    { label: 'Allergies',      value: patient.allergies },
    { label: 'Notes',          value: patient.notes },
  ]

  return (
    <div className="card divide-y divide-gray-100">
      {fields.map(f => (
        <div key={f.label} className="flex items-start gap-4 px-5 py-3.5">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-36 shrink-0 pt-0.5">{f.label}</span>
          <span className="text-sm text-gray-800">{f.value ?? <span className="text-gray-300">—</span>}</span>
        </div>
      ))}
      <div className="flex items-center gap-4 px-5 py-3.5">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-36 shrink-0">Status</span>
        <StatusPill label={patient.is_active ? 'Active' : 'Inactive'} variant={patient.is_active ? 'green' : 'gray'} />
      </div>
      <div className="flex items-center gap-4 px-5 py-3.5">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-36 shrink-0">Registered</span>
        <span className="text-sm text-gray-600">{fmtDateTime(patient.created_at)}</span>
      </div>
    </div>
  )
}

// ── Medication History tab ────────────────────────────────────────────────────

function MedicationTab({ patientId }: { patientId: string }) {
  const { data: prescriptions = [], isLoading, isError } = useQuery<Prescription[]>({
    queryKey: ['patient-prescriptions', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as Prescription[]
    },
  })

  const medicationReferences = useMedicationVisualReferences(prescriptions.map(rx => rx.drug_name))

  if (isLoading) return <div className="py-8 text-center text-sm text-gray-400">Loading prescriptions…</div>
  if (isError)   return <div className="py-6 text-center text-sm text-red-600">Failed to load medication history.</div>
  if (prescriptions.length === 0) {
    return (
      <div className="card py-10 text-center">
        <PillIcon size={32} className="text-gray-200 mx-auto mb-2" aria-hidden="true" />
        <p className="text-sm text-gray-500">No prescriptions on record for this patient.</p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-label="Patient medication history">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ref</th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Visual</th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Drug</th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prescriber</th>
              <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue Date</th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {prescriptions.map(rx => (
              <tr key={rx.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{rx.ref_number}</td>
                <td className="px-4 py-3">
                  <MedicationReferenceThumb
                    drugName={rx.drug_name}
                    reference={medicationReferences.data?.[normalizeMedicationKey(rx.drug_name)]}
                  />
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-800">{rx.drug_name}</p>
                  {rx.dosage && <p className="text-xs text-gray-400">{rx.dosage}</p>}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  <p>{rx.prescriber_name}</p>
                  {rx.prescriber_reg && <p className="text-gray-400">{rx.prescriber_reg}</p>}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm text-gray-700">{rx.quantity}</td>
                <td className="px-4 py-3 text-xs text-gray-600 tabular-nums">{fmtDate(rx.issue_date)}</td>
                <td className="px-4 py-3">
                  <StatusPill
                    label={rx.status.charAt(0) + rx.status.slice(1).toLowerCase()}
                    variant={RX_STATUS_VARIANT[rx.status]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Insurance tab ─────────────────────────────────────────────────────────────

function InsuranceTab() {
  return (
    <div className="card p-6 text-center">
      <Shield size={36} weight="duotone" className="text-gray-200 mx-auto mb-3" aria-hidden="true" />
      <p className="text-sm font-medium text-gray-500">Insurance management coming soon</p>
      <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
        NHF card details and insurance provider records will be available in a future update.
      </p>
    </div>
  )
}

// ── JDPA tab ──────────────────────────────────────────────────────────────────

function JdpaTab({ patient }: { patient: Patient }) {
  const hasConsent = !!patient.jdpa_consent_at
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  async function handleExport() {
    if (!hasConsent) {
      setExportError('Cannot export: JDPA consent has not been recorded for this patient.')
      return
    }
    setExporting(true)
    setExportError(null)
    try {
      // Fetch all prescriptions linked to this patient
      const { data: prescriptions, error: rxErr } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('patient_id', patient.id)
        .order('created_at', { ascending: false })
      if (rxErr) throw rxErr

      // Assemble the export package
      const exportPackage = {
        export_generated_at: new Date().toISOString(),
        jdpa_notice: 'This data export is provided under the Jamaica Data Protection Act 2020. Handle in accordance with applicable data protection obligations.',
        patient,
        prescriptions: prescriptions ?? [],
        jdpa_consent_at: patient.jdpa_consent_at,
      }

      // Download as JSON
      const blob = new Blob([JSON.stringify(exportPackage, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `patient-data-${patient.id.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)

      // Write audit log entry
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('audit_log').insert({
        actor_id:   user?.id ?? null,
        actor_name: user?.email ?? 'System',
        action:     AUDIT_ACTIONS.PATIENT_DATA_EXPORT,
        table_name: 'patients',
        record_id:  patient.id,
        details: {
          patient_id:    patient.id,
          rx_count:      (prescriptions ?? []).length,
          has_consent:   hasConsent,
        },
      })
    } catch (err) {
      setExportError((err as Error).message ?? 'Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="card divide-y divide-gray-100">
      <div className="px-5 py-4">
        <div className="flex items-start gap-3">
          {hasConsent ? (
            <CheckCircle size={20} weight="duotone" className="text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <Warning size={20} weight="duotone" className="text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {hasConsent ? 'JDPA Consent Recorded' : 'JDPA Consent Not Yet Captured'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {hasConsent
                ? `Consent was recorded on ${fmtDateTime(patient.jdpa_consent_at!)}`
                : 'Patient has not yet provided data processing consent under the Jamaica Data Protection Act 2020.'
              }
            </p>
          </div>
        </div>
      </div>

      {!hasConsent && (
        <div className="px-5 py-4 bg-amber-50">
          <p className="text-xs text-amber-800">
            <strong>JDPA 2020 Notice:</strong> Patient data must only be processed with a lawful basis.
            Consent capture will be available after regulatory review is complete. Do not export or share patient records until consent is confirmed.
          </p>
        </div>
      )}

      <div className="px-5 py-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock size={13} aria-hidden="true" />
          <span>Patient registered: {fmtDateTime(patient.created_at)}</span>
        </div>
        {patient.jdpa_consent_at && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CheckCircle size={13} aria-hidden="true" />
            <span>Consent recorded: {fmtDateTime(patient.jdpa_consent_at)}</span>
          </div>
        )}
      </div>

      {/* C-1: Patient data export — JDPA right to access */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-gray-800">Export Patient Data</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Downloads patient record and prescription history as JSON. Audit-logged.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost gap-1.5 text-sm"
            onClick={handleExport}
            disabled={exporting || !hasConsent}
            aria-label="Export patient data as JSON"
          >
            {exporting
              ? <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" aria-hidden="true" />
              : <Export size={15} aria-hidden="true" />
            }
            {exporting ? 'Exporting…' : 'Export Patient Data'}
          </button>
        </div>
        {exportError && (
          <div role="alert" className="mt-3 bg-red-50 border border-red-200 rounded px-3 py-2 text-sm text-red-700">
            {exportError}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PatientProfile() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('details')

  const { data: patient, isLoading, isError } = useQuery<Patient | null>({
    queryKey: ['patient', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error) throw error
      return (data ?? null) as Patient | null
    },
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="py-10 text-center text-sm text-gray-400">Loading patient profile…</div>
    )
  }

  if (isError || !patient) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center">
        <Warning size={40} weight="duotone" className="text-red-400 mx-auto mb-3" aria-hidden="true" />
        <h2 className="text-base font-semibold text-gray-700 mb-1">Patient not found</h2>
        <p className="text-sm text-gray-500 mb-4">This patient record does not exist or you do not have access.</p>
        <Link to="/patients" className="btn btn-ghost gap-1.5">
          <CaretLeft size={13} aria-hidden="true" />
          Back to Patient List
        </Link>
      </div>
    )
  }

  const patientDisplayName = formatPatientName(patient.first_name, patient.last_name)

  return (
    <div>
      <PageHeader
        title={patientDisplayName}
        subtitle={`Patient ID: ${id?.slice(0, 8).toUpperCase()}`}
        breadcrumb={['Patients', patientDisplayName]}
        cta={
          <Link to="/patients" className="btn btn-ghost gap-1.5 text-sm">
            <CaretLeft size={13} aria-hidden="true" />
            Back to List
          </Link>
        }
      />

      {/* Tab navigation */}
      <div className="flex gap-1 mb-5 border-b border-gray-200" role="tablist" aria-label="Patient sections">
        {TABS.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={14} weight={activeTab === tab.id ? 'duotone' : 'regular'} aria-hidden="true" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div id={`tabpanel-${activeTab}`} role="tabpanel" aria-label={TABS.find(t => t.id === activeTab)?.label}>
        {activeTab === 'details'    && <DetailsTab patient={patient} />}
        {activeTab === 'medication' && <MedicationTab patientId={patient.id} />}
        {activeTab === 'insurance'  && <InsuranceTab />}
        {activeTab === 'jdpa'       && <JdpaTab patient={patient} />}
      </div>
    </div>
  )
}
