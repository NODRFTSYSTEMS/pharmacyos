import { describe, expect, it } from 'vitest'
import {
  buildActiveDescendantId,
  clampFocusIndex,
  cycleTabIndex,
  isNavigationKey,
  moveFocusIndex,
  shouldCloseForKey,
} from '../../lib/focusManagement'

describe('focus management - clampFocusIndex', () => {
  it.each([
    [0, 3, 0],
    [1, 3, 1],
    [2, 3, 2],
    [3, 3, 2],
    [-1, 3, 0],
    [10, 3, 2],
    [0, 0, -1],
  ])('clamps index %i with count %i', (index, count, expected) => {
    expect(clampFocusIndex(index, count)).toBe(expected)
  })
})

describe('focus management - moveFocusIndex', () => {
  it.each([
    [0, 3, 'next' as const, 1],
    [1, 3, 'next' as const, 2],
    [2, 3, 'next' as const, 0],
    [0, 3, 'previous' as const, 2],
    [1, 3, 'previous' as const, 0],
    [2, 3, 'previous' as const, 1],
    [-1, 3, 'next' as const, 0],
    [-1, 3, 'previous' as const, 1],
    [0, 1, 'next' as const, 0],
    [0, 0, 'next' as const, -1],
  ])('moves index %i count %i direction %s', (current, count, direction, expected) => {
    expect(moveFocusIndex(current, count, direction)).toBe(expected)
  })
})

describe('focus management - cycleTabIndex', () => {
  it.each([
    [0, 4, false, 1],
    [1, 4, false, 2],
    [3, 4, false, 0],
    [0, 4, true, 3],
    [2, 4, true, 1],
    [0, 1, false, 0],
    [0, 1, true, 0],
    [0, 0, false, -1],
  ])('cycles tab index %i count %i shift %s', (current, count, shiftKey, expected) => {
    expect(cycleTabIndex(current, count, shiftKey)).toBe(expected)
  })
})

describe('focus management - active descendant ids', () => {
  it.each([
    ['search-result', 'abc', 'search-result-abc'],
    ['row', '123', 'row-123'],
    ['option', 'RX-1', 'option-RX-1'],
    ['option', null, undefined],
    ['option', undefined, undefined],
  ])('builds active descendant id for %s and %s', (prefix, id, expected) => {
    expect(buildActiveDescendantId(prefix, id)).toBe(expected)
  })
})

describe('focus management - keyboard classification', () => {
  it.each([
    ['Escape', true, false],
    ['ArrowDown', false, true],
    ['ArrowUp', false, true],
    ['Enter', false, true],
    ['a', false, false],
  ])('classifies key %s', (key, closes, navigates) => {
    expect(shouldCloseForKey(key)).toBe(closes)
    expect(isNavigationKey(key)).toBe(navigates)
  })
})
