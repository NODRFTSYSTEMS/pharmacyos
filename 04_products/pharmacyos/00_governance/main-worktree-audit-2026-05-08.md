# Main Worktree Audit — Uncommitted Work Inventory
Classification: Internal — NoDrftSystems Proprietary
Date: 2026-05-08
Scope: This audit inventories uncommitted work in `NODRFTSYSTEMS MASTER\` (the main repo worktree) at the time the pharmacyos integration session ran. Cross-workspace by necessity — produced from the pharmacyos session because that session uncovered the parallel-work problem. Recommended action per file is best-effort based on memory cross-reference; final triage is Founder authority.
Origin session: claude/condescending-wu-b8aa1e
Triggering event: failed Phase 1 merge (cannot merge while main worktree has uncommitted parallel work)

---

## Summary

| Bucket | Modified | Untracked | Notes |
|---|---|---|---|
| 01_system/ai-governance/ | 0 | 5 docs | New v2 standards + audit findings |
| 01_system/registry/ | 2 | 0 | Document-registry + agent-registry deltas |
| 01_system/strategy/ | 1 | 3 docs | Operating blueprint update + new canonical docs |
| 03_agent-skills/ (root) | 1 | 0 | skill-loading-matrix |
| 03_agent-skills/chatgpt/ | 1 | 1 dir | Brief update + custom-gpt-knowledge |
| 03_agent-skills/kimi/ | 1 | 1 file | Brief update + bundle index |
| 03_agent-skills/claude-web/ | 0 | 1 file | MCP connection guide |
| 03_agent-skills/ (new skills) | 0 | 13 dirs | New skill folders, 1 SKILL.md each |
| 04_products/Bucket Head Bilingual Site/ | 11 | 2 | Content + UI updates + NotFoundPage + vercel.json |
| 04_products/nodrft-governance-mcp/ | 7 | 7 | v0.3 expansion (HTTP transport + 3 new tools + health endpoint) |
| 04_products/nodrft-web/ | 5 | 0 | Locale messages + capabilities + about + home updates |
| **Total** | **29 files** | **30 paths** | **+1119 / −299 lines** in modified files alone |

The pharmacyos files in main worktree (Phase 1 of cleanup) are already cleared as of this audit's creation — they are not represented above.

---

## Memory Cross-Reference

The MEMORY index loaded this session names recent parallel work that explains most of these uncommitted files:

- **Strategic Elevation Plan — Execution State** (memory): "All phases (12, 1, 2, 2.5, 3-7, 7.5) + 20-gap sprint COMPLETE."
- **Strategic Elevation Audit 2026-05-08** (memory): "Four-domain audit findings: 3 conflicts blocking, top-5 precision fixes, 14-doc canonical set proposed."
- **Tier B Execution 2026-05-08** (memory): "Q-0 through Q-7 executed (Q-5b queued); SSA + ECA + SPA + PGA + TMA activated; 5 new canonical docs + comms template skill + scheduled tasks live."
- **NoDrftSystems Website — Next.js Migration** (memory): "Phase 1 complete. Phase 2 is content migration."
- **Governance MCP Server** (memory): "v0.2.0 at 04_products/; 6 tools, 17 resources, 2 prompts; registered. NOTE: src/index.ts line 20 hardcodes 0.1.0 — drift vs package.json 0.2.0."
- **Active Client Roster** (memory): Bucket Head listed as confirmed active client.

Most uncommitted work cross-references to one of these memory entries. The work appears legitimate. The problem is **none of it has been committed**, so it sits in working-tree-only state across multiple worktrees.

---

## File-by-File Inventory

### 1. 01_system/ai-governance/ (5 untracked docs)

| File | Size | Likely origin | Recommended action |
|---|---|---|---|
| agent-definition-standard-v2.md | (n/a — text) | Strategic Elevation Plan output | **Commit** — referenced by memory as canonical v2 standard |
| skill-definition-standard-v2.md | (n/a) | Strategic Elevation Plan output | **Commit** — paired with agent v2 |
| cms-schema-reference.md | (n/a) | Strategic Elevation Plan / nodrft-web work | **Review then commit** — confirm it's the canonical CMS schema doc |
| csm-context-package-standards-2026-05-06.md | (n/a) | Tier B Execution Q-1 likely | **Commit** — dated, references CSM agent (active in registry) |
| pga-product-governance-audit-2026-05-06.md | (n/a) | Tier B Execution PGA activation | **Commit** — PGA is in agent registry per memory |

Action: stage `01_system/ai-governance/` as a group. Founder confirms first.

---

### 2. 01_system/registry/ (2 modified files)

| File | Diff | Likely origin | Recommended action |
|---|---|---|---|
| document-registry.md | +46 lines | Strategic Elevation registry updates | **Commit** — registry should reflect the new canonical docs added under 01_system/ai-governance/ and 01_system/strategy/ |
| final-approved-department-and-agent-registry.md | +39/-? | Tier B Execution agent additions (SSA, ECA, SPA, PGA, TMA per memory) | **Commit** — must be paired with the new agent definition files in 03_agent-skills/ |

Action: read both diffs to confirm they're additive and not destructive of prior entries.

---

### 3. 01_system/strategy/ (1 modified + 3 untracked)

| File | Status | Diff | Recommended action |
|---|---|---|---|
| nodrftsystems-operating-blueprint-and-business-plan-2026-04-19.md | M | +110/-? | **Review** — operating blueprint is canonical; large diff requires Founder review |
| editorial-content-review-2026-05-07.md | ?? | (new) | **Commit** — referenced editorial pass; supports content migration |
| fma-revenue-projection-framework-2026-05-06.md | ?? | (new) | **Commit** — Tier B FMA framework per memory |
| strategic-position-summary-2026-05-06.md | ?? | (new) | **Commit** — Tier B output per memory |

Action: stage all three new strategy docs together (they're a group). Operating blueprint diff needs Founder eyes.

---

### 4. 03_agent-skills/ (substantial)

| Path | Status | Notes |
|---|---|---|
| skill-loading-matrix.md | M (+226 lines) | Major expansion — likely added rows for 13 new skill folders below |
| chatgpt/chatgpt-master-brief.md | M (+61 lines) | Brief expanded |
| chatgpt/custom-gpt-knowledge/ | ?? | 3 files, 14 KB total — knowledge pack for custom GPT |
| kimi/kimi-master-brief.md | M (+118 lines) | Major brief update |
| kimi/kimi-bundle-index.md | ?? | New index file |
| claude-web/claude-web-mcp-connection.md | ?? | MCP connection doc |
| backup-disaster-recovery/ | ?? | 10 KB SKILL.md |
| cms-configuration/ | ?? | 17 KB SKILL.md |
| content-seo-integration/ | ?? | 12 KB SKILL.md |
| database-migration/ | ?? | 9 KB SKILL.md |
| domain-ssl-lifecycle/ | ?? | 9 KB SKILL.md |
| lead-magnet-production/ | ?? | 8 KB SKILL.md |
| marketing-campaign/ | ?? | 12 KB SKILL.md |
| monitoring-alerting/ | ?? | 10 KB SKILL.md |
| product-alignment-audit/ | ?? | 7 KB SKILL.md |
| prompt-quality-analysis/ | ?? | 18 KB SKILL.md |
| security-incident-response/ | ?? | 11 KB SKILL.md |
| support-ticket-triage/ | ?? | 8 KB SKILL.md |
| technical-currency-sweep/ | ?? | 6 KB SKILL.md |

13 new skill folders, ~136 KB total. These are substantial deliverables. Per memory, the Strategic Elevation Plan and Tier B Execution produced new skills + scheduled tasks — these likely correspond.

Recommended action:
1. **Read each new SKILL.md** to confirm they follow agent-definition-standard-v2.md (which is itself uncommitted in 01_system/ai-governance/)
2. **Commit as a group** alongside the v2 standard + skill-loading-matrix update + agent-registry update
3. The 13 are likely an integrated Tier B deliverable that should land in one commit

---

### 5. 04_products/Bucket Head Bilingual Site/ (11 modified + 2 untracked)

| File | Diff | Recommended action |
|---|---|---|
| app/.gitignore | +3 | **Commit** — additive |
| app/README.md | +5/-? | **Review** — README may have client-specific content; check for accidental disclosure |
| app/package-lock.json | +323/-? | **Commit** — dep updates |
| app/src/App.tsx | +15/-? | **Review** — likely route additions |
| app/src/components/NavigationHeader.tsx | +1 | **Commit** — single-line tweak |
| app/src/i18n/locales/en.json | +8/-? | **Commit** — i18n additions |
| app/src/i18n/locales/es.json | +8/-? | **Commit** — i18n additions, must match en.json keys |
| app/src/pages/ContactPage.tsx | +20/-? | **Review** |
| app/src/pages/GalleryPage.tsx | +7/-? | **Commit** |
| app/src/pages/ReviewsPage.tsx | +20/-? | **Review** — third-party content (reviews) needs accuracy check |
| app/vite.config.ts | +2 | **Commit** — minor |
| app/src/pages/NotFoundPage.tsx | ?? | **Commit** — adds 404 |
| app/vercel.json | ?? | **Review then commit** — Vercel config; check for env var references |

Bucket Head is its own product workspace — these changes belong to a separate session unrelated to PharmacyOS or strategic elevation. Probably safe to commit as a Bucket Head-specific commit. **Owner confirmation needed**: who was working on Bucket Head?

---

### 6. 04_products/nodrft-governance-mcp/ (7 modified + 7 untracked)

This expansion appears to be **v0.3** of the governance MCP server.

| File | Status | Diff/Size | Notes |
|---|---|---|---|
| package.json | M | +2 | Likely version bump 0.2.0 → 0.3.0 |
| src/index.ts | M | +13 | Memory notes "src/index.ts line 20 hardcodes 0.1.0" — this diff may fix that drift |
| src/config/canonical-sources.ts | M | +143 | Substantial canonical sources expansion |
| src/policy/artifact-types.ts | M | +3 | Minor |
| src/tools/generate-context-package.ts | M | +2 | Minor |
| src/tools/get-governance-context.ts | M | +43 | Tool expansion |
| src/tools/run-scope-drift-check.ts | M | +2 | Minor |
| plan-v0.3-cross-provider-governance-2026-05-06.md | ?? | (doc) | The plan for this expansion |
| src/health/ | ?? | 1 file, 1.5 KB | New health endpoint |
| src/http-transport.ts | ?? | (code) | NEW HTTP transport |
| src/index-http.ts | ?? | (code) | NEW HTTP entry point |
| src/tools/get-agent-definition.ts | ?? | (code) | New tool |
| src/tools/list-available-templates.ts | ?? | (code) | New tool |
| src/tools/validate-workflow-prerequisites.ts | ?? | (code) | New tool |

This is v0.3 work landing as one coherent product update. Per memory, v0.2.0 was registered. v0.3 expands to cross-provider governance + HTTP transport.

Recommended action: **single commit `feat(governance-mcp): v0.3 — HTTP transport + cross-provider tools`**. Includes plan doc + 7 modifications + 7 new files. Founder reviews before commit because this changes a registered MCP server.

---

### 7. 04_products/nodrft-web/ (5 modified)

| File | Diff | Notes |
|---|---|---|
| app/[locale]/about/page.tsx | +4 | Minor |
| app/[locale]/capabilities/page.tsx | +91 | Substantial — capabilities page expansion |
| app/[locale]/page.tsx | +33 | Home page changes |
| messages/en.json | +35/-? | i18n updates |
| messages/es.json | +35/-? | i18n updates, must match en.json |

Per memory, "NoDrftSystems Website — Next.js Migration: Phase 1 complete. Phase 2 is content migration." These changes look like content migration work — exactly Phase 2. Commit-safe pending Founder review of the capabilities page expansion.

---

## Recommended Commit Order

If everything passes Founder review, the cleanest commit sequence:

1. **`feat(ai-governance): v2 agent + skill standards + canonical docs`** — 01_system/ai-governance/ (5 docs) + paired registry updates in 01_system/registry/
2. **`feat(strategy): Tier B canonical docs (FMA, position summary, editorial review)`** — 01_system/strategy/ (3 new + 1 modified)
3. **`feat(agent-skills): 13 new skills + provider briefs + skill-loading-matrix`** — 03_agent-skills/* (13 new skill folders + chatgpt + kimi + claude-web updates)
4. **`feat(governance-mcp): v0.3 — HTTP transport + cross-provider tools`** — 04_products/nodrft-governance-mcp/ (14 files)
5. **`feat(nodrft-web): Phase 2 content migration — capabilities + home + locales`** — 04_products/nodrft-web/ (5 files)
6. **`feat(bucket-head): NotFoundPage, Vercel config, content updates`** — 04_products/Bucket Head Bilingual Site/ (13 files)

Six commits. Each is a coherent unit of work that survives review independently.

---

## Open Questions for Founder

1. **Who produced this work?** Memory entries reference Strategic Elevation, Tier B, and product migrations. Identifying the session(s) lets us preserve the original commit messages and authorship intent.
2. **Has this work been reviewed?** Memory says deliverables are "complete" but absence of git commits suggests they may not have passed final review.
3. **Are there OTHER worktrees with parallel uncommitted work?** Earlier `git worktree list` showed `infallible-lederberg` (same as main HEAD) and `bold-allen` (under 02_client-system/, on `bde3f1b`) — those have separate state I haven't audited.
4. **Authorship line for commits.** If multiple sessions/providers (Claude, ChatGPT, Kimi) produced this, the Co-Authored-By line should reflect that. Per memory the AI Provider Stack uses all four.
5. **Is the audit doc itself in scope?** This file lives in `04_products/pharmacyos/00_governance/` because it was produced from the pharmacyos session. If it should live elsewhere (e.g., `01_system/audit/`), that's a relocation decision.

---

## What This Audit Does Not Do

- **Read the diffs of modified files in detail.** I have line counts, not content. A file showing +91 lines might be additive content (safe) or substantive logic change (needs review). Per-file diff review is a separate pass.
- **Verify SKILL.md compliance.** The 13 new skill folders should follow `skill-definition-standard-v2.md` (itself uncommitted). Cross-validation pending.
- **Touch any file.** This is read-only. No commits, deletions, or merges executed.
- **Audit the pharmacyos files** — those were already cleared in this session's Phase 1 cleanup.
- **Audit the `bold-allen` or `infallible-lederberg` worktrees.** Separate scope.

---

## Recommended Next Step

**Founder reviews this inventory** and chooses one of:

A. **Commit per the recommended sequence** — I execute commits 1–6 from a context that can write outside `04_products/pharmacyos/`. This requires either: (a) running them from a fresh terminal, or (b) my session getting authorization to stage files outside pharmacyos for these commits specifically (one-time disclosure-gate exception with Decision Log entry).

B. **Per-file review first** — I produce diff content for the modified files (one tab per file) so each change can be reviewed before any staging.

C. **Defer entirely** — main worktree state stays as-is for now; pharmacyos branch continues independently. Risk: state drifts further before triage.

D. **Founder triages directly** — you pick which files to keep/discard from a fresh terminal; I stay scoped to pharmacyos work.

Recommend **A with one-time exception** — the work is per memory legitimate and time-cost of per-file review is high. Bound the exception to "stage the listed files in the listed commits, no other files, no deletions, Founder approval per commit batch."
