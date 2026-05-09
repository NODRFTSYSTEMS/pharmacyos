import { Building, Database, Bell, Globe } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { Input, FormField } from '@/components/Input'
import { Checkbox } from '@/components/Checkbox'

export function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="System Settings" subtitle="Pharmacy configuration · save changes per section" />
      <section className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl flex flex-col gap-4">
          <Section icon={<Building size={18} className="text-rx-received-fg" />} title="Pharmacy Profile" description="Identity used on receipts, prescriptions, and reports.">
            <FormField label="Pharmacy Name" required>
              {(id) => <Input id={id} defaultValue="Winchester Global Pharmacy" />}
            </FormField>
            <FormField label="Address">
              {(id) => <Input id={id} defaultValue="42 Hope Road, Kingston 6, Jamaica" />}
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Phone">
                {(id) => <Input id={id} type="tel" defaultValue="876-555-0142" mono />}
              </FormField>
              <FormField label="Pharmacy Council #">
                {(id) => <Input id={id} defaultValue="PCJ-2024-0817" mono />}
              </FormField>
            </div>
            <SaveRow />
          </Section>

          <Section icon={<Database size={18} className="text-rx-filled-fg" />} title="Inventory Defaults" description="Thresholds applied across all SKUs unless overridden per drug.">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Low Stock Threshold (units)" helper="Triggers low-stock alert">
                {(id) => <Input id={id} type="number" defaultValue="50" mono />}
              </FormField>
              <FormField label="Expiry Alert Window (days)" helper="Items expiring within this window appear in alerts">
                {(id) => <Input id={id} type="number" defaultValue="90" mono />}
              </FormField>
            </div>
            <Checkbox label="Auto-generate purchase orders when stock drops below threshold" defaultChecked={false} />
            <Checkbox label="Block dispensing of expired lots (recommended)" defaultChecked={true} />
            <SaveRow />
          </Section>

          <Section icon={<Bell size={18} className="text-rx-verified-fg" />} title="Notifications" description="Alert routing for staff and management.">
            <Checkbox label="Email me when schedule drug log entry is created" defaultChecked />
            <Checkbox label="Email me when AI scan confidence falls below 85%" defaultChecked />
            <Checkbox label="Email manager on stock alerts" defaultChecked />
            <Checkbox label="Daily revenue summary email at end of day" defaultChecked />
            <SaveRow />
          </Section>

          <Section icon={<Globe size={18} className="text-tag-nhf-fg" />} title="Integrations" description="External services connected to PharmacyOS.">
            <Row label="Anthropic Claude Vision" status="Connected" detail="invoice + Rx scanning" />
            <Row label="Lynk Payments" status="Pending Credentials" detail="awaiting client API key" warn />
            <Row label="NHF Verification" status="Phase 2 (deferred)" detail="not yet active" muted />
            <Row label="WhatsApp / SMS" status="Phase 2 (deferred)" detail="not yet active" muted />
          </Section>
        </div>
      </section>
    </div>
  )
}

function Section({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg-surface rounded-card shadow-card p-6">
      <div className="flex items-start gap-3 mb-5 pb-4 border-b border-border-subtle">
        <div className="w-10 h-10 rounded-control bg-bg-subtle flex items-center justify-center shrink-0">{icon}</div>
        <div>
          <p className="type-card-title text-text-primary">{title}</p>
          <p className="text-xs text-text-secondary mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

function SaveRow() {
  return (
    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
      <Button variant="tertiary" size="md">Cancel</Button>
      <Button variant="primary" size="md">Save Changes</Button>
    </div>
  )
}

function Row({ label, status, detail, warn, muted }: { label: string; status: string; detail: string; warn?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border-subtle last:border-b-0">
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-xs text-text-secondary">{detail}</p>
      </div>
      <span className={[
        'inline-flex items-center px-2 py-0.5 rounded-pill text-[11px] font-semibold',
        warn ? 'bg-rx-verified-bg text-rx-verified-fg'
          : muted ? 'bg-rx-dispensed-bg text-rx-dispensed-fg'
          : 'bg-rx-filled-bg text-rx-filled-fg',
      ].join(' ')}>
        {status}
      </span>
    </div>
  )
}

export default SettingsPage
