---
document: CasaClaro Platform App Summary
product: CasaClaro — Colombia Real Estate Marketplace
type: architecture / orientation document
source: converted from casaclaro-app-summary.html (04_products/CASACLARO/)
date-converted: 2026-04-17
date-placed: 2026-04-20
status: active reference
confidentiality: Proprietary internal
---

# CasaClaro — Platform Review Brief

## What It Is

CasaClaro is a static Colombia property and relocation platform. It is a publication-ready product with clear scope, current limits, review roles, and implementation context.

**Primary users:** buyers, renters, sellers, expatriates, brokers, and long-stay households who need neighborhood-level context before they buy, rent, list, or relocate in Colombia.

Audience segments: Investors · Expatriates · Local buyers · Sellers · Agents / Brokers

---

## What the Platform Covers

- City comparison across walkability, healthcare depth, maintenance burden, rental profile, and yield context
- Neighborhood-level guidance including local buyer fit and COP per square meter comparisons
- Relocation and residency guidance for expatriates, retirees, and long-stay households
- Seller, buyer, partner, and market-feedback intake flows
- Bilingual user experience with English and Spanish support across major public pages
- A live USD/COP layer with a verified timestamp used in display and underwriting calculations

---

## Architecture at a Glance

| Layer | Description |
| --- | --- |
| Frontend | Multi-page static site with HTML entry points plus shared `styles.css` and `script.js` |
| Data layer | `script.js` fetches `data/cities.json`; pages can fall back to embedded `data/cities-data.js` |
| Client services | Language and FX cache are read from `localStorage`; live FX uses the Frankfurter USD/COP endpoint with dataset fallback |
| Rendering | `DOMContentLoaded → CasaClaroApp.init()` hydrates explorer, simulator, map, rentals, relocation, residency, and city-detail views from the shared dataset |
| Interaction | Leaflet renders the marker map; forms collect payloads in-browser and can post to `siteMeta.integrations.routes` when endpoints are configured |

---

## Current Operational Limits

**Backend, auth, and database:** not present in this repository snapshot. The current build is a static frontend with browser storage and optional HTTPS integration routes reserved for later production wiring.

---

## Local Runbook

1. Start a local HTTP server from repo root: `python -m http.server 8080`
2. Open `http://localhost:8080/index.html`
3. Serve over HTTP, not `file://`, because the app fetches `data/cities.json`

**Build/test workflow:** no compile step is required for the site itself; QA runs through the included Node and Playwright scripts.

---

## Assigned Review Roles

| Role | Scope |
| --- | --- |
| Editorial QA Lead | Readability, layout flow, and narrative clarity |
| Localization Lead | Bilingual parity, Spanish adaptation, and local-market framing |
| Data Integrity Lead | Schema validity, timestamped values, and numeric consistency |
| Accessibility Lead | Mobile usability, keyboard flow, focus visibility, and semantic clarity |
| Functional QA Lead | Forms, simulator math, FX refresh behavior, and map rendering |

---

## Review Intent

The objective is not only to check whether the site works, but whether it reads clearly, serves both local and cross-border users, supports rentals as well as sales, preserves bilingual credibility, and exposes neighborhood-level decision support instead of generic market summaries.

---

## Verification Scope

Responsive browser QA should cover 375px, 768px, and 1024px layouts with attention to:
- Mobile accessibility
- Translation state
- FX timestamp visibility
- Form flow
- Neighborhood comparison behavior

---

## Evidence Base

This brief is grounded in the public page entry files, `script.js`, `content.js`, `data/cities.json`, and `data/cities-data.js`. No unverified backend behavior is assumed.

**Repo data date:** 2026-03-29  
**HTML source:** `04_products/CASACLARO/casaclaro-app-summary.html`
