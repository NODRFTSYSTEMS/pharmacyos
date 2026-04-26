---
name: public-proof-inventory-builder
description: Use when NoDrftSystems needs a controlled inventory of public proof claims, source evidence, permission status, and approval state for websites, proposals, or other market-facing artifacts.
---

# Public Proof Inventory Builder

## Use When

- a website, proposal, or strategy document wants to use proof claims
- testimonials, logos, metrics, or before-and-after claims need approval status
- `reviewer_public_proof` needs a structured source ledger
- public proof is being blocked because no inventory exists

## Required Inputs

- candidate proof claims
- source evidence for each claim
- any permission or NDA constraints
- intended use surface
- existing proof inventory if one exists

## Workflow

1. Inventory each candidate proof item and classify its type.
2. Link the underlying evidence source and note whether the source is primary, derived, or missing.
3. Record permission status:
   - approved for public use
   - internal only
   - restricted or NDA-limited
   - unknown
4. Route each claim through `reviewer_public_proof`.
5. Record Founder approval status for the intended surface.
6. Add only approved items to the live inventory.
7. Mark every missing or unresolved item as blocked.
8. Produce a blocked-claims list for any downstream route, proposal, or content team.

## Outputs

- updated public proof inventory
- blocked-claims list
- approval-status ledger
- source-integrity notes
- route-safe proof summary

## Escalation Behavior

- Escalate when a claim lacks source evidence.
- Escalate when permission is unclear or limited by client confidentiality.
- Escalate to `QAS` if a public surface currently uses proof that is not inventory-approved.
- Escalate to the Founder before any NoDrftSystems market-facing proof item is treated as approved.

## Do Not Do

- do not approve proof because it sounds plausible
- do not treat screenshots, memory, or prior drafts as sufficient evidence by default
- do not publish blocked or partially verified proof
- do not hide permission uncertainty
