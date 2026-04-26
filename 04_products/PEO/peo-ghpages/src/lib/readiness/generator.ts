import type { PrismaClient } from "@prisma/client";

export const TAXONOMY_VERSION = "1.0";

export interface ReadinessTemplate {
  category: string;
  title: string;
  description: string;
  priority: number;
}

export function getDefaultItems(): ReadinessTemplate[] {
  return [
    {
      category: "Document",
      title: "Property deed or title report",
      description: "Verify clear ownership and identify any liens or encumbrances.",
      priority: 1,
    },
    {
      category: "Document",
      title: "Recent tax statement",
      description: "Confirm tax status and assessed value.",
      priority: 2,
    },
    {
      category: "Disclosure",
      title: "Known defects disclosure",
      description: "Document any known structural, mechanical, or environmental issues.",
      priority: 3,
    },
    {
      category: "Repair",
      title: "Roof condition assessment",
      description: "Evaluate roof age, condition, and estimated remaining life.",
      priority: 4,
    },
    {
      category: "Repair",
      title: "HVAC system check",
      description: "Confirm heating and cooling systems are functional and properly maintained.",
      priority: 5,
    },
    {
      category: "Service",
      title: "Pest inspection",
      description: "Check for termite, rodent, or other pest activity.",
      priority: 6,
    },
    {
      category: "Service",
      title: "Plumbing inspection",
      description: "Identify leaks, water pressure issues, or outdated piping.",
      priority: 7,
    },
    {
      category: "Document",
      title: "HOA documents (if applicable)",
      description: "Review restrictions, fees, and financial health.",
      priority: 8,
    },
  ];
}

export async function generateReadinessPlan(
  prisma: PrismaClient,
  applicationId: string
) {
  const existing = await prisma.readinessPlan.findUnique({
    where: { applicationId },
  });

  if (existing) {
    return existing;
  }

  const plan = await prisma.readinessPlan.create({
    data: {
      applicationId,
      taxonomyVersion: TAXONOMY_VERSION,
      summary: "Initial readiness plan generated from seller application.",
    },
  });

  const items = getDefaultItems();
  await prisma.readinessItem.createMany({
    data: items.map((item) => ({
      planId: plan.id,
      category: item.category,
      title: item.title,
      description: item.description,
      priority: item.priority,
      completed: false,
    })),
  });

  return prisma.readinessPlan.findUnique({
    where: { id: plan.id },
    include: { items: { orderBy: { priority: "asc" } } },
  });
}
