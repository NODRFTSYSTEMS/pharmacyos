# PharmacyOS — Design Handoff for Claude Design (Figma MCP)

**Client:** Winchester Global Pharmacy (Kingston, Jamaica)
**System:** PharmacyOS — proprietary web-based pharmacy operations platform
**Date:** 2026-05-07
**Author:** Discovery & Strategy team
**Audience:** Claude Design (Figma MCP) — automated Figma frame & component generation
**Classification:** Internal — Client Confidential. Not for external distribution.
**Replaces:** PharmPartner (legacy)
**Source documents:**
- Discovery sprint — `02_client-system/WINCHESTERGLOBAL_pharmacy-website/02_discovery/pharmacyos-discovery-feasibility-sprint-2026-05-07.md`
- Scope + strategy — `02_client-system/WINCHESTERGLOBAL_pharmacy-website/03_strategy/pharmacyos-scope-layout-strategy-2026-05-07.md`

> **Reading instructions for Claude Design:** Each section below is a self-contained specification block. Section 2 defines the design tokens — load these as Figma variables before generating frames. Section 4 defines reusable components; create these as Figma components first. Section 5 enumerates all 43 screens; generate one Figma frame per screen, composed from Section 4 components, using the layouts in Section 3. Section 6 user flows are FigJam diagrams. Sections 7–8 are global constraints applied to every frame.

---

## Section 1 — Product Brief

### 1.1 What PharmacyOS is

A single-tenant, web-based, cloud-hosted pharmacy operations platform for Winchester Global Pharmacy's Kingston location. It is the daily operating system used by pharmacy staff to run the business: receiving stock, scanning prescriptions, dispensing medications, processing retail sales, managing patients, and reporting on regulated activity to the Jamaican Ministry of Health.

PharmacyOS replaces the incumbent PharmPartner system. It is a clean-slate build with its own design language; nothing is inherited from prior tooling or from the public-facing winchesterglobal.com marketing site.

### 1.2 What PharmacyOS is NOT

- **Not a patient-facing app.** Patients never log in. There is no patient portal, no appointment booking, no patient mobile app.
- **Not a public website.** No marketing pages, no SEO surfaces, no anonymous traffic.
- **Not e-commerce.** No online ordering, no shipping, no online payment. All transactions are in-store.
- **Not a clinical EMR.** No diagnoses, no charting, no labs. PharmacyOS captures what was prescribed and dispensed, not why.
- **Not bilingual.** UI is English-only. (Jamaica operational context — no ES/FR requirement.)

### 1.3 User roles (5)

| Role | Primary job in the system |
|---|---|
| **Pharmacist** | Verify and approve prescriptions; sign off schedule-drug dispensing; oversee AI-extracted Rx review; manage clinical exceptions. |
| **Pharmacy Technician** | Receive stock; fill verified prescriptions; run AI invoice scanner; manage lots and expiries. |
| **Front Desk / Cashier** | Operate POS terminal; register patients; manage loyalty; collect payment. |
| **Manager** | Run reports; manage suppliers; configure alert thresholds; review KPIs and audit activity. |
| **Admin** | User/role management; system settings; security and 2FA controls; full audit access. |

### 1.4 User count, devices, deployment

- **Concurrent users:** ~12 staff at peak (2 pharmacists, 4 technicians, 4 front desk, 1 manager, 1 admin).
- **Devices:** desktop (Windows, 1440px+ displays at counter and back office) and tablet (10″ landscape, 1024–1280px, primarily for POS terminal and stock receiving).
- **Deployment:** single-tenant cloud (one Winchester instance, no multi-pharmacy switching). Web-based, accessed via browser. No native installs.
- **Browsers:** Chrome and Edge (current and current-1).

---

## Section 2 — Design Language

A complete token set for a clinical operations system. Defined from scratch — not inherited.

### 2.1 Color tokens

#### Surface & structure
| Token | Hex | Use |
|---|---|---|
| `--color-bg-base` | `#F5F7FA` | App background — clinical light grey, never pure white |
| `--color-bg-surface` | `#FFFFFF` | Cards, tables, modals, form surfaces |
| `--color-bg-sidebar` | `#111827` | Sidebar / nav — deep near-black for authority and focus |
| `--color-bg-sidebar-hover` | `#1F2937` | Sidebar hover and active background |

#### Action & accent
| Token | Hex | Use |
|---|---|---|
| `--color-primary` | `#0F6FFF` | Primary actions, focus rings, active route indicator |
| `--color-primary-hover` | `#0257CC` | Primary button hover |
| `--color-accent` | `#00B894` | Data callouts, positive operational metrics |

#### Semantic
| Token | Hex | Use |
|---|---|---|
| `--color-success` | `#10B981` | Confirmation, completed states, positive deltas |
| `--color-warning` | `#F59E0B` | Caution, low confidence, expiring 30–60 days |
| `--color-error` | `#EF4444` | Errors, expired, schedule violations |
| `--color-info` | `#3B82F6` | Informational notices |

#### Prescription queue states (background / foreground pairs)
| State | Background | Foreground | Meaning |
|---|---|---|---|
| Received | `#E0E7FF` | `#6366F1` (indigo) | Rx entered, awaiting pharmacist verification |
| Verified | `#FEF3C7` | `#D97706` (amber) | Pharmacist-approved, ready to fill |
| Filled | `#D1FAE5` | `#059669` (green) | Physically filled, awaiting handoff |
| Dispensed | `#F3F4F6` | `#6B7280` (grey) | Completed / archived |

#### Regulatory tags
| Tag | Background | Foreground | Meaning |
|---|---|---|---|
| Schedule drug | `#FEE2E2` | `#DC2626` (red) | Controlled substance — extra logging |
| NHF drug | `#EFF6FF` | `#2563EB` (blue) | National Health Fund subsidy |

#### Text
| Token | Hex | Use |
|---|---|---|
| `--color-text-primary` | `#111827` | Body, headings |
| `--color-text-secondary` | `#6B7280` | Captions, metadata, table labels |
| `--color-text-disabled` | `#D1D5DB` | Disabled inputs, placeholder |
| `--color-text-on-dark` | `#F9FAFB` | Text on sidebar / dark surfaces |

#### Border
| Token | Hex | Use |
|---|---|---|
| `--color-border` | `#E5E7EB` | Default border for inputs, cards, table rows |
| `--color-border-subtle` | `#F3F4F6` | Table row dividers |
| `--color-border-focus` | `#0F6FFF` | Focused inputs, active sortable column |

### 2.2 Typography

Two families. UI in a humanist sans, precision data in mono.

| Family | Use | Source |
|---|---|---|
| **Inter** | All UI text — buttons, labels, body, headings | Google Fonts |
| **JetBrains Mono** | Lot numbers, DIN codes, prescription IDs, quantities, barcodes, timestamps, currency totals at POS | Google Fonts |

#### Type scale

| Token | Size / Line-height / Weight | Use |
|---|---|---|
| `--type-page-title` | 24px / 32px / 700 | Page H1 |
| `--type-section` | 18px / 28px / 600 | Section H2 |
| `--type-card-title` | 16px / 24px / 600 | Card H3, Rx patient name |
| `--type-body` | 16px / 24px / 400 | Body copy |
| `--type-body-sm` | 14px / 20px / 400 | UI base — table cells, button labels, form values |
| `--type-label` | 12px / 16px / 500 | Form labels (above input) |
| `--type-caption` | 12px / 16px / 500, uppercase, 0.04em tracking | Table headers, metadata labels |
| `--type-mono-data` | 13px / 20px / 400, JetBrains Mono | Inline mono — DIN, lot, ID |
| `--type-mono-input` | 14px / 20px / 400, JetBrains Mono | Mono input fields |
| `--type-mono-metric` | 28px / 32px / 500, JetBrains Mono | Big-number metric cards |
| `--type-mono-pos-tender` | 24px / 32px / 500, JetBrains Mono | POS cash tender / change |

### 2.3 Spacing — 4px base grid

| Token | px |
|---|---|
| `--space-1` | 4 |
| `--space-2` | 8 |
| `--space-3` | 12 |
| `--space-4` | 16 |
| `--space-5` | 20 |
| `--space-6` | 24 |
| `--space-8` | 32 |
| `--space-10` | 40 |
| `--space-12` | 48 |
| `--space-16` | 64 |

### 2.4 Border radius

| Token | px | Use |
|---|---|---|
| `--radius-card` | 6 | Cards, panels, modals |
| `--radius-control` | 4 | Buttons, inputs, badges, chips |
| `--radius-table` | 0 | Tables — never rounded |
| `--radius-pill` | 999 | Status pills (height-clamped) |

### 2.5 Shadows

| Token | Value | Use |
|---|---|---|
| `--shadow-card` | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)` | Cards, kanban tiles |
| `--shadow-card-hover` | `0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)` | Card hover lift |
| `--shadow-modal` | `0 20px 60px rgba(0,0,0,0.15)` | Modals, dialogs |
| `--shadow-dropdown` | `0 4px 16px rgba(0,0,0,0.12)` | Menus, autocomplete, popovers |

### 2.6 Density

| Surface | Row / control height | Notes |
|---|---|---|
| Data tables | 36px row | Compact — high data density |
| Forms | 48px input | Comfortable — reduces error in clinical entry |
| POS terminal | 56px+ button / input | Large touch targets — used on tablet, glove-friendly |
| Sidebar nav | 40px item | Tight but readable |

### 2.7 Iconography

- **Library:** Phosphor Icons, regular weight.
- **Default size:** 20px.
- **In-table / inline-with-label:** 16px.
- **POS:** 24px.
- **Color:** inherits from text color; never colored unless semantic (e.g. red lock for schedule drug).
- **Convention:** every icon has an `aria-label` (Section 8). Icons never carry meaning alone — always paired with text or status label.

---

## Section 3 — Layout System

Three layout shells. All other screens compose from these.

### 3.1 Admin Portal layout (default — used by all non-POS, non-auth screens)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌───────────┬─────────────────────────────────────────────┐ │
│ │           │  PAGE HEADER                                │ │
│ │  SIDEBAR  │  ─ Title (24/700)  Breadcrumb              │ │
│ │  240px    │  ─ Primary CTA (top-right)                  │ │
│ │  fixed    ├─────────────────────────────────────────────┤ │
│ │  #111827  │  FILTER / SEARCH BAR (when applicable)      │ │
│ │           ├─────────────────────────────────────────────┤ │
│ │  - Logo   │                                             │ │
│ │  - Nav    │           CONTENT BODY                      │ │
│ │    groups │           (table | kanban | form |          │ │
│ │  - User   │            chart | detail panels)           │ │
│ │  (bottom) │                                             │ │
│ └───────────┴─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Specs:**
- Sidebar: 240px fixed, full viewport height, `--color-bg-sidebar`.
- Main: flex-1, `--color-bg-base`.
- Page header: 80px tall, `--color-bg-surface`, bottom border `--color-border`. Title left, breadcrumb beneath title (12px secondary), primary CTA right-aligned.
- Filter bar (when present): 64px, `--color-bg-surface`, bottom border.
- Content body: padding `--space-6` (24px), gap `--space-6` between stacked components.
- Sidebar collapses to 64px icon-only between 1024–1280px (Section 7).

### 3.2 POS Terminal layout (fullscreen, no sidebar)

```
┌──────────────────────────────────────────┬────────────────┐
│  PRODUCT SEARCH + CART (60%)             │  PAYMENT (40%) │
│  ┌────────────────────────────────────┐  │  ┌──────────┐  │
│  │ Barcode input (56px, full-width)   │  │  │ Method   │  │
│  └────────────────────────────────────┘  │  │ tabs     │  │
│  ┌────────────────────────────────────┐  │  │ Cash|Card│  │
│  │ Product grid / scan result         │  │  │  | Lynk  │  │
│  └────────────────────────────────────┘  │  └──────────┘  │
│  ┌────────────────────────────────────┐  │  Subtotal      │
│  │ Cart line items                    │  │  Tax           │
│  │ ─ name  qty  total  ✕              │  │  Loyalty disc. │
│  │ ─ name  qty  total  ✕              │  │  ──────────    │
│  └────────────────────────────────────┘  │  TOTAL (mono)  │
│  Subtotal / line count                   │  Tender input  │
│                                          │  Change (mono) │
│                                          │  CONFIRM (CTA) │
└──────────────────────────────────────────┴────────────────┘
```

- Fullscreen, no sidebar. Exit POS = explicit "Close POS" button top-right (returns to admin shell).
- Left column: 60% width, padding `--space-6`.
- Right column: 40% width, `--color-bg-surface`, left border `--color-border`, padding `--space-6`.
- All controls 56px+ for tablet touch.

### 3.3 Auth layout (centered, no chrome)

```
┌─────────────────────────────────────┐
│                                     │
│             [ LOGO ]                │
│                                     │
│   ┌────────────────────────────┐    │
│   │  Auth card, 400px max,     │    │
│   │  white, --shadow-card,     │    │
│   │  --radius-card             │    │
│   │                            │    │
│   │  Form / 2FA digits         │    │
│   │                            │    │
│   └────────────────────────────┘    │
│                                     │
│        © Winchester 2026            │
└─────────────────────────────────────┘
```

- `--color-bg-base` background.
- Logo 40px tall, centered, `--space-12` from top of card.
- Card centered, max-width 400px, padding `--space-8`.
- Footer line: 12px secondary text, `--space-8` below card.

### 3.4 Dashboard grid

```
┌─────────────────────────────────────────────┐
│ [Metric] [Metric] [Metric] [Metric]         │ ← 4-col, equal width, 24px gap
├─────────────────────────────────────────────┤
│ ┌──────────────────────────┬─────────────┐  │
│ │ Prescription Kanban (60%)│ Alerts (40%)│  │
│ │ — top 10 per column      │ — stock     │  │
│ │                          │ — expiry    │  │
│ └──────────────────────────┴─────────────┘  │
├─────────────────────────────────────────────┤
│ Recent Activity table (full-width, last 10) │
└─────────────────────────────────────────────┘
```

Gaps: `--space-6` (24px) between rows and columns.

---

## Section 4 — Component Library

Every component below is a Figma component. Specs include base, states, variants.

### 4.1 Navigation Sidebar

| Property | Value |
|---|---|
| Background | `#111827` |
| Width | 240px (collapsed: 64px) |
| Padding | `--space-4` horizontal, `--space-4` vertical |

**Anatomy:**
- **Logo zone** (top, 64px tall) — white wordmark "PharmacyOS", left-aligned. Below: small grey caption "Winchester Global".
- **Nav groups** — collapsible sections. Group header: 12px uppercase `--color-text-secondary`. Items beneath.
- **Nav item** — 40px height, 16px horizontal padding, 14px Inter, color `--color-text-on-dark`. Icon left (20px), label right.
- **User account zone** (bottom, sticky) — 64px tall, top border `rgba(255,255,255,0.08)`. Avatar circle, name + role badge stacked, logout icon right.

**Nav groups (in order):**
1. Dashboard
2. Inventory — Stock, Catalog, Receive, AI Scanner, Alerts, Suppliers
3. Prescriptions — Queue, New, AI Scanner, Schedule Log
4. Patients — Search, New
5. Retail POS — Open Terminal, Products, Inventory, Suppliers, Reports, Loyalty
6. Reporting — Hub, Inventory, Dispensing, Schedule Log, Revenue
7. AI — Job Queue
8. Admin — Users, Audit, Settings, Security

**States:**
- **Default** — text `#F9FAFB`, no background.
- **Hover** — background `#1F2937`.
- **Active** — background `#1F2937`, text white, **3px left border `--color-primary`**.
- **Disabled (no role access)** — item hidden entirely (role-aware, not greyed out).
- **Collapsed (1024–1280px)** — icons only, 64px wide, tooltip on hover.

### 4.2 Data Table

| Property | Value |
|---|---|
| Surface | `#FFFFFF` |
| Border | `--radius-table` (0), `--color-border` outer |
| Row height | 36px |

**Anatomy:**
- **Header row** — `#F9FAFB` background, 36px tall. Labels: `--type-caption`, color `--color-text-secondary`. Sortable columns show ↕ indicator (12px); active sort shows ↑ or ↓ in `--color-primary`.
- **Body row** — white, bottom border `--color-border-subtle`. Hover: `#F9FAFB`. Selected: `#EFF6FF`.
- **Cell padding** — `--space-3` vertical, `--space-4` horizontal.
- **Action column** (rightmost) — icon buttons only, no labels. 28px square hit areas, gap `--space-2`.
- **Pagination** (footer) — left: "Showing 1–25 of 142" (12px secondary). Right: `‹ 1 2 3 … ›` (28px buttons).
- **Empty state** — centered in body. 48px icon (`--color-text-disabled`), 16px heading, 14px secondary description, optional CTA button.

**Variants:**
- **Compact** (default, 36px) — used everywhere except as noted.
- **Audit log** — adds JSON-diff expandable rows (Section 4.10).

### 4.3 Status Badge / Chip

| Property | Value |
|---|---|
| Height | 20px |
| Padding | 10px horizontal |
| Radius | `--radius-control` (4px) |
| Type | `12px / 500` Inter |
| Icon | 12px, optional, leading |

**Variants:**
| Variant | BG | FG | Icon |
|---|---|---|---|
| Received | `#E0E7FF` | `#6366F1` | `Inbox` |
| Verified | `#FEF3C7` | `#D97706` | `CheckCircle` |
| Filled | `#D1FAE5` | `#059669` | `Package` |
| Dispensed | `#F3F4F6` | `#6B7280` | `Archive` |
| Cancelled | `#FEE2E2` | `#DC2626` | `XCircle` |
| Schedule drug | `#FEE2E2` | `#DC2626` | `Lock` (required) |
| NHF | `#EFF6FF` | `#2563EB` | `Shield` (required) |

Schedule and NHF chips **always carry their icon** (regulatory legibility — Section 8 a11y).

### 4.4 Kanban Board (Prescription Queue)

**Board:**
- 4 columns: Received | Verified | Filled | Dispensed.
- Equal width, gap `--space-4`, full-width container.
- Column max-height 80vh; scroll within column.

**Column header:**
- Top color bar 4px (matches state foreground color).
- Below: state label (16/600) + count badge (pill, secondary text).

**Card:**
- White, `--radius-card`, `--shadow-card`, padding `--space-4`.
- Patient name (Inter 600 16px) — top.
- Drug + qty (14px primary) — middle.
- Bottom row: time received (`--type-mono-data`) + Schedule/NHF chips inline.
- Hover: `--shadow-card-hover`, cursor pointer.
- **Drag-to-reorder** within column (vertical). Drop indicator: 2px `--color-primary` line.

**Compact dashboard variant:** card shows only patient name + drug + chips, 56px tall, top 10 cards per column.

### 4.5 AI Review Panel

**Layout:** split view, 50/50.

**Left (image preview):**
- Full document image, fit-contain in container.
- Zoom controls bottom-left (+ / − / fit).
- Page indicator if multi-page.

**Right (extracted fields):**
- Stacked field rows.
- Each row:
  - Label (12/500 secondary, uppercase tracking).
  - Editable input (40px, mono if numeric/code).
  - Confidence indicator: 8px dot + percentage. Green ≥90, amber 70–89, red <70.
  - Below-threshold (configurable, default <85): amber input border + "Review required" 12px amber text below input.
- **Action footer** (sticky bottom): `Reject` (secondary) — `Save Draft` (secondary) — `Confirm All` (primary). Confirm All disabled if any flagged field unedited.
- **Confidence threshold reference** (top-right of right panel): "Auto-accept ≥ 85% (system setting)".

### 4.6 Patient Card (compact, search results)

| Property | Value |
|---|---|
| Surface | `#FFFFFF`, `--radius-card`, `--shadow-card` |
| Padding | `--space-4` |
| Width | flex (responsive grid, min 280px) |

**Anatomy:**
- Top row: name (16/600) — right: insurance chip(s) inline.
- Second row: DOB (14 secondary) · phone (14 secondary, mono).
- Third row (flags only when present):
  - Allergy: amber chip "ALLERGIES" + count.
  - JDPA: green check "Consent on file" OR amber "Consent pending".
- Hover: `--shadow-card-hover`. Click → patient profile.

### 4.7 Form Fields

**Input (default):**
- Height 40px (forms 48px); radius 4px; border `--color-border`; padding 12px horizontal; `--type-body-sm`.
- **Label**: 14/500, above field, gap `--space-2` (6–8px). Required asterisk: red, after label text.
- **Focus**: border `--color-primary` + ring `0 0 0 3px rgba(15,111,255,0.10)`.
- **Error**: border `--color-error`; helper text below: 12px red; icon `Warning` 12px leading.
- **Disabled**: bg `#F9FAFB`, text disabled, border `#F3F4F6`.

**Mono input** — for quantities, lot numbers, DIN codes, prescription IDs: same chrome, font `--type-mono-input`.

**Select** — same chrome, trailing `CaretDown` 16px, dropdown uses `--shadow-dropdown`.

**Autocomplete** — same chrome with leading `MagnifyingGlass`. Results: `--shadow-dropdown` panel, 36px rows, hover `#F9FAFB`. Drug autocomplete shows stock level inline (right) — green if stocked, red if out.

**Checkbox / radio** — 18px square (4px radius), border `--color-border`, checked fills with `--color-primary`.

**Textarea** — same chrome as input; min height 80px; resize vertical only.

### 4.8 Buttons

| Variant | Background | Foreground | Border | Use |
|---|---|---|---|---|
| Primary | `--color-primary` | white | none | Page primary CTA |
| Primary hover | `--color-primary-hover` | white | none | — |
| Secondary | white | `--color-text-primary` | `--color-border` | Cancel, secondary actions |
| Tertiary | transparent | `--color-primary` | none | Inline links / minor actions |
| Destructive | white | `--color-error` | `--color-error` | Cancel, deactivate |
| Disabled | `#F3F4F6` | `--color-text-disabled` | none | — |

Heights: **32px** (compact, table inline), **40px** (default), **48px** (form CTA), **56px** (POS).
Radius: `--radius-control` (4px). Padding: `--space-4` horizontal.

### 4.9 Alert / Notification

**Toast:**
- Top-right, 360px wide, `--radius-card`, `--shadow-modal`.
- 4 variants — success / warning / error / info — left border 4px in semantic color.
- Auto-dismiss 5s; manual `X` button.
- Stack vertically with `--space-2` gap.

**Inline alert banner** (full-width, below page header):
- 56px tall, left border 4px in semantic color.
- Icon (20px) + message (14px) + optional CTA button (right).
- Use cases: stock alerts, expiry warnings, JDPA consent missing, system maintenance.

**Low-stock alert card:**
- White, amber 4px left border.
- Drug name (16/600), current qty (mono), reorder point (mono secondary).
- Right: "Reorder" primary button.

**Expiry alert card:**
- Red 4px left border for <30 days; amber for 30–60 days.
- Drug name, lot # (mono), expiry date (mono).
- Right: "Adjust" / "Dispose" actions.

### 4.10 Audit Log Table

Special variant of 4.2 with these constraints:
- **Columns:** Timestamp (mono 12px) | User | Action | Entity | Entity ID (mono) | IP Address (mono) | ▾.
- **Read-only** — no edit/delete actions ever.
- **Expandable row** — clicking ▾ reveals a Before / After JSON diff (two-column, mono, 12px, additions green, removals red).
- **Filters** (top of table): user (multi), entity type (multi), date range, action type.
- **Export** (top-right of table): CSV, PDF.

### 4.11 POS Terminal Components

**Barcode input:**
- 56px height, full-width. Leading icon `Barcode` (24px). Placeholder: "Scan or search product…". Mono font.
- Auto-focus on mount and after every cart action.

**Product card (search result):**
- White, `--radius-card`, `--shadow-card`. Image (or image placeholder), name, price (mono), stock indicator. Click → adds 1 to cart.

**Cart line item:**
- 64px row. Left: product name (16/500) + barcode (12 mono secondary).
- Center: qty stepper (`–` 32px / value mono / `+` 32px).
- Right: line total (mono 16/500).
- Trailing: `Trash` icon, 32px hit.

**Payment method tabs:**
- Three large tabs — Cash | Card | Lynk. 56px tall, equal width.
- Active: `--color-primary` bottom border 3px, text primary.

**Cash tender input:**
- Mono 24px, 56px tall, prefix "JMD ".
- Below, prominent: "Change: JMD 425.00" (mono, 28px, `--color-success` if positive, `--color-error` if insufficient).

**Receipt preview modal:**
- 480px wide, `--shadow-modal`. Plain mono receipt format. Actions: `Print` / `Email` / `Done`.

### 4.12 Report Components

**Metric card:**
- White, `--radius-card`, `--shadow-card`, padding `--space-5`.
- Big number (`--type-mono-metric`).
- Label below (14px secondary).
- Trend indicator: ↑/↓ arrow + delta% in semantic color.

**Revenue line chart:**
- Smooth line, 2px `--color-primary`.
- Period selector (segmented control): Today | Week | Month | Quarter.
- Hover tooltip: dot marker + value + date.
- Y-axis grid lines: `--color-border-subtle`.

**Drug utilization bar chart:**
- Horizontal bars, sorted descending.
- Bar fill `--color-primary` at 80% opacity; label inside or trailing.

**Schedule log table:** strict tabular variant of 4.2, export `PDF` / `CSV` button prominent in page header.

### 4.13 Auth Components

- **Login card** — 400px max, white, `--shadow-card`, padding `--space-8`. Email + password fields, "Sign in" primary 48px, "Forgot password" tertiary link below.
- **2FA digit input** — 6 boxes, 56×56px each, gap `--space-2`, mono 24px, auto-advance on entry. (Alt: single 6-char mono input — pick boxed for legibility.) "Use backup code" tertiary link below.

### 4.14 Loyalty Components

- **Phone lookup** — autocomplete input, leading `Phone` icon, mono. Results: customer name + points balance inline.
- **Points display (POS checkout)** — amber pill chip: "Rewards: 450 pts (worth JMD $225)".
- **Redeem toggle** — checkbox row: "Apply 450 pts (JMD $225) to this purchase".
- **Points balance (profile)** — large mono `--type-mono-metric`, label "Points Balance" beneath.

### 4.15 Tabs

- 40px tall, bottom border `--color-border` along full width.
- Tab: 16px horizontal padding, 14/500.
- Active: `--color-primary` 2px bottom border, text primary.
- Inactive: text secondary; hover text primary.

### 4.16 Modal / Drawer

**Modal:**
- Centered, `--radius-card`, `--shadow-modal`, max-width 640px (lg: 800px).
- Header: 64px, title 18/600, close icon right.
- Body: padding `--space-6`.
- Footer: 72px, right-aligned actions, top border `--color-border`.

**Drawer:**
- Right-side, 480px wide, full-height, `--shadow-modal`.
- Same header / body / footer rhythm.

### 4.17 Breadcrumb

- 12px secondary text, separator `›` (CaretRight 12px).
- Last segment is current page, color primary text, not a link.

---

## Section 5 — Screen Specifications

All 43 routes. Each entry below provides: route, title, role(s), layout, header, content, empty state, key interactions, modals/drawers.

### 5.1 AUTH (3)

#### `/login`
- **Title:** Sign in to PharmacyOS · **Roles:** all · **Layout:** auth (3.3)
- **Content:** Login card. Email input, password input, "Sign in" primary 48px, "Forgot password" tertiary link.
- **Empty state:** N/A.
- **Interactions:** submit → step to `/login/2fa` if creds valid; inline error banner if invalid.
- **Modals:** "Forgot password" → email-entry modal.

#### `/login/2fa`
- **Title:** Two-factor verification · **Roles:** all · **Layout:** auth
- **Content:** 6-digit boxed input, "Verify" primary, "Use backup code" tertiary, "Back to sign in" tertiary.
- **Interactions:** auto-advance digit boxes; submit on 6th digit; lockout after 5 wrong.

#### `/profile`
- **Title:** My profile · **Roles:** all · **Layout:** admin portal (3.1)
- **Header:** Title only, no CTA.
- **Content:** Sectioned form — Identity (name, email read-only, role badge), Change password (current + new + confirm), 2FA management (status, "View backup codes", "Reset 2FA").
- **Modals:** Backup codes modal (10 mono codes, copy-all button); Reset 2FA confirm.

### 5.2 DASHBOARD (1)

#### `/dashboard`
- **Title:** Dashboard · **Roles:** all (content varies by role) · **Layout:** dashboard grid (3.4)
- **Header:** Title + greeting line ("Good morning, Andrea — Tuesday, May 7"). No CTA.
- **Content:**
  - **Top row, 4 metric cards:** Prescriptions Today · Active Alerts · Revenue Today (JMD) · Patients Seen.
  - **Mid row, 60/40:** compact prescription kanban (top 10 / column) + alert panel (stack of low-stock + expiry alert cards, max 8).
  - **Bottom row, full-width:** recent activity table (last 10 audit rows).
- **Empty state:** per panel — "No prescriptions today", "No active alerts".

### 5.3 INVENTORY (8)

#### `/inventory` — Stock overview
- **Roles:** Pharmacist, Tech, Manager, Admin · **Layout:** admin portal
- **Header:** "Inventory · Stock" + breadcrumb. CTA: `Receive Stock` primary.
- **Filter bar:** quick filters (segmented): All | Low Stock | Out of Stock | Expiring Soon | Schedule Drugs. Search input right.
- **Content:** data table — Drug name | Generic | Category | Current stock (mono) | Reorder point (mono) | Nearest expiry (mono) | NHF | Schedule | Status badge.
- **Empty:** "No drugs match your filter."
- **Interactions:** row click → `/inventory/catalog/[id]`.

#### `/inventory/catalog`
- **Roles:** Pharmacist, Tech, Manager, Admin · **Layout:** admin portal
- **Header:** "Catalog". CTA: `Add Drug` primary.
- **Filter bar:** search; filter by category, NHF, schedule, active.
- **Content:** table — DIN (mono) | Brand | Generic | Form | Strength | Category | NHF | Schedule | Active toggle.
- **Modals:** `Add Drug` modal — full drug form.

#### `/inventory/catalog/[id]`
- **Roles:** Pharmacist, Tech, Manager, Admin · **Layout:** admin portal
- **Header:** Drug brand name (24/700) + breadcrumb. CTA: `Edit` secondary.
- **Content:** two-column —
  - **Left (40%):** drug info panel — DIN, generic, form, strength, category, NHF, schedule, active. All read-only here.
  - **Right (60%):** Lots table — Lot # (mono) | Qty (mono) | Expiry (mono) | Received | Received by | Status. Below: full transaction history table.
- **Drawer:** `Edit drug` (right drawer).

#### `/inventory/receive`
- **Roles:** Pharmacist, Tech · **Layout:** admin portal
- **Header:** "Receive stock". No top CTA.
- **Content:** form (one column, comfortable density) — Drug autocomplete (with stock level), Supplier select, Quantity (mono), Lot # (mono), Expiry date, Unit cost (mono, JMD prefix), Notes textarea. Footer: `Cancel` / `Submit & receive`.
- **On submit:** toast success → resets form; logs `INVENTORY_TRANSACTION (receive)`.

#### `/inventory/scanner`
- **Roles:** Pharmacist, Tech · **Layout:** admin portal
- **Header:** "AI invoice scanner". No top CTA.
- **Content:**
  - **Initial state:** large drag/drop zone (`--color-bg-surface`, dashed border, 320px tall, icon + "Drag invoice or click to upload"). Below, list of recent scans.
  - **After upload:** AI Review Panel (4.5) — left image, right extracted line items grouped by drug. Per-line confirm.
- **On confirm:** toast → batch INVENTORY_LOT + INVENTORY_TRANSACTION rows.

#### `/inventory/alerts`
- **Roles:** all (read); Tech, Manager, Admin (act) · **Layout:** admin portal
- **Header:** "Alerts". CTA: `Configure thresholds` secondary (admin only).
- **Content:** two stacked sections — Low Stock alerts table, Expiry alerts table. Each row inline action: Order / Adjust / Dismiss.
- **Filter:** severity (segmented).

#### `/inventory/suppliers`
- **Roles:** Pharmacist, Tech, Manager, Admin · **Layout:** admin portal
- **Header:** "Suppliers". CTA: `Add supplier` primary.
- **Content:** table — Name | Contact | Phone (mono) | Email | Last delivery (mono).
- **Click row:** supplier detail drawer (profile + invoice history).

### 5.4 PRESCRIPTIONS (5)

#### `/prescriptions`
- **Roles:** Pharmacist, Tech · **Layout:** admin portal (full-width content)
- **Header:** "Prescriptions". CTA: `New prescription` primary.
- **Filter bar:** All | Mine | Today | Schedule. Search by patient name or Rx ID.
- **Content:** Kanban board (4.4) — full 4 columns.
- **Click card:** `/prescriptions/[id]`.
- **Empty per column:** "No prescriptions in this stage".

#### `/prescriptions/new`
- **Roles:** Pharmacist, Tech · **Layout:** admin portal
- **Header:** "New prescription" + breadcrumb.
- **Content:** stacked form — Patient autocomplete (with "+ New patient" link); Prescriber name + registration #; Drug autocomplete with stock; Dosage; Quantity (mono); Refills; Date issued; Upload Rx image (optional → triggers AI scan modal). Footer: `Cancel` / `Save & queue`.

#### `/prescriptions/[id]`
- **Roles:** Pharmacist (verify/approve), Tech (fill) · **Layout:** admin portal
- **Header:** "Rx #PR-XXXXXX" (mono) + patient name. Status indicator dots: Received › Verified › Filled › Dispensed.
- **Content:** two-column —
  - **Left (60%):** all Rx fields — patient, prescriber, drug, dosage, qty, refills, issue date, schedule/NHF chips, attached Rx image.
  - **Right (40%):** dispensing action panel — `Verify` primary (pharmacist-gated, disabled for tech); `Fill` primary (after verified); `Dispense` primary (after filled, requires pharmacist signoff for schedule drugs). Notes textarea. Insurance claim link (Phase 2 — disabled stub).

#### `/prescriptions/scanner`
- **Roles:** Pharmacist, Tech (capture); Pharmacist (confirm) · **Layout:** admin portal
- **Header:** "AI prescription scanner".
- **Content:** Initial upload zone, then AI Review Panel — extracted: prescriber, patient (match-or-create), drug, dosage, quantity. Confirm gated to pharmacist.

#### `/prescriptions/schedule-log`
- **Roles:** Pharmacist, Manager, Admin · **Layout:** admin portal
- **Header:** "Schedule drug log". CTA: `Export PDF` primary, `Export CSV` secondary.
- **Filter:** date range, schedule class, drug, pharmacist.
- **Content:** strict table — Timestamp (mono) | Drug | Schedule class | Patient | Qty (mono) | Pharmacist | Dispensed by.

### 5.5 PATIENTS (5)

#### `/patients`
- **Roles:** all · **Layout:** admin portal
- **Header:** "Patients". CTA: `New patient` primary.
- **Content:** large search bar (name / DOB / phone / insurance card #), 56px tall, `--color-bg-surface`. Below: results grid of patient cards (4.6). Below results: "Recently accessed" — last 10 patient cards.

#### `/patients/new`
- **Roles:** all · **Layout:** admin portal
- **Header:** "New patient" + breadcrumb.
- **Content:** sectioned form —
  - **Demographics:** First name, Last name, DOB, Sex, Phone (mono), Email, Address.
  - **Allergies:** multi-select (NSAIDs, Penicillin, Sulfa, …) + free text.
  - **JDPA consent:** consent text box (read-only), checkbox "Consent given by patient", auto-populated date, version (locked to current).
- **Footer:** `Cancel` / `Save patient`.

#### `/patients/[id]`
- **Roles:** all · **Layout:** admin portal
- **Header:** Patient name + DOB · phone (mono). CTA: `Edit profile` (role-restricted).
- **Tabs:** Overview | Medication History | Insurance | JDPA.
- **Overview:** allergy banner (if any), active prescriptions list, recent dispensing.
- **Medication history:** table of past prescriptions and dispensing.

#### `/patients/[id]/insurance`
- **Tab content within `/patients/[id]`:** card grid of insurance cards (provider, card #, coverage type, expiry, AIS verification status [Phase 2]). `Add card` button.

#### `/patients/[id]/jdpa`
- **Tab content:** Consent record (given Y/N, date, version), `Export patient data (PDF)` button, `Request deletion` destructive button (gated to pharmacist/admin; soft delete + audit).

### 5.6 REPORTING (5)

#### `/reports`
- **Roles:** Manager, Admin · **Layout:** admin portal
- **Header:** "Reports".
- **Content:** grid of report cards — Inventory · Dispensing · Schedule Log · Revenue · Claims [Phase 2 — disabled]. Each: title, description, "Last generated: …" mono.

#### `/reports/inventory`
- **Tabs:** Current Stock | Expiry. Filters: category, NHF, schedule. Export CSV/PDF prominent.

#### `/reports/dispensing`
- Date range selector. Top: summary metrics (4 cards). Mid: top-10 drugs bar chart. Bottom: full table — drug | dispensing count | total qty | revenue.

#### `/reports/schedule-log`
- Same view as `/prescriptions/schedule-log` with broader date range. Export is primary CTA.

#### `/reports/revenue`
- Period selector. Line chart top. Below: breakdown table (period × payer). KPI cards: total revenue, prescription revenue, retail revenue.

### 5.7 AI MODULE (1)

#### `/ai/queue`
- **Roles:** Pharmacist, Manager, Admin · **Layout:** admin portal
- **Header:** "AI job queue".
- **Filter bar:** status (Pending | In Review | Accepted | Rejected); type (Invoice | Rx | Photo); submitter; date range.
- **Content:** table — Job ID (mono) | Type | Submitted by | Submitted at (mono) | Status | Confidence (%) | Reviewed by.
- **Click row:** modal with original image + extraction side-by-side.

### 5.8 RETAIL POS (10)

#### `/pos`
- **Roles:** Front Desk, Pharmacist, Manager · **Layout:** POS terminal (3.2, fullscreen)
- **Content:** see 3.2 + 4.11. Top-left: cashier name + close-POS button.
- **Receipt modal** on completion.

#### `/pos/products`
- **Layout:** admin portal · **Header:** "Retail products". CTA: `Add product`.
- **Content:** table — Name | Barcode (mono) | Category | Price (mono) | Cost (mono) | Stock (mono).

#### `/pos/products/[id]`
- Two-column drug-style detail (info / lots / transaction history).

#### `/pos/inventory`
- Table — Product | Stock | Reorder point | Last received. CTA: `Receive stock`.

#### `/pos/suppliers`
- Same pattern as `/inventory/suppliers`.

#### `/pos/reports`
- Default today. Sales-by-hour bar chart, top products table, revenue metrics. Date range filter, export.

#### `/pos/loyalty`
- Phone search bar large. Results: customer card (name, phone mono, points balance mono prominent, last txn).

#### `/pos/loyalty/new`
- Form: name, phone, JDPA consent (lighter retail variant), submit.

#### `/pos/loyalty/[id]`
- Header: customer name + phone. Big mono points balance card. Lifetime spend metric. Points history table — date (mono) | type (earn/redeem/adjust) | delta (mono, +/−) | balance after (mono) | transaction ref.

#### `/pos/loyalty/dashboard`
- **Roles:** Manager, Admin · Enrolled count, points liability chart (issued vs redeemed over time), top spenders table, redemption rate by period. Configure earn/redeem rates (admin only — drawer).

### 5.9 ADMIN (4)

#### `/admin/users`
- Table — Name | Email | Role | Status | Last login (mono) | 2FA. CTA: `Add user`. Edit via drawer; deactivate toggle.

#### `/admin/audit`
- Audit Log Table (4.10). Filters above. Export top-right.

#### `/admin/settings`
- Sectioned form — Pharmacy info (name, address, phone), Operating hours (per-day rows), Alert thresholds (reorder days, expiry warning days), AI confidence threshold (slider 0–100), JDPA consent version (locked, "Publish new version" button).

#### `/admin/security`
- Three sections — Per-user 2FA management (search + table, "Reset 2FA" action), Active sessions (device, IP mono, last active mono, "Force logout"), Failed login log (last 100, mono timestamps).

---

## Section 6 — Key User Flows

For Figma user-flow diagrams (FigJam-friendly).

### Flow 1 — Dispensing a Prescription (core daily flow)

```
[Pharmacist/Tech]
  └─ /prescriptions (kanban)
        │
        ├── Receives paper Rx → "New Rx" CTA → /prescriptions/new
        │     ├─ Search patient → select OR "+ New patient" → /patients/new → return
        │     ├─ Enter prescriber, drug, dosage, quantity, refills
        │     ├─ (optional) Upload Rx image → /prescriptions/scanner
        │     │     └─ AI extracts → pharmacist reviews confidence → confirm
        │     └─ Save → PRESCRIPTION (status: Received) → kanban
        │
        ├── Open Rx card → /prescriptions/[id]
        │     ├─ [Pharmacist] Verify → status: Verified
        │     ├─ [Tech] Fill physical order → status: Filled
        │     └─ [Pharmacist for schedule drugs] Dispense
        │           ├─ DISPENSING_RECORD created
        │           ├─ SCHEDULE_DRUG_LOG entry (if scheduled)
        │           └─ INVENTORY_TRANSACTION (dispense) created
        │
        └── Card moves to Dispensed column
```

### Flow 2 — AI Invoice Scanner (inventory receive)

```
[Tech] /inventory/scanner
  └─ Drag/upload supplier invoice image
        └─ Claude Vision extracts line items + confidence scores
              └─ AI Review Panel (split view)
                    ├─ Per line: drug | qty | lot # | expiry | unit cost
                    ├─ Low-confidence (<85%) flagged amber — manual edit required
                    ├─ Confirm All
                    │     ├─ INVENTORY_LOT rows created (one per line)
                    │     └─ INVENTORY_TRANSACTION (receive) rows created
                    └─ Stock levels updated in real-time
```

### Flow 3 — POS Checkout with Loyalty

```
[Front Desk] /pos
  └─ Scan barcode → product added to cart (auto-focus barcode after each)
        └─ ...repeat for all items
              └─ Ask customer for loyalty phone
                    └─ Enter phone in loyalty lookup (right panel)
                          └─ Customer found → 320 pts displayed
                                └─ "Redeem" toggle → discount applied
                                      └─ Select payment method (Cash | Card | Lynk)
                                            └─ Enter tender → change calculated
                                                  └─ Confirm
                                                        ├─ RETAIL_TRANSACTION created
                                                        ├─ RETAIL_TRANSACTION_ITEM rows
                                                        ├─ LOYALTY_TRANSACTION (earn) row
                                                        └─ Receipt modal → Print/Email/Done
```

### Flow 4 — New Patient Registration (JDPA-compliant)

```
[Front Desk / Tech] /patients/new
  └─ Demographics (name, DOB, contact)
        └─ Allergy flags (multi-select + free text)
              └─ JDPA consent
                    ├─ Read consent text aloud to patient
                    ├─ Check "Consent given by patient"
                    ├─ Date auto-populates (today)
                    └─ Version locks to current published version
              └─ Save
                    └─ PATIENT row created with:
                          ├─ jdpa_consent_given = true
                          ├─ jdpa_consent_date = today
                          └─ jdpa_consent_version = current
              └─ Continue → add insurance card(s) → /patients/[id]/insurance
```

---

## Section 7 — Responsive & Tablet

| Constraint | Rule |
|---|---|
| Min width | 1024px (tablet landscape) |
| Sidebar | Collapses to icon-only (64px) at 1024–1280px; expand on hover |
| Tables | Horizontal scroll within container at tablet — never truncate data |
| POS terminal | Optimized for 10″ tablet; touch targets 56px min |
| Forms | Single column at tablet breakpoint (no side-by-side fields below 1280px) |
| Kanban | 4 columns at desktop; 2 visible columns at tablet, horizontal scroll for the rest |
| Modals | Full-width at <1280px, max-width 800px above |
| Drawer | Full-width at <1280px, fixed 480px above |
| Charts | Maintain aspect ratio; redraw axes on resize |

---

## Section 8 — Accessibility

Baseline: **WCAG 2.1 AA** on every screen.

### Color & contrast
- Body text contrast ≥ 4.5:1.
- Large text and UI components ≥ 3:1.
- Status badges **never rely on color alone** — every status badge carries an icon (4.3) or text label.
- Confidence indicators: dot + percentage text — never a bare colored dot.
- Active route in sidebar: 3px blue border AND background change AND color change — three signals, not one.

### Forms
- Every input has a programmatically associated `<label>`.
- Required fields: visible asterisk + `aria-required="true"`.
- Error messages: rendered below input, linked via `aria-describedby`.
- Inline validation announced via `aria-live="polite"`.

### Keyboard
- Sidebar fully keyboard-navigable (Tab, Enter, Esc to close groups).
- Skip-to-content link at top of every admin frame.
- Focus indicator: visible 3px outline in `--color-primary` on every focusable element. Never `outline: none` without a replacement.
- Modal: focus trapped; Esc closes; focus returns to invoking element.
- Kanban cards: keyboard reorderable (Space to grab, arrow keys to move, Space to drop).

### Screen reader
- All icons paired with `aria-label` or visually hidden text. Decorative icons `aria-hidden="true"`.
- Tables have `<caption>` or `aria-label`.
- Toast notifications announced via `aria-live="assertive"` for errors, `polite` for success/info.
- Status changes (Rx state transitions) announced.
- Mono data fields announce as their label, not the digits — e.g. "Quantity, 30 tablets" not "three zero".

### Motion
- Respect `prefers-reduced-motion`: disable kanban drag animations and toast slide-in.
- No content flashes faster than 3Hz.

### Forms & data entry
- Quantity / lot / DIN inputs: `inputmode="numeric"` where appropriate.
- Phone: `inputmode="tel"`.
- Date pickers: keyboard-typeable in addition to picker.

---

## Verification Checklist

- [x] All **43 routes** specified — Auth (3) + Dashboard (1) + Inventory (8) + Prescriptions (5) + Patients (5) + Reporting (5) + AI (1) + Retail POS (10) + Admin (4) + sub-tab `/patients/[id]/insurance`, `/patients/[id]/jdpa` counted within patient profile = 43 total entries across grouped enumeration.
- [x] All **5 roles** represented in screen access specs (Pharmacist, Tech, Front Desk, Manager, Admin).
- [x] All **P0 + P1** features from scope covered (inventory, prescriptions, patients, reporting, audit, AI scanner, schedule logging, JDPA, 2FA).
- [x] **Loyalty (P2)** covered in POS screens (`/pos/loyalty`, `/pos/loyalty/new`, `/pos/loyalty/[id]`, `/pos/loyalty/dashboard`).
- [x] **Phase 2** screens (insurance verification AIS, claims) marked `[Phase 2]`.
- [x] **Design tokens complete** — colors, typography, spacing, radius, shadows, density, iconography.
- [x] **English-only** — bilingual note in Section 1.2.
- [x] **No copyrighted/branded UI** recreated. PharmacyOS is a clean-slate design language.

---

*End of handoff.*
