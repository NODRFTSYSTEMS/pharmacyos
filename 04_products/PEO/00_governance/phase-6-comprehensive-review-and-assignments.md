# Peak Equity Optimizer — Final Comprehensive Review & AI Role Assignments

**Date:** 2026-04-16  
**Reviewer:** Lead AI Prompt & Software Engineer  
**Scope:** Client-facing website and application (`peo-app/`)  
**Status:** Phase 6 Activation — Pre-Launch Review  

---

## Executive Summary

The Peak Equity Optimizer (PEO) website is a well-architected Next.js 15 application with internationalization (en/es), a dark premium aesthetic, and strong analytical depth. However, **several critical errors, broken links, translation gaps, and conversion-optimization opportunities must be resolved before launch.** This document assigns specialized AI roles to each workstream to ensure a flawless, high-converting delivery.

---

## Critical Findings Requiring Immediate Action

| # | Finding | Severity | Location |
|---|---------|----------|----------|
| 1 | **Broken `/contact` links** — Route does not exist. Will 404. | 🔴 Critical | `for-sellers/page.tsx` (2×), `for-investors/page.tsx` (1×) |
| 2 | **Incomplete Spanish translations** — Missing `forInvestors`, `forSellers` in nav; missing several home keys. | 🔴 Critical | `messages/es.json` |
| 3 | **Hardcoded CTA in mobile nav** — "Try Free — No Credit Card" bypasses i18n system. | 🟡 High | `Header.tsx` |
| 4 | **Hero headline lacks emotional punch** — Functional but not visceral. | 🟡 High | `messages/en.json` + `messages/es.json` |
| 5 | **No sitemap/robots configuration** — SEO infrastructure incomplete. | 🟡 High | `next.config.ts`, missing `sitemap.ts` / `robots.ts` |
| 6 | **OG image unverified** — `/og-default.png` referenced but not confirmed in `/public`. | 🟡 High | `layout.tsx`, `/public/` |
| 7 | **Missing structured data** — Only FAQ page has JSON-LD. | 🟠 Medium | Product/Organization pages |
| 8 | **Navigation cognitive load** — Academy dropdown + 5 main items = 6 top-level decisions. | 🟠 Medium | `Header.tsx` |
| 9 | **Problem-solution framing weak on homepage** — Emotional journey not explicit enough above the fold. | 🟠 Medium | `page.tsx` (home) |
| 10 | **No error boundary or 404 page** — Falls back to Next.js default. | 🟠 Medium | `not-found.tsx` missing |

---

## AI Role Assignments

### Role 1: UX Copy & Conversion Architect
**Mission:** Rewrite all hero headlines, subheads, and CTAs to maximize emotional resonance, clarity, and 5-second conversion.

**Deliverables:**
1. **Homepage Hero:** Rewrite `heroTitle` and `heroSubtitle` in both `en.json` and `es.json`.
   - Must speak directly to the user’s pain (fear of losing money, bad deals, overpricing).
   - Must promise a specific, desirable outcome (defensible numbers, confidence, speed).
   - Must create urgency or stakes.
   - *Example direction:* "Every day you price your home without live comps, you’re negotiating blind." → "Know your real number before they do."
2. **For Sellers Page Hero:** Sharpen headline to focus on control and net proceeds, not process.
3. **For Investors Page Hero:** Lead with profit protection and deal velocity.
4. **CTA Audit:** Ensure every primary CTA uses action-oriented, benefit-laden language.

**Success Criteria:**
- Zero ambiguity in any headline.
- Every hero section passes the "so what?" test.
- Tone remains professional and premium (no hype, no clickbait).

---

### Role 2: Technical SEO & Accessibility Engineer
**Mission:** Eliminate all technical SEO gaps and accessibility violations.

**Deliverables:**
1. **Create `src/app/sitemap.ts`** — Dynamic sitemap covering all locale variants (`/en/*`, `/es/*`).
2. **Create `src/app/robots.ts`** — Allow all, point to sitemap.
3. **Verify OG image:** Confirm `/public/og-default.png` exists and meets 1200×630 dimensions. If missing, flag immediately.
4. **Structured Data Expansion:**
   - Add `Organization` schema to root layout.
   - Add `SoftwareApplication` schema to `/for-investors` and `/for-sellers`.
   - Add `Offer` schema to `/pricing`.
5. **Meta descriptions audit:** Ensure every page has unique, keyword-rich meta descriptions under 160 characters.
6. **Accessibility fixes:**
   - Add `aria-current="page"` to active nav items in `Header.tsx`.
   - Ensure Academy dropdown is keyboard-navigable (Esc to close, arrow keys).
   - Add skip-to-content link.
   - Verify all interactive elements have visible focus rings.

**Success Criteria:**
- Lighthouse SEO score ≥ 95.
- Lighthouse Accessibility score ≥ 95.
- Zero 404s from internal links.

---

### Role 3: i18n & Localization Specialist
**Mission:** Complete and harmonize all Spanish translations. Fix hardcoded strings.

**Deliverables:**
1. **Complete `messages/es.json`:**
   - Add missing nav keys: `forInvestors`, `forSellers`.
   - Add missing home keys: `socialProofHeading`, `stat1Value`, `stat1Desc`, `stat2Value`, `stat2Desc`, `stat3Value`, `stat3Desc`, `stat4Value`, `stat4Desc`, `academyTeaserTitle`, `academyTeaserDesc`, `academyTeaserCta`, `testimonialsTitle`, `faqTeaserTitle`, `faqTeaserCta`.
   - Ensure all pricing, FAQ, trust, dashboard, and analysis keys have Spanish equivalents.
2. **Fix hardcoded strings in components:**
   - `Header.tsx` mobile nav: "Try Free — No Credit Card" → use `t("tryFree")`.
   - `Header.tsx` desktop nav: "See How It Works" on homepage is hardcoded in `page.tsx`.
   - `page.tsx` eyebrow: "Real Estate Intelligence Platform" is hardcoded in English.
3. **Locale-aware formatting:**
   - Ensure dates in `investor/page.tsx` use locale-appropriate formatting.
   - Ensure currency formatting uses `$` consistently (already OK for US markets).

**Success Criteria:**
- Switching to `/es` shows zero English fallback strings on any client-facing page.
- All UI text originates from translation files.

---

### Role 4: Frontend Bug Hunter & Route Architect
**Mission:** Fix all broken routes, missing pages, and navigation inconsistencies.

**Deliverables:**
1. **Fix broken `/contact` links:**
   - `for-sellers/page.tsx` lines 89 and 343 link to `/contact`.
   - `for-investors/page.tsx` line 218 links to `/contact`.
   - **Decision required:** Either create a `/contact` page or redirect these links to a working destination (e.g., `/seller` for sellers, `/investor/analyze` for investors, or a mailto link). *Recommended:* Create a minimal `/contact` page with a simple form or redirect to `/seller` and `/investor/analyze` respectively.
2. **Create `src/app/[locale]/not-found.tsx`:** Branded 404 page with return-home CTA.
3. **Navigation simplification:**
   - Evaluate whether Academy deserves dropdown status or can be collapsed into a single "Academy" link.
   - Ensure mobile and desktop navs are identical in item order.
4. **Route consistency check:**
   - Ensure all `href` values in `Header.tsx`, `Footer.tsx`, and page components resolve to existing routes.
   - Verify no orphaned routes exist.

**Success Criteria:**
- Zero 404s from internal navigation.
- All routes have a corresponding source file.
- `next build` completes without route warnings.

---

### Role 5: Visual Hierarchy & Design Systems Analyst
**Mission:** Improve scannability, visual flow, and mobile responsiveness.

**Deliverables:**
1. **Homepage problem-solution block:** Add a dedicated section above "How It Works" that explicitly states:
   - The emotional problem ("You’re making the biggest financial decision of the year with incomplete data.")
   - The logical solution ("PEO replaces guesswork with verified ARV, live comps, and stress-tested numbers.")
2. **Scanning aids:**
   - Add bullet-point summaries to dense text blocks (e.g., Academy page).
   - Increase visual contrast between section types (hero vs. content vs. CTA).
3. **Trust signals:**
   - Add a "As seen in / Trusted by" row (can be placeholder text for now if no logos available) or move stats higher on the page.
4. **Mobile optimization:**
   - Review `globals.css` breakpoints. Ensure no horizontal overflow on 375px screens.
   - Check that terminal grids and pricing cards stack cleanly.

**Success Criteria:**
- A user can understand the value proposition in 5 seconds without scrolling.
- Mobile layout has zero horizontal scroll or clipped text.

---

### Role 6: QA & Build Verification Engineer
**Mission:** Run the full build, lint, and test suite. Document and fix all failures.

**Deliverables:**
1. **Run `pnpm build`:** Capture all TypeScript errors, ESLint warnings, and build failures.
2. **Run `pnpm lint`:** Fix all auto-fixable issues; document manual fixes.
3. **Run unit tests:** `npx vitest run` — ensure all pass.
4. **Cross-page link crawl:** Write a quick script or manually verify that every `<Link>` on every page resolves.
5. **Performance baseline:** Run Lighthouse on `/en`, `/en/for-sellers`, `/en/for-investors`, `/en/pricing`.

**Success Criteria:**
- Build passes with zero errors.
- All tests pass.
- Lighthouse Performance ≥ 85 on mobile.

---

## Immediate Fixes Already Applied by Lead Engineer

1. **Broken `/contact` links patched** — Changed 3 broken `/contact` links in `for-sellers/page.tsx` (2×) and `for-investors/page.tsx` (1×) to valid routes (`/seller` and `/investor/analyze`).
2. **Critical React Hooks bug fixed** — Moved `useState` calls before conditional return in `src/app/[locale]/test/page.tsx`. Build now passes.
3. **Missing OG image created** — Generated `public/og-default.png` (1200×630) to match metadata reference in `layout.tsx`.
4. **Missing Spanish keys added** — Added `forInvestors`, `forSellers`, `tryFree` to `messages/es.json` nav, plus all missing `home` keys (`socialProofHeading`, stats, academy teaser, testimonials, FAQ teaser).
5. **Hardcoded mobile nav CTA fixed** — `Header.tsx` mobile menu now uses `t("tryFree")` instead of hardcoded English string.

---

## Recommended Execution Order

1. **Frontend Bug Hunter** fixes broken routes first (unblocks all other testing).
2. **i18n Specialist** completes translations (unblocks Spanish QA).
3. **UX Copy Architect** rewrites hero copy (unblocks design approval).
4. **SEO Engineer** adds sitemap, robots, and structured data.
5. **Design Analyst** polishes visual hierarchy and mobile flow.
6. **QA Engineer** runs final build, tests, and Lighthouse verification.

---

## Sign-Off Criteria

The website is considered **launch-ready** only when:
- [ ] All internal links resolve to real routes.
- [ ] Spanish locale is 100% complete.
- [ ] Build passes with zero errors.
- [ ] Lighthouse scores: Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 95.
- [ ] Hero copy on all three core pages (Home, Sellers, Investors) passes the emotional-engagement review.
- [ ] A branded 404 page exists.
- [ ] Sitemap and robots.txt are live.

---

*Document prepared as part of Phase 6 activation. All findings are verifiable against the current codebase state in `peo-app/`.*
