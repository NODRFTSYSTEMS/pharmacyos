# MSA Amendment Scope Brief — Winchester Global Pharmacy
Classification: Internal — NoDrftSystems Proprietary
Audience: CDA (contract drafting), LCA (legal compliance), Founder, qualified outside counsel
Date: 2026-05-08
Triggering decision: [decision-log.md DL-001](decision-log.md)

---

## Purpose

This brief defines the scope of the MSA amendment required to reclassify the PharmacyOS engagement from a bespoke-build assignment to a proprietary platform license deployment. This document is **not the amendment itself**. It identifies the clauses that must change, the legal positions to confirm with counsel, and the boundaries of what the amendment must preserve.

LCA and qualified outside counsel must produce the operative amendment language. CDA assembles the document from the standard NoDrftSystems amendment template once counsel has confirmed the legal positions below.

## Existing State

- Master Services Agreement (MSA) executed between NoDrftSystems and Winchester Global Pharmacy — date and version on file in `02_client-system/WINCHESTERGLOBAL_pharmacyos/` and `02_client-system/WINCHESTERGLOBAL_pharmacy-website/`
- Existing IP clause: deliverables produced under any SOW transfer to Winchester on delivery (assignment model)
- Existing relationship: client–vendor for bespoke build work
- Phase 1 informational website (separate engagement) is unaffected and continues under current terms

## Target State

- IP ownership of PharmacyOS platform: NoDrftSystems retains
- Winchester receives: a perpetual or term license to use the deployed PharmacyOS instance for their pharmacy operations
- Pre-existing assignment language: must be expressly carved out for PharmacyOS, while remaining intact for any future bespoke deliverables Winchester commissions

## Clauses to Amend

| # | Clause Area | Required Change | Counsel Question |
|---|---|---|---|
| 1 | IP Ownership / Assignment | Carve PharmacyOS out of the blanket assignment provision. PharmacyOS IP, source code, schemas, AI prompts, and platform improvements remain NoDrftSystems property. | Does the carve-out need to enumerate "platform improvements developed during the Winchester engagement" explicitly to prevent future ambiguity? |
| 2 | License Grant (new section) | Grant Winchester a non-exclusive, non-transferable license to use the PharmacyOS instance for their pharmacy operations at the locations covered by the SOW. | Term: perpetual, term-limited, or co-terminal with platform availability? Geographic scope? Affiliate use rights? |
| 3 | Data Ownership | Patient data, prescription data, inventory data, and all operational records entered into the Winchester instance remain Winchester's property. NoDrftSystems is a data processor under Jamaica Data Protection Act 2020 (JDPA). | Confirm JDPA "controller" vs "processor" allocation. Confirm cross-border data transfer language (Supabase US-East region holds Winchester patient data — legitimate interest basis or explicit consent?). |
| 4 | Service Level / Operational Continuity | NoDrftSystems commits to platform uptime, data backup, and continuity-of-service obligations distinct from the original "deliver and walk away" build engagement. | Counsel: what indemnification, liability cap, and force majeure provisions are appropriate for an ongoing operational platform vs. a one-time deliverable? |
| 5 | Termination and Data Egress | On termination, Winchester receives a full export of their operational data in standard formats. NoDrftSystems retains the platform code; Winchester does not receive a source-code copy. | Counsel: define "standard formats" with sufficient specificity (CSV per table, PDF for prescription images, etc.). Define egress timeline. |
| 6 | Pricing Structure | Replace the build-payment model (fixed-fee deliverable acceptance) with a deployment fee + recurring license + operational support fee structure. | Counsel: confirm whether any pre-paid build-fee amounts already invoiced or paid require credit, true-up, or refund treatment. |
| 7 | Confidentiality | NoDrftSystems' confidentiality obligations regarding Winchester's operational data are strengthened. Winchester's confidentiality obligations regarding the PharmacyOS platform are added. | Counsel: confirm scope and duration of mutual confidentiality. |
| 8 | Compliance Allocation | JDPA compliance for the data: shared (Winchester as controller for what they collect; NoDrftSystems as processor for technical safeguards). Pharmacy Act compliance: Winchester (regulated entity). | Counsel: confirm allocation language; confirm NoDrftSystems is not assuming Pharmacy Act regulated-entity status. |
| 9 | Indemnification (review, may not change) | Confirm existing indemnification provisions are appropriate for the new structure or whether they need adjustment. | Counsel: review and advise. |

## Boundaries — What the Amendment Must NOT Do

- Must not retroactively re-characterize work already delivered under the existing MSA outside PharmacyOS scope
- Must not relieve NoDrftSystems of any pre-existing obligations (Phase 1 website deliverables, etc.)
- Must not impose retroactive license fees on Winchester for the period before amendment execution
- Must not waive any party's rights under Jamaica Pharmacy Act or Jamaica Data Protection Act 2020
- Must not be presented to Winchester before counsel has reviewed the amendment language

## Process

1. **CDA (contract drafting agent):** populate the standard NoDrftSystems amendment template using this brief — leaves clause language placeholders pending counsel input
2. **LCA (legal compliance agent):** flag legal risk areas and identify questions for counsel
3. **Outside counsel review:** counsel produces operative legal language for each amended clause; provides advice on the questions raised above
4. **Founder review:** Founder reviews the counsel-revised amendment before any external transmission
5. **Winchester signatory:** amended MSA presented to Winchester signatory after Founder approval
6. **Execution:** counter-signed amendment executed; effective date logged in [decision-log.md](decision-log.md)

## Stop Conditions

- No commercial commitment is made to Winchester premised on the new structure until the amended MSA is signed
- No production deployment of PharmacyOS to Winchester occurs until the amended MSA is signed
- If Winchester declines the amendment: escalate to Founder for decision on (a) reverting to bespoke-build delivery for Winchester only and detaching PharmacyOS as a separate proprietary product line for other clients, or (b) terminating the engagement

## Routing

- Send this brief to LCA for legal risk flagging
- Send to CDA after LCA review, for amendment template population
- Founder authorization required before any external transmission
