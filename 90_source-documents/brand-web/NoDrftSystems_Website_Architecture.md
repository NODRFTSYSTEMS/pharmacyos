<!--
Converted from: NoDrftSystems_Website_Architecture.docx
Conversion date: 2026-04-18
Classification: Internal — Confidential
Status: Source archive — see document-registry.md for operative status
-->




NoDrftSystems

Website Architecture

Sitemap, Page Briefs & Technical Specifications



Version 1.0 | April 2026
Internal Document

# Overview & Principles
## Document Purpose
This specification defines the complete website architecture for NoDrftSystems, including sitemap structure, page-level briefs, content modules, and technical requirements. It serves as the governing document for all website development, content creation, and quality assurance activities.
## Core Principles
Plain-language communication is mandatory—technical acronyms must be explained in buyer language
The website sells what buyers can actually buy now: defined packages, entry points, and next-step logic
English/Spanish parity is required; transcreation preferred over literal translation
The public site must not disclose proprietary tools, prompt systems, or internal workflows
Controlled proof posture: confidentiality-safe snapshots without client naming dependency
## Positioning Statement
NoDrftSystems designs and builds modern websites, digital platforms, and business systems for organizations that need stronger positioning, better conversion, and more disciplined execution. We are not a generic agency. We operate with structured scoping, controlled delivery, and a quality standard built to reduce drift, confusion, and wasted motion.

# Sitemap Structure
## Primary Navigation

## Utility Routes

## Information Architecture
The sitemap follows a disciplined navigation model with clear route intent for each page. Client Onboarding remains post-sale and distinct from public marketing pages. The site architecture supports the buyer journey from awareness (Home) to consideration (Capabilities, Selected Engagements, About) to decision (Start an Engagement).

# Page Briefs
## Home
Route: /
Intent: Lead with outcomes, credibility, package preview, fit guidance, and direct routing.
### Required Content Modules
Hero: Value proposition + primary CTA
Package preview cards (Discovery, Conversion, Launch)
Fit signals (who we serve best)
Controlled proof (qualitative, no client names)
Final CTA block
### What NOT to Include
Do not lead with tools, stack, or abstract process language
Do not imply every engagement is a giant enterprise systems project
## Capabilities / Website Packages
Route: /capabilities
Intent: Present the package ladder and broader capability progression.
### Required Content Modules
Opening overview: who the firm serves and what outcomes matter
Package ladder: Discovery Sprint, Conversion Landing Page Sprint, Launch Site, Authority Website, Platform Starter, Ecosystem Build, Retainers
Strategic differentiators block
Scope expectation block (what is standard, what is custom)
Final CTA: Start an Engagement
## Selected Engagements
Route: /engagements
Intent: Use controlled engagement snapshots with qualitative proof and confidentiality discipline.
### Content Requirements
Separate internal products from client work
Default to no client names unless explicitly approved
Qualitative outcomes, not process reveals
Industry-agnostic framing where possible

## About
Route: /about
Intent: Establish institutional trust. Not optional for premium positioning.
### Required Sections

## Start an Engagement
Route: /start
Intent: Structured qualification form combining fit guidance and project inquiry.
### Form Field Groups

### Requirements
Plain-language helper text for each field
Privacy notice tied to project intake workflow
Auto-routing based on qualification score
## Careers
Route: /careers
Intent: Keep live continuously as a controlled talent intake surface.
### Recommended Structure

### Copy Posture
Describe standards, not secrets
Explain who thrives: clarity, accountability, speed with discipline, comfort with review gates
Do not publish AI-agent structures or proprietary evaluation systems
Attach applicant-specific privacy notice
## Inquiries
Route: /inquiries
Intent: Lower-friction path for general contact, partnerships, and non-project correspondence.
### Requirements
Clearly separate from project intake (Start an Engagement)
Include privacy notice tied to general inquiry workflow
Must not become qualification bypass

# Content Modules
## Global Modules
### Value Proposition (EN)
Websites built to perform—structured to last.
We design and build modern websites and digital platforms for organizations that need stronger positioning, better conversion, and more disciplined execution. Scope is confirmed before work begins. Quality is validated before handoff.
### Value Proposition (ES)
Sitios web diseñados para rendir—estructurados para durar.
Diseñamos y construimos sitios web modernos y plataformas digitales para organizaciones que necesitan mejor posicionamiento, mayor conversión y una ejecución más disciplinada. El alcance se confirma antes de iniciar. La calidad se valida antes del traspaso.
## CTA Library

## Glossary (Buyer-Safe Explanations)

# Technical Requirements
## Performance Standards

## Accessibility Requirements
WCAG 2.2 Level AA compliance required. Key requirements:
All images have descriptive alt text
Color contrast ratios meet AA standards (4.5:1 for normal text)
All interactive elements are keyboard accessible
Form fields have associated labels
Focus indicators are visible
Skip navigation link provided
## SEO Requirements
Semantic HTML structure (proper heading hierarchy)
Meta titles and descriptions for all pages
Open Graph tags for social sharing
Canonical URLs
XML sitemap
Robots.txt
Structured data (Schema.org) where applicable
## Security Requirements
HTTPS enforced across all pages
Security headers (HSTS, CSP, X-Frame-Options)
No hardcoded secrets in source code
Form data encrypted in transit
GDPR/CCPA compliant cookie consent
## Bilingual Implementation
Language toggle in header and footer
URL structure: /es/ prefix for Spanish pages OR subdomain
Hreflang tags for all alternate language versions
Content parity: all key pages available in both languages
Transcreation preferred over literal translation for marketing copy
| Route | Label | Purpose | Primary CTA |
| / | Home | Lead with outcomes, credibility, package preview | Start an Engagement |
| /capabilities | Capabilities / Website Packages | Present package ladder and progression | Start an Engagement |
| /engagements | Selected Engagements | Controlled proof snapshots | Start an Engagement |
| /about | About | Institutional trust-building | Start an Engagement |
| /start | Start an Engagement | Structured qualification form | Submit |
| /careers | Careers | Continuous talent intake | Submit Interest |
| /inquiries | Inquiries | Lower-friction general contact | Submit |

| Route | Purpose | Access |
| /onboarding | Post-sale client intake | Post-contract only |
| /privacy | Privacy policy | Footer link |
| /terms | Terms of service | Footer link |
| /language | Language toggle (EN/ES) | Header/footer |

| Section | Content |
| Firm Overview | What NoDrftSystems is and what it builds |
| Positioning | Why the firm exists and how it differs from generic agencies |
| Leadership / Founder | Establish authority without casual biography |
| Operating Standards | Precision, control, selective engagement, privacy posture |
| Why Clients Engage | Decision-quality reasons, not hype |
| Selective Posture | Clarify that fit matters and not every project is accepted |
| CTA | Start an Engagement |

| Group | Fields |
| Business Objective | What outcome will this project achieve in 90 days? |
| Scope | Current state, desired state, constraints |
| Timeline | Target launch date, hard deadlines |
| Budget | Allocated budget range |
| Compliance | SOC 2, HIPAA, GDPR requirements |
| Decision Path | Who signs, typical procurement timeline |

| Track | Use Case |
| Active Roles | Real open positions with live need |
| Future Opportunities | Collect interest even when no immediate opening |
| Specialist / Contractor Interest | Build vetted bench for design, integrations, accessibility |

| CTA | Use Case |
| Start an Engagement | Primary CTA across all pages |
| Discovery Sprint | For unclear scope or complex projects |
| Compare Packages | Capabilities page |
| Submit Interest | Careers page |
| Submit Inquiry | General inquiries page |

| Term | Buyer-Safe Explanation | Spanish |
| CMS | Content management system—the editing interface used to update site content | Sistema de gestión de contenido |
| SEO | Search visibility work that helps people find the site | Optimización para motores de búsqueda |
| Analytics | Reporting that shows how visitors behave and where leads come from | Analítica |
| Localization | Adapting content and user experience for another language or region | Localización |
| Custom Integration | Connecting the website to another tool or system already used by the client | Integración personalizada |
| Responsive Design | The site works well on desktop, tablet, and mobile devices | Diseño responsivo |
| Discovery Sprint | A structured process to clarify scope before building | Sprint de descubrimiento |

| Metric | Target |
| Page Load Time | < 2 seconds |
| Time to Interactive | < 3.5 seconds |
| Lighthouse Performance Score | ≥ 90 |
| Lighthouse Accessibility Score | ≥ 90 |
| Lighthouse SEO Score | ≥ 90 |
