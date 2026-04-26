// DEV-ONLY: Direct Rentcast data pull for testing. Remove or gate before production.
// Usage: GET /api/test/property-data?address=123+Main+St+Austin+TX+78701

import { NextRequest, NextResponse } from "next/server";

const RENTCAST_API_KEY = process.env.RENTCAST_API_KEY;
const RENTCAST_BASE_URL = "https://api.rentcast.io/v1";

async function rc<T>(path: string): Promise<{ data: T | null; status: number; ok: boolean }> {
  if (!RENTCAST_API_KEY) {
    return { data: null, status: 0, ok: false };
  }
  try {
    const res = await fetch(`${RENTCAST_BASE_URL}${path}`, {
      headers: { Accept: "application/json", "X-Api-Key": RENTCAST_API_KEY },
      cache: "no-store",
    });
    const text = await res.text();
    let data: T | null = null;
    try { data = JSON.parse(text) as T; } catch { /* non-JSON */ }
    return { data, status: res.status, ok: res.ok };
  } catch (err) {
    return { data: null, status: 0, ok: false };
  }
}

export async function GET(request: NextRequest) {
  // Only available in local development with placeholder Clerk key
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
  const clerkConfigured = clerkKey.startsWith("pk_") && clerkKey !== "pk_test_replace_me" && clerkKey.length > 30;
  if (clerkConfigured || process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const address = request.nextUrl.searchParams.get("address");
  if (!address || address.trim().length < 5) {
    return NextResponse.json({ error: "address query param required. Example: ?address=123 Main St Austin TX 78701" }, { status: 400 });
  }

  if (!RENTCAST_API_KEY) {
    return NextResponse.json({ error: "RENTCAST_API_KEY not set in environment" }, { status: 500 });
  }

  const encoded = encodeURIComponent(address.trim());

  // Pull all 3 data types in parallel — single round-trip
  const [propertyResult, soldCompsResult, activeListingsResult] = await Promise.all([
    rc<Record<string, unknown>>(`/properties?address=${encoded}`),
    rc<unknown[]>(`/sales-comparables?address=${encoded}&propertyType=Single%20Family&compCount=10`),
    rc<unknown[]>(`/listing-comparables?address=${encoded}&propertyType=Single%20Family&compCount=10`),
  ]);

  const summary = {
    address: address.trim(),
    property: {
      ok: propertyResult.ok,
      httpStatus: propertyResult.status,
      dataReceived: propertyResult.data !== null,
      squareFootage: (propertyResult.data as Record<string, unknown>)?.squareFootage ?? null,
      bedrooms: (propertyResult.data as Record<string, unknown>)?.bedrooms ?? null,
      bathrooms: (propertyResult.data as Record<string, unknown>)?.bathrooms ?? null,
      yearBuilt: (propertyResult.data as Record<string, unknown>)?.yearBuilt ?? null,
      propertyType: (propertyResult.data as Record<string, unknown>)?.propertyType ?? null,
      estimatedValue: (propertyResult.data as Record<string, unknown>)?.estimatedValue ?? null,
    },
    soldComps: {
      ok: soldCompsResult.ok,
      httpStatus: soldCompsResult.status,
      count: Array.isArray(soldCompsResult.data) ? soldCompsResult.data.length : 0,
      records: soldCompsResult.data,
    },
    activeListings: {
      ok: activeListingsResult.ok,
      httpStatus: activeListingsResult.status,
      count: Array.isArray(activeListingsResult.data) ? activeListingsResult.data.length : 0,
      records: activeListingsResult.data,
    },
    // raw data intentionally omitted — prevents API response shape leakage
  };

  const allOk = propertyResult.ok && soldCompsResult.ok && activeListingsResult.ok;

  return NextResponse.json(
    { success: allOk, summary },
    { status: allOk ? 200 : 207 }
  );
}
