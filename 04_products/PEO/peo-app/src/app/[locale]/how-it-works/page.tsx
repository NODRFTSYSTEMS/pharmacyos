import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "howItWorks" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
  };
}

export default function HowItWorksPage() {
  const t = useTranslations("howItWorks");
  const home = useTranslations("home");

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Hero */}
      <section className="section-hero">
        <div className="container-medium" style={{ textAlign: "center" }}>
          <div className="eyebrow" style={{ marginBottom: "14px" }}>{t("heroEyebrow")}</div>
          <h1 className="display" style={{ marginBottom: "20px" }}>{home("howItWorksTitle")}</h1>
          <p className="lead">
            {t("heroLead")}
          </p>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: "0 0 72px" }}>
        <div className="container-medium">
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className="process-card"
                style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}
              >
                <div style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  background: "var(--gold-dim)", border: "1px solid rgba(233,160,21,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--display)", fontWeight: 700, fontSize: "1.1rem",
                  color: "var(--gold)", flexShrink: 0,
                }}>
                  {step}
                </div>
                <div style={{ paddingTop: "6px" }}>
                  <h3 className="heading-sm">{t(`step${step}Title` as "step1Title" | "step2Title" | "step3Title")}</h3>
                  <p className="body-text" style={{ margin: 0 }}>
                    {t(`step${step}Desc` as "step1Desc" | "step2Desc" | "step3Desc")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role split */}
      <section style={{ padding: "0 0 72px" }}>
        <div className="container">
          <div className="section-opener">
            <div className="eyebrow" style={{ marginBottom: "10px" }}>{t("splitEyebrow")}</div>
            <h2 className="heading-md">{t("splitTitle")}</h2>
          </div>
          <div className="grid-2">
            <div className="feature-card">
              <div className="card-kicker">{home("roleSellerTitle")}</div>
              <p className="body-sm" style={{ margin: 0 }}>
                {home("roleSellerDesc")}
              </p>
              <div style={{ marginTop: "20px" }}>
                <Link href="/for-sellers" className="button button-secondary" style={{ fontSize: "0.82rem" }}>
                  {t("sellerCta")}
                </Link>
              </div>
            </div>
            <div className="feature-card">
              <div className="card-kicker">{home("roleInvestorTitle")}</div>
              <p className="body-sm" style={{ margin: 0 }}>
                {home("roleInvestorDesc")}
              </p>
              <div style={{ marginTop: "20px" }}>
                <Link href="/for-investors" className="button button-secondary" style={{ fontSize: "0.82rem" }}>
                  {t("investorCta")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="section-cta">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="eyebrow" style={{ marginBottom: "14px" }}>{t("ctaEyebrow")}</div>
          <h2 className="heading-md" style={{ marginBottom: "28px" }}>
            {t("ctaTitle")}
          </h2>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/estimator" className="button button-primary">{t("ctaPrimary")}</Link>
            <Link href="/pricing" className="button button-secondary">{t("ctaSecondary")}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
