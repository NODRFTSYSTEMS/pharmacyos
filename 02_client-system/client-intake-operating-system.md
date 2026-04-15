# Client Intake Operating System

## Objective

Create a complete intake system that captures execution-critical information, routes opportunities by fit and project type, and produces a structured packet that can move into discovery, proposal, or decline without re-interviewing the lead.

## Verified Facts

- The repository contains a working intake surface at `02_client-system/client-intake-form.html`.
- The current intake surface generates local summary and JSON outputs for download or copy.
- The current intake surface does not create a repository-side system of record by itself.
- The repository contains a reusable client workspace template at `02_client-system/templates/client-workspace-template/`.
- Pricing governance already requires Discovery Sprint routing when scope is unclear.
- The approved operating model requires stronger review on commercial, legal-adjacent, compliance-sensitive, and release-critical work.

## Current Implementation Status

The intake system is partially operational:

- usable intake surface exists
- qualification logic exists
- routing logic exists
- reusable workspace skeleton exists

The intake system is not yet fully automated:

- no connected Airtable or equivalent operations database is verified as live
- no automatic workspace creation is verified as live
- no repository-native legal or proposal template set is yet designated as fully operative

Until a live operations database is approved, every intake packet must be manually stored inside the client workspace after acceptance or review.

## Scope

This system covers:

- lead capture
- qualification
- discovery routing
- proposal-readiness routing
- founder escalation
- client workspace entry
- delivery-stage folder structure
- archive discipline

## Exclusions

- outbound prospecting workflows
- full CRM automation build
- accounting software setup
- legal review of contracts

## Intake Stages

### 1. Lead intake

Purpose:

- capture enough verified information to judge fit
- avoid unpaid discovery hidden inside the intake form

Required fields:

- company identity
- primary contact and role
- project title
- business problem
- success condition
- target users
- requested deliverables
- timeline
- budget range
- budget authority
- approval structure
- compliance requirements
- prior vendor context

Required outputs:

- structured packet export
- intake timestamp
- first-pass project classification

### 2. Qualification

Purpose:

- determine whether the opportunity should be declined, routed to discovery, or moved toward proposal

Decision factors:

- scope clarity
- budget realism
- timeline realism
- approval-chain friction
- compliance and security risk
- technical integration load
- evidence of prior delivery friction

### 3. Discovery

Purpose:

- convert ambiguous demand into a bounded brief before pricing or build commitments

Required outputs:

- clarified objective
- in-scope and out-of-scope list
- dependencies
- assumptions
- risks
- recommended package or phased path

### 4. Strategy

Purpose:

- translate discovery into the execution brief used by build and review roles

Required outputs:

- strategy brief
- architecture or delivery direction
- scope boundaries
- acceptance criteria
- QA targets

### 5. Active execution

Purpose:

- move the project through a consistent client workspace rather than ad hoc folders

Required outputs:

- execution plan
- working artifact locations
- approval and risk records

### 6. Deliverables

Purpose:

- separate active work from release-candidate and final outputs

Required outputs:

- delivery register
- release candidate set
- final packaged set

### 7. Handoff

Purpose:

- transfer the finished work without relying on memory or chat logs

Required outputs:

- access transfer note
- known-issues note
- support-window record
- acceptance evidence

### 8. Archive

Purpose:

- close the loop without leaving old work mixed into active folders

Required outputs:

- archive note
- closed-project snapshot
- post-mortem where useful

## Qualification Bands

These bands are the recommended operating interpretation for score-based routing:

- `85-100`: proposal-ready only if scope is already bounded and no high-risk flags remain
- `70-84`: discovery or structured scope clarification required before proposal
- `50-69`: do not quote yet; resolve data gaps, budget ambiguity, or approval friction first
- `0-49`: decline or founder review before additional work

These score bands do not override policy rules. If scope is unclear, Discovery Sprint remains mandatory even when the raw score appears acceptable.

## Mandatory Routing Rules

- unclear scope: route to Discovery Sprint
- undisclosed budget plus vague deliverables: discovery or decline
- more than `3` approvers: high-friction flag
- regulated or high-compliance work: founder review
- unrealistic deadline with fixed scope: re-scope or decline
- retainer request without a current-state baseline: do not route directly into retainer work

## Intake Packet Standard

Every completed intake should produce:

- machine-readable structured packet
- human-readable summary
- qualification recommendation
- risk-flag list
- next-step recommendation
- missing-data list when scope, budget, or authority remains unclear

## Workspace Entry Rule

If the opportunity moves forward, the intake output must be stored in the client workspace using the standard template. Use:

- `02_client-system/templates/client-workspace-template/WORKSPACE-BOOTSTRAP.md`
- `03_agent-skills/client-workspace-bootstrap/SKILL.md`

Minimum repository-side records after acceptance or formal review:

- intake summary
- intake packet JSON
- qualification decision note
- discovery brief when required

## Routing Logic by Project Type

### Website and positioning work

- smaller bounded website scope with ready content:
  - route toward Launch Site or equivalent bounded website package
- authority site with heavier content architecture, proof, multiple forms, bilingual needs, or stronger UX complexity:
  - route toward Authority Website or discovery-backed phased path

### App, portal, or internal tool work

- auth, workflows, and data model are already bounded:
  - route toward Platform Starter or phased build
- multiple roles, multiple surfaces, or integration-heavy work:
  - route toward Ecosystem Build or a phased enterprise path

### Operational or strategic audit work

- if the client needs diagnosis before a build decision:
  - route to Discovery Sprint first

### Growth or ongoing support

- route only after a baseline exists
- do not use a retainer to replace basic scoping discipline

## Manual Record Protocol

Until a live operations database is active, the following steps are mandatory for every accepted or materially reviewed opportunity.

### Steps

1. Download the intake packet JSON from the intake form.
2. Create a client workspace folder under `02_client-system/` using the naming convention `CLIENTNAME_project-slug`.
3. Copy the workspace template from `02_client-system/templates/client-workspace-template/` into the new client folder.
4. Store the intake packet JSON in `01_intake/intake-packet.json`.
5. Complete `01_intake/intake-summary.txt` from the intake submission.
6. Complete `01_intake/qualification-decision.md` using the scoring criteria below.
7. Complete `00_admin/client-control-sheet.md` with authority, risk, and phase controls.
8. Log the intake date, project slug, and routing decision in a running operations note until a database is live.

### Do not proceed to discovery or proposal without steps 1–7 complete.

If the intake packet was not generated from the form (e.g., a referral or direct conversation), recreate it manually using the intake summary template before assigning to a workspace.

## Scoring Criteria

Qualification scoring uses these dimensions. Total must reach the band threshold before routing advances.

| Dimension | Max Points | Guidance |
| --- | --- | --- |
| Budget clarity | 20 | 20 = specific stated budget; 10 = range stated; 0 = unknown or vague |
| Timeline realism | 15 | 15 = feasible timeline with buffer; 8 = tight but achievable; 0 = unrealistic or unstated |
| Decision-maker access | 15 | 15 = decision-maker is the contact; 8 = contact has access to DM; 0 = DM unknown |
| ICP alignment | 20 | 20 = strong ICP match on all signals; 10 = partial match; 0 = weak or misfit |
| Scope clarity | 15 | 15 = clear and bounded; 8 = partially defined; 0 = vague or undefined |
| Red flag reduction | 15 | 15 = zero red flags; 8 = 1–2 manageable flags; 0 = 3+ red flags or a blocker present |

### Band thresholds

- `85–100`: proposal-ready — proceed to PEA with approved package recommendation
- `70–84`: discovery required — route to Discovery Sprint before any pricing conversation
- `50–69`: gaps must close first — return to lead with specific missing-data request; do not schedule discovery without resolution
- `0–49`: decline or Founder Review — do not advance without Founder input

### Red flag trigger list

Any single item below triggers an automatic flag regardless of total score:

- budget authority is unconfirmed
- timeline is fixed and scope is completely undefined
- more than 3 required approvers are identified
- compliance or legal risk is significant and unresolved
- prior delivery friction was disclosed but not explained
- scope requires capabilities not in the approved service catalog

### Override rule

A scoring band does not override policy. If policy requires Discovery Sprint or Founder Review, those gates apply regardless of score.

## Acceptance Criteria

The intake system is operational when:

- an intake submission creates reusable structured outputs
- the packet can be scored without re-reading the whole intake
- policy-based routing is explicit
- every accepted lead can be instantiated into the workspace template
- every client workspace follows the same stage-based structure
- discovery is triggered automatically when scope is still unclear
- manual record steps are completed before any opportunity advances past intake

## Recommended Next Build Order

1. Keep the intake form aligned with the routing rules in this document.
2. Store every accepted or materially reviewed intake inside the client workspace template.
3. Connect the intake outputs to one approved operations database.
4. Port live commercial and legal starter templates once their human approval status is resolved.
