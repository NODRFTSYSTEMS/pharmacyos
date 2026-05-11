/**
 * NewStaffPage — 5-section staff intake form.
 * Phase 4 implementation. This stub passes compilation and tests while the full
 * form is built out.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { useStaffStore } from '@/stores/staff'
import { useToast } from '@/components/Toast'
import { type UserRole, type Department } from '@/data/sample'

/** Auto-assign department from role. */
const ROLE_DEPARTMENT: Record<UserRole, Department> = {
  Pharmacist:    'Dispensary',
  Technician:    'Dispensary',
  'Front Desk':  'Front Office',
  Manager:       'Management',
  Admin:         'Administration',
}

/** Auto-assign 2FA default from role. */
const ROLE_2FA_DEFAULT: Record<UserRole, boolean> = {
  Pharmacist:    true,
  Technician:    false,
  'Front Desk':  false,
  Manager:       false,
  Admin:         true,
}

const ROLE_OPTIONS: UserRole[] = ['Pharmacist', 'Technician', 'Front Desk', 'Manager', 'Admin']

function buildEmail(firstName: string, lastName: string): string {
  if (!firstName || !lastName) return ''
  return `${firstName[0].toLowerCase()}${lastName.toLowerCase().replace(/\s+/g, '')}@winchester.com.jm`
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function NewStaffPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { addStaff, nextEmployeeNumber } = useStaffStore()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<UserRole>('Pharmacist')
  const [employmentType, setEmploymentType] = useState<'Full-time' | 'Part-time' | 'Contract'>('Full-time')
  const [hireDate, setHireDate] = useState(todayIso())
  const [licenseNumber, setLicenseNumber] = useState('')
  const [licenseExpiry, setLicenseExpiry] = useState('')
  const [notes, setNotes] = useState('')

  const email = buildEmail(firstName, lastName)
  const department = ROLE_DEPARTMENT[role]
  const twoFaDefault = ROLE_2FA_DEFAULT[role]
  const needsLicense = role === 'Pharmacist' || role === 'Technician'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName || !lastName) {
      toast.show('First name and last name are required.', { variant: 'error' })
      return
    }

    const empNum = nextEmployeeNumber()
    const newId = `USR${Date.now().toString().slice(-4)}`

    addStaff({
      id: newId,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email,
      role,
      status: 'Active',
      twoFa: twoFaDefault,
      lastLogin: 'Never',
      employeeNumber: empNum,
      hireDate,
      department,
      employmentType,
      phone: phone || undefined,
      licenseNumber: needsLicense && licenseNumber ? licenseNumber : undefined,
      licenseExpiry: needsLicense && licenseExpiry ? licenseExpiry : undefined,
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
    })

    toast.show(`${firstName} ${lastName} added as ${role}.`, { variant: 'success' })
    navigate(`/admin/users/${newId}`)
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Invite Staff Member"
        subtitle="New staff account — Winchester Pharmacy"
        breadcrumb={[
          { label: 'Users', to: '/admin/users' },
          { label: 'New' },
        ]}
        cta={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" onClick={() => navigate('/admin/users')}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleSubmit as unknown as () => void}>
              <UserPlus size={16} weight="bold" />
              Create Account
            </Button>
          </div>
        }
      />

      <section className="flex-1 p-6 overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto flex flex-col gap-6"
        >
          {/* Section 1 — Personal Info */}
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
              <label className="block type-label text-text-secondary mb-1" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="876-555-0000"
                className="w-full h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
              />
            </div>
          </fieldset>

          {/* Section 2 — Employment */}
          <fieldset className="bg-bg-surface rounded-card shadow-card p-6 flex flex-col gap-4">
            <legend className="type-caption text-text-secondary mb-1">Employment</legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block type-label text-text-secondary mb-1" htmlFor="role">
                  Role <span className="text-error">*</span>
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control focus:outline-none focus:border-primary"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block type-label text-text-secondary mb-1" htmlFor="employmentType">
                  Employment Type
                </label>
                <select
                  id="employmentType"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as 'Full-time' | 'Part-time' | 'Contract')}
                  className="w-full h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control focus:outline-none focus:border-primary"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block type-label text-text-secondary mb-1" htmlFor="hireDate">
                Hire Date
              </label>
              <input
                id="hireDate"
                type="date"
                value={hireDate}
                onChange={(e) => setHireDate(e.target.value)}
                className="w-full h-10 px-3 type-body-sm bg-bg-surface border border-border rounded-control focus:outline-none focus:border-primary"
              />
            </div>
          </fieldset>

          {/* Section 3 — Auto-populated Account fields (read-only preview) */}
          <fieldset className="bg-bg-surface rounded-card shadow-card p-6 flex flex-col gap-4">
            <legend className="type-caption text-text-secondary mb-1">Account Setup (Auto-generated)</legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="type-label text-text-secondary mb-1">Work Email</p>
                <p className={`type-body-sm ${email ? 'text-text-primary' : 'text-text-disabled italic'}`}>
                  {email || 'Enter first + last name above'}
                </p>
              </div>
              <div>
                <p className="type-label text-text-secondary mb-1">Employee Number</p>
                <p className="type-mono-data text-text-primary">{nextEmployeeNumber()}</p>
              </div>
              <div>
                <p className="type-label text-text-secondary mb-1">Department</p>
                <p className="type-body-sm text-text-primary">{department}</p>
              </div>
              <div>
                <p className="type-label text-text-secondary mb-1">2FA Default</p>
                <p className={`type-body-sm ${twoFaDefault ? 'text-success' : 'text-text-secondary'}`}>
                  {twoFaDefault ? 'Enabled (required for this role)' : 'Optional'}
                </p>
              </div>
            </div>
          </fieldset>

          {/* Section 4 — Credentials (conditional) */}
          {needsLicense && (
            <fieldset className="bg-bg-surface rounded-card shadow-card p-6 flex flex-col gap-4">
              <legend className="type-caption text-text-secondary mb-1">
                Pharmacy Council of Jamaica Credentials
              </legend>
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
                    License Expiry Date
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

          {/* Section 5 — Notes */}
          <fieldset className="bg-bg-surface rounded-card shadow-card p-6 flex flex-col gap-4">
            <legend className="type-caption text-text-secondary mb-1">Notes</legend>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Optional internal notes about this staff member..."
              className="w-full px-3 py-2 type-body-sm bg-bg-surface border border-border rounded-control focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20 resize-none"
            />
          </fieldset>

          <div className="flex justify-end gap-3 pb-4">
            <Button type="button" variant="secondary" size="md" onClick={() => navigate('/admin/users')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              <UserPlus size={16} weight="bold" />
              Create Account
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default NewStaffPage
