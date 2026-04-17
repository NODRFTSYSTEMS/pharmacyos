---
document: PEO QAS Independent Review Report
status: Active governance
version: 1.0
date: 2026-04-16
reviewer: QAS (Quality Assurance Supervisor)
scope: Phases 1, 2, and 3
build: PEO-Internal-2026
confidentiality: Proprietary internal — no external publishing approved
---

# QAS Independent Review Report
## Phases 1–3 — Governance + Public Website + Free Estimator + Seller Application + Triage Engine

---

## 1. Review Identity

- **Reviewer:** QAS (Quality Assurance Supervisor)
- **Review Date:** 2026-04-16
- **Build ID:** PEO-Internal-2026
- **Scope:** Phase 1 (Governance + Spec), Phase 2 (Public Website + Free Estimator), Phase 3 (Seller Application + Triage Engine)
- **Status:** Independent review completed

---

## 2. Review Method

| Area | Standard / Source | Method |
|------|-------------------|--------|
| PII / Security | `root-contract.md` Sec 2.4, `scoped-rules.md` Sec 7 | Code review of `src/lib/events/pii-lint.ts` and all API routes |
| RBAC Enforcement | `root-contract.md` Sec 2.4, `scoped-rules.md` Sec 2 | Code review of `src/lib/auth/rbac.ts` and all API route handlers |
| Triage Engine | `PEO_Confidence_and_Review_Trigger_Standard.docx`, `scoped-rules.md` Sec 5 | Code review of `src/lib/triage/engine.ts` against binding standard |
| Formula Engine | `PEO_Formula_Registry_v1.docx`, `root-contract.md` Sec 2.1 | Code review of `src/lib/formulas/` and unit test traces |
| Accessibility | WCAG 2.1 AA, `root-contract.md` Sec 2.6 | UI component review (keyboard navigation, focus management, screen-reader labels) |
| Bilingual Parity | `root-contract.md` Sec 2.5 | Key-by-key comparison of `messages/en.json` and `messages/es.json` |
| Evidence & Governance | `evidence-ledger.md`, completion reports | Document completeness and accuracy verification |

---

## 3. Summary Verdict

**Overall Decision: `approve_with_required_fixes`**

The build demonstrates solid structural discipline, correct formula implementation, working bilingual routing, and appropriate PII linting for analytics-bound payloads. However, **two material gaps must be addressed before Phase 4 execution**:

1. **RBAC is not enforced on any API route.** The `rbac.ts` helper exists but is unused. Seller-facing endpoints accept raw `userId` from the request body with no authentication or role verification. This violates the root contract.
2. **The triage engine is a simplified approximation.** It does not implement the binding 4-dimension confidence model or the 7 PASS trigger conditions from the Confidence & Review Trigger Standard.

These gaps are fixable within the current architecture and do not require reclassification, but they must be resolved before Investor Basic (Phase 4) begins because Phase 4 will compound data-exposure risk.

---

## 4. Detailed Findings

### 4.1 PII / Security — Material Gap

**Finding:** PII event linting is correctly implemented for `seller/application` POST/PUT payloads, and audit logs use `sanitizeEventPayload`. However, **the estimator API (`/api/estimator`) does not apply PII linting**. Since the estimator is a public endpoint, any future event instrumentation added there could leak prohibited fields without the lint gate.

**Impact:** Medium — current build has no analytics events on the estimator, but the gate is not preemptively enforced.

**Required Fix:** Add `lintEventPayload` and `sanitizeEventPayload` to all API routes that will eventually emit analytics events, or wrap event emission in a single helper that always lints.

---

### 4.2 RBAC Enforcement — Critical Gap

**Finding:** `src/lib/auth/rbac.ts` defines the 8-role hierarchy correctly, but **no API route imports or calls it**. The seller application endpoints (`POST /api/seller/application`, `PUT /api/seller/application/[id]`, `POST /api/seller/application/[id]/submit`) accept `userId` directly from the JSON body without:
- Session verification
- Role verification
- Ownership verification (e.g., does the session user match the requested `userId`?)

**Impact:** High — anyone with a valid UUID can create, update, or submit seller applications.

**Required Fix:** Before Phase 4, implement one of the following:
- **Option A (Recommended):** Integrate Clerk auth middleware and enforce `seller_applicant` minimum role on all seller routes, plus resource ownership checks.
- **Option B (Temporary):** If Clerk integration is delayed, add a middleware layer that validates a session token and rejects unauthenticated requests, with a clear TODO for Clerk replacement.

The root contract states: "RBAC is enforced server-side for all 8 roles. Client-side role checks are supplemental, not authoritative."

---

### 4.3 Triage Engine — Material Gap

**Finding:** `src/lib/triage/engine.ts` implements a single-score triage model with arbitrary point adjustments (+10 for address confirmed, −15 for missing comps, etc.). This **does not match the binding 4-dimension confidence model** defined in `scoped-rules.md` Section 5 and the Confidence & Review Trigger Standard.

Specific deviations:
- **Data Confidence dimension** is not scored independently (primary source +20, stale data −10, etc.).
- **Comp Confidence dimension** is not scored independently (5+ comps +25, comp quality score > 70 +10, etc.).
- **Valuation Confidence dimension** is absent.
- **Model Confidence dimension** is absent.
- **PASS triggers** are reduced to a single threshold (`score < 20`) rather than the 7 required conditions:
  1. Address cannot be geocoded
  2. Zero usable comps after full cascade
  3. Property type irreconcilable across sources
  4. Expected profit < $10,000
  5. ROI < 5%
  6. Stress case breaks the deal
  7. Data confidence < 20%

**Impact:** Medium-High — the current engine produces plausible-looking outputs but does not satisfy the binding specification. This will become a defect when QAS or the Founder validates against the primary source document.

**Required Fix:** Refactor `src/lib/triage/engine.ts` to implement:
1. Four independent confidence dimension calculators
2. A composite score weighted per the standard
3. All 9 automatic review triggers
4. All 7 PASS trigger conditions

This refactor should be treated as a Phase 3 remediation task before Phase 4 begins.

---

### 4.4 Formula Engine — Pass

**Finding:** The formula implementations in `src/lib/formulas/` are correct against the Formula Registry and root contract:

- `calculateRequiredProfit(arv)` returns `MAX(30000, arv * 0.15)` ✅ (F-F-004)
- `calculateSeventyPercentMao(arv, repairs)` returns `arv * 0.7 - repairs` ✅
- `calculateInvestorDeal(...)` computes `MAO = MIN(Canonical MAO, 70% Rule MAO)` ✅ (F-F-003)
- Carry cost uses interest-only logic: `(purchasePrice * rate) / 12 * holdMonths` — reasonable engineering interpretation
- Unit tests cover 100% of Layer E+F calculations and all pass ✅

**No required fix.**

---

### 4.5 Accessibility — Material Gap

**Finding:** The UI generally meets WCAG 2.1 AA visual standards (color contrast, focus rings), but two accessibility gaps exist:

1. **Missing label associations:** The `InputRow` component in `src/app/[locale]/estimator/page.tsx` and `src/app/[locale]/seller/application/page.tsx` uses `<label>` without an `htmlFor` attribute and `<input>` without an `id`. Screen readers may not reliably associate the label with the field.
2. **Missing mobile navigation:** `src/components/Header.tsx` hides the nav on mobile (`hidden md:flex`) with no hamburger menu or alternative navigation path. Keyboard-only mobile users cannot access internal pages.

**Required Fix:**
- Add `htmlFor` and `id` to all label/input pairs.
- Add a mobile menu toggle (button with `aria-expanded`, `aria-controls`) or expose nav links on all viewports.

---

### 4.6 Bilingual Parity — Pass

**Finding:** Key-by-key comparison of `messages/en.json` and `messages/es.json` shows full parity for all implemented UI surfaces. No hardcoded strings were found in the reviewed page components. Both files contain the Phase 3 seller application translation keys.

**Required Fix:** None.

---

### 4.7 Evidence & Governance — Pass

**Finding:** The evidence ledger (`evidence-ledger.md`) accurately records the artifacts produced in Phases 1–3. The Gate 4A completion reports for Phase 1, Phase 2, and Phase 3 are complete and do not claim completion for excluded work.

**Required Fix:** None.

---

### 4.8 Open Items Tracking — Pass

**Finding:** Open items O-002, O-003, and O-005 are correctly tracked in `open-items-tracker.md`. No agent has silently assumed or invented values for these items. Legal pages carry placeholder warnings. Property data API is documented as a stub with replacement requirements.

**Required Fix:** None.

---

## 5. Risk Assessment

| Risk | Severity | Status |
|------|----------|--------|
| RBAC bypass on seller APIs | Critical | Open — must fix before Phase 4 |
| Triage engine does not match binding standard | High | Open — must fix before Phase 4 |
| Accessibility label gaps | Medium | Open — should fix before Phase 4 |
| Missing mobile nav | Medium | Open — should fix before Phase 4 |
| Estimator API lacks PII lint gate | Medium | Open — should fix before Phase 4 |
| Formula accuracy | Low | Closed — no defect found |
| Bilingual parity | Low | Closed — no defect found |

---

## 6. Required Fixes Register

| # | Finding | Owner | Due Before |
|---|---------|-------|------------|
| R-001 | Implement RBAC enforcement on all seller/triage/readiness API routes | BLS + SCA | Phase 4 |
| R-002 | Refactor triage engine to implement 4-dimension confidence model, 9 review triggers, and 7 PASS conditions per binding standard | BLS + TVA | Phase 4 |
| R-003 | Add `htmlFor`/`id` label associations to all form inputs | FIS | Phase 4 |
| R-004 | Add mobile navigation toggle or expose nav on small viewports | FIS | Phase 4 |
| R-005 | Add PII linting gate to estimator API and any future public endpoints | SCA | Phase 4 |

---

## 7. Reviewer Sign-Off

| Item | Status |
|------|--------|
| Independence confirmed | QAS did not participate in implementation |
| Evidence reviewed | All Phase 1–3 artifacts examined |
| Critical gaps documented | RBAC and triage engine flagged |
| Fix register created | 5 required fixes assigned |

**Reviewer Decision:** `approve_with_required_fixes`

**Condition for Phase 4 advancement:** Fixes R-001 and R-002 must be complete and re-verified by QAS. Fixes R-003, R-004, and R-005 may be verified by TVA with QAS spot-check.

---

*QAS Independent Review Report version 1.0 — 2026-04-16*
*Authority: `01_system/ai-governance/mandatory-build-activation-protocol-2026-04-15.md`*
