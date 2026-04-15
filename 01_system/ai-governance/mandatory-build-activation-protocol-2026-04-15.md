# Mandatory Build Activation Protocol

Status: canonical governance  
Date: 2026-04-15  
Owners: Founder, ARE, PRGA, QAS  
Confidentiality: proprietary internal framework; no external publishing approved  
Purpose: define the mandatory activation logic, preconditions, role minimums, review gates, and stop conditions for any governed technical build

## 1. Verified Facts

- The active operating model uses the smallest viable sophisticated cell, not full-bench activation.
- Reviewer authority remains separate from the implementation cell.
- The technical bench has been expanded and the current working registry now reflects `55` official agents, including additional assistants and specialists in `Delivery & Build` and the `Specialist Pool`.
- The framework is proprietary internal operating infrastructure and is not approved for external publishing.

## 2. Analysis

### Objective

Prevent technically weak, under-scoped, under-reviewed, or under-governed build work from starting.

### Scope

This protocol applies to:

- new feature builds
- bug-fix builds
- refactors that affect executable behavior
- integration work
- schema, infrastructure, and deployment-sensitive work
- governed technical prototypes that may later become production work

### Required Elements

- explicit build classification
- mandatory activation preconditions
- agent capability assessment before execution
- minimum build cell before work starts
- mandatory planning phase
- explicit agent assessment and handoff routing gate before packet approval
- separate reviewer assignment before review begins
- evidence package before merge or release
- structured completion reporting
- stop conditions when the build becomes unsafe or ambiguous

### Exclusions

- non-technical brainstorming
- non-governed scratch experiments explicitly marked outside controlled delivery
- pure document edits that do not change prompts, tooling, code behavior, release posture, or governance state

### Core Rule

No governed build starts because someone wants code quickly.

A governed build starts only when:

- the build is classified
- the relevant and capable agent set has been assessed
- the minimum cell is assigned
- the handoff path is defined
- the reviewer path is reserved
- the prompt and tool surface is approved
- the task packet is complete enough to execute without improvisation

### Mandatory No-Start Conditions

The build must not activate if any of the following are missing:

- objective
- bounded scope
- exclusions
- acceptance criteria
- risk classification
- named human owner
- named implementation lead
- assessed relevant and capable agent set
- named handoff path for work that moves across roles or domains
- named separate reviewer path
- approved prompt and tool surface
- persistent root contract and scoped rules available for the build
- planning output completed before execution
- controlled working branch or review surface

### Mandatory Base Activation Stack

Every governed build must have the following minimum active roles before implementation begins:

- `MOA` for orchestration and activation discipline
- `CSM` for context and state continuity
- `PMA` for build packet control
- `RCA` for repository-context loading
- one primary implementation role
- `TVA` for verification and reproducibility evidence
- separate reviewer reserved under `QAS` authority

Implementation roles that can satisfy the primary implementation requirement:

- `SEA`
- `FIS`
- `BLS`
- `IDS`
- `DSS`
- `PIS`
- `POS`
- `ASIS`

The reviewer is mandatory but is not part of the implementation cell.

### Mandatory Build Classification

Every build must be classified before activation.

| Build Class | Typical Scope | Mandatory Build Cell | Conditional Additions | Human Gate |
| --- | --- | --- | --- | --- |
| Class 1: corrective build | small bug fix, contained behavior repair, low-surface change | `MOA`, `CSM`, `PMA`, `RCA`, one implementation role, `TVA` | `DAA` if UI-sensitive | ARE review through the approved human approval path if production-facing |
| Class 2: standard feature build | bounded feature, UI flow, API extension, moderate complexity | `MOA`, `CSM`, `PMA`, `SAA`, `RCA`, one or two implementation roles, `TVA` | `DAA`, `AAA` if relevant | ARE review through the approved human approval path before production release |
| Class 3: integration or data-sensitive build | third-party integration, auth, billing, schema-touching, unstable codebase | `MOA`, `CSM`, `PMA`, `SAA`, `RCA`, `IDS`, primary implementation role, `TVA` | `DSS`, `SCA`, `DAA` | ARE review through the approved human approval path is mandatory |
| Class 4: platform or system-critical build | deployment pipeline, infrastructure, runtime behavior, performance, agent-system wiring | `MOA`, `CSM`, `PMA`, `SAA`, `RCA`, primary implementation role, `TVA` | `PIS`, `POS`, `ASIS`, `SCA`, `DRA` | ARE and Founder review through the approved human approval path where policy requires |

### Activation Rules for New Technical Hires

Use the expanded technical bench when the task actually requires it.

- activate `SAA` when architecture, dependency planning, or boundary-setting is non-trivial
- activate `RCA` on every governed build unless a documented exception is approved
- activate `FIS` when interface behavior, component fidelity, or client-side state is the primary work
- activate `BLS` when business logic, API behavior, or server-side execution is the primary work
- activate `IDS` when third-party wiring, debugging, or defect isolation is material
- activate `TVA` on every governed build unless the task does not change executable behavior
- activate `DSS` when schema, migrations, database typing, or data integrity risk exists
- activate `PIS` when infrastructure, environment, CI, deployment, or platform behavior is material
- activate `POS` when performance risk or optimization scope is explicit
- activate `ASIS` when agent coordination, internal automation surfaces, or tool-chain orchestration is material

### Agent Relevance and Capability Assessment Rule

Before execution begins, `MOA`, `PMA`, and `RCA` must confirm that the selected implementation and support roles are both:

- relevant to the actual task surface
- capable of executing the task class with the required precision

Assessment must consider:

- affected technical surfaces
- implementation domain fit
- repo or module familiarity
- trust, disclosure, privacy, or data-integrity sensitivity
- integration and debugging complexity
- verification burden
- whether the build is likely to require a later handoff to another specialist

If the active role set is relevant but not sufficiently capable, the build does not start until the correct specialist or assistant is added.

If the role set is capable in principle but no longer relevant to the active task surface, the build must be reassigned or handed off.

### Mandatory Activation Sequence

#### Gate 0: Build Intake

Required actions:

- classify the build
- identify the affected surfaces
- assess which agents are relevant and capable for the task
- assign the human owner
- assign the build lead
- define the likely handoff path if work crosses domains
- assign the reviewer path

#### Gate 0A: Agent Assessment & Handoff Routing

Before the build packet is approved, `MOA`, `PMA`, and `RCA` must complete an explicit agent-assessment and produce a bounded handoff plan.

**Assessment steps:**

1. **Surface mapping** — List every technical surface affected by the build (frontend, backend, API, database, infrastructure, third-party integration, agent-system wiring, performance path, security boundary).
2. **Role-to-surface matching** — Map each affected surface to the smallest set of relevant and capable agents from the 55-agent approved registry:
   - Architecture / boundary-setting → `SAA`
   - Repository context / pattern inventory → `RCA`
   - Frontend UI / component implementation → `FIS`
   - Backend API / business logic → `BLS`
   - Third-party integration / debugging → `IDS`
   - Database schema / migrations → `DSS`
   - Infrastructure / deployment / CI → `PIS`
   - Performance optimization → `POS`
   - Agent-system integration / orchestration → `ASIS`
   - UI design fidelity → `DAA`
   - Accessibility compliance → `AAA`
   - Security / compliance review → `SCA`
   - Deployment readiness → `DRA`
   - Test design / verification evidence → `TVA`
3. **Capability check** — For each proposed agent, confirm:
   - The agent's skill pack exists and is loadable.
   - The agent's bounded scope covers the specific task surface.
   - The agent has the required inputs available (specs, contracts, context, test baseline).
   - No cheaper or more focused agent can own the same surface with equal or better precision.
4. **Overlap elimination** — If two agents could claim the same surface, assign a primary owner and define the other as consult-only or reviewer.
5. **Handoff routing plan** — Document the expected execution sequence:
   - Which agent starts the work.
   - Under what condition the work hands off to the next agent.
   - The exact bounded surface being transferred at each handoff.
   - The evidence package that must accompany each handoff.
   - The fallback agent if the primary agent stalls or hits a confidence-floor breach.

**Output:** A signed-off `agent-routing-note` attached to the build packet containing:
- assigned cell list with justification per role
- handoff sequence and trigger conditions
- evidence requirements between handoffs
- any capability gaps and how they will be closed before execution

If the agent assessment cannot produce a clean routing plan, the build does not activate.

#### Gate 1: Build Packet Approval

`PMA` must produce a build packet containing:

- objective
- scope
- exclusions
- dependencies
- acceptance criteria
- risk level
- required evidence
- release sensitivity
- **agent routing note (from Gate 0A)**

If the build packet is weak, the build does not activate.

#### Gate 1A: Mandatory Plan Mode

Before implementation starts, the build must enter Plan Mode or its local equivalent planning phase.

Minimum planning output:

- build class
- selected active cell
- reason the selected cell is the relevant and capable set
- affected surfaces
- verification plan
- release sensitivity
- expected completion-report shape

#### Gate 2: Governance Check

Before implementation starts, confirm:

- persistent root contract is active
- scoped rules are loaded
- approved build prompt stack is loaded
- prompts are approved for the active roles
- tools are approved for the active roles
- repo context has been loaded
- the correct specialist set is activated
- the handoff path is defined for adjacent specialist domains
- the reviewer remains outside the build cell

#### Gate 3: Controlled Execution

Implementation may begin only after Gates 0 to 2 pass.

Execution rules:

- do not expand scope without reclassification
- do not switch model, prompt, or tool power mid-build without approval
- do not bypass specialist activation when the task surface changes materially
- do not keep work with an agent that is no longer the most relevant and capable owner for the active surface
- hand off explicitly when the work moves from one domain to another
- do not treat self-review as reviewer coverage

#### Gate 3A: Mandatory Handoff Discipline

When work must move across roles or domains, the handoff must state:

- the sending role
- the receiving role
- the reason for the handoff
- the exact bounded surface being transferred
- the current status of evidence, tests, and known risks
- the decision or output expected from the receiving role

Handoffs must go to the relevant and capable agent, not simply the currently active or most available one.

#### Gate 4: Evidence Package

Before review, the build must produce the relevant evidence subset:

- typecheck
- lint
- test results
- build result
- preview or runnable artifact
- trace or failure evidence where behavior changed
- evidence-ledger update
- implementation notes where future context would otherwise be lost

#### Gate 4A: Structured Completion Report

Before release advancement, the build must produce a structured completion report covering:

- objective completed
- scope completed
- exclusions preserved
- surfaces changed
- tests and evidence
- open risks
- reviewer outcome
- release status

#### Gate 5: Independent Review

Independent review must confirm:

- scope was met
- exclusions were respected
- evidence is credible
- required specialists were activated
- no unapproved prompt or tool drift occurred

#### Gate 6: Release Readiness

When release or deployment is implicated:

- `DRA` checks deployment readiness
- `QDA` packages evidence when release documentation is required
- `QAS` confirms control-path completion
- human ARE approval runs through the approved human approval path before production release for real systems or client access

### Mandatory Stop Conditions

The build must pause immediately if any of the following occur:

- scope exceeds the classified build level
- the task packet becomes invalid
- required specialist coverage is missing
- the active role set is no longer the relevant and capable set for the work in front of it
- a required handoff cannot be completed cleanly
- reviewer independence is compromised
- prompt or tool drift is introduced without approval
- test or trace evidence exposes unresolved critical behavior
- security, privacy, or data-integrity risk appears unexpectedly
- the team cannot explain what changed, why it changed, and how it was verified

### Escalation Rules

If the build exceeds the normal classified model and cannot be contained safely inside the active build class, route immediately to `exceptional-build-escalation-protocol-2026-04-15.md`.

Route escalation through `HHC` to `ARE` and the relevant governance roles when:

- model or prompt changes are needed mid-build
- tool access is insufficient
- the repository lacks required protections
- the implementation role set is no longer adequate for the task
- the correct handoff target is unclear or disputed
- the release path touches security, client data, billing, or production infrastructure

Route escalation through `HHC` to Founder when:

- the build changes market-facing behavior materially
- the build alters offer scope, pricing-linked functionality, or strategic product posture
- the build creates exceptional delivery or liability exposure

### Dependencies

- current working registry
- engineering standards policy
- build context engineering standard
- merge-gate enforcement spec
- approved prompt and tool inventory
- reviewer coverage under `QAS`

### Risks

- activating too few roles will recreate the same quality failure
- activating the wrong roles will create noise without sophistication
- missing reviewer reservation will push weak work into late-stage conflict
- build activation without repo context will produce pattern drift and avoidable defects

### Acceptance Criteria

This protocol is working only when:

- no governed build starts without classification and a complete build packet
- every governed build completes Gate 0A agent assessment and handoff routing before the build packet is approved
- every governed build has `RCA`, one implementation lead, `TVA`, and a separate reviewer path
- every governed build uses an approved root contract and scoped prompt stack
- specialist activation matches actual build risk
- handoffs are explicit, bounded, and routed to the correct capable role per the agent-routing-note
- evidence exists before independent review
- structured completion reporting exists before release advancement
- release-sensitive work cannot reach production without `DRA`, `QAS`, and human gate completion

### Recommended Next Build Order

1. Approve this protocol into the canonical governance layer.
2. Draft the ten new role charters so activation boundaries are explicit.
3. Build the corresponding skill packs.
4. Instantiate the activation and handoff checklist for the first governed repository and client profile.
5. Populate the repository-agent capability map for the first governed repository.
6. Apply the activation checklist to the next real governed build.
7. Audit the first three activations for over-activation, under-activation, handoff failures, and review failures.

## 3. Unknowns / Data Gaps

- The live reviewer roster by repository is not yet fully defined in repository-native form.
- The exact first repository to adopt this protocol is not yet specified.
- The active prompt and tool inventory still needs a fully canonical populated registry artifact.
- The repository-agent capability map template now exists, but the live populated map does not yet exist for any specific repository in this repository.

## 4. Conclusion

The mandatory rule is simple: no governed build begins without the right small cell, the right packet, the right controls, the right relevant and capable agents, and a separate reviewer path. Speed is not a valid reason to bypass activation discipline.
