# Architectural Decision Record — Peak Equity Optimizer

Key decisions made during initial architecture and why. Intended for buyers, investors, and new engineers.

---

## 1. ORM: Prisma over Drizzle

**Decision:** Prisma 6.x as the database ORM.

**Why:** Prisma's schema-as-source-of-truth model (`prisma/schema.prisma`) generates a fully type-safe client from a single declarative file. For a product with 11 related models, 8 role types, and complex relational queries, the ergonomics of Prisma's generated types prevent an entire class of runtime bugs. Drizzle has a lighter runtime footprint but requires more manual type wiring and lacks Prisma's migration history tooling — important for a product that will iterate the schema over time.

**Tradeoff:** Prisma generates heavier types at build time. Acceptable given deployment to Vercel serverless with Neon's connection pooling.

---

## 2. Database: Neon PostgreSQL over Supabase

**Decision:** Neon serverless PostgreSQL.

**Why:** Neon's branching model (create a database branch per PR) maps well to the development workflow. The serverless connection pooler (`@neondatabase/serverless`) handles cold-start latency on Vercel edge functions better than a persistent Supabase connection under low traffic. Neon also avoids bundling auth, storage, and realtime into the database tier — those concerns are handled by Clerk (auth) and Cloudflare R2 (uploads), keeping each layer replaceable.

**Tradeoff:** Supabase Row Level Security (RLS) is more opinionated and batteries-included. PEO handles authorization at the application layer via RBAC in `src/lib/auth/rbac.ts` instead.

---

## 3. Auth: Clerk over NextAuth / Auth.js

**Decision:** Clerk (`@clerk/nextjs`) for authentication and session management.

**Why:** Clerk provides hosted sign-up/sign-in UI with OAuth (Google, Apple), magic links, MFA, and bot protection out of the box — features that would take significant time to build and maintain with NextAuth. The Clerk SDK integrates directly with Next.js App Router middleware via `clerkMiddleware()`, and its `auth()` server helper makes getting the current user in Server Components a one-liner. For a product targeting non-technical real estate sellers and investors, the polished hosted auth UI reduces drop-off at signup.

**Tradeoff:** Clerk charges per monthly active user at scale. Switching cost is moderate — auth is abstracted through `src/lib/auth/session.ts`, so swapping the underlying provider means updating that file and the Clerk-specific middleware, not every route.

---

## 4. Analytics: PostHog over Mixpanel

**Decision:** PostHog for product analytics and funnel tracking.

**Why:** PostHog is open-source and self-hostable, making it defensible if pricing changes. The PostHog React SDK (`posthog-js/react`) integrates cleanly with Next.js App Router — the `PosthogProvider` wraps the app in `src/components/PosthogProvider.tsx` with manual pageview capture (important for SPA-style navigation). Mixpanel is more mature but priced higher at startup scale and does not offer self-hosting.

**Tradeoff:** PostHog's session recording and feature flag product requires a paid plan. At Tier A/B launch, the free tier covers core funnel analytics.

---

## 5. Formula Exposure Control

**Decision:** All calculation logic lives server-side in `src/lib/formulas/`. No formula details are exposed to the client.

**Why:** The formula engine (seller net, investor MAO, BRRRR, DSCR, confidence scoring, kill switches) is the core defensible IP. Exposing it in client JavaScript would let any user read the methodology by opening DevTools. Every formula invocation goes through an API route (`/api/estimator`, `/api/investor/analysis`, `/api/triage/run`), and the server returns computed outputs only — not the formula parameters or constants.

**Tradeoff:** Adds a round-trip for every calculation. Acceptable because calculations are fast (<10ms) and the security boundary is worth the latency.

---

## 6. 8-Tier RBAC Design

**Decision:** Eight explicit user roles with a numeric hierarchy, defined in `src/lib/auth/rbac.ts`.

```
anonymous_visitor (0) → free_user (1) → seller (2)
→ investor_core (3) → investor_elite (4) → vendor (5) → admin_internal (10)
```

**Why:** Real estate platforms have genuinely different user contexts — a seller in triage, a verified investor running BRRRR analysis, and a vendor browsing leads are not the same user type with different permissions. Distinct roles make authorization logic readable (`requireRole(session.role, INVESTOR_ROLES)`) and make future tier gating (Stripe subscription → role upgrade) a mechanical mapping rather than a permission matrix.

**Tradeoff:** More roles than a typical SaaS app. The enum is exhaustive at launch — roles map directly to the four paid tiers plus anonymous access and admin.

---

## 7. Input Validation: Zod on Every API Boundary

**Decision:** Zod schema validation on all API route inputs, no exceptions.

**Why:** TypeScript types are erased at runtime. Every API route in `src/app/api/` parses the request body through a `z.object(...)` schema before the body touches any business logic. This prevents type confusion bugs, injection via coerced types, and unexpected `NaN` propagation in financial calculations where `$0.00` vs `undefined` vs `NaN` have different downstream effects. The Zod `safeParse` pattern also standardizes error responses — validation failures always return `{ error: "Invalid input", issues: [...] }`.

**Tradeoff:** Schemas must be kept in sync with the UI forms. The schema is the contract — any form change that breaks the API schema will be caught immediately rather than silently producing bad output.

---

## 8. PII Linting Layer

**Decision:** All event payloads (analytics, audit logs) pass through `lintEventPayload()` in `src/lib/events/pii-lint.ts` before being written or fired.

**Why:** Real estate applications handle addresses, financial figures, and seller personal information. A misconfigured analytics call could accidentally log a seller's home address or mortgage balance to PostHog. The linter scans for prohibited keys (address, email, phone, SSN pattern) and blocks the call if any are present. This is belt-and-suspenders alongside Zod validation — Zod validates structure, the linter validates intent.

**Tradeoff:** Any new analytics event must avoid the prohibited key list or explicitly use `sanitizeEventPayload()` to redact before logging. Minor developer friction in exchange for a hard guarantee on PII hygiene.
