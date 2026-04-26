# Peak Equity Optimizer (PEO)

**Proprietary product of NoDrftSystems.**

A trust-based real-estate intelligence and execution platform with bilingual support (en-US / es-US), formula-governed analysis engine, triage and deal-readiness systems, marketplace, and multi-role RBAC.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict)
- **Auth**: Clerk
- **Database**: PostgreSQL (Prisma ORM)
- **Styling**: Tailwind CSS v4
- **I18n**: next-intl
- **Testing**: Vitest + jsdom + Playwright
- **Package Manager**: pnpm

## Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment template and configure
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. Run database migrations
pnpm prisma migrate dev

# 4. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint sweep |
| `pnpm test` | Run Vitest unit tests |

## Project Structure

```
src/
  app/              # Next.js App Router
    [locale]/       # Localized routes (en, es)
    api/            # API routes
  components/       # Shared UI components
  i18n/             # Internationalization config
  lib/
    auth/           # RBAC and server auth
    events/         # PII linting
    formulas/       # Formula engine (Layers A–G)
    investor/       # Investor analysis engine
    property-data/  # Rentcast integration + stub fallback
    readiness/      # Deal readiness generator
    triage/         # Triage engine
prisma/
  schema.prisma     # Database schema
  migrations/       # Migration files
tests/
  unit/             # Unit tests
  integration/      # Integration tests
messages/
  en.json           # English translations
  es.json           # Spanish translations
```

## User Roles

| Role | Level |
|------|-------|
| anonymous_visitor | 0 |
| free_user | 1 |
| seller_applicant | 2 |
| seller_verified | 3 |
| investor_basic | 4 |
| investor_advanced | 5 |
| vendor | 6 |
| admin_internal | 10 |

## Security & Compliance

- **PII Linting**: Event payloads are scanned for prohibited fields (address, name, email, phone, SSN, etc.)
- **RBAC**: 8-role hierarchy enforced across all routes and API endpoints
- **Dev Bypass**: Clerk auth can be bypassed locally for UI review via `NEXT_PUBLIC_DEV_BYPASS=true`

## License

Proprietary — All rights reserved. No external publishing approved.
