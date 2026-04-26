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
    title: t("methodologyMetaTitle"),
    description: t("methodologyMetaDescription"),
  };
}

function SectionHeading({ id, title, subtitle }: { id: string; title: string; subtitle?: string }) {
  return (
    <div id={id} style={{ paddingTop: "56px", marginBottom: "24px" }}>
      <h2 className="heading-md" style={{ marginBottom: subtitle ? "10px" : 0 }}>
        {title}
      </h2>
      {subtitle && <p className="body-text">{subtitle}</p>}
      <div style={{ width: "36px", height: "2px", background: "var(--gold)", marginTop: "10px", borderRadius: "2px" }} />
    </div>
  );
}

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--gold-dim)", border: "1px solid rgba(233,160,21,0.2)", borderRadius: "var(--radius-sm)", padding: "20px 24px", margin: "24px 0" }}>
      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>{title}</div>
      <div className="body-sm">{children}</div>
    </div>
  );
}

function StepRow({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "var(--gold-dim)", border: "1px solid rgba(233,160,21,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--gold)", flexShrink: 0 }}>
        {String(num).padStart(2, "0")}
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "5px" }}>{title}</div>
        <div className="body-xs">{desc}</div>
      </div>
    </div>
  );
}

const chapters = [
  { id: "overview", label: "Overview" },
  { id: "data-acquisition", label: "Data Acquisition" },
  { id: "verified-arv", label: "VERIFIED ARV" },
  { id: "comp-qualification", label: "Comp Qualification" },
  { id: "confidence-scoring", label: "Confidence Scoring" },
  { id: "triage-gates", label: "Triage Gates" },
  { id: "pass-system", label: "PASS System" },
  { id: "outputs", label: "Analysis Outputs" },
];

export default function MethodologyPage() {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Hero */}
      <section className="section-hero">
        <div className="container">
          <div className="split-grid">
            <div>
              <div className="eyebrow" style={{ marginBottom: "14px" }}>Academy — Methodology</div>
              <h1 className="display" style={{ marginBottom: "20px" }}>
                How every number is produced.
              </h1>
              <p className="lead" style={{ marginBottom: "32px" }}>
                PEO does not use estimates or black-box scoring. Every output — VERIFIED ARV, confidence tier, MAO, profit, risk band — is the direct result of a documented, traceable analytical process applied to verified data. This page explains that process in full.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <a href="#overview" className="button button-primary">Read the Methodology</a>
                <Link href="/academy/formula-stack" className="button button-secondary">Formula Stack</Link>
              </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
                <div className="card-kicker" style={{ marginBottom: 0 }}>Chapters</div>
              </div>
              <nav style={{ padding: "8px 0" }}>
                {chapters.map((ch) => (
                  <a
                    key={ch.id}
                    href={`#${ch.id}`}
                    style={{ display: "block", padding: "8px 18px", fontSize: "0.83rem", color: "var(--text-muted)", textDecoration: "none", lineHeight: 1.4 }}
                  >
                    {ch.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .method-chapter-nav a:hover { color: var(--gold) !important; background: var(--gold-dim) !important; }
      `}</style>

      <section style={{ padding: "0 0 96px" }}>
        <div className="container-wide">

          {/* 1. Overview */}
          <SectionHeading id="overview" title="The analytical framework." subtitle="PEO applies a layered, multi-gate process to every analysis. Each layer adds information or flags uncertainty — no output is produced without passing the gates designed to catch bad data, insufficient comps, and model failures." />
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {[
              ["1. Data acquisition", "Retrieve property facts and comparable market data from live sources. Flag estimated or unavailable fields."],
              ["2. Comp qualification", "Filter sold comparables against geography, recency, property type, and GLA similarity criteria."],
              ["3. Valuation", "Compute VERIFIED ARV from qualified sold comps. Compute MARKET ARV from active listings for reference only."],
              ["4. Confidence scoring", "Score the analysis across four dimensions: data quality, comp coverage, valuation consistency, and model completeness."],
              ["5. Triage gate evaluation", "Evaluate each confidence dimension against thresholds. Flag deals that fall below standards."],
              ["6. PASS evaluation", "Check absolute deal viability: address, profit floor, ROI, and stress resilience. Block analyses that cannot proceed."],
              ["7. Output generation", "Produce investor metrics, risk band, recommendation, and disclosure based on confidence tier."],
            ].map(([title, desc], i) => (
              <StepRow key={title} num={i + 1} title={title} desc={desc} />
            ))}
          </div>

          {/* 2. Data Acquisition */}
          <SectionHeading id="data-acquisition" title="Data acquisition." subtitle="PEO pulls property facts and market data at the time of analysis — not from cached or pre-loaded datasets." />
          <div className="terminal-grid" style={{ marginBottom: "24px" }}>
            {[
              ["Property facts", "County assessor records via Rentcast. Returns bedrooms, bathrooms, square footage, lot size, year built, property type, last sale date, and last sale price."],
              ["Sold comparables", "AVM endpoint returning recent sold transactions within a defined radius. Includes sale price, sale date, GLA, bed/bath, and distance from subject."],
              ["Active listings", "MLS-recorded active listings within a comparable radius. Used for MARKET ARV reference only — never used as an underwriting input."],
              ["Estimated fields", "Any field that cannot be retrieved from primary sources is marked as estimated. Estimated field count directly affects confidence scoring."],
            ].map(([label, value]) => (
              <div key={label} className="terminal-row">
                <span className="label">{label}</span>
                <span className="value">{value}</span>
              </div>
            ))}
          </div>
          <Callout title="Data freshness">
            All Rentcast calls use <code style={{ fontFamily: "var(--mono)", fontSize: "0.82rem", color: "var(--gold)" }}>cache: no-store</code> — data is retrieved fresh at the time of every analysis. There is no pre-cached dataset being served. Response times reflect live API calls.
          </Callout>

          {/* 3. VERIFIED ARV */}
          <SectionHeading id="verified-arv" title="VERIFIED ARV vs. MARKET ARV." />
          <div className="grid-2" style={{ marginBottom: "24px" }}>
            <div className="card">
              <div className="card-kicker" style={{ color: "var(--gold)", marginBottom: "10px" }}>VERIFIED ARV</div>
              <p className="body-sm">
                The median sale price of qualified sold comparables. Based entirely on closed transactions — properties that have actually sold at arm&apos;s length. This is the primary underwriting input.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                {["Median of qualified sold comp prices", "Weighted toward recent, close, similar comps", "Primary input for MAO and profit calculations", "Used in stress scenario modeling"].map(item => (
                  <li key={item} className="body-xs" style={{ display: "flex", gap: "8px" }}>
                    <span style={{ color: "var(--gold)", flexShrink: 0 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <div className="card-kicker" style={{ color: "var(--text-soft)", marginBottom: "10px" }}>MARKET ARV</div>
              <p className="body-sm">
                The median active listing price in a comparable radius. Represents asking prices, not closed transactions. Shown for market context only.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                {["Median of active listing prices", "Reference only — not used in calculations", "Never substituted for VERIFIED ARV", "Disclosed as a reference metric on all reports"].map(item => (
                  <li key={item} className="body-xs" style={{ display: "flex", gap: "8px" }}>
                    <span style={{ color: "var(--text-soft)", flexShrink: 0 }}>→</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Comp Qualification */}
          <SectionHeading id="comp-qualification" title="Comp qualification criteria." subtitle="Not every sold transaction qualifies as a comparable. PEO scores each comp against five dimensions and uses the resulting quality score in both confidence scoring and comp weighting." />
          <div className="terminal-grid" style={{ marginBottom: "24px" }}>
            {[
              ["Geography (30%)", "Distance from subject. Full score ≤ 0.3 miles. Partial credit ≤ 0.5 mi and ≤ 1.0 mi. Reduced credit beyond 1 mile."],
              ["Recency (25%)", "Months since sale date. Full score ≤ 6 months. Partial credit ≤ 12 months and ≤ 24 months. Zero credit beyond 24 months."],
              ["GLA similarity (20%)", "Gross living area match. Full score if within 10% of subject. Partial credit within 20%. Reduced beyond 20%."],
              ["Physical match (15%)", "Bedroom and bathroom match against subject property facts. Partial credit on mismatches."],
              ["Condition (10%)", "Condition grade match. Neutral score applied when condition data is unavailable — no false precision."],
            ].map(([label, value]) => (
              <div key={label} className="terminal-row">
                <span className="label">{label}</span>
                <span className="value">{value}</span>
              </div>
            ))}
          </div>
          <p className="body-sm">
            A comp quality score of 100 represents a sold transaction that is geographically close, recently closed, physically similar, and condition-matched. The average comp quality score across all qualified comps is reported as the analysis&apos;s comp quality score and contributes to confidence tier determination.
          </p>

          {/* 5. Confidence Scoring */}
          <SectionHeading id="confidence-scoring" title="Confidence scoring." subtitle="Confidence is computed across four independent dimensions, then summed to produce an overall score. The score maps to a tier that controls recommendation language and disclosure requirements." />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
            {[
              { dim: "Data confidence", max: 25, desc: "Evaluates primary source availability, conflict absence, data age, secondary source presence, and estimated field count." },
              { dim: "Comp confidence", max: 25, desc: "Evaluates qualified comp count, subdivision comp coverage, geographic radius, comp quality score, and time adjustment need." },
              { dim: "Valuation confidence", max: 20, desc: "Evaluates ARV value range spread, strong comp support presence, recent market activity, and limited-activity conditions." },
              { dim: "Model confidence", max: 22, desc: "Evaluates formula execution completeness, default trigger count, override events, and key assumption confirmation." },
            ].map(({ dim, max, desc }) => (
              <div key={dim} style={{ padding: "16px 20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)" }}>{dim}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--gold)" }}>max {max} pts</div>
                </div>
                <div className="body-xs">{desc}</div>
              </div>
            ))}
          </div>
          <div className="terminal-grid">
            {[
              ["HIGH", "≥ 80 points", "All gates clear, strong comp support, fresh data, full model execution."],
              ["MEDIUM", "60–79 points", "Minor gaps in comp coverage or data recency. Conditional proceed."],
              ["LOW", "40–59 points", "Material data or comp gaps. Triggers flagged. Standard review required."],
              ["VERY_LOW", "< 40 points", "Serious data or valuation problems. Reject or escalate to priority review."],
            ].map(([tier, range, desc]) => (
              <div key={tier} className="terminal-row">
                <span className="label" style={{ fontFamily: "var(--mono)", fontSize: "0.8rem" }}>{tier} — {range}</span>
                <span className="value" style={{ fontSize: "0.8rem" }}>{desc}</span>
              </div>
            ))}
          </div>

          {/* 6. Triage Gates */}
          <SectionHeading id="triage-gates" title="Triage gate evaluation." subtitle="Each dimension produces triggers when it falls below threshold. Triggers appear on the analysis output as review flags — they do not block the analysis but they accompany the recommendation." />
          <div className="trigger-list">
            {[
              ["Data Quality Review", "Data confidence score < 15. Primary source unavailable or material conflicts unresolved."],
              ["Geographic Review", "Comp radius > 1.0 miles. Comparables extend beyond a defensible geographic boundary."],
              ["Methodology Review", "Time adjustment required. Market shift since comp sale dates affects direct price comparability."],
              ["Comp Expansion Review", "Fewer than 3 qualified comps. Insufficient comp count to support a statistically defensible median."],
              ["Valuation Sensitivity Review", "ARV value range spread > 25%. Wide comp spread indicates valuation uncertainty."],
              ["Model Override Review", "Override events present or more than 2 defaults triggered. Flags non-standard model execution."],
              ["Standard Review", "Overall score 40–59. Multiple dimension gaps present."],
              ["Priority Review", "Overall score < 40. Serious analytical concern requiring escalation."],
            ].map(([trigger, desc]) => (
              <div key={trigger} className="trigger-row">
                <div className="trigger-title">⚠ {trigger}</div>
                <div className="trigger-desc">{desc}</div>
              </div>
            ))}
          </div>

          {/* 7. PASS System */}
          <SectionHeading id="pass-system" title="The PASS system." subtitle="PASS triggers are absolute deal viability checks. Any PASS trigger blocks the analysis — the deal cannot proceed regardless of confidence tier. PASS is evaluated after triage scoring." />
          <Callout title="Why PASS exists separately from confidence scoring">
            Confidence scoring measures analytical quality — how well-supported the data and valuation are. PASS measures deal viability — whether the deal works at all. A high-confidence analysis of a bad deal should still be blocked. These are separate concerns.
          </Callout>
          <div className="terminal-grid" style={{ marginBottom: "24px" }}>
            {[
              ["Address geocodable", "The subject property address must resolve to a geocodable location. Unresolvable addresses block analysis."],
              ["Property type reconcilable", "Property type must be compatible with the selected strategy. Mixed-use commercial does not reconcile with residential flip underwriting."],
              ["Profit floor", "Expected base-case profit must be ≥ $10,000. Deals below this threshold are not viable under any reasonable scenario."],
              ["ROI floor", "Base-case ROI must be ≥ 5%. Returns below this level do not compensate for execution risk."],
              ["Stress viability", "Stress-case profit (ARV −5%, repairs +15%) must be ≥ $0. A deal that loses money under light stress is not viable."],
              ["Zero comps", "If no qualified comps survive after full comp cascade, VERIFIED ARV cannot be established and analysis cannot proceed."],
            ].map(([label, value]) => (
              <div key={label} className="terminal-row">
                <span className="label">{label}</span>
                <span className="value">{value}</span>
              </div>
            ))}
          </div>

          {/* 8. Outputs */}
          <SectionHeading id="outputs" title="Analysis outputs and their derivation." />
          <div className="terminal-grid" style={{ marginBottom: "32px" }}>
            {[
              ["VERIFIED ARV", "Median of qualified sold comp sale prices."],
              ["MARKET ARV", "Median of active listing prices. Reference only."],
              ["MAO", "Min(Canonical MAO, 70% Rule MAO). Canonical = ARV − Repairs − Total Costs − Required Profit."],
              ["70% Rule MAO", "ARV × 0.70 − Repairs. Traditional wholesaler benchmark."],
              ["Profit", "ARV − Purchase Price − Repairs − Total Costs."],
              ["ROI", "(Profit ÷ Purchase Price) × 100."],
              ["Stress Profit", "ARV × 0.95 − Purchase Price − Repairs × 1.15 − Total Costs."],
              ["Risk Band", "LOW / ELEVATED / MODERATE / HIGH based on profit, ROI, and confidence tier."],
              ["Confidence Score", "Sum of data, comp, valuation, and model confidence scores."],
              ["Confidence Tier", "HIGH / MEDIUM / LOW / VERY_LOW mapped from confidence score."],
              ["Recommendation", "Proceed / Proceed with conditions / Reject or escalate — derived from tier and trigger count."],
            ].map(([label, value]) => (
              <div key={label} className="terminal-row">
                <span className="label">{label}</span>
                <span className="value">{value}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="note-panel" style={{ textAlign: "center" }}>
            <div className="eyebrow" style={{ marginBottom: "12px" }}>Go Deeper</div>
            <h3 className="heading-md" style={{ marginBottom: "16px" }}>
              See the formulas, run an analysis, or review the Trust Center.
            </h3>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/academy/formula-stack" className="button button-primary">Formula Stack</Link>
              <Link href="/investor/analyze" className="button button-secondary">Run Analysis</Link>
              <Link href="/trust" className="button button-secondary">Trust Center</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
