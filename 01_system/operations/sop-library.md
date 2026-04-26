<!--
Classification: Internal — Confidential — Proprietary
Source: Synthesized from NoDrftSystems governance documents (CLAUDE.md, MBAP, ai-review-authority-matrix.md, ai-native-operating-architecture.md, 03_agent-skills/, .claude/skills/, .claude/rules/)
Status: Canonical internal reference — not for external distribution
Last updated: 2026-04-18
-->

# NoDrftSystems Standard Operating Procedures

**Version:** 1.0
**Date:** 2026-04-18
**Classification:** Internal — Proprietary
**Authority:** Founder
**Maintenance Owner:** PRGA (Ayanna) + KDGA (Mikael)

> All SOPs operate under CLAUDE.md as the root authority. Where any SOP conflicts with CLAUDE.md, CLAUDE.md governs. Any amendment to this library requires Founder sign-off and a Decision Log entry via `/decision_log`.

---

## Index

| SOP | Title | Primary Skill | Agent Lead |
|-----|-------|--------------|------------|
| [SOP-001](#sop-001) | New Client Inquiry and Qualification | `/client_intake` | COA (Talia), CRMA (Daren) |
| [SOP-002](#sop-002) | Discovery Sprint Execution | `/idea_development` | PMA (Keon), SRA (Janice) |
| [SOP-003](#sop-003) | Scope Brief and SOW Production | `/scope_brief` | PMA (Keon), PEA (Giselle) |
| [SOP-004](#sop-004) | Build Activation and Execution | `/web_build` | MOA (Zayne), SEA |
| [SOP-005](#sop-005) | QA Multi-Pass and Release Gate | `/qa_multipass` | QAS (Imani), QDA (Patrice) |
| [SOP-006](#sop-006) | Client Handover and Project Close-Out | `/disclosure_gate` | HHC (Desmond), DRA (Terrence) |
| [SOP-007](#sop-007) | Ongoing Maintenance Retainer Management | `/hosting_maintenance` | SMA (Yvonne), DRA (Terrence) |
| [SOP-008](#sop-008) | GitHub Operations and Disclosure Gate | `/disclosure_gate` | IPGA (Camille), SCA (Omari) |
| [SOP-009](#sop-009) | Content Production Workflow | `/content_production` | CEA (Kalila), QDA (Patrice) |
| [SOP-010](#sop-010) | Business Formation Assistance | `/business_formation` | BPA (Maritza), LCA (Dorothy) |
| [SOP-011](#sop-011) | Agent and Skill Activation Protocol | — | MOA (Zayne), QAS (Imani) |
| [SOP-012](#sop-012) | Proprietary Product Build Protocol | `/web_build`, `/scope_brief` | MOA (Zayne), PMA (Keon) |

---

## SOP-001

### New Client Inquiry and Qualification

**Trigger:** Any inbound inquiry — form submission, email, referral, DM, or call.
**Skill:** `/client_intake`
**Agent Lead:** COA (Talia) — intake capture; CRMA (Daren) — CRM and scoring
**Human Gate:** Founder for band 0–49, regulated industry, IP/resale, or >$50K engagement

#### Steps

1. **Capture** — COA logs inquiry in CRM with full contact details, source, stated need, and timestamp.
2. **Enrich** — CRMA pulls any prior client history, referral context, and decision-maker authority data.
3. **Load skill** — Invoke `/client_intake` to run the full scoring sequence.
4. **Score** — DCPA (Vaughn) and CHSA (Lennox) run the qualification scorecard:
   - Band 85–100: Qualified — route to Discovery Sprint or direct proposal
   - Band 70–84: Qualified with conditions — route to Discovery Sprint, note conditions
   - Band 50–69: Marginal — Discovery Sprint only; no direct SOW
   - Band 0–49: Decline — send professional decline; log to CRM
5. **Authority check** — PRGA (Ayanna) verifies decision-making authority of the contact. Flag if contact cannot commit without escalation to an unnamed stakeholder.
6. **Route** — SDA (Marlon) assigns: proposal / Discovery Sprint / decline.
7. **QAS gate** — QAS (Imani) reviews when: regulated industry, high-friction signals, >$50K inquiry, or any ambiguous qualification.
8. **Founder gate** — Required for: band 0–49 override, regulated industry, IP/resale engagement, any inquiry >$50K.
9. **Log** — Log Decision ID via `/decision_log` for any Founder routing decision.

#### Inputs Required
- Contact name, company, stated objective
- Budget signal (if any)
- Timeline stated
- Referral source or inbound channel

#### Outputs
- Qualification band (85–100 / 70–84 / 50–69 / 0–49)
- Routing decision (Discovery Sprint / proposal / decline)
- CRM record updated
- Any escalation flags documented

#### Rules
- No proposal may be drafted for a contact who has not been scored.
- No engagement may begin without a qualification record.
- Decline communications are professional — no detail about internal scoring.

---

## SOP-002

### Discovery Sprint Execution

**Trigger:** Qualified client (band 50+) who needs scope definition, or any engagement where scope is ambiguous.
**Skill:** `/idea_development`
**Agent Lead:** PMA (Keon) — Discovery synthesis; SRA (Janice) — strategic review
**Human Gate:** Founder before any market-facing strategic commitment

#### Steps

1. **Confirm Discovery Sprint purchase** — Discovery Sprint is $2,000 flat. No Discovery Sprint begins without signed SOW and deposit cleared.
2. **Load skill** — Invoke `/idea_development` to activate the Discovery Sprint execution sequence.
3. **Kick-off brief** — PMA (Keon) opens with structured intake: objectives, constraints, competitive context, audience, brand state.
4. **Market and positioning context** — TSA (Kareem) or MOA-G (Aaliyah) when market framing, competitor landscape, or positioning clarity is needed.
5. **Strategic synthesis** — SRA (Janice) synthesizes multi-input findings into a ranked recommendation brief using `strategic-review` workflow skill.
6. **LCA check** — LCA (Dorothy) reviews if Discovery surfaces any data practices, regulatory scope, or terms obligations. Log findings to `06_legal-review/`.
7. **Pricing check** — PEA (Giselle) verifies any package-path recommendations against operative pricing governance before they appear in client-facing output.
8. **QAS gate** — QAS (Imani) reviews Discovery output for completeness, specificity, and alignment. Generic or category-level outputs are flagged and returned.
9. **Founder gate** — Required before any strategic recommendation that: repositions the NoDrftSystems offer, makes market-facing claims, or commits to a package path >T3.
10. **Deliver Discovery output** — 6-item output only (per `/idea_development` skill): opportunity summary, recommended direction, scope recommendation, risk flags, package-path recommendation, next-step brief.
11. **Credit note** — Discovery Sprint fee is credited toward the next contracted package if contracted within 30 days of Discovery delivery. Confirm in writing.

#### Outputs
- Discovery Sprint deliverable (6 items above)
- Package-path recommendation with pricing reference
- Credit tracking note in CRM

#### Rules
- Discovery Sprint output does not constitute a binding scope commitment. The SOW governs.
- The Discovery Sprint methodology is NoDrftSystems proprietary — output is client-owned, methodology is not.
- No output item may include a fabricated claim, unverified statistic, or invented client evidence.

---

## SOP-003

### Scope Brief and SOW Production

**Trigger:** Discovery Sprint complete and client has approved direction, OR client arrives with a defined brief that passes qualification.
**Skill:** `/scope_brief`
**Agent Lead:** PMA (Keon) — scope brief; PEA (Giselle) — SOW and commercial terms
**Human Gate:** Founder for SOW amounts >$15K or any pricing exception

#### Steps

1. **Load skill** — Invoke `/scope_brief` to activate scope brief production sequence.
2. **Confirm inputs** — Verify: Discovery output (or approved brief), qualification record, package-path decision, any pre-agreed terms.
3. **Draft scope brief** — PMA produces 9-section scope brief (stored in `[CLIENT-WORKSPACE]/03_strategy/`):
   - Client context, objective, scope boundary, deliverables, exclusions, success criteria, constraints, risks, recommended package
4. **Commercial check** — PEA (Giselle) verifies: package tier matches deliverables, pricing traces to operative pricing source, no custom pricing without Founder approval.
5. **Pricing safety review** — Load `pricing-safety-review` workflow skill. `reviewer_pricing_safety` runs full check: no CONFLICT items, no NEEDS FOUNDER APPROVAL items unresolved.
6. **Finance review** — IGA (Shanice) confirms payment terms, deposit structure, and invoice logic match the offer.
7. **Draft SOW** — PEA produces SOW from `01_system/legal/sow-template.md`. All `[REQUIRED: ___]` items must be completed. Must reference the signed MSA.
8. **Legal check** — LCA (Dorothy) runs `legal-compliance` workflow skill on SOW language. Log to `06_legal-review/`. Any Critical finding blocks advancement.
9. **QAS gate** — QAS (Imani) clears SOW for completeness, pricing alignment, and no scope drift.
10. **Founder gate** — Required for: amounts >$15K, any pricing exception or custom term, scope outside approved tiers.
11. **Client delivery** — SOW is delivered per communication protocol. No SOW is sent without qualified legal counsel confirmation if it contains non-standard terms.
12. **Log** — Decision Log entry for any Founder approval.

#### Outputs
- Scope brief (9 sections) at `[CLIENT-WORKSPACE]/03_strategy/scope-brief.md`
- Signed SOW at `[CLIENT-WORKSPACE]/05_commercial/sow-[ref].md`
- Pricing safety review result
- Legal review log entry

#### Rules
- No build begins without a signed SOW and deposit cleared.
- SOW scope is the only binding scope. Discovery output, emails, and verbal discussions are not binding scope.
- Change orders are required for any scope change after SOW execution.

---

## SOP-004

### Build Activation and Execution

**Trigger:** Signed SOW received, deposit cleared, all client inputs delivered (content, logo, brand assets, approved brief).
**Skill:** `/web_build`
**Agent Lead:** MOA (Zayne) — activation and orchestration; PMA (Keon) — project management
**Human Gate:** ARE before any production release; Founder for Class 3–4 builds

**Cross-reference:** `01_system/ai-governance/mandatory-build-activation-protocol-2026-04-15.md` governs the complete gate sequence. This SOP is a routing guide — the MBAP is the authoritative gate document.

#### Pre-Build Checklist (Gate 0)
- [ ] Signed SOW on file
- [ ] Deposit cleared and confirmed by IGA
- [ ] All client inputs received: content, logo (.svg/.ai), brand assets, approved brief
- [ ] Client workspace bootstrapped at `02_client-system/[CLIENT-CODE]/`
- [ ] `.claude/rules/plan_mode.md` active — startup declaration required before any build task

#### Steps

1. **System health check** — SMA (Yvonne) runs `system-maintenance` workflow skill: `npm audit`, CVE scan (no high/critical unresolved), component currency check, SBOM generation. Log result.
2. **Visual direction brief** — If build introduces new UI surfaces, branding, or visual assets: load `visual-direction` workflow skill. VDA (Jeanine) produces direction brief before DAA or FIS begin implementation. This is mandatory for T2+ builds with any new UI surface.
3. **Legal compliance check** — If build touches privacy forms, consent, data collection, or regulatory surfaces: LCA (Dorothy) runs `legal-compliance` workflow skill. Log findings before any data-touching feature is built.
4. **Architecture boundary** — SAA (Samara) defines dependency plan and component boundaries. No implementation begins without this.
5. **Build execution** — Primary implementation role executes within Gate 3 rules. Smallest viable cell only.
6. **Accessibility review** (T2+ mandatory) — AAA (Rochelle) + `reviewer_accessibility` runs WCAG 2.1 AA sweep. Automated scan required. Block advancement if AA failures exist.
7. **Security review** (Class 3–4, or any auth/billing/data surface) — SCA (Omari) reviews. Log findings.
8. **Test and verification** — TVA (Leandra) produces verification evidence: typecheck, lint, test results, build result.
9. **Independent review** — Separate reviewer path under QAS authority. Cannot be from the build cell.
10. **QAS gate** — QAS (Imani) Gate 5: scope, evidence, no drift. Formal sign-off required.
11. **Human gate** — ARE reviews all production builds. Founder required for Class 3–4 or any build touching client data or billing.

#### Package Tier Rules
| Tier | Description | Human Gate |
|------|-------------|------------|
| T0 | Discovery Sprint - scope only | Founder (strategic commitments) |
| T1 | Conversion Landing Page Sprint - single page, no CMS | ARE |
| T1S | Static Business Site - up to 5 pages, no CMS | ARE |
| T2 | Business Launch Site - up to 5 pages, CMS | ARE + accessibility review |
| T3 | Authority Website - 15 pages, advanced CMS | ARE + Founder |
| T4 | Platform Starter - web app with integrations | ARE + Founder |
| T5 | Ecosystem Build - multi-surface platform | ARE + Founder + security review |

#### Rules
- No build starts without Gate 0 complete.
- No production deployment without ARE human gate.
- Disclosure Gate must fire before any `git commit` or file transfer. See SOP-008.

---

## SOP-005

### QA Multi-Pass and Release Gate

**Trigger:** Any build or deliverable declared complete by the build cell.
**Skill:** `/qa_multipass`
**Agent Lead:** QAS (Imani) — gate authority; QDA (Patrice) — documentation and evidence
**Human Gate:** ARE (Class 1–2); Founder (Class 3–4, client data, billing)

#### Steps

1. **Load skill** — Invoke `/qa_multipass` to run all 7 QA passes in sequence.
2. **Pass 1 — Functional completeness** — Does every deliverable in the SOW exist and function per its acceptance criterion?
3. **Pass 2 — Content accuracy** — `reviewer_plain_language`: Grade 8 level, brand voice, no jargon. `reviewer_public_proof`: every statistic and claim has a verifiable source.
4. **Pass 3 — Visual and brand** — BCA (Nadine): visual and messaging alignment. VDA (Jeanine) if new UI surfaces exist.
5. **Pass 4 — Technical** — Typecheck passing, lint clean, build passes, no high/critical CVEs, SBOM current.
6. **Pass 5 — Package integrity** — `reviewer_package_integrity`: deliverable matches SOW scope exactly. No scope drift, no missing items.
7. **Pass 5B — Bilingual parity** (if EN/ES) — `reviewer_localization` + TCA (Xiomara): semantic parity and CTA parity between EN and ES versions.
8. **Pass 6 — Accessibility** (T2+) — `reviewer_accessibility` + AAA (Rochelle): WCAG 2.1 AA. Automated scan result attached.
9. **QAS gate** — QAS (Imani) formal sign-off. All passes must PASS before advancement. Any FAIL returns to build cell with specific written defect list.
10. **Release Gate 1** — QDA (Patrice) documents: evidence package, release notes, known-issues note.
11. **Release Gate 2** — DRA (Terrence): deployment readiness check.
12. **Release Gate 3** — Disclosure Gate sweep (see SOP-008). All 13 items must pass.
13. **Release Gate 4** — HHC (Desmond) routes to ARE and/or Founder per authority matrix.
14. **Release Gate 5** — Human approval (ARE / Founder per class).
15. **Release Gate 6** — MOA (Zayne) confirms activation authorization before deployment proceeds.

#### Pass Result Format
Each pass returns: PASS / FAIL / HOLD
- PASS: advances to next pass
- FAIL: returns to producing agent with specific written defects; re-verification required
- HOLD: escalation needed before pass can complete

#### Rules
- No artifact self-certifies its own QA. The producing agent cannot be the QA reviewer.
- Silence or "looks good" without documented criteria review is not a PASS.
- Any FAIL at Pass 5 (package integrity) requires full re-verification of all prior passes.

---

## SOP-006

### Client Handover and Project Close-Out

**Trigger:** All QA passes complete; Founder approval received; client acceptance pending or complete.
**Skill:** `/disclosure_gate`, `/completion_report`
**Agent Lead:** HHC (Desmond) — handoff routing; DRA (Terrence) — deployment and transfer
**Human Gate:** Founder — all client-facing transfers involving production systems, data, or billing

**Rule:** The 6-gate `handover_protocol` (`.claude/rules/handover_protocol.md`) must complete in sequence before any file is transferred to a client.

#### Handover Protocol Gates (in order)
1. **Gate 1 — QA sign-off** — QAS (Imani) formal sign-off on file. Evidence package complete.
2. **Gate 2 — Legal review** — LCA (Dorothy) confirms no outstanding compliance issues. Any legal-adjacent content in the package has been reviewed and cleared.
3. **Gate 3 — Disclosure sweep** — Run `/disclosure_gate` (13-item sweep). All items must PASS. Log result to `[CLIENT-WORKSPACE]/06_handoff/`. No exceptions.
4. **Gate 4 — Access transfer** — PSA (Priya) executes access transfer per access transfer log. Client owns all accounts. NoDrftSystems retains no persistent access unless under a maintenance retainer.
5. **Gate 5 — Founder approval** — Founder approves final release. Log Decision ID via `/decision_log`.
6. **Gate 6 — Package assembly** — CCA (Chloe) assembles complete handoff package: delivery assets, documentation, support window terms, access transfer record, known-issues note.

#### Steps After Protocol Gates
7. **Client delivery** — COA (Talia) coordinates delivery communication. Delivery method per communication protocol.
8. **Acceptance clock** — Client has [per SOW] business days to review. Silence = acceptance per SOW terms.
9. **Support window opens** — Support window begins on acceptance date. Document in CRM.
10. **Archive** — MOA (Zayne) archives project to completed state. Workspace locked to read-only internal access.
11. **Completion report** — Invoke `/completion_report`. Log to `[CLIENT-WORKSPACE]/`.

#### Outputs
- Signed acceptance (or constructive acceptance by silence)
- Handoff package at `[CLIENT-WORKSPACE]/06_handoff/`
- Access transfer log
- Support window start date on file
- Completion report
- Decision Log entry

---

## SOP-007

### Ongoing Maintenance Retainer Management

**Trigger:** Maintenance retainer SOW executed. Support window has ended or was never in scope.
**Skill:** `/hosting_maintenance`
**Agent Lead:** SMA (Yvonne) — system health; DRA (Terrence) — deployment
**Human Gate:** Founder for any retainer deviation, emergency access grant, or security incident

#### SLA Tiers
| Tier | Response Window | Use Case |
|------|----------------|----------|
| Standard | 48 hours | Routine content updates, minor fixes |
| Priority | 24 hours | Business-critical uptime issues |
| Emergency | 4 hours | Security incidents, complete service failure |

#### Monthly Maintenance Cycle

1. **Health check** — SMA (Yvonne) runs `system-maintenance` workflow skill: `npm audit`, CVE scan, dependency update review. Log result.
2. **SBOM update** — Update Software Bill of Materials if any dependency changed.
3. **CVE resolution** — Any high/critical CVE must be resolved before the maintenance cycle closes. No exceptions.
4. **Content updates** — Execute client-requested content updates within retainer scope. Document what was changed.
5. **Deployment** — DRA (Terrence) deploys only after system health check passes.
6. **Access audit** — TACA (Khadija) verifies no unauthorized access has persisted. Confirm collaborator list matches current retainer terms.
7. **Report** — Invoke `/completion_report` for each maintenance cycle. Send to client.

#### Rules
- Retainer scope is defined in the maintenance retainer SOW. Updates outside scope require a Change Order.
- No deployment without a passing `npm audit` (no high/critical unresolved).
- Access credentials are not stored in the repository. Use secrets management.
- Emergency response requires Founder notification within 1 hour of incident identification.

---

## SOP-008

### GitHub Operations and Disclosure Gate

**Trigger:** Any `git add`, `git commit`, `git push`, repository transfer, or handoff package assembly.
**Skill:** `/disclosure_gate`
**Agent Lead:** IPGA (Camille) — IP and disclosure; SCA (Omari) — security
**Human Gate:** Founder for any disclosure gate exception or failure override

**Rule:** `.claude/rules/github_disclosure_gate.md` fires automatically before every `git add/commit/push`. It cannot be waived by any agent. A waiver requires explicit Founder authorization logged in the Decision Log.

#### 13-Item Disclosure Gate Sweep

Before any commit, transfer, or handoff package, verify ALL of the following:

1. [ ] `CLAUDE.md` is listed in `.gitignore` — confirmed excluded from commit
2. [ ] `.claude/` directory is listed in `.gitignore` — confirmed excluded
3. [ ] `.env*` files are excluded — no environment variables in commit
4. [ ] No private keys, certificates, or credentials in staged files
5. [ ] No client PII in staged files (names, emails, payment data)
6. [ ] No NoDrftSystems proprietary pricing data in staged files
7. [ ] No internal agent configuration or system prompt content in staged files
8. [ ] No client-workspace paths from `/02_client-system/` in staged files (unless explicitly authorized)
9. [ ] No `/01_system/commercial/` content in staged files
10. [ ] No `/shared/prompt-library/` content in staged files
11. [ ] Deliverable scope matches signed SOW — no unreleased features or scope outside SOW
12. [ ] SBOM is current — no new dependencies introduced without a health check
13. [ ] Access transfer log is up to date if this commit is part of a handoff

#### Steps

1. **Before staging** — Review staged file list manually. Do not use `git add .` without reviewing every file.
2. **Run sweep** — Invoke `/disclosure_gate`. Work through all 13 items.
3. **PASS** — All 13 items pass. Proceed with commit.
4. **FAIL** — Any item fails: halt. Do not commit. Document the failure item. Route to IPGA (Camille) and SCA (Omari) for resolution.
5. **Exception required** — If a Founder-authorized exception is needed: log Decision ID via `/decision_log` BEFORE proceeding. The exception is recorded, not waived.
6. **Log** — Log disclosure gate result to `[CLIENT-WORKSPACE]/06_handoff/disclosure-gate-log.md` for all handoff-related commits.

#### `.gitignore` Minimum Requirements
The repository `.gitignore` must always include:
```
CLAUDE.md
.claude/
.env*
*.pem
*.key
*.cert
02_client-system/
01_system/commercial/
shared/prompt-library/
```

---

## SOP-009

### Content Production Workflow

**Trigger:** Approved content brief on file. Client has supplied all required inputs (copy direction, audience, goals, brand guidelines).
**Skill:** `/content_production`
**Agent Lead:** CEA (Kalila) — production; QDA (Patrice) — content QA
**Human Gate:** Founder for any market-facing claim about NoDrftSystems products or any legal, medical, financial, or regulatory claim

#### Pre-Production Checklist (7 items)
Before any draft begins:
- [ ] Approved content brief on file with stated objective
- [ ] Audience defined (specific, not generic sector label)
- [ ] Brand guidelines on file (voice, tone, style guide or reference)
- [ ] All copy inputs from client received (or explicit note that CEA is producing original copy — requires SOW scope to include copywriting)
- [ ] Claims and statistics sourced — no fabricated data
- [ ] Bilingual flag confirmed: is EN/ES in scope? (triggers Pass 5B + TCA involvement)
- [ ] Regulatory surface check: does content touch legal, medical, financial, or regulated claims?

#### Steps

1. **Load skill** — Invoke `/content_production`.
2. **Draft** — CEA (Kalila) produces draft against approved brief and brand guidelines.
3. **Plain language review** — `reviewer_plain_language`: Grade 8 reading level, brand voice, no jargon. Return to CEA if fail.
4. **Claims verification** — `reviewer_public_proof`: every statistic, claim, and social proof item must have a verifiable source logged. No claim advances without a source.
5. **Bilingual review** (if EN/ES) — `reviewer_localization` + TCA (Xiomara): semantic parity, CTA parity, no literal translation. QA Pass 5B.
6. **Brand consistency** — BCA (Nadine): visual and messaging alignment with brand framework.
7. **Content QA** — QDA (Patrice) Pass 2: completeness, no placeholders, brand voice, no fabricated claims.
8. **QAS gate** — QAS (Imani) final clearance.
9. **Founder gate** — Required for: any market-facing claim about NoDrftSystems products, legal/medical/financial/regulatory claims.
10. **Deliver** — Per communication protocol.

#### Rules
- Fabricated statistics are an automatic FAIL at any pass. No exception.
- Bilingual content is transcreation, not translation. TCA (Xiomara) must be in the loop for any ES surface.
- Content making legal, medical, or financial claims requires both Founder review AND qualified external expert review before delivery.

---

## SOP-010

### Business Formation Assistance

**Trigger:** Client requests help with business formation, entity structure, NAICS classification, or related guidance.
**Skill:** `/business_formation`
**Agent Lead:** BPA (Maritza) — formation guidance; LCA (Dorothy) — compliance review
**Human Gate:** Founder review — all formation outputs; external legal counsel — all formation templates before client delivery

#### Mandatory Disclaimer (must appear verbatim on all formation outputs)

> This material is for general informational purposes only and does not constitute legal advice. Consult a licensed attorney before making legal or structural decisions.

#### Steps

1. **Load skill** — Invoke `/business_formation`.
2. **NAICS classification** — BPA (Maritza) routes client's business type to correct NAICS code using the routing table in `/business_formation` skill.
3. **Entity structure guidance** — BPA produces general informational guidance on entity types relevant to the client's context.
4. **LCA review** — LCA (Dorothy) runs `legal-compliance` workflow skill on all formation guidance. Log findings to `[CLIENT-WORKSPACE]/06_legal-review/`.
5. **Mandatory disclaimer** — Confirm verbatim disclaimer appears on every formation output. This is non-negotiable.
6. **Founder gate** — Required for all formation outputs before client delivery.
7. **Legal counsel gate** — No formation template reaches a client without qualified legal counsel confirmation. No exception.
8. **Deliver** — With disclaimer. Log delivery to project record.

#### Rules
- NoDrftSystems does not provide legal advice. Full stop.
- All formation content is general informational only.
- Any output that could be interpreted as legal advice requires immediate escalation to Founder before delivery.

---

## SOP-011

### Agent and Skill Activation Protocol

**Trigger:** Any new task requiring agent or skill activation; any request to add a new agent to the system.
**Skill:** N/A (governance SOP)
**Agent Lead:** MOA (Zayne) — activation routing; QAS (Imani) — compliance gate
**Human Gate:** Founder — all new agent additions; ARE — all architecture changes

#### Activating Existing Agents

1. **Identify task type** — What is the artifact class? Reference `01_system/ai-governance/ai-review-authority-matrix.md` Section 2.
2. **Identify smallest viable cell** — Which existing agents are required? Do not activate agents whose bounded scope is not needed for this task.
3. **Identify required skills** — Reference `03_agent-skills/skill-loading-matrix.md`. Load only the skills whose workflow phase applies.
4. **MOA routing** — MOA (Zayne) confirms activation list and routes work to the correct agent cell.
5. **QAS compliance** — QAS (Imani) confirms the activation set matches the task scope. No over-activation.

#### Skill Loading Rules

**Invokable session skills** (`.claude/skills/` — load via `/skill-name`):
| Skill | Load When |
|-------|-----------|
| `/client_intake` | New external client inquiry received |
| `/idea_development` | Early-stage engagement or Discovery Sprint |
| `/scope_brief` | Discovery complete; produce execution-ready brief |
| `/web_build` | Web build task with signed SOW |
| `/hosting_maintenance` | Maintenance retainer activated |
| `/business_formation` | Client requests formation or NAICS guidance |
| `/content_production` | Content deliverable with approved brief |
| `/qa_multipass` | Any task declared complete |
| `/disclosure_gate` | Before any `git add/commit/push` or handoff |
| `/completion_report` | End of any bounded task |
| `/decision_log` | Any Founder/ARE decision or governance exception |

**Workflow skills** (`03_agent-skills/` — load per phase):
| Skill | Load When |
|-------|-----------|
| `repository-triage` | Before changing repo structure |
| `documentation-reconstruction` | Rebuilding fragmented operating docs |
| `profitability-review` | Detecting margin leakage |
| `client-intake-analysis` | Scoring and routing client opportunities |
| `pricing-safety-review` | Any artifact with a price |
| `client-workspace-bootstrap` | Instantiating accepted work |
| `strategy-brief-builder` | Converting discovery to execution-ready strategy |
| `release-gate-review` | Before any deployment |
| `handoff-preparation` | Packaging transfer and archive materials |
| `strategic-review` | Synthesizing QAS/supervisor outputs |
| `visual-direction` | Any build introducing new UI surfaces or branding |
| `legal-compliance` | Any privacy, contract, or regulatory surface |
| `system-maintenance` | Before every build or deployment start |

#### Adding a New Agent

A new agent requires ALL of the following before it operates:
1. A workflow justification demonstrating it cannot be covered by an existing agent
2. A proposed bounded scope that does not conflict with any existing agent's scope
3. An assigned human owner
4. Founder + ARE approval
5. An entry added to `01_system/registry/final-approved-department-and-agent-registry.md`
6. A Decision Log entry via `/decision_log`

No agent operates without a registry entry. No exception.

---

## SOP-012

### Proprietary Product Build Protocol

**Trigger:** Any build on NoDrftSystems' own products (e.g., WCP, BHPW, or any 04_products/ item) — as distinct from client-facing delivery builds.
**Skill:** `/web_build`, `/scope_brief`
**Agent Lead:** MOA (Zayne) — orchestration; PMA (Keon) — product management
**Human Gate:** Founder — all product activations, feature changes, and releases

#### Distinction from Client Builds

| Factor | Client Build | Proprietary Product Build |
|--------|-------------|--------------------------|
| Governing SOW | Signed client SOW | Founder approval memo or Proprietary Build Declaration |
| IP ownership | Client (post payment) | NoDrftSystems |
| Release authority | ARE + Founder | Founder only |
| Disclosure gate | Required | Required |
| Registry entry | Client workspace | `04_products/[PRODUCT-CODE]/` |

#### Steps

1. **Product activation** — Founder issues activation memo or Proprietary Build Declaration. No proprietary product build begins without this.
2. **Scope brief** — Invoke `/scope_brief`. PMA (Keon) produces a scope brief for the product feature or release. Stored at `04_products/[PRODUCT-CODE]/03_strategy/`.
3. **System health check** — SMA (Yvonne) runs `system-maintenance` workflow skill. No build starts with unresolved high/critical CVEs.
4. **Visual direction** (if UI) — Load `visual-direction` workflow skill. VDA (Jeanine) produces direction brief before any visual implementation begins.
5. **Build execution** — Same gate sequence as SOP-004. MBAP governs.
6. **QA** — Same multi-pass sequence as SOP-005.
7. **Disclosure gate** — Run `/disclosure_gate` before any commit. Proprietary product code is especially sensitive — confirm no internal governance or agent config is included in commits.
8. **Founder release gate** — Founder must approve every proprietary product release. ARE approval alone is not sufficient.
9. **Evidence ledger** — Log build evidence to `04_products/[PRODUCT-CODE]/` evidence ledger.

#### Rules
- No proprietary product build begins without a Founder activation memo.
- Proprietary product repositories must have `.gitignore` enforcement covering all NoDrftSystems internal governance files.
- The `04_products/` workspace follows the same numbered folder convention as `02_client-system/`.

---

*This SOP Library requires Founder sign-off before any amendment takes effect. All amendments must be logged via `/decision_log`. Version history is maintained in git.*
