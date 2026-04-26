// Stubbed Property Data API Integration
// IDS: This is a documented stub. Replace with real provider before Phase 3 Gate 4A.
// Open items: data API providers not yet selected.

export interface PropertyFacts {
  squareFootage?: number;
  yearBuilt?: number;
  bedrooms?: number;
  bathrooms?: number;
  lotSize?: number;
  propertyType?: string;
  lastSaleDate?: string;
  estimatedValue?: number;
  taxAssessment?: number;
}

export interface CompRecord {
  address: string;
  salePrice: number;
  saleDate: string;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  distanceMiles: number;
  daysOnMarket?: number;
}

export interface ListingRecord {
  address: string;
  listPrice: number;
  price?: number;
  listingDate: string;
  squareFootage: number;
  sqft?: number;
  bedrooms: number;
  bathrooms: number;
  distanceMiles: number;
  daysOnMarket?: number;
}

export async function fetchPropertyFacts(address: string): Promise<PropertyFacts> {
  // TODO-IDS-STUB: Replace with real county assessor / listing API
  console.log("[STUB] fetchPropertyFacts called for:", address);
  return {
    squareFootage: 1800,
    yearBuilt: 1995,
    bedrooms: 3,
    bathrooms: 2,
    lotSize: 6500,
    propertyType: "Single Family",
    estimatedValue: 350000,
    taxAssessment: 320000,
  };
}

export async function fetchSoldComps(address: string): Promise<CompRecord[]> {
  // TODO-IDS-STUB: Replace with real comp data provider
  console.log("[STUB] fetchSoldComps called for:", address);
  return [
    {
      address: "123 Comparable St",
      salePrice: 345000,
      saleDate: "2026-01-15",
      squareFootage: 1750,
      bedrooms: 3,
      bathrooms: 2,
      distanceMiles: 0.3,
    },
    {
      address: "456 Similar Ave",
      salePrice: 355000,
      saleDate: "2026-02-10",
      squareFootage: 1850,
      bedrooms: 3,
      bathrooms: 2,
      distanceMiles: 0.5,
    },
    {
      address: "789 Nearby Ln",
      salePrice: 360000,
      saleDate: "2026-03-05",
      squareFootage: 1900,
      bedrooms: 4,
      bathrooms: 2,
      distanceMiles: 0.7,
    },
  ];
}

export async function fetchActiveListings(_address: string): Promise<ListingRecord[]> {
  return [
    {
      address: "123 Comparable St",
      listPrice: 349000,
      listingDate: "2026-03-01",
      squareFootage: 1750,
      bedrooms: 3,
      bathrooms: 2,
      distanceMiles: 0.3,
    },
    {
      address: "456 Similar Ave",
      listPrice: 359000,
      listingDate: "2026-03-10",
      squareFootage: 1850,
      bedrooms: 3,
      bathrooms: 2,
      distanceMiles: 0.5,
    },
  ];
}

export function getProviderRequirements(): string[] {
  return [
    "Must support address-based property fact lookup",
    "Must provide sold comparable records with sale price, date, and property characteristics",
    "Must provide active listing records with list price, date, and property characteristics",
    "Must return JSON responses suitable for server-side consumption",
    "Must have acceptable latency for real-time triage (< 2s p95)",
    "Must be compatible with PII event linting rules (no raw address leakage to client)",
  ];
}
