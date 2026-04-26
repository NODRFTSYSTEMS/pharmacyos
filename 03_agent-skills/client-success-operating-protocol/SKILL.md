---
name: client-success-operating-protocol
description: Use to run the recurring client success operating rhythm for any active delivery engagement or maintenance retainer. Coordinates COA, CCA, PSA, RMA, and CHSA into a coherent weekly, monthly, and lifecycle cadence. This is the skill that governs what client success does operationally — not just at onboarding or close-out.
---

# Client Success Operating Protocol

## Use When

- a client is in active delivery (build underway, milestones pending)
- a client is on a live site maintenance retainer
- the weekly or monthly client success cadence is due
- a client health signal (risk flag, milestone miss, communication gap) has been detected
- a retainer renewal cycle is approaching
- a client engagement is winding down toward offboarding

## Required Inputs

- client workspace reference and current project phase (delivery / live / retainer / winding-down)
- CSM context package: current project state, open risks, prior decisions
- CHSA health score if available; if not available, PSA progress summary serves as a proxy
- last client communication date and type
- retainer allocation and usage data (if retainer client)

## Workflow — Operating Cadence

### Every week (all active clients)
1. `PSA` pulls the current project status against milestones and surfaces any blockers or evidence gaps.
2. `CCA` drafts the weekly client update using PSA's status summary and CSM context. One concise update; no fabricated progress signals.
3. Growth Lead reviews and approves the draft before send. `CCA` does not send directly.
4. Log the communication date and type in the client workspace `00_admin/session-log.md`.

### Every month (retainer clients)
5. `RMA` pulls the retainer utilization report. Flag at 80% usage (warning) and 100% (overage alert to Founder per Routine Usage Policy).
6. `CHSA` scores the client health based on communication patterns, milestone delivery, billing status, and issue history.
7. If health score drops below threshold: draft a proactive outreach via `CCA` and escalate the flag to Growth Lead immediately — do not wait for the next scheduled update.
8. Log the health score and utilization in the client workspace `00_admin/session-log.md`.

### At milestone completion
9. `COA` verifies access and deliverable readiness against the milestone definition.
10. `QAS` confirms release status before the milestone communication is drafted.
11. `CCA` drafts the milestone communication only after QAS confirms. No milestone communication before QAS sign-off.

### At risk signal (any time)
12. `CHSA` flags the at-risk signal with evidence (e.g., missed response, scope complaint, billing dispute).
13. `CCA` drafts proactive outreach aligned to the signal type.
14. Escalate to Growth Lead immediately via `HHC` if the signal indicates churn risk, scope conflict, or billing dispute.

### At renewal
15. `RMA` triggers the renewal sequence no later than 30 days before retainer end date.
16. If scope is unchanged: `CCA` drafts the renewal confirmation and routes to Growth Lead for approval before send.
17. If scope changes: `PEA` prepares the renewal proposal. Escalate to Founder before the proposal is sent regardless of value.

### At offboarding
18. Load `handoff-preparation` skill.
19. Load `release-gate-review` skill.
20. `COA` produces the access transfer log.
21. Standard close-out per handover protocol. No files are transferred before Founder approval.

## Outputs

- weekly status packets (PSA summary + CCA draft + Growth Lead approval record)
- monthly health reports (CHSA score + RMA utilization + at-risk flags)
- milestone communication drafts (after QAS sign-off)
- risk escalation notes (routed via HHC)
- renewal trigger records and proposal drafts (routed to Growth Lead + Founder)

## Escalation Behavior

- If client health score drops below threshold, escalate to `HHC → HR-GROWTH` immediately. Do not delay escalation to align with a scheduled reporting cycle.
- If a client raises a scope complaint or scope expansion request, escalate to `MOA → HR-FOUNDER`. Do not negotiate scope changes directly.
- If a retainer overage occurs, escalate to `ARCA → HR-FOUNDER`. Do not absorb overage silently.
- If a renewal negotiation involves non-standard terms, escalate to `CDA` for template population and then to Founder before any commitment is made.
- If a client is unresponsive for more than 14 days during active delivery, flag to Growth Lead via `HHC` as a potential risk signal.

## Do Not Do

- do not send any client-facing communication without Growth Lead review and approval
- do not suppress a health risk flag to maintain a positive reporting tone
- do not run renewal outreach without Founder approval on the proposed terms
- do not advance a milestone communication before QAS confirms release status
- do not treat "the client hasn't complained" as a health score — score against evidence, not absence of complaints
- do not absorb retainer overages without triggering the overage alert to Founder
