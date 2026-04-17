"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

interface AnalysisItem {
  id: string;
  address: string;
  createdAt: string;
  triage: {
    confidenceTier: string;
  } | null;
}

function tierChipStyle(tier: string): React.CSSProperties {
  switch (tier) {
    case "HIGH":      return { background: "var(--green-dim)", color: "var(--green)", border: "1px solid rgba(39,174,96,0.25)" };
    case "MEDIUM":    return { background: "var(--amber-dim)", color: "var(--amber)", border: "1px solid rgba(243,156,18,0.25)" };
    case "LOW":       return { background: "var(--amber-dim)", color: "var(--amber)", border: "1px solid rgba(243,156,18,0.25)" };
    case "VERY_LOW":  return { background: "var(--red-dim)",   color: "var(--red)",   border: "1px solid rgba(231,76,60,0.25)" };
    default:          return { background: "var(--surface)",   color: "var(--text-soft)", border: "1px solid var(--border)" };
  }
}

export default function InvestorDashboardPage() {
  const t = useTranslations("investorDashboard");
  const locale = useLocale();
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/investor/analysis")
      .then((res) => res.json())
      .then((data) => {
        setAnalyses(data.analyses ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <section style={{ padding: "64px 0 48px" }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: "10px" }}>Investor Platform</div>
          <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "8px" }}>
            {t("title")}
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: "56ch" }}>{t("subtitle")}</p>
        </div>
      </section>

      {/* New analysis card */}
      <section style={{ padding: "0 0 40px" }}>
        <div className="container">
          <div className="card" style={{ maxWidth: "480px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div className="card-kicker">{t("newAnalysisTitle")}</div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.65, margin: 0 }}>
              {t("newAnalysisDesc")}
            </p>
            <div>
              <Link href="/investor/analyze" className="button button-primary" style={{ fontSize: "0.88rem" }}>
                {t("startAnalysis")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Saved analyses */}
      <section style={{ padding: "0 0 96px" }}>
        <div className="container">
          <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "1rem", color: "var(--text)", marginBottom: "16px" }}>
            {t("savedAnalysesTitle")}
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-soft)", marginBottom: "20px" }}>{t("savedAnalysesDesc")}</p>

          {loading ? (
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{t("loading")}</p>
          ) : analyses.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "40px", color: "var(--text-soft)", fontSize: "0.875rem" }}>
              {t("noAnalyses")}
            </div>
          ) : (
            <div className="terminal-grid">
              <div className="terminal-row" style={{ background: "var(--surface-strong)", borderBottom: "1px solid var(--border-strong)" }}>
                <span className="label" style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-soft)" }}>{t("address")}</span>
                <span className="value" style={{ display: "flex", gap: "48px" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-soft)", width: "100px" }}>{t("confidenceTier")}</span>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-soft)", width: "100px" }}>{t("date")}</span>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-soft)" }}></span>
                </span>
              </div>
              {analyses.map((a) => (
                <div key={a.id} className="terminal-row">
                  <span className="label" style={{ fontFamily: "var(--mono)", fontSize: "0.8rem" }}>{a.address}</span>
                  <span className="value" style={{ display: "flex", gap: "48px", alignItems: "center" }}>
                    <span style={{ width: "100px" }}>
                      <span className="status-chip" style={tierChipStyle(a.triage?.confidenceTier ?? "")}>
                        {a.triage?.confidenceTier ?? "—"}
                      </span>
                    </span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text-soft)", width: "100px" }}>
                      {new Date(a.createdAt).toLocaleDateString(locale)}
                    </span>
                    <Link href={`/investor/analysis/${a.id}`} style={{ color: "var(--gold)", fontSize: "0.8rem", textDecoration: "none", fontWeight: 500 }}>
                      {t("view")} →
                    </Link>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
