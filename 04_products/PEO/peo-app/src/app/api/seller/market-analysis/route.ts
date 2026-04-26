import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth/session";
import { requireRole, SELLER_ROLES } from "@/lib/auth/rbac";
import { fetchPropertyFacts, fetchAvmData, fetchActiveListings } from "@/lib/property-data/rentcast";
import {
  calculateARVFromComps,
  calculateTieredARV,
  calculateMarketVelocity,
  calculatePPSFStats,
  type Comp,
} from "@/lib/formulas/calculations";

/* ------------------------------------------------------------------
 * POST /api/seller/market-analysis — Live market position for address
 * Authority: PMA · IDS · BLS · SCA
 * ------------------------------------------------------------------ */

const schema = z.object({
  address: z.string().min(1),
});

function mapToComp(c: {
  salePrice: number;
  squareFootage: number;
  saleDate?: string;
  distanceMiles?: number;
  daysOnMarket?: number;
  bedrooms?: number;
  bathrooms?: number;
}): Comp {
  return {
    price: c.salePrice,
    sqft: c.squareFootage,
    soldDate: c.saleDate,
    distanceMiles: c.distanceMiles ?? 0,
    daysOnMarket: c.daysOnMarket,
    bedrooms: c.bedrooms,
    bathrooms: c.bathrooms,
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session || !requireRole(session.role, SELLER_ROLES)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { address } = parsed.data;

    const [propertyFacts, avmData, activeListings] = await Promise.all([
      fetchPropertyFacts(address),
      fetchAvmData(address),
      fetchActiveListings(address),
    ]);

    const comps = avmData.comps.map(mapToComp);
    const listingComps = activeListings.map((l) => ({
      price: l.listPrice,
      sqft: l.squareFootage,
      distanceMiles: l.distanceMiles,
      daysOnMarket: l.daysOnMarket,
    }));

    const subjectSqft = propertyFacts.squareFootage ?? 1800;
    const subjectARV = avmData.price ?? calculateARVFromComps(comps, subjectSqft).arv;

    const arvResult = calculateARVFromComps(comps, subjectSqft);
    const tieredARV = calculateTieredARV(comps);
    const marketVelocity = calculateMarketVelocity(comps, listingComps);
    const ppsfStats = calculatePPSFStats(comps, subjectARV, subjectSqft);

    // Build PPSF comparison bars for chart
    const ppsfBars = [
      { label: "Your\nProperty", value: Math.round(ppsfStats.subjectPPSF), color: "var(--gold)" },
      { label: "Low", value: Math.round(ppsfStats.min), color: "var(--red)" },
      { label: "Median", value: Math.round(ppsfStats.median), color: "var(--text-soft)" },
      { label: "High", value: Math.round(ppsfStats.max), color: "var(--green)" },
    ];

    // Build 6-month trend from comps (group by month)
    const monthly: Record<string, number[]> = {};
    for (const c of comps) {
      if (c.soldDate) {
        const d = new Date(c.soldDate);
        const key = d.toLocaleString("en-US", { month: "short" });
        if (!monthly[key]) monthly[key] = [];
        monthly[key].push(c.price / c.sqft);
      }
    }
    const trendData = Object.entries(monthly)
      .map(([month, vals]) => ({
        x: month,
        y: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
      }))
      .slice(-6);

    if (trendData.length === 0) {
      // Fallback mock trend when no date data
      const base = Math.round(ppsfStats.median || 175);
      trendData.push(
        { x: "Jan", y: base - 10 },
        { x: "Feb", y: base - 7 },
        { x: "Mar", y: base - 5 },
        { x: "Apr", y: base - 2 },
        { x: "May", y: base },
        { x: "Jun", y: base + 3 }
      );
    }

    return NextResponse.json({
      address,
      propertyFacts,
      avm: {
        price: avmData.price,
        priceRangeLow: avmData.priceRangeLow,
        priceRangeHigh: avmData.priceRangeHigh,
      },
      arv: {
        value: arvResult.arv,
        confidence: arvResult.confidence,
        tier: tieredARV.tier,
        compCount: arvResult.compCount,
      },
      marketVelocity,
      ppsfStats,
      ppsfBars,
      trendData,
      soldComps: avmData.comps,
      activeListings,
    });
  } catch (err) {
    console.error("[/api/seller/market-analysis] error:", err);
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
