import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { FormField } from '@/components/Input'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_PATIENTS, SAMPLE_STOCK } from '@/data/sample'

export function NewPrescriptionPage() {
  const [patientId, setPatientId] = useState('')
  const [prescriber, setPrescriber] = useState('')
  const [prescriberReg, setPrescriberReg] = useState('')
  const [drugId, setDrugId] = useState('')
  const [dosage, setDosage] = useState('')
  const [qty, setQty] = useState('')
  const [refills, setRefills] = useState('0')
  const [dateIssued, setDateIssued] = useState(new Date().toISOString().slice(0, 10))

  const selectedDrug = SAMPLE_STOCK.find((s) => s.id === drugId)
  const canSubmit = patientId && prescriber && drugId && dosage && qty && dateIssued

  return (
    <div className="flex-1 p-6 space-y-6 max-w-2xl">
      <PageHeader title="New Prescription" breadcrumb={[{ label: 'Prescriptions', to: '/prescriptions' }, { label: 'New' }]} />

      <div className="bg-bg-surface rounded-card shadow-card border border-border p-6 space-y-5">
        {/* Patient */}
        <FormField label="Patient" required>
          {(props) => (
            <Select {...props} value={patientId} onChange={(e) => setPatientId(e.target.value)}>
              <option value="">Select patient…</option>
              {SAMPLE_PATIENTS.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {p.phone}</option>
              ))}
            </Select>
          )}
        </FormField>

        {/* Prescriber */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Prescriber name" required>
            {(props) => <Input {...props} value={prescriber} onChange={(e) => setPrescriber(e.target.value)} />}
          </FormField>
          <FormField label="Registration #">
            {(props) => <Input {...props} value={prescriberReg} onChange={(e) => setPrescriberReg(e.target.value)} className="type-mono-input" />}
          </FormField>
        </div>

        {/* Drug */}
        <FormField label="Drug" required>
          {(props) => (
            <Select {...props} value={drugId} onChange={(e) => setDrugId(e.target.value)}>
              <option value="">Select drug…</option>
              {SAMPLE_STOCK.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.drug} — Qty: {s.qtyOnHand} {s.isSchedule ? '(Schedule)' : ''}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        {selectedDrug?.isSchedule && (
          <div className="flex items-center gap-2">
            <StatusPill variant="schedule">Schedule Drug</StatusPill>
            <span className="type-body-xs text-text-secondary">Extra logging and pharmacist sign-off required.</span>
          </div>
        )}

        {/* Dosage / Qty / Refills */}
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Dosage" required>
            {(props) => <Input {...props} value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="e.g. 1 tablet twice daily" />}
          </FormField>
          <FormField label="Quantity" required>
            {(props) => <Input {...props} type="number" inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value)} className="type-mono-input" />}
          </FormField>
          <FormField label="Refills">
            {(props) => <Input {...props} type="number" inputMode="numeric" value={refills} onChange={(e) => setRefills(e.target.value)} className="type-mono-input" />}
          </FormField>
        </div>

        <FormField label="Date issued" required>
          {(props) => <Input {...props} type="date" value={dateIssued} onChange={(e) => setDateIssued(e.target.value)} />}
        </FormField>

        <div className="border border-dashed border-border rounded-control p-6 text-center">
          <p className="type-body-sm text-text-secondary mb-2">Upload Rx image (optional)</p>
          <p className="type-body-xs text-text-tertiary">Drag and drop or click to upload. Triggers AI scan on confirm.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary" disabled={!canSubmit}>Save & Queue</Button>
        </div>
      </div>
    </div>
  )
}

export default NewPrescriptionPage
