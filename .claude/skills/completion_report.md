# NoDrftSystems Proprietary Skill
# Classification: Internal — Confidential
# Do NOT commit to client repositories
# Source: CLAUDE.md Section 5.2

## SKILL: completion_report

**Purpose:** Generate a structured completion report at the end of every bounded task.

**Trigger:** Task complete, QA passes run, or human gate required.

**Pre-conditions:**
- Task execution is finished or blocked
- All applicable QA passes have been run (or explicitly deferred with reason logged)
- Any CRITICAL defects found during execution are documented

**Step Sequence:**
1. Confirm task ID or description for the report header
2. List every file created, modified, or deleted in this session
3. Enumerate all deficiencies found, classified as CRITICAL / IMPORTANT / ENHANCEMENT
4. Record which deficiencies were resolved in this session vs. remaining open
5. List every QA pass run with its result: PASS / FAIL / N/A
6. Document tests run and their outcomes
7. List all unresolved risks with rationale for why they could not be addressed
8. Identify specific decisions required from Founder or ARE before work can proceed
9. Issue a release recommendation: PROCEED or HOLD

**Output Format:**

```markdown
## COMPLETION REPORT
**Task ID:**         [ID or description]
**Date:**            [YYYY-MM-DD]
**Agent / Session:** [identifier]
**Status:**          DRAFT / IN REVIEW / APPROVED / RELEASED

### SUMMARY
[Brief description of what was accomplished]

### FILES / SECTIONS AFFECTED
[List of files created, modified, or deleted]

### DEFICIENCIES FOUND
- [CRITICAL] [description]
- [IMPORTANT] [description]
- [ENHANCEMENT] [description]

### DEFICIENCIES RESOLVED
[What was fixed in this session]

### QA PASSES RUN
[List passes completed with PASS / FAIL / N/A result]

### TESTS RUN
[Validation targets and results]

### UNRESOLVED RISKS
[Issues that could not be addressed — with rationale]

### REQUIRED HUMAN DECISIONS
[Specific decisions needed from Founder or ARE before proceeding]

### RELEASE RECOMMENDATION
[ ] PROCEED — all gates passed, human sign-off obtained
[ ] HOLD    — [reason]
```

**QA Requirements:** This skill itself does not require a QA pass. It produces the artifact that QA pass results are recorded in.

**Proprietary Protection:** Completion reports are internal governance documents. Do not include in client handoff packages unless the content was produced specifically for the client.

**Escalation Conditions:**
- If Status remains DRAFT after 48 hours without human review: escalate to HHC
- If CRITICAL defects cannot be resolved in the current session: set Status to IN REVIEW and route to Founder or ARE with the specific decisions needed listed in the report
