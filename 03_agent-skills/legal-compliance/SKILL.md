---
name: legal-compliance
description: Review any deliverable touching privacy, contracts, terms, disclaimers,
  or regulatory requirements. Produce a compliance review report and log a legal review
  request before external delivery. Use when legal-adjacent content is present in
  any deliverable.
---

# Legal Compliance — Workflow Skill

## Purpose
Review deliverables, documents, and processes that touch legal language, data privacy, consumer protection, or regulatory requirements. Produce compliance findings and route to human counsel where required. This skill reviews for risk — it does not provide licensed legal advice or authorize external sending.

## Use When
- A privacy policy, terms of service, disclaimer, or contract clause is being drafted or reviewed
- A product feature or data collection practice requires regulatory review
- A client deliverable includes legal-adjacent language before external use
- The `business_formation` skill has produced output that requires legal review logging
- A periodic legal review cycle is due for active policies and contract templates
- CDA (Contract Drafting Assistant) has produced a draft requiring compliance review

## Required Inputs
- The legal document, clause, deliverable, or process under review
- Applicable jurisdiction (default: United States)
- Regulatory framework if known (GDPR, CCPA, CAN-SPAM, FTC, state-specific, etc.)
- Prior approved versions or baselines for comparison (if updating an existing document)
- Data handling or collection specifications (if privacy-related)

## Workflow
1. Confirm the review scope and applicable regulatory framework
2. Compare the document against approved legal baselines from `90_source-documents/legal/` and canonical governance
3. Identify missing, outdated, or non-compliant clauses
4. Flag privacy, consumer protection, and liability exposure risks
5. Check whether ALL legal aspects for the product or deliverable are addressed — do not limit review only to the document submitted; flag any uncovered surfaces
6. Produce a compliance review report with severity-ranked findings
7. Log a legal review request to `[CLIENT-WORKSPACE]/06_legal-review/legal_review_[YYYY-MM-DD].md`
8. Route Critical findings to CDA (for drafting corrections) and HHC (for human counsel)
9. On periodic cycles: audit all active policies, public disclosures, and contract templates for currency

## Outputs
- Compliance review report: severity-ranked findings (Critical / Major / Minor)
- Full legal coverage checklist: all required policies, disclosures, contracts, and disclaimers mapped
- Gap analysis: uncovered legal surfaces identified with recommended corrective actions
- Legal review request log: entry in `[WORKSPACE]/06_legal-review/`
- Routing notes to CDA and human counsel for Critical and Major findings
- Regulatory watch list updates (when jurisdiction changes are detected)

## Severity Definitions
| Severity | Definition | Release Decision |
|----------|-----------|-----------------|
| Critical | Blocks external use; exposes NoDrftSystems or client to material legal risk | HOLD — do not deliver |
| Major | Must be resolved before the next delivery cycle | HOLD until resolved |
| Minor | Recommended improvement; does not block immediate delivery | Proceed; log for remediation |

## Block Conditions
- Any Critical finding blocks external delivery — period
- The legal review log entry must exist before any contract template is delivered to a client
- Business formation output must be logged to `06_legal-review/` before delivery

## Do Not Do
- Do not provide licensed legal advice or interpret statute for external reliance
- Do not authorize sending legal documents to clients or regulators
- Do not negotiate terms or accept liability language without human authority
- Do not treat internal compliance review as a substitute for qualified legal counsel on high-risk matters
- Do not clear a Critical finding without human counsel confirmation

## Escalation → QAS → HHC when
- A Critical compliance gap is found that blocks external use
- Regulatory uncertainty cannot be resolved from available sources
- Client requirements conflict with NoDrftSystems legal baselines
- A finding requires licensed legal counsel review before implementation

**Human authority:** Founder + Qualified Legal Counsel

## Related Skills
- `03_agent-skills/department-skill-pack/quality-compliance/lca-legal-compliance-agent/` — role-level agent
- `03_agent-skills/department-skill-pack/specialist-pool/cda-contract-drafting-assistant/` — contract drafting
- `.claude/skills/business_formation.md` — triggers legal review logging requirement
- `.claude/skills/disclosure_gate.md` — IP protection at handoff
