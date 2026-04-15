# AI-Native Operating Architecture

## Objective

Define the realistic AI operating model for NoDrftSystems so the approved agent bench, the repository skill system, and the human control gates work together without drift, false autonomy, or review theater.

## Verified Facts

- The approved working registry currently contains `45` official agents.
- The approved registry explicitly states the architecture is not capped at `40`.
- The approved structure includes `4` supervisor-layer agents, `37` departmental operational and governance agents across `8` departments, and `4` specialist-pool agents.
- The repository now contains a dedicated skill layer in `03_agent-skills/`.
- Pricing, legal, release, and other trust-critical artifacts already require stronger review discipline than ordinary internal drafts.
- The current business model is a lean operator model, not a large human team with constant synchronous coordination.

## Analysis

- The repository needed alignment because prior AI guidance still described a `40`-agent framing that no longer matches the approved registry.
- The right operating model is not "activate every approved agent" and it is not "let one orchestrator improvise everything."
- The correct model is a governed bench:
  - a larger approved registry
  - a smaller activated working cell
  - workflow-bound skills
  - mandatory review and human approval on high-risk outputs

## Canonical Position

### 1. Registry and skills serve different purposes

- The approved agent registry is the staffing and ownership layer.
- The skill system is the execution-pattern layer.

Do not use the skill system to invent new staffing truth. Do not use the staffing registry as a substitute for workflow instructions.

### 2. Smallest viable cell is the default

The system should activate the smallest set of approved roles that can complete a task safely. Bench size exists for coverage and scale, not for mandatory participation on every deliverable.

### 3. Human approval remains mandatory at defined gates

No AI-only path should finalize:

- pricing commitments
- contracts or legal-adjacent language
- public trust claims
- release readiness for production work
- high-risk compliance decisions

## Operating Layers

### Supervisor Layer

Always-on control roles:

- `MOA`: orchestration and activation discipline
- `QAS`: quality gate enforcement
- `CSM`: context and state continuity
- `HHC`: human handoff coordination

These roles govern workflow state. They do not eliminate the need for domain review.

### Department Layer

The approved departments remain the activation pool:

- Revenue and Sales
- Marketing and Content
- Delivery and Build
- Quality and Compliance
- Client Success
- Finance and Bookkeeping
- Strategic Intelligence
- People, Roles and Governance

### Specialist Pool

Use on-demand specialists only when their specialist risk actually exists:

- contract drafting support
- transcreation
- presentations
- data extraction and structuring

## Recommended Workflow Cells

These are activation patterns built from the approved registry. They are not a new org chart.

### Intake and Qualification Cell

Recommended members:

- `COA`
- `CRMA`
- `DCPA`
- `PRGA`
- `CHSA` when historical client-health context exists

Use for:

- intake review
- lead qualification
- decision-authority checks
- routing into decline, discovery, or proposal

Mandatory controls:

- `QAS` when qualification affects release-risk or compliance-sensitive work
- founder review for regulated work, major ambiguity, or high-friction decision chains

### Discovery and Strategy Cell

Recommended members:

- `PMA`
- `PEA`
- `TSA` or `MOA-G` when market or positioning context matters
- `BCA` or `PLA` when messaging direction shapes the scope

Use for:

- discovery synthesis
- scope boundary definition
- strategy brief creation
- package-path recommendation

Mandatory controls:

- commercial check before pricing-dependent strategy commitments
- founder review when the engagement repositions the offer or creates market-facing claims

### Build Cell

Recommended members:

- `PMA`
- `SEA`
- `DAA`
- `AAA`
- `SCA`
- `DRA`

Use for:

- implementation
- QA preparation
- accessibility review
- security-sensitive checks
- deployment readiness

Mandatory controls:

- `QDA` before any client-ready release candidate
- `QAS` before release advancement
- human ARE review before production release when the work affects real systems or client access

### Release and Handoff Cell

Recommended members:

- `QDA`
- `DRA`
- `HHC`
- `CCA`
- `PSA`
- `COA` when onboarding or support terms are in scope

Use for:

- final QA closure
- release decision packet
- access transfer
- client communication
- support-window capture

Mandatory controls:

- documented known-issues note
- acceptance evidence
- human approval where commercial or production implications exist

## Review Model

Every meaningful artifact should move through distinct questions, not duplicated "looks good" checks.

### Standard review chain

1. Owner creates
2. Peer or adjacent functional verifier checks completeness
3. Independent control checks risk specific to the artifact
4. Supervisor gate decides readiness for next phase
5. Human approval runs where policy requires it

### Distinct control questions

- commercial control: Is the package fit and scope logic sound?
- finance control: Do payment terms and invoice logic match the offer?
- quality control: Is the artifact complete, consistent, and release-safe?
- security and compliance control: Does the work create exposure that changes approval depth?
- handoff control: Can someone else operate the outcome without hidden knowledge?

## High-Risk Artifact Rules

### Commercial artifacts

Examples:

- proposals
- SOWs
- invoices
- retainers
- pricing pages

Required controls:

- commercial builder
- finance review
- pricing safety review
- founder approval when required by policy

### Legal-adjacent artifacts

Examples:

- contract drafts
- NDAs
- material legal clauses

Required controls:

- specialist support if used
- founder review
- qualified legal counsel where external use or liability is involved

### Release artifacts

Examples:

- production deployment decisions
- final delivery packages
- access-transfer packages

Required controls:

- QA and documentation check
- deployment readiness check
- supervisor release gate
- human approval where applicable

## Skill Translation

Skills should map to workflow phases rather than broad personas.

Current repository-backed skill uses:

- `repository-triage`: classify structure before changing it
- `documentation-reconstruction`: rebuild weak operating docs
- `profitability-review`: detect margin leakage and overhead
- `client-intake-analysis`: score and route opportunities
- `pricing-safety-review`: enforce commercial consistency
- `client-workspace-bootstrap`: instantiate accepted work into the standard workspace
- `strategy-brief-builder`: convert discovery into execution-ready strategy
- `release-gate-review`: enforce pre-release control
- `handoff-preparation`: package transfer and archive materials

Rule:

Load the minimum set of skills that matches the workflow phase. Do not create giant blended prompts that collapse intake, pricing, build, release, and handoff into one instruction block.

## Model-Class Guidance

Assign model classes by task type, not personal preference:

- high-judgment models: strategy, scope, pricing, critique, release decisions
- production execution models: drafting, code, documentation, structured transformation
- low-cost triage models: formatting checks, simple classification, early screening

For high-risk artifacts, at least one critical review should come from a different model family or provider than the primary creator when that is operationally available.

## Agent Capacity Policy

The architecture is not capped at any fixed number.

- The current official bench is `45` agents.
- Additional agents may be added when precision, governance coverage, or operational control requires it.
- Each new agent requires: a workflow justification that cannot be covered by an existing agent, a proposed bounded scope that does not conflict with an existing agent's scope, an assigned human owner, and Founder or ARE approval before activation.
- The approval record must be added to `01_system/registry/final-approved-department-and-agent-registry.md` before the agent operates.
- Bench expansion is not the default response to new work. The default is routing the work to an existing agent with an appropriate skill loaded.

## Dual-Agent Independent Verification Protocol

Every meaningful artifact requires at minimum two agents from distinct bounded scopes to verify before it advances. The producing agent cannot be one of the verifying agents.

### Verification classes

**Standard verification** — applies to all non-trivial internal deliverables:
- Agent A produces the artifact
- Agent B (different bounded scope) verifies completeness and scope compliance
- If B finds issues, A revises and B re-verifies before advancement

**High-risk verification** — applies to commercial, legal-adjacent, compliance-sensitive, and release-critical artifacts:
- Agent A produces
- Agent B verifies content and scope compliance
- Agent C (independent control function — QAS, IPGA, or SCA as appropriate) verifies risk-specific concerns
- Human approves before client-facing use or production release

### Verification rules

- A verifier must challenge the artifact against defined criteria, not simply re-read it
- Agreement without documented rationale is not verification
- If both agents agree but a human review gate applies, human approval is still required
- A supervisor agent (MOA, QAS) classifies which verification class applies

### Routing to human after verification

Use HHC to route to the correct human authority:
- Commercial and pricing: Growth Lead, then Founder for amounts >$15K
- Release and technical: ARE
- Legal-adjacent: Founder + qualified legal counsel
- Strategic: Founder

## Originality and Distinctiveness Standard

Generic output is a defect. Outputs that describe a category instead of this specific client, this specific offer, or this specific situation are not acceptable.

### Mandatory specificity requirements

Every client-facing artifact must be specific to:
- the client's actual business niche, not a generic sector label
- the client's stated objectives and evidence, not template filler
- NoDrftSystems' actual service scope and pricing, not generic agency claims
- the project's real constraints, risks, and dependencies

### Anti-generic checks

Before an agent advances a draft:
- Replace any phrase that could describe any company in this category with a phrase that could only describe this client
- Verify that every claim has a source, evidence, or constraint that created it
- Verify that the recommended package or path is grounded in the intake data, not a default assumption
- Verify that pricing references match approved governance, not rounded or estimated figures

### Escalation trigger

If an agent cannot make an output specific because required client information is missing, the agent must flag the gap and route to the appropriate human owner for input. The agent must not fill the gap with generic content.

## Multi-Platform Execution Model

NoDrftSystems operates across multiple AI platforms. Platform selection is a risk and efficiency decision, not a preference.

### Platform assignment logic

- **High-judgment, reasoning-intensive tasks** (strategy, scope definition, pricing review, critique, escalation classification): use the highest-capability available model on Claude or equivalent
- **Production execution tasks** (drafting, documentation, structured transformation, code): use production-tier models — Claude Sonnet, ChatGPT-4o, or equivalent
- **Triage and classification tasks** (formatting checks, early screening, field extraction): use efficient models — Claude Haiku, GPT-3.5, or equivalent
- **Cross-verification of high-risk artifacts**: use a different model family or provider from the primary creator when operationally feasible

### Consistency rule

If an artifact was created on Platform A, it may be verified on Platform A or Platform B. The verifier must apply the same criteria regardless of platform. Platform switching is not a shortcut around verification requirements.

### Prohibited uses

- Do not use consumer-grade models for artifacts that will be sent to clients, published, or submitted to legal review
- Do not use a single platform because it is convenient; document the selection when deviation from the standard assignment applies

## Anti-Drift Controls

Drift is when outputs, prompts, or workflows deviate from approved standards without detection or correction. Drift control is a standing governance responsibility.

### Types of drift

- **Prompt drift**: a prompt or role configuration deviates from its approved version without a change record
- **Scope drift**: an agent begins performing tasks outside its bounded scope definition
- **Standard drift**: outputs begin using language, claims, or pricing not sanctioned by canonical governance
- **Verification drift**: verification steps are abbreviated or skipped without documented authority

### Detection responsibilities

- `PCA` monitors prompt and configuration versions
- `QADM` monitors output variance against accepted baselines
- `QAS` enforces verification-chain compliance
- `TACA` monitors tool and access compliance

### Remediation

- Any agent detecting drift must flag it immediately and halt advancement of the drifting artifact
- Drift is routed through HHC to the appropriate human owner
- Prompt drift and scope drift require ARE sign-off before the affected agent resumes
- Systematic or repeated drift requires a documented root-cause note from the human owner before the system resumes normal operation

## Acceptance Criteria

The AI operating architecture is working when:

- the `45`-agent approved registry remains the staffing truth
- workflow cells activate only the roles actually required
- skills are used to standardize recurring workflows
- no artifact self-certifies its own readiness
- pricing, legal-adjacent, and release-critical outputs remain human-governed
- the activated cell stays small enough to preserve margin and coordination clarity
- every meaningful artifact has been independently verified before advancement
- generic or category-level outputs are flagged before client-facing use
- drift in prompts, scope, or standards is detected and routed to human correction
- platform selection follows the assignment logic, not convenience
