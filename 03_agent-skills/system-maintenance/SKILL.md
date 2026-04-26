---
name: system-maintenance
description: Verify system health, component currency, and deployment readiness before
  any build or deployment operation. Run as a pre-build check — produces a health
  report and flags any blocker before execution starts.
---

# System Maintenance — Workflow Skill

## Purpose
Verify that all system components, dependencies, and tooling are current, secure, and deployment-ready before any build or deployment begins. This skill monitors and verifies — it does not execute production changes or approve deployments directly.

## Use When
- A pre-build or pre-deployment system health check is required
- Dependencies, libraries, or integrations need an update audit
- A security advisory affects a component in the active stack
- A recurring maintenance cycle is due for repository tools or CI/CD pipelines
- `hosting_maintenance` skill requires a system health baseline before a deployment cycle
- Tooling drift is suspected (component versions differ from the approved stack)

## Required Inputs
- Tool and dependency inventory from the project or from `01_system/commercial/tool-stack-recommendations.md`
- Build or deployment plan defining the components in scope
- Current version records and deprecation notices for critical dependencies
- Security advisory status for active packages (run `npm audit` as baseline)
- Environment configuration for the target deployment surface

## Workflow
1. Confirm the verification scope (full system, build-specific subset, or targeted dependency)
2. Pull current versions from the canonical tool inventory and environment configs
3. Run `npm audit` or equivalent for the active stack:
   - **None / Low:** proceed
   - **Moderate:** log and monitor; do not block unless the affected component is in the request path
   - **High / Critical:** BLOCK — resolve before any deployment proceeds
4. Check each component against vendor deprecation, security advisory, and patch status
5. Verify all required extensions, integrations, and access credentials are functional
6. Proactively identify critical gaps: components not inventoried, surfaces not yet verified, maintenance cycles overdue
7. Produce a system health report with pass/fail by component and recommended actions
8. Flag any blocker that prevents build start
9. Route update recommendations to the appropriate specialist (SEA, PIS, or human ARE) for implementation

## Outputs
- System health report: component-by-component currency status with pass/fail
- Pre-build verification checklist with explicit blocker flags
- `npm audit` result summary logged to `[WORKSPACE]/05_QA/npm_audit_[YYYY-MM-DD].md`
- SBOM (Software Bill of Materials) current state log
- Update recommendations: priority-ranked (Critical security / Deprecation / Performance)
- Critical gap register: undocumented surfaces, uninventoried components, overdue cycles
- Routing notes for remediation

## Block Conditions
- Any high or critical CVE vulnerability: block build/deployment until resolved — this is non-negotiable
- A required component is at end-of-life with no approved replacement path: block and escalate
- SBOM cannot be generated or is more than one release cycle stale: flag as IMPORTANT before proceeding

## Do Not Do
- Do not execute updates, patches, or deployments directly
- Do not approve a build or deployment start when a Critical blocker is present
- Do not treat a component as current without verifying against the vendor source
- Do not upgrade production dependencies without Founder or ARE approval when the upgrade affects a live system

## Escalation → MOA → HHC when
- A critical security patch is unapplied and exposes active production systems
- A pre-build check reveals a blocker that would compromise production integrity
- Vendor deprecation removes a component with no approved replacement
- Maintenance requires budget or vendor contract authority beyond current scope

**Human authority:** ARE

## Related Skills
- `03_agent-skills/department-skill-pack/people-roles-governance/sma-system-maintenance-agent/` — role-level agent
- `.claude/skills/hosting_maintenance.md` — calls this skill as pre-deployment check
- `03_agent-skills/release-gate-review/` — final release gate before production
