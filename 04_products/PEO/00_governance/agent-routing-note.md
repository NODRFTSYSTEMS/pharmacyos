---
document: PEO Agent Routing Note
status: Active governance — Gate 0A deliverable
version: 1.1
date: 2026-04-16
owner: PMA + MOA + RCA
authority: Mandatory Build Activation Protocol — Gate 0A
build: Peak Equity Optimizer (PEO) — Internal Build
confidentiality: Proprietary internal — no external publishing approved
---

# PEO Agent Routing Note
## Gate 0A — Signed Agent Cell, Handoff Sequence & Evidence Requirements

---

## 1. Assigned Cell

| Agent | Code | Role | Activation Scope | Priority |
|-------|------|------|-----------------|---------|
| Master Orchestrator Agent | MOA | Orchestration and activation discipline | All phases | Always-on |
| Context State Manager | CSM | Context and state continuity across phases | All phases | Always-on |
| Product Manager Agent | PMA | Build packet control, gate enforcement | All phases | Always-on |
| Repository Context Assistant | RCA | Repository-context loading, pattern inventory | Every governed phase | Mandatory — no exceptions |
| Systems Architecture Agent | SAA | Product boundary setting, service decomposition | Phase 1, any boundary-setting | Activate when scope is uncertain |
| Backend & Logic Specialist | BLS | API services, formula engine, triage, deal-readiness, confidence scoring | Phases 2–6 | Primary backend implementation |
| Frontend Implementation Specialist | FIS | All 5 UI routes, bilingual UI, estimator toggles, design system | Phases 2–6 | Primary frontend implementation |
| Database & Schema Specialist | DSS | Full schema design, migrations, audit log, versioning | Phases 3–6 | Required when schema changes |
| Integration & Debugging Specialist | IDS | Property data APIs, auth provider, third-party wiring | Phases 3–5 | Required when third-party surfaces active |
| Security & Compliance Agent | SCA | RBAC enforcement, PII controls, event linting, disclosures, upload scanning | Phases 3–6 | Required when auth, PII, or disclosure surface active |
| Test & Verification Assistant | TVA | Verification, test design, evidence production | Every phase with behavior change | Mandatory |
| Quality Assurance Supervisor | QAS | Independent review — reviewer only | All phases | Reserved — outside build cell |

---

## 2. Justification per Role

**MOA / CSM / PMA** — core governance triad; required by protocol on every governed build.

**RCA** — repo has no prior PEO context; RCA must load repository patterns and conventions before any implementation begins. Mandatory every phase.

**SAA** — 8-service product with multiple cross-domain boundaries (estimator, seller, investor, triage, readiness, marketplace). Architecture and service decomposition must be defined before BLS and FIS begin Phase 2. Required whenever domain boundaries are disputed or unclear.

**BLS** — primary backend implementation for the entire formula engine (30+ formulas across Layers A–G), triage engine, deal-readiness logic, confidence scoring model, kill-switch library, and all API services. Cannot be substituted on this build.

**FIS** — 5 distinct route UIs with bilingual parity (en-US / es-US), WCAG 2.1 AA, and a toggle-based estimator (not a stepped wizard). Cannot be substituted on this build.

**DSS** — full schema designed from scratch (13+ entities). No prior schema exists in repo. Required at Phase 3 when schema first lands, continuing through Phase 6 for migrations and audit log expansion.

**IDS** — third-party property data API integration (county assessor feeds, listing platforms, geocoding) and auth provider integration are core to Phase 3+ functionality. Providers not yet selected (O-001, O-004); IDS activates when providers are confirmed.

**SCA** — PII handling (addresses, identity fields), RBAC across 8 roles, financial disclosure compliance, event linting to prevent PII in analytics payloads. Required whenever auth, PII, or disclosure-sensitive surface is active. Not optional from Phase 3 forward.

**TVA** — 80%+ unit test coverage required by protocol; formula regression suite (100% Layer A–G), E2E critical flows, bilingual snapshot tests, authz matrix tests. Required every phase with behavior change.

**QAS** — reserved as the independent reviewer. Must remain outside the build cell. Self-review does not satisfy this gate.

---

## 3. Handoff Sequence

### Phase 1 → Phase 2

**Sending:** SAA + PMA
**Receiving:** BLS + FIS + TVA
**Trigger:** SAA architecture boundary document complete, PMA build packet for Phase 2 approved
**Bounded surface transferred:** Service decomposition, API boundary definitions, data model skeleton, design system baseline
**Evidence package required:**
- Architecture decision log (service names, boundaries, rationale)
- Entity list with relationship summary (full DSS schema begins Phase 3)
- Formula scope confirmed for Phase 2 (Layers E + F only — manual inputs, no live data)
- Design system token set (colors, typography, spacing defined)
**Fallback:** If SAA stalls on boundary decisions — escalate to QAS + PMA for resolution before Phase 2 begins

### Phase 2 → Phase 3

**Sending:** BLS + FIS + TVA
**Receiving:** BLS + DSS + IDS + SCA + TVA (FIS continues)
**Trigger:** TVA formula unit tests pass (100% Layer E + F coverage) + Gate 4A completion report for Phase 2
**Bounded surface transferred:** Working public website, free estimator (both toggles), estimator API with manual-input formulas
**Evidence package required:**
- Formula unit test results (Layer E + F, 100% pass)
- Bilingual parity confirmation (en-US / es-US) for all Phase 2 strings
- Lighthouse performance pass (thresholds defined in Phase 2 build packet)
- WCAG 2.1 AA confirmation for Phase 2 routes
- Estimator API contract documented
**Fallback:** If TVA cannot confirm 100% formula coverage — Phase 3 does not start

### Phase 3 → Phase 4

**Sending:** BLS + DSS + IDS + SCA + TVA
**Receiving:** BLS + IDS + TVA + SCA (FIS continues for UI, DSS on-call for schema additions)
**Trigger:** Integration test pass for seller API + SCA PII review pass + Gate 4A completion report for Phase 3
**Bounded surface transferred:** Seller Application (intake, property profile, comps, path comparison, seller report), triage engine, deal-readiness logic, schema v1.0
**Evidence package required:**
- Schema migration record (schema v1.0 landed)
- API integration test results for data providers
- PII event linting report (no prohibited fields)
- SCA RBAC sign-off for seller role
- Triage engine test traces (flag logic, readiness stages)
- Deal-readiness item taxonomy approved (DR-G1 resolved)
**Fallback:** If data provider not yet selected — Phase 3 uses stubbed APIs with real contract; IDS documents provider requirements

### Phase 4 → Phase 5

**Sending:** BLS + IDS + TVA + SCA
**Receiving:** BLS + DSS + FIS + SCA + TVA
**Trigger:** VERIFIED ARV test pass + confidence scoring test pass (all 4 dimensions, all tiers) + SCA data exposure review sign-off + Gate 4A completion report
**Bounded surface transferred:** Investor Basic dashboard (quick analyze, auto facts, sold comps, VERIFIED/MARKET ARV, MAO, ROI, stress case, binding offer cap)
**Evidence package required:**
- VERIFIED ARV calculation test traces (median of qualified comps)
- Confidence scoring test matrix (Data/Comp/Valuation/Model dimensions)
- All 9 review trigger tests passing
- Kill-switch library tests (7 PASS conditions)
- AuthZ matrix test results for investor_basic role
- Route exposure test: MARKET ARV confirmed reference-only (not primary input)
**Fallback:** If confidence model implementation disputes spec — BLS + TVA document conflict, escalate to PMA before Phase 5

### Phase 5 → Phase 6

**Sending:** BLS + DSS + FIS + SCA + TVA
**Receiving:** Core stack `MOA + CSM + PMA + SAA + RCA + TVA`; receiving specialist cell `BLS + FIS + SCA + DRA + PIS`
**Trigger:** Scenario planner test pass + export controls verified + SCA sign-off + Gate 4A completion report
**Bounded surface transferred:** Investor Advanced outputs plus any pre-existing Phase 6-adjacent vendor/admin APIs that must be normalized under Class 4 governance before deployment
**Evidence package required:**
- Export permission test results (investor_advanced only)
- Watermarking implementation confirmation (if applicable)
- Full formula regression (all 30+ formulas, all routes, all exposure levels)
- DSCR/refi formula test traces
- Scenario planner test (base/upside/downside delta verification)
- SCA sign-off on download/export controls
**Fallback:** If export scope is disputed — escalate to Founder before Phase 6

### Phase 6 Gate (Class 4 reclassification)

**Reclassify to Class 4 before Phase 6 begins.**
**Core Class 4 stack remains active:** `MOA`, `CSM`, `PMA`, `SAA`, `RCA`, `TVA`
**Additional agents required:** `DRA` (deployment readiness), `PIS` (platform/infrastructure), `QDA` (if release documentation required)
**Founder approval required** to advance into Phase 6 execution and before production deployment.
**ARE packet approval required** before Gate 3 execution.
**QAS independent review required** — full system test pass, deployment checklist, security sign-off.

---

## 4. Evidence Requirements Between Handoffs

Every phase handoff must include all of the following as applicable:

| Evidence Type | Required When |
|--------------|--------------|
| Formula unit test results | Any phase touching calculation logic |
| Integration test results | Any phase with API contract changes |
| E2E test results | Phase 2 (estimator), Phase 3 (seller submit), Phase 4 (deal view), Phase 5 (export) |
| Bilingual parity report | Any phase with user-facing string changes |
| Accessibility confirmation | Any phase with new UI routes |
| AuthZ matrix test results | Any phase with new role permissions |
| PII event linting report | Any phase with new event instrumentation |
| Schema migration record | Any phase with schema changes |
| SCA sign-off | Any phase with auth, PII, or disclosure surface changes |
| Gate 4A structured completion report | Every phase |

---

## 5. Capability Gaps and Closure Plan

| Gap | Current Status | Closure Required Before |
|-----|---------------|------------------------|
| Auth provider confirmed (O-001) | **Closed 2026-04-16** | ~~Phase 3 execution~~ — unblocked |
| Data API provider selection | **Closed 2026-04-16** — Rentcast confirmed and Phase 4 integration landed | ~~Phase 3 / Phase 4~~ — unblocked |
| Cloud/infra stack declaration (O-004) | **Closed 2026-04-16** — see `tech-stack.md` | ~~Phase 6 execution~~ — unblocked |
| Phase 4–5 independent QAS review artifact | Open | Phase 6 Gate 3 |
| Phase 6 Class 4 build packet | Complete — prepared 2026-04-16 | Founder + ARE approval before Phase 6 Gate 3 |
| Phase 6 activation checklist | Complete — prepared 2026-04-16 | Gate 2 confirmation |
| Prompt and tool inventories | Complete — prepared 2026-04-16 | Founder + ARE approval before Phase 6 Gate 3 |
| Repository-agent capability map | Complete — prepared 2026-04-16 | Phase 6 Gate 0A / Gate 2 reference |
| Upload malware scanning vendor (O-005) | Open | Production release with uploads |
| Final legal text (O-002) | Open | Public release |
| Professional translation review (O-003) | Open | Any UI release |
| Vercel / Neon / Clerk / R2 production env provisioning and deploy rehearsal | Open | Phase 6 Gate 4 / Gate 6 |

Until gaps are closed: phases that depend on these capabilities may proceed with stubbed implementations documented clearly; stub must be replaced before Gate 4A passes for that phase.

---

## 6. Routing Note Sign-Off

This routing note is produced by MOA + PMA + RCA per Gate 0A of the Mandatory Build Activation Protocol.

The Phase 6 Class 4 activation may not begin (Gate 3) until this routing note update is accepted by the Founder and ARE.

| Role | Status |
|------|--------|
| MOA — routing note updated | Complete |
| PMA — Phase 6 build packet aligned | Complete |
| RCA — repository context assessed | Complete |
| Founder acceptance | Pending |
| ARE acceptance | Pending |

---

*Routing note version 1.1 — 2026-04-16*
*Authority: `01_system/ai-governance/mandatory-build-activation-protocol-2026-04-15.md` Gate 0A*
