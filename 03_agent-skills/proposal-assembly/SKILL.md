---
name: proposal-assembly
description: Use when a qualified lead requires a formal proposal or statement of work. Enforces the commercial review chain — PEA produces, CRMA verifies client context, reviewer_pricing_safety checks all prices, IGA confirms payment structure, and Founder approves when the threshold is met. Do not load for NoDrftSystems proprietary product work.
---

# Proposal Assembly

## Use When

- A qualified lead has passed intake scoring and a formal proposal is required
- A scope brief exists and the engagement path (Discovery Sprint, package tier, retainer) is defined
- A change order or SOW amendment is required for an active engagement
- A proposal requires repricing or re-scoping after a scope change

Do not load this skill for ambiguous or unqualified leads — route to `client-intake-analysis` first.

## Required Inputs

- Qualified intake packet (evaluation scorecard on file)
- Approved scope brief or Discovery Sprint output
- Active pricing governance reference (`01_system/commercial/pricing-governance.md`)
- Client-specific context: budget band, decision-making authority, timeline, stated constraints
- Engagement path decision: which tier, retainer structure, or Discovery Sprint applies

## Workflow

### Phase 1 — Scope Confirmation

1. Load the scope brief and confirm it maps to an approved package tier (T0–T5) or retainer structure.
2. Verify the engagement path does not require scope that falls outside the signed SOW or approved tiers.
3. If scope is ambiguous or straddles tiers, stop and route to PMA (Keon) + PEA (Giselle) for scope boundary resolution before proceeding.
4. Confirm all required pre-conditions are satisfied:
   - Client has completed intake and evaluation
   - Decision-making authority is confirmed
   - Timeline and budget band are on file
   - Content, assets, and dependencies are scoped (not assumed)

### Phase 2 — Commercial Draft (PEA)

5. PEA (Giselle) drafts the proposal using the approved package architecture:
   - Package name and tier designation
   - Deliverables list — no more, no less than the approved tier scope
   - Timeline with dependency gates (content delivery, asset receipt, approval windows)
   - Payment schedule per pricing governance rules (deposit, milestone, completion)
   - Explicit exclusions (copywriting, hosting, add-ons not scoped)
   - Post-launch support terms and scope limitations
6. Reference only approved prices from `pricing-governance.md`. No rounding, no interpolation, no estimated figures.
7. If a custom price is required: STOP. Log a Decision Log entry. Route to Founder before the draft advances.

### Phase 3 — CRM and Client Context Verification (CRMA)

8. CRMA (Daren) reviews the draft against the CRM record:
   - Confirm budget band alignment with stated client budget
   - Confirm the recommended tier matches the scope and complexity of the inquiry
   - Flag any prior communication or commitment that conflicts with the current proposal
   - Verify no prior pricing exception was verbally granted that would create a contradiction

### Phase 4 — Pricing Safety Review

9. Load `pricing-safety-review` workflow skill.
10. Run full pricing safety check:
    - All prices trace to operative governance document
    - Payment schedule matches approved structure
    - Package framing exposes exclusions clearly
    - No cross-document contradictions
    - No CONFLICT or NEEDS FOUNDER APPROVAL items remain unresolved
11. If pricing safety fails: do not advance the proposal. Resolve blockers and re-run.

### Phase 5 — Finance Review (IGA)

12. IGA (Shanice) confirms:
    - Invoice milestones align with the proposed delivery schedule
    - Deposit structure matches the approved payment governance
    - Payment terms are consistent with the MSA template terms

### Phase 6 — QAS Gate

13. QAS (Imani) reviews the complete proposal for:
    - Scope completeness — all SOW elements present
    - Internal consistency — no contradictions across sections
    - Commercial control — pricing safety, payment terms, exclusion clarity
    - Placeholder check — no [REQUIRED:] or [TBD] items remain in the client-facing version
14. QAS issues PROCEED or HOLD. HOLD requires documented resolution before advancing.

### Phase 7 — Human Approval

15. HHC (Desmond) routes the proposal to the Growth Lead for initial review.
16. If the total engagement value exceeds $15,000 OR any pricing exception applies OR the scope is outside standard tiers: route to Founder.
17. Founder review is mandatory for:
    - Engagements >$15K
    - Any discount or price floor deviation
    - Scope outside approved tiers
    - Retainer terms deviating from the MSA/SOW template
18. Log the approval decision in the Decision Log (`decision_log` session skill) before the proposal is sent.

### Phase 8 — Delivery

19. Once approval is on file, CCA (Renzo) delivers the proposal to the client contact.
20. CRMA logs the proposal send date, version, and delivery channel in the CRM record.
21. Log the proposal in the active client workspace under `03_strategy/` or `04_execution/` as appropriate.

## Outputs

- Draft proposal with package tier, deliverables, timeline, payment schedule, and exclusions
- Pricing safety review result (PASS or blocker list)
- Finance review confirmation
- QAS gate result (PROCEED or HOLD with reason)
- Decision Log entry for any exception or Founder approval
- Approved proposal for client delivery

## Escalation Behavior

**Escalates immediately to Founder when:**
- Any pricing exception is requested
- Scope falls outside approved tiers
- Engagement value exceeds $15K
- Client has expressed objection to standard terms that would require MSA deviation

**Escalates to ARE when:**
- Commercial logic contains a technical scope ambiguity (e.g., platform complexity classification)
- A pricing-safety review conflict cannot be resolved against the governance document

**Stops and does not advance when:**
- Intake qualification is not on file
- Scope brief is absent or contradictory
- Pricing safety review has unresolved blockers
- QAS has issued a HOLD

## Do Not Do

- Do not draft a proposal for an unqualified lead
- Do not invent prices, timelines, or deliverables not in the approved tier definitions
- Do not send a proposal without Decision Log approval on file
- Do not include internal scoring logic, cost data, or margin information in any client-facing section
- Do not grant verbal pricing commitments and then formalize them as a "standard" proposal
