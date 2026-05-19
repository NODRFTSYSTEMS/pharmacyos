import { describe, expect, it } from 'vitest'
import {
  buildRollbackDecision,
  buildSaleItemsPayload,
  roundMoney,
  validateStockBeforeSale,
  type PosCheckoutCartItem,
  type ProductStockSnapshot,
} from '../../lib/posCheckout'

const catalogItem: PosCheckoutCartItem = {
  product_id: '11111111-1111-1111-1111-111111111111',
  product_name: 'Paracetamol 500mg',
  barcode: '12345',
  unit_price: 125.555,
  qty: 2,
}

describe('POS checkout payload', () => {
  it('rounds money to two decimals', () => {
    expect(roundMoney(10.235)).toBe(10.24)
  })

  it('preserves catalog product IDs in sale payloads', () => {
    expect(buildSaleItemsPayload([catalogItem])[0].product_id).toBe(catalogItem.product_id)
  })

  it('converts custom item product IDs to null', () => {
    const payload = buildSaleItemsPayload([{ ...catalogItem, is_custom: true }])
    expect(payload[0].product_id).toBeNull()
    expect(payload[0].is_custom).toBe(true)
  })

  it('calculates rounded line totals', () => {
    expect(buildSaleItemsPayload([catalogItem])[0].line_total).toBe(251.11)
  })

  it('builds one payload row per cart item', () => {
    expect(buildSaleItemsPayload([catalogItem, { ...catalogItem, product_id: 'custom', is_custom: true }])).toHaveLength(2)
  })
})

describe('POS checkout stock validation', () => {
  const stock: ProductStockSnapshot[] = [{ product_id: catalogItem.product_id, stock_qty: 2 }]

  it('passes when catalog stock is sufficient', () => {
    expect(validateStockBeforeSale([catalogItem], stock)).toEqual([])
  })

  it('flags insufficient stock by product name', () => {
    expect(validateStockBeforeSale([{ ...catalogItem, qty: 3 }], stock)).toEqual(['Paracetamol 500mg'])
  })

  it('treats missing stock snapshots as unavailable stock', () => {
    expect(validateStockBeforeSale([catalogItem], [])).toEqual(['Paracetamol 500mg'])
  })

  it('ignores custom items because they do not decrement catalog stock', () => {
    expect(validateStockBeforeSale([{ ...catalogItem, is_custom: true }], [])).toEqual([])
  })
})

describe('POS checkout rollback decision', () => {
  it('allows sale recording when no stock failures exist', () => {
    expect(buildRollbackDecision([])).toEqual({
      shouldRollback: false,
      failedProducts: [],
      message: 'Sale can be recorded.',
    })
  })

  it('deduplicates failed product names', () => {
    expect(buildRollbackDecision(['Aspirin', 'Aspirin', '  ']).failedProducts).toEqual(['Aspirin'])
  })

  it('explains that failed stock reservation blocks transaction recording', () => {
    expect(buildRollbackDecision(['Aspirin']).message).toContain('Sale was not recorded')
  })
})
