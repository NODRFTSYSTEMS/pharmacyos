import { describe, expect, it } from 'vitest'
import {
  buildAccessDeniedEscalation,
  normalizeSupportEmail,
} from '../../lib/adminEscalation'
import {
  buildDispensingReportSummary,
  buildInventoryReportSummary,
  getInventoryExpiryStatus,
} from '../../lib/reportSummaries'
import { getLoginReasonMessage } from '../../lib/sessionMessages'
import type { Product, RxTransaction } from '../../types/database'

function product(overrides: Partial<Product>): Product {
  return {
    id: 'p1',
    name: 'Paracetamol 500mg',
    barcode: '123',
    category: 'Analgesic',
    unit_price: 100,
    cost_price: 70,
    stock_qty: 3,
    reorder_level: 5,
    supplier_id: null,
    is_active: true,
    notes: null,
    expiry_date: '2026-05-20',
    batch_number: 'B1',
    image_url: null,
    image_alt: null,
    created_at: '2026-05-18T10:00:00Z',
    updated_at: '2026-05-18T10:00:00Z',
    ...overrides,
  }
}

function rx(overrides: Partial<RxTransaction>): RxTransaction {
  return {
    id: 'rx1',
    ref_number: 'RX-1',
    prescription_id: null,
    patient_name: 'Hidden Patient',
    drug_name: 'Amoxicillin',
    quantity_dispensed: 14,
    cashier_id: null,
    dispensed_by: 'Pharmacist',
    subtotal: 0,
    nhf_subsidy: 200,
    patient_copay: 500,
    payment_method: 'CASH',
    voided: false,
    voided_by: null,
    voided_at: null,
    created_at: '2026-05-18T10:00:00Z',
    ...overrides,
  }
}

describe('session expiry login message', () => {
  it('returns the session expired login message', () => {
    expect(getLoginReasonMessage('session_expired')?.title).toBe('Session expired')
  })

  it('ignores unsupported login reasons', () => {
    expect(getLoginReasonMessage('manual_logout')).toBeNull()
  })

  it('ignores missing login reasons', () => {
    expect(getLoginReasonMessage(null)).toBeNull()
  })
})

describe('admin escalation content', () => {
  it('normalizes support email addresses', () => {
    expect(normalizeSupportEmail(' Admin@Pharmacy.Example ')).toBe('admin@pharmacy.example')
  })

  it('rejects invalid support email addresses', () => {
    expect(normalizeSupportEmail('not-an-email')).toBeNull()
  })

  it('builds a mailto escalation link with the access context', () => {
    const escalation = buildAccessDeniedEscalation({
      supportEmail: 'admin@pharmacy.example',
      role: 'CASHIER',
      attemptedPath: '/reports/inventory',
      requiredPermission: 'reports_view',
    })
    expect(escalation.href).toContain('mailto:admin@pharmacy.example')
    expect(decodeURIComponent(escalation.href ?? '')).toContain('Required permission: reports_view')
  })

  it('returns a fallback when no support email is configured', () => {
    expect(buildAccessDeniedEscalation({
      supportEmail: '',
      role: 'CASHIER',
      attemptedPath: '/admin/users',
      requiredPermission: 'staff_manage',
    }).href).toBeNull()
  })
})

describe('report assistant summaries', () => {
  it('marks expired inventory correctly', () => {
    expect(getInventoryExpiryStatus('2026-05-17', new Date('2026-05-18T12:00:00Z'))).toBe('EXPIRED')
  })

  it('includes inventory exception counts', () => {
    const summary = buildInventoryReportSummary([
      product({ id: 'p1', name: 'A', stock_qty: 0 }),
      product({ id: 'p2', name: 'B', stock_qty: 3, reorder_level: 5 }),
    ], { tab: 'ALL', search: '', filteredCount: 2, today: new Date('2026-05-18T12:00:00Z') })
    expect(summary).toContain('Out of stock count: 1')
    expect(summary).toContain('Low stock count: 1')
  })

  it('includes inventory filter context', () => {
    expect(buildInventoryReportSummary([
      product({ name: 'Cetirizine', stock_qty: 10, reorder_level: 5 }),
    ], { tab: 'IN_STOCK', search: 'cet', filteredCount: 1 })).toContain('Search: cet')
  })

  it('excludes patient names from dispensing AI context', () => {
    const summary = buildDispensingReportSummary([rx({ patient_name: 'Private Name' })], {
      from: '2026-05-01',
      to: '2026-05-18',
    })
    expect(summary).not.toContain('Private Name')
    expect(summary).toContain('Patient names are intentionally excluded')
  })

  it('summarizes dispensing void counts', () => {
    const summary = buildDispensingReportSummary([rx({}), rx({ id: 'rx2', voided: true })], {
      from: '2026-05-01',
      to: '2026-05-18',
    })
    expect(summary).toContain('Voided dispensings: 1')
  })
})
