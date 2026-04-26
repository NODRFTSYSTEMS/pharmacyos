# NoDrftSystems Proprietary Skill
# Classification: Internal — Confidential
# Do NOT commit to client repositories
# Source: CLAUDE.md Section 5.2

## SKILL: client_intake

**Purpose:** Execute the complete client intake sequence from inquiry receipt to qualification decision.

**Trigger:** New inquiry received via any channel.

**Pre-conditions:**
- Confirm this is an external client inquiry (not a NoDrftSystems proprietary build — if so, load `idea_development`, `web_build`, or the appropriate build skill instead)
- Confirm inquiry source and channel for the intake log

**Step Sequence:**
1. **Categorize inquiry:** Project / General / Partnership / Unclear
2. For project inquiries: route to the Start an Engagement sequence
3. Run the Client Evaluation Scorecard against these five criteria:
   - Budget alignment (does stated budget match any service tier?)
   - Scope clarity (is the deliverable clearly definable?)
   - Decision-making authority (is the decision-maker on the inquiry?)
   - Timeline realism (does the stated timeline match the tier delivery window?)
   - Capacity fit (does NoDrftSystems have current capacity?)
4. Score against the evaluation bands:
   - 85–100: Proposal-ready — proceed to Discovery Sprint scheduling
   - 70–84: Discovery Sprint required before proposal
   - 50–69: Gaps must close before proceeding — identify and communicate gaps
   - 0–49: Decline or escalate to Founder review
5. If score passes threshold: proceed to Discovery Sprint scheduling
6. If score fails: generate a professional decline. Do not proceed to a proposal.
7. Log all intake records to the client workspace `01_intake/` folder

**Mandatory Routing Rules:**
- Unclear scope → Discovery Sprint (never build without a defined scope)
- 3+ decision-makers or approval layers → flag as high-friction engagement; escalate to Founder before proceeding
- Regulated industries (healthcare, legal, financial) → Founder review before engagement confirmed
- Budget below the minimum tier price → decline or redirect to a lower-commitment entry point

**Output Required:**
- `inquiry_log.md` — channel, contact, summary, date received
- `evaluation_scorecard.md` — scores against each criterion, total, routing decision
- Routing decision communicated to operator

**QA Requirements:** Intake outputs are reviewed at Gate 6 (Human) before any proposal or engagement confirmation is sent to the client.

**Proprietary Protection:** Do not include scoring logic, threshold bands, or evaluation criteria in any client-facing communication. The client receives only a routing outcome (proceed / Discovery Sprint required / decline), not the scoring methodology.

**Escalation Conditions:**
- Score band 0–49 regardless of operator preference: escalate to Founder before any response is sent
- Any inquiry involving IP licensing, white-label use, or resale of NoDrftSystems systems: immediate Founder escalation
- Any inquiry where stated budget is above $50,000: Founder review before Discovery Sprint is confirmed
