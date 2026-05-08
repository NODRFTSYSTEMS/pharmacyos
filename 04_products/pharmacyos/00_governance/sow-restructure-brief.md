# SOW Restructure Brief — Winchester PharmacyOS Engagement
Classification: Internal — NoDrftSystems Proprietary
Audience: PEA (proposal engine), CDA (contract drafting), Founder
Date: 2026-05-08
Triggering decision: [decision-log.md DL-001](decision-log.md)
Dependency: Cannot proceed beyond draft until [msa-amendment-brief.md](msa-amendment-brief.md) is executed.

---

## Purpose

This brief defines the structural shift required when redrafting the Winchester PharmacyOS Statement of Work to align with the reclassified product. The original SOW (separate from the Phase 1 informational website) was structured for a bespoke build with IP transfer on delivery. The new SOW restructures the same operational outcome as a platform deployment under license.

This brief does **not** contain pricing. Pricing requires Founder confirmation against `pricing-governance.md` (when applicable) and `reviewer_pricing_safety` clearance per the operating standard. PEA produces the proposal language; pricing values are filled in by the Founder.

## Original SOW Structure (to be replaced)

- **Engagement type:** Bespoke build
- **Deliverable:** PharmacyOS source code, deployed instance, documentation — all delivered to Winchester
- **Acceptance:** Single milestone-based acceptance gate, after which IP transfers
- **Payment model:** Build-fee, milestone-paced, terminating on acceptance
- **Post-delivery:** Time-bounded warranty period defined in the original SOW

## New SOW Structure

### Engagement Type
First licensed deployment of the PharmacyOS platform.

### Deliverables (Winchester receives)

| Item | Description |
|---|---|
| Deployed PharmacyOS instance | Single-tenant deployment configured for Winchester's Kingston operations |
| Configuration | All 5 roles, schedule drug log format, Lynk payment integration, Winchester branding |
| User onboarding | Initial user provisioning, 2FA enrollment for all staff, role assignment |
| Training | Operational training for Pharmacist, Pharmacy Technician, Front Desk, Manager, and Admin roles |
| Operational documentation | Runbooks scoped to Winchester's deployment — not platform source documentation |
| Data egress format spec | Documented format for operational data export on termination (per MSA amendment Clause 5) |

### Deliverables (Winchester does NOT receive)

| Item | Why |
|---|---|
| PharmacyOS source code | Platform IP retained by NoDrftSystems per amended MSA |
| Database schema files | Platform IP — schema served via deployed instance, not transferred |
| AI prompts (Claude Vision) | Platform IP |
| Platform documentation (architecture, internal SOPs) | Internal NoDrftSystems documentation |
| Right to redeploy or sublicense | License is non-transferable per amended MSA |

### Phase Structure

| Phase | Scope | Acceptance Gate |
|---|---|---|
| Phase 1 — Configuration & Build | Platform configured for Winchester; 43 routes operational per scope; all Class 3 governance gates cleared | Deployed instance available on staging URL; QAS Gate 5 + Founder Gate 6 sign-off |
| Phase 2 — Pilot | Live pilot with subset of Winchester staff; data entry validated; AI scanner accuracy validated | Pilot acceptance criteria met (defined in detail in the SOW) |
| Phase 3 — Full Cutover | All Winchester staff transitioned to PharmacyOS; PharmPartner legacy decommissioned | Cutover complete; final acceptance |

### Pricing Model (structure only — values pending Founder)

| Charge | Trigger | Cadence |
|---|---|---|
| Deployment fee | One-time, payable in milestones across Phase 1 | Per phase milestone |
| Platform license | Recurring | Annual or monthly — Founder to specify |
| Operational support | Recurring (covers SLA-defined uptime, security patches, platform upgrades) | Annual or monthly — Founder to specify |
| Change Order — Phase 2 features | Per Change Order | As scoped |
| Pass-through costs | Supabase Pro hosting, Anthropic API usage, Lynk transaction fees, domain registration — billed to Winchester at cost or marked up per pricing-governance | As incurred |

**Pricing values are NOT in this brief.** PEA fills the structural fields; Founder fills the values; reviewer_pricing_safety reviews; Founder approves before transmission to Winchester.

### Service Level (Phase 2/3 onward)

| Item | Commitment |
|---|---|
| Uptime target | TBD — Founder to confirm against operational capacity |
| Backup | PITR enabled at Supabase Pro; restore window TBD |
| Incident response | Severity tiers + response times — TBD by Founder |
| Maintenance windows | Notified in advance; outside Jamaica pharmacy operating hours |
| Platform upgrades | Included in operational support fee; communicated in advance |

### Acceptance Criteria

Pulled from the existing Build Activation Packet acceptance criteria — these do not change in substance with the restructure. The 43 routes, Class 3 governance gates, WCAG 2.1 AA, TypeScript-zero-error, and security review requirements all remain. What changes is the post-acceptance posture: instead of IP transfer, the deployment moves to operational support.

### Exclusions (carry forward from BAP)

- No patient-facing features in Phase 1
- English-only (no bilingual)
- No EMR functionality
- No multi-pharmacy in Phase 1
- AIS / NHF / WhatsApp / SMS deferred to Phase 2

### Term and Termination

| Item | Treatment |
|---|---|
| Initial term | TBD — typical 1-year minimum, then evergreen with notice |
| Termination for cause | Standard breach + cure language |
| Termination for convenience | Standard notice period TBD |
| Data egress on termination | Per amended MSA Clause 5 |
| Platform code on termination | NoDrftSystems retains; Winchester does not receive |

## Process

1. **PEA:** populate the standard NoDrftSystems SOW template using this brief — leaves pricing fields and SLA values empty pending Founder
2. **Founder:** fills pricing fields, SLA values, term length
3. **reviewer_pricing_safety:** verifies pricing against pricing-governance.md (if applicable to platform-license products)
4. **CDA:** finalize SOW document; route to QAS for completeness review
5. **LCA:** legal compliance review of the SOW (cross-reference to amended MSA)
6. **Founder:** approves before transmission to Winchester
7. **Transmission:** SOW shared with Winchester only after the MSA amendment is signed

## Stop Conditions

- No SOW values are populated until counsel has confirmed the amended MSA can be executed
- No SOW is sent to Winchester before the amended MSA is signed
- If pricing-governance.md does not yet have a platform-license pricing structure: do not invent one — escalate to Founder to define platform-license pricing first

## Routing

- This brief routes first to PEA for SOW template population
- Founder fills pricing
- reviewer_pricing_safety + LCA review before any external transmission
