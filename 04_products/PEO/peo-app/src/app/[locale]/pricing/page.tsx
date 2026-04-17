import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
  };
}

const tierMeta = [
  { key: "free",            featured: false, badge: "Start Free",    href: "/estimator",  cta: "Open Estimator" },
  { key: "seller",          featured: false, badge: "Homeowners",    href: "/seller",     cta: "Start Seller Analysis" },
  { key: "investorBasic",   featured: true,  badge: "Most Popular",  href: "/investor",   cta: "Start Investor Basic" },
  { key: "investorAdvanced",featured: false, badge: "Full Platform", href: "/investor",   cta: "Start Investor Advanced" },
  { key: "vendor",          featured: false, badge: "Marketplace",   href: "mailto:vendors@peakequityoptimizer.com?subject=Vendor%20Application",    cta: "Apply as Vendor" },
];

export default function PricingPage() {
  const t = useTranslations("pricing");

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Header */}
      <section className="section-hero" style={{ textAlign: "center" }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: "14px" }}>Choose Your Plan</div>
          <h1 className="display" style={{ marginBottom: "16px" }}>{t("title")}</h1>
          <p className="lead" style={{ maxWidth: "52ch", margin: "0 auto" }}>{t("subtitle")}</p>
        </div>
      </section>

      {/* Tier Cards */}
      <section style={{ padding: "0 0 96px" }}>
        <div className="container">
          {/* Top row: 3 cards */}
          <div className="grid-3" style={{ marginBottom: "24px" }}>
            {tierMeta.slice(0, 3).map((meta) => (
              <TierCard key={meta.key} meta={meta} t={t} />
            ))}
          </div>
          {/* Bottom row: 2 cards centered */}
          <div className="pricing-row-2">
            {tierMeta.slice(3).map((meta) => (
              <TierCard key={meta.key} meta={meta} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust note */}
      <section style={{ padding: "0 0 80px" }}>
        <div className="container-narrow" style={{ textAlign: "center" }}>
          <p className="body-xs" style={{ color: "var(--text-soft)" }}>
            Paid tiers combine county assessor records, MLS data, and carefully estimated fields to produce verified values. Free tier is manual-input only — no live data, no comps.
          </p>
          <p className="body-xs" style={{ color: "var(--text-soft)", marginTop: "8px" }}>
            PEO is not an appraisal. Data availability varies by market.{" "}
            <Link href="/trust" style={{ color: "var(--gold)", textDecoration: "none" }}>Trust Center →</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

function TierCard({ meta, t }: { meta: typeof tierMeta[number]; t: ReturnType<typeof useTranslations> }) {
  const features = [0, 1, 2, 3, 4].map((i) => t(`${meta.key}.features.${i}` as Parameters<typeof t>[0]));

  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderColor: meta.featured ? "rgba(233,160,21,0.35)" : undefined,
        boxShadow: meta.featured ? "0 0 48px var(--gold-glow), var(--shadow-card)" : undefined,
      }}
    >
      {meta.featured && (
        <div className="featured-badge">
          {meta.badge}
        </div>
      )}
      {!meta.featured && (
        <div className="tier-badge">
          {meta.badge}
        </div>
      )}

      <div style={{ marginBottom: "4px" }}>
        <span style={{
          fontFamily: "var(--mono)", fontWeight: 500,
          fontSize: "2.1rem", color: meta.featured ? "var(--gold)" : "var(--text)",
          letterSpacing: "-0.02em",
        }}>
          {t(`${meta.key}.price` as Parameters<typeof t>[0])}
        </span>
      </div>
      <div className="heading-sm" style={{ marginBottom: "24px" }}>
        {t(`${meta.key}.name` as Parameters<typeof t>[0])}
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        {features.map((f, i) => (
          <li key={i} className="body-xs" style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: "3px", fontSize: "0.6rem" }}>▸</span>
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={meta.href}
        className={`button ${meta.featured ? "button-primary" : "button-secondary"}`}
        style={{ justifyContent: "center" }}
      >
        {meta.cta}
      </Link>
    </div>
  );
}
