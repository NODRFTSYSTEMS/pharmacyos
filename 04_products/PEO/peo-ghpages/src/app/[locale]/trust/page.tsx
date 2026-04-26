import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "trust" });
  const title = `${t("title")} — Peak Equity Optimizer`;
  return {
    title,
    description: "PEO methodology, data sources, definitions, and limitations. Understand how every number is produced.",
    robots: { index: true, follow: true },
  };
}

export default async function TrustPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "trust" });

  const sections = [
    { key: "methodology", title: t("methodology"), text: t("methodologyText") },
    { key: "dataSources", title: t("dataSources"), text: t("dataSourcesText") },
    { key: "definitions", title: t("definitions"), text: t("definitionsText") },
    { key: "limitations", title: t("limitations"), text: t("limitationsText") },
  ];

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <section className="section-hero" style={{ textAlign: "center" }}>
        <div className="container-narrow">
          <div className="eyebrow" style={{ marginBottom: "14px" }}>Transparency</div>
          <h1 className="display" style={{ marginBottom: "16px" }}>{t("title")}</h1>
          <p className="lead">
            Every output PEO produces is traceable to a documented methodology. This page explains where data comes from, how calculations work, and what the platform cannot tell you.
          </p>
        </div>
      </section>

      <section style={{ padding: "0 0 64px" }}>
        <div className="container">
          <div className="grid-2">
            {sections.map((section) => (
              <div key={section.key} className="note-panel">
                <div className="card-kicker" style={{ marginBottom: "12px" }}>{section.title}</div>
                <p className="body-sm" style={{ margin: 0 }}>
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 96px" }}>
        <div className="container-medium">
          <div className="card" style={{ textAlign: "center", padding: "40px 32px" }}>
            <div className="eyebrow" style={{ marginBottom: "12px" }}>Go deeper</div>
            <h2 className="heading-md" style={{ marginBottom: "16px" }}>
              The full methodology is documented in the Academy.
            </h2>
            <p className="body-sm" style={{ marginBottom: "24px" }}>
              The Academy Methodology section explains how VERIFIED ARV is calculated, what confidence scoring measures, and how each output connects to its inputs.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/academy/methodology" className="button button-primary">Read Methodology</Link>
              <Link href="/academy/formula-stack" className="button button-secondary">Formula Stack</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
