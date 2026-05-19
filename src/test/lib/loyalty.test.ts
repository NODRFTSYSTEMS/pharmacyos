import { describe, expect, it } from 'vitest'
import {
  buildLoyaltyPayload,
  filterLoyaltyCustomers,
  loyaltyTierLabel,
  loyaltyTierVariant,
  summarizeLoyaltyCustomers,
  validateLoyaltyName,
  type LoyaltyCustomerLike,
} from '../../lib/loyalty'

const customers: LoyaltyCustomerLike[] = [
  { name: 'Beverley James', phone: '876-555-0201', email: null, points_balance: 1840, tier: 'GOLD', is_active: true },
  { name: 'Carlton Hylton', phone: '876-555-0202', email: null, points_balance: 90, tier: 'STANDARD', is_active: false },
  { name: 'Paulette Morgan', phone: '876-555-0203', email: null, points_balance: 780, tier: 'SILVER', is_active: true },
  { name: 'Everton Blake', phone: null, email: null, points_balance: 4100, tier: 'PLATINUM', is_active: true },
]

describe('loyalty - tier labels', () => {
  it.each([
    ['STANDARD' as const, 'Standard'],
    ['SILVER' as const, 'Silver'],
    ['GOLD' as const, 'Gold'],
    ['PLATINUM' as const, 'Platinum'],
  ])('labels %s', (tier, expected) => {
    expect(loyaltyTierLabel(tier)).toBe(expected)
  })
})

describe('loyalty - tier variants', () => {
  it.each([
    ['STANDARD' as const, 'gray'],
    ['SILVER' as const, 'blue'],
    ['GOLD' as const, 'yellow'],
    ['PLATINUM' as const, 'purple'],
  ])('maps variant for %s', (tier, expected) => {
    expect(loyaltyTierVariant(tier)).toBe(expected)
  })
})

describe('loyalty - filters', () => {
  it.each([
    ['ALL' as const, '', 4],
    ['GOLD' as const, '', 1],
    ['SILVER' as const, '', 1],
    ['PLATINUM' as const, '', 1],
    ['STANDARD' as const, '', 1],
    ['ALL' as const, '876-555-0203', 1],
    ['ALL' as const, 'beverley', 1],
    ['GOLD' as const, 'paulette', 0],
  ])('filters tier %s search %s', (tier, search, expectedCount) => {
    expect(filterLoyaltyCustomers(customers, tier, search)).toHaveLength(expectedCount)
  })
})

describe('loyalty - summaries', () => {
  it.each([
    [customers, { totalMembers: 4, activeMembers: 3, eliteMembers: 2, totalPoints: 6810 }],
    [customers.slice(0, 1), { totalMembers: 1, activeMembers: 1, eliteMembers: 1, totalPoints: 1840 }],
    [customers.slice(1, 2), { totalMembers: 1, activeMembers: 0, eliteMembers: 0, totalPoints: 90 }],
    [[], { totalMembers: 0, activeMembers: 0, eliteMembers: 0, totalPoints: 0 }],
    [customers.filter(c => c.is_active), { totalMembers: 3, activeMembers: 3, eliteMembers: 2, totalPoints: 6720 }],
  ])('summarizes customers', (input, expected) => {
    expect(summarizeLoyaltyCustomers(input)).toEqual(expected)
  })
})

describe('loyalty - validation', () => {
  it.each([
    ['Beverley James', null],
    ['  Beverley James  ', null],
    ['', 'Name is required'],
  ])('validates name %s', (name, expected) => {
    expect(validateLoyaltyName(name)).toBe(expected)
  })
})

describe('loyalty - payloads', () => {
  it.each([
    [' Beverley James ', '876-555-0201', 'bev@example.com', 'GOLD' as const, true, 'Beverley James'],
    ['Carlton Hylton', '', '', 'STANDARD' as const, false, 'Carlton Hylton'],
    [' Paulette Morgan', ' 876-555-0203 ', '', 'SILVER' as const, true, 'Paulette Morgan'],
    ['Everton Blake ', '', ' eb@example.com ', 'PLATINUM' as const, true, 'Everton Blake'],
  ])('builds payload for %s', (name, phone, email, tier, isActive, expectedName) => {
    const payload = buildLoyaltyPayload({ name, phone, email, tier, is_active: isActive })
    expect(payload.name).toBe(expectedName)
    expect(payload.tier).toBe(tier)
    expect(payload.is_active).toBe(isActive)
  })
})
