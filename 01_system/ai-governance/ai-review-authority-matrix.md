# AI Review Authority Matrix

Status: canonical governance
Date: 2026-04-18
Last amended: 2026-04-19 - VECS public-route review path added; ARE deployment status reconciled; 60-agent references aligned
Owners: Founder, ARE, QAS (Imani), HHC (Desmond)
Confidentiality: proprietary internal framework; no external publishing approved
Purpose: define who reviews what, at what authority level, with what escalation path and delegation boundaries, for every artifact class produced by the NoDrftSystems multi-agent system

---

## 1. Authority Tiers

These tiers define the review authority hierarchy. Routing always moves upward when a lower tier cannot resolve a decision.

| Tier | Role | Authority Scope | Named Agent / Human |
|------|------|----------------|---------------------|
| 1 | **Founder** | Final authority on all strategic, commercial, legal, and release decisions. Cannot be delegated for non-delegable items. | Human — Founder |
| 2 | **ARE** (AI Reliability Engineer) | Technical and process authority. Approves Class 3–4 builds, production releases, agent architecture changes, prompt/tool governance. | AI agent - ARE; Founder remains the final human authority where a human gate applies |
| 3 | **QAS** | Quality gate authority. Enforces pass/fail at every project stage. No artifact advances past QAS without explicit sign-off. | Imani / QAS |
| 4 | **HHC** | Human handoff routing authority. Routes all escalations to the correct human tier. Coordinates ARE and Founder review. | Desmond / HHC |
| 5 | **MOA** | Orchestration and activation discipline. Routes work to the correct agent cell. Enforces build packet completeness before execution begins. | Zayne / MOA |
| 6 | **Department Supervisors** | Scoped review authority within their department. Can clear artifacts within their bounded scope — cannot approve cross-department or high-risk outputs. | PMA (Keon), SDA (Marlon), RMA (Celeste), IGA (Shanice), PRGA (Ayanna), SRA (Janice) |

---

## 2. Artifact Review Matrix

For every artifact class: who produces it, who does peer review, which independent control agent checks it, which supervisor gate clears it, which human authority approves it, and at what threshold.

### Commercial Artifacts
*(proposals, SOWs, invoices, retainer agreements, pricing pages)*

| Step | Actor | Action |
|------|-------|--------|
| Produce | PEA (Giselle) | Draft proposal / SOW against scope brief and pricing governance |
| Peer review | CRMA (Daren) | Check CRM data, client context, commercial logic |
| Independent control | `reviewer_pricing_safety` | Verify all prices trace to operative pricing source; block any CONFLICT or NEEDS FOUNDER APPROVAL items |
| Finance review | IGA (Shanice) | Confirm invoice logic, payment terms, deposit structure |
| Supervisor gate | QAS (Imani) | Quality and completeness check before advancement |
| Human gate | Growth Lead → Founder | Founder required for amounts >$15K or any pricing exception |
| Skill to load | `pricing-safety-review` (workflow) | Enforce commercial consistency |

**Non-delegable items:** any discount, price floor exception, scope outside approved tiers, retainer terms that deviate from SOW template.

---

### Legal-Adjacent Artifacts
*(MSA, NDA, SOW with legal language, TOS, privacy policies, disclaimers, business formation templates)*

| Step | Actor | Action |
|------|-------|--------|
| Draft | CDA (Rochelle-Ann) | Draft against canonical templates in `01_system/legal/` |
| Compliance review | LCA (Dorothy) | Full compliance review per `legal-compliance` workflow skill; log to `06_legal-review/` |
| IP check | IPGA (Camille) | Flag any IP ownership, licensing, or NDA-scope concerns |
| Supervisor gate | QAS (Imani) | Block advancement if any Critical compliance finding |
| Human gate | **Founder + qualified legal counsel** | MANDATORY — no legal-adjacent artifact reaches clients without both |
| Skill to load | `legal-compliance` (workflow), `business_formation` (if formation) | |

**Non-delegable items:** ALL external legal documents. No exception. No delivery without qualified legal counsel confirmation.

**Mandatory disclaimer on business formation outputs:**
> "This material is for general informational purposes only and does not constitute legal advice. Consult a licensed attorney before making legal or structural decisions."

---

### Release Artifacts
*(production deployments, final delivery packages, access-transfer packages)*

| Step | Actor | Action |
|------|-------|--------|
| Deployment readiness | DRA (Terrence) | Full deployment readiness check |
| Documentation | QDA (Patrice) | Package evidence, release notes, known issues |
| Disclosure sweep | `disclosure_gate` skill | 13-item sweep — all must pass before any file is transferred |
| Supervisor gate | QAS (Imani) | Formal release sign-off |
| Handoff routing | HHC (Desmond) | Route to ARE and/or Founder for final human gate |
| Human gate | ARE (Class 1–2) / Founder (Class 3–4, client data, billing) | |
| Skill to load | `disclosure_gate`, `release-gate-review` (workflow), `handoff-preparation` (workflow) | |
| Rule to confirm active | `handover_protocol.md` | 6-gate sequence must complete before any transfer |

**Non-delegable items:** any release touching client data, billing systems, or public-facing production for any product.

---

### Build Artifacts
*(code, API changes, integrations, schema migrations, infrastructure, agent-system wiring)*

| Step | Actor | Action |
|------|-------|--------|
| Architecture | SAA (Samara) | Boundary definition, dependency plan |
| Implementation | Primary implementation role (SEA, FIS, BLS, IDS, DSS, PIS, POS, ASIS per build class) | Execute within Gate 3 rules |
| Test and verification | TVA (Leandra) | Verification evidence — typecheck, lint, test results, build result |
| Accessibility (T2+) | AAA (Rochelle) + `reviewer_accessibility` | WCAG 2.1 AA sweep; automated scan required |
| Security | SCA (Omari) | Security review for Class 3–4 or any auth/billing/data surface |
| Independent review | Separate reviewer path under QAS authority | Cannot be from the build cell |
| Supervisor gate | QAS (Imani) | Gate 5 — scope, evidence, no drift |
| Human gate | ARE (all production) → Founder (Class 3–4) | |
| Skill to load | `system-maintenance` (pre-build), `visual-direction` (if UI or public route), `legal-compliance` (if data) | |

**See:** `mandatory-build-activation-protocol-2026-04-15.md` for full gate sequence.

---

### Public Route Experience Artifacts
*(homepage, packages pages, case studies, service pages, proof bands, CTA paths, and public-route interaction systems)*

| Step | Actor | Action |
|------|-------|--------|
| Route architecture | VDA (Jeanine) | Define authority flow, proof rhythm, CTA-path logic, and route-level visual hierarchy |
| Treatment translation | DAA (Anika) | Convert route strategy into component, section, and implementation guidance |
| Executable implementation | FIS (Kiara) | Implement route-level layout, interaction, and state changes when code changes are required |
| Brand posture check | BCA (Nadine) | Reject generic, templated, or commercially weak visual patterns |
| Proof verification | `reviewer_public_proof` + QDA (Patrice) | Verify metrics, logos, testimonials, before/after claims, and evidence integrity |
| SEO structural check | STAA (Jermaine) | Confirm semantics, crawlability, and internal-linking integrity survive restructuring |
| Accessibility / reduced motion | `reviewer_accessibility` + AAA (Rochelle) | Reject motion-dependent comprehension and verify reduced-motion handling |
| Plain-language / CTA clarity | `reviewer_plain_language` + PLA (Simone) | Check scannability, comprehension, density, and CTA clarity |
| Supervisor gate | QAS (Imani) | Final hold/release decision for route advancement |
| Human gate | Founder | Mandatory for market-facing route posture changes, package presentation changes, case-study proof changes, or public-trust claims |
| Skill to load | `visual-direction`, `release-gate-review`, `legal-compliance` (if disclosure/regulatory), `strategic-review` (if route repositions the offer) | |

**Non-delegable items:** no fabricated proof, no release with motion-dependent comprehension, and no Founder-bypass on material public-trust route changes.

---

### Content Artifacts
*(copy, SEO articles, social content, email sequences, marketing pages)*

| Step | Actor | Action |
|------|-------|--------|
| Produce | CEA (Kalila) | Draft against approved brief and brand guidelines |
| Plain language review | `reviewer_plain_language` | Grade 8 reading level, brand voice, no jargon |
| Claims verification | `reviewer_public_proof` | Every statistic, claim, and social proof must have a verifiable source |
| Bilingual review (if EN/ES) | `reviewer_localization` + TCA (Xiomara) | QA Pass 5B — semantic and CTA parity |
| Brand consistency | BCA (Nadine) | Visual and messaging alignment |
| Content QA | QDA (Patrice) | Pass 2 — completeness, placeholders, brand voice |
| Supervisor gate | QAS (Imani) | Final clearance |
| Human gate | Founder for any market-facing claim about NoDrftSystems products | |
| Skill to load | `content_production`, `qa_multipass` | |

**Non-delegable items:** content making legal, medical, financial, or regulatory claims — Founder review mandatory.

---

### Strategic Artifacts
*(scope briefs, discovery outputs, strategy recommendations, Discovery Sprint deliverables)*

| Step | Actor | Action |
|------|-------|--------|
| Produce | PMA (Keon) + SRA (Janice) | Discovery synthesis, scope definition |
| Market intelligence | TSA (Kareem) or MOA-G (Aaliyah) | Market and positioning context where relevant |
| Critical synthesis | `strategic-review` workflow skill | Reconcile multi-agent outputs into ranked recommendation |
| Commercial check | PEA (Giselle) | Pricing-dependent scope commitments verified |
| Supervisor gate | QAS (Imani) | Completeness and alignment |
| Human gate | Founder | Strategic commitments, package-path changes, market-facing claims |
| Skill to load | `strategy-brief-builder` (workflow), `scope_brief`, `idea_development` (Discovery) | |

---

### Company-Control Artifacts
*(business plans, company baseline registers, public proof inventories, routine-usage pricing decision briefs, proprietary public-surface reconciliation records)*

| Step | Actor | Action |
|------|-------|--------|
| Produce | PMA (Keon) + SRA (Janice) | Draft or update the controlling artifact against live governance and source hierarchy |
| Context verification | RCA (Deven) | Confirm the claim, gap, or product surface matches the current repository state |
| Independent control | `reviewer_public_proof` and/or LCA (Dorothy) and/or IGA (Shanice) | Proof claims require proof review; legal-entity and legal-adjacent items require LCA; finance baselines require finance review |
| Supervisor gate | QAS (Imani) | Confirm every unresolved item is explicitly marked and every resolved item has evidence |
| Human gate | Founder | Mandatory for company-level factual claims, public proof approval, routine-usage pricing figures, and proprietary public-surface activation status |
| Skill to load | `business-baseline-reconciliation`, `public-proof-inventory-builder`, `proprietary-surface-governance-reconciliation` | |

**Non-delegable items:** legal entity specifics, live revenue or burn/runway claims, public proof approval, routine-usage pricing figures, and activation or deactivation of a proprietary public-commercial route.

---

### Intake and Qualification Artifacts
*(qualification decisions, lead scoring, routing decisions, Discovery Sprint confirmations)*

| Step | Actor | Action |
|------|-------|--------|
| Intake | COA (Talia) + CRMA (Daren) | Score and categorize inquiry |
| Qualification | DCPA (Vaughn) + CHSA (Lennox) | Run evaluation scorecard; assign band |
| Authority check | PRGA (Ayanna) | Verify decision-making authority of the contact |
| Routing decision | SDA (Marlon) | Route: proposal / Discovery Sprint / decline |
| Supervisor gate | QAS (Imani) | For regulated industries, high-friction, or >$50K inquiries |
| Human gate | Founder | Score band 0–49, regulated industry, IP/resale inquiries, >$50K |
| Skill to load | `client-intake-analysis` (workflow), `client_intake` session skill | |

---

### Governance Artifacts
*(agent additions, protocol changes, registry updates, pricing architecture changes, CLAUDE.md amendments)*

| Step | Actor | Action |
|------|-------|--------|
| Draft | PRGA (Ayanna) or KDGA (Mikael) | Draft change with justification |
| Conflict check | MOA (Zayne) | Verify no conflict with canonical governance |
| Impact assessment | SRA (Janice) | Analyze downstream dependencies |
| Technical review | ARE | Required for all architecture changes |
| Supervisor gate | QAS (Imani) | Compliance and consistency |
| Human gate | **Founder** | Mandatory — all governance changes |
| Log | `decision_log` skill | Required before any governance change takes effect |

**Non-delegable items:** ALL governance artifact changes require Founder sign-off. No agent may autonomously alter the approved registry, pricing architecture, CLAUDE.md, or any canonical governance document.

---

## 3. Escalation Chain

This sequence applies whenever a review or decision cannot be resolved at the current tier.

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

**ARE deployment note:** ARE is now deployed as an AI agent per Decision Log 2026-04-18-002. Founder remains the final human authority wherever a human gate applies.

---

## 4. Delegation Boundaries

What each authority tier can approve without escalating to the tier above.

| Tier | Can Approve Without Escalation | Cannot Approve — Must Escalate |
|------|-------------------------------|-------------------------------|
| Tier 6 (Dept. Supervisors) | Internal drafts within their department; routine skill activation; standard workflow execution | Anything client-facing, cross-department, or touching pricing, legal, or security |
| Tier 5 (MOA) | Build cell activation; skill routing; context state management; handoff execution | Build class upgrades; scope changes; pricing decisions; any human gate |
| Tier 4 (HHC) | Routing decisions; escalation delivery; human gate coordination | Final decisions on any artifact; signing off on release or transfer |
| Tier 3 (QAS) | QA pass results; completeness determinations; HOLD vs. PROCEED within workflow | Any decision that requires Founder or ARE authority; pricing or legal exceptions |
| Tier 2 (ARE) | Class 1–2 build production releases; technical architecture decisions; prompt/tool governance; agent capability assessments | Pricing exceptions; legal-adjacent documents; strategic scope changes; company-level factual claims; >$15K commercial decisions; all Tier 1 items |
| Tier 1 (Founder) | Everything — final authority | — |

---

## 5. Reviewer Agent Assignment

The six `.claude/agents/` reviewer personas and their artifact domain assignments.

| Reviewer Agent | Artifact Domain | Activates During |
|----------------|----------------|-----------------|
| `reviewer_package_integrity` | Any deliverable vs. signed SOW | QA Pass 5, Release Gate 1, all handoffs |
| `reviewer_plain_language` | Client-facing copy, UI text, documentation | QA Pass 2, all content deliverables |
| `reviewer_pricing_safety` | Proposals, SOWs, invoices, pricing pages, retainer agreements | All commercial artifacts before client delivery |
| `reviewer_public_proof` | Statistics, client results, market claims, competitive assertions | QA Pass 2, all public-facing content |
| `reviewer_localization` | Bilingual (EN/ES) deliverables | QA Pass 5B — any bilingual surface |
| `reviewer_accessibility` | Web builds T2+, forms, UI surfaces | QA Pass 6 — mandatory for all T2+ web builds |

**Reviewer independence rule:** The reviewer agent may not be the same as any agent in the production or build cell for that artifact. The reviewer is always separate.

**Loading rule:** Load the reviewer agent before Gate 5 (Independent Review) begins. Do not assign a reviewer after the build is "done" — the reviewer slot must be reserved at Gate 0A.

---

## 6. Non-Delegable Decisions

These items ALWAYS require Founder regardless of any delegation rule, any efficiency argument, or any deadline.

1. **Pricing exceptions** — any discount, price floor deviation, or custom pricing outside approved tiers
2. **External legal documents** — any MSA, NDA, SOW, or formation template sent to a client or used externally
3. **Production releases affecting client data or billing** — no exception
4. **Agent architecture changes** — any addition, removal, or scope change to an agent in the approved registry
5. **CLAUDE.md or canonical governance amendments** — root operating contract changes
6. **Strategic repositioning** — any change to offer scope, market-facing behavior, or product strategy
7. **Disclosure gate exceptions** — any authorized deviation from the pre-commit sweep
8. **ARE hire or contractor selection** — organizational authority decisions
9. **Client NDA and engagement confirmation for >$50K** — commercial authority threshold
10. **Company-level factual claims** — legal entity specifics, live financial baselines, live revenue or pipeline claims, approved public proof, or routine-usage pricing figures
11. **Activation status of a proprietary public-commercial route** — activating, deactivating, or materially repositioning a proprietary public route
12. **Any decision that overrides a rule in CLAUDE.md, this matrix, or the mandatory build activation protocol**

---

## 7. Cross-Reference

| Document | Location | Relationship |
|----------|----------|-------------|
| Mandatory Build Activation Protocol | `01_system/ai-governance/mandatory-build-activation-protocol-2026-04-15.md` | Defines gate sequence; this matrix defines authority at each gate |
| AI-Native Operating Architecture | `01_system/ai-governance/ai-native-operating-architecture.md` | Defines workflow cells; this matrix defines review authority within each cell |
| Agent Registry | `01_system/registry/final-approved-department-and-agent-registry.md` | Defines the 60 agents; this matrix defines their review roles |
| VECS Architecture Amendment | `01_system/ai-governance/visual-experience-conversion-systems-architecture-amendment-2026-04-19.md` | Defines the public-route overlay whose review path is formalized in this matrix |
| Company Baseline Gap-Closure Protocol | `01_system/ai-governance/company-baseline-gap-closure-protocol-2026-04-19.md` | Defines the controlled closure path for company-level unknowns and proprietary-surface reconciliation |
| Skill Loading Matrix | `03_agent-skills/skill-loading-matrix.md` | Defines when workflow skills load; this matrix defines what reviews follow |
| Reviewer Agents | `.claude/agents/` | The 6 reviewer implementations referenced in Section 5 |
| CLAUDE.md | repository root | Root authority — supersedes this matrix where they conflict |
