---
name: quantitative-review
description: Mathematical review workflow skill. Load before any build phase, deliverable, or analysis where formulas, calculations, quantitative models, or mathematical claims exist. Activates QMA (Solomon) and the math analysis cell as needed.
---

# Quantitative Review — Workflow Skill

**Skill Type:** Workflow (load per phase)
**Agent:** QMA (Solomon) — Quantitative Mathematics Agent
**Trigger:** Load before any phase that introduces or relies on formulas, calculations, statistical models, financial projections, scoring logic, or quantitative claims in any deliverable

---

## When to Load This Skill

| Trigger Condition | Phase |
|------------------|-------|
| Product feature contains a formula or calculation engine | Before build begins (Gate 2) |
| Deliverable contains a financial model or projection | Before QA Pass 5 |
| Deliverable makes a statistical claim or cites a probability | Before QA Pass 2 |
| Pricing model is built into a product (estimator, calculator, configurator) | Before implementation begins |
| Algorithm with defined complexity requirements is being built | Before Gate 3 (execution) |
| A client deliverable contains a quantitative claim that will be published | Before delivery |
| An internal analysis produces numbers that will feed a commercial decision | Before commercial artifact is drafted |
| Scoring or ranking logic is added to any product or intake system | Before locking the spec |

---

## Workflow

### Phase 1 — Mathematical Surface Inventory

QMA reviews the build scope or deliverable and produces a **Mathematical Surface Inventory**:
- List every formula, calculation, model, or quantitative claim in scope
- Classify each by domain (financial, statistical, probability, algorithm, formula governance)
- Flag each for risk level: **COMMERCIAL** (feeds pricing or revenue), **PUBLISHED** (client-facing), **INTERNAL** (operational use only)
- Identify any data quality dependencies (what input data quality does the calculation require?)

### Phase 2 — Framework Selection

For each mathematical surface:
- Select the correct mathematical framework
- State why this framework applies and what alternatives were considered
- Identify the precision requirement and acceptable error bounds

### Phase 3 — Team Activation Assessment

Does the inventory span multiple domains requiring sub-agent support?
- YES: QMA invokes Team Activation Protocol, activates bounded sub-agents, MOA confirms
- NO: QMA proceeds solo

### Phase 4 — Derivation and Modeling

Execute all calculations, derivations, and models per the inventory. Document:
- Method and formula
- Inputs and their quality assessment
- Result
- Confidence score (floor: 0.92)
- Error bounds or uncertainty range

### Phase 5 — Independent Verification

**COMMERCIAL or PUBLISHED surfaces:** TVA (Leandra) runs independent verification using a second method. Agreement → advance. Disagreement → QMA and TVA reconcile before advancement. No unresolved disagreement advances.

**INTERNAL surfaces:** QMA runs internal cross-check (second method or spot numerical check).

### Phase 6 — Results Integration

QMA integrates all surface results into a **Mathematical Review Summary**:
- Verified formulas and models (with lock-in specifications for product formulas)
- Confidence scores for each surface
- Any surfaces that did not meet the 0.92 floor (with escalation recommendation)
- Data quality flags
- Routing recommendations

### Phase 7 — Gate Routing

| Surface Type | Route To |
|-------------|----------|
| COMMERCIAL (feeds pricing/revenue) | PEA (Giselle) + Founder review |
| PUBLISHED (client-facing deliverable) | reviewer_public_proof + QAS (Imani) |
| Product formula (to be locked in spec) | PMA (Keon) for spec update + QAS sign-off |
| Internal operational | QAS (Imani) for completeness check |

---

## Outputs

- Mathematical Surface Inventory (Phase 1)
- Framework justifications (Phase 2)
- Full derivations with confidence scores (Phase 4)
- Verification evidence (Phase 5)
- Mathematical Review Summary with gate routing (Phase 6)

---

## Hard Rules

1. No formula is locked into a product specification without QMA review and QAS sign-off.
2. No quantitative claim appears in a client deliverable without passing reviewer_public_proof AND QMA confidence ≥ 0.92.
3. No financial model feeds a commercial proposal without QMA review and Founder sign-off.
4. Unverified calculations (confidence < 0.92) must be flagged in the output — they may not be presented as established results.
5. Any calculation error discovered in a prior deliverable is a CRITICAL defect — escalate to Founder immediately.

---

## Integration Points

| Skill / Agent | Integration |
|---------------|------------|
| `system-maintenance` | Load before this skill if build has computational dependencies |
| `pricing-safety-review` | Run after this skill when financial math feeds a commercial artifact |
| `legal-compliance` | Run after this skill if statistical modeling touches regulatory surfaces |
| `reviewer_public_proof` | Receives routing from QMA for all published quantitative claims |
| `qa_multipass` | QMA mathematical review results feed Pass 2 (claims) and Pass 5 (package integrity) |
