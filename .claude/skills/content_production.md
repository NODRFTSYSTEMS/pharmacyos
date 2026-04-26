# NoDrftSystems Proprietary Skill
# Classification: Internal — Confidential
# Do NOT commit to client repositories
# Source: CLAUDE.md Section 5.2

## SKILL: content_production

**Purpose:** Produce, review, and deliver content assets (copy, SEO articles, social content, email sequences) within defined brand and quality parameters.

**Trigger:** Content deliverable assigned with approved brief and client brand guidelines on file.

**Pre-production Checklist (ALL items must be confirmed before a single line of copy is written):**
- [ ] Brand voice and tone definition received and on file in client workspace
- [ ] Target audience defined (demographics, pain points, decision context)
- [ ] Primary keyword or topic confirmed (for SEO content)
- [ ] Content type and format specified (blog post / landing page copy / email / social / other)
- [ ] Word count or length target set
- [ ] Client-specific terminology glossary available (or noted as N/A)
- [ ] Approved brief signed off by operator before production begins

If any item above is not confirmed: stop. Request the missing input. Do not produce speculative copy.

**Step Sequence:**
1. Confirm all pre-production checklist items are met
2. Retrieve brand voice definition and terminology glossary from client workspace
3. Review any existing content on the topic from the client workspace to ensure consistency
4. Produce the content draft against the confirmed brief
5. Self-review against brand voice and the pre-production checklist
6. Flag any data point, statistic, or claim that requires a source with `[REQUIRED: source citation]`
7. Flag any placeholder with `[REQUIRED: ___]`
8. Submit for QA Pass 2 (Content and Copy Review) — do not deliver without it
9. If bilingual: load `reviewer_localization` for Pass 5B after Pass 2 clears

**Production Rules:**
- Do not fabricate statistics, quotes, or named examples. If proof is unavailable, flag the gap and present the claim as pending verification.
- Do not use placeholder text in final deliverables. Every `[REQUIRED: ___]` must be logged in the completion report.
- Bilingual content requires transcreation, not translation. Load the `reviewer_localization` agent for all bilingual work.
- Every content deliverable requires QA Pass 2 (Content and Copy Review) before delivery.
- Retainer content follows identical QA protocol as project content. Volume does not reduce standards.

**Content Type Guidelines:**

*SEO Articles:*
- Primary keyword used naturally in title, first paragraph, and 2–3 subheadings
- No keyword stuffing — readability takes priority
- Internal linking recommendations flagged for operator review
- Meta description draft included with each article

*Email Sequences:*
- Subject line variants (minimum 2) included with each email
- Plain-text version produced alongside HTML version
- Unsubscribe and compliance language verified per CAN-SPAM / CASL

*Social Content:*
- Platform-specific length and format rules applied
- Visual asset requirements listed even if assets are client-supplied
- Hashtag strategy derived from brief — no generic hashtag lists

**QA Requirements:**
- Pass 2 (Content and Copy Review): mandatory
- Pass 5B (Bilingual Parity): mandatory if bilingual
- Reviewer agents to load: `reviewer_plain_language`, `reviewer_public_proof`

**Proprietary Protection:** Content production workflows and quality protocols are internal. Client receives final content deliverables only.

**Escalation Conditions:**
- Brief is absent or ambiguous: do not begin — escalate to operator to supply or clarify brief
- Client requests content making legal, medical, or financial claims: Founder review before production
- Any retainer month where the approved brief has not been confirmed for the cycle: pause and request confirmation before producing new content
