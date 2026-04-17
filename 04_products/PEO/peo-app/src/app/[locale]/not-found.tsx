import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFoundPage() {
  const t = await getTranslations("notFound");

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <section style={{ padding: "120px 0 80px", textAlign: "center" }}>
        <div className="container-narrow">
          <div style={{
            fontFamily: "var(--mono)",
            fontWeight: 500,
            fontSize: "5rem",
            color: "var(--gold)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginBottom: "24px",
            opacity: 0.4,
          }}>
            404
          </div>
          <h1 className="heading-lg" style={{ marginBottom: "16px" }}>
            {t("title")}
          </h1>
          <p className="body-text" style={{ marginBottom: "36px" }}>
            {t("subtitle")}
          </p>
          <Link href="/" className="button button-primary">
            {t("cta")}
          </Link>
        </div>
      </section>
    </div>
  );
}
