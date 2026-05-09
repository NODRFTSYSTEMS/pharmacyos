import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { FormField } from '@/components/Input'
import { Input } from '@/components/Input'
import { Checkbox } from '@/components/Checkbox'
import { Button } from '@/components/Button'

export function NewLoyaltyMemberPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)

  const canSubmit = name && phone && consent

  return (
    <div className="flex-1 p-6 space-y-6 max-w-xl">
      <PageHeader title="New Loyalty Member" breadcrumb={[{ label: 'Loyalty', to: '/pos/loyalty' }, { label: 'New' }]} />

      <div className="bg-bg-surface rounded-card shadow-card border border-border p-6 space-y-5">
        <FormField label="Full name" required>
          {(props) => <Input {...props} value={name} onChange={(e) => setName(e.target.value)} />}
        </FormField>

        <FormField label="Phone number" required>
          {(props) => <Input {...props} type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="type-mono-input" />}
        </FormField>

        <div className="bg-bg-subtle rounded-control p-4 text-sm text-text-secondary leading-relaxed">
          By enrolling in the Winchester Global Pharmacy loyalty program, you consent to us
          collecting your contact information and purchase history for the purpose of awarding
          and tracking loyalty points. This is handled in accordance with the Jamaica Data
          Protection Act 2020.
        </div>

        <div className="flex items-center gap-2">
          <Checkbox label="Consent given" checked={consent} onChange={() => setConsent((v) => !v)} />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary" disabled={!canSubmit}>Enroll Member</Button>
        </div>
      </div>
    </div>
  )
}

export default NewLoyaltyMemberPage
