# PharmacyOS — Frontend Application

Vite + React + TypeScript single-page application. Authenticated-only internal pharmacy operations tool.

**Authority:** ADR Decision 1 — `04_products/pharmacyos/00_governance/architecture-decision-record.md`

## Stack

- React 19 + TypeScript (strict mode)
- Vite (port 3000 dev, ESNext build target)
- Tailwind CSS v4 (CSS-first config, no `tailwind.config.js`)
- shadcn/ui (initialized when first primitive is needed — not pre-installed)
- @phosphor-icons/react (regular weight)
- TanStack Query v5 (server state) + Zustand (POS cart only)
- React Router v6 (added in build phase, not yet wired)
- Supabase JS SDK (`@supabase/supabase-js`)

## Setup

```bash
cd 04_products/pharmacyos/app
npm install
cp .env.example .env.local   # then fill in Supabase values
npm run dev                  # http://localhost:3000
```

## Scripts

- `npm run dev` — Vite dev server on port 3000
- `npm run build` — TypeScript check + production build
- `npm run lint` — ESLint
- `npm run preview` — preview production build locally

## Layout (planned — populated during build phase)

```
src/
├── components/
│   ├── ui/             shadcn/ui primitives (copied, owned)
│   └── [feature]/      feature-specific components
├── config/
│   ├── route-permissions.ts
│   └── supabase.ts     Supabase client
├── hooks/              TanStack Query hooks (one per data entity)
├── layouts/            AdminPortalLayout, PosLayout, AuthLayout
├── pages/              one file per route, organized by module
├── router.tsx          single React Router v6 definition
├── stores/             Zustand stores (POS cart only)
├── styles/
│   └── globals.css     Tailwind v4 + design tokens
├── types/              database entity types
└── main.tsx            entry point
```

## Environment Variables

Only public-safe values may be `VITE_*` (per ADR Decision 11). Secrets belong in Supabase Edge Function secrets, not here.

| Variable | Required | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | yes | Project URL from Supabase dashboard |
| `VITE_SUPABASE_ANON_KEY` | yes | Public anon key — RLS is the security layer, not this key |

## Build Discipline

- `prototype/` is reference only — never imported by `src/`
- Design tokens live in `src/styles/globals.css` only — no hardcoded hex
- Auth/RBAC enforcement happens at three layers: RLS (Supabase), Edge Function JWT, React route guard
