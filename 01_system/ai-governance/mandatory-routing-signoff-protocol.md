# Mandatory Routing & Signoff Protocol
# Classification: Internal — Proprietary
# Version: 1.0 | 2026-04-24

## Purpose

Define the non-negotiable routing and signoff chain for every artifact class. This protocol closes the gap between "QAS ran passes" and "the right human confirmed the right decision." No artifact self-certifies. No human approval is implied by silence.

---

## Core Rules

### Rule 1: Self-Certification Is Never Valid
The agent that produces an artifact cannot be the agent that verifies it. This applies at every level:
- SEA cannot approve SEA's own code
- QAS cannot approve QAS's own quality determination
- ARE cannot sign off on work ARE produced without independent review

### Rule 2: Every Completion Report Declares a Verification Class
Before any task is filed as COMPLETE, the completion report must state:

```
Verification Class: STANDARD or HIGH-RISK
```

- **STANDARD:** Non-client-facing, non-commercial, non-legal, non-release artifact. Requires: Producer → Peer verifier → QAS sign-off.
- **HIGH-RISK:** Touches a commercial, legal-adjacent, release-critical, or company-control artifact class. Requires: Producer → Independent verifier → QAS → HHC → Human approval.

If the verification class is not declared: QAS holds the artifact as INCOMPLETE.

### Rule 3: HHC Is the Mandatory Last-Hop on High-Risk Artifacts
For every High-Risk artifact, HHC (Desmond) packages the final decision brief and routes it to the appropriate human authority before the artifact is released or used downstream. HHC confirmation is logged in the Decision Log. No High-Risk artifact advances without this log entry.

### Rule 4: Human Approval Is Not Implied by QAS PROCEED
A QAS PROCEED recommendation means QAS has cleared its passes. It does not mean Founder or ARE approval is obtained. Human approval is a separate, explicitly logged gate — never inferred from the absence of objection.

---

## Verification Classes

### STANDARD Verification
Applies to: internal documentation, non-client-facing operational documents, internal analysis, session notes, backlog items.

Chain:
1. Agent A produces
2. Agent B (different bounded scope) verifies completeness and scope compliance
3. If B finds issues: A revises → B re-verifies → chain advances
4. QAS confirms verification is complete

### HIGH-RISK Verification
Applies to: commercial artifacts, legal-adjacent artifacts, release artifacts, company-control artifacts.

Chain:
1. Agent A produces
2. Agent B verifies content and scope compliance
3. Agent C (independent control function — QAS, IPGA, or SCA as appropriate) verifies risk-specific concerns
4. QAS issues PROCEED or HOLD with documented rationale
5. HHC packages Decision Brief and routes to human authority
6. Human authority records approval in Decision Log
7. Artifact advances

---

## Artifact Routing Table

| Artifact Type | Verification Class | Signoff Chain | Human Authority |
|---------------|-------------------|---------------|-----------------|
| Commercial proposals, SOWs, pricing pages | HIGH-RISK | Producer → PEA review → pricing-safety-review → QAS → HHC → Founder | Founder |
| Invoices, payment terms | HIGH-RISK | Producer → IGA review → QAS → HHC | Growth Lead (Founder if terms deviate) |
| MSA, NDA, contract language | HIGH-RISK | Producer → LCA → QAS → HHC → Founder + legal counsel | Founder + qualified legal counsel |
| Production release (real systems) | HIGH-RISK | Producer → TVA → SCA → QAS → ARE → HHC | ARE (Class 1–2); Founder (Class 3–4) |
| Client delivery packages | HIGH-RISK | Producer → QDA → disclosure-gate sweep → QAS → HHC → Founder | Founder |
| Agent architecture changes / registry additions | HIGH-RISK | Proposing agent → ARE review → HHC → Founder | Founder + ARE |
| Strategic scope changes (market-facing) | HIGH-RISK | PMA → SRA → QAS → HHC → Founder | Founder |
| Internal documentation, analysis | STANDARD | Producer → peer agent → QAS confirmation | None required |
| Code (non-production) | STANDARD | SEA → TVA review → QAS | ARE notified |

---

## Decision Log Requirement

Every High-Risk artifact produces a Decision Log entry containing:
- Date
- Artifact identifier or description
- Verification class declared
- Agents in the verification chain
- QAS verdict (PROCEED / HOLD)
- Human authority who approved
- Any conditions or caveats attached to the approval

Decision Log file: `02_client-system/[CLIENT-WORKSPACE]/00_admin/decision-log.md` for client projects; `01_system/operations/decision-log.md` for internal governance decisions.

---

## Escalation

If the required human authority is unavailable within the session:
- Log the blocker in the Decision Log: date, artifact, authority needed, blocker description
- HOLD the artifact — do not allow it to advance
- Do not substitute a lower authority for a required higher authority
- Route to HHC to coordinate timing with the correct human

No deadline justifies skipping a required human approval gate.
