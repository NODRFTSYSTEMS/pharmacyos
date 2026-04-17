import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  const title = `${t("title")} — Peak Equity Optimizer`;
  return {
    title,
    description: "Frequently asked questions about Peak Equity Optimizer — platform, data sources, privacy, and pricing. Learn how PEO works, where data comes from, and how to get started.",
    openGraph: {
      title,
      description: "Get answers about PEO's verified ARV methodology, data sources, privacy practices, and pricing tiers.",
    },
  };
}

async function getFaqSchema() {
  const t = await getTranslations("faq");
  const items = [
    { q: t("general.q1"), a: t("general.a1") },
    { q: t("general.q2"), a: t("general.a2") },
    { q: t("general.q3"), a: t("general.a3") },
    { q: t("data.q1"), a: t("data.a1") },
    { q: t("data.q2"), a: t("data.a2") },
    { q: t("data.q3"), a: t("data.a3") },
    { q: t("privacy.q1"), a: t("privacy.a1") },
    { q: t("privacy.q2"), a: t("privacy.a2") },
    { q: t("pricingFaq.q1"), a: t("pricingFaq.a1") },
    { q: t("pricingFaq.q2"), a: t("pricingFaq.a2") },
    { q: t("pricingFaq.q3"), a: t("pricingFaq.a3") },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export default async function FaqPage() {
  const t = await getTranslations("faq");
  const schema = await getFaqSchema();

  const sections = ["general", "data", "privacy", "pricingFaq"] as const;
  const qCounts: Record<string, number> = { general: 3, data: 3, privacy: 2, pricingFaq: 3 };

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="section-hero" style={{ textAlign: "center" }}>
        <div className="container-narrow">
          <div className="eyebrow" style={{ marginBottom: "14px" }}>Support</div>
          <h1 className="display" style={{ marginBottom: "16px" }}>{t("title")}</h1>
        </div>
      </section>

      <section style={{ padding: "0 0 96px" }}>
        <div className="container-medium">
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {sections.map((section) => (
              <div key={section}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--gold)", marginBottom: "16px" }}>
                  {t(`${section}.title` as Parameters<typeof t>[0])}
                </div>
                <div className="card" style={{ display: "flex", flexDirection: "column", gap: 0, padding: "0 24px" }}>
                  {Array.from({ length: qCounts[section] ?? 1 }, (_, i) => i + 1).map((n, idx, arr) => (
                    <details
                      key={n}
                      className="faq-item"
                      style={{ borderBottom: idx < arr.length - 1 ? "1px solid var(--border)" : "none" }}
                    >
                      <summary className="faq-summary">
                        {t(`${section}.q${n}` as Parameters<typeof t>[0])}
                      </summary>
                      <p className="faq-answer">
                        {t(`${section}.a${n}` as Parameters<typeof t>[0])}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
