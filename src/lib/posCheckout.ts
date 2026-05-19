export interface PosCheckoutCartItem {
  product_id: string
  product_name: string
  barcode: string | null
  unit_price: number
  qty: number
  is_custom?: boolean
}

export interface RetailSaleItemPayload {
  product_id: string | null
  product_name: string
  barcode: string | null
  quantity: number
  unit_price: number
  line_total: number
  is_custom: boolean
}

export interface ProductStockSnapshot {
  product_id: string
  stock_qty: number
}

export interface StockRollbackDecision {
  shouldRollback: boolean
  failedProducts: string[]
  message: string
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

export function buildSaleItemsPayload(items: readonly PosCheckoutCartItem[]): RetailSaleItemPayload[] {
  return items.map(item => ({
    product_id: item.is_custom ? null : item.product_id,
    product_name: item.product_name,
    barcode: item.barcode,
    quantity: item.qty,
    unit_price: roundMoney(item.unit_price),
    line_total: roundMoney(item.unit_price * item.qty),
    is_custom: Boolean(item.is_custom),
  }))
}

export function validateStockBeforeSale(
  items: readonly PosCheckoutCartItem[],
  stock: readonly ProductStockSnapshot[],
): string[] {
  const stockById = new Map(stock.map(row => [row.product_id, row.stock_qty]))
  return items
    .filter(item => !item.is_custom)
    .filter(item => (stockById.get(item.product_id) ?? 0) < item.qty)
    .map(item => item.product_name)
}

export function buildRollbackDecision(failedProducts: readonly string[]): StockRollbackDecision {
  const uniqueFailures = Array.from(new Set(failedProducts.map(name => name.trim()).filter(Boolean)))
  return {
    shouldRollback: uniqueFailures.length > 0,
    failedProducts: uniqueFailures,
    message: uniqueFailures.length > 0
      ? `Sale was not recorded. Stock could not be reserved for: ${uniqueFailures.join(', ')}.`
      : 'Sale can be recorded.',
  }
}
