---
name: vecs-public-route
description: Activate and govern the full Visual Experience & Conversion Systems (VECS) overlay for any homepage, packages page, case-study route, or service page build. Use when a governed build materially changes a public commercial route — hierarchy, proof presentation, interaction states, CTA path, or trust framing.
---

# VECS Public Route — Workflow Skill

## Purpose
Execute the governed VECS overlay for public commercial route modernization. This skill activates the correct cell, enforces pre-conditions, sequences the build phases, and routes to the required reviewers before release. It does not replace visual-direction, which must load before this skill executes.

## Use When
- A governed build materially changes a homepage hierarchy, above-the-fold structure, or authority flow
- A packages or pricing-decision page is being restructured, reframed, or re-scoped
- A case-study route, proof band, or before/after presentation is being built or changed
- A service page trust flow, process explanation, FAQ structure, or CTA path is changing
- Any public commercial route is being modernized with new UI surfaces, interaction states, or proof systems

Do not load this skill for internal documents, dashboards, admin surfaces, blog posts, or product app interfaces. Those are governed by the standard build protocol — not VECS.

## Required Inputs
- Route classification (homepage / packages / case study / service page)
- Active proof inventory: verified client results, logos, testimonials, metrics with source records
- Brand framework and approved asset library (from client workspace `02_discovery/` or `NoDrftSystems Design System/`)
- Current route audit: screenshot, hierarchy map, or existing copy — what is live now
- Package tier or project scope that governs complexity ceiling
- `visual-direction` brief already completed — this skill does not load until visual direction is confirmed
- Root contract active (`CLAUDE.md` loaded) and scoped rules active (`.claude/rules/`)

## Pre-Conditions (Must All Be True Before Execution Begins)
1. `visual-direction` skill has been loaded and a visual direction brief is on file
2. Proof inventory is confirmed — do not begin proof-section work without verified proof elements
3. VECS overlay is formally declared on the build packet (Gate 0 classification in MBAP)
4. `VDA` is assigned as route architecture lead
5. `reviewer_vecs`, `reviewer_public_proof`, `reviewer_plain_language`, and `reviewer_accessibility` are reserved as independent reviewers before implementation begins
6. Founder review is scheduled for any build that materially alters package presentation, case-study proof posture, or homepage/service-page authority structure

If any pre-condition is missing: stop and escalate to MOA before proceeding.

## VECS Cell Composition
Load the minimum cell that covers the actual affected surfaces. Do not activate all roles on every build.

| Role | Activate When |
|------|---------------|
| `VDA` (Jeanine) | Always — route architecture lead for all VECS builds |
| `DAA` (Anika) | Always — layout treatment, section composition, visual execution guidance |
| `FIS` (Kiara) | Route changes are executable — component implementation, interaction states |
| `BCA` (Nadine) | Trust posture, anti-generic pattern selection, or visual differentiation is material |
| `STAA` (Jermaine) | Restructuring can affect heading hierarchy, crawlability, or internal linking |
| `AAA` (Rochelle) | Motion, reduced-motion handling, readability, or focus states change |
| `PLA` (Simone) | CTA clarity, section scannability, or comprehension changes materially |
| `BPA` (Maritza) | Bilingual route parity exists |
| `QDA` (Patrice) | Proof bands, testimonials, logos, metrics, before/after evidence, or release documentation |
| `QAS` (Imani) | Always — release authority; no route release without QAS sign-off |

## Workflow

### Phase 1 — Route Audit
1. Map the current route: section sequence, hierarchy, proof placement, CTA location, and interaction states
2. Identify every surface that is changing: copy, layout, proof, interaction, or structure
3. Confirm which VECS cell roles are activated for the actual affected surfaces
4. Log the route audit as the baseline evidence artifact

### Phase 2 — Direction Confirmation
5. Confirm `visual-direction` brief covers the specific route being changed
6. Confirm proof inventory: every proof element that will appear on the route is verified and on file
7. Confirm anti-generic requirements: identify any generic patterns in the current route that must be replaced
8. Confirm reduced-motion behavior is planned for every interaction added to the route
9. Confirm CTA path architecture: one dominant primary CTA, secondary CTAs subordinate, CTA copy specific to outcome

### Phase 3 — Implementation
10. `VDA` defines the authority flow, section sequence, and proof rhythm for the route
11. `DAA` produces layout guidance and section treatment for each changed surface
12. `FIS` implements executable route changes — components, interaction states, responsive behavior
13. `BCA` reviews posture and rejects generic patterns before implementation is finalized
14. `STAA` confirms heading structure and crawlability if route hierarchy changes
15. `AAA` confirms reduced-motion handling and WCAG compliance for every interaction state added
16. `PLA` confirms CTA clarity and section scannability after copy is placed
17. `BPA` + `TCA` confirm bilingual parity if applicable
18. `QDA` assembles proof documentation and packages the evidence record

### Phase 4 — Review Gates
19. Run `reviewer_vecs` — route-level review: authority flow, anti-generic compliance, proof posture, CTA architecture, interaction governance, visual density
20. Run `reviewer_public_proof` — individual proof claim verification
21. Run `reviewer_plain_language` — copy grade level, CTA specificity, no jargon
22. Run `reviewer_accessibility` — WCAG 2.1 AA, reduced-motion, focus states, keyboard navigation
23. Run `reviewer_localization` if bilingual route exists
24. All reviewers must complete before Gate 5 passes

### Phase 5 — Release
25. `QAS` confirms all review gates passed and evidence is complete
26. `DRA` confirms deployment readiness
27. Founder review is mandatory before release if package presentation, case-study proof posture, or homepage/service-page authority structure changed market-facing behavior materially
28. Log evidence package to `05_deliverables/` before any deployment or client handoff

## Outputs
- Route audit: current-state baseline map with identified change surfaces
- VECS cell activation record: which roles were activated and why
- Implementation evidence: build artifacts, typecheck, lint, test results, preview
- Review completion records: pass/fail for each reviewer agent with findings
- Evidence ledger update: VECS overlay activation and route change log
- Structured completion report per `completion_report` skill format
- Founder review record (when applicable)

## Block Conditions
- Visual direction brief not on file: stop — do not begin implementation
- Proof inventory not confirmed: stop — do not begin proof-section work
- `reviewer_vecs` not yet run: block advancement past Gate 4
- Any CRITICAL finding from any reviewer: block release until resolved
- Motion-dependent comprehension identified: CRITICAL block
- Reduced-motion handling not defined for any added interaction: CRITICAL block
- Founder review required but not scheduled: block release gate

## Do Not Do
- Do not treat VECS builds as "frontend only" — route hierarchy, proof posture, readability, accessibility, and release controls are all mandatory
- Do not fabricate proof elements, metrics, testimonials, logos, or outcome claims
- Do not proceed without a visual direction brief
- Do not skip reviewer activation because the build appears small — VECS oversight applies to any material change on a governed public commercial route
- Do not release without QAS sign-off

## Escalation → MOA → HHC when
- Pre-conditions cannot be met before a deadline
- A proof gap cannot be filled with verified evidence
- Anti-generic corrections require a strategic repositioning decision
- Reviewer findings are disputed or require Founder arbitration
- The build scope expands beyond the named public-route classes mid-execution

**Human authority:** Founder for market-facing changes; ARE for technical release readiness

## Related Skills and Agents
- `03_agent-skills/visual-direction/SKILL.md` — must run before this skill
- `03_agent-skills/release-gate-review/SKILL.md` — load at Phase 5
- `03_agent-skills/legal-compliance/SKILL.md` — load when proof, disclosures, or regulated claims increase trust or liability risk
- `03_agent-skills/strategic-review/SKILL.md` — load when route changes materially alter package framing or market-facing posture
- `.claude/agents/reviewer_vecs.md` — route-level reviewer (mandatory at Gate 4)
- `.claude/agents/reviewer_public_proof.md` — individual claim reviewer (mandatory at Gate 4)
- `.claude/agents/reviewer_accessibility.md` — WCAG reviewer (mandatory at Gate 4)
- `.claude/agents/reviewer_plain_language.md` — copy reviewer (mandatory at Gate 4)
- `01_system/ai-governance/visual-experience-conversion-systems-architecture-amendment-2026-04-19.md` — governing architecture

## Classification
Internal — Proprietary | NoDrftSystems | Do NOT commit to client repositories
