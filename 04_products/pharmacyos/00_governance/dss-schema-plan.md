# DSS Schema Plan — PharmacyOS

**Project:** PharmacyOS — NoDrftSystems proprietary platform (Winchester Global Pharmacy is first licensed deployment per [decision-log.md DL-001](decision-log.md))
**Date:** 2026-05-08
**Author:** DSS (Marise) — Database & Schema Specialist
**Status:** **PROPOSED** — awaiting SCA (Omari) review and Founder authorization before any migration SQL is written
**Classification:** Internal — NoDrftSystems Proprietary. Do NOT commit to client repositories.
**Build Class:** Class 3 — Integration or Data-Sensitive (Class 4 treatment at auth, JDPA, financial-transaction surfaces)
**References:**
- [architecture-decision-record.md](architecture-decision-record.md) — APPROVED 2026-05-08; Decisions 3, 4, 5, 6, 7, 8 most directly govern this plan
- [build-activation-packet.md](build-activation-packet.md) — 43 routes, 5 roles, P0/P1 scope
- [pharmacyos-design-handoff-claude-design-2026-05-07.md](pharmacyos-design-handoff-claude-design-2026-05-07.md) — entity shapes inferred from screen specs (Section 5)
- [decision-log.md](decision-log.md) DL-001 — proprietary classification and Phase 1 single-tenant scope

---

## 1. Schema Overview

PharmacyOS persists pharmacy operations data across nine logical groups: identity (auth + role profiles), inventory (drug catalog, lots, suppliers, transactions), prescriptions (clinical orders + dispensing + regulated schedule-drug logs), patients (demographics + allergies + JDPA consent + insurance), AI processing (asynchronous job queue and per-job extraction results), retail POS (transactions, line items, products), loyalty (members, point ledger), audit (immutable log of state-changing operations written by database triggers), and settings (system configuration and alert thresholds). Phase 1 is single-tenant — no `tenant_id` column appears anywhere; multi-tenancy is a Phase 2 architectural concern requiring a new ADR. Every table containing user-attributable, patient, prescription, or financial data carries Row-Level Security policies enforced at the Postgres layer; client-side queries from `supabase-js` cannot bypass these policies. Server-side operations that must bypass RLS (audit-trigger inserts, AI job result writes, scheduled cleanup) are restricted to Supabase Edge Functions invoked with the service role key. Five tables receive Realtime publication for live UI updates; the remainder are fetched on demand via TanStack Query.

---

## 2. Table Inventory

Tables are grouped by module. For each table the plan records: purpose, primary key, key columns, foreign-key relationships, RLS posture (which roles can SELECT / INSERT / UPDATE / DELETE), and Realtime publication flag.

Standard columns appear on every table and are not repeated below: `id uuid` (primary key, default `gen_random_uuid()`), `created_at timestamptz default now()`, `updated_at timestamptz default now()` (maintained by `moddatetime` trigger). Where a `deleted_at timestamptz` column appears it indicates soft delete.

### 2.1 Identity & Roles (2 tables)

**`user_profiles`** — extends `auth.users` with role assignment, name, MFA enrollment state, and lockout state. One row per authenticated staff member.
- PK: `id uuid` (matches `auth.users.id` 1:1)
- Key columns: `role text` (CHECK in `{pharmacist, pharmacy_technician, front_desk_cashier, manager, admin}`), `display_name text`, `mfa_enrolled boolean`, `failed_2fa_attempts int`, `locked_at timestamptz`, `last_login_at timestamptz`
- FKs: `id` REFERENCES `auth.users(id)` ON DELETE CASCADE
- RLS: SELECT — all authenticated users (read each other's display name and role for UI rendering of who-acted-when); UPDATE on own row — own profile updates limited to non-role fields; UPDATE role/locked_at — admin only; INSERT — admin only (via Edge Function on user creation); DELETE — service role only
- Realtime: N

**`security_events`** — append-only log of authentication-relevant events: failed login, failed 2FA, lockout, force-logout, MFA reset. Read by `/admin/security`.
- PK: `id uuid`
- Key columns: `user_id uuid`, `event_type text` (CHECK in defined set), `ip_address inet`, `user_agent text`, `metadata jsonb`, `occurred_at timestamptz`
- FKs: `user_id` REFERENCES `auth.users(id)` ON DELETE SET NULL (we keep the event after the user is removed for forensic continuity)
- RLS: SELECT — admin only; INSERT — service role only (Edge Function); UPDATE/DELETE — never permitted
- Realtime: N

### 2.2 Inventory (5 tables)

**`drugs`** — catalog. The drug master record: DIN, brand, generic, form, strength, category, NHF flag, schedule class, active flag.
- PK: `id uuid`
- Key columns: `din text UNIQUE`, `brand_name text`, `generic_name text`, `form text` (tablet, capsule, syrup, etc.), `strength text`, `category text`, `is_nhf boolean`, `schedule_class text` (NULL or one of `{schedule_2, schedule_3, schedule_4}` — exact set pending pharmacist sign-off, see Open Questions), `is_active boolean`, `reorder_point int`
- RLS: SELECT — all authenticated; INSERT/UPDATE — pharmacist, manager, admin; DELETE — never (deactivate via `is_active`)
- Realtime: N (catalog edits are infrequent; UI refreshes on navigation)

**`suppliers`** — supplier master record.
- PK: `id uuid`
- Key columns: `name text`, `contact_name text`, `phone text`, `email text`, `address text`, `last_delivery_at timestamptz`
- RLS: SELECT — all authenticated; INSERT/UPDATE — pharmacy_technician, manager, admin; DELETE — manager, admin (soft-delete via `deleted_at` preferred)
- Realtime: N

**`drug_lots`** — physical inventory lots. Each row is one lot of one drug received on one occasion: lot number, quantity remaining, expiry date, unit cost, supplier, received-by, received-at.
- PK: `id uuid`
- Key columns: `drug_id uuid`, `supplier_id uuid`, `lot_number text`, `quantity_received int`, `quantity_remaining int`, `expiry_date date`, `unit_cost_jmd numeric(12,2)`, `received_by uuid`, `received_at timestamptz`
- FKs: `drug_id` REFERENCES `drugs(id)`; `supplier_id` REFERENCES `suppliers(id)`; `received_by` REFERENCES `auth.users(id)`
- RLS: SELECT — all authenticated; INSERT — pharmacist, pharmacy_technician; UPDATE — pharmacist, pharmacy_technician (limited to `quantity_remaining` decrement on dispense, never to backdate `received_at`); DELETE — never
- Realtime: N
- Audit trigger: Y

**`inventory_transactions`** — movement ledger. Every receive, dispense, adjustment, transfer is a row. Stock levels are derived by summing transactions per drug or per lot; this is a strict ledger, not a stock counter.
- PK: `id uuid`
- Key columns: `drug_id uuid`, `lot_id uuid`, `transaction_type text` (CHECK in `{receive, dispense, adjust, dispose}`), `quantity_delta int` (positive for receive, negative for dispense), `reason text`, `actor_id uuid`, `linked_prescription_id uuid` (NULL except for `dispense`), `linked_retail_transaction_id uuid` (NULL except for retail dispense)
- FKs: `drug_id`, `lot_id`, `actor_id`, `linked_prescription_id`, `linked_retail_transaction_id` to their respective tables
- RLS: SELECT — all authenticated; INSERT — pharmacist, pharmacy_technician, front_desk_cashier (front_desk only via retail flow); UPDATE/DELETE — never (immutable ledger)
- Realtime: N
- Audit trigger: Y (every insert mirrors to `audit_log`)

**`inventory_alerts`** — materialized alerts for low-stock and expiring lots. Populated by a scheduled job; consumed by `/inventory/alerts` and the dashboard alert panel.
- PK: `id uuid`
- Key columns: `alert_type text` (CHECK in `{low_stock, expiry_warning, expiry_critical}`), `drug_id uuid`, `lot_id uuid` (NULL for low_stock), `severity text` (CHECK in `{low, medium, high}`), `triggered_at timestamptz`, `dismissed_at timestamptz`, `dismissed_by uuid`
- FKs: `drug_id`, `lot_id`, `dismissed_by`
- RLS: SELECT — all authenticated; INSERT — service role only (scheduled Edge Function); UPDATE (dismiss) — pharmacy_technician, manager, admin; DELETE — never
- Realtime: N

### 2.3 Prescriptions & Dispensing (3 tables)

**`prescriptions`** — clinical Rx record. Status moves through Received → Verified → Filled → Dispensed (or Cancelled). One row per prescription, regardless of refills.
- PK: `id uuid`
- Key columns: `display_id text UNIQUE` (`PR-XXXXXX` format for UI), `patient_id uuid`, `prescriber_name text`, `prescriber_registration_number text`, `drug_id uuid`, `dosage text`, `quantity int`, `refills_authorized int`, `refills_remaining int`, `date_issued date`, `status text` (CHECK in `{received, verified, filled, dispensed, cancelled}`), `verified_by uuid`, `verified_at timestamptz`, `filled_by uuid`, `filled_at timestamptz`, `dispensed_by uuid`, `dispensed_at timestamptz`, `dispensing_pharmacist_id uuid` (mandatory if drug is scheduled), `notes text`, `rx_image_path text` (path in `prescription-images` bucket), `source_ai_job_id uuid` (NULL if entered manually)
- FKs: `patient_id` REFERENCES `patients(id)`; `drug_id` REFERENCES `drugs(id)`; the four `*_by` columns REFERENCE `auth.users(id)`; `source_ai_job_id` REFERENCES `ai_jobs(id)` ON DELETE SET NULL
- RLS: SELECT — pharmacist, pharmacy_technician, manager, admin; INSERT — pharmacist, pharmacy_technician; UPDATE — pharmacist (any status transition), pharmacy_technician (only Verified → Filled); DELETE — never (cancel via status)
- Realtime: **Y** (per ADR Decision 5 — kanban queue)
- Audit trigger: Y

**`dispensing_records`** — record of an actual handoff to a patient. Distinct from `prescriptions` because one prescription with refills produces multiple dispensing records.
- PK: `id uuid`
- Key columns: `prescription_id uuid`, `patient_id uuid` (denormalized for query convenience and for cases where prescription is later soft-deleted), `dispensed_quantity int`, `dispensed_by uuid`, `dispensing_pharmacist_id uuid`, `dispensed_at timestamptz`, `lot_id uuid`, `unit_price_jmd numeric(12,2)`, `total_price_jmd numeric(12,2)`, `payment_method text`, `nhf_claim_id uuid` (NULL — Phase 2 stub)
- FKs: `prescription_id` REFERENCES `prescriptions(id)`; `patient_id` REFERENCES `patients(id)`; `lot_id` REFERENCES `drug_lots(id)`; pharmacist FKs REFERENCE `auth.users(id)`
- RLS: SELECT — pharmacist, pharmacy_technician, manager, admin; INSERT — pharmacist, pharmacy_technician (controlled drugs require pharmacist); UPDATE — never (immutable record); DELETE — never
- Realtime: N
- Audit trigger: Y

**`schedule_drug_log`** — regulated log entry under Jamaica Pharmacy Act. Created by trigger when a `dispensing_records` row is written for a drug with non-NULL `schedule_class`. Immutable. Pharmacist confirmation requirement is enforced at the application layer (UI gates the dispense action) and by the trigger which refuses to write if `dispensing_pharmacist_id` is NULL on the parent dispense.
- PK: `id uuid`
- Key columns: `dispensing_record_id uuid UNIQUE`, `prescription_id uuid`, `drug_id uuid`, `schedule_class text`, `patient_id uuid`, `quantity int`, `dispensing_pharmacist_id uuid`, `dispensed_by uuid`, `dispensed_at timestamptz`, `pharmacy_act_fields jsonb` (regulated field set — exact shape pending pharmacist sign-off, see Open Questions)
- FKs: as named
- RLS: SELECT — pharmacist, manager, admin; INSERT — service role only (trigger from `dispensing_records`); UPDATE/DELETE — **never permitted to any role, including admin** (this constraint is enforced by RLS policies that omit UPDATE and DELETE entirely)
- Realtime: N
- Audit trigger: Y (every insert is also written to `audit_log`)

### 2.4 Patients & JDPA (3 tables)

**`patients`** — patient master record. Holds demographics, allergy summary, and JDPA consent state.
- PK: `id uuid`
- Key columns: `first_name text`, `last_name text`, `date_of_birth date`, `sex text`, `phone text`, `email text`, `address text`, `allergies jsonb` (array of structured allergy entries plus free-text), `jdpa_consent_given boolean`, `jdpa_consent_date date`, `jdpa_consent_version text` (FK-style reference to `settings.jdpa_consent_versions`), `deleted_at timestamptz` (soft-delete for JDPA right-to-erasure)
- RLS: SELECT — pharmacist, pharmacy_technician, front_desk_cashier, manager, admin; INSERT — all five roles; UPDATE — pharmacist, pharmacy_technician, front_desk_cashier (own demographic edits); JDPA fields — pharmacist or admin only; DELETE — never (soft-delete via `deleted_at` only; admin-initiated)
- Realtime: N
- Audit trigger: Y (every JDPA-relevant change is recorded)

**`patient_insurance_cards`** — multiple insurance cards per patient.
- PK: `id uuid`
- Key columns: `patient_id uuid`, `provider text`, `card_number text`, `coverage_type text`, `expiry_date date`, `ais_verification_status text` (NULL — Phase 2 stub), `is_active boolean`
- FKs: `patient_id` REFERENCES `patients(id)` ON DELETE CASCADE
- RLS: SELECT — all five roles; INSERT/UPDATE — pharmacist, pharmacy_technician, front_desk_cashier; DELETE — pharmacist, admin
- Realtime: N
- Audit trigger: Y

**`jdpa_data_export_requests`** — every JDPA data export and right-to-erasure request is a row. Tracks who requested, when, what was returned or deleted, and which actor processed the request. Required for JDPA compliance reporting.
- PK: `id uuid`
- Key columns: `patient_id uuid`, `request_type text` (CHECK in `{export, deletion}`), `requested_by uuid`, `requested_at timestamptz`, `processed_by uuid`, `processed_at timestamptz`, `status text` (CHECK in `{pending, completed, rejected}`), `export_file_path text` (NULL until completed), `notes text`
- FKs: `patient_id`, `requested_by`, `processed_by`
- RLS: SELECT — pharmacist, manager, admin; INSERT — pharmacist, admin; UPDATE — pharmacist, admin (status updates); DELETE — never
- Realtime: N
- Audit trigger: Y

### 2.5 AI Processing (2 tables)

**`ai_jobs`** — one row per AI extraction job (invoice or Rx). Status: pending → processing → complete (or failed). The Edge Function reads and updates this record. The frontend subscribes via Realtime.
- PK: `id uuid`
- Key columns: `job_type text` (CHECK in `{invoice, rx}`), `status text` (CHECK in `{pending, processing, complete, failed}`), `storage_path text`, `initiated_by uuid`, `started_at timestamptz`, `completed_at timestamptz`, `error_message text`, `model_used text` (records which Claude model handled the job — `claude-haiku-4-5-20251001` or `claude-sonnet-4-6`), `reviewed_by uuid`, `reviewed_at timestamptz`, `review_outcome text` (CHECK in `{accepted, rejected, partial}` — NULL until reviewed)
- FKs: `initiated_by`, `reviewed_by` REFERENCE `auth.users(id)`
- RLS: SELECT — pharmacist, pharmacy_technician, manager, admin (the four roles that can initiate); INSERT — same set (UI inserts the pending row); UPDATE — service role only (Edge Function writes status transitions and review fields)
- Realtime: **Y** (per ADR Decision 5 — AI scanner panel subscribes to its own job row)
- Audit trigger: Y

**`ai_job_results`** — extracted fields and per-field confidence scores. One row per ai_job; the result payload is JSON.
- PK: `id uuid`
- Key columns: `ai_job_id uuid UNIQUE`, `extracted_fields jsonb` (structured per job_type — invoice line items array, or Rx field set), `confidence_scores jsonb` (parallel structure to `extracted_fields` carrying float 0.0–1.0), `flagged_fields text[]` (computed list of field paths where confidence < 0.85), `raw_response text` (full Claude API response retained for audit)
- FKs: `ai_job_id` REFERENCES `ai_jobs(id)` ON DELETE CASCADE
- RLS: SELECT — same as parent `ai_jobs`; INSERT/UPDATE — service role only; DELETE — service role only
- Realtime: N (frontend reads on `ai_jobs` status change)

### 2.6 Retail POS (3 tables)

**`retail_products`** — product catalog for non-prescription retail items. Distinct from `drugs` (which is the dispensing catalog). A drug may also be a retail product, in which case `linked_drug_id` is set.
- PK: `id uuid`
- Key columns: `name text`, `barcode text UNIQUE`, `category text`, `price_jmd numeric(12,2)`, `cost_jmd numeric(12,2)`, `is_active boolean`, `linked_drug_id uuid` (NULL for non-drug retail items)
- FKs: `linked_drug_id` REFERENCES `drugs(id)` ON DELETE SET NULL
- RLS: SELECT — all authenticated; INSERT/UPDATE — pharmacy_technician, manager, admin; DELETE — never (deactivate via `is_active`)
- Realtime: N

**`retail_transactions`** — POS sale header. One row per cashier-completed transaction.
- PK: `id uuid`
- Key columns: `display_id text UNIQUE` (receipt number), `cashier_id uuid`, `customer_loyalty_id uuid` (NULL if no loyalty member), `subtotal_jmd numeric(12,2)`, `tax_jmd numeric(12,2)`, `loyalty_discount_jmd numeric(12,2)`, `total_jmd numeric(12,2)`, `payment_method text` (CHECK in `{cash, card, lynk}`), `tendered_jmd numeric(12,2)`, `change_jmd numeric(12,2)`, `lynk_reference text` (NULL except Lynk method), `completed_at timestamptz`, `voided_at timestamptz`, `voided_by uuid`, `void_reason text`
- FKs: `cashier_id` REFERENCES `auth.users(id)`; `customer_loyalty_id` REFERENCES `loyalty_members(id)`; `voided_by` REFERENCES `auth.users(id)`
- RLS: SELECT — front_desk_cashier (own transactions), manager, admin; INSERT — front_desk_cashier, pharmacist, manager; UPDATE — manager, admin only (void only — no edits to financial fields after completion); DELETE — never
- Realtime: N
- Audit trigger: Y

**`retail_transaction_items`** — line items for each retail transaction.
- PK: `id uuid`
- Key columns: `retail_transaction_id uuid`, `product_id uuid`, `quantity int`, `unit_price_jmd numeric(12,2)`, `line_total_jmd numeric(12,2)`, `lot_id uuid` (NULL for non-drug items)
- FKs: `retail_transaction_id` REFERENCES `retail_transactions(id)` ON DELETE CASCADE; `product_id` REFERENCES `retail_products(id)`; `lot_id` REFERENCES `drug_lots(id)`
- RLS: SELECT/INSERT — same as parent; UPDATE/DELETE — never directly (cascade only)
- Realtime: N

### 2.7 Loyalty (2 tables)

**`loyalty_members`** — loyalty enrollment record.
- PK: `id uuid`
- Key columns: `phone text UNIQUE`, `name text`, `enrolled_at timestamptz`, `points_balance int` (denormalized cache; authoritative balance derived from `loyalty_transactions`), `lifetime_spend_jmd numeric(12,2)`, `jdpa_consent_given boolean`, `jdpa_consent_date date`, `jdpa_consent_version text`, `is_active boolean`
- RLS: SELECT — front_desk_cashier, manager, admin; INSERT/UPDATE — front_desk_cashier, manager, admin; DELETE — never
- Realtime: N
- Audit trigger: Y

**`loyalty_transactions`** — point ledger. Earn, redeem, adjust. Authoritative — `loyalty_members.points_balance` is recomputed from this table on every change.
- PK: `id uuid`
- Key columns: `loyalty_member_id uuid`, `transaction_type text` (CHECK in `{earn, redeem, adjust, expire}`), `points_delta int`, `linked_retail_transaction_id uuid` (NULL except earn/redeem on a retail sale), `actor_id uuid`, `notes text`
- FKs: as named
- RLS: SELECT — front_desk_cashier (own actions), manager, admin; INSERT — front_desk_cashier, manager, admin; UPDATE/DELETE — never
- Realtime: N
- Audit trigger: Y

### 2.8 Audit (1 table)

**`audit_log`** — single global audit log written by database triggers. Every state-changing operation on a regulated table inserts one row. Immutable.
- PK: `id uuid`
- Key columns: `actor_id uuid` (from `auth.uid()` at trigger fire-time; NULL if service role), `actor_role text` (from JWT claim at trigger fire-time), `entity_type text` (table name), `entity_id uuid`, `action text` (CHECK in `{insert, update, delete, soft_delete}`), `before_state jsonb`, `after_state jsonb`, `diff jsonb` (computed diff for UI rendering), `ip_address inet`, `user_agent text`, `occurred_at timestamptz`
- RLS: SELECT — admin only via `/admin/audit`, manager (limited subset for reporting); INSERT — service role only (trigger context); UPDATE/DELETE — **never permitted**
- Realtime: N (the dashboard "Recent Activity" panel polls via TanStack Query — Realtime is not appropriate for the audit log because it would broadcast every change to every connected admin client)

### 2.9 Settings (1 table)

**`system_settings`** — singleton-style configuration table. Holds pharmacy info, operating hours, alert thresholds, AI confidence threshold, JDPA consent versions. One row per logical setting key.
- PK: `id uuid`
- Key columns: `setting_key text UNIQUE`, `setting_value jsonb`, `version int`, `updated_by uuid`, `description text`
- RLS: SELECT — all authenticated; UPDATE — admin only; INSERT — admin only (new settings keys); DELETE — never
- Realtime: N
- Audit trigger: Y

**Total table count: 22 tables.**

---

## 3. Custom JWT Claim Hook

Per ADR Decision 7, the user's role is carried as a custom claim in the JWT so RLS policies can inspect it without a per-query lookup against `user_profiles`.

The hook is implemented as a Postgres function (`public.custom_access_token_hook`) registered with Supabase Auth via the dashboard hook configuration. It runs on every access-token issuance — initial login, refresh-token exchange, and any session re-issuance. Its responsibilities:

1. Receive the event JSON from Supabase Auth (contains `user_id` and the existing `claims` object)
2. Look up the user's role via `SELECT role FROM user_profiles WHERE id = (event ->> 'user_id')::uuid`
3. Inject `{ "role": "<role>" }` into the `claims` object
4. Return the modified event JSON

Effects of this design:
- RLS policies reference `(auth.jwt() ->> 'role')` to gate operations by role
- Role changes by an admin take effect at the user's next token refresh (1 hour at most, given the JWT expiry from ADR Decision 7)
- Inactive users (locked or deleted from `user_profiles`) receive a token without a role claim; RLS policies that require a role-string match deny by default

The hook function itself runs with `SECURITY DEFINER` privileges, owned by the database superuser, with `SELECT` on `user_profiles` granted to its execution context. SCA must review the function definition before it is registered with Supabase Auth — a misconfiguration here is a privilege-escalation surface.

---

## 4. RLS Policy Patterns

Five reusable patterns cover all 22 tables. Per-table policy specifications enumerate which pattern applies to which operation; this document records the patterns themselves.

**Pattern A — Role-restricted SELECT.** Policy clause: `(auth.jwt() ->> 'role') = ANY (ARRAY['<role1>', '<role2>', ...])`. Applied to most reference data and operational tables. Used by: `drugs`, `suppliers`, `drug_lots`, `inventory_transactions`, `inventory_alerts`, `prescriptions`, `dispensing_records`, `schedule_drug_log`, `patients`, `patient_insurance_cards`, `jdpa_data_export_requests`, `ai_jobs`, `ai_job_results`, `retail_products`, `retail_transactions`, `retail_transaction_items`, `loyalty_members`, `loyalty_transactions`.

**Pattern B — Role-restricted INSERT/UPDATE.** Policy clause: same role-array check, applied to write operations. The set of permitted roles for a write operation is typically narrower than for read. Used by every table that has a write surface.

**Pattern C — Owner-only UPDATE on own row.** Policy clause: `auth.uid() = id` (for `user_profiles`) or `auth.uid() = <owner_column>` (for any table where the user can edit their own record). Used by `user_profiles` (own profile updates) and by row-level filters on `retail_transactions` SELECT (cashier sees own transactions; manager sees all).

**Pattern D — Service-role-only INSERT/UPDATE.** No client-side write is permitted; only the Edge Function's service-role connection can write. The RLS policy is effectively absent for the role-bearing client (no permitted operations) — the service role bypasses RLS by design. Used by: `audit_log` (all writes), `schedule_drug_log` (all writes — comes from trigger on `dispensing_records`), `ai_job_results` (writes from Edge Function), `ai_jobs` UPDATE (status transitions from Edge Function), `inventory_alerts` INSERT (scheduled job), `security_events` INSERT.

**Pattern E — No-write-after-create (immutable).** The table has INSERT policies but no UPDATE or DELETE policies — both operations are denied for all roles by default. Used by: `audit_log`, `schedule_drug_log`, `inventory_transactions`, `dispensing_records`, `loyalty_transactions`, `retail_transaction_items`. These tables are append-only ledgers; correction is by counter-entry, not edit.

Applied combinations: a typical operational table receives Pattern A for SELECT, Pattern B for INSERT/UPDATE, and the absence of a DELETE policy. A regulated immutable table receives Pattern A for SELECT and Pattern D + Pattern E (service-role-only INSERT, no UPDATE or DELETE). The schedule drug log carries the strictest combination: Pattern A SELECT for pharmacist/manager/admin only, Pattern D + Pattern E for writes, and the trigger on `dispensing_records` is the only ingress.

---

## 5. Audit Trigger Approach

Per ADR Decision 7, audit log writes are performed by **database triggers**, not by application code. This ensures the audit cannot be bypassed by a missed call site in BLS or by a malformed mutation in the frontend.

**Trigger function (`public.write_audit_log`):**
- Fires AFTER INSERT, AFTER UPDATE, AFTER DELETE on each audited table (DELETE is rare — most deletes are soft-deletes via `deleted_at` UPDATE)
- Captures: `entity_type` from `TG_TABLE_NAME`; `entity_id` from `NEW.id` or `OLD.id`; `action` from `TG_OP`; `before_state` from `to_jsonb(OLD)`; `after_state` from `to_jsonb(NEW)`; `diff` computed from before/after; `actor_id` from `auth.uid()`; `actor_role` from `(auth.jwt() ->> 'role')`; `ip_address` from a request-context GUC if available (set by application middleware); `user_agent` from the same source; `occurred_at` from `now()`
- Writes one row to `audit_log`
- Function runs `SECURITY DEFINER` so it can write to `audit_log` regardless of the acting user's RLS posture (the acting user has no INSERT policy on `audit_log`)

**Tables receiving the trigger:** `user_profiles`, `drugs`, `drug_lots`, `inventory_transactions`, `prescriptions`, `dispensing_records`, `schedule_drug_log`, `patients`, `patient_insurance_cards`, `jdpa_data_export_requests`, `ai_jobs` (status changes only — not the high-volume processing-state churn), `retail_transactions`, `retail_transaction_items`, `loyalty_members`, `loyalty_transactions`, `system_settings`. The trigger is **not** applied to `audit_log` itself, `security_events`, `inventory_alerts`, `ai_job_results`, `retail_products`, or `suppliers` — these are either the audit destination, are themselves logs, or are reference data where audit value does not justify the trigger overhead. SCA must confirm this exclusion list during review.

**Sensitive field redaction:** The trigger never captures raw password hashes (those live in `auth.users` which is not audited by us — Supabase Auth has its own logs). It does capture JDPA-sensitive fields in `before_state`/`after_state` because the audit log is the regulatory record of who changed what; access to the audit log is gated to admin only.

---

## 6. Storage Bucket Schemas

Per ADR Decision 6, three buckets are provisioned. Storage policies are written as part of the migration that creates each bucket.

**`prescription-images`** — private; MIME types `image/jpeg`, `image/png`, `image/webp`, `application/pdf`; max 10MB; path convention `prescription-images/{patientId}/{prescriptionId}/{filename}`.
- SELECT policy: `(auth.jwt() ->> 'role') IN ('pharmacist', 'pharmacy_technician', 'manager', 'admin')`
- INSERT policy: `(auth.jwt() ->> 'role') IN ('pharmacist', 'pharmacy_technician')`
- DELETE policy: never permitted via client; service-role only

**`invoice-images`** — private; same MIME and size constraints; path convention `invoice-images/{supplierId}/{receiveSessionId}/{filename}`.
- SELECT policy: `(auth.jwt() ->> 'role') IN ('pharmacy_technician', 'manager', 'admin')`
- INSERT policy: `(auth.jwt() ->> 'role') IN ('pharmacy_technician', 'manager')`
- DELETE policy: service-role only

**`ai-uploads`** — private; staging only; same MIME and size constraints; path convention `ai-uploads/{userId}/{jobId}/{filename}`.
- INSERT policy: any authenticated user (any role may trigger an AI job through the surfaces they have access to)
- SELECT policy: service-role only (the Edge Function reads the file; the user does not need to read it back from this bucket)
- DELETE policy: service-role only (scheduled `cleanup-ai-uploads` Edge Function deletes files older than 48 hours)

**SCA review requirement:** Storage policy SQL is as security-critical as RLS policy SQL. Both must clear SCA review before any upload code is written.

---

## 7. Schedule Drug Logging — Regulated Surface

The Jamaica Pharmacy Act schedule drug log is treated as a Class 4 surface within the Class 3 build. The schema gives it three structural protections:

1. **Separate table.** `schedule_drug_log` is not a column on `dispensing_records` and not a view — it is a discrete table that receives one row per regulated dispense.
2. **Trigger-only ingress.** The only path into `schedule_drug_log` is the `AFTER INSERT` trigger on `dispensing_records` that fires when the linked `drugs.schedule_class` is non-NULL. There is no application-code INSERT path. The trigger refuses to write if `dispensing_records.dispensing_pharmacist_id IS NULL` — this enforces the pharmacist confirmation requirement at the database layer rather than relying on the UI.
3. **Strict immutability.** No UPDATE or DELETE policies are defined for any role, including admin. Any correction is by counter-entry recorded in the audit log; the schedule log itself is append-only.

**Pharmacy Act fields — pending pharmacist sign-off (Gap G6 in BAP).** The `pharmacy_act_fields jsonb` column is the regulated payload the pharmacist must sign off on. DSS will not invent the field names or formats. The exact schema for this column awaits client pharmacist approval. Until that approval is received, the migration that creates `schedule_drug_log` will define the column as `jsonb NOT NULL` with a placeholder default of `'{}'::jsonb`; the strict field-shape constraint is added in a follow-up migration once the format is approved. This is flagged in Open Questions for SCA + Founder.

---

## 8. JDPA Surfaces

JDPA-relevant data lives on three tables: `patients`, `patient_insurance_cards`, and `loyalty_members`. JDPA-relevant operations are tracked on `jdpa_data_export_requests` and `audit_log`.

**Consent versioning.** `system_settings` carries a row with `setting_key = 'jdpa_consent_versions'` and a `setting_value` jsonb of the form `{ "current_version": "v1", "versions": [{ "version": "v1", "text": "...", "published_at": "..." }, ...] }`. When a new patient is registered, the `patients.jdpa_consent_version` column is locked to `current_version` at insert time. Editing a patient's demographic fields after consent does not change the consent version — that requires explicit re-consent and a new patient-update event recorded in `audit_log`. When admin publishes a new consent version, existing patient records are not retroactively updated — re-consent must be obtained per patient on next visit.

**Right-to-erasure.** A patient deletion request creates a row in `jdpa_data_export_requests` with `request_type = 'deletion'`. Once approved by pharmacist or admin, the patient record is **soft-deleted** (`patients.deleted_at` set, sensitive demographic fields nulled, consent record retained for regulatory traceability). Linked `prescriptions` and `dispensing_records` are not deleted — they are regulatory records whose retention is required under the Pharmacy Act and which take precedence over JDPA erasure rights. The patient's name is replaced with a redacted placeholder in those records' query results via a view that respects the `deleted_at` flag. The handling of this conflict between JDPA erasure rights and Pharmacy Act retention duties is a legal-compliance question — see Open Questions.

**Right-to-export.** A `request_type = 'export'` row is created; a pharmacist or admin processes it; the Edge Function `export-patient-data` (to be designed in a future ADR amendment) gathers patient + insurance + prescription + dispensing + loyalty records into a single PDF, stores it in a private bucket (`jdpa-exports`, to be created — flag in Open Questions), and returns the file to the requester. The export action and its outcome are logged in `audit_log`.

---

## 9. Migration Strategy

Migrations live in `supabase/migrations/` per ADR Decision 10. Numbering uses zero-padded four-digit prefixes for stable sort order. The initial sequence is:

1. **`0001_initial_schema.sql`** — extensions (`moddatetime`, `pg_trgm` for autocomplete search), the `user_profiles` table, the `custom_access_token_hook` function, the universal `updated_at` trigger function, and the `audit_log` table with its trigger function definition (the trigger function is defined here; per-table trigger attachments come later).
2. **`0002_inventory_schema.sql`** — `drugs`, `suppliers`, `drug_lots`, `inventory_transactions`, `inventory_alerts`. RLS policies and audit trigger attachments.
3. **`0003_patients_schema.sql`** — `patients`, `patient_insurance_cards`, `jdpa_data_export_requests`. RLS policies and audit trigger attachments. Includes the `jdpa_consent_versions` initial row in `system_settings`.
4. **`0004_prescriptions_schema.sql`** — `prescriptions`, `dispensing_records`. RLS policies, audit trigger attachments, Realtime publication for `prescriptions`.
5. **`0005_schedule_drug_log.sql`** — `schedule_drug_log` table with strict immutability, trigger on `dispensing_records` to write the regulated row, RLS policies. Pharmacy Act fields jsonb defined as flexible until pharmacist sign-off.
6. **`0006_ai_pipeline.sql`** — `ai_jobs`, `ai_job_results`. RLS policies, Realtime publication for `ai_jobs`. Audit trigger on `ai_jobs` (status only, not high-volume processing churn).
7. **`0007_pos_loyalty.sql`** — `retail_products`, `retail_transactions`, `retail_transaction_items`, `loyalty_members`, `loyalty_transactions`. RLS policies and audit trigger attachments.
8. **`0008_settings_security.sql`** — `system_settings` (with seed rows for alert thresholds, AI confidence threshold default 0.85, operating hours, JDPA consent v1), `security_events`. RLS policies.
9. **`0009_storage_buckets.sql`** — bucket creation and storage policies for `prescription-images`, `invoice-images`, `ai-uploads`. (Note: bucket creation in Supabase is typically dashboard-driven; this migration captures the policy SQL for repeatability.)

This sequence respects FK dependencies: `inventory` before `prescriptions` (drugs are referenced by prescriptions); `patients` before `prescriptions` (prescriptions reference patients); `prescriptions` before `schedule_drug_log` (schedule log references dispensing records); `ai_pipeline` after `prescriptions` (Rx scanner records reference prescriptions via `source_ai_job_id` via SET NULL). Migrations are run in dev via `supabase db push`. Production migrations require ARE technical review per ADR Decision 12.

---

## 10. Open Questions for SCA Review

Items SCA (Omari) must approve before any migration SQL is written:

1. **Audit-trigger exclusion list.** The plan excludes `audit_log`, `security_events`, `inventory_alerts`, `ai_job_results`, `retail_products`, and `suppliers` from the audit trigger. SCA confirms the exclusion list or names additions.
2. **Pattern D coverage.** The plan designates service-role-only INSERT/UPDATE for `audit_log`, `schedule_drug_log`, `ai_job_results`, `ai_jobs` UPDATE, `inventory_alerts` INSERT, and `security_events` INSERT. SCA confirms each is correctly scoped or names additions.
3. **`security_events` SELECT scope.** Currently admin-only. SCA decides whether manager should also have read access for incident review.
4. **`audit_log` manager subset.** Plan permits manager to SELECT a "limited subset for reporting." SCA defines the boundary — by entity type, by action, or by a view rather than the underlying table.
5. **Soft-delete vs. hard-delete on `patients`.** Plan uses soft delete with field nulling for JDPA erasure. SCA confirms this is sufficient for JDPA compliance, or directs that hard-delete with cascade-protection on regulatory tables is required.
6. **Redaction-view design for soft-deleted patients in regulatory records.** SCA approves the view pattern that displays redacted-name on regulatory records linked to a soft-deleted patient.
7. **`custom_access_token_hook` `SECURITY DEFINER` boundary.** SCA reviews the function's privilege envelope and the grants on `user_profiles` for the hook's execution context.
8. **Storage bucket policies.** SCA reviews the SELECT/INSERT/DELETE policy SQL for all three buckets per ADR Decision 6 (which already designates SCA as the reviewer of record).
9. **JDPA-exports bucket creation.** Plan flags the need for a fourth bucket `jdpa-exports` for right-to-export deliverables. SCA confirms scope and policy posture before this is scheduled in a migration.
10. **CHECK constraint sets.** Every `text` column with an enumerated value set carries a CHECK constraint. SCA reviews the enumerated value sets for correctness against the design handoff and against the role definitions in BAP.
11. **`pharmacy_act_fields` validation strategy.** The plan defers strict shape validation until pharmacist sign-off. SCA approves the interim flexible-jsonb posture and the follow-up migration approach.
12. **Realtime publication scope.** Plan publishes `prescriptions` and `ai_jobs` only, per ADR Decision 5. SCA confirms no other table requires Realtime in Phase 1.

---

## 11. Open Questions for Founder

Items requiring Founder authorization or direction:

1. **Pharmacist sign-off on `pharmacy_act_fields` shape.** Per BAP Gap G6, the schedule drug log format awaits client pharmacist approval. Founder confirms the path: pharmacist review of the proposed field set drafted by DSS + SCA, or pharmacist supplies the field set independently. Until this closes, the schedule drug log column is functionally a flexible jsonb, which is not a defensible long-term posture for a regulated record.
2. **JDPA / Pharmacy Act conflict resolution.** Right-to-erasure under JDPA conflicts with Pharmacy Act dispensing-record retention requirements. The plan resolves this by retaining regulatory records and redacting patient name in their linked context. Founder confirms this resolution is acceptable, or directs counsel review before DSS finalizes the soft-delete pattern.
3. **JDPA-exports bucket cost and retention.** A fourth storage bucket has cost and retention implications beyond Phase 1's three. Founder confirms scope and any retention policy (e.g., delete the export PDF after 30 days, since the patient has received it).
4. **Multi-tenant deferral confirmation.** Plan is single-tenant per BAP. DL-001 frames PharmacyOS as multi-tenant-capable for Phase 2. Founder confirms that no `tenant_id` column should be present in Phase 1 migrations (a deferred multi-tenant migration will add it as a non-NULL column with a Winchester default value at that time), or directs that a placeholder column be added now to ease the future migration.
5. **Supabase Free tier vs. Pro for schema work.** Per DL-001 follow-on item 8, the project currently uses the Free tier (`pharmacyos-dev`). Schema work can proceed on Free; production-scale migration testing and point-in-time recovery require Pro. Founder confirms the Free-tier window holds through DSS + SCA review, with Pro provisioned at production cutover.
6. **ARE technical review path for production migrations.** ADR Decision 12 designates ARE for production migration review. Founder confirms ARE engagement is in place or names a substitute reviewer for the first production deployment.

---

*DSS (Marise) — Database & Schema Specialist | NoDrftSystems*
*Classification: Internal — NoDrftSystems Proprietary | Do NOT commit to client repositories*
*Version: 1.0 | Date: 2026-05-08 | Status: PROPOSED — awaiting SCA + Founder review*
