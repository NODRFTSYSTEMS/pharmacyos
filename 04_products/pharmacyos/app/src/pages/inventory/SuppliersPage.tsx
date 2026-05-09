import { Plus, Phone, Envelope } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_SUPPLIERS } from '@/data/sample'

export function SuppliersPage() {
  const active = SAMPLE_SUPPLIERS.filter((s) => s.status === 'Active').length
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Suppliers"
        subtitle={`${SAMPLE_SUPPLIERS.length} on file · ${active} active`}
        cta={
          <Button variant="primary" size="md">
            <Plus size={16} weight="bold" />
            Add Supplier
          </Button>
        }
      />
      <section className="flex-1 p-6 overflow-y-auto">
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Supplier</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Contact</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Phone</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Email</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Location</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Last Order</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_SUPPLIERS.map((s) => (
                <tr key={s.id} className="h-11 border-b border-border-subtle hover:bg-bg-subtle transition-colors">
                  <td className="px-4 type-body-sm font-medium text-text-primary">{s.name}</td>
                  <td className="px-4 type-body-sm text-text-primary">{s.contact}</td>
                  <td className="px-4">
                    <span className="inline-flex items-center gap-1.5 type-mono-data text-text-secondary">
                      <Phone size={12} />
                      {s.phone}
                    </span>
                  </td>
                  <td className="px-4">
                    <span className="inline-flex items-center gap-1.5 type-body-xs text-text-secondary">
                      <Envelope size={12} />
                      {s.email}
                    </span>
                  </td>
                  <td className="px-4 type-body-xs text-text-secondary">{s.location}</td>
                  <td className="px-4 type-mono-data text-text-secondary">{s.lastOrder}</td>
                  <td className="px-4">
                    <StatusPill variant={s.status === 'Active' ? 'success' : 'neutral'}>{s.status}</StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default SuppliersPage
