import { useMemo, useState } from 'react'
import { Plus, MagnifyingGlass, Export } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { useStaffStore } from '@/stores/staff'
import { useToast } from '@/components/Toast'
import { type UserRole } from '@/data/sample'
import { formatLicenseExpiry, daysUntil } from '@/utils/formatDate'

const ROLE_VARIANT: Record<UserRole, 'success' | 'info' | 'neutral' | 'warning' | 'error'> = {
  Pharmacist: 'success',
  Technician: 'info',
  'Front Desk': 'neutral',
  Manager: 'warning',
  Admin: 'error',
}

const ROLE_OPTIONS: ('All' | UserRole)[] = ['All', 'Pharmacist', 'Technician', 'Front Desk', 'Manager', 'Admin']
const STATUS_OPTIONS: ('All' | 'Active' | 'Inactive')[] = ['All', 'Active', 'Inactive']

export function UsersPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const staff = useStaffStore((s) => s.staff)

  const [query, setQuery] = useState('')
  const [role, setRole] = useState<'All' | UserRole>('All')
  const [status, setStatus] = useState<'All' | 'Active' | 'Inactive'>('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return staff.filter((u) => {
      const matchesRole = role === 'All' || u.role === role
      const matchesStatus = status === 'All' || u.status === status
      const matchesQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.employeeNumber ?? '').toLowerCase().includes(q) ||
        (u.department ?? '').toLowerCase().includes(q)
      return matchesRole && matchesStatus && matchesQuery
    })
  }, [staff, query, role, status])

  const active = staff.filter((u) => u.status === 'Active').length
  const with2fa = staff.filter((u) => u.twoFa).length

  // Flag staff with license expiring within 90 days
  const expiringLicenseCount = staff.filter((u) => {
    if (!u.licenseExpiry) return false
    const days = daysUntil(u.licenseExpiry)
    return days >= 0 && days <= 90
  }).length

  function handleExport() {
    toast.show('CSV export requires backend connection — Integration Pending', { variant: 'info' })
  }

  const subtitleParts = [
    `${staff.length} staff`,
    `${active} active`,
    `${with2fa} with 2FA`,
    expiringLicenseCount > 0 ? `${expiringLicenseCount} license${expiringLicenseCount > 1 ? 's' : ''} expiring` : null,
    query || role !== 'All' || status !== 'All' ? `${filtered.length} matching` : null,
  ].filter(Boolean)

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Users"
        subtitle={subtitleParts.join(' · ')}
        cta={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" onClick={handleExport}>
              <Export size={16} />
              Export
            </Button>
            <Button variant="primary" size="md" onClick={() => navigate('/admin/users/new')}>
              <Plus size={16} weight="bold" />
              Invite Staff
            </Button>
          </div>
        }
        filterBar={
          <div className="flex items-center gap-3 w-full">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="search"
                aria-label="Search users by name, email, or department"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, or department..."
                className="w-full h-10 pl-9 pr-3 type-body-sm bg-bg-surface border border-border rounded-control focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
              />
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'All' | UserRole)}
              aria-label="Filter by role"
              className="h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r === 'All' ? 'All roles' : r}</option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'All' | 'Active' | 'Inactive')}
              aria-label="Filter by status"
              className="h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All status' : s}</option>
              ))}
            </select>
          </div>
        }
      />
      <section className="flex-1 p-6 overflow-y-auto">
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <caption className="sr-only">Staff user accounts</caption>
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">User</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Department</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Role</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Status</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">2FA</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">License</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center">
                    <p className="text-sm text-text-secondary mb-2">No staff match the current filters.</p>
                    <button
                      type="button"
                      onClick={() => { setQuery(''); setRole('All'); setStatus('All') }}
                      className="text-xs text-primary hover:underline"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const initials = u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
                  const licenseStatus = u.licenseExpiry ? formatLicenseExpiry(u.licenseExpiry) : null
                  return (
                    <tr
                      key={u.id}
                      className="h-12 border-b border-border-subtle hover:bg-bg-subtle cursor-pointer"
                      onClick={() => navigate(`/admin/users/${u.id}`)}
                    >
                      <td className="px-4">
                        <div className="flex items-center gap-3">
                          <div className={[
                            'w-8 h-8 rounded-pill flex items-center justify-center type-label font-semibold shrink-0',
                            u.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-bg-subtle text-text-disabled',
                          ].join(' ')}>
                            {initials}
                          </div>
                          <div>
                            <p className="type-body-sm font-medium text-text-primary leading-tight">{u.name}</p>
                            <p className="type-tiny text-text-disabled">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 type-body-xs text-text-secondary">
                        {u.department ?? <span className="text-text-disabled">—</span>}
                      </td>
                      <td className="px-4">
                        <StatusPill variant={ROLE_VARIANT[u.role]}>{u.role}</StatusPill>
                      </td>
                      <td className="px-4">
                        <StatusPill variant={u.status === 'Active' ? 'success' : 'neutral'}>{u.status}</StatusPill>
                      </td>
                      <td className="px-4">
                        {u.twoFa
                          ? <StatusPill variant="success">Enabled</StatusPill>
                          : <StatusPill variant="warning">Required</StatusPill>}
                      </td>
                      <td className="px-4">
                        {licenseStatus ? (
                          <span className={[
                            'type-label',
                            licenseStatus.tone === 'error' ? 'text-error' :
                            licenseStatus.tone === 'warning' ? 'text-warning' : 'text-text-secondary',
                          ].join(' ')}>
                            {licenseStatus.label}
                          </span>
                        ) : (
                          <span className="type-label text-text-disabled">—</span>
                        )}
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
