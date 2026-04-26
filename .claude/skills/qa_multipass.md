# NoDrftSystems Proprietary Skill
# Classification: Internal — Confidential
# Do NOT commit to client repositories
# Source: CLAUDE.md Section 5.2

## SKILL: qa_multipass

**Purpose:** Execute the NoDrftSystems Multi-Pass QA framework on any deliverable before release.

**Trigger:** Any agent declares a task complete OR Founder/ARE requests QA status.

**Pre-conditions:**
- Identify which passes apply to this deliverable type before beginning:
  - Pass 5B (Bilingual Parity) applies only if the deliverable includes Spanish content
  - Pass 6 (Accessibility) is mandatory for all web builds T2 and above
  - Pass 3 (Visual) applies only when design mockups exist as a reference
- Store all pass results in the project `05_QA/` folder of the active workspace

**Pass Sequence:**

| Pass | Focus | Owner Agent | Block if Failed? |
|------|-------|-------------|-----------------|
| Pass 1 | Functional verification — all features implemented, logic correct | SEA / QDA | YES |
| Pass 2 | Content and copy — accuracy, brand voice, no placeholders | QDA / CEA | YES |
| Pass 3 | Visual and design — fidelity to mockups, responsive, typography | DAA | YES |
| Pass 4 | Technical QA — code quality, no console errors, security, performance | SCA / SEA | YES |
| Pass 5 | Client requirements — all SOW deliverables present, acceptance criteria met | QAS | YES |
| Pass 5B | Bilingual parity — EN/ES meaning, tone, and CTA strength match | BPA | YES (if bilingual) |
| Pass 6 | Accessibility — WCAG 2.1 AA, headings, labels, forms, keyboard nav | AAA | YES |

**Release Gate Sequence (all six must pass before production):**
```
Gate 1 → STRATEGIC:    Output matches SOW scope. No drift.
Gate 2 → FACTUAL:      All claims verified or labeled. No invented data.
Gate 3 → OPERATIONAL:  Output is immediately usable. No missing fields or files.
Gate 4 → DISCLOSURE:   No proprietary internals exposed. NDA safe.
Gate 5 → CONSISTENCY:  Terminology, logic, and hierarchy coherent throughout.
Gate 6 → HUMAN:        ARE and/or Founder sign-off on file.
```

**Defect Classification:**

| Class | Impact | Release Decision |
|-------|--------|-----------------|
| CRITICAL | Blocks release | HOLD — do not proceed |
| IMPORTANT | Must fix this cycle | HOLD until resolved |
| ENHANCEMENT | Deferred | Proceed; log for next iteration |

**Step Sequence:**
1. Confirm which passes apply to the active deliverable
2. Execute each applicable pass in order; do not skip passes
3. For each pass: run the review, classify all defects found, record result (PASS / FAIL / N/A)
4. Any FAIL on a blocking pass: stop, resolve the defect, re-run that pass
5. After all passes complete: run the 6-gate release sequence
6. Any gate failure: HOLD release
7. Gate 6 requires human confirmation — document who approved and when
8. Store all pass and gate results in `[WORKSPACE]/05_QA/qa_report_[YYYY-MM-DD].md`

**QA Requirements:** This skill is itself a QA execution framework — no meta-QA pass required.

**Proprietary Protection:** QA reports are internal governance documents. Do not include in client handoff packages unless specifically scoped as a deliverable.

**Escalation Conditions:**
- Any CRITICAL defect that cannot be resolved in the current session: HOLD, log, escalate to ARE
- Gate 6 (Human) cannot be completed without explicit Founder or ARE confirmation — never self-approve a Gate 6 pass
