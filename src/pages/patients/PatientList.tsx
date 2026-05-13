import { useState } from 'react'
import { Link } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, MagnifyingGlass, X, PencilSimple, Users, Warning, Shield,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { PageHeader, Pill as StatusPill, MetricCard } from '../../components/Shell'
import type { Patient } from '../../types/database'

// ── Edit Patient Drawer ───────────────────────────────────────────────────────

interface EditDrawerProps {
  patient: Patient
  onClose: () => void
}

interface EditFormState {
  first_name: string
  last_name: string
  date_of_birth: string
  phone: string
  address: string
  allergies: string
  notes: string
  is_active: boolean
}

function EditPatientDrawer({ patient, onClose }: EditDrawerProps) {
  const qc = useQueryClient()
  const [form, setForm] = useState<EditFormState>({
    first_name:    patient.first_name,
    last_name:     patient.last_name,
    date_of_birth: patient.date_of_birth ?? '',
    phone:         patient.phone ?? '',
    address:       patient.address ?? '',
    allergies:     patient.allergies ?? '',
    notes:         patient.notes ?? '',
    is_active:     patient.is_active,
  })
  const [submitError, setSubmitError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async (values: EditFormState) => {
      const { error } = await supabase
        .from('patients')
        .update({
          first_name:    values.first_name.trim(),
          last_name:     values.last_name.trim(),
          date_of_birth: values.date_of_birth || null,
          phone:         values.phone.trim() || null,
          address:       values.address.trim() || null,
          allergies:     values.allergies.trim() || null,
          notes:         values.notes.trim() || null,
          is_active:     values.is_active,
        })
        .eq('id', patient.id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['patients'] })
      onClose()
    },
    onError: (err: Error) => {
      setSubmitError(err.message ?? 'Failed to update patient record.')
    },
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Edit patient">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="font-semibold text-gray-800">Edit Patient</h2>
            <p className="text-xs text-gray-500 mt-0.5">{patient.last_name}, {patient.first_name}</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost h-8 w-8 p-0" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* JDPA notice */}
        <div className="flex items-start gap-2 mx-5 mt-4 bg-amber-50 border border-amber-200 rounded px-3 py-2.5 text-xs text-amber-800">
          <Shield size={14} className="shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
          <span>JDPA 2020: Any changes to patient data must be clinically justified and logged.</span>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {submitError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded px-3 py-2.5 text-sm text-red-700" role="alert">
              <Warning size={14} className="shrink-0 mt-0.5" />
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-first_name" className="block text-xs font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-first_name"
                name="first_name"
                type="text"
                value={form.first_name}
                onChange={handleChange}
                className="input w-full text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="edit-last_name" className="block text-xs font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-last_name"
                name="last_name"
                type="text"
                value={form.last_name}
                onChange={handleChange}
                className="input w-full text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-dob" className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
              <input id="edit-dob" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} className="input w-full text-sm" />
            </div>
            <div>
              <label htmlFor="edit-phone" className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
              <input id="edit-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className="input w-full text-sm" />
            </div>
          </div>

          <div>
            <label htmlFor="edit-address" className="block text-xs font-medium text-gray-700 mb-1">Address</label>
            <textarea id="edit-address" name="address" rows={2} value={form.address} onChange={handleChange} className="input w-full resize-none text-sm" />
          </div>

          <div>
            <label htmlFor="edit-allergies" className="block text-xs font-medium text-gray-700 mb-1">
              Allergies
              {form.allergies && <span className="ml-1 text-red-500 text-xs">(review carefully)</span>}
            </label>
            <textarea
              id="edit-allergies"
              name="allergies"
              rows={2}
              value={form.allergies}
              onChange={handleChange}
              placeholder="Known drug allergies, comma-separated"
              className="input w-full resize-none text-sm"
            />
          </div>

          <div>
            <label htmlFor="edit-notes" className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
            <textarea id="edit-notes" name="notes" rows={2} value={form.notes} onChange={handleChange} className="input w-full resize-none text-sm" />
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <input
              id="edit-is_active"
              type="checkbox"
              checked={form.is_active}
              onChange={e => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="edit-is_active" className="text-sm text-gray-700 cursor-pointer">
              Patient is active
            </label>
            {!form.is_active && (
              <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">
                Inactive — will not appear in prescription lookups
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={() => {
              if (!form.first_name.trim() || !form.last_name.trim()) {
                setSubmitError('First name and last name are required.')
                return
              }
              setSubmitError(null)
              mutation.mutate(form)
            }}
            disabled={mutation.isPending}
            className="btn btn-primary flex-1"
          >
            {mutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
        </div>
      </div>
    </div>
  )
}

function fmtDob(dob: string | null): string {
  if (!dob) return '—'
  return new Date(dob).toLocaleDateString('en-JM', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

function truncateAllergies(s: string | null): string {
  if (!s) return ''
  return s.length > 30 ? `${s.slice(0, 30)}…` : s
}

export function PatientList() {
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Patient | null>(null)

  const { data, isLoading, isError } = useQuery<Patient[]>({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('last_name', { ascending: true })
      if (error) throw error
      return (data ?? []) as Patient[]
    },
  })

  const patients = data ?? []

  const filtered = patients.filter(p => {
    if (!search) return true
    const q = search.toLowerCase()
    const name = `${p.first_name} ${p.last_name}`.toLowerCase()
    const phone = (p.phone ?? '').toLowerCase()
    return name.includes(q) || phone.includes(q)
  })

  const activeCount = patients.filter(p => p.is_active).length

  function clearSearch() {
    setSearch('')
  }

  return (
    <div>
      <PageHeader
        title="Patients"
        subtitle="Patient records and demographics"
        breadcrumb={['Patients']}
        cta={
          <Link to="/patients/new" className="btn btn-primary gap-1.5">
            <Plus size={14} weight="bold" />
            New Patient
          </Link>
        }
      />

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Total Patients"
          value={isLoading ? '—' : String(patients.length)}
          icon={Users}
          accent="blue"
        />
        <MetricCard
          label="Active"
          value={isLoading ? '—' : String(activeCount)}
          sub={`${patients.length - activeCount} inactive`}
          icon={Users}
          accent="green"
        />
      </div>

      {/* Search bar */}
      <div className="card p-3 mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="patient-search"
            type="text"
            placeholder="Search by name or phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-7 w-full text-xs"
            aria-label="Search patients by name or phone"
          />
        </div>
        {search && (
          <button
            onClick={clearSearch}
            className="btn btn-ghost gap-1.5 text-xs"
            aria-label="Clear search"
          >
            <X size={12} />
            Clear
          </button>
        )}
        {!isLoading && (
          <span className="text-xs text-gray-400 ml-auto">
            {filtered.length} of {patients.length} patients
          </span>
        )}
      </div>

      {/* Error state */}
      {isError && (
        <div className="card p-4 mb-4 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200">
          <Warning size={16} weight="duotone" aria-hidden="true" />
          Failed to load patients. Check your connection and try again.
        </div>
      )}

      {/* Table */}
      {!isError && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-compact text-sm" aria-label="Patient records">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    DOB
                  </th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Allergies
                  </th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    JDPA Consent
                  </th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                      Loading patients…
                    </td>
                  </tr>
                )}

                {!isLoading && filtered.length === 0 && patients.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Users size={36} weight="duotone" className="text-gray-300" aria-hidden="true" />
                        <p className="text-sm text-gray-500">No patients registered yet.</p>
                        <Link to="/patients/new" className="btn btn-primary gap-1.5 text-xs">
                          <Plus size={12} weight="bold" />
                          Register first patient
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading && filtered.length === 0 && patients.length > 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                      No patients match your search.
                    </td>
                  </tr>
                )}

                {!isLoading && filtered.map(patient => {
                  const allergyText = truncateAllergies(patient.allergies)
                  const hasAllergies = Boolean(patient.allergies?.trim())

                  return (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800 text-sm">
                        {patient.last_name}, {patient.first_name}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 font-mono">
                        {fmtDob(patient.date_of_birth)}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {patient.phone ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-xs max-w-[180px]">
                        {hasAllergies ? (
                          <span className="text-red-600 font-medium" title={patient.allergies ?? ''}>
                            {allergyText}
                          </span>
                        ) : (
                          <span className="text-gray-400">None recorded</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill
                          label={patient.is_active ? 'Active' : 'Inactive'}
                          variant={patient.is_active ? 'green' : 'gray'}
                        />
                      </td>
                      <td className="px-4 py-3">
                        {patient.jdpa_consent_at ? (
                          <StatusPill
                            label="Consented"
                            variant="green"
                          />
                        ) : (
                          <StatusPill
                            label="Missing"
                            variant="red"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="btn btn-ghost gap-1.5 text-xs"
                          aria-label={`Edit ${patient.first_name} ${patient.last_name}`}
                          onClick={() => setEditing(patient)}
                        >
                          <PencilSimple size={13} weight="duotone" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing && (
        <EditPatientDrawer patient={editing} onClose={() => setEditing(null)} />
      )}
    </div>
  )
}

export default PatientList
