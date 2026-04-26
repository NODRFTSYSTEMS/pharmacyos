# Delivery Register — Apple Passion Static Website

| Artifact | Status | Location | Client Ready | Notes |
|---|---|---|---|---|
| Home page | ✅ Complete | `build/index.html` | Pending QA | Hero, services, products, trust, CTA |
| Supplies page | ✅ Complete | `build/supplies.html` | Pending QA | 6 supply categories + delivery section + pricing note |
| Construction page | ✅ Complete | `build/construction.html` | Pending QA | 4 service cards + project checklist |
| Equipment Rental page | ✅ Complete | `build/equipment-rental.html` | Pending QA | 4 rental cards + inquiry checklist |
| Contact page | ✅ Complete | `build/contact.html` | Pending QA | 3 contact cards + delivery info + inquiry checklist |
| Global CSS | ✅ Complete | `build/css/style.css` | Pending QA | Mobile-first, responsive, brand palette, accessibility |
| JavaScript | ✅ Complete | `build/js/main.js` | Pending QA | Mobile nav toggle, active link highlighting |
| Logo asset | ✅ Complete | `build/images/logo.png` | Pending QA | Copied from `04_products/Apple/` |
| SEO metadata | ✅ Complete | All HTML `<head>` | Pending QA | Titles, descriptions, Open Graph, favicon |
| Mobile sticky CTA | ✅ Complete | All pages | Pending QA | Fixed bottom bar: Office, Digicel WA, LIME WA |
| Click-to-call links | ✅ Complete | All pages | Pending QA | `tel:` links for all 3 numbers |
| WhatsApp deep links | ✅ Complete | All pages | Pending QA | `wa.me` links with prefilled messages |
| Accessibility | ✅ Complete | CSS + markup | Pending QA | Skip link, focus states, reduced-motion, alt text, ARIA labels |

## Build Summary

- **Pages built:** 5 (Home, Supplies, Construction, Equipment Rental, Contact)
- **Original brief:** 6 pages — Island-Wide Delivery merged into Supplies + Contact
- **Stack:** Plain HTML5 / CSS3 / Vanilla JS
- **Fonts:** Oswald (headings) + Inter (body) via Google Fonts
- **Approach:** Mobile-first, static, no backend dependency
- **Deployment target:** Vercel / Netlify / Cloudflare Pages

## QA Status

| Pass | Status | Notes |
|------|--------|-------|
| QA 1 — Content | 🔄 Ready for review | All copy from approved handoff package |
| QA 2 — Functional | 🔄 Ready for review | Link validator run; logo path fixed |
| QA 3 — Visual | 🔄 Ready for review | Brand palette applied; logo renders |
| QA 4 — Responsive | 🔄 Ready for review | Breakpoints: 768px, 1024px |
| QA 5 — Accessibility | 🔄 Ready for review | WCAG 2.1 AA targeted |
| QA 6 — Performance | 🔄 Ready for review | Plain HTML, minimal JS, single CSS file |

## Next Steps

1. TVA functional verification
2. AAA accessibility sweep
3. DRA deployment readiness check
4. QAS release gate
5. Founder approval
6. Client preview / approval
7. Static deployment
