<!--
Status: active reference
Date: 2026-04-19
Owner: Founder, QDA, QAS
Purpose: single approval ledger for all NoDrftSystems public proof claims, evidence references, and public-use permissions.
-->

# Public Proof Inventory

## Objective

Maintain one controlled inventory of proof items that may appear on public routes, proposals, pitch materials, or other market-facing surfaces.

## Verified Facts

- `reviewer_public_proof` is the required independent control for statistics, client results, market claims, and other proof-like assertions.
- Before this file was created, no clean control-layer proof inventory existed for NoDrftSystems.
- A proof item is not approved for public use unless it is logged here with a clear approval state.

## Analysis

- Possessing evidence is not the same as approving it for public use.
- Public proof requires both source integrity and permission integrity.
- The safest default is block-first: if an item is missing, partial, disputed, or approval is unclear, it remains blocked.

## Approval Standard

Every candidate proof item must record:

- the claim itself
- source evidence location
- whether the claim is quantitative, testimonial, logo-based, qualitative, or before/after
- whether third-party permission or NDA constraints apply
- `reviewer_public_proof` status
- Founder approval status for the intended use surface

## Public-Use Rule

If a proof item is not listed here as approved for the intended surface, it is not approved for public use.

## Current Inventory

| Proof item | Proof type | Source evidence | Permission status | Reviewer status | Founder approval | Public-use status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No approved proof items recorded as of 2026-04-19 | None | None linked | Not applicable | Not run | Not granted | Blocked | Populate through `public-proof-inventory-builder` before using any performance metric, testimonial, client logo, or before/after claim |

## Allowed Without Inventory Approval

The following may still be used when independently verified through their own governing sources:

- package names and prices from pricing governance
- process descriptions that do not assert outcomes
- company-description language that does not claim quantified results, named client outcomes, or competitive superiority

## Blocked Until Approved

- quantitative outcome claims
- named client results
- testimonials
- client logos
- before-and-after claims
- market-comparison claims presented as proof

## Conclusion

The proof inventory is now the public-use gate. Its current state is intentionally restrictive because no proof entries have been approved yet.
