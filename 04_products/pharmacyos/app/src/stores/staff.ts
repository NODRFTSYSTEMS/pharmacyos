/**
 * Staff store — manages the staff roster for PharmacyOS.
 *
 * Initialized from SAMPLE_STAFF. In production: replace initializer with
 * a Supabase query; the store interface is unchanged.
 *
 * Persistence: localStorage key 'pharmacyos-staff'. Clears on reset().
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SAMPLE_STAFF, type StaffUser } from '@/data/sample'

export interface StaffStore {
  staff: StaffUser[]
  /** Returns a staff member by id. */
  getById: (id: string) => StaffUser | undefined
  /** Appends a new staff member. id must be unique. */
  addStaff: (user: StaffUser) => void
  /** Merges partial fields into an existing staff member by id. */
  updateStaff: (id: string, patch: Partial<StaffUser>) => void
  /**
   * Set a per-user permission override.
   * value=true → explicit grant, value=false → explicit deny, value=undefined → revert to role default.
   */
  setPermissionOverride: (userId: string, routeKey: string, value: boolean | undefined) => void
  /** Returns all staff, optionally filtered by status. */
  byStatus: (status: 'Active' | 'Inactive' | 'All') => StaffUser[]
  /** Returns the next available employee number (EMP-NNN). */
  nextEmployeeNumber: () => string
  /** Reset store to sample data. Used in tests. */
  reset: () => void
}

const INITIAL_STAFF = (): StaffUser[] => structuredClone(SAMPLE_STAFF)

export const useStaffStore = create<StaffStore>()(
  persist(
    (set, get) => ({
      staff: INITIAL_STAFF(),

      getById: (id) => get().staff.find((s) => s.id === id),

      addStaff: (user) =>
        set((state) => ({ staff: [...state.staff, user] })),

      updateStaff: (id, patch) =>
        set((state) => ({
          staff: state.staff.map((s) =>
            s.id === id ? { ...s, ...patch } : s,
          ),
        })),

      setPermissionOverride: (userId, routeKey, value) =>
        set((state) => ({
          staff: state.staff.map((s) => {
            if (s.id !== userId) return s
            const overrides = { ...(s.permissionOverrides ?? {}) }
            if (value === undefined) {
              delete overrides[routeKey]
            } else {
              overrides[routeKey] = value
            }
            return { ...s, permissionOverrides: overrides }
          }),
        })),

      byStatus: (status) => {
        const { staff } = get()
        if (status === 'All') return staff
        return staff.filter((s) => s.status === status)
      },

      nextEmployeeNumber: () => {
        const { staff } = get()
        const nums = staff
          .map((s) => s.employeeNumber)
          .filter((n): n is string => !!n)
          .map((n) => parseInt(n.replace('EMP-', ''), 10))
          .filter((n) => !isNaN(n))
        const max = nums.length > 0 ? Math.max(...nums) : 0
        return `EMP-${String(max + 1).padStart(3, '0')}`
      },

      reset: () => set({ staff: INITIAL_STAFF() }),
    }),
    { name: 'pharmacyos-staff' },
  ),
)
