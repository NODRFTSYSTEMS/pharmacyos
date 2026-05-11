/**
 * EditStaffPage — /admin/users/:id/edit
 * Pre-populated version of NewStaffPage. Calls staffStore.updateStaff().
 */
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FloppyDisk } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { Placeholder } from '@/components/Placeholder'
import { useStaffStore } from '@/stores/staff'
import { useToast } from '@/components/Toast'
import { type UserRole, type Department, type EmploymentType } from '@/data/sample'

const ROLE_DEPARTMENT: Record<UserRole, Department> = {
  Pharmacist:    'Dispensary',
  Technician:    'Dispensary',
  'Front Desk':  'Front Office',
  Manager:       'Management',
  Admin:         'Administration',
}

const ROLE_OPTIONS: UserRole[] = ['Pharmacist', 'Technician', 'Front Desk', 'Manager', 'Admin']

export function EditStaffPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const { getById, updateStaff } = useStaffStore()

  const u = getById(id ?? '')

  // Hooks must be called unconditionally
  const [firstName, setFirstName] = useState(u?.firstName ?? '')
  const [lastName, setLastName] = useState(u?.lastName ?? '')
  const [phone, setPhone] = useState(u?.phone ?? '')
  const [role, setRole] = useState<UserRole>(u?.role ?? 'Pharmacist')
  const [employmentType, setEmploymentType] = useState<EmploymentType>(u?.employmentType ?? 'Full-time')
  const [hireDate, setHireDate] = useState(u?.hireDate ?? '')
  const [licenseNumber, setLicenseNumber] = useState(u?.licenseNumber ?? '')
  const [licenseExpiry, setLicenseExpiry] = useState(u?.licenseExpiry ?? '')
  const [notes, setNotes] = useState(u?.notes ?? '')

  if (!u) return <Placeholder title="Staff member not found" />

  const needsLicense = role === 'Pharmacist' || role === 'Technician'
  const department = ROLE_DEPARTMENT[role]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName || !lastName) {
      toast.show('First name and last name are required.', { variant: 'error' })
      return
    }
    updateStaff(u!.id, {
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      phone: phone || undefined,
      role,
      employmentType,
      hireDate: hireDate || undefined,
      department,
      licenseNumber: needsLicense && licenseNumber ? licenseNumber : undefined,
      licenseExpiry: needsLicense && licenseExpiry ? licenseExpiry : undefined,
      notes: notes || undefined,
    })
    toast.show(`${firstName} ${lastName} updated.`, { variant: 'success' })
    navigate(`/admin/users/${u!.id}`)
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={`Edit — ${u.name}`}
        subtitle={u.employeeNumber ?? u.id}
        breadcrumb={[
          { label: 'Users', to: '/admin/users' },
          { label: u.name, to: `/admin/users/${u.id}` },
          { label: 'Edit' },
        ]}
        cta={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" onClick={() => navigate(`/admin/users/${u.id}`)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleSubmit as unknown as () => void}>
              <FloppyDisk size={16} />
              Save Changes
            </Button>
          </div>
        }
      />

      <section className="flex-1 p-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex flex-col gap-6">
          {/* Personal */}
          <fieldset className="bg-bg-surface rounded-card shadow-card p-6 flex flex-col gap-4">
            <legend className="type-caption text-text-secondary mb-1">Personal Information</legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block type-label text-text-secondary mb-1" htmlFor="firstName">
                  First Name <span className="text-error">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
                  required
                />
              </div>
              <div>
                <label className="block type-label text-text-secondary mb-1" htmlFor="lastName">
                  Last Name <span className="text-error">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block type-label text-text-secondary mb-1" htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="876-555-0000"
                className="w-full h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control focus:outline-none focus:border-primary"
              />
            </div>
          </fieldset>

          {/* Employment */}
          <fieldset className="bg-bg-surface rounded-card shadow-card p-6 flex flex-col gap-4">
            <legend className="type-caption text-text-secondary mb-1">Employment</legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block type-label text-text-secondary mb-1" htmlFor="role">Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control"
                >
                  {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block type-label text-text-secondary mb-1" htmlFor="employmentType">
                  Employment Type
                </label>
                <select
                  id="employmentType"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                  className="w-full h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block type-label text-text-secondary mb-1" htmlFor="hireDate">Hire Date</label>
              <input
                id="hireDate"
                type="date"
                value={hireDate}
                onChange={(e) => setHireDate(e.target.value)}
                className="w-full h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control"
              />
            </div>
          </fieldset>

          {/* PCJ Credentials */}
          {needsLicense && (
            <fieldset className="bg-bg-surface rounded-card shadow-card p-6 flex flex-col gap-4">
              <legend className="type-caption text-text-secondary mb-1">PCJ Credentials</legend>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block type-label text-text-secondary mb-1" htmlFor="licenseNumber">
                    License Number
                  </label>
                  <input
                    id="licenseNumber"
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="PCJ-XXXXX"
                    className="w-full h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block type-label text-text-secondary mb-1" htmlFor="licenseExpiry">
                    Expiry Date
                  </label>
                  <input
                    id="licenseExpiry"
                    type="date"
                    value={licenseExpiry}
                    onChange={(e) => setLicenseExpiry(e.target.value)}
                    className="w-full h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </fieldset>
          )}

          {/* Notes */}
          <fieldset className="bg-bg-surface rounded-card shadow-card p-6 flex flex-col gap-4">
            <legend className="type-caption text-text-secondary mb-1">Notes</legend>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Optional internal notes..."
              className="w-full px-3 py-2 type-body-sm bg-bg-surface border border-border rounded-control focus:outline-none focus:border-primary resize-none"
            />
          </fieldset>

          <div className="flex justify-end gap-3 pb-4">
            <Button type="button" variant="secondary" size="md" onClick={() => navigate(`/admin/users/${u.id}`)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              <FloppyDisk size={16} />
              Save Changes
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default EditStaffPage
