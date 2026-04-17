---
document: PEO Open Items Tracker
status: Active governance
version: 1.0
date: 2026-04-16
owner: PMA + Founder (nodrftsystems)
authority: Mandatory Build Activation Protocol — open item register
confidentiality: Proprietary internal — no external publishing approved
---

# PEO Open Items Tracker
## Standing Register of Unresolved Vendor and Process Selections

This document tracks the remaining open items that block specific PEO build phases. No agent may silently assume or invent values for these items. Escalation to PMA + Founder is required before proceeding past the identified blocking gates.

---

## Open Items Register

| ID | Item | Status | Blocking Gate | Selection Criteria | Known Candidates | Next Action | Owner |
|----|------|--------|---------------|--------------------|------------------|-------------|-------|
| O-002 | Final legal text (T&C, privacy policy, consumer disclosures) | **Open** | Phase 2 public release | Licensed counsel with US real-estate / PropTech experience; bilingual review capability preferred | — | Founder to engage counsel; target: draft ready before Phase 2 completion | Founder |
| O-003 | Professional translation vendor / review process | **Open** | Any UI release | Native US Spanish financial/real-estate specialization; ability to review legal and formula disclosure phrasing | — | Founder to confirm vendor or internal reviewer; target: before first bilingual UI ships | Founder |
| O-005 | Upload malware scanning vendor / capability | **Open** | Phase 3 (can stub initially) | API-first; signed URL compatible (Cloudflare R2); SOC 2 or equivalent | Cloudflare Stream (pending), VirusTotal (enterprise), ClamAV (self-hosted) | Evaluate API compatibility and cost; implement stub with replacement plan documented | ARE + Founder |

---

## Closed Items (for reference)

| ID | Item | Closed Date | Closure Document |
|----|------|-------------|------------------|
| O-001 | Auth provider / SSO / MFA vendor | 2026-04-16 | `tech-stack.md` — Clerk confirmed |
| O-004 | Tech stack declaration | 2026-04-16 | `tech-stack.md` |
| O-006 | Pricing / tier amounts | 2026-04-16 | `pricing-declaration.md` |
| O-TBD-DataAPI | Property data API provider (county assessor, comp source, geocoding) | 2026-04-16 | Rentcast confirmed by Founder — see integration notes below |

### Rentcast Integration Notes

**Provider:** Rentcast  
**Confirmed by:** Founder (nodrftsystems) — 2026-04-16  
**Covers:** Property facts (Layer A), comparable sales (Layer B), AVM/valuation estimates (Layer C)

| Concern | Detail |
|---------|--------|
| Auth | API key via `X-Api-Key` header — store as `RENTCAST_API_KEY` in Vercel environment variables; never hardcoded |
| Key endpoints | `/properties` (fact lookup by address), `/properties/{id}/comps` (comp records), `/avm/value` (valuation estimate) |
| Field mapping | Rentcast field names must be mapped to PEO canonical fields per `PEO_Field_Level_Source_Hierarchy_Matrix.docx` before use in triage |
| PII rule | Address passed to Rentcast API server-side only — never in client-side events or logs |
| Rate limits | Confirm plan tier limits before Phase 3 triage goes to production volume |
| Implementation file | `peo-app/src/lib/property-data/rentcast.ts` — replaces `stub.ts` import in `submit/route.ts` and `triage/run/route.ts` |

---

## Escalation Rule

If any agent encounters one of these open items during implementation, the build must:

1. **Stop** at the relevant surface (do not invent or stub without documented fallback plan)
2. **Escalate** to PMA + Founder
3. **Document** the block in the current phase's evidence ledger
4. **Resume** only after explicit written direction

Stubs are permitted **only** when:
- The fallback behavior is explicitly documented
- The stub boundary is marked with a TODO referencing the open item ID
- The stub does not expose fake data, legal text, or unverified translations to users

---

*Open Items Tracker version 1.0 — 2026-04-16*
*Authority: `01_system/ai-governance/mandatory-build-activation-protocol-2026-04-15.md`*
