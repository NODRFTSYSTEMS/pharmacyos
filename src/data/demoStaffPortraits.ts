import type { StaffAvatarSourceStatus } from '../types/database'

export interface DemoStaffPortrait {
  email: string
  name: string
  role: string
  url: string
  alt: string
  sourceStatus: StaffAvatarSourceStatus
}

const PORTRAITS: DemoStaffPortrait[] = [
  {
    email: 'grace.bennett@winchesterglobal.com',
    name: 'Grace Bennett',
    role: 'ADMIN',
    url: '/demo/staff/grace-bennett.jpg',
    alt: 'Demo portrait for Grace Bennett',
    sourceStatus: 'DEMO_ONLY',
  },
  {
    email: 'marcus.thompson@winchesterglobal.com',
    name: 'Marcus Thompson',
    role: 'PHARMACIST',
    url: '/demo/staff/marcus-thompson.jpg',
    alt: 'Demo portrait for Marcus Thompson',
    sourceStatus: 'DEMO_ONLY',
  },
  {
    email: 'jasmine.clarke@winchesterglobal.com',
    name: 'Jasmine Clarke',
    role: 'CASHIER',
    url: '/demo/staff/jasmine-clarke.jpg',
    alt: 'Demo portrait for Jasmine Clarke',
    sourceStatus: 'DEMO_ONLY',
  },
  {
    email: 'devon.reid@winchesterglobal.com',
    name: 'Devon Reid',
    role: 'TECHNICIAN',
    url: '/demo/staff/devon-reid.jpg',
    alt: 'Demo portrait for Devon Reid',
    sourceStatus: 'DEMO_ONLY',
  },
  {
    email: 'simone.henry@winchesterglobal.com',
    name: 'Simone Henry',
    role: 'MANAGER',
    url: '/demo/staff/simone-henry.jpg',
    alt: 'Demo portrait for Simone Henry',
    sourceStatus: 'DEMO_ONLY',
  },
]

const BY_EMAIL = new Map(PORTRAITS.map(p => [p.email, p]))
const BY_NAME = new Map(PORTRAITS.map(p => [normalize(p.name), p]))

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

export function getDemoStaffPortrait(email?: string | null): DemoStaffPortrait | null {
  if (!email) return null
  return BY_EMAIL.get(normalize(email)) ?? null
}

export function getDemoStaffPortraitByName(name?: string | null): DemoStaffPortrait | null {
  if (!name) return null
  return BY_NAME.get(normalize(name)) ?? null
}

export function getInitials(value?: string | null): string {
  if (!value) return 'ST'
  const parts = value
    .replace(/@.*/, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) return 'ST'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}
