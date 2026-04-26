# CasaClaro

CasaClaro is a static Colombia real estate marketplace and relocation platform for investors, expatriates, retirees, sellers, agents, brokers, and local operators.

## File Tree

- `index.html`
- `cities.html`
- `rentals.html`
- `relocation.html`
- `city.html`
- `city-template.html`
- `cost-simulator.html`
- `map.html`
- `guide.html`
- `residency.html`
- `for-sellers.html`
- `for-agents.html`
- `styles.css`
- `script.js`
- `data/cities.json`
- `assets/cities/*.svg`
- `vendor/leaflet/leaflet.css`
- `vendor/leaflet/leaflet.js`
- `package.json`
- `package-lock.json`
- `README.md`

## Run Locally

Because the app fetches `data/cities.json`, serve the folder over HTTP instead of opening files from `file://`.

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080/index.html`.

## QA Tooling

- Use an even-numbered Node LTS release for local QA tooling. Node 22 LTS is the recommended baseline for this repo.
- Install the declared Node dependency with `npm install`.
- Install Playwright browsers with `npm run qa:install-browsers`.
- Run the cross-browser responsive sweep with `npm run qa:responsive`.
- Run the Edge-specific sweep with `npm run qa:responsive:edge`.

## What Changed In This Pass

- Added a true `cities.html` explorer page with filters and comparison cards.
- Added a `rentals.html` page covering city and neighborhood rental logic.
- Added a true `relocation.html` landing page for expatriates, retirees, and the forever-young market.
- Expanded city data to cover walkability, healthcare, retiree fit, repair reality, relocation snapshots, and destination highlights.
- Added rental-market and neighborhood-level metadata to the shared JSON.
- Added a live USD/COP exchange-rate fetch with verified date stamp and JSON fallback.
- Added bilingual-ready language support with an `EN / ES` toggle for shared navigation and key page copy.
- Added time-stamped residency content backed by official-source links and current minimum-wage reference data.
- Added seller upload-ready inputs and backend-ready CRM routing hooks.
- Added explicit partner standards / SLA expectations.
- Reframed the homepage so Colombia feels like a destination and a marketplace, not just a calculator demo.

## Update City Data

1. Edit `data/cities.json`.
2. Keep the schema consistent with the existing city objects.
3. Update `siteMeta.lastUpdated`, `siteMeta.dataUpdatedLabel`, and any legal or healthcare review labels when needed.
4. Refresh the browser.

Everything dynamic on the site reads from that same JSON file.

## Live FX

- The site fetches the latest available USD/COP rate from Frankfurter on load.
- If the live request fails, the app falls back to the JSON value in `siteMeta.exchangeRateCopPerUsd`.
- The landing page and simulator show the verified rate date currently in use.
- All COP conversions in the UI use the active rate.

## Backend Hooks

The current static demo stores submissions locally in the browser and logs them to the console.

To connect a real backend:

1. Open `data/cities.json`.
2. Update `siteMeta.integrations.routes` with HTTPS endpoints for the relevant form types.
3. Keep the payload shape consistent with the current form fields.
4. Replace or extend the local demo persistence in `script.js` if you want a deeper CRM workflow.

## Extend The Platform

- Replace the static JSON feed with a spreadsheet-backed JSON export, CMS, or API.
- Swap placeholder social links in `siteMeta.socialLinks` for live Instagram, TikTok, and YouTube handles.
- Add real upload storage for seller files and inspection media.
- Route outdated-data reports into support or research operations.
- Expand the partner workflow to include service-level tracking and assignment history.
