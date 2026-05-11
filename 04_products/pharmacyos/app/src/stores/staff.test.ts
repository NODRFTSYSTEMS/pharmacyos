import { describe, it, expect, beforeEach } from 'vitest'
import { useStaffStore } from './staff'

beforeEach(() => {
  useStaffStore.getState().reset()
})

describe('staff store', () => {
  it('initialises from SAMPLE_STAFF', () => {
    const { staff } = useStaffStore.getState()
    expect(staff.length).toBeGreaterThanOrEqual(12)
  })

  it('getById returns a staff member by id', () => {
    const u = useStaffStore.getState().getById('USR01')
    expect(u).toBeDefined()
    expect(u?.name).toBe('Dr. Kezia Powell')
    expect(u?.role).toBe('Pharmacist')
  })

  it('getById returns undefined for unknown id', () => {
    const u = useStaffStore.getState().getById('NONEXISTENT')
    expect(u).toBeUndefined()
  })

  it('addStaff appends a new member', () => {
    const before = useStaffStore.getState().staff.length
    useStaffStore.getState().addStaff({
      id: 'USR99',
      name: 'Test User',
      role: 'Technician',
      email: 'test@winchester.com.jm',
      status: 'Active',
      twoFa: false,
      lastLogin: 'Never',
    })
    expect(useStaffStore.getState().staff.length).toBe(before + 1)
    expect(useStaffStore.getState().getById('USR99')?.name).toBe('Test User')
  })

  it('updateStaff merges a patch', () => {
    useStaffStore.getState().updateStaff('USR01', { phone: '876-999-0000', notes: 'Updated' })
    const u = useStaffStore.getState().getById('USR01')
    expect(u?.phone).toBe('876-999-0000')
    expect(u?.notes).toBe('Updated')
    // Non-patched fields unchanged
    expect(u?.name).toBe('Dr. Kezia Powell')
  })

  it('updateStaff is a no-op for unknown id', () => {
    const before = useStaffStore.getState().staff.length
    useStaffStore.getState().updateStaff('NONEXISTENT', { phone: '000' })
    expect(useStaffStore.getState().staff.length).toBe(before)
  })

  it('setPermissionOverride sets a grant override', () => {
    useStaffStore.getState().setPermissionOverride('USR03', '/admin/users', true)
    const u = useStaffStore.getState().getById('USR03')
    expect(u?.permissionOverrides?.['/admin/users']).toBe(true)
  })

  it('setPermissionOverride sets a deny override', () => {
    useStaffStore.getState().setPermissionOverride('USR01', '/prescriptions', false)
    const u = useStaffStore.getState().getById('USR01')
    expect(u?.permissionOverrides?.['/prescriptions']).toBe(false)
  })

  it('setPermissionOverride with undefined reverts to inherited', () => {
    useStaffStore.getState().setPermissionOverride('USR01', '/prescriptions', false)
    useStaffStore.getState().setPermissionOverride('USR01', '/prescriptions', undefined)
    const u = useStaffStore.getState().getById('USR01')
    expect(u?.permissionOverrides?.['/prescriptions']).toBeUndefined()
  })

  it('byStatus returns only active staff', () => {
    const active = useStaffStore.getState().byStatus('Active')
    expect(active.every((u) => u.status === 'Active')).toBe(true)
    // USR06 is Inactive so it should not appear
    expect(active.find((u) => u.id === 'USR06')).toBeUndefined()
  })

  it('byStatus returns only inactive staff', () => {
    const inactive = useStaffStore.getState().byStatus('Inactive')
    expect(inactive.every((u) => u.status === 'Inactive')).toBe(true)
    expect(inactive.find((u) => u.id === 'USR06')).toBeDefined()
  })

  it('byStatus All returns all staff', () => {
    const all = useStaffStore.getState().byStatus('All')
    expect(all.length).toBe(useStaffStore.getState().staff.length)
  })

  it('nextEmployeeNumber returns EMP-013 when max is EMP-012', () => {
    const next = useStaffStore.getState().nextEmployeeNumber()
    expect(next).toBe('EMP-013')
  })

  it('nextEmployeeNumber increments after addStaff', () => {
    useStaffStore.getState().addStaff({
      id: 'USR99', name: 'X', role: 'Admin', email: 'x@x.com',
      status: 'Active', twoFa: false, lastLogin: 'Never',
      employeeNumber: 'EMP-050',
    })
    expect(useStaffStore.getState().nextEmployeeNumber()).toBe('EMP-051')
  })

  it('reset returns store to sample data', () => {
    useStaffStore.getState().updateStaff('USR01', { phone: '000-000-0000' })
    expect(useStaffStore.getState().getById('USR01')?.phone).toBe('000-000-0000')
    useStaffStore.getState().reset()
    expect(useStaffStore.getState().getById('USR01')?.phone).toBe('876-554-7701')
  })
})
