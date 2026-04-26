# Strategy Brief — Apple Passion Hardware & Construction Static Website

## Objective

Build a static, mobile-first website for Apple Passion Hardware & Construction that establishes credibility, improves visibility, and drives customers to call or WhatsApp immediately. The site must function as a practical conversion tool for a non-tech-savvy, phone-first customer base.

## Verified Facts

- Client: Apple Passion Hardware & Construction, Rockhall / Waugh Hill, Jamaica
- Owner/decision-maker: Apple (single approver)
- Website type: Static, mobile-first, no CMS, no backend
- Primary conversion action: phone call / WhatsApp (not email)
- Budget: $2,500–$5,000 USD
- Timeline: ASAP to 2026-04-29 (aggressive — 4 days)
- Brand assets: `APPLEPASSIONLOGO.png` + `Official Biz Card and Sign.png` in `04_products/Apple/`
- Approved contact numbers:
  - Office: 876-994-5269
  - Digicel: 876-443-8702
  - LIME: 658-201-0651
- Confirmed products/services:
  - Sand, Gravel, Cement
  - Rebar / reinforcement steel (columns, mattings, slabs)
  - Ply / plywood, Blocks
  - General hardware, Building supplies
  - Direct island-wide delivery
  - Construction builds, big and small
  - Heavy equipment rental
- Customer profile: not highly tech savvy; mobile-heavy; fast scanning; fast action
- SEO focus: Hardware store Rockhall/Waugh Hill Jamaica, building supplies, rebar, construction, equipment rental, island-wide delivery

## Scope

### In Scope
- 5-page static website (Home, Supplies, Construction, Equipment Rental, Contact)
- Island-Wide Delivery content merged into Supplies and Contact pages
- Mobile-first responsive design
- Sticky bottom mobile CTA bar (Call Office, WhatsApp Digicel, WhatsApp LIME)
- Click-to-call (`tel:`) links for all three numbers
- WhatsApp deep links with prefilled service-specific messages
- Basic SEO metadata (titles, descriptions, headings)
- Open Graph metadata
- Favicon
- Compressed images
- Fast page load
- Clean asset structure
- Static deployment (Vercel/Netlify/Cloudflare Pages)

### Out Of Scope
- Ecommerce, cart, inventory management
- CMS, blog, admin dashboard
- User login, database, backend
- Booking calendar, payment system
- Email-first contact flow or contact form emphasis
- Fixed pricing display (unless separately approved)
- Business hours display (unless confirmed)
- Delivery fee quotes
- Specific equipment inventory lists
- Licensed contractor / trade-specific claims (roofing, electrical, plumbing, foundation, excavation, permitting, engineering, architectural design)

## Delivery Direction

### Build Approach
Plain HTML/CSS/JavaScript or Astro static site. No framework overhead. Low maintenance, fast loading, static hosting compatible.

### Recommended Stack
- Astro or plain HTML/CSS/JS
- CSS custom properties for brand palette
- Google Fonts: Oswald (headings) + Inter (body)
- Static deployment to Vercel

### Hosting
Vercel (primary) or Netlify / Cloudflare Pages

### Page Architecture
| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Credibility, service overview, immediate conversion |
| Supplies | `/supplies` | Building materials and hardware products |
| Construction | `/construction` | Construction builds big and small |
| Equipment Rental | `/equipment-rental` | Heavy equipment rental inquiries |
| Contact | `/contact` | All contact numbers, WhatsApp links, delivery inquiry |

*Island-Wide Delivery content absorbed into Supplies (delivery section) and Contact (delivery inquiry CTA).*

## Acceptance Criteria

### Developer
- [ ] All 5 pages present and routable
- [ ] Responsive and mobile-first
- [ ] Sticky mobile CTA bar functional
- [ ] All `tel:` links tested and working
- [ ] All WhatsApp links tested on mobile
- [ ] Office, Digicel, LIME numbers labeled correctly
- [ ] Direct island-wide delivery stated accurately
- [ ] Product scope includes all confirmed items (sand, gravel, cement, rebar, ply, blocks, hardware, building supplies)
- [ ] Rebar described accurately as reinforcement steel
- [ ] Construction builds included
- [ ] Heavy equipment rental included
- [ ] No email-first flow emphasized
- [ ] No fixed prices shown
- [ ] No unverified equipment names
- [ ] No unverified licensing claims
- [ ] Pages load quickly; images compressed
- [ ] Logo not distorted
- [ ] CTAs visible above fold on mobile
- [ ] No placeholder content

### Designer
- [ ] Feels like Jamaican hardware/construction business
- [ ] Logo/sign identity preserved
- [ ] Red and black dominate
- [ ] Green and gold used sparingly as Jamaican accents
- [ ] Readable on mobile
- [ ] CTAs visually dominant
- [ ] Product/service categories easy to scan
- [ ] Layout not cluttered
- [ ] Contact actions clear and repeated
- [ ] Practical, strong, local, trustworthy feel

### QA / Release
- [ ] Content QA: all names, numbers, locations correct
- [ ] Functional QA: links, navigation, sticky CTA tested
- [ ] Visual QA: color palette, contrast, spacing, hierarchy
- [ ] SEO metadata present on all pages
- [ ] Open Graph tags present
- [ ] Accessibility: high contrast, alt text, keyboard nav, no tiny text

## Open Decisions

1. **Founder approval**: Jamaica regional pricing + rush delivery for 4-day timeline
2. **Client approval**: 5-page scope compression (Delivery merged vs. standalone page)
3. **Client confirmation**: Business hours — optional for launch
4. **Client confirmation**: Licensed/insured claims — optional for launch
5. **Image sourcing**: Confirm stock imagery selection meets Jamaican construction aesthetic

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| 4-day timeline unrealistic | HIGH | Rush delivery pricing; complete brief reduces execution risk; plain HTML/CSS stack |
| Client expects 6 pages, not 5 | MEDIUM | Explicit scope document in proposal; Delivery content strategically placed on Supplies + Contact |
| Revision requests during build | HIGH | 2 revision rounds included; any post-launch changes via Change Order or retainer |
| Generic/stock imagery feel | LOW | Curated image brief per approved visual themes |
| WhatsApp link breakage | MEDIUM | Test all `wa.me` links on iOS and Android before handoff |

---

*Strategy brief derived directly from client-provided handoff package. Discovery Sprint is not required — scope is fully bounded.*
