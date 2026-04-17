---
document: PEO Repository-Agent Capability Map
status: Active governance
version: 1.0
date: 2026-04-16
owner: PRGA + MOA + RCA + PMA
authority: `01_system/ai-governance/build-control-assets/07-repository-agent-capability-map-template.md`
confidentiality: Proprietary internal — no external publishing approved
---

# Repository-Agent Capability Map

## 1. Repository Identity

- Repository: `04_products/PEO/`
- Linked Client Profile: Internal product — Peak Equity Optimizer
- Linked Root Contract: `00_governance/root-contract.md`
- Linked Scoped Rules: `00_governance/scoped-rules.md`
- Last Reviewed: 2026-04-16

## 2. Surface Routing Map

| Surface or Module | Primary Agent | Secondary Agent | Specialist Trigger | Required Handoff Target | Reviewer Path | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Governance packet / activation control | `PMA` | `RCA` | `MOA` if classification or escalation changes | `MOA` | `QAS` | Root contract, scoped rules, packet, checklist, evidence |
| Public website / free estimator | `FIS` | `BLS` | `AAA`, `BPA`, `SCA` when accessibility, parity, or disclosure risk appears | `TVA` | `QAS` | Phases 2 and trust-sensitive public surfaces |
| Seller / triage / readiness | `BLS` | `SCA` | `DSS` for schema, `IDS` for provider wiring | `TVA` | `QAS` | Phases 3 and route-boundary logic |
| Investor basic / advanced | `BLS` | `FIS` | `SCA` for exposure, `DSS` for schema | `TVA` | `QAS` | Phases 4–5 calculation and export surfaces |
| Marketplace / vendor | `FIS` | `BLS` | `SCA` for RBAC, `TVA` for authz tests, `PIS` if runtime/deploy changes | `DRA` | `QAS` | Phase 6; inherited vendor APIs already exist |
| Admin control plane | `BLS` | `FIS` | `SCA` for admin exposure, `PIS` for runtime/deploy, `DSS` for admin data changes | `DRA` | `QAS` | Phase 6; admin APIs already partially exist |
| Auth / RBAC / middleware | `SCA` | `BLS` | `IDS` if Clerk/session behavior changes materially | `TVA` | `QAS` | Root-contract critical surface |
| Database / schema / audit log | `DSS` | `BLS` | `PIS` if deploy/runtime implications arise | `TVA` | `QAS` | Add `DSS` whenever schema moves |
| Analytics / event linting | `SCA` | `BLS` | `PIS` if deployment/runtime event config changes | `TVA` | `QAS` | No PII in payloads |
| Deployment / platform / env | `PIS` | `DRA` | `ASIS` if tool-chain orchestration or agent-system wiring changes | `TVA` | `QAS` | Phase 6 Class 4 material surface |

## 3. Known Constraints

- High-Risk Surfaces:
  - Admin APIs and any future admin UI
  - Deployment/runtime/environment configuration
  - Vendor/admin RBAC and field filtering
- Trust-Sensitive Surfaces:
  - Public legal/disclosure content
  - Investor exports and watermarking
  - Marketplace claims and vendor presentation
- Data or Privacy-Sensitive Surfaces:
  - Seller/investor application data
  - Vendor lead data
  - Analytics payloads and audit logs
- Areas Requiring ARE Escalation:
  - Packet approval for Phase 6
  - Production deploy readiness
  - Tool/prompt changes mid-phase

## 4. Capability Gaps

- Known Gaps:
  - Phase 4–5 independent QAS review artifact not yet filed
  - Marketplace/admin UI routes absent in repo
  - Vendor/admin/marketplace tests absent in repo
  - Production env/deploy rehearsal not yet evidenced in repo
- Temporary Workarounds:
  - Existing vendor/admin APIs may be treated as inherited Phase 6 scope, not accepted delivery
  - Upload flow remains bounded by O-005 stub rules
- Hiring, Skill, or Tool Actions Needed:
  - Activate `PIS` for Phase 6
  - Activate `QDA` if release documentation is required
  - Add `DSS` or `IDS` if schema or third-party wiring changes expand during Phase 6
