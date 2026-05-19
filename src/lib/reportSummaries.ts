import type { Product, RxTransaction } from '../types/database'

export type InventorySummaryTab = 'ALL' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'IN_STOCK' | 'EXPIRING_SOON'

export function getInventoryStockStatus(product: Pick<Product, 'stock_qty' | 'reorder_level'>) {
  if (product.stock_qty === 0) return 'OUT_OF_STOCK'
  if (product.stock_qty <= product.reorder_level) return 'LOW_STOCK'
  return 'IN_STOCK'
}

export function getInventoryExpiryStatus(expiryDate: string | null, today = new Date()) {
  if (!expiryDate) return null
  const start = new Date(today)
  start.setHours(0, 0, 0, 0)
  const in30 = new Date(start)
  in30.setDate(start.getDate() + 30)
  const expiry = new Date(expiryDate)
  if (expiry < start) return 'EXPIRED'
  if (expiry <= in30) return 'EXPIRING_SOON'
  return 'OK'
}

export function buildInventoryReportSummary(
  products: readonly Product[],
  options: { tab: InventorySummaryTab; search: string; filteredCount: number; today?: Date },
): string {
  const today = options.today ?? new Date()
  const totalStockQty = products.reduce((sum, product) => sum + product.stock_qty, 0)
  const totalStockValue = products.reduce((sum, product) => sum + product.stock_qty * product.unit_price, 0)
  const outOfStock = products.filter(product => getInventoryStockStatus(product) === 'OUT_OF_STOCK')
  const lowStock = products.filter(product => getInventoryStockStatus(product) === 'LOW_STOCK')
  const expiring = products.filter(product => {
    const status = getInventoryExpiryStatus(product.expiry_date, today)
    return status === 'EXPIRED' || status === 'EXPIRING_SOON'
  })
  const highestValue = [...products]
    .sort((a, b) => (b.stock_qty * b.unit_price) - (a.stock_qty * a.unit_price))
    .slice(0, 5)

  return [
    `Report type: Inventory`,
    `Filter: ${options.tab}`,
    `Search: ${options.search.trim() || 'none'}`,
    `Products visible: ${options.filteredCount} of ${products.length}`,
    `Total stock quantity: ${totalStockQty}`,
    `Total stock value: JMD ${totalStockValue.toFixed(2)}`,
    `Out of stock count: ${outOfStock.length}`,
    `Low stock count: ${lowStock.length}`,
    `Expired or expiring soon count: ${expiring.length}`,
    '',
    'Priority stock exceptions:',
    ...[...outOfStock, ...lowStock, ...expiring].slice(0, 10).map(product =>
      `${product.name}: stock ${product.stock_qty}, reorder ${product.reorder_level}, expiry ${product.expiry_date ?? 'none'}`
    ),
    '',
    'Highest stock value products:',
    ...highestValue.map(product => `${product.name}: ${product.stock_qty} units, JMD ${(product.stock_qty * product.unit_price).toFixed(2)}`),
  ].join('\n')
}

export function buildDispensingReportSummary(
  records: readonly RxTransaction[],
  options: { from: string; to: string },
): string {
  const nonVoided = records.filter(record => !record.voided)
  const voided = records.filter(record => record.voided)
  const totalCopay = nonVoided.reduce((sum, record) => sum + record.patient_copay, 0)
  const totalNhf = nonVoided.reduce((sum, record) => sum + record.nhf_subsidy, 0)
  const totalQty = nonVoided.reduce((sum, record) => sum + record.quantity_dispensed, 0)
  const drugMap = new Map<string, { count: number; qty: number; copay: number; nhf: number }>()

  for (const record of nonVoided) {
    const existing = drugMap.get(record.drug_name) ?? { count: 0, qty: 0, copay: 0, nhf: 0 }
    drugMap.set(record.drug_name, {
      count: existing.count + 1,
      qty: existing.qty + record.quantity_dispensed,
      copay: existing.copay + record.patient_copay,
      nhf: existing.nhf + record.nhf_subsidy,
    })
  }

  const topDrugs = Array.from(drugMap.entries())
    .map(([drug, values]) => ({ drug, ...values }))
    .sort((a, b) => b.qty - a.qty || b.copay - a.copay)
    .slice(0, 8)

  return [
    `Report type: Dispensing`,
    `Period: ${options.from} to ${options.to}`,
    `Dispensing records: ${records.length}`,
    `Non-voided dispensings: ${nonVoided.length}`,
    `Voided dispensings: ${voided.length}`,
    `Total quantity dispensed: ${totalQty}`,
    `Patient copay collected: JMD ${totalCopay.toFixed(2)}`,
    `NHF subsidy: JMD ${totalNhf.toFixed(2)}`,
    '',
    'Top dispensed drugs by quantity:',
    ...topDrugs.map(row =>
      `${row.drug}: ${row.qty} units, ${row.count} dispensings, copay JMD ${row.copay.toFixed(2)}, NHF JMD ${row.nhf.toFixed(2)}`
    ),
    '',
    'Patient names are intentionally excluded from this AI context.',
  ].join('\n')
}
