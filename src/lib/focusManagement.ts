export type FocusDirection = 'next' | 'previous'

export function clampFocusIndex(index: number, count: number): number {
  if (count <= 0) return -1
  if (index < 0) return 0
  if (index >= count) return count - 1
  return index
}

export function moveFocusIndex(current: number, count: number, direction: FocusDirection): number {
  if (count <= 0) return -1
  if (direction === 'next') return (current + 1 + count) % count
  return (current - 1 + count) % count
}

export function cycleTabIndex(current: number, count: number, shiftKey: boolean): number {
  return moveFocusIndex(current, count, shiftKey ? 'previous' : 'next')
}

export function buildActiveDescendantId(prefix: string, id: string | null | undefined): string | undefined {
  if (!id) return undefined
  return `${prefix}-${id}`
}

export function shouldCloseForKey(key: string): boolean {
  return key === 'Escape'
}

export function isNavigationKey(key: string): boolean {
  return key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === 'Tab'
}
