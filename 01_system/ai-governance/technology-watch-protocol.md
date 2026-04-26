# Technology Watch Protocol
# Classification: Internal — Proprietary
# Version: 1.0 | 2026-04-24

## Purpose

Ensure NoDrftSystems stays current with relevant developments in AI models, frameworks, platforms, and tools — before deficiencies in tech currency become operational blockers or quality risks. This protocol is proactive intelligence, not reactive emergency response.

## Ownership

**Primary agents:** TSA (Kareem) + TACA (Khadija) — joint execution
**Output routes to:** ARE → Founder
**Cadence:** Monthly sweep (first week of each month, or triggered manually by ARE or Founder)
**Decision authority:** ARE approves tool evaluations and minor stack updates. Founder approves any new tool adoption, subscription commitment, or stack replacement.

---

## Monthly Sweep Scope

TSA and TACA run the following five coverage areas every sweep:

### 1. AI Model & Provider Updates
- New model releases or capability upgrades from: Anthropic (Claude), OpenAI (GPT), Google (Gemini), Moonshot AI (Kimi), Mistral, Deepseek, and any emerging providers
- Changes to API pricing, rate limits, or deprecation notices
- New model capabilities relevant to NoDrftSystems task types (code generation, long-context, multilingual, reasoning)
- Flag any model that meaningfully exceeds current production-tier models on tasks NoDrftSystems executes regularly

### 2. Framework & Dependency Currency
- Check current versions of all active framework dependencies in live projects (Next.js, React, Prisma, Supabase client, Vercel SDK, etc.)
- Flag any dependency that is >2 major versions behind latest stable
- Flag any dependency with an active CVE at severity High or Critical
- Cross-reference with `npm audit` expectations from engineering standards policy

### 3. Platform & Tooling Changes
- Vercel, Supabase, GitHub: changelog review for breaking changes, new features relevant to active builds, pricing changes
- DocuSign, Airtable, Google Workspace: policy or pricing changes that affect operations
- Anthropic Claude API: new features (prompt caching, extended context, tool use updates), pricing changes, model retirement notices

### 4. Security Advisories
- OWASP Top 10 updates
- CVEs relevant to the active technology stack
- Notable security incidents in tools used by NoDrftSystems or its clients (especially hosting, auth, and database providers)

### 5. AI Governance & Regulatory Developments
- New AI regulations, compliance requirements, or industry standards relevant to the jurisdictions NoDrftSystems serves
- Changes to AI provider terms of service that affect data handling, output ownership, or usage restrictions
- Notable developments in AI agent architecture, prompt governance, or multi-agent orchestration patterns

---

## Output: tech-currency-report.md

Every sweep produces a `tech-currency-report.md` filed to `01_system/ai-governance/tech-currency-reports/[YYYY-MM-DD]-report.md`.

### Required Report Structure

```
# Technology Watch Report
Date: [YYYY-MM-DD]
Agents: TSA (Kareem) + TACA (Khadija)
Status: PENDING ARE REVIEW

---

## 1. AI Model & Provider Updates
[Findings or NOTHING TO FLAG]

## 2. Framework & Dependency Currency
[Findings or NOTHING TO FLAG]

## 3. Platform & Tooling Changes
[Findings or NOTHING TO FLAG]

## 4. Security Advisories
[Findings or NOTHING TO FLAG]

## 5. AI Governance & Regulatory Developments
[Findings or NOTHING TO FLAG]

---

## Action Items

| Priority | Item | Recommended Action | Decision Needed From |
|----------|------|--------------------|----------------------|
| HIGH | [item] | [action] | ARE / Founder |

---

## Items Requiring Founder Decision
[List any adoption, subscription, or stack replacement decisions]

---

ARE Review:  [ ] APPROVED  [ ] HOLD — reason: ___
Founder Review (if required):  [ ] APPROVED  [ ] HOLD
```

---

## Trigger Conditions (Ad Hoc Sweep)

Run a targeted sweep outside the monthly cadence when:
- A new build is being scoped that depends on a framework or tool not recently evaluated
- A security incident is reported in a tool in the active stack
- Anthropic, OpenAI, or another primary provider announces a major model update or deprecation
- ARE or Founder requests a targeted evaluation of a specific tool or capability
- A client project requires a technology the team has not recently used

---

## Decision Rules

| Finding Type | Action |
|-------------|--------|
| CVE at High/Critical in active stack | Flag to ARE immediately. Do not proceed with build work on affected component until patched or mitigated. |
| Dependency >2 major versions behind | Add to next build's system-maintenance pre-check. Not a blocker unless CVE is also present. |
| New AI model with material capability advantage | Evaluate on one non-client task before recommending. Document results. Founder approves adoption. |
| Platform pricing change affecting operations | Route to ECFA (Janelle) for cash flow impact assessment. Founder approves contract changes. |
| Regulatory development | Route to LCA (Dorothy) for compliance review. |
| New tool recommendation | Produce a one-page evaluation note: problem solved, cost, alternative considered, integration effort. Founder approves. |

---

## What This Protocol Does Not Cover

- Competitive intelligence (client market or industry monitoring) — that is TSA's separate intelligence function
- Product roadmap decisions — those go through the standard Discovery Sprint and strategy brief process
- Emergency incident response — that is SCA's domain; this protocol is proactive, not reactive
