# NoDrftSystems Proprietary Skill
# Classification: Internal — Confidential
# Do NOT commit to client repositories
# Source: Authored from CLAUDE.md Section 5.1 + governance architecture

## SKILL: decision_log

**Purpose:** Capture every decision that requires or received Founder or ARE authorization in a structured, auditable format.

**Trigger:** Any instruction containing a decision that must be logged, any Founder override of a governance rule, any CRITICAL defect resolution that deviates from standard protocol, any pricing exception, scope change, or tool approval.

**Pre-conditions:**
- The decision being logged must be attributable to a named authority (Founder or ARE)
- The action affected by the decision must be clearly identified
- This log entry must be created BEFORE the authorized action is taken (not after)

**Step Sequence:**
1. Assign a Decision ID using format: `[YYYY-MM-DD-NNN]` (NNN = sequential number for the day)
2. Classify the decision type from the approved list
3. State the decision in one clear, unambiguous sentence
4. Name the authority who made the decision
5. Record the rationale provided
6. List all documents or systems affected
7. Assess reversibility
8. Define any required follow-up actions with owners
9. Save the entry to the correct storage location

**Output Format:**

```markdown
## DECISION LOG ENTRY

**Decision ID:**        [YYYY-MM-DD-NNN]
**Date:**               [YYYY-MM-DD]
**Session:**            [identifier]
**Decision Type:**      PRICING EXCEPTION | SCOPE CHANGE | LEGAL APPROVAL |
                        AGENT OVERRIDE | TOOL APPROVAL | DISCLOSURE GATE EXCEPTION |
                        STOP RESOLUTION | OTHER
**Decision:**           [What was decided, in one clear sentence]
**Decided By:**         Founder | ARE | [name and role]
**Rationale:**          [Why this decision was made]
**Documents Affected:** [list all files, templates, or systems impacted]
**Reversible:**         YES | NO | CONDITIONAL — [conditions]
**Follow-up Required:** [specific next action, owner, and deadline if applicable]
**Logged By:**          [agent ID or session identifier]
```

**Storage Rules:**
- Client-specific decisions: log to `[CLIENT-WORKSPACE]/00_admin/decision-log.md`
- System-level decisions: log to `01_system/operations/decision-log.md`
- Create the file if it does not exist; append to existing file if it does

**QA Requirements:** Decision logs are governance artifacts — they do not undergo QA passes, but they are reviewed during Release Gate 6 (Human) to confirm sign-off is on record.

**Proprietary Protection:** Decision logs are internal governance documents. Never include in client handoff packages or commit to any repository.

**Escalation Conditions:**
- If a decision cannot be attributed to Founder or ARE on record: do not proceed — stop and escalate to HHC
- If the decision involves a STOP-level deficiency: the log entry is required before any further execution on the affected workflow
