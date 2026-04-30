import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sellers" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
  };
}

function DefList({ items }: { items: { term: string; desc: React.ReactNode }[] }) {
  return (
    <dl className="def-list">
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
    <div className="process-card" style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
      <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "var(--gold-dim)", border: "1px solid rgba(233,160,21,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--gold)", flexShrink: 0 }}>
        {String(num).padStart(2, "0")}
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text)", marginBottom: "5px" }}>{title}</div>
        <div className="body-xs">{desc}</div>
      </div>
    </div>
  );
}

export default async function ForSellersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sellers" });

  const myths = Array.from({ length: 6 }, (_, i) => ({
    title: t(`myth${i + 1}Title` as "myth1Title"),
    content: t(`myth${i + 1}Body` as "myth1Body"),
  }));

  const risks = Array.from({ length: 8 }, (_, i) => ({
    title: t(`risk${i + 1}Title` as "risk1Title"),
    desc: t(`risk${i + 1}Body` as "risk1Body"),
  }));

  const mitigations = Array.from({ length: 8 }, (_, i) => ({
    title: t(`mitigation${i + 1}Title` as "mitigation1Title"),
    desc: t(`mitigation${i + 1}Body` as "mitigation1Body"),
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
              <p className="lead" style={{ marginBottom: "16px" }}>
                {t("heroLead")}
              </p>
              <p className="body-sm" style={{ marginBottom: "32px" }}>
                {t("heroBody")}
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/pricing" className="button button-primary">{t("heroCtaPrimary")}</Link>
                <Link href="/sign-up" className="button button-secondary">{t("heroCtaSecondary")}</Link>
              </div>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div className="card-kicker">{t("panelKicker")}</div>
              <h3 className="heading-sm">{t("panelTitle")}</h3>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--gold)", background: "var(--gold-dim)", border: "1px solid rgba(233,160,21,0.2)", borderRadius: "999px", padding: "3px 10px", display: "inline-block", marginBottom: "16px" }}>{t("panelBadge")}</div>
              <div style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "1.8rem", color: "var(--text)", marginBottom: "20px" }}>{t("panelPrice")} <span style={{ fontSize: "0.85rem", fontWeight: 400, color: "var(--text-muted)" }}>{t("panelPriceSub")}</span></div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {Array.from({ length: 4 }, (_, i) => (
                  <li key={i} className="body-xs" style={{ display: "flex", gap: "8px", lineHeight: 1.55 }}>
                    <span style={{ color: "var(--gold)", flexShrink: 0 }}>→</span> {t(`panelFeature${i + 1}` as "panelFeature1")}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section style={{ padding: "0 0 64px" }}>
        <div className="container">
          <div className="grid-2">
            <div className="feature-card">
              <div className="card-kicker" style={{ color: "var(--red)" }}>{t("problemKicker")}</div>
              <h3 className="heading-sm" style={{ marginBottom: "14px" }}>{t("problemCardTitle")}</h3>
              <p className="body-sm" style={{ marginBottom: "12px" }}>
                {t("problemBody1")}
              </p>
              <p className="body-sm">
                {t("problemBody2")}
              </p>
            </div>
            <div className="feature-card">
              <div className="card-kicker" style={{ color: "var(--green)" }}>{t("solutionKicker")}</div>
              <h3 className="heading-sm" style={{ marginBottom: "14px" }}>{t("solutionCardTitle")}</h3>
              <p className="body-sm" style={{ marginBottom: "12px" }}>
                {t("solutionBody1")}
              </p>
              <p className="body-sm">
                {t("solutionBody2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section style={{ padding: "0 0 64px" }}>
        <div className="container">
          <div className="section-opener">
            <div className="eyebrow" style={{ marginBottom: "12px" }}>{t("deliverablesEyebrow")}</div>
            <h2 className="heading-md" style={{ marginBottom: "12px" }}>
              {t("deliverablesTitle")}
            </h2>
            <p className="body-sm" style={{ maxWidth: "58ch", margin: "0 auto" }}>
              {t("deliverablesSubtitle")}
            </p>
          </div>
          <div className="grid-2">
            {Array.from({ length: 4 }, (_, i) => {
              const keys = ["Pricing", "Proceeds", "Timing", "Outputs"] as const;
              const key = keys[i];
              return (
                <div key={key} className="feature-card">
                  <div className="card-kicker">{t(`deliverable${key}Title` as "deliverablePricingTitle")}</div>
                  <p className="body-sm">{t(`deliverable${key}Desc` as "deliverablePricingDesc")}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Included deliverables */}
      <section style={{ padding: "0 0 64px" }}>
        <div className="container">
          <div className="split-grid">
            <div className="overview-panel">
              <div className="eyebrow" style={{ marginBottom: "12px" }}>{t("includedEyebrow")}</div>
              <h2 className="heading-md" style={{ marginBottom: "12px" }}>{t("includedTitle")}</h2>
              <p className="body-sm" style={{ marginBottom: "28px" }}>{t("includedBody")}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} style={{ padding: "16px 18px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text)", marginBottom: "5px" }}>{t(`includedItem${i + 1}Title` as "includedItem1Title")}</div>
                    <div className="body-xs">{t(`includedItem${i + 1}Desc` as "includedItem1Desc")}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="note-panel">
              <div className="card-kicker">{t("outcomeKicker")}</div>
              <h3 className="heading-sm" style={{ marginBottom: "14px", lineHeight: 1.35 }}>{t("outcomeTitle")}</h3>
              <p className="body-sm" style={{ marginBottom: "16px" }}>
                {t("outcomeBody")}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {Array.from({ length: 3 }, (_, i) => (
                  <li key={i} className="body-xs" style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span style={{ color: "var(--gold)", flexShrink: 0 }}>→</span>
                    {t(`outcomeBullet${i + 1}` as "outcomeBullet1")}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="button button-primary" style={{ fontSize: "0.85rem" }}>{t("outcomeCta")}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Capital Gains */}
      <section style={{ padding: "0 0 64px" }}>
        <div className="container">
          <div className="split-grid">
            <div>
              <div className="eyebrow" style={{ marginBottom: "12px" }}>{t("gainsEyebrow")}</div>
              <h2 className="heading-md" style={{ marginBottom: "16px" }}>
                {t("gainsTitle")}
              </h2>
              <p className="body-sm" style={{ marginBottom: "24px" }}>
                {t("gainsBody")}
              </p>
              <DefList items={Array.from({ length: 4 }, (_, i) => ({
                term: t(`gainsDt${i + 1}` as "gainsDt1"),
                desc: t(`gainsDd${i + 1}` as "gainsDd1"),
              }))} />
            </div>
            <div className="note-panel">
              <div className="card-kicker">{t("gainsTakeawayKicker")}</div>
              <h3 className="heading-sm" style={{ marginBottom: "14px", lineHeight: 1.35 }}>{t("gainsTakeawayTitle")}</h3>
              <p className="body-sm" style={{ marginBottom: "20px" }}>
                {t("gainsTakeawayBody")}
              </p>
              <div className="education-banner">
                <strong>{t("importantNote")}</strong> — {t("gainsDisclaimer")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Myths */}
      <section style={{ padding: "0 0 64px" }}>
        <div className="container">
          <div className="section-opener">
            <div className="eyebrow" style={{ marginBottom: "12px" }}>{t("mythsEyebrow")}</div>
            <h2 className="heading-md">{t("mythsHeading")}</h2>
          </div>
          <div className="grid-3">
            {myths.map((m) => (
              <div key={m.title} className="feature-card">
                <div className="card-kicker" style={{ color: "var(--amber)" }}>{m.title}</div>
                <p className="body-xs">{m.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Risks */}
      <section style={{ padding: "0 0 64px" }}>
        <div className="container">
          <div className="section-opener">
            <div className="eyebrow" style={{ marginBottom: "12px" }}>{t("risksEyebrow")}</div>
            <h2 className="heading-md">{t("risksHeading")}</h2>
          </div>
          <div className="grid-3">
            {risks.map((r) => (
              <div key={r.title} className="feature-card">
                <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text)", marginBottom: "8px" }}>{r.title}</div>
                <p className="body-xs">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Mitigation */}
      <section style={{ padding: "0 0 64px" }}>
        <div className="container">
          <div className="section-opener">
            <div className="eyebrow" style={{ marginBottom: "12px" }}>{t("mitigationsEyebrow")}</div>
            <h2 className="heading-md">{t("mitigationsHeading")}</h2>
          </div>
          <div className="grid-2" style={{ gap: "12px" }}>
            {mitigations.map((m, i) => (
              <ProcessCard key={m.title} num={i + 1} title={m.title} desc={m.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 0 96px" }}>
        <div className="container">
          <div className="split-grid">
            <div className="note-panel" style={{ background: "var(--surface)" }}>
              <strong style={{ display: "block", fontFamily: "var(--display)", fontSize: "0.95rem", color: "var(--text)", marginBottom: "12px" }}>{t("whoForTitle")}</strong>
              <p className="body-sm" style={{ marginBottom: "12px" }}>
                {t("whoForBody1")}
              </p>
              <p className="body-sm">
                {t("whoForBody2")}
              </p>
            </div>
            <div className="note-panel">
              <div className="card-kicker">{t("ctaKicker")}</div>
              <h3 className="heading-sm" style={{ marginBottom: "14px", lineHeight: 1.35 }}>
                {t("ctaTitle")}
              </h3>
              <p className="body-sm" style={{ marginBottom: "14px" }}>
                {t("ctaBody")}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: "9px" }}>
                {Array.from({ length: 3 }, (_, i) => (
                  <li key={i} className="body-xs" style={{ display: "flex", gap: "8px" }}>
                    <span style={{ color: "var(--text-soft)", flexShrink: 0 }}>–</span>
                    {t(`ctaBullet${i + 1}` as "ctaBullet1")}
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Link href="/pricing" className="button button-primary" style={{ fontSize: "0.82rem", minHeight: "40px", padding: "9px 18px" }}>{t("ctaPrimary")}</Link>
                <Link href="/sign-up" className="button button-secondary" style={{ fontSize: "0.82rem", minHeight: "40px", padding: "9px 18px" }}>{t("ctaSecondary")}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
