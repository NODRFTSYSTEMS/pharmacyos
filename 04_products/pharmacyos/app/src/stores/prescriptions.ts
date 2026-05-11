/**
 * Prescription workflow store — Phase D (Plan approval 2026-05-11).
 *
 * Manages prescription state transitions in the UI layer. Persisted locally
 * so demo workflow advances survive page refresh. Replace with Supabase
 * queries once G2 (backend provisioning) is complete.
 *
 * Transition rules:
 *   Received → Verified → Filled → Dispensed
 *   Any stage → Received (reject, with reason note)
 *
 * Authority: ADR Decision 7 — this is the UI guard layer only.
 * RLS + Edge Functions are the security boundary in production.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  SAMPLE_PRESCRIPTIONS,
  type Prescription,
  type RxStatus,
  type RxAuditEntry,
  type UserRole,
} from '@/data/sample'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PrescriptionStore {
  prescriptions: Prescription[]
  /** Advance status by one step. Appends audit trail entry. */
  advance: (id: string, actor: string, actorRole: UserRole) => void
  /** Reject back to Received with a reason note. */
  reject: (id: string, actor: string, actorRole: UserRole, reason: string) => void
  /** Look up by id or rxNumber. */
  getById: (id: string) => Prescription | undefined
  /** Reset store to sample data (for testing/demo reset). */
  reset: () => void
}

// ─── Transition logic ─────────────────────────────────────────────────────────

const NEXT_STATUS: Partial<Record<RxStatus, RxStatus>> = {
  Received: 'Verified',
  Verified: 'Filled',
  Filled:   'Dispensed',
}

function now(): string {
  return new Date().toISOString().slice(0, 16).replace('T', ' ')
}

function nextStatus(current: RxStatus): RxStatus | null {
  return NEXT_STATUS[current] ?? null
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const usePrescriptionStore = create<PrescriptionStore>()(
  persist(
    (set, get) => ({
      prescriptions: structuredClone(SAMPLE_PRESCRIPTIONS) as Prescription[],

      advance(id, actor, actorRole) {
        set((state) => {
          const idx = state.prescriptions.findIndex(
            (p) => p.id === id || p.rxNumber === id,
          )
          if (idx === -1) return state

          const rx = state.prescriptions[idx]
          const to = nextStatus(rx.status)
          if (!to) return state // Already Dispensed — no-op

          const entry: RxAuditEntry = {
            from: rx.status,
            to,
            actor,
            role: actorRole,
            timestamp: now(),
          }

          const updated: Prescription = {
            ...rx,
            status: to,
            // Decrement refillsRemaining when Filled → Dispensed
            refillsRemaining:
              to === 'Dispensed' && rx.refillsRemaining != null && rx.refillsRemaining > 0
                ? rx.refillsRemaining - 1
                : rx.refillsRemaining,
            auditTrail: [...(rx.auditTrail ?? []), entry],
          }

          const prescriptions = [...state.prescriptions]
          prescriptions[idx] = updated
          return { prescriptions }
        })
      },

      reject(id, actor, actorRole, reason) {
        set((state) => {
          const idx = state.prescriptions.findIndex(
            (p) => p.id === id || p.rxNumber === id,
          )
          if (idx === -1) return state

          const rx = state.prescriptions[idx]
          if (rx.status === 'Dispensed') return state // Cannot reject dispensed Rx

          const entry: RxAuditEntry = {
            from: rx.status,
            to: 'Received',
            actor,
            role: actorRole,
            timestamp: now(),
            note: reason,
          }

          const updated: Prescription = {
            ...rx,
            status: 'Received',
            auditTrail: [...(rx.auditTrail ?? []), entry],
          }

          const prescriptions = [...state.prescriptions]
          prescriptions[idx] = updated
          return { prescriptions }
        })
      },

      getById(id) {
        return get().prescriptions.find((p) => p.id === id || p.rxNumber === id)
      },

      reset() {
        set({ prescriptions: structuredClone(SAMPLE_PRESCRIPTIONS) as Prescription[] })
      },
    }),
    {
      name: 'pharmacyos-prescriptions',
    },
  ),
)
