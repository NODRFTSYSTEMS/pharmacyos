# NoDrftSystems Proprietary Skill
# Classification: Internal â€” Confidential
# Do NOT commit to client repositories
# Source: CLAUDE.md Section 5.2

## SKILL: web_build

**Purpose:** Execute website build tasks across all NoDrftSystems service tiers with correct scope boundaries enforced.

**Trigger:** Web build task assigned with signed SOW on file.

**Pre-conditions:**
- Signed SOW on file in client workspace `01_intake/` â€” no build begins without it
- Client has delivered all required inputs: content copy, brand assets (colors, fonts, tone), and existing logo files if the client has an existing brand identity (logo design is included in all build tiers for new brands)
- Timeline clock starts ONLY from the date client inputs are received in full
- Package tier confirmed against operative pricing governance
- For T4 and T5: Discovery Sprint completion required â€” do not proceed without it

**Tier Enforcement:**

| Tier | Package | Pages | CMS | Key Constraints |
|------|---------|-------|-----|----------------|
| T0 | Discovery Sprint | N/A | N/A | Scope brief only â€” no build output |
| T1 | Conversion Landing Page Sprint | 1 | No | 8 sections max; 1 CTA form; client supplies all copy |
| T1S | Static Business Site | 5 | No | Brochure-style site only; no CMS, blog, or app logic |
| T2 | Business Launch Site | 5 | Yes | Client supplies all content before build starts |
| T3 | Authority Website | 15 | Advanced | 3 form types; blog; GA4; WCAG 2.1 AA mandatory |
| T4 | Platform Starter | App | N/A | Discovery Sprint required first; 3 integrations max |
| T5 | Ecosystem Build | Multi | N/A | Discovery Sprint + Architecture review required |

**Step Sequence:**
1. Confirm signed SOW, tier, and that all client inputs are on file
2. Load the `scope_brief` skill output and confirm all acceptance criteria are clear
3. Set up the build environment per the standard tech stack:
   - Frontend: Vercel (confirm account ownership: client-owned vs. NoDrftSystems-managed)
   - Database (if applicable): Supabase
   - Repository: GitHub (confirm repo ownership structure before creation)
4. Execute build within the confirmed tier boundaries only
5. On completion: run `npm audit` â€” no high/critical vulnerabilities proceed to QA
6. Generate SBOM (Software Bill of Materials) and log to `[WORKSPACE]/05_QA/`
7. Submit for all applicable QA passes (see below)
8. T3+: load `reviewer_accessibility` for Pass 6 â€” mandatory
9. Founder approval required before any live deployment or launch

**Hard Constraints for Every Tier:**
- Copywriting is NOT included unless explicitly scoped and priced as an add-on
- Timeline clock does not start until client delivers content and brand assets â€” confirm receipt in writing (logo design and domain acquisition are included; if client has an existing logo, confirm delivery of logo files)
- Pricing display rule: No package prices appear on any public-facing surface. Only hourly and advisory rates are public. See pricing-governance.md Public Pricing Display Rule (effective 2026-04-25)
- Every build requires: QA Passes 1â€“5 + Pass 6 (T2+) + Accessibility audit + Founder approval before launch
- Post-launch bug fixes are covered per the SOW support window only â€” new features require a separate SOW
- Hosting and maintenance are separate retainers â€” never bundle into build pricing

**Infrastructure Ownership Rule:**
Confirm before any repository or hosting account is created:
- Will the client own the Vercel/GitHub accounts, or will NoDrftSystems manage them?
- This affects the access transfer protocol at project close

**QA Requirements:**
- Pass 1 (Functional): mandatory
- Pass 4 (Technical QA + npm audit): mandatory
- Pass 5 (Client Requirements vs. SOW): mandatory
- Pass 6 (Accessibility): mandatory T2+; `reviewer_accessibility` agent must be loaded
- Disclosure Gate sweep: mandatory before any repository is shared with client

**Proprietary Protection:** Build methodology, QA protocols, and infrastructure patterns are internal. Client receives deployed product and access credentials only.

**Escalation Conditions:**
- Client requests features outside tier boundaries: stop, document as a change order request, price separately, require signed change order before proceeding
- Any high or critical CVE found in `npm audit`: resolve before QA â€” do not proceed to Pass 4 with open CVEs
- Client-owned infrastructure cannot be confirmed before build start: escalate to Founder before creating any accounts
