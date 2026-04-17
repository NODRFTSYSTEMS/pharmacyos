---
document: PEO Root Contract
status: Active governance — persistent across all build phases
version: 1.0
date: 2026-04-16
owner: Founder (nodrftsystems)
authority: Build Context Engineering Standard — `01_system/ai-governance/build-context-engineering-standard-2026-04-15.md`
confidentiality: Proprietary internal — no external publishing approved
---

# PEO Root Contract
## Persistent Non-Negotiable Build Rules — All Phases

This document is the highest-priority durable instruction layer for the Peak Equity Optimizer build. It persists across all build phases and all build prompts. It may not be silently dropped, overridden by scoped rules, or weakened by convenience.

---

## 1. Mission

Build the Peak Equity Optimizer as a trust-based real-estate intelligence and execution platform. Every decision in this build serves that mission. Trust is not a feature — it is the architecture.

---

## 2. Non-Negotiable Quality Rules

### 2.1 Formula Governance
- The Formula Registry (`PEO_Formula_Registry_v1.docx`) is the binding calculation contract. No formula may be implemented in a way that contradicts the Registry.
- The Formula Exposure Matrix (`PEO_Formula_by_Route_Exposure_Matrix.docx`) is the binding route-boundary control. No formula output may be exposed to a route that shows it as N (hidden) in the matrix.
- The Confidence & Review Trigger Standard (`PEO_Confidence_and_Review_Trigger_Standard.docx`) is binding. Confidence scoring, tier thresholds, and review triggers are not optional quality enhancements — they are product requirements.
- The Comp Inclusion/Exclusion Standard (`PEO_Comp_Inclusion_Exclusion_Standard.docx`) is binding. No comp logic may be implemented that contradicts these rules.
- The Field Source Hierarchy Matrix (`PEO_Field_Level_Source_Hierarchy_Matrix.docx`) is binding. Source precedence rules and conflict resolution behavior are not configurable — they are fixed logic.

### 2.2 Route Boundaries (enforced, not aspirational)
- **Free tier**: No VERIFIED ARV, no MARKET ARV, no live comps, no live DOM data. All outputs must be labeled: user-input driven / not comp-verified / not based on live facts.
- **Seller route**: MAO is hidden (N). The Seller Application is for proceeds analysis and market positioning — not for investor offer calculation.
- **Investor Basic**: MARKET ARV is reference-only. It is not a primary underwriting input and must not be presented as such.
- **Investor Advanced**: Full formula set at Advanced exposure level. No formula omissions for convenience.
- Cross-route data leakage is a defect. API responses must be filtered to route-allowed fields.

### 2.3 Data Quality
- Conservative conflict resolution: when sources conflict on a field, use the more conservative (lower/older/smaller) value and log the conflict.
- The APN/Parcel field must halt analysis if unresolvable — no silent fallback.
- Every estimated field must be disclosed in the output.
- Confidence tier must always be displayed with any analysis output (Investor Basic and above).

### 2.4 Security and Privacy
- No PII in any event payload. Prohibited fields are: full address, full name, email/phone, SSN, account numbers, unredacted free-text uploads. This list is a floor — do not add more prohibited categories silently; if unsure, escalate.
- RBAC is enforced server-side for all 8 roles. Client-side role checks are supplemental, not authoritative.
- Audit logging is required for: all sensitive actions, all exports/downloads, all admin actions, all triage/readiness views by investors, all override events.
- Upload storage must use signed URLs with time-limited access. Direct public URL exposure is not permitted.
- Rate limiting is required on all public-facing endpoints and the estimator calculate endpoint.

### 2.5 Bilingual Parity
- All user-facing strings must support en-US and es-US at parity. Hard-coded strings in UI are not permitted.
- Legal and financial phrasing requires professional translation review before release. Machine translation alone does not satisfy this gate.
- Bilingual snapshot tests are required for every UI route.

### 2.6 Accessibility
- WCAG 2.1 AA is the minimum standard. It applies to all routes without exception.
- Keyboard navigation must work for all interactive flows.
- Screen reader labels must exist for all form fields and data displays.

---

## 3. Reviewer-Separation Rule

The independent reviewer (QAS) must remain outside the build cell at all times.

Self-review does not count as independent review. An agent that participated in implementation cannot also be the reviewer for that same surface. This rule cannot be relaxed without Founder approval.

---

## 4. Confidentiality and Non-Publishing Rule

The PEO build, its source documents, formula logic, comp standards, confidence scoring model, kill-switch library, and governance framework are proprietary NoDrftSystems infrastructure.

No element of this build may be published externally, shared with clients, or used in non-NoDrftSystems contexts without Founder approval. This applies to all agents active on this build.

---

## 5. Evidence Requirements

Every phase of this build must produce:

- Typecheck pass
- Lint pass
- Test results (unit, integration, E2E as applicable per phase)
- Formula trace for any calculation-touching work
- Event linting report for any analytics-touching work
- Bilingual parity confirmation for any UI-touching work
- Gate 4A structured completion report

Evidence is a control record. Missing evidence blocks gate advancement. The default answer is: do not advance until the gate is satisfied.

---

## 6. Release-Gate Rule

Every phase uses a fail-closed release gate:

- Missing evidence → blocked
- Missing independent review → blocked
- Unresolved critical findings → blocked
- Undocumented prompt or tool drift → blocked
- Unclear completion status → blocked

Advancement is explicit approval, not the absence of objection.

---

## 7. Fail Conditions and Escalation Triggers

### Mandatory Stop Conditions
The build pauses immediately when:
- Scope expands beyond the classified build level
- Task packet becomes invalid
- Required specialist coverage is missing for the active surface
- A required handoff cannot be completed cleanly
- Reviewer independence is compromised
- Prompt or tool drift is introduced without approval
- Test or trace evidence exposes unresolved critical behavior
- Security, privacy, or data-integrity risk appears unexpectedly
- The cell cannot explain what changed, why it changed, and how it was verified

### Escalation Paths
Route to QAS + ARE when:
- Model or prompt changes are needed mid-build
- Tool access is insufficient
- The implementation role set is no longer adequate
- The correct handoff target is unclear or disputed
- The release path touches security, client data, or production infrastructure

Route to Founder when:
- The build changes market-facing behavior materially
- The build alters offer scope, pricing-linked functionality, or strategic product posture
- The build creates exceptional delivery or liability exposure

---

## 8. Spec Corrections (binding — enforced over spec pack claims)

Where the Build-Ready Spec Pack conflicts with primary source documents, primary sources govern:

| Rule | Source |
|------|--------|
| MAO is hidden (N) on Seller route | `PEO_Formula_by_Route_Exposure_Matrix.docx` |
| MARKET ARV is reference-only on Investor Basic | `PEO_Route_Matrix_and_Calculation_Standards.docx` v2.0 |
| Free tier: no VERIFIED/MARKET ARV, no live comps | `PEO_Route_Matrix_and_Calculation_Standards.docx` v2.0 |
| No separate Deal entity — SellerApplication is the deal record | `PEO_Route_Matrix_and_Calculation_Standards.docx` v2.0 |
| Free estimator is toggle-based (Seller/Investor), not stepped wizard | `PEO_Route_Matrix_and_Calculation_Standards.docx` v2.0 |
| Required Profit = MAX($30,000, ARV × 15%) | `PEO_Formula_Registry_v1.docx` F-F-004 |
| Stress Profit = (ARV × 0.95) − purchase − closing − (repairs × 1.15) − carry − disposition − points | `PEO_Formula_Registry_v1.docx` |
| Binding Offer Cap = MIN(Canonical MAO, 70% Rule MAO) | `PEO_Formula_Registry_v1.docx` F-F-003 |

---

*This root contract is effective from 2026-04-16 and persists across all PEO build phases until superseded by an updated version approved by the Founder.*
*Authority: `01_system/ai-governance/build-context-engineering-standard-2026-04-15.md`*
