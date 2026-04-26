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
    title: t("formulaStackMetaTitle"),
    description: t("formulaStackMetaDescription"),
  };
}

function DefList({ items }: { items: { term: string; def: string }[] }) {
  return (
    <div className="def-list-alt">
      {items.map((item, i) => (
        <div key={i} className="def-list-alt-row">
          <div className="def-list-alt-term">
            <span>{item.term}</span>
          </div>
          <div className="def-list-alt-def">
            <span>{item.def}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function StrategySection({ id, kicker, title, intro, formulas, benchmark }: {
  id: string;
  kicker: string;
  title: string;
  intro: string;
  formulas: { term: string; def: string }[];
  benchmark: string;
}) {
  return (
    <div id={id} style={{ paddingTop: "64px", marginBottom: "16px" }}>
      <div className="card-kicker" style={{ marginBottom: "10px" }}>{kicker}</div>
      <h2 className="heading-md" style={{ marginBottom: "12px" }}>
        {title}
      </h2>
      <div style={{ width: "36px", height: "2px", background: "var(--gold)", borderRadius: "2px", marginBottom: "20px" }} />
      <p className="body-text" style={{ marginBottom: "24px" }}>{intro}</p>
      <DefList items={formulas} />
      <div style={{ background: "var(--gold-dim)", border: "1px solid rgba(233,160,21,0.18)", borderRadius: "var(--radius-sm)", padding: "14px 18px" }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Benchmark — </span>
        <span className="body-xs">{benchmark}</span>
      </div>
    </div>
  );
}

export default function FormulaStackPage() {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Hero */}
      <section className="section-hero">
        <div className="container">
          <div className="split-grid">
            <div>
              <div className="eyebrow" style={{ marginBottom: "14px" }}>Academy / Formula Stack</div>
              <h1 className="display" style={{ marginBottom: "20px" }}>
                The formulas behind every analysis.
              </h1>
              <p className="lead" style={{ marginBottom: "28px" }}>
                This is the canonical formula reference for PEO. Every output you see in a deal analysis — MAO, profit, ROI, DSCR, refi proceeds, cash-on-cash — is produced by the formulas on this page. Understanding these is the prerequisite for trusting the numbers.
              </p>
              <div className="education-banner" style={{ marginBottom: "28px" }}>
                <strong style={{ color: "var(--blue)" }}>These are the same formulas the software runs.</strong> The analysis output is not an estimate from a black box — it is direct application of these calculations to your inputs and verified property data.
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <a href="#flip" className="button button-primary">Start with Fix &amp; Flip</a>
                <Link href="/academy/methodology" className="button button-secondary">Full Methodology</Link>
              </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
                <div className="card-kicker" style={{ marginBottom: 0 }}>Strategy coverage</div>
              </div>
              <div className="terminal-grid" style={{ border: "none", borderRadius: 0 }}>
                {[
                  ["Fix & Flip", "MAO, profit, holding costs, ROI"],
                  ["BRRRR", "Equity capture, refi proceeds, cash-on-cash"],
                  ["Rental / Hold", "NOI, cap rate, DSCR, annual cash flow"],
                  ["Wholesale", "Spread, assignment fee, MAO variant"],
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

      {/* Formula sections */}
      <section style={{ padding: "0 0 96px" }}>
        <div className="container-wide">

          <StrategySection
            id="flip"
            kicker="Strategy 01 — Fix & Flip"
            title="Maximum Allowable Offer, profit, and holding cost formulas."
            intro="Fix and flip underwriting centers on the relationship between purchase price, renovation cost, ARV, and total carry. The MAO formula is a constraint — it defines the ceiling offer price that allows the deal to work at minimum acceptable return. Every variable that increases costs moves that ceiling down."
            formulas={[
              { term: "MAO", def: "ARV × (1 − Disposition Rate) − Repairs − Holding Costs − Desired Profit. This is the maximum price you can pay and still hit your target return." },
              { term: "Holding Costs", def: "Purchase Price × Interest Rate × (Hold Months / 12) + (Purchase Price × Points Rate) + (Purchase Price × Closing Rate). Covers financing, points, and closing on the buy side." },
              { term: "Disposition Costs", def: "ARV × Disposition Rate. Covers agent commission, seller closing costs, transfer taxes, and concessions on the sell side. Typically 8–10% of ARV." },
              { term: "Gross Profit", def: "ARV − Purchase Price − Repairs − Holding Costs − Disposition Costs. Total revenue minus all costs before taxes." },
              { term: "ROI", def: "Gross Profit / (Purchase Price + Repairs + Holding Costs) × 100. Return on total capital deployed into the deal." },
              { term: "70% Rule MAO", def: "ARV × 0.70 − Repairs. A simplified screening rule — not used for final underwriting, but useful as a quick first-pass filter." },
            ]}
            benchmark="Minimum 15% ROI on total cost. Gross profit floor of $25,000–$30,000 on entry-level deals. Stress test at 90% ARV and 120% of estimated repairs."
          />

          <StrategySection
            id="brrrr"
            kicker="Strategy 02 — BRRRR"
            title="Equity capture, refinance proceeds, and cash-left-in formulas."
            intro="BRRRR (Buy, Rehab, Rent, Refinance, Repeat) underwriting tracks equity creation through renovation, converts it to proceeds via cash-out refinance, and measures the residual investment after refinancing. The goal is to reduce or eliminate cash left in the deal while retaining the cash-flowing asset."
            formulas={[
              { term: "Equity Capture", def: "Stabilized ARV − (Purchase Price + Repairs + Holding Costs). The value created above all-in cost before refinancing." },
              { term: "Refi Loan Amount", def: "Stabilized ARV × Refi LTV. The loan the lender will issue based on the post-rehab appraised value at the LTV they approve." },
              { term: "Refi Proceeds (Net)", def: "Refi Loan Amount − Original Acquisition Financing Payoff. Cash returned to the investor from the refinance after clearing the construction loan." },
              { term: "Cash Left In", def: "Total Capital Deployed − Refi Proceeds. Remaining investor equity after refinancing. Target is ≤ $0 (full capital recycled)." },
              { term: "Monthly PITI", def: "mortgagePmt(Refi Loan Amount, Refi Rate, Refi Term) + Insurance + Taxes. Monthly carrying cost on the stabilized rental." },
              { term: "Monthly Cash Flow", def: "Gross Rent − Monthly PITI − Operating Expenses. Net income after debt service and operating costs." },
              { term: "Cash-on-Cash Return", def: "Annual Net Cash Flow / Cash Left In × 100. Return on remaining invested capital. Meaningless if cash left in is zero or negative." },
            ]}
            benchmark="Target Refi LTV of 70–75% on stabilized value. Cash left in ≤ 20% of purchase price. Minimum 1.0x DSCR (NOI ≥ debt service). Positive monthly cash flow after all expenses."
          />

          <StrategySection
            id="rental"
            kicker="Strategy 03 — Rental / Buy &amp; Hold"
            title="NOI, cap rate, DSCR, and annual cash flow formulas."
            intro="Rental underwriting measures whether a property generates enough income to cover debt service and operating costs with margin. Lenders use DSCR; investors use cap rate and cash-on-cash. These formulas measure the same cash flows from different reference points."
            formulas={[
              { term: "Gross Operating Income", def: "Annual Rent × (1 − Vacancy Rate). Effective rent income after accounting for vacancy assumption. Typically vacancy of 5–8% on stabilized assets." },
              { term: "Net Operating Income (NOI)", def: "Gross Operating Income − Annual Operating Expenses. Operating Expenses = Gross Operating Income × Operating Expense Rate. Excludes debt service." },
              { term: "Cap Rate", def: "NOI / Purchase Price × 100. Return on asset if purchased in cash. Market cap rates vary by asset class and geography — compare to local benchmarks, not national averages." },
              { term: "Annual Debt Service", def: "Monthly PITI × 12. Total principal, interest, taxes, and insurance paid annually." },
              { term: "DSCR", def: "NOI / Annual Debt Service. Debt Service Coverage Ratio. ≥ 1.25x is standard lender requirement. ≥ 1.0x means the property covers its own debt." },
              { term: "Annual Cash Flow", def: "NOI − Annual Debt Service. Net income after all operating costs and debt service. The actual cash return per year." },
              { term: "Cash-on-Cash Return", def: "Annual Cash Flow / Total Cash Invested × 100. Return on equity deployed including down payment and closing costs." },
            ]}
            benchmark="Minimum 1.25x DSCR for conventional financing. Cap rate at or above local market average. Positive cash flow ≥ $200/month per unit. Operating Expense Rate of 40–50% on single-family; 45–55% on small multifamily."
          />

          <StrategySection
            id="wholesale"
            kicker="Strategy 04 — Wholesale"
            title="Spread, assignment fee, and MAO variant formulas."
            intro="Wholesale underwriting is simpler than the other strategies because the wholesaler does not hold the asset. The profit is the spread between the contract price and the end buyer's price. The constraint is that the contract price must still work for the end buyer — typically at the 70% rule MAO or better."
            formulas={[
              { term: "End Buyer MAO", def: "ARV × 0.70 − Repairs. The price an experienced flip investor would pay. This defines the ceiling contract price the wholesaler can offer and still find a buyer." },
              { term: "Wholesale Contract Price", def: "End Buyer MAO − Desired Assignment Fee. The price the wholesaler contracts to buy at, leaving room for the assignment fee margin." },
              { term: "Wholesale Spread", def: "End Buyer Price − Contract Price − Assignment Fee Transaction Costs. Gross profit on the contract assignment." },
              { term: "Assignment Fee", def: "The fee paid to the wholesaler upon closing. Equal to the difference between the contract price and what the end buyer pays. Typically $5,000–$25,000 on residential deals." },
              { term: "Effective ARV Discount", def: "(ARV − Contract Price) / ARV × 100. The percentage discount from ARV at which the contract was locked. Higher discount = more attractive to end buyers." },
            ]}
            benchmark="Assignment fee ≥ $10,000 to justify the deal risk and time cost. End buyer spread of ≥ 20% of ARV after assignment. Contract price at or below 65% of ARV net of repairs for strong marketability."
          />

          {/* Note panel */}
          <div className="note-panel" style={{ marginTop: "48px" }}>
            <div className="card-kicker" style={{ marginBottom: "10px" }}>Software alignment</div>
            <p className="body-sm" style={{ margin: 0 }}>
              These are the same formulas the PEO platform applies to your inputs and verified property data when running a deal analysis. The investor analysis output — MAO, profit, ROI, DSCR, refi proceeds, cash-on-cash, wholesale spread, scenario projections — is the direct result of applying these calculations to the data acquired from county assessor records, MLS comparables, and your user-supplied assumptions. No proprietary scoring. No black box. The methodology is here.
            </p>
          </div>

          {/* CTA band */}
          <div style={{ marginTop: "48px", textAlign: "center", padding: "48px 32px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
            <div className="eyebrow" style={{ marginBottom: "12px" }}>Continue</div>
            <h3 className="heading-md" style={{ marginBottom: "20px" }}>
              See the full methodology or run your first analysis.
            </h3>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/academy" className="button button-secondary">← Back to Academy</Link>
              <Link href="/academy/methodology" className="button button-secondary">Methodology</Link>
              <Link href="/for-investors" className="button button-primary">For Investors</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
