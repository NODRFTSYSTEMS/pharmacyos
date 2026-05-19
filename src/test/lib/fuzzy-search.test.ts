import { describe, expect, it } from 'vitest'
import {
  fuzzyMatches,
  fuzzyScore,
  normalizeSearchValue,
  rankFuzzyResults,
  tokenizeSearchQuery,
} from '../../lib/fuzzySearch'

describe('fuzzy search - normalization', () => {
  it.each([
    ['Paracetamol 500mg', 'paracetamol 500mg'],
    ['  RX-000123  ', 'rx 000123'],
    ['CETIRIZINE-10MG', 'cetirizine 10mg'],
    ['Grace.Bennett@example.com', 'grace bennett example com'],
    ['Kingston, Jamaica', 'kingston jamaica'],
    ['Amoxicillin/Clavulanate', 'amoxicillin clavulanate'],
    ['Ibuprofen (400mg)', 'ibuprofen 400mg'],
    ['N/A', 'n a'],
    ['', ''],
    [null, ''],
  ])('normalizes %s to %s', (input, expected) => {
    expect(normalizeSearchValue(input)).toBe(expected)
  })
})

describe('fuzzy search - tokenization', () => {
  it.each([
    ['paracetamol 500mg', ['paracetamol', '500mg']],
    ['  retail   transaction  ', ['retail', 'transaction']],
    ['RX-12345', ['rx', '12345']],
    ['Grace Bennett', ['grace', 'bennett']],
    ['Amoxicillin/Clavulanate 625mg', ['amoxicillin', 'clavulanate', '625mg']],
    ['   ', []],
    ['', []],
    ['NHF Card', ['nhf', 'card']],
  ])('tokenizes %s', (query, expected) => {
    expect(tokenizeSearchQuery(query)).toEqual(expected)
  })
})

describe('fuzzy search - scoring', () => {
  it.each([
    ['Paracetamol', 'paracetamol', 100],
    ['Paracetamol 500mg', 'para', 90],
    ['Infant Paracetamol Syrup', 'paracetamol', 75],
    ['Grace Bennett', 'grace ben', 90],
    ['Ibuprofen', 'ibu', 90],
    ['Omeprazole', 'omz', 35],
    ['Cetirizine', 'zzz', 0],
    ['', 'rx', 0],
    [null, 'rx', 0],
    ['RX-000123', '', 0],
  ])('scores candidate %s against query %s', (candidate, query, expected) => {
    expect(fuzzyScore(candidate, query)).toBe(expected)
  })
})

describe('fuzzy search - match decisions', () => {
  it.each([
    ['Paracetamol 500mg', 'para', 35, true],
    ['Paracetamol 500mg', 'pcm', 35, true],
    ['Paracetamol 500mg', 'zzz', 35, false],
    ['RX-000123', '123', 70, true],
    ['Beverley James', 'bj', 35, true],
    ['Beverley James', 'bj', 75, false],
  ])('matches %s against %s at threshold %i', (candidate, query, threshold, expected) => {
    expect(fuzzyMatches(candidate, query, threshold)).toBe(expected)
  })
})

describe('fuzzy search - ranking', () => {
  const items = [
    { name: 'Paracetamol 500mg', barcode: '111' },
    { name: 'Cetirizine 10mg', barcode: '222' },
    { name: 'Infant Paracetamol Syrup', barcode: '333' },
  ]

  it.each([
    ['paracetamol', 'Paracetamol 500mg'],
    ['infant', 'Infant Paracetamol Syrup'],
    ['222', 'Cetirizine 10mg'],
    ['cet', 'Cetirizine 10mg'],
    ['syrup', 'Infant Paracetamol Syrup'],
    ['zzz', undefined],
  ])('ranks query %s', (query, expectedFirst) => {
    const ranked = rankFuzzyResults(items, query, item => [item.name, item.barcode])
    expect(ranked[0]?.item.name).toBe(expectedFirst)
  })
})
