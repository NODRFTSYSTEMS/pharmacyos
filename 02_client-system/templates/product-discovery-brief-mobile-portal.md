# NoDrftSystems Client Portal — Product Discovery Brief
# Classification: Internal — Proprietary
# Status: TEMPLATE — Activate when Founder authorizes the Discovery Sprint for this product

## Product Overview

**Product Name:** NoDrftSystems Client Portal
**Product Type:** Proprietary internal product (client-facing)
**Build Class:** T4 — Platform Starter (app-class; requires Discovery Sprint + Architecture review)
**Proposed Primary Surface:** Progressive Web App (PWA) — mobile-first, installable

## Discovery Sprint Authorization

This brief activates when the Founder explicitly authorizes the Discovery Sprint for this product. Until authorization is on record in the Decision Log, no design, architecture, or build work proceeds.

**Authorization required from:** Founder
**Log to:** `01_system/operations/decision-log.md` — entry type: Proprietary Product Discovery Authorization

---

## Proposed Functionality (Requires Discovery Validation)

Three functional surfaces have been identified. Discovery Sprint must confirm which are in scope for the initial build, which are deferred, and what the acceptance criteria are for each.

### Surface 1 — Client Intake
- Client completes intake form (project inquiry, budget, timeline, contact information)
- Form data routes to Airtable CRM and generates a notification to the Founder
- Replaces or supplements the current website form endpoint

### Surface 2 — Deliverable Review & Approval
- Client views uploaded deliverables (design files, documents, draft content)
- Client leaves comments or approves a deliverable
- Approval is timestamped and logged; optionally routes to DocuSign for formal sign-off
- NoDrftSystems notified on approval or comment

### Surface 3 — Project Status Monitoring
- Client views their project's current phase, next milestone, and expected delivery date
- Status is updated by NoDrftSystems (not auto-generated)
- Optional: notification when status changes

---

## Discovery Sprint Questions (Must Be Answered Before Architecture Begins)

These are open questions that materially affect architecture, cost, and timeline. The Discovery Sprint exists to resolve them.

### Authentication
- What is the preferred auth method for clients? Options: magic link (email-based, no password), email + password, Google SSO.
- Will clients manage their own accounts, or does NoDrftSystems provision each client account manually?
- What happens when a client's project ends — is their account deactivated, archived, or retained?

### Data Isolation Architecture
- Each client must see only their own data. Two architectures are viable: (a) Row-Level Security (RLS) in a single Supabase schema — simpler, standard practice; (b) Separate Supabase schema per client — stronger isolation, higher operational complexity. Which is appropriate given the sensitivity of client project data?
- Are there compliance requirements (HIPAA, SOC 2, CCPA) that constrain the data architecture choice?

### Approval Workflow
- Is the approval workflow sequential (NoDrftSystems submits → client reviews → client approves or requests revision) or async (multiple rounds without a defined sequence)?
- Is DocuSign integration required for formal approval records, or is an in-app timestamp sufficient?
- How many approval states are needed: Draft / Under Review / Approved / Revision Requested?

### Notification Model
- How should clients be notified of updates? Options: email notification, in-app notification (PWA push), or both.
- Is push notification (PWA) required, or is email sufficient for V1?
- How should NoDrftSystems be notified of client actions (approval, comment, intake submission)?

### Project Monitoring Granularity
- What level of project status detail should clients see: high-level phases only (Discovery / Design / Build / QA / Launch), or task-level granularity?
- Who updates the status: the Founder manually, an agent, or an automated integration (e.g., from Airtable)?
- Should clients see estimated delivery dates, and if so, how are those maintained?

### Scope Boundaries for V1
- Which of the three surfaces are in scope for V1? Which are deferred to V2?
- Is the MVP a single surface (e.g., intake only) or all three?
- Is a native mobile app (iOS/Android via React Native/Expo) in scope, or is PWA sufficient?

---

## Likely Architecture (Post-Discovery — For Reference Only)

The following is the probable architecture based on the existing NoDrftSystems stack. Discovery Sprint confirms or revises this.

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Next.js — PWA with `next-pwa` | Mobile-first; installable on iOS and Android without App Store |
| Hosting | Vercel | Consistent with existing client builds |
| Auth | Supabase Auth | Magic link or email+password; provider TBD in Discovery |
| Database | Supabase Postgres with Row-Level Security | Client data isolation; schema design in Architecture review |
| File Storage | Supabase Storage | Deliverable uploads (PDFs, images, documents) |
| Approval Records | Supabase + optional DocuSign integration | TBD on DocuSign requirement |
| CRM Integration | Airtable (intake data routes to existing CRM) | Webhook or Airtable API |
| Notifications | Resend (email) + optional PWA push | Email is V1 baseline |

---

## Definition of Done for Discovery Sprint

The Discovery Sprint for this product is complete when the following are produced:
- [ ] All 8 open questions above answered and documented
- [ ] V1 scope confirmed: surfaces in scope, surfaces deferred
- [ ] Architecture review scheduled (if V1 proceeds)
- [ ] Signed SOW for V1 build (if Founder authorizes)
- [ ] Data isolation architecture decision recorded in Decision Log
- [ ] Auth model decision recorded in Decision Log
- [ ] Rough order of magnitude cost and timeline estimate produced for V1

---

## Escalation & Approval Gates

- Discovery Sprint authorization → Founder (Decision Log entry required before starting)
- V1 scope decision → Founder
- Data architecture decision → ARE + Founder
- Build start authorization → Founder (signed SOW + Architecture review on file)
- Any V1 feature that handles client PII → SCA review + LCA compliance check before build

---

*Template version: 1.0 | Created: 2026-04-24 | Status: AWAITING FOUNDER AUTHORIZATION*
