# CasaClaro AI Review Authority Matrix

> **STATUS: LEGACY — Pre-governance planning document**
> This file was authored before the Mandatory Build Activation Protocol and canonical AI Review Authority Matrix were established in `01_system/ai-governance/`. The review roles defined here are superseded by the canonical agent registry and build activation record at `04_products/CASACLARO/00_governance/build-activation-record.md`. Do not use this file to assign agents or gate work. Retained for audit trail — archive this file after the Phase 2/3 reconciliation is complete.
> Reconciliation date: 2026-04-20

## Designated AI Authorities

1. Principal Product Auditor
- Scope: full-platform sweep, prioritization, critical-risk callouts, release-go/no-go.
- Deliverable: severity-ranked findings and patch sequence.

2. Editorial & Information Architecture Lead
- Scope: readability, flow, page hierarchy, de-jumbled structure, user-comprehension pass.
- Deliverable: rewritten copy blocks, improved section ordering, scannability updates.

3. Localization & Cultural Relevance Lead
- Scope: English/Spanish parity, local-market language, COP-first framing for Colombian users.
- Deliverable: bilingual field parity checks and locale-specific UX text.

4. Market Coverage Strategist
- Scope: persona relevance for sellers, investors, expatriates, casual visitors, agents, brokers.
- Deliverable: persona coverage matrix with missing-page/path recommendations.

5. Data & Compliance Verifier
- Scope: data schema completeness, timestamped sources, legal/residency and healthcare labels.
- Deliverable: validated schema checklist and source-stamp integrity report.

6. Functional QA Engineer
- Scope: calculators, forms, map, routing hooks, dynamic FX behavior.
- Deliverable: pass/fail matrix with reproducible test cases.

7. Accessibility & Cross-Browser Lead
- Scope: keyboard navigation, focus visibility, readability, viewport QA at 375/768/1024.
- Deliverable: accessibility defects list and responsive/browser compatibility notes.

8. Performance & Patch-Orchestration Lead
- Scope: staged patches, low-risk incremental rollout, verification at each stage.
- Deliverable: staged rollout log with rollback points.

## Staged Patch Workflow

1. Stage 1: Core logic and rendering safeguards
- FX refresh, localization projection, comparison module rendering.

2. Stage 2: UX/UI and readability improvements
- Content structure cleanup, section clarity, COP/m2 visibility, focus accessibility.

3. Stage 3: Data parity and schema expansion
- Spanish long-form fields, neighborhood numeric valuation fields, metadata parity.

4. Stage 4: QA sweep and release gate
- Responsive checks (375/768/1024), functionality verification, critical issue closure.

## Release Acceptance Gates

1. No critical functional failures in forms, simulator, and map fallback.
2. Landing page shows verified FX snapshot and auto-refresh behavior.
3. Neighborhood COP/m2 comparison renders with populated numeric values.
4. Spanish mode renders long-form city content from dataset parity fields.
5. Mobile readability and keyboard focus pass at 375/768/1024.