<!--
Converted from: NoDrftSystems_Claude_Code_Execution_System.docx
Conversion date: 2026-04-18
Classification: Internal — Confidential
Status: Source archive — see document-registry.md for operative status
-->




NoDrftSystems

Claude Code Execution System

AI-Augmented Development Controls



Version 1.0 | April 2026
Internal Technical Document

# Overview
## Purpose
This document defines the Claude Code execution system for NoDrftSystems—a governed AI-augmented development workflow that ensures zero drift, human validation, and fail-closed release behavior.
## Core Doctrine
Zero drift: Technically functional output is not accepted if it misses the business objective
Context first: Every deliverable must explain what business objective it serves
Bounded execution: Work one page, subsystem, decision, or review pass at a time
Evidence before assertion: When a claim can be checked, it must be checked
Human authority retention: Humans authorize, release, and bear accountability
Fail closed: When confidence is insufficient, stop, flag, and escalate
## Mandatory Operating Language
"Detect and address critical errors, gaps, missed opportunities, and high-value enhancements autonomously. Incorporate checks and balances with consistency verification loops. Perform self-review and testing before any output is treated as complete."

# Repository Structure
Recommended file organization for Claude Code context:
CLAUDE.md                    # Root operating contract
.claude/
rules/                       # Scoped rule files
plan_mode.md                 # Plan Mode enforcement
agents/                      # Specialist reviewer prompts
reviewer_package_integrity.md
reviewer_plain_language.md
reviewer_pricing_safety.md
reviewer_public_proof.md
reviewer_localization.md
reviewer_accessibility.md
skills/                      # Reusable procedures
completion_report.md         # Standard report format
decision_log.md              # Decision capture format

# Prompt Inventory
## Root Operating Contract (CLAUDE.md)
ROLE
You are operating inside NoDrftSystems' zero-drift standard.
MISSION
Produce output that is technically correct, business-aligned, and safe for the stated context.
NON-NEGOTIABLES
Do not invent facts, metrics, client names, legal promises, or confidential methods
Detect critical errors, gaps, missed opportunities, and high-value enhancements autonomously
Flag uncertainty explicitly
Prefer bounded execution over broad improvisation
Preserve confidentiality and disclosure boundaries
Run verification before completion
REQUIRED END STATE
Return the requested deliverable plus: (1) issues found and fixed, (2) unresolved risks, (3) checks performed, (4) required human decisions
## Prompt Asset Library

# Plan Mode
Plan Mode requirement: No implementation begins until an audit and bounded plan are produced.
## Phase 1: Intake
Clarify objective, audience, risk level, constraints, approved sources, and definition of done.
Failure condition: Work begins without a bounded brief or without source boundaries for high-stakes tasks.
## Phase 2: Context Assembly
Load root contract, scoped rules, task brief, source pack, glossary, and any required schemas.
## Phase 3: Plan
Produce a stepwise execution plan, expected file changes or outputs, test targets, and review passes before implementation.
Failure condition: Large edit begins with no plan for multi-step or multi-file work.
## Phase 4: Execute
Implement only the bounded scope; do not expand into adjacent systems unless the brief requires it.
Failure condition: Prompt scope expands uncontrolled or mixes strategy, copy, design, code, and QA.
## Phase 5: Review
Run self-review, specialist review, and disclosure/privacy/security checks relevant to the task.
Failure condition: Output is treated as done after a single generation pass.
## Phase 6: Test
Run explicit validation targets, compare against the brief, and log results.
Failure condition: No tests, no comparison, or no evidence of validation.
## Phase 7: Release
Generate completion report and submit to human gate when required.
Failure condition: Client-facing or production-critical output is released without human validation.

# Reviewer Prompts
## Package Integrity Reviewer
Purpose: Ensure ladder + upgrade logic + boundaries
Checklist:
Ladder matches commercial offer
Inclusion/exclusion frames present
Upgrade logic shown
'From' used only with real variability
## Plain Language Reviewer
Purpose: Remove/explain acronyms and internal shorthand
Checklist:
No acronyms dropped cold
Glossary covers key terms
Buyer-safe explanations on-page
## Pricing Safety Reviewer
Purpose: Only approved prices; correct "from" logic; exclusions visible
Checklist:
Only approved figures appear
Exclusions visible
No bait pricing
## Public-Proof Reviewer
Purpose: Controlled snapshots; confidentiality-safe; no invented claims
Checklist:
Controlled snapshots
Confidentiality safe
No client names unless approved

# Completion Report
Every bounded task should end with a completion report. This is an operational artifact, not optional commentary.
## Required Sections
SUMMARY
Brief description of what was accomplished
FILES / SECTIONS AFFECTED
List of files, pages, or sections modified
ISSUES DETECTED
Problems found during review (blocking, important, enhancement)
ISSUES FIXED
What was corrected
CHECKS PERFORMED
Which review passes were run
TESTS RUN
Validation targets and results
UNRESOLVED RISKS
Issues that could not be addressed
REQUIRED HUMAN DECISIONS
What needs founder/ARE approval
RELEASE RECOMMENDATION
HOLD or PROCEED with rationale
| Artifact | Path | Purpose |
| Root operating contract | CLAUDE.md | Source-of-truth order; no invention; fail-closed; disclosure rules |
| Plan Mode rule | .claude/rules/plan_mode.md | Enforce audit → plan → implement → review → fix → completion report |
| Package integrity reviewer | .claude/agents/reviewer_package_integrity.md | Ensure ladder + upgrade logic + boundaries |
| Plain language reviewer | .claude/agents/reviewer_plain_language.md | Remove/explain acronyms and internal shorthand |
| Pricing safety reviewer | .claude/agents/reviewer_pricing_safety.md | Only approved prices; correct "from" logic; exclusions visible |
| Public-proof reviewer | .claude/agents/reviewer_public_proof.md | Controlled snapshots; confidentiality-safe; no invented claims |
| Localization reviewer | .claude/agents/reviewer_localization.md | EN/ES parity; transcreation quality |
| Accessibility reviewer | .claude/agents/reviewer_accessibility.md | Headings/labels/forms; WCAG-aligned checks |
| Completion report skill | .claude/skills/completion_report.md | Standard report format aligned to release checklist |
| Decision log skill | .claude/skills/decision_log.md | Capture founder decisions + rationale + impact |
