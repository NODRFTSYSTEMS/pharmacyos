import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { FormField } from '@/components/Input'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { Checkbox } from '@/components/Checkbox'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { useToast } from '@/components/Toast'

const ALLERGY_OPTIONS = ['Penicillin', 'Sulfa', 'NSAIDs', 'Aspirin', 'Codeine', 'Latex']

export function NewPatientPage() {
  const navigate = useNavigate()
  const toast = useToast()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')
  const [sex, setSex] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [allergies, setAllergies] = useState<string[]>([])
  const [allergyOther, setAllergyOther] = useState('')
  const [consent, setConsent] = useState(false)
  const [consentMethod, setConsentMethod] = useState<'verbal' | 'written' | 'digital' | ''>('')
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const errFor = (value: string) => (submitAttempted && !value ? 'Required' : undefined)
  const canSubmit = firstName && lastName && dob && sex && phone && consent && consentMethod

  const toggleAllergy = (a: string) => {
    setAllergies((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]))
  }

  function handleSave() {
    if (!canSubmit) {
      setSubmitAttempted(true)
      toast.show('Fill the required fields and confirm consent', { variant: 'error' })
      return
    }
    setSubmitting(true)
    // jdpaConsent record that would be saved to Supabase (G2)
    const _jdpaRecord = {
      given: true,
      timestamp: new Date().toISOString().slice(0, 10),
      version: '1.2',
      method: consentMethod,
    }
    setTimeout(() => {
      toast.show(`Patient ${firstName} ${lastName} saved`, { variant: 'success' })
      setSubmitting(false)
      navigate('/patients')
    }, 400)
  }

  return (
    <div className="flex-1 p-6 space-y-6 max-w-2xl">
      <PageHeader
        title="New Patient"
        breadcrumb={[{ label: 'Patients', to: '/patients' }, { label: 'New' }]}
      />

      <section className="bg-bg-surface rounded-card shadow-card border border-border p-6 space-y-5">
        <h2 className="type-card-title text-text-primary">Demographics</h2>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="First name" required error={errFor(firstName)}>
            {(p) => <Input {...p} value={firstName} onChange={(e) => setFirstName(e.target.value)} />}
          </FormField>
          <FormField label="Last name" required error={errFor(lastName)}>
            {(p) => <Input {...p} value={lastName} onChange={(e) => setLastName(e.target.value)} />}
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date of birth" required error={errFor(dob)}>
            {(p) => <Input {...p} type="date" value={dob} onChange={(e) => setDob(e.target.value)} />}
          </FormField>
          <FormField label="Sex" required error={errFor(sex)}>
            {(p) => (
              <Select {...p} value={sex} onChange={(e) => setSex(e.target.value)}>
                <option value="">Select…</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            )}
          </FormField>
        </div>
        <FormField label="Phone" required error={errFor(phone)}>
          {(p) => <Input {...p} type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="type-mono-input" />}
        </FormField>
        <FormField label="Email">
          {(p) => <Input {...p} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />}
        </FormField>
        <FormField label="Address">
          {(p) => <Input {...p} value={address} onChange={(e) => setAddress(e.target.value)} />}
        </FormField>
      </section>

      <section className="bg-bg-surface rounded-card shadow-card border border-border p-6 space-y-4">
        <h2 className="type-card-title text-text-primary">Allergies</h2>
        <div className="grid grid-cols-3 gap-3">
          {ALLERGY_OPTIONS.map((a) => (
            <Checkbox key={a} label={a} checked={allergies.includes(a)} onChange={() => toggleAllergy(a)} />
          ))}
        </div>
        <FormField label="Other allergies">
          {(p) => <Input {...p} value={allergyOther} onChange={(e) => setAllergyOther(e.target.value)} placeholder="Specify if not listed above" />}
        </FormField>
      </section>

      <section className="bg-bg-surface rounded-card shadow-card border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="type-card-title text-text-primary">JDPA Consent</h2>
          <StatusPill variant="info">Version 1.2</StatusPill>
        </div>
        <div className="bg-bg-subtle rounded-control p-4 text-sm text-text-secondary leading-relaxed">
          I consent to Winchester Global Pharmacy collecting, processing, and storing my personal
          health information in accordance with the Jamaica Data Protection Act 2020. I understand
          that I may request access to, correction of, or deletion of my data at any time by
          speaking with a pharmacist or administrator.
        </div>

        {/* Consent method — required for JDPA compliance record */}
        <FormField
          label="Consent method"
          required
          error={submitAttempted && !consentMethod ? 'Required — select how consent was obtained' : undefined}
        >
          {(p) => (
            <Select
              {...p}
              value={consentMethod}
              onChange={(e) => setConsentMethod(e.target.value as 'verbal' | 'written' | 'digital' | '')}
            >
              <option value="">Select method…</option>
              <option value="verbal">Verbal — patient confirmed verbally in person</option>
              <option value="written">Written — patient signed a consent form</option>
              <option value="digital">Digital — patient signed on-screen or via portal</option>
            </Select>
          )}
        </FormField>

        <Checkbox label="Patient confirms consent to data collection and storage" checked={consent} onChange={() => setConsent((v) => !v)} />
        {submitAttempted && !consent && (
          <p className="text-xs text-error" role="alert">Patient consent must be confirmed before saving.</p>
        )}
        <div className="flex items-center gap-3 text-xs text-text-disabled">
          <span>Consent date: <span className="type-mono-data">{new Date().toISOString().slice(0, 10)}</span></span>
          <span aria-hidden="true">·</span>
          <span>Collected by: staff on duty</span>
          <span aria-hidden="true">·</span>
          <span>Record stored per JDPA 2020 §16</span>
        </div>
      </section>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => navigate('/patients')} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} loading={submitting}>
          {submitting ? 'Saving…' : 'Save Patient'}
        </Button>
      </div>
    </div>
  )
}

export default NewPatientPage
