import { useMemo, useState } from 'react'
import { DownloadSimple, MagnifyingGlass } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { SAMPLE_ACTIVITY } from '@/data/sample'

const ROLE_OPTIONS = ['All', 'Pharmacist', 'Technician', 'Front Desk', 'Manager', 'Admin'] as const
type RoleFilter = (typeof ROLE_OPTIONS)[number]

export function AuditLogPage() {
  const [query, setQuery] = useState('')
  const [role, setRole] = useState<RoleFilter>('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SAMPLE_ACTIVITY.filter((entry) => {
      const matchesRole = role === 'All' || entry.role === role
      const matchesQuery = !q ||
        entry.user.toLowerCase().includes(q) ||
        entry.action.toLowerCase().includes(q) ||
        entry.target.toLowerCase().includes(q)
      return matchesRole && matchesQuery
    })
  }, [query, role])

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Audit Log"
        subtitle={`${SAMPLE_ACTIVITY.length} entries · all state-changing actions logged via database triggers${query || role !== 'All' ? ` · ${filtered.length} matching` : ''}`}
        cta={
          <Button variant="secondary" size="md">
            <DownloadSimple size={16} weight="bold" />
            Export
          </Button>
        }
        filterBar={
          <div className="flex items-center gap-3 w-full">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search actions, users, or targets…"
                className="w-full h-10 pl-9 pr-3 type-body-sm bg-bg-surface border border-border rounded-control focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20 transition-shadow"
              />
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as RoleFilter)}
              className="h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control text-text-primary focus:outline-none focus:border-primary"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r === 'All' ? 'All roles' : r}</option>
              ))}
            </select>
            <select className="h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control text-text-primary focus:outline-none focus:border-primary">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
        }
      />
      <section className="flex-1 p-6 overflow-y-auto">
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Time</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">User</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Role</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Action</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Target</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-text-secondary">
                    No audit entries match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <tr key={entry.id} className="h-10 border-b border-border-subtle hover:bg-bg-subtle transition-colors">
                    <td className="px-4 type-mono-data text-text-secondary whitespace-nowrap">{entry.timestamp}</td>
                    <td className="px-4 text-[13px] text-text-primary whitespace-nowrap">{entry.user}</td>
                    <td className="px-4 text-[12px] text-text-secondary">{entry.role}</td>
                    <td className="px-4 text-[13px] text-text-primary">{entry.action}</td>
                    <td className="px-4 text-[12px] text-text-secondary truncate max-w-[400px]">{entry.target}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default AuditLogPage
