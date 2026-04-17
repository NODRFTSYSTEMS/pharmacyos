// Rentcast Property Data API Integration
// IDS: Live provider for property facts, sold comps, and active listings.
// Falls back to stub when RENTCAST_API_KEY is missing or on fetch failure.

import {
  fetchPropertyFacts as stubFetchPropertyFacts,
  fetchSoldComps as stubFetchSoldComps,
  fetchActiveListings as stubFetchActiveListings,
  type PropertyFacts,
  type CompRecord,
  type ListingRecord,
} from "./stub";

const RENTCAST_API_KEY = process.env.RENTCAST_API_KEY;
const RENTCAST_BASE_URL = "https://api.rentcast.io/v1";

async function rentcastFetch<T>(path: string): Promise<T | null> {
  if (!RENTCAST_API_KEY) {
    console.warn("[Rentcast] No API key — falling back to stub");
    return null;
  }
  try {
    const res = await fetch(`${RENTCAST_BASE_URL}${path}`, {
      headers: {
        Accept: "application/json",
        "X-Api-Key": RENTCAST_API_KEY,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[Rentcast] ${path} → ${res.status}`, body.slice(0, 200));
      return null;
    }
    const json = (await res.json()) as T;
    console.log(`[Rentcast] ${path} → 200, type=${Array.isArray(json) ? "array" : typeof json}`);
    return json;
  } catch (err) {
    console.error(`[Rentcast] ${path} fetch error:`, err);
    return null;
  }
}

export async function fetchPropertyFacts(address: string): Promise<PropertyFacts> {
  const encoded = encodeURIComponent(address);
  const raw = await rentcastFetch<Record<string, unknown> | Record<string, unknown>[]>(`/properties?address=${encoded}`);

  const data = Array.isArray(raw) ? (raw[0] ?? null) : raw;

  if (data && typeof data === "object") {
    // Pass through all defined fields from the Rentcast response into PropertyFacts
    const facts: PropertyFacts = {};
    const knownKeys: (keyof PropertyFacts)[] = [
      "squareFootage", "yearBuilt", "bedrooms", "bathrooms",
      "lotSize", "propertyType", "lastSaleDate", "estimatedValue", "taxAssessment",
    ];
    for (const key of knownKeys) {
      const val = data[key];
      if (val !== undefined && val !== null) {
        (facts as Record<string, unknown>)[key] = val;
      }
    }
    // Include any additional Rentcast scalar fields not in the known set
    for (const [key, val] of Object.entries(data)) {
      if (val !== undefined && val !== null && typeof val !== "object" && !(key in facts)) {
        (facts as Record<string, unknown>)[key] = val;
      }
    }
    if (Object.keys(facts).length > 0) return facts;
  }

  return stubFetchPropertyFacts(address);
}


type RentcastAvmResponse = {
  price?: number;
  priceRangeLow?: number;
  priceRangeHigh?: number;
  comparables?: Array<{
    id?: string;
    formattedAddress?: string;
    addressLine1?: string;
    address?: string;
    price?: number;
    lastSalePrice?: number;
    lastSaleDate?: string;
    listedDate?: string;
    saleDate?: string;
    squareFootage?: number;
    bedrooms?: number;
    bathrooms?: number;
    distance?: number;
  }>;
};

export interface AvmData {
  price: number | null;
  priceRangeLow: number | null;
  priceRangeHigh: number | null;
  comps: CompRecord[];
}

export async function fetchAvmData(address: string): Promise<AvmData> {
  const encoded = encodeURIComponent(address);
  const raw = await rentcastFetch<RentcastAvmResponse>(
    `/avm/value?address=${encoded}&compCount=10`
  );

  console.log("[Rentcast] AVM keys:", raw ? Object.keys(raw) : "null", "comparables count:", raw?.comparables?.length ?? "none");

  let comps: CompRecord[] = [];
  if (raw?.comparables && Array.isArray(raw.comparables) && raw.comparables.length > 0) {
    comps = raw.comparables.map((c) => ({
      address: c.formattedAddress ?? c.addressLine1 ?? c.address ?? "Unknown",
      salePrice: c.lastSalePrice ?? c.price ?? 0,
      saleDate: c.lastSaleDate ?? c.listedDate ?? c.saleDate ?? "",
      squareFootage: c.squareFootage ?? 0,
      bedrooms: c.bedrooms ?? 0,
      bathrooms: c.bathrooms ?? 0,
      distanceMiles: c.distance ?? 0,
    }));
  }

  if (comps.length === 0) {
    comps = await stubFetchSoldComps(address);
  }

  return {
    price: raw?.price ?? null,
    priceRangeLow: raw?.priceRangeLow ?? null,
    priceRangeHigh: raw?.priceRangeHigh ?? null,
    comps,
  };
}

export async function fetchSoldComps(address: string): Promise<CompRecord[]> {
  const avm = await fetchAvmData(address);
  return avm.comps;
}

type RentcastListingsResponse = Array<{
  id?: string;
  formattedAddress?: string;
  address?: string;
  price?: number;
  listedDate?: string;
  listingDate?: string;
  squareFootage?: number;
  bedrooms?: number;
  bathrooms?: number;
  distance?: number;
}>;

export async function fetchActiveListings(address: string): Promise<ListingRecord[]> {
  const encoded = encodeURIComponent(address);
  const raw = await rentcastFetch<RentcastListingsResponse>(
    `/listings?address=${encoded}&status=Active&limit=10`
  );

  if (raw && Array.isArray(raw) && raw.length > 0) {
    return raw.map((c) => ({
      address: c.formattedAddress ?? c.address ?? "Unknown",
      listPrice: c.price ?? 0,
      listingDate: c.listedDate ?? c.listingDate ?? "",
      squareFootage: c.squareFootage ?? 0,
      bedrooms: c.bedrooms ?? 0,
      bathrooms: c.bathrooms ?? 0,
      distanceMiles: c.distance ?? 0,
    }));
  }

  return stubFetchActiveListings(address);
}
