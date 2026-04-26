"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Gauge } from "@/components/charts/Gauge";
import { TermTooltip } from "@/components/TermTooltip";

/* ------------------------------------------------------------------
 * Enhanced Investor Analysis — Surpasses Deal Underwriter Pro v4.2
 * Authority: DSS · SCA · TVA · FIS
 * ------------------------------------------------------------------
 * Features:
 *   • 4 Strategy tabs (Flip / BRRRR / Wholesale / Buy & Hold)
 *   • Live stress-test sliders (ARV, repairs, hold time)
 *   • Kill switch checklist with auto-MAO adjustment
 *   • Deal score gauge + grade badge
 *   • Comp quality visualization
 *   • Multi-scenario comparison
 * ------------------------------------------------------------------ */

type Strategy = "flip" | "brrrr" | "wholesale" | "buyhold";

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

interface Analysis {
  applicationId: string;
  propertyFacts: Record<string, unknown>;
  soldComps: Comp[];
  verifiedArv: number;
  marketArv: number;
  compQualityScore: number;
  confidenceScore: number;
  confidenceTier: string;
  triggers: string[];
  recommendation: string;
  investorOutputs: {
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
    scenarios?: { base: any; upside: any; downside: any };
  };
  passTriggered: boolean;
  analysisUnavailable?: boolean;
  isAdvanced?: boolean;
}

const STRATEGIES: { key: Strategy; label: string; color: string }[] = [
  { key: "flip", label: "Fix & Flip", color: "var(--gold)" },
  { key: "brrrr", label: "BRRRR", color: "var(--blue)" },
  { key: "wholesale", label: "Wholesale", color: "var(--teal)" },
  { key: "buyhold", label: "Buy & Hold", color: "var(--green)" },
];

const KILL_SWITCHES = [
  { id: "foundation", label: "Foundation issues", cost: 15000 },
  { id: "roof", label: "Roof replacement needed", cost: 12000 },
  { id: "hvac", label: "HVAC replacement", cost: 8000 },
  { id: "electrical", label: "Electrical rewire", cost: 10000 },
  { id: "plumbing", label: "Plumbing replacement", cost: 7000 },
  { id: "permits", label: "Permit delays / denials", cost: 5000 },
];

function gradeColor(grade: string): string {
  switch (grade) {
    case "A": return "var(--green)";
    case "B": return "var(--gold)";
    case "C": return "var(--amber)";
    case "D": return "var(--red)";
    default: return "var(--text-soft)";
  }
}

function recalcOutputs(base: Analysis["investorOutputs"], arvPct: number, repairPct: number, holdMo: number, kills: string[]) {
  const arvMult = 1 + arvPct / 100;
  const repairMult = 1 + repairPct / 100;
  const killCost = kills.reduce((s, k) => s + (KILL_SWITCHES.find((ks) => ks.id === k)?.cost ?? 0), 0);
  const baseArv = Math.round(base.mao / 0.7 + base.totalCosts);
  const newArv = Math.round(baseArv * arvMult);
  const newRepair = Math.round((base.totalCosts - (baseArv - base.mao)) * repairMult + killCost);
  const newMao = Math.round(newArv * 0.7 - newRepair - holdMo * 500);
  const newProfit = Math.round(newArv - newMao - newRepair);
  const newRoi = newMao > 0 ? Math.round((newProfit / newMao) * 100) : 0;
  return { mao: Math.max(0, newMao), profit: newProfit, roi: newRoi, killCost };
}

export default function EnhancedAnalysisPage() {
  const t = useTranslations("investorAnalysis");
  const tg = useTranslations("glossary");
  const params = useParams();
  const id = params.id as string;

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<Strategy>("flip");
  const [arvSlider, setArvSlider] = useState(0);
  const [repairSlider, setRepairSlider] = useState(0);
  const [holdSlider, setHoldSlider] = useState(0);
  const [activeKills, setActiveKills] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const isDevId = id.startsWith("dev-");
    if (isDevId) {
      const stored = sessionStorage.getItem(`dev-analysis-${id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setAnalysis(parsed);
          setStrategy(parsed.investorOutputs?.investorProfileUsed ?? "flip");
        } catch { setError(t("submitError")); }
      } else { setError("Dev analysis not found."); }
      setLoading(false);
      return;
    }
    fetch(`/api/investor/analysis/${id}`)
      .then(async (res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => { setAnalysis(data.analysis); setStrategy(data.analysis?.investorOutputs?.investorProfileUsed ?? "flip"); })
      .catch(() => setError(t("submitError")))
      .finally(() => setLoading(false));
  }, [id, t]);

  const live = useMemo(() => {
    if (!analysis) return null;
    return recalcOutputs(analysis.investorOutputs, arvSlider, repairSlider, holdSlider, activeKills);
  }, [analysis, arvSlider, repairSlider, holdSlider, activeKills]);

  const toggleKill = useCallback((killId: string) => {
    setActiveKills((prev) => prev.includes(killId) ? prev.filter((k) => k !== killId) : [...prev, killId]);
  }, []);

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch(`/api/investor/analysis/${id}/export`, { method: "POST" });
      if (!res.ok) { alert("Export failed"); return; }
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data.export, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `peo-analysis-${id}.json`; a.click(); URL.revokeObjectURL(url);
    } catch { alert("Export failed"); } finally { setExporting(false); }
  }

  if (loading) return <div style={{ padding: "80px 0" }}><p style={{ color: "var(--text-muted)" }}>{t("loading")}</p></div>;
  if (error || !analysis) return <div style={{ padding: "80px 0" }}><p style={{ color: "var(--red)" }}>{error || t("notFound")}</p></div>;
  if (analysis.analysisUnavailable) return (
    <div style={{ padding: "80px 0", maxWidth: 640 }}>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "1.8rem", color: "var(--text)", marginBottom: 24 }}>{t("detailTitle")}</h1>
      <div style={{ background: "var(--red-dim)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: "var(--radius-md)", padding: 24, color: "var(--red)" }}>
        <p style={{ fontWeight: 600, marginBottom: 8 }}>{t("analysisUnavailable")}</p>
      </div>
    </div>
  );

  const io = analysis.investorOutputs;
  const isAdvanced = analysis.isAdvanced;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>{t("eyebrow")}</div>
          <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: "var(--text)", letterSpacing: "-0.02em" }}>
            {t("detailTitle")}
          </h1>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href={`/investor/analysis/${id}/report`} className="button button-secondary" style={{ fontSize: "0.8rem", minHeight: 40, padding: "8px 16px" }}>
            Print Report
          </Link>
          {isAdvanced && (
            <button onClick={handleExport} disabled={exporting} className="button button-secondary" style={{ fontSize: "0.8rem", minHeight: 40, padding: "8px 16px", opacity: exporting ? 0.6 : 1 }}>
              {exporting ? "..." : t("export")}
            </button>
          )}
        </div>
      </div>

      {/* Top KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        <Kpi label={t("verifiedArv")} value={`$${analysis.verifiedArv.toLocaleString()}`} color="var(--gold)" />
        <Kpi label={t("marketArv")} value={`$${analysis.marketArv.toLocaleString()}`} sub="Reference" />
        <Kpi label="Confidence" value={analysis.confidenceTier} color={analysis.confidenceTier === "HIGH" ? "var(--green)" : analysis.confidenceTier === "MEDIUM" ? "var(--amber)" : "var(--red)"} />
        <Kpi label="Deal Grade" value={io.dealGrade ?? "—"} color={gradeColor(io.dealGrade ?? "")} />
        <div className="card" style={{ padding: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Gauge value={io.dealScore ?? 0} size={90} stroke={6} label={t("dealScoreLabel")} />
        </div>
      </div>

      {/* Strategy Tabs + Live Sliders */}
      <div className="card" style={{ padding: "16px" }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }}>
          {STRATEGIES.map((s) => (
            <button
              key={s.key}
              onClick={() => setStrategy(s.key)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: "0.82rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                background: strategy === s.key ? `${s.color}25` : "transparent",
                color: strategy === s.key ? s.color : "var(--text-soft)",
                borderBottom: strategy === s.key ? `2px solid ${s.color}` : "2px solid transparent",
                transition: "all 0.15s ease",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 20 }}>
          <Slider label="ARV Variance" value={arvSlider} min={-20} max={20} unit="%" onChange={setArvSlider} color="var(--gold)" />
          <Slider label="Repair Overrun" value={repairSlider} min={0} max={50} unit="%" onChange={setRepairSlider} color="var(--red)" />
          <Slider label="Hold Time Extension" value={holdSlider} min={0} max={12} unit="mo" onChange={setHoldSlider} color="var(--amber)" />
        </div>

        {live && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, padding: 16, background: "var(--bg-alt)", borderRadius: 12, border: "1px solid var(--border)" }}>
            <LiveKpi label="Live MAO" value={`$${live.mao.toLocaleString()}`} color={live.mao > 0 ? "var(--gold)" : "var(--red)"} />
            <LiveKpi label="Live Profit" value={`$${live.profit.toLocaleString()}`} color={live.profit > 0 ? "var(--green)" : "var(--red)"} />
            <LiveKpi label="Live ROI" value={`${live.roi}%`} color={live.roi > 15 ? "var(--green)" : live.roi > 10 ? "var(--gold)" : "var(--red)"} />
            {activeKills.length > 0 && <LiveKpi label="Kill Adjust" value={`-$${live.killCost.toLocaleString()}`} color="var(--red)" />}
          </div>
        )}
      </div>

      {/* Kill Switch Checklist */}
      <div className="card">
        <div className="card-kicker" style={{ marginBottom: 12 }}>Kill Switch Checklist</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
          {KILL_SWITCHES.map((ks) => (
            <label key={ks.id} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
              borderRadius: 8, background: activeKills.includes(ks.id) ? "var(--red-dim)" : "var(--bg-alt)",
              border: `1px solid ${activeKills.includes(ks.id) ? "rgba(244,63,94,0.3)" : "var(--border)"}`,
              cursor: "pointer", transition: "all 0.15s ease",
            }}>
              <input type="checkbox" checked={activeKills.includes(ks.id)} onChange={() => toggleKill(ks.id)} style={{ cursor: "pointer" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.82rem", color: activeKills.includes(ks.id) ? "var(--red)" : "var(--text)", fontWeight: 500 }}>{ks.label}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-soft)", fontFamily: "var(--mono)" }}>${ks.cost.toLocaleString()}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Core Metrics */}
      <div className="card">
        <div className="card-kicker" style={{ marginBottom: 12 }}>Core Underwriting</div>
        <div className="terminal-grid">
          <MetricRow label={<TermTooltip term={t("mao")} definition={tg("mao.short")} detailHref="/academy/glossary#term-mao">{t("mao")}</TermTooltip>} value={`$${io.mao.toLocaleString()}`} gold />
          <MetricRow label={t("seventyPercentMao")} value={`$${io.seventyPercentMao.toLocaleString()}`} />
          <MetricRow label={t("profit")} value={`$${io.profit.toLocaleString()}`} gold={io.profit > 0} negative={io.profit < 0} />
          <MetricRow label={t("roi")} value={`${io.roi}%`} gold={io.roi > 15} />
          <MetricRow label="Required Profit" value={`$${io.requiredProfit.toLocaleString()}`} />
          <MetricRow label="Total Costs" value={`$${io.totalCosts.toLocaleString()}`} />
          <MetricRow label={t("stressProfit")} value={`$${io.stressProfit.toLocaleString()}`} negative={io.stressProfit < 0} />
          <MetricRow label={t("riskBand")} value={io.riskBand} />
        </div>
      </div>

      {/* Stress Scenarios */}
      {isAdvanced && io.stressScenarios && io.stressScenarios.length > 0 && (
        <div className="card">
          <div className="card-kicker" style={{ marginBottom: 12 }}>5-Scenario Stress Test</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {io.stressScenarios.map((s) => (
              <div key={s.label} className="card" style={{ padding: 14 }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-soft)", marginBottom: 10 }}>{s.label}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Profit</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: s.status === "viable" ? "var(--green)" : s.status === "marginal" ? "var(--amber)" : "var(--red)", fontWeight: 600 }}>${s.profit.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>ROI</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text)" }}>{s.roi}%</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>MAO</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text)" }}>${s.mao.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ marginTop: 10, fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: s.status === "viable" ? "var(--green)" : s.status === "marginal" ? "var(--amber)" : "var(--red)" }}>{s.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sold Comps */}
      <div className="card">
        <div className="card-kicker" style={{ marginBottom: 12 }}>{t("soldComps")}</div>
        {analysis.soldComps.length === 0 ? (
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>No sold comps available.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-strong)" }}>
                  {["Address", "Price", "Date", "SqFt", "Beds", "Baths", "Mi", isAdvanced ? "Quality" : null].filter(Boolean).map((h) => (
                    <th key={String(h)} style={{ padding: "8px 10px", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-soft)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {analysis.soldComps.map((c, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 10px", fontFamily: "var(--mono)", color: "var(--text)", minWidth: 160 }}>{c.address}</td>
                    <td style={{ padding: "8px 10px", fontFamily: "var(--mono)", color: "var(--gold)" }}>${c.salePrice.toLocaleString()}</td>
                    <td style={{ padding: "8px 10px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>{c.saleDate}</td>
                    <td style={{ padding: "8px 10px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>{c.squareFootage}</td>
                    <td style={{ padding: "8px 10px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>{c.bedrooms}</td>
                    <td style={{ padding: "8px 10px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>{c.bathrooms}</td>
                    <td style={{ padding: "8px 10px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>{c.distanceMiles}</td>
                    {isAdvanced && (
                      <td style={{ padding: "8px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 60, height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ width: `${(c.compQuality ?? 0) * 10}%`, height: "100%", background: "var(--gold)", borderRadius: 3 }} />
                          </div>
                          <span style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--text-soft)" }}>{c.compQuality ?? "—"}</span>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recommendation */}
      <div className="card">
        <div className="card-kicker" style={{ marginBottom: 12 }}>{t("recommendation")}</div>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{analysis.recommendation}</p>
        {analysis.triggers.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-soft)", marginBottom: 8 }}>Flags</div>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {analysis.triggers.map((trigger) => (
                <li key={trigger} style={{ fontSize: "0.82rem", color: "var(--amber)", display: "flex", gap: 8 }}>
                  <span>⚠</span> {trigger}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value, color, sub }: { label: string; value: string; color?: string; sub?: string }) {
  return (
    <div className="card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-soft)" }}>{label}</div>
      <div style={{ fontFamily: "var(--mono)", fontSize: "1.3rem", fontWeight: 500, color: color ?? "var(--text)", letterSpacing: "-0.02em" }}>{value}</div>
      {sub && <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{sub}</div>}
    </div>
  );
}

function LiveKpi({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-soft)" }}>{label}</div>
      <div style={{ fontFamily: "var(--mono)", fontSize: "1.1rem", fontWeight: 600, color }}>{value}</div>
    </div>
  );
}

function Slider({ label, value, min, max, unit, onChange, color }: { label: string; value: number; min: number; max: number; unit: string; onChange: (v: number) => void; color: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", color, fontWeight: 600 }}>{value > 0 ? "+" : ""}{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: "100%", accentColor: color, cursor: "pointer" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--text-soft)", fontFamily: "var(--mono)" }}>
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
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
