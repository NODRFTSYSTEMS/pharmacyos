/**
 * StaffDetailPage — /admin/users/:id
 * Three tabs: Profile | Permissions | Activity
 */
import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  PencilSimple, Power, LockKey, ShieldCheck,
  EnvelopeSimple, Phone, CalendarBlank, IdentificationCard,
  Warning,
} from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { Tabs, type TabDef } from '@/components/Tabs'
import { Placeholder } from '@/components/Placeholder'
import { useStaffStore } from '@/stores/staff'
import { useToast } from '@/components/Toast'
import { SAMPLE_ACTIVITY, type UserRole } from '@/data/sample'
import { formatLicenseExpiry, formatDate, daysUntil } from '@/utils/formatDate'
import { ROUTE_PERMISSIONS as APP_ROUTE_PERMISSIONS } from '@/config/route-permissions'

const ROLE_VARIANT: Record<UserRole, 'success' | 'info' | 'neutral' | 'warning' | 'error'> = {
  Pharmacist:   'success',
  Technician:   'info',
  'Front Desk': 'neutral',
  Manager:      'warning',
  Admin:        'error',
}

// ── Profile Tab ───────────────────────────────────────────────────────────────

function ProfileTab({
  userId,
}: {
  userId: string
}) {
  const navigate = useNavigate()
  const toast = useToast()
  const { getById, updateStaff } = useStaffStore()
  const u = useStaffStore((s) => s.getById(userId))
  if (!u) return null

  const supervisor = useStaffStore.getState().getById(u.supervisorId ?? '')
  const licenseStatus = u.licenseExpiry ? formatLicenseExpiry(u.licenseExpiry) : null
  const daysToExpiry = u.licenseExpiry ? daysUntil(u.licenseExpiry) : null

  function handleToggleActive() {
    const newStatus = u.status === 'Active' ? 'Inactive' : 'Active'
    updateStaff(u.id, { status: newStatus })
    toast.show(`${u.name} set to ${newStatus}.`, { variant: newStatus === 'Active' ? 'success' : 'info' })
  }

  function handleResetPassword() {
    toast.show('Password reset email requires SMTP integration — Integration Pending', { variant: 'info' })
  }

  function handleForce2FA() {
    updateStaff(u.id, { twoFa: true })
    toast.show(`2FA enabled for ${u.name}.`, { variant: 'success' })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Quick Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="secondary" size="sm" onClick={() => navigate(`/admin/users/${u.id}/edit`)}>
          <PencilSimple size={14} />
          Edit
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleToggleActive}
        >
          <Power size={14} />
          {u.status === 'Active' ? 'Deactivate' : 'Activate'}
        </Button>
        <Button variant="secondary" size="sm" onClick={handleResetPassword}>
          <LockKey size={14} />
          Reset Password
        </Button>
        {!u.twoFa && (
          <Button variant="secondary" size="sm" onClick={handleForce2FA}>
            <ShieldCheck size={14} />
            Enforce 2FA
          </Button>
        )}
      </div>

      {/* Compliance warning for expiring license */}
      {licenseStatus && licenseStatus.tone !== 'ok' && daysToExpiry !== null && (
        <div className="flex items-start gap-2 px-4 py-3 bg-tag-schedule-bg/30 border border-tag-schedule-fg/30 rounded-card text-sm">
          <Warning size={16} className="text-warning shrink-0 mt-0.5" />
          <p className="text-text-secondary">
            <span className="font-medium text-warning">License expiry alert:</span>{' '}
            {u.licenseNumber} expires {licenseStatus.label.toLowerCase()}.
            Renew with the Pharmacy Council of Jamaica before {u.licenseExpiry}.
          </p>
        </div>
      )}

      {/* Two-column card grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Personal */}
        <div className="bg-bg-surface rounded-card shadow-card p-4">
          <p className="type-caption text-text-secondary mb-3">Contact</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
              <EnvelopeSimple size={14} className="text-text-secondary shrink-0" />
              <a href={`mailto:${u.email}`} className="text-primary hover:underline truncate">{u.email}</a>
            </div>
            {u.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-text-secondary shrink-0" />
                <span className="text-text-primary">{u.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Employment */}
        <div className="bg-bg-surface rounded-card shadow-card p-4">
          <p className="type-caption text-text-secondary mb-3">Employment</p>
          <div className="flex flex-col gap-1.5">
            <Row label="Employee #" value={u.employeeNumber ?? '—'} mono />
            <Row label="Department" value={u.department ?? '—'} />
            <Row label="Type" value={u.employmentType ?? '—'} />
            {u.hireDate && <Row label="Hire Date" value={formatDate(u.hireDate)} />}
            {supervisor && (
              <div className="flex items-center justify-between">
                <span className="type-label text-text-secondary">Supervisor</span>
                <Link to={`/admin/users/${supervisor.id}`} className="type-label text-primary hover:underline">
                  {supervisor.name}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Account */}
        <div className="bg-bg-surface rounded-card shadow-card p-4">
          <p className="type-caption text-text-secondary mb-3">Account</p>
          <div className="flex flex-col gap-2">
            <Row label="Status">
              <StatusPill variant={u.status === 'Active' ? 'success' : 'neutral'}>{u.status}</StatusPill>
            </Row>
            <Row label="Role">
              <StatusPill variant={ROLE_VARIANT[u.role]}>{u.role}</StatusPill>
            </Row>
            <Row label="2FA">
              {u.twoFa
                ? <StatusPill variant="success">Enabled</StatusPill>
                : <StatusPill variant="warning">Not Enrolled</StatusPill>}
            </Row>
            <Row label="Last Login" value={u.lastLogin} mono />
          </div>
        </div>

        {/* Credentials */}
        {(u.licenseNumber || u.licenseExpiry) && (
          <div className="bg-bg-surface rounded-card shadow-card p-4">
            <p className="type-caption text-text-secondary mb-3">PCJ Credentials</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm">
                <IdentificationCard size={14} className="text-text-secondary shrink-0" />
                <span className="type-mono-data text-text-primary">{u.licenseNumber ?? '—'}</span>
              </div>
              {u.licenseExpiry && (
                <div className="flex items-center gap-2 text-sm">
                  <CalendarBlank size={14} className="text-text-secondary shrink-0" />
                  <span className={licenseStatus?.tone === 'error' ? 'text-error font-medium' : licenseStatus?.tone === 'warning' ? 'text-warning font-medium' : 'text-text-primary'}>
                    {licenseStatus?.label ?? u.licenseExpiry}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      {u.notes && (
        <div className="bg-bg-surface rounded-card shadow-card p-4">
          <p className="type-caption text-text-secondary mb-2">Notes</p>
          <p className="type-body-sm text-text-secondary leading-relaxed">{u.notes}</p>
        </div>
      )}
    </div>
  )
}

// ── Permissions Tab ───────────────────────────────────────────────────────────

function PermissionsTab({ userId }: { userId: string }) {
  const { getById, setPermissionOverride } = useStaffStore()
  const u = useStaffStore((s) => s.getById(userId))
  const toast = useToast()
  if (!u) return null

  const routes = Object.values(APP_ROUTE_PERMISSIONS)

  function handleSave() {
    toast.show('Permission overrides saved.', { variant: 'success' })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="type-body-sm text-text-secondary">
          Per-user overrides layer on top of role defaults.
          Green tick = explicit grant · Red outline = explicit deny · Grey = inherit role.
        </p>
        <Button variant="primary" size="sm" onClick={handleSave}>
          Save Overrides
        </Button>
      </div>
      <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
        <table className="w-full">
          <caption className="sr-only">Permission overrides for {u.name}</caption>
          <thead>
            <tr className="bg-bg-subtle border-b border-border">
              <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Route</th>
              <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Role Default</th>
              <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary w-32">Override</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => {
              const roleHasAccess = (route.roles as readonly string[]).includes(
                u.role === 'Pharmacist' ? 'pharmacist'
                : u.role === 'Technician' ? 'pharmacy_technician'
                : u.role === 'Front Desk' ? 'front_desk_cashier'
                : u.role === 'Manager' ? 'manager'
                : 'admin'
              )
              const override = u.permissionOverrides?.[route.path]
              return (
                <tr key={route.path} className="h-10 border-b border-border-subtle hover:bg-bg-subtle">
                  <td className="px-4 type-mono-data text-xs text-text-primary">{route.path}</td>
                  <td className="px-4">
                    <StatusPill variant={roleHasAccess ? 'success' : 'neutral'}>
                      {roleHasAccess ? 'Allowed' : 'Denied'}
                    </StatusPill>
                  </td>
                  <td className="px-4">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        title="Grant override"
                        onClick={() => setPermissionOverride(u.id, route.path, override === true ? undefined : true)}
                        className={[
                          'w-6 h-6 rounded border text-xs font-bold transition-colors',
                          override === true
                            ? 'bg-success border-success text-white'
                            : 'border-border text-text-disabled hover:border-success hover:text-success',
                        ].join(' ')}
                        aria-label={`Grant override for ${route.path}`}
                        aria-pressed={override === true}
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        title="Deny override"
                        onClick={() => setPermissionOverride(u.id, route.path, override === false ? undefined : false)}
                        className={[
                          'w-6 h-6 rounded border text-xs font-bold transition-colors',
                          override === false
                            ? 'bg-error border-error text-white'
                            : 'border-border text-text-disabled hover:border-error hover:text-error',
                        ].join(' ')}
                        aria-label={`Deny override for ${route.path}`}
                        aria-pressed={override === false}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Activity Tab ──────────────────────────────────────────────────────────────

function ActivityTab({ name }: { name: string }) {
  const entries = SAMPLE_ACTIVITY.filter(
    (e) => e.user.toLowerCase().includes(name.split(' ')[1]?.toLowerCase() ?? name.toLowerCase()),
  )
  if (entries.length === 0) {
    return (
      <p className="type-body-sm text-text-secondary text-center py-8">
        No activity entries found for this staff member.
      </p>
    )
  }
  return (
    <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
      <table className="w-full">
        <caption className="sr-only">Activity log for {name}</caption>
        <thead>
          <tr className="bg-bg-subtle border-b border-border">
            <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Time</th>
            <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Action</th>
            <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Target</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className="h-10 border-b border-border-subtle hover:bg-bg-subtle">
              <td className="px-4 type-mono-data text-text-secondary whitespace-nowrap">{e.timestamp}</td>
              <td className="px-4 type-body-xs text-text-primary">{e.action}</td>
              <td className="px-4 type-body-xs text-text-secondary">{e.target}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Helper ────────────────────────────────────────────────────────────────────

function Row({
  label,
  value,
  mono,
  children,
}: {
  label: string
  value?: string
  mono?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="type-label text-text-secondary shrink-0">{label}</span>
      {children ?? (
        <span className={mono ? 'type-mono-data text-text-primary' : 'type-body-xs text-text-primary'}>
          {value ?? '—'}
        </span>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function StaffDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const u = useStaffStore((s) => (id ? s.getById(id) : undefined))

  if (!u) {
    return <Placeholder title="Staff member not found" />
  }

  const tabs: TabDef[] = [
    { value: 'profile',     label: 'Profile',     content: <ProfileTab userId={u.id} /> },
    { value: 'permissions', label: 'Permissions', content: <PermissionsTab userId={u.id} /> },
    { value: 'activity',    label: 'Activity',    content: <ActivityTab name={u.name} /> },
  ]

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={u.name}
        subtitle={`${u.role} · ${u.department ?? 'No department'} · ${u.employeeNumber ?? u.id}`}
        breadcrumb={[
          { label: 'Users', to: '/admin/users' },
          { label: u.name },
        ]}
        cta={
          <Button variant="secondary" size="md" onClick={() => navigate(`/admin/users/${u.id}/edit`)}>
            <PencilSimple size={16} />
            Edit
          </Button>
        }
      />
      <section className="flex-1 p-6 overflow-y-auto min-h-0">
        <Tabs tabs={tabs} defaultValue="profile" className="h-full" />
      </section>
    </div>
  )
}

export default StaffDetailPage
