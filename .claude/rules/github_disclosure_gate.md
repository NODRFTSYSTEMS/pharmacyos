# GitHub Disclosure Gate — Pre-Commit Rule
# Classification: Internal — Proprietary
# Do NOT commit to client repositories

## Rule
Before ANY `git add`, `git commit`, or `git push` operation in this repository: run the disclosure gate sweep. This is not optional. This is not skippable for "small" commits.

## Pre-Commit Checklist
Run every item before proceeding:

```
[ ] .gitignore contains `.claude/` entry
    Verify: git check-ignore -v .claude/settings.local.json
[ ] .gitignore contains `CLAUDE.md` entry
    Verify: git check-ignore -v CLAUDE.md
[ ] No files from .claude/agents/ are staged
[ ] No files from .claude/skills/ are staged
[ ] No files from .claude/rules/ are staged
[ ] No CLAUDE.md is staged
[ ] No internal SOPs, cost data, or margin documents are staged
[ ] No agent system prompts or orchestration logic are staged
[ ] No client workspace data is staged (intake records, contracts, discovery notes)
[ ] No API keys, credentials, or .env files are staged
[ ] No files from 01_system/commercial/ are staged
[ ] No files from 02_client-system/[CLIENT-WORKSPACE]/ are staged
```

## If Any Item Fails
STOP. Do not proceed with the commit.
1. Identify what failed and why
2. Resolve the issue (remove the file from staging, fix `.gitignore`, etc.)
3. Re-run the full checklist from the beginning after resolution
4. Log the incident in the session completion report as a CRITICAL defect that was caught and resolved before transmission

## For Client-Facing or Production Commits
Save the completed sweep log to the relevant client workspace `06_handoff/` folder before any file is transferred.

## Untracking Files That Were Already Committed
If a proprietary file was previously committed to the repository:
1. Add the entry to `.gitignore` immediately
2. Run `git rm --cached [filepath]` to untrack (the file remains on disk)
3. Commit the `.gitignore` update and the untrack operation together
4. Log this as a CRITICAL defect resolution in the Decision Log

## Authority
This rule cannot be waived by any agent. Only the Founder can authorize an exception, and the exception must be documented in a Decision Log entry BEFORE the commit proceeds. There are no emergency exceptions to this rule.
