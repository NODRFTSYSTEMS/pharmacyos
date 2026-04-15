# NoDrftSystems Skill Pack Build Specification

## Objective

Define the exact file and folder structure, naming convention, generation rules, and manifest standard for converting the NoDrftSystems role library into a production skill pack using `/create-skill` or the equivalent skill-initialization workflow.

## Verified Facts

- The repository already contains a workflow-skill layer in `03_agent-skills/` built around reusable cross-project workflows such as intake analysis, documentation reconstruction, pricing safety review, workspace bootstrap, strategy brief creation, release-gate review, and handoff preparation.
- The approved repository registry contains `45` official AI agents across the following operational groups:
  - Supervisor Layer
  - Revenue & Sales
  - Marketing & Content
  - Delivery & Build
  - Quality & Compliance
  - Client Success
  - Finance & Bookkeeping
  - Strategic Intelligence
  - People, Roles & Governance
  - Specialist Pool
- The downloaded `NoDrftSystems_Skills_Library_v1.md` includes those AI roles plus `3` human leadership entries:
  - `HR-FOUNDER`
  - `HR-ARE`
  - `HR-GROWTH`
- The role library therefore functions as a content source for `48` total entries, but only `45` of those entries are loadable AI skill candidates.
- The `skill-creator` instructions require each skill folder to contain a `SKILL.md` file with YAML frontmatter limited to `name` and `description`, and recommend an `agents/openai.yaml` file plus optional `references/`, `scripts/`, and `assets/` folders.
- Skill names must use lowercase letters, digits, and hyphens only.

## Analysis

- The correct next step is not another abstract architecture document. It is a build specification that makes pack generation deterministic.
- The existing workflow-skill system should remain in place. The department and role skill pack should be added alongside it, not mixed into the current root skill folders.
- The approved registry must control which AI skills are generated. The downloaded skills library should supply role behavior, duties, triggers, inputs, outputs, confidence floors, and escalation content.
- Human leadership roles should not be emitted as loadable Codex skills. They should remain escalation authorities referenced by the manifest and by role-skill escalation rules.

## Scope

This specification defines:

- the production folder structure for the department and role skill pack
- the naming convention for department folders and role skill folders
- the shared `SKILL.md` section convention
- the minimum `agents/openai.yaml` convention
- the manifest schema used to route the correct skill when relevant
- the build sequence for `/create-skill`

## Exclusions

- writing all `45` role skills in this document
- replacing the existing workflow-skill folders
- creating a live `/create-skill` command implementation inside this repository
- generating human-authority skills for Founder, ARE, or Growth Lead

## Canonical Source Hierarchy

### Source of truth for role count and department placement

1. `01_system/registry/final-approved-department-and-agent-registry.md`

Use this file for:

- which AI roles exist
- which department folder each AI role belongs to
- approved agent code and canonical name
- official activation status and reporting relationship

### Source of truth for role behavior

2. `90_source-documents/ai-architecture/NoDrftSystems_Skills_Library_v1.md`

Use this file for:

- role objective
- bounded scope
- core duties
- inputs required
- outputs produced
- escalation triggers
- non-permitted actions
- confidence floor
- evidence required before completion

### Source of truth for skill anatomy

3. `C:\Users\nkwtr\.codex\skills\.system\skill-creator\SKILL.md`

Use this file for:

- permitted skill folder anatomy
- frontmatter limits
- naming rules
- validation expectations

## Production Target Structure

The role skill pack should be added as a new sublayer under `03_agent-skills/`:

```text
03_agent-skills/
|-- skill-loading-matrix.md
|-- skill-pack-build-specification.md
|-- manifest/
|   `-- skill-pack-manifest.yaml
|-- department-skill-pack/
|   |-- supervisor-layer/
|   |-- revenue-sales/
|   |-- marketing-content/
|   |-- delivery-build/
|   |-- quality-compliance/
|   |-- client-success/
|   |-- finance-bookkeeping/
|   |-- strategic-intelligence/
|   |-- people-roles-governance/
|   `-- specialist-pool/
`-- authority-routing/
    `-- human-authority-map.md
```

## Department Folder Rules

Use exactly these department folder names:

- `supervisor-layer`
- `revenue-sales`
- `marketing-content`
- `delivery-build`
- `quality-compliance`
- `client-success`
- `finance-bookkeeping`
- `strategic-intelligence`
- `people-roles-governance`
- `specialist-pool`

Do not create alternate variants such as `sales`, `marketing`, `ops`, `client-success-team`, or `governance`.

## Role Skill Folder Naming Convention

### Folder formula

Each role skill folder must use:

`<agent-code-lower>-<canonical-name-hyphen>`

Examples:

- `moa-master-orchestrator-agent`
- `qas-quality-assurance-supervisor`
- `pea-proposal-engine-agent`
- `moa-g-market-opportunity-agent`

### Rules

- Convert the agent code to lowercase.
- Preserve internal hyphens in codes such as `MOA-G`.
- Convert the canonical name to lowercase hyphen-case.
- Use the approved registry canonical name, not the Caribbean name, in the folder slug.
- Do not include spaces, underscores, ampersands, parentheses, or version markers.
- Do not use the human-readable Caribbean name in the folder slug.

## Required Skill Folder Anatomy

Every role skill folder must contain:

```text
<department-folder>/
`-- <skill-folder>/
    |-- SKILL.md
    |-- agents/
    |   `-- openai.yaml
    `-- references/
        `-- role-charter.md
```

### Required files

- `SKILL.md`
- `agents/openai.yaml`
- `references/role-charter.md`

### Optional files

- `references/escalation-rules.md`
- `references/examples.md`
- `scripts/`
- `assets/`

Do not add auxiliary files such as `README.md`, `CHANGELOG.md`, or `INSTALLATION_GUIDE.md`.

## Shared `SKILL.md` Convention

Every generated role skill must follow the same section order.

### Frontmatter

Use only:

```yaml
---
name: moa-master-orchestrator-agent
description: Route work to the correct NoDrftSystems agent sequence, assign dependencies, and detect workflow stalls. Use when work needs orchestration, task routing, dependency mapping, queue control, or escalation due to missing ownership.
---
```

Rules:

- `name` must exactly match the folder name.
- `description` must state what the role does and when it should load.
- Do not add extra frontmatter fields.

### Body section order

Use this exact section sequence:

1. `# <Display Title>`
2. `## Use When`
3. `## Required Inputs`
4. `## Workflow`
5. `## Outputs`
6. `## Escalation Behavior`
7. `## Do Not Do`

### Content mapping

Map the library source fields into the body as follows:

- `Role`, `Primary Objective`, and `Bounded Scope` inform `Use When`
- `Inputs Required` becomes `Required Inputs`
- `Core Duties` becomes `Workflow`
- `Outputs Produced` becomes `Outputs`
- `Escalation Triggers`, `Reports To (AI)`, `Human Owner`, and `Confidence Floor` become `Escalation Behavior`
- `Non-Permitted Actions` becomes `Do Not Do`

Do not copy KPI sections into every `SKILL.md` body unless they materially change execution behavior. Keep detailed role evidence and KPI material in `references/role-charter.md`.

## `references/role-charter.md` Convention

Each role skill must include a normalized role charter containing:

- agent code
- Caribbean name
- canonical name
- department
- activation status
- role
- primary objective
- bounded scope
- core duties
- inputs required
- outputs produced
- reports to (AI)
- human owner
- escalation triggers
- non-permitted actions
- success metrics
- confidence floor
- evidence required before completion
- source file references

Purpose:

- preserve the full role record
- keep the main `SKILL.md` concise
- provide a stable source for regeneration and audit

## `agents/openai.yaml` Convention

Generate `agents/openai.yaml` for every role skill.

Use these interface conventions:

- `display_name`: `<AGENT CODE> - <Canonical Name>`
- `short_description`: one sentence describing the role's bounded function
- `default_prompt`: `Use <AGENT CODE> to <primary action> within NoDrftSystems rules and escalate when authority or confidence limits are reached.`

Do not include optional presentation fields unless explicitly approved.

## Manifest Standard

Create exactly one manifest file:

`03_agent-skills/manifest/skill-pack-manifest.yaml`

### Manifest purpose

The manifest is the routing index for the department skill pack. It is not a replacement for `skill-loading-matrix.md`.

- `skill-loading-matrix.md` remains the workflow-skill routing document.
- `skill-pack-manifest.yaml` becomes the role-skill routing and generation index.

### Required top-level fields

```yaml
version: 1
generated_at: 2026-04-14
source_priority:
  approved_registry: 01_system/registry/final-approved-department-and-agent-registry.md
  skill_library: 90_source-documents/ai-architecture/NoDrftSystems_Skills_Library_v1.md
  skill_creator: C:/Users/nkwtr/.codex/skills/.system/skill-creator/SKILL.md
pack_root: 03_agent-skills/department-skill-pack
authority_routing:
  founder: HR-FOUNDER
  are: HR-ARE
  growth_lead: HR-GROWTH
skills: []
```

### Required per-skill fields

Each `skills` entry must contain:

- `skill_id`
- `agent_code`
- `canonical_name`
- `caribbean_name`
- `department`
- `path`
- `activation_status`
- `load_priority`
- `trigger_terms`
- `workflow_tags`
- `required_inputs`
- `outputs`
- `confidence_floor`
- `escalates_to_ai`
- `escalates_to_human`
- `source_status`

### Example manifest entry

```yaml
- skill_id: moa-master-orchestrator-agent
  agent_code: MOA
  canonical_name: Master Orchestrator Agent
  caribbean_name: Zayne
  department: supervisor-layer
  path: 03_agent-skills/department-skill-pack/supervisor-layer/moa-master-orchestrator-agent
  activation_status: always-on
  load_priority: core
  trigger_terms:
    - route work
    - orchestrate tasks
    - assign agents
    - dependency map
    - workflow stall
  workflow_tags:
    - orchestration
    - routing
    - dependency-management
  required_inputs:
    - task brief
    - project registry
    - agent availability
    - SOP reference
    - context package
  outputs:
    - task assignments
    - dependency maps
    - routing logs
    - workflow status summaries
  confidence_floor: 85
  escalates_to_ai:
    - HHC
  escalates_to_human:
    - HR-ARE
    - HR-FOUNDER
  source_status: approved
```

## Human Authority Handling

Human leadership entries are not loadable skills.

Do not run `/create-skill` for:

- `HR-FOUNDER`
- `HR-ARE`
- `HR-GROWTH`

Instead:

- record them in `authority-routing/human-authority-map.md`
- reference them in manifest escalation fields
- use them as escalation targets from AI role skills

## `/create-skill` Build Convention

The actual `/create-skill` command is not verifiable from repository files alone. This specification defines the required output convention when that command or an equivalent initializer is used.

### Required generation sequence

1. Resolve the role from the approved registry.
2. Resolve the behavior from the skills library.
3. Create the department folder if missing.
4. Initialize the role skill folder using the approved slug.
5. Generate `SKILL.md` using the shared section convention.
6. Generate `agents/openai.yaml`.
7. Generate `references/role-charter.md`.
8. Add or update the manifest entry.
9. Validate the skill folder.

### Required path convention

Use:

`03_agent-skills/department-skill-pack/<department-folder>/<skill-folder>/`

### Example generation target

For `PEA`:

`03_agent-skills/department-skill-pack/revenue-sales/pea-proposal-engine-agent/`

## Required Department Pack Inventory

The production pack must contain these AI role skill folders.

### `supervisor-layer`

- `moa-master-orchestrator-agent`
- `qas-quality-assurance-supervisor`
- `csm-context-state-manager`
- `hhc-human-handoff-coordinator`

### `revenue-sales`

- `sda-sales-development-agent`
- `ooa-outreach-orchestration-agent`
- `crma-crm-operations-agent`
- `pea-proposal-engine-agent`
- `dcpa-discovery-call-prep-agent`

### `marketing-content`

- `cea-content-engine-agent`
- `bca-brand-consistency-agent`
- `staa-seo-technical-audit-agent`
- `dsa-distribution-scheduling-agent`
- `cpa-campaign-performance-agent`

### `delivery-build`

- `pma-product-manager-agent`
- `sea-software-engineer-agent`
- `daa-design-assistance-agent`
- `aaa-accessibility-audit-agent`
- `dra-deployment-readiness-agent`

### `quality-compliance`

- `qda-qa-documentation-agent`
- `qadm-qa-drift-monitor-agent`
- `ipga-ip-guardian-agent`
- `sca-security-compliance-agent`
- `bpa-bilingual-parity-agent`
- `pla-plain-language-agent`

### `client-success`

- `coa-client-onboarding-agent`
- `cca-client-communication-agent`
- `rma-retainer-management-agent`
- `psa-project-status-agent`

### `finance-bookkeeping`

- `iga-invoice-generation-agent`
- `arca-accounts-receivable-collections-agent`
- `ecfa-expense-cash-flow-agent`
- `fra-financial-reporting-agent`

### `strategic-intelligence`

- `tsa-trend-surveillance-agent`
- `moa-g-market-opportunity-agent`
- `chsa-client-health-score-agent`

### `people-roles-governance`

- `prga-people-roles-governance-agent`
- `pca-prompt-configuration-agent`
- `taca-tooling-access-control-agent`
- `kdga-knowledge-documentation-governance-agent`
- `vpca-vendor-procurement-control-agent`

### `specialist-pool`

- `cda-contract-drafting-assistant`
- `tca-transcreation-agent`
- `pdb-presentation-deck-builder`
- `desa-data-extraction-structuring-agent`

## Quality Gates

The skill pack build is not complete unless all of the following are true:

- every approved AI role has exactly one skill folder
- no human leadership role is emitted as a loadable skill
- every skill folder contains `SKILL.md`, `agents/openai.yaml`, and `references/role-charter.md`
- every skill `name` matches its folder slug exactly
- every manifest entry points to a real folder
- department names are consistent with this specification
- workflow skills and role skills remain separated

## Recommended Next Build Order

1. Create `manifest/skill-pack-manifest.yaml`.
2. Create empty department folders under `department-skill-pack/`.
3. Generate the `4` supervisor-layer skills first.
4. Generate `Revenue & Sales` and `People, Roles & Governance` next because they control intake, proposals, prompt governance, and tool governance.
5. Generate the remaining departments in approved-registry order.
6. Validate each generated skill before moving to the next department.

## Unknowns / Data Gaps

- Not verifiable with available data: whether `/create-skill` exists as a literal command in the user's preferred environment or is only shorthand for the `skill-creator` workflow.
- Not verifiable with available data: whether every role will eventually require additional `references/` files beyond `role-charter.md`.
