import { describe, it, expect } from 'vitest'

// ── Prescription status machine — logic tests ─────────────────────────────────
// Mirrors Queue.tsx AdvanceButton logic (lines 55–116) and advance mutationFn.
//
// The Rx status machine is:
//   RECEIVED → VERIFYING → READY → DISPENSED
//   CANCELLED is a terminal state (no advance from it)
//   DISPENSED is a terminal state (no advance from it)
//
// Role enforcement:
//   READY → DISPENSED requires role === 'PHARMACIST'
//   Any other advance (RECEIVED→VERIFYING, VERIFYING→READY) has no role restriction
//
// Incorrect status machine behavior affects:
//   - Patient safety: drugs dispensed without pharmacist verification
//   - Compliance: audit log shows wrong actor/role for dispense action
//   - Queue integrity: stuck prescriptions block workflow

type PrescriptionStatus = 'RECEIVED' | 'VERIFYING' | 'READY' | 'DISPENSED' | 'CANCELLED'

// ── Mirror AdvanceButton logic from Queue.tsx ─────────────────────────────────

const STATUS_FLOW: Record<PrescriptionStatus, PrescriptionStatus | null> = {
  RECEIVED:  'VERIFYING',
  VERIFYING: 'READY',
  READY:     'DISPENSED',
  DISPENSED: null,  // terminal
  CANCELLED: null,  // terminal
}

function getNextStatus(current: PrescriptionStatus): PrescriptionStatus | null {
  return STATUS_FLOW[current]
}

function canAdvance(status: PrescriptionStatus): boolean {
  return STATUS_FLOW[status] !== null
}

// Mirror Queue.tsx: DISPENSED requires role === 'PHARMACIST'
function canDispense(status: PrescriptionStatus, role: string): boolean {
  if (status !== 'READY') return false
  return role === 'PHARMACIST'
}

// Mirror advance mutationFn: only DISPENSED sets dispensed_at and dispensed_by
function getDispenseFields(next: PrescriptionStatus, userId: string): Partial<{
  dispensed_at: string
  dispensed_by: string
}> {
  if (next !== 'DISPENSED') return {}
  return {
    dispensed_at: new Date().toISOString(),
    dispensed_by: userId,
  }
}

// ── Status flow tests ─────────────────────────────────────────────────────────

describe('Rx status machine — valid transitions', () => {
  it('RECEIVED → VERIFYING is the first step', () => {
    expect(getNextStatus('RECEIVED')).toBe('VERIFYING')
  })

  it('VERIFYING → READY marks prescription ready to dispense', () => {
    expect(getNextStatus('VERIFYING')).toBe('READY')
  })

  it('READY → DISPENSED is the final dispensing step', () => {
    expect(getNextStatus('READY')).toBe('DISPENSED')
  })

  it('DISPENSED has no next status — it is terminal', () => {
    expect(getNextStatus('DISPENSED')).toBeNull()
  })

  it('CANCELLED has no next status — it is terminal', () => {
    expect(getNextStatus('CANCELLED')).toBeNull()
  })
})

describe('canAdvance — which statuses can move forward', () => {
  it('RECEIVED can advance', () => {
    expect(canAdvance('RECEIVED')).toBe(true)
  })

  it('VERIFYING can advance', () => {
    expect(canAdvance('VERIFYING')).toBe(true)
  })

  it('READY can advance', () => {
    expect(canAdvance('READY')).toBe(true)
  })

  it('DISPENSED cannot advance — terminal', () => {
    expect(canAdvance('DISPENSED')).toBe(false)
  })

  it('CANCELLED cannot advance — terminal', () => {
    expect(canAdvance('CANCELLED')).toBe(false)
  })
})

// ── Role enforcement for dispensing ──────────────────────────────────────────

describe('canDispense — PHARMACIST role gate for final dispense', () => {
  it('PHARMACIST can dispense a READY prescription', () => {
    expect(canDispense('READY', 'PHARMACIST')).toBe(true)
  })

  it('CASHIER cannot dispense — role gate blocks non-pharmacists', () => {
    expect(canDispense('READY', 'CASHIER')).toBe(false)
  })

  it('TECHNICIAN cannot dispense', () => {
    expect(canDispense('READY', 'TECHNICIAN')).toBe(false)
  })

  it('MANAGER cannot dispense — dispense is pharmacist-only even for managers', () => {
    expect(canDispense('READY', 'MANAGER')).toBe(false)
  })

  it('ADMIN cannot dispense directly — role gate is strict', () => {
    expect(canDispense('READY', 'ADMIN')).toBe(false)
  })

  it('AUDITOR cannot dispense', () => {
    expect(canDispense('READY', 'AUDITOR')).toBe(false)
  })

  it('cannot dispense a RECEIVED prescription — must flow through states', () => {
    // Bypassing VERIFYING and going straight to DISPENSED is not permitted
    expect(canDispense('RECEIVED', 'PHARMACIST')).toBe(false)
  })

  it('cannot dispense a VERIFYING prescription — not yet READY', () => {
    expect(canDispense('VERIFYING', 'PHARMACIST')).toBe(false)
  })

  it('cannot dispense an already-DISPENSED prescription', () => {
    expect(canDispense('DISPENSED', 'PHARMACIST')).toBe(false)
  })

  it('cannot dispense a CANCELLED prescription', () => {
    expect(canDispense('CANCELLED', 'PHARMACIST')).toBe(false)
  })
})

// ── Dispense fields ───────────────────────────────────────────────────────────
// Mirror advance mutationFn: only DISPENSED transition sets dispensed_at and dispensed_by

describe('getDispenseFields — audit fields on dispense', () => {
  it('DISPENSED transition sets dispensed_at and dispensed_by', () => {
    const fields = getDispenseFields('DISPENSED', 'user-123')
    expect(fields).toHaveProperty('dispensed_at')
    expect(fields).toHaveProperty('dispensed_by')
    expect(fields.dispensed_by).toBe('user-123')
    // dispensed_at is an ISO timestamp
    expect(typeof fields.dispensed_at).toBe('string')
    expect(new Date(fields.dispensed_at!).getTime()).not.toBeNaN()
  })

  it('VERIFYING transition does NOT set dispense fields', () => {
    const fields = getDispenseFields('VERIFYING', 'user-123')
    expect(fields).not.toHaveProperty('dispensed_at')
    expect(fields).not.toHaveProperty('dispensed_by')
  })

  it('READY transition does NOT set dispense fields', () => {
    const fields = getDispenseFields('READY', 'user-123')
    expect(Object.keys(fields)).toHaveLength(0)
  })
})

// ── Full Rx lifecycle scenario ────────────────────────────────────────────────

describe('Rx full lifecycle — RECEIVED to DISPENSED', () => {
  it('complete happy path: RECEIVED → VERIFYING → READY → DISPENSED', () => {
    let status: PrescriptionStatus = 'RECEIVED'

    // Step 1: intake clerk starts verification
    expect(canAdvance(status)).toBe(true)
    status = getNextStatus(status)!
    expect(status).toBe('VERIFYING')

    // Step 2: technician marks ready
    expect(canAdvance(status)).toBe(true)
    status = getNextStatus(status)!
    expect(status).toBe('READY')

    // Step 3: pharmacist dispenses — role gate
    expect(canDispense(status, 'PHARMACIST')).toBe(true)
    const dispenseFields = getDispenseFields('DISPENSED', 'pharm-456')
    status = getNextStatus(status)!
    expect(status).toBe('DISPENSED')
    expect(dispenseFields.dispensed_by).toBe('pharm-456')

    // Step 4: DISPENSED is terminal
    expect(canAdvance(status)).toBe(false)
    expect(getNextStatus(status)).toBeNull()
  })

  it('non-pharmacist cannot complete dispense even if prescription is READY', () => {
    const status: PrescriptionStatus = 'READY'
    // PHARMACIST can
    expect(canDispense(status, 'PHARMACIST')).toBe(true)
    // Nobody else can — regression guard
    for (const role of ['CASHIER', 'TECHNICIAN', 'MANAGER', 'ADMIN', 'AUDITOR']) {
      expect(canDispense(status, role)).toBe(false)
    }
  })

  it('CANCELLED prescription is permanently frozen — no advance under any role', () => {
    const status: PrescriptionStatus = 'CANCELLED'
    expect(canAdvance(status)).toBe(false)
    expect(canDispense(status, 'PHARMACIST')).toBe(false)
    expect(getNextStatus(status)).toBeNull()
  })
})

// ── Status label completeness ──────────────────────────────────────────────────

describe('status set completeness', () => {
  const ALL_STATUSES: PrescriptionStatus[] = [
    'RECEIVED', 'VERIFYING', 'READY', 'DISPENSED', 'CANCELLED',
  ]

  it('every status has an entry in STATUS_FLOW (no missing keys)', () => {
    for (const s of ALL_STATUSES) {
      expect(Object.keys(STATUS_FLOW)).toContain(s)
    }
  })

  it('exactly two statuses are terminal (DISPENSED and CANCELLED)', () => {
    const terminals = ALL_STATUSES.filter(s => STATUS_FLOW[s] === null)
    expect(terminals).toHaveLength(2)
    expect(terminals).toContain('DISPENSED')
    expect(terminals).toContain('CANCELLED')
  })

  it('exactly three statuses can advance forward', () => {
    const advanceable = ALL_STATUSES.filter(canAdvance)
    expect(advanceable).toHaveLength(3)
    expect(advanceable).toContain('RECEIVED')
    expect(advanceable).toContain('VERIFYING')
    expect(advanceable).toContain('READY')
  })
})
