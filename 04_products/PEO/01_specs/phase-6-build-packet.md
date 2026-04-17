---
document: PEO Phase 6 Build Packet
status: Prepared — pending Founder + ARE approval
version: 1.0
date: 2026-04-16
owner: PMA
authority: Mandatory Build Activation Protocol — Gate 1 build packet template
confidentiality: Proprietary internal — no external publishing approved
---

# PEO Phase 6 Build Packet
## Marketplace + Admin + Deployment

---

## Phase Gate Status

| Prior Artifact | Status | Evidence |
|----------------|--------|---------|
| Phase 5 completion report | Filed — `ready_for_review` | `01_specs/phase-5-completion-report.md` |
| Phase 5 evidence ledger update | Filed | `00_governance/evidence-ledger.md` |
| Phase 5 → Phase 6 routing note | Normalized to Class 4 handoff | `00_governance/agent-routing-note.md` |
| Phase 6 activation checklist | Prepared | `00_governance/phase-6-activation-and-handoff-checklist.md` |
| Phase 6 prompt inventory | Prepared | `00_governance/canonical-prompt-inventory.md` |
| Phase 6 tool inventory | Prepared | `00_governance/canonical-tool-inventory.md` |
| Phase 6 capability map | Prepared | `00_governance/repository-agent-capability-map.md` |

Control note:
- This packet prepares Phase 6 for truthful Class 4 activation. It does not itself unlock Gate 3 execution.
- Independent QAS review artifact exists for Phases 1–3 only. Phase 4–5 independent QAS review remains an open gate and must be resolved before Phase 6 Gate 3.
- Founder approval to advance to Phase 6 and ARE packet approval are not yet recorded in-repo.

---

## Active Cell (Phase 6 Class 4)

| Agent | Role | Surface |
|-------|------|---------|
| MOA | Master Orchestrator Agent | Activation discipline, escalation routing, cross-role coordination |
| CSM | Context & State Manager | Context continuity across historical Phase 1–5 artifacts and Phase 6 execution |
| PMA | Product Manager Agent | Packet control, scope enforcement, evidence and gate discipline |
| SAA | Solution Architecture Assistant | Class 4 boundary-setting across marketplace, admin, runtime, and deployment surfaces |
| RCA | Repository Context Assistant | Mandatory repo-context loading and pattern inventory |
| BLS | Backend & Logic Specialist — primary backend | Marketplace/admin APIs, role-sensitive business logic, audit coverage |
| FIS | Frontend Implementation Specialist — primary UI | Marketplace and admin UI routes, route-level bilingual/accessibility fit |
| TVA | Test & Verification Assistant | Authz matrix, regression, E2E, deployment verification evidence |
| SCA | Security & Compliance Agent | RBAC, PII/event safety, disclosure timing, export and admin boundary review |
| DRA | Deployment Readiness Agent | Deployment checklist, release gating, rollback verification |
| PIS | Platform & Infrastructure Specialist | Vercel/Neon/Clerk/R2/PostHog/Resend environment and runtime behavior |

Reviewer path:
- `QAS` remains outside the build cell
- `QDA` joins if release documentation is required

Conditional additions:
- `DSS` if schema migrations or data integrity changes land during Phase 6
- `IDS` if third-party provider wiring changes materially
- `AAA` / `BPA` if new marketplace/admin UI surfaces require dedicated accessibility or bilingual parity review beyond TVA coverage

---

## Objective

Bring PEO to a truthful Class 4 Phase 6 activation state by governing and completing the Marketplace, Admin, and Deployment surfaces already partially present in the repository.

Phase 6 is not a greenfield start. Existing vendor/admin API work and route protection already exist in `peo-app/` and must now be normalized under Class 4 controls, completed where missing, tested, reviewed, and made deployment-ready.

---

## In-Scope Deliverables

### 1. Marketplace / Vendor Surface

- Public marketplace directory route(s) for vendor discovery
- Vendor-facing authenticated routes for:
  - application
  - profile management
  - lead management
  - review response flow
- Governance and test coverage for existing vendor APIs already present in-repo:
  - `src/app/api/vendor/apply/route.ts`
  - `src/app/api/vendor/directory/route.ts`
  - `src/app/api/vendor/directory/[id]/route.ts`
  - `src/app/api/vendor/directory/[id]/contact/route.ts`
  - `src/app/api/vendor/directory/[id]/reviews/route.ts`
  - `src/app/api/vendor/leads/route.ts`
  - `src/app/api/vendor/leads/[id]/contact/route.ts`
  - `src/app/api/vendor/profile/route.ts`
- Event coverage for marketplace events already defined in `scoped-rules.md`
- RBAC verification for `vendor` and `admin_internal`

### 2. Admin Surface

- Internal admin UI route(s) under `/:locale/admin`
- Governance and test coverage for existing admin APIs already present in-repo:
  - `src/app/api/admin/applications/route.ts`
  - `src/app/api/admin/applications/[id]/route.ts`
  - `src/app/api/admin/users/route.ts`
  - `src/app/api/admin/users/[id]/role/route.ts`
- Clarify unimplemented or placeholder admin surfaces before release:
  - empty directory placeholders exist under `src/app/api/admin/vendors/`
  - empty directory placeholders exist under `src/app/api/admin/audit-logs/`
- Audit log visibility and role-change traceability

### 3. Deployment / Runtime Surface

- Vercel deployment readiness across preview and production paths
- Environment-variable matrix and provisioning checks for:
  - Clerk
  - Neon
  - Cloudflare R2
  - PostHog
  - Resend
  - Rentcast
- Runtime checks for Next.js build/start behavior
- Rollback reference and deploy rehearsal notes
- DRA release checklist completion

### 4. Existing Repo-State Normalization

- `src/middleware.ts` already protects vendor and admin patterns; Phase 6 must verify that this protection matches actual route behavior
- `messages/en.json` and `messages/es.json` already contain vendor-tier strings; Phase 6 must ensure route-level parity rather than relying on orphaned translation keys
- No marketplace/admin UI routes were found under `src/app/[locale]/`
- No vendor/admin/marketplace tests were found under `tests/`

---

## Exclusions (Phase 6)

| Exclusion | Reason |
|-----------|--------|
| Public release of legal pages | O-002 final legal text remains open |
| Production UI release relying on unreviewed Spanish legal/financial phrasing | O-003 professional translation review remains open |
| Production uploads without malware scanning | O-005 remains open |
| New third-party tools outside the declared stack | Prohibited without Founder approval and tool inventory update |
| Performance optimization work not required for release readiness | Add `POS` only if performance risk becomes explicit |

---

## Acceptance Criteria

- Marketplace and admin route scope is fully defined and bounded
- Existing vendor/admin APIs are either covered by tests and evidence or explicitly marked out-of-scope for this phase
- Marketplace/admin UI routes are implemented or their absence is explicitly preserved as an exclusion
- RBAC and field-level filtering are verified for `vendor` and `admin_internal`
- Middleware behavior matches route reality
- Vendor/admin E2E critical flows are covered
- Deployment checklist is complete
- Preview/build evidence exists
- Security and compliance review is filed
- Independent QAS review is filed
- Phase 6 structured completion report is prepared before advancement

---

## Required Evidence (Phase 6 gate)

| Evidence | Owner | Requirement |
|----------|-------|-------------|
| TypeScript typecheck pass | BLS/FIS/PIS | Zero errors |
| ESLint pass | BLS/FIS/PIS | Clean |
| Production build pass | BLS/FIS/PIS | `next build` succeeds |
| Marketplace/admin API tests | TVA | Vendor/admin route contracts and authz coverage |
| Middleware authz verification | TVA/SCA | Vendor/admin protected routes behave correctly |
| E2E critical flows | TVA | Vendor apply, vendor lead retrieval, admin list/update flow |
| RBAC matrix | TVA/SCA | `vendor` and `admin_internal` plus negative-role checks |
| PII / event linting review | SCA | No prohibited fields in new marketplace/admin event payloads |
| Deployment checklist | DRA/PIS | Env matrix, rollback reference, preview verification |
| Security sign-off | SCA | Admin/vendor surface review complete |
| Evidence ledger update | PMA | `00_governance/evidence-ledger.md` updated |
| Gate 4A structured completion report | PMA | `01_specs/phase-6-completion-report.md` |

---

## Dependencies

- `00_governance/root-contract.md`
- `00_governance/scoped-rules.md`
- `00_governance/tech-stack.md`
- `00_governance/open-items-tracker.md`
- `00_governance/agent-routing-note.md`
- `00_governance/phase-6-activation-and-handoff-checklist.md`
- `00_governance/canonical-prompt-inventory.md`
- `00_governance/canonical-tool-inventory.md`
- `00_governance/repository-agent-capability-map.md`
- `01_specs/architecture-boundaries.md`
- `01_specs/spec-index.md`
- `01_specs/phase-4-completion-report.md` — **hard gate: Phase 4–5 QAS independent review artifact must be filed before Phase 6 Gate 3** (confirmed sequential by Founder 2026-04-16)
- `01_specs/phase-5-completion-report.md` — **hard gate: same as above**

---

## Risk Level

**HIGH**

| Risk | Description |
|------|-------------|
| Governance drift | Phase 6-adjacent APIs already exist without a Phase 6 packet/evidence trail |
| Admin overexposure | `admin_internal` surfaces can create severe trust and data-integrity failures if filtering is weak |
| Vendor route mismatch | Middleware, API behavior, and absent UI routes may drift apart |
| Deployment misconfiguration | Vercel/Neon/Clerk/R2 provisioning is material to this phase and currently not evidenced in a release packet |
| Open release blockers | O-002, O-003, and O-005 remain unresolved |

---

## Human Approval Required

- Founder approval to advance into Phase 6 execution
- ARE approval of this Phase 6 build packet
- QAS review reservation before Gate 3
- DRA + QAS + human ARE approval before any production deployment

---

## Recommended Next Actions

- File or update the missing independent QAS review artifact for Phases 4–5
- Record Founder and ARE approval or leave Phase 6 explicitly in prepared state
- Execute Phase 6 only with the Class 4 cell defined above
- Treat any pre-existing vendor/admin API work as inherited scope that must be verified, not as already accepted delivery

---

*Phase 6 Build Packet version 1.0 — prepared 2026-04-16; approval pending*
*Authority: `01_system/ai-governance/mandatory-build-activation-protocol-2026-04-15.md`*
