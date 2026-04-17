---
document: PEO Architecture Boundaries
status: Phase 1 deliverable
version: 1.0
date: 2026-04-16
owner: SAA + PMA
authority: Build Context Engineering Standard — `01_system/ai-governance/build-context-engineering-standard-2026-04-15.md`
confidentiality: Proprietary internal — no external publishing approved
---

# PEO Architecture Boundaries
## Service Decomposition, API Boundaries, and Data Model Skeleton

---

## 1. Service Decomposition

PEO is decomposed into **9 logical services**. Each service owns a bounded surface and exposes a versioned API contract.

| Service | Domain | Responsibility | Phase |
|---------|--------|----------------|-------|
| `public-content` | Marketing / trust | Homepage, pricing, FAQ, trust center, lead capture | 2 |
| `identity` | Authentication / authorization | Clerk integration, RBAC enforcement, session management, consent tracking | 2–3 |
| `estimator` | Free-tier calculations | Manual-input formula engine (Layers E + F), toggle-based UI data contracts | 2 |
| `seller` | Seller application | Intake, property profile, path comparison, seller report generation | 3 |
| `investor` | Investor analysis | Basic and advanced deal analysis, comp handling, scenario planning, exports | 4–5 |
| `marketplace` | Vendor directory | Vendor profiles, lead routing, reviews, vendor analytics | 6 |
| `triage` | Deal qualification | Automated triage engine, flag logic, readiness staging, confidence scoring | 3 |
| `readiness` | Deal-readiness planning | Readiness item taxonomy, plan generation, progress tracking | 3 |
| `analytics` | Event instrumentation | PII-safe event capture, PostHog routing, audit event sinks | All |

---

## 2. Service Boundaries and API Contracts

### 2.1 public-content
- **Scope:** Read-only marketing content and lead capture
- **Auth:** None required for read; `POST /api/public/lead` is anonymous
- **Boundary:** No authenticated data access. No formula execution.

### 2.2 identity
- **Scope:** Auth provider abstraction (Clerk), RBAC enforcement, consent records
- **Auth:** Clerk sessions; server-side role resolution
- **Boundary:** All role checks are authoritative here. Client-side role hints are supplemental only.

### 2.3 estimator
- **Scope:** Free-tier calculation API (Layers E + F only)
- **Auth:** Optional (anonymous or registered free_user)
- **Boundary:** No live property data. No comp lookups. Manual inputs only. Results labeled "user-input driven / not comp-verified."

### 2.4 seller
- **Scope:** Seller application lifecycle (CRUD + submit + status tracking)
- **Auth:** `seller_applicant`, `seller_verified`
- **Boundary:** No MAO exposure. No investor formulas. SellerApplication IS the deal record (no separate Deal entity).

### 2.5 investor
- **Scope:** Deal analysis for Basic and Advanced tiers
- **Auth:** `investor_basic`, `investor_advanced`
- **Boundary:** API response filtering enforced per Formula Exposure Matrix. MARKET ARV is reference-only for Basic.

### 2.6 marketplace
- **Scope:** Vendor directory and lead management
- **Auth:** `vendor`, `admin_internal`
- **Boundary:** Leads are routed, not raw contact data dumps.

### 2.7 triage
- **Scope:** Automated qualification engine
- **Auth:** Internal service + admin
- **Boundary:** TriageResult is versioned. Engine version recorded on every run.

### 2.8 readiness
- **Scope:** Deal-readiness plan generation and tracking
- **Auth:** `seller_verified`, `investor_basic`, `investor_advanced`, `admin_internal`
- **Boundary:** ReadinessPlan is versioned by taxonomy_version.

### 2.9 analytics
- **Scope:** Event taxonomy enforcement, PII linting, PostHog routing
- **Auth:** Internal
- **Boundary:** Prohibited fields are stripped before any event leaves the server.

---

## 3. Cross-Service Data Flow

```
[Public Website] → public-content (read)
                        ↓
[Free Estimator] → estimator (calculate)
                        ↓
                identity (signup/login)
                        ↓
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
    [Seller]      [Investor]      [Marketplace]
        ↓               ↓               ↓
    [Triage] ←────→ [Readiness]    [Vendor leads]
        ↓
   [Analytics] (all services emit here)
```

---

## 4. Authorization Model

### 4.1 Role Codes
| Code | Name |
|------|------|
| `anonymous_visitor` | Unregistered visitor |
| `free_user` | Registered free account |
| `seller_applicant` | Seller application in progress |
| `seller_verified` | Verified seller |
| `investor_basic` | Investor Basic subscriber |
| `investor_advanced` | Investor Advanced subscriber |
| `vendor` | Verified marketplace vendor |
| `admin_internal` | NoDrftSystems admin |

### 4.2 Enforcement Rule
- RBAC is enforced at the **API route handler layer** for every endpoint.
- Field-level filtering applies per the Formula Exposure Matrix.
- Client-side role checks are UI hints only; they cannot authorize data access.

---

## 5. Data Model Skeleton

### 5.1 Canonical Entities
The Prisma schema (single source of truth) defines the following models:

- `User`
- `Session`
- `ConsentRecord`
- `EstimatorSession`
- `EstimatorResult`
- `SellerApplication` (deal record)
- `UploadArtifact`
- `TriageResult`
- `ReadinessPlan`
- `ReadinessItem`
- `InvestorProfile`
- `Vendor`
- `VendorLead`
- `Review`
- `AuditLog`

**No separate `Deal` entity.** `SellerApplication` carries all deal fields.

### 5.2 Versioning Strategy
- **API:** URL versioning at `/api/v1/`
- **Triage engine:** `TriageResult.engine_version`
- **Formulas:** `EstimatorResult.formula_version` and `TriageResult.formula_version`
- **Readiness taxonomy:** `ReadinessPlan.taxonomy_version`

### 5.3 Audit Log Coverage
All of the following write an `AuditLog` entry:
- Any export or download
- Any triage or readiness view by an investor
- Any admin action
- Any formula override event
- Any kill-switch trigger
- Any confidence review trigger
- Any role change

---

## 6. Architecture Decisions

### AD-001: Next.js App Router as the Unified Surface
We use Next.js 15 App Router for both marketing pages and authenticated dashboards. This collapses the public site and application UIs into a single deployable unit on Vercel, with Server Components handling auth-gated data fetching.

### AD-002: Formula Engine is Server-Side Only
No formula logic runs in the browser. All calculations execute in API routes or Server Components. This prevents exposure of undisclosed formulas and simplifies the Formula Exposure Matrix enforcement.

### AD-003: Prisma Schema is the Single Source of Truth
All entity definitions flow from `prisma/schema.prisma`. No ad hoc SQL without RCA + DSS review.

### AD-004: Zod Validates All API Boundaries
Every API input and output is Zod-validated. This is mandatory for all services without exception.

### AD-005: PostHog as the Analytics Sink
All services emit events through a single `analytics` service helper that enforces the PEO event taxonomy and PII linting rules before routing to PostHog.

### AD-006: Cloudflare R2 for Uploads with Signed URLs
Upload storage uses signed URLs with time-limited access. Direct public URL exposure is prohibited.

### AD-007: Clerk for Auth (pending confirmation, now closed as O-001)
Clerk provides MFA, RBAC hooks, social login, and Next.js App Router native integration.

---

## 7. Phase 1 Evidence

| Artifact | Location | Status |
|----------|----------|--------|
| Architecture boundaries document | `04_products/PEO/01_specs/architecture-boundaries.md` | Complete |
| Service decomposition | This document, Section 1 | Complete |
| API boundary definitions | This document, Section 2 | Complete |
| Data model skeleton | `04_products/PEO/peo-app/prisma/schema.prisma` | Complete |
| Evidence ledger update | `04_products/PEO/00_governance/evidence-ledger.md` | Complete |

---

*Architecture Boundaries version 1.0 — 2026-04-16*
*Produced by SAA + RCA + PMA for Phase 1 of the PEO build*
