# Client Launch Email — Template
NoDrftSystems Standard Correspondence | Classification: Internal
Version: 1.0 | Created: 2026-04-21
Usage: Send when a web build is complete and client action is required before go-live.

---

## Template Variables

Replace every `[VARIABLE]` below before sending. Do not send with unreplaced variables.

| Variable | Description | Example |
|----------|-------------|---------|
| `[CLIENT_FIRST_NAME]` | Client's first name | Edward |
| `[CLIENT_EMAIL]` | Client's primary email | edwardjohnsoncompanybuckethead@gmail.com |
| `[CLIENT_BUSINESS_NAME]` | Full business name | Bucket Head Pressure Washing |
| `[TARGET_DOMAIN]` | Domain client is purchasing | bucketheadmobile.com |
| `[SITE_DESCRIPTION]` | 1-line description of what was built | bilingual (English/Spanish) 6-page mobile website |
| `[PAGE_LIST]` | Comma-separated list of pages | Home, Services, Gallery, Reviews, Service Area, About |
| `[SITE_FEATURES]` | 3–5 bullet points of key features | See example below |
| `[TEMP_URL]` | Current live preview URL | NODRFTSYSTEMS.github.io/... |
| `[ACCOUNTS_REQUIRED]` | List of accounts needed (see Account Blocks below) | Namecheap, GitHub, Formspree, Google Business |
| `[SENDER_NAME]` | NoDrftSystems contact name | [Your Name] |
| `[SENDER_PHONE]` | NoDrftSystems contact number | — |
| `[DATE_SENT]` | Date email is sent | 2026-04-21 |

---

## Account Blocks — Use Only What Applies

Each web build may require a different combination of accounts. Include only the blocks that apply to this project.

### Block A — Domain Purchase (Namecheap)
*Include when: client needs a custom domain. Required on all T1+ builds.*

### Block B — GitHub Account
*Include when: transferring repository ownership to client. Required on all governed builds.*

### Block C — Formspree
*Include when: build includes a contact form wired to Formspree.*

### Block D — Google Business Profile
*Include when: build includes a Google review CTA or local SEO schema.*

### Block E — Vercel Account
*Include when: site is hosted on Vercel (vs. GitHub Pages). Client needs account for billing and domain management.)*

### Block F — Supabase Account
*Include when: build includes a database (T4/T5 builds).*

### Block G — Google Analytics
*Include when: GA4 is wired and client needs access to their own analytics property.*

---

## Email Template

---

**TO:** [CLIENT_EMAIL]
**FROM:** [SENDER_NAME] — NoDrftSystems
**SUBJECT:** Your Website Is Built — Here's What You Need to Do to Go Live

---

Hi [CLIENT_FIRST_NAME],

Great news — your website is fully built and ready to launch.

Before I can move it to your own web address ([TARGET_DOMAIN]), I need you to complete a few short steps on your end. None of these require any technical knowledge. Each one takes about 5 minutes.

Once you send me the information listed at the end of this email, I will handle everything else and your site will be live within 24–48 hours.

---

**What your site includes:**

- [SITE_FEATURES — paste bullet list here]

Your site is currently accessible at a temporary address. The steps below move it to [TARGET_DOMAIN] permanently.

---

## Step [N] — Buy Your Domain Name ([TARGET_DOMAIN])

Your domain name is your permanent web address. You own it — I will connect your site to it.

1. Go to **namecheap.com**
2. In the search bar, type `[TARGET_DOMAIN]` and press Search
3. Click **Add to Cart**, then **View Cart**, then **Confirm Order**
4. At checkout, sign up or log in using your Google account ([CLIENT_EMAIL])
5. Complete the purchase — expect to pay approximately $10–12 for the first year

> Keep your Namecheap login information somewhere safe. This is your domain — you will renew it once per year.

**Send me:** Confirmation that you purchased [TARGET_DOMAIN].

---

## Step [N] — Create a GitHub Account

GitHub is where your website files are stored securely. I need to transfer ownership to you so the site belongs to your business, not mine.

1. Go to **github.com**
2. Click **Sign up** in the top right corner
3. Click **Continue with Google** and select [CLIENT_EMAIL]
4. When asked to choose a plan, select **Free**
5. When asked for a username, choose something short that represents your business

**Send me:** Your GitHub username.

---

## Step [N] — Set Up Your Contact Form (Formspree)

Formspree delivers contact form submissions from your website directly to your email inbox. Without this step, the form on your Contact page will not work.

1. Go to **formspree.io**
2. Click **Get Started**
3. Click **Continue with Google** and select [CLIENT_EMAIL]
4. Once logged in, click **+ New Form**
5. Name the form: `[CLIENT_BUSINESS_NAME] Contact`
6. Click **Create Form**
7. Copy the Form ID — it is a short code that looks like this: `xkgbwnqp`

**Send me:** Your Formspree Form ID.

---

## Step [N] — Get Your Google Review Link

Your website has a section that invites customers to leave a Google review. I need your unique Google review link to make that button work.

1. Go to **business.google.com** and sign in with [CLIENT_EMAIL]
2. Select your [CLIENT_BUSINESS_NAME] listing
3. Look for **"Get more reviews"** or **"Share review form"** on your dashboard
4. Copy the link — it will look like: `g.page/r/XXXXXXXXXX/review`

If you do not have a Google Business Profile yet, go to **business.google.com**, click **Manage now**, and follow the prompts to claim your business listing. It is free.

**Send me:** Your Google review link.

---

## What to Send Me

Once you have completed all steps, reply to this email with the following:

| # | What to Send |
|---|---|
[CHECKLIST ROWS — one per account required, e.g.:]
| 1 | "I purchased [TARGET_DOMAIN]" |
| 2 | Your GitHub username |
| 3 | Your Formspree Form ID |
| 4 | Your Google review link |

You can send all items in one reply when you are ready. There is no rush — take your time and do each step carefully.

---

## What Happens After You Send Me That Information

Once I receive everything, here is what I will do:

1. Wire your contact form and review link into the site
2. Connect your domain (I will send you a short list of settings to enter in Namecheap — takes about 5 minutes on your end)
3. Transfer the website files to your account
4. Push the final version live

Your site will be live at **https://[TARGET_DOMAIN]** within 24–48 hours of the DNS settings being entered.

---

## Questions?

Reply to this email or reach me at [SENDER_PHONE]. Do not share your passwords with me — I only need the information listed above.

Looking forward to getting your site live.

---

[SENDER_NAME]
NoDrftSystems
nodrftsystems.com
[SENDER_PHONE]

---

## Internal Checklist Before Sending

- [ ] All `[VARIABLES]` replaced — no brackets remaining in the email body
- [ ] Only applicable Account Blocks included (removed unused blocks)
- [ ] Temporary preview URL added or linked if referencing current live state
- [ ] Correct sender name and phone number in signature
- [ ] Proofread for client name spelling
- [ ] Logged to `02_client-system/[CLIENT-WORKSPACE]/00_admin/session-log.md`
