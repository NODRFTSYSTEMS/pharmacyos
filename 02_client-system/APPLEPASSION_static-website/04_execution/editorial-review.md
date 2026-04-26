# Editorial & Content Review — Apple Passion Hardware & Construction

**Review Cycle:** Sweep 2 — Comprehensive Current-State Assessment
**Reviewer:** PLA (Simone) — Plain Language Agent / CEA Content Cell
**QA Pass:** Pass 2 — Content and Copy Review
**Date:** 2026-04-25
**Scope:** All 5 HTML pages: index.html, supplies.html, construction.html, equipment-rental.html, contact.html
**Governance:** CLAUDE.md active · plan_mode.md enforced · reviewer_plain_language.md loaded
**Standard:** NoDrftSystems Copy System — Direct, Plain, Local, Practical, Confident, Phone-First

---

## Startup Declaration

- **Governance files loaded:** CLAUDE.md, plan_mode.md, github_disclosure_gate.md, handover_protocol.md
- **Active agents:** PLA (editorial), QDA (documentation), QAS (gate authority)
- **Phase:** QA Pass 2 — Content and Copy Review within the active build cell
- **Review type:** Editorial / content sweep — not a code build — Build Activation code gates (TypeScript, test suites) are not applicable to this pass
- **Artifact trail:** editorial-review.md (this file), HTML build files at `04_execution/build/`
- **Scope source:** Strategy brief (03_strategy/strategy-brief.md), Intake packet (01_intake/), HTML build (04_execution/build/)

---

## Executive Summary

**Overall Grade: A−**

The build is substantially stronger than Sweep 1. All 8 prior critical fixes have been implemented. Brand voice is consistent, phone-first directive is firmly enforced, no unverified claims, no fixed prices, no email-first flow. The site is functionally release-ready at the content level.

What remains are:
- **4 technical content gaps** (missing OG meta on inner pages, missing aria-expanded on mobile menus)
- **3 SEO structural fixes** (heading hierarchy, image filenames, canonical prep)
- **4 content quality improvements** (product descriptions, construction examples, hero sub-headline, CTA button text)
- **1 unresolved deployment-dependent item** (canonical URLs — defer until domain confirmed)

**Sweep 1 items resolved:** 15 of 22
**Items still open:** 7 (carried from Sweep 1)
**New findings:** 4

---

## PART 1 — SWEEP 1 RECONCILIATION

### Resolved — No Further Action Required

| ID | Issue | Status |
|---|---|---|
| CF-001 | Emoji category icons in headings | RESOLVED — no emoji markers in section headings; 📞/💬 in CTAs is intentional and brand-appropriate |
| CF-002 | Passive voice on construction page | RESOLVED — "Discuss supplies and construction together" |
| CF-003 | "Availability may vary" weakens conversion | RESOLVED — "Equipment rentals are arranged by request" |
| CF-004 | WhatsApp messages used abbreviated brand name | RESOLVED — all WhatsApp URLs use full "Apple Passion Hardware & Construction" |
| CF-005 | "Practical building needs" vagueness | RESOLVED — "extensions" used |
| CF-006 | Equipment page redundant phrasing | RESOLVED — "Material handling — moving and loading" |
| CF-007 | "Job-site and construction" redundancy | RESOLVED — "site preparation, grading, and earthworks" |
| RI-001 | Missing client-stated brand qualities | RESOLVED — Why section includes professional, on-time, best rates, local identity |
| RI-002 | Missing audience references | RESOLVED — "masons" and "concrete workers" added to Why section |
| RI-008 | Generic sticky CTA messages | RESOLVED — supplies, construction, equipment pages have contextual sticky messages |
| SEO-003 | No LocalBusiness schema | RESOLVED — JSON-LD schema present on all 5 pages |

### Carried Forward — Still Open

| ID | Issue | Priority | Action Required |
|---|---|---|---|
| CF-008 | Homepage "See Supply Details & Pricing" loop | LOW | Partially improved; see note below |
| RI-003 | Jamaica parish/location references | MEDIUM | Verify delivery coverage with client before adding specifics |
| RI-006 | Product descriptions too functional | MEDIUM | Fix in this cycle — see Section 2 |
| RI-007 | Construction scope examples abstract | MEDIUM | Fix in this cycle — see Section 2 |
| RI-014 | Homepage hero missing sub-headline | MEDIUM | Fix in this cycle — see Section 2 |
| SEO-001 | Heading hierarchy — H2 missing | HIGH | Fix in this cycle — see Section 2 |
| SEO-004 | Canonical URLs missing | DEFER | Pending deployed domain — add post-launch |
| SEO-005 | Image file names generic | LOW | Can fix pre-launch; requires updating all references |

**CF-008 Note:** "View All Supplies" has become "See Supply Details & Pricing" — improved but the underlying loop (homepage shows 6 items → supplies.html shows same 6 items + Delivery) still exists. Decision: leave as-is for launch. The homepage list is a preview, supplies.html adds delivery + individual CTAs. The path is justified.

---

## PART 2 — CURRENT SWEEP FINDINGS

### CRITICAL — Fix Before Release

#### NEW-001: Missing og:title and og:description on Inner Pages
**Files:** construction.html, supplies.html, equipment-rental.html, contact.html
**Issue:** All inner pages have `<meta property="og:image">` but are missing `og:title` and `og:description`. When these pages are shared on WhatsApp, Facebook, iMessage, or any link preview, the page title and description will be blank or pulled from an unpredictable source.
**Impact:** MEDIUM-HIGH — for a phone-first local business, WhatsApp sharing is a primary referral channel. Broken link previews reduce click-through.
**Fix per page:**

construction.html:
```html
<meta property="og:title" content="Construction Builds — Big and Small | Apple Passion Hardware & Construction">
<meta property="og:description" content="Construction builds for smaller and larger projects across Jamaica. Professional, reliable, on time. Based in Rockhall / Waugh Hill. Call or WhatsApp today.">
```

supplies.html:
```html
<meta property="og:title" content="Building Supplies Jamaica | Apple Passion Hardware & Construction">
<meta property="og:description" content="Sand, gravel, cement, rebar, ply, blocks, and building supplies with direct island-wide delivery. Best rates in town. Call or WhatsApp for today's price.">
```

equipment-rental.html:
```html
<meta property="og:title" content="Heavy Equipment Rental Jamaica | Apple Passion Hardware & Construction">
<meta property="og:description" content="Heavy equipment rental for material handling, site prep, and construction across Jamaica. Rockhall / Waugh Hill. Call or WhatsApp to confirm availability.">
```

contact.html:
```html
<meta property="og:title" content="Call or WhatsApp Apple Passion Hardware & Construction | Jamaica">
<meta property="og:description" content="Contact Apple Passion Hardware & Construction for building supplies, construction, equipment rental, and island-wide delivery. Professional, reliable, best rates in town.">
```

---

#### NEW-002: Missing aria-expanded on Mobile Menu Buttons (4 Pages)
**Files:** construction.html, supplies.html, equipment-rental.html, contact.html
**Issue:** index.html has `aria-expanded="false"` on the menu button (correct). All 4 inner pages are missing this attribute. This means screen readers and assistive technologies cannot determine whether the mobile nav is open or closed on inner pages.
**Impact:** ACCESSIBILITY defect — WCAG 2.1 AA failure (4.1.2 Name, Role, Value)
**Fix:** Add `aria-expanded="false"` to each inner page menu button, matching index.html's implementation.

---

#### SEO-001 (Carried): Heading Hierarchy — H2 Missing on 3 Pages
**Files:** supplies.html, construction.html, equipment-rental.html
**Issue:** Pages jump from H1 directly to H3 (service blocks). Missing H2 creates a semantic structure gap that hurts both SEO crawlability and screen reader navigation.

Specific breaks:
- supplies.html: H1 "Hardware & Building Supplies" → next heading is H3 "Sand & Gravel" (no H2 wrapper)
- construction.html: H1 "Construction Builds — Big and Small" → next heading is H3 "Small Builds" (no H2 wrapper)
- equipment-rental.html: H1 "Heavy Equipment Rental" → next heading is H3 "Material Handling" (no H2 wrapper)

**Fix:** Add H2 above service-grid on each page:
- supplies.html: `<h2>Our Supply Categories</h2>`
- construction.html: `<h2>Construction Services</h2>`
- equipment-rental.html: `<h2>Rental Categories</h2>`

---

### RECOMMENDED — Implement This Cycle

#### RI-004 (Carried + New): CTA Button Text on Homepage
**File:** index.html
**Location:** Service grid — Equipment Rental block
**Current:** "Check Rental Availability"
**Issue:** "Check availability" frames the interaction as a query, not an action. Creates friction before the customer even calls.
**Fix:** "Ask About Equipment Rental"

---

#### RI-006 (Carried): Product Descriptions Too Functional
**File:** supplies.html
**Current vs. Recommended:**

| Item | Current | Recommended |
|---|---|---|
| Cement & Blocks | "Cement, concrete blocks, and related masonry materials for homeowners, masons, contractors, and builders." | "Solid concrete blocks, Portland cement, and masonry materials for walls, foundations, and structures." |
| Ply & Plywood | "Ply and plywood for building, formwork, repairs, and general construction use." | "Ply and plywood for formwork, roofing, repairs, and general construction use — call to confirm sheet sizes available." |
| Hardware & Supplies | "General building supplies and hardware essentials for construction, repairs, and job-site needs." | "Nails, fasteners, and job-site essentials — everything your crew needs on-site." |

---

#### RI-007 (Carried): Construction Page — Abstract Scope
**File:** construction.html
**Current "Small Builds":** "Construction support for smaller property projects, repairs, improvements, and extensions."
**Recommended:** "Fencing, extensions, repairs, room additions, and property improvements — handled with care."

**Current "Larger Builds":** "Construction work for larger residential, commercial, or job-site projects. Managed professionally and delivered on schedule."
**Recommended:** "Larger residential structures, commercial shells, and multi-room building projects. Professional, on time, and built right."

---

#### RI-014 (Carried): Homepage Hero Missing Explanatory Sub-Headline
**File:** index.html
**Current:** Sign image → tagline → CTAs
**Issue:** A user landing on mobile who doesn't immediately read the sign image gets no text-based reinforcement of what this business offers. A 5-second-test visitor needs to know immediately: who, what, where.
**Fix:** Add below the tagline:
> "Building supplies, construction, and equipment rental. Island-wide delivery from Rockhall, Jamaica."

---

### LOW PRIORITY / DEFER

#### SEO-004: Canonical URLs
**Status:** DEFER — pending confirmed deployed domain. Add `<link rel="canonical" href="[url]">` post-launch.

#### SEO-005: Image File Names
**Current:** logo.png, sign.png
**Fix:** Rename to descriptive names (`apple-passion-hardware-construction-logo.png`, `apple-passion-hardware-construction-sign-rockhall-jamaica.png`) and update all 15+ references.
**Timing:** Best done before deployment. Can be a final pre-launch task.

#### RI-003: Parish/Location References
**Status:** DEFER — client confirmation needed on actual delivery coverage before specific parishes are named. Do not add "Kingston to Montego Bay" without client sign-off.

#### RI-009: Footer Number Labels
**Current:** Numbers displayed without inline labels in footer.
**Note:** The contact-label divs (Office, Mobile Digicel, Mobile LIME) exist in the contact section above. Footer is supplementary. Low impact.

---

## PART 3 — TONE AND VOICE AUDIT (Sweep 2)

| Standard | Grade | Notes |
|---|---|---|
| **Direct** | A | Tight sentences, no filler. Improved from Sweep 1. |
| **Plain** | A | Grade 8 reading level maintained. No jargon. |
| **Local** | B+ | Flag colors, location name, "Building Jamaica" identity present. Parish depth still missing but flagged for client confirmation. |
| **Practical** | A | Every section drives a clear next step. |
| **Confident** | A− | "may vary" and passive voice removed. Slight hedging on pricing note is acceptable (prices genuinely vary). |
| **Phone-first** | A+ | No email form, no email emphasis. Every page ends at phone or WhatsApp. Sticky CTAs reinforced. |
| **Anti-generic** | B+ | Supplier-specific materials named (rebar, ply, blocks, mattings). Construction audience named (masons, concrete workers). Room to improve on product descriptions. |

---

## PART 4 — CROSS-PAGE CONSISTENCY (Sweep 2)

| Element | Status | Notes |
|---|---|---|
| Company full name | ✅ Consistent | All headings, footers, and WhatsApp messages use full name |
| Phone numbers (3 lines) | ✅ Consistent | All 3 numbers present on every page, correctly labeled |
| WhatsApp prefill text | ✅ Consistent | Full name in all URLs; context-specific messages on inner pages |
| Tagline | ✅ Consistent | "Built Strong. Delivered Right. Building Jamaica." in all footers |
| Jamaica strip | ✅ Consistent | Present on all pages |
| Footer structure | ✅ Consistent | Identical across all 5 pages |
| Sticky CTA | ✅ Fixed | Context-specific messages on inner pages |
| LocalBusiness schema | ✅ Consistent | Present on all 5 pages with correct data |
| OG image | ✅ Consistent | sign.png referenced on all pages |
| OG title + description | ⚠️ Fix needed | Missing on 4 inner pages (NEW-001) |
| aria-expanded | ⚠️ Fix needed | Missing on 4 inner pages (NEW-002) |
| H2 heading structure | ⚠️ Fix needed | Missing on 3 inner pages (SEO-001) |

---

## PART 5 — FACTS AND CLAIMS AUDIT

| Claim | Verifiable? | Status |
|---|---|---|
| "Professional, reliable service — on time and easy to reach" | Client-stated in intake | ✅ PASS |
| "Best rates in town" | Client-stated in intake ("I can bet any price") | ✅ PASS |
| "Local Rockhall / Waugh Hill, Jamaica" | Confirmed in intake | ✅ PASS |
| "Direct island-wide delivery" | Confirmed in intake handoff | ✅ PASS |
| "Construction builds big and small" | Confirmed in intake | ✅ PASS |
| "Heavy equipment rental" | Confirmed in intake | ✅ PASS |
| All three phone numbers (876-994-5269, 876-443-8702, 658-201-0651) | Confirmed in intake | ✅ PASS |
| No fixed prices shown | Confirmed — all prices are "call for today's rate" | ✅ PASS |
| No licensing/trade-specific claims (plumbing, electrical, etc.) | Out-of-scope items are absent | ✅ PASS |
| No unverified equipment names | Equipment described generically | ✅ PASS |

**Facts verdict: CLEAN — no unverified claims, no fabricated data, no pricing risk.**

---

## PART 6 — IMPLEMENTATION PRIORITY BATCH

**Batch 1 — Critical / Release-Blocking:**
1. NEW-001: Add og:title + og:description to 4 inner pages
2. NEW-002: Add aria-expanded to 4 inner page menu buttons
3. SEO-001: Add H2 above service blocks on 3 pages

**Batch 2 — Content Quality:**
4. RI-004: Fix "Check Rental Availability" → "Ask About Equipment Rental" on homepage
5. RI-006: Strengthen 3 product descriptions on supplies.html
6. RI-007: Add scope examples to Small/Larger Builds on construction.html
7. RI-014: Add hero sub-headline to index.html

**Batch 3 — Post-Launch / Deferred:**
8. SEO-004: Canonical URLs (add after domain confirmed)
9. SEO-005: Image filename rename (before deployment)
10. RI-003: Parish references (after client confirms delivery coverage)

---

## PART 7 — APPROVAL STATUS

**Reviewer:** PLA (Simone) — Plain Language / Content Cell
**QA Pass 2 Verdict:** **CONDITIONAL PASS — Batch 1 + Batch 2 required before QAS release gate**

Content is accurate, claim-safe, and commercially sound. No legal risk, no pricing risk, no fabricated claims. The site is strong and on-brand. Batch 1 technical fixes (OG meta, aria-expanded, H2 structure) and Batch 2 content improvements are required before this file advances to QAS Gate 6.

**Next step:** FIS (Kiara) or SEA to implement Batches 1 and 2. QAS (Imani) re-review after implementation. Founder release gate before deployment.

---

*End of Editorial Review Sweep 2 — Apple Passion Hardware & Construction*
*Classification: Internal — Client-project record. Do not include in client handoff package.*
