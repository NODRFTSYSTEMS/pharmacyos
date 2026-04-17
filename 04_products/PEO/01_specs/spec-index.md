---
document: PEO Specification Index
status: Active reference
version: 1.0
date: 2026-04-16
owner: PMA
source: C:\Users\nkwtr\Downloads\PEOSYS (24 primary source files)
confidentiality: Proprietary internal — no external publishing approved
---

# PEO Specification Index
## Primary Source Documents + Binding Corrections

All 18 DOCX specification documents, 2 PDF documents, 1 XLSX model, and 1 logo asset from `C:\Users\nkwtr\Downloads\PEOSYS` are the canonical implementation references for this build. The Build-Ready Spec Pack (PDF) is a useful structural reference but where it conflicts with the DOCX primary sources, the DOCX sources govern.

---

## Primary Source Documents

### Blueprint

| File | Description | Build Authority |
|------|-------------|----------------|
| `Peak_Equity_Optimizer_Blueprint_Rewrite_2026.pdf` | Master product vision, 6 build phases, product routes, design posture | Binding — defines overall scope and phases |

### Calculation Governance (binding contracts)

| File | Description | Used In |
|------|-------------|---------|
| `PEO_Formula_Registry_v1.docx` | 30+ formulas, Layers A–G, per-formula inputs/outputs/defaults/routes | All phases with calculation logic |
| `PEO_Formula_by_Route_Exposure_Matrix.docx` | Y/S/R/N visibility per formula per route (Free/Seller/Basic/Adv/Admin) | API response filtering, all phases |
| `PEO_Route_Matrix_and_Calculation_Standards.docx` | Master route definitions, calculation standards v2.0, removed defective expressions | Master reference — all phases |
| `PEO_Comp_Inclusion_Exclusion_Standard.docx` | Comp quality scoring, mandatory inclusion/exclusion rules, minimum support requirements | Phases 3–5 |
| `PEO_Confidence_and_Review_Trigger_Standard.docx` | 4-dimension confidence model, tier thresholds, 9 review triggers, review queues/SLAs | Phases 3–5 |
| `PEO_Field_Level_Source_Hierarchy_Matrix.docx` | Field-by-field source priority (County > Listing > Estimated), conflict resolution | Phases 3–5 |

### Product Specifications (per route/system)

| File | Route/System | Phase |
|------|-------------|-------|
| `PEO_Public_Website_Spec.docx` | Public Website | Phase 2 |
| `PEO_Free_Estimator_Spec.docx` | Free Estimator (Seller + Investor toggles) | Phase 2 |
| `PEO_Seller_App_Spec.docx` | Seller Application | Phase 3 |
| `PEO_Investor_Basic_Spec.docx` | Investor Basic | Phase 4 |
| `PEO_Investor_Advanced_Spec.docx` | Investor Advanced | Phase 5 |
| `PEO_Marketplace_Vendor_Trust_Spec.docx` | Marketplace + Vendor Trust | Phase 6 |
| `PEO_Triage_Engine_Spec.docx` | Triage Engine | Phase 3 |
| `PEO_Deal_Readiness_Logic_Spec.docx` | Deal-Readiness Logic | Phase 3 |
| `PEO_Trust_Methodology_Center_Spec.docx` | Trust & Methodology Center | Phase 2+ |

### Cross-Cutting Specs

| File | Description | Applies To |
|------|-------------|-----------|
| `PEO_API_Abstraction_Data_Architecture.docx` | Service boundaries, data model, API contracts, versioning | All phases |
| `PEO_Event_Instrumentation_Plan.docx` | PII-safe event taxonomy, 17+ core events, schema | All phases |
| `PEO_House_Style_Design_System.docx` | Design tokens, typography, components, bilingual layout | All phases |
| `PEO_QA_Release_Controls.docx` | Gate definitions, test matrix, release process | All phases |
| `PEO_Claude_Code_Handoff_Package.docx` | Build sequence, repo structure, implementation rules | All phases |

### Model

| File | Description |
|------|-------------|
| `PEO_Investment_Calculator_v2.1_3Tier_Architecture.xlsx` | 3-tier spreadsheet model — reference for formula validation |

### Asset

| File | Description |
|------|-------------|
| `Peak Equity Optimizer logo design.png` | 1536×1024 RGBA logo asset — use in design system |

---

## Binding Corrections

The Build-Ready Spec Pack (PDF) was generated without access to the DOCX primary sources. The following corrections are binding. Any implementation that follows the spec pack on these points without applying these corrections is in defect.

### C-001: MAO Hidden on Seller Route — CRITICAL

**Spec pack claim:** Seller Application includes proceeds/path analysis (implied MAO available)
**Binding rule:** MAO is N (hidden) for the Seller route per Formula Exposure Matrix.
**Impact:** Seller Application must not calculate or display MAO. Seller route is for proceeds framing and market positioning only.
**Source:** `PEO_Formula_by_Route_Exposure_Matrix.docx` — Layer F, Seller column

---

### C-002: MARKET ARV Is Reference-Only on Investor Basic — HIGH

**Spec pack claim:** "MARKET ARV displayed" for Investor Basic (implies active underwriting input)
**Binding rule:** MARKET ARV is a reference figure for Investor Basic — not a primary underwriting input. It must be labeled as such in the UI.
**Impact:** MARKET ARV shown with reference label only. Used for market context, not for MAO calculations.
**Source:** `PEO_Route_Matrix_and_Calculation_Standards.docx` v2.0

---

### C-003: Free Tier — No Live Data, No ARV — CRITICAL

**Spec pack claim:** Estimator output may include VERIFIED/MARKET ARV references
**Binding rule:** Free tier explicitly prohibits VERIFIED ARV, MARKET ARV, live comps, and live DOM. All free outputs must carry label: "user-input driven / not comp-verified / not based on live facts."
**Impact:** Estimator API for free tier uses only manual user inputs (Layers E + F). No external data calls.
**Source:** `PEO_Route_Matrix_and_Calculation_Standards.docx` v2.0 — Free Application section

---

### C-004: No Separate Deal Entity — HIGH

**Spec pack claim:** ER diagram shows `Deal` as a potential separate entity ("if separate from SellerApplication; OPEN")
**Binding rule:** SellerApplication IS the deal record. No separate Deal entity.
**Impact:** DSS must not create a separate Deal table. SellerApplication carries all deal fields.
**Source:** `PEO_Route_Matrix_and_Calculation_Standards.docx` v2.0 — data model sections

---

### C-005: Free Estimator Is Toggle-Based, Not Stepped Wizard — MEDIUM

**Spec pack claim:** Free estimator is "step-based" with multi-step input collection
**Binding rule:** Free estimator uses Seller Toggle and Investor Toggle — two modes on a single calculator interface. Not a stepped wizard.
**Impact:** FIS must implement toggle-based UI (not wizard). Step completion events should track toggle changes, not wizard steps.
**Source:** `PEO_Free_Estimator_Spec.docx`, `PEO_Route_Matrix_and_Calculation_Standards.docx`

---

## Formulas Missing from Spec Pack (now resolved by primary sources)

The following were listed as OPEN in the spec pack but are fully defined in primary source documents:

| Formula/Rule | Source Document | Formula ID |
|-------------|----------------|-----------|
| Required Profit | `PEO_Formula_Registry_v1.docx` | F-F-004: MAX($30,000, ARV × 15%) |
| Stress Profit | `PEO_Formula_Registry_v1.docx` | (ARV × 0.95) − purchase − closing − (repairs × 1.15) − carry − disposition − points |
| Comp quality scoring | `PEO_Comp_Inclusion_Exclusion_Standard.docx` | Geography 30%, Recency 25%, GLA 20%, Physical 15%, Condition 10% |
| Confidence 4-dimension model | `PEO_Confidence_and_Review_Trigger_Standard.docx` | Full scoring table |
| Kill-switch conditions | `PEO_Confidence_and_Review_Trigger_Standard.docx` | 7 PASS triggers |
| Field source hierarchy | `PEO_Field_Level_Source_Hierarchy_Matrix.docx` | Field-by-field priority table |
| All Layer A–G formulas | `PEO_Formula_Registry_v1.docx` | F-A-001 through F-G-005 (30+ entries) |
| Route exposure matrix | `PEO_Formula_by_Route_Exposure_Matrix.docx` | Full Y/S/R/N table |
| All default values | `PEO_Route_Matrix_and_Calculation_Standards.docx` | Defaults table |

---

## True Remaining Open Items

These are unresolved in both the spec pack and primary sources. No implementation should assume or invent values.

| ID | Item | Unblocks |
|----|------|---------|
| O-001 | Auth provider / SSO / MFA vendor — **Closed 2026-04-16** (Clerk confirmed) | ~~Phase 3~~ — unblocked |
| O-002 | Final legal text (T&C, privacy policy, consumer disclosures) | Phase 2 public release |
| O-003 | Professional translation vendor and review process | Any UI release |
| O-004 | Tech stack declaration (language, framework, cloud provider) — **Closed 2026-04-16** (see `00_governance/tech-stack.md`) | ~~Phase 2~~ — unblocked |
| O-005 | Upload malware scanning vendor/capability | Phase 3 |
| O-006 | Pricing / tier amounts | **Closed 2026-04-16** — see `00_governance/pricing-declaration.md` | ~~Pricing-linked UI~~ — unblocked |

---

## Build Sequence Reference

| Phase | Primary Specs | Key Dependencies |
|-------|-------------|-----------------|
| 1 — Governance + Spec | This index, 00_governance/ | Stack declaration (O-004) |
| 2 — Website + Free Estimator | Public Website Spec, Free Estimator Spec | Legal text draft (O-002), stack declared |
| 3 — Seller Application | Seller App Spec, Triage Engine, Deal Readiness, API/Data Architecture | Auth provider (O-001), data APIs, upload scanning (O-005) |
| 4 — Investor Basic | Investor Basic Spec, Formula Registry, Comp Standard, Confidence Standard | Phase 3 complete |
| 5 — Investor Advanced | Investor Advanced Spec, Formula Registry (advanced formulas) | Phase 4 complete |
| 6 — Marketplace + Admin | Marketplace Spec, QA/Release Controls | Phase 5 complete, stack/infra declared (O-004) |
