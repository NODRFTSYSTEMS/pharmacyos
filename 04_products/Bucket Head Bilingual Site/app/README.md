# Bucket Head Pressure Washing — Bilingual Website

Bilingual (EN/ES) static SPA for Bucket Head Pressure Washing. Built with React 19, TypeScript, Vite, and Tailwind CSS.

## Stack

- **React 19** + **TypeScript** — UI and type safety
- **Vite 7** — build tooling and dev server
- **Tailwind CSS 3** — utility-first styling
- **react-router-dom v7** — client-side routing (6 pages)
- **i18next** + **react-i18next** — bilingual EN/ES content, auto-detects browser language

## Pages

- Home
- Services
- Gallery
- Reviews
- Service Area + Contact
- About

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is in `dist/`. Deploy to any static host (Netlify, Vercel, GitHub Pages).

## Environment

No environment variables required for local development. Before deploying, wire the contact form:

- Open `src/pages/ContactPage.tsx` line 57
- Replace `FORMSPREE_FORM_ID` with your [Formspree](https://formspree.io) form ID

## Configuration

Business contact details (phone, email) are defined once in `src/lib/constants.ts`.

## License

Private — all rights reserved. Built by [NoDrftSystems](https://nodrftsystems.com).
