---
name: business-baseline-reconciliation
description: Use when company-level facts, strategy documents, or internal operating plans contain unresolved unknowns, source drift, or unverified claims that must be converted into controlled baseline records.
---

# Business Baseline Reconciliation

## Use When

- a business plan contains unverified company facts
- legal entity, finance, revenue, or pipeline claims need controlled status
- a company-level register needs updating after a governance review
- strategy documents disagree about current company truth

## Required Inputs

- current business plan or strategic document
- relevant canonical governance files
- latest decision log entries
- any human-supplied finance, legal, or operating evidence

## Workflow

1. Inventory every company-level claim and separate verified facts from analysis.
2. Mark any unsupported item as `Not verifiable with available data.`
3. Group each item by domain:
   - legal entity and structure
   - finance baseline
   - revenue and pipeline baseline
   - proof and public claims
   - pricing and routine-usage posture
4. Create or update the company baseline register with owner, evidence path, next decision, and status.
5. Route public-proof items to `public-proof-inventory-builder`.
6. Route structural product-surface gaps to `proprietary-surface-governance-reconciliation`.
7. Escalate all non-delegable company factual claims to the Founder before they are reused in strategy, public copy, or commercial materials.
8. Update downstream documents only after the controlling artifact exists.

## Outputs

- company baseline register update
- source-integrity findings
- unresolved-facts list
- required human-decision list
- downstream update notes for business plan or strategy docs

## Escalation Behavior

- Escalate immediately if legal entity specifics, live financial metrics, or live revenue claims are requested without source evidence.
- Escalate to `LCA` when legal structure or legal-adjacent language may be reused externally.
- Escalate to `QAS` if multiple company-control artifacts disagree.
- Escalate to the Founder for any item that would become a public or strategic company fact.

## Do Not Do

- do not invent financial, legal, or commercial facts
- do not reuse archived claims as current truth without verification
- do not treat absence of contradiction as evidence
- do not update public-facing materials before the baseline register is updated
