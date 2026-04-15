# Human Authority Map

Status: active reference
Purpose: define the three human leadership authorities, their non-delegable decision domains, and their escalation routing within the NoDrftSystems AI operating model.

These are not loadable skills. They are escalation targets referenced by AI agent role charters, the skill-pack manifest, and the human handoff coordinator (HHC).

## HR-FOUNDER — Founder / CEO

**Agent Code:** HR-FOUNDER

**Activation Status:** Always Active

**Authority Domain:**

- Final approval on all pricing decisions above $15K
- Client acceptance and decline decisions
- Pricing publication or changes to public-facing pricing
- Kill-switch decisions for suspended client work
- Legal instrument sign-off after counsel review
- Budget exception approval
- Strategic partnerships and direction
- Agent bench expansion approvals
- Escalation resolution when ARE or Growth Lead cannot resolve

**Non-Delegable Decisions:**

| Decision | Cannot Be Delegated To |
| --- | --- |
| Pricing publication | Any AI agent or Growth Lead |
| Client acceptance above qualification band | Growth Lead alone |
| Legal instrument approval | Any AI agent |
| Kill-switch trigger | Any AI agent |
| Agent architecture changes | Any AI agent |
| Budget exceptions >threshold | Any single human without Founder |

**Receives Escalations From:**

- HHC (all Immediate-class escalations)
- PEA (proposals >$15K or non-standard scope)
- IGA (invoices with deviations or first-client billing)
- ARCA (kill-switch triggers and overdue threshold alerts)
- PRGA (new role creation or role conflicts)
- IPGA (high-infringement or legal-review required flags)
- CDA (all contract draft outputs)

**SLA:**

- Immediate class: same day
- High class: 24 hours
- Standard class: 48 hours

---

## HR-ARE — AI Reliability Engineer

**Agent Code:** HR-ARE

**Activation Status:** Always Active

**Authority Domain:**

- Technical validation and release readiness sign-off
- ARE approval for production release proceed decisions
- Tool stack integrity and decisions
- Prompt governance support and approval
- QA enforcement decisions at release gate
- Security and compliance finding escalation resolution
- Confidence threshold tuning
- Agent capacity expansion technical review

**Non-Delegable Decisions:**

| Decision | Cannot Be Delegated To |
| --- | --- |
| Production release approval | Any AI agent |
| Security incident response | Any AI agent alone |
| Prompt config version approval | Any AI agent |
| Tool addition or removal | Any AI agent alone |
| Defect critical escalation hold | Any AI agent |

**Receives Escalations From:**

- QAS (critical defects, release decisions)
- SCA (critical vulnerabilities, compliance failures)
- DRA (missing approvals or critical blockers)
- PCA (unauthorized prompt changes)
- TACA (stale credential risk or unapproved tool access)
- AAA (critical accessibility blockers)
- KDGA (conflicting active documents)

**SLA:**

- Immediate class (security incident, production block): same day
- High class: 24 hours
- Standard class: 48 hours

---

## HR-GROWTH — Growth Lead

**Agent Code:** HR-GROWTH

**Activation Status:** Always Active

**Authority Domain:**

- Outbound and partnership execution decisions
- Pipeline follow-through below Founder thresholds
- Proposal review and send approval (under $15K)
- Content distribution coordination and client communications below sensitive threshold
- Sales-side human approvals below Founder authority

**Non-Delegable Decisions:**

| Decision | Cannot Be Delegated To |
| --- | --- |
| Outreach send approval | Any AI agent |
| Proposal send approval (<$15K) | Any AI agent |
| Lead decline below Founder threshold | Any AI agent alone |
| Client communication on sensitive issues | Any AI agent alone |

**Receives Escalations From:**

- OOA (sensitive prospect or objection outside script)
- SDA (strategic or high-risk target account)
- PEA (proposals under $15K needing send approval)
- COA (missing access or contract discrepancy at onboarding)
- CHSA (high churn risk or expansion opportunity signals)
- CCA (client dissatisfaction or scope negotiation signals)

**SLA:**

- Immediate class (sensitive or time-critical client situation): same day
- High class: 24 hours
- Standard class: 48 hours

---

## Escalation Routing Matrix

| Escalation Class | Routed Through | First Human Target | Secondary Target |
| --- | --- | --- | --- |
| Pricing publication | HHC | HR-FOUNDER | — |
| Legal instrument | HHC | HR-FOUNDER | Legal Counsel |
| Production release | HHC | HR-ARE | HR-FOUNDER (if systemic) |
| Client acceptance | HHC | HR-FOUNDER | HR-GROWTH |
| Security incident | HHC | HR-ARE | HR-FOUNDER |
| Proposal send (<$15K) | HHC | HR-GROWTH | — |
| Proposal send (>$15K) | HHC | HR-GROWTH + HR-FOUNDER | — |
| Content send | HHC | HR-GROWTH | HR-FOUNDER (sensitive) |
| Agent creation request | HHC | HR-FOUNDER | HR-ARE |
| Kill-switch trigger | HHC | HR-FOUNDER | — |

## Rules

- HHC is the sole AI routing point for human escalations. Individual agents do not route directly to humans except through the HHC escalation channel.
- Every escalation must have a decision brief prepared by HHC before human review begins.
- Human authority decisions must be logged with timestamp, decision, and any conditions.
- No AI agent may suppress or delay an escalation once a trigger condition is met.
