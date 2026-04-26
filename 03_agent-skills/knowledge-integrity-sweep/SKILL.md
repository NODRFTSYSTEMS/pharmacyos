---
name: knowledge-integrity-sweep
description: Use to verify that a document set — governance docs, client-facing content, case studies, or working templates — is factually accurate, current, and internally consistent. Distinct from VECS (visual/commercial architecture) and disclosure_gate (IP exposure). Knowledge integrity is about accuracy, currency, and cross-document consistency.
---

# Knowledge Integrity Sweep

## Use When

- quarterly review cycle is due
- a major proposal, case study, or public content release cites prior work or claimed results
- governance documents have not been reviewed in more than 90 days and cover rapidly changing topics
- internal contradictions are suspected between documents covering the same subject
- a client deliverable contains factual claims that need source verification before release

## Required Inputs

- the document or document set to review
- the original approved source for each claim (if available)
- date of last verified update for each document
- known changes in the underlying subject matter since the last update (pricing changes, tool stack changes, product changes, market data changes)

## Workflow

1. Classify each document in scope by type: canonical governance / active reference / client-facing / public-facing. Classification determines the severity standard applied to findings.
2. For each document, extract every verifiable factual claim: statistics, prices, tool names, product capabilities, market claims, client results, regulatory requirements.
3. For each claim: verify against the stated source or against the current canonical governance document. Mark as: VERIFIED (source confirmed and current), UNVERIFIED (no source available or source cannot be confirmed), or STALE (source exists but reflects outdated state).
4. Flag documents not reviewed in >90 days that contain rapidly-changing content (pricing, tool stack, competitive claims, regulatory references) as STALE — entire document, regardless of individual claim status.
5. Cross-reference: identify internal contradictions — two documents making different claims about the same fact. Contradictions are more severe than individual unverified claims because they create active confusion.
6. Rank all findings by severity: CRITICAL (contradiction between canonical governance docs, or fabricated/unverifiable public claim), IMPORTANT (stale canonical document, unverified client-facing claim), ENHANCEMENT (stale reference document, minor currency issue with no active use risk).
7. Produce the knowledge integrity report.

## Outputs

- knowledge integrity report with all findings ranked by severity
- stale-document list with recommended re-verification priority
- unverified-claims list with recommended resolution (remove, source, or label as estimate)
- contradiction flags with both conflicting sources identified
- recommended remediation priority order

## Escalation Behavior

- If a contradiction is found between two canonical governance documents (`01_system/` files), stop and escalate to `ARE` before recommending resolution. Do not independently resolve canonical document conflicts.
- If a public-facing or client-facing claim is unverifiable (no source exists and "sounds right" is the only basis), escalate to `reviewer_public_proof` and Founder before the document is published or delivered.
- If a legal or pricing claim is flagged as STALE, escalate to `pricing-safety-review` or `CDA` (as applicable) before the document is used in any commercial context.
- If the sweep finds that the number of STALE or UNVERIFIED canonical governance documents exceeds 20% of the set reviewed, escalate to `KDGA` (Knowledge & Documentation Governance Agent) for a broader governance audit before proceeding.

## Do Not Do

- do not delete UNVERIFIED claims — flag them and escalate; deletion without source confirmation may remove accurate information
- do not mark a claim VERIFIED because it "sounds right" — only mark VERIFIED if a source can be cited
- do not run this sweep and mark a document clean without producing a written report
- do not resolve canonical document contradictions independently — that is an ARE decision
- do not treat ENHANCEMENT findings as blockers — they are deferred improvements, not delivery blockers
