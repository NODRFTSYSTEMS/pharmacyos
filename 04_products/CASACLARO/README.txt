CASACLARO — Claude Design Handoff
===================================
Generated: April 18, 2026
Repository: NODRFTSYSTEMS/CASACLARO (internal, not yet public)
Operator: NoDrft Systems

--- PROJECT OVERVIEW ---
CasaClaro is a static multi-page HTML/CSS/JS real estate marketplace for
Colombia, targeting international (primarily US/CA) buyers and retirees.
No build system. No framework. No package.json. Files are served directly
via HTTP (e.g. python -m http.server 8080). Deploy by copying the folder
to any static host (Netlify, GitHub Pages, S3, Vercel static).

--- CANONICAL FOLDER ---
04_products/CASACLARO/
All production files live here. No subdirectories except:
  assets/        — favicon.svg, logo files
  data/          — cities.json, cities_enhanced.json (JSON data layer)
  qa-nav-check/  — Playwright QA scripts (not shipped to users)

--- DESIGN SYSTEM ---
Primary typefaces : Playfair Display (headings), Inter (body)
Color tokens (CSS vars in styles.css):
  --terracotta   : #D4622A  (primary CTA, accent)
  --cream        : #FDF6EC  (backgrounds, cards)
  --latte        : #D4B896  (borders, dividers)
  --coffee       : #7A5C44  (body text, secondary)
  --charcoal     : #2C241B  (footer, dark backgrounds)
  --emerald      : #2D8A5E  (positive/savings callouts)
  --gold         : #C9A227  (investment/premium)
Border radius tokens: --radius-sm, --radius-md, --radius-lg
Shadow tokens: --shadow-sm, --shadow-md

--- CORE FILES ---
index.html          — Homepage (hero, city grid, CTA sections)
city.html           — Dynamic city guide (URL param: ?id=<slug>)
cities.html         — City comparison grid
relocation.html     — Relocation tool / cost comparison
rentals.html        — Rentals listing
residency.html      — Residency/visa information
for-agents.html     — Agent-facing page
for-sellers.html    — Seller landing (links to submit-property)
guide.html          — General buyer guide
cost-simulator.html — Cost of living simulator
retiree-guide.html  — Retiree relocation guide (Patch A)
submit-property.html — Property submission form (Patch A)
terms-of-service.html — Terms + privacy/commission disclosure (Patch A)

--- SHARED JS ARCHITECTURE ---
script.js           — Main app IIFE (CasaClaroApp). Bilingual EN/ES toggle.
                      Loads cities.json, renders city cards, handles routing.
content.js          — Bilingual string tables (EN + ES)
currency-engine.js  — Live FX (Frankfurter API). Exposes window.CurrencyEngine.
                      Endpoint: https://api.frankfurter.dev/v2/rates?base=USD&quotes=COP
                      Fallback: 4200 COP/USD if API unavailable.
data/cities.json         — Primary city data (8 cities, EN+ES fields)
data/cities_enhanced.json — Patch A data (metrics, rental market, neighborhoods)

--- BILINGUAL STATUS ---
Main pages (index.html, cities.html, relocation.html, etc.): Full EN/ES toggle.
Patch A pages (city.html, retiree-guide.html, submit-property.html): EN only.
cities_enhanced.json: EN only (no shortTaglineEs, vibeEs, introTextEs).
ES parity for Patch A is scoped to Patch B — NOT a regression, known gap.

--- BROWSER SUPPORT ---
Target: Chrome 120+, Firefox 120+, Safari 16+, Edge 120+
QA baseline: Playwright sweeps (chromium/firefox/webkit + Edge)
Mobile breakpoint: 768px
Tested viewports: 375x812, 768x1024, 1024x768, 1280x800

--- LEGAL / COMPLIANCE ---
Data privacy: Colombian Law 1581 of 2012 (Habeas Data)
Commission: 3% on completed transactions (no listing fee)
Visa data sourced from Cancillería + Migración Colombia; confirmed March 2026.
terms-of-service.html is a working draft — requires Colombian legal review before public.

--- PRIVATE / EXCLUDED FILES ---
qa-nav-check/     — Playwright QA (excluded from public deployment)
qa-profile*/      — Playwright profiles (.gitignore)
qa-shots*/        — QA screenshots (.gitignore)
casaclaro-app-summary.html — Internal summary (.gitignore)
*.pdf, *.png      — Binary assets (.gitignore)

--- GIT STATE (as of April 18, 2026) ---
Branch: main
Commits:
  b555a48 — Initial commit (base site)
  087edbf — Patch A: city guide, retiree guide, property submission form
Status: Internal review. Not yet pushed to public GitHub.
Remote: NODRFTSYSTEMS/CASACLARO

--- RUNNING LOCALLY ---
cd 04_products/CASACLARO
python -m http.server 8080
Open: http://localhost:8080

--- QA ---
cd 04_products/CASACLARO/qa-nav-check
node responsive-qa.mjs       (Chrome / Firefox / WebKit)
node responsive-qa-edge.mjs  (Edge)

--- NOTES FOR CLAUDE DESIGN ---
- Do not introduce a build system. Inline styles on one-off elements are fine.
- CSS additions go at the bottom of styles.css (append only, never reorder tokens).
- JS additions go in script.js inside the CasaClaroApp IIFE, or in a new
  standalone file if the feature is page-specific.
- currency-engine.js must never be redeclared — the window.CurrencyEngine guard
  at the bottom of that file is load-order protection for city.html.
- All new pages must include: favicon link, styles.css, currency-engine.js (if
  FX display needed), and nav matching existing pages.
- Image assets: use Unsplash CDN (photo.jpg?w=1200&q=80) for hero images.
  Do not commit binary images to the repo.
