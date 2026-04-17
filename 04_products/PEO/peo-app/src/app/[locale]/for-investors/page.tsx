import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "investors" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
  };
}

export default async function ForInvestorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "investors" });

  const tiers = [
    {
      badge: t("tierFreeBadge"),
      title: t("tierFreeName"),
      price: t("tierFreePrice"),
      sub: t("tierFreeSub"),
      featured: false,
      features: [t("tierFreeFeature1"), t("tierFreeFeature2"), t("tierFreeFeature3")],
      cta: t("tierFreeCta"),
      href: "/estimator",
      btnClass: "button-secondary",
    },
    {
      badge: t("tierBasicBadge"),
      title: t("tierBasicName"),
      price: t("tierBasicPrice"),
      sub: t("tierBasicSub"),
      featured: true,
      features: [t("tierBasicFeature1"), t("tierBasicFeature2"), t("tierBasicFeature3")],
      cta: t("tierBasicCta"),
      href: "/investor",
      btnClass: "button-primary",
    },
    {
      badge: t("tierAdvancedBadge"),
      title: t("tierAdvancedName"),
      price: t("tierAdvancedPrice"),
      sub: t("tierAdvancedSub"),
      featured: false,
      features: [t("tierAdvancedFeature1"), t("tierAdvancedFeature2"), t("tierAdvancedFeature3")],
      cta: t("tierAdvancedCta"),
      href: "/investor",
      btnClass: "button-secondary",
    },
  ];

  const platformPanels = Array.from({ length: 4 }, (_, i) => ({
    title: t(`platformPanel${i + 1}Title` as "platformPanel1Title"),
    desc: t(`platformPanel${i + 1}Desc` as "platformPanel1Desc"),
  }));

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Hero */}
      <section className="section-hero">
        <div className="container">
          <div className="split-grid">
            <div>
              <div className="eyebrow" style={{ marginBottom: "14px" }}>{t("heroEyebrow")}</div>
              <h1 className="display" style={{ marginBottom: "20px" }}>
                {t("heroTitle")}
              </h1>
              <p className="lead" style={{ marginBottom: "12px" }}>
                {t("heroLead")}
              </p>
              <div className="education-banner" style={{ marginBottom: "28px" }}>
                <strong style={{ color: "var(--blue)" }}>{t("heroBannerStrong")}</strong> {t("heroBannerText")} <Link href="/academy" style={{ color: "var(--blue)" }}>{t("heroBannerLink")}</Link> {t("heroBannerRest")}
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/estimator" className="button button-primary">{t("heroCtaPrimary")}</Link>
                <Link href="/pricing" className="button button-secondary">{t("heroCtaSecondary")}</Link>
              </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
                <div className="card-kicker" style={{ marginBottom: 0 }}>{t("panelKicker")}</div>
              </div>
              <div className="terminal-grid" style={{ border: "none", borderRadius: 0 }}>
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="terminal-row">
                    <span className="label">{t(`panelRow${i + 1}Label` as "panelRow1Label")}</span>
                    <span className="value">{t(`panelRow${i + 1}Value` as "panelRow1Value")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padded">
        <div className="container">
          <div className="section-opener">
            <div className="eyebrow" style={{ marginBottom: "12px" }}>{t("tiersEyebrow")}</div>
            <h2 className="heading-lg" style={{ marginBottom: "12px" }}>
              {t("tiersTitle")}
            </h2>
            <p className="body-text" style={{ maxWidth: "52ch", margin: "0 auto" }}>
              {t("tiersSubtitle")}
            </p>
          </div>

          <div className="grid-3">
            {tiers.map((tier) => (
              <div
                key={tier.title}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderColor: tier.featured ? "rgba(233,160,21,0.3)" : undefined,
                  boxShadow: tier.featured ? "0 0 40px var(--gold-glow), var(--shadow-card)" : undefined,
                  position: "relative",
                }}
              >
                {tier.featured && (
                  <div className="featured-badge">
                    {tier.badge}
                  </div>
                )}
                {!tier.featured && (
                  <div className="tier-badge">
                    {tier.badge}
                  </div>
                )}
                <div style={{ marginBottom: "4px" }}>
                  <span style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "2rem", color: "var(--text)" }}>{tier.price}</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginLeft: "6px" }}>{tier.sub}</span>
                </div>
                <div className="heading-sm" style={{ marginBottom: "20px" }}>{tier.title}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                  {tier.features.map((f) => (
                    <li key={f} className="body-xs" style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                      <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: "3px", fontSize: "0.6rem" }}>▸</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={tier.href} className={`button ${tier.btnClass}`} style={{ justifyContent: "center" }}>
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full platform access */}
      <section style={{ padding: "64px 0 96px" }}>
        <div className="container">
          <div className="split-grid">
            <div className="overview-panel">
              <div className="eyebrow" style={{ marginBottom: "12px" }}>{t("platformEyebrow")}</div>
              <h2 className="heading-md" style={{ marginBottom: "12px" }}>
                {t("platformTitle")}
              </h2>
              <p className="body-text" style={{ marginBottom: "32px" }}>
                {t("platformBody")}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {platformPanels.map((panel) => (
                  <div key={panel.title} style={{ padding: "18px 20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text)", marginBottom: "6px" }}>{panel.title}</div>
                    <div className="body-xs">{panel.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="note-panel">
              <div className="card-kicker">{t("workflowKicker")}</div>
              <h3 className="heading-sm" style={{ marginBottom: "14px", lineHeight: 1.35 }}>
                {t("workflowTitle")}
              </h3>
              <p className="body-sm" style={{ marginBottom: "16px" }}>
                {t("workflowBody")}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {Array.from({ length: 3 }, (_, i) => (
                  <li key={i} className="body-xs" style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span style={{ color: "var(--gold)", flexShrink: 0 }}>→</span>
                    {t(`workflowBullet${i + 1}` as "workflowBullet1")}
                  </li>
                ))}
              </ul>
              <Link href="/investor/analyze" className="button button-secondary" style={{ fontSize: "0.85rem" }}>
                {t("workflowCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
