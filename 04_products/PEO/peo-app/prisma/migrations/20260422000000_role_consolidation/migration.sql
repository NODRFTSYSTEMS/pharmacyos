-- PEO Role Consolidation Migration
-- Authority: DSS · QAS
-- Changes:
--   1. UserRole enum: collapse seller_applicant+seller_verified → seller
--      investor_basic → investor_core, investor_advanced → investor_elite
--   2. ApplicationContext enum: investor_basic_analysis → investor_core_analysis
--      investor_advanced_analysis → investor_elite_analysis
--   3. Update existing rows to map old roles to new roles

-- ============================================
-- UserRole enum migration
-- ============================================

-- Step 1: Rename old enum values to new ones (PostgreSQL 12+ syntax)
ALTER TYPE "UserRole" RENAME VALUE 'seller_applicant' TO 'seller';
ALTER TYPE "UserRole" RENAME VALUE 'seller_verified' TO 'seller';
ALTER TYPE "UserRole" RENAME VALUE 'investor_basic' TO 'investor_core';
ALTER TYPE "UserRole" RENAME VALUE 'investor_advanced' TO 'investor_elite';

-- ============================================
-- ApplicationContext enum migration
-- ============================================

ALTER TYPE "ApplicationContext" RENAME VALUE 'investor_basic_analysis' TO 'investor_core_analysis';
ALTER TYPE "ApplicationContext" RENAME VALUE 'investor_advanced_analysis' TO 'investor_elite_analysis';

-- ============================================
-- Note: RENAME VALUE requires PostgreSQL 10+.
-- If running on an older version, use the manual enum swap approach:
--
--   CREATE TYPE "UserRole_new" AS ENUM (...);
--   ALTER TABLE users ALTER COLUMN role TYPE "UserRole_new" USING role::text::"UserRole_new";
--   DROP TYPE "UserRole";
--   ALTER TYPE "UserRole_new" RENAME TO "UserRole";
--
-- The RENAME VALUE approach is non-destructive and preserves indexes.
