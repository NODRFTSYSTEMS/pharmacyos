# NoDrftSystems Proprietary Skill
# Classification: Internal — Confidential
# Do NOT commit to client repositories
# Source: Authored from strategy-brief-builder/SKILL.md + client-intake-operating-system.md

## SKILL: scope_brief

**Purpose:** Define and document the bounded scope, deliverables, acceptance criteria, and constraints for a client engagement or proprietary build phase before execution begins.

**Trigger:** Discovery outputs must become an execution-ready brief; scope definition or project brief task is detected.

**Pre-conditions (ALL must be confirmed before producing a scope brief):**
- Discovery Sprint completed OR Proprietary Build Declaration on file (for internal NoDrftSystems builds)
- Client budget, timeline, and decision authority confirmed
- Package tier identified and priced against operative pricing governance
- Client has been qualified through the `client_intake` skill

**Step Sequence:**
1. Confirm the active workspace and that all pre-conditions are met
2. Retrieve the Discovery Sprint output or build declaration from the workspace `02_discovery/` folder
3. Identify the package tier and cross-check scope against `web_build` or relevant service-line skill
4. Draft each of the nine required sections (see Output Format)
5. Flag any section that cannot be completed with `[REQUIRED: ___]` — do not invent content
6. Review for scope drift: does anything in the brief exceed the tier boundaries?
7. Present the draft to the operator for approval before any execution begins
8. Store the approved brief in the client workspace `03_strategy/` folder

**Output Format:**

```markdown
# SCOPE BRIEF — [CLIENT-ID] — [Project Slug]
**Date:** [YYYY-MM-DD]
**Package Tier:** [T0 / T1 / T1S / T2 / T3 / T4 / T5]
**Base Price:** [from operative pricing source]
**Status:** DRAFT | APPROVED

## 1. Engagement Reference
Client/product, workspace path, relevant Discovery Sprint ID

## 2. Problem Statement
[Validated problem — from Discovery Sprint output, not assumed]

## 3. Deliverables List
[Explicit, enumerable, testable list — each item must be completable and verifiable]

## 4. Exclusions
[What is explicitly NOT included — prevents scope creep disputes]

## 5. Acceptance Criteria
[How "done" is defined for each deliverable — must be objectively testable]

## 6. Timeline
[Start clock = date client delivers all required inputs: content, assets, brand files]
[Delivery window per tier]

## 7. Open Questions / Blockers
[Items that must be resolved before execution begins]

## 8. Risk Flags
[Scope risks, dependency risks, timeline risks — with proposed mitigations]

## 9. Change Order Protocol
[How scope changes will be handled: written change order required, priced separately]
```

**Storage:** `[CLIENT-WORKSPACE]/03_strategy/scope_brief_[CLIENT-ID]_[YYYY-MM-DD].md`

**QA Requirements:** Scope brief is reviewed at Gate 1 (Strategic) before execution begins. Operator must approve the brief in writing before any Phase 4 (EXECUTE) work starts.

**Proprietary Protection:** The scope brief is a client-specific document. It may be shared with the client in summary form. Internal pricing details, margin notes, or capacity flags must be removed before sharing.

**Escalation Conditions:**
- If scope cannot be bounded (ambiguous requests, missing Discovery Sprint, budget misalignment): do not produce a scope brief — route back to `client_intake` or `idea_development` skill
- If any tier boundary would be exceeded by the client's requirements: stop, flag as a tier mismatch, and present upgrade options before proceeding
