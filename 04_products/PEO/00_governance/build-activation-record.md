---
document: PEO Build Activation Record
status: Active governance
version: 1.1
date: 2026-04-16
owner: Founder (nodrftsystems)
authority: Mandatory Build Activation Protocol — `01_system/ai-governance/mandatory-build-activation-protocol-2026-04-15.md`
confidentiality: Proprietary internal — no external publishing approved
---

# PEO Build Activation Record
## Gates 0 · 0A · 1 · 1A · 2

---

## Gate 0: Build Intake

### Classification

**Build Class: 3 — Integration or Data-Sensitive Build**

Justification:
- Full database schema designed from scratch (12+ entities)
- Third-party data API integrations required (property data, geocoding, comp sources)
- Auth provider integration required (provider TBD — O-001)
- PII handling: property addresses, identity fields, financial inputs
- Security boundary: RBAC across 8 roles, audit logging, upload scanning
- Multi-route product with 5 distinct user surfaces
- Agent-system wiring for AI-assisted development

Phase 6 (marketplace + admin + deployment) will be reclassified to Class 4 at that gate.

### Affected Technical Surfaces

| Surface | Description |
|---------|-------------|
| Frontend | Public site, estimator (2 toggles), seller dashboard, investor basic dashboard, investor advanced dashboard, marketplace/vendor directory, trust center |
| Backend API | 8+ service domains: public_content, identity, estimator, seller, triage, readiness, investor, marketplace |
| Database | Full schema from scratch — 13 entities (see data model in 01_specs/) |
| Third-party integrations | Property data APIs (county assessor, listing platform, geocoding), auth provider, analytics platform |
| Security boundary | RBAC (8 roles), PII controls, audit logging, upload scanning, rate limiting |
| Agent-system wiring | Skill activation, handoff routing, evidence ledger management |

### Human Assignments

| Role | Assigned |
|------|---------|
| Human Owner | Founder (nodrftsystems) |
| Build Lead | ARE (pending Founder confirmation at Gate 1 approval) |
| Reviewer (separate from cell) | QAS — reserved, outside build cell |

### Build Phases (from Blueprint)

| Phase | Scope |
|-------|-------|
| 1 | Governance + Specification |
| 2 | Public Website + Free Estimator |
| 3 | Seller Application |
| 4 | Investor Basic |
| 5 | Investor Advanced |
| 6 | Marketplace + Admin + Deployment |

---

## Gate 0A: Agent Assessment & Handoff Routing

### Surface-to-Role Mapping

| Technical Surface | Primary Agent | Role |
|------------------|--------------|------|
| Architecture / service boundaries | SAA | Systems Architecture Agent |
| Repository context | RCA | Repository Context Assistant |
| Frontend UI (all 5 routes) | FIS | Frontend Implementation Specialist |
| Backend API / formula engine / triage / readiness | BLS | Backend & Logic Specialist |
| Database schema / migrations / audit | DSS | Database & Schema Specialist |
| Third-party data APIs / auth / debugging | IDS | Integration & Debugging Specialist |
| Security / RBAC / PII / disclosures | SCA | Security & Compliance Agent |
| Test design / verification evidence | TVA | Test & Verification Assistant |
| Orchestration | MOA | Master Orchestrator Agent |
| Context continuity | CSM | Context State Manager |
| Build packet control | PMA | Product Manager Agent |
| Independent review | QAS | Quality Assurance Supervisor (reviewer only) |

### Minimum Active Cell

| Agent | Activation Trigger | Notes |
|-------|-------------------|-------|
| MOA | Always-on | |
| CSM | Always-on | |
| PMA | Always-on | |
| RCA | Every governed phase | Mandatory — no exceptions |
| SAA | Phase 1 + any boundary-setting work | |
| BLS | Phases 2–6 | Primary implementation for backend |
| FIS | Phases 2–6 | Primary implementation for frontend |
| DSS | Phases 3–6 | Schema-touching work |
| IDS | Phases 3–5 | Third-party integration work |
| SCA | Phases 3–6 | Any PII, auth, or disclosure surface |
| TVA | Every phase with behavior change | Mandatory |
| QAS | All phases | Reserved reviewer — outside cell |

### Capability Verification (must confirm before Gate 2)

| Agent | Required Capability | Verification |
|-------|-------------------|-------------|
| SAA | Multi-service product decomposition, API boundary design | Confirm skill pack scope |
| BLS | Formula Registry (30+ formulas, Layers A–G), triage engine, 4-dimension confidence scoring, kill-switch library | Confirm formula spec in 01_specs/ |
| FIS | 5-route UI, bilingual en-US/es-US, WCAG 2.1 AA, toggle-based estimator | Confirm design system spec |
| DSS | 13-entity schema, versioning, audit log design, migration strategy | Confirm data model spec |
| IDS | Property data API integration (providers TBD), auth provider (TBD) | Providers confirmed at Phase 3 gate |
| SCA | RBAC 8-role enforcement, PII event linting, upload scanning, disclosure rules | Confirm route exposure matrix |
| TVA | 80%+ unit test coverage, E2E critical flows, bilingual snapshot tests, authz matrix tests | Confirm test plan per phase |

### Overlap Elimination

| Overlapping Surfaces | Primary Owner | Consult/Reviewer |
|---------------------|--------------|-----------------|
| API + Schema | BLS (API logic) / DSS (schema) | DSS reviews all BLS schema decisions |
| Frontend + Security | FIS (implementation) / SCA (review) | SCA reviews auth flows, disclosures, PII inputs |
| Triage + Confidence | BLS (implementation) / TVA (verification) | TVA validates all formula outputs |

### Phase-by-Phase Handoff Sequence

**Phase 1 — Governance + Specification**
- Start: SAA + RCA + PMA
- Deliverable: Architecture boundaries document, service decomposition, data model skeleton
- Handoff condition: SAA architecture document complete + PMA build packet approved
- Handoff to: BLS + FIS (Phase 2)
- Evidence required: Architecture decision log, service boundary definitions

**Phase 2 — Public Website + Free Estimator**
- Start: FIS (website/UI) + BLS (estimator API) + TVA
- Formula scope: Layers E + F only (manual inputs, no live data)
- Handoff condition: TVA formula unit tests pass (100% Layer E+F) + Gate 4A report
- Handoff to: BLS + DSS + IDS (Phase 3)
- Evidence required: Formula test results, bilingual parity confirmation, Lighthouse pass

**Phase 3 — Seller Application**
- Start: BLS (primary) + DSS (schema) + IDS (data APIs) + SCA
- Formula scope: Layers A–C (fact layer, comp evidence, valuation — seller exposure only)
- Handoff condition: TVA integration test pass + SCA PII review pass + Gate 4A report
- Handoff to: BLS + IDS + TVA + SCA (Phase 4)
- Evidence required: Schema migration record, API integration test results, PII event linting report

**Phase 4 — Investor Basic**
- Start: BLS + IDS + TVA + SCA
- Formula scope: Full Layers A–G at Basic exposure level (per Formula Exposure Matrix)
- Handoff condition: VERIFIED ARV test pass + confidence scoring test pass + SCA data exposure review
- Handoff to: BLS + DSS + FIS + SCA (Phase 5)
- Evidence required: ARV calculation test traces, confidence tier test matrix, authz test results

**Phase 5 — Investor Advanced**
- Start: BLS + DSS + FIS + SCA
- Formula scope: Full Layers A–G at Advanced exposure level + DSCR/refi/scenario formulas
- Handoff condition: Scenario planner test pass + export controls verified + SCA sign-off
- Handoff to: Core stack `MOA · CSM · PMA · SAA · RCA · TVA`; receiving specialist cell `BLS · FIS · SCA · DRA · PIS` (Phase 6 Class 4; QAS reviewer outside cell)
- Evidence required: Export permission test results, watermarking implementation, full formula regression

**Phase 6 — Marketplace + Admin + Deployment**
- Reclassify to Class 4 at this gate
- Core Class 4 active stack: MOA · CSM · PMA · SAA · RCA · TVA
- Receiving specialist cell: BLS · FIS · SCA · DRA · PIS
- Dual implementation roles (BLS + FIS): Marketplace, admin, and deployment surfaces require concurrent backend API work (BLS) and frontend UI work (FIS); both are primary for Phase 6 scope. Confirmed intentional by Founder 2026-04-16.
- Conditional Class 4 roles activated: PIS, SCA, DRA (platform/infrastructure, security/compliance, deployment readiness). POS and ASIS excluded pending Founder/ARE scope review.
- Reviewer path: QAS outside build cell; QDA joins when release documentation is required
- Start condition: Phase 5 Gate 4A complete + Phase 6 build packet prepared + Phase 6 activation checklist prepared + Founder approval to advance + ARE packet approval + QAS review reserved
- Evidence required: Full system test pass, authz matrix, deployment checklist, preview/build evidence, security review sign-off

### Fallback Rules

- If primary specialist stalls or hits confidence floor: escalate to QAS + notify PMA immediately
- If handoff cannot be completed cleanly: build pauses — do not proceed with incomplete transfer
- If scope expands beyond classification: reclassify before continuing

---

## Gate 1: Build Packet

### Objective

Activate and execute the full Peak Equity Optimizer (PEO) product build — a trust-based real-estate intelligence and execution platform with 5 user routes, formula-governed analysis engine, triage and deal-readiness systems, marketplace, and full bilingual support.

### Scope

All of the following are in scope:

- All 6 build phases defined in `Peak_Equity_Optimizer_Blueprint_Rewrite_2026.pdf`
- All 18 DOCX spec documents from `C:\Users\nkwtr\Downloads\PEOSYS` as canonical implementation references
- Formula Registry (Layers A–G, 30+ formulas) — binding calculation contract
- Comp Inclusion/Exclusion Standard — binding comp logic
- Confidence & Review Trigger Standard — binding quality gate logic
- Field Source Hierarchy Matrix — binding data quality contract
- Formula Exposure Matrix — binding route-boundary control
- Route Matrix and Calculation Standards v2.0 — master implementation reference

### Exclusions

The following are explicitly out of scope until unblocked:

| ID | Item | Blocking Condition |
|----|------|-------------------|
| O-001 | Auth provider implementation | **Closed 2026-04-16** — Clerk confirmed |
| O-002 | Final legal text (T&C, privacy, disclosures) | Requires counsel review |
| O-003 | Professional translation | Review process not yet confirmed |
| ~~O-004~~ | ~~Cloud/infra deployment~~ | **Stack declared 2026-04-16** — see `00_governance/tech-stack.md` |
| O-005 | Upload malware scanning | Vendor not yet selected |
| O-006 | Pricing/tier amounts in UI | **Closed 2026-04-16** — see `pricing-declaration.md` |

### Dependencies

- PEOSYS source documents accessible at `C:\Users\nkwtr\Downloads\PEOSYS` or migrated to repo
- Stack declaration required before Phase 2 execution begins
- Auth provider selection required before Phase 3 execution begins
- Data API provider selection required before Phase 3 execution begins

### Acceptance Criteria (overall build — all phases)

- All 6 phases produce gated structured completion reports
- Formula unit tests cover 100% of Layer A–G calculations
- Bilingual parity (en-US / es-US) confirmed for all user-facing strings
- WCAG 2.1 AA confirmed for all UI routes
- RBAC enforced and tested for all 8 roles across all routes
- No PII in any event payload (event linting required — prohibited fields enforced)
- 4-dimension confidence scoring model implemented per Confidence & Review Trigger Standard
- All 9 automatic review triggers implemented and tested
- Kill-switch library implemented (7 PASS trigger conditions)
- Route exposure matrix enforced — no cross-route data leakage (API response filtering tested)
- Seller route: MAO hidden (N) per Formula Exposure Matrix
- Free tier: no VERIFIED/MARKET ARV, no live comps, outputs labeled user-input-driven
- Free estimator: toggle-based UI (Seller/Investor toggles), not stepped wizard

### Risk Level: HIGH

| Risk | Description |
|------|-------------|
| PII handling | Property addresses, identity fields, financial inputs require careful boundary enforcement |
| Financial disclosures | Analysis outputs have disclosure obligations — legal text pending |
| Data boundary enforcement | Multi-role RBAC must prevent cross-route data leakage |
| Third-party API reliability | Property data APIs — providers not yet selected; latency/availability risk |
| Bilingual legal/financial phrasing | Professional translation required for accuracy |
| Confidence scoring correctness | Formula-driven quality gates must match primary spec exactly |

### Required Evidence (per phase)

- Typecheck pass
- Lint pass
- Test results (unit, integration, E2E as applicable)
- Build artifact
- Formula trace for calculation-touching phases
- Event linting report for analytics-touching phases
- Bilingual parity report for UI-touching phases
- Evidence ledger update
- Gate 4A structured completion report

### Release Sensitivity

Internal product, phased delivery. No external production access until:
- Gate 6 passes for the relevant phase
- Independent QAS review complete
- Founder approval confirmed for production-facing phases

---

## Gate 1A: Plan Mode Output

**Build Class:** 3 (reclassifies to 4 at Phase 6)

**Active Cell:**
MOA · CSM · PMA · RCA · SAA · BLS · FIS · DSS · IDS · SCA · TVA + QAS (reviewer, outside cell)

**Affected Surfaces:**
Frontend · Backend API · Database · Third-party integrations · Security boundary · Agent-system wiring

**Verification Plan:**
- Unit tests: all formulas (Layers A–G, 100% coverage)
- Integration tests: all API endpoint contracts
- E2E tests: critical user flows (estimator, seller submit, investor deal view)
- Bilingual snapshot tests: all UI routes (en-US / es-US parity)
- AuthZ matrix tests: all 8 roles × all routes
- Event linting tests: confirm no prohibited PII fields in any event payload
- Confidence model tests: all 4 dimensions, all tier thresholds, all review triggers
- Kill-switch tests: all 7 PASS conditions

**Release Sensitivity:** Phased — each phase gates on TVA verification pass + Gate 4A report + QAS independent review.

**Completion Report Shape (per phase):**
- Objective completed
- Scope completed
- Exclusions preserved
- Files/surfaces changed
- Test and trace evidence
- Open risks
- QAS reviewer outcome
- Release status and next-phase readiness

---

## Gate 2: Governance Checklist

The following must be confirmed before Phase 1 execution begins.

| Item | Status | Location |
|------|--------|---------|
| Persistent root contract created | Complete | `04_products/PEO/00_governance/root-contract.md` |
| Scoped rules created | Complete | `04_products/PEO/00_governance/scoped-rules.md` |
| Agent routing note produced | Complete | `04_products/PEO/00_governance/agent-routing-note.md` |
| Build activation record complete | Complete | This document |
| PEOSYS source documents accessible | Confirmed | `C:\Users\nkwtr\Downloads\PEOSYS` (24 files) |
| Source document pointer in repo | Complete | `04_products/PEO/02_source-ref/README.md` |
| Spec index with corrections | Complete | `04_products/PEO/01_specs/spec-index.md` |
| Document registry updated | Complete | `01_system/registry/document-registry.md` |
| Reviewer path reserved | Confirmed | QAS — outside build cell |
| Repo context loaded | Complete | `00_governance/agent-routing-note.md` |
| Prompt stack linked for Phase 6 | Prepared — pending Founder + ARE approval | `00_governance/canonical-prompt-inventory.md` |
| Tool surface linked for Phase 6 | Complete | `00_governance/canonical-tool-inventory.md` |
| Phase 6 activation checklist instantiated | Complete | `00_governance/phase-6-activation-and-handoff-checklist.md` |
| Repository-agent capability map instantiated | Complete | `00_governance/repository-agent-capability-map.md` |

---

## Mandatory Stop Conditions (standing)

The build must pause immediately if any of the following occur at any phase:

- Scope exceeds the classified build level without reclassification
- Task packet becomes invalid or contradicted by new source information
- Required specialist coverage is missing for the active surface
- A required handoff cannot be completed cleanly with full evidence
- Reviewer independence is compromised (QAS must remain outside cell)
- Prompt or tool drift is introduced without approval
- Test or trace evidence exposes unresolved critical behavior
- Security, privacy, or data-integrity risk appears unexpectedly
- The cell cannot explain what changed, why it changed, and how it was verified

---

---

## Phase Log

Status note:
- `Completion report filed` means the phase has a Gate 4A artifact in the repository. It does not mean release clearance.
- Independent QAS review is complete for Phases 1–5. All prior required fixes (R-001 through R-005) confirmed closed. Phase 6 advancement cleared from QAS side — pending Founder + ARE approval and C-004 resolution.

| Phase | Status | Documented Approval | Date | Primary Artifact |
|-------|--------|-------------------|------|------------------|
| Phase 1 — Governance + Specification | Completion report filed | Not separately recorded in repo | 2026-04-16 | `01_specs/phase-1-completion-report.md` |
| Phase 2 — Public Website + Free Estimator | Completion report filed | Not separately recorded in repo | 2026-04-16 | `01_specs/phase-2-completion-report.md` |
| Phase 3 — Seller Application + Triage Engine | Completion report filed | Founder build packet recorded | 2026-04-16 | `01_specs/phase-3-completion-report.md` |
| Phase 4 — Investor Basic | QAS approved — all required fixes closed | Not verifiable in repo | 2026-04-16 | `01_specs/phase-4-completion-report.md` |
| Phase 5 — Investor Advanced | QAS approved — all required fixes closed | Not verifiable in repo | 2026-04-16 | `01_specs/phase-5-completion-report.md` |
| Phase 6 — Marketplace + Admin + Deployment | Prepared — pending Founder + ARE approval | Pending | 2026-04-16 | `01_specs/phase-6-build-packet.md` |

---

*This document is the canonical activation record for the PEO build. It supersedes any informal plans or notes.*
*Last updated: 2026-04-16 (Phase 6 Class 4 activation prep normalized; prior approval trail remains partially unverified in-repo)*
