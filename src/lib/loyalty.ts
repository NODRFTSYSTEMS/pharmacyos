export type LoyaltyTier = 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM'

export interface LoyaltyCustomerLike {
  name: string
  phone: string | null
  email?: string | null
  points_balance: number
  tier: LoyaltyTier
  is_active: boolean
}

export function loyaltyTierLabel(tier: LoyaltyTier): string {
  return tier.charAt(0) + tier.slice(1).toLowerCase()
}

export function loyaltyTierVariant(tier: LoyaltyTier): 'gray' | 'blue' | 'yellow' | 'purple' {
  switch (tier) {
    case 'STANDARD': return 'gray'
    case 'SILVER': return 'blue'
    case 'GOLD': return 'yellow'
    case 'PLATINUM': return 'purple'
  }
}

export function filterLoyaltyCustomers<T extends LoyaltyCustomerLike>(
  customers: T[],
  tier: 'ALL' | LoyaltyTier,
  search: string,
): T[] {
  const q = search.trim().toLowerCase()
  return customers.filter(customer => {
    if (tier !== 'ALL' && customer.tier !== tier) return false
    if (!q) return true
    return customer.name.toLowerCase().includes(q)
      || (customer.phone ?? '').toLowerCase().includes(q)
  })
}

export function summarizeLoyaltyCustomers(customers: LoyaltyCustomerLike[]) {
  return {
    totalMembers: customers.length,
    activeMembers: customers.filter(c => c.is_active).length,
    eliteMembers: customers.filter(c => c.tier === 'GOLD' || c.tier === 'PLATINUM').length,
    totalPoints: customers.reduce((sum, c) => sum + c.points_balance, 0),
  }
}

export function validateLoyaltyName(name: string): string | null {
  return name.trim() ? null : 'Name is required'
}

export function buildLoyaltyPayload(data: {
  name: string
  phone: string
  email: string
  tier: LoyaltyTier
  is_active: boolean
}) {
  return {
    name: data.name.trim(),
    phone: data.phone.trim() || null,
    email: data.email.trim() || null,
    tier: data.tier,
    is_active: data.is_active,
  }
}
