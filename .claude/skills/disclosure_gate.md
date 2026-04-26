# NoDrftSystems Proprietary Skill
# Classification: Internal — Confidential
# Do NOT commit to client repositories
# Source: CLAUDE.md Section 5.2

## SKILL: disclosure_gate

**Purpose:** Sweep all files designated for GitHub push, client handover, or external delivery to confirm no proprietary NoDrftSystems assets are present.

**Trigger:** Any GitHub commit, repository transfer, or handoff package assembly.

**Pre-conditions:**
- Verify that `.gitignore` contains `.claude/` and `CLAUDE.md` entries BEFORE any commit begins
- If either entry is missing: CRITICAL — fix `.gitignore` first, then re-run this sweep

**Step Sequence:**
1. Identify all files staged for commit or included in the handoff package
2. Work through the full sweep checklist — every item must be checked
3. If any item fails: STOP immediately. Resolve the issue. Re-run the full sweep from item 1.
4. Do not proceed until all items pass
5. Log the completed sweep to the designated output path

**Sweep Checklist — All Items Must Pass:**
```
[ ] No files from .claude/agents/ present in commit or package
[ ] No files from .claude/skills/ present in commit or package
[ ] No files from .claude/rules/ present in commit or package
[ ] No CLAUDE.md present in commit or package
[ ] No internal SOPs, cost data, or margin documents present
[ ] No agent system prompts or orchestration logic present
[ ] No other client data or records present (system isolation check)
[ ] No API keys, credentials, or .env files present
[ ] .gitignore configured to exclude all .claude/ directory contents
[ ] Client-facing deliverables only (per SOW) in handoff package
[ ] SBOM (Software Bill of Materials) generated and included
[ ] Access transfer log completed in client workspace 06_handoff/
[ ] Founder approval for transfer on file
```

**Output:**
- For client handoffs: save the completed sweep log to `[CLIENT-WORKSPACE]/06_handoff/disclosure_gate_log_[YYYY-MM-DD].md`
- For repository operations: log to session completion report

**QA Requirements:** The disclosure gate sweep IS a QA gate — Release Gate 4 (Disclosure). It must pass before any external transfer.

**Proprietary Protection:** This skill itself must never appear in a client repository or handoff package.

**Escalation Conditions:**
- If any sweep item fails and cannot be resolved in the current session: HOLD the transfer, log the failure as CRITICAL, escalate to Founder before any file is transferred
- If `.gitignore` is missing the required entries and the repository has a connected remote: treat as an active disclosure risk, fix immediately before any other work continues
