import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "academy" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
  };
}

const chapters = [
  { id: "foundations", label: "Foundations", desc: "What investing is and how value is created" },
  { id: "strategies", label: "Core Strategies", desc: "Fix and flip, buy and hold, BRRRR, wholesale" },
  { id: "misconceptions", label: "Misconceptions", desc: "Frequent errors that weaken judgment" },
  { id: "deal-flow", label: "Where Deals Come From", desc: "On-market, off-market, networks, intermediaries" },
  { id: "finding", label: "How Investors Find", desc: "Systems, criteria, follow-up, local knowledge" },
  { id: "assessment", label: "How Investors Assess", desc: "Fit, basis, scope, exit, resilience" },
  { id: "risk", label: "Risk And Mitigation", desc: "What can go wrong and how to control it" },
  { id: "process", label: "Investment Process", desc: "From target definition through execution" },
  { id: "judgment", label: "Decision Judgment", desc: "How to know when to pursue or walk away" },
  { id: "terms", label: "Core Terms", desc: "Key concepts every investor should understand" },
  { id: "edge", label: "Long-Term Edge", desc: "What strong investors build over time" },
];

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--gold-dim)", border: "1px solid rgba(233,160,21,0.2)", borderRadius: "var(--radius-sm)", padding: "20px 24px", margin: "28px 0" }}>
      <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>{title}</div>
      <div className="body-text">{children}</div>
    </div>
  );
}

function DefList({ items }: { items: { term: string; desc: string }[] }) {
  return (
    <dl className="def-list" style={{ margin: "20px 0" }}>
      {items.map(({ term, desc }) => (
        <div key={term} className="def-list-row">
          <dt>{term}</dt>
          <dd>{desc}</dd>
        </div>
      ))}
    </dl>
  );
}

function ProcessCard({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div className="process-card" style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--gold-dim)", border: "1px solid rgba(233,160,21,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--gold)", flexShrink: 0 }}>
        {String(num).padStart(2, "0")}
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text)", marginBottom: "6px" }}>{title}</div>
        <div className="body-xs">{desc}</div>
      </div>
    </div>
  );
}

function SectionHeading({ id, title, subtitle }: { id: string; title: string; subtitle?: string }) {
  return (
    <div id={id} style={{ paddingTop: "64px", marginBottom: "28px" }}>
      <h2 className="heading-md" style={{ marginBottom: subtitle ? "10px" : 0 }}>
        {title}
      </h2>
      {subtitle && <p className="body-text">{subtitle}</p>}
      <div style={{ width: "40px", height: "2px", background: "var(--gold)", marginTop: "12px", borderRadius: "2px" }} />
    </div>
  );
}

export default function AcademyPage() {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Hero */}
      <section className="section-hero">
        <div className="container">
          <div className="split-grid">
            <div>
              <div className="eyebrow" style={{ marginBottom: "14px" }}>Academy</div>
              <h1 className="display" style={{ marginBottom: "20px" }}>
                Learn the discipline behind better real estate decisions.
              </h1>
              <p className="lead" style={{ marginBottom: "32px" }}>
                The Academy is a comprehensive guide to real estate investing, built to help investors understand how opportunities are found, evaluated, and executed with discipline. It covers core investment strategies, common misconceptions, key risk factors, practical risk-mitigation techniques, and the full investment process from initial screening through final decision-making.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <a href="#foundations" className="button button-primary">Start Reading</a>
                <Link href="/academy/strategies" className="button button-secondary">View Strategies</Link>
                <Link href="/academy/templates" className="button button-learning">Browse Templates</Link>
              </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
                <div className="card-kicker" style={{ marginBottom: 0 }}>A practical education path</div>
              </div>
              <div className="terminal-grid" style={{ border: "none", borderRadius: 0 }}>
                {[
                  ["Learn", "Understand what real estate investing is, how value is created, and why strategy drives analysis."],
                  ["Source", "See where good deals come from and how experienced investors filter noise quickly."],
                  ["Assess", "Study risk, basis, scope, exit logic, and the difference between possible and probable."],
                  ["Execute", "Follow the process from first-pass screen through diligence, negotiation, and final decision."],
                ].map(([label, value]) => (
                  <div key={label} className="terminal-row">
                    <span className="label">{label}</span>
                    <span className="value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body: sidebar + content */}
      <style>{`
        .academy-layout { display: grid; grid-template-columns: 240px 1fr; gap: 48px; align-items: start; }
        @media (max-width: 900px) { .academy-layout { display: flex; flex-direction: column; gap: 32px; } .academy-sidebar { position: static !important; } .academy-sidebar-nav { display: flex; flex-direction: row; flex-wrap: wrap; gap: 4px; overflow-x: auto; } }
        .academy-sidebar-nav a:hover { color: var(--gold) !important; background: var(--gold-dim) !important; }
      `}</style>
      <section style={{ padding: "0 0 96px" }}>
        <div className="container">
          <div className="academy-layout">

            {/* Sidebar */}
            <aside className="academy-sidebar" style={{ position: "sticky", top: "90px" }}>
              <div className="card" style={{ padding: "20px" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-soft)", marginBottom: "12px" }}>
                  Chapters
                </div>
                <nav className="academy-sidebar-nav" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {chapters.map((ch) => (
                    <a
                      key={ch.id}
                      href={`#${ch.id}`}
                      style={{ padding: "8px 10px", borderRadius: "8px", fontSize: "0.82rem", color: "var(--text-muted)", textDecoration: "none", lineHeight: 1.4, transition: "all 0.12s" }}
                    >
                      {ch.label}
                    </a>
                  ))}
                </nav>
                <div className="education-banner" style={{ marginTop: "16px", fontSize: "0.75rem" }}>
                  Move through in order if you are new. Jump to sourcing, assessment, or risk if you already know the basics.
                </div>
              </div>
            </aside>

            {/* Content */}
            <div>
              {/* 1. Foundations */}
              <SectionHeading id="foundations" title="What real estate investing actually is." />
              <p className="body-text" style={{ marginBottom: "16px" }}>
                Real estate investing is capital allocation. Like any form of investing, it requires distinguishing between what is possible and what is probable. The discipline is not finding cheap properties. The discipline is understanding what a given asset is worth under a specific strategy, at a specific basis, in a specific market — and buying with enough margin to survive the gap between your assumptions and reality.
              </p>
              <Callout title="Why investors make money in real estate">
                Profit is created by acquiring the right asset, under the right terms, for the right strategy, with enough margin to survive mistakes and uncertainty.
              </Callout>
              <DefList items={[
                { term: "Buying well", desc: "The entry price determines whether the strategy works before a single dollar is spent on improvements." },
                { term: "Improving the asset", desc: "Controlled renovation that adds value in excess of cost — not just remodeling for its own sake." },
                { term: "Holding for cash flow", desc: "Acquiring income-producing assets at a basis that supports debt service and operating costs with margin." },
                { term: "Solving a problem", desc: "Finding motivated sellers, distressed assets, or market inefficiencies that create below-market entry." },
              ]} />

              {/* 2. Core Strategies */}
              <SectionHeading id="strategies" title="The four core strategies." subtitle="Strategy comes first because strategy determines what a good deal looks like. The same property can work under one plan and fail under another." />
              <div className="grid-2" style={{ marginBottom: "24px" }}>
                {[
                  { title: "Fix And Flip", kicker: "Project business", desc: "A project business, not a cheap-house business. MAO = ARV − Repairs − Carrying Costs − Selling Costs − Desired Profit. Primary risks: repair scope expansion, timeline slippage, resale market weakness at exit." },
                  { title: "Buy And Hold", kicker: "Rental income", desc: "Long-term ownership built on income quality. NOI must support debt service and operating costs. Primary risks: vacancy, deferred maintenance, tenant non-performance." },
                  { title: "BRRRR", kicker: "Capital recycling", desc: "A capital-recycling strategy with several failure points. The refinance must return enough cash to redeploy. If basis is too high or appraisal comes in low, capital gets trapped." },
                  { title: "Wholesale", kicker: "Contract control", desc: "Contract value exists only if the end buyer still has room. Assignment Spread = End Buyer Price − Contract Price − Transaction Friction. Credibility requires accurate ARV and repair numbers." },
                ].map((s) => (
                  <div key={s.title} className="feature-card">
                    <div className="card-kicker">{s.kicker}</div>
                    <h3 className="heading-sm" style={{ marginBottom: "10px" }}>{s.title}</h3>
                    <p className="body-xs">{s.desc}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Link href="/academy/strategies" className="button button-secondary" style={{ fontSize: "0.82rem", minHeight: "38px", padding: "8px 16px" }}>Open Strategy Pages →</Link>
              </div>

              {/* 3. Misconceptions */}
              <SectionHeading id="misconceptions" title="Common misconceptions that hurt investors." />
              <p className="body-text" style={{ marginBottom: "16px" }}>
                One of the most common misconceptions is that a property becomes a good deal simply because it is discounted. Discount is relative to something. If the reference point is wrong, the discount is meaningless.
              </p>
              <DefList items={[
                { term: "Discount does not equal value", desc: "A property 30% below list price is only a good deal if list price reflects actual market value, the condition is understood, and the strategy works at that basis." },
                { term: "ARV and future rent are not guarantees", desc: "ARV is an estimate based on comparable sales. Future rent is a projection. Both can be wrong. Strong underwriting prices in that uncertainty." },
                { term: "More deals does not mean better performance", desc: "Deal volume amplifies judgment quality. More deals made with weak underwriting produces larger losses, not stronger returns." },
                { term: "Strategy cannot be an afterthought", desc: "The metrics that define a good deal depend entirely on the strategy. Evaluating a flip deal using rental metrics will produce a bad decision." },
                { term: "Headline profit is not enough", desc: "Gross profit without considering cash in, timeline, carry cost, and risk produces meaningless ROI comparisons." },
                { term: "Real estate is not just a search problem", desc: "Finding a deal is only the beginning. Assessment, negotiation, execution, and exit are each independent failure points." },
              ]} />

              {/* 4. Deal Flow */}
              <SectionHeading id="deal-flow" title="Where deals come from." />
              <DefList items={[
                { term: "On-market deals", desc: "Listed on MLS through traditional brokers. Most competitive, most transparent, least likely to have pricing inefficiencies." },
                { term: "Off-market direct-to-seller", desc: "Direct outreach to owners who have not listed. Motivated sellers create pricing opportunity but require more effort and lead management." },
                { term: "Wholesalers and investor networks", desc: "Other investors who control contracts. Speed is the advantage; accuracy of their ARV and repair numbers must be independently verified." },
                { term: "Brokers and specialized intermediaries", desc: "Distressed asset specialists, auction platforms, and estate sale representatives who work with motivated or institutional sellers." },
                { term: "Distress and transition situations", desc: "Probate, divorce, job relocation, foreclosure pre-auction. Motivated seller creates flexibility but requires careful due diligence on condition and title." },
              ]} />

              {/* 5. Finding */}
              <SectionHeading id="finding" title="How experienced investors find promising opportunities." />
              <DefList items={[
                { term: "They define buy criteria clearly", desc: "Strategy, geography, price range, property type, condition class, and minimum return threshold are defined before evaluating any deal." },
                { term: "They maintain multiple sourcing channels", desc: "Relying on a single source creates gaps. Strong investors maintain MLS alerts, wholesaler relationships, direct mail, agent networks, and auction access simultaneously." },
                { term: "They track leads consistently", desc: "Most deals do not close on first contact. A CRM or simple tracking system turns longer-cycle opportunities into future acquisitions." },
                { term: "They understand local markets", desc: "Neighborhood-level knowledge of pricing, absorption, buyer profiles, and renovation costs cannot be replaced by national data." },
                { term: "They protect time", desc: "Fast rejection of weak deals is as important as deep evaluation of strong ones. Clear criteria make fast no decisions possible." },
              ]} />

              {/* 6. Assessment */}
              <SectionHeading id="assessment" title="How experienced investors assess opportunities." />
              <Callout title="The right question">
                Strong investors do not ask, &ldquo;Could this work?&rdquo; They ask, &ldquo;Does this work well enough, with enough margin, under realistic assumptions, after accounting for risk?&rdquo;
              </Callout>
              <DefList items={[
                { term: "They begin with fit", desc: "Does this property match the defined acquisition criteria? If not, the analysis ends here regardless of how the numbers look at first glance." },
                { term: "They assess basis", desc: "What is the all-in cost to acquire, improve, and hold this asset to the exit? Basis includes purchase price, closing costs, repairs, carry, and disposition." },
                { term: "They define the true scope", desc: "Repair assumptions must be specific, not round numbers. Walkthrough findings, contractor estimates, and condition class define scope — not intuition." },
                { term: "They test exit logic", desc: "Who is the buyer? What is the probable sale price based on recent comparable sales? What does absorption look like in this submarket right now?" },
                { term: "They test resilience", desc: "What happens if ARV comes in 5% lower? What happens if repairs run 20% over? What happens if the hold extends by two months? If the deal breaks under light stress, the assumptions are too thin." },
                { term: "They compare alternatives", desc: "A deal is not evaluated in isolation. The relevant question is whether this deal is better than other available uses of the same capital." },
              ]} />

              {/* 7. Risk */}
              <SectionHeading id="risk" title="The risks involved in real estate investing." />
              <p className="body-text" style={{ marginBottom: "24px" }}>
                Real estate investing is not risk-free, and no strategy eliminates risk entirely. The question is not whether risk exists. The question is whether it is understood, priced, and controlled.
              </p>
              <div className="grid-2" style={{ marginBottom: "24px" }}>
                {[
                  { title: "Market Risk", desc: "Prices, absorption rates, and buyer demand change. Exits planned at peak-market ARVs can underperform when conditions soften." },
                  { title: "Renovation Risk", desc: "Scope expands, contractors miss schedules, permit delays add hold time. Repairs are almost always underestimated on first pass." },
                  { title: "Financing Risk", desc: "Rate changes, lender condition changes, and appraisal shortfalls can change the economics or block closing entirely." },
                  { title: "Operational Risk", desc: "Execution depends on contractors, property managers, agents, and tenants. Each adds execution variance." },
                  { title: "Legal And Title Risk", desc: "Title issues, unpermitted work, environmental conditions, and HOA restrictions can materially affect value and exit." },
                  { title: "Liquidity Risk", desc: "Real estate is not liquid. Extended hold periods increase carrying costs and exposure to market changes." },
                ].map((r) => (
                  <div key={r.title} className="feature-card">
                    <h3 style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text)", marginBottom: "8px" }}>{r.title}</h3>
                    <p className="body-xs">{r.desc}</p>
                  </div>
                ))}
              </div>
              <Callout title="Practical risk-mitigation techniques">
                Risk cannot be eliminated, but it can be reduced meaningfully through discipline. Conservative assumptions, independent verification, contingency buffers, strategy-matched debt, early inspection, defined exit criteria, documented decisions, and willingness to walk away are the eight practices that separate disciplined investors from optimistic ones.
              </Callout>

              {/* 8. Process */}
              <SectionHeading id="process" title="The full investment process." subtitle="Real estate investing is not a single decision. It is a sequence of decisions. Each stage should narrow uncertainty and strengthen conviction before capital is committed." />
              <div className="grid-2" style={{ gap: "12px" }}>
                {[
                  ["Define the target", "Set strategy, geography, property type, price range, and minimum return threshold before evaluating any deal."],
                  ["Find opportunities", "Maintain multiple active sourcing channels and track leads systematically."],
                  ["First-pass screening", "Apply buy criteria quickly. Reject weak deals fast and move serious candidates to deeper analysis."],
                  ["Deeper underwriting", "Calculate basis, ARV, rehab scope, carrying costs, and exit-side economics with specific numbers."],
                  ["Review the risk profile", "Identify what can go wrong and how it would affect the return. Stress test the key assumptions."],
                  ["Establish decision thresholds", "Define the minimum acceptable profit, ROI, and stress scenario outcome before entering negotiations."],
                  ["Negotiate and structure", "Use the underwriting to set a maximum offer. Structure terms to reduce risk — inspection contingencies, title review, financing conditions."],
                  ["Due diligence", "Verify condition, title, permits, legal status, and financial assumptions independently before closing."],
                  ["Final decision", "Does this deal still meet the criteria established before negotiations began? If yes, proceed. If no, walk away."],
                  ["Execute with discipline", "Manage contractors, timelines, budget, and exit timing against the underwriting assumptions made at acquisition."],
                ].map(([title, desc], i) => (
                  <ProcessCard key={title} num={i + 1} title={title} desc={desc} />
                ))}
              </div>

              {/* 9. Judgment */}
              <SectionHeading id="judgment" title="How to know when a deal is strong and how to know when to walk away." />
              <div className="split-grid" style={{ marginTop: "8px" }}>
                <div className="feature-card">
                  <div className="card-kicker" style={{ color: "var(--green)" }}>Strong Deal</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                    {["Fits the defined strategy clearly", "Purchased at a basis that leaves margin", "ARV supported by multiple recent comparables", "Known and priced risk profile", "Financing matched to the timeline and strategy", "Realistic and defensible timeline", "Return remains attractive under stress scenarios"].map((item) => (
                      <li key={item} className="body-xs" style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                        <span style={{ color: "var(--green)", flexShrink: 0, marginTop: "2px" }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="feature-card" style={{ borderColor: "rgba(244,63,94,0.15)" }}>
                  <div className="card-kicker" style={{ color: "var(--red)" }}>Walk Away</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                    {["Strategy is unclear or forced", "Assumptions require optimism to work", "Scope is uncertain or not independently verified", "Margin is thin with no room for error", "Financing does not match strategy timeline", "Risk factors are present but not priced in", "You are rationalizing instead of concluding"].map((item) => (
                      <li key={item} className="body-xs" style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                        <span style={{ color: "var(--red)", flexShrink: 0, marginTop: "2px" }}>✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 10. Core Terms */}
              <SectionHeading id="terms" title="Core terms every investor should understand." />
              <div className="grid-2">
                <DefList items={[
                  { term: "ARV", desc: "After-Repair Value. The estimated market value of a property after all planned improvements are complete, based on comparable sales." },
                  { term: "Purchase Basis", desc: "The total acquisition cost including purchase price, closing costs, and any fees paid to acquire the asset." },
                  { term: "Total Cost Basis", desc: "Purchase basis plus all improvement costs, carrying costs, and financing costs incurred through to exit." },
                  { term: "NOI", desc: "Net Operating Income. Gross rental income minus all operating expenses, before debt service." },
                  { term: "Cap Rate", desc: "Capitalization Rate. NOI divided by property value. A market valuation metric for income-producing assets." },
                ]} />
                <DefList items={[
                  { term: "Cash-on-Cash Return", desc: "Annual pre-tax cash flow divided by the total cash invested. Measures actual cash yield on deployed capital." },
                  { term: "DSCR", desc: "Debt Service Coverage Ratio. NOI divided by annual debt service. Lenders typically require 1.20x or higher." },
                  { term: "Equity", desc: "The difference between property value and total outstanding debt. Represents the owner's economic interest." },
                  { term: "Spread", desc: "In wholesale, the difference between the contract price and the end buyer's price. The wholesaler's gross margin." },
                  { term: "Contingency", desc: "A budget reserve for unplanned costs — typically 10–15% of total renovation budget on moderate to complex rehabs." },
                ]} />
              </div>

              {/* 11. Long-Term Edge */}
              <SectionHeading id="edge" title="What strong investors build over time." />
              <p className="body-text" style={{ marginBottom: "20px" }}>
                Strong investors build more than a portfolio. They build a repeatable decision system. Over time, the edge becomes less about chasing hidden deals and more about making fewer bad decisions.
              </p>
              <DefList items={[
                { term: "Clear acquisition criteria", desc: "Defined strategy, geography, and return thresholds reduce time spent on deals that were never going to work." },
                { term: "Trusted operating relationships", desc: "Reliable contractors, property managers, agents, and lenders reduce execution variance and create speed advantage." },
                { term: "Faster rejection of weak deals", desc: "Pattern recognition built on completed deals allows fast, accurate first-pass filtering without full analysis." },
                { term: "Better market understanding", desc: "Submarket knowledge — pricing trends, absorption rates, buyer profiles, permit timelines — produces better assumptions." },
                { term: "Clearer documentation", desc: "Documented decisions, underwriting records, and outcome tracking create a feedback loop that improves future judgment." },
              ]} />
              <Callout title="How to use this Academy effectively">
                Use this Academy to build judgment, not just vocabulary. Read the methodology section. Review the formulas behind each strategy. Study how assumptions connect to outcomes. The goal is not to memorize definitions — the goal is to understand the logic well enough to recognize when it is being violated.
              </Callout>

              {/* CTA band */}
              <div className="note-panel" style={{ marginTop: "48px", textAlign: "center" }}>
                <div className="eyebrow" style={{ marginBottom: "12px" }}>Continue Learning</div>
                <h3 className="heading-md" style={{ marginBottom: "16px" }}>
                  Study the strategies, methods, and templates.
                </h3>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/academy/strategies" className="button button-primary">Strategies</Link>
                  <Link href="/academy/formula-stack" className="button button-secondary">Methodology</Link>
                  <Link href="/academy/templates" className="button button-learning">Templates</Link>
                  <Link href="/estimator" className="button button-secondary">Try the Estimator</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
