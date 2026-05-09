# PharmacyOS — Final Sweep & Review (Scaffold Milestone)
Classification: Internal — NoDrftSystems Proprietary
Date: 2026-05-08
Framework: NoDrftSystems General Final Sweep & Review Prompt
Reviewer: Claude (acting under NoDrftSystems multi-agent review structure)
Trigger: Founder feedback — "we need to elevate the design. too basic."

---

## Required Input Fields

| Field | Value |
|---|---|
| Project Name | PharmacyOS |
| Project Type | Web application (single-page, authenticated, internal pharmacy operations) |
| Client / Internal | NoDrftSystems proprietary product (Winchester Global Pharmacy is first licensed deployment per DL-001) |
| Current Link / File / Build | `04_products/pharmacyos/app/` — branch `claude/condescending-wu-b8aa1e`, HEAD `6f4155b`. Not deployed. |
| Primary Business Objective | Replace PharmPartner legacy system; provide Class 3 daily operating system for Winchester pharmacy staff |
| Target Audience | 5 internal staff roles — Pharmacist, Pharmacy Tech, Front Desk/Cashier, Manager, Admin (~12 concurrent users) |
| Primary User Action | Daily pharmacy operations — receive stock, dispense prescriptions, run POS, manage patients (varies by role) |
| Approved Scope | 43 routes, P0 features per BAP; English-only; 1024px+ tablet/desktop |
| Current Project Status | **Scaffold milestone** — design tokens populated, router + layouts + auth guards in place; no business logic, no Supabase wire-up, no real screens |
| Known Constraints | Free Supabase tier (single env); MSA amendment + new SOW pending; Anthropic + Lynk creds pending; JDPA compliance review not started |
| Review Purpose | Identify why current build feels "too basic" and define the elevation work required to move from scaffold to design-handoff fidelity |

---

## 1. Review Controller

**Review Frame:** Final sweep applied to a deliberately-scaffolded build. The framework is designed for near-launch review; PharmacyOS is at the scaffold milestone. Many launch-readiness criteria are intentionally unmet. The review must distinguish "missing because skeleton" from "missing because oversight."

**Project Type:** Class 3 web app (data-sensitive, regulated, AI-integrated) with Class 4 surfaces at auth, JDPA, financial.

**Objective:** Internal operations platform. Not a marketing surface — therefore many UX heuristics tuned for public/conversion contexts (above-the-fold attention, scroll depth, CTA rhythm) apply weakly or not at all. Heuristics that apply strongly: clarity, scannability, density, role-aware navigation, trust posture.

**Audience:** Pharmacy staff. Daily users. UX bar is "fluent professional tool," not "delight a first-time visitor."

**Primary Action:** Varies by role — different roles have different default landing intent. Dashboard composition must vary by role per design handoff line 603.

**Scope Reviewed:** Code in `04_products/pharmacyos/app/src/`, design handoff Sections 1–8, ADR Decisions 1–12.

**Scope Excluded:** Supabase backend (not yet wired), schema migrations (DSS plan unreviewed by SCA), Edge Functions (not yet authored), governance docs (decision log + briefs reviewed in prior turn).

**Missing Inputs:** Live browser test of the current build was attempted in-harness but blocked by PowerShell stdout buffering on Vite dev. Visual assertions below are based on code reading, not pixel-level inspection.

---

## 2. Critical Issues & Launch Risk

| # | Issue | Severity | Location | Evidence | Impact | Recommended Fix | Launch Blocker |
|---|---|---|---|---|---|---|---|
| C1 | Sidebar implementation does not match handoff Section 4.1 | IMPORTANT | `AdminPortalLayout.tsx` | Code uses default border-l Tailwind utility for active state; handoff specifies "3px left border `--color-primary`" with proper bg-sidebar-hover. Logo zone is unstyled text rather than a distinct 64px block. User account zone (handoff: bottom, sticky, 64px tall, top border `rgba(255,255,255,0.08)`, avatar + name + role + logout) is **absent**. | Sidebar reads as a generic skeleton, not the specified clinical operations chrome | Refactor sidebar to handoff spec: distinct logo zone, user account zone, proper active indicator | No (scaffold) |
| C2 | Page header (handoff Section 3.1) is **not implemented** | IMPORTANT | None — missing component | Handoff: "Page header: 80px tall, `--color-bg-surface`, bottom border. Title left, breadcrumb beneath title (12px secondary), primary CTA right-aligned." Current Placeholder uses inline `<h1>` with no header chrome. | Every admin route lacks visual hierarchy — no breadcrumb, no consistent CTA placement, no surface separation between header and content | Build `<PageHeader>` component; wrap all admin routes | No (scaffold) |
| C3 | Auth screens are placeholder text only | IMPORTANT | `router.tsx` `/login`, `/login/2fa` | Both routes render `<Placeholder title="Sign in" />`. Handoff Section 4.13 specifies real form components (email + password, 6-digit 2FA boxed input). | Login is the user's first impression — empty placeholder undercuts trust posture even before auth wires up | Implement Login form UI per Section 4.13 (form fields per 4.7, primary button per 4.8) — UI only, real auth still TODO | No (scaffold) |
| C4 | Typography hierarchy from Section 2.2 is **not applied** beyond font family | IMPORTANT | `globals.css`, all components | Handoff defines `--type-page-title`, `--type-section`, `--type-card-title`, `--type-body`, `--type-body-sm`, `--type-label`, `--type-caption`, mono variants. Tokens are not declared in globals.css and not used in components. | Visual hierarchy collapses to "default Tailwind text sizing" — everything reads at similar weight. Direct contributor to "too basic" | Declare type tokens in globals.css and use them via component primitives | No (scaffold) |
| C5 | No Button component exists | IMPORTANT | None | Handoff Section 4.8 specifies primary/secondary/tertiary/destructive variants with 32/40/48/56 height tiers. No reusable Button. | Without a Button component, every screen will reinvent button styling — guaranteed visual drift | Build `<Button>` per Section 4.8 with variant + size props | No (scaffold) |
| C6 | No Form Field components exist | IMPORTANT | None | Handoff Section 4.7 specifies Input, MonoInput, Select, Autocomplete, Checkbox, Radio, Textarea with focus rings and required-asterisk patterns. None implemented. | Login + Patient + Inventory forms are blocked or will diverge | Build `<Input>`, `<Label>`, `<MonoInput>` minimally; defer Select/Autocomplete to feature work | No (scaffold) |
| C7 | Live HTTP smoke test not completed | OBSERVATION | n/a | PowerShell stdout buffering in harness prevented in-session browser-level verification of dev server response | Build passes typecheck + production bundle, but no rendering proof | User runs `npm run dev` in their terminal | No |

---

## 3. Alignment Drift / Strategic Gaps

| Finding | Type | Evidence | Why It Matters | Correction | Priority |
|---|---|---|---|---|---|
| Build is **architecturally aligned** with ADR but **visually under-aligned** with design handoff | Underbuilding | Layouts present but use placeholder styling; design tokens partly populated; handoff component library not implemented | Architectural alignment alone does not produce a credible product surface | Visual elevation slice (this turn) | High |
| Design handoff was authored 2026-05-07 expecting "Claude Design (Figma MCP) — automated Figma frame & component generation" | Process gap | Handoff line 7 explicitly names Figma MCP as the audience | If Figma frames were generated, they were not used as the build reference. The code build is going off the markdown spec, not visual designs. | Either generate the Figma frames (separate process) or treat the handoff markdown as the canonical visual spec and execute against it line-by-line. Recommend the latter. | High |
| React 19 used vs. ADR's React 18 specification | Stack drift | Vite scaffold default; documented in evidence ledger | Forward-compatible; no functional issue | None — already documented | Low |
| Placeholder copy mentions "build phase" — is that a user-facing concept? | Minor scope drift | `Placeholder.tsx`: "Real implementation lands during the build phase" | "Build phase" is internal NoDrftSystems language, not user language. Unlikely to ship to users but worth scrubbing | Replace with "This screen is not yet implemented" or remove copy entirely once real screens land | Low |

---

## 4. UX Optimization Findings

| Finding | Affected Area | User Impact | Recommended Improvement | Expected Benefit | Priority |
|---|---|---|---|---|---|
| First impression: arrival at `/` redirects to `/dashboard` which renders "Dashboard" in a flat page with no header | First impression / hierarchy | Trained pharmacy staff will read this as a broken or pre-release screen | Implement PageHeader + dashboard grid skeleton (4 metric placeholders) so the arrival screen reads as "operational" | Confidence cue — "the system is working, my data is loading" rather than "is this even built" | High |
| Sidebar nav is technically present but visually flat | Navigation | Active route distinguished only by Tailwind defaults; nav groups not visually grouped beyond gap | Apply Section 4.1 styling: nav group label uppercase 11px secondary; active item bg-sidebar-hover + 3px primary left border + white text | Trained users orient by spatial pattern; clear active state reduces "did my click register" friction | High |
| No user account zone in sidebar | Navigation / trust | Users cannot see who they are logged in as, what role they hold, or where to log out | Add bottom-sticky user zone per Section 4.1 (avatar + name + role badge + logout) | Daily-tool legibility; required for shift-shared workstations | High |
| All 43 routes render the same Placeholder copy | Decision friction | Power user navigates between screens, sees identical content, loses orientation | Each placeholder shows the route name (already done) — improve the surrounding visual treatment so empty state is clear and graceful | Reduces "is this broken or just empty" moment | Medium |
| No breadcrumb on detail screens | Wayfinding | Sub-routes like `/inventory/catalog/:id` give no spatial context | Implement `<Breadcrumb>` per Section 4.17 in PageHeader | Standard pattern for nested data tables | Medium |

---

## 5. High-Level Feature & Enhancement Recommendations

| Recommended Addition | Strategic Purpose | User Benefit | Business Benefit | Complexity | Risk | Phase |
|---|---|---|---|---|---|---|
| Initialize shadcn/ui + adopt Dialog, Popover, Select, Command primitives | Component depth, accessibility, keyboard nav | Standard accessible interactions everywhere | Cuts component build time across all 43 routes | Medium — Tailwind v4 + shadcn requires careful setup | Drift risk if existing components conflict with shadcn defaults | Next |
| Storybook (or Ladle) for the component library | Visual regression catch + design discussion | n/a (internal tool) | Faster build phase iteration; QA can review components in isolation | Medium | Adds dev dependency surface | Later |
| Theme toggle (light/dark) | Section 8 a11y already mentions reduced motion; dark mode helps low-light pharmacy back office | Reduces eye fatigue | Differentiates platform | High — every component pair must support both | Token system can absorb this — colors expressed as semantic tokens, not raw hex | Later |
| Skeleton loaders matching layout (handoff Section 7 mentions Suspense fallbacks) | Perceived performance | Reduces "is this loading or broken" question on slow Supabase queries | Standard premium pattern | Low (per route) — but must be done route by route | Defer until each feature lands | Now (per route) |
| Empty states for every data table | Reduces dead-air for first-day users | "No prescriptions yet — scan your first one" beats blank table | Feels designed | Low | Adds copy; needs editorial pass | Now (per route) |
| Keyboard shortcut layer (e.g., `Cmd+K` command palette) | Power-user productivity for daily users | Substantial — pharmacy staff are daily users | Differentiates from PharmPartner legacy | Medium | shadcn/ui Command primitive handles this | Later |

---

## 6. Typography, Text Wrapping & Readability

| Finding | Location | Issue | Impact | Fix | Priority |
|---|---|---|---|---|---|
| Type scale tokens from Section 2.2 not declared in globals.css | `globals.css @theme` | Only `--font-sans` and `--font-mono` declared. The 11 named type tokens (page-title, section, card-title, body, body-sm, label, caption, mono-data, mono-input, mono-metric, mono-pos-tender) are **missing** | Components hand-set sizes via Tailwind classes — guaranteed inconsistency | Add type tokens to @theme block or to a `:root` block; reference via CSS custom property in component classes | High |
| Mono font is loaded but never used | `index.html` loads JetBrains Mono | Mono is the entire visual signal for "this is a quantity / DIN / lot / timestamp / total" — the spec leans heavily on mono variants | Visual signaling for clinical/regulated data is absent | Adopt `<MonoText>` or `font-mono` Tailwind class once tokens land; use everywhere handoff specifies | High |
| Default font size in globals.css is browser default (16px) | `globals.css` | Body inherits 16px; handoff body is 16/24/400 — close but not declared | Marginal — but uniform implementation is cleaner | Set `body { font-size: 16px; line-height: 24px; }` explicitly | Low |
| No max-width on prose-like content | Placeholder | At wide viewports text could stretch the full content area | Marginal at scaffold; matters for any descriptive copy | Container utilities or per-component max-widths in build phase | Low |

---

## 7. Editorial & Content Review

The scaffold contains essentially no client-facing copy. Limited findings:

| Finding | Current Text | Problem | Revision | Reason | Severity |
|---|---|---|---|---|---|
| Placeholder copy uses "build phase" | `Placeholder.tsx`: "Placeholder — real implementation lands during the build phase." | Internal terminology leaks into UI | "This screen is not yet implemented." | Plain language; doesn't expose internal process language | Low |
| AuthLayout footer hard-codes Winchester | "© Winchester Global Pharmacy {year}" | After reclassification to NoDrftSystems proprietary platform with Winchester as first deployment, the footer should reflect deployment owner, not platform owner. May still be correct for Winchester deployment specifically; will need per-deployment configuration | Defer until tenant theming model is decided | Configuration concern, not editorial | Observation |
| App.tsx fallback messaging absent | n/a — moved to RouterProvider | Old "PharmacyOS — proprietary pharmacy operations platform" copy from previous commit was removed in router refactor; intentional | None — correct trade-off | n/a | n/a |

---

## 8. Audience Attention & Language Effectiveness

Pharmacy staff are not "convertible audiences." Heuristics that apply:

- **Opening message strength**: N/A — no marketing surface
- **Specificity**: N/A
- **Builds confidence**: WEAK — current scaffold reads as "pre-release / beta" rather than "operational tool" because of empty placeholder rendering
- **Tone fit**: NEUTRAL — no copy yet to assess
- **CTA persuasion**: N/A — internal tool, primary actions are functional ("Receive stock," "Verify prescription") not persuasive

Single recommendation: when feature work starts, every primary CTA must use exact verb phrasing from the handoff Section 5 screen specs. No paraphrasing.

---

## 9. Retention, Scan-Ability & Flow

For an internal tool, "retention" reframes as "session productivity." Findings:

| Finding | Location | Issue | Effect | Fix | Priority |
|---|---|---|---|---|---|
| Sidebar group ordering matches handoff but visual grouping is weak | `AdminPortalLayout.tsx` | Nav group label rendered as small uppercase but no spacing reset between groups | Eye doesn't catch the group boundary | Increase vertical gap between groups; reduce gap inside groups | Medium |
| Placeholder pages show route path in body | `Placeholder.tsx` | Useful for dev navigation; will need to be hidden or removed in production | If shipped to users, exposes implementation detail | Add `import.meta.env.DEV` guard around route-path display | Low |
| No per-screen scroll/sticky pattern | All routes | Long tables (audit, schedule log) will need sticky table headers and column footers | Future feature work concern | Adopt during table component build | Now (per feature) |

---

## 10. Durability & Long-Term Relevance

| Finding | Time Horizon | Risk | Evidence | Fix | Priority |
|---|---|---|---|---|---|
| Design tokens centralized in globals.css @theme | 24 months | Low risk — Tailwind v4 CSS-first config is current and the token surface is named, not hex-strewn | `globals.css` token block | None — pattern is correct | n/a |
| TypeScript strict + verbatimModuleSyntax + noUncheckedIndexedAccess | 24 months | Low risk — strict surface catches drift early | `tsconfig.app.json` | None | n/a |
| React 19 vs React 18 in ADR | 12 months | Low — both are LTS-class; React 19 features are additive | ADR drift note | Update ADR text on next revision | Low |
| Single Placeholder used for all 43 routes | 6 months | Medium — once feature work begins, the temptation to extend Placeholder rather than replace it | Pattern is intentional but easy to abuse | Strict rule: feature work replaces the placeholder for that route, never extends it | Medium |
| Vite v8 + Tailwind v4 + shadcn/ui v3 (when added) | 12 months | Low — all current as of build date | Versions in package.json | Quarterly TMA sweep already governs | n/a |
| Sidebar hardcodes nav structure | 24 months | Medium — adding routes requires editing layout file | If route inventory changes (e.g., insurance AIS in Phase 2), sidebar diverges | Drive sidebar from a navigation config that references route-permissions | Medium |

---

## 11. Quality Rating & Valuation

Rubric scoring against scaffold-milestone state:

| Category | Max | Score | Justification |
|---|---|---|---|
| Strategic Alignment | 15 | 13 | Architecture matches ADR; routes match BAP; reclassification logged. -2 for design handoff visual fidelity gap. |
| Critical Issue Control | 15 | 10 | No critical bugs; build passes. -5 for missing browser smoke test + missing core components (PageHeader, Button, FormField). |
| User Experience | 12 | 5 | Skeleton renders but reads as basic. Sidebar functional but un-styled. No PageHeader. No proper auth UI. |
| Content / Editorial Quality | 10 | 6 | Limited copy surface. Placeholder copy uses internal language ("build phase"). |
| Audience Engagement | 8 | 3 | Internal tool; metric weakly applies. Score reflects "scaffold doesn't earn confidence yet." |
| Readability / Scan-Ability | 10 | 5 | Type tokens not declared; mono never used; group boundaries weak. |
| Feature Potential | 10 | 9 | Architecture supports rich features; route-permissions matrix is robust; design handoff is comprehensive. |
| Retention / Conversion Support | 8 | 5 | N/A for marketing; reframed as productivity scaffold — adequate. |
| Durability / Long-Term Relevance | 7 | 6 | Strict TS, modern stack, design tokens centralized. -1 for sidebar hardcoded structure. |
| Report Completeness | 5 | 5 | This document. |
| **Total** | **100** | **67** | **Quality Band: 60–69 — "Weak / Significant Rework Required"** |

**Reframing:** The "rework" framing implies redoing work. The accurate read is: the scaffold is correct; visual elevation is the next planned slice and was always going to be needed. Score reflects pre-elevation state.

**Estimated Monetary Valuation:** Not verifiable with available data. (No commercial pricing decided for the proprietary platform model; pricing structure is in [sow-restructure-brief.md](sow-restructure-brief.md) but values are pending Founder.)

**Top Fixes That Would Raise the Score (each ~5–8 points):**
1. PageHeader + Button + Form Field components → +6 (UX, Content, Readability)
2. Sidebar refactor to Section 4.1 fidelity → +4 (UX, Readability)
3. Login screen UI per Section 4.13 → +4 (Critical Issue Control, UX)
4. Type token declarations + adoption → +4 (Readability)
5. Dashboard grid skeleton with metric cards → +5 (UX, Engagement)

Cumulative if all five land: ~90/100, Quality Band "Premium / Launch-Ready" — for the visual scaffold layer specifically. Backend feature work is a separate axis.

---

## 12. Final QA Supervisor Synthesis

**Status:** **Not release-ready — by design at this scaffold milestone.**

The build is structurally correct, architecturally aligned, and ready for feature work to land on top. It is also visually thin, which is the user feedback that triggered this review. The fix is not rework — it is the next planned elevation slice.

### Priority Fix List (this slice)

**Must Fix Before Next Demo:**
1. PageHeader component (handoff Section 3.1)
2. Sidebar refactor to Section 4.1 fidelity
3. Button component (Section 4.8 — at minimum primary, secondary, tertiary)
4. Type token declarations in globals.css (Section 2.2)
5. Refactor Placeholder to use PageHeader + better empty state visual treatment

**Should Fix Soon:**
1. Login + 2FA screen UI (Section 4.13 + 4.7) — UI only, auth still stub
2. Form field components (Input, Label, MonoInput per Section 4.7)
3. Breadcrumb component (Section 4.17)
4. Sidebar navigation driven from a config (decouple from layout file)
5. Dashboard grid skeleton with metric card placeholders (Section 3.4 + 4.12)

**Can Defer:**
1. shadcn/ui init + Dialog/Popover/Command/Select primitives
2. Storybook or Ladle
3. Theme toggle / dark mode
4. Keyboard shortcut layer

### Recommended Next Build Order

1. **This turn:** Slice 3 (priority items 1, 2, 3, 4, 5 above) — committed in same cycle as this review
2. **Next turn:** Slice 4 — Login screen UI (priority item 6) + Form Field components (item 7) + Breadcrumb (item 8)
3. **Then:** Slice 5 — Dashboard skeleton with metric cards (item 10)
4. **Then:** Resume backend track — user supabase login + DB password → I run supabase link → SCA reviews DSS schema plan → migrations begin
5. **Then:** Feature work — module by module, replacing Placeholder route by route

### Unknowns / Data Gaps

- Live browser rendering of current commit not verified in-harness
- Figma frames mentioned in handoff line 7 — never produced or never received in this workspace; not blocking
- No design QA agent available in current cell to second-opinion this review (DAA exists but not invoked here)

### Final Conclusion

**Hold for important revisions** — limited to the visual elevation slice. Architecture and governance are sound; the path forward is execute, not redesign. Founder approval requested before this review's elevation slice is treated as completed. The elevation slice itself executes in the same turn as this review (commit follows).
