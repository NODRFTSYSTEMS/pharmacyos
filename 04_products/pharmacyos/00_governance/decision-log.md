# PharmacyOS — Decision Log
Classification: Internal — NoDrftSystems Proprietary
Owner: Founder
Started: 2026-05-08

This log records all product-governance decisions affecting PharmacyOS classification, scope, commercial structure, architecture, and release. Entries are append-only. Nothing is deleted; corrections are added as new entries.

---

## DL-001 — PharmacyOS reclassified to NoDrftSystems proprietary product

**Date:** 2026-05-08
**Authority:** Founder (in-session authorization, gacrespservices@gmail.com)
**Status:** Authorized — follow-on artifacts pending
**Classification before:** Client-owned product. PharmacyOS IP transferred to Winchester Global Pharmacy on delivery per existing MSA assignment clause.
**Classification after:** NoDrftSystems proprietary product. PharmacyOS IP retained by NoDrftSystems. Winchester Global Pharmacy becomes the first deployment under a license, not an assignment.

### Decision

PharmacyOS is now a NoDrftSystems-owned, multi-tenant-capable platform product. Winchester Global Pharmacy is repositioned from "client commissioning a bespoke build" to "first licensed deployment of the platform." Future pharmacy clients can be onboarded as additional licensed deployments without a new build.

### Rationale

1. PharmacyOS already addresses a generalizable problem space (independent pharmacy operations under Jamaica Pharmacy Act + JDPA) that extends beyond a single Winchester deployment.
2. The architecture (per ADR 2026-05-07) is platform-shaped — single-tenant for Phase 1, but the core data model, role system, and AI integrations transfer to other pharmacy operators with configuration changes only.
3. NoDrftSystems retains long-term value in a recurring-revenue platform asset rather than a one-time build payment.
4. Winchester gains lower lifecycle cost (license + deployment fee vs. full build cost) and ongoing platform improvements driven by other deployments.

### Scope of Authorization

This decision authorizes:
- Reclassification of PharmacyOS in NoDrftSystems product registry as a proprietary product
- Continued architectural and scaffolding work in `04_products/pharmacyos/` under proprietary-product governance
- Drafting of the follow-on commercial and legal artifacts listed below

This decision does NOT authorize:
- Marketing or external announcement of PharmacyOS as a NoDrftSystems product (premature — Winchester deployment must complete first)
- Approach to additional pharmacy clients before the Winchester deployment is operational
- Any unilateral change to the Winchester engagement before Winchester signs the amended MSA + new SOW

### Required Follow-On Artifacts

| # | Artifact | Owner | Status |
|---|---|---|---|
| 1 | MSA amendment scope brief | CDA + LCA + Founder + counsel | Drafted — see [msa-amendment-brief.md](msa-amendment-brief.md) |
| 2 | New SOW restructure brief (Winchester engagement) | PEA + CDA + Founder | Drafted — see [sow-restructure-brief.md](sow-restructure-brief.md) |
| 3 | Winchester signed MSA amendment | Founder + Winchester signatory + counsel review | **Blocking** — required before any further commercial commitment |
| 4 | Winchester signed new SOW | Founder + Winchester signatory | **Blocking** — required before any further build commitment to Winchester |
| 5 | NoDrftSystems product registry entry — PharmacyOS as proprietary product | PRGA + PMA | **TODO** |
| 6 | NoDrftSystems active client roster update — Winchester relationship type changed to "platform license customer" | PMA | **TODO** |
| 7 | Build Activation Packet — IP language updated to reflect proprietary classification | PMA | **Done** as part of this decision (see [build-activation-packet.md](build-activation-packet.md) governance note) |
| 8 | Founder approval of Supabase Pro subscription before production deployment | Founder + PIS | OPEN — currently using Free tier (`pharmacyos-dev`) per Founder direction "keep Free as long as possible" |

### Known Risks

- **Winchester non-acceptance.** Winchester is not contractually required to accept this reclassification. If they decline the new structure, the engagement reverts to the prior bespoke-build model, or terminates. Mitigation: present the license model as cost-favorable to Winchester (lower upfront + ongoing improvements) and as no operational change for them.
- **MSA amendment legal exposure.** Changing IP terms mid-engagement requires careful counsel review to avoid voiding the existing agreement or creating a transition gap. Mitigation: counsel review before sending to Winchester.
- **Pre-existing client expectation.** Per pre-2026-05-08 governance records, Winchester signed an MSA where IP transfers to them on delivery. Reclassifying without their consent is a breach. Nothing further is committed to Winchester until the amended MSA is signed.
- **Build progress prior to amendment.** Architectural and scaffolding work is internal NoDrftSystems work product. It does not commit Winchester or NoDrftSystems to any specific commercial structure. No production deployment, no client access, and no IP-affecting code transfer occurs until the amended MSA is signed.

### Audit Trail

- 2026-05-08 — Founder authorized in session (memory record `project_pharmacyos_winchester.md` + this log)
- 2026-05-08 — `app/` Vite scaffold and `supabase/` folder structure committed under proprietary classification
- 2026-05-08 — MSA amendment brief and SOW restructure brief drafted
- (Pending) — Winchester MSA amendment signed
- (Pending) — Winchester new SOW signed
- (Pending) — NoDrftSystems product registry updated
