# NoDrftSystems Proprietary Skill
# Classification: Internal — Confidential
# Do NOT commit to client repositories
# Source: CLAUDE.md Section 5.2

## SKILL: business_formation

**Purpose:** Provide structured, template-based business formation guidance. This skill generates general information and templates only — not legal advice.

**Trigger:** Client requests business formation assistance, NAICS code guidance, legal structure guidance, or business registration information.

**MANDATORY DISCLAIMER — Append to every output from this skill without exception:**
> "This material is for general informational purposes only and does not constitute legal advice. Consult a licensed attorney before making legal or structural decisions."

**Pre-conditions:**
- Confirm the client's primary business activity and target market
- Confirm jurisdiction context (default: United States; flag if international)
- Log a legal review request to `[CLIENT-WORKSPACE]/06_legal-review/` before any template is delivered

**NAICS Code Routing — Service-to-Code Mapping:**

| Client Business Type | Primary NAICS | Secondary NAICS | Notes |
|---------------------|--------------|----------------|-------|
| Web design and development | 541511 | 541512 | Custom computer programming / computer systems design |
| Digital marketing agency | 541810 | 541613 | Advertising agencies / marketing consulting |
| E-commerce retail | 454110 | — | Electronic shopping |
| SaaS / software products | 511210 | 541511 | Software publishers / custom programming |
| Management consulting | 541611 | — | Administrative management consulting |
| Real estate tech (PropTech) | 531390 | 541511 | Other real estate activities / software |
| Home services platform | 561790 | 541511 | Other services to buildings / software |
| Content creation / media | 519130 | 711510 | Internet publishing / independent artists |
| Business coaching / advisory | 611430 | 541611 | Professional development / consulting |
| Healthcare tech | 621999 | 511210 | Other ambulatory / software publishers |
| Legal tech | 541199 | 511210 | Other legal services / software |
| Fintech | 522390 | 511210 | Other activities related to credit / software |

**Step Sequence:**
1. Identify the client's primary business activity
2. Route to the appropriate NAICS code using the table above; present primary and secondary codes with rationale
3. Recommend a general legal structure based on business type and stated goals:
   - LLC: most common for service businesses and SaaS; flexible, pass-through taxation
   - S-Corp: tax advantages at higher income levels; more administrative requirements
   - C-Corp: preferred for VC-backed startups and equity-based compensation plans
   - Always include the legal review notation — do not make a final recommendation without it
4. Outline general state of formation considerations (Delaware default for multi-state or investor-oriented businesses; home state for locally-focused operations)
5. Produce the output template (see below)
6. Log legal review request
7. Append mandatory disclaimer

**Output Template:**

```markdown
# Business Formation Overview — [Client/Project Name]
[MANDATORY DISCLAIMER — verbatim]

## Recommended Legal Structure
[Structure + general tradeoffs — NO final recommendation without legal review]

## NAICS Code
**Primary:** [code] — [description]
**Secondary:** [code] — [description]
**Rationale:** [why these codes fit the business activity]

## State of Formation — General Considerations
[Delaware guidance for multi-state / investor; home state for local]

## Registration Checklist (General)
- [ ] Choose and reserve business name
- [ ] File Articles of Organization / Incorporation
- [ ] Obtain EIN from IRS (Form SS-4)
- [ ] Open business bank account
- [ ] Designate registered agent
- [ ] Draft operating agreement / bylaws
- [ ] Research state-specific license requirements

## EIN Application Process
[General outline — IRS Form SS-4, online application at IRS.gov]

## Registered Agent Requirements
[General: required in state of formation; must have physical address; can be owner, attorney, or registered agent service]

## Compliance Calendar (General)
- [ ] Annual report filing (date varies by state)
- [ ] Federal tax filing (S-Corp: March 15; C-Corp: April 15; LLC: varies)
- [ ] State tax filings (varies)
- [ ] Business license renewals (varies by locality)

[MANDATORY DISCLAIMER — verbatim, repeated at close]
```

**QA Requirements:** Pass 2 (Content Review) required before any business formation output is delivered to a client. Legal review must be logged.

**Proprietary Protection:** The NAICS routing table and scoring methodology are internal. Present recommendations to clients without exposing the routing logic.

**Escalation Conditions:**
- Any client requesting formation guidance in a regulated industry (healthcare, legal, financial, cannabis): Founder review before any output is produced
- Any client operating in multiple countries: flag as outside standard scope; recommend specialized international counsel
- Do not recommend specific attorneys, specific states beyond general Delaware guidance, or project formation timelines
