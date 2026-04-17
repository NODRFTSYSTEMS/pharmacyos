---
document: PEO Phase 3 Build Packet
status: Historical reference — Phase 3 packet filed
version: 1.1
date: 2026-04-16
owner: PMA
approved-by: Founder (nodrftsystems)
authority: Mandatory Build Activation Protocol — Gate 1 build packet template
confidentiality: Proprietary internal — no external publishing approved
---

# PEO Phase 3 Build Packet
## Seller Application + Triage Engine + Deal-Readiness Logic

---

## Phase Gate Status

| Prior Phase | Status | Evidence |
|-------------|--------|---------|
| Phase 1 — Governance + Specification | Complete | `01_specs/phase-1-completion-report.md` |
| Phase 2 — Public Website + Free Estimator | Complete | `01_specs/phase-2-completion-report.md` — 10/10 tests pass, zero TS errors |

**Phase 3 Founder approval:** Confirmed 2026-04-16

---

## Active Cell (Phase 3)

| Agent | Role | Surface |
|-------|------|---------|
| BLS | Backend & Logic Specialist — **primary** | Seller app API, triage engine, readiness logic, formula Layers A–C |
| DSS | Database & Schema Specialist | Schema migration — new Phase 3 entities (UploadArtifact, TriageResult, ReadinessPlan, ReadinessItem) |
| IDS | Integration & Debugging Specialist | Clerk RBAC wiring, property data API stub/integration, R2 upload |
| SCA | Security & Compliance Agent | RBAC enforcement (seller roles), PII boundary on triage/seller data, seller report disclosure |
| TVA | Test & Verification Assistant | Integration tests (seller API contracts), formula trace (Layers A–C), PII event linting |
| RCA | Repository Context Assistant | Mandatory every governed phase |
| PMA | Product Manager Agent — orchestration | Build packet control, scope enforcement, evidence ledger |

QAS (reviewer, outside cell) — available at Phase 3 gate.

---

## Objective

Implement the Seller Application, Triage Engine, and Deal-Readiness Logic for the Peak Equity Optimizer.

The seller applicant submits a property for evaluation. The triage engine runs automated qualification (formula Layers A–C, confidence scoring, kill-switch evaluation). The readiness system generates a structured plan for the seller to address gaps.

---

## In-Scope Deliverables

### Seller Application (seller service)
- Seller application CRUD (create, read, update status)
- Property profile intake (address, condition class, known items)
- `POST /api/v1/seller/application` — create
- `GET /api/v1/seller/application/:id` — retrieve
- `PATCH /api/v1/seller/application/:id` — update
- `POST /api/v1/seller/application/:id/submit` — submit for triage
- Upload artifact handling (R2 signed URL generation, upload record)
- Seller dashboard page: `src/app/[locale]/seller/`
- Role enforcement: `seller_applicant` and `seller_verified` only
- MAO is **N (hidden)** on seller route — no MAO calculation or display

### Triage Engine (triage service)
- Automated triage on submit: runs formula engine Layers A–C (fact, comp evidence, valuation)
- Confidence scoring: all 4 dimensions (Data, Comp, Valuation, Model)
- Confidence tier assignment (HIGH / MEDIUM / LOW / VERY LOW) with display color
- All 9 automatic review triggers evaluated and queued when triggered
- Kill-switch library: all 7 PASS conditions evaluated — any PASS halts analysis
- PASS trigger output: user-facing disclosure only (no specific trigger exposed to seller)
- TriageResult versioned: `engine_version` + `formula_version` recorded on every run
- `POST /api/v1/triage/run` — internal, triggered on seller submit
- `GET /api/v1/triage/:id` — retrieve result (admin + seller_verified only)
- AuditLog entry on every triage run

### Deal-Readiness Logic (readiness service)
- ReadinessPlan generated from TriageResult
- ReadinessItem taxonomy: structured gap list (address, condition, documentation, data quality)
- Progress tracking: items updated as seller resolves gaps
- `GET /api/v1/readiness/:applicationId` — retrieve plan
- `PATCH /api/v1/readiness/item/:id` — update item status
- ReadinessPlan versioned: `taxonomy_version` recorded
- AuditLog entry on every readiness view by an investor

### RBAC Wiring (identity service)
- Clerk middleware integrated into Next.js App Router
- Server-side role resolution on all Phase 3 API routes
- Role upgrade path: `seller_applicant` → `seller_verified` on admin action
- All role changes write AuditLog entry

### Schema Migration (DSS)
New Prisma models for Phase 3 (additions to Phase 1 skeleton):
- `UploadArtifact` (full implementation — was skeleton in Phase 1)
- `TriageResult` (engine_version, formula_version, confidence scores, trigger flags, pass_flag)
- `ReadinessPlan` (taxonomy_version, status)
- `ReadinessItem` (category, description, status, resolved_at)
- `AuditLog` (full implementation — was skeleton in Phase 1)

---

## Exclusions (Phase 3)

| Exclusion | Reason |
|-----------|--------|
| No MAO display or calculation on seller route | Binding rule C-001 — N per Formula Exposure Matrix |
| No investor formula layers (D full, F, G) | Investor surfaces not in Phase 3 scope |
| No live property data API (O-TBD) | Provider not yet selected — use stub/placeholder data in triage engine |
| No upload malware scanning (O-005) | Stub only — vendor TBD |
| No final legal text (O-002) | Counsel not yet engaged |
| No professional translation review (O-003) | Vendor not yet confirmed |
| No marketplace or vendor surfaces | Phase 6 scope |

**Property data API:** **Rentcast** is the confirmed provider (Founder-directed, 2026-04-16). Covers property facts, comparable sales, and AVM valuation. Implement `src/lib/property-data/rentcast.ts` replacing the existing stub. API key stored as `RENTCAST_API_KEY` in environment variables. Stub at `stub.ts` remains for unit test isolation only.

---

## Formula Scope (Phase 3 seller route)

Per scoped-rules.md section 3 — Paid Seller formula scope:

- **Layer A (fact acquisition):** address geocoding, county assessor lookup, APN resolution
- **Layer B (comp evidence):** comp search cascade (subdivision → 0.5mi → 1.0mi → broader), comp quality scoring (Geography 30%, Recency 25%, GLA 20%, Physical 15%, Condition 10%)
- **Layer C (valuation):** VERIFIED ARV = median of qualified sold comps — **range presentation only on seller route** (not single value)
- **Layer D:** condition class + repair summary only (no line-item breakdown)
- **Layer E:** costs exposed
- **Layer F:** proceeds and path comparison only — **MAO = N (hidden)**
- **Layer G:** market risk and rehab risk at summary level — no PASS trigger text exposed

---

## Primary Source Documents (Phase 3)

Load and reference these before implementing:

| Document | Location | Applies To |
|----------|----------|-----------|
| `PEO_Seller_App_Spec.docx` | `C:\Users\nkwtr\Downloads\PEOSYS` | Seller application |
| `PEO_Triage_Engine_Spec.docx` | `C:\Users\nkwtr\Downloads\PEOSYS` | Triage engine |
| `PEO_Deal_Readiness_Logic_Spec.docx` | `C:\Users\nkwtr\Downloads\PEOSYS` | Readiness system |
| `PEO_API_Abstraction_Data_Architecture.docx` | `C:\Users\nkwtr\Downloads\PEOSYS` | API contracts, data model |
| `PEO_Formula_Registry_v1.docx` | `C:\Users\nkwtr\Downloads\PEOSYS` | Layers A–G formula definitions |
| `PEO_Formula_by_Route_Exposure_Matrix.docx` | `C:\Users\nkwtr\Downloads\PEOSYS` | Seller route exposure (MAO = N) |
| `PEO_Confidence_and_Review_Trigger_Standard.docx` | `C:\Users\nkwtr\Downloads\PEOSYS` | Confidence model, review triggers |
| `PEO_Comp_Inclusion_Exclusion_Standard.docx` | `C:\Users\nkwtr\Downloads\PEOSYS` | Comp scoring, support minimums |
| `PEO_Field_Level_Source_Hierarchy_Matrix.docx` | `C:\Users\nkwtr\Downloads\PEOSYS` | Field source priority |

---

## Required Evidence (Phase 3 gate)

| Evidence | Owner | Requirement |
|----------|-------|-------------|
| TypeScript typecheck pass | BLS/FIS | Zero errors |
| ESLint pass | BLS/FIS | Clean |
| Schema migration | DSS | Prisma migrate applied, no breaking changes |
| Seller API integration tests | TVA | All 5 seller endpoints tested (create, get, update, submit, upload) |
| Triage engine unit tests | TVA | Formula Layers A–C, confidence scoring, all 9 triggers, all 7 kill-switch conditions |
| Readiness system tests | TVA | Plan generation, item update, taxonomy versioning |
| RBAC authz matrix tests | TVA/SCA | Seller routes — all 8 roles tested, unauthorized access returns 403 |
| PII event linting report | SCA | Zero prohibited fields in any event payload |
| SCA sign-off | SCA | Seller data exposure, triage output disclosure, PASS trigger concealment |
| AuditLog coverage verification | TVA | All 7 audit triggers fire correctly |
| Evidence ledger update | PMA | `00_governance/evidence-ledger.md` updated |
| Gate 4A structured completion report | PMA | `01_specs/phase-3-completion-report.md` |

---

## Handoff Trigger (Phase 3 → Phase 4)

Phase 3 is complete and Phase 4 may begin when:

1. All required evidence above is produced and passes
2. Gate 4A structured completion report (`phase-3-completion-report.md`) is filed
3. QAS review of Phase 3 artifacts is complete
4. Founder approval to advance to Phase 4 is confirmed

Phase 4 active cell: BLS + IDS + TVA + SCA (Investor Basic — full Layers A–G at Basic exposure level).

---

## Open Items Blocking or Conditioning Phase 3

| ID | Item | Impact on Phase 3 |
|----|------|-------------------|
| ~~O-TBD-DataAPI~~ | Property data API provider | **Closed 2026-04-16** — Rentcast confirmed; see `open-items-tracker.md` |
| O-002 | Final legal text | Legal pages remain placeholder — does not block Phase 3 execution |
| O-003 | Professional translation review | Spanish strings implemented but unreviewed — does not block Phase 3 execution |
| O-005 | Upload malware scanning vendor | Upload endpoint uses stub — flag in evidence ledger, must resolve before Phase 3 production release |

---

*Phase 3 Build Packet version 1.1 — historical packet retained after Phase 3 completion*
*Authority: `01_system/ai-governance/mandatory-build-activation-protocol-2026-04-15.md`*
