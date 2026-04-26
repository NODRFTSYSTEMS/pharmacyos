-- PEO Schema v1.2 Migration — Investor Advanced
-- Created: 2026-04-16
-- Engine: PostgreSQL

-- Rehab Line Items for Layer D full budgeting
CREATE TABLE "rehab_items" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(10, 2) NOT NULL DEFAULT 1,
    "unitCost" DECIMAL(14, 2) NOT NULL DEFAULT 0,
    "regionalMultiplier" DECIMAL(5, 2) NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rehab_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "rehab_items_applicationId_idx" ON "rehab_items"("applicationId");
ALTER TABLE "rehab_items" ADD CONSTRAINT "rehab_items_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "seller_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
