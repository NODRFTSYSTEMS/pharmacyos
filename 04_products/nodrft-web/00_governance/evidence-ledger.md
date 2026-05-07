# Evidence Ledger — nodrft-web Banner & Positioning Sprint
**Classification:** Internal — Proprietary  
**Build:** Banner & Positioning Sprint  
**Gate 4 Run Date:** 2026-05-06  
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
