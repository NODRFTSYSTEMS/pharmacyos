# Bucket Head Pressure Washing — Technical Specification

## Dependencies

### Runtime

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0 | UI framework |
| react-dom | ^19.0 | React DOM renderer |
| react-router-dom | ^7.0 | Client-side routing (6 pages) |
| i18next | ^24.0 | Translation framework |
| react-i18next | ^15.0 | React bindings for i18next |
| i18next-browser-languagedetector | ^8.0 | Auto-detect browser language |

### Dev

| Package | Version | Purpose |
|---------|---------|---------|
| vite | ^6.0 | Build tool |
| @vitejs/plugin-react | ^4.0 | React Fast Refresh for Vite |
| typescript | ^5.6 | Type checking |
| tailwindcss | ^4.0 | Utility-first CSS |
| @tailwindcss/vite | ^4.0 | Tailwind CSS Vite integration |
| @types/react | ^19.0 | React type definitions |
| @types/react-dom | ^19.0 | React DOM type definitions |

---

## Component Inventory

### Layout (shared across all pages)

| Component | Source | Notes |
|-----------|--------|-------|
| NavigationHeader | Custom | Logo + hamburger (mobile) / horizontal nav + EN/ES toggle (desktop). Scroll-aware sticky header optional. |
| MobileStickyCTA | Custom | Fixed bottom bar with Call/Text buttons. Visible ≤767px only. z-index 1000. Respects safe-area-inset-bottom. |
| Footer | Custom | 3-column grid (desktop) / stacked (mobile). Content fully bilingual. |
| PageLayout | Custom | Wraps Header + children + Footer + MobileStickyCTA. Provides consistent content max-width (1200px) and horizontal padding. |

### Sections (page-specific, used once each)

**Home:**
HeroSection, TrustStrip, ServicesPreviewSection, WhyChooseUsSection, RecentWorkPreviewSection, ReviewsPreviewSection, ServiceAreaPreviewSection

**Services:**
ServicesPageHero, VehicleServicesSection, ResidentialServicesSection, NotSureCTASection

**Gallery:**
GalleryPageHero, GalleryFilterGridSection, LightboxOverlay, GalleryCTABanner

**Reviews:**
ReviewsPageHero, ReviewsGridSection, GoogleReviewCTASection

**ServiceArea+Contact:**
ContactPageHero, ServiceAreaMapSection, BusinessHoursSection, ContactFormSection

**About:**
AboutPageHero, OurStorySection, DifferentiatorsSection, ProcessSection, AboutCTABanner

### Reusable Components (used across multiple sections/pages)

| Component | Source | Used By |
|-----------|--------|---------|
| SectionHeader | Custom | Nearly all sections (label pill + heading + optional subheading) |
| ServiceCard | Custom | Home (ServicesPreview), Services page cards |
| ReviewCard | Custom | Home (ReviewsPreview), Reviews page grid |
| BeforeAfterCard | Custom | Home (RecentWorkPreview) — defined but not used in current design; available if needed |
| TrustBadge | Custom | Home Hero, About OurStory, Footer |
| CTAButtonGroup | Custom | Home Hero, Services hero+CTA, About CTA, Contact hero — Call (Brand Yellow) + Text (White) button pair |
| LanguageSwitcher | Custom | NavigationHeader — pill toggle EN/ES |

---

## Animation Implementation

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Scroll-triggered entrance (translateY+fade, stagger) | Custom hook + CSS | Single reusable `useScrollReveal` hook using IntersectionObserver at 85% viewport. CSS classes toggle a `.revealed` state. Stagger via CSS `transition-delay` with data attributes. | Low |
| Card hover (translateY, shadow, image scale) | CSS only | Tailwind `hover:` utilities + `group-hover` for nested image scaling. | Low |
| Nav underline (left-grow) | CSS only | `::after` pseudo-element with `scaleX(0→1)` + `transform-origin: left`. | Low |
| Hero text stagger entrance | CSS only | Keyframe animation with hardcoded delays (200ms, 400ms, 600ms) on mount. | Low |
| Star rating bounce-in | CSS only | Keyframe `scale(0.8→1)` + fade with staggered `animation-delay` per star. | Low |
| Mobile menu slide-down | CSS only | `max-height` or `transform` transition with opacity. | Low |
| Gallery filter crossfade | CSS only | Exit: `opacity:0 scale(0.95)` 200ms, Enter: staggered `opacity:1 scale(1)` 200ms. React state controls filter key; CSS transitions handle visual change. | Low |
| Lightbox open/close | CSS only | Backdrop `opacity` 250ms, image `scale(0.95→1)` 250ms. | Low |
| Lightbox image swap | CSS only | Crossfade 150ms between outgoing/incoming images. | Low |
| Scroll indicator bounce | CSS only | Keyframe `translateY(0→8px)` 2s infinite ease-in-out. | Low |
| Process step connector draw | CSS only | `width`/`height` transition from 0 to full, triggered by scroll reveal. | Low |
| **Water Caustic Background** | **Raw WebGL** | **See dedicated section below.** | **High 🔒** |

---

## State & Logic

### Language System (i18next)

- Two namespaces: `en` and `es` — each a flat JSON object with all UI strings
- Default language: `en`. Detection order: `sessionStorage` key → browser language → fallback `en`
- Language switch updates all visible content instantly via i18next's `changeLanguage()` — no page reload, no re-render of route
- Switcher component toggles i18next language and persists choice to `sessionStorage`

### WebGL Caustic Effect

- Raw WebGL (no Three.js) — fragment shader with domain-warped FBM noise generating animated caustic patterns
- Imperative canvas managed via `useRef` + `useEffect`. React only owns the canvas element; all rendering is imperative
- IntersectionObserver on the hero container pauses/resumes the `requestAnimationFrame` loop when off-screen
- `prefers-reduced-motion` checked on mount — if active, renders a single static frame and stops the loop
- WebGL context creation failure → solid Brand Blue background (graceful fallback)

### Gallery Lightbox

- Index state (current image), open/closed state, active filter tab
- Body scroll lock via `overflow: hidden` on `<html>` when open
- Keyboard: Escape closes, arrow keys navigate. Swipe gestures (touch) for prev/next
- Images filtered by category ("all" | "vehicle" | "residential") via computed array, not route change

### Gallery Category Filter

- Single string state: `activeFilter: 'all' | 'vehicle' | 'residential'`
- Grid re-renders with filtered subset; CSS transitions handle the crossfade
- No animation library needed

### Contact Form

- Controlled form state (name, phone, service, message)
- Client-side validation on submit (required fields: name, phone)
- Submit POSTs to a backend endpoint (placeholder URL — to be wired by developer)
- UI states: idle → submitting → success (replaces form with success message) → error (shows error + phone fallback)

### Mobile Menu

- Open/closed boolean state, toggle via hamburger click
- Overlay click or Escape key closes menu
- Body scroll lock when open (mobile only)

---

## Other Key Decisions

**Raw WebGL over Three.js/R3F.** The hero caustic effect is a single fullscreen-quad fragment shader with ~80 lines of GLSL. Three.js would add ~150KB for a use case that needs only one draw call, one program, one buffer, and two shaders. Raw WebGL is explicitly appropriate here.

**No animation library (GSAP/Framer Motion).** All animations are CSS transitions/keyframes triggered by scroll (IntersectionObserver) or state change. None require timeline sequencing, spring physics, or gesture handling that would justify a library.

**No shadcn/ui components.** This project has no forms with complex validation (1 simple contact form), no dialogs/modals (lightbox is a custom full-screen overlay), no data tables, no dropdown menus beyond a single `<select>`. All UI elements are custom-styled to match the specific Brand Blue/Brand Yellow design system.

**No carousel/slider library.** Gallery lightbox uses manual index management with CSS crossfade. No continuous carousel on any page.

**Phone number as configurable constant.** The business phone number appears in ~15 places across the site (CTA buttons, footer, contact page, sticky bar). Defined once as a module constant and referenced everywhere — allows the developer to update a single source when the real number is available.
