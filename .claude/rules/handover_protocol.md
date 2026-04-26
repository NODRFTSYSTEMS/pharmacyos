# Handover Protocol — Mandatory Project Close-Out Rule
# Classification: Internal — Proprietary
# Do NOT commit to client repositories

## Rule
Every project close-out, client handover, or repository transfer must follow this gate sequence in order. No gate may be skipped.

## Gate Sequence (Must Complete in Order)

```
Gate 1 — QA SIGN-OFF
         All applicable QA passes completed and recorded in 05_QA/
         Gate 6 (Human) pass on file with Founder or ARE confirmation

Gate 2 — LEGAL REVIEW
         Legal review logged to 06_legal-review/ for any contract, IP,
         formation, or regulatory element in the deliverable
         Legal review completion confirmed before transfer

Gate 3 — DISCLOSURE GATE SWEEP
         Full sweep per disclosure_gate skill — all 13 items must pass
         Sweep log saved to 06_handoff/

Gate 4 — ACCESS TRANSFER LOG
         All credentials and account access documented in 06_handoff/access_log.md
         Transfer instructions prepared for each system (Vercel, GitHub, Supabase,
         domain registrar, etc.)

Gate 5 — FOUNDER APPROVAL
         Founder explicitly confirms handover is approved
         Approval logged in Decision Log with date and scope of transfer

Gate 6 — HANDOFF PACKAGE ASSEMBLED
         Only permitted items assembled (see below)
         Package staged in 06_handoff/ and reviewed before sharing
```

## Handoff Package — Permitted Items Only
Include ONLY the following:
- Client-facing deliverables per the signed SOW acceptance criteria
- SBOM (Software Bill of Materials) for any code deliverable
- Access transfer log (credentials and account handover instructions)
- Post-launch support terms (per SOW)
- Archive note (summary of project scope, dates, and known issues)

## Handoff Package — Prohibited Items (Must Never Appear)
These items must never be present in a client handoff package or public repository:
- Any `.claude/` directory content (agents, skills, rules)
- `CLAUDE.md` or any root operating contract
- Internal SOPs, cost data, or margin documents
- Agent system prompts or orchestration logic
- Any other client's records or workspace data
- NoDrftSystems pricing architecture documents
- Internal scoring criteria or evaluation methodologies

## Access Revocation
After the client confirms receipt of the access transfer:
1. Revoke NoDrftSystems access to all client-owned systems
2. Log the revocation date and confirming party in `06_handoff/access_log.md`
3. Update the document registry entry for this workspace to status: ARCHIVED

## Archive Requirement
After handover is complete:
1. Update the workspace to show all folders as archived
2. Move the workspace to archival state in the document registry
3. No further work may be conducted in the workspace without a new SOW

## Escalation
- If Founder approval cannot be obtained before a transfer deadline: escalate to HHC — do not transfer without approval on record. No deadline justifies skipping Gate 5.
- If any gate fails during close-out: HOLD the transfer, log the failure as CRITICAL, resolve before any files are shared.
