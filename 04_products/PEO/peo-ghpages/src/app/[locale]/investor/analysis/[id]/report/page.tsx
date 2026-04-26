"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
}

interface Analysis {
  applicationId: string;
  propertyFacts: Record<string, unknown>;
  soldComps: Array<{
    address: string; salePrice: number; saleDate: string;
    squareFootage: number; bedrooms: number; bathrooms: number;
    distanceMiles: number; compQuality?: number;
  }>;
  verifiedArv: number;
  marketArv: number;
  compQualityScore: number;
  confidenceScore: number;
  confidenceTier: string;
  triggers: string[];
  recommendation: string;
  investorOutputs: InvestorOutputs;
  passTriggered: boolean;
  analysisUnavailable?: boolean;
  isAdvanced?: boolean;
}

export default function InvestorAnalysisReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isDevId = id.startsWith("dev-");
    if (isDevId) {
      const stored = sessionStorage.getItem(`dev-analysis-${id}`);
      if (stored) {
        try { setAnalysis(JSON.parse(stored)); } catch { /* noop */ }
      }
      setLoading(false);
      return;
    }
    fetch(`/api/investor/analysis/${id}`)
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        setAnalysis(data.analysis);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div style={{ padding: "60px", fontFamily: "Georgia, serif" }}>Loading report…</div>;
  }

  if (!analysis || analysis.analysisUnavailable) {
    return <div style={{ padding: "60px", fontFamily: "Georgia, serif" }}>Analysis not available for printing.</div>;
  }

  const io = analysis.investorOutputs;
  const isAdvanced = analysis.isAdvanced;
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page-break { page-break-before: always; }
        }
        body { background: #fff; color: #1a1a1a; }
        .report-body { font-family: "Georgia", "Times New Roman", serif; font-size: 10pt; color: #1a1a1a; max-width: 780px; margin: 0 auto; padding: 40px 48px; }
        .report-header { border-bottom: 2px solid #b8962e; padding-bottom: 16px; margin-bottom: 32px; }
        .report-title { font-family: "Arial", sans-serif; font-size: 22pt; font-weight: 700; letter-spacing: -0.02em; color: #1a1a1a; margin: 0; }
        .report-subtitle { font-family: "Arial", sans-serif; font-size: 10pt; color: #555; margin: 4px 0 0; }
        .report-meta { font-family: "Arial", sans-serif; font-size: 9pt; color: #888; margin-top: 12px; display: flex; gap: 24px; }
        .section { margin-bottom: 28px; }
        .section-title { font-family: "Arial", sans-serif; font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #b8962e; border-bottom: 1px solid #e5d9b0; padding-bottom: 5px; margin-bottom: 14px; }
        .data-grid { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
        .data-grid td { padding: 6px 10px; border-bottom: 1px solid #eee; }
        .data-grid td:first-child { color: #555; width: 45%; }
        .data-grid td:last-child { font-family: "Courier New", monospace; font-weight: 600; color: #1a1a1a; }
        .data-grid tr:nth-child(even) td { background: #fafaf8; }
        .gold { color: #b8962e; }
        .red { color: #c0392b; }
        .green { color: #27ae60; }
        .amber { color: #d68910; }
        .grade-badge { display: inline-block; font-family: "Arial", sans-serif; font-size: 18pt; font-weight: 700; width: 36px; height: 36px; line-height: 36px; text-align: center; border-radius: 4px; }
        .grade-A { background: #d4edda; color: #27ae60; }
        .grade-B { background: #fff3cd; color: #b8962e; }
        .grade-C { background: #fff0d9; color: #d68910; }
        .grade-D { background: #f8d7da; color: #c0392b; }
        .stress-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
        .stress-card { border: 1px solid #ddd; border-radius: 4px; padding: 10px 8px; font-size: 8.5pt; }
        .stress-card-title { font-family: "Arial", sans-serif; font-weight: 700; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.06em; color: #888; margin-bottom: 8px; }
        .stress-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
        .stress-label { color: #999; }
        .viable { color: #27ae60; }
        .marginal { color: #d68910; }
        .negative { color: #c0392b; }
        .comp-table { width: 100%; border-collapse: collapse; font-size: 8.5pt; }
        .comp-table th { font-family: "Arial", sans-serif; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.08em; color: #888; font-weight: 700; padding: 5px 8px; border-bottom: 1px solid #ccc; text-align: left; }
        .comp-table td { padding: 5px 8px; border-bottom: 1px solid #eee; font-family: "Courier New", monospace; font-size: 8.5pt; }
        .comp-table tr:nth-child(even) td { background: #fafaf8; }
        .flag-list { list-style: none; padding: 0; margin: 0; }
        .flag-list li { padding: 5px 0; border-bottom: 1px solid #eee; font-size: 9pt; color: #d68910; }
        .recommendation-box { background: #fafaf8; border-left: 3px solid #b8962e; padding: 14px 18px; font-size: 9.5pt; line-height: 1.7; color: #333; }
        .footer { margin-top: 48px; border-top: 1px solid #ddd; padding-top: 16px; font-family: "Arial", sans-serif; font-size: 7.5pt; color: #aaa; line-height: 1.6; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .kill-switch-table { width: 100%; border-collapse: collapse; font-size: 9pt; }
        .kill-switch-table td { padding: 6px 10px; border-bottom: 1px solid #eee; }
      `}</style>

      <div className="no-print" style={{ background: "#1a1a1a", padding: "12px 24px", display: "flex", gap: "12px", alignItems: "center" }}>
        <span style={{ color: "#888", fontSize: "0.82rem", fontFamily: "Arial, sans-serif" }}>Investor Underwriting Report</span>
        <button
          onClick={() => window.print()}
          style={{ marginLeft: "auto", background: "#b8962e", color: "#fff", border: "none", borderRadius: "4px", padding: "8px 20px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, fontFamily: "Arial, sans-serif" }}
        >
          Print / Save PDF
        </button>
        <button
          onClick={() => window.history.back()}
          style={{ background: "transparent", color: "#888", border: "1px solid #444", borderRadius: "4px", padding: "8px 16px", cursor: "pointer", fontSize: "0.82rem", fontFamily: "Arial, sans-serif" }}
        >
          ← Back
        </button>
      </div>

      <div className="report-body">
        {/* Report Header */}
        <div className="report-header">
          <div className="report-title">Investor Underwriting Report</div>
          <div className="report-subtitle">Peak Equity Optimizer — Confidential Deal Analysis</div>
          <div className="report-meta">
            <span>Analysis ID: {analysis.applicationId}</span>
            <span>Date: {today}</span>
            <span>Confidence: {analysis.confidenceTier} ({analysis.confidenceScore})</span>
            {io.dealGrade && <span>Grade: <strong className={`grade-badge grade-${io.dealGrade}`} style={{ display: "inline", fontSize: "10pt", padding: "1px 6px" }}>{io.dealGrade}</strong> ({io.dealScore}/100)</span>}
          </div>
        </div>

        {/* Section 1: ARV Summary */}
        <div className="section">
          <div className="section-title">01 — ARV Summary</div>
          <table className="data-grid">
            <tbody>
              <tr><td>VERIFIED ARV (Sold Comp Median)</td><td className="gold">${analysis.verifiedArv.toLocaleString()}</td></tr>
              <tr><td>Market ARV (Active Listing Median)</td><td>${analysis.marketArv.toLocaleString()} <span style={{ fontSize: "8pt", color: "#aaa" }}>reference only</span></td></tr>
              <tr><td>Comp Quality Score</td><td>{analysis.compQualityScore.toFixed(1)}/100</td></tr>
              <tr><td>Sold Comps Used</td><td>{analysis.soldComps.length}</td></tr>
            </tbody>
          </table>
        </div>

        {/* Section 2: Core Underwriting */}
        <div className="section">
          <div className="section-title">02 — Core Underwriting</div>
          <table className="data-grid">
            <tbody>
              <tr><td>Maximum Allowable Offer (MAO)</td><td className="gold">${io.mao.toLocaleString()}</td></tr>
              <tr><td>70% Rule MAO</td><td>${io.seventyPercentMao.toLocaleString()}</td></tr>
              <tr><td>Projected Gross Profit</td><td className={io.profit >= 0 ? "green" : "red"}>${io.profit.toLocaleString()}</td></tr>
              <tr><td>Return on Investment (ROI)</td><td className={io.roi >= 15 ? "green" : io.roi >= 10 ? "amber" : "red"}>{io.roi}%</td></tr>
              <tr><td>Required Profit Floor</td><td>${io.requiredProfit.toLocaleString()}</td></tr>
              <tr><td>Total Transaction Costs</td><td>${io.totalCosts.toLocaleString()}</td></tr>
              <tr><td>Stress Profit (ARV −5%, Repairs +15%)</td><td className={io.stressProfit >= 0 ? "" : "red"}>${io.stressProfit.toLocaleString()}</td></tr>
              <tr><td>Risk Band</td><td>{io.riskBand}</td></tr>
              {(io.killSwitchCount ?? 0) > 0 && (
                <>
                  <tr><td>Kill Switch Issues Flagged</td><td className="red">{io.killSwitchCount}</td></tr>
                  <tr><td>Kill Switch MAO Reduction</td><td className="red">−${io.killSwitchAdjustment?.toLocaleString()}</td></tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Section 3: Property Facts */}
        <div className="section">
          <div className="section-title">03 — Property Facts (Rentcast)</div>
          <div className="two-col">
            <table className="data-grid">
              <tbody>
                {Object.entries(analysis.propertyFacts).slice(0, Math.ceil(Object.entries(analysis.propertyFacts).length / 2)).map(([k, v]) => (
                  <tr key={k}><td style={{ textTransform: "capitalize" }}>{k}</td><td>{String(v)}</td></tr>
                ))}
              </tbody>
            </table>
            <table className="data-grid">
              <tbody>
                {Object.entries(analysis.propertyFacts).slice(Math.ceil(Object.entries(analysis.propertyFacts).length / 2)).map(([k, v]) => (
                  <tr key={k}><td style={{ textTransform: "capitalize" }}>{k}</td><td>{String(v)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Advanced Metrics (if Advanced) */}
        {isAdvanced && (
          <div className="section">
            <div className="section-title">04 — Advanced Metrics</div>
            <table className="data-grid">
              <tbody>
                {io.rehabTotal !== undefined && <tr><td>Rehab Total (Line Items)</td><td>${io.rehabTotal.toLocaleString()}</td></tr>}
                {io.dscr !== undefined && <tr><td>DSCR (Debt Service Coverage Ratio)</td><td className={io.dscr >= 1.25 ? "green" : io.dscr >= 1.0 ? "amber" : "red"}>{io.dscr}x</td></tr>}
                {io.refiProceeds !== undefined && <tr><td>Refinance Proceeds</td><td>${io.refiProceeds.toLocaleString()}</td></tr>}
                {io.cashOnCash !== undefined && <tr><td>Cash-on-Cash Return</td><td className={io.cashOnCash >= 10 ? "green" : ""}>{io.cashOnCash}%</td></tr>}
                {io.wholesaleSpread !== undefined && <tr><td>Wholesale Spread</td><td>${io.wholesaleSpread.toLocaleString()}</td></tr>}
                {io.annualCashFlow !== undefined && <tr><td>Annual Cash Flow</td><td className={io.annualCashFlow >= 0 ? "green" : "red"}>${io.annualCashFlow.toLocaleString()}</td></tr>}
                {io.sharpeRatio !== undefined && <tr><td>Sharpe Ratio (Risk-Adjusted Return)</td><td>{io.sharpeRatio} — {io.sharpeGrade}</td></tr>}
                {io.investorProfileUsed && <tr><td>Investor Profile Applied</td><td style={{ textTransform: "capitalize" }}>{io.investorProfileUsed}</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* Section 5: 5-Scenario Stress Test */}
        {isAdvanced && io.stressScenarios && io.stressScenarios.length > 0 && (
          <div className="section">
            <div className="section-title">05 — Stress Test (5 Scenarios)</div>
            <div className="stress-grid">
              {io.stressScenarios.map((s) => (
                <div key={s.label} className="stress-card">
                  <div className="stress-card-title">{s.label}</div>
                  <div className="stress-row"><span className="stress-label">Profit</span><span className={s.status}>${s.profit.toLocaleString()}</span></div>
                  <div className="stress-row"><span className="stress-label">ROI</span><span>{s.roi}%</span></div>
                  <div className="stress-row"><span className="stress-label">MAO</span><span>${s.mao.toLocaleString()}</span></div>
                  <div style={{ marginTop: "8px", fontSize: "7.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }} className={s.status}>{s.status}</div>
                  <div style={{ marginTop: "4px", fontSize: "7pt", color: "#aaa", lineHeight: 1.4 }}>
                    {s.arvVariance !== 0 && `ARV ${s.arvVariance > 0 ? "+" : ""}${(s.arvVariance * 100).toFixed(0)}% `}
                    {s.repairVariance !== 0 && `Repairs ${s.repairVariance > 0 ? "+" : ""}${(s.repairVariance * 100).toFixed(0)}% `}
                    {s.holdVariance !== 0 && `Hold ${s.holdVariance > 0 ? "+" : ""}${s.holdVariance}mo`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 6: Sold Comps */}
        <div className="section page-break">
          <div className="section-title">06 — Sold Comparables</div>
          <table className="comp-table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Sale Price</th>
                <th>Sale Date</th>
                <th>SqFt</th>
                <th>Bed</th>
                <th>Bath</th>
                <th>Mi</th>
                {isAdvanced && <th>Quality</th>}
              </tr>
            </thead>
            <tbody>
              {analysis.soldComps.map((c, i) => (
                <tr key={i}>
                  <td>{c.address}</td>
                  <td className="gold">${c.salePrice.toLocaleString()}</td>
                  <td>{c.saleDate}</td>
                  <td>{c.squareFootage}</td>
                  <td>{c.bedrooms}</td>
                  <td>{c.bathrooms}</td>
                  <td>{c.distanceMiles}</td>
                  {isAdvanced && <td>{c.compQuality ?? "—"}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 7: Recommendation & Flags */}
        <div className="section">
          <div className="section-title">07 — Recommendation</div>
          <div className="recommendation-box">{analysis.recommendation}</div>
          {analysis.triggers.length > 0 && (
            <div style={{ marginTop: "14px" }}>
              <div style={{ fontSize: "8.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", marginBottom: "8px" }}>Triage Flags</div>
              <ul className="flag-list">
                {analysis.triggers.map((t) => <li key={t}>⚠ {t}</li>)}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="footer">
          <strong>Disclaimer:</strong> This report is produced by Peak Equity Optimizer and is for informational and analytical purposes only. It does not constitute a licensed appraisal, investment advice, or a commitment to acquire, fund, or underwrite any property. All values are derived from user-supplied inputs and third-party data sources. Data availability and accuracy vary by market. Consult a licensed appraiser, attorney, and financial advisor before making investment decisions.
          <br /><br />
          Formulas applied: MAO = ARV − Repairs − Holding Costs − Disposition Costs − Required Profit − Kill Switch Adjustment. VERIFIED ARV = median of qualified sold comparables. All calculations are documented at peakequityoptimizer.com/academy/formula-stack.
          <br /><br />
          © {new Date().getFullYear()} Peak Equity Optimizer. Confidential — do not distribute without authorization.
        </div>
      </div>
    </>
  );
}
