# Pricing Governance

**Classification:** Internal - Confidential - Proprietary
**Status:** Canonical operative pricing - Founder approved 2026-04-18; amended 2026-04-20
**Last updated:** 2026-04-20
**Owner:** Founder
**STOP-001 resolution:** This document is hereby designated the single operative pricing source. All prior conflicting pricing documents (Business Plan v2, Business Foundation, Pricing Summary Sheet) are reference material only and must not be used for quoting. This closes STOP-001.

> No proposal, SOW, invoice, pricing page, or retainer agreement may use prices not listed here without explicit Founder approval and a Decision Log entry.

---

## Package Architecture - Operative Tiers

### T0 - Discovery Sprint

**Purpose:** Scope definition, feasibility, and package-path recommendation. No build output.
**Price:** $2,000 flat
**Credit:** Full $2,000 credited toward next contracted package if signed within 30 days of Discovery delivery.
**Deliverables:** Problem statement, target user definition, solution concept, scope recommendation (package path), risk flags, Go/No-Go recommendation.
**Exclusions:** Design files, code, final copy, pricing commitments beyond the Discovery fee.
**Payment:** 100% upon signing. No milestones.
**Discovery Sprint required before:** T4, T5, and any engagement where scope is ambiguous.

---

### T1 - Conversion Landing Page Sprint

**Purpose:** Single-page conversion-focused website. No CMS.
**Price:** $2,500
**Delivery:** 10 business days from confirmed start (all client inputs received)
**Included:**
- Up to 8 sections
- 1 CTA form (lead capture or contact)
- Mobile-responsive
- Basic on-page SEO (meta title, description, headings)
- Vercel deployment
- 14-day post-launch defect support window
**Excluded:** Copywriting, photography, CMS, hosting retainer, post-launch features
**Revision rounds:** 2 rounds of revisions included
**Payment:** 50% deposit on signing / 50% on delivery

---

### T1S - Static Business Site

**Purpose:** Up to 5-page brochure-style website. No CMS. Stable-content business presence.
**Price:** $3,500
**Delivery:** 10-12 business days from confirmed start
**Included:**
- Up to 5 pages
- No-CMS implementation
- Mobile-responsive
- Contact form
- Basic on-page SEO
- Vercel deployment
- 14-day post-launch defect support window
**Excluded:** Copywriting, photography, CMS, blog/editorial setup, advanced analytics, hosting retainer, post-launch features
**Revision rounds:** 2 rounds of revisions included
**Payment:** 50% deposit on signing / 50% on delivery

---

### T2 - Business Launch Site

**Purpose:** Up to 5-page website with CMS. Core online presence.
**Price:** $5,500
**Delivery:** 15 business days from confirmed start
**Included:**
- Up to 5 pages
- Headless CMS (Sanity or equivalent)
- Mobile-responsive
- Contact form + 1 additional form type
- Basic on-page SEO
- Google Analytics 4 setup
- Vercel deployment
- 30-day post-launch defect support window
**Excluded:** Copywriting, photography, blog setup (add-on), hosting retainer, post-launch features
**Revision rounds:** 2 rounds per deliverable
**Payment:** 50% deposit / 25% design approval / 25% delivery

---

### T3 - Authority Website

**Purpose:** Up to 15-page website with advanced CMS, blog, and analytics.
**Price:** $12,000
**Delivery:** 25 business days from confirmed start
**Included:**
- Up to 15 pages
- Advanced headless CMS with blog/editorial section
- Up to 3 form types (contact, lead capture, inquiry routing)
- Google Analytics 4 + event tracking
- WCAG 2.1 AA accessibility compliance
- Mobile-responsive
- Vercel deployment
- 30-day post-launch defect support window
**Excluded:** Copywriting, photography, SEO content strategy (add-on), hosting retainer, post-launch features
**Requires:** Discovery Sprint OR detailed approved brief from client
**Revision rounds:** 2 rounds per major deliverable
**Payment:** 40% deposit / 30% design approval / 30% delivery

---

### T4 - Platform Starter

**Purpose:** Web application with defined integrations. Requires Discovery Sprint first.
**Price:** $25,000
**Delivery:** 35-45 business days from confirmed start (after Discovery Sprint)
**Included:**
- Web application (authenticated or public)
- Up to 3 third-party integrations
- Database schema and API design
- Mobile-responsive UI
- Basic admin panel
- Security review
- WCAG 2.1 AA (key surfaces)
- Vercel + Supabase deployment
- 45-day post-launch defect support window
**Excluded:** Copywriting, advanced analytics, multiple payment processors, bilingual content
**Requires:** Discovery Sprint (T0) completed and signed
**Revision rounds:** 2 rounds per major module
**Payment:** 40% deposit / 30% milestone (first working module) / 30% delivery

---

### T5 - Ecosystem Build

**Purpose:** Multi-surface platform. Discovery Sprint + architecture review required.
**Price:** $50,000 base (scoped individually after Discovery)
**Delivery:** Scoped per Discovery Sprint output - minimum 60 business days
**Included:**
- Multi-surface build (web + mobile-responsive + admin)
- Full API architecture
- Auth, database, integrations per Discovery scope
- Security review and penetration testing scope
- WCAG 2.1 AA
- SBOM, CVE review, deployment runbook
- 60-day post-launch defect support window
**Excluded:** Ongoing product management, post-launch feature roadmap, hosting retainer
**Requires:** Discovery Sprint (T0) + architecture review by ARE/Founder
**Payment:** 30% deposit / 25% architecture approval / 25% first release candidate / 20% final delivery

---

## Add-Ons (Applies to Any Tier)

| Add-On | Price | Notes |
|--------|-------|-------|
| Copywriting - T1 | $750 | Up to 8 sections |
| Copywriting - T2 | $1,500 | Up to 5 pages |
| Copywriting - T3 | $2,500 | Up to 15 pages |
| Bilingual (EN/ES) - any tier | +25% of base price | Transcreation, not translation; TCA review required |
| Blog setup and migration | $1,000 | Add to T2; included in T3 |
| E-commerce integration | $2,500 | Single payment provider; product catalog up to 50 SKUs |
| SEO content strategy | $1,000 | Keyword research + 3 pillar pages outlined; not copywriting |
| Analytics deep-dive setup | $500 | GA4 + event schema + dashboard |
| Rush delivery | +30% of base price | Delivery in less than 50% of standard timeline; subject to availability |
| Extended support window | $500/month | Per month beyond included window; max 3 months |

---

## Maintenance Retainers

Maintenance retainers are separate from build pricing. They are never bundled into a build package.

| Tier | Hours/Month | SLA | Monthly Price | Best For |
|------|-------------|-----|---------------|----------|
| Starter | 5 hours | Standard (48hr response) | $500/month | Small static sites; occasional updates |
| Standard | 12 hours | Priority (24hr response) | $1,200/month | Active sites; regular content updates; CMS |
| Premium | 25 hours | Priority + Emergency (4hr) | $2,500/month | Web apps; business-critical uptime; complex integrations |

**Retainer rules:**
- Hours do not roll over month to month.
- Overages billed at $150/hour (Standard SLA) or $200/hour (Priority SLA) with Founder approval.
- Minimum 3-month commitment for Standard and Premium.
- Retainer SOW required; governed by MSA.
- Includes: `npm audit`, CVE scan, SBOM update, deployment verification each month.

---

## Routine Usage (Recurring Agent Executions)

> **STOP:** Figures in this section are placeholders. This section is not operative for billing until the Founder confirms the included-run quota and per-run overage rate. See `01_system/operations/routine-usage-policy.md` for full policy rules.

Routine usage applies to maintenance retainer clients whose engagements include scheduled or recurring agent executions (health checks, drift detection, status reports, utilization pulls). Routines are not project work and not ad hoc requests.

| Allocation | Specification |
|------------|---------------|
| Included routine runs (per rolling 24 hours) | **[FOUNDER DECISION REQUIRED]** |
| Extra Usage (when enabled in SOW) | **[FOUNDER DECISION REQUIRED]** per run above daily quota |
| Extra Usage enablement | Must be explicitly scoped in the SOW - not auto-enabled |
| Overage tracking | ARCA tracks charges per billing cycle; Founder reviews before invoicing |

**Routine pricing rules:**
- Included quota applies per client per rolling 24-hour window.
- A "run" = one bounded agent activation against one defined target producing one bounded output.
- Clients without Extra Usage enabled must be notified before overage runs are executed.
- Any change to routine pricing requires a Founder decision and a pricing-governance update before the new rate is applied.

---

## Hourly and Advisory Rates

| Type | Rate | Notes |
|------|------|-------|
| Development (hourly, outside retainer) | $150/hour | Requires Change Order |
| Strategy and advisory | $200/hour | Minimum 2-hour engagement |
| Emergency response (outside retainer) | $300/hour | 4hr SLA; minimum 2-hour billing |
| Training and handoff sessions | $150/hour | Maximum 4 hours per engagement |

---

## Regional Pricing (Colombia and Jamaica Markets)

Regional pricing exists as calibration reference. Before quoting in a regional market:
1. Confirm with Founder whether the regional edition is active for that engagement.
2. Reference `90_source-documents/commercial/NoDrftSystems_Pricing_Colombia_2026.md` or `_Jamaica_2026.md` for calibration context.
3. Do not use regional pricing as a public baseline without Founder authorization.

---

## Pricing Control Rules

1. **No price may be used that is not in this document** without a Founder-authorized exception logged via `/decision_log`.
2. **No discount may be offered** without explicit Founder approval. There is no standard discount. Every reduction requires a Decision Log entry.
3. **Discovery Sprint fee ($2,000) is non-negotiable.** The credit toward next package is the only accommodation available.
4. **Pricing exceptions for non-profit, hardship, or partnership engagements** require Founder decision before any pricing communication occurs.
5. **Retainer overages** require Founder approval before billing.
6. **Rush surcharge (+30%)** is applied at account-lead discretion and confirmed in writing before scope begins.

---

## Mandatory Pricing Review Flow

Before any commercial artifact (proposal, SOW, invoice, pricing page) reaches a client:

1. Agent drafts against this document.
2. `reviewer_pricing_safety` verifies all prices trace to this document. Any CONFLICT blocks advancement.
3. IGA (Shanice) confirms payment schedule and invoice logic.
4. Founder approves if total engagement value >$15K or any pricing exception is involved.
5. DocuSign executed - no binding agreement outside DocuSign.

---

## Acceptance Criteria

Pricing governance is operational when all conditions are true:

- [x] One package architecture is designated operative - **this document**
- [x] All public offers have Founder sign-off - **approved 2026-04-20**
- [x] Regional pricing status confirmed 2026-04-18 - Colombia and Jamaica editions are **internal competitive calibration references only**. They are not public-facing offers. Founder must verbally confirm per engagement before any regional adjustment is applied. See `90_source-documents/commercial/NoDrftSystems_Pricing_Colombia_2026.md` and `_Jamaica_2026.md`.
- [x] Proposal template and SOW template point to this document
- [x] Intake routing uses this package ladder
- [x] STOP-001 closed - single pricing source designated
