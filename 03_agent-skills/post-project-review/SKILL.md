---
name: post-project-review
description: Use when a project has been delivered, accepted, and is entering close-out or archival. Runs structured retrospective, knowledge integrity check, client health update, retainer opportunity assessment, and workspace archival. Load after the handoff-preparation skill completes and client acceptance is confirmed.
---

# Post-Project Review

## Use When

- A project delivery has been accepted by the client
- A Discovery Sprint has concluded with a go/no-go decision and the sprint deliverable is final
- An engagement is entering archival following client handoff
- A retainer engagement ends and a formal close-out is required
- A proprietary product build phase has concluded and the phase is being sealed

Do not load this skill before the `handoff-preparation` workflow is complete and client acceptance is on file.

## Required Inputs

- Client workspace reference (path to the active `02_client-system/[CLIENT-WORKSPACE]/`)
- Accepted handoff package or confirmed delivery artifacts
- QA pass records from `05_deliverables/`
- Client communication thread or acceptance confirmation
- PSA (Donovan) project status log
- CHSA (Lennox) client health score (if available)

## Workflow

### Phase 1 — Delivery Verification

1. Confirm client acceptance is documented. If acceptance is verbal only, route to CCA (Renzo) to obtain written confirmation before proceeding.
2. Confirm all QA passes (1–7) are recorded in `05_deliverables/`.
3. Confirm the disclosure gate sweep was completed and logged in `06_handoff/`.
4. Confirm Founder approval for the handoff is on file (per `handover_protocol.md` Gate 5).
5. If any gate is incomplete: STOP. Do not archive until the handover protocol is fully executed.

### Phase 2 — Knowledge Integrity Check

6. Load `knowledge-integrity-sweep` workflow skill.
7. Review delivered artifacts and any public-facing claims for:
   - Statistics, metrics, or testimonials used in the work — all must have a verified source on file
   - Any client-specific claims in copy that must not persist in template content
   - Any outdated pricing, feature claims, or regulatory language that was corrected during QA
8. Log the knowledge integrity sweep result in the workspace `07_archive/` folder.

### Phase 3 — Retrospective Analysis (PMA + QDA)

9. PMA (Keon) and QDA (Patrice) produce a retrospective note covering:
   - What was scoped vs. what was delivered — any scope creep, unscoped additions, or delivery gaps
   - QA defects by class: how many Critical, Important, Enhancement — what was found and when
   - Timeline performance: delivery vs. contracted timeline — on time, delayed, early
   - Client communication quality: escalations, approval delays, change requests
   - Process strengths and recurring friction points
10. Flag any pattern that should update a skill, template, or governance rule. Route to KDGA (Mikael) for documentation if the finding is operationally significant.

### Phase 4 — Client Health Score Update (CHSA)

11. CHSA (Lennox) updates the client health score based on:
    - Delivery quality and acceptance outcome
    - Payment timeliness and collections status
    - Client responsiveness and decision-making clarity
    - Whether the engagement was delivered within budget, over, or under
    - Stated satisfaction or dissatisfaction signals
12. Record the updated health score in the client workspace control sheet (`00_admin/`).

### Phase 5 — Retainer and Renewal Assessment (RMA + SDA)

13. RMA (Celeste) assesses retainer opportunity:
    - Is there ongoing maintenance, content, or support scope that justifies a retainer proposal?
    - Is the client health score above the retainer-eligible threshold?
    - Has the client expressed interest in ongoing services?
14. If retainer potential is HIGH: route to SDA (Marlon) to initiate a retainer proposal sequence via `proposal-assembly`.
15. If retainer potential is LOW or client health is below threshold: log the rationale and close the engagement.

### Phase 6 — Financial Close-Out (IGA + ARCA)

16. IGA (Shanice) confirms all invoices are issued and recorded.
17. ARCA (Ricardo) confirms all payments are received or that any outstanding balance has a documented collections plan.
18. If any payment is outstanding at close-out: do not archive — keep the workspace at HOLD status until resolved. Route to Founder.
19. ECFA (Janelle) records the final engagement financials in the cash flow log.

### Phase 7 — Workspace Archival

20. Update the client workspace status to `ARCHIVED` in the document registry (`01_system/registry/document-registry.md`).
21. Move or update the workspace control sheet to reflect close date, final delivery date, and engagement summary.
22. Log the workspace archival in the Decision Log with date and confirming authority.
23. NoDrftSystems access revocation: confirm all NoDrftSystems-held credentials or access for client systems have been revoked and logged in `06_handoff/access_log.md`.
24. Store the completed retrospective note in `07_archive/retrospective-[YYYY-MM-DD].md`.

## Outputs

- Knowledge integrity sweep result
- Retrospective note in `07_archive/`
- Updated client health score in workspace control sheet
- Retainer opportunity assessment (HIGH / LOW / NOT APPLICABLE with rationale)
- Financial close-out confirmation from IGA and ARCA
- Document registry entry updated to ARCHIVED
- Access revocation log entry

## Escalation Behavior

**Escalates to Founder when:**
- Client acceptance has not been obtained and the client is unresponsive past 14 days of handoff
- Outstanding payment remains unresolved at close-out
- Retrospective identifies a Critical-class defect that was delivered to the client without disclosure
- IP or NDA scope questions arise during archival

**Escalates to ARE when:**
- A technical process gap is identified that requires a skill or template update
- A QA failure pattern is systemic across multiple engagements

**Escalates to KDGA when:**
- A retrospective finding warrants a governance rule, template, or skill update

## Do Not Do

- Do not archive a workspace when any handover protocol gate is incomplete
- Do not close out financials when any invoice or payment is outstanding without a documented plan
- Do not update public proof assets (case studies, testimonials) without `reviewer_public_proof` verification
- Do not retain NoDrftSystems access credentials after the revocation confirmation is logged
- Do not skip the knowledge integrity sweep for any engagement that produced public-facing content
