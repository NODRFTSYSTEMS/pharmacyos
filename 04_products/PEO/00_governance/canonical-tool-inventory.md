---
document: PEO Canonical Tool Inventory
status: Active governance
version: 1.0
date: 2026-04-16
owner: TACA + PMA
authority: `01_system/ai-governance/build-control-assets/05-canonical-tool-inventory-template.md`
confidentiality: Proprietary internal — no external publishing approved
---

# Canonical Tool Inventory

| Tool or Service | Owner | Status | Approved Use Case | Client Profile or Scope | Repository or Surface | Access Scope | Write or Deploy Power | Credential Rule | Data Exposure Risk | Fallback Path | Last Review Date | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PowerShell local shell | `TACA` | Active | Repo inspection, governed doc edits, local build/test commands | Internal product — PEO | `04_products/PEO/` | Local workspace only | Local file write; no production deploy by itself | No secrets in commands; use env vars only | Medium | Stop and escalate if a command requires credentials or unrestricted network | 2026-04-16 | Primary execution surface for governed local work |
| pnpm + Next.js toolchain | `PMA + BLS + FIS` | Active | Dev, build, lint, app runtime verification | PEO app | `peo-app/` | App workspace | Local build/write | Secrets via `.env.local` or platform env vars only | Medium | `next build` / `pnpm lint` evidence and rollback to prior commit/state | 2026-04-16 | Declared in `tech-stack.md` |
| Prisma + Neon PostgreSQL | `DSS + PIS` | Active | Schema management, DB access, migrations, data reads/writes | PEO app backend | `prisma/`, API routes | Database schema and data | High | `DATABASE_URL` only; never hardcoded | High | Stop on schema drift; rollback via migration discipline | 2026-04-16 | Add DSS if schema changes land in Phase 6 |
| Clerk | `SCA + IDS + PIS` | Active | Auth, sessions, role gating, admin protection | PEO identity/rbac | Middleware, auth helpers, protected routes | Auth/session layer | High | Clerk keys in env vars only | High | Fail closed on auth errors | 2026-04-16 | Protects vendor/admin routes in `src/middleware.ts` |
| Vercel | `PIS + DRA` | Active | Preview and production deployment target | Phase 6 deployment surface | App build and runtime | Deploy, env vars, runtime config | High | Vercel env vars only; no secrets in repo | High | Stop on env mismatch; retain rollback reference before release | 2026-04-16 | Class 4 material surface |
| Cloudflare R2 | `IDS + PIS + SCA` | Active | Signed upload/download storage | Upload and artifact surfaces | API upload/download flow | Object storage | High | R2 credentials in env vars only | High | Stub or disable uploads until O-005 closes | 2026-04-16 | Public direct URLs prohibited by root contract |
| PostHog | `SCA + BLS` | Active | PII-safe analytics/event capture | Event instrumentation | Server/client event helpers | Event write | Medium | Public key limited to approved scope; no PII | High | Disable new events if linting fails | 2026-04-16 | Must follow scoped event taxonomy |
| Resend | `BLS + IDS + PIS` | Active | Transactional email | Notification surfaces | API routes / email templates | External email send | Medium | API key in env vars only | Medium | Disable email side effects until verified | 2026-04-16 | Phase 6 only if vendor/admin notifications are activated |
| Vitest + Testing Library | `TVA` | Active | Unit/integration verification | PEO test suite | `tests/unit`, `tests/integration` | Local test execution | Local write to coverage/temp only | No secrets in fixtures | Low | Block advancement if required tests absent | 2026-04-16 | Current repo lacks vendor/admin tests |
| Playwright | `TVA + DRA` | Active | E2E verification for critical flows | Phase 6 verification | `tests/e2e` | Local/browser automation | Local write to artifacts | No production credentials in scripts | Medium | Manual review if E2E automation is absent | 2026-04-16 | Required for vendor/admin/deployment smoke paths |
