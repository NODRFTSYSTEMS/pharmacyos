import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { FormField } from '@/components/Input'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { Checkbox } from '@/components/Checkbox'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'

const ALLERGY_OPTIONS = ['Penicillin', 'Sulfa', 'NSAIDs', 'Aspirin', 'Codeine', 'Latex']

export function NewPatientPage() {
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

  const toggleAllergy = (a: string) => {
    setAllergies((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    )
  }

  const canSubmit = firstName && lastName && dob && sex && phone && consent

  return (
    <div className="flex-1 p-6 space-y-6 max-w-2xl">
      <PageHeader title="New Patient" breadcrumb={[{ label: 'Patients', to: '/patients' }, { label: 'New' }]} />

      {/* Demographics */}
      <section className="bg-bg-surface rounded-card shadow-card border border-border p-6 space-y-5">
        <h2 className="type-card-title text-text-primary">Demographics</h2>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="First name" required>
            {(props) => <Input {...props} value={firstName} onChange={(e) => setFirstName(e.target.value)} />}
          </FormField>
          <FormField label="Last name" required>
            {(props) => <Input {...props} value={lastName} onChange={(e) => setLastName(e.target.value)} />}
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date of birth" required>
            {(props) => <Input {...props} type="date" value={dob} onChange={(e) => setDob(e.target.value)} />}
          </FormField>
          <FormField label="Sex" required>
            {(props) => (
              <Select {...props} value={sex} onChange={(e) => setSex(e.target.value)}>
                <option value="">Select…</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            )}
          </FormField>
        </div>
        <FormField label="Phone" required>
          {(props) => <Input {...props} type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="type-mono-input" />}
        </FormField>
        <FormField label="Email">
          {(props) => <Input {...props} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />}
        </FormField>
        <FormField label="Address">
          {(props) => <Input {...props} value={address} onChange={(e) => setAddress(e.target.value)} />}
        </FormField>
      </section>

      {/* Allergies */}
      <section className="bg-bg-surface rounded-card shadow-card border border-border p-6 space-y-4">
        <h2 className="type-card-title text-text-primary">Allergies</h2>
        <div className="grid grid-cols-3 gap-3">
          {ALLERGY_OPTIONS.map((a) => (
            <label key={a} className="flex items-center gap-2 cursor-pointer">
              <Checkbox label={a} checked={allergies.includes(a)} onChange={() => toggleAllergy(a)} />
            </label>
          ))}
        </div>
        <FormField label="Other allergies">
          {(props) => <Input {...props} value={allergyOther} onChange={(e) => setAllergyOther(e.target.value)} placeholder="Specify if not listed above" />}
        </FormField>
      </section>

      {/* JDPA Consent */}
      <section className="bg-bg-surface rounded-card shadow-card border border-border p-6 space-y-4">
        <h2 className="type-card-title text-text-primary">JDPA Consent</h2>
        <div className="bg-bg-subtle rounded-control p-4 text-sm text-text-secondary leading-relaxed">
          I consent to Winchester Global Pharmacy collecting, processing, and storing my personal
          health information in accordance with the Jamaica Data Protection Act 2020. I understand
          that I may request access to, correction of, or deletion of my data at any time by
          speaking with a pharmacist or administrator.
        </div>
        <div className="flex items-center gap-2">
          <Checkbox label="Consent given by patient" checked={consent} onChange={() => setConsent((v) => !v)} />
        </div>
        <div className="flex items-center gap-3">
          <p className="type-body-xs text-text-secondary">Date: <span className="type-mono-data">{new Date().toISOString().slice(0, 10)}</span></p>
          <StatusPill variant="info">Version 1.2</StatusPill>
        </div>
      </section>

      <div className="flex gap-3">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary" disabled={!canSubmit}>Save Patient</Button>
      </div>
    </div>
  )
}

export default NewPatientPage
