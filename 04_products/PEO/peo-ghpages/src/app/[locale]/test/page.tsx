"use client";

import { useState } from "react";
import { notFound } from "next/navigation";

export default function TestPage() {
  const [address, setAddress] = useState("2417 Rollingwood Dr, Austin, TX 78746");
  const [purchasePrice, setPurchasePrice] = useState("280000");
  const [arv, setArv] = useState("350000");
  const [repairs, setRepairs] = useState("30000");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  if (process.env.NEXT_PUBLIC_DEV_BYPASS !== "true") return notFound();

  async function run() {
    setStatus("loading");
    setResult(null);
    setErrorMsg("");
    try {
      const res = await fetch("/api/test/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          purchasePrice: Number(purchasePrice),
          arv: Number(arv),
          repairs: Number(repairs),
          holdMonths: 6,
          purchaseClosingRate: 0.02,
          dispositionCostRate: 0.09,
          annualInterestRate: 0.12,
          pointsRate: 0.02,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(JSON.stringify(data, null, 2));
        setStatus("error");
      } else {
        setResult(data);
        setStatus("done");
      }
    } catch (e) {
      setErrorMsg(String(e));
      setStatus("error");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--surface-strong)", border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)", padding: "10px 12px", color: "var(--text)",
    fontSize: "0.875rem", outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: "0.72rem", fontWeight: 700, color: "var(--text-soft)",
    textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "5px", display: "block",
  };

  const analysis = result?.analysis as {
    verifiedArv?: number; marketArv?: number; confidenceTier?: string; confidenceScore?: number;
    soldComps?: Record<string, unknown>[]; investorOutputs?: Record<string, unknown>;
    propertyFacts?: Record<string, unknown>;
  } | undefined;

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <section style={{ padding: "60px 0 40px" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <div className="eyebrow" style={{ marginBottom: "10px" }}>Dev Test</div>
          <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "1.8rem", color: "var(--text)", marginBottom: "8px" }}>
            Rentcast + Analysis Test
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-soft)", marginBottom: "32px" }}>
            Calls Rentcast live, runs investor formulas, returns full output. No auth. No DB.
          </p>

          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
            <div>
              <label style={labelStyle}>Property Address</label>
              <input style={inputStyle} value={address} onChange={e => setAddress(e.target.value)}
                onFocus={e => (e.target.style.borderColor = "var(--gold)")}
                onBlur={e => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Purchase Price</label>
                <input style={inputStyle} value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = "var(--gold)")}
                  onBlur={e => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
              <div>
                <label style={labelStyle}>Estimated ARV</label>
                <input style={inputStyle} value={arv} onChange={e => setArv(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = "var(--gold)")}
                  onBlur={e => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
              <div>
                <label style={labelStyle}>Repairs</label>
                <input style={inputStyle} value={repairs} onChange={e => setRepairs(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = "var(--gold)")}
                  onBlur={e => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            </div>
            <button
              onClick={run}
              disabled={status === "loading"}
              className="button button-primary"
              style={{ alignSelf: "flex-start", opacity: status === "loading" ? 0.6 : 1 }}
            >
              {status === "loading" ? "Running..." : "Run Analysis"}
            </button>
          </div>

          {status === "error" && (
            <div style={{ background: "var(--red-dim)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: "var(--radius-sm)", padding: "16px", marginBottom: "24px" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--red)", textTransform: "uppercase", marginBottom: "8px" }}>Error</div>
              <pre style={{ fontSize: "0.75rem", color: "var(--red)", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{errorMsg}</pre>
            </div>
          )}

          {status === "done" && analysis && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Key numbers */}
              <div className="terminal-grid">
                <div className="terminal-row" style={{ background: "var(--surface-strong)" }}>
                  <span className="label" style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-soft)" }}>Metric</span>
                  <span className="value" style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-soft)" }}>Value</span>
                </div>
                {(([
                  ["Verified ARV", `$${Number(analysis.verifiedArv ?? 0).toLocaleString()}`],
                  ["Market ARV", `$${Number(analysis.marketArv ?? 0).toLocaleString()}`],
                  ["Confidence Tier", String(analysis.confidenceTier ?? "—")],
                  ["Confidence Score", String(analysis.confidenceScore ?? "—")],
                  ["Comps Count", String(analysis.soldComps?.length ?? 0)],
                ] as [string, string][])).map(([label, value]) => (
                  <div key={label} className="terminal-row">
                    <span className="label" style={{ fontFamily: "var(--mono)", fontSize: "0.8rem" }}>{label}</span>
                    <span className="value" style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", color: "var(--gold)" }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Investor outputs */}
              {analysis.investorOutputs && (
                <div className="card">
                  <div className="card-kicker" style={{ marginBottom: "12px" }}>Investor Outputs</div>
                  <div className="terminal-grid">
                    {Object.entries(analysis.investorOutputs as Record<string, unknown>)
                      .filter(([, v]) => typeof v !== "object")
                      .map(([k, v]) => (
                        <div key={k} className="terminal-row">
                          <span className="label" style={{ fontFamily: "var(--mono)", fontSize: "0.78rem" }}>{k}</span>
                          <span className="value" style={{ fontFamily: "var(--mono)", fontSize: "0.82rem" }}>{String(v)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Property facts */}
              {analysis.propertyFacts && Object.keys(analysis.propertyFacts as object).length > 0 && (
                <div className="card">
                  <div className="card-kicker" style={{ marginBottom: "12px" }}>Property Facts (Rentcast)</div>
                  <div className="terminal-grid">
                    {Object.entries(analysis.propertyFacts as Record<string, unknown>).map(([k, v]) => (
                      <div key={k} className="terminal-row">
                        <span className="label" style={{ fontFamily: "var(--mono)", fontSize: "0.78rem" }}>{k}</span>
                        <span className="value" style={{ fontFamily: "var(--mono)", fontSize: "0.82rem" }}>{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sold comps */}
              {(analysis.soldComps as unknown[])?.length > 0 && (
                <div className="card">
                  <div className="card-kicker" style={{ marginBottom: "12px" }}>Sold Comps ({(analysis.soldComps as unknown[]).length})</div>
                  <div className="terminal-grid">
                    <div className="terminal-row" style={{ background: "var(--surface-strong)" }}>
                      {["Address", "Price", "Date", "SqFt", "Beds", "Mi"].map(h => (
                        <span key={h} style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-soft)", flex: 1 }}>{h}</span>
                      ))}
                    </div>
                    {(analysis.soldComps as Record<string, unknown>[]).map((c, i) => (
                      <div key={i} className="terminal-row">
                        <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", flex: 2 }}>{String(c.address)}</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--gold)", flex: 1 }}>${Number(c.salePrice).toLocaleString()}</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text-muted)", flex: 1 }}>{String(c.saleDate)}</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text-muted)", flex: 1 }}>{String(c.squareFootage)}</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text-muted)", flex: 1 }}>{String(c.bedrooms)}</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text-muted)", flex: 1 }}>{String(c.distanceMiles)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw JSON toggle */}
              <details style={{ cursor: "pointer" }}>
                <summary style={{ fontSize: "0.78rem", color: "var(--text-soft)", padding: "8px 0" }}>Raw JSON response</summary>
                <pre style={{ fontSize: "0.72rem", color: "var(--text-muted)", background: "var(--surface-strong)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "16px", overflowX: "auto", marginTop: "8px" }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
