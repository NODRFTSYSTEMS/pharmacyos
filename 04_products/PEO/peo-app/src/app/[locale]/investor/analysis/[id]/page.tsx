"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { TermTooltip } from "@/components/TermTooltip";
import type { MarketVelocityResult } from "@/lib/formulas/calculations";

interface StressScenario {
  label: string;
  arvVariance: number;
  repairVariance: number;
  holdVariance: number;
  mao: number;
  profit: number;
  roi: number;
  riskBand: string;
  status: "viable" | "marginal" | "negative";
}

interface Comp {
  address: string;
  salePrice: number;
  saleDate: string;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  distanceMiles: number;
  compQuality?: number;
}

interface InvestorOutputs {
  mao: number;
  seventyPercentMao: number;
  profit: number;
  roi: number;
  requiredProfit: number;
  totalCosts: number;
  stressProfit: number;
  riskBand: string;
  killSwitchAdjustment?: number;
  killSwitchCount?: number;
  dealGrade?: string;
  dealScore?: number;
  rehabTotal?: number;
  dscr?: number;
  refiProceeds?: number;
  cashOnCash?: number;
  wholesaleSpread?: number;
  annualCashFlow?: number;
  sharpeRatio?: number;
  sharpeGrade?: string;
  investorProfileUsed?: string;
  stressScenarios?: StressScenario[];
  scenarios?: {
    base: InvestorOutputs;
    upside: InvestorOutputs;
    downside: InvestorOutputs;
  };
}

interface Analysis {
  applicationId: string;
  propertyFacts: Record<string, unknown>;
  soldComps: Comp[];
  verifiedArv: number;
  marketArv: number;
  marketArvReference: boolean;
  compQualityScore: number;
  confidenceScore: number;
  confidenceTier: string;
  triggers: string[];
  recommendation: string;
  investorOutputs: InvestorOutputs;
  passTriggered: boolean;
  analysisUnavailable?: boolean;
  disclosure?: string;
  isAdvanced?: boolean;
  marketVelocity?: MarketVelocityResult;
}

function tierChipStyle(tier: string): React.CSSProperties {
  switch (tier) {
    case "HIGH":     return { background: "var(--green-dim)", color: "var(--green)", border: "1px solid rgba(39,174,96,0.25)" };
    case "MEDIUM":   return { background: "var(--amber-dim)", color: "var(--amber)", border: "1px solid rgba(243,156,18,0.25)" };
    case "LOW":      return { background: "var(--amber-dim)", color: "var(--amber)", border: "1px solid rgba(243,156,18,0.25)" };
    case "VERY_LOW": return { background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(231,76,60,0.25)" };
    default:         return { background: "var(--surface)", color: "var(--text-soft)", border: "1px solid var(--border)" };
  }
}

function riskBandStyle(band: string): React.CSSProperties {
  const b = band?.toLowerCase() ?? "";
  if (b === "low")      return { background: "var(--green-dim)", color: "var(--green)", border: "1px solid rgba(39,174,96,0.25)" };
  if (b === "moderate") return { background: "var(--amber-dim)", color: "var(--amber)", border: "1px solid rgba(243,156,18,0.25)" };
  if (b === "elevated") return { background: "var(--amber-dim)", color: "var(--amber)", border: "1px solid rgba(243,156,18,0.25)" };
  if (b === "high")     return { background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(231,76,60,0.25)" };
  return { background: "var(--surface)", color: "var(--text-soft)", border: "1px solid var(--border)" };
}

function gradeStyle(grade: string): React.CSSProperties {
  switch (grade) {
    case "A": return { background: "var(--green-dim)", color: "var(--green)", border: "1px solid rgba(39,174,96,0.25)" };
    case "B": return { background: "var(--gold-dim)", color: "var(--gold)", border: "1px solid rgba(233,160,21,0.25)" };
    case "C": return { background: "var(--amber-dim)", color: "var(--amber)", border: "1px solid rgba(243,156,18,0.25)" };
    case "D": return { background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(231,76,60,0.25)" };
    default:  return { background: "var(--surface)", color: "var(--text-soft)", border: "1px solid var(--border)" };
  }
}

function scoreRingColor(score: number): string {
  if (score >= 80) return "var(--green)";
  if (score >= 60) return "var(--gold)";
  if (score >= 40) return "var(--amber)";
  return "var(--red)";
}

function stressStatusStyle(status: StressScenario["status"]): React.CSSProperties {
  if (status === "viable")   return { color: "var(--green)" };
  if (status === "marginal") return { color: "var(--amber)" };
  return { color: "var(--red)" };
}

export default function InvestorAnalysisDetailPage() {
  const t = useTranslations("investorAnalysis");
  const tg = useTranslations("glossary");
  const locale = useLocale();
  const params = useParams();
  const id = params.id as string;
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const isDevId = id.startsWith("dev-");
    if (isDevId) {
      const stored = sessionStorage.getItem(`dev-analysis-${id}`);
      if (stored) {
        try { setAnalysis(JSON.parse(stored)); } catch { setError(t("submitError")); }
        setLoading(false);
        return;
      }
      setError("Dev analysis not found in session. Please run a new analysis.");
      setLoading(false);
      return;
    }

    fetch(`/api/investor/analysis/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        setAnalysis(data.analysis);
      })
      .catch(() => setError(t("submitError")))
      .finally(() => setLoading(false));
  }, [id, t]);

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch(`/api/investor/analysis/${id}/export`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Export failed");
        return;
      }
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data.export, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `peo-analysis-${id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed");
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: "80px 0" }}>
        <p style={{ color: "var(--text-muted)" }}>{t("loading")}</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="container" style={{ padding: "80px 0" }}>
        <p style={{ color: "var(--red)" }}>{error || t("notFound")}</p>
      </div>
    );
  }

  if (analysis.analysisUnavailable) {
    return (
      <div className="container" style={{ padding: "80px 0", maxWidth: "640px" }}>
        <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "1.8rem", color: "var(--text)", marginBottom: "24px" }}>{t("detailTitle")}</h1>
        <div style={{ background: "var(--red-dim)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: "var(--radius-md)", padding: "24px", color: "var(--red)" }}>
          <p style={{ fontWeight: 600, marginBottom: "8px" }}>{t("analysisUnavailable")}</p>
          {analysis.disclosure && <p style={{ fontSize: "0.875rem", opacity: 0.85 }}>{analysis.disclosure}</p>}
        </div>
      </div>
    );
  }

  const io = analysis.investorOutputs;
  const isAdvanced = analysis.isAdvanced;
  const mv = analysis.marketVelocity;

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Header row */}
      <section style={{ padding: "64px 0 32px" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: "10px" }}>Investor Platform</div>
              <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "var(--text)", letterSpacing: "-0.02em" }}>
                {t("detailTitle")}
              </h1>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href={`/${locale}/investor/analysis/${id}/report`} className="button button-secondary" style={{ fontSize: "0.82rem" }}>
                Print Report
              </Link>
              {isAdvanced && (
                <button onClick={handleExport} disabled={exporting} className="button button-secondary" style={{ fontSize: "0.82rem", opacity: exporting ? 0.6 : 1 }}>
                  {exporting ? "..." : t("export")}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Top cards: ARV + Confidence + Deal Grade + Deal Score + Market Velocity */}
      <section style={{ padding: "0 0 24px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px" }}>
            <div className="card">
              <div className="card-kicker">{t("verifiedArv")}</div>
              <div style={{ fontFamily: "var(--mono)", fontWeight: 500, fontSize: "1.7rem", color: "var(--gold)", letterSpacing: "-0.02em" }}>
                ${analysis.verifiedArv.toLocaleString()}
              </div>
            </div>
            <div className="card">
              <div className="card-kicker">{t("marketArv")}</div>
              <div style={{ fontFamily: "var(--mono)", fontWeight: 500, fontSize: "1.7rem", color: "var(--text)", letterSpacing: "-0.02em" }}>
                ${analysis.marketArv.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-soft)", marginTop: "4px" }}>Reference only</div>
            </div>
            <div className="card">
              <div className="card-kicker">Confidence</div>
              <div style={{ marginTop: "6px" }}>
                <span className="status-chip" style={tierChipStyle(analysis.confidenceTier)}>{analysis.confidenceTier}</span>
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-soft)", marginTop: "8px" }}>Score: {analysis.confidenceScore}</div>
            </div>
            <div className="card">
              <div className="card-kicker">
                <TermTooltip term="Deal Grade" definition={tg("dealGrade.short")} detailHref="/academy/glossary#term-dealGrade">
                  Deal Grade
                </TermTooltip>
              </div>
              {io.dealGrade ? (
                <>
                  <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontFamily: "var(--mono)", fontWeight: 700, fontSize: "2rem", ...gradeStyle(io.dealGrade), padding: "4px 14px", borderRadius: "var(--radius-sm)" }}>{io.dealGrade}</span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-soft)", marginTop: "8px" }}>{t("dealScoreLabel")}: {io.dealScore}/100</div>
                </>
              ) : (
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "8px" }}>—</div>
              )}
            </div>
            <div className="card">
              <div className="card-kicker">
                <TermTooltip term={t("dealScoreLabel")} definition={tg("dealScore.short")} detailHref="/academy/glossary#term-dealScore">
                  {t("dealScoreLabel")}
                </TermTooltip>
              </div>
              <div style={{ marginTop: "8px" }}>
                {io.dealScore !== undefined ? (
                  <ScoreRing score={io.dealScore} />
                ) : (
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>—</div>
                )}
              </div>
            </div>
            {mv && (
              <div className="card">
                <div className="card-kicker">
                  <TermTooltip term={t("marketVelocity")} definition={tg("marketVelocity.short")} detailHref="/academy/glossary#term-marketVelocity">
                    {t("marketVelocity")}
                  </TermTooltip>
                </div>
                <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span className="status-chip" style={tierChipStyle(mv.absorptionRisk)}>{mv.marketVelocity}</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-soft)" }}>{mv.marketType}</span>
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-soft)", marginTop: "8px" }}>
                  DOM {mv.avgSoldDOM} · MOI {mv.monthsOfInventory}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Kill Switch status banner (if any active) */}
      {io.killSwitchCount !== undefined && io.killSwitchCount > 0 && (
        <section style={{ padding: "0 0 20px" }}>
          <div className="container">
            <div style={{ background: "var(--red-dim)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: "var(--radius-sm)", padding: "14px 18px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--red)" }}>
                {io.killSwitchCount} condition issue{io.killSwitchCount > 1 ? "s" : ""} flagged
              </span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                MAO reduced by <span style={{ fontFamily: "var(--mono)", color: "var(--red)", fontWeight: 600 }}>${io.killSwitchAdjustment?.toLocaleString()}</span> (midpoint cost estimate applied before 70% rule)
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Key metrics */}
      <section style={{ padding: "0 0 24px" }}>
        <div className="container">
          <div className="card-kicker" style={{ marginBottom: "12px" }}>Core Underwriting</div>
          <div className="terminal-grid">
            <MetricRow label={
              <TermTooltip term={t("mao")} definition={tg("mao.short")} detailHref="/academy/glossary#term-mao">
                {t("mao")}
              </TermTooltip>
            } value={`$${io.mao.toLocaleString()}`} gold />
            <MetricRow label={t("seventyPercentMao")} value={`$${io.seventyPercentMao.toLocaleString()}`} />
            <MetricRow label={t("profit")} value={`$${io.profit.toLocaleString()}`} gold={io.profit > 0} negative={io.profit < 0} />
            <MetricRow label={t("roi")} value={`${io.roi}%`} gold={io.roi > 15} />
            <MetricRow label="Required Profit" value={`$${io.requiredProfit.toLocaleString()}`} />
            <MetricRow label="Total Costs" value={`$${io.totalCosts.toLocaleString()}`} />
            <MetricRow label={t("stressProfit")} value={`$${io.stressProfit.toLocaleString()}`} negative={io.stressProfit < 0} />
            <div className="terminal-row">
              <span className="label" style={{ fontFamily: "var(--mono)", fontSize: "0.82rem" }}>
                <TermTooltip term={t("riskBand")} definition={tg("riskBand.short")} detailHref="/academy/glossary#term-riskBand">
                  {t("riskBand")}
                </TermTooltip>
              </span>
              <span className="value">
                <span className="status-chip" style={riskBandStyle(io.riskBand)}>{io.riskBand}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced metrics */}
      {isAdvanced && (
        <section style={{ padding: "0 0 24px" }}>
          <div className="container">
            <div className="card-kicker" style={{ marginBottom: "12px" }}>Advanced Metrics</div>
            <div className="terminal-grid">
              {io.rehabTotal !== undefined && <MetricRow label="Rehab Total" value={`$${io.rehabTotal.toLocaleString()}`} />}
              {io.dscr !== undefined && <MetricRow label={
                <TermTooltip term={t("dscr")} definition={tg("dscr.short")} detailHref="/academy/glossary#term-dscr">
                  {t("dscr")}
                </TermTooltip>
              } value={String(io.dscr)} gold={io.dscr >= 1.25} negative={io.dscr > 0 && io.dscr < 1.0} />}
              {io.refiProceeds !== undefined && <MetricRow label={t("refiProceeds")} value={`$${io.refiProceeds.toLocaleString()}`} />}
              {io.cashOnCash !== undefined && <MetricRow label={
                <TermTooltip term={t("cashOnCash")} definition={tg("cashOnCash.short")} detailHref="/academy/glossary#term-cashOnCash">
                  {t("cashOnCash")}
                </TermTooltip>
              } value={`${io.cashOnCash}%`} gold={io.cashOnCash >= 10} />}
              {io.wholesaleSpread !== undefined && <MetricRow label={t("wholesaleSpread")} value={`$${io.wholesaleSpread.toLocaleString()}`} />}
              {io.annualCashFlow !== undefined && <MetricRow label={t("annualCashFlow")} value={`$${io.annualCashFlow.toLocaleString()}`} gold={io.annualCashFlow > 0} negative={io.annualCashFlow < 0} />}
              {io.sharpeRatio !== undefined && (
                <div className="terminal-row">
                  <span className="label" style={{ fontFamily: "var(--mono)", fontSize: "0.82rem" }}>Sharpe Ratio</span>
                  <span className="value" style={{ fontFamily: "var(--mono)", fontSize: "0.9rem" }}>
                    {io.sharpeRatio} <span style={{ fontSize: "0.72rem", color: "var(--text-soft)", marginLeft: "6px" }}>{io.sharpeGrade}</span>
                  </span>
                </div>
              )}
              {io.investorProfileUsed && (
                <div className="terminal-row">
                  <span className="label" style={{ fontFamily: "var(--mono)", fontSize: "0.82rem" }}>Investor Profile</span>
                  <span className="value" style={{ fontFamily: "var(--mono)", fontSize: "0.82rem", textTransform: "capitalize", color: "var(--gold)" }}>{io.investorProfileUsed}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5-Scenario Stress Test (Advanced) */}
      {isAdvanced && io.stressScenarios && io.stressScenarios.length > 0 && (
        <section style={{ padding: "0 0 24px" }}>
          <div className="container">
            <div className="card-kicker" style={{ marginBottom: "12px" }}>5-Scenario Stress Test</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
              {io.stressScenarios.map((s) => (
                <StressScenarioCard key={s.label} scenario={s} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Base/Upside/Downside Scenarios (Advanced) */}
      {isAdvanced && io.scenarios && (
        <section style={{ padding: "0 0 24px" }}>
          <div className="container">
            <div className="card-kicker" style={{ marginBottom: "12px" }}>{t("scenarios")}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              <ScenarioCard title={t("scenarioBase")} outputs={io.scenarios.base} />
              <ScenarioCard title={t("scenarioUpside")} outputs={io.scenarios.upside} />
              <ScenarioCard title={t("scenarioDownside")} outputs={io.scenarios.downside} />
            </div>
          </div>
        </section>
      )}

      {/* Property facts + Recommendation */}
      <section style={{ padding: "0 0 24px" }}>
        <div className="container">
          <div className="split-grid">
            <div className="card">
              <div className="card-kicker" style={{ marginBottom: "12px" }}>{t("propertyFacts")}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                {Object.entries(analysis.propertyFacts).map(([key, value]) => (
                  <div key={key} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-soft)", textTransform: "capitalize" }}>{key}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text)" }}>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-kicker" style={{ marginBottom: "12px" }}>{t("recommendation")}</div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{analysis.recommendation}</p>
              {analysis.triggers.length > 0 && (
                <div style={{ marginTop: "16px" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-soft)", marginBottom: "8px" }}>Flags</div>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                    {analysis.triggers.map((trigger) => (
                      <li key={trigger} style={{ fontSize: "0.82rem", color: "var(--amber)", display: "flex", gap: "8px" }}>
                        <span>⚠</span> {trigger}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sold comps */}
      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          <div className="card-kicker" style={{ marginBottom: "12px" }}>{t("soldComps")}</div>
          {analysis.soldComps.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>No sold comps available.</p>
          ) : (
            <div className="terminal-grid" style={{ overflowX: "auto" }}>
              <div className="terminal-row" style={{ background: "var(--surface-strong)" }}>
                {["Address", "Price", "Date", "SqFt", "Beds", "Baths", "Mi", ...(isAdvanced ? [t("compQuality")] : [])].map((h) => (
                  <span key={h} style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-soft)", flex: 1, minWidth: "80px" }}>{h}</span>
                ))}
              </div>
              {analysis.soldComps.map((c, idx) => (
                <div key={idx} className="terminal-row">
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text)", flex: 2, minWidth: "160px" }}>{c.address}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--gold)", flex: 1, minWidth: "80px" }}>${c.salePrice.toLocaleString()}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text-muted)", flex: 1, minWidth: "80px" }}>{c.saleDate}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text-muted)", flex: 1, minWidth: "60px" }}>{c.squareFootage}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text-muted)", flex: 1, minWidth: "40px" }}>{c.bedrooms}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text-muted)", flex: 1, minWidth: "40px" }}>{c.bathrooms}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text-muted)", flex: 1, minWidth: "40px" }}>{c.distanceMiles}</span>
                  {isAdvanced && <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text-muted)", flex: 1, minWidth: "60px" }}>{c.compQuality ?? "—"}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MetricRow({ label, value, gold, negative }: { label: React.ReactNode; value: string; gold?: boolean; negative?: boolean }) {
  const color = negative ? "var(--red)" : gold ? "var(--gold)" : "var(--text)";
  return (
    <div className="terminal-row">
      <span className="label" style={{ fontFamily: "var(--mono)", fontSize: "0.82rem" }}>{label}</span>
      <span className="value" style={{ fontFamily: "var(--mono)", fontSize: "0.9rem", color, fontWeight: (gold || negative) ? 600 : 400 }}>{value}</span>
    </div>
  );
}

function ScenarioCard({ title, outputs }: { title: string; outputs: InvestorOutputs }) {
  return (
    <div className="card">
      <div className="card-kicker" style={{ marginBottom: "12px" }}>{title}</div>
      <div className="terminal-grid" style={{ border: "none", borderRadius: 0 }}>
        {[
          ["MAO", `$${outputs.mao.toLocaleString()}`],
          ["Profit", `$${outputs.profit.toLocaleString()}`],
          ["ROI", `${outputs.roi}%`],
          ["Risk", outputs.riskBand],
        ].map(([l, v]) => (
          <div key={l} className="terminal-row" style={{ borderColor: "var(--border)" }}>
            <span className="label" style={{ fontFamily: "var(--mono)", fontSize: "0.75rem" }}>{l}</span>
            <span className="value" style={{ fontFamily: "var(--mono)", fontSize: "0.82rem" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StressScenarioCard({ scenario }: { scenario: StressScenario }) {
  const statusStyle = stressStatusStyle(scenario.status);
  return (
    <div className="card" style={{ padding: "14px" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-soft)", marginBottom: "10px" }}>
        {scenario.label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Profit</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", ...statusStyle, fontWeight: 600 }}>${scenario.profit.toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>ROI</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text)" }}>{scenario.roi}%</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>MAO</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text)" }}>${scenario.mao.toLocaleString()}</span>
        </div>
      </div>
      <div style={{ marginTop: "10px", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", ...statusStyle }}>
        {scenario.status}
      </div>
      <div style={{ marginTop: "6px", fontSize: "0.65rem", color: "var(--text-soft)", lineHeight: 1.4 }}>
        {scenario.arvVariance !== 0 && `ARV ${scenario.arvVariance > 0 ? "+" : ""}${(scenario.arvVariance * 100).toFixed(0)}%`}
        {scenario.repairVariance !== 0 && ` Repairs ${scenario.repairVariance > 0 ? "+" : ""}${(scenario.repairVariance * 100).toFixed(0)}%`}
        {scenario.holdVariance !== 0 && ` Hold ${scenario.holdVariance > 0 ? "+" : ""}${scenario.holdVariance}mo`}
      </div>
    </div>
  );
}

function ScoreRing({ score, size = 44, stroke = 5 }: { score: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = clamp(score, 0, 100) / 100;
  const dashoffset = circumference * (1 - progress);
  const color = scoreRingColor(score);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--mono)",
          fontSize: "0.85rem",
          fontWeight: 700,
          color,
        }}
      >
        {score}
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
