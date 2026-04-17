import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { runTriage } from "@/lib/triage/engine";
import { fetchPropertyFacts, fetchSoldComps } from "@/lib/property-data/rentcast";
import { getSessionContext } from "@/lib/auth/session";
import { requireRole, SELLER_ROLES } from "@/lib/auth/rbac";
import type { Prisma } from "@prisma/client";

const runSchema = z.object({
  applicationId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session || !requireRole(session.role, SELLER_ROLES)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = runSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { applicationId } = parsed.data;
    const app = await prisma.sellerApplication.findUnique({
      where: { id: applicationId, context: "seller_application" },
      include: { uploads: true },
    });

    if (!app) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!requireRole(session.role, ["admin_internal"]) && app.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const propertyFacts = await fetchPropertyFacts(app.address);
    const comps = await fetchSoldComps(app.address);

    const triageResult = runTriage({
      addressConfirmed: app.addressConfirmed,
      hasPropertyFacts: !!propertyFacts,
      expectedSalePrice: app.expectedSalePrice
        ? Number(app.expectedSalePrice)
        : undefined,
      missingUploads: Math.max(0, 2 - app.uploads.length),
      data: {
        primarySource: true,
        noMaterialConflicts: true,
        dataAgeDays: 15,
        secondarySource: false,
        materialConflictsResolved: true,
        estimatedFields: 0,
      },
      comp: {
        qualifiedCompCount: comps.length,
        sameSubdivisionCompCount: 1,
        radiusMiles: 0.5,
        compQualityScore: 75,
        timeAdjustmentRequired: false,
      },
      valuation: {
        valueRangePercent: 12,
        strongCompSupport: comps.length >= 3,
        recentMarketActivity: true,
        limitedMarketActivity: false,
      },
      model: {
        allFormulasExecuted: true,
        defaultsTriggered: 0,
        overrideEvents: 0,
        keyAssumptionsConfirmed: true,
      },
      pass: {
        canGeocodeAddress: true,
        propertyTypeReconcilable: true,
        expectedProfit: 50000,
        roi: 20,
        stressProfit: 50000,
        requiredProfitFloor: 30000,
      },
    });

    const saved = await prisma.triageResult.upsert({
      where: { applicationId },
      create: {
        applicationId,
        engineVersion: "1.1",
        formulaVersion: "1.0",
        confidenceScore: triageResult.confidenceScore,
        confidenceTier: triageResult.confidenceTier,
        flags: [...triageResult.flags, ...triageResult.triggers, ...triageResult.passTriggers] as unknown as Prisma.InputJsonValue,
        recommendation: triageResult.recommendation,
        passTriggered: triageResult.passTriggered,
      },
      update: {
        confidenceScore: triageResult.confidenceScore,
        confidenceTier: triageResult.confidenceTier,
        flags: [...triageResult.flags, ...triageResult.triggers, ...triageResult.passTriggers] as unknown as Prisma.InputJsonValue,
        recommendation: triageResult.recommendation,
        passTriggered: triageResult.passTriggered,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ triage: saved });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
