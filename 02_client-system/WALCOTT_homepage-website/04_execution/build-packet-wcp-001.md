# Build Packet — WCP-001

Gate 1 output — produced retroactively after protocol breach and Founder authorization.

---

## 1. Build Identity

- **Build ID:** WCP-001
- **Build Name:** Initial GitHub Repository Setup, Deployment Pipeline, and Frontend Performance Tweak
- **Repository:** walcottcostudios (GitHub: walcottcapitalgroup/walcottcostudios)
- **Local Path:** `04_products/WCP/`
- **Branch:** main
- **Build Class:** Class 2 (standard feature build with deployment configuration)
- **Classification Rationale:** Deployment pipeline configuration (GitHub Actions → GitHub Pages) introduces public-facing infrastructure risk; however, no auth, billing, schema, or third-party integration changes are involved. Highest-risk surface is deployment readiness.
- **Date:** 2026-04-18
- **Status:** Completed (retroactively authorized)

## 2. Human Authority

- **Human Owner:** Founder
- **Build Lead:** SEA / FIS / PIS / RCA (generic agent executed; retroactively mapped to named roles)
- **Reviewer Path:** QAS / Imani (retroactive independent review)

## 3. Objective

Establish GitHub repository structure and deployment pipeline for The Walcott & Co. Press website; apply high-value frontend performance and meta tweaks to eliminate blank-screen load, improve LCP, and ensure professional browser tab and social-sharing presentation.

## 4. Bounded Scope

1. Initialize git repository in `04_products/WCP/`
2. Create `.github/workflows/deploy-pages.yml` for GitHub Actions deployment to GitHub Pages
3. Create `.github/workflows/ci.yml` for validation checks (build artifact verification, asset reference check)
4. Create `.gitignore`, `.nojekyll`, `README.md`
5. Push initial codebase to `https://github.com/walcottcapitalgroup/walcottcostudios`
6. Configure GitHub Pages source to **GitHub Actions** (manual Settings step)
7. Add inline brand-colored loader inside `<div id="root">` to prevent blank white screen during React hydration
8. Add `<link rel="preload" as="image">` for hero portrait to improve LCP
9. Move Google Fonts loading from CSS `@import` to HTML `<link>` for earlier browser discovery
10. Add inline SVG favicon and apple-touch-icon matching brand tokens (`--paper`, `--ink`)
11. Add `og:image:width` and `og:image:height` meta tags (864×1184)
12. Add `<noscript>` fallback notice for users with JavaScript disabled

## 5. Exclusions

- No changes to React component logic, state, or business rules
- No changes to GSAP animations, ScrollTrigger behavior, or snap logic
- No image format conversion (WebP/AVIF) or responsive `srcset`
- No analytics, tracking, or conversion pixel integration
- No backend API, serverless function, or database changes
- No authentication, authorization, or billing changes
- No content or copy changes beyond HTML meta tags
- No CMS integration or dynamic content wiring
- No print-on-demand (POD) integration
- No email capture platform wiring beyond existing `formsubmit.co` endpoint

## 6. Dependencies

- GitHub repository `walcottcapitalgroup/walcottcostudios` created and accessible
- GitHub Pages enabled on repository with **Source: GitHub Actions**
- Local build artifacts (`website/` folder) already exist and are deployable
- Vite build configuration already set (`base: './'`)
- Google Fonts CDN availability
- `formsubmit.co` contact endpoint already configured in `App.tsx`
- Node.js and npm available for future source rebuilds

## 7. Acceptance Criteria

1. GitHub Actions workflow triggers automatically on push to `main` when `website/` or workflow files change
2. Live site accessible at `https://walcottcapitalgroup.github.io/walcottcostudios/`
3. No blank white screen during page load — brand loader visible until React hydrates
4. Hero image (`hero_portrait.jpg`) preloaded in HTML `<head>`
5. Favicon renders in browser tab (SVG "W" on paper background)
6. `og:image:width="864"` and `og:image:height="1184"` present in `<head>`
7. `<noscript>` message displays when JavaScript is disabled
8. All asset paths resolve correctly on GitHub Pages subpath (`/walcottcostudios/`)
9. No 404s on required assets (JS, CSS, images)
10. Changes applied to both source (`app/`) and built (`website/`) files to keep them in sync

## 8. Risk Level

**Low**

- Public-facing marketing site with no auth, billing, or sensitive data
- Deployment to GitHub Pages (managed platform with built-in rollback via revert)
- Changes are additive and optimizational; no destructive modifications
- No third-party integration or schema-touching work
- Worst-case rollback: revert commit and force-push; site restores in ~60 seconds

## 9. Required Evidence

- [x] Workflow run success (GitHub Actions tab)
- [x] Live URL accessibility check (`curl` / `Invoke-WebRequest` HTTP 200)
- [x] Asset path verification (all images, JS, CSS load without 404)
- [x] Build artifact inspection (`website/index.html` contains expected changes)
- [x] Source file inspection (`app/index.html`, `app/src/index.css` contain expected changes)

## 10. Release Sensitivity

**Low**

- Internal proprietary product (NoDrft Systems)
- No client data or external stakeholder access
- No pricing-linked functionality
- Marketing presence only; no transactional surfaces

## 11. Agent Routing Note

See `04_execution/agent-routing-note.md` for the retroactive surface map, role assignments, capability checks, and handoff plan.

## 12. Retroactive Authorization Record

- **Breach flagged by:** QAS / Imani (via mandatory preload audit)
- **Breach type:** Build executed without classification, agent routing, build packet, or independent review
- **Founder decision:** Retroactively authorize the work; produce missing governance documents
- **Date of authorization:** 2026-04-18
- **Condition:** Future builds must follow the full Mandatory Build Activation Protocol without exception
