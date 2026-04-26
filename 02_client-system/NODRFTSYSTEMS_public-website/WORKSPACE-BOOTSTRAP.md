# Client Workspace Bootstrap

## Objective

Instantiate every accepted client or serious in-review opportunity into the same staged workspace so intake, discovery, strategy, execution, release, handoff, and archive records do not depend on memory or ad hoc folder creation.

## When To Use

Use this kit when:

- a lead has been accepted
- a lead is far enough into review that formal intake records need a workspace home
- an existing client starts a materially new project that needs its own controlled workstream

## Required Inputs

- client legal or operating name
- project title or slug
- intake summary
- intake packet JSON
- qualification decision
- package path or discovery requirement
- accountable owner

## Naming Standard

Recommended workspace naming pattern:

`CLIENTNAME_project-slug`

Use a stable client name and a project slug that is short enough to scan but specific enough to distinguish separate workstreams.

## Required Starter Artifact Pack

### Workspace root

Create `AGENTS.md` as the workspace activation contract. It must require:

- loading `repository-control-plane.md`
- loading `WORKSPACE-BOOTSTRAP.md`
- loading `skill-loading-matrix.md`
- loading `final-approved-department-and-agent-registry.md`
- dynamic cell assembly per `01_system/ai-governance/mandatory-build-activation-protocol-2026-04-15.md` (classify build, assess capability, assign minimum cell — RCA and TVA mandatory on every governed build)
- escalation-only use of `Desmond / HHC`
- explicit startup declaration before substantial work
- a Gate 0A agent routing note before the build packet is approved
- a hard stop when build classification, minimum cell assignment, Gate 0A routing note, or QAS release status are missing

### `00_admin`

Create `client-control-sheet.md` with at least:

```md
# Client Control Sheet

## Verified Facts
- Client name:
- Project name:
- Primary contact:
- Primary decision-maker:
- Package or engagement path:
- Accountable owner:
- Workspace created:

## Authority And Risk
- Budget authority:
- Approval chain:
- Compliance flags:
- Contract status:
- Billing status:

## Active Controls
- Current phase:
- Open decisions:
- Open risks:
- Next required approval:
```

### `01_intake`

Store:

- `intake-summary.txt`
- `intake-packet.json`
- `qualification-decision.md`

Recommended `qualification-decision.md` template:

```md
# Qualification Decision

## Verified Facts
- Intake date:
- Project type:
- Budget band:
- Timeline posture:
- Decision authority:

## Risk Flags
- 

## Recommendation
- Decline / Discovery / Proposal / Founder Review

## Required Next Actions
- 
```

### `02_discovery`

Create `discovery-brief.md` when scope is not yet bounded:

```md
# Discovery Brief

## Objective

## Verified Facts
- 

## In Scope
- 

## Out Of Scope
- 

## Dependencies
- 

## Risks
- 

## Recommended Path
- 
```

### `03_strategy`

Create `strategy-brief.md`:

```md
# Strategy Brief

## Objective

## Verified Facts
- 

## Scope
- 

## Exclusions
- 

## Delivery Direction
- 

## Acceptance Criteria
- 

## Open Decisions
- 
```

### `04_execution`

Create `agent-routing-note.md` as the Gate 0A output before build packet approval. Required fields: build classification, surface map, role-to-surface assignments, capability check, handoff routing plan, capability gaps, and MOA/PMA/RCA sign-off. Use the template at `02_client-system/templates/client-workspace-template/04_execution/agent-routing-note.md`. No build packet may be approved without a completed routing note.

Create `execution-plan.md`:

```md
# Execution Plan

## Workstreams
- 

## Milestones
- 

## Dependencies
- 

## QA Gates
- 

## Required Human Approvals
- 
```

### `05_deliverables`

Create `delivery-register.md`:

```md
# Delivery Register

| Artifact | Status | Location | Client Ready | Notes |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |
```

### `06_handoff`

Create `handoff-checklist.md`:

```md
# Handoff Checklist

- Final deliverables packaged
- Known issues documented
- Access transfer documented
- Support window documented
- Acceptance evidence recorded
```

### `07_archive`

Create `archive-note.md` when the workstream closes:

```md
# Archive Note

## Close Date

## Final Status

## What Remains Active
- 

## Archived Assets
- 

## Follow-Up Risks Or Support Obligations
- 
```

## Operating Rules

- Do not skip `00_admin` or `01_intake`. Those folders anchor control and traceability.
- Do not create strategy artifacts before discovery is complete when the scope is still unclear.
- Do not treat `05_deliverables` as a working-draft folder.
- Do not close a project without `06_handoff` and `07_archive` records.
- Do not begin substantial build work without a truthful startup declaration in the workspace.
- Do not allow substantial build, review, or deployment work to proceed without MOA routing and QAS release status being recorded in the active artifact trail.
- Do not instantiate a new workspace without the root `AGENTS.md` activation contract.

## Acceptance Criteria

The bootstrap kit is working when:

- a new workspace can be created without inventing structure
- intake records have a permanent location
- every phase has a starter artifact for human and AI use
- release and handoff records exist before closure
