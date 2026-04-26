# CasaClaro — Architectural Decisions

This document records key decisions made during the build of CasaClaro. It exists to help buyers, investors, and future maintainers understand *why* choices were made, not just what the code does.

---

## 1. Leaflet direct (not react-leaflet)

**Decision:** Use Leaflet 1.9 directly via `useRef`/`useEffect` imperative initialization, not react-leaflet.

**Why:** react-leaflet v4.x declares React 18 as a peer dependency. CasaClaro runs React 19. The peer dep conflict causes runtime incompatibilities in production builds. Leaflet direct works cleanly with any React version since it operates on DOM refs outside the React render cycle.

**Trade-off:** More boilerplate in `ColombiaMap.tsx`. No React lifecycle hooks for map events — all handled imperatively. Acceptable for a single-map use case.

---

## 2. Synthetic data mode

**Decision:** All seed listings and city data are marked `is_synthetic: true`. The `useListings` hook returns seed data in dev mode and is stubbed for a future Supabase connection.

**Why:** The platform needs to be always-demoable with `pnpm dev`. Synthetic data allows full visual completeness without a database connection. The `is_synthetic` flag is displayed to users ("Demo listing") so no data is misrepresented.

**Migration path:** Replace `useListings` stub in `src/hooks/useListings.ts` with `supabase.from('listings').select('*')` when Supabase is wired. Keep synthetic fallback for dev mode via `NEXT_PUBLIC_USE_SYNTHETIC=true`.

---

## 3. Bilingual via next-intl (not i18next or manual)

**Decision:** Use next-intl 4.9.1 for internationalization with `localePrefix: "as-needed"` (English at root `/`, Spanish at `/es/`).

**Why:** next-intl integrates natively with the Next.js App Router, supports React Server Components, and handles locale detection via middleware without an external dependency. `localePrefix: "as-needed"` keeps English URLs clean (`/listings` not `/en/listings`) which is better for SEO in the primary market.

**Trade-off:** Spanish content requires the locale prefix (`/es/listings`), which is slightly less elegant but correct for Google's hreflang requirements.

---

## 4. CSS-in-JS with CSS custom properties (not Tailwind for layout)

**Decision:** Use inline styles with CSS custom properties (`var(--terracotta)`, `var(--ocean)`, etc.) as the primary styling system. Tailwind is installed but used minimally.

**Why:** The design uses a custom token system with semantic color names that reflect the brand and Colombia context. Inline styles make components completely self-contained — no dependency on a CSS file being loaded. CSS custom properties allow the token values to be overridden at runtime if needed (e.g., future theming).

**Trade-off:** Verbose JSX. No utility-class compression. Tailwind is available for any component where utility classes are more ergonomic (e.g., spacing, layout).

---

## 5. Dynamic OG image via `/api/og` (not static PNG)

**Decision:** Generate the OpenGraph image dynamically using `ImageResponse` from `next/og` at `/api/og`. No static `og-default.png` in `/public`.

**Why:** A dynamic OG image can be updated without a redeployment. The `edge` runtime ensures fast generation without cold starts. A static PNG would need to be regenerated and redeployed whenever the brand changes.

**Trade-off:** Requires the server to be running for OG image generation (no static export without modification). For a static export scenario, replace with a real PNG in `/public`.

---

## 6. `generateStaticParams` on listing detail pages

**Decision:** The listing detail route (`/listings/[slug]`) uses `generateStaticParams` to pre-render all slug pages at build time.

**Why:** Static pre-rendering means each listing page gets its own URL that Google can index immediately after deployment. No server-side rendering needed per request — the page is a static HTML file served from the CDN edge.

**Trade-off:** Adding a new listing requires a rebuild + redeploy to get it indexed. When Supabase is wired, this will need to shift to ISR (`revalidate: 3600`) or dynamic rendering for new listings.

---

## 7. Server / client component split on listing detail

**Decision:** `listings/[slug]/page.tsx` is a Server Component (exports `generateStaticParams`, `generateMetadata`). The actual UI lives in `components/listings/ListingDetail.tsx` as a Client Component.

**Why:** `generateMetadata` and `generateStaticParams` are Server Component exports — they cannot exist in a `"use client"` file. The UI needs `useLocale()` (a client-side hook) for bilingual rendering. The split keeps each layer in its correct RSC boundary.

---

## 8. Exit tier architecture

**Decision:** Every sprint either raises the Tier A/B floor or advances Tier C. No feature ships that doesn't serve one of those purposes.

**Tier definitions:**
- **A — Asset sale** ($4K–$12K): Codebase + brand + domain. Ready when: README complete, favicon live, OG image live, `pnpm build` green, disclosure sweep passed.
- **B — Strategic sale** ($15K–$60K): Add analytics, real listings, email capture, one partner relationship.
- **C — Angel raise** ($75K–$150K): Add Supabase, 500+ monthly visitors, 200+ email subscribers, one revenue touchpoint.

**Why:** This framework ensures the platform always has a credible exit at each stage of build maturity. It prevents sunk-cost continuation and gives every technical decision a commercial frame.

---

## 9. Plausible Analytics (not Google Analytics)

**Decision:** Plausible is the analytics target (script injected via `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` env var in layout). GA4 is not used.

**Why:** Plausible is privacy-first and GDPR-compliant without a cookie consent banner. The Colombia expat target market is privacy-aware. Plausible's dashboard is simpler for acquisition demos. GA4's event-based model requires configuration overhead that isn't worth it at this stage.

**Activation:** Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=casaclaro.co` in Vercel environment variables. The script only injects when the variable is present — no analytics in dev.

---

## 10. `localePrefix: "as-needed"` and href strategy

**Decision:** All internal links use bare paths (`/listings`, `/cities`) without locale prefix. `useLocale()` is used in client components where locale-aware content is needed.

**Why:** `localePrefix: "as-needed"` means the locale prefix is omitted for the default locale (English). Links with `/en/` prefix would break when the default locale changes. Bare paths work correctly for both locales — next-intl's middleware resolves them.

**Trade-off:** In bilingual client components, you cannot use next-intl's `Link` with typed routes without additional configuration. For now, plain `<a>` tags are used with bare hrefs.
