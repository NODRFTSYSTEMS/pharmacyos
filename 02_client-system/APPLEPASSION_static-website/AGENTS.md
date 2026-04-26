# NoDrftSystems Workspace Activation Contract

This workspace is governed by the paired NoDrftSystems control repository.

Before doing any substantial build, review, or deployment work, load and follow the canonical copies of:

1. `01_system/operations/repository-control-plane.md`
2. `02_client-system/templates/client-workspace-template/WORKSPACE-BOOTSTRAP.md`
3. `03_agent-skills/skill-loading-matrix.md`
4. `01_system/registry/final-approved-department-and-agent-registry.md`
5. `01_system/ai-governance/mandatory-build-activation-protocol-2026-04-15.md` — required before any governed technical build
6. `01_system/ai-governance/engineering-standards-policy-2026-04-15.md` — required for any technical delivery work
7. `01_system/ai-governance/build-context-engineering-standard-2026-04-15.md` — required for prompt and evidence discipline on governed builds

If the paired control repository cannot be located, stop and escalate. Do not substitute generic platform behavior for workspace-local governance.

## Required Build Cell

Every governed build must have the following minimum active roles before implementation begins. This is the mandatory base activation stack — do not abbreviate it:

- `MOA` — orchestration and activation discipline
- `CSM` — context and state continuity
- `PMA` — build packet control
- `RCA` — repository-context loading (mandatory on every governed build)
- one primary implementation role: SEA / FIS / BLS / IDS / DSS / PIS / POS / ASIS
- `TVA` — verification and reproducibility evidence (mandatory on every governed build)
- separate reviewer reserved under `QAS` authority (reviewer is not part of the implementation cell)

Additional specialists (SAA, DAA, AAA, SCA, DRA) activate conditionally by build class per the mandatory-build-activation-protocol.

Escalation only:

- `Desmond / HHC`

## Required Startup Declaration

Before substantial work begins, record the startup declaration as the first entry in `00_admin/session-log.md` (create the file if it does not exist). The declaration must state:

- governance files loaded (list each)
- active named agents (list each agent code)
- current project phase
- required artifact trail present (confirm each required file exists)
- missing inputs, blockers, or workspace exceptions

Do not proceed with substantial work until this declaration is written. The session log is the verifiable record that governance was followed.

## Required Artifact Trail

No substantial build may proceed unless the workspace contains and is using:

- `03_strategy/strategy-brief.md`
- `04_execution/execution-plan.md`
- `05_deliverables/delivery-register.md`
- `06_handoff/handoff-checklist.md`

## Hard Gates

Stop and escalate if any of the following is true:

- MOA routing has not been recorded
- PMA acceptance criteria do not exist
- QAS release status has not been recorded
- the required artifact trail is missing
- required governance files are unavailable or unread
- a workspace exception exists and has not been explicitly recorded

## Prohibition

No build, review, or deployment may proceed under generic roles alone when approved named agents and local skills exist.
