# Agent Routing Note - NDSW-001

Gate 0A output for NoDrftSystems website governance reconciliation and release-blocker closure.

Produced by: MOA, PMA, and RCA  
Build: NDSW-001 - Website Governance Reconciliation and Release-Blocker Closure  
Date: 2026-04-19  
Classification: Class 2

---

## 1. Surface Map

| Surface | Description |
| --- | --- |
| Workspace governance | Create and normalize the paired `02_client-system/` workspace and its control artifacts |
| Public route architecture | Govern the active website as a public commercial route system with explicit proof and CTA controls |
| Legal surfaces | Terms, privacy, and related trust pages require controlled review status |
| Bilingual routing | `#/es/` behavior requires human editorial release review |
| Runtime configuration | Live secure form endpoints must be populated and release-safe |
| QA and release evidence | Review-summary blockers, Lighthouse status, and manual QA need governed tracking |

---

## 2. Role-to-Surface Assignment

| Surface | Assigned Agent | Role | Owner Type |
| --- | --- | --- | --- |
| Workspace governance | PMA | primary | governance |
| Workspace governance | RCA | primary | implementation |
| Public route architecture | VDA | primary | strategy |
| Public route architecture | DAA | consult-only | strategy |
| Public route architecture | BCA | reviewer | review |
| Public route architecture | PLA | reviewer | review |
| Public route architecture | STAA | reviewer | review |
| Executable website surface | FIS | primary | implementation |
| Bilingual routing and proof posture | QDA | reviewer | review |
| Accessibility and release verification | AAA | reviewer | review |
| Verification evidence | TVA | primary | review support |
| Deployment readiness | DRA | reviewer | review |
| Legal surfaces | LCA | reviewer | review |
| Quality gate | QAS | reviewer | review |
| Orchestration and continuity | MOA + CSM | governance | governance |

**Mandatory base activation stack (confirm all are assigned):**

- [x] `MOA` - orchestration and activation discipline
- [x] `CSM` - context and state continuity
- [x] `PMA` - build packet control
- [x] `RCA` - repository-context loading
- [x] Primary implementation role: `FIS`
- [x] `TVA` - verification and reproducibility evidence
- [x] Separate reviewer reserved under `QAS` authority: `QAS`

**Conditional specialists activated (check all that apply):**

- [ ] `SAA` - architecture / boundary-setting is non-trivial
- [x] `FIS` - frontend UI / component implementation is primary work
- [ ] `BLS` - backend API / business logic is primary work
- [ ] `IDS` - runtime configuration and secure endpoint handling are material
- [ ] `DSS` - schema, migrations, or data integrity risk exists
- [ ] `PIS` - infrastructure, CI, or deployment is material
- [ ] `POS` - performance risk or optimization scope is explicit
- [ ] `ASIS` - agent-system integration or orchestration is material
- [x] `DAA` - UI design fidelity is relevant
- [x] `AAA` - accessibility compliance is required
- [ ] `SCA` - security or compliance review is triggered
- [x] `DRA` - deployment readiness is in scope

---

## 3. Capability Check

| Agent | Skill pack loadable? | Scope covers surface? | Required inputs available? | No cheaper agent can own this? |
| --- | --- | --- | --- | --- |
| MOA | Yes | Yes | Yes - control docs and current gap statement available | Yes |
| CSM | Yes | Yes | Yes - current repository context and workspace state available | Yes |
| PMA | Yes | Yes | Yes - business-plan gap and workspace requirements available | Yes |
| RCA | Yes | Yes | Yes - product folder and control-plane context available | Yes |
| VDA | Yes | Yes | Yes - public-route review context available | Yes |
| DAA | Yes | Yes | Yes - design handoff and public route context available | Yes |
| BCA | Yes | Yes | Yes - trust and posture review context available | Yes |
| STAA | Yes | Yes | Yes - route list and page structure available | Yes |
| PLA | Yes | Yes | Yes - public copy and CTA surfaces available | Yes |
| FIS | Yes | Yes | Yes - live website code and docs available | Yes |
| LCA | Yes | Yes | Yes - active legal pages and blocker summary available | Yes |
| TVA | Yes | Yes | Yes - release blocker list and QA assets available | Yes |
| DRA | Yes | Yes | Yes - release package and runtime-config context available | Yes |
| QAS | Yes | Yes | Yes - blocker status and artifact trail available | Yes |

---

## 4. Overlap Elimination

| Surface | Primary Owner | Secondary Role | Resolution |
| --- | --- | --- | --- |
| Public route posture | VDA | DAA / BCA / PLA / STAA | VDA owns route architecture; others provide bounded treatment, brand, language, and structural reviews |
| Workspace governance | PMA | RCA | PMA owns control logic; RCA owns repository-context and record consistency |
| Release verification | TVA | AAA / DRA / QDA / QAS | TVA gathers evidence; specialist reviewers own their specific gate questions |

---

## 5. Handoff Routing Plan

| Step | Agent | Bounded Surface | Handoff Trigger | Evidence Package Required | Fallback Agent |
| --- | --- | --- | --- | --- | --- |
| 1 | PMA | workspace scope and artifact list | activation begins | objective, gap statement, required artifact list | MOA |
| 2 | RCA | repository-context confirmation | PMA defines scope | product-path map, control-plane comparison, registry gaps | PMA |
| 3 | VDA | route-governance framing | workspace and product context confirmed | route inventory, trust-surface map, CTA-path notes | BCA |
| 4 | DAA + FIS | executable website and workspace alignment | route framing accepted | implementation notes, runtime-config targets, route references | IDS |
| 5 | LCA | legal-surface review status | legal pages and release blockers mapped | legal issue list, page references, review notes | QAS |
| 6 | AAA + PLA + STAA + QDA | accessibility, language, structure, proof hygiene | implementation or route changes drafted | review comments, blocker updates, proof-inventory status | QAS |
| 7 | TVA + DRA | verification and deployment-readiness evidence | reviewer findings compiled | QA evidence, endpoint status, release-readiness note | QAS |
| 8 | QAS | final hold / proceed recommendation | all evidence compiled | updated execution plan, blocker log, review status | Founder |

---

## 6. Capability Gaps

| Gap | Affected Surface | Resolution Plan |
| --- | --- | --- |
| No approved public proof inventory entries recorded yet | Public route proof surfaces | Use `public-proof-inventory-builder` and block all unapproved proof claims |
| Human editorial review for `#/es/` routing not yet complete | Bilingual public routes | Keep release status `HOLD` until the editorial review is completed |
| Expanded Terms of Service still require final legal review | Legal surfaces | Keep legal pages under LCA-led hold until review closes |
| Live secure form endpoints not yet recorded as populated | Runtime configuration and inquiries path | Require deployment-time verification before release |

---

## 7. Routing Approval

This note is approved for activation of the governance-reconciliation package.

- MOA sign-off: [x] confirmed
- PMA sign-off: [x] confirmed
- RCA sign-off: [x] confirmed

If a clean routing plan cannot be produced, the build does not activate.
