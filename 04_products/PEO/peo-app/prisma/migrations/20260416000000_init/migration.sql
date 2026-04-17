-- PEO Schema v1.0 Migration
-- Created: 2026-04-16
-- Engine: PostgreSQL

-- Create custom types
CREATE TYPE "UserRole" AS ENUM ('anonymous_visitor', 'free_user', 'seller_applicant', 'seller_verified', 'investor_basic', 'investor_advanced', 'vendor', 'admin_internal');
CREATE TYPE "Language" AS ENUM ('en_US', 'es_US');
CREATE TYPE "ConfidenceTier" AS ENUM ('HIGH', 'MEDIUM', 'LOW', 'VERY_LOW');
CREATE TYPE "ApplicationStatus" AS ENUM ('draft', 'submitted', 'in_review', 'triage_complete', 'ready', 'closed');
CREATE TYPE "VendorStatus" AS ENUM ('pending', 'verified', 'suspended');
CREATE TYPE "AuditActionType" AS ENUM ('export_download', 'triage_view', 'readiness_view', 'admin_action', 'formula_override', 'kill_switch_trigger', 'confidence_review_trigger', 'role_change', 'upload_create', 'application_submit');

-- Users
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'free_user',
    "preferredLang" "Language" NOT NULL DEFAULT 'en_US',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Sessions
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Consent Records
CREATE TABLE "consent_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "terms" BOOLEAN NOT NULL,
    "privacy" BOOLEAN NOT NULL,
    "marketing" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consent_records_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Estimator Sessions
CREATE TABLE "estimator_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "mode" TEXT NOT NULL,
    "inputs" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estimator_sessions_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "estimator_sessions" ADD CONSTRAINT "estimator_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Estimator Results
CREATE TABLE "estimator_results" (
    "id" TEXT NOT NULL,
    "estimatorSessionId" TEXT NOT NULL,
    "formulaVersion" TEXT NOT NULL,
    "outputs" JSONB NOT NULL,
    "labels" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estimator_results_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "estimator_results" ADD CONSTRAINT "estimator_results_estimatorSessionId_fkey" FOREIGN KEY ("estimatorSessionId") REFERENCES "estimator_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seller Applications (Deal Record)
CREATE TABLE "seller_applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'draft',
    "address" TEXT NOT NULL,
    "addressConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "goals" JSONB,
    "timeline" TEXT,
    "propertyFacts" JSONB,
    "expectedSalePrice" DECIMAL(14, 2),
    "mortgagePayoff" DECIMAL(14, 2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_applications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "seller_applications_userId_key" ON "seller_applications"("userId");
ALTER TABLE "seller_applications" ADD CONSTRAINT "seller_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Upload Artifacts
CREATE TABLE "upload_artifacts" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "r2Key" TEXT NOT NULL,
    "signedUrl" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "upload_artifacts_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "upload_artifacts" ADD CONSTRAINT "upload_artifacts_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "seller_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Triage Results
CREATE TABLE "triage_results" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "engineVersion" TEXT NOT NULL,
    "formulaVersion" TEXT NOT NULL,
    "confidenceScore" INTEGER NOT NULL,
    "confidenceTier" "ConfidenceTier" NOT NULL,
    "flags" JSONB NOT NULL,
    "recommendation" TEXT,
    "passTriggered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "triage_results_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "triage_results_applicationId_key" ON "triage_results"("applicationId");
ALTER TABLE "triage_results" ADD CONSTRAINT "triage_results_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "seller_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Readiness Plans
CREATE TABLE "readiness_plans" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "taxonomyVersion" TEXT NOT NULL,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "readiness_plans_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "readiness_plans_applicationId_key" ON "readiness_plans"("applicationId");
ALTER TABLE "readiness_plans" ADD CONSTRAINT "readiness_plans_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "seller_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Readiness Items
CREATE TABLE "readiness_items" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "estimatedCost" DECIMAL(14, 2),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "readiness_items_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "readiness_items" ADD CONSTRAINT "readiness_items_planId_fkey" FOREIGN KEY ("planId") REFERENCES "readiness_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Investor Profiles
CREATE TABLE "investor_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "strategy" TEXT,
    "markets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investor_profiles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "investor_profiles_userId_key" ON "investor_profiles"("userId");
ALTER TABLE "investor_profiles" ADD CONSTRAINT "investor_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Vendors
CREATE TABLE "vendors" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "VendorStatus" NOT NULL DEFAULT 'pending',
    "companyName" TEXT NOT NULL,
    "services" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "markets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "website" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "vendors_userId_key" ON "vendors"("userId");
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Vendor Leads
CREATE TABLE "vendor_leads" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "contacted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_leads_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "vendor_leads" ADD CONSTRAINT "vendor_leads_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Reviews
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "reviews" ADD CONSTRAINT "reviews_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Audit Logs
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "AuditActionType" NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
