import { useState, type FormEvent, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { Shield, ArrowLeft, Warning } from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { PageHeader } from '../../components/Shell'

interface PatientFormState {
  first_name: string
  last_name: string
  date_of_birth: string
  phone: string
  address: string
  allergies: string
  notes: string
  consent: boolean
}

const INITIAL_STATE: PatientFormState = {
  first_name: '',
  last_name: '',
  date_of_birth: '',
  phone: '',
  address: '',
  allergies: '',
  notes: '',
  consent: false,
}

interface ValidationErrors {
  first_name?: string
  last_name?: string
  consent?: string
}

function validate(form: PatientFormState): ValidationErrors {
  const errors: ValidationErrors = {}
  if (!form.first_name.trim()) errors.first_name = 'First name is required.'
  if (!form.last_name.trim()) errors.last_name = 'Last name is required.'
  if (!form.consent) errors.consent = 'Patient consent confirmation is required.'
  return errors
}

export function NewPatient() {
  const navigate = useNavigate()
  const [form, setForm] = useState<PatientFormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async (values: PatientFormState) => {
      const { error } = await supabase.from('patients').insert({
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        date_of_birth: values.date_of_birth || null,
        phone: values.phone.trim() || null,
        address: values.address.trim() || null,
        allergies: values.allergies.trim() || null,
        notes: values.notes.trim() || null,
        is_active: true,
      })
      if (error) throw error
    },
    onSuccess: () => {
      void navigate('/patients')
    },
    onError: (err: Error) => {
      setSubmitError(err.message ?? 'An error occurred while registering the patient.')
    },
  })

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  function handleCheckbox(e: ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, consent: e.target.checked }))
    if (errors.consent) {
      setErrors(prev => ({ ...prev, consent: undefined }))
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    mutation.mutate(form)
  }

  return (
    <div>
      {/* Back link */}
      <Link
        to="/patients"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Patients
      </Link>

      {/* JDPA Notice */}
      <div
        className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6"
        role="note"
        aria-label="Jamaica Data Protection Act notice"
      >
        <Shield
          size={18}
          weight="duotone"
          className="text-amber-600 shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <p className="text-sm text-amber-800 leading-relaxed">
          <span className="font-semibold">JDPA 2020 Notice:</span>{' '}
          This information is classified as personal data under the Jamaica Data Protection Act 2020.
          It is collected solely for the purpose of prescription dispensing and healthcare records.
          The patient must be informed of this collection and provide consent.
        </p>
      </div>

      <PageHeader
        title="Register Patient"
        breadcrumb={['Patients', 'New Patient']}
      />

      {/* Form card */}
      <div className="max-w-2xl">
        <div className="card p-6">
          {submitError && (
            <div
              className="flex items-start gap-2 bg-red-50 border border-red-200 rounded px-3 py-2.5 mb-5 text-sm text-red-700"
              role="alert"
            >
              <Warning size={15} weight="duotone" className="shrink-0 mt-0.5" aria-hidden="true" />
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* First Name + Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  First Name <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  value={form.first_name}
                  onChange={handleChange}
                  className={`input w-full ${errors.first_name ? 'border-red-400 focus:ring-red-300' : ''}`}
                  aria-required="true"
                  aria-describedby={errors.first_name ? 'first_name-error' : undefined}
                />
                {errors.first_name && (
                  <p id="first_name-error" className="mt-1 text-xs text-red-600" role="alert">
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Last Name <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  value={form.last_name}
                  onChange={handleChange}
                  className={`input w-full ${errors.last_name ? 'border-red-400 focus:ring-red-300' : ''}`}
                  aria-required="true"
                  aria-describedby={errors.last_name ? 'last_name-error' : undefined}
                />
                {errors.last_name && (
                  <p id="last_name-error" className="mt-1 text-xs text-red-600" role="alert">
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>

            {/* DOB + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="date_of_birth"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Date of Birth
                </label>
                <input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  autoComplete="bday"
                  value={form.date_of_birth}
                  onChange={handleChange}
                  className="input w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="input w-full"
                />
              </div>
            </div>

            {/* Address */}
            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={2}
                autoComplete="street-address"
                value={form.address}
                onChange={handleChange}
                className="input w-full resize-none"
              />
            </div>

            {/* Allergies */}
            <div className="mb-4">
              <label
                htmlFor="allergies"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Allergies
              </label>
              <textarea
                id="allergies"
                name="allergies"
                rows={2}
                value={form.allergies}
                onChange={handleChange}
                placeholder="List known drug allergies, separated by commas"
                className="input w-full resize-none"
              />
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label
                htmlFor="notes"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                value={form.notes}
                onChange={handleChange}
                className="input w-full resize-none"
              />
            </div>

            {/* Consent checkbox */}
            <div
              className={`rounded-lg border p-4 mb-6 ${
                errors.consent
                  ? 'bg-red-50 border-red-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  checked={form.consent}
                  onChange={handleCheckbox}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  aria-required="true"
                  aria-describedby={errors.consent ? 'consent-error' : undefined}
                />
                <label htmlFor="consent" className="text-xs text-gray-700 leading-relaxed cursor-pointer">
                  <span className="font-semibold">Patient Consent</span>{' '}
                  I confirm the patient has been informed that their details are being recorded
                  for the purpose of prescription dispensing under the JDPA 2020 and has
                  provided consent.
                </label>
              </div>
              {errors.consent && (
                <p id="consent-error" className="mt-2 text-xs text-red-600 ml-7" role="alert">
                  {errors.consent}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full justify-center"
              disabled={mutation.isPending}
              aria-busy={mutation.isPending}
            >
              {mutation.isPending ? 'Registering…' : 'Register Patient'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewPatient
