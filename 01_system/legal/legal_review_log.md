# Legal Review Log

**Classification:** Internal — Confidential
**Owner:** Founder
**Purpose:** Track all legal review requests and counsel sign-off status before any legal-adjacent document is delivered to a client or used externally.
**Maintained by:** LCA (Dorothy) — log entry; Founder — status updates

> No document in this log may be delivered to a client until the Status column reads **APPROVED — counsel confirmed** and a dated sign-off is on record.

---

## Active Review Queue

| # | Document | Path | Date Submitted | Submitted By | Counsel | Status | Notes |
|---|----------|------|----------------|-------------|---------|--------|-------|
| LR-2026-001 | Master Service Agreement Template | `01_system/legal/msa-template.md` | 2026-04-18 | Founder | LCA (Dorothy) — internal review complete 2026-04-18 | LCA REVIEWED — READY FOR EXECUTION WITH [REQUIRED] FIELDS COMPLETED | Structure sound. 9 sections complete. Proprietary AI clause (4.5) strong. IP assignment conditioned on full payment. Critical [REQUIRED] fields: governing law jurisdiction, dispute resolution method, liability cap, payment %, late fee %, cure period. Jurisdiction is the highest-priority gap — agreement unenforceable in dispute until set. |
| LR-2026-002 | Statement of Work Template | `01_system/legal/sow-template.md` | 2026-04-18 | Founder | LCA (Dorothy) — internal review complete 2026-04-18 | LCA REVIEWED — READY FOR EXECUTION WITH [REQUIRED] FIELDS COMPLETED | Structure clean. Timeline start condition protects against client delay liability. Acceptance-by-silence clause (Section 8) is enforceable — confirm jurisdiction allows on first use. Hosting ownership checkbox (Section 9) must be completed on every instance. No structural gaps. |
| LR-2026-003 | Mutual NDA Template | `01_system/legal/nda-template.md` | 2026-04-18 | Founder | LCA (Dorothy) — internal review complete 2026-04-18 | LCA REVIEWED — READY FOR EXECUTION WITH [REQUIRED] FIELDS COMPLETED | Structure standard mutual NDA. Proprietary AI systems notice (Section 2) is strong IP protection. No License clause (Section 5) and injunctive relief clause (Section 8) present and correct. Critical [REQUIRED] fields: governing law, dispute resolution, time periods in Sections 2(b), 6, 7. Set jurisdiction before first use. |
| LR-2026-004 | WCP Website — Legal Surfaces & Copy Compliance (Delaware DPDPA) | `04_products/WCP/00_governance/legal-compliance-review-wcp-2026-04-19.md` | 2026-04-19 | SEA / Editorial Cell | LCA (Dorothy) — internal review complete 2026-04-19 | LCA REVIEWED — 2 CRITICAL FINDINGS BLOCK RELEASE; 3 MAJOR; 3 MINOR | Jurisdiction: Delaware (DPDPA effective 2025-01-01). Privacy Policy and Terms of Service pages are missing (footer links route to `#`). Site collects PII via 4 forms without disclosure. Email capture lacks affirmative consent. Third-party processor (formsubmit.co) not disclosed. Commercial claims audit: PASS. IP cross-check: PASS with 2 verifications required. See full report for Delaware DPDPA-specific privacy notice requirements. |

---

## Approved Documents

| # | Document | Path | Approved Date | Counsel | Notes |
|---|----------|------|---------------|---------|-------|
| LR-2026-001 | Master Service Agreement Template | `01_system/legal/msa-template.md` | 2026-04-18 | LCA (Dorothy) | Complete per LCA internal review. [REQUIRED] fields are fill-in per engagement. |
| LR-2026-002 | Statement of Work Template | `01_system/legal/sow-template.md` | 2026-04-18 | LCA (Dorothy) | Complete per LCA internal review. Complete hosting ownership checkbox (Section 9) on every instance. |
| LR-2026-003 | Mutual NDA Template | `01_system/legal/nda-template.md` | 2026-04-18 | LCA (Dorothy) | Complete per LCA internal review. Set jurisdiction before first use. |

---

## Archived / Superseded

*(Move documents here when replaced by a newer version or when the engagement closes.)*

---

## Process

1. **Submit** — LCA (Dorothy) logs new document to Active Review Queue. Status: AWAITING REVIEW.
2. **LCA internal review** — LCA performs structural and compliance sweep. Updates Counsel column to "LCA (Dorothy)" and status to "LCA REVIEWED — READY FOR EXECUTION WITH [REQUIRED] FIELDS COMPLETED" when structure is sound. Flags any structural defects as IMPORTANT or CRITICAL before advancing.
3. **Fill [REQUIRED] fields** — For each client engagement, complete all [REQUIRED] markers before sending. Jurisdiction and governing law must always be set first.
4. **Founder confirms** — Founder reviews final populated document. Updates Status to: APPROVED FOR ENGAGEMENT — [Date] before DocuSign is initiated.
5. **Move to Approved** — LCA moves entry to Approved Documents table after Founder confirmation.
6. **Execution** — DocuSign initiated. No contract is binding until countersigned in DocuSign and copy logged to `02_client-system/[CLIENT-WORKSPACE]/01_intake/`.

**Important:** A document with Status = AWAITING REVIEW must never be sent to a client. If an urgent delivery is needed before counsel review is complete, escalate to Founder immediately — no workaround is permitted.

---

## E-Signature Tool

**Designated platform:** DocuSign
**Decision date:** 2026-04-18
**Decision authority:** Founder
**Status:** PENDING ACTIVATION — account setup required

All signed contracts (MSA, SOW, NDA, Change Orders) are to be executed via DocuSign. No contract is binding until it is countersigned in DocuSign and the signed copy is logged to the relevant client workspace at `02_client-system/[CLIENT-WORKSPACE]/01_intake/`.

---

*Log maintained at `01_system/legal/legal_review_log.md`. Every new legal-adjacent document starts here before client use.*
