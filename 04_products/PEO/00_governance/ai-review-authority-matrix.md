---
document: PEO AI Review Authority Matrix
status: Active governance
version: 1.0
date: 2026-04-22
owner: Founder (nodrftsystems), ARE, QAS (Imani)
authority: Derived from `01_system/ai-governance/ai-review-authority-matrix.md` — product-level scoped enforcement
confidentiality: Proprietary internal — no external publishing approved
build: Peak Equity Optimizer (PEO) — Class 3 (Phases 1–5) / Class 4 (Phase 6)
---

# PEO AI Review Authority Matrix
## Product-Level Authority Derivative — Class 3 → Class 4

This matrix defines review authority, escalation paths, and delegation boundaries specifically for the Peak Equity Optimizer (PEO) build. It inherits tier definitions from the system-level AI Review Authority Matrix and narrows them to PEO artifact classes, the PEO active cell, and PEO-specific non-delegable decisions.

Where this document and the system matrix conflict, the system matrix governs. Where the PEO Build Activation Record or Root Contract conflict with either, the Root Contract governs.

---

## 1. Authority Tiers (PEO Context)

| Tier | Role | Authority Scope | Named Agent / Human |
|------|------|----------------|---------------------|
| 1 | **Founder** | Final authority on all strategic, commercial, legal, pricing, release, and agent-architecture decisions. | Human — Founder |
| 2 | **ARE** | Technical and process authority for PEO Class 3–4 builds. Validates formula registry changes, comp standard changes, schema migrations, prompt/tool governance. | AI agent — ARE |
| 3 | **QAS** | Quality gate authority. No PEO artifact advances past QAS without explicit sign-off. Independent reviewer path must remain outside the build cell. | Imani / QAS |
| 4 | **HHC** | Human handoff routing authority. Routes PEO escalations to ARE or Founder. Coordinates Phase 6 Class 4 human gates. | Desmond / HHC |
| 5 | **MOA** | Orchestration and activation discipline. Enforces PEO build packet completeness before execution. Routes work to the correct PEO cell. | Zayne / MOA |
| 6 | **Department Supervisors** | Scoped review within their PEO surface. | PMA (Keon) — product scope; SCA (Omari) — security/PII; TVA (Leandra) — verification evidence; SAA (Samara) — architecture boundary |

---

## 2. PEO Artifact Review Matrix

### Formula Registry & Comp Standard Artifacts
*(Changes to Layers A–G formulas, Comp Inclusion/Exclusion Standard, Confidence & Review Trigger Standard, Field Source Hierarchy, Formula Exposure Matrix)*

| Step | Actor | Action |
|------|-------|--------|
| Propose | BLS (Backend & Logic Specialist) | Draft change with formula trace, test cases, and impact analysis |
| Peer review | SAA (Systems Architecture Agent) | Verify service-boundary impact, API contract changes, dependency cascade |
| Independent control | TVA (Test & Verification Assistant) | Validate 100% Layer A–G coverage; run regression suite; verify no rounding drift |
| Security / PII check | SCA (Security & Compliance Agent) | Confirm no new PII surfaces exposed by formula changes |
| Supervisor gate | QAS (Imani) | Completeness, trace evidence, no drift from canonical spec |
| Human gate | ARE → Founder | Formula exposure matrix changes require Founder; technical corrections route through ARE |
| Skill to load | `system-maintenance`, `legal-compliance` (if disclosure-affecting) | |

**Non-delegable items:** Any change to the Formula Exposure Matrix, Comp Inclusion/Exclusion Standard, or Confidence & Review Trigger Standard requires Founder sign-off. These are binding calculation contracts.

---

### Report & Export Artifacts
*(Investor underwriting reports, seller positioning reports, PDF exports, Excel/CSV exports, print-optimized CSS)*

| Step | Actor | Action |
|------|-------|--------|
| Produce | FIS (Frontend Implementation Specialist) | Implement report component, chart integration, export logic |
| Peer review | BLS | Verify numerical accuracy against formula engine outputs |
| Accessibility review | AAA (Rochelle) + `reviewer_accessibility` | WCAG 2.1 AA sweep; screen-reader tables for all charts; reduced-motion handling |
| Bilingual review | `reviewer_localization` + TCA (Xiomara) | Semantic parity for EN/ES report strings; CTA clarity |
| Security / data exposure | SCA | Verify no unauthorized data leakage across tiers (Basic vs. Advanced vs. Seller); confirm export controls |
| Supervisor gate | QAS | Quality, completeness, no generic template patterns |
| Human gate | Founder | Any report making market-facing claims, financial disclosures, or legal-adjacent language |
| Skill to load | `visual-direction`, `release-gate-review`, `qa_multipass` | |

**Non-delegable items:** Report disclaimer text, export control behavior for Elite tier, any claim about "licensed appraisal" or "investment advice" language.

---

### API Contract & Schema Migration Artifacts
*(New endpoints, schema changes, Prisma migrations, API versioning, route protection)*

| Step | Actor | Action |
|------|-------|--------|
| Architecture | SAA | Boundary definition, dependency plan, version strategy |
| Implementation | BLS (API) / DSS (schema) | Execute within Gate 3 rules; migration must be reversible |
| Test and verification | TVA | Contract tests, migration rollback test, Prisma `explain` performance check |
| Security | SCA | RBAC enforcement per route, field-level filtering, middleware coverage, PII event linting |
| Independent review | QAS (reviewer outside cell) | Cannot be from the build cell |
| Supervisor gate | QAS | Gate 5 — scope, evidence, no drift |
| Human gate | ARE (all production API) → Founder (Class 3–4, client data, billing) | |
| Skill to load | `system-maintenance`, `legal-compliance` (if data surface) | |

**Non-delegable items:** Any schema migration touching `User`, `SellerApplication`, `TriageResult`, or `AuditLog` without rollback plan; any API version bump without deprecation notice; any removal of middleware protection.

---

### Auth / RBAC / Middleware Artifacts
*(Clerk integration, role changes, middleware.ts, route guards, session handling)*

| Step | Actor | Action |
|------|-------|--------|
| Architecture | SAA + SCA | Define role hierarchy, route protection matrix, fallback behavior |
| Implementation | BLS + FIS | Middleware, server auth, client auth hooks |
| Test and verification | TVA | AuthZ matrix tests for all 8 roles × all routes; negative-role checks; redirect verification |
| Security | SCA | PII linting for auth events, session security, env var exposure check |
| Supervisor gate | QAS | Block if any route lacks documented protection |
| Human gate | ARE → Founder | Production auth changes always require Founder |
| Skill to load | `legal-compliance` (if disclosure/regulatory), `system-maintenance` | |

**Non-delegable items:** ANY middleware removal or bypass; ANY role consolidation (e.g., `seller_applicant` + `seller_verified` → `seller`) without migration script and audit log preservation; ANY change to `admin_internal` permissions.

---

### Event Instrumentation Artifacts
*(PostHog events, event schemas, PII linting, analytics dashboards)*

| Step | Actor | Action |
|------|-------|--------|
| Produce | BLS + FIS | Implement events per scoped-rules event list |
| PII lint | SCA + `reviewer_pricing_safety` | Verify no prohibited fields in payloads; block any event with address, name, email, phone, SSN |
| Independent control | `reviewer_public_proof` | Verify metrics and claims in any analytics dashboard have approved sources |
| Supervisor gate | QAS | Event completeness check against scoped-rules minimum set |
| Human gate | Founder | Any new event touching financial or identity data |
| Skill to load | `legal-compliance` | |

**Non-delegable items:** ANY event payload containing prohibited PII fields; ANY analytics claim without approved public proof inventory entry.

---

### Public Route Experience Artifacts
*(Homepage, pricing page, estimator landing, academy pages, trust center)*

| Step | Actor | Action |
|------|-------|--------|
| Route architecture | VDA (Jeanine) | Authority flow, proof rhythm, CTA-path logic, route-level visual hierarchy |
| Treatment translation | DAA (Anika) | Component, section, and implementation guidance |
| Executable implementation | FIS (Kiara) | Route-level layout, interaction, state changes |
| Brand posture check | BCA (Nadine) | Reject generic, templated, or commercially weak visual patterns |
| Proof verification | `reviewer_public_proof` + QDA (Patrice) | Verify metrics, logos, testimonials, before/after claims |
| SEO structural check | STAA (Jermaine) | Confirm semantics, crawlability, internal-linking integrity |
| Accessibility / reduced motion | `reviewer_accessibility` + AAA (Rochelle) | Reject motion-dependent comprehension; verify reduced-motion handling |
| Plain-language / CTA clarity | `reviewer_plain_language` + PLA (Simone) | Scannability, comprehension, density, CTA clarity |
| Supervisor gate | QAS (Imani) | Final hold/release decision |
| Human gate | Founder | Mandatory for market-facing route posture changes, package presentation changes, case-study proof changes |
| Skill to load | `visual-direction`, `release-gate-review`, `legal-compliance`, `strategic-review`, `vecs-public-route` | |

**Non-delegable items:** No fabricated proof, no release with motion-dependent comprehension, no Founder-bypass on material public-trust route changes.

---

### i18n / Bilingual Parity Artifacts
*(Translation files, locale routing, ES financial/legal phrasing)*

| Step | Actor | Action |
|------|-------|--------|
| Produce | FIS + TCA (Xiomara) | Implement strings, verify layout expansion handling |
| Bilingual review | `reviewer_localization` | QA Pass 5B — semantic and CTA parity; no truncation on critical labels |
| Compliance check | SCA | Financial and legal phrasing accuracy (pending O-003 professional translation) |
| Supervisor gate | QAS | Clearance before any UI release |
| Human gate | Founder | Any legal or financial phrasing in Spanish before production release |
| Skill to load | `qa_multipass` | |

**Non-delegable items:** No production release of Spanish legal/financial phrasing without professional translation review (O-003).

---

## 3. PEO Escalation Chain

```
Step 1 — Agent detects issue or confidence floor breach
          ↓
Step 2 — Agent stops work; documents the specific issue
          ↓
Step 3 — Agent routes to QAS (Imani) for classification:
          CRITICAL → escalate immediately
          IMPORTANT → hold current artifact; do not advance
          ENHANCEMENT → log and continue if no other blocks
          ↓
Step 4 — QAS determines routing target:
          Technical / process issue → HHC routes to ARE
          Strategic / commercial / legal → HHC routes to Founder
          Drift detected → HHC routes to appropriate human owner
          ↓
Step 5 — HHC (Desmond) delivers the escalation with:
          - the specific decision or action needed
          - the artifact and context
          - the governance rule being triggered
          - the blocking reason
          ↓
Step 6 — Human authority (ARE or Founder) makes the decision
          ↓
Step 7 — Decision Log entry created via `decision_log` skill
          BEFORE any authorized action is taken
          ↓
Step 8 — Work resumes or remains on hold per the decision
```

**PEO-specific escalation triggers:**
- Formula output drift (> 1% variance from canonical spec)
- Comp quality score drop below 60
- Confidence tier downgrade from HIGH to MEDIUM or lower
- Any PASS trigger firing in production
- PII detected in event payload
- Middleware bypass or route protection failure
- Bilingual parity failure on legal/financial string

---

## 4. Delegation Boundaries (PEO Build)

| Tier | Can Approve Without Escalation | Cannot Approve — Must Escalate |
|------|-------------------------------|-------------------------------|
| Tier 6 (PMA / SCA / TVA / SAA) | Internal drafts within their PEO surface; routine skill activation; standard workflow execution | Anything client-facing, cross-department, or touching pricing, legal, formula contracts, or production release |
| Tier 5 (MOA) | PEO build cell activation; skill routing; context state management; handoff execution | Build class upgrades; scope changes; pricing decisions; any human gate |
| Tier 4 (HHC) | Routing decisions; escalation delivery; human gate coordination | Final decisions on any PEO artifact; signing off on release or transfer |
| Tier 3 (QAS) | QA pass results; completeness determinations; HOLD vs. PROCEED within workflow | Any decision that requires Founder or ARE authority; formula standard changes; pricing or legal exceptions |
| Tier 2 (ARE) | Class 1–2 PEO build production releases; technical architecture decisions; prompt/tool governance; formula technical corrections | Pricing exceptions; legal-adjacent documents; formula exposure matrix changes; company-level factual claims; all Tier 1 items |
| Tier 1 (Founder) | Everything — final authority | — |

---

## 5. PEO Reviewer Agent Assignment

| Reviewer Agent | PEO Artifact Domain | Activates During |
|----------------|--------------------|-----------------|
| `reviewer_package_integrity` | Any deliverable vs. signed SOW or build packet | QA Pass 5, Release Gate 1, all handoffs |
| `reviewer_plain_language` | Client-facing copy, UI text, report narratives, disclosures | QA Pass 2, all content deliverables |
| `reviewer_pricing_safety` | Pricing pages, upgrade prompts, tier presentations | All commercial artifacts before client delivery |
| `reviewer_public_proof` | Statistics, comp claims, market assertions, performance metrics | QA Pass 2, all public-facing content |
| `reviewer_localization` | Bilingual (EN/ES) deliverables | QA Pass 5B — any bilingual surface |
| `reviewer_accessibility` | Web builds T2+, forms, UI surfaces, report pages | QA Pass 6 — mandatory for all T2+ web builds |
| `reviewer_vecs` | Homepage, pricing, academy, trust-center public routes | When trust, proof, interaction, or readability systems change |

**Reviewer independence rule:** The reviewer agent may not be the same as any agent in the PEO build cell for that artifact. The reviewer is always separate.

**Loading rule:** Load the reviewer agent before Gate 5 (Independent Review) begins. The reviewer slot must be reserved at Gate 0A.

---

## 6. PEO Non-Delegable Decisions

These items ALWAYS require Founder regardless of any delegation rule:

1. **Pricing tier changes** — any change to $49, $99, $299, $199 amounts or billing model
2. **Formula Exposure Matrix changes** — any modification to what each role sees
3. **Comp Inclusion/Exclusion Standard changes** — binding comp logic
4. **Confidence & Review Trigger Standard changes** — quality gate logic
5. **External legal documents** — T&C, privacy policy, disclosures (O-002)
6. **Production releases** — any release touching client data, billing, or public-facing production
7. **Agent architecture changes** — any addition, removal, or scope change to PEO cell agents
8. **Middleware or RBAC changes** — any modification to route protection
9. **Spanish legal/financial phrasing** — any production UI release before O-003 closes
10. **Company-level factual claims** — revenue, pipeline, public proof approval
11. **Any decision overriding CLAUDE.md, the system AI Review Authority Matrix, or the Mandatory Build Activation Protocol**

---

## 7. Cross-Reference

| Document | Location | Relationship |
|----------|----------|-------------|
| System AI Review Authority Matrix | `01_system/ai-governance/ai-review-authority-matrix.md` | Parent authority — this matrix derives from and narrows it |
| Mandatory Build Activation Protocol | `01_system/ai-governance/mandatory-build-activation-protocol-2026-04-15.md` | Defines gate sequence; this matrix defines authority at each gate |
| AI-Native Operating Architecture | `01_system/ai-governance/ai-native-operating-architecture.md` | Defines workflow cells; this matrix defines review authority within the PEO cell |
| Agent Registry | `01_system/registry/final-approved-department-and-agent-registry.md` | Defines the 60 agents; this matrix defines their PEO review roles |
| PEO Build Activation Record | `04_products/PEO/00_governance/build-activation-record.md` | Gates 0·0A·1·1A·2 for PEO; this matrix gates authority within those gates |
| PEO Root Contract | `04_products/PEO/00_governance/root-contract.md` | Supreme PEO authority — supersedes this matrix where they conflict |
| PEO Scoped Rules | `04_products/PEO/00_governance/scoped-rules.md` | Context-specific build rules; this matrix governs who reviews scoped-rule changes |
| PEO Agent Routing Note | `04_products/PEO/00_governance/agent-routing-note.md` | Gate 0A cell assignment; this matrix governs reviewer assignment outside that cell |
| Skill Loading Matrix | `03_agent-skills/skill-loading-matrix.md` | Defines when workflow skills load; this matrix defines what reviews follow |
| VECS Architecture Amendment | `01_system/ai-governance/visual-experience-conversion-systems-architecture-amendment-2026-04-19.md` | Public-route overlay; this matrix formalizes its review path for PEO public routes |

---

*PEO AI Review Authority Matrix version 1.0 — 2026-04-22*  
*Authority: `01_system/ai-governance/ai-review-authority-matrix.md`*  
*Derived under: `01_system/ai-governance/mandatory-build-activation-protocol-2026-04-15.md` Gate 0A*
