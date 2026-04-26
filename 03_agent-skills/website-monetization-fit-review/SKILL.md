---
name: website-monetization-fit-review
description: Use when a client website has an audience and needs a structured review of which monetization models fit the site type, audience profile, and brand posture. Produces a ranked recommendation for inclusion in the strategy brief. Does not commit NoDrftSystems to implementation without a signed SOW.
---

# Website Monetization Fit Review

## Use When

- a client asks how to generate revenue from their website
- a strategy brief is being assembled and monetization is a topic
- a client site has consistent traffic but no revenue path defined
- a client requests strategic alignment on affiliate or sponsorship options

## Required Inputs

- website type and tier (T1 landing page / T2 launch site / T3 authority / T4+ platform)
- audience profile: size, demographics, intent signals (content consumption vs. service intent)
- content model: blog / service pages / tools / media / e-commerce
- client revenue model and brand posture (premium / service-oriented / media / community)
- pricing governance reference (to flag if implementation scope would require a SOW addendum)

## Workflow

1. Classify the website's monetization fit profile: content-led, service-led, tool-led, or media-led. One primary classification only.
2. Identify the applicable monetization models for that profile:
   - **content-led**: affiliate links, sponsored content, email capture → nurture sequence, gated premium content
   - **service-led**: lead-gen CTAs, consultation booking, upsell path from organic to paid service
   - **tool-led**: freemium gating, embedded product upsell, API access tiers
   - **media-led**: display advertising, sponsorship, membership / subscription
3. Flag any model that conflicts with the client's brand posture or audience trust (e.g., low-quality affiliate programs on a premium brand site).
4. Flag any model that requires PII collection — route to legal-compliance skill before implementation scoping.
5. Rank the top 2–3 options by: audience fit, implementation complexity, and revenue realism for the site's current stage.
6. Note the scope boundary: what NoDrftSystems can build (integration, landing pages, forms, CTAs, tracking) vs. what is client-managed (affiliate network accounts, ad accounts, sponsorship negotiation).
7. Produce the monetization fit summary for inclusion in the strategy brief.

## Outputs

- monetization fit profile classification
- ranked monetization model recommendations (top 2–3) with rationale
- scope boundary note (NoDrftSystems build scope vs. client-managed)
- scope exclusions (what requires a separate SOW addendum if the client wants to proceed)
- privacy flag if PII collection is required by any recommended model

## Escalation Behavior

- If monetization implementation scope would require a new SOW or SOW addendum, stop and escalate to `pricing-safety-review` before including implementation scope in any proposal.
- If a recommended model requires affiliate or sponsorship agreements, route the contract component to `CDA` and escalate to Founder before any external commitment is made.
- If a recommended model requires PII collection, load `legal-compliance` skill before advancing implementation scope.
- If the client's brand posture conflicts with all viable monetization models for their site type, flag the conflict and escalate to Founder before recommending any model.

## Do Not Do

- do not promise affiliate or advertising revenue figures — these are client-managed outcomes
- do not recommend models that require PII collection without a privacy review
- do not scope implementation of a monetization model without a signed SOW addendum
- do not recommend affiliate programs, ad networks, or sponsor platforms by name without verifying they are appropriate for the client's audience and brand
- do not conflate NoDrftSystems' service delivery scope with the client's ongoing revenue operations
