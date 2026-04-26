"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";

/* ------------------------------------------------------------------
 * Seller Market Position — Live analysis with print support
 * Authority: CSM · SCA · IDS · BLS
 * ------------------------------------------------------------------ */

interface CompRecord {
  address: string;
  salePrice: number;
  saleDate: string;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  distanceMiles: number;
}

interface ListingRecord {
  address: string;
  listPrice: number;
  listingDate: string;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  distanceMiles: number;
}

interface MarketAnalysis {
  address: string;
  propertyFacts: {
    squareFootage?: number;
    yearBuilt?: number;
    bedrooms?: number;
    bathrooms?: number;
    lotSize?: number;
    propertyType?: string;
  };
  avm: {
    price: number | null;
    priceRangeLow: number | null;
    priceRangeHigh: number | null;
  };
  arv: {
    value: number;
    confidence: string;
    tier: string;
    compCount: number;
  };
  marketVelocity: {
    avgSoldDOM: number;
    avgActiveDOM: number;
    marketVelocity: string;
    monthsOfInventory: number;
    absorptionRisk: string;
    marketType: string;
    expectedListToClose: number;
  };
  ppsfStats: {
    mean: number;
    median: number;
    stdDev: number;
    min: number;
    max: number;
    subjectPPSF: number;
    zScore: number;
    isOutlier: boolean;
    position: string;
    coeffVar: number;
    sampleSize: number;
  };
  ppsfBars: { label: string; value: number; color: string }[];
  trendData: { x: string; y: number }[];
  soldComps: CompRecord[];
  activeListings: ListingRecord[];
}

export default function SellerMarketPage() {
  const t = useTranslations("sellerHub");
  const [address, setAddress] = useState("");
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!address.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/seller/market-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: address.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Analysis failed.");
      } else {
        setAnalysis(data);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  const hasData = analysis != null;

  return (
    <div style={{ maxWidth: 1200 }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{t("eyebrow")}</div>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 24 }}>
        {t("marketPosition")}
      </h1>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Enter property address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAnalyze(); }}
            className="field-input"
            style={{ flex: 1, minWidth: 240 }}
          />
          <button
            className="button button-primary"
            style={{ fontSize: "0.82rem", minHeight: 40, padding: "8px 20px" }}
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? "Analyzing…" : "Analyze Position"}
          </button>
          {hasData && (
            <button
              className="button button-secondary"
              style={{ fontSize: "0.82rem", minHeight: 40, padding: "8px 20px" }}
              onClick={handlePrint}
            >
              Print Report
            </button>
          )}
        </div>
        {error && (
          <p style={{ color: "var(--red)", fontSize: "0.82rem", marginTop: 12, marginBottom: 0 }}>{error}</p>
        )}
      </div>

      {!hasData && !loading && (
        <div className="card" style={{ textAlign: "center", padding: "48px 24px", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "0.875rem" }}>Enter a property address above to generate a live market position analysis.</p>
        </div>
      )}

      {hasData && analysis && (
        <>
          {/* Property snapshot */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-kicker" style={{ marginBottom: 14 }}>Property Snapshot</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px 32px" }}>
              {analysis.propertyFacts.bedrooms != null && (
                <div><div style={{ fontSize: "0.68rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Beds</div><div style={{ fontFamily: "var(--mono)", fontWeight: 600, fontSize: "1.2rem", color: "var(--text)" }}>{analysis.propertyFacts.bedrooms}</div></div>
              )}
              {analysis.propertyFacts.bathrooms != null && (
                <div><div style={{ fontSize: "0.68rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Baths</div><div style={{ fontFamily: "var(--mono)", fontWeight: 600, fontSize: "1.2rem", color: "var(--text)" }}>{analysis.propertyFacts.bathrooms}</div></div>
              )}
              {analysis.propertyFacts.squareFootage != null && (
                <div><div style={{ fontSize: "0.68rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Sqft</div><div style={{ fontFamily: "var(--mono)", fontWeight: 600, fontSize: "1.2rem", color: "var(--text)" }}>{analysis.propertyFacts.squareFootage.toLocaleString()}</div></div>
              )}
              {analysis.propertyFacts.yearBuilt != null && (
                <div><div style={{ fontSize: "0.68rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Built</div><div style={{ fontFamily: "var(--mono)", fontWeight: 600, fontSize: "1.2rem", color: "var(--text)" }}>{analysis.propertyFacts.yearBuilt}</div></div>
              )}
              {analysis.propertyFacts.propertyType && (
                <div><div style={{ fontSize: "0.68rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Type</div><div style={{ fontFamily: "var(--mono)", fontWeight: 500, fontSize: "0.9rem", color: "var(--text)" }}>{analysis.propertyFacts.propertyType}</div></div>
              )}
            </div>
          </div>

          {/* Charts + Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 24 }}>
            <div className="card">
              <div className="card-kicker">Price Per SqFt Comparison</div>
              <BarChart data={analysis.ppsfBars} width={360} height={180} showValues formatValue={(v) => `$${v}`} />
            </div>
            <div className="card">
              <div className="card-kicker">Market Trend (6 Mo)</div>
              <LineChart data={analysis.trendData} width={360} height={180} showArea formatY={(v) => `$${v}`} />
            </div>
            <div className="card">
              <div className="card-kicker">Market Velocity</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Metric label="Avg Days on Market" value={`${analysis.marketVelocity.avgSoldDOM} days`} color={analysis.marketVelocity.avgSoldDOM < 30 ? "var(--green)" : analysis.marketVelocity.avgSoldDOM < 60 ? "var(--gold)" : "var(--red)"} />
                <Metric label="Months of Inventory" value={`${analysis.marketVelocity.monthsOfInventory} mo`} color={analysis.marketVelocity.monthsOfInventory < 3 ? "var(--green)" : analysis.marketVelocity.monthsOfInventory < 6 ? "var(--gold)" : "var(--red)"} />
                <Metric label="Absorption Risk" value={analysis.marketVelocity.absorptionRisk} color={analysis.marketVelocity.absorptionRisk === "LOW" ? "var(--green)" : analysis.marketVelocity.absorptionRisk === "MEDIUM" ? "var(--gold)" : "var(--red)"} />
                <Metric label="Market Type" value={analysis.marketVelocity.marketType} color={analysis.marketVelocity.marketType === "Seller" ? "var(--green)" : analysis.marketVelocity.marketType === "Balanced" ? "var(--gold)" : "var(--red)"} />
              </div>
            </div>
          </div>

          {/* ARV + PPSF stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 24 }}>
            <div className="card">
              <div className="card-kicker">Estimated ARV</div>
              <div style={{ fontFamily: "var(--mono)", fontWeight: 700, fontSize: "2rem", color: "var(--gold)", letterSpacing: "-0.02em", marginBottom: 8 }}>
                ${analysis.arv.value.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Confidence: <span style={{ color: analysis.arv.confidence === "High" ? "var(--green)" : "var(--amber)", fontWeight: 600 }}>{analysis.arv.confidence}</span> · Tier: {analysis.arv.tier} · {analysis.arv.compCount} comps
              </div>
              {analysis.avm.priceRangeLow != null && analysis.avm.priceRangeHigh != null && (
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 6 }}>
                  AVM Range: ${analysis.avm.priceRangeLow.toLocaleString()} – ${analysis.avm.priceRangeHigh.toLocaleString()}
                </div>
              )}
            </div>
            <div className="card">
              <div className="card-kicker">PPSF Analysis</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Metric label="Subject PPSF" value={`$${Math.round(analysis.ppsfStats.subjectPPSF)}`} color="var(--gold)" />
                <Metric label="Market Median" value={`$${Math.round(analysis.ppsfStats.median)}`} color="var(--text)" />
                <Metric label="Market Position" value={analysis.ppsfStats.position} color={analysis.ppsfStats.position === "Above Market" ? "var(--green)" : analysis.ppsfStats.position === "Below Market" ? "var(--red)" : "var(--gold)"} />
                <Metric label="Outlier?" value={analysis.ppsfStats.isOutlier ? "Yes — review comps" : "No"} color={analysis.ppsfStats.isOutlier ? "var(--red)" : "var(--green)"} />
              </div>
            </div>
          </div>

          {/* Sold Comps */}
          <div className="card" style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="card-kicker" style={{ margin: 0 }}>Comparable Sales</div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-soft)" }}>{analysis.soldComps.length} comps</span>
            </div>
            {analysis.soldComps.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                  <thead>
                    <tr style={{ background: "var(--surface-strong)", borderBottom: "1px solid var(--border-strong)" }}>
                      {["Address", "$/sqft", "Sold Price", "Bd/Ba", "Sqft", "Sold", "Distance"].map((h) => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.soldComps.map((comp, i) => {
                      const ppsf = comp.squareFootage > 0 ? Math.round(comp.salePrice / comp.squareFootage) : null;
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "10px 14px", color: "var(--text)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{comp.address}</td>
                          <td style={{ padding: "10px 14px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>{ppsf != null ? `$${ppsf}` : "—"}</td>
                          <td style={{ padding: "10px 14px", fontFamily: "var(--mono)", fontWeight: 600, color: "var(--gold)" }}>${comp.salePrice.toLocaleString()}</td>
                          <td style={{ padding: "10px 14px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>{comp.bedrooms}/{comp.bathrooms}</td>
                          <td style={{ padding: "10px 14px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>{comp.squareFootage.toLocaleString()}</td>
                          <td style={{ padding: "10px 14px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{comp.saleDate ? comp.saleDate.slice(0, 10) : "—"}</td>
                          <td style={{ padding: "10px 14px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>{comp.distanceMiles > 0 ? `${comp.distanceMiles.toFixed(2)} mi` : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>No comparable sales found.</div>
            )}
          </div>

          {/* Active Listings */}
          <div className="card" style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="card-kicker" style={{ margin: 0 }}>Active Competition</div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-soft)" }}>{analysis.activeListings.length} listings</span>
            </div>
            {analysis.activeListings.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                  <thead>
                    <tr style={{ background: "var(--surface-strong)", borderBottom: "1px solid var(--border-strong)" }}>
                      {["Address", "$/sqft", "List Price", "Bd/Ba", "Sqft", "Listed", "Distance"].map((h) => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.activeListings.map((listing, i) => {
                      const ppsf = listing.squareFootage > 0 ? Math.round(listing.listPrice / listing.squareFootage) : null;
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "10px 14px", color: "var(--text)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{listing.address}</td>
                          <td style={{ padding: "10px 14px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>{ppsf != null ? `$${ppsf}` : "—"}</td>
                          <td style={{ padding: "10px 14px", fontFamily: "var(--mono)", fontWeight: 600, color: "var(--blue)" }}>${listing.listPrice.toLocaleString()}</td>
                          <td style={{ padding: "10px 14px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>{listing.bedrooms}/{listing.bathrooms}</td>
                          <td style={{ padding: "10px 14px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>{listing.squareFootage.toLocaleString()}</td>
                          <td style={{ padding: "10px 14px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{listing.listingDate ? listing.listingDate.slice(0, 10) : "—"}</td>
                          <td style={{ padding: "10px 14px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>{listing.distanceMiles > 0 ? `${listing.distanceMiles.toFixed(2)} mi` : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>No active listings found nearby.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{label}</span>
      <span style={{ fontFamily: "var(--mono)", fontSize: "0.9rem", color, fontWeight: 600 }}>{value}</span>
    </div>
  );
}
