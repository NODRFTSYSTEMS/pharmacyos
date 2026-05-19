import { describe, expect, it } from 'vitest'
import {
  formatMetricValue,
  prescriptionStatusVariant,
  shouldShowAiQueueAlert,
  shouldShowExpiryAlert,
  summarizeWidgetCounts,
  updateCategoryVariant,
  visibleDashboardWidgets,
} from '../../lib/widgets'

describe('widgets - prescription status variants', () => {
  it.each([
    ['RECEIVED' as const, 'blue'],
    ['VERIFYING' as const, 'yellow'],
    ['READY' as const, 'green'],
    ['DISPENSED' as const, 'gray'],
    ['CANCELLED' as const, 'red'],
  ])('maps %s', (status, expected) => {
    expect(prescriptionStatusVariant(status)).toBe(expected)
  })
})

describe('widgets - update category variants', () => {
  it.each([
    ['NEWS' as const, 'blue'],
    ['MESSAGE' as const, 'green'],
    ['UPDATE' as const, 'yellow'],
    ['ALERT' as const, 'red'],
  ])('maps %s', (category, expected) => {
    expect(updateCategoryVariant(category)).toBe(expected)
  })
})

describe('widgets - alert visibility', () => {
  it.each([
    [1, true],
    [10, true],
    [0, false],
    [-1, false],
  ])('decides expiry alert for count %i', (count, expected) => {
    expect(shouldShowExpiryAlert(count)).toBe(expected)
  })
})

describe('widgets - AI queue alert visibility', () => {
  it.each([
    [true, 1, false, true],
    [true, 0, false, false],
    [true, 5, true, false],
    [false, 5, false, false],
  ])('decides AI alert for permission %s pending %i cashier %s', (canView, pending, cashier, expected) => {
    expect(shouldShowAiQueueAlert(canView, pending, cashier)).toBe(expected)
  })
})

describe('widgets - visible widget sets', () => {
  const base = {
    canViewReports: false,
    canViewRx: false,
    canUsePOS: false,
    canViewAIQueue: false,
    canManageInventory: false,
    isCashier: false,
  }

  it.each([
    [{ ...base }, ['identity', 'connection', 'theme']],
    [{ ...base, canViewReports: true }, ['revenue', 'transactions', 'daily-inconsistency']],
    [{ ...base, canViewRx: true }, ['prescription-queue']],
    [{ ...base, canUsePOS: true, isCashier: true }, ['pos-terminal']],
    [{ ...base, canViewAIQueue: true }, ['ai-review']],
    [{ ...base, canManageInventory: true }, ['reorder-recommendations']],
    [{ ...base, canUsePOS: true, isCashier: false }, []],
    [{ ...base, canViewReports: true, canViewRx: true, canViewAIQueue: true }, ['revenue', 'prescription-queue', 'ai-review']],
  ])('returns expected widgets for flags %o', (flags, expectedFragments) => {
    const widgets = visibleDashboardWidgets(flags)
    for (const expected of expectedFragments) {
      expect(widgets).toContain(expected)
    }
  })
})

describe('widgets - count summaries', () => {
  it.each([
    [1, 2, 3, 4, { totalTransactions: 3, pendingRx: 3, lowStock: 4 }],
    [0, 0, 0, 0, { totalTransactions: 0, pendingRx: 0, lowStock: 0 }],
    [10, 5, 2, 1, { totalTransactions: 15, pendingRx: 2, lowStock: 1 }],
    [100, 50, 20, 10, { totalTransactions: 150, pendingRx: 20, lowStock: 10 }],
    [7, 8, 9, 10, { totalTransactions: 15, pendingRx: 9, lowStock: 10 }],
  ])('summarizes widget counts', (retail, rx, pendingRx, lowStock, expected) => {
    expect(summarizeWidgetCounts({
      retailTransactions: retail,
      rxTransactions: rx,
      pendingRx,
      lowStock,
    })).toEqual(expected)
  })
})

describe('widgets - metric value formatting', () => {
  it.each([
    [0, '0'],
    [1, '1'],
    [1000, '1,000'],
    [250000, '250,000'],
    [1234567, '1,234,567'],
  ])('formats %i', (value, expected) => {
    expect(formatMetricValue(value)).toBe(expected)
  })
})
