# NoDrftSystems Proprietary Skill
# Classification: Internal — Confidential
# Do NOT commit to client repositories
# Source: CLAUDE.md Section 5.2

## SKILL: hosting_maintenance

**Purpose:** Manage ongoing hosting, infrastructure, and maintenance engagements.

**Trigger:** Client has a live site or deployed product requiring ongoing support.

**Pre-conditions:**
- Signed maintenance retainer SOW on file — this service is NEVER bundled into build pricing
- SLA tier must be explicitly priced and stated in the SOW before this skill activates:
  - **Standard:** 48-hour response — priced per retainer tier
  - **Priority:** 24-hour response — priced at a premium above Standard
  - **Emergency:** 4-hour response — priced at a significant premium above Priority
- If SLA tier and price are not in the SOW: stop and escalate to Founder before any maintenance work begins

**Standard Infrastructure Stack:**

| Component | Tool | Standard Monthly Cost |
|-----------|------|-----------------------|
| Frontend hosting | Vercel Pro | $20/mo base |
| Database / Auth | Supabase Pro | $25–50/mo |
| Error monitoring | Sentry | $50/mo |
| Version control | GitHub Teams | $20/mo |
| DNS / Domain | Client-managed | — unless explicitly in SOW |

**Step Sequence for Recurring Maintenance:**
1. Confirm the active SOW, SLA tier, and scope definition (bugs vs. features)
2. Confirm infrastructure ownership (client accounts vs. NoDrftSystems-managed)
3. For each deployment cycle:
   a. Run `npm audit` — review all findings
   b. Classify: none / low / moderate / high / critical
   c. No high or critical vulnerabilities proceed to production — resolve first
   d. Update SBOM with the current dependency state
   e. Log SBOM to `[WORKSPACE]/05_QA/sbom_[YYYY-MM-DD].md`
4. Apply change management protocol per SOW:
   - Bug fixes: execute within SLA window, log to session completion report
   - Feature requests: document as a change order, price separately, require signed order before work begins
5. At end of each maintenance period: produce a brief maintenance summary (what was done, what is pending, upcoming renewals or upgrade recommendations)

**Maintenance Scope Boundaries:**
- Bug fixes are covered per SOW — defects in delivered functionality within the support window
- New features, redesigns, and scope expansions require a separate SOW or signed change order
- Infrastructure cost changes (Vercel plan upgrades, Supabase tier changes) must be communicated to the client in writing before they are incurred

**Security Obligations (Non-Negotiable):**
- Run `npm audit` on every deployment — no exceptions
- No high/critical CVE vulnerabilities proceed to production
- SBOM generated and logged per deployment cycle
- API keys and credentials reviewed for rotation at the start of each retainer period

**Access Credential Management:**
- Maintain an access log in `[WORKSPACE]/06_handoff/access_log.md`
- NoDrftSystems retains access only for the duration of the retainer
- At retainer end: full access transfer per the `handover_protocol` rule; NoDrftSystems access revoked after transfer confirmation

**QA Requirements:**
- Pass 4 (Technical QA) required before each production deployment
- `system-maintenance` workflow skill should be run as pre-build health check before major deployments

**Proprietary Protection:** Infrastructure patterns, security protocols, and SLA pricing tiers are internal. Client receives maintenance summaries and deliverables only.

**Escalation Conditions:**
- Any critical security vulnerability that cannot be resolved within the emergency SLA window: notify client immediately, escalate to Founder
- Any infrastructure cost that would exceed the SOW budget estimate: notify client in writing before incurring
- At end of retainer: do not continue work without a renewed SOW on file
