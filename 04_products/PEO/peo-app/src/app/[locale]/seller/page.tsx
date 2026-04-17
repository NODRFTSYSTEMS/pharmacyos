"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function SellerDashboardPage() {
  const t = useTranslations("sellerDashboard");

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <section style={{ padding: "64px 0 48px" }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: "10px" }}>Seller Platform</div>
          <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "8px" }}>
            {t("title")}
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: "56ch" }}>{t("subtitle")}</p>
        </div>
      </section>

      <section style={{ padding: "0 0 96px" }}>
        <div className="container">
          <div className="grid-2">
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="card-kicker">{t("newApplicationTitle")}</div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.65, margin: 0 }}>
                {t("newApplicationDesc")}
              </p>
              <div>
                <Link href="/seller/application" className="button button-primary" style={{ fontSize: "0.88rem" }}>
                  {t("startApplication")}
                </Link>
              </div>
            </div>

            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="card-kicker">{t("trackTitle")}</div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.65, margin: 0 }}>
                {t("trackDesc")}
              </p>
              <div>
                <span style={{
                  display: "inline-block", padding: "8px 16px", borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)", fontSize: "0.82rem", color: "var(--text-soft)",
                  fontFamily: "var(--mono)",
                }}>
                  {t("comingSoon")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
