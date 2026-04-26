---
document: CasaClaro Visual Direction Brief
product: CasaClaro — Colombia Real Estate Marketplace
version: 1.0
date: 2026-04-20
authority: VDA (Visual Direction Agent) + DAA (Design Alignment Agent) + BCA (Brand Clarity Agent)
status: ACTIVE — implementation authority for all CasaClaro Next.js app components
confidentiality: Proprietary internal
---

# CasaClaro Visual Direction Brief

## 1. Product Character

CasaClaro is a **warm-first, place-first, trust-oriented** Colombia property and relocation platform. Its visual identity must communicate:

- **Warmth and belonging** — this is a platform for people making a life decision, not a financial dashboard
- **Earned trust** — vetting and verification are the platform's differentiator; the design must signal credibility without coldness
- **Colombia's character** — the palette, warmth, and texture should feel at home in the context of Colombian cities, not imported from Silicon Valley fintech

CasaClaro is **NOT:**
- Dark or data-dense (≠ PEO)
- Cold, blue, or corporate (≠ typical real estate portals)
- Generic marketplace beige (must have a distinctive warm identity)

---

## 2. Palette Application Rules

Base tokens (from `styles.css`):

| Token | Hex | Role |
|---|---|---|
| `--terracotta` | `#e67e22` | Primary accent — CTAs, active states, key labels |
| `--terracotta-deep` | `#b85613` | Hover states, pressed buttons, underline accents |
| `--emerald` | `#2ecc71` | Fully Vetted badge, success states, positive indicators |
| `--emerald-deep` | `#1f8f59` | Vetted badge text, body copy in success contexts |
| `--lagoon` | `#1f6f78` | Professional Review badge, secondary links, map accents |
| `--ocean` | `#1f3a4d` | Section headings, dark text blocks, footer background |
| `--cacao` | `#4a2f1d` | Display headings (Iowan Old Style), rich text accent |
| `--charcoal` | `#23313f` | Body text — primary |
| `--muted` | `#6b7280` | Supporting text, labels, metadata |
| `--cream` | `#fdf5e6` | Page background, warm base |
| `--sand` | `#fff8ef` | Card backgrounds, elevated surfaces |
| `--rose` | `#f7e1d0` | Hover states on terracotta surfaces, tag backgrounds |
| `--marigold` | `#f1c40f` | Starred indicators, featured flags (use sparingly) |

**Application rules:**
- Page background: `--cream` with a subtle warm gradient (`#fffaf3` → `--cream`). Never black, never dark gray.
- Card background: `--sand` (`rgba(255,252,247,0.92)`) — warm off-white, never pure white
- Section alternates: `--cream` and `--sand` for rhythm without harshness
- Primary buttons: terracotta fill, white text. Hover: `--terracotta-deep`
- Secondary buttons: transparent with terracotta border + text. Hover: `--rose` fill
- Text: body in `--charcoal`. Supporting copy in `--muted`. Display in `--cacao` or `--ocean`.
- Do NOT use `--ocean` as a background surface — it is a heading/accent color only
- **Exception:** `--ocean` is used as the footer background by design — it creates the ground/sky contrast that closes each page. This is the only sanctioned use of `--ocean` as a background surface.
- Footer: `--ocean` background, `--sand`/`white` text

---

## 3. Typography Application

| Context | Font | Weight | Token |
|---|---|---|---|
| Page titles (H1) | Iowan Old Style (serif) | Regular 400 | `--font-display` |
| Section headings (H2) | Iowan Old Style (serif) | Regular 400 | `--font-display` |
| Card titles, neighborhood names | Aptos (sans-serif) | Semibold 600 | `--font-body` |
| Price display | Aptos | Bold 700 | `--font-body` |
| Body copy, descriptions | Aptos | Regular 400 | `--font-body` |
| Labels, badges, metadata | Aptos | Semibold 600 | `--font-body` |
| Filter bar controls | Aptos | Regular 400 | `--font-body` |
| Navigation links | Aptos | Medium 500 | `--font-body` |
| CTA buttons | Aptos | Bold 700 | `--font-body` |

**Key rule:** Page title (H1 on the Listings page: "Current Listings") uses Iowan Old Style — this is the CasaClaro brand voice. All functional UI (filters, labels, prices, buttons) uses Aptos sans-serif.

Font fallback chains (until font files sourced):
- `--font-display`: `'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, serif`
- `--font-body`: `Aptos, 'Segoe UI', Tahoma, Geneva, sans-serif`

---

## 4. Card Layout Geometry

### ListingCard

```
┌─────────────────────────────────────────┐
│                                         │  ← Hero image: 16:10 aspect ratio,
│           Hero Image                    │    object-cover, 240px height (md: 200px)
│                                    [◉] │  ← VettedBadge: top-right corner, 10px inset
└─────────────────────────────────────────┘
│ $XXX,XXX USD              City · Nbhd  │  ← Price (bold, 1.2rem) + location (muted, 0.85rem)
│ COP $X,XXX,XXX,XXX/mes                 │  ← COP subline (muted, 0.78rem)
│                                         │
│ 🛏 3  🚿 2  📐 95 m²  🚗 1             │  ← Specs row (0.82rem, muted icons)
│                                         │
│ ✓ Title verified clean                  │  ← Vetting bullets (0.82rem, emerald-deep or muted)
│ ✓ Structural inspection passed          │
└─────────────────────────────────────────┘
```

**Card dimensions:**
- Border radius: `var(--radius)` = 26px
- Background: `var(--card)` = `rgba(255,252,247,0.92)`
- Border: `1px solid var(--border)` = `1px solid rgba(35,49,63,0.08)`
- Shadow: `var(--shadow)` = `0 20px 60px rgba(35,49,63,0.12)`
- Hover: `translateY(-3px)` + shadow intensifies to `0 28px 72px rgba(35,49,63,0.18)`
- Transition: `transform 0.2s ease, box-shadow 0.2s ease`
- Padding: `1.2rem` on content area

**Hero image:**
- Aspect ratio: 16:10 (use `aspect-[16/10]` Tailwind or `padding-bottom: 62.5%` trick)
- `object-fit: cover`, `object-position: center`
- Subtle gradient overlay at bottom: `linear-gradient(to bottom, transparent 50%, rgba(35,49,63,0.18) 100%)`
- VettedBadge positioned absolute top-right with 10px inset

**Price display:**
- USD price: `font-family: var(--font-body)`, `font-weight: 700`, `font-size: 1.15rem`, `color: var(--charcoal)`
- "For Rent" appended inline in `--muted` weight 400 at 0.9rem
- COP equivalent: smaller line below, `--muted`, `0.78rem`

---

## 5. VettedBadge Visual Treatment

The badge is a **pill chip** positioned on the listing card image (top-right) and also rendered inline where needed.

```
  ●  Fully Vetted  ⓘ
```

**Structure:** `[dot] [label] [info button]`

| Level | Dot color | Chip background | Text color | Border |
|---|---|---|---|---|
| `fully_vetted` | `#2ecc71` (emerald) | `rgba(46,204,113,0.14)` | `#1f8f59` (emerald-deep) | `1px solid rgba(31,143,89,0.28)` |
| `professional_review` | `#1f6f78` (lagoon) | `rgba(31,111,120,0.12)` | `#1f6f78` | `1px solid rgba(31,111,120,0.25)` |
| `basic` | `#6b7280` (muted) | `rgba(107,114,128,0.10)` | `#6b7280` | `1px solid rgba(107,114,128,0.20)` |

**Geometry:**
- Border radius: `999px` (pill)
- Padding: `0.28rem 0.64rem`
- Font size: `0.75rem`, font weight: `700`
- Dot: `8px × 8px` circle, inline-block, `margin-right: 5px`
- Info button `ⓘ`: `margin-left: 5px`, `color: currentColor`, `opacity: 0.7`, hover `opacity: 1`
- Tooltip: appears below the badge on hover/focus, `--sand` background, `--charcoal` text, `var(--radius-sm)` border radius, `var(--shadow)` shadow, `max-width: 240px`, `font-size: 0.78rem`, `z-index: 50`

---

## 6. FilterBar Layout

**Layout:** Single horizontal row on desktop, wraps to 2-column grid on tablet, stacks single-column on mobile.

```
[ Type ▾ ]  [ City ▾ ]  [ Property ▾ ]  [ Price ▾ ]  [ Badge ▾ ]  [ Reset ]
```

**Visual treatment:**
- Each `<select>` styled as a pill-shaped control: `var(--radius-sm)` border radius, `--sand` background, `1px solid var(--border)`, `--charcoal` text
- Active/selected state: terracotta border (`1px solid var(--terracotta)`)
- Reset button: secondary style (transparent, terracotta border + text)
- Container: `--sand` background, `1.1rem` padding, `var(--radius-sm)` border radius, subtle border
- Font: Aptos 400, 0.88rem

---

## 7. EmptyState Visual

**Layout:** Centered, vertically padded section within the listings grid area.

```
        [Terracotta accent mark — 3px wide, 40px tall, centered]

              No listings yet

     New vetted properties are added regularly.
     Be the first to know when listings go live.

            [ Submit a Property → ]
```

**Treatment:**
- Accent: a `3px × 40px` terracotta bar centered above heading
- Heading: Iowan Old Style, 1.4rem, `--ocean`
- Body: Aptos 400, 1rem, `--muted`
- CTA: terracotta secondary button style
- Container: `min-height: 360px`, vertically centered via flexbox, `--cream` background

---

## 8. Header Design

**Layout:** Full-width, sticky, `--sand` background with `1px solid var(--border)` bottom border.

```
CasaClaro                Home  Listings  Cities  For Sellers        EN / ES
```

**Wordmark:** "CasaClaro" in `--font-display` (Iowan Old Style), `font-size: 1.4rem`, `color: var(--terracotta)`, `font-weight: 400` — the serif warmth is the logo.

**Nav links:** Aptos Medium 500, 0.9rem, `--charcoal`. Hover: `--terracotta`. Active: `--terracotta` with `2px` underline.

**Language toggle:** Right-aligned. `EN` and `ES` as pill buttons. Active pill: terracotta fill + white text. Inactive: transparent + `--muted` text.

**Mobile:** Hamburger menu, full-width drawer, same nav links stacked.

---

## 9. Footer Design

**Background:** `--ocean` (`#1f3a4d`)
**Text:** `rgba(255,255,255,0.85)` for body, `white` for headings

**Structure:**
```
CasaClaro                   Explore          Company
Colombia property intel.    Cities           For Sellers
                            Listings         For Agents
                            Map              Terms of Service
                            Relocation

© 2026 NoDrftSystems. All rights reserved.      EN / ES
```

**Wordmark in footer:** Same Iowan Old Style, white, 1.2rem
**Nav headings:** Aptos 700, 0.78rem, white, letter-spacing 0.1em, uppercase
**Nav links:** Aptos 400, 0.85rem, `rgba(255,255,255,0.7)`. Hover: white.
**Legal line:** 0.78rem, `rgba(255,255,255,0.5)`

---

## 10. Listing Count Line

Above the grid, below the FilterBar:
```
Showing 14 of 20 listings
```
- Aptos 400, 0.85rem, `--muted`
- `margin-bottom: 1.2rem`

---

## 11. Synthetic Data Banner

When `is_synthetic: true` records are active:

```
┌─────────────────────────────────────────────────────────┐
│ ⚠  Development data — these listings are synthetic and  │
│    do not represent real properties for sale or rent.   │
└─────────────────────────────────────────────────────────┘
```

- Background: `rgba(241,196,15,0.12)` (marigold tint)
- Border: `1px solid rgba(241,196,15,0.4)`
- Border radius: `var(--radius-sm)`
- Icon `⚠`: `--marigold`, 1rem
- Text: Aptos 400, 0.88rem, `--cacao`
- `role="alert"`, `data-testid="synthetic-banner"`
- Full-width, above the FilterBar

---

## 12. Grid Layout

**ListingsGrid container:**
- Mobile (< 640px): 1 column
- Tablet (640px–1023px): 2 columns, `gap: 1.2rem`
- Desktop (≥ 1024px): 3 columns, `gap: 1.4rem`
- Max width: `var(--max)` = 1240px, centered, horizontal padding 1.2rem

**Page container:**
- `max-width: var(--max)`, `margin: 0 auto`, `padding: 0 1.2rem`
- Page header section: `padding-top: 3rem`, `padding-bottom: 2rem`

---

## 13. Anti-Generic Checklist (BCA)

Before any component is released, verify it does NOT:
- [ ] Use PEO's dark surfaces, shadow colors, or dark card backgrounds
- [ ] Use a generic marketplace grid without the CasaClaro terracotta identity
- [ ] Render price in a plain `$XXX,XXX` without the COP subline (bilingual pricing is a differentiator)
- [ ] Show a badge as a simple text tag without the dot + tooltip pattern
- [ ] Use Tailwind's default `emerald`, `blue`, or `gray` colors instead of CasaClaro's semantic tokens
- [ ] Have a header that looks like a SaaS dashboard instead of a warm place-based marketplace

---

## Approval

This brief was produced by the VDA/DAA/BCA agent cell on 2026-04-20 and is the design authority for all CasaClaro Next.js app component work. Implementation agents must reference this brief for all visual decisions. Conflicts between this brief and individual component code must be resolved in favor of the brief.
