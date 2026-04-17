---
document: PEO Tech Stack Declaration
status: Active governance — O-004 Closed
version: 1.0
date: 2026-04-16
owner: Founder (nodrftsystems)
authority: Founder-directed declaration — closes open item O-004
confidentiality: Proprietary internal — no external publishing approved
---

# PEO Tech Stack Declaration
## Canonical Stack — All Phases

This document is the binding technology stack for the Peak Equity Optimizer build. No agent may introduce a technology outside this stack without Founder approval and a version update to this document.

---

## Stack Table

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Language | TypeScript | 5.x | Type safety across formula engine, API contracts, and shared types — mandatory given 30+ formula definitions and 13-entity schema |
| Framework | Next.js (App Router) | 15.x | SSR for public website (SEO), Server Components for authenticated dashboards, API routes for backend logic — single Vercel deployment target |
| Styling | Tailwind CSS | 4.x | Utility-first, no runtime overhead, flexible widths required for bilingual Spanish text expansion |
| UI Components | shadcn/ui (Radix UI primitives) | Latest | WCAG 2.1 AA compliant out of the box; accessible keyboard navigation and screen reader labels on all interactive elements |
| Database | PostgreSQL — Neon (serverless) | Latest | Managed serverless PostgreSQL; scales to zero in dev/staging; Vercel-native integration; strong JSONB support for formula result storage |
| ORM | Prisma | 6.x | Type-safe schema management with migration history — satisfies versioning requirements for triage engine, formulas, and readiness taxonomy |
| Auth | Clerk | Latest | Built-in MFA, RBAC hooks, social login, session management, Next.js App Router native — *closes O-001 as declared selection; subject to Founder confirmation* |
| Cloud / Deploy | Vercel | — | Next.js-native; preview deployments per branch; serverless functions for API routes; Edge network for public pages |
| File Storage | Cloudflare R2 | — | S3-compatible; signed URL access (root contract requirement); low egress cost; compatible with future malware scanning integration (O-005) |
| Internationalization | next-intl | 4.x | Next.js 15 App Router native; TypeScript-safe translation keys; en-US / es-US routing with locale detection |
| Analytics / Events | PostHog | Latest | PII-safe custom event capture; self-hostable option available; supports all 20+ core PEO events; feature flags for phased rollout |
| Email (transactional) | Resend + React Email | Latest | React component email templates; reliable transactional delivery; developer-native |
| Testing — Unit / Integration | Vitest + Testing Library | Latest | Faster than Jest; Vite-native; required for 100% formula coverage (Layers A–G) and component tests |
| Testing — E2E | Playwright | Latest | Cross-browser; required for critical flow coverage (estimator, seller submit, investor deal view) |
| Validation | Zod | 4.x | Runtime type safety for all API inputs and formula parameters; schema composition for complex multi-layer formula inputs |
| Package Manager | pnpm | 10.x | Faster installs; disk-efficient; lockfile-stable for reproducible builds |

---

## Repo Structure

```
peo-app/
  src/
    app/                    ← Next.js App Router pages and layouts
      (public)/             ← Public website + trust center
      (auth)/               ← Login, registration, onboarding
      estimator/            ← Free estimator (toggle-based)
      seller/               ← Seller application dashboard
      investor/             ← Investor Basic + Advanced dashboards
      marketplace/          ← Vendor directory
      admin/                ← Internal admin panel
    components/             ← shadcn/ui components + custom UI
    lib/
      formulas/             ← Formula engine (Layers A–G) — pure TypeScript
      triage/               ← Triage engine logic
      readiness/            ← Deal-readiness logic
      confidence/           ← 4-dimension confidence scoring
      comps/                ← Comp inclusion/exclusion logic
      events/               ← Event instrumentation helpers (PII-safe)
    api/                    ← API route handlers
    db/                     ← Prisma schema + client
    i18n/                   ← next-intl messages (en.json, es.json)
    types/                  ← Shared TypeScript types
  prisma/
    schema.prisma
    migrations/
  tests/
    unit/                   ← Vitest — formulas, triage, confidence
    integration/            ← Vitest — API route contracts
    e2e/                    ← Playwright — critical flows
    bilingual/              ← Snapshot tests — en-US / es-US parity
```

---

## Stack Constraints (binding)

These constraints govern all implementation decisions:

1. **Formula engine is server-side only.** No formula logic in client components. Formula calculations execute in API routes or Server Components. Raw formula inputs and outputs must never be exposed to the client beyond the exposure level defined in the Formula Exposure Matrix.

2. **Prisma schema is the single source of truth for data shape.** All entity definitions flow from `prisma/schema.prisma`. No ad hoc SQL or raw queries without RCA + DSS review.

3. **Zod validates all API boundaries.** Every API route input and output is Zod-validated. No unvalidated data enters the formula engine or database layer.

4. **next-intl keys are type-safe.** No hardcoded user-facing strings. All UI text is a translation key. Spanish strings must be provided before any route ships to production.

5. **shadcn/ui components only for interactive elements.** No custom interactive components unless shadcn/ui does not cover the pattern. WCAG 2.1 AA compliance is non-negotiable.

6. **PostHog event capture uses the PEO event schema exclusively.** No ad hoc event names. All events must appear in the core event list in `scoped-rules.md`. PII linting runs in CI.

7. **Cloudflare R2 upload paths use signed URLs only.** No publicly accessible upload paths. Expiry on all signed URLs.

8. **No environment variables are hardcoded.** All secrets and config via `.env.local` (dev) and Vercel environment variables (production). No secrets in committed code.

---

## Version Cadence

- Stack versions pinned in `package.json` per phase
- Major version upgrades require RCA + TVA review before adoption
- Next.js, Prisma, and Zod upgrades require regression test pass before merge

---

## Open Item Status

| ID | Item | Status | Notes |
|----|------|--------|-------|
| O-004 | Tech stack declaration | **Closed** | This document — declared 2026-04-16 |
| O-001 | Auth provider | **Closed 2026-04-16** | Clerk confirmed as canonical auth provider |

---

*Tech stack version 1.0 — declared 2026-04-16 by Founder (nodrftsystems)*
*This document is subordinate to `root-contract.md`. Stack constraints may not weaken root contract rules.*
