import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { FormField } from '@/components/Input'
import { Input } from '@/components/Input'
import { Checkbox } from '@/components/Checkbox'
import { Button } from '@/components/Button'
import { useToast } from '@/components/Toast'

export function NewLoyaltyMemberPage() {
  const navigate = useNavigate()
  const toast = useToast()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const errFor = (value: string) => (submitAttempted && !value ? 'Required' : undefined)
  const canSubmit = name && phone && consent

  function handleSave() {
    if (!canSubmit) {
      setSubmitAttempted(true)
      toast.show('Fill required fields and confirm consent', { variant: 'error' })
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      toast.show(`${name} enrolled in loyalty program`, { variant: 'success' })
      setSubmitting(false)
      navigate('/pos/loyalty')
    }, 400)
  }

  return (
    <div className="flex-1 p-6 space-y-6 max-w-xl">
      <PageHeader
        title="New Loyalty Member"
        breadcrumb={[{ label: 'Loyalty', to: '/pos/loyalty' }, { label: 'New' }]}
      />

      <div className="bg-bg-surface rounded-card shadow-card border border-border p-6 space-y-5">
        <FormField label="Full name" required error={errFor(name)}>
          {(p) => <Input {...p} value={name} onChange={(e) => setName(e.target.value)} />}
        </FormField>

        <FormField label="Phone number" required error={errFor(phone)}>
          {(p) => <Input {...p} type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="type-mono-input" />}
        </FormField>

        <div className="bg-bg-subtle rounded-control p-4 text-sm text-text-secondary leading-relaxed">
          By enrolling in the Winchester Global Pharmacy loyalty program, you consent to us
          collecting your contact information and purchase history for the purpose of awarding
          and tracking loyalty points. This is handled in accordance with the Jamaica Data
          Protection Act 2020.
        </div>

        <Checkbox label="Consent given" checked={consent} onChange={() => setConsent((v) => !v)} />
        {submitAttempted && !consent && (
          <p className="text-xs text-error" role="alert">Member consent must be confirmed before enrolling.</p>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={() => navigate('/pos/loyalty')} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} loading={submitting}>
            {submitting ? 'Enrolling…' : 'Enroll Member'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NewLoyaltyMemberPage
