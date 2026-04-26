"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { RadarChart } from "@/components/charts/RadarChart";

interface Deal {
  id: string;
  address: string;
  mao: number;
  profit: number;
  roi: number;
  dealScore: number;
  arv: number;
}

export default function CompareDealsPage() {
  const t = useTranslations("investorDashboard");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/investor/analysis")
      .then((res) => res.json())
      .then((data) => {
        setDeals((data.analyses ?? []).map((a: any) => ({
          id: a.id,
          address: a.address,
          mao: a.investorOutputs?.mao ?? 0,
          profit: a.investorOutputs?.profit ?? 0,
          roi: a.investorOutputs?.roi ?? 0,
          dealScore: a.investorOutputs?.dealScore ?? 0,
          arv: a.verifiedArv ?? 0,
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const compared = useMemo(() => deals.filter((d) => selected.includes(d.id)), [deals, selected]);

  const maxProfit = Math.max(...deals.map((d) => d.profit), 1);
  const maxRoi = Math.max(...deals.map((d) => d.roi), 1);
  const maxArv = Math.max(...deals.map((d) => d.arv), 1);
  const maxMao = Math.max(...deals.map((d) => d.mao), 1);

  const radarDatasets = compared.map((d, i) => ({
    label: d.address.split(",")[0],
    color: ["var(--gold)", "var(--blue)", "var(--green)", "var(--red)"][i % 4],
    fillOpacity: 0.1,
    values: {
      profit: (d.profit / maxProfit) * 100,
      roi: (d.roi / maxRoi) * 100,
      score: d.dealScore,
      arv: (d.arv / maxArv) * 100,
      mao: (d.mao / maxMao) * 100,
    },
  }));

  function toggle(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev);
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{t("eyebrow")}</div>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 24 }}>
        {t("dealComparisonTitle")}
      </h1>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>{t("loadingDeals")}</p>
      ) : deals.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <p style={{ color: "var(--text-muted)" }}>{t("noDealsToCompare")}</p>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 12 }}>{t("selectDeals")}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {deals.map((d) => (
                <button
                  key={d.id}
                  onClick={() => toggle(d.id)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    border: `1px solid ${selected.includes(d.id) ? "var(--gold)" : "var(--border)"}`,
                    background: selected.includes(d.id) ? "var(--gold-dim)" : "var(--bg-alt)",
                    color: selected.includes(d.id) ? "var(--gold)" : "var(--text-muted)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {d.address}
                </button>
              ))}
            </div>
          </div>

          {compared.length > 0 && (
            <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <RadarChart
                axes={[
                  { label: "Profit", key: "profit" },
                  { label: "ROI", key: "roi" },
                  { label: "Score", key: "score" },
                  { label: "ARV", key: "arv" },
                  { label: "MAO", key: "mao" },
                ]}
                datasets={radarDatasets}
                size={320}
              />
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
                {compared.map((d, i) => (
                  <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem" }}>
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: radarDatasets[i]?.color }} />
                    <span style={{ color: "var(--text-soft)" }}>{d.address}</span>
                  </div>
                ))}
              </div>

              {/* Comparison table */}
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", marginTop: 16 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-strong)" }}>
                    <th style={{ padding: "10px", textAlign: "left", fontSize: "0.65rem", textTransform: "uppercase", color: "var(--text-soft)" }}>Metric</th>
                    {compared.map((d) => (
                      <th key={d.id} style={{ padding: "10px", textAlign: "right", fontSize: "0.65rem", textTransform: "uppercase", color: "var(--text-soft)" }}>{d.address.split(",")[0]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {([
                    ["MAO", (d: Deal) => `$${d.mao.toLocaleString()}`],
                    ["Profit", (d: Deal) => `$${d.profit.toLocaleString()}`],
                    ["ROI", (d: Deal) => `${d.roi}%`],
                    ["Score", (d: Deal) => `${d.dealScore}/100`],
                    ["ARV", (d: Deal) => `$${d.arv.toLocaleString()}`],
                  ] as [string, (d: Deal) => string][]).map(([label, fmt]) => (
                    <tr key={label} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "10px", fontFamily: "var(--mono)", color: "var(--gold)" }}>{label}</td>
                      {compared.map((d) => (
                        <td key={d.id} style={{ padding: "10px", textAlign: "right", fontFamily: "var(--mono)" }}>{fmt(d)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
