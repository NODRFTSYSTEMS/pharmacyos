import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get("service");
    const market = searchParams.get("market");

    const vendors = await prisma.vendor.findMany({
      where: {
        status: "verified",
        ...(service ? { services: { has: service } } : {}),
        ...(market ? { markets: { has: market } } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        reviews: { select: { rating: true } },
      },
    });

    const results = vendors.map((v) => {
      const avgRating = v.reviews.length
        ? v.reviews.reduce((sum, r) => sum + r.rating, 0) / v.reviews.length
        : 0;
      return {
        id: v.id,
        companyName: v.companyName,
        services: v.services,
        markets: v.markets,
        website: v.website,
        bio: v.bio,
        reviewCount: v.reviews.length,
        avgRating: Number(avgRating.toFixed(1)),
      };
    });

    return NextResponse.json({ vendors: results });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
