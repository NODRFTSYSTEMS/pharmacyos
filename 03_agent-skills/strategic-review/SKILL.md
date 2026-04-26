---
name: strategic-review
description: Synthesize QAS reports, supervisor outputs, and cross-functional data
  into a prioritized, decision-oriented recommendation brief. Use when multi-agent
  outputs need reconciliation or a phase gate requires a data-backed recommendation
  before advancement.
---

# Strategic Review — Workflow Skill

## Purpose
Produce a clear, decision-oriented recommendation brief from QAS reports, supervisor summaries, and cross-functional data. This skill bridges the gap between multi-agent analysis and a single actionable recommendation for the Founder or MOA.

## Use When
- A QAS review cycle or supervisor summary requires synthesis into recommended next steps
- Outputs from multiple agents or phases conflict and must be reconciled
- A phase gate is reached and a gap audit is needed before advancement is authorized
- The Founder or MOA needs an independent analytical brief before committing to a strategic action

This skill reviews and recommends. It does not execute, implement, or override supervisor decisions.

## Required Inputs
- QAS reports or supervisor summaries for the active phase
- Original scope, acceptance criteria, or strategic objective
- Supporting data (intake scores, health scores, financial signals — as available)
- Decision constraints (timeline, budget, risk tolerance, authority limits)
- Prior recommendation history if this is a recurring review cycle

## Workflow
1. Confirm input sources are complete enough for a sound recommendation
2. Identify the core question the decision-maker must answer
3. Analyze QAS and supervisor findings for patterns, conflicts, and hidden dependencies
4. Cross-reference with intake data, health scores, or trend signals where relevant
5. Evaluate each plausible next step against stated constraints
6. Formulate a primary recommendation with clear rationale and evidence citations
7. Identify one or two fallback options with trigger conditions
8. Flag any gap where data is insufficient for a confident recommendation
9. Proactively document critical gaps in data, process, coverage, or governance — even if not the primary focus
10. Route the recommendation brief to MOA and the relevant human owner with gap register attached

## Outputs
- Recommendation brief: primary and fallback options with rationale
- Evidence map linking each recommendation to specific data points
- Conflict or dependency notes where findings contradict
- Confidence label per CLAUDE.md Section 10 (High / Moderate / Limited-Data Estimate / Needs Human Review)
- Phase gap register: critical gaps with corrective action recommendations
- Routing note to MOA with escalation guidance if human authority is needed

## Block Conditions
- If conflicting canonical documents cannot be reconciled: stop — do not synthesize past the conflict; escalate to Founder
- If data quality is too low to produce a recommendation above Moderate Confidence: flag all findings as Limited-Data Estimate and route to human authority before any action is taken

## Do Not Do
- Do not execute or implement recommendations
- Do not override QAS hold decisions or supervisor routing
- Do not make recommendations without citing the data that produced them
- Do not present a single option when constraints allow multiple viable paths
- Do not suppress conflicts to produce a cleaner output — surface them

## Escalation → MOA → HHC when
- Recommendation conflicts with approved governance or pricing policy
- Advancement would alter scope, budget, or timeline beyond delegated authority
- Data quality is below the confidence floor
- Findings reveal systemic risk not covered by current controls

**Human authority:** Founder (strategic decisions); ARE (technical or process decisions)

## Related Skills
- `03_agent-skills/department-skill-pack/strategic-intelligence/sra-strategic-review-agent/` — role-level agent for recurring strategic review
- `03_agent-skills/release-gate-review/` — pre-release gate execution
- `.claude/skills/qa_multipass.md` — QA pass framework
