# Execution Plan — Apple Passion Static Website

## Workstreams

1. **Foundation** — Global styles, CSS variables, typography, layout grid
2. **Components** — Header, footer, CTA buttons, sticky mobile bar, cards, sections
3. **Pages** — Home, Supplies, Construction, Equipment Rental, Contact
4. **Assets** — Logo optimization, favicon, Open Graph image setup
5. **QA & Verification** — Link testing, responsive testing, accessibility check
6. **Deployment** — Static build verification, hosting deployment

## Milestones

| Milestone | Target | Evidence |
|-----------|--------|----------|
| M1: Style system + shared components complete | Day 1 | CSS file, header/footer component renders |
| M2: All 5 pages built with content | Day 1–2 | 5 HTML files, internal links working |
| M3: Visual review + accessibility pass | Day 2–3 | Screenshot set, WCAG scan |
| M4: Functional verification | Day 3 | All tel/WhatsApp links tested, console clean |
| M5: Deployment + release gate | Day 3–4 | Live URL, load time <3s, Founder approval |

## Dependencies

- [x] Brand assets received and verified
- [x] Complete copy and content brief provided
- [x] Design direction specified
- [ ] Pricing valuation (deferred to post-build)
- [ ] Domain name / hosting account (can use Vercel default domain initially)

## QA Gates

1. **QA Pass 1 — Content**: Company name, numbers, locations, product list correct
2. **QA Pass 2 — Functional**: All links route correctly; tel: opens dialer; wa.me opens WhatsApp
3. **QA Pass 3 — Visual**: Logo not distorted; colors match brand; CTA contrast passes; mobile spacing clean
4. **QA Pass 4 — Responsive**: iPhone SE, iPhone 14, Android (375px), iPad, desktop
5. **QA Pass 5 — Accessibility**: WCAG 2.1 AA contrast; alt text; keyboard nav; focus states
6. **QA Pass 6 — Performance**: Page load <3s on mobile; images compressed; no console errors

## Required Human Approvals

| Gate | Approver | Condition |
|------|----------|-----------|
| Design review | Founder | Visual direction aligned with brand expectations |
| Release | Founder | Client-facing site approved for handoff |
| Pricing | Founder | Post-build valuation complete |

---

*Execution plan locked. Build sequence active. Pricing evaluation deferred.*
