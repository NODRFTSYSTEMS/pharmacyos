# NoDrftSystems Proprietary Skill
# Classification: Internal — Confidential
# Do NOT commit to client repositories

## SKILL: quantitative_analysis

**Purpose:** Activate QMA (Solomon) to execute genius-level mathematical analysis, equation derivation, statistical modeling, or quantitative verification — with optional team deployment for multi-domain work.

**Trigger:** Any task involving: complex calculations, mathematical modeling, equation derivation or verification, statistical analysis, probability modeling, financial mathematics, algorithm complexity, formula governance, or quantitative claims in any deliverable.

**Pre-conditions:**
- Problem statement must be clearly defined before QMA begins
- All available input data and parameters must be provided
- The downstream use of the result must be stated (commercial decision / published claim / product feature / internal analysis)
- If the result will appear in a client deliverable, pricing model, or published product: human review gate applies before use

---

**Step Sequence:**

1. **Load QMA (Solomon).** Activate the Quantitative Mathematics Agent from the Specialist Pool. Route via MOA (Zayne) for task assignment.

2. **Formalize the problem.** State precisely:
   - What needs to be calculated, modeled, or verified
   - All known variables, parameters, and constraints
   - Required precision and error tolerance
   - Downstream use of the result

3. **Classify the mathematical domain.** Identify which framework applies:
   - Financial mathematics (DCF, NPV, IRR, valuation, pricing models)
   - Statistical analysis (regression, hypothesis testing, confidence intervals, descriptive stats)
   - Probability and risk modeling (Bayesian, Monte Carlo, actuarial)
   - Algorithm analysis (Big O, optimization, complexity proofs)
   - Formula governance (product feature formulas, scoring logic)
   - Data modeling mathematics (schema normalization, cardinality, indexing)
   - Applied mathematics (custom modeling, differential equations, linear algebra)

4. **Assess team deployment.** Does the task span multiple domains? If yes:
   - QMA invokes Team Activation Protocol (see SKILL.md)
   - Activates bounded sub-agents as needed (DESA, DSS, FRA, TVA, TSA)
   - MOA confirms activation
   - Sub-agents deliver bounded inputs back to QMA

5. **Execute the analysis.** QMA derives, calculates, or models with full method documentation for commercial/published use. Key steps only for internal estimates.

6. **Independent verification.** QMA runs an independent check (second method or numerical verification). For commercial or published results: TVA (Leandra) runs external verification.

7. **Confidence assessment.** QMA assigns a confidence score (floor: 0.92). Below 0.92 → flag, state uncertainty bounds, escalate before commercial use.

8. **Deliver the result.** One clear mathematical conclusion with: method, assumptions, result, confidence, and error bounds.

9. **Route implications:**
   - Commercial decision impact → PEA (Giselle) + Founder
   - Regulatory or compliance dimension → LCA (Dorothy)
   - Product formula to be locked → PMA (Keon) + build spec
   - Claim to appear in deliverable → reviewer_public_proof

10. **Human gate.** Any quantitative result that feeds a commercial decision, published claim, or product formula requires Founder (or ARE when hired) sign-off before external use.

---

**Output Required:**
- Formal problem statement
- Mathematical framework and justification
- Derivation or calculation (full for commercial/published; key-step for internal)
- Independent verification result
- Confidence score with uncertainty bounds
- Assumptions and data quality flags
- Clear actionable conclusion
- Routing recommendation for downstream implications

**QA Requirements:**
- Commercial outputs: pricing safety review before delivery
- Published claims: reviewer_public_proof mandatory
- Product formulas: QAS (Imani) sign-off before locking in spec
- Human gate (Gate 6): required for any commercial or client-facing mathematical output

**Proprietary Protection:**
- Mathematical models, formulas, and scoring logic developed for NoDrftSystems products are proprietary — do not expose in client handoffs or public documentation
- Client-specific calculations are system-isolated — do not reference between engagements

**Escalation Conditions:**
- Confidence below 0.92 on commercial or published result → stop, flag, escalate to QAS → Founder
- Two calculation methods produce materially different results → escalate before delivery
- Discovery of a calculation error in an already-delivered artifact → CRITICAL defect, escalate to Founder immediately
- Problem is underspecified and cannot be formalized → stop, request clarification, do not estimate
