"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { PieChart } from "@/components/charts/PieChart";
import { Gauge } from "@/components/charts/Gauge";
import { RadarChart } from "@/components/charts/RadarChart";

/* ------------------------------------------------------------------
 * Investor Portfolio Dashboard — Surpasses Deal Underwriter Pro v4.2
 * Authority: DSS · SCA · TVA
 * ------------------------------------------------------------------
 * Capabilities:
 *   • Portfolio KPIs (total value, avg ROI, deal count, win rate)
 *   • Profit trend line chart
 *   • Deal distribution pie chart
 *   • Recent deals table with grades/scores
 *   • Deal comparison radar (multi-select)
 *   • Strategy breakdown bar chart
 *   • Pipeline funnel (lead → analyze → offer → close)
 * ------------------------------------------------------------------ */

interface Deal {
  id: string;
  address: string;
  createdAt: string;
  strategy: "flip" | "brrrr" | "wholesale" | "buyhold";
  mao: number;
  profit: number;
  roi: number;
  dealGrade: string;
  dealScore: number;
  confidenceTier: string;
  status: "analyzing" | "offered" | "under_contract" | "closed" | "passed";
  arv: number;
  riskBand: string;
}

function gradeColor(grade: string): string {
  switch (grade) {
    case "A": return "var(--green)";
    case "B": return "var(--gold)";
    case "C": return "var(--amber)";
    case "D": return "var(--red)";
    default: return "var(--text-soft)";
  }
}

function statusLabel(status: Deal["status"]): string {
  const map: Record<string, string> = {
    analyzing: "Analyzing",
    offered: "Offered",
    under_contract: "Under Contract",
    closed: "Closed",
    passed: "Passed",
  };
  return map[status] ?? status;
}

function statusColor(status: Deal["status"]): string {
  switch (status) {
    case "closed": return "var(--green)";
    case "under_contract": return "var(--gold)";
    case "offered": return "var(--blue)";
    case "analyzing": return "var(--text-soft)";
    case "passed": return "var(--red)";
    default: return "var(--text-soft)";
  }
}

export default function InvestorPortfolioPage() {
  const t = useTranslations("investorPortfolio");
  const locale = useLocale();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/investor/analysis")
      .then((res) => res.json())
      .then((data) => {
        const items: Deal[] = (data.analyses ?? []).map((a: any) => ({
          id: a.id,
          address: a.address,
          createdAt: a.createdAt,
          strategy: a.investorOutputs?.investorProfileUsed ?? "flip",
          mao: a.investorOutputs?.mao ?? 0,
          profit: a.investorOutputs?.profit ?? 0,
          roi: a.investorOutputs?.roi ?? 0,
          dealGrade: a.investorOutputs?.dealGrade ?? "—",
          dealScore: a.investorOutputs?.dealScore ?? 0,
          confidenceTier: a.triage?.confidenceTier ?? "—",
          status: "analyzing",
          arv: a.verifiedArv ?? 0,
          riskBand: a.investorOutputs?.riskBand ?? "—",
        }));
        setDeals(items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    if (deals.length === 0) return null;
    const totalProfit = deals.reduce((s, d) => s + d.profit, 0);
    const avgRoi = deals.reduce((s, d) => s + d.roi, 0) / deals.length;
    const avgScore = deals.reduce((s, d) => s + d.dealScore, 0) / deals.length;
    const closed = deals.filter((d) => d.status === "closed").length;
    const winRate = deals.length > 0 ? (closed / deals.length) * 100 : 0;
    return { totalProfit, avgRoi, avgScore, dealCount: deals.length, winRate };
  }, [deals]);

  const strategyBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    deals.forEach((d) => { counts[d.strategy] = (counts[d.strategy] ?? 0) + 1; });
    return Object.entries(counts).map(([label, value]) => ({
      label: label.toUpperCase(),
      value,
      color: label === "flip" ? "var(--gold)" : label === "brrrr" ? "var(--blue)" : label === "wholesale" ? "var(--teal)" : "var(--green)",
    }));
  }, [deals]);

  const profitTrend = useMemo(() => {
    const map: Record<string, number> = {};
    deals.forEach((d) => {
      const date = new Date(d.createdAt);
      const key = date.toLocaleDateString(locale, { month: "short", year: "2-digit" });
      map[key] = (map[key] ?? 0) + d.profit;
    });
    return Object.entries(map).map(([x, y]) => ({ x, y }));
  }, [deals, locale]);

  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    deals.forEach((d) => { counts[d.status] = (counts[d.status] ?? 0) + 1; });
    return Object.entries(counts).map(([label, value]) => ({
      label: statusLabel(label as Deal["status"]),
      value,
      color: statusColor(label as Deal["status"]),
    }));
  }, [deals]);

  const compareDeals = useMemo(() => deals.filter((d) => compareIds.includes(d.id)), [deals, compareIds]);

  const radarAxes = [
    { label: "Profit", key: "profit" },
    { label: "ROI", key: "roi" },
    { label: "Score", key: "score" },
    { label: "ARV", key: "arv" },
    { label: "MAO", key: "mao" },
  ];

  const radarDatasets = useMemo(() => {
    const maxProfit = Math.max(...deals.map((d) => d.profit), 1);
    const maxRoi = Math.max(...deals.map((d) => d.roi), 1);
    const maxArv = Math.max(...deals.map((d) => d.arv), 1);
    const maxMao = Math.max(...deals.map((d) => d.mao), 1);
    return compareDeals.map((d, i) => ({
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
  }, [compareDeals, deals]);

  function toggleCompare(id: string) {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{t("loading")}</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: 1200 }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: "6px" }}>{t("eyebrow")}</div>
        <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: "var(--text)", letterSpacing: "-0.02em" }}>
          {t("title")}
        </h1>
      </div>

      {/* KPI Row */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px" }}>
          <KpiCard label={t("totalProfit")} value={`$${stats.totalProfit.toLocaleString()}`} color="var(--gold)" />
          <KpiCard label={t("avgRoi")} value={`${stats.avgRoi.toFixed(1)}%`} color={stats.avgRoi > 15 ? "var(--green)" : stats.avgRoi > 10 ? "var(--gold)" : "var(--amber)"} />
          <KpiCard label={t("dealCount")} value={String(stats.dealCount)} color="var(--text)" />
          <KpiCard label={t("avgScore")} value={stats.avgScore.toFixed(0)} color={gradeColor(stats.avgScore >= 80 ? "A" : stats.avgScore >= 60 ? "B" : stats.avgScore >= 40 ? "C" : "D")} />
          <KpiCard label={t("winRate")} value={`${stats.winRate.toFixed(0)}%`} color="var(--green)" />
        </div>
      )}

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
        <div className="card" style={{ minHeight: 280 }}>
          <div className="card-kicker">{t("profitTrend")}</div>
          {profitTrend.length > 0 ? <LineChart data={profitTrend} width={360} height={180} showArea /> : <EmptyState text={t("noData")} />}
        </div>
        <div className="card" style={{ minHeight: 280 }}>
          <div className="card-kicker">{t("strategyBreakdown")}</div>
          {strategyBreakdown.length > 0 ? <BarChart data={strategyBreakdown} width={360} height={180} showValues={false} /> : <EmptyState text={t("noData")} />}
        </div>
        <div className="card" style={{ minHeight: 280 }}>
          <div className="card-kicker">{t("dealStatus")}</div>
          {statusDistribution.length > 0 ? <PieChart data={statusDistribution} size={140} /> : <EmptyState text={t("noData")} />}
        </div>
      </div>

      {/* Deal Comparison Radar */}
      {compareDeals.length > 0 && (
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div className="card-kicker" style={{ margin: 0 }}>{t("dealComparison")}</div>
            <button onClick={() => setCompareIds([])} style={{ fontSize: "0.72rem", color: "var(--text-soft)", background: "none", border: "none", cursor: "pointer" }}>
              {t("clear")}
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <RadarChart axes={radarAxes} datasets={radarDatasets} size={280} />
          </div>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "12px", flexWrap: "wrap" }}>
            {compareDeals.map((d, i) => (
              <div key={d.id} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: radarDatasets[i]?.color }} />
                <span style={{ color: "var(--text-soft)" }}>{d.address.split(",")[0]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deals Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="card-kicker" style={{ margin: 0 }}>{t("recentDeals")}</div>
          <Link href="/investor/analyze" className="button button-primary" style={{ padding: "8px 16px", fontSize: "0.78rem", minHeight: 36 }}>
            {t("newAnalysis")}
          </Link>
        </div>
        {deals.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>{t("noDeals")}</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ background: "var(--surface-strong)", borderBottom: "1px solid var(--border-strong)" }}>
                  {["", t("address"), t("strategy"), t("arv"), t("mao"), t("profit"), t("roi"), t("grade"), t("score"), t("status"), ""].map((h) => (
                    <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-soft)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deals.map((d) => (
                  <tr key={d.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                    <td style={{ padding: "10px 14px" }}>
                      <input type="checkbox" checked={compareIds.includes(d.id)} onChange={() => toggleCompare(d.id)} style={{ cursor: "pointer" }} title="Add to comparison" />
                    </td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--mono)", color: "var(--text)", minWidth: 180 }}>{d.address}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-soft)", padding: "2px 8px", borderRadius: "4px", background: "var(--bg-alt)" }}>{d.strategy}</span>
                    </td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--mono)", color: "var(--gold)" }}>${d.arv.toLocaleString()}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>${d.mao.toLocaleString()}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--mono)", color: d.profit >= 0 ? "var(--green)" : "var(--red)", fontWeight: 600 }}>${d.profit.toLocaleString()}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--mono)", color: d.roi >= 15 ? "var(--green)" : d.roi >= 10 ? "var(--gold)" : "var(--amber)" }}>{d.roi}%</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 28, height: 28, borderRadius: "6px", fontFamily: "var(--mono)", fontWeight: 700,
                        fontSize: "0.85rem", color: gradeColor(d.dealGrade), background: `${gradeColor(d.dealGrade)}20`, border: `1px solid ${gradeColor(d.dealGrade)}40`,
                      }}>{d.dealGrade}</span>
                    </td>
                    <td style={{ padding: "10px 14px" }}><Gauge value={d.dealScore} size={48} stroke={4} /></td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{
                        fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em",
                        color: statusColor(d.status), padding: "2px 8px", borderRadius: "4px",
                        background: `${statusColor(d.status)}15`, border: `1px solid ${statusColor(d.status)}30`,
                      }}>{statusLabel(d.status)}</span>
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <Link href={`/investor/analysis/${d.id}`} style={{ color: "var(--gold)", fontSize: "0.78rem", textDecoration: "none", fontWeight: 500 }}>{t("view")} →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pipeline funnel */}
      <div className="card">
        <div className="card-kicker" style={{ marginBottom: "16px" }}>{t("pipeline")}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {["analyzing", "offered", "under_contract", "closed", "passed"].map((stage, i, arr) => {
            const count = deals.filter((d) => d.status === stage).length;
            const max = Math.max(...arr.map((s) => deals.filter((d) => d.status === s).length), 1);
            const height = Math.max((count / max) * 120, 20);
            return (
              <>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", minWidth: 80 }}>
                  <div style={{ width: 48, height, background: statusColor(stage as Deal["status"]), borderRadius: "6px 6px 0 0", opacity: 0.7, transition: "height 400ms ease" }} />
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>{count}</span>
                  <span style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-soft)", textAlign: "center" }}>{statusLabel(stage as Deal["status"])}</span>
                </div>
                {i < arr.length - 1 && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-soft)" strokeWidth="1.5" opacity={0.3}><path d="M9 18l6-6-6-6" /></svg>
                )}
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "4px" }}>
      <div style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-soft)" }}>{label}</div>
      <div style={{ fontFamily: "var(--mono)", fontSize: "1.5rem", fontWeight: 500, color, letterSpacing: "-0.02em" }}>{value}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 180, color: "var(--text-muted)", fontSize: "0.82rem" }}>
      {text}
    </div>
  );
}
