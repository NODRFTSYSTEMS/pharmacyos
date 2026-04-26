# Branded 404 Page — Design Brief

**Project:** [CLIENT NAME] — [PROJECT SLUG]  
**Tier:** [T1 / T2 / T3 / T4 / T5]  
**Prepared by:** [AGENT / ROLE]  
**Date:** [YYYY-MM-DD]  
**Status:** [ ] Draft  [ ] Approved by Founder  [ ] Implemented  [ ] QA Passed

---

## Purpose

This brief defines the branded 404 ("page not found") error state for the project above. Every T1+ build must have a branded 404 page. A missing or unbranded 404 is a delivery defect and a release-gate blocker.

---

## Required Elements (All Mandatory)

| Element | Specification | Status |
| --- | --- | --- |
| Brand logo | [Logo file path or asset reference] | [ ] |
| Brand voice headline | [One line — see below] | [ ] |
| Supporting copy | [One sentence — see below] | [ ] |
| Primary CTA | [Button label and target URL — see below] | [ ] |
| Homepage navigation link | [Text and target URL] | [ ] |
| Brand color palette | [Background, text, CTA colors] | [ ] |
| Responsive behavior | [Desktop + mobile confirmed] | [ ] |
| Framework-specific implementation | [See notes below] | [ ] |

---

## Brand Voice — Headline

Write a headline that fits the client's tone. Not a generic "404 Not Found." Examples by tone:

- **Professional / B2B:** "This page has moved on. Let us help you find what you need."
- **Friendly / Consumer:** "Oops — looks like this page took a wrong turn."
- **Bold / Modern:** "Nothing here. But everything you need is one click away."

**Client's approved headline:** [FILL IN — or mark REQUIRED if not yet approved]

---

## Supporting Copy

One sentence that reinforces the brand voice and points the user forward.

**Client's approved supporting copy:** [FILL IN — or mark REQUIRED]

---

## Primary CTA

The 404 page must have exactly one primary CTA. It should point to the most valuable destination for a confused user — usually the homepage, services page, or contact form.

**CTA label:** [FILL IN]  
**CTA destination URL:** [FILL IN]  
**CTA style:** [ ] Button (primary style) [ ] Text link

---

## Homepage Navigation Link

In addition to the primary CTA, include a clear text link back to the homepage. This ensures any user can recover navigation even on mobile.

**Link label:** [FILL IN — e.g., "Back to home" or "← Homepage"]  
**Link destination:** `/` or `[full URL]`

---

## Framework-Specific Notes

### Next.js / Vercel
- Create `app/not-found.tsx` (App Router) or `pages/404.tsx` (Pages Router)
- The component renders the branded design above — not a default Vercel 404
- For GitHub Pages SPA fallback: copy `index.html` to `404.html` at build time and include the redirect script

### Static HTML (GitHub Pages / Netlify)
- Create `404.html` at the repository root
- Must be a fully branded standalone page (includes all CSS inline or linked)

### WordPress / CMS
- Override the theme's 404.php template with branded design
- Verify no CMS plugin is serving a generic 404 over the custom template

---

## QA Checklist

Before the release-gate-review runs, confirm all of the following:

- [ ] 404 page renders correctly at `[domain]/nonexistent-path`
- [ ] Brand logo is visible and correctly sized on mobile and desktop
- [ ] Headline and copy are exactly as approved above
- [ ] Primary CTA is functional and navigates to the correct destination
- [ ] Homepage link is functional
- [ ] No raw framework error message (e.g., "404: This page could not be found") is visible anywhere on the page
- [ ] Reduced-motion behavior defined if any animation is used on the page
- [ ] Accessibility: heading hierarchy correct, CTA has accessible label
