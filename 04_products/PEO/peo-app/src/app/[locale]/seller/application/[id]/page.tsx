"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

interface PropertyFacts {
  squareFootage?: number;
  yearBuilt?: number;
  bedrooms?: number;
  bathrooms?: number;
  lotSize?: number;
  propertyType?: string;
  lastSaleDate?: string;
  estimatedValue?: number;
  taxAssessment?: number;
}

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

interface AvmData {
  price: number | null;
  priceRangeLow: number | null;
  priceRangeHigh: number | null;
}

interface SellerNetData {
  salePrice: number;
  agentCommission: number;
  closingCosts: number;
  mortgagePayoff: number;
  netProceeds: number;
}

interface MarketSummary {
  medianSoldPrice: number | null;
  avgPricePerSqft: number | null;
  compCount: number;
  activeListingCount: number;
}

interface ConfidenceData {
  score: number;
  tier: string;
  flags: string[];
}

interface ReadinessItem {
  id: string;
  category: string;
  title: string;
  description: string | null;
  completed: boolean;
}

interface ReadinessPlan {
  id: string;
  summary: string | null;
  items: ReadinessItem[];
}

interface ApplicationData {
  id: string;
  status: string;
  address: string;
  askingPrice: number | null;
  mortgagePayoff: number | null;
  timeline: string | null;
  propertyFacts: PropertyFacts;
  avm: AvmData;
  sellerNet: SellerNetData;
  soldComps: CompRecord[];
  activeListings: ListingRecord[];
  marketSummary: MarketSummary;
  confidence: ConfidenceData;
  readiness: ReadinessPlan | null;
}

function fmt(n: number | null | undefined): string {
  if (n == null) return "—";
  return `$${Number(n).toLocaleString()}`;
}

function fmtNum(n: number | null | undefined): string {
  if (n == null) return "—";
  return Number(n).toLocaleString();
}

function tierColor(tier: string): string {
  if (tier === "HIGH") return "var(--green)";
  if (tier === "MEDIUM") return "var(--amber)";
  if (tier === "LOW") return "var(--amber)";
  return "var(--red)";
}

function tierBg(tier: string): string {
  if (tier === "HIGH") return "var(--green-dim)";
  if (tier === "MEDIUM" || tier === "LOW") return "var(--amber-dim)";
  return "var(--red-dim)";
}

function tierBorder(tier: string): string {
  if (tier === "HIGH") return "1px solid rgba(39,174,96,0.25)";
  if (tier === "MEDIUM" || tier === "LOW") return "1px solid rgba(243,156,18,0.25)";
  return "1px solid rgba(231,76,60,0.25)";
}

function shortAddress(addr: string): string {
  const parts = addr.split(",");
  return parts[0]?.trim() ?? addr;
}

export default function ApplicationDetailPage() {
  const t = useTranslations("sellerApplication");
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id.startsWith("dev-")) {
      const stored = sessionStorage.getItem(`dev-seller-${id}`);
      if (stored) {
        setApp(JSON.parse(stored));
      }
      setLoading(false);
      return;
    }
    fetch(`/api/seller/application/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setApp(data.application);
        setLoading(false);
      });
  }, [id]);

  async function toggleItem(itemId: string, completed: boolean) {
    if (!app?.readiness) return;
    if (!id.startsWith("dev-")) {
      await fetch(`/api/readiness/${app.readiness.id}/item/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
    }
    setApp((prev) => {
      if (!prev?.readiness) return prev;
      return {
        ...prev,
        readiness: {
          ...prev.readiness,
          items: prev.readiness.items.map((i) =>
            i.id === itemId ? { ...i, completed: !completed } : i
          ),
        },
      };
    });
    if (id.startsWith("dev-")) {
      setApp((prev) => {
        if (prev) sessionStorage.setItem(`dev-seller-${id}`, JSON.stringify(prev));
        return prev;
      });
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: "80px 0" }}>
        <p style={{ color: "var(--text-muted)" }}>{t("loading")}</p>
      </div>
    );
  }
  if (!app) {
    return (
      <div className="container" style={{ padding: "80px 0" }}>
        <p style={{ color: "var(--text-muted)" }}>{t("notFound")}</p>
      </div>
    );
  }

  const netColor = app.sellerNet.netProceeds >= 0 ? "var(--green)" : "var(--red)";
  const compCount = app.soldComps?.length ?? 0;

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Header */}
      <section style={{ padding: "64px 0 32px" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: "10px" }}>Seller Platform</div>
              <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.25 }}>
                {app.address}
              </h1>
              {app.timeline && (
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "6px" }}>
                  {t("timeline")}: {app.timeline}
                </p>
              )}
            </div>
            <span className="status-chip" style={{ background: "var(--green-dim)", color: "var(--green)", border: "1px solid rgba(39,174,96,0.25)" }}>
              {t("analysisReady")}
            </span>
          </div>
        </div>
      </section>

      {/* Property Snapshot */}
      {app.propertyFacts && Object.keys(app.propertyFacts).length > 0 && (
        <section style={{ padding: "0 0 20px" }}>
          <div className="container">
            <div className="card">
              <div className="card-kicker" style={{ marginBottom: "14px" }}>{t("propertySnapshot")}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px 32px" }}>
                {app.propertyFacts.bedrooms != null && (
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px" }}>{t("beds")}</div>
                    <div style={{ fontFamily: "var(--mono)", fontWeight: 600, fontSize: "1.2rem", color: "var(--text)" }}>{app.propertyFacts.bedrooms}</div>
                  </div>
                )}
                {app.propertyFacts.bathrooms != null && (
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px" }}>{t("baths")}</div>
                    <div style={{ fontFamily: "var(--mono)", fontWeight: 600, fontSize: "1.2rem", color: "var(--text)" }}>{app.propertyFacts.bathrooms}</div>
                  </div>
                )}
                {app.propertyFacts.squareFootage != null && (
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px" }}>{t("sqft")}</div>
                    <div style={{ fontFamily: "var(--mono)", fontWeight: 600, fontSize: "1.2rem", color: "var(--text)" }}>{fmtNum(app.propertyFacts.squareFootage)}</div>
                  </div>
                )}
                {app.propertyFacts.yearBuilt != null && (
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px" }}>{t("built")}</div>
                    <div style={{ fontFamily: "var(--mono)", fontWeight: 600, fontSize: "1.2rem", color: "var(--text)" }}>{app.propertyFacts.yearBuilt}</div>
                  </div>
                )}
                {app.propertyFacts.propertyType && (
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px" }}>Type</div>
                    <div style={{ fontFamily: "var(--mono)", fontWeight: 500, fontSize: "0.9rem", color: "var(--text)" }}>{app.propertyFacts.propertyType}</div>
                  </div>
                )}
                {app.propertyFacts.lotSize != null && (
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px" }}>Lot</div>
                    <div style={{ fontFamily: "var(--mono)", fontWeight: 500, fontSize: "0.9rem", color: "var(--text)" }}>{fmtNum(app.propertyFacts.lotSize)} sqft</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Estimated Value + Net Proceeds — two column */}
      <section style={{ padding: "0 0 20px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>

            {/* AVM Value */}
            <div className="card">
              <div className="card-kicker" style={{ marginBottom: "10px" }}>{t("estimatedValue")}</div>
              {app.avm.price != null ? (
                <>
                  <div style={{ fontFamily: "var(--mono)", fontWeight: 700, fontSize: "2rem", color: "var(--gold)", letterSpacing: "-0.02em", marginBottom: "8px" }}>
                    {fmt(app.avm.price)}
                  </div>
                  {app.avm.priceRangeLow != null && app.avm.priceRangeHigh != null && (
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {t("avmRange")}: {fmt(app.avm.priceRangeLow)} – {fmt(app.avm.priceRangeHigh)}
                    </div>
                  )}
                  <div style={{ fontSize: "0.7rem", color: "var(--text-soft)", marginTop: "6px" }}>
                    {t("avmSource")} · {compCount > 0 ? `${compCount} comps` : "estimated"}
                  </div>
                  {app.marketSummary.medianSoldPrice != null && (
                    <div style={{ marginTop: "10px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      Median sold nearby: <span style={{ color: "var(--text)", fontFamily: "var(--mono)" }}>{fmt(app.marketSummary.medianSoldPrice)}</span>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  {app.marketSummary.medianSoldPrice != null
                    ? `Median sold: ${fmt(app.marketSummary.medianSoldPrice)}`
                    : t("noData")}
                </div>
              )}
            </div>

            {/* Net Proceeds */}
            <div className="card">
              <div className="card-kicker" style={{ marginBottom: "10px" }}>{t("netProceeds")}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>{t("lineAskingPrice")}</span>
                  <span style={{ fontFamily: "var(--mono)", color: "var(--text)" }}>{fmt(app.sellerNet.salePrice)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>{t("lineAgentCommission")}</span>
                  <span style={{ fontFamily: "var(--mono)", color: "var(--red)" }}>−{fmt(app.sellerNet.agentCommission)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>{t("lineClosingCosts")}</span>
                  <span style={{ fontFamily: "var(--mono)", color: "var(--red)" }}>−{fmt(app.sellerNet.closingCosts)}</span>
                </div>
                {app.sellerNet.mortgagePayoff > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>{t("lineMortgagePayoff")}</span>
                    <span style={{ fontFamily: "var(--mono)", color: "var(--red)" }}>−{fmt(app.sellerNet.mortgagePayoff)}</span>
                  </div>
                )}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text)" }}>{t("lineNetProceeds")}</span>
                  <span style={{ fontFamily: "var(--mono)", fontWeight: 700, fontSize: "1.5rem", color: netColor }}>
                    {fmt(app.sellerNet.netProceeds)}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "10px", lineHeight: 1.5 }}>
                {t("netProceedsNote")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sold Comps */}
      <section style={{ padding: "0 0 20px" }}>
        <div className="container">
          <div className="card">
            <div className="card-kicker" style={{ marginBottom: "14px" }}>{t("soldComps")}</div>
            {app.soldComps && app.soldComps.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                  <thead>
                    <tr>
                      {["Address", t("ppsf"), "Sold Price", `${t("beds")}/${t("baths")}`, t("sqft"), t("soldOn"), t("distance")].map((h) => (
                        <th key={h} style={{ padding: "6px 10px", textAlign: "left", fontSize: "0.68rem", fontWeight: 700, color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {app.soldComps.slice(0, 8).map((comp, i) => {
                      const ppsf = comp.squareFootage > 0 ? Math.round(comp.salePrice / comp.squareFootage) : null;
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "10px", color: "var(--text)", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {shortAddress(comp.address)}
                          </td>
                          <td style={{ padding: "10px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>
                            {ppsf != null ? `$${ppsf}` : "—"}
                          </td>
                          <td style={{ padding: "10px", fontFamily: "var(--mono)", fontWeight: 600, color: "var(--gold)" }}>
                            {fmt(comp.salePrice)}
                          </td>
                          <td style={{ padding: "10px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>
                            {comp.bedrooms}/{comp.bathrooms}
                          </td>
                          <td style={{ padding: "10px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>
                            {fmtNum(comp.squareFootage)}
                          </td>
                          <td style={{ padding: "10px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                            {comp.saleDate ? comp.saleDate.slice(0, 10) : "—"}
                          </td>
                          <td style={{ padding: "10px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>
                            {comp.distanceMiles > 0 ? `${comp.distanceMiles.toFixed(2)} ${t("distance")}` : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{t("noComps")}</p>
            )}
          </div>
        </div>
      </section>

      {/* Active Listings */}
      <section style={{ padding: "0 0 20px" }}>
        <div className="container">
          <div className="card">
            <div className="card-kicker" style={{ marginBottom: "14px" }}>{t("activeListings")}</div>
            {app.activeListings && app.activeListings.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                  <thead>
                    <tr>
                      {["Address", t("ppsf"), "List Price", `${t("beds")}/${t("baths")}`, t("sqft"), t("listed"), t("distance")].map((h) => (
                        <th key={h} style={{ padding: "6px 10px", textAlign: "left", fontSize: "0.68rem", fontWeight: 700, color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {app.activeListings.slice(0, 6).map((listing, i) => {
                      const ppsf = listing.squareFootage > 0 ? Math.round(listing.listPrice / listing.squareFootage) : null;
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "10px", color: "var(--text)", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {shortAddress(listing.address)}
                          </td>
                          <td style={{ padding: "10px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>
                            {ppsf != null ? `$${ppsf}` : "—"}
                          </td>
                          <td style={{ padding: "10px", fontFamily: "var(--mono)", fontWeight: 600, color: "var(--blue)" }}>
                            {fmt(listing.listPrice)}
                          </td>
                          <td style={{ padding: "10px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>
                            {listing.bedrooms}/{listing.bathrooms}
                          </td>
                          <td style={{ padding: "10px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>
                            {fmtNum(listing.squareFootage)}
                          </td>
                          <td style={{ padding: "10px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                            {listing.listingDate ? listing.listingDate.slice(0, 10) : "—"}
                          </td>
                          <td style={{ padding: "10px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>
                            {listing.distanceMiles > 0 ? `${listing.distanceMiles.toFixed(2)} ${t("distance")}` : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{t("noListings")}</p>
            )}
          </div>
        </div>
      </section>

      {/* Readiness Checklist */}
      {app.readiness && (
        <section style={{ padding: "0 0 20px" }}>
          <div className="container">
            <div className="card">
              <div className="card-kicker" style={{ marginBottom: "8px" }}>{t("readinessPlan")}</div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                {app.readiness.summary || t("defaultReadinessSummary")}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {app.readiness.items.map((item) => (
                  <div key={item.id} style={{
                    display: "flex", gap: "14px", alignItems: "flex-start",
                    padding: "12px 14px", background: "var(--surface-strong)",
                    border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                    opacity: item.completed ? 0.55 : 1,
                  }}>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleItem(item.id, item.completed)}
                      style={{ marginTop: "2px", accentColor: "var(--gold)", width: "15px", height: "15px", flexShrink: 0, cursor: "pointer" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                        <span style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "999px", padding: "2px 8px", fontSize: "0.68rem", fontWeight: 600, color: "var(--text-soft)" }}>
                          {item.category}
                        </span>
                        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: item.completed ? "var(--text-soft)" : "var(--text)", textDecoration: item.completed ? "line-through" : "none" }}>
                          {item.title}
                        </span>
                      </div>
                      {item.description && (
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Data Quality (small, at bottom) */}
      {app.confidence && (
        <section style={{ padding: "0 0 96px" }}>
          <div className="container">
            <div className="card" style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div className="card-kicker" style={{ marginBottom: "4px" }}>{t("dataQuality")}</div>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                    {t("dataScore")}: <span style={{ fontFamily: "var(--mono)", color: "var(--text)" }}>{app.confidence.score}</span>
                    {" · "}
                    {t("dataTier")}: <span style={{ fontFamily: "var(--mono)", color: tierColor(app.confidence.tier) }}>{app.confidence.tier}</span>
                  </p>
                </div>
                {app.confidence.flags.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {app.confidence.flags.slice(0, 4).map((flag) => (
                      <span key={flag} style={{
                        background: tierBg(app.confidence.tier),
                        color: tierColor(app.confidence.tier),
                        border: tierBorder(app.confidence.tier),
                        borderRadius: "999px", padding: "3px 10px",
                        fontSize: "0.7rem", fontWeight: 500,
                      }}>
                        {flag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
