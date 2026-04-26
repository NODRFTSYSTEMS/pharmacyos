# NoDrftSystems Proprietary Skill
# Classification: Internal — Confidential
# Do NOT commit to client repositories
# Source: CLAUDE.md Section 5.2

## SKILL: idea_development

**Purpose:** Execute structured idea generation and concept development within a bounded Discovery Sprint.

**Trigger:** Client engagement is ambiguous, undefined, or early-stage; client has a concept but no defined deliverable; operator needs to assess feasibility before committing to a build.

**Mandatory:** The Discovery Sprint ($2,000 fee) is required before this skill produces any build-ready output. If the client has not completed a Discovery Sprint, this skill routes to intake — it does not build.

**Decision Rule:** If scope is ambiguous and the client has not completed a Discovery Sprint: route to `client_intake` skill. Do not generate build output. Do not produce design files, code, final copy, or pricing commitments beyond the Discovery fee.

**Pre-conditions:**
- Discovery Sprint fee confirmed and invoiced
- Client has completed the intake qualification process
- Engagement is confirmed as early-stage or ambiguous (known scope → use `scope_brief` instead)

**Step Sequence:**
1. Confirm Discovery Sprint fee is invoiced and payment terms are clear
2. Conduct structured problem exploration with the client:
   - What problem does the client believe they are solving?
   - Who experiences this problem, and what is the current workaround?
   - What does success look like in 6 and 12 months?
   - What constraints exist (budget, timeline, technical, regulatory)?
3. Validate the problem statement — do not accept the client's framing uncritically
4. Define the target user with specificity (role, context, motivation, friction point)
5. Develop the proposed solution concept with feasibility notes (technical feasibility, market fit, resource requirements)
6. Map the concept to the appropriate NoDrftSystems service tier (T1–T5)
7. Identify risk flags and unknowns explicitly
8. Issue a Go / No-Go recommendation with rationale
9. Produce the Discovery Sprint output document

**Output of This Skill (strictly limited to):**
- Problem statement (validated, not assumed)
- Target user definition
- Proposed solution concept with feasibility notes
- Scope recommendation (which NoDrftSystems tier applies)
- Risk flags and unknowns
- Go / No-Go recommendation

**What This Skill Does NOT Produce:**
- Design files or mockups
- Code of any kind
- Final copy or content
- Pricing commitments beyond the Discovery fee
- A signed SOW (that is the next step if the recommendation is Go)

**Discovery Credit Rule:**
The Discovery Sprint fee ($2,000) is credited toward the next engagement package if the client contracts within 30 days of the Discovery Sprint output delivery. This credit must be stated in the Discovery Sprint output document verbatim.

**Storage:** Discovery Sprint output → `[CLIENT-WORKSPACE]/02_discovery/discovery_sprint_[YYYY-MM-DD].md`

**QA Requirements:** Pass 2 (Content Review) applied to the Discovery Sprint output before delivery. All claims in the output must be based on the client session — no invented market data.

**Proprietary Protection:** The Discovery Sprint methodology, scoring approach, and tier recommendation logic are internal. Client receives the output document only.

**Escalation Conditions:**
- Go / No-Go is No-Go: produce the output with full rationale, deliver professionally, log to `01_intake/`, do not proceed to proposal
- Client pressures for build output during Discovery Sprint: maintain boundary, deliver only what this skill specifies
- Discovery reveals a regulated industry or unusual IP situation: escalate to Founder before issuing a Go recommendation
