# Agent Routing Note — Apple Passion Static Website

Gate 0A output — required before build packet approval.

Produced by: MOA (Zayne), PMA (Keon), RCA (Deven)  
Build: Apple Passion Hardware & Construction Static Website  
Date: 2026-04-25  
Classification: Class 2 — Standard Feature Build

---

## 1. Surface Map

| Surface | Description |
| --- | --- |
| Frontend UI | 5-page static HTML/CSS/JS website, mobile-first responsive |
| Navigation | Header nav (desktop) + hamburger menu (mobile) |
| Conversion Layer | Sticky mobile CTA bar, click-to-call, WhatsApp deep links |
| SEO / Meta | Page titles, meta descriptions, Open Graph, favicon |
| Asset Pipeline | Logo, brand imagery, compressed stock/construction imagery |
| Deployment | Static hosting (Vercel/Netlify/Cloudflare Pages) |

---

## 2. Role-to-Surface Assignment

| Surface | Assigned Agent | Role | Owner Type |
| --- | --- | --- | --- |
| Orchestration / gates | MOA (Zayne) | primary | implementation |
| Context / state | CSM (Josette) | primary | implementation |
| Build packet / planning | PMA (Keon) | primary | implementation |
| Repo context / patterns | RCA (Deven) | primary | implementation |
| Frontend UI / components | FIS (Kiara) | primary | implementation |
| Design fidelity / visual | DAA (Anika) | consult-only | implementation |
| Verification / evidence | TVA (Leandra) | primary | implementation |
| Accessibility | AAA (Rochelle) | primary | review |
| Deployment readiness | DRA (Terrence) | primary | review |
| Quality gate | QAS (Imani) | primary | review |

**Mandatory base activation stack (confirm all are assigned):**

- [x] `MOA` — orchestration and activation discipline
- [x] `CSM` — context and state continuity
- [x] `PMA` — build packet control
- [x] `RCA` — repository-context loading
- [x] Primary implementation role: FIS — frontend UI/component implementation is primary work
- [x] `TVA` — verification and reproducibility evidence
- [x] Separate reviewer reserved under `QAS` authority: QAS (Imani) + AAA (Rochelle) + DRA (Terrence)

**Conditional specialists activated:**

- [x] `FIS` — frontend UI / component implementation is primary work
- [x] `DAA` — UI design fidelity is relevant
- [x] `AAA` — accessibility compliance is required (WCAG 2.1 AA target)
- [x] `DRA` — deployment readiness is in scope

---

## 3. Capability Check

| Agent | Skill pack loadable? | Scope covers surface? | Required inputs available? | No cheaper agent can own this? |
| --- | --- | --- | --- | --- |
| FIS | yes | yes | Complete brief, brand assets, copy, design direction | yes — primary frontend role |
| DAA | yes | yes | Brand palette, typography direction, logo assets | yes — design fidelity required |
| AAA | yes | yes | WCAG 2.1 AA criteria, mobile accessibility requirements | yes — no other agent holds accessibility scope |
| DRA | yes | yes | Static hosting target, domain requirements | yes — deployment specialist |

---

## 4. Overlap Elimination

| Surface | Primary Owner | Secondary Role | Resolution |
| --- | --- | --- | --- |
| Visual design | DAA | FIS implements DAA direction | DAA produces direction brief; FIS executes code |
| QA / verification | TVA | AAA runs accessibility pass | TVA handles functional verification; AAA handles WCAG compliance |

---

## 5. Handoff Routing Plan

| Step | Agent | Bounded Surface | Handoff Trigger | Evidence Package Required | Fallback Agent |
| --- | --- | --- | --- | --- | --- |
| 1 | FIS | Global CSS, layout system, components | Style system complete | CSS file, responsive test screenshot | SEA |
| 2 | FIS | All 5 HTML pages with content | Pages render correctly on mobile + desktop | HTML files, link check, mobile viewport test | SEA |
| 3 | DAA | Visual review of all pages | FIS declares pages complete | Screenshot of each page | VDA |
| 4 | AAA | Accessibility sweep | DAA visual review passed | Automated scan results, manual keyboard nav test | QAS |
| 5 | TVA | Functional verification | AAA accessibility passed | Link tests (tel + WhatsApp), console error check, responsive tests | QAS |
| 6 | DRA | Deployment readiness | TVA functional verification passed | Deployed preview URL, load time check, asset verification | PIS |
| 7 | QAS | Release gate | DRA deployment passed | Full evidence package, known issues note | HHC → Founder |

---

## 6. Capability Gaps

| Gap | Affected Surface | Resolution Plan |
| --- | --- | --- |
| Stock imagery sourcing | Visual content | Use CSS-only construction-themed accents and brand logo; no external stock dependency for MVP |
| 4-day timeline compression | All surfaces | Complete brief eliminates discovery/design phase; plain HTML/CSS stack minimizes build complexity; FIS primary owner |

---

## 7. Routing Approval

- MOA sign-off: [x] confirmed — Zayne
- PMA sign-off: [x] confirmed — Keon
- RCA sign-off: [x] confirmed — Deven

Build cell is relevant and capable. Routing plan is clean. Build activates.
