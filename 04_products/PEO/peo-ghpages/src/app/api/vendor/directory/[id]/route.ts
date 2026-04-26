import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vendor = await prisma.vendor.findUnique({
      where: { id, status: "verified" },
      include: {
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const avgRating = vendor.reviews.length
      ? vendor.reviews.reduce((sum, r) => sum + r.rating, 0) / vendor.reviews.length
      : 0;

    return NextResponse.json({
      vendor: {
        id: vendor.id,
        companyName: vendor.companyName,
        services: vendor.services,
        markets: vendor.markets,
        website: vendor.website,
        bio: vendor.bio,
        reviewCount: vendor.reviews.length,
        avgRating: Number(avgRating.toFixed(1)),
        reviews: vendor.reviews,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
