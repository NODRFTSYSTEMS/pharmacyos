import { useMemo, useState } from 'react'
import { Plus, MagnifyingGlass } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_STAFF, type UserRole } from '@/data/sample'

const ROLE_VARIANT: Record<UserRole, 'success' | 'info' | 'neutral' | 'warning' | 'error'> = {
  Pharmacist: 'success',
  Technician: 'info',
  'Front Desk': 'neutral',
  Manager: 'warning',
  Admin: 'error',
}

const ROLE_OPTIONS: ('All' | UserRole)[] = ['All', 'Pharmacist', 'Technician', 'Front Desk', 'Manager', 'Admin']

export function UsersPage() {
  const [query, setQuery] = useState('')
  const [role, setRole] = useState<'All' | UserRole>('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SAMPLE_STAFF.filter((u) => {
      const matchesRole = role === 'All' || u.role === role
      const matchesQuery = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      return matchesRole && matchesQuery
    })
  }, [query, role])

  const active = SAMPLE_STAFF.filter((u) => u.status === 'Active').length
  const with2fa = SAMPLE_STAFF.filter((u) => u.twoFa).length

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Users"
        subtitle={`${SAMPLE_STAFF.length} staff · ${active} active · ${with2fa} with 2FA${query || role !== 'All' ? ` · ${filtered.length} matching` : ''}`}
        cta={
          <Button variant="primary" size="md">
            <Plus size={16} weight="bold" />
            Invite User
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
                placeholder="Search by name or email…"
                className="w-full h-10 pl-9 pr-3 type-body-sm bg-bg-surface border border-border rounded-control focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
              />
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'All' | UserRole)}
              className="h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r === 'All' ? 'All roles' : r}</option>
              ))}
            </select>
          </div>
        }
      />
      <section className="flex-1 p-6 overflow-y-auto">
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">User</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Email</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Role</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Status</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">2FA</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-text-secondary">
                    No users match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const initials = u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
                  return (
                    <tr key={u.id} className="h-12 border-b border-border-subtle hover:bg-bg-subtle cursor-pointer">
                      <td className="px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-pill bg-primary/10 text-primary flex items-center justify-center text-[11px] font-semibold shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-text-primary leading-tight">{u.name}</p>
                            <p className="type-mono-data text-text-disabled text-[10px]">{u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 text-[12px] text-text-secondary">{u.email}</td>
                      <td className="px-4">
                        <StatusPill variant={ROLE_VARIANT[u.role]}>{u.role}</StatusPill>
                      </td>
                      <td className="px-4">
                        <StatusPill variant={u.status === 'Active' ? 'success' : 'neutral'}>{u.status}</StatusPill>
                      </td>
                      <td className="px-4">
                        {u.twoFa ? <StatusPill variant="success">Enabled</StatusPill> : <StatusPill variant="warning">Required</StatusPill>}
                      </td>
                      <td className="px-4 type-mono-data text-text-secondary">{u.lastLogin}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default UsersPage
