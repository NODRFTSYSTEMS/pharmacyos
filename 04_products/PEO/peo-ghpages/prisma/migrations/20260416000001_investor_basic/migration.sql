-- PEO Schema v1.1 Migration — Investor Basic
-- Created: 2026-04-16
-- Engine: PostgreSQL

-- Create ApplicationContext enum
CREATE TYPE "ApplicationContext" AS ENUM ('seller_application', 'investor_basic_analysis', 'investor_advanced_analysis');

-- Alter SellerApplication: remove unique constraint on userId, add context, add index
ALTER TABLE "seller_applications" DROP CONSTRAINT "seller_applications_userId_key";
ALTER TABLE "seller_applications" ADD COLUMN "context" "ApplicationContext" NOT NULL DEFAULT 'seller_application';
CREATE INDEX "seller_applications_userId_idx" ON "seller_applications"("userId");

-- Alter SellerApplication: add investorInputs JSONB column
ALTER TABLE "seller_applications" ADD COLUMN "investorInputs" JSONB;

-- Alter TriageResult: add investorOutputs JSONB column
ALTER TABLE "triage_results" ADD COLUMN "investorOutputs" JSONB;
