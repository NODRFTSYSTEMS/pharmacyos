---
name: chatbot-scope-safety-design
description: Use when a client website build includes a chatbot, live chat widget, or conversational AI component. Define the bounded purpose, safety rails, data handling scope, human handoff conditions, and failure behavior before implementation begins. Does not implement the chatbot.
---

# Chatbot Scope & Safety Design

## Use When

- a client requests a chatbot, live chat widget, or conversational AI on their site
- a web build brief includes a chat interface or virtual assistant
- a chatbot is being added to an existing live site
- safety rails and scope limits need to be defined before a chatbot is configured or built

## Required Inputs

- client's primary use case for the chatbot (FAQ / lead capture / support triage / product selection / appointment booking)
- audience profile and trust posture
- data handling requirements: does the chatbot collect, log, or forward any user input? Does it process PII?
- escalation path: who or what does the bot hand off to when it cannot resolve the user's query?
- brand voice and tone rules
- platform context: which chatbot platform or widget is in scope (if already decided), or is platform selection part of this task?

## Workflow

1. Define the chatbot's bounded purpose — one clear statement of exactly what the bot does and what it explicitly refuses to handle. No ambiguity. Examples: "Answers FAQs about services and collects lead email. Does not quote prices, make booking commitments, or provide legal or medical advice."
2. Define the safety rails:
   - topic boundaries: what subjects trigger an out-of-scope response
   - prohibited response types: no pricing commitments, no legal claims, no support promises, no medical/financial advice
   - escalation trigger phrases: specific phrases or topics that immediately hand off to a human or contact form
3. Define the data handling scope:
   - what user inputs are logged or retained
   - what is forwarded to third-party systems (CRM, email, analytics)
   - whether any PII is in scope — if yes, flag for legal-compliance review before proceeding
4. Define the human handoff trigger:
   - exact conditions under which the bot stops responding and routes the user to a human, form, or phone number
   - what the bot says when it hands off
   - what happens if no human is available (async fallback)
5. Define the failure mode: what the bot shows when it is unavailable, returns a confidence-floor breach, or encounters an out-of-scope query. Never a blank screen or raw error.
6. Produce the integration brief: platform recommendation (if not yet decided), widget placement guidance, brand voice alignment notes, and pre-launch checklist.
7. If PII is in scope at any step: route to `legal-compliance` skill before the integration brief is finalized.

## Outputs

- chatbot purpose statement (bounded, one paragraph)
- safety rail specification (topic boundaries, prohibited responses, escalation triggers)
- data handling scope (what is logged, what is forwarded, PII flag if applicable)
- human handoff specification (conditions, handoff copy, async fallback)
- failure-mode specification
- integration brief (platform, placement, voice alignment, pre-launch checklist)
- privacy flag note (if PII is in scope)

## Escalation Behavior

- If any PII is in scope, stop the workflow at step 3 and load `legal-compliance` skill before the integration brief is produced. Do not advance to platform recommendation without legal review.
- If the chatbot is expected to make product or service claims, load `reviewer_plain_language` and `reviewer_public_proof` before the bot goes live. Do not approve launch without those reviews.
- If the safety rail specification reveals that the chatbot cannot be bounded safely for the stated use case (e.g., the use case inherently requires medical, legal, or financial advice), escalate to Founder before recommending implementation.
- If the platform recommended is not in the approved tool-stack, escalate to `TACA` and ARE before finalizing the platform recommendation.

## Do Not Do

- do not design a chatbot that makes pricing commitments, legal claims, booking guarantees, or support promises without explicit human review at each output
- do not recommend a chatbot platform without verifying it against `01_system/commercial/tool-stack-recommendations.md`
- do not finalize a chatbot integration brief without a defined human handoff path
- do not proceed to implementation if PII is in scope and legal-compliance has not run
- do not treat "the client wants AI on their site" as a sufficient brief — define purpose and safety rails first
