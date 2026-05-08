# Evidence Ledger — PharmacyOS
Classification: Internal — NoDrftSystems Proprietary
Product: PharmacyOS — NoDrftSystems proprietary platform (Winchester Global Pharmacy is first licensed deployment)
Created: 2026-05-07
Last update: 2026-05-08
Protocol: mandatory-build-activation-protocol-2026-04-26.md

---

## Purpose

This ledger records every piece of verification evidence produced during the PharmacyOS build. No artifact advances to Gate 5 without its corresponding evidence entry logged here.

---

## Evidence Log

| Date | Gate | Evidence Type | Result | Produced by | Notes |
|---|---|---|---|---|---|
| 2026-05-07 | Gate 0 | Build Activation Packet | Created | PMA / Codex | Initial packet |
| 2026-05-07 | Gate 0A | Agent Assessment & Routing | Documented in BAP | MOA / PMA | 6 capability gaps identified |
| 2026-05-07 | Gate 1A | SAA Architecture Record | PRODUCED — STATUS: PROPOSED | SAA (Samara) | React 19 + Vite + Tailwind v4 + shadcn/ui + Supabase + Edge Functions. See [architecture-decision-record.md](architecture-decision-record.md). Note: Vite scaffold default is React 19 (ADR text says React 18); minor drift documented. |
| 2026-05-08 | Governance | Decision Log entry DL-001 | LOGGED | Founder + this workspace | PharmacyOS reclassified from client-owned to NoDrftSystems proprietary product. See [decision-log.md](decision-log.md). |
| 2026-05-08 | Governance | MSA amendment scope brief | DRAFTED — pending CDA + LCA + counsel | this workspace | See [msa-amendment-brief.md](msa-amendment-brief.md). Blocking artifact for any further Winchester commercial commitment. |
| 2026-05-08 | Governance | New SOW restructure brief | DRAFTED — pending PEA + Founder pricing + LCA | this workspace | See [sow-restructure-brief.md](sow-restructure-brief.md). Cannot transmit to Winchester before amended MSA is signed. |
| 2026-05-08 | Gate 2 | Supabase folder scaffold | CREATED | this workspace | `supabase/` directory with config.toml, migrations/, functions/, seed.sql, .env.example, README.md. CLI install pending on Founder machine. |
| 2026-05-08 | Gate 2 | App Vite scaffold | CREATED | this workspace | React 19 + TS strict + Tailwind v4 + Supabase JS + TanStack Query + React Router + Zustand + Phosphor Icons. Path alias `@/` configured. |
| 2026-05-08 | Gate 4 | TypeScript check | PASS | this workspace | `tsc -b` returns 0 errors against scaffolded app |
| 2026-05-08 | Gate 4 | Production build | PASS | this workspace | `vite build` 778ms, bundle 215.90 kB / 67.41 kB gzipped against scaffolded app |
| — | Gate 1A | DSS Schema Approval | PENDING | DSS | 15+ tables; RLS; migrations |
| — | Gate 2 | SCA Auth + JDPA Review | PENDING | SCA (Omari) | Required before any patient data schema finalized |
| — | Gate 2 | legal-compliance skill run | PENDING | LCA (Dorothy) | JDPA consent flow + Jamaica Data Protection Act 2020 |
| — | Gate 4 | Test suite | PENDING | TVA (Leandra) | Coverage target TBD; no tests yet |
| — | Gate 4 | WCAG 2.1 AA audit | PENDING | AAA (Rochelle) | All 43 screens; automated + manual |
| — | Gate 4 | SCA security review | PENDING | SCA (Omari) | Auth, RLS, PII, Lynk, AI upload |
| — | Gate 4 | Claude Vision integration test | PENDING | IDS / TVA | Extraction accuracy, confidence scoring, error handling |
| — | Gate 4 | Lynk payment integration test | PENDING | IDS / TVA | Awaiting client API credentials |
| — | Gate 4 | Schedule drug log format approval | PENDING | Client pharmacist | Required before logging UI is built |
| — | Gate 5 | QAS independent review | PENDING | QAS (Imani) | Scope, evidence, drift check |
| — | Gate 6 | ARE technical review | PENDING | ARE | Required before production deployment |
| — | Gate 6 | Founder authorization | PENDING | Founder | Required before any client access or production deployment |

---

## Prototype Reference Record

| Item | Status | Location |
|---|---|---|
| PharmacyOS Prototype.html | Reference only — not production | prototype/ |
| app.jsx | Reference only — hash-router vanilla React | prototype/ |
| screens-1.jsx | Reference only | prototype/ |
| screens-2.jsx | Reference only | prototype/ |
| screens-3.jsx | Reference only | prototype/ |
| shell.jsx | Reference only | prototype/ |
| icons.jsx | Reference only | prototype/ |
| styles.css | Reference only — design token source | prototype/ |
| Design handoff (Claude Design) | Canonical specification for production build | 00_governance/ |

Prototype is for design validation and stakeholder review only. Production implementation in `app/` follows the design handoff spec, not the prototype code structure.

---

## Open Capability Gaps (Gate 0A) — Updated 2026-05-08

| # | Gap | Owner | Status |
|---|---|---|---|
| G1 | SAA architecture decision | SAA (Samara) | DRAFTED — ADR remains in PROPOSED status. Founder authorized scaffolding work to proceed under the proposed stack on 2026-05-08. **Explicit ADR approval still recommended** to formally close G1. |
| G2 | Supabase project provisioned | PIS + Founder | PARTIALLY CLOSED — `pharmacyos-dev` project provisioned on Free tier per Founder direction "keep Free as long as possible." Pro upgrade deferred until production deployment readiness. |
| G3 | Claude Vision API access confirmed | Founder / Codex | OPEN — needed before Edge Function development of `process-invoice-scan` and `process-rx-scan` |
| G4 | Lynk payment API credentials | Client (Winchester) | OPEN — request must be made through Winchester after the amended MSA signing process begins |
| G5 | JDPA compliance review | SCA + LCA | OPEN — required before patient data schema is finalized by DSS |
| G6 | Schedule drug log format pharmacist sign-off | Client pharmacist | OPEN — required before BLS implements logging logic |
| G7 (NEW) | MSA amendment signed by Winchester | Founder + Winchester + counsel | OPEN — blocking for any further Winchester commercial commitment; non-blocking for internal scaffold/architecture work |
| G8 (NEW) | New SOW signed by Winchester | Founder + Winchester | OPEN — depends on G7; blocking for any further build commitment to Winchester |
| G9 (NEW) | NoDrftSystems product registry entry | PRGA + PMA | OPEN — proprietary product registration |
