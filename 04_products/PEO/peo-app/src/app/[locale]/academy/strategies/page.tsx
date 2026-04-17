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
    title: t("strategiesMetaTitle"),
    description: t("strategiesMetaDescription"),
  };
}

const strategies = [
  {
    kicker: "Flip Strategy",
    title: "Acquisition basis, renovation scope, and exit timing are each a separate failure point.",
    content: "Fix-and-flip underwriting tests whether the entry price leaves enough margin to absorb rehab costs, carrying costs, and selling costs while still producing a return worth the execution risk. Overpriced acquisitions, underestimated repairs, and optimistic ARVs are the three most common reasons projected profits fail to materialize.",
    bullets: [
      "Core formula: MAO = ARV − Repairs − Carrying Costs − Selling Costs − Desired Profit",
      "MAO benchmark: at or below 70% of ARV minus repairs to preserve margin against scope creep and market softness",
      "Target metrics: net profit, ROI, and annualized ROI (accounts for hold duration when comparing deals)",
      "Selling costs typically run 7–10% of ARV (agent commissions, title, transfer, closing)",
      "Primary risks: repair scope expansion, timeline slippage, and resale market weakness at exit",
    ],
    href: "/estimator",
    linkLabel: "Analyze a Flip",
    color: "var(--gold)",
  },
  {
    kicker: "BRRRR Strategy",
    title: "The deal must hold up at every stage: acquisition, rehab, stabilization, and refinance.",
    content: "BRRRR (Buy, Rehab, Rent, Refinance, Repeat) is a capital-recycling strategy. It only delivers on its core advantage when the refinance returns enough cash to redeploy into the next deal. If the basis is too high or the appraisal comes in low, capital gets trapped in the asset rather than recycled. A BRRRR that does not recapture capital is essentially a rental with extra steps.",
    bullets: [
      "Core test: equity recapture rate = net refi proceeds ÷ total cash invested (target 80–100%+)",
      "Metrics: total cost basis, equity at stabilization, DSCR post-refi, and cash-on-cash after full debt service",
      "DSCR check: post-refi NOI must support debt payments (lenders typically require 1.20x minimum)",
      "Primary risks: renovation overruns, rent underperformance, and appraisal below projected stabilized value",
    ],
    href: "/estimator",
    linkLabel: "Analyze a BRRRR",
    color: "var(--blue)",
  },
  {
    kicker: "Rental Strategy",
    title: "A good rental earns its return from income quality, not an optimistic rent estimate.",
    content: "Buy-and-hold underwriting is judged by the durability of recurring cash flow, not surface-level yield. Overstated rents, understated vacancy, and thin maintenance budgets are what separate projected returns from actual ones. Strong rental analysis treats every expense line as potentially higher than the initial estimate.",
    bullets: [
      "NOI = Gross Income − Operating Expenses (before debt service)",
      "Quick acquisition screen: GRM = Property Price ÷ Annual Gross Rent (below 10 is often competitive)",
      "Metrics: NOI, cap rate, cash-on-cash return, DSCR, and IRR for long hold-period analysis",
      "Target benchmarks: 8–12% cash-on-cash for stabilized assets; DSCR of 1.25x or higher when financed",
      "Primary risks: vacancy, deferred maintenance, tenant non-performance, and rising insurance costs",
    ],
    href: "/estimator",
    linkLabel: "Analyze a Rental",
    color: "var(--green)",
  },
  {
    kicker: "Wholesale Strategy",
    title: "The contract only has value if the end buyer still has room to make the deal work.",
    content: "Wholesaling converts contract control into a fee. The value is created by locating a motivated seller, locking a price low enough that the end buyer can profit, and delivering an opportunity that still makes economic sense after the assignment fee is added. Inflated ARV estimates, vague repair numbers, and weak contract control destroy the wholesaler's credibility fast and permanently.",
    bullets: [
      "Core formula: Assignment Spread = End Buyer Price − Contract Price − Transaction Friction",
      "End buyer check: their MAO must still be satisfiable after your assignment fee is added to the contract price",
      "Typical assignment fees: $5,000–$25,000 depending on deal size, scope, and local market",
      "Metrics: assignment fee, spread as a percentage of end buyer ARV, and exit velocity",
      "Primary risks: buyer network depth, contract enforceability, and title or condition surprises",
    ],
    href: "/estimator",
    linkLabel: "Analyze a Wholesale Deal",
    color: "var(--teal)",
  },
];

export default function StrategiesPage() {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Hero */}
      <section className="section-hero">
        <div className="container">
          <div style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
              <Link href="/academy" style={{ fontSize: "0.72rem", color: "var(--text-soft)", textDecoration: "none" }}>Academy</Link>
              <span style={{ color: "var(--text-soft)", fontSize: "0.72rem" }}>/</span>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Strategies</span>
              <span style={{ marginLeft: "4px", padding: "2px 8px", borderRadius: "4px", background: "var(--gold-dim)", border: "1px solid rgba(233,160,21,0.2)", fontSize: "0.65rem", color: "var(--gold)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Free</span>
            </div>
            <div className="eyebrow" style={{ marginBottom: "14px" }}>Deal Strategies</div>
            <h1 className="display compact" style={{ marginBottom: "20px" }}>
              Different deals require different analysis.
            </h1>
            <p className="lead">
              Forcing every opportunity through a single framework produces distorted results. Peak Equity Optimizer routes each deal to the metrics and failure points that actually matter for that strategy.
            </p>
          </div>

          <div className="grid-2">
            {strategies.map((s) => (
              <div key={s.kicker} className="feature-card" style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: s.color, marginBottom: "12px" }}>
                  {s.kicker}
                </div>
                <h2 className="heading-sm" style={{ marginBottom: "14px" }}>
                  {s.title}
                </h2>
                <p className="body-sm" style={{ marginBottom: "18px" }}>
                  {s.content}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                  {s.bullets.map((b) => (
                    <li key={b} className="body-xs" style={{ display: "flex", gap: "10px", alignItems: "flex-start", lineHeight: 1.55 }}>
                      <span style={{ color: s.color, flexShrink: 0, marginTop: "3px", fontSize: "0.6rem" }}>▸</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link href={s.href} className="button button-ghost" style={{ padding: "8px 0", fontSize: "0.82rem", color: s.color, borderRadius: 0, borderTop: "1px solid var(--border)", justifyContent: "flex-start" }}>
                  {s.linkLabel} →
                </Link>
              </div>
            ))}
          </div>

          <div className="note-panel" style={{ marginTop: "48px", display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "240px" }}>
              <div className="card-kicker">Next Steps</div>
              <p className="body-text">
                Each strategy requires different metrics and different thresholds. Use the estimator to calculate deal-specific numbers, or return to the Academy for the full educational foundation.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
              <Link href="/academy" className="button button-secondary" style={{ fontSize: "0.82rem", minHeight: "40px", padding: "9px 18px" }}>← Back to Academy</Link>
              <Link href="/estimator" className="button button-primary" style={{ fontSize: "0.82rem", minHeight: "40px", padding: "9px 18px" }}>Try the Estimator</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
