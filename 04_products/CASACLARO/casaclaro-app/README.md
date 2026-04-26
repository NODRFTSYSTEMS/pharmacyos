# CasaClaro

**Bilingual Colombia property and relocation platform.**
Buy, rent, relocate, or list Colombian real estate — with real context for expats and foreign buyers.

Live domain: [casaclaro.co](https://casaclaro.co)

---

## What It Is

CasaClaro is a production-grade Next.js web platform targeting the growing market of foreigners buying, renting, and relocating to Colombia. It covers the full buyer journey: property discovery → neighborhood context → cost calculation → relocation guidance → vetted professional network.

**Target audience:** English-speaking expats, digital nomads, retirees, and foreign real estate investors considering Colombia.

**Business model options:**
- Featured listing placements (agent/seller pays for prominence)
- Agent subscription tier (lead notifications + priority placement)
- Affiliate referral fees (legal, banking, relocation services)
- Strategic acquisition by a Colombian RE agency, relocation company, or expat media brand

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.4 (App Router) |
| Language | TypeScript 5 |
| React | React 19 |
| Internationalization | next-intl 4.9.1 (EN/ES, locale prefix: as-needed) |
| Styling | CSS-in-JS (inline styles + CSS custom properties) + Tailwind CSS 4 |
| Maps | Leaflet 1.9 (direct, no react-leaflet — React 19 peer dep incompatibility) |
| FX Data | Frankfurter API (ECB rates, 8 currencies) |
| Testing | Vitest + Testing Library |
| Package manager | pnpm |
| Deployment target | Vercel |

---

## Routes (14 total)

| Route | Description |
|---|---|
| `/` | Homepage — hero, city highlights, platform value props |
| `/listings` | Property listings grid with filters (sale/rental/long-term) |
| `/listings/[slug]` | Individual listing detail page (SEO-optimized per slug) |
| `/cities` | City explorer — list view, map view, compare table |
| `/map` | Full-screen interactive Colombia map with city detail panel |
| `/relocation` | Relocation hub — visa overview, cost breakdown, timeline |
| `/relocation/business` | Business setup guide — structures, steps, visas, official links |
| `/residency` | Residency visa pathways (investor, pensioner, work) |
| `/cost-simulator` | Property cost calculator with closing cost breakdown |
| `/guide` | Property buying guide — process steps, legal notes |
| `/partners` | Vetted professional network (agents, lawyers, accountants) |
| `/for-sellers` | Seller onboarding — list a property |
| `/for-agents` | Agent partnership program |
| `/terms` | Terms of service |

---

## Features

- **Bilingual (EN/ES)** — full content parity across all routes; transcreated, not translated
- **Live FX widget** — USD↔COP rates via ECB/Frankfurter, updates in footer and cost simulator
- **Currency converter** — 8-currency cross-rate calculator (USD, EUR, GBP, CAD, AUD, MXN, BRL, COP)
- **Interactive Colombia map** — Leaflet with city markers, detail panel, and quick-select strip
- **City compare table** — side-by-side comparison of cost of living, climate, internet, expat population
- **Property cost simulator** — buyer's closing cost breakdown by property type and value
- **Vetted badge system** — listings and partners carry a verification badge
- **Synthetic data mode** — all seed data is marked `is_synthetic: true`; safe for demo/dev
- **Responsive** — mobile-first; hamburger nav, responsive footer grid, adaptive layouts
- **SEO foundation** — `generateMetadata` per route, `robots.ts`, `sitemap.ts`
- **Branded error pages** — custom `not-found.tsx` and `error.tsx`

---

## Setup

**Requirements:** Node 20+, pnpm

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

Open [http://localhost:3000](http://localhost:3000).

**Environment variables** (optional — app runs without them in synthetic mode):

```env
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=casaclaro.co   # Analytics (Plausible)
```

---

## Data Layer

All current data is synthetic seed data in `src/data/`:

| File | Contents |
|---|---|
| `listings.seed.ts` | Property listings (`is_synthetic: true`) |
| `cities.data.ts` | City profiles with cost-of-living data, coordinates, marker colors |

The `useListings` hook in `src/hooks/useListings.ts` is stubbed and ready to be wired to a Supabase `listings` table. See `DECISIONS.md` for the Supabase migration plan.

---

## Design Tokens

```css
--terracotta:    #e67e22   /* Primary CTA, active states */
--ocean:         #1f3a4d   /* Footer, dark surfaces */
--lagoon:        #1f6f78   /* Secondary accent */
--emerald-deep:  #1f8f59   /* Success, vetting */
--cream:         #fdf5e6   /* Page background */
--sand:          #fff8ef   /* Card backgrounds */
--radius:        26px      /* Primary border radius */
--font-display:  Georgia, serif
--font-body:     system-ui, sans-serif
```

---

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # All pages under locale routing
│   │   ├── layout.tsx     # Root layout (Header, Footer, locale wrapper)
│   │   ├── page.tsx       # Homepage
│   │   ├── listings/      # Grid + [slug] detail pages
│   │   ├── cities/        # City explorer
│   │   ├── map/           # Full-screen map
│   │   ├── relocation/    # Relocation hub + /business subpage
│   │   └── ...            # Other routes
│   ├── api/
│   │   └── fx/route.ts    # Live FX rate endpoint (Frankfurter API)
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── Header.tsx          # Bilingual nav, active states, mobile menu
│   ├── Footer.tsx          # Nav columns, brand CTAs, CurrencyWidget
│   ├── CurrencyWidget.tsx  # Live COP rate display
│   ├── CurrencyConverter.tsx # 8-currency cross-rate calculator
│   ├── map/
│   │   └── ColombiaMap.tsx # Leaflet map component
│   └── listings/
│       └── VettedBadge.tsx
├── data/                   # Seed data (synthetic)
├── hooks/                  # useListings (stub → Supabase)
├── lib/
│   └── fx.ts              # FX fetch utility with 4100 COP/USD fallback
└── types/                  # TypeScript interfaces
```

---

## Acquisition / Investment Context

This platform is designed to be always sellable at one of three exit tiers:

- **Tier A — Asset sale** ($4K–$12K): Codebase + brand + domain. Target: individual operators, developers, small agencies.
- **Tier B — Strategic sale** ($15K–$60K): Full platform with real listings and traffic data. Target: Colombian RE agencies, relocation companies, expat media brands.
- **Tier C — Angel raise** ($75K–$150K at $300K–$500K pre-money): Traction, real data layer, revenue signal. Target: Latin America-focused angels, real estate tech funds.

See `DECISIONS.md` for architectural decisions that support each exit tier.

---

## License

Proprietary. All rights reserved.
