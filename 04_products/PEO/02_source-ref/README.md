---
document: PEO Source Documents Reference
status: Active reference
version: 1.0
date: 2026-04-16
owner: PMA
confidentiality: Proprietary internal — no external publishing approved
---

# PEO Primary Source Documents

## Location

```
C:\Users\nkwtr\Downloads\PEOSYS\
```

## Contents (24 files)

| File | Type | Description |
|------|------|-------------|
| `Peak_Equity_Optimizer_Blueprint_Rewrite_2026.pdf` | PDF | Master blueprint — 6 phases, product routes, design posture |
| `Peak Equity Optimizer Build-Ready Spec Pack.pdf` | PDF | Structured spec shell (use DOCX sources as primary — see spec-index.md for corrections) |
| `PEO_Formula_Registry_v1.docx` | DOCX | 30+ formulas, Layers A–G |
| `PEO_Formula_by_Route_Exposure_Matrix.docx` | DOCX | Route exposure control (Y/S/R/N per formula per route) |
| `PEO_Route_Matrix_and_Calculation_Standards.docx` | DOCX | Master route matrix v2.0 |
| `PEO_Comp_Inclusion_Exclusion_Standard.docx` | DOCX | Comp quality scoring and rules |
| `PEO_Confidence_and_Review_Trigger_Standard.docx` | DOCX | 4-dimension confidence model, review triggers |
| `PEO_Field_Level_Source_Hierarchy_Matrix.docx` | DOCX | Field source priority and conflict resolution |
| `PEO_Public_Website_Spec.docx` | DOCX | Public website |
| `PEO_Free_Estimator_Spec.docx` | DOCX | Free estimator (toggle-based) |
| `PEO_Seller_App_Spec.docx` | DOCX | Seller application |
| `PEO_Investor_Basic_Spec.docx` | DOCX | Investor Basic |
| `PEO_Investor_Advanced_Spec.docx` | DOCX | Investor Advanced |
| `PEO_Marketplace_Vendor_Trust_Spec.docx` | DOCX | Marketplace and vendor trust |
| `PEO_Triage_Engine_Spec.docx` | DOCX | Triage engine |
| `PEO_Deal_Readiness_Logic_Spec.docx` | DOCX | Deal-readiness logic |
| `PEO_Trust_Methodology_Center_Spec.docx` | DOCX | Trust and methodology center |
| `PEO_API_Abstraction_Data_Architecture.docx` | DOCX | API contracts, data model, versioning |
| `PEO_Event_Instrumentation_Plan.docx` | DOCX | Analytics event taxonomy |
| `PEO_House_Style_Design_System.docx` | DOCX | Design tokens, components, bilingual layout |
| `PEO_QA_Release_Controls.docx` | DOCX | QA gates and release process |
| `PEO_Claude_Code_Handoff_Package.docx` | DOCX | Build sequence and implementation rules |
| `PEO_Investment_Calculator_v2.1_3Tier_Architecture.xlsx` | XLSX | 3-tier formula model (reference for validation) |
| `Peak Equity Optimizer logo design.png` | PNG | Logo asset 1536×1024 |

## Usage Note

These source documents are the implementation authority for this build. All agents loading context for PEO phases must reference the relevant source documents before executing. Do not implement from memory or from the spec pack PDF alone — always verify against the DOCX sources.

For corrections where the spec pack PDF conflicts with DOCX sources, see: `04_products/PEO/01_specs/spec-index.md` — Binding Corrections section.

## Recommended Migration

For build stability, migrate the PEOSYS source documents into the repo at `04_products/PEO/02_source-ref/docs/` before Phase 2 execution. Until migration: load directly from the path above.
