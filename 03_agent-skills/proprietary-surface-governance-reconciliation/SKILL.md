---
name: proprietary-surface-governance-reconciliation
description: Use when a NoDrftSystems proprietary product surface exists in 04_products but lacks a clean paired workspace, control-plane record, registry coverage, or release-governance trail.
---

# Proprietary Surface Governance Reconciliation

## Use When

- a proprietary product exists in `04_products/` without a paired `02_client-system/` workspace
- control-plane and registry records disagree about a product surface
- a public commercial route is active but governance records are incomplete
- a legacy product folder needs a controlled naming exception

## Required Inputs

- product folder path in `04_products/`
- current review or release documents for that product
- existing workspace records, if any
- repository control-plane and document registry
- Founder authorization or decision-log reference

## Workflow

1. Confirm the proprietary surface exists and identify its current product purpose.
2. Check whether a paired `02_client-system/` workspace exists and whether it is control-layer clean.
3. Create or update the workspace control artifacts:
   - control sheet
   - proprietary build declaration
   - strategy brief
   - agent routing note
   - execution plan
4. Update the repository control plane so the `04_products/` and `02_client-system/` pairing is explicit.
5. Update the document registry so the new workspace and product records are discoverable.
6. Record any legacy naming exception instead of silently renaming a live product folder.
7. Route remaining release blockers into the workspace execution plan.

## Outputs

- paired proprietary workspace records
- control-plane reconciliation
- document-registry updates
- naming-exception note when required
- release-blocker tracking plan

## Escalation Behavior

- Escalate if ownership of the product surface is unclear.
- Escalate if two workspaces appear to govern the same product.
- Escalate to `LCA` when live legal surfaces are part of the product.
- Escalate to the Founder before activating, deactivating, or materially repositioning a proprietary public-commercial route.

## Do Not Do

- do not invent a product scope that the product folder does not support
- do not rename a live product folder without an explicit decision
- do not leave the workspace/control-plane/registry relationship implied
- do not treat release blockers as closed unless evidence shows they are closed
