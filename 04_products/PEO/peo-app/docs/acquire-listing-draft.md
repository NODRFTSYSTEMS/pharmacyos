# Peak Equity Optimizer — Acquire.com Listing Draft

> Internal draft. Do not publish until Founder sign-off.

---

## Listing Title
SaaS-ready PropTech platform — bilingual real estate deal analysis engine with complete formula library, Prisma schema, RBAC, and 33 routes. Infrastructure wiring required.

---

## Short Description (280 chars)
Bilingual (EN/ES) real estate deal intelligence platform. Formula engine covers seller net, MAO, BRRRR, DSCR, and wholesale. Next.js 16 + Prisma + Clerk + PostHog. 62 passing tests. Plug in DB, auth keys, and launch.

---

## Full Description

Peak Equity Optimizer is a production-ready Next.js 16 SaaS application targeting US real estate sellers and investors who need defensible, comp-backed deal analysis — not AVM guesses.

**What you're buying:**

A fully-built application codebase with:

- **Complete formula engine** — Seller net proceeds, investor MAO (70% rule + custom profile), fix-and-flip hold cost modeling, BRRRR refi proceeds and cash-on-cash, DSCR for buy-and-hold, wholesale spread, confidence scoring, and deal kill switches. Every formula has unit test coverage — 62 tests across 8 test files, all passing.

- **Bilingual product** — Full EN/ES support via `next-intl` with 902 translation entries per language. The bilingual layer is complete and routing-aware — not a bolted-on translation toggle.

- **33 public routes** — Marketing pages, estimator tool, seller application flow, investor dashboard routes, academy/education section, FAQ, trust page, legal pages (TOS, Privacy, Disclosures), pricing page, vendor directory.

- **29 API routes** — Estimator, seller application CRUD, investor analysis CRUD, triage engine, readiness plan, property lookup, vendor directory, admin user/role management, all with Zod validation on every input boundary.

- **Complete Prisma schema** — 16 models, 3 migrations ready to deploy: Users, Sessions, ConsentRecords, EstimatorSessions, EstimatorResults, SellerApplications, UploadArtifacts, TriageResults, RehabItems, ReadinessPlans, ReadinessItems, InvestorProfiles, Vendors, VendorLeads, Reviews, AuditLogs.

- **8-tier RBAC** — anonymous_visitor → free_user → seller → investor_core → investor_elite → vendor → admin_internal. Role enforcement at both middleware and API handler level.

- **Auth scaffold** — Clerk (`@clerk/nextjs`) installed and configured. Sign-in/sign-up pages wired. Middleware ready. Demo mode gated to development only — production builds are auth-live.

- **Analytics** — PostHog provider active with page tracking. Five conversion events instrumented: estimator_completed, application_submitted, result_viewed, upgrade_clicked, signed_up.

- **Email** — Resend integration wired for sign-up welcome and application confirmation.

- **PII protection** — Custom linting layer (`src/lib/events/pii-lint.ts`) that scans all analytics and audit payloads for prohibited fields before any write.

- **Security baseline** — X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy headers globally. Next.js `poweredByHeader: false`. Error responses strip internal detail.

- **Docker-ready** — Dockerfile + docker-compose for full local stack (app + PostgreSQL + PGAdmin). Standalone Next.js output configured.

**Pricing model declared and defensible:**

| Tier | Price |
|------|-------|
| Free Estimator | $0 (demand generation) |
| Seller Analysis | $49 / property |
| Investor Basic | $99 / month |
| Investor Advanced | $299 / month |
| Vendor Listing | $199 / month |

The free estimator is a built-in lead magnet — users get real calculations but no live data until they upgrade. The upgrade prompt is wired directly below every estimator result.

**What a buyer needs to activate:**

1. Create a Neon PostgreSQL project → set `DATABASE_URL` → run `pnpm prisma migrate deploy` (5 minutes)
2. Create a Clerk application → add two environment keys (5 minutes)
3. Create a RentCast API account → set `RENTCAST_API_KEY` for live property comps (10 minutes)
4. Create a PostHog project → set `NEXT_PUBLIC_POSTHOG_KEY` (2 minutes)
5. Create a Resend account → set `RESEND_API_KEY` + configure sending domain (15 minutes)
6. Deploy to Vercel → set env vars (10 minutes)

**Target buyers:**

- PropTech developer or agency looking for a production-ready deal analysis platform to white-label or extend
- Real estate SaaS operator who wants a bilingual platform for US Latino real estate markets (a significant underserved segment)
- Individual operator in real estate who wants to launch a SaaS product without building from scratch
- PE/VC-backed PropTech company acquiring a codebase to accelerate their own roadmap

---

## Business Model
SaaS — freemium with four paid tiers. Pricing is live in the UI and defensible against market comps (Mashvisor: $49/mo, DealCheck: $10/mo, PropStream: $99/mo). PEO's formula depth and bilingual capability are differentiated.

## Revenue at Time of Sale
$0 MRR — infrastructure is not yet connected. This is a codebase sale, not a revenue sale.

## Traffic
No live traffic — not yet deployed to production.

## Tech Stack
Next.js 16 / TypeScript / Tailwind CSS 4 / Prisma 6 / PostgreSQL / Clerk / PostHog / Vitest / Docker

## Asking Price
$12,000–$18,000 (negotiable based on buyer's activation plan)

## What's Included
- Complete application codebase with git history
- DECISIONS.md (architectural rationale)
- .env.example with all required variables documented
- Docker + docker-compose for local development
- 62 passing unit + integration tests
- Prisma schema + migration files
- All 902 translation entries (EN + ES)

## What's NOT Included
- Live Neon, Clerk, RentCast, PostHog, or Resend accounts
- Ongoing development or support (available separately)
- The domain peakequityoptimizer.com (available to negotiate)

---

*Draft prepared: 2026-04-20. Not published. Requires Founder sign-off before listing.*
