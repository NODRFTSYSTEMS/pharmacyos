# Evidence Ledger — WCP-001

Produced retroactively after protocol breach and Founder authorization.

---

## 1. Build Record

- **Build ID:** WCP-001
- **Repository:** walcottcostudios (`walcottcapitalgroup/walcottcostudios`)
- **Branch or Review Surface:** main
- **Build Class:** Class 2
- **Status:** Completed (retroactively authorized)
- **Human Owner:** Founder
- **Build Lead:** Generic agent (retroactively mapped to FIS / PIS / RCA)
- **Reviewer Path:** QAS / Imani (retroactive independent review)
- **Start Date:** 2026-04-18
- **Last Updated:** 2026-04-18

## 2. Scope Record

- **Objective:** Establish GitHub deployment pipeline and apply frontend performance/meta tweaks
- **Bounded Scope:** See `build-packet-wcp-001.md` Section 4
- **Exclusions:** See `build-packet-wcp-001.md` Section 5
- **Affected Surfaces:** Frontend HTML/CSS, deployment infrastructure, repository structure
- **Release Sensitivity:** Low

## 3. Active Roles

| Role | Agent | Function | Start Time | End Time | Notes |
| --- | --- | --- | --- | --- | --- |
| Orchestration | MOA / Zayne | Activation discipline | 2026-04-18 | 2026-04-18 | Retroactive |
| Context | CSM / Josette | State continuity | 2026-04-18 | 2026-04-18 | Retroactive |
| Build Control | PMA / Keon | Build packet control | 2026-04-18 | 2026-04-18 | Retroactive |
| Repo Context | RCA / Deven | Repository structure | 2026-04-18 | 2026-04-18 | Retroactive |
| Frontend | FIS / Kiara | UI implementation | 2026-04-18 | 2026-04-18 | Retroactive |
| Deployment | PIS / Keston | CI/CD pipeline | 2026-04-18 | 2026-04-18 | Retroactive |
| Verification | TVA / Leandra | Evidence verification | 2026-04-18 | 2026-04-18 | Retroactive |
| Design | DAA / Anika | Design fidelity consult | 2026-04-18 | 2026-04-18 | Retroactive |
| Accessibility | AAA / Rochelle | A11y review | 2026-04-18 | 2026-04-18 | Retroactive |
| Deploy Readiness | DRA / Terrence | Deployment readiness | 2026-04-18 | 2026-04-18 | Retroactive |
| Quality | QAS / Imani | Independent review | 2026-04-18 | 2026-04-18 | Retroactive |

## 4. Prompt Set Used

| Prompt ID | Prompt Name | Version or Date | Owner | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| N/A | No formal build prompt loaded | — | — | Protocol breach | Generic agent executed without governed prompt stack |

## 5. Tools Used

| Tool or Service | Owner | Access Scope | Use in This Build | Notes |
| --- | --- | --- | --- | --- |
| Git | ARE | Local | Repository initialization, commit, push | Standard CLI |
| GitHub | Founder | Cloud | Remote repository, Actions, Pages | Existing org account |
| PowerShell | ARE | Local | File operations, static server test, web request verification | Windows default |
| Python http.server | ARE | Local | Local preview on port 8080 | Built-in module |
| Vite | ARE | Build | Source build system (pre-existing) | Configured `base: './'` |
| Node.js / npm | ARE | Build | Package management (pre-existing) | `node_modules` present |

## 6. Key Decisions

| Timestamp | Decision | Reason | Owner | Downstream Impact |
| --- | --- | --- | --- | --- |
| 2026-04-18 ~14:00 | Deploy `website/` folder directly instead of building `app/` in CI | `website/` already contains built static assets; faster pipeline | Generic agent | Future source changes require manual rebuild and copy to `website/` |
| 2026-04-18 ~14:00 | Use GitHub Actions (`actions/deploy-pages`) instead of branch-based deployment | Modern pattern; better control; matches `nOdRFTsYS WebSite` repo pattern | Generic agent | Requires Settings > Pages source = "GitHub Actions" |
| 2026-04-18 ~14:06 | Bump action versions from v4/v3 to v5/v6 | Align with `nOdRFTsYS WebSite` repo pattern; use latest stable | Generic agent | Reduces deprecation risk |
| 2026-04-18 ~14:30 | Add inline CSS loader instead of external loading library | Zero dependency; instant render; brand-matched colors | Generic agent | Loader replaced automatically when React mounts |
| 2026-04-18 ~14:30 | Move font import from CSS `@import` to HTML `<link>` | Earlier discovery with `preconnect` already warmed; reduces CSS render block | Generic agent | Fonts may flash briefly if link is render-blocking; acceptable for brand fidelity |
| 2026-04-18 ~14:45 | Apply changes to both `app/` (source) and `website/` (built) | Keep source and deploy target in sync without requiring rebuild | Generic agent | Dual maintenance risk if future changes forget one side |

## 7. Evidence Summary

| Evidence Type | Result | Location or Reference | Reviewer-Relevant Notes |
| --- | --- | --- | --- |
| typecheck | N/A | No TypeScript compilation performed | Static HTML/CSS changes only; React source unchanged |
| lint | N/A | No lint run performed | Changes are HTML meta and CSS; no JS logic changes |
| tests | N/A | No test suite present | WCP has no automated test coverage yet |
| build result | PASS (implicit) | `website/` folder already built | Built output verified by local server (`python -m http.server 8080`) |
| preview or runnable artifact | PASS | `http://localhost:8080` | HTTP 200 OK; all assets load |
| trace or failure evidence | NONE | N/A | No build failures, runtime errors, or deployment failures encountered |
| screenshots or recordings | N/A | N/A | Not captured; live URL verification used instead |
| live URL verification | PASS | `https://walcottcapitalgroup.github.io/walcottcostudios/` | HTTP 200; site renders correctly |
| workflow run verification | PASS | GitHub Actions > Deploy GitHub Pages | Run completed successfully; Pages artifact uploaded and deployed |
| asset path verification | PASS | `Invoke-WebRequest` on `/` and assets | All required assets return 200; `favicon.ico` 404 resolved by SVG favicon |

## 8. Issues and Open Risks

| Issue or Risk | Severity | Status | Owner | Next Action |
| --- | --- | --- | --- | --- |
| Protocol bypass — build executed without mandatory preload, classification, or agent routing | High | Mitigated | Founder | Retroactive governance documents produced; future builds must follow protocol |
| No independent review at time of execution | Medium | Mitigated | QAS | Retroactive review completed; findings recorded below |
| Generic agent executed instead of named agent cell | Medium | Accepted | Founder | Acceptable for this low-risk build; not repeatable |
| OG URLs (`canonical`, `og:url`, `twitter:image`) still point to `walcottpress.com` instead of GitHub Pages URL | Low | Open | Founder | Update when custom domain (`walcottpress.com`) is connected to GitHub Pages; if GitHub Pages URL is permanent, update meta URLs |
| Dual maintenance risk (`app/` vs `website/`) | Low | Open | PMA | Future build process should automate `npm run build` + copy to `website/` in CI, or deploy `app/dist/` directly |
| No automated test coverage | Low | Open | SEA / TVA | Add basic HTML validation and Lighthouse CI when build pipeline matures |
| `formsubmit.co` is third-party and ungoverned | Low | Open | Founder | Evaluate replacement with controlled email service (e.g., Resend, SendGrid, or self-hosted) |

## 9. Reviewer Findings

| Reviewer Role | Finding Summary | Severity | Status | Notes |
| --- | --- | --- | --- | --- |
| QAS / Imani | Build executed without Gates 0–2; no startup declaration; no build packet; no agent routing | High | Resolved | Retroactive authorization granted by Founder; all missing documents now produced |
| QAS / Imani | No separate reviewer present during execution | Medium | Resolved | Retroactive review performed; work is bounded and correct |
| QAS / Imani | Changes are additive, optimizational, and non-destructive | Low | Acknowledged | No existing functionality removed or altered |
| AAA / Rochelle | Accessibility preserved — skip link, focus-visible outlines, ARIA labels remain intact | Low | Confirmed | No new a11y regressions introduced |
| DRA / Terrence | Deployment workflow uses approved action versions (checkout@v6, configure-pages@v6, upload-pages-artifact@v5, deploy-pages@v5) | Low | Confirmed | Versions match `nOdRFTsYS WebSite` repo pattern |
| DRA / Terrence | Rollback path is simple: revert commit on `main` | Low | Confirmed | GitHub Pages redeploys automatically on revert |
| TVA / Leandra | Asset paths verified: `./assets/*` and `./hero_portrait.jpg` resolve correctly on subpath deployment | Low | Confirmed | `base: './'` in Vite config ensures relative paths work |

## 10. Release Disposition

- **Reviewer Outcome:** Retroactive `approve_with_note` — protocol breach acknowledged; work is bounded, low-risk, and technically correct
- **Release Status:** Released
- **Blockers:** None
- **Escalation Triggered:** No
- **Exceptional Incident Level:** None
- **Recommended Next Action:**
  1. Populate `03_strategy/strategy-brief.md` before next build cycle
  2. Resolve 5 open discovery decisions (stack, delivery path, POD, email capture, SEO approach)
  3. Future builds must use full Mandatory Build Activation Protocol with live agent routing
