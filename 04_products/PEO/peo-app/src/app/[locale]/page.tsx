import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div style={{ position: "relative", zIndex: 1 }}>

      {/* ── Section 1: Hero ────────────────────────────────────────────────── */}
      <section className="section-hero">
        <div className="container">
          <div className="split-grid" style={{ gap: "64px", alignItems: "center" }}>
            {/* Left: copy */}
            <div>
              <div className="eyebrow" style={{ marginBottom: "16px" }}>
                {t("heroEyebrow")}
              </div>
              <h1 className="display" style={{ marginBottom: "24px" }}>
                {t("heroTitleLine1")}{" "}
                <span style={{ color: "var(--gold)" }}>{t("heroTitleLine2")}</span>
              </h1>
              <p className="lead" style={{ marginBottom: "12px" }}>
                {t("heroSubtitle")}
              </p>
              <p className="body-sm" style={{ marginBottom: "36px", maxWidth: "54ch" }}>
                {t("heroProblemLine")}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <Link href="/estimator" className="button button-primary">
                  {t("ctaEstimator")}
                </Link>
                <Link href="/how-it-works" className="button button-secondary">
                  {t("ctaHowItWorks")}
                </Link>
              </div>
            </div>

            {/* Right: terminal panel */}
            <div className="card" style={{ padding: "0", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "block" }} />
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "block" }} />
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--gold-dim)", display: "block" }} />
                </div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-soft)", fontFamily: "var(--mono)", marginLeft: "4px" }}>
                  deal.analysis
                </span>
              </div>
              <div
                className="terminal-grid"
                role="table"
                aria-label={t("terminalAriaLabel")}
                style={{ border: "none", borderRadius: 0 }}
              >
                <div className="terminal-row" role="row">
                  <span className="label" role="cell">Platform</span>
                  <span className="value" role="cell">Peak Equity Optimizer</span>
                </div>
                <div className="terminal-row" role="row">
                  <span className="label" role="cell">Seller path</span>
                  <span className="value" role="cell">Net proceeds, pricing range, timeline risk</span>
                </div>
                <div className="terminal-row" role="row">
                  <span className="label" role="cell">Investor path</span>
                  <span className="value" role="cell">MAO, ARV, stress scenarios, deal score</span>
                </div>
                <div className="terminal-row" role="row">
                  <span className="label" role="cell">Strategies</span>
                  <span className="value" role="cell">Flip · BRRRR · Rental · Wholesale</span>
                </div>
                <div className="terminal-row" role="row">
                  <span className="label" role="cell">Academy</span>
                  <span className="value" role="cell" style={{ color: "var(--green)" }}>Free — open access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Credibility Bar ─────────────────────────────────────── */}
      <section className="credibility-bar">
        <div className="container">
          <div className="cred-badge-row">
            {([1, 2, 3, 4] as const).map((n) => (
              <div key={n} className="cred-badge">
                <span className="cred-badge-value">{t(`credBadge${n}Value` as "credBadge1Value")}</span>
                <span className="cred-badge-label">{t(`credBadge${n}Label` as "credBadge1Label")}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Problem / Solution ──────────────────────────────────── */}
      <section className="section-padded">
        <div className="container">
          <div className="section-opener">
            <div className="eyebrow" style={{ marginBottom: "12px" }}>{t("problemSolutionEyebrow")}</div>
            <h2 className="heading-lg" style={{ maxWidth: "52ch", margin: "0 auto 16px" }}>
              {t("problemTitle")}
            </h2>
            <p className="body-text" style={{ maxWidth: "62ch", margin: "0 auto" }}>
              {t("problemBody")}
            </p>
          </div>
          <div className="grid-2" style={{ gap: "24px", marginBottom: "32px" }}>
            <div className="feature-card" style={{ borderLeft: "3px solid var(--red-dim)" }}>
              <div className="card-kicker" style={{ color: "var(--red)" }}>{t("problemEyebrow")}</div>
              <h3 className="heading-sm" style={{ marginBottom: "12px" }}>
                {t("problemTitle")}
              </h3>
              <p className="body-sm" style={{ margin: 0 }}>
                {t("problemBody")}
              </p>
            </div>
            <div className="feature-card" style={{ borderLeft: "3px solid var(--green-dim)" }}>
              <div className="card-kicker" style={{ color: "var(--green)" }}>{t("solutionEyebrow")}</div>
              <h3 className="heading-sm" style={{ marginBottom: "12px" }}>
                {t("solutionTitle")}
              </h3>
              <p className="body-sm" style={{ margin: 0 }}>
                {t("solutionBody")}
              </p>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <Link href="/estimator" className="button button-primary">{t("ctaEstimator")}</Link>
          </div>
        </div>
      </section>

      {/* ── Section 4: How It Works ────────────────────────────────────────── */}
      <section className="section-padded">
        <div className="container">
          <div className="section-opener">
            <div className="eyebrow" style={{ marginBottom: "12px" }}>{t("processEyebrow")}</div>
            <h2 className="heading-lg">{t("howItWorksTitle")}</h2>
          </div>
          <div className="process-sequence">
            {([1, 2, 3] as const).map((step, idx) => (
              <Fragment key={step}>
                <div className="process-step-node">
                  <div className="process-step-badge">0{step}</div>
                  <h3 className="process-step-title">{t(`step${step}Title` as "step1Title")}</h3>
                  <p className="process-step-desc">{t(`step${step}Desc` as "step1Desc")}</p>
                </div>
                {idx < 2 && <div key={`conn-${step}`} className="process-connector" aria-hidden="true" />}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Role Cards (4 paths) ───────────────────────────────── */}
      <section className="section-padded">
        <div className="container">
          <div className="section-opener">
            <div className="eyebrow" style={{ marginBottom: "12px" }}>{t("pathsEyebrow")}</div>
            <h2 className="heading-lg">{t("pathsHeading")}</h2>
          </div>
          <div className="grid-4">
            {/* Seller */}
            <div className="feature-card">
              <div className="card-kicker">{t("roleSellerKicker")}</div>
              <h3 className="heading-sm" style={{ marginBottom: "12px" }}>
                {t("roleSellerTitle")}
              </h3>
              <p className="body-sm" style={{ marginBottom: "20px" }}>
                {t("roleSellerDesc")}
              </p>
              <Link href="/for-sellers" className="button button-secondary" style={{ fontSize: "0.82rem", minHeight: "40px", padding: "9px 18px" }}>
                {t("roleSellerCta")}
              </Link>
            </div>

            {/* Investor Basic — featured */}
            <div className="feature-card" style={{ borderColor: "rgba(233,160,21,0.35)", position: "relative" }}>
              <div className="card-featured-badge">{t("roleFeaturedBadge")}</div>
              <div className="card-kicker">{t("roleInvestorKicker")}</div>
              <h3 className="heading-sm" style={{ marginBottom: "12px" }}>
                {t("roleInvestorTitle")}
              </h3>
              <p className="body-sm" style={{ marginBottom: "20px" }}>
                {t("roleInvestorDesc")}
              </p>
              <Link href="/for-investors" className="button button-primary" style={{ fontSize: "0.82rem", minHeight: "40px", padding: "9px 18px" }}>
                {t("roleInvestorCta")}
              </Link>
            </div>

            {/* Investor Advanced */}
            <div className="feature-card">
              <div className="card-kicker">{t("roleInvestorAdvancedKicker")}</div>
              <h3 className="heading-sm" style={{ marginBottom: "12px" }}>
                {t("roleInvestorAdvancedTitle")}
              </h3>
              <p className="body-sm" style={{ marginBottom: "20px" }}>
                {t("roleInvestorAdvancedDesc")}
              </p>
              <Link href="/for-investors" className="button button-secondary" style={{ fontSize: "0.82rem", minHeight: "40px", padding: "9px 18px" }}>
                {t("roleInvestorAdvancedCta")}
              </Link>
            </div>

            {/* Vendor / Marketplace */}
            <div className="feature-card">
              <div className="card-kicker">{t("roleVendorKicker")}</div>
              <h3 className="heading-sm" style={{ marginBottom: "12px" }}>
                {t("roleVendorTitle")}
              </h3>
              <p className="body-sm" style={{ marginBottom: "20px" }}>
                {t("roleVendorDesc")}
              </p>
              <Link href="/pricing" className="button button-secondary" style={{ fontSize: "0.82rem", minHeight: "40px", padding: "9px 18px" }}>
                {t("roleVendorCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 6: Trust & Methodology Teaser ─────────────────────────── */}
      <section className="section-padded">
        <div className="container">
          <div className="section-opener">
            <div className="eyebrow" style={{ marginBottom: "12px" }}>{t("trustTeaserEyebrow")}</div>
            <h2 className="heading-lg" style={{ marginBottom: "16px" }}>
              {t("trustTeaserHeading")}
            </h2>
            <p className="body-text" style={{ maxWidth: "60ch", margin: "0 auto" }}>
              {t("trustTeaserDesc")}
            </p>
          </div>
          <div className="grid-3" style={{ marginBottom: "32px" }}>
            {([1, 2, 3] as const).map((n) => (
              <div key={n} className="note-panel">
                <div className="card-kicker">{t(`trustCard${n}Title` as "trustCard1Title")}</div>
                <p className="body-sm" style={{ margin: 0 }}>
                  {t(`trustCard${n}Body` as "trustCard1Body")}
                </p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <Link href="/trust" className="button button-secondary">{t("trustTeaserCta")}</Link>
          </div>
        </div>
      </section>

      {/* ── Section 7: Product Preview / Dashboard Band ────────────────────── */}
      <section className="dashboard-band">
        <div className="container">
          <div className="section-opener">
            <div className="eyebrow" style={{ marginBottom: "12px" }}>{t("dashboardEyebrow")}</div>
            <h2 className="heading-lg" style={{ marginBottom: "12px" }}>
              {t("dashboardHeading")}
            </h2>
            <p className="body-text" style={{ maxWidth: "58ch", margin: "0 auto" }}>
              {t("dashboardDesc")}
            </p>
          </div>
          <div className="grid-2" style={{ gap: "24px", marginBottom: "32px" }}>
            {/* Seller Net Sheet Panel */}
            <div className="card" style={{ padding: "0", overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface-strong)" }}>
                <span className="card-kicker" style={{ margin: 0 }}>{t("dashboardSellerPanelLabel")}</span>
              </div>
              <div style={{ padding: "20px" }}>
                <div className="stat-card" style={{ marginBottom: "14px" }}>
                  <div className="stat-label">Estimated Net Proceeds</div>
                  <div className="stat-value" style={{ color: "var(--green)" }}>$284,400</div>
                </div>
                <div className="terminal-grid" style={{ borderRadius: "var(--radius-sm)" }}>
                  <div className="terminal-row"><span className="label">Sale Price</span><span className="value">$340,000</span></div>
                  <div className="terminal-row"><span className="label">Agent (6%)</span><span className="value" style={{ color: "var(--red)" }}>−$20,400</span></div>
                  <div className="terminal-row"><span className="label">Closing (2%)</span><span className="value" style={{ color: "var(--red)" }}>−$6,800</span></div>
                  <div className="terminal-row"><span className="label">Mortgage Payoff</span><span className="value" style={{ color: "var(--red)" }}>−$28,400</span></div>
                  <div className="terminal-row"><span className="label">Net Proceeds</span><span className="value" style={{ color: "var(--green)" }}>$284,400</span></div>
                </div>
              </div>
            </div>

            {/* Investor ARV Panel */}
            <div className="card" style={{ padding: "0", overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface-strong)" }}>
                <span className="card-kicker" style={{ margin: 0 }}>{t("dashboardInvestorPanelLabel")}</span>
              </div>
              <div style={{ padding: "20px" }}>
                <div className="grid-2" style={{ gap: "12px", marginBottom: "14px" }}>
                  <div className="score-card is-pass">
                    <div className="stat-label">Verified ARV</div>
                    <div className="stat-value">$325,000</div>
                  </div>
                  <div className="score-card is-pass">
                    <div className="stat-label">MAO</div>
                    <div className="stat-value">$211,250</div>
                  </div>
                </div>
                <div className="terminal-grid" style={{ borderRadius: "var(--radius-sm)" }}>
                  <div className="terminal-row"><span className="label">Strategy</span><span className="value">Flip</span></div>
                  <div className="terminal-row"><span className="label">Est. Profit</span><span className="value" style={{ color: "var(--green)" }}>$38,750</span></div>
                  <div className="terminal-row"><span className="label">ROI</span><span className="value">18.3%</span></div>
                  <div className="terminal-row"><span className="label">Confidence</span><span className="value" style={{ color: "var(--green)" }}>HIGH</span></div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <Link href="/estimator" className="button button-primary">{t("dashboardCta")}</Link>
          </div>
        </div>
      </section>

      {/* ── Section 8: Seller / Investor Split ────────────────────────────── */}
      <section className="section-padded">
        <div className="container">
          <div className="eyebrow" style={{ textAlign: "center", marginBottom: "48px" }}>{t("splitEyebrow")}</div>
          <div className="split-section">
            {/* Seller column */}
            <div>
              <div className="card-kicker" style={{ color: "var(--text-muted)", marginBottom: "16px" }}>Sellers</div>
              <h2 className="heading-md" style={{ marginBottom: "24px" }}>
                {t("splitSellerHeading")}
              </h2>
              <ul className="body-text" style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" }}>
                {[t("splitSellerPoint1"), t("splitSellerPoint2"), t("splitSellerPoint3")].map((pt) => (
                  <li key={pt} style={{ display: "flex", gap: "10px", lineHeight: 1.6 }}>
                    <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: "2px" }}>→</span>{pt}
                  </li>
                ))}
              </ul>
              <Link href="/for-sellers" className="button button-secondary" style={{ fontSize: "0.82rem" }}>
                {t("splitSellerCta")}
              </Link>
            </div>

            {/* Investor column */}
            <div>
              <div className="card-kicker" style={{ color: "var(--gold)", marginBottom: "16px" }}>Investors</div>
              <h2 className="heading-md" style={{ marginBottom: "24px" }}>
                {t("splitInvestorHeading")}
              </h2>
              <ul className="body-text" style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" }}>
                {[t("splitInvestorPoint1"), t("splitInvestorPoint2"), t("splitInvestorPoint3")].map((pt) => (
                  <li key={pt} style={{ display: "flex", gap: "10px", lineHeight: 1.6 }}>
                    <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: "2px" }}>→</span>{pt}
                  </li>
                ))}
              </ul>
              <Link href="/for-investors" className="button button-primary" style={{ fontSize: "0.82rem" }}>
                {t("splitInvestorCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 9: Marketplace / Vendor Trust ─────────────────────────── */}
      <section className="section-padded">
        <div className="container">
          <div className="section-opener">
            <div className="eyebrow" style={{ marginBottom: "12px" }}>{t("vendorEyebrow")}</div>
            <h2 className="heading-lg" style={{ marginBottom: "12px" }}>
              {t("vendorHeading")}
            </h2>
            <p className="body-text" style={{ maxWidth: "58ch", margin: "0 auto" }}>
              {t("vendorDesc")}
            </p>
          </div>
          <div className="grid-3" style={{ marginBottom: "32px" }}>
            {([1, 2, 3] as const).map((n) => (
              <div key={n} className="vendor-card">
                <div className="card-kicker">{t(`vendor${n}Title` as "vendor1Title")}</div>
                <p className="body-sm" style={{ margin: 0 }}>
                  {t(`vendor${n}Body` as "vendor1Body")}
                </p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <Link href="/pricing" className="button button-secondary">{t("vendorCta")}</Link>
          </div>
        </div>
      </section>

      {/* ── Section 10: FAQ Teaser ─────────────────────────────────────────── */}
      <section className="section-padded">
        <div className="container-medium">
          <div className="section-opener">
            <div className="eyebrow" style={{ marginBottom: "12px" }}>{t("faqTeaserEyebrow")}</div>
            <h2 className="heading-lg">{t("faqTeaserHeading")}</h2>
          </div>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: 0, padding: "0 24px" }}>
            {([
              { q: t("faqTeaser1Q"), a: t("faqTeaser1A") },
              { q: t("faqTeaser2Q"), a: t("faqTeaser2A") },
              { q: t("faqTeaser3Q"), a: t("faqTeaser3A") },
              { q: t("faqTeaser4Q"), a: t("faqTeaser4A") },
            ] as const).map((item, idx, arr) => (
              <details
                key={idx}
                className="faq-item"
                style={{ borderBottom: idx < arr.length - 1 ? "1px solid var(--border)" : "none" }}
              >
                <summary className="faq-summary">{item.q}</summary>
                <p className="faq-answer">{item.a}</p>
              </details>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "24px", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            <Link href="/pricing" className="button button-primary" style={{ fontSize: "0.82rem" }}>{t("ctaEstimator")}</Link>
            <Link href="/faq" className="button button-secondary" style={{ fontSize: "0.82rem" }}>{t("faqTeaserCta")}</Link>
          </div>
        </div>
      </section>

      {/* ── Academy Teaser ─────────────────────────────────────────────────── */}
      <section style={{ padding: "0 0 96px" }}>
        <div className="container">
          <div className="card" style={{ padding: "36px 40px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
            <div style={{ flex: "1 1 320px" }}>
              <div className="eyebrow" style={{ marginBottom: "10px" }}>{t("academyEyebrow")}</div>
              <h2 className="heading-md" style={{ marginBottom: "10px" }}>
                {t("academyTeaserTitle")}
              </h2>
              <p className="body-sm" style={{ margin: 0 }}>
                {t("academyTeaserDesc")}
              </p>
            </div>
            <Link href="/academy" className="button button-secondary" style={{ flexShrink: 0 }}>
              {t("academyTeaserCta")}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
