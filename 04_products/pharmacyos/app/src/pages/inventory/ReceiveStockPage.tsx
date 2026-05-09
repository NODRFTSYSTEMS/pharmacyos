import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { FormField } from '@/components/Input'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { Textarea } from '@/components/Textarea'
import { Button } from '@/components/Button'
import { SAMPLE_SUPPLIERS, SAMPLE_STOCK } from '@/data/sample'

export function ReceiveStockPage() {
  const [drug, setDrug] = useState('')
  const [supplier, setSupplier] = useState('')
  const [qty, setQty] = useState('')
  const [lot, setLot] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cost, setCost] = useState('')
  const [notes, setNotes] = useState('')

  const canSubmit = drug && supplier && qty && lot && expiry && cost

  return (
    <div className="flex-1 p-6 space-y-6 max-w-2xl">
      <PageHeader title="Receive Stock" />

      <div className="bg-bg-surface rounded-card shadow-card border border-border p-6 space-y-5">
        <FormField label="Drug" required>
          {(props) => (
            <Select {...props} value={drug} onChange={(e) => setDrug(e.target.value)}>
              <option value="">Select drug…</option>
              {SAMPLE_STOCK.map((s) => (
                <option key={s.id} value={s.drug}>{s.drug}</option>
              ))}
            </Select>
          )}
        </FormField>

        <FormField label="Supplier" required>
          {(props) => (
            <Select {...props} value={supplier} onChange={(e) => setSupplier(e.target.value)}>
              <option value="">Select supplier…</option>
              {SAMPLE_SUPPLIERS.filter((s) => s.status === 'Active').map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </Select>
          )}
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Quantity" required>
            {(props) => (
              <Input {...props} type="number" inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value)} className="type-mono-input" />
            )}
          </FormField>
          <FormField label="Lot #" required>
            {(props) => (
              <Input {...props} value={lot} onChange={(e) => setLot(e.target.value)} className="type-mono-input" />
            )}
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Expiry Date" required>
            {(props) => (
              <Input {...props} type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
            )}
          </FormField>
          <FormField label="Unit Cost (JMD)" required>
            {(props) => (
              <Input {...props} type="number" inputMode="decimal" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} className="type-mono-input" />
            )}
          </FormField>
        </div>

        <FormField label="Notes">
          {(props) => (
            <Textarea {...props} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          )}
        </FormField>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary" disabled={!canSubmit}>Submit & Receive</Button>
        </div>
      </div>
    </div>
  )
}

export default ReceiveStockPage
