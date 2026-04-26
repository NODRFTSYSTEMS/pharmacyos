import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "glossary" });
  return {
    title: `${t("pageTitle")} — Peak Equity Optimizer`,
    description: t("pageSubtitle"),
  };
}

function GlossaryTerm({
  id,
  term,
  short,
  formula,
}: {
  id: string;
  term: string;
  short: string;
  formula?: string | null;
}) {
  return (
    <div
      id={`term-${id}`}
      style={{
        padding: "20px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <h3 className="heading-sm" style={{ marginBottom: "8px" }}>
        {term}
      </h3>
      <p className="body-sm" style={{ marginBottom: formula ? "10px" : 0 }}>
        {short}
      </p>
      {formula && (
        <code
          style={{
            display: "inline-block",
            fontFamily: "var(--mono)",
            fontSize: "0.75rem",
            color: "var(--gold)",
            background: "var(--gold-dim)",
            padding: "4px 10px",
            borderRadius: "6px",
            border: "1px solid rgba(233,160,21,0.2)",
          }}
        >
          {formula}
        </code>
      )}
    </div>
  );
}

export default function GlossaryPage() {
  const t = useTranslations("glossary");

  const termIds = [
    "arv",
    "basis",
    "brrrr",
    "capRate",
    "carryingCosts",
    "cashOnCash",
    "compQuality",
    "concessions",
    "confidenceTier",
    "dealGrade",
    "dealScore",
    "dispositionCosts",
    "dscr",
    "emd",
    "equityCapture",
    "gla",
    "holdTime",
    "killSwitch",
    "ltv",
    "mao",
    "marketArv",
    "marketVelocity",
    "noi",
    "opexRate",
    "points",
    "ppsf",
    "refiProceeds",
    "riskBand",
    "roi",
    "sharpeRatio",
    "spread",
    "stressProfit",
    "triage",
    "verifiedArv",
    "wholesaleAssignment",
  ];

  const terms = termIds.map((id) => ({
    id,
    term: t(`${id}.term`),
    short: t(`${id}.short`),
    formula: t.raw(`${id}.formula`) as string | null,
  }));

  // Sort alphabetically by term
  terms.sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <section className="section-hero" style={{ textAlign: "center" }}>
        <div className="container-medium">
          <div className="eyebrow" style={{ marginBottom: "14px" }}>
            Academy
          </div>
          <h1 className="display" style={{ marginBottom: "16px" }}>
            {t("pageTitle")}
          </h1>
          <p className="lead">{t("pageSubtitle")}</p>
        </div>
      </section>

      <section style={{ padding: "0 0 96px" }}>
        <div className="container-wide">
          <div className="card" style={{ padding: "8px 28px" }}>
            {terms.map((term) => (
              <GlossaryTerm key={term.id} {...term} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
