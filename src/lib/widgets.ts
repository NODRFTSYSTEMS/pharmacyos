import type { PrescriptionStatus } from '../types/database'

export type PillVariant = 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'purple'

export interface DashboardWidgetFlags {
  canViewReports: boolean
  canViewRx: boolean
  canUsePOS: boolean
  canViewAIQueue: boolean
  canManageInventory: boolean
  isCashier: boolean
}

export function prescriptionStatusVariant(status: PrescriptionStatus): PillVariant {
  switch (status) {
    case 'RECEIVED': return 'blue'
    case 'VERIFYING': return 'yellow'
    case 'READY': return 'green'
    case 'DISPENSED': return 'gray'
    case 'CANCELLED': return 'red'
  }
}

export function updateCategoryVariant(category: 'NEWS' | 'MESSAGE' | 'UPDATE' | 'ALERT'): PillVariant {
  switch (category) {
    case 'NEWS': return 'blue'
    case 'MESSAGE': return 'green'
    case 'UPDATE': return 'yellow'
    case 'ALERT': return 'red'
  }
}

export function shouldShowExpiryAlert(expiringCount: number): boolean {
  return expiringCount > 0
}

export function shouldShowAiQueueAlert(canViewAIQueue: boolean, pendingCount: number, isCashier: boolean): boolean {
  return canViewAIQueue && pendingCount > 0 && !isCashier
}

export function visibleDashboardWidgets(flags: DashboardWidgetFlags): string[] {
  const widgets = ['identity', 'connection', 'theme']
  if (flags.canViewReports) widgets.push('revenue', 'transactions', 'daily-inconsistency')
  if (flags.canViewRx) widgets.push('prescription-queue')
  if (flags.canUsePOS && flags.isCashier) widgets.push('pos-terminal')
  if (flags.canViewAIQueue) widgets.push('ai-review')
  if (flags.canManageInventory) widgets.push('reorder-recommendations')
  return widgets
}

export function summarizeWidgetCounts(values: {
  retailTransactions: number
  rxTransactions: number
  pendingRx: number
  lowStock: number
}) {
  return {
    totalTransactions: values.retailTransactions + values.rxTransactions,
    pendingRx: values.pendingRx,
    lowStock: values.lowStock,
  }
}

export function formatMetricValue(value: number): string {
  return value.toLocaleString('en-JM')
}
