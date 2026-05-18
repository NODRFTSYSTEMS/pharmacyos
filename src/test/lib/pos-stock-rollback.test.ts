import { describe, it, expect } from 'vitest'

// ── POS Stock Rollback Logic ──────────────────────────────────────────────────
// Mirrors the decision logic inside process_retail_sale (Migration 039).
// The RPC wraps the full POS checkout in a single Postgres transaction.
// These tests protect the business rules without requiring a live database.
//
// Key invariants this test suite enforces:
//   1. Custom items (is_custom = true) NEVER decrement stock
//   2. Catalog items (is_custom = false) ALWAYS attempt stock decrement
//   3. Stock floors at 0 — GREATEST(0, stock_qty - qty) — never goes negative
//   4. Missing catalog product → recorded in stock_failures[], sale commits
//   5. Stock failures surface to caller but do NOT abort the transaction
//   6. Audit log receives item_count from jsonb_array_length(p_cart_items)
//   7. ref_number is passed through unchanged in the return payload

// ── Type mirrors ──────────────────────────────────────────────────────────────

interface CartItem {
  product_id: string | null
  product_name: string
  barcode: string | null
  quantity: number
  unit_price: number
  line_total: number
  is_custom: boolean
}

interface ProductRecord {
  id: string
  name: string
  stock_qty: number
}

interface SaleResult {
  transaction_id: string
  ref_number: string
  stock_failures: string[]
}

// ── Pure mirrors of RPC business logic ───────────────────────────────────────

/** Mirror: FOR v_item WHERE NOT is_custom — which items attempt stock decrement */
function getCatalogItems(cart: CartItem[]): CartItem[] {
  return cart.filter(item => !item.is_custom)
}

/** Mirror: FOR v_item WHERE is_custom — which items skip stock decrement */
function getCustomItems(cart: CartItem[]): CartItem[] {
  return cart.filter(item => item.is_custom)
}

/**
 * Mirror: UPDATE products SET stock_qty = GREATEST(0, stock_qty - v_qty)
 * Returns { qty_after, found } — qty_after is null when NOT FOUND.
 */
function decrementStock(
  catalog: ProductRecord[],
  productId: string,
  qty: number,
): { qty_after: number | null; found: boolean } {
  const product = catalog.find(p => p.id === productId)
  if (!product) return { qty_after: null, found: false }
  const qty_after = Math.max(0, product.stock_qty - qty)
  product.stock_qty = qty_after                          // mutate in-place (mirrors UPDATE)
  return { qty_after, found: true }
}

/**
 * Mirror: full RPC stock-decrement loop.
 * Returns list of product_names where stock decrement failed (product not found).
 * The list is empty when all catalog items decremented successfully.
 */
function processStockDecrements(
  catalog: ProductRecord[],
  cart: CartItem[],
): string[] {
  const stockFailures: string[] = []
  for (const item of getCatalogItems(cart)) {
    const { found } = decrementStock(catalog, item.product_id!, item.quantity)
    if (!found) {
      stockFailures.push(item.product_name)
    }
  }
  return stockFailures
}

/**
 * Mirror: full process_retail_sale return payload
 * In reality transaction_id comes from the INSERT RETURNING id — we use a
 * deterministic placeholder here since we are not testing UUID generation.
 */
function processRetailSale(
  catalog: ProductRecord[],
  cart: CartItem[],
  refNumber: string,
  txnId = 'mock-txn-uuid',
): SaleResult {
  const stockFailures = processStockDecrements(catalog, cart)
  return {
    transaction_id: txnId,
    ref_number: refNumber,
    stock_failures: stockFailures,
  }
}

/** Mirror: audit_log details.item_count = jsonb_array_length(p_cart_items) */
function auditItemCount(cart: CartItem[]): number {
  return cart.length         // jsonb_array_length counts ALL items, not just catalog
}

// ── Helper factories ──────────────────────────────────────────────────────────

function makeCatalogItem(overrides?: Partial<CartItem>): CartItem {
  return {
    product_id: 'prod-uuid-001',
    product_name: 'Amoxicillin 500mg',
    barcode: '6001234567890',
    quantity: 1,
    unit_price: 350,
    line_total: 350,
    is_custom: false,
    ...overrides,
  }
}

function makeCustomItem(overrides?: Partial<CartItem>): CartItem {
  return {
    product_id: null,
    product_name: 'Pharmacy Consultation Fee',
    barcode: null,
    quantity: 1,
    unit_price: 500,
    line_total: 500,
    is_custom: true,
    ...overrides,
  }
}

function makeProduct(overrides?: Partial<ProductRecord>): ProductRecord {
  return {
    id: 'prod-uuid-001',
    name: 'Amoxicillin 500mg',
    stock_qty: 100,
    ...overrides,
  }
}

// ── Custom vs catalog item classification ─────────────────────────────────────

describe('cart item classification — custom vs catalog', () => {
  it('identifies catalog items (is_custom = false) for stock decrement', () => {
    const cart = [makeCatalogItem(), makeCustomItem()]
    expect(getCatalogItems(cart)).toHaveLength(1)
    expect(getCatalogItems(cart)[0].is_custom).toBe(false)
  })

  it('identifies custom items (is_custom = true) for stock skip', () => {
    const cart = [makeCatalogItem(), makeCustomItem()]
    expect(getCustomItems(cart)).toHaveLength(1)
    expect(getCustomItems(cart)[0].is_custom).toBe(true)
  })

  it('all-catalog cart: every item is classified for decrement', () => {
    const cart = [makeCatalogItem({ product_id: 'p1' }), makeCatalogItem({ product_id: 'p2' })]
    expect(getCatalogItems(cart)).toHaveLength(2)
    expect(getCustomItems(cart)).toHaveLength(0)
  })

  it('all-custom cart: no items classified for stock decrement', () => {
    const cart = [makeCustomItem(), makeCustomItem({ product_name: 'Delivery Charge' })]
    expect(getCatalogItems(cart)).toHaveLength(0)
    expect(getCustomItems(cart)).toHaveLength(2)
  })

  it('empty cart: both classifications return empty arrays', () => {
    expect(getCatalogItems([])).toHaveLength(0)
    expect(getCustomItems([])).toHaveLength(0)
  })

  it('mixed cart: classification counts add up to total cart size', () => {
    const cart = [makeCatalogItem(), makeCustomItem(), makeCatalogItem({ product_id: 'p2' })]
    const catalogCount = getCatalogItems(cart).length
    const customCount  = getCustomItems(cart).length
    expect(catalogCount + customCount).toBe(cart.length)
  })
})

// ── Stock decrement logic ─────────────────────────────────────────────────────

describe('decrementStock — GREATEST(0, stock_qty - qty)', () => {
  it('decrements stock for a found product', () => {
    const catalog = [makeProduct({ stock_qty: 50 })]
    const result  = decrementStock(catalog, 'prod-uuid-001', 5)
    expect(result.found).toBe(true)
    expect(result.qty_after).toBe(45)
  })

  it('returns found=false for a product not in catalog', () => {
    const catalog = [makeProduct({ id: 'prod-uuid-001' })]
    const result  = decrementStock(catalog, 'MISSING-PRODUCT-ID', 1)
    expect(result.found).toBe(false)
    expect(result.qty_after).toBeNull()
  })

  it('floors at 0 when qty_sold exceeds stock_qty (GREATEST(0, ...))', () => {
    const catalog = [makeProduct({ stock_qty: 3 })]
    const result  = decrementStock(catalog, 'prod-uuid-001', 10)
    expect(result.found).toBe(true)
    expect(result.qty_after).toBe(0)   // floored at 0, not -7
  })

  it('floors at exactly 0 when qty_sold equals stock_qty', () => {
    const catalog = [makeProduct({ stock_qty: 5 })]
    const result  = decrementStock(catalog, 'prod-uuid-001', 5)
    expect(result.qty_after).toBe(0)
  })

  it('CRITICAL: stock_qty never goes below zero', () => {
    const catalog = [makeProduct({ stock_qty: 0 })]
    const result  = decrementStock(catalog, 'prod-uuid-001', 100)
    expect(result.qty_after).toBe(0)
    expect(result.qty_after).not.toBeLessThan(0)
  })

  it('partial sale leaves correct remainder', () => {
    const catalog = [makeProduct({ stock_qty: 100 })]
    decrementStock(catalog, 'prod-uuid-001', 30)
    expect(catalog[0].stock_qty).toBe(70)
  })

  it('sequential decrements are cumulative on the same product row', () => {
    const catalog = [makeProduct({ stock_qty: 20 })]
    decrementStock(catalog, 'prod-uuid-001', 5)
    decrementStock(catalog, 'prod-uuid-001', 5)
    decrementStock(catalog, 'prod-uuid-001', 5)
    expect(catalog[0].stock_qty).toBe(5)
  })
})

// ── Stock failure tracking ────────────────────────────────────────────────────

describe('processStockDecrements — failure tracking (sale commits regardless)', () => {
  it('returns empty failures when all catalog items found', () => {
    const catalog = [makeProduct()]
    const cart    = [makeCatalogItem()]
    const failures = processStockDecrements(catalog, cart)
    expect(failures).toHaveLength(0)
  })

  it('records product_name in failures when catalog item not found in products table', () => {
    const catalog: ProductRecord[] = []       // empty catalog — product was deleted
    const cart = [makeCatalogItem({ product_name: 'Deleted Product' })]
    const failures = processStockDecrements(catalog, cart)
    expect(failures).toContain('Deleted Product')
  })

  it('CRITICAL: sale commits even when a stock failure occurs', () => {
    // The function returns failures[] but does NOT throw — sale commits
    const catalog: ProductRecord[] = []
    const cart = [makeCatalogItem()]
    const result = processRetailSale(catalog, cart, 'TXN-20260518-ABCD1234')
    // Result has transaction_id (sale committed) AND stock_failures (non-empty)
    expect(result.transaction_id).toBeTruthy()
    expect(result.stock_failures).toHaveLength(1)
  })

  it('tracks multiple failures independently', () => {
    const catalog: ProductRecord[] = []       // no products available
    const cart = [
      makeCatalogItem({ product_id: 'p1', product_name: 'Item A' }),
      makeCatalogItem({ product_id: 'p2', product_name: 'Item B' }),
      makeCatalogItem({ product_id: 'p3', product_name: 'Item C' }),
    ]
    const failures = processStockDecrements(catalog, cart)
    expect(failures).toHaveLength(3)
    expect(failures).toContain('Item A')
    expect(failures).toContain('Item B')
    expect(failures).toContain('Item C')
  })

  it('custom items do NOT generate stock failures even with no catalog match', () => {
    const catalog: ProductRecord[] = []       // empty catalog
    const cart = [makeCustomItem()]            // custom item only
    const failures = processStockDecrements(catalog, cart)
    expect(failures).toHaveLength(0)
  })

  it('partial failure: found items decrement, missing items go to failures[]', () => {
    const catalog = [makeProduct({ id: 'found-id', stock_qty: 10 })]
    const cart = [
      makeCatalogItem({ product_id: 'found-id',   product_name: 'Found Item'   }),
      makeCatalogItem({ product_id: 'missing-id', product_name: 'Missing Item' }),
    ]
    const failures = processStockDecrements(catalog, cart)
    expect(failures).toHaveLength(1)
    expect(failures[0]).toBe('Missing Item')
    expect(catalog[0].stock_qty).toBe(9)     // found item was still decremented
  })

  it('custom items in a mixed cart never appear in stock_failures', () => {
    const catalog: ProductRecord[] = []
    const cart = [
      makeCustomItem({ product_name: 'Consultation' }),
      makeCatalogItem({ product_id: 'missing-id', product_name: 'Drug A' }),
    ]
    const failures = processStockDecrements(catalog, cart)
    expect(failures).not.toContain('Consultation')
    expect(failures).toContain('Drug A')
  })
})

// ── Return payload ────────────────────────────────────────────────────────────

describe('processRetailSale return payload', () => {
  it('returns transaction_id, ref_number, stock_failures on success', () => {
    const catalog = [makeProduct()]
    const cart    = [makeCatalogItem()]
    const result  = processRetailSale(catalog, cart, 'TXN-20260518-ABCD1234', 'txn-uuid-001')
    expect(result).toEqual({
      transaction_id: 'txn-uuid-001',
      ref_number:     'TXN-20260518-ABCD1234',
      stock_failures: [],
    })
  })

  it('ref_number is passed through unchanged', () => {
    const catalog = [makeProduct()]
    const cart    = [makeCatalogItem()]
    const refNum  = 'TXN-20260518-XYZ99999'
    const result  = processRetailSale(catalog, cart, refNum)
    expect(result.ref_number).toBe(refNum)
  })

  it('stock_failures is an empty array (not null) on clean sale', () => {
    const catalog = [makeProduct()]
    const cart    = [makeCatalogItem()]
    const result  = processRetailSale(catalog, cart, 'REF-001')
    expect(Array.isArray(result.stock_failures)).toBe(true)
    expect(result.stock_failures).toHaveLength(0)
  })

  it('stock_failures contains names for every unresolvable catalog item', () => {
    const catalog: ProductRecord[] = []
    const cart    = [makeCatalogItem({ product_name: 'Phantom Drug' })]
    const result  = processRetailSale(catalog, cart, 'REF-002')
    expect(result.stock_failures).toContain('Phantom Drug')
    expect(result.transaction_id).toBeTruthy()   // sale committed
  })
})

// ── Audit log item_count ──────────────────────────────────────────────────────

describe('auditItemCount — jsonb_array_length(p_cart_items)', () => {
  it('counts all items in cart — catalog + custom', () => {
    const cart = [makeCatalogItem(), makeCustomItem(), makeCatalogItem({ product_id: 'p2' })]
    expect(auditItemCount(cart)).toBe(3)
  })

  it('counts 0 for empty cart', () => {
    expect(auditItemCount([])).toBe(0)
  })

  it('counts custom-only cart correctly', () => {
    const cart = [makeCustomItem(), makeCustomItem({ product_name: 'Delivery' })]
    expect(auditItemCount(cart)).toBe(2)
  })

  it('CRITICAL: audit item_count is jsonb_array_length — includes ALL items, not just catalog', () => {
    // If only catalog items were counted, a custom-only cart would show 0
    // which would be a misleading audit trail
    const cart = [makeCustomItem()]
    expect(auditItemCount(cart)).toBe(1)   // must be 1, not 0
  })
})

// ── Stock floor edge cases ────────────────────────────────────────────────────

describe('stock floor — edge cases for pharmacy compliance', () => {
  it('selling exactly 1 unit from 1-unit stock reaches exactly 0', () => {
    const catalog = [makeProduct({ stock_qty: 1 })]
    const result  = decrementStock(catalog, 'prod-uuid-001', 1)
    expect(result.qty_after).toBe(0)
  })

  it('overselling a high-demand drug does not produce negative inventory', () => {
    // Controlled substance scenario: concurrent sales could oversell
    const catalog = [makeProduct({ stock_qty: 2 })]
    const result  = decrementStock(catalog, 'prod-uuid-001', 999)
    expect(result.qty_after).toBe(0)
    expect(result.qty_after).toBeGreaterThanOrEqual(0)
  })

  it('zero-stock product returns 0 qty_after (not null) when product exists', () => {
    const catalog = [makeProduct({ stock_qty: 0 })]
    const result  = decrementStock(catalog, 'prod-uuid-001', 1)
    expect(result.found).toBe(true)
    expect(result.qty_after).toBe(0)
  })

  it('large-quantity sale floors correctly without overflow', () => {
    const catalog = [makeProduct({ stock_qty: 50 })]
    const result  = decrementStock(catalog, 'prod-uuid-001', 100_000)
    expect(result.qty_after).toBe(0)
  })
})

// ── End-to-end sale scenario ──────────────────────────────────────────────────

describe('process_retail_sale — full scenario integration', () => {
  it('standard retail sale: catalog items decrement, custom items skip, no failures', () => {
    const catalog: ProductRecord[] = [
      makeProduct({ id: 'p1', name: 'Amoxicillin 500mg', stock_qty: 50 }),
      makeProduct({ id: 'p2', name: 'Paracetamol 1g',    stock_qty: 200 }),
    ]
    const cart: CartItem[] = [
      makeCatalogItem({ product_id: 'p1', product_name: 'Amoxicillin 500mg', quantity: 2 }),
      makeCatalogItem({ product_id: 'p2', product_name: 'Paracetamol 1g',    quantity: 1 }),
      makeCustomItem({ product_name: 'Consultation Fee' }),
    ]
    const result = processRetailSale(catalog, cart, 'TXN-20260518-FULL001')
    expect(result.stock_failures).toHaveLength(0)
    expect(catalog[0].stock_qty).toBe(48)    // 50 - 2
    expect(catalog[1].stock_qty).toBe(199)   // 200 - 1
  })

  it('mixed failure scenario: one catalog item missing, custom item safe, sale commits', () => {
    const catalog: ProductRecord[] = [
      makeProduct({ id: 'p1', name: 'Amoxicillin 500mg', stock_qty: 10 }),
      // p2 is missing — product deleted mid-sale
    ]
    const cart: CartItem[] = [
      makeCatalogItem({ product_id: 'p1', product_name: 'Amoxicillin 500mg', quantity: 2 }),
      makeCatalogItem({ product_id: 'p2', product_name: 'Deleted Drug',       quantity: 1 }),
      makeCustomItem({ product_name: 'Pharmacy Bag' }),
    ]
    const result = processRetailSale(catalog, cart, 'TXN-20260518-FAIL001')
    expect(result.transaction_id).toBeTruthy()          // sale committed
    expect(result.stock_failures).toContain('Deleted Drug')
    expect(result.stock_failures).not.toContain('Pharmacy Bag')   // custom item excluded
    expect(catalog[0].stock_qty).toBe(8)                // p1 still decremented
  })

  it('custom-only cart: no stock changes, no failures, clean result', () => {
    const catalog: ProductRecord[] = []   // no catalog entries needed
    const cart: CartItem[] = [
      makeCustomItem({ product_name: 'Consultation Fee' }),
      makeCustomItem({ product_name: 'Delivery Charge' }),
    ]
    const result = processRetailSale(catalog, cart, 'TXN-20260518-CUSTOM001')
    expect(result.stock_failures).toHaveLength(0)
  })
})
