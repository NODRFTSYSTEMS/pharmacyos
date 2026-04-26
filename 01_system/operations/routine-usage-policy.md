# Routine Usage Policy

**Classification:** Internal — Confidential — Proprietary  
**Status:** Draft — Founder confirmation required before operative for billing  
**Created:** 2026-04-19  
**Owner:** Founder  

> **STOP:** Pricing figures in this document are placeholders. This policy is not operative for client billing until the Founder confirms the included-run quota and per-run overage rate. All other policy rules (what counts as a routine, which agents can run routinely, escalation rules) are operative immediately.

---

## What a Routine Is

A **routine** is a recurring, scheduled, or triggered agent execution that:
- operates against a previously defined target (a live site, a client workspace, an active retainer)
- does not require a new task brief or scope decision from a human operator
- produces a bounded, predictable output (health check, status report, utilization pull, drift detection)
- does not change scope, make commercial commitments, or produce client-facing content without human review

Routines are **not** project work (which requires a SOW) and **not** ad hoc requests (which require a fresh task assignment). They are the recurring operational layer that keeps live engagements healthy without requiring a full task session for each check.

---

## Included Routine Runs

### Standard allocation
- Maintenance retainer clients: **[FOUNDER DECISION REQUIRED]** routine runs included per rolling 24-hour window
- Each "run" = one bounded agent activation against one defined target
- Example runs: QADM drift check on a live site, PSA weekly status pull, RMA utilization update, CHSA health score recalculation, STAA SEO signal check

### What counts as one run
- One agent, one defined target, one bounded output
- A PSA status pull is one run
- A QADM drift check across 3 pages is one run (the agent is one activation)
- Chaining multiple agents in a single session (e.g., PSA → CCA → Growth Lead draft) counts as one routine sequence if it produces one output

---

## Extra Usage

- Clients who enable Extra Usage in their SOW are charged per run above the included daily quota
- Per-run overage rate: **[FOUNDER DECISION REQUIRED]** per run
- Extra Usage must be explicitly enabled in the SOW — it is not auto-enabled
- Clients without Extra Usage enabled must be notified before overage runs are executed

### Overage tracking
- `ARCA` (Accounts Receivable & Collections Agent) tracks extra-usage charges per billing cycle
- ARCA produces an overage report at the end of each billing cycle
- Overage charges are included in the next invoice cycle
- All overage billing is subject to Founder review before invoicing (via `IGA`)

---

## Which Agents Can Run as Routines

Agents approved for routine (scheduled or triggered) execution without a fresh human task brief:

| Agent | Routine Task Type | Requires Human Review Before Output? |
| --- | --- | --- |
| QADM | Drift detection on live site or codebase | No — produces report; escalates only if critical drift found |
| PSA | Project status summary | No — produces status packet; human reviews before client send |
| RMA | Retainer utilization pull | No — produces report; escalates at 80% and 100% thresholds |
| CHSA | Client health score recalculation | No — produces score; escalates if below threshold |
| ARCA | AR aging and overdue invoice check | No — produces report; escalates overdue invoices per collections policy |
| ECFA | Cash flow and expense summary | No — produces summary for Founder review |
| BCA | Brand drift check on published content | No — produces flag list; does not modify content |
| STAA | SEO signal check on live site | No — produces audit note; does not modify pages |
| FRA | Financial reporting pull | No — produces report for Founder review |

---

## Which Agents Cannot Run as Routines (Require Human Approval)

The following agents may NOT be activated on a routine basis without a new human task brief and explicit human approval. Triggering these agents on a schedule without human initiation is a governance violation:

| Agent | Reason |
| --- | --- |
| MOA | Orchestration decisions require human-defined task scope |
| SCA | Security review outputs carry severity classifications that require human judgment |
| PMA | Scope decomposition and planning require a confirmed scope document |
| PEA | Proposals require Founder approval before send |
| CDA | Contract drafting requires Founder and legal review for every output |
| SEA, FIS, BLS, IDS | Implementation work requires an approved build packet |
| CCA | Client communications require Growth Lead review before send |
| IGA | Invoice generation requires milestone confirmation and Founder review |

---

## Escalation Rules

- If a routine agent finds a CRITICAL issue (e.g., QADM detects a regression, SCA finds a vulnerability in a monitoring scan): stop the routine, escalate through `HHC` to ARE and Founder immediately. Do not suppress critical findings to complete the routine cycle.
- If the included run quota is exhausted and Extra Usage is not enabled: pause routine execution and notify Growth Lead and Founder via `HHC`. Do not continue runs without authorization.
- If the pricing for routine usage needs to change: escalate to Founder. No pricing change takes effect without a Founder decision and a pricing-governance update.
- If a new agent type is proposed for routine execution: escalate to ARE + Founder for approval. Do not add agents to the routine-approved list without governance sign-off.

---

## Integration with Client Success Operating Protocol

Routine runs are the operational backbone of the `client-success-operating-protocol` skill. The weekly and monthly cadences defined in that skill are implemented through routine agent activations against client workspaces. The routine-usage-policy governs the quota, billing, and escalation rules. The client-success-operating-protocol governs the sequence and output expectations.
