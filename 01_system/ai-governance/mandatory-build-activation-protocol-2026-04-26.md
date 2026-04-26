# Mandatory Build Activation Protocol

Status: canonical governance  
Date: 2026-04-15  
Last amended: 2026-04-26 — Confirmed current by Founder review; filename updated from 2026-04-15 to 2026-04-26 to reflect active review date. Prior amendment 2026-04-19: VECS public-route overlay added; 60-agent references aligned; Tier 1/ARE live-deployment status reconciled in the canonical docs.  
Owners: Founder, ARE, PRGA, QAS  
Confidentiality: proprietary internal framework; no external publishing approved  
Purpose: define the mandatory activation logic, preconditions, role minimums, review gates, and stop conditions for any governed technical build

## 1. Verified Facts

- The active operating model uses the smallest viable sophisticated cell, not full-bench activation.
- Reviewer authority remains separate from the implementation cell.
- The technical bench has been expanded and the current working registry now reflects `60` official agents, including additional assistants and specialists in `Delivery & Build` and the `Specialist Pool`.
- Tier 1 supervisor agents and ARE are live in `.claude/agents/`.
- VECS is now defined in canonical governance as a permanent architectural overlay for public commercial routes, executed through the existing approved bench.
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
- public-facing commercial route systems where executable structure, interaction states, or proof presentation materially change

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
| Class 1: corrective build | small bug fix, contained behavior repair, low-surface change | `MOA`, `CSM`, `PMA`, `RCA`, one implementation role, `TVA` | `DAA` if UI-sensitive | ARE technical review if production-facing; Founder human gate where policy requires |
| Class 2: standard feature build | bounded feature, UI flow, API extension, moderate complexity | `MOA`, `CSM`, `PMA`, `SAA`, `RCA`, one or two implementation roles, `TVA` | `DAA`, `AAA` if relevant | ARE technical review before production release; Founder human gate where policy requires |
| Class 3: integration or data-sensitive build | third-party integration, auth, billing, schema-touching, unstable codebase | `MOA`, `CSM`, `PMA`, `SAA`, `RCA`, `IDS`, primary implementation role, `TVA` | `DSS`, `SCA`, `DAA` | ARE technical review is mandatory; Founder human gate where policy requires |
| Class 4: platform or system-critical build | deployment pipeline, infrastructure, runtime behavior, performance, agent-system wiring | `MOA`, `CSM`, `PMA`, `SAA`, `RCA`, primary implementation role, `TVA` | `PIS`, `POS`, `ASIS`, `SCA`, `DRA` | ARE and Founder review through the approved human approval path where policy requires |

### Mandatory VECS Overlay For Public Commercial Routes

Any governed build that materially changes a homepage, packages page, case-study route, service page, or other public commercial route must add the VECS overlay.

Minimum VECS overlay roles:

- `VDA`
- `DAA`

Conditional VECS additions:

- `FIS` when route changes are executable
- `BCA` when trust posture, anti-generic pattern selection, or visual differentiation is material
- `STAA` when restructuring can affect semantics, crawlability, or internal linking
- `AAA` whenever motion, readability, or reduced-motion handling changes
- `PLA` when CTA clarity, scannability, or comprehension changes materially
- `BPA` when bilingual route parity exists
- `QDA` plus `reviewer_public_proof` whenever metrics, testimonials, logos, before/after evidence, or proof bands are touched

Hard rule: no public commercial route build may proceed as "frontend-only" work. Route hierarchy, proof posture, readability, accessibility, and release controls must be explicitly routed.

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
2. **Role-to-surface matching** — Map each affected surface to the smallest set of relevant and capable agents from the 60-agent approved registry:
   - Architecture / boundary-setting → `SAA`
   - Repository context / pattern inventory → `RCA`
   - Frontend UI / component implementation → `FIS`
   - Backend API / business logic → `BLS`
   - Third-party integration / debugging → `IDS`
   - Database schema / migrations → `DSS`
   - Infrastructure / deployment / CI → `PIS`
   - Performance optimization → `POS`
   - Agent-system integration / orchestration → `ASIS`
   - Public-route hierarchy / proof presentation / CTA-path architecture → `VDA`
   - UI design fidelity → `DAA`
   - Brand posture / anti-generic pattern control → `BCA`
   - Search semantics / crawlability after route restructuring → `STAA`
   - Plain-language CTA clarity / scannability → `PLA`
   - Bilingual route parity after structural change → `BPA`
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

- persistent root contract is active (`CLAUDE.md` loaded)
- scoped rules are loaded — verify `.claude/rules/` behavioral constraints are active:
  - `plan_mode.md` — 7-phase sequence enforced
  - `github_disclosure_gate.md` — pre-commit sweep active
  - `handover_protocol.md` — close-out gate sequence loaded
- approved build prompt stack is loaded
- prompts are approved for the active roles
- tools are approved for the active roles
- repo context has been loaded
- the correct specialist set is activated
- the handoff path is defined for adjacent specialist domains
- the reviewer remains outside the build cell
- relevant workflow skills are loaded per the skill-loading matrix:
  - `system-maintenance` before any build or deployment
  - `visual-direction` if the build includes new UI surfaces, branding, or public commercial route modernization such as homepage, packages, case studies, or service pages
  - `legal-compliance` if the build touches privacy, contracts, terms, or regulatory surfaces
  - `strategic-review` if multi-agent outputs require synthesis before gate advancement

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

**Reviewer agent assignment by artifact type** (`.claude/agents/` reviewer personas):

| Artifact Type | Primary Reviewer Agent | Secondary / Independent Control |
|---------------|----------------------|----------------------------------|
| Deliverable completeness vs. SOW | `reviewer_package_integrity` | QAS (Imani) |
| Client-facing copy and UI text | `reviewer_plain_language` | QDA (Patrice) |
| Commercial artifacts (proposals, invoices, pricing) | `reviewer_pricing_safety` | PEA (Giselle) + Founder |
| Market claims, statistics, social proof | `reviewer_public_proof` | QDA (Patrice) |
| Public-route proof, testimonials, results, before/after claims | `reviewer_public_proof` | QDA (Patrice) + QAS (Imani) |
| Bilingual content (EN/ES) | `reviewer_localization` | TCA (Xiomara) |
| Web builds T2+ accessibility | `reviewer_accessibility` | AAA (Rochelle) |
| Public commercial route (homepage, packages, case study, service page) — route-level review | `reviewer_vecs` | VDA (Jeanine) + QAS (Imani) + Founder where market-facing posture changes materially |

Load the appropriate reviewer agent before Gate 5 begins. The reviewer agent is separate from and may not be the same as any agent in the build cell.

Public commercial route builds under the VECS overlay require all four of the following reviewers: `reviewer_vecs` (route architecture), `reviewer_public_proof` (individual claims), `reviewer_plain_language` (copy and CTA), and `reviewer_accessibility` (WCAG and reduced-motion). `reviewer_vecs` does not replace the others — all must pass before Gate 5 clears.

#### Gate 6: Release Readiness

When release or deployment is implicated:

- `DRA` checks deployment readiness
- `QDA` packages evidence when release documentation is required
- `QAS` confirms control-path completion
- ARE technical review runs before production release for real systems or client access; Founder completes the human gate where policy requires
- Founder human gate is mandatory before release when public commercial route changes materially alter homepage authority flow, package presentation, case-study proof posture, or service-page trust framing

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

- current working registry (`01_system/registry/final-approved-department-and-agent-registry.md`)
- engineering standards policy (`01_system/ai-governance/engineering-standards-policy-2026-04-15.md`)
- build context engineering standard (`01_system/ai-governance/build-context-engineering-standard-2026-04-15.md`)
- merge-gate enforcement spec (`01_system/ai-governance/codeowners-merge-gate-enforcement-spec-2026-04-15.md`)
- VECS architecture amendment (`01_system/ai-governance/visual-experience-conversion-systems-architecture-amendment-2026-04-19.md`)
- approved prompt and tool inventory
- reviewer coverage under `QAS`
- **`.claude/agents/`** — 7 specialized reviewer personas (package_integrity, plain_language, pricing_safety, public_proof, localization, accessibility, vecs)
- **`.claude/skills/`** — 11 invokable session skills (completion_report, decision_log, client_intake, disclosure_gate, scope_brief, qa_multipass, business_formation, content_production, web_build, hosting_maintenance, idea_development)
- **`.claude/rules/`** — 3 session-level behavioral constraints (plan_mode, github_disclosure_gate, handover_protocol)
- **`03_agent-skills/`** — 14 workflow skills including strategic-review, visual-direction, vecs-public-route, legal-compliance, system-maintenance
- AI Review Authority Matrix (`01_system/ai-governance/ai-review-authority-matrix.md`)

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

1. ~~Approve this protocol into the canonical governance layer.~~ **DONE — 2026-04-15**
2. ~~Draft the ten new role charters so activation boundaries are explicit.~~ **DONE — 2026-04-17/18 (60 agents now reflected in the live registry after QMA addition)**
3. ~~Build the corresponding skill packs.~~ **DONE — 2026-04-17/18 (60 role skill packs + 13 workflow skills + 11 .claude/skills + 6 reviewer agents + 3 rules)**
4. ~~Instantiate the activation and handoff checklist for the first governed repository and client profile.~~ **DONE — workspace templates live in 02_client-system/**
5. **NEXT:** Populate the repository-agent capability map for the first governed product repository (CasaClaro or PEO recommended as first target).
6. **NEXT:** Apply the activation checklist to the next real governed build — record Gate 0A agent routing note as the first live artifact.
7. **NEXT:** Audit the first three activations for over-activation, under-activation, handoff failures, and review failures.
8. **NEXT:** Pilot the VECS overlay on one homepage and one packages route and log the evidence packet.
9. **NEXT:** Decide whether VECS remains an overlay-only model or needs a separate registry and skill-pack rollout.

## 3. Proprietary Build Application

This protocol applies to all NoDrft Systems proprietary products — CasaClaro, Peak Equity Optimizer, and Forgotten by Design — without modification to the gate structure. The following clarifications apply specifically to proprietary builds.

### Founder as Product Owner and Human Authority

For NoDrft Systems proprietary products, the Founder holds all product ownership and human approval authority. There is no external client. When this protocol references:

- "named human owner" → the Founder is the named human owner for all proprietary products
- "client access" → this means public user access to the deployed product, not access by an external client
- "ARE technical review" → this is Founder review for proprietary product builds
- "client data" → this means end-user data within the product

### Proprietary Build Declaration Replaces Client Intake

External client intake scoring does not apply to NoDrft Systems proprietary products. The `client-intake-analysis` skill must not be loaded for proprietary product builds.

For proprietary builds, the **Proprietary Build Declaration** replaces the external client intake packet. The Proprietary Build Declaration records:

- product name and NoDrft Systems as the owning entity
- Founder as the product owner and sole human authority
- current build phase and status
- build authorization decision
- open blockers or decisions pending before the next phase begins

The Proprietary Build Declaration is the founding governance artifact for the product workspace in `02_client-system/`. It is equivalent to the qualification decision and client intake packet combined — but grounded in internal product authority, not external qualification scoring.

### Build Authorization for Proprietary Products

For governed proprietary builds, the build authorization decision is made by the Founder and recorded in the product's Proprietary Build Declaration. This is the equivalent of the "named human owner" approval required at Gate 0 and Gate 1. No external approval path is required.

### Workspace Structure for Proprietary Products

Each proprietary product requires two complementary records in this repository:

1. A build folder in `04_products/` containing source code, build artifacts, and product-level governance.
2. A product workspace in `02_client-system/` containing the Proprietary Build Declaration, strategy brief, delivery status log, and handoff records.

## 5. Unknowns / Data Gaps

- **PARTIALLY RESOLVED:** The live reviewer roster is now defined via `.claude/agents/` (6 specialized reviewer personas covering package integrity, plain language, pricing safety, public proof, localization, and accessibility). The per-repository capability map — which specific agents are active for each product build — is not yet populated.
- The exact first repository to adopt this protocol is not yet specified. Recommended: CasaClaro or PEO as first live activation target.
- The active prompt and tool inventory still needs a fully canonical populated registry artifact.
- The repository-agent capability map template now exists, but the live populated map does not yet exist for any specific product repository.
- Tier 1 supervisor deployment and ARE deployment were later resolved in the decision log, but this protocol required canonical cleanup to reflect that live state.
- VECS is now governed at the protocol level, but no route-level pilot evidence packet has been logged yet.

## 6. Conclusion

The mandatory rule is simple: no governed build begins without the right small cell, the right packet, the right controls, the right relevant and capable agents, and a separate reviewer path. Speed is not a valid reason to bypass activation discipline.
