import { describe, expect, it } from 'vitest'
import {
  fmtJamaicaDate,
  fmtJamaicaTime,
  toJamaicaBounds,
  toJamaicaDate,
  todayJamaica,
} from '../../lib/date'

describe('timezone expanded - date range bounds', () => {
  it.each([
    ['2026-01-01', '2026-01-01'],
    ['2026-02-28', '2026-03-01'],
    ['2026-05-17', '2026-05-18'],
    ['2026-12-31', '2027-01-01'],
    ['2028-02-29', '2028-02-29'],
    ['2026-07-10', '2026-07-31'],
  ])('uses Jamaica offset for bounds %s to %s', (from, to) => {
    const bounds = toJamaicaBounds(from, to)
    expect(bounds.gte).toBe(`${from}T00:00:00-05:00`)
    expect(bounds.lte).toBe(`${to}T23:59:59.999-05:00`)
  })
})

describe('timezone expanded - Jamaica-local date conversion', () => {
  it.each([
    ['2026-01-01T04:59:59.000Z', '2025-12-31'],
    ['2026-01-01T05:00:00.000Z', '2026-01-01'],
    ['2026-05-17T04:59:59.000Z', '2026-05-16'],
    ['2026-05-17T05:00:00.000Z', '2026-05-17'],
    ['2026-08-01T02:30:00.000Z', '2026-07-31'],
    ['2026-08-01T18:30:00.000Z', '2026-08-01'],
    ['2027-01-01T03:00:00.000Z', '2026-12-31'],
    ['2028-03-01T04:00:00.000Z', '2028-02-29'],
  ])('converts %s to Jamaica date %s', (iso, expected) => {
    expect(toJamaicaDate(iso)).toBe(expected)
  })
})

describe('timezone expanded - formatted dates', () => {
  it.each([
    ['2026-05-17T05:00:00.000Z', '2026'],
    ['2026-12-31T23:00:00.000Z', '2026'],
    ['2027-01-01T03:00:00.000Z', '2026'],
    ['2028-03-01T04:00:00.000Z', '2028'],
    ['2026-07-01T12:00:00.000Z', '2026'],
    ['2026-11-01T12:00:00.000Z', '2026'],
  ])('formats %s with expected year marker %s', (iso, expected) => {
    expect(fmtJamaicaDate(iso)).toContain(expected)
  })
})

describe('timezone expanded - formatted times', () => {
  it.each([
    ['2026-05-17T05:00:00.000Z', /12:00 [Aa][Mm]|00:00/],
    ['2026-05-17T12:00:00.000Z', /7:00 [Aa][Mm]|07:00/],
    ['2026-05-17T17:30:00.000Z', /12:30 [Pp][Mm]|12:30/],
    ['2026-05-17T23:59:00.000Z', /6:59 [Pp][Mm]|18:59/],
    ['2026-01-01T04:00:00.000Z', /11:00 [Pp][Mm]|23:00/],
    ['2026-08-01T04:30:00.000Z', /11:30 [Pp][Mm]|23:30/],
  ])('formats %s as Jamaica-local time', (iso, expected) => {
    expect(fmtJamaicaTime(iso)).toMatch(expected)
  })
})

describe('timezone expanded - today utility', () => {
  it.each([
    ['format', /^\d{4}-\d{2}-\d{2}$/],
    ['year', /^\d{4}/],
    ['month', /^\d{4}-\d{2}/],
    ['day', /\d{2}$/],
  ])('todayJamaica exposes %s component safely', (_label, pattern) => {
    expect(todayJamaica()).toMatch(pattern)
  })
})
