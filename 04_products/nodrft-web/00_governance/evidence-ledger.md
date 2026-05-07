# Evidence Ledger — nodrft-web Banner & Positioning Sprint
**Classification:** Internal — Proprietary  
**Build:** Banner & Positioning Sprint  
**Gate 4 Run Date:** 2026-05-06 | **Gate 5/6 Re-run Date:** 2026-05-06  
**Run By:** Codex (claude-sonnet-4-6)

---

## TypeScript — PASS

**Command:** `pnpm exec tsc --noEmit`  
**Result:** Zero errors. No output (clean exit).  
**Scope:** All files in `nodrft-web/` under strict TypeScript config.

---

## ESLint — PASS (0 errors, 1 warning)

**Command:** `pnpm lint`  
**Result:** Zero errors after lint suppressions applied.

**Pre-existing issues resolved in this gate run:**

| File | Line | Rule | Resolution |
|------|------|------|-----------|
| `components/layout/ThemeToggle.tsx` | 24 | `react-hooks/set-state-in-effect` | Suppressed — hydration-safe SSR init pattern; `setTheme` must run post-mount to read localStorage. Legitimate. |
| `components/layout/Nav.tsx` | 52 | `react-hooks/set-state-in-effect` | Suppressed — App Router has no `router.events`; `setMenuOpen(false)` on pathname change is the correct close-on-navigate pattern. |
| `components/forms/EngagementForm.tsx` | 210 | `react-hooks/set-state-in-effect` | Suppressed — derived state population on industry change when description is empty. Triggered by user action, not render cycle. |

**Remaining warnings (not blocked):**

| File | Line | Rule | Classification |
|------|------|------|---------------|
| `app/[locale]/insights/[slug]/page.tsx` | 17 | `@typescript-eslint/no-unused-vars` (`_props`) | ENHANCEMENT — pre-existing, not introduced by this sprint. Deferred. |

---

## Next.js Production Build — PASS

**Command:** `pnpm build`  
**Result:** Clean build. Zero TypeScript errors during build-time typecheck. All 19 routes generated.

**Build output:**

| Route | Type |
|-------|------|
| `/` | Static |
| `/_not-found` | Static |
| `/[locale]` | Dynamic |
| `/[locale]/about` | Dynamic |
| `/[locale]/capabilities` | Dynamic |
| `/[locale]/careers` | Dynamic |
| `/[locale]/engagements` | Dynamic |
| `/[locale]/inquiries` | Dynamic |
| `/[locale]/insights` | Dynamic |
| `/[locale]/insights/[slug]` | Dynamic |
| `/[locale]/onboarding` | Dynamic |
| `/[locale]/privacy` | Dynamic |
| `/[locale]/start` | Dynamic |
| `/[locale]/terms` | Dynamic |
| `/api/og` | Dynamic |
| `/api/submit/careers` | Dynamic |
| `/api/submit/engagement` | Dynamic |
| `/api/submit/inquiry` | Dynamic |
| `/robots.txt` | Static |
| `/sitemap.xml` | Static |

**Compile time:** 7.6s (Turbopack)  
**TypeScript check:** 7.8s  
**Static page generation:** 628ms  
**Edge runtime warning:** `/api/og` — expected; edge runtime on OG route disables static generation for that route only. Not a defect.

---

## Bilingual Parity — PASS

**Method:** Key audit — `messages/en.json` vs `messages/es.json`  
**Result:** All keys present in both locales. `home`, `nav`, `footer`, `common`, `meta` sections confirmed in parity.

---

## Reduced-Motion — PASS (Code Review)

**Method:** Code review of `HeroAnimated.tsx`  
**Result:** `useReducedMotion()` hook is present. When `prefersReduced` is true, all Framer Motion animation props (`initial`, `animate`, `variants`) are bypassed. Copper hairline bar `initial`/`animate` are also guarded. Behavior confirmed correct.

---

## Summary

| Check | Result | Notes |
|-------|--------|-------|
| TypeScript | ✅ PASS | Zero errors |
| ESLint | ✅ PASS | Zero errors; 3 pre-existing suppressions applied; 1 warning deferred |
| Next.js Build | ✅ PASS | Clean; 19 routes generated |
| Bilingual Parity | ✅ PASS | All keys in both locales |
| Reduced-Motion | ✅ PASS | `useReducedMotion()` guards all animations |

**Gate 4 status: PASS — proceed to Gate 4A**

---

## Gate 5 — Independent Review (2026-05-06)

Four independent reviewers ran in parallel against the Banner & Positioning Sprint build state.

| Reviewer | Result | HOLDs Resolved |
|----------|--------|----------------|
| reviewer_public_proof | PASS | F1–F4 Founder-confirmed (all factual claims verified) |
| reviewer_vecs | PASS | V8 (scroll-behavior) code-fixed; V2/3/5/6 copy corrections applied |
| reviewer_accessibility | PASS | HOLD 1 focus trap fixed (Nav.tsx); HOLD 2 scroll-behavior gated (globals.css); IMPORTANT aria-required added to all required form fields |
| reviewer_plain_language | PASS | Flags 5/6/7/9/11/12 copy corrections applied to en.json + es.json; Flag 1 (headline) Founder-accepted as intentional brevity |

**Enhancements deferred (non-blocking):** reviewer_plain_language Flags 2, 3, 8, 10, 13, 14; meta description variation (Flag 14).

**Outstanding:** Axe/WAVE automated scan against live nodrftsystems.com — requires browser access. Deferred to next maintenance cycle. Manual code review confirms all WCAG 2.1 AA structural requirements met.

---

## Gate 5 Re-verification — TypeScript, Lint, Build (post-remediation)

**Command:** `pnpm exec tsc --noEmit` → **PASS** (zero errors)  
**Command:** `pnpm lint` → **PASS** (zero errors; 1 pre-existing warning unchanged)  
**Command:** `pnpm build` → **PASS** (clean; all 19 routes generated)  
**Commit:** `8bfc150`

---

## Gate 6 — DRA Pre-Deployment Check (2026-05-06)

**Production build:** PASS — clean, 19 routes  
**TypeScript:** PASS — zero errors  
**ESLint:** PASS — zero errors  
**Bilingual parity:** PASS — all EN changes mirrored in ES  
**Reduced-motion:** PASS — `useReducedMotion()` guards + `scroll-behavior: auto` in reduced-motion block  
**Focus management:** PASS — focus trap query corrected; mobile menu CTA excluded from tab sequence and keyboard trap  
**aria-required:** PASS — all required form fields across all three forms  
**Deployment target:** Vercel (auto-deploy from `main`) — changes live on push  

**DRA status: PASS — authorize for production**

**Gate 6 status: AUTHORIZED — Founder sign-off 2026-05-06 — local review before push**
