# PharmacyOS — Pre-Pilot Gate Matrix v1
**Status:** OPEN — all gates must pass before any live patient data is processed
**Date:** 2026-05-11
**Authority:** NoDrftSystems Founder + Winchester pharmacy owner/operator

---

## Go/No-Go Rule

PharmacyOS may enter a limited pilot only when ALL six gates below are marked **PASSED** with
signed/documented evidence on file. No gate may be waived. No deadline justifies skipping any gate.

---

## Gate 1 — Licensed Jamaican Pharmacist Workflow Review

| Attribute | Detail |
|---|---|
| **Status** | OPEN — blocking |
| **Required reviewer** | Licensed pharmacist registered with the Pharmacy Council of Jamaica |
| **Scope of review** | Prescription intake, pharmacist verification, drug interaction and allergy warning display, dispensing authorization, dispensing label content, refill and partial-fill logic, controlled/scheduled drug handling, pharmacist override workflow, duplicate dispensing prevention |
| **Pass condition** | Pharmacist signs review memo confirming workflow is safe for professional pharmacy use |
| **No-go condition** | Pharmacist cannot approve workflow, flags safety gaps, or requires regulator guidance before sign-off |
| **Evidence file** | `00_governance/evidence/pharmacist-review-memo.md` (to be created) |

---

## Gate 2 — Jamaican Legal and Regulatory Compliance Review

| Attribute | Detail |
|---|---|
| **Status** | OPEN — blocking |
| **Required reviewer** | Jamaican attorney or qualified healthcare compliance reviewer |
| **Scope of review** | Pharmacy Act and Pharmacy Regulations review; Regulation 20 (electronic prescription handling); computerized dispensing records; controlled-drug register — whether digital log supplements or legally replaces the bound manual register; record retention requirements; pharmacist authority points; liability allocation between pharmacy, pharmacist, and software provider |
| **Citation note** | Reference is Regulation 20 of the Pharmacy Regulations. The "§24 computerized dispensing records" wording previously used has not been verified from available public sources — do not rely on it. Qualified counsel must confirm the exact statutory basis. |
| **Pass condition** | Written legal memo clears pilot scope or defines permitted pilot boundaries with no unresolved statutory barriers |
| **No-go condition** | Counsel flags unresolved legal barrier, requires regulator clarification, or cannot confirm electronic records are lawful for this use case |
| **Evidence file** | `00_governance/evidence/legal-compliance-memo.md` (to be created) |

---

## Gate 3 — JDPA Technical Compliance Review

| Attribute | Detail |
|---|---|
| **Status** | OPEN — blocking |
| **Required reviewer** | Privacy/compliance lead + technical architect |
| **Basis** | Jamaica Data Protection Act 2020; patient health data is sensitive personal data (physical or mental health or condition); data controllers must register with the Office of the Information Commissioner and may require a DPO; annual Data Protection Impact Assessment required; breach notification obligations apply |
| **Scope of review** | Data inventory; lawful processing purpose; sensitive data classification; privacy notice requirements; data subject request handling; erasure/blocking/destruction workflow; breach notification procedure; annual DPIA requirement; data controller and processor role map; AI/OCR data handling restrictions |
| **Pass condition** | Written JDPA compliance packet documents all eight data protection standards, confirms controller/processor roles, and establishes breach and DPIA procedures |
| **No-go condition** | No breach notification process, no access controls, unclear controller/processor roles, or OIC registration not addressed |
| **Evidence file** | `00_governance/evidence/jdpa-compliance-packet.md` (to be created) |

---

## Gate 4 — Hosting, Data Residency, and Processor Terms Review

| Attribute | Detail |
|---|---|
| **Status** | OPEN — blocking if live patient data is used |
| **Required reviewer** | Technical architect + legal/compliance reviewer |
| **Basis** | Supabase is a US-incorporated entity; DPA must be executed through Supabase dashboard to be legally binding; Jamaica DPA eighth standard requires cross-border transfer assessment; no available AWS-backed region in Jamaica — nearest listed options include US, Canada, and South America |
| **Scope of review** | Execute or review Supabase DPA; select hosting region; document backup and retention policy; confirm encryption at rest and in transit; define access control policy; complete cross-border transfer assessment under JDPA eighth standard |
| **Pass condition** | Executed Supabase DPA on file, hosting region selected and documented, cross-border transfer basis established, retention/deletion policy confirmed |
| **No-go condition** | Patient data stored before processor terms, hosting, retention, and transfer basis are approved |
| **Evidence file** | `00_governance/evidence/hosting-dpa-review.md` (to be created) |

---

## Gate 5 — Pharmacy Owner/Operator Workflow Validation

| Attribute | Detail |
|---|---|
| **Status** | OPEN — required before pilot |
| **Required reviewer** | Winchester pharmacy owner/operator |
| **Scope of review** | Dashboard KPIs accuracy, Rx inventory and POS inventory separation, dispensing workflow match to real counter operations, POS cashier workflow, stock alert thresholds, reporting output, staff roles and permissions, exception workflow handling |
| **Pass condition** | Signed operator approval confirming the system matches real pharmacy operations |
| **No-go condition** | Owner says critical workflow does not match how the pharmacy actually operates |
| **Evidence file** | `00_governance/evidence/owner-operator-approval.md` (to be created) |

---

## Gate 6 — Staff Usability Review

| Attribute | Detail |
|---|---|
| **Status** | OPEN — required before pilot |
| **Required participants** | At least one pharmacy technician; at least one front-desk cashier |
| **Scope of review** | Observed sessions using realistic workflows — prescription lookup, customer pickup, insurance/NHF status display, stock search, partial fill, payment handoff, exception handling. Sessions conducted without developer assistance; errors and confusion points logged |
| **Pass condition** | Staff can complete core workflows safely and consistently without unsafe confusion or excessive support intervention |
| **No-go condition** | Staff cannot complete core tasks, make clinical-decision errors due to interface confusion, or require constant support |
| **Evidence file** | `00_governance/evidence/staff-usability-report.md` (to be created) |

---

## Additional Acceptance Criteria

All of the following must also be true before pilot:

- [ ] Duplicate dispensing prevention implemented and tested (a dispensed Rx cannot be re-dispensed)
- [ ] Controlled/schedule drug handling is clearly framed as supplemental audit support only, or legally approved for digital-only records
- [ ] AI/OCR extraction is limited to assistive extraction with pharmacist verification required before any clinical or dispensing record is saved
- [ ] Original paper prescriptions are retained as primary records until Gate 2 (legal review) clears electronic-only record-keeping
- [ ] Bound controlled-substance register maintained in parallel until Gate 2 clears digital register adequacy
- [ ] Data minimization confirmed — no patient data collected beyond what is required for dispensing purposes
- [ ] No PHI exported to cloud-synced storage (OneDrive, Google Drive) at any point

---

## Data Gaps (Not Verifiable from Public Sources)

| Item | Status |
|---|---|
| Exact statutory basis for computerized dispensing records (previously cited as "§24") | **Unverified** — requires counsel confirmation |
| Whether digital controlled/schedule drug logs can legally replace bound manual registers | **Unverified** — requires counsel confirmation |
| Whether Supabase cross-border processing is acceptable for this specific pharmacy use case under JDPA | **Requires Gate 3 + 4 review** |
| Whether Winchester's registered pharmacist approves the inferred workflow and permission structure | **Gate 1 — not yet completed** |
| Whether AI/OCR extraction is accurate enough for Jamaican prescriptions and supplier documents | **Not tested with real documents** |

---

## Evidence Folder Structure (to be populated)

```
00_governance/evidence/
  pharmacist-review-memo.md        — Gate 1
  legal-compliance-memo.md         — Gate 2
  jdpa-compliance-packet.md        — Gate 3
  hosting-dpa-review.md            — Gate 4
  owner-operator-approval.md       — Gate 5
  staff-usability-report.md        — Gate 6
```

---

*Document version: v1 · Created: 2026-05-11 · Next review: before any live patient data is processed*
*Sources: Ministry of Health & Wellness (electronic prescription guidance); Office of the Information Commissioner Jamaica (OIC obligations); Supabase legal/DPA documentation; Pharmacy Council of Jamaica*
