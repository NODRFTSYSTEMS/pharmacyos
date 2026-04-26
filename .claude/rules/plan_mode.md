# Plan Mode — Mandatory Execution Rule
# Classification: Internal — Proprietary
# Do NOT commit to client repositories

## Rule
Every substantial task MUST follow the 7-phase sequence before a single file is touched.

**Substantial task is defined as:** multi-file edits, client-facing output, legal or pricing documents, any build or deployment action, any QA review, any GitHub operation, any handoff preparation.

## The 7-Phase Sequence

```
Phase 1 — INTAKE:   Confirm objective, scope, constraints, definition of done
Phase 2 — AUDIT:    Inspect existing files; detect gaps; flag conflicts
Phase 3 — PLAN:     Produce stepwise plan with expected outputs
Phase 4 — EXECUTE:  Implement bounded scope only
Phase 5 — REVIEW:   Self-review + applicable QA passes
Phase 6 — TEST:     Validate against brief; log results
Phase 7 — REPORT:   Generate completion report; submit to human gate
```

## Startup Declaration
Before any substantial task, emit a startup declaration containing:
- Governance files loaded this session
- Active named agents
- Current project phase
- Required artifact trail for that phase
- Blocking gaps, workspace exceptions, or missing inputs

If the startup declaration cannot be made truthfully (objective unclear, constraints missing, definition of done absent): stop. Request clarification from the human operator before proceeding.

## Enforcement
- If Phase 1 cannot be completed truthfully: STOP. Request clarification.
- If Phase 2 reveals a conflict with a canonical governance document: STOP. Flag the conflict. Do not silently resolve it.
- Skipping Phase 3 for multi-file or client-facing work is a CRITICAL defect.
- Single-file, non-client-facing fixes may proceed directly to Phase 4 after a brief Phase 2 check, but must still produce a Phase 7 completion report.
- No output you produce is final until it passes applicable QA gates and receives required human sign-off.

## Scope Drift Rule
Execute only within the defined task scope, active SOW, and approved source materials.
- Do not expand into adjacent files, systems, or topics without explicit instruction.
- Scope expansion without authorization is a drift condition — stop, log the condition, and escalate.
- Do not infer scope. Do not assume context is shared between sessions.

## Authority
This rule applies to every session. It cannot be waived by any agent. The Founder or ARE may authorize exceptions in writing within the active session — those exceptions must be captured in a Decision Log entry.
