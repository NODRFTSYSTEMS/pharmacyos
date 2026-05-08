# LCA Legal Risk Review — PharmacyOS MSA Amendment (Winchester Global Pharmacy)

**Classification:** Internal — NoDrftSystems Proprietary
**Date:** 2026-05-08
**Audience:** Founder (gacrespservices@gmail.com) + qualified Jamaica counsel + LCA archive
**Source brief:** [`msa-amendment-brief.md`](msa-amendment-brief.md)
**Triggering decision:** [`decision-log.md` DL-001](decision-log.md)
**Reviewer:** LCA / Dorothy

---

## Mandatory Disclaimer

This document is a **legal-risk flagging exercise, not legal advice.** Nothing in this review constitutes a legal opinion, and nothing here may be relied upon as a substitute for advice from qualified counsel licensed in Jamaica. NoDrftSystems is Jamaica-context-aware but is **not** licensed to practice law in Jamaica or any other jurisdiction. Final operative amendment language — including any statutory citations, allocations of regulatory responsibility, and indemnification structure — must be drafted, reviewed, and approved by qualified Jamaica counsel before transmission to Winchester Global Pharmacy.

This document is for internal use to brief counsel and the Founder. It is not a client deliverable.

---

## Risk Flagging by Clause

### Clause 1 — IP Ownership / Assignment Carve-Out
- **Risk category:** IP exposure; contractual breach of existing assignment provision
- **Severity:** HIGH
- **Why it's a risk:** The existing MSA assigns deliverables to Winchester on delivery. Reclassifying PharmacyOS as a NoDrftSystems-retained asset reverses a core economic term. If the carve-out is silent on "platform improvements developed during the Winchester engagement," Winchester could later assert ownership of work product produced under their funded engagement under the original assignment language.
- **What counsel must specifically address:**
  - Whether the carve-out must enumerate categories (source code, schemas, AI prompts, UI components, infrastructure-as-code, derivative improvements) or operate by general definition.
  - Whether prior consideration paid by Winchester under the original MSA creates an equitable ownership claim that survives the amendment (REQUIRES JAMAICA COUNSEL).
  - Severability if the carve-out is challenged.

### Clause 2 — License Grant (New Section)
- **Risk category:** Contractual scope; IP exposure
- **Severity:** HIGH
- **Why it's a risk:** The brief leaves term, geographic scope, affiliate use, and transferability open. Each of these is a material commercial term. A perpetual, royalty-free license effectively replicates the original assignment outcome; a too-narrow license exposes Winchester to operational disruption.
- **What counsel must specifically address:**
  - Term structure (perpetual vs. co-terminal with operational support fee).
  - Permitted users (Winchester employees only, contractors, affiliates, successors).
  - Restrictions on reverse engineering, sublicense, white-labeling.
  - License survival on NoDrftSystems insolvency or product sunset (escrow / step-in rights — REQUIRES JAMAICA COUNSEL).

### Clause 3 — Data Ownership and JDPA Allocation
- **Risk category:** Data protection; regulatory
- **Severity:** HIGH
- **Why it's a risk:** Patient data falls under the Jamaica Data Protection Act 2020 (JDPA). Mis-allocation of controller vs. processor roles between Winchester and NoDrftSystems creates direct regulatory exposure for whichever party is mis-cast. Cross-border transfer to Supabase US-East compounds the risk: JDPA imposes specific conditions on transfers outside Jamaica.
- **What counsel must specifically address:**
  - Confirm Winchester is the JDPA data controller and NoDrftSystems is the processor for technical safeguards. **REQUIRES JAMAICA COUNSEL.**
  - Confirm lawful basis for cross-border transfer to Supabase US-East: legitimate interest, explicit patient consent, adequacy determination, or contractual safeguards. **REQUIRES JAMAICA COUNSEL.**
  - Mandatory processor-controller terms (Section 26 JDPA-equivalent processor obligations) — counsel to confirm exact statutory hooks.
  - Sub-processor disclosure obligations (Supabase, Anthropic for Claude Vision, Vercel, Lynk).
  - Breach notification timing and routing.

### Clause 4 — Service Level / Operational Continuity
- **Risk category:** Indemnification gap; contractual liability exposure
- **Severity:** MEDIUM-HIGH
- **Why it's a risk:** The engagement shifts from "deliver and walk away" to ongoing operational dependency. PharmacyOS becomes the daily operating system of a regulated pharmacy; outages affect schedule drug logging, dispensing, and JDPA-compliant record-keeping. Without revised liability caps and force majeure carve-outs, NoDrftSystems exposure to consequential damages could be materially higher than under the original build engagement.
- **What counsel must specifically address:**
  - Liability cap structure for an ongoing service relationship (annual fees vs. aggregate cap).
  - Carve-outs for regulatory penalties suffered by Winchester arising from platform failure.
  - Force majeure scope (cloud provider outage, payment-rail outage) — REQUIRES JAMAICA COUNSEL on local enforceability.
  - Uptime credits vs. termination-for-cause thresholds.

### Clause 5 — Termination and Data Egress
- **Risk category:** Data protection; operational continuity; regulatory
- **Severity:** MEDIUM-HIGH
- **Why it's a risk:** A pharmacy regulated under the Jamaica Pharmacy Act is required to maintain dispensing records and schedule drug logs. Insufficient egress specificity (formats, completeness, timeline) could leave Winchester unable to satisfy regulatory record-keeping obligations after termination, with NoDrftSystems exposed for the gap.
- **What counsel must specifically address:**
  - Statutory minimum record-retention periods under the Jamaica Pharmacy Act and JDPA. **REQUIRES JAMAICA COUNSEL.**
  - Whether export formats (CSV per table, PDF prescriptions) are sufficient as "operational records" for regulatory inspection.
  - Egress timeline (e.g., 30/60/90 days), and post-egress data deletion confirmation language.
  - Whether NoDrftSystems must retain a copy beyond egress for its own audit defense, and on what basis under JDPA.

### Clause 6 — Pricing Structure
- **Risk category:** Contractual; misrepresentation exposure
- **Severity:** MEDIUM
- **Why it's a risk:** If Winchester has already paid build-fee amounts under the prior fixed-fee model, transitioning to deployment + recurring license + operational support without addressing prior payments creates risk of double-charging or unjust enrichment claims.
- **What counsel must specifically address:**
  - Audit of amounts already invoiced and paid under the existing MSA / SOW for PharmacyOS-related work.
  - Credit, true-up, or refund treatment.
  - Tax treatment under Jamaica law (GCT, withholding) for license vs. service fees. **REQUIRES JAMAICA COUNSEL.**

### Clause 7 — Confidentiality
- **Risk category:** IP exposure; contractual
- **Severity:** MEDIUM
- **Why it's a risk:** PharmacyOS confidentiality obligations on Winchester are new (the original MSA likely treated deliverables as Winchester property, so Winchester had no inbound confidentiality obligation). Without strengthened mutual confidentiality, Winchester staff exposure to platform internals (admin screens, AI prompts, schemas) is not protected.
- **What counsel must specifically address:**
  - Mutual confidentiality scope and duration (perpetual for trade secrets vs. fixed term for other confidential information).
  - Carve-outs (independently developed, lawfully obtained, required by law).
  - Survival post-termination.

### Clause 8 — Compliance Allocation
- **Risk category:** Regulatory; misrepresentation
- **Severity:** HIGH
- **Why it's a risk:** Winchester is a regulated pharmacy under the Jamaica Pharmacy Act. NoDrftSystems must not assume regulated-entity status by accident. JDPA allocation must distinguish controller (Winchester) from processor (NoDrftSystems) clearly. Mis-allocation here can pull NoDrftSystems into regulatory inspection scope it is not equipped to bear.
- **What counsel must specifically address:**
  - Express disclaimer that NoDrftSystems is not a regulated entity under the Jamaica Pharmacy Act. **REQUIRES JAMAICA COUNSEL.**
  - Confirm processor obligations under JDPA (technical and organizational safeguards) without crossing into controller responsibilities.
  - Confirm that the platform's logging features (schedule drug log, audit trail) are tools Winchester uses to satisfy its own compliance, not NoDrftSystems' direct regulatory undertakings.

### Clause 9 — Indemnification (Review)
- **Risk category:** Indemnification gap
- **Severity:** MEDIUM-HIGH
- **Why it's a risk:** Existing indemnification was sized for a one-time build deliverable. An ongoing operational platform with regulated data exposure may need adjusted IP indemnity (NoDrftSystems → Winchester) and revised data-breach indemnity allocation.
- **What counsel must specifically address:**
  - Whether IP indemnity (third-party infringement claims against PharmacyOS) needs explicit articulation given NoDrftSystems retains ownership.
  - Data-breach allocation between processor (NoDrftSystems) and controller (Winchester).
  - Mutual carve-outs for gross negligence, willful misconduct.

---

## Cross-Cutting Risks

1. **JDPA controller/processor allocation cuts across Clauses 3, 4, 5, 8, and 9.** A single, consistent allocation must be established and then reflected uniformly. Inconsistency between the data clause and the indemnification clause is a common drafting error and a material exposure.
2. **Cross-border transfer to Supabase US-East (Clause 3)** intersects with termination egress (Clause 5) and breach notification (Clauses 4 and 8). Counsel must ensure the lawful-basis analysis is consistent across the lifecycle of the data, not just at the point of collection.
3. **Pricing transition (Clause 6) interacts with the "no retroactive license fee" boundary** stated in the brief. Counsel must confirm the pricing language does not inadvertently re-characterize prior payments as license fees.
4. **The carve-out boundary (Clauses 1, 2)** must not bleed into other Winchester engagements (e.g., the Phase 1 informational website, which is a separate engagement under a separate SOW). Counsel must confirm the amendment is narrow to PharmacyOS only.

---

## Mandatory Disclaimers for the Executed Amendment

The following should be present in the executed amendment, with counsel-confirmed wording:

1. **Governing law and venue** — explicit selection. **REQUIRES JAMAICA COUNSEL** for venue choice (Jamaica courts vs. arbitration).
2. **Regulatory acknowledgment** — Winchester acknowledges it is the regulated entity under the Jamaica Pharmacy Act; NoDrftSystems acknowledges it is not.
3. **JDPA processor acknowledgment** — NoDrftSystems acknowledges processor status and the obligations attaching to that status under the Jamaica Data Protection Act 2020.
4. **No legal advice clause** — for the avoidance of doubt, NoDrftSystems compliance features (schedule drug logs, JDPA exports) are tools, not legal advice or a guarantee of regulatory compliance.
5. **Survival clause** — confidentiality, data protection, indemnification, and IP terms survive termination.
6. **Entire agreement / amendment precedence** — clarifies the amendment supersedes only the identified clauses; the balance of the MSA remains in force.

---

## Items LCA Cannot Resolve — Require Jamaica Counsel

1. JDPA controller/processor allocation language and statutory citations.
2. JDPA cross-border transfer lawful basis for Supabase US-East.
3. Jamaica Pharmacy Act record-retention minimums and their effect on egress timeline.
4. Whether the existing MSA's assignment clause creates an equitable claim by Winchester surviving the carve-out.
5. Tax treatment (GCT, withholding) of license fees vs. service fees under Jamaica law.
6. Force majeure enforceability under Jamaican contract law.
7. Whether NoDrftSystems' processor disclaimer of regulated-entity status under the Pharmacy Act is sufficient on its face or requires additional support.
8. Governing law and venue selection (Jamaica courts vs. arbitration; choice-of-law clauses).
9. Drafting of all operative amendment clause text.
10. Confirmation that signed amendment satisfies all Jamaica statutory formalities for amendment of a written agreement.

---

## Items LCA Can Pre-Clear Before Counsel Review

1. **Party name and entity accuracy** — confirm Winchester Global Pharmacy legal name and NoDrftSystems entity name match the existing MSA exactly.
2. **Source-brief internal consistency** — the nine clause areas in the brief are non-overlapping and complete relative to the reclassification scope; no scope-conflict with active SOWs (verified against `02_client-system/WINCHESTERGLOBAL_pharmacyos/` and `02_client-system/WINCHESTERGLOBAL_pharmacy-website/` records).
3. **Disclosure-gate compliance** — this brief and this review are internal documents; neither has been transmitted externally; both are correctly classified as Internal — NoDrftSystems Proprietary.
4. **Phase 1 separation** — confirmed that the informational website engagement is a separate SOW and is not within the amendment scope.
5. **No [REQUIRED] placeholders** — the source brief is stable; LCA review is not premature.
6. **Pre-execution posture** — confirmed nothing has been transmitted to Winchester; build-activation packet's pre-amendment build discipline is intact (no production deployment, no Winchester access to deployed instance, no IP-affecting code transfer until signed amendment).
7. **Mandatory business formation disclaimer** — not applicable (this is a contract amendment, not a business formation deliverable). Standard contract disclaimers apply instead and are listed above.

---

## Routing Recommendation

Order of handling, before any external transmission to Winchester:

1. **LCA → Founder (now):** This review is delivered to Founder + LCA archive. Founder reviews flagged risks and counsel-only questions.
2. **Founder → CDA:** CDA populates the standard NoDrftSystems amendment template against the brief, leaving operative legal language as placeholders pending counsel input. CDA must not draft substantive legal text.
3. **CDA + LCA → Jamaica counsel:** Counsel receives (a) this risk review, (b) the source brief, (c) the existing MSA, (d) DL-001, and (e) the CDA-prepared template. Counsel produces operative clause language and answers each "REQUIRES JAMAICA COUNSEL" question.
4. **Counsel → Founder:** Founder reviews counsel-revised amendment.
5. **Founder approval logged in Decision Log** before any external transmission.
6. **Founder → Winchester signatory:** amended MSA presented after Founder approval.
7. **Execution and effective date logged** in Decision Log; access transfer log, build packet, and product registry updated per handover protocol.

**Stop conditions to honor at every step:**
- No commercial commitment to Winchester before signed amendment.
- No production deployment of PharmacyOS to Winchester before signed amendment.
- No external transmission of the amendment without Founder approval on file.
- LCA does not — and cannot — issue a PASS on this amendment. The most LCA can issue is "no further internal flags" once counsel has produced operative language; final sign-off authority is Founder + qualified Jamaica counsel.

---

**End of LCA review. This review must be logged to:**
1. `01_system/legal/legal_review_log.md` — pending after Founder receipt of this document
2. `02_client-system/WINCHESTERGLOBAL_pharmacyos/06_handoff/` — pending after Founder receipt of this document

A review not logged to both locations is not a completed review.
