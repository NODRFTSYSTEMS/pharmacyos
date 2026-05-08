# ARCHITECTURE DECISION RECORD: PharmacyOS — Winchester Global Pharmacy Operations Platform

**Date:** 2026-05-07
**Project:** PharmacyOS — NoDrftSystems proprietary platform (Winchester Global Pharmacy is first licensed deployment per [decision-log.md DL-001](decision-log.md))
**Author:** SAA (Samara) — Solution Architecture Assistant
**Status:** **APPROVED** — Founder authorized 2026-05-08 (gacrespservices@gmail.com, in-session)
**Classification:** Internal — NoDrftSystems Proprietary. Do not commit to client repositories.
**Build Class:** Class 3 — Integration or Data-Sensitive (Class 4 treatment at auth, JDPA, and financial surfaces)
**Repository:** github.com/NODRFTSYSTEMS/pharmacyos (private)
**Governance reference:** `04_products/pharmacyos/00_governance/build-activation-packet.md`

---

## Approval

**Founder approval:** 2026-05-08, in-session authorization. Scaffolding work in `app/` and `supabase/` proceeded under this approved architecture; build verified passing (`tsc -b && vite build`).

**Documented architectural drift from ADR text:**
- React 19 (Vite default scaffold) vs. ADR's "React 18" specification — forward-compatible for the patterns specified throughout the ADR; no architectural change required. Future ADR revisions should reference React 19 or current.

**ARE technical review:** Reserved for Gate 6 (pre-production deployment). ARE does not gate scaffolding or schema work; ARE gates production deployment.

---

## Preamble

This ADR is a mandatory Gate 1A deliverable. No production code may be scaffolded, no Supabase project provisioned, and no build instructions issued to FIS, BLS, DSS, or IDS until this document is reviewed by ARE and approved by Founder.

Every decision below is firm. Where rationale references a rejected alternative, that alternative is closed. Agents implementing this build do not re-open these decisions — they escalate to SAA if constraints change.

---

## Decision 1: Frontend Framework

### Decision

**React 18 + TypeScript + Vite.** Do not use Next.js for this build.

### Rationale

PharmacyOS is a single-tenant, authenticated-only internal operations tool. It has no public routes, no SEO surfaces, no server-rendered marketing pages, and no requirement for search engine indexing. Every route in the 43-route application sits behind an authentication gate. The primary differentiators Next.js provides — server-side rendering for public content, static site generation, SEO-optimized routing, and image optimization for marketing pages — are irrelevant to this use case.

Vite delivers faster local development iteration than Next.js for a React SPA, which matters across a 43-route build with a complex component library. The existing Winchester Phase 1 informational site (a separate engagement) runs on React + Vite + Tailwind + shadcn/ui; using the same base avoids tooling context switching for the NoDrftSystems build team. Supabase client SDK integrates identically with both frameworks.

The one argument for Next.js — API route handlers as an alternative to Supabase Edge Functions for server-side Claude Vision API calls — is superseded by Decision 3, which resolves server-side execution entirely via Supabase Edge Functions. No Next.js API layer is needed.

### Implementation Notes for FIS

- Scaffold with: `npm create vite@latest app -- --template react-ts`
- TypeScript strict mode: on. `tsconfig.json` must set `"strict": true`.
- `vite.config.ts` must configure path aliases: `@/` maps to `src/`.
- Development server runs on port 3000 (`server.port: 3000` in `vite.config.ts`).
- Production build target: ESNext. No IE or legacy browser polyfills required (Chrome + Edge current and current-1 only).
- `src/` is the entire application root. Nothing outside `src/` is application code.

---

## Decision 2: Styling Stack

### Decision

**Tailwind CSS v4 + shadcn/ui + @phosphor-icons/react. Fonts loaded via Google Fonts CSS import in `index.html`.**

### Rationale

Tailwind CSS v4 is the current version as of this build date. Tailwind v4 introduces CSS-first configuration; the token set defined in the design handoff (Section 2 of the design handoff document) maps directly to CSS custom properties, which Tailwind v4 handles natively without a JavaScript config object. This means the design handoff token set becomes the authoritative source — color tokens, type scale, spacing scale, border radius, and shadow tokens are defined once in a CSS file and referenced throughout.

shadcn/ui provides unstyled, composable primitives (Dialog, Sheet, Popover, Select, Command, Table, Form) that accept Tailwind utility classes directly. This is the correct pattern for a design system that has specified its own token vocabulary — we get accessible, keyboard-navigable primitives without fighting a pre-styled component library's opinions. shadcn/ui components are copied into the repo and owned by the build; they do not create a runtime dependency.

@phosphor-icons/react is the React package for Phosphor Icons, specified in the design handoff. Install as a production dependency. Use the `regular` weight variant consistently (the design handoff specifies regular weight). Icon sizing follows the handoff: 16px inline, 20px default, 24px POS.

Inter and JetBrains Mono are both available on Google Fonts. Loading via a single `<link>` in `index.html` is the correct pattern for an internal authenticated tool with no cold-start performance constraints from search crawlers. Preconnect to `https://fonts.googleapis.com` and `https://fonts.gstatic.com`.

### Implementation Notes for FIS

**Tailwind CSS v4 setup:**
- Install: `npm install tailwindcss @tailwindcss/vite`
- Add `@tailwindcss/vite` plugin to `vite.config.ts`
- Create `src/styles/globals.css` — this file defines the design system token set as CSS custom properties and imports Tailwind layers. This is the single source of truth for all design tokens.
- Do not use a `tailwind.config.js` file for token definitions. Use CSS custom properties only (Tailwind v4 pattern).

**shadcn/ui setup:**
- Initialize with `npx shadcn@latest init`
- Components live in `src/components/ui/`
- Add components as needed per feature. Do not pre-install the entire library.

**Phosphor Icons:**
- Install: `npm install @phosphor-icons/react`
- Import named icons: `import { Package, Pill, User } from '@phosphor-icons/react'`
- Always pass `aria-label` to icons that carry meaning without adjacent text labels.
- Never use icons as the sole carrier of semantic meaning.

**Font loading in `index.html`:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

**Design token CSS file structure (`src/styles/globals.css`):**
Define all tokens from Section 2 of the design handoff as CSS custom properties in `:root`. Tailwind arbitrary values reference these (e.g., `bg-[--color-bg-sidebar]`). No hardcoded hex values anywhere in component files — all color references go through the token.

---

## Decision 3: Backend Architecture

### Decision

**Supabase-only backend: Supabase Auth + PostgreSQL (via Supabase JS client SDK) + Row-Level Security + Supabase Edge Functions (Deno) for server-side operations. No separate API layer, no Express server, no serverless Lambda functions outside of Supabase.**

### Rationale

PharmacyOS is a single-tenant application for approximately 12 concurrent users. The data access patterns are standard CRUD with well-defined role boundaries — exactly what Supabase's client SDK + RLS combination is engineered for. A separate API layer (Express, Fastify, or a Next.js API route equivalent) would add infrastructure cost, deployment complexity, and a second codebase surface to maintain for no material benefit at this scale.

The constraint that drives the only exception: the Anthropic Claude Vision API key must never be exposed client-side. Client-side code in a browser is public by definition — any environment variable prefixed with `VITE_` is bundled into the JavaScript payload and readable by any authenticated user opening browser DevTools. The Claude API key, the Lynk payment processing credentials, and any other secret that must not be readable by staff belong server-side only.

Supabase Edge Functions (Deno runtime) are the correct resolution. They run server-side, close to the database, support Deno environment variables that are never transmitted to the browser, and integrate with Supabase Storage triggers for the AI job queue pattern. They are deployed as part of the same Supabase project, not as a separate infrastructure concern.

RLS policies on every table containing patient data, prescription data, schedule drug data, or audit data are non-negotiable. The Supabase client SDK never bypasses RLS — the service role key (which does bypass RLS) is used only in Edge Functions, never in client-side code.

### Implementation Notes for BLS and DSS

**Client SDK usage rules:**
- Client-side code uses the `supabase-js` client initialized with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only.
- The `anon` key is safe to expose — it is the public-facing key; RLS policies are the enforcement layer, not key secrecy.
- The service role key (`SUPABASE_SERVICE_ROLE_KEY`) is used only inside Edge Function bodies. It must never appear in `src/` application code.

**RLS requirement:**
- Every table receives RLS policies before any client query is written against it.
- DSS owns the RLS policy definitions. SCA reviews all RLS policies before any data access code is merged.
- The pattern for role enforcement: custom JWT claims carry the user's role; RLS policies check `auth.jwt() ->> 'role'` against permitted values.

**Edge Functions are used for:**
1. Claude Vision API invocations (invoice scanner, Rx scanner) — see Decision 4
2. Any operation that requires the service role key to bypass RLS for administrative writes (e.g., audit log inserts that must succeed regardless of the acting user's role)
3. Lynk payment processing — any server-side signature or credential use
4. Schedule drug log PDF/CSV generation if it requires elevated data access

**Edge Functions are NOT used for:**
- Standard CRUD that RLS handles correctly
- Read operations where the requesting user has legitimate access
- Authentication flows (Supabase Auth handles these natively)

---

## Decision 4: AI Integration Pattern

### Decision

**Claude Vision API calls are made exclusively from Supabase Edge Functions. The job queue pattern is: file upload to Supabase Storage → database record insert (status: pending) → Edge Function invoked (via Supabase webhook or direct HTTP call from frontend) → Edge Function reads file from Storage → calls Claude Vision API → writes extracted fields + confidence scores to database (status: complete) → frontend reads result via Supabase Realtime subscription on the job record.**

**Model assignments:**
- Invoice scanning (supplier invoices): `claude-haiku-4-5-20251001` — structured line-item extraction, high volume, cost-sensitive
- Prescription scanning (clinical Rx documents): `claude-sonnet-4-6` — higher accuracy required for clinical data; confidence scoring on every field is mandatory

### Rationale

The Claude Vision API key is a secret credential. As established in Decision 3, it must live server-side only. Supabase Edge Functions are the designated server-side execution environment for this build.

The job queue pattern (upload → pending record → async process → result read) is chosen over a synchronous request-response pattern for two reasons. First, Claude Vision processing is not instantaneous — a prescription image may take 3–8 seconds to process. A blocking HTTP call from the frontend to an Edge Function that holds the connection open for that duration creates a poor user experience and risks timeout on slow connections. Second, the job record in the database provides an audit trail: every AI extraction job records who initiated it, what file was submitted, what was extracted, and what confidence scores were returned. This audit trail is a regulatory requirement for prescription scanning (Jamaica Pharmacy Act) and a quality requirement for invoice processing.

Model selection by use case: invoice scanning processes structured commercial documents with predictable layout (drug name, quantity, unit price, total). Haiku handles this class of document reliably at significantly lower cost per call. Prescription scanning processes handwritten or printed clinical documents where misreading a drug name, dosage, or quantity has patient safety implications. Sonnet provides the accuracy margin required. The confidence scoring requirement (fields below 85% confidence flagged amber, Confirm All disabled until edited) provides the human-in-the-loop check that mitigates remaining extraction error.

### Implementation Notes for BLS and IDS

**Edge Function names:**
- `process-invoice-scan` — handles supplier invoice extraction (Haiku)
- `process-rx-scan` — handles prescription image extraction (Sonnet)

**Edge Function invocation pattern:**
Frontend uploads the image file to Supabase Storage (bucket: `ai-uploads`, path: `{userId}/{jobId}/{filename}`). Frontend inserts a row into `ai_jobs` table with `status: 'pending'`, `job_type: 'invoice' | 'rx'`, `storage_path`, `initiated_by` (user ID). Frontend calls the appropriate Edge Function via `supabase.functions.invoke('process-invoice-scan', { body: { jobId } })` — this call is non-blocking from the UI perspective (fire and subscribe). Frontend opens a Realtime subscription on the `ai_jobs` row for that `jobId`.

**Edge Function body (pattern — not implementation code):**
1. Receive `jobId`
2. Fetch the job record from `ai_jobs` using service role key
3. Update status to `processing`
4. Read the file from Supabase Storage using the `storage_path`
5. Call the Claude Vision API with the appropriate system prompt and the file content (base64 encoded)
6. Parse the response; compute per-field confidence scores
7. Write extracted fields and confidence scores to `ai_job_results` table
8. Update `ai_jobs` status to `complete` (or `failed` with `error_message` if the API call fails)
9. Return 200. The frontend Realtime subscription fires on the status change.

**Confidence scoring rule (enforced in Edge Function, mirrored in UI):**
- Every extracted field carries a `confidence` float (0.0–1.0)
- Fields with `confidence < 0.85` are returned with `flagged: true`
- The AI Review Panel renders flagged fields with amber background and edit affordance
- Confirm All button is disabled in the frontend until no `flagged: true` fields remain unedited
- This logic lives in the frontend UI — the Edge Function always returns raw scores; the 0.85 threshold is a UI business rule constant

**Claude Vision API prompt strategy:**
- System prompt specifies the exact JSON schema to return for each document type (invoice fields vs. Rx fields)
- Request the model to return a `confidence` float for each field, not just the extracted value
- IDS owns the prompt engineering for both document types; prompts are stored in the Edge Function code, not in the database
- Prompts are versioned with the Edge Function deployment; any prompt change requires a new deployment, not a database update

**API key storage:**
- Anthropic API key stored as a Supabase Edge Function secret: `ANTHROPIC_API_KEY`
- Never in `VITE_` environment variables
- Never in the Supabase project's table data
- Never logged

---

## Decision 5: Real-Time Pattern

### Decision

**Supabase Realtime subscriptions for the prescription queue kanban. One subscription per kanban view, filtering on `status IN ('received','verified','filled','dispensed')`. No polling. No websocket library outside of the Supabase client.**

### Rationale

The prescription queue is the operational core of the platform — multiple pharmacists and technicians working concurrently need to see status transitions as they happen (Received → Verified → Filled → Dispensed). Supabase Realtime provides change-data-capture over a websocket connection with table-level and row-level filtering, which is exactly what the kanban requires.

Polling (repeated fetch calls on an interval) is rejected because it creates predictable load on the database at defined intervals, introduces artificial latency (the UI is always up to N seconds behind reality), and adds complexity to manage (interval management, deduplication, cleanup on unmount). At 12 concurrent users, Supabase Realtime's websocket model is the correct choice.

Third-party websocket libraries (Socket.io, Ably, Pusher) are rejected because Supabase Realtime is already available as part of the Supabase project at no additional cost, requires no additional infrastructure, and covers the use case completely.

### Implementation Notes for FIS and BLS

**Tables requiring Realtime:**
- `prescriptions` — for the kanban queue; subscribe on `status` column changes
- `ai_jobs` — for the AI scanner panel; subscribe on the specific `job_id` row for status updates

**Enable Realtime on these tables in Supabase Dashboard:** Tables must have Realtime publication enabled. DSS adds this to the migration scripts as a `supabase_realtime` publication statement.

**Subscription lifecycle (FIS):**
- Subscribe on component mount
- Clean up the subscription channel on component unmount (`channel.unsubscribe()`)
- Use React's `useEffect` cleanup function — never leak subscriptions

**Kanban update strategy:**
- On `INSERT` or `UPDATE` event for a prescription row: update local state with the new record. Do not re-fetch the entire kanban — update the single changed card in the local React state.
- On status change that moves a card between columns: remove from the source column array, add to the destination column array.
- Optimistic updates are used for the acting user's own drag actions (they see the move immediately); Realtime confirms the server state and reconciles.

**Realtime is NOT used for:**
- General data tables (inventory, patient records, reports) — these are fetched on navigation and refreshed on explicit user action only
- Auth state — managed by Supabase Auth's `onAuthStateChange` listener (not Realtime)

---

## Decision 6: File Storage

### Decision

**Supabase Storage with two buckets: `prescription-images` (private, authenticated access, pharmacist and technician roles only) and `invoice-images` (private, authenticated access, technician and manager roles only). AI-processed files are stored in a third bucket `ai-uploads` (private, temporary staging for the AI job pipeline, auto-expiry policy).**

### Rationale

Supabase Storage is already part of the Supabase project. Using it avoids a second storage vendor (Vercel Blob, S3, Cloudflare R2) and keeps all data — relational, file, and auth — in a single Supabase project with unified access control.

Prescription images contain protected health information (drug name, patient name, prescriber details) and are regulated under JDPA. They must be stored in a private bucket — no public URL access, ever. Access to these files is mediated by Supabase Storage policies that check the authenticated user's JWT role claim.

Invoice images are supplier commercial documents. Less sensitive than prescription images but still proprietary business data. Same private bucket policy applies.

The `ai-uploads` bucket is a staging area: files are uploaded, processed by the Edge Function, and can be deleted after the job completes and results are written. This keeps the AI processing pipeline clean and avoids accumulating raw upload files indefinitely.

No Vercel Blob. No S3. No external storage vendor for Phase 1.

### Implementation Notes for DSS and SCA

**Bucket configuration (DSS includes in Supabase project setup):**

`prescription-images` bucket:
- Public: false
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`
- Max file size: 10MB
- Storage policy: `SELECT` and `INSERT` allowed for `authenticated` users where JWT role claim is `pharmacist` or `pharmacy_technician`
- `DELETE`: not permitted by any role via client SDK; deletion requires Edge Function with service role key

`invoice-images` bucket:
- Public: false
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`
- Max file size: 10MB
- Storage policy: `SELECT` and `INSERT` allowed for `authenticated` users where JWT role claim is `pharmacy_technician` or `manager`

`ai-uploads` bucket:
- Public: false
- Purpose: temporary staging for AI job pipeline only
- Storage policy: `INSERT` allowed for `authenticated` users (any role may trigger an AI job); `SELECT` allowed for the Edge Function service role only
- Lifecycle: files older than 48 hours deleted by a scheduled Edge Function (`cleanup-ai-uploads`)

**File path convention:**
```
prescription-images/{patientId}/{prescriptionId}/{filename}
invoice-images/{supplierId}/{receiveSessionId}/{filename}
ai-uploads/{userId}/{jobId}/{filename}
```

**SCA requirement:** Storage policy SQL must be reviewed by SCA (Omari) before any file upload code is written. Storage policies are as security-critical as RLS policies.

---

## Decision 7: Authentication Design

### Decision

**Supabase Auth with email + password as the credential mechanism. TOTP-based 2FA using Supabase Auth's built-in MFA support (AAAA level — TOTP via authenticator app + backup codes). Role stored as a custom JWT claim in the user's JWT, populated from a `user_profiles` table via a Supabase Auth hook. Role enforced at three layers: RLS policies (database), Edge Function JWT verification (API), and React route guards (UI).**

### Rationale

Supabase Auth supports TOTP-based MFA natively as of the current version. This covers the 2FA requirement without a third-party MFA provider (Twilio Authy, Auth0, etc.). Backup codes are generated and stored during MFA enrollment — Supabase Auth handles this in the enrollment flow.

Email + password is the correct credential type for an internal staff tool in a single-tenant deployment. There is no SSO requirement in the SOW (no Google Workspace, no SAML). If the client introduces SSO in a future phase, Supabase Auth supports it without architecture change.

Role is stored as a custom JWT claim because RLS policies need to check role without an additional database lookup per query. The claim is set via a Supabase Auth hook (`custom_access_token_hook`) that reads the user's role from `user_profiles` and injects it into the JWT at token issuance. This means the role is always current-as-of-last-login — role changes by an Admin take effect at the user's next login or token refresh.

Three-layer enforcement is required because no single layer is sufficient alone: RLS prevents unauthorized data access at the database level (even if the application layer fails), Edge Function verification prevents unauthorized server-side operations, and React route guards prevent unauthorized screen access (UX enforcement, not a security boundary — the other two layers are the security boundary).

The 5-wrong-2FA-attempt lockout is implemented via a combination of Supabase Auth's built-in rate limiting and an application-level counter in `security_events` table. Admin must manually unlock accounts through the Admin module.

### Implementation Notes for SCA, BLS, and FIS

**Supabase Auth MFA setup:**
- Enable MFA (TOTP) in Supabase Auth settings
- Enrollment flow: after first login, if `user_profiles.mfa_enrolled = false`, redirect to MFA setup screen before entering the application
- TOTP: standard 6-digit, 30-second rotating code. Compatible with Google Authenticator, Authy, 1Password, Microsoft Authenticator.
- Backup codes: 8 codes, single-use, generated at enrollment. User must download/save before completing enrollment.

**JWT custom claim hook (`custom_access_token_hook`):**
- Edge Function or database function that runs on token issuance
- Reads `role` from `user_profiles` where `user_id = auth.uid()`
- Adds `{ "role": "pharmacist" | "pharmacy_technician" | "front_desk_cashier" | "manager" | "admin" }` to the JWT claims
- Role values are snake_case strings — consistent across JWT, RLS, and application code

**Session configuration:**
- JWT expiry: 1 hour
- Refresh token: 7 days
- `auth.persistSession: true` in Supabase client configuration
- Session is stored in `localStorage`. PharmacyOS is an internal tool on managed devices — `localStorage` is appropriate. Cookie-based sessions are not required.

**Route guard implementation (FIS):**
- `ProtectedRoute` component wraps all authenticated routes
- Checks `session !== null` — if not authenticated, redirect to `/login`
- `RoleGuard` component wraps role-restricted routes
- Checks `session.user.app_metadata.role` against the permitted roles array for that route
- Unauthorized role: redirect to `/unauthorized` (a rendered screen with role explanation and a "Go to Dashboard" link — not a 404)
- Never hide unauthorized routes with a 404 — always redirect explicitly

**Role-to-route access matrix:**
DSS produces this matrix as part of the schema document. SCA reviews it. FIS implements it. The matrix must be a named constant in the codebase (`src/config/route-permissions.ts`) — not scattered across individual route components.

**Audit trail:**
- Every state-changing action (INSERT, UPDATE, DELETE on regulated tables) writes an entry to `audit_log`
- Audit log writes are performed by database triggers, not by application code — this ensures they cannot be bypassed by a bug or omission in the frontend
- DSS designs the trigger set; SCA reviews; BLS does not need to write audit inserts manually

---

## Decision 8: State Management

### Decision

**TanStack Query (React Query) v5 for all server state (data fetched from Supabase). Zustand for the POS cart local state only. Supabase Realtime subscriptions handle live updates on the prescription kanban (as per Decision 5). No Redux. No React Context for server data.**

### Rationale

A 43-route application with multiple concurrent data fetching operations, caching requirements, and background refresh needs a structured server state layer. TanStack Query provides: automatic caching and deduplication of identical requests, background refetch on window focus, stale-while-revalidate semantics, loading and error state management, and mutation management with optimistic updates. Writing this infrastructure manually with `useEffect` + `useState` produces inconsistent, hard-to-maintain code across 43 routes. TanStack Query eliminates that category of error.

Supabase Realtime subscriptions are not a replacement for TanStack Query — they handle push updates for live tables (prescription queue), while TanStack Query handles the initial fetch, caching, and synchronization for everything else. The two work together: TanStack Query populates the kanban on initial load; Realtime updates individual cards as status changes arrive.

Zustand is chosen for the POS cart because the cart is purely local, client-side state with no server persistence between renders. It is a shopping cart accumulator that is resolved and cleared at transaction completion. This is exactly the use case Zustand is suited for — small, bounded, synchronous local state that does not belong in a server state cache. Using TanStack Query for the cart would be incorrect (there is no server entity to fetch or mutate until checkout).

No Redux. Redux is appropriate for large-scale applications with complex shared state across many slices. PharmacyOS has one piece of genuinely complex local state (the POS cart) and otherwise pure server state. Redux overhead is unjustified.

React Context is not used for server data. Context re-renders all consumers on change — using it as a data store for tables or queue state would cause performance problems in a data-dense application.

### Implementation Notes for FIS

**TanStack Query setup:**
- Install: `npm install @tanstack/react-query`
- Install devtools: `npm install @tanstack/react-query-devtools`
- Wrap app in `QueryClientProvider` in `src/main.tsx`
- Default `staleTime`: 30 seconds for most data. Override per query where needed (e.g., audit log: 0 stale time, always fresh).
- All Supabase queries are wrapped in `useQuery` hooks. Pattern: one custom hook per data entity, located in `src/hooks/` (e.g., `useInventory.ts`, `usePrescriptions.ts`).
- All Supabase mutations use `useMutation`. Invalidate relevant query keys on success.

**Query key conventions:**
```
['prescriptions', 'queue']          — kanban data
['prescriptions', id]               — single prescription detail
['inventory', 'stock']              — stock overview
['inventory', 'drug', id]           — single drug detail
['patients', 'search', term]        — patient search results
['patients', id]                    — patient profile
['ai-jobs', id]                     — single AI job status
['reports', type, dateRange]        — report data
```

**Zustand POS cart store:**
- Install: `npm install zustand`
- Store location: `src/stores/posCart.ts`
- State: `{ items: CartItem[], customerId: string | null, loyaltyDiscount: number }`
- Actions: `addItem`, `removeItem`, `updateQuantity`, `applyLoyalty`, `clearCart`
- Cart persists in memory only — `sessionStorage` persistence is not required; clearing the cart on page refresh is acceptable UX for a POS terminal

**Realtime + TanStack Query integration:**
- Initial kanban load: TanStack Query fetches all prescriptions in active statuses
- Realtime subscription fires on INSERT/UPDATE: call `queryClient.setQueryData` to update the cached kanban state directly (avoid a full refetch on every card move)

---

## Decision 9: Routing

### Decision

**React Router v6 (react-router-dom v6). No TanStack Router.**

### Rationale

React Router v6 is the industry-standard routing library for React SPAs. It is stable, well-documented, and the NoDrftSystems build team has existing experience with it. TanStack Router offers type-safe route definitions and built-in data loading — both desirable features — but introduces a steeper learning curve and a less mature ecosystem at this build date. The complexity benefit does not justify the adoption risk for a 43-route internal tool with an aggressive delivery timeline.

React Router v6's `createBrowserRouter` with `RouterProvider` is the correct API (not the legacy `BrowserRouter` wrapping pattern). Nested routes map to the three layout shells (Admin Portal, POS Terminal, Auth). The `ProtectedRoute` and `RoleGuard` components from Decision 7 integrate as wrapper components within the route tree.

### Implementation Notes for FIS

**Install:** `npm install react-router-dom`

**Router structure (high-level):**
```
createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: '2fa', element: <TwoFactorPage /> },
    ]
  },
  {
    path: '/app',
    element: <ProtectedRoute><AdminPortalLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: 'inventory',
        element: <RoleGuard roles={['pharmacist','pharmacy_technician','manager','admin']}><Outlet /></RoleGuard>,
        children: [ /* 8 inventory routes */ ]
      },
      /* ... all module route groups ... */
      {
        path: 'admin',
        element: <RoleGuard roles={['admin']}><Outlet /></RoleGuard>,
        children: [ /* 4 admin routes */ ]
      }
    ]
  },
  {
    path: '/pos',
    element: <ProtectedRoute><RoleGuard roles={['front_desk_cashier','manager','admin']}><PosLayout /></RoleGuard></ProtectedRoute>,
    children: [ /* 10 POS routes */ ]
  },
  { path: '/unauthorized', element: <UnauthorizedPage /> },
  { path: '*', element: <NotFoundPage /> }
])
```

**Route file location:** `src/router.tsx` — single file, not scattered across feature folders.

**Lazy loading:** All route-level page components are lazy-loaded with `React.lazy` + `Suspense`. This keeps the initial bundle small. Suspension fallback: skeleton loader matching the page layout (not a spinner in the center of the screen).

**Navigation:** Use `useNavigate` hook. Never use `window.location.href` for in-app navigation.

---

## Decision 10: Repository and Project Layout

### Decision

**Single repository, no monorepo tooling. Frontend application in `app/`. Supabase project artifacts (migrations, Edge Functions, seed data) in `supabase/` at repository root. Prototype in `prototype/` is reference-only and never imported by production code.**

### Rationale

This is a single product with a single frontend and a single Supabase backend. Monorepo tooling (Turborepo, Nx, pnpm workspaces) is appropriate when multiple independently deployable packages exist in the same repository. PharmacyOS has two deployable units: the Vite frontend (Vercel) and the Supabase project (Edge Functions + migrations). The Supabase CLI manages the Supabase artifacts natively with a `supabase/` directory convention — this is the standard Supabase project layout and requires no additional monorepo tooling.

### Implementation Notes for FIS, BLS, and DSS

**Repository layout (authoritative):**
```
pharmacyos/
├── .gitignore
├── README.md                          ← internal, not client-facing
├── 00_governance/                     ← ADR, build activation packet, design handoff, evidence ledger
│
├── app/                               ← Vite React TypeScript application
│   ├── public/                        ← static assets (favicon, logo SVG)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                    ← shadcn/ui primitives (copied, owned)
│   │   │   └── [feature]/             ← feature-specific components
│   │   │       e.g., prescriptions/, inventory/, pos/, patients/
│   │   ├── config/
│   │   │   ├── route-permissions.ts   ← role-to-route access matrix (authoritative)
│   │   │   └── supabase.ts            ← Supabase client initialization
│   │   ├── hooks/                     ← TanStack Query hooks (one file per data entity)
│   │   ├── layouts/
│   │   │   ├── AdminPortalLayout.tsx
│   │   │   ├── PosLayout.tsx
│   │   │   └── AuthLayout.tsx
│   │   ├── pages/                     ← one file per route, organized by module
│   │   │   ├── auth/
│   │   │   ├── inventory/
│   │   │   ├── prescriptions/
│   │   │   ├── patients/
│   │   │   ├── pos/
│   │   │   ├── reporting/
│   │   │   ├── ai/
│   │   │   └── admin/
│   │   ├── router.tsx                 ← single router definition
│   │   ├── stores/
│   │   │   └── posCart.ts             ← Zustand POS cart store
│   │   ├── styles/
│   │   │   └── globals.css            ← design token CSS custom properties + Tailwind layers
│   │   ├── types/                     ← TypeScript types for all database entities
│   │   └── main.tsx                   ← app entry point
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── supabase/
│   ├── config.toml                    ← Supabase CLI project config
│   ├── migrations/                    ← numbered SQL migration files (DSS owns)
│   │   └── 0001_initial_schema.sql
│   ├── functions/                     ← Supabase Edge Functions (BLS / IDS own)
│   │   ├── process-invoice-scan/
│   │   │   └── index.ts
│   │   ├── process-rx-scan/
│   │   │   └── index.ts
│   │   └── cleanup-ai-uploads/
│   │       └── index.ts
│   └── seed.sql                       ← development seed data (roles, test users)
│
└── prototype/                         ← vanilla React JSX reference prototype
    └── [existing files — read-only reference, never imported]
```

**Prototype rule:** No file in `prototype/` may be imported by any file in `app/` or `supabase/`. The prototype is a visual and UX reference only. FIS reads it for design intent; they do not copy paste from it into production code. Production code is written from scratch to TypeScript standards.

---

## Decision 11: Environment Configuration

### Decision

**Two environment contexts: client-side (Vite — VITE_ prefix) and server-side (Supabase Edge Functions — Deno env). These are completely separate. No secret credential ever appears in the VITE_ namespace.**

### Rationale

Vite bundles all `VITE_` environment variables into the JavaScript payload delivered to the browser. Any staff member with DevTools access can read them. Therefore, the only values in `VITE_` are values that are safe to be read by any authenticated user of the application. The Supabase anon key and project URL are safe (anon key is designed to be public; RLS is the security layer). The Anthropic API key, Supabase service role key, and Lynk payment credentials are never in VITE_ variables.

### Environment Variables — Complete List

**Client-side (`app/.env.local` — checked into `.gitignore`, never committed):**
```
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
```

**Supabase Edge Function secrets (set via Supabase CLI `supabase secrets set`):**
```
ANTHROPIC_API_KEY=[key]                   ← Claude Vision API
SUPABASE_SERVICE_ROLE_KEY=[key]           ← Edge Function DB access (bypasses RLS)
LYNK_API_KEY=[key]                        ← Lynk payment processing
LYNK_API_SECRET=[secret]                  ← Lynk payment signing secret
```

**Supabase Edge Functions also have automatic access to:**
```
SUPABASE_URL                              ← injected automatically by Supabase runtime
SUPABASE_ANON_KEY                         ← injected automatically
```

**`.gitignore` requirements (in addition to existing NoDrftSystems `.gitignore` standard):**
```
app/.env
app/.env.local
app/.env.*.local
supabase/.env
```

**`app/.env.example` (committed — no real values):**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Verification rule:** Before every commit, confirm `git diff --cached | grep -i 'ANTHROPIC\|SERVICE_ROLE\|LYNK_API'` returns empty. If not, stop and remove the file from staging. SCA must be notified of any credential exposure incident.

---

## Decision 12: Deployment

### Decision

**Frontend: Vercel (Production + Preview environments). Backend: Supabase hosted (managed infrastructure — no self-hosted Postgres). Deployments are not manual — both platforms use CI/CD connected to the GitHub repository. Production Vercel deployment requires Founder authorization before the first promotion.**

### Rationale

Vercel is the NoDrftSystems standard frontend hosting platform. For a Vite SPA, Vercel functions as a static host — there is no server-side rendering, no Vercel serverless functions, no API routes. The entire server-side layer is Supabase. This is the cleanest possible separation: Vercel serves static files; Supabase runs everything else.

Supabase hosted (cloud) is correct for Phase 1. Self-hosted Supabase introduces infrastructure management overhead (VM provisioning, Postgres version management, backup configuration, network security groups) that is inappropriate for a solo-operated studio delivering a client product. The client's 12 concurrent users are well within Supabase Pro plan capacity.

### Implementation Notes for PIS and FIS

**Vercel configuration:**
- Connect GitHub repo `github.com/NODRFTSYSTEMS/pharmacyos` to Vercel
- Root directory: `app`
- Build command: `npm run build`
- Output directory: `dist`
- Framework preset: Vite
- Environment variables in Vercel dashboard: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — set for Production and Preview separately (Preview environment points to the same Supabase project in development mode)
- Custom domain: `pharmacyos.winchesterglobal.com` or equivalent — client must confirm domain and DNS control before deployment

**Vercel Preview deployments:**
- Every PR generates a Vercel Preview URL automatically
- Preview deployments use the same Supabase project (development database state)
- Preview URLs are shared internally for review — never sent to the client as a staging environment without Founder authorization

**Supabase project:**
- Region: `us-east-1` (closest available to Kingston, Jamaica — Supabase does not have a Caribbean region)
- Plan: Supabase Pro ($25/month base)
- Backups: point-in-time recovery enabled from day one — this is a production operational system
- Database password: generated, stored in NoDrftSystems 1Password vault, not in any file
- Supabase project reference: assigned at provisioning, recorded in evidence ledger (`00_governance/evidence-ledger.md`)

**Supabase CLI workflow:**
- Migrations applied via `supabase db push` (development) and reviewed before any production migration
- Edge Functions deployed via `supabase functions deploy [function-name]`
- Production database migrations require SCA review before execution — no direct `psql` access to production

**Deployment authorization gate:**
- No code is deployed to the production Vercel URL until QAS (Imani) completes Gate 5 and Founder provides Gate 6 authorization
- Preview URLs (Vercel) are acceptable for internal review without Gate 6, but must not be shared with the client as a staging link without Founder authorization
- Supabase production schema migrations require ARE technical review before execution

---

## Open Items — Cannot Be Closed by SAA

The following items require action from parties outside SAA's authority. Build cannot proceed on the affected surfaces until these are resolved.

| # | Item | Blocking What | Required Action | Owner |
|---|---|---|---|---|
| 1 | Supabase project not provisioned | All backend development | Founder authorization for Supabase Pro subscription (~$25/month) + PIS provisions project | Founder → PIS |
| 2 | Anthropic API key not confirmed | AI scanner Edge Functions (Decision 4) | Confirm API key access; verify `claude-sonnet-4-6` and `claude-haiku-4-5-20251001` are accessible on the account used for this project | IDS |
| 3 | Lynk payment API credentials absent | POS payment processing | Client (Winchester Global Pharmacy) must supply Lynk API key and secret; IDS reviews API documentation before integration design begins | Client → IDS |
| 4 | JDPA compliance review not started | Patient module (all 5 routes), JDPA consent capture, patient data schema | SCA (Omari) + legal-compliance skill must complete review before DSS finalizes patient table schema and before FIS builds any patient form | SCA + Founder (legal counsel if required) |
| 5 | Schedule drug log format not pharmacist-approved | Schedule drug log route, dispensing workflow for schedule drugs | Client pharmacist must review and approve the log format (fields, units, export format) before BLS implements the logging logic or FIS builds the log screen | Client Pharmacist → Founder |
| 6 | Client logo and branding assets not received | Auth layout, sidebar logo zone, all pages | Winchester Global Pharmacy must supply logo file (SVG preferred, minimum: PNG at 400px wide) for use in PharmacyOS branding | Client → PMA |
| 7 | Custom domain for PharmacyOS not confirmed | Vercel deployment (production URL) | Client must confirm the subdomain (e.g., `pharmacyos.winchesterglobal.com`) and DNS control | Client → PIS |

---

## Consequences of This Architecture

**What this architecture enables:**
- Full-stack development can begin in parallel (FIS on frontend scaffolding; DSS on schema; BLS on Edge Function shells) once Supabase is provisioned
- RLS + custom JWT claims provide defense-in-depth for regulated data without an external authorization service
- Supabase Realtime covers the live kanban requirement without additional infrastructure
- Supabase Edge Functions contain all secret credentials server-side with no architectural workaround needed
- TanStack Query provides consistent data fetching, caching, and mutation patterns across all 43 routes without custom infrastructure
- The prototype can be referenced freely without any risk of it infecting production TypeScript standards

**What this architecture closes off:**
- SSR or ISR for any route — this is a pure SPA; all routing is client-side (acceptable for an authenticated internal tool with no public routes)
- Multi-tenant deployment in Phase 1 — the schema and RLS policies are designed single-tenant; multi-tenant is a Phase 2 architectural concern requiring a new ADR
- Mobile-native deployment — this is a web application targeting Chrome and Edge at 1024px minimum; iOS/Android native apps are out of scope
- Any client-side AI inference — all Claude Vision calls go through Edge Functions; this cannot be changed without an ADR revision and ARE authorization
- Lynk payment processing without server-side validation — credentials must arrive before POS payment implementation begins; no workaround is acceptable

**What this requires from the build team:**
- DSS must produce an approved schema before BLS writes any query
- SCA must review all RLS policies before any data access code is merged
- SCA must review JDPA handling before any patient module code is written
- Every Edge Function must be reviewed by SCA before deployment
- No `VITE_` environment variable may contain a secret credential — this is a hard rule, not a preference
- Prototype code is reference only — no copy-paste from `prototype/` to `app/`

---

## Review Required

**ARE authorization:** YES — Class 3 build with Class 4 surfaces (auth, JDPA patient data, financial transactions). ARE must review this ADR before Gate 1A clears and any implementation begins.

**Founder approval:** YES — required per build activation packet. Infrastructure cost commitment (Supabase Pro ~$25/month, Vercel Pro at existing subscription) requires Founder sign-off before provisioning.

---

*SAA (Samara) — Solution Architecture Assistant | NoDrftSystems*
*Classification: Internal — Client Confidential | Do NOT commit to client repositories*
*Version: 1.0 | Date: 2026-05-07 | Status: PROPOSED*
