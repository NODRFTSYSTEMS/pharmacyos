import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { FormField } from '@/components/Input'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { Textarea } from '@/components/Textarea'
import { Button } from '@/components/Button'
import { useToast } from '@/components/Toast'
import { SAMPLE_SUPPLIERS, SAMPLE_STOCK } from '@/data/sample'

export function ReceiveStockPage() {
  const navigate = useNavigate()
  const toast = useToast()

  const [drug, setDrug] = useState('')
  const [supplier, setSupplier] = useState('')
  const [qty, setQty] = useState('')
  const [lot, setLot] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cost, setCost] = useState('')
  const [notes, setNotes] = useState('')
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const errFor = (value: string) => (submitAttempted && !value ? 'Required' : undefined)
  const canSubmit = drug && supplier && qty && lot && expiry && cost

  function handleSave() {
    if (!canSubmit) {
      setSubmitAttempted(true)
      toast.show('Fill the required fields', { variant: 'error' })
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      toast.show(`Received ${qty} × ${drug}`, { variant: 'success' })
      setSubmitting(false)
      navigate('/inventory')
    }, 400)
  }

  return (
    <div className="flex-1 p-6 space-y-6 max-w-2xl">
      <PageHeader
        title="Receive Stock"
        breadcrumb={[{ label: 'Inventory', to: '/inventory' }, { label: 'Receive' }]}
      />

      <div className="bg-bg-surface rounded-card shadow-card border border-border p-6 space-y-5">
        <FormField label="Drug" required error={errFor(drug)}>
          {(p) => (
            <Select {...p} value={drug} onChange={(e) => setDrug(e.target.value)}>
              <option value="">Select drug…</option>
              {SAMPLE_STOCK.map((s) => (
                <option key={s.id} value={s.drug}>{s.drug}</option>
              ))}
            </Select>
          )}
        </FormField>

        <FormField label="Supplier" required error={errFor(supplier)}>
          {(p) => (
            <Select {...p} value={supplier} onChange={(e) => setSupplier(e.target.value)}>
              <option value="">Select supplier…</option>
              {SAMPLE_SUPPLIERS.filter((s) => s.status === 'Active').map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </Select>
          )}
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Quantity" required error={errFor(qty)}>
            {(p) => <Input {...p} type="number" inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value)} className="type-mono-input" />}
          </FormField>
          <FormField label="Lot #" required error={errFor(lot)}>
            {(p) => <Input {...p} value={lot} onChange={(e) => setLot(e.target.value)} className="type-mono-input" />}
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Expiry Date" required error={errFor(expiry)}>
            {(p) => <Input {...p} type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} />}
          </FormField>
          <FormField label="Unit Cost (JMD)" required error={errFor(cost)}>
            {(p) => <Input {...p} type="number" inputMode="decimal" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} className="type-mono-input" />}
          </FormField>
        </div>

        <FormField label="Notes">
          {(p) => <Textarea {...p} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />}
        </FormField>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={() => navigate('/inventory')} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} loading={submitting}>
            {submitting ? 'Receiving…' : 'Submit & Receive'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ReceiveStockPage
