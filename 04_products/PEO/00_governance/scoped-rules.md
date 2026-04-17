---
document: PEO Scoped Rules
status: Active governance
version: 1.0
date: 2026-04-16
owner: PMA + SAA
authority: Build Context Engineering Standard — `01_system/ai-governance/build-context-engineering-standard-2026-04-15.md`
parent: root-contract.md (scoped rules may not weaken the root contract)
confidentiality: Proprietary internal — no external publishing approved
---

# PEO Scoped Rules
## Context-Specific Build Rules — Product, Module, and Compliance Scope

Scoped rules narrow the build context for PEO-specific decisions. They operate within the root contract and may not weaken any root contract rule.

---

## 1. Product Identity

**Product name:** Peak Equity Optimizer (PEO)
**Product type:** Internal NoDrftSystems product
**Repo location:** `04_products/PEO/`
**Primary source documents:** `C:\Users\nkwtr\Downloads\PEOSYS` (24 files)
**Build phases:** 6 (defined in `Peak_Equity_Optimizer_Blueprint_Rewrite_2026.pdf`)

### Confirmed Third-Party Providers

| Provider | Purpose | Confirmed | Notes |
|----------|---------|-----------|-------|
| Clerk | Auth / SSO / MFA / RBAC | 2026-04-16 | `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` |
| Rentcast | Property data API (facts, comps, AVM) — Layers A–C | 2026-04-16 | `RENTCAST_API_KEY` — server-side only, never client-exposed |
| Neon | PostgreSQL (serverless) | 2026-04-16 | `DATABASE_URL` |
| Vercel | Cloud / deployment | 2026-04-16 | Hosting + env vars |
| Cloudflare R2 | File storage (signed URLs) | 2026-04-16 | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` |
| PostHog | Analytics / event capture | 2026-04-16 | `NEXT_PUBLIC_POSTHOG_KEY` |
| Resend | Transactional email | 2026-04-16 | `RESEND_API_KEY` |

---

## 2. Roles and Access Model

| Role Code | Name | Access Level |
|-----------|------|-------------|
| anonymous_visitor | Unregistered visitor | Public pages only |
| free_user | Registered free account | Free estimator |
| seller_applicant | Seller application in progress | Seller app (in-progress) |
| seller_verified | Verified seller | Seller app (full) |
| investor_basic | Investor Basic subscriber | Investor Basic dashboard |
| investor_advanced | Investor Advanced subscriber | Investor Advanced dashboard |
| vendor | Verified marketplace vendor | Vendor profile + lead management |
| admin_internal | NoDrftSystems admin | Full internal access + admin panel |

RBAC is enforced at the API layer for every endpoint. Field-level filtering applies per the Formula Exposure Matrix.

---

## 3. Formula Scoping Rules

### Default values (apply when user has not provided input)

| Field | Default | Acceptable Range | Applies To |
|-------|---------|-----------------|-----------|
| hold_months | 6 | 3–12 | All routes |
| purchase_closing_rate | 2% | 1.5%–3% | All routes |
| disposition_cost_rate | 9% | 8%–10% | All routes |
| annual_interest_rate | 12% | 10%–15% | All routes |
| points_rate | 2% | 1%–4% | All routes |
| target_profit_rate | 15% | — | All routes |
| min_profit_floor | $30,000 | — | All routes |
| seller_sale_cost_rate | 8% | 7%–10% | Seller route |
| contractor_OH_and_P | 20% | — | Paid routes |
| refi_LTV | 70% | 65%–75% | Investor Advanced |
| unknown_interior_contingency | 20% on interior items | — | All routes |
| missing_roof_reserve | $8,000–$15,000 (range) | — | All routes |

### Free tier formula scope (Phase 2)
- Layers E + F only: cost calculations and offer/return calculations using manual user inputs
- No Layer A (fact), B (comp evidence), C (valuation), D (repair) automation
- All outputs labeled: "user-input driven / not comp-verified / not based on live facts"
- BRRRR preview included at free tier

### Paid Seller formula scope (Phase 3)
- Layers A–C: auto facts, comp evidence, valuation (range only — no Canonical MAO exposed)
- Layer D: condition class + repair summary (no line-item breakdown)
- Layer E: costs exposed
- Layer F: proceeds and path comparison only — MAO is N (hidden)
- Layer G: market risk and rehab risk at summary level — no PASS trigger exposed

### Paid Investor Basic formula scope (Phase 4)
- All layers A–G at Basic exposure level per Formula Exposure Matrix
- VERIFIED ARV = median of qualified sold comps (fully exposed)
- MARKET ARV = median of active listings (reference label required — not underwriting input)
- Confidence score fully displayed with tier indicator
- All 9 review triggers active
- Kill-switch library active (7 PASS conditions)
- Comp detail limited (no comp controls, no comp score detail)

### Paid Investor Advanced formula scope (Phase 5)
- All layers A–G at Advanced exposure level
- Comp controls + comp quality score exposed
- Line-item rehab budgeting (Layer D full)
- Regional multiplier (Layer D)
- Multi-structure financing (Layer E full)
- DSCR / refi proceeds formulas
- Scenario planner (base / upside / downside delta)
- Wholesale spreads
- Cash-on-cash
- Advanced appendices and exports

---

## 4. Comp Logic Scoping Rules

### Quality scoring weights (binding)
| Factor | Weight |
|--------|--------|
| Geographic Proximity | 30% |
| Recency | 25% |
| GLA Similarity | 20% |
| Physical Match (bed/bath/age) | 15% |
| Condition Match | 10% |

### Comp support minimums
| Scenario | Minimum Sold Comps | Action if Insufficient |
|----------|--------------------|----------------------|
| Standard | 3 | Expand radius; disclose |
| Rural / limited market | 2 | Expand radius; flag limited |
| High-confidence | 5+ | Flag if fewer |

### Search cascade
1. Same community / subdivision (highest priority)
2. 0.5-mile radius
3. 1.0-mile radius
4. Broader — must flag and disclose expansion reason

---

## 5. Confidence Scoring Rules

### Dimension weights and scoring (binding — implement exactly)

**Data Confidence**
- Primary source, no conflicts: +20
- No material conflicts: +20
- Data < 30 days old: +15
- Secondary source: +10
- Material conflicts resolved: +5
- Estimated field: −15
- Stale data (> 90 days): −10

**Comp Confidence**
- 5+ qualified sold comps: +25
- 3–4 qualified sold comps: +15
- Same subdivision comps: +15
- 0.5-mile radius achieved: +10
- Comp quality score > 70: +10
- Radius expanded ≥ 1.0 mi: −10
- Only 2 qualified comps: −15
- Time adjustment required: −10

**Valuation Confidence**
- Tight value range (< 10%): +20
- Strong comp support: +15
- Recent market activity: +10
- Wide value range (> 20%): −15
- Limited market activity: −10

**Model Confidence**
- All formulas executed: +15
- Defaults not triggered: +10
- No override events: +10
- Key assumptions user-confirmed: +5
- Multiple defaults triggered: −15
- Significant user overrides: −10

### Confidence tiers
| Tier | Score Range | Display Color | Default Action |
|------|-------------|-------------|--------------|
| HIGH | 80–100 | Green | Proceed normally |
| MEDIUM | 60–79 | Yellow | Standard monitoring |
| LOW | 40–59 | Orange | Review recommended |
| VERY LOW | 0–39 | Red | Review required |

### Automatic review triggers (all 9 required)
| Trigger | Condition | Queue |
|---------|-----------|-------|
| Standard Review | Overall confidence < 60 | Standard (24h) |
| Data Quality Review | Data confidence < 50 | Standard (24h) |
| Comp Expansion Review | Comp support < 3 qualified | Standard (24h) |
| Geographic Review | Radius expanded > 1.0 mi | Standard (24h) |
| Conflict Resolution | Material conflicts unresolved | Standard (24h) |
| Data Source Review | Estimated fields > 3 core | Standard (24h) |
| Override Validation | User override > 10% value | Standard (24h) |
| Methodology Review | Time adjustment required | Standard (24h) |
| Priority Review | Confidence < 40 | Priority (4h) |
| Expert Review | Escalated triggers (see standard) | Expert (1 business day) |

---

## 6. Kill-Switch Library (PASS triggers — all 7 required)

The analysis result is automatically set to PASS (do not proceed) when any of the following conditions are true:

| Condition |
|-----------|
| Address cannot be geocoded |
| Zero usable comps after full cascade |
| Property type irreconcilable across sources |
| Expected profit < $10,000 |
| ROI < 5% |
| Stress case breaks the deal (stress profit < required profit floor) |
| Data confidence < 20% |

PASS trigger logic is hidden from all routes except Admin (per Formula Exposure Matrix). The output for non-admin users shows that the analysis cannot proceed, with a disclosure explaining the limitation — not the specific trigger condition.

---

## 7. Event Instrumentation Scoping Rules

### Prohibited fields in all event payloads
- Full property address
- Full name
- Email address
- Phone number
- SSN or government ID
- Account numbers
- Unredacted free-text from uploads

### Required event properties (all events)
```
event_name       string  — canonical event name
event_id         uuid    — unique per event instance
timestamp        ISO8601
user_id          uuid | null  — null for anonymous
session_id       uuid
route            string  — which PEO route
language         string  — en-US or es-US
source           string  — web | app | server
properties       object  — PII-safe payload
```

### Core events (minimum required implementation)
**Acquisition:** page_view, cta_click, lead_submit
**Estimator:** estimator_started, estimator_step_completed (toggle_changed for PEO), estimator_completed, estimator_saved, estimator_upsell_clicked
**Seller:** seller_app_started, seller_app_submitted, seller_app_status_changed, seller_app_abandoned
**Investor:** investor_basic_signup, investor_advanced_activated, deal_view_basic, deal_view_advanced, upgrade_prompt_shown, upgrade_clicked
**Trust:** trust_center_view, methodology_section_expand
**Marketplace:** vendor_profile_view, vendor_lead_submitted
**System:** api_error, triage_started, triage_completed, triage_failed, confidence_review_triggered, kill_switch_triggered (no address in payload)

---

## 8. Design System Scoping Rules

### Color tokens (binding)
| Token | Hex | Usage |
|-------|-----|-------|
| color-primary | #1E3A5F | Deep navy — primary brand |
| color-secondary | #4A6FA5 | Slate blue — secondary |
| color-success | #27AE60 | Equity green — positive signals |
| color-error | #C0392B | Caution red — alerts, errors |

No other primary palette colors may be introduced without design system governance approval.

### Typography scale
| Level | Size | Weight |
|-------|------|--------|
| H1 | 32px | Bold |
| H2 | 26px | Bold |
| Body | 16px | Regular |
| Small | 14px | Regular |

### Accessibility floor
- WCAG 2.1 AA — all routes
- Color contrast minimum 4.5:1 for body text
- Keyboard navigation required for all interactive flows
- Screen reader labels required for all form fields and data visualizations

### Bilingual layout rules
- Spanish strings expand — UI components must use flexible widths
- No truncation on critical labels
- Multi-line allowances in cards, buttons (within defined height constraints)
- RTL support: not required for v1

---

## 9. Data Model Scoping Rules

### Canonical entities (Phase 3 schema baseline)
User, Session, ConsentRecord, EstimatorSession, EstimatorResult, SellerApplication (= deal record), UploadArtifact, TriageResult, ReadinessPlan, ReadinessItem, InvestorProfile, Vendor, VendorLead, Review, AuditLog

**No separate Deal entity.** SellerApplication is the deal record.

### Versioning requirements
- Triage engine: versioned — every TriageResult records engine_version
- Formula calculations: versioned — EstimatorResult and TriageResult record formula_version
- Readiness item taxonomy: versioned — ReadinessPlan records taxonomy_version
- API: URL versioning at /api/v1/

### Audit log requirements
All of the following must write an AuditLog entry:
- Any export or download
- Any triage or readiness view by an investor
- Any admin action
- Any formula override event
- Any kill-switch trigger
- Any confidence review trigger
- Any role change

---

## 10. Tech Stack

**Canonical stack declared 2026-04-16. Full declaration: `04_products/PEO/00_governance/tech-stack.md`**

| Layer | Technology |
|-------|-----------|
| Language | TypeScript 5.x |
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS 4.x + shadcn/ui (Radix) |
| Database | PostgreSQL — Neon (serverless) |
| ORM | Prisma 6.x |
| Auth | Clerk (pending Founder confirmation — O-001) |
| Cloud / Deploy | Vercel |
| File Storage | Cloudflare R2 (signed URLs) |
| i18n | next-intl 4.x |
| Analytics | PostHog |
| Email | Resend + React Email |
| Testing | Vitest + Playwright + Testing Library |
| Validation | Zod 4.x |
| Package Manager | pnpm 10.x |

---

## 11. Open Items (standing — must not be silently assumed)

| ID | Item | Status | Blocking |
|----|------|--------|---------|
| O-001 | Auth provider / SSO / MFA vendor | **Closed 2026-04-16** — Clerk confirmed | ~~Phase 3~~ — unblocked |
| O-002 | Final legal text (T&C, privacy, disclosures) | Open | Phase 2 release |
| O-003 | Professional translation vendor/process | Open | Any UI release |
| O-004 | Tech stack declaration (language, framework, cloud) | **Closed 2026-04-16** | ~~Phase 2~~ — unblocked |
| O-005 | Upload malware scanning vendor/capability | Open | Phase 3 |
| O-006 | Pricing / tier amounts | **Closed 2026-04-16** — see `pricing-declaration.md` | ~~Any pricing-linked UI~~ — unblocked |

Any agent that encounters an open item must escalate to PMA. No silent assumptions. No invented values. See `open-items-tracker.md` for the current register, selection criteria, and stub rules.

---

*Scoped rules version 1.2 — updated 2026-04-16 (O-001, O-004, and O-006 closed; tech stack and pricing declared)*
*These rules are subordinate to `root-contract.md` and may not weaken it.*
