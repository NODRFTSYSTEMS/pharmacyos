import { NextRequest, NextResponse } from "next/server";
import { fetchPropertyFacts, fetchAvmData } from "@/lib/property-data/rentcast";

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address") ?? "";
  if (address.length < 5) {
    return NextResponse.json({ error: "Address too short" }, { status: 400 });
  }

  const [propertyFacts, avmData] = await Promise.all([
    fetchPropertyFacts(address),
    fetchAvmData(address),
  ]);

  return NextResponse.json({
    propertyFacts,
    avm: {
      price: avmData.price,
      priceRangeLow: avmData.priceRangeLow,
      priceRangeHigh: avmData.priceRangeHigh,
    },
  });
}
