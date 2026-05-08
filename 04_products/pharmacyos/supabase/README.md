# Supabase — PharmacyOS

Backend project: `pharmacyos-dev` (NoDrftSystems org, Free tier — single environment per Founder direction 2026-05-08).

## Layout

```
supabase/
├── config.toml         Supabase CLI project config
├── seed.sql            Local development seed data
├── migrations/         Numbered SQL migrations (DSS owns)
├── functions/          Edge Functions (BLS / IDS own)
├── .gitignore
└── .env.example        Edge Function secrets template
```

## Local Setup (one-time, per developer machine)

1. Install Supabase CLI (Windows):
   - Scoop: `scoop install supabase`
   - Or download from [github.com/supabase/cli/releases](https://github.com/supabase/cli/releases)
2. `supabase login`
3. From `04_products/pharmacyos/`:
   - `supabase link --project-ref <project-ref>` (project ref from Supabase dashboard)

## Migrations

- New migration: `supabase migration new <name>` from `04_products/pharmacyos/`
- Apply locally: `supabase db push` (against linked project)
- Production migrations require SCA review per ADR Decision 12 — never auto-deploy without review

## Edge Functions

- New function: `supabase functions new <name>`
- Deploy: `supabase functions deploy <name>`
- Set secret: `supabase secrets set KEY=value` — never commit real values
- All Claude Vision and Lynk credential use lives here, never in `app/`

## RLS Policy Discipline

Every table containing patient, prescription, schedule drug, audit, or financial data must have RLS policies before any client query is written. SCA reviews all RLS policies before merge.
