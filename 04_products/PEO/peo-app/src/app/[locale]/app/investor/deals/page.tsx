"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Gauge } from "@/components/charts/Gauge";

interface Deal {
  id: string;
  address: string;
  createdAt: string;
  dealGrade: string;
  dealScore: number;
  status: string;
  mao: number;
  profit: number;
}

export default function SavedDealsPage() {
  const t = useTranslations("investorDashboard");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/investor/analysis")
      .then((res) => res.json())
      .then((data) => {
        setDeals((data.analyses ?? []).map((a: any) => ({
          id: a.id,
          address: a.address,
          createdAt: a.createdAt,
          dealGrade: a.investorOutputs?.dealGrade ?? "—",
          dealScore: a.investorOutputs?.dealScore ?? 0,
          status: "analyzing",
          mao: a.investorOutputs?.mao ?? 0,
          profit: a.investorOutputs?.profit ?? 0,
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 1200 }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{t("eyebrow")}</div>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 24 }}>
        {t("savedDealsTitle")}
      </h1>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>{t("loadingDeals")}</p>
      ) : deals.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>{t("noSavedDeals")}</p>
          <Link href="/investor/analyze" className="button button-primary" style={{ fontSize: "0.82rem" }}>
            {t("runFirstAnalysis")}
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {deals.map((d) => (
            <div key={d.id} className="card" style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", color: "var(--text)" }}>{d.address}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-soft)", marginTop: 2 }}>{new Date(d.createdAt).toLocaleDateString()}</div>
                </div>
                <Gauge value={d.dealScore} size={44} stroke={4} />
                <span style={{
                  fontFamily: "var(--mono)", fontSize: "0.85rem", fontWeight: 700,
                  color: d.dealGrade === "A" ? "var(--green)" : d.dealGrade === "B" ? "var(--gold)" : d.dealGrade === "C" ? "var(--amber)" : "var(--red)",
                  padding: "2px 10px", borderRadius: 6, background: "var(--bg-alt)",
                }}>{d.dealGrade}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.08em" }}>MAO</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", color: "var(--gold)" }}>${d.mao.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Profit</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", color: d.profit >= 0 ? "var(--green)" : "var(--red)" }}>${d.profit.toLocaleString()}</div>
                </div>
                <Link href={`/investor/analysis/${d.id}`} style={{ color: "var(--gold)", fontSize: "0.8rem", textDecoration: "none", fontWeight: 500 }}>
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
