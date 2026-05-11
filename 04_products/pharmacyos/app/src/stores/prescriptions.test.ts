import { describe, it, expect, beforeEach } from 'vitest'
import { usePrescriptionStore } from './prescriptions'

// Reset store state between tests
beforeEach(() => {
  usePrescriptionStore.getState().reset()
})

describe('prescription store', () => {
  it('initialises from SAMPLE_PRESCRIPTIONS', () => {
    const { prescriptions } = usePrescriptionStore.getState()
    expect(prescriptions.length).toBeGreaterThan(0)
    // At least some prescriptions in various statuses
    const statuses = new Set(prescriptions.map((p) => p.status))
    expect(statuses.size).toBeGreaterThan(1)
  })

  it('getById returns a prescription by id', () => {
    const rx = usePrescriptionStore.getState().getById('RX001')
    expect(rx).toBeDefined()
    expect(rx?.rxNumber).toBe('RX-2026-0847')
  })

  it('getById returns a prescription by rxNumber', () => {
    const rx = usePrescriptionStore.getState().getById('RX-2026-0847')
    expect(rx).toBeDefined()
    expect(rx?.id).toBe('RX001')
  })

  it('getById returns undefined for unknown id', () => {
    const rx = usePrescriptionStore.getState().getById('NONEXISTENT')
    expect(rx).toBeUndefined()
  })

  it('advance transitions Received → Verified', () => {
    const { advance, getById } = usePrescriptionStore.getState()
    const before = getById('RX001')
    expect(before?.status).toBe('Received')

    advance('RX001', 'Dr. K. Powell', 'Pharmacist')

    const after = usePrescriptionStore.getState().getById('RX001')
    expect(after?.status).toBe('Verified')
  })

  it('advance appends an audit trail entry', () => {
    const { advance, getById } = usePrescriptionStore.getState()
    advance('RX001', 'Dr. K. Powell', 'Pharmacist')

    const rx = usePrescriptionStore.getState().getById('RX001')
    const trail = rx?.auditTrail ?? []
    const entry = trail[trail.length - 1]

    expect(entry.from).toBe('Received')
    expect(entry.to).toBe('Verified')
    expect(entry.actor).toBe('Dr. K. Powell')
    expect(entry.role).toBe('Pharmacist')
    expect(entry.timestamp).toBeTruthy()
  })

  it('advance: Verified → Filled → Dispensed', () => {
    const { advance } = usePrescriptionStore.getState()
    // RX002 starts at Verified
    advance('RX002', 'Sandra M.', 'Technician')
    expect(usePrescriptionStore.getState().getById('RX002')?.status).toBe('Filled')

    advance('RX002', 'Tanya R.', 'Front Desk')
    expect(usePrescriptionStore.getState().getById('RX002')?.status).toBe('Dispensed')
  })

  it('advance is a no-op on Dispensed prescriptions', () => {
    const { advance, getById } = usePrescriptionStore.getState()
    // RX007 is already Dispensed in sample data
    const before = getById('RX007')
    expect(before?.status).toBe('Dispensed')

    const trailLenBefore = before?.auditTrail?.length ?? 0
    advance('RX007', 'Dr. K. Powell', 'Pharmacist')

    const after = usePrescriptionStore.getState().getById('RX007')
    expect(after?.status).toBe('Dispensed')
    expect(after?.auditTrail?.length).toBe(trailLenBefore) // No new entry
  })

  it('reject sends prescription back to Received with a note', () => {
    const { reject, getById } = usePrescriptionStore.getState()
    // RX002 starts at Verified
    reject('RX002', 'Dr. K. Powell', 'Pharmacist', 'Incorrect dosage — returned for review')

    const rx = usePrescriptionStore.getState().getById('RX002')
    expect(rx?.status).toBe('Received')

    const entry = rx?.auditTrail?.slice(-1)[0]
    expect(entry?.to).toBe('Received')
    expect(entry?.note).toContain('Incorrect dosage')
  })

  it('reject is a no-op on already-Dispensed prescriptions', () => {
    const { reject, getById } = usePrescriptionStore.getState()
    const before = getById('RX007')
    expect(before?.status).toBe('Dispensed')

    reject('RX007', 'Dr. K. Powell', 'Pharmacist', 'test')

    const after = usePrescriptionStore.getState().getById('RX007')
    expect(after?.status).toBe('Dispensed')
  })

  it('reset returns store to sample data', () => {
    const { advance, reset } = usePrescriptionStore.getState()
    advance('RX001', 'Dr. K. Powell', 'Pharmacist')
    expect(usePrescriptionStore.getState().getById('RX001')?.status).toBe('Verified')

    reset()
    expect(usePrescriptionStore.getState().getById('RX001')?.status).toBe('Received')
  })
})
