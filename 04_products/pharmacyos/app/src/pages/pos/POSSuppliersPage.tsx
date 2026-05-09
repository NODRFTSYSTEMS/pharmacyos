import { PageHeader } from '@/components/PageHeader'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_SUPPLIERS } from '@/data/sample'
import { Phone, Envelope } from '@phosphor-icons/react'

export function POSSuppliersPage() {
  return (
    <div className="flex-1 p-6 space-y-6">
      <PageHeader title="POS Suppliers" />

      <div className="bg-bg-surface rounded-card shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">POS supplier directory</caption>
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Name</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Contact</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Phone</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Email</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Location</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_SUPPLIERS.map((s) => (
                <tr key={s.id} className="border-b border-border-subtle hover:bg-bg-subtle">
                  <td className="px-4 py-2 type-body-sm font-medium text-text-primary">{s.name}</td>
                  <td className="px-4 py-2 type-body-sm text-text-primary">{s.contact}</td>
                  <td className="px-4 py-2 type-body-xs text-text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone size={14} />
                      {s.phone}
                    </span>
                  </td>
                  <td className="px-4 py-2 type-body-xs text-text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      <Envelope size={14} />
                      {s.email}
                    </span>
                  </td>
                  <td className="px-4 py-2 type-body-xs text-text-secondary">{s.location}</td>
                  <td className="px-4 py-2">
                    <StatusPill variant={s.status === 'Active' ? 'success' : 'neutral'}>{s.status}</StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default POSSuppliersPage
