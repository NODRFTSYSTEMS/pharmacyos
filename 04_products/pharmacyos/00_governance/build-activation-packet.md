# Build Activation Packet — PharmacyOS
Classification: Internal — Client Confidential
Date: 2026-05-07
Protocol: mandatory-build-activation-protocol-2026-04-26.md
Authority: Founder (confirmed 2026-05-07)
SOW status: New SOW — separate from WINCHESTERGLOBAL_pharmacy-website Phase 1

---

## Founder Authorizations on File (2026-05-07)

| Decision | Founder Direction |
|---|---|
| Build authorization | New SOW — separate engagement from Phase 1 informational site |
| Build class | Class 3 confirmed — no override; full governance applies |
| Implementation model | Fully delegated per governance — complete agent cell activated |
| Workspace location | 04_products/pharmacyos/ (product folder) + paired 02_client-system/ record |

---

## Gate 0: Build Intake

### Build Classification

| Field | Value |
|---|---|
| Build name | PharmacyOS — Winchester Global Pharmacy Operations Platform |
| Build class | **Class 3 — Integration or Data-Sensitive Build** |
| Class 3 triggers | Auth (2FA + RBAC), regulated data (schedule drug logging per Jamaica Pharmacy Act), JDPA patient consent, AI vision integration (Claude Vision API), financial transactions (POS + Lynk), audit trail requirements, Jamaica Data Protection Act 2020 compliance |
| Class 4 surfaces | Auth boundary, JDPA data handling, and financial transactions require Class 4 oversight at those specific surfaces even within the Class 3 classification |
| Risk level | High — regulated healthcare data; prescription logging; multi-role access control; AI extraction of clinical documents; patient privacy obligations |
| Trigger | Founder-authorized new SOW engagement, 2026-05-07 |
| Human owner | Founder |
| Build lead | FIS (Kiara) — frontend; BLS — backend; DSS — schema |
| Reviewer path | QAS (Imani) — reserved; independent reviewers assigned per Gate 5 |

### Build Objective

Produce a single-tenant, web-based pharmacy operations platform for Winchester Global Pharmacy's Kingston, Jamaica location. PharmacyOS replaces the incumbent PharmPartner system and is the daily operational system for all pharmacy staff.

This is an internal staff-facing platform, not a patient-facing app and not a marketing site.

### Scope — P0 Core (Phase 1)

All items are English-only. No bilingual requirement.

**Auth and access control:**
- Login + 2FA (6-digit TOTP or backup codes)
- 5 roles: Pharmacist, Pharmacy Technician, Front Desk / Cashier, Manager, Admin
- Role-based route and feature access
- Audit trail on all state-changing actions

**Inventory module (8 routes):**
- Stock overview (current stock, reorder alerts, expiry alerts)
- Drug catalog (add/edit/deactivate)
- Drug detail (lots, transaction history)
- Receive stock form
- AI Invoice Scanner (Claude Vision extracts supplier invoice line items)
- Inventory alerts (low stock + expiry)
- Suppliers management

**Prescriptions module (5 routes):**
- Prescription queue (kanban — Received / Verified / Filled / Dispensed)
- New prescription form
- Prescription detail (verify / fill / dispense workflow)
- AI Rx Scanner (Claude Vision extracts prescription fields)
- Schedule drug log (regulated export — PDF/CSV)

**Patients module (5 routes):**
- Patient search
- New patient form (demographics + allergies + JDPA consent capture)
- Patient profile (tabs: Overview / Medication History / Insurance / JDPA)
- Insurance card management
- JDPA data export / deletion

**Reporting module (5 routes):**
- Reports hub
- Inventory report
- Dispensing report
- Schedule drug log report
- Revenue report

**AI module (1 route):**
- AI job queue (status tracking of all AI extraction jobs)

**Retail POS module (10 routes):**
- POS terminal (fullscreen, barcode scan, cart, payment)
- Products management
- Product detail
- POS inventory
- POS suppliers
- POS reports
- Loyalty customer search
- New loyalty registration
- Loyalty customer profile
- Loyalty dashboard

**Admin module (4 routes):**
- User management
- Audit log
- System settings
- Security (2FA management, active sessions, failed login log)

**Auth routes (3):**
- Login
- 2FA verification
- My profile

**Total: 43 routes**

### Scope — P2 Deferred (Phase 2)

- Insurance AIS verification integration
- Claims / NHF submission
- WhatsApp automation
- SMS notifications
- Any patient-facing portal

### Exclusions (explicit)

- Not a patient-facing app — patients never log in
- Not a public website — no SEO, no marketing pages
- Not e-commerce — no online ordering, no shipping
- Not a clinical EMR — no diagnoses, no charting, no labs
- Not bilingual — English-only (Jamaica operational context)
- No multi-pharmacy or multi-tenant switching in Phase 1

### Acceptance Criteria

**Auth:**
- [ ] Login + 2FA works with TOTP authenticator app
- [ ] Backup codes function as fallback
- [ ] Account locked after 5 wrong 2FA attempts
- [ ] All 5 roles enforce correct route-level access (unauthorized routes redirect, not 404)

**Data integrity:**
- [ ] Schedule drug dispense creates SCHEDULE_DRUG_LOG entry; pharmacist confirmation required
- [ ] JDPA consent: version locked at registration; consent date auto-populated
- [ ] All state-changing actions create audit log entries
- [ ] No patient data accessible without authentication

**AI Scanner:**
- [ ] Invoice scanner extracts line items with per-field confidence scores
- [ ] Fields below 85% confidence flagged amber and require manual edit before confirmation
- [ ] Confirm All disabled if any flagged field unedited
- [ ] Rx scanner extracts prescriber, patient, drug, dosage, quantity

**POS:**
- [ ] Barcode scan adds product to cart; auto-focus returns to barcode field
- [ ] Cash tender calculates change; change shown in accent color
- [ ] Loyalty lookup by phone works; points apply as discount
- [ ] Receipt modal appears on completion; Print/Email/Done actions

**General:**
- [ ] TypeScript: 0 errors
- [ ] Production build: passes
- [ ] All 43 routes render without console errors
- [ ] WCAG 2.1 AA: all screens pass automated + manual audit
- [ ] Responsive at 1024px (tablet landscape) minimum
- [ ] POS terminal touch targets ≥ 56px

### Dependencies

- Supabase project (auth + database + storage) — not yet provisioned
- Claude Vision API access — not yet confirmed (model: claude-sonnet-4-6 or equivalent)
- Lynk payment integration — API credentials not yet received
- Client-supplied pharmacy name/logo for PharmacyOS branding
- Jamaica Data Protection Act 2020 compliance review (SCA + legal-compliance skill)
- Pharmacist sign-off on schedule drug logging format before development

---

## Gate 0A: Agent Assessment & Handoff Routing Note

### Surface Mapping

| Surface | Description |
|---|---|
| Frontend UI | 43 routes; 3 layout shells; 17-component library; responsive 1024px+ |
| Auth + RBAC | Supabase Auth; 2FA (TOTP); 5-role access control; session management |
| Backend / API | Server-side business logic; role enforcement; prescription state machine; AI job queue |
| Database schema | 15+ tables (patients, prescriptions, dispensing, inventory, lots, transactions, audit, users, loyalty, POS) |
| AI integration | Claude Vision API; invoice extraction; Rx extraction; confidence scoring; job queue |
| POS + payments | Cart logic; Lynk payment integration; receipt generation; loyalty points |
| Regulatory | Schedule drug logging; JDPA consent; Jamaica Data Protection Act 2020 |
| Accessibility | WCAG 2.1 AA; keyboard nav; screen reader; reduced motion |
| Security | Auth boundary; RLS policies; PII handling; audit trail; session security |
| Deployment | Supabase + Vercel (or equivalent); environment variable management |

### Role-to-Surface Mapping

| Surface | Primary Agent | Status |
|---|---|---|
| Architecture + stack decision | SAA (Samara) | **Required before any code — GATE 0A PREREQUISITE** |
| Repository context | RCA (Deven) | Activates after SAA scaffold |
| Frontend UI / components / layout | FIS (Kiara) | Active after SAA architecture approved |
| Backend API + business logic | BLS | Active for server-side routes and prescription state machine |
| Third-party integrations (Claude Vision, Lynk) | IDS | Active for AI scanner + payment wiring |
| Database schema + migrations | DSS | **Required early — schema must be approved before BLS implements** |
| Auth + security (RBAC, RLS, PII) | SCA (Omari) | Active from day 1 — auth is Class 4 surface |
| Performance | POS (if needed) | Conditional — activate if query performance becomes material |
| Infrastructure / deployment | PIS | Activates at deployment prep |
| Test verification | TVA (Leandra) | Active throughout — typecheck + test coverage |
| Accessibility | AAA (Rochelle) | Active QA Pass 6 + design review during build |
| Design fidelity from handoff | DAA (Anika) | Active during frontend implementation phases |
| Deployment readiness | DRA (Terrence) | Gate 6 |
| Orchestration | MOA (Zayne) | Always active |
| Context state | CSM | Always active |
| Build packet control | PMA (Keon) | Always active |
| Quality gate | QAS (Imani) | Reserved — activates Gate 5 |

### Handoff Routing Plan

1. **SAA** → Architecture decision (stack, monorepo vs. separate, Supabase config) → produces architecture record
2. **SAA → DSS**: Schema design (all 15+ tables, RLS policies, migrations) → DSS produces approved schema before BLS writes any query
3. **DSS → SCA**: Schema review for RLS correctness, PII segregation, JDPA data handling
4. **SAA + DSS + SCA → PMA**: Gate 1 build packet finalized; development begins
5. **FIS** (frontend): 43 routes implemented against design handoff specs + DAA fidelity review
6. **BLS** (backend): API routes, prescription state machine, AI job queue, schedule drug logging
7. **IDS**: Claude Vision integration, Lynk payment wiring
8. **FIS + BLS + IDS → TVA**: Full verification pass (typecheck, test suite, build)
9. **TVA → SCA**: Security review (auth flows, RLS, PII, upload handling, Lynk)
10. **TVA + SCA → AAA + DAA + reviewer_accessibility**: WCAG 2.1 AA pass + design fidelity
11. **All → QAS (Imani)**: Gate 5 — scope, evidence, no drift
12. **QAS → HHC (Desmond)**: Route to ARE + Founder for Gate 6

### Capability Gaps to Resolve Before Gate 1

| Gap | Required Action |
|---|---|
| SAA architecture decision not yet made | SAA must produce architecture record before any code is written |
| Supabase project not provisioned | PIS (Terrence) to coordinate; Founder authorization required |
| Claude Vision API access not confirmed | Confirm API key / model availability |
| Lynk payment API credentials absent | Client must supply or confirm readiness |
| JDPA compliance review not started | SCA + legal-compliance skill — activate before patient data schema is finalized |
| Schedule drug log format not pharmacist-approved | Client-side approval required before logging UI is built |

---

## Gate 1: Build Packet Status

| Item | Status |
|---|---|
| Objective | Defined above |
| Scope | 43 routes, P0/P1 defined, P2 deferred |
| Exclusions | Explicit — patient-facing, EMR, e-commerce, bilingual all excluded |
| Dependencies | Identified — 6 gaps logged above |
| Acceptance criteria | Defined above |
| Risk level | High — Class 3 with Class 4 surfaces in auth/JDPA/financial |
| Required evidence | Typecheck + build + test suite + WCAG audit + SCA security review |
| Release sensitivity | Client operational system — Founder + ARE approval before any production deployment |
| Agent routing note | Attached above |

**Build Packet Status: CONDITIONAL — awaiting SAA architecture decision and gap closure before Gate 2 clears for execution**

---

## Gate 1A: Plan Mode Output

| Field | Value |
|---|---|
| Build class | Class 3 — Integration or Data-Sensitive |
| Active cell | MOA, CSM, PMA, SAA, RCA, FIS, BLS, IDS, DSS, SCA, TVA, AAA, DAA, DRA, QAS (reserved) |
| Implementation domain | Full-stack (FIS primary frontend; BLS primary backend; DSS primary schema) |
| Verification plan | tsc --noEmit + test suite + WCAG automated scan + SCA review |
| Release sensitivity | Client operational system — ARE + Founder gate required before production |
| Completion report | Required before advancement to Gate 5 |

---

## Gate 2: Governance Check

| Item | Status |
|---|---|
| Root contract active (CLAUDE.md) | ✓ |
| plan_mode.md loaded | ✓ |
| github_disclosure_gate.md loaded | ✓ |
| handover_protocol.md loaded | ✓ |
| mandatory-build-activation-protocol-2026-04-26.md loaded | ✓ |
| ai-review-authority-matrix.md loaded | ✓ |
| ai-native-operating-architecture.md loaded | ✓ |
| Repo context loaded (RCA) | PENDING — activates after SAA scaffold |
| Correct specialist set active | ✓ — cell defined above |
| Reviewer path reserved (QAS) | ✓ |
| system-maintenance skill | Required — run before any build or npm operations |
| visual-direction skill | Not required (internal ops tool — not a public commercial route) |
| legal-compliance skill | **REQUIRED** — activate before any patient data schema, JDPA consent, or regulatory surface is built |

**Governance Check: PENDING — SAA architecture decision + 6 capability gaps must be resolved before execution clears**

---

## Gate 3: Controlled Execution

**Status: NOT STARTED — awaiting SAA architecture decision**

Next action: SAA to produce architecture record answering:
1. Frontend framework: React + TypeScript + Vite vs. Next.js (consider Supabase SSR support)
2. Styling: Tailwind CSS v4 + shadcn/ui (consistent with NODRFT stack)
3. Backend: Supabase (auth + RLS + storage + edge functions) vs. separate API layer
4. AI: Claude Vision via API (claude-sonnet-4-6 as per current model guidance)
5. Deployment: Vercel (frontend) + Supabase (backend) vs. alternative
6. Monorepo or separate repos for frontend/backend

---

## Gate 4: Evidence Package

| Evidence Item | Status |
|---|---|
| SAA architecture record | PENDING |
| DSS schema approval | PENDING |
| SCA auth + JDPA review | PENDING |
| TypeScript check | PENDING |
| Production build | PENDING |
| Test suite | PENDING |
| WCAG 2.1 AA audit | PENDING |
| Lynk payment integration test | PENDING |
| Claude Vision extraction test | PENDING |
| Schedule drug log format approval | PENDING |

---

## Gates 5 & 6

- Gate 5 (Independent Review): Pending — QAS (Imani) activates after Gate 4 evidence complete
- Gate 6 (Human): Pending — ARE technical review + Founder sign-off required before any production deployment

---

## Stop Conditions Active

Per mandatory-build-activation-protocol, build will pause if:
- Any patient data is written to a database without SCA RLS review completed
- Any JDPA consent flow is implemented without legal-compliance skill review
- Schedule drug logging deviates from approved format without pharmacist sign-off
- Any code reaches production without ARE technical review + Founder authorization
- Claude Vision API processes real patient prescription data before SCA privacy review
- Scope expands to patient-facing features without a new SOW and Change Order

---

## Escalation Path

- Technical issues → HHC (Desmond) → ARE
- Scope changes → Founder (via HHC)
- JDPA / regulatory wording → Founder + qualified legal counsel
- Schedule drug logging format → Client pharmacist + Founder
- Supabase provisioning authorization → Founder (cost commitment)

---

## Governance Note — Workspace Location

Per Founder direction (2026-05-07), the PharmacyOS production build lives in `04_products/pharmacyos/`.

Note for compliance: CLAUDE.md Section 3 defines `04_products/` as NoDrftSystems proprietary products. PharmacyOS is a client-owned product being built under a client SOW. The client IP ownership clause in the MSA governs — PharmacyOS IP belongs to Winchester Global Pharmacy on delivery, not NoDrftSystems.

For client management artifacts (SOW, discovery records, handoff, legal review), a paired client workspace must exist at:
`02_client-system/WINCHESTERGLOBAL_pharmacyos/`

This record is distinct from `02_client-system/WINCHESTERGLOBAL_pharmacy-website/` (Phase 1 informational site — separate SOW).
