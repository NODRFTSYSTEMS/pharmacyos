import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runTriage } from "@/lib/triage/engine";
import { generateReadinessPlan } from "@/lib/readiness/generator";
import { fetchPropertyFacts, fetchSoldComps } from "@/lib/property-data/rentcast";
import { getSessionContext } from "@/lib/auth/session";
import { requireRole, SELLER_ROLES } from "@/lib/auth/rbac";
import type { Prisma } from "@prisma/client";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionContext();
    if (!session || !requireRole(session.role, SELLER_ROLES)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const appRecord = await prisma.sellerApplication.findUnique({
      where: { id, context: "seller_application" },
      select: { userId: true },
    });

    if (!appRecord) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!requireRole(session.role, ["admin_internal"]) && appRecord.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const app = await prisma.sellerApplication.findUnique({
      where: { id, context: "seller_application" },
      include: { uploads: true },
    });

    if (!app) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Stubbed property data fetch
    const propertyFacts = await fetchPropertyFacts(app.address);
    const comps = await fetchSoldComps(app.address);

    // Update application with stubbed facts and confirm address
    await prisma.sellerApplication.update({
      where: { id, context: "seller_application" },
      data: {
        status: "in_review",
        addressConfirmed: true,
        propertyFacts: propertyFacts as unknown as Prisma.InputJsonValue,
      },
    });

    // Run triage with full 4-dimension confidence model
    const triageResult = runTriage({
      addressConfirmed: true,
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
        // TODO-BLS: Replace with real investor formula outputs in Phase 4
        expectedProfit: 50000,
        roi: 20,
        stressProfit: 50000,
        requiredProfitFloor: 30000,
      },
    });

    // Save triage result
    await prisma.triageResult.upsert({
      where: { applicationId: id },
      create: {
        applicationId: id,
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

    // Generate readiness plan
    await generateReadinessPlan(prisma, id);

    // Update application status based on triage
    const finalStatus = triageResult.passTriggered ? "closed" : "triage_complete";
    await prisma.sellerApplication.update({
      where: { id, context: "seller_application" },
      data: { status: finalStatus },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: app.userId,
        action: "application_submit",
        resource: "seller_applications",
        resourceId: app.id,
        meta: { triageScore: triageResult.confidenceScore, pass: triageResult.passTriggered } as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({
      application: await prisma.sellerApplication.findUnique({
        where: { id, context: "seller_application" },
        include: { triage: true, readiness: { include: { items: true } } },
      }),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
