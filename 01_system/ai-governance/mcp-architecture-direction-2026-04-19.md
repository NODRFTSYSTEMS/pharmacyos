# MCP Architecture Direction

**Classification:** Internal — Confidential — Proprietary  
**Status:** Architecture decision — operative immediately for integration planning  
**Created:** 2026-04-19  
**Owner:** Founder + ARE  
**Authority:** Founder direction; ARE scope review required before any MCP server is production-deployed

---

## Core Decision

**MCP (Model Context Protocol) is designated as the integration standard for all new external tool, service, and data source connections added to the NoDrftSystems operating stack.**

The operating principle: **strong LLMs (Claude) run the intelligence; MCP servers run the integrations.**

This means:
- Agent intelligence, reasoning, and decision-making stay in Claude (via skill packs, role charters, and governed prompts)
- External tool access, data retrieval, and service integrations route through MCP servers
- No direct API integration to external services is added without first evaluating whether an MCP server provides cleaner governance and auditability

---

## Current MCP Integrations (Already Active)

These MCP integrations are live in the current operating environment:

| MCP Server | Surface | Primary Agents |
| --- | --- | --- |
| Figma MCP | Design-to-code context, component references, visual direction | VDA, DAA, FIS |
| Gmail MCP | Email as a surface for outreach and client communications | OOA, CCA |
| Google Calendar MCP | Scheduling, meeting prep, deadline tracking | DCPA, COA |

---

## Phase 1 — Near-Term MCP Additions

These are the highest-leverage next integrations. Add in priority order, subject to TACA review and ARE approval for each.

| Integration | Purpose | Primary Agents Served | Priority |
| --- | --- | --- | --- |
| GitHub MCP | Repository context loading, CODEOWNERS enforcement, PR review, pattern inventory | RCA, SEA, TVA, DRA | 1 — highest |
| Linear MCP (or equivalent) | Task tracking, milestone visibility, blocker logging | PSA, PMA, MOA | 2 |
| Supabase MCP | Database schema access, migration review, data integrity | DSS, SEA, BLS | 3 |
| Notion MCP (or equivalent) | Knowledge base access for knowledge-integrity-sweep and KDGA governance | KDGA, CSM | 4 |

**Why GitHub MCP first:** RCA's core task (repository context loading) is currently done through direct file reads. A GitHub MCP server provides cleaner pattern inventory, PR context, and CODEOWNERS enforcement at the integration level — reducing the manual context-loading overhead in every governed build.

---

## Phase 2 — Persistent Memory Layer (Jarvis Direction)

A memory MCP server enables session-to-session knowledge continuity beyond what CSM's canonical document assembly currently provides.

### What it is
A governed persistent retrieval layer. It stores outputs from sessions that should survive beyond a single conversation: client decisions, approved facts, prior build evidence, design patterns, recurring agent recommendations.

### What it is NOT
This is not autonomous learning, fine-tuning, or behavior modification. The memory MCP server is a governed retrieval index, not a learning system.

### Authority hierarchy (non-negotiable)
1. Canonical governance documents (`01_system/`) — highest authority
2. CSM-assembled context packages (current document state) — second authority
3. Memory MCP server entries (prior session outputs) — supplementary retrieval only

When a memory MCP entry conflicts with a canonical document, the canonical document wins. The conflicting memory entry must be flagged for update or deletion.

### Staleness rules
- Memory MCP entries are automatically flagged for re-verification after 30 days
- When a source document is updated, all memory entries derived from that document are flagged
- Flagged entries are not deleted — they are surfaced at the start of a relevant session for human confirmation

### Scope of what gets stored
| Store | Do Not Store |
| --- | --- |
| Client decisions and approvals | Speculative recommendations |
| Approved facts with source citations | Unverified claims |
| Build evidence and test results | Draft outputs superseded by later versions |
| Recurring patterns and conventions confirmed by ARE | Implied or inferred conventions |

### Activation gate
Phase 2 does not activate until:
- Founder and ARE jointly approve the memory MCP server design
- A specific memory MCP server (e.g., hosted vector database or Claude's native memory tooling) is evaluated, approved, and added to the canonical tool inventory via TACA
- Staleness and conflict-resolution rules are implemented in the server before any production use

---

## Governance Rules for All MCP Additions

These rules apply to every MCP server, Phase 1 or Phase 2:

1. Every new MCP server must be listed in the canonical tool inventory (`build-control-assets/05-canonical-tool-inventory-template.md` instance for the relevant workspace or system).
2. `TACA` (Tooling Access Control Agent) reviews all new MCP server addition requests before activation.
3. No MCP server that processes client PII may be added without a privacy review via `legal-compliance` skill and Founder approval.
4. ARE approval is required before any MCP server change is production-deployed.
5. MCP server credentials and access tokens are managed per the standard credential governance rules — no secrets in code, all in the approved secrets management layer.
6. If an MCP server becomes unavailable, agents that depend on it must fall back to their pre-MCP operating mode (direct file reads, manual tool calls) — no agent may halt entirely because an MCP server is down.

---

## Implications for Existing Agent Skills

No existing agent skill needs to be rewritten to adopt MCP. The skills govern what agents do, not how tools are accessed. When an MCP server is added, the relevant skill's Required Inputs section gains a note that the input is now available via MCP — but the skill logic itself does not change.

Example: When GitHub MCP is added, `03_agent-skills/department-skill-pack/delivery-build/rca-repository-context-assistant/SKILL.md` gains a note under Required Inputs: "Repository access: available via GitHub MCP server when active." The workflow steps remain unchanged.
