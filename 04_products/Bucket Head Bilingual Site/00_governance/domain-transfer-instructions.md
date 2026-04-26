# Domain Transfer Instructions — bucketheadmobile.com
Build ID: BHPW-001 | Classification: Internal — Handoff Reference
Prepared by: NoDrftSystems | Date: 2026-04-21

---

## Overview

The site is currently live at:
`https://NODRFTSYSTEMS.github.io/bucket-head-pressure-washing/`

Target domain: **bucketheadmobile.com**

After this procedure the site will be live at `https://bucketheadmobile.com` with full HTTPS. No hosting cost is added — GitHub Pages supports custom domains for free.

Estimated time: 15 minutes of configuration + up to 48 hours for DNS to propagate worldwide.

---

## Step 1 — Buy the Domain

Purchase `bucketheadmobile.com` from any registrar. Recommended options:

| Registrar | Approx. Cost/year | Notes |
|-----------|-------------------|-------|
| Namecheap | ~$10–12 | Simple DNS panel, good default settings |
| Cloudflare Registrar | ~$9 (at-cost) | Best option if client wants free DDoS protection |
| Google Domains (now Squarespace Domains) | ~$12 | Simple UI |

**Do not use GoDaddy** — upsell-heavy; DNS panel is harder to navigate.

After purchase, log into the registrar's DNS management panel. You will add records in Step 3.

---

## Step 2 — Code Change (NoDrftSystems executes this)

Before the custom domain goes live, one code change is required. The Vite build config currently includes a sub-path base for the GitHub Pages repo URL. This must be removed for the root domain to work correctly.

**File:** `app/vite.config.ts`

Change:
```ts
base: '/bucket-head-pressure-washing/',
```
To:
```ts
base: '/',
```

Also add a `CNAME` file so GitHub Pages knows which domain to serve:

**File:** `app/public/CNAME` (create new file — one line, no extension)
```
bucketheadmobile.com
```

NoDrftSystems will commit and push both changes. The GitHub Actions pipeline deploys automatically on push to `main`. Wait for the green checkmark before proceeding to Step 3.

---

## Step 3 — Add DNS Records at the Registrar

Log into the registrar DNS panel for `bucketheadmobile.com` and add the following records.

### A Records (for the apex/root domain)

Add all four. These point `bucketheadmobile.com` to GitHub Pages' servers.

| Type | Host/Name | Value | TTL |
|------|-----------|-------|-----|
| A | `@` | `185.199.108.153` | 3600 |
| A | `@` | `185.199.109.153` | 3600 |
| A | `@` | `185.199.110.153` | 3600 |
| A | `@` | `185.199.111.153` | 3600 |

### CNAME Record (for www redirect)

| Type | Host/Name | Value | TTL |
|------|-----------|-------|-----|
| CNAME | `www` | `NODRFTSYSTEMS.github.io` | 3600 |

> If your registrar does not allow a CNAME on `www` alongside A records on `@`, skip the CNAME. The A records alone are sufficient — `www.bucketheadmobile.com` may just not redirect.

---

## Step 4 — Configure Custom Domain in GitHub Pages

1. Go to: `https://github.com/NODRFTSYSTEMS/bucket-head-pressure-washing`
2. Click **Settings** → scroll to **Pages** in the left sidebar
3. Under **Custom domain**, enter: `bucketheadmobile.com`
4. Click **Save**
5. GitHub will verify DNS. This may show a yellow warning for up to 24 hours while DNS propagates — this is normal.

---

## Step 5 — Enable HTTPS

Once GitHub Pages confirms the custom domain is verified (green checkmark):

1. In the same **Pages** settings panel
2. Check the box: **Enforce HTTPS**
3. Save

After this, `http://bucketheadmobile.com` will auto-redirect to `https://bucketheadmobile.com`.

---

## Step 6 — Update og:url and Canonical (NoDrftSystems executes this)

After the domain is live and verified, NoDrftSystems will update `app/index.html` to replace the placeholder `og:url` and canonical tag with the final production URL:

```html
<link rel="canonical" href="https://bucketheadmobile.com" />
<meta property="og:url" content="https://bucketheadmobile.com" />
```

This is a single commit and deploys automatically.

---

## Verification Checklist (run after DNS propagates)

- [ ] `https://bucketheadmobile.com` loads the site
- [ ] `http://bucketheadmobile.com` redirects to HTTPS
- [ ] All 6 pages navigate correctly (Home, Services, Gallery, Reviews, Service Area, About)
- [ ] EN/ES toggle works
- [ ] Contact form submits (requires Formspree ID to be wired first)
- [ ] Mobile sticky CTA buttons dial/text correctly
- [ ] No browser console errors

---

## What Happens to the Old URL

`NODRFTSYSTEMS.github.io/bucket-head-pressure-washing/` will stop serving the site once the custom domain is configured in GitHub Pages settings. It will redirect to the new domain. No action needed from the client — GitHub handles this automatically.

---

## Client Handoff Note

Once the domain is live and verified, provide the client with:
1. Registrar login credentials (if NoDrftSystems purchased on their behalf)
2. GitHub repository access (if transferring ownership)
3. This document for their records

Domain renewal is the client's responsibility after transfer. Set a calendar reminder for 11 months from purchase date.
