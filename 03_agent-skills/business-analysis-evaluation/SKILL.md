# Business Analysis Evaluation — Workflow Skill
# Classification: Internal — Proprietary
# Do NOT commit to client repositories

## Purpose

Execute a structured, fact-strict, 17-section business evaluation for external clients who submit a business idea, concept, or venture for analysis. This skill governs the full evaluation lifecycle from intake confirmation through structured report delivery.

## Trigger Condition

Load this skill when:
- A client has submitted a business idea or concept for evaluation
- A direct Business Analysis Sprint engagement has been scoped and authorized by the Founder
- A Discovery Sprint has concluded and business analysis is the next authorized phase

## Pre-Conditions (All Must Be Confirmed Before Section 2.6 Is Reached)

- [ ] Client brief or idea description received in writing
- [ ] Budget/capital context confirmed (even as a rough range — required for FMA sections)
- [ ] Founder has authorized the engagement
- [ ] Engagement is logged in the client workspace `00_admin/` folder
- [ ] QAS is active for this session

If budget/capital context is missing when Section 2.6 is reached: **STOP. Request this information before proceeding. Do not estimate capital or financials without client-provided context.**

---

## FACT-STRICT MODE — Mandatory Declaration

The following four rules must appear verbatim at the top of every Business Evaluation output before any content is presented:

```
FACT-STRICT MODE ACTIVE
1. Only verifiable facts or clearly labeled analysis will be presented.
2. No invented numbers, no fabricated statistics, no hype.
3. All figures use conservative, realistic ranges labeled "Assumption — $X–$Y".
4. All calculations shown step by step.
```

Violation of any of these rules is a CRITICAL defect. RSA (Imara) is responsible for auditing the final output against these four rules before QAS review.

---

## Agent Cell

| Agent | Code | Role in This Skill | Sections Owned |
|-------|------|--------------------|----------------|
| Business Analysis Orchestrator | BAO (Cyrus) | Leads the evaluation, assembles final report, enforces FACT-STRICT MODE | 2.1, 2.10, 2.11 (joint), 2.15, 2.17 |
| Financial Modeling Agent | FMA (Valentina) | All financial and economic modeling | 2.6, 2.7, 2.8, 2.10 (partial — capital fit), 2.11 (joint), 2.16, 2.17 (ratings input) |
| Market & Competitive Analyst | MCA (Sterling) | Market demand, competitive landscape, distribution, virality | 2.2, 2.3, 2.9, 2.14, 2.17 (ratings input) |
| Risk & Strategy Analyst | RSA (Imara) | Logic gaps, feasibility, risk matrix, missed opportunities, FACT-STRICT audit | 2.4, 2.5, 2.12, 2.13, 2.17 (ratings input) |
| QAS (Imani) | QAS | Final quality gate before delivery | Review pass |
| LCA (Dorothy) | LCA | Activated if legal/regulatory flags surface | Conditional |

Minimum cell for execution: BAO + FMA + MCA + RSA + QAS. QAS is non-optional.

---

## The 17-Section Evaluation Framework

### Section 2.1 — Concept Snapshot
**Owner:** BAO  
**Required inputs:** Client brief  
**Output:** 3–6 bullets covering core offer, target customer, revenue model, delivery channel(s)  
**Confidence requirement:** High Confidence only (directly sourced from client brief)  
**Escalation:** If the concept is undefined or contradictory → request clarification before proceeding

---

### Section 2.2 — Market Depth & Demand Validation
**Owner:** MCA  
**Required inputs:** Industry context, any client-provided market data  
**Output:** Evidence of real demand (pain level, search intent, trends, buyer urgency); market size in broad ranges only; whether customers are actively seeking solutions  
**Confidence requirement:** All size estimates labeled "Assumption — broad range." No fabricated TAM/SAM figures.  
**Escalation:** If no credible demand evidence available → state explicitly. Do not manufacture demand signals.

---

### Section 2.3 — Competitive Landscape & Positioning
**Owner:** MCA  
**Required inputs:** Concept description, target market  
**Output:** Key competitors and substitutes; strengths/weaknesses vs. existing options; moats (brand, distribution, expertise, speed, geography); risk of commoditization including AI risk  
**Confidence requirement:** Competitor data labeled by source type (known/public vs. inferred)  

---

### Section 2.4 — Logic & Gap Check
**Owner:** RSA  
**Required inputs:** Concept Snapshot (2.1), client brief  
**Output:** Value proposition clarity assessment; internal contradictions or vague claims identified; assumptions that must be tested  
**Confidence requirement:** Every identified contradiction must cite the specific conflicting claim  

---

### Section 2.5 — Practical Feasibility
**Owner:** RSA  
**Required inputs:** Concept description, any operational context provided  
**Output:** Operational requirements (skills, tools, equipment, tech, staff, fulfillment); complexity, bottlenecks, dependencies; time-to-launch classification (fast/moderate/slow); high-level regulatory considerations (NOT jurisdiction-specific legal advice)  
**Escalation:** If regulatory flags surface → activate LCA before advancing

---

### Section 2.6 — Unit Economics
**Owner:** FMA  
**Required inputs:** Revenue model, pricing, delivery model, client-provided capital context  
**Output:** Revenue per customer (labeled "Assumption — $X–$Y"); CAC scenario ranges; LTV; contribution margin; break-even units  
**Hard rule:** All figures step-by-step. No single-point estimates — use ranges. No invented numbers.  
**Blocker:** If capital/revenue context not provided by client → STOP. Request before proceeding.

---

### Section 2.7 — Cash Flow Timing & Capital Cycles
**Owner:** FMA  
**Required inputs:** Revenue model, fulfillment model, any known payment terms  
**Output:** When cash comes in vs. goes out; inventory or paid ads float; production or shipping delays; whether negative cash cycles are likely  
**Confidence requirement:** Label each timing assumption explicitly

---

### Section 2.8 — Minimum Capital & Cost Structure
**Owner:** FMA  
**Required inputs:** Concept, operational model, market context  
**Output:** Minimum viable version (MVP) definition; setup + 3–6 month operating cost categories (formation/compliance, tools/tech, marketing/distribution, labor, inventory/fulfillment); conservative capital range labeled "Assumption — $X–$Y"  
**Hard rule:** Show all cost categories even if some are $0. Do not omit categories without stating why.

---

### Section 2.9 — Distribution Strategy
**Owner:** MCA  
**Required inputs:** Target market, revenue model, concept  
**Output:** Feasible traffic sources (paid, organic, partnerships, offline); platform dependency risk (TikTok, Meta, Amazon, etc.); whether the model has natural distribution advantages  

---

### Section 2.10 — Founder's Fit & Leverage Potential
**Owner:** BAO (with FMA input on capital fit)  
**Required inputs:** Founder-provided context about skills, experience, resources, network, lifestyle — if not provided, this section produces a gap flag only  
**Output:** Whether the business fits the founder's profile; automation and outsourcing potential; whether the business scales without the founder doing everything  
**Escalation:** If no founder context provided → state "Founder fit cannot be assessed without [specific inputs]. Section 2.10 is incomplete." Do not fabricate a profile.

---

### Section 2.11 — LTV Expansion & Monetization Levers
**Owner:** BAO + FMA (joint)  
**Required inputs:** Unit economics output (2.6), concept description  
**Output:** Upsells, cross-sells, bundles, subscriptions; licensing or white-label opportunities; brand ecosystem potential  

---

### Section 2.12 — Risk Profile & Failure Modes
**Owner:** RSA  
**Required inputs:** All prior sections  
**Output:** Risk matrix with categories (Market, Operational, Financial, Legal/Compliance, Competitive, Platform Dependency); each risk rated Severity (Low/Med/High) × Likelihood (Low/Med/High); 3–5 most probable failure modes with how each occurs  
**Hard rule:** At least one High Severity risk must be identified for any real business concept. If none surface, RSA must explain why explicitly.  
**Escalation:** CRITICAL risks (High Severity × High Likelihood) → flag to QAS before section advances

---

### Section 2.13 — Missed Opportunities
**Owner:** RSA  
**Required inputs:** All prior sections  
**Output:** Realistic ways to improve or strengthen the concept (non-gimmicky); unused customer segments, pricing strategies, or distribution angles  
**Hard rule:** No fabricated "growth hacks." Every suggestion must be grounded in prior section findings.

---

### Section 2.14 — Originality & Virality Potential
**Owner:** MCA  
**Required inputs:** Concept Snapshot, competitive landscape output  
**Output:** Whether the idea is genuinely differentiated; whether it has built-in "talk value"; specific hooks or formats that could drive organic spread  

---

### Section 2.15 — Execution Paths (Three Options)
**Owner:** BAO  
**Required inputs:** All prior sections  
**Output:** Three realistic execution paths:

**Path A — Lean MVP Test:** Minimal spend, quick validation, low risk. Key actions + success metrics.  
**Path B — Focused Core Business:** Stable, sustainable, predictable model. Roles, systems, economics.  
**Path C — Scaled / Brand-Driven Expansion:** If validated, how to grow — team, capital, distribution, brand architecture.

Each path must include: Pros / Cons / Complexity level / Who it suits (solo operator vs. team)

---

### Section 2.16 — Exit Potential
**Owner:** FMA  
**Required inputs:** Revenue model, concept, unit economics  
**Output:** Whether the business can be sold; likely valuation drivers (brand, systems, revenue quality, churn, IP, audience); business type multiple ranges (high-level, labeled as ranges only)  

---

### Section 2.17 — Rating Table (0–10)
**Owner:** BAO (synthesizes FMA, MCA, RSA inputs)  
**Required inputs:** All prior sections  
**Output:** Five ratings with one-sentence justification each:
1. Feasibility
2. Financial Upside (Risk-Adjusted)
3. Differentiation / Defensibility
4. Execution Complexity (higher complexity = lower score)
5. Overall Attractiveness (for a rational investor or operator)

---

## Required Output Format

Every Business Evaluation output must follow this exact structure:

```
FACT-STRICT MODE ACTIVE
[Four rules verbatim]

---
1. VERIFIED FACTS
[What is explicitly given. Stable domain knowledge. No assumptions.]

---
2. ANALYSIS
[Sections 2.1 through 2.17 in order]

---
3. UNKNOWNS / DATA GAPS
[Missing data that would materially change the evaluation.
Fastest tests or research steps to reduce uncertainty.]

---
4. CONCLUSION
[Concise ruling: risk-adjusted, grounded in evidence above.
Classify as one of: Worth testing now / Worth further research / Low attractiveness relative to alternatives.
State which execution path and why.]
```

Horizontal rule separators between the four top-level sections. Section headers bold. No exceptions to this format.

---

## QA Requirements

- RSA audits the complete output against FACT-STRICT MODE before QAS review
- QAS runs Pass 2 (Content review — accuracy, no fabrications, no placeholders)
- QAS runs Pass 5 (Client requirements — all 17 sections present, all confidence labels applied)
- Any section marked incomplete or containing [REQUIRED: ___] must be resolved before delivery
- Founder approves before client delivery. No exceptions.

---

## Escalation Conditions

| Condition | Action |
|-----------|--------|
| Capital/budget context missing when Section 2.6 is reached | STOP. Request from client. Do not estimate. |
| Legal or regulatory red flags surface in Section 2.5 or 2.12 | Activate LCA. Do not advance without LCA flag status. |
| CRITICAL risk identified (High × High) | Flag to QAS before section advances |
| Any section produces low-confidence output that materially affects the conclusion | Flag to ARE before delivery |
| Client requests a specific numeric outcome or validation of their assumptions | STOP. This skill produces independent analysis. Do not reverse-engineer to client expectations. |

---

## Proprietary Protection

The following must never appear in client-facing deliverables:
- Agent codes, Caribbean names, or cell composition (BAO, FMA, MCA, RSA)
- Scoring weights or evaluation methodology
- NoDrftSystems internal governance references
- This SKILL.md file

The client receives the formatted 4-section report only. All internal process is invisible to the client.

---

## Service Offering Note

This skill powers the **Business Analysis Sprint** — a standalone paid engagement. Pricing requires Founder decision before public offering. Until priced: route all inquiries through standard intake; Founder quotes custom. The Discovery Sprint credit (§7.2 of CLAUDE.md) does not apply to Business Analysis Sprints — they are separate service lines.
