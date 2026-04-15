# Document Registry

Purpose: define what each preserved source file is for, whether it should be treated as authoritative, and what action is required before it is used operationally.

Status definitions:

- `Canonical governance`: current control document for a live repository workflow
- `Active reference`: useful working file that supports execution, but does not outrank canonical governance
- `Governed by canonical layer`: source material or live asset that must be interpreted through `01_system/`
- `Reference only`: keep for context, not for direct quoting or publishing
- `Derived export`: output or summary of other source material, not primary source
- `Historical baseline`: keep to preserve the prior audit or transition record, not as the current state by itself
- `Needs human decision`: cannot be treated as operative until founder, counsel, or another designated authority resolves status

## Canonical Working Files

- `01_system/operations/repository-control-plane.md`
  Role: current operating map for repository layers, artifact classes, change control, and execution routing
  Status: canonical governance
  Action: use as the current control document for repository behavior and future restructuring

- `01_system/repository-audit-2026-04-13.md`
  Role: first restructuring audit after root cleanup
  Status: historical baseline
  Action: preserve as the transition audit; do not treat it as the current operating map by itself

- `01_system/registry/final-approved-department-and-agent-registry.md`
  Role: normalized working registry for the approved agent architecture
  Status: active reference
  Action: use as the staffing truth for approved departments, codes, and ownership

- `NoDrftSystems_Final_Approved_Agent_Registry.pdf`
  Role: approved source export backing the normalized registry
  Status: derived export
  Action: preserve as approval evidence for the working registry

- `01_system/ai-governance/ai-native-operating-architecture.md`
  Role: workflow activation, review-gate, and AI operating model guidance
  Status: canonical governance
  Action: use for activation logic and control rules; do not let it override the approved registry on staffing counts or department structure

- `01_system/commercial/pricing-governance.md`
  Role: pricing hierarchy, control chain, and quoting discipline
  Status: canonical governance
  Action: use before proposals, package pages, retainers, SOWs, or invoices are drafted

- `01_system/commercial/tool-stack-recommendations.md`
  Role: lean tool standardization policy
  Status: canonical governance
  Action: use when adding, removing, or standardizing workflow tools

- `02_client-system/client-intake-operating-system.md`
  Role: lead intake, qualification, routing, and workspace-entry operating rules
  Status: canonical governance
  Action: use for every new opportunity until a superseding intake system is approved

- `02_client-system/templates/client-workspace-template/WORKSPACE-BOOTSTRAP.md`
  Role: client workspace instantiation kit and required starter artifact pack
  Status: canonical governance
  Action: use when creating any new client or project workspace from the template

- `03_agent-skills/skill-loading-matrix.md`
  Role: skill routing map for repeatable AI-assisted execution
  Status: canonical governance
  Action: use before loading skills or assembling workflow-specific agent bundles

- `03_agent-skills/skill-pack-build-specification.md`
  Role: production build specification for department and agent role skills
  Status: canonical governance
  Action: use before generating per-department or per-agent skills from the approved registry and role library

- `90_source-documents/ai-architecture/NoDrftSystems_Skills_Library_v1.md`
  Role: normalized skill-source document containing role behavior, duties, triggers, inputs, outputs, and escalation rules for all approved agents
  Status: active reference
  Action: use as the source of truth for role behavior when building or regenerating department skill packs

## Skill System

- `03_agent-skills/repository-triage/SKILL.md`
  Role: repository audit and structural triage skill
  Status: active reference
  Action: load when auditing cluttered, export-heavy, or structurally ambiguous repositories

- `03_agent-skills/documentation-reconstruction/SKILL.md`
  Role: document rebuilding skill
  Status: active reference
  Action: load when an operating asset is incomplete, fragmented, or shallow

- `03_agent-skills/profitability-review/SKILL.md`
  Role: margin and leverage review skill
  Status: active reference
  Action: load when evaluating workflow drag, founder overload, or tool sprawl

- `03_agent-skills/client-intake-analysis/SKILL.md`
  Role: intake scoring and routing skill
  Status: active reference
  Action: load when a lead packet or discovery intake needs decision-oriented review

- `03_agent-skills/pricing-safety-review/SKILL.md`
  Role: commercial control and pricing consistency skill
  Status: active reference
  Action: load for proposals, SOWs, invoices, package pages, retainers, and pricing exceptions

- `03_agent-skills/client-workspace-bootstrap/SKILL.md`
  Role: accepted-client workspace setup skill
  Status: active reference
  Action: load once an opportunity is accepted and must be instantiated into the standard workspace

- `03_agent-skills/strategy-brief-builder/SKILL.md`
  Role: discovery-to-strategy translation skill
  Status: active reference
  Action: load when discovery outputs must become an execution-ready brief

- `03_agent-skills/release-gate-review/SKILL.md`
  Role: pre-release and pre-handoff control skill
  Status: active reference
  Action: load before release, launch, delivery handoff, or project close-out

- `03_agent-skills/handoff-preparation/SKILL.md`
  Role: transfer and close-out preparation skill
  Status: active reference
  Action: load when assembling final delivery packages, access transfer notes, and archive records

## Strategy

- `90_source-documents/strategy/NoDrftSystems_2026_Business_Plan_v2_Updated.docx`
  Role: near-term operating and financial narrative
  Status: governed by canonical layer
  Action: use for strategic baseline, not as sole pricing authority

- `90_source-documents/strategy/NoDrftSystems_Business_Foundation.docx`
  Role: premium and enterprise positioning model
  Status: reference only
  Action: treat as future-state positioning unless founder promotes it

- `90_source-documents/strategy/NoDrftSystems_Master_Strategic_Alignment_Pack.docx`
  Role: executive alignment pack
  Status: active reference
  Action: use to align messaging, gating, and roadmap assumptions

- `90_source-documents/strategy/NoDrftSystems_Investor_Package.docx`
  Role: investor-facing narrative
  Status: reference only
  Action: verify that revenue, tooling, and pricing align before reuse

- `90_source-documents/strategy/NoDrftSystems_Addendum_1_Organizational_Architecture_Resolution.docx`
  Role: organizational design reference
  Status: active reference
  Action: keep aligned with AI architecture and hiring decisions

- `90_source-documents/strategy/NoDrftSystems_Addendum_13_Tax_Optimization_Plan.docx`
  Role: tax planning reference
  Status: needs human decision
  Action: do not treat as professional tax advice without licensed review

- `90_source-documents/strategy/NoDrftSystems_Addendum_20_Essential_Business_Elements.docx`
  Role: business checklist and requirements framing
  Status: active reference
  Action: merge useful elements into canonical governance where repeated

- `90_source-documents/strategy/NoDrftSystems_Addendum_23_Multi_Product_Strategy.docx`
  Role: multi-product expansion thesis
  Status: active reference
  Action: use after the cash engine is stable, not before

## Commercial

- `90_source-documents/commercial/NoDrftSystems_Service_Pricing_Architecture_v1.docx`
  Role: current package architecture
  Status: governed by canonical layer
  Action: primary commercial reference pending founder approvals called out inside the file

- `90_source-documents/commercial/NoDrftSystems_Pricing_Summary_Sheet_2026.docx`
  Role: public baseline plus market-edition calibration summary
  Status: governed by canonical layer
  Action: use only with pricing governance; do not treat as standalone quote sheet

- `90_source-documents/commercial/NoDrftSystems_Pricing_Colombia_2026.pdf`
  Role: regional confidential pricing edition
  Status: reference only
  Action: confirm active use before quoting from it

- `90_source-documents/commercial/NoDrftSystems_Pricing_Jamaica_2026.pdf`
  Role: regional confidential pricing edition
  Status: reference only
  Action: confirm active use before quoting from it

- `90_source-documents/commercial/NoDrftSystems_Addendum_7_Project_Proposal_Template.docx`
  Role: proposal template
  Status: active reference
  Action: port to a controlled working template before regular use

- `90_source-documents/commercial/NoDrftSystems_Addendum_11_Invoice_Template.docx`
  Role: invoice template
  Status: active reference
  Action: keep aligned with payment terms in pricing governance

- `90_source-documents/commercial/NoDrftSystems_Addendum_19_Cost_Budget_Roadmap.docx`
  Role: cost roadmap
  Status: active reference
  Action: cross-check against real subscriptions before financial use

- `90_source-documents/commercial/NoDrftSystems_Addendum_21_Realistic_Cost_Analysis.docx`
  Role: cost realism overlay
  Status: active reference
  Action: reconcile with any live subscription stack before budgeting

## Legal

- `90_source-documents/legal/NoDrftSystems_Legal_Contract_Framework.docx`
  Role: legal architecture overview
  Status: needs human decision
  Action: confirm legal review before operational use

- `90_source-documents/legal/NoDrftSystems_Addendum_2_Master_Service_Agreement.docx`
  Role: master services agreement
  Status: needs human decision
  Action: licensed counsel review required before sending externally

- `90_source-documents/legal/NoDrftSystems_Addendum_3_Statement_of_Work.docx`
  Role: statement of work template
  Status: needs human decision
  Action: keep in sync with pricing governance and contract framework

- `90_source-documents/legal/NoDrftSystems_Addendum_4_NDA_Template.docx`
  Role: NDA template
  Status: needs human decision
  Action: licensed counsel review required before sending externally

## Operations

- `90_source-documents/operations/NoDrftSystems_Client_Delivery_Workflow.docx`
  Role: end-to-end delivery workflow
  Status: active reference
  Action: use with the client workspace template, not as a standalone system

- `90_source-documents/operations/NoDrftSystems_SOP_Library.docx`
  Role: SOP set
  Status: active reference
  Action: port high-frequency SOPs to working formats over time

- `90_source-documents/operations/NoDrftSystems_Template_Library.docx`
  Role: template inventory
  Status: active reference
  Action: do not rely on stated storage locations inside this file without updating them

- `90_source-documents/operations/NoDrftSystems_QA_Release_Controls.docx`
  Role: QA and release controls
  Status: active reference
  Action: align with the live release-gate skill and sign-off roles

- `90_source-documents/operations/NoDrftSystems_KPI_Framework.docx`
  Role: KPI definitions
  Status: active reference
  Action: only operationalize metrics with live data sources

- `90_source-documents/operations/NoDrftSystems_Hiring_Specialist_Framework.docx`
  Role: specialist hiring and bench design
  Status: active reference
  Action: use after the client-delivery engine is running

- `90_source-documents/operations/NoDrftSystems_Addendum_5_Client_Evaluation_Scorecard.docx`
  Role: qualification scoring form
  Status: governed by canonical layer
  Action: incorporate into the live intake packet and decision record

- `90_source-documents/operations/NoDrftSystems_Addendum_6_Pre_Engagement_Questionnaire.docx`
  Role: pre-engagement questionnaire
  Status: governed by canonical layer
  Action: treat as source material for the live intake system

- `90_source-documents/operations/NoDrftSystems_Addendum_8_QA_Multi_Pass_Checklist.docx`
  Role: QA checklist
  Status: active reference
  Action: keep for release-gate design and future template porting

- `90_source-documents/operations/NoDrftSystems_Addendum_9_Completion_Report_Template.docx`
  Role: completion report template
  Status: active reference
  Action: port to working format before delivery volume increases

- `90_source-documents/operations/NoDrftSystems_Addendum_10_Release_Sign_Off_Form.docx`
  Role: release sign-off form
  Status: active reference
  Action: bind to the real sign-off workflow and chosen e-sign method

- `90_source-documents/operations/NoDrftSystems_Addendum_18_Human_Handoff_Protocol.docx`
  Role: human escalation and handoff rules
  Status: active reference
  Action: align with the live skill matrix and review system

- `90_source-documents/operations/NoDrftSystems_Client_Intake_Form.pdf`
  Role: export snapshot of intake
  Status: derived export
  Action: preserve only as reference; do not treat as operative intake surface

## AI Architecture

- `90_source-documents/ai-architecture/NoDrftSystems_Skills_Library_v1.md`
  Role: normalized role-behavior source for all 45 AI agents — primary objective, bounded scope, core duties, inputs, outputs, escalation triggers, confidence floors, and evidence requirements
  Status: active reference
  Action: use as the role-behavior source when generating department skill pack files; treat as authoritative for role content; note that the internal count summary (43 AI agents, 32 Tier 2) is incorrect — actual content contains 45 AI agents (37 Tier 2), which matches the approved registry
  Path: archived to repository from uncontrolled Downloads location on 2026-04-14

- `90_source-documents/ai-architecture/NoDrftSystems_AI_Agent_Architecture.docx`
  Role: early agent architecture baseline
  Status: reference only
  Action: use conceptually; current activation rules live in the canonical AI operating architecture

- `90_source-documents/ai-architecture/NoDrftSystems_Claude_Code_Execution_System.docx`
  Role: code execution model reference
  Status: active reference
  Action: align with the current tool stack before operational use

- `90_source-documents/ai-architecture/NoDrftSystems_Addendum_12_AI_Sovereignty_Protocol.docx`
  Role: AI use and sovereignty policy
  Status: active reference
  Action: preserve as policy input; do not expose publicly without review

- `90_source-documents/ai-architecture/NoDrftSystems_Addendum_14_AI_Architecture_Master.docx`
  Role: master AI architecture addendum
  Status: active reference
  Action: keep aligned with actual deployed roles, approved departments, and skills

- `90_source-documents/ai-architecture/NoDrftSystems_Addendum_15_Tier1_Supervisor_Prompts.docx`
  Role: raw prompt source for the supervisor layer
  Status: reference only
  Action: treat as source material, not as a live skill system

- `90_source-documents/ai-architecture/NoDrftSystems_Addendum_16_Tier2_Domain_Prompts.docx`
  Role: raw prompt source for domain agents
  Status: reference only
  Action: mine selectively when future skills are created

- `90_source-documents/ai-architecture/NoDrftSystems_Addendum_17_Tier3_Specialist_Prompts.docx`
  Role: raw prompt source for specialist agents
  Status: reference only
  Action: mine selectively; do not treat as deployment-ready

- `90_source-documents/ai-architecture/NoDrftSystems_Addendum_22_AI_Platform_Tool_Stack.docx`
  Role: AI and tool subscription planning
  Status: governed by canonical layer
  Action: use alongside the tool stack recommendation file, not by itself

## Brand and Web

- `90_source-documents/brand-web/NoDrftSystems_Brand_Identity_Framework.docx`
  Role: brand foundation
  Status: active reference
  Action: preserve for design and copy alignment

- `90_source-documents/brand-web/NoDrftSystems_Copy_System.docx`
  Role: messaging and copy framework
  Status: active reference
  Action: reuse for public-facing copy only after commercial terms are locked

- `90_source-documents/brand-web/NoDrftSystems_Website_Architecture.docx`
  Role: website architecture source
  Status: active reference
  Action: align it with pricing governance before publishing any pricing page

- `02_client-system/client-intake-form.html`
  Role: working intake surface and local packet generator
  Status: governed by canonical layer
  Action: use as the live intake artifact only with manual record storage or a connected operations database; it is not a repository-side system of record

## Research

- `90_source-documents/research/NoDrftSystems_Competitor_Analysis.docx`
  Role: competitor reference
  Status: reference only
  Action: refresh before using for positioning claims

## Reports and Derived Exports

- `90_source-documents/reports/NoDrftSystems_Operational_System_Report_v1.0.docx`
  Role: consolidated internal audit
  Status: derived export
  Action: keep as historical audit output; do not let it replace canonical governance

- `90_source-documents/reports/NoDrftSystems — Full System Audit Report.pdf`
  Role: PDF export of audit material
  Status: derived export
  Action: preserve only for sharing or archival reference

- `90_source-documents/reports/NoDrftSystems — Critical Deficiencies Register.pdf`
  Role: PDF export of deficiency register
  Status: derived export
  Action: preserve only for sharing or archival reference

## Assets

- `90_source-documents/assets/social-og.png`
  Role: social preview asset
  Status: active reference
  Action: use when the public web layer is rebuilt or published
