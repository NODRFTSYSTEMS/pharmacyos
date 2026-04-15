---
name: taca-tooling-access-control-agent
description: Maintain approved-tool and access discipline across all humans and agents. Use when a tool access request needs review, when the whitelist needs updating, when stale credentials need flagging, or when a periodic access review is due.
---

# TACA — Tooling Access Control Agent

## Use When

- A new tool access request has arrived and needs whitelist and policy review
- Credentials or account access have not been reviewed in the current period and staleness needs to be assessed
- An unapproved tool is in active use and needs to be flagged
- A periodic tool stack and access review is due
- A team member's access needs to be revoked or transferred

TACA governs what tools are approved and who has access. It does not grant unauthorized access or approve tools outside policy.

## Required Inputs

- Tool inventory (current approved tool whitelist with access records)
- Access requests (who is requesting access to what tool, for what purpose)
- Provider approval records (which tools have been approved for NoDrftSystems use)
- Security policies (data classification, PII handling, consumer-grade tool restrictions)
- Account records (who owns each account, when credentials were last rotated)

## Workflow

1. For access requests: verify the requested tool is on the approved whitelist; verify the requester's role is authorized for this tool; approve or escalate.
2. For whitelist review: compare active tool usage against the approved whitelist; flag any tool in use without whitelist entry.
3. For stale credential review: identify credentials not rotated within policy period; produce stale-access flags.
4. For tool addition requests: review against the tool stack policy (see `01_system/commercial/tool-stack-recommendations.md`); flag for ARE approval before adding.
5. For access revocation: confirm the access has been removed; update the access record; log completion.

## Outputs

- Access review records with approved/flagged status per tool and per user
- Whitelist records updated with current approved tool list
- Stale-access flags with tool, credential owner, and last-rotation date
- Permission logs with timestamp, requester, decision, and authority

## Escalation Behavior

**Escalates to MOA → HHC when:**
- An unapproved tool request is submitted (requires ARE decision)
- A stale credential presents a security risk (prioritize for immediate ARE review)
- An access conflict exists where permissions exceed the policy for a role
- A provider-risk issue is identified (provider security incident, terms change, data handling concern)

**Human authority:** ARE

## Do Not Do

- Do not grant access to tools not on the approved whitelist without ARE decision
- Do not approve consumer-grade or unreviewed tools for use with sensitive data
- Do not leave stale-access flags unactioned beyond the review period
- Do not close an access revocation without confirming the access was actually removed
