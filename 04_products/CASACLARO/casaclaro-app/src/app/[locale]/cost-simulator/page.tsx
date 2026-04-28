"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SITE_CONFIG } from "@/config/site.config";

// ─── Constants ────────────────────────────────────────────────────────────────

const FX_COP = SITE_CONFIG.fx_fallback_cop_per_usd;
const VISA_THRESHOLD_USD = SITE_CONFIG.investor_visa_min_usd;

const CITY_DATA = {
  medellin: {
    name: "Medellín",
    color: "var(--terracotta, #e67e22)",
    pricePerSqm: 1850,
    closingCostPct: 0.042,
    propertyTaxPct: 0.0075,
    rent: { small: 650, medium: 850, large: 1200 },
    shortTermMultiplier: 1.38,
    furnishedMultiplier: 1.175,
    renovBasic: { lo: 100, hi: 200 },
    renovFull: { lo: 300, hi: 600 },
  },
  bogota: {
    name: "Bogotá",
    color: "var(--ocean, #1f3a4d)",
    pricePerSqm: 2100,
    closingCostPct: 0.042,
    propertyTaxPct: 0.010,
    rent: { small: 750, medium: 1000, large: 1500 },
    shortTermMultiplier: 1.35,
    furnishedMultiplier: 1.175,
    renovBasic: { lo: 130, hi: 250 },
    renovFull: { lo: 400, hi: 800 },
  },
  cartagena: {
    name: "Cartagena",
    color: "var(--lagoon, #1f6f78)",
    pricePerSqm: 2400,
    closingCostPct: 0.045,
    propertyTaxPct: 0.009,
    rent: { small: 900, medium: 1200, large: 1800 },
    shortTermMultiplier: 1.45,
    furnishedMultiplier: 1.20,
    renovBasic: { lo: 120, hi: 230 },
    renovFull: { lo: 350, hi: 700 },
  },
} as const;

type CityKey = keyof typeof CITY_DATA;
type UseType = "personal" | "longterm" | "shortterm";
type RenovType = "none" | "basic" | "full";
type CurrencyMode = "usd" | "cop";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sizeCategory(sqm: number): "small" | "medium" | "large" {
  if (sqm < 55) return "small";
  if (sqm < 100) return "medium";
  return "large";
}

function fmtUSD(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function fmtCOP(n: number) {
  return "COP\u00a0" + new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(Math.round(n));
}

function fmtPct(n: number) {
  return n.toFixed(1) + "%";
}

// ─── Calculation engine ───────────────────────────────────────────────────────

function calculate(
  city: CityKey,
  sqm: number,
  autoPrice: boolean,
  manualUSD: number,
  useType: UseType,
  furnished: boolean,
  renov: RenovType
) {
  const cd = CITY_DATA[city];

  const purchase = autoPrice ? sqm * cd.pricePerSqm : Math.max(manualUSD, 0);

  // Closing costs — line-item breakdown
  const closingItems = [
    { en: "Notary fees", es: "Gastos notariales", amt: purchase * SITE_CONFIG.notary_fee_pct },
    { en: "Registration tax", es: "Impuesto de registro", amt: purchase * SITE_CONFIG.transfer_tax_pct },
    { en: "Retention at source (est.)", es: "Retención en la fuente (est.)", amt: purchase * 0.0150 },
    { en: "Attorney fees (est.)", es: "Honorarios de abogado (est.)", amt: purchase * 0.0150 },
    { en: "Certifications & misc.", es: "Certificaciones y varios", amt: purchase * SITE_CONFIG.closing_cost_pct },
    ...(city === "cartagena"
      ? [{ en: "Tourism / municipal fees", es: "Tarifas turísticas / municipales", amt: purchase * 0.0050 }]
      : []),
  ];
  const closingTotal = closingItems.reduce((s, i) => s + i.amt, 0);

  // Renovation range
  const renovRange =
    renov === "none"
      ? { lo: 0, hi: 0 }
      : renov === "basic"
      ? { lo: sqm * cd.renovBasic.lo, hi: sqm * cd.renovBasic.hi }
      : { lo: sqm * cd.renovFull.lo, hi: sqm * cd.renovFull.hi };
  const renovMid = (renovRange.lo + renovRange.hi) / 2;

  // Total capital
  const totalLo = purchase + closingTotal + renovRange.lo;
  const totalHi = purchase + closingTotal + renovRange.hi;
  const totalMid = purchase + closingTotal + renovMid;

  // Rental income
  let baseRent = cd.rent[sizeCategory(sqm)];
  if (useType === "shortterm") baseRent *= cd.shortTermMultiplier;
  if (furnished) baseRent *= cd.furnishedMultiplier;
  const renovRentMultiplier = renov === "full" ? 1.20 : renov === "basic" ? 1.08 : 1.0;
  const monthlyRent = baseRent * renovRentMultiplier;
  const annualRent = monthlyRent * 12;

  // Yield
  const grossYieldPct = useType !== "personal" ? (annualRent / (purchase + closingTotal)) * 100 : null;
  const annualTax = purchase * cd.propertyTaxPct;
  const netYieldPct =
    useType !== "personal" && totalMid > 0
      ? ((annualRent - annualTax) / totalMid) * 100
      : null;

  // Break-even on renovation cost
  const preRenovRent = baseRent; // without renovation multiplier
  const renovBreakEven =
    renov !== "none" && useType !== "personal" && monthlyRent > preRenovRent
      ? Math.ceil(renovMid / (monthlyRent - preRenovRent))
      : null;

  // Visa check
  const visaQualifies = purchase >= VISA_THRESHOLD_USD;
  const visaGapUSD = visaQualifies ? 0 : VISA_THRESHOLD_USD - purchase;

  // 5-year projection (if rental)
  const fiveYearRent = useType !== "personal" ? annualRent * 5 : null;
  const fiveYearTax = annualTax * 5;
  const fiveYearNet = fiveYearRent !== null ? fiveYearRent - fiveYearTax - renovMid : null;

  return {
    purchase, closingItems, closingTotal, renovRange, renovMid,
    totalLo, totalHi, totalMid,
    monthlyRent, annualRent, grossYieldPct, netYieldPct, annualTax,
    renovBreakEven, visaQualifies, visaGapUSD,
    fiveYearRent, fiveYearNet, cd,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CostSimulatorPage() {
  const rawLocale = useLocale();
  const locale = rawLocale === "es" ? "es" : "en";

  const [city, setCity] = useState<CityKey>("medellin");
  const [sqm, setSqm] = useState(65);
  const [autoPrice, setAutoPrice] = useState(true);
  const [manualUSD, setManualUSD] = useState(120000);
  const [useType, setUseType] = useState<UseType>("longterm");
  const [furnished, setFurnished] = useState(false);
  const [renov, setRenov] = useState<RenovType>("none");
  const [currMode, setCurrMode] = useState<CurrencyMode>("usd");

  const r = useMemo(
    () => calculate(city, sqm, autoPrice, manualUSD, useType, furnished, renov),
    [city, sqm, autoPrice, manualUSD, useType, furnished, renov]
  );

  // Format helper respects currency mode
  function fmt(usd: number) {
    return currMode === "cop" ? fmtCOP(usd * FX_COP) : fmtUSD(usd);
  }

  const t = {
    city: locale === "en" ? "City" : "Ciudad",
    propertySize: locale === "en" ? "Property Size (m²)" : "Tamaño del Inmueble (m²)",
    purchasePrice: locale === "en" ? "Purchase Price" : "Precio de Compra",
    autoEstimate: locale === "en" ? "Auto-estimate from city avg" : "Estimado automático del promedio",
    enterManually: locale === "en" ? "Enter price manually" : "Ingresar precio manualmente",
    intendedUse: locale === "en" ? "Intended Use" : "Uso Previsto",
    personal: locale === "en" ? "Personal Residence" : "Residencia Personal",
    longterm: locale === "en" ? "Long-Term Rental" : "Arriendo a Largo Plazo",
    shortterm: locale === "en" ? "Short-Term Rental (Airbnb)" : "Arriendo Corto Plazo (Airbnb)",
    furnished: locale === "en" ? "Furnished" : "Amoblado",
    furnishedNote: locale === "en" ? "+17–20% rental premium" : "+17–20% prima de arriendo",
    renovation: locale === "en" ? "Renovation Scope" : "Alcance de Renovación",
    renovNone: locale === "en" ? "No renovation" : "Sin renovación",
    renovBasic: locale === "en" ? "Basic cosmetic ($100–250/m²)" : "Cosmética básica ($100–250/m²)",
    renovFull: locale === "en" ? "Full renovation ($300–800/m²)" : "Renovación completa ($300–800/m²)",
    currency: locale === "en" ? "Display in" : "Mostrar en",
  };

  // Card section style helper
  const card: React.CSSProperties = {
    background: "var(--card, rgba(255,252,247,0.92))",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm, 18px)",
    overflow: "hidden",
    marginBottom: "16px",
  };

  const cardHead = (label: string, color?: string): React.CSSProperties => ({
    padding: "12px 18px",
    borderBottom: "1px solid var(--border)",
    background: color ? color + "0D" : "var(--sand, #fff8ef)",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: color ?? "var(--muted, #6b7280)",
    fontFamily: "var(--font-body, system-ui)",
  });

  const cardBody: React.CSSProperties = { padding: "16px 18px" };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    background: "#fff",
    fontSize: "0.9rem",
    fontFamily: "var(--font-body, system-ui)",
    color: "var(--charcoal, #23313f)",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.07em",
    textTransform: "uppercase" as const,
    color: "var(--muted)",
    fontFamily: "var(--font-body, system-ui)",
    marginBottom: "6px",
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "8px",
    padding: "8px 0",
    borderBottom: "1px solid rgba(35,49,63,0.06)",
  };

  const resultLabel: React.CSSProperties = {
    fontSize: "0.82rem",
    color: "var(--charcoal)",
    fontFamily: "var(--font-body, system-ui)",
    lineHeight: 1.4,
  };

  const resultValue: React.CSSProperties = {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "var(--ocean, #1f3a4d)",
    fontFamily: "var(--font-body, system-ui)",
    textAlign: "right" as const,
    minWidth: "100px",
  };

  return (
    <div style={{ maxWidth: "var(--max, 1240px)", margin: "0 auto", padding: "40px 20px 100px" }}>

      {/* Page header */}
      <header style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 400,
            color: "var(--ocean, #1f3a4d)",
            margin: "0 0 10px",
            lineHeight: 1.1,
          }}
        >
          {locale === "en" ? "Property Cost Simulator" : "Simulador de Costos de Propiedad"}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.95rem", margin: 0, maxWidth: "600px", lineHeight: 1.6, fontFamily: "var(--font-body, system-ui)" }}>
          {locale === "en"
            ? "Enter your property details to calculate acquisition costs, closing fees, renovation budget, rental income projections, and visa qualification — all in real time."
            : "Ingresa los datos de tu propiedad para calcular costos de adquisición, comisiones de cierre, presupuesto de renovación, proyecciones de ingresos y calificación de visa — en tiempo real."}
        </p>
      </header>

      {/* Disclaimer */}
      <div
        role="note"
        style={{
          padding: "11px 16px",
          background: "rgba(241,196,15,0.08)",
          border: "1px solid rgba(241,196,15,0.30)",
          borderRadius: "var(--radius-sm, 18px)",
          fontSize: "0.78rem",
          color: "var(--cacao, #4a2f1d)",
          marginBottom: "36px",
          lineHeight: 1.6,
          fontFamily: "var(--font-body, system-ui)",
        }}
      >
        {locale === "en"
          ? "All figures are estimates based on city averages (data reviewed March 2026). USD converted at COP 4,100 reference rate. Confirm actual costs with your attorney and notary before any transaction. Not financial or legal advice."
          : "Todos los valores son estimados basados en promedios de ciudad (datos revisados marzo 2026). USD convertido a tasa de referencia COP 4.100. Confirma los costos reales con tu abogado y notaría antes de cualquier transacción. No es asesoría financiera ni legal."}
      </div>

      {/* Two-column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 380px) 1fr",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* ── LEFT: Input panel ────────────────────────────────────────────── */}
        <div>

          {/* Currency toggle */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px", alignItems: "center" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)" }}>
              {t.currency}:
            </span>
            {(["usd", "cop"] as CurrencyMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setCurrMode(m)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "999px",
                  border: "1px solid var(--border)",
                  background: currMode === m ? "var(--ocean, #1f3a4d)" : "transparent",
                  color: currMode === m ? "#fff" : "var(--muted)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "var(--font-body, system-ui)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {m.toUpperCase()}
              </button>
            ))}
            {currMode === "cop" && (
              <span style={{ fontSize: "0.68rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)" }}>
                @\u00a04,100
              </span>
            )}
          </div>

          {/* Property card */}
          <div style={card}>
            <div style={cardHead(locale === "en" ? "Property" : "Propiedad", r.cd.color.replace("var(--", "").split(",")[0])}>
              {locale === "en" ? "Property Details" : "Datos del Inmueble"}
            </div>
            <div style={cardBody}>

              {/* City */}
              <label style={{ ...labelStyle, marginBottom: "6px" }}>{t.city}</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as CityKey)}
                style={{ ...inputStyle, marginBottom: "16px" }}
              >
                {Object.entries(CITY_DATA).map(([k, v]) => (
                  <option key={k} value={k}>{v.name}</option>
                ))}
              </select>

              {/* Size */}
              <label style={labelStyle}>{t.propertySize}</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "4px" }}>
                <input
                  type="range"
                  min={20}
                  max={300}
                  step={5}
                  value={sqm}
                  onChange={(e) => setSqm(Number(e.target.value))}
                  style={{ flex: 1, accentColor: "var(--terracotta, #e67e22)" }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <input
                    type="number"
                    min={20}
                    max={300}
                    value={sqm}
                    onChange={(e) => setSqm(Math.max(20, Math.min(300, Number(e.target.value))))}
                    style={{ ...inputStyle, width: "64px", textAlign: "center" }}
                  />
                  <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)" }}>m²</span>
                </div>
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)", marginBottom: "16px" }}>
                {locale === "en"
                  ? `City avg: $${r.cd.pricePerSqm.toLocaleString()}/m² → auto-estimate $${(sqm * r.cd.pricePerSqm).toLocaleString()}`
                  : `Promedio ciudad: $${r.cd.pricePerSqm.toLocaleString()}/m² → estimado $${(sqm * r.cd.pricePerSqm).toLocaleString()}`}
              </div>

              {/* Purchase price */}
              <label style={labelStyle}>{t.purchasePrice}</label>
              <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                {([true, false] as const).map((isAuto) => (
                  <button
                    key={String(isAuto)}
                    type="button"
                    onClick={() => setAutoPrice(isAuto)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: autoPrice === isAuto ? "var(--ocean, #1f3a4d)" : "transparent",
                      color: autoPrice === isAuto ? "#fff" : "var(--muted)",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "var(--font-body, system-ui)",
                    }}
                  >
                    {isAuto ? t.autoEstimate : t.enterManually}
                  </button>
                ))}
              </div>
              {!autoPrice && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)" }}>USD</span>
                  <input
                    type="number"
                    min={10000}
                    step={5000}
                    value={manualUSD}
                    onChange={(e) => setManualUSD(Math.max(0, Number(e.target.value)))}
                    style={inputStyle}
                  />
                </div>
              )}
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ocean, #1f3a4d)", fontFamily: "var(--font-body, system-ui)", marginTop: "6px" }}>
                {locale === "en" ? "Purchase price used: " : "Precio de compra usado: "}{fmt(r.purchase)}
              </div>
            </div>
          </div>

          {/* Use & Finish card */}
          <div style={card}>
            <div style={cardHead(locale === "en" ? "Use & Finish" : "Uso y Acabado")}>
              {locale === "en" ? "Use & Finish" : "Uso y Acabado"}
            </div>
            <div style={cardBody}>

              <label style={labelStyle}>{t.intendedUse}</label>
              <select
                value={useType}
                onChange={(e) => setUseType(e.target.value as UseType)}
                style={{ ...inputStyle, marginBottom: "16px" }}
              >
                <option value="personal">{t.personal}</option>
                <option value="longterm">{t.longterm}</option>
                <option value="shortterm">{t.shortterm}</option>
              </select>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: furnished ? "rgba(46,204,113,0.06)" : "transparent",
                  transition: "background 0.15s",
                }}
              >
                <input
                  type="checkbox"
                  checked={furnished}
                  onChange={(e) => setFurnished(e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: "var(--emerald-deep, #1f8f59)", cursor: "pointer" }}
                />
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--charcoal)", fontFamily: "var(--font-body, system-ui)" }}>
                    {t.furnished}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)" }}>
                    {t.furnishedNote}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Renovation card */}
          <div style={card}>
            <div style={cardHead(locale === "en" ? "Renovation" : "Renovación")}>
              {locale === "en" ? "Renovation Scope" : "Alcance de Renovación"}
            </div>
            <div style={cardBody}>
              {(
                [
                  { val: "none" as const, label: t.renovNone },
                  { val: "basic" as const, label: t.renovBasic },
                  { val: "full" as const, label: t.renovFull },
                ] as const
              ).map(({ val, label }) => (
                <label
                  key={val}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    background: renov === val ? "rgba(230,126,34,0.06)" : "transparent",
                    marginBottom: val === "full" ? 0 : "8px",
                    transition: "background 0.15s",
                  }}
                >
                  <input
                    type="radio"
                    name="renov"
                    value={val}
                    checked={renov === val}
                    onChange={() => setRenov(val)}
                    style={{ accentColor: "var(--terracotta, #e67e22)", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "0.82rem", color: "var(--charcoal)", fontFamily: "var(--font-body, system-ui)" }}>
                    {label}
                  </span>
                </label>
              ))}
              {renov !== "none" && (
                <div style={{ marginTop: "12px", padding: "10px 12px", background: "rgba(230,126,34,0.06)", borderRadius: "10px", fontSize: "0.78rem", color: "var(--charcoal)", fontFamily: "var(--font-body, system-ui)", lineHeight: 1.5 }}>
                  <strong>{locale === "en" ? "Estimated renovation budget: " : "Presupuesto estimado: "}</strong>
                  {fmt(r.renovRange.lo)} – {fmt(r.renovRange.hi)}
                  {r.renovBreakEven !== null && (
                    <div style={{ marginTop: "4px", color: "var(--muted)" }}>
                      {locale === "en"
                        ? `Break-even on renovation: ~${r.renovBreakEven} months of added rent`
                        : `Recuperación de renovación: ~${r.renovBreakEven} meses de arriendo adicional`}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Results panel ──────────────────────────────────────────── */}
        <div style={{ position: "sticky", top: "88px" }}>

          {/* Summary banner */}
          <div
            style={{
              background: `linear-gradient(135deg, ${r.cd.color}18 0%, rgba(31,58,77,0.06) 100%)`,
              border: `1px solid ${r.cd.color}40`,
              borderRadius: "var(--radius, 26px)",
              padding: "28px",
              marginBottom: "20px",
              borderTop: `4px solid ${r.cd.color}`,
            }}
          >
            <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)", marginBottom: "16px" }}>
              {CITY_DATA[city].name} · {sqm}m² · {locale === "en" ? "Summary" : "Resumen"}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {/* Total capital */}
              <div>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)", marginBottom: "4px" }}>
                  {locale === "en" ? "Total Capital Required" : "Capital Total Requerido"}
                </div>
                <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--ocean, #1f3a4d)", fontFamily: "var(--font-body, system-ui)", lineHeight: 1 }}>
                  {renov !== "none" ? `${fmt(r.totalLo)}–` : fmt(r.totalMid)}
                </div>
                {renov !== "none" && (
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--ocean, #1f3a4d)", fontFamily: "var(--font-body, system-ui)" }}>
                    {fmt(r.totalHi)}
                  </div>
                )}
                <div style={{ fontSize: "0.68rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)", marginTop: "2px" }}>
                  {locale === "en" ? "purchase + closing" : "compra + cierre"}
                  {renov !== "none" ? (locale === "en" ? " + renovation" : " + renovación") : ""}
                </div>
              </div>

              {/* Monthly rent / use label */}
              <div>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)", marginBottom: "4px" }}>
                  {useType === "personal"
                    ? (locale === "en" ? "Property Use" : "Uso del Inmueble")
                    : (locale === "en" ? "Est. Monthly Rent" : "Arriendo Mensual Est.")}
                </div>
                {useType !== "personal" ? (
                  <>
                    <div style={{ fontSize: "1.6rem", fontWeight: 700, color: r.cd.color, fontFamily: "var(--font-body, system-ui)", lineHeight: 1 }}>
                      {fmt(r.monthlyRent)}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)", marginTop: "2px" }}>
                      {useType === "shortterm"
                        ? (locale === "en" ? "short-term avg occupancy est." : "est. ocupación prom. corto plazo")
                        : (locale === "en" ? "long-term market rate" : "tarifa de mercado largo plazo")}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--ocean, #1f3a4d)", fontFamily: "var(--font-body, system-ui)" }}>
                    {locale === "en" ? "Personal Residence" : "Residencia Personal"}
                  </div>
                )}
              </div>

              {/* Gross yield */}
              {r.grossYieldPct !== null && (
                <div>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)", marginBottom: "4px" }}>
                    {locale === "en" ? "Gross Yield" : "Rentabilidad Bruta"}
                  </div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--emerald-deep, #1f8f59)", fontFamily: "var(--font-body, system-ui)", lineHeight: 1 }}>
                    {fmtPct(r.grossYieldPct)}
                  </div>
                  {r.netYieldPct !== null && (
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)", marginTop: "2px" }}>
                      {locale === "en" ? `Net (after tax): ${fmtPct(r.netYieldPct)}` : `Neto (después de impuesto): ${fmtPct(r.netYieldPct)}`}
                    </div>
                  )}
                </div>
              )}

              {/* Visa qualification */}
              <div>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)", marginBottom: "4px" }}>
                  {locale === "en" ? "M-Inversionista Visa" : "Visa M-Inversionista"}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    background: r.visaQualifies ? "rgba(31,143,89,0.12)" : "rgba(230,126,34,0.12)",
                    border: `1px solid ${r.visaQualifies ? "rgba(31,143,89,0.30)" : "rgba(230,126,34,0.30)"}`,
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: r.visaQualifies ? "var(--emerald-deep, #1f8f59)" : "var(--terracotta, #e67e22)",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: r.visaQualifies ? "var(--emerald-deep, #1f8f59)" : "var(--terracotta, #e67e22)", fontFamily: "var(--font-body, system-ui)" }}>
                    {r.visaQualifies
                      ? (locale === "en" ? "Qualifies" : "Califica")
                      : (locale === "en" ? "Does Not Qualify" : "No Califica")}
                  </span>
                </div>
                {!r.visaQualifies && r.visaGapUSD > 0 && (
                  <div style={{ fontSize: "0.68rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)", marginTop: "4px" }}>
                    {locale === "en"
                      ? `${fmt(r.visaGapUSD)} below the $149,467 threshold`
                      : `${fmt(r.visaGapUSD)} por debajo del umbral de $149.467`}
                  </div>
                )}
                {r.visaQualifies && (
                  <div style={{ fontSize: "0.68rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)", marginTop: "4px" }}>
                    {locale === "en" ? "350 SMLMV threshold met" : "Umbral de 350 SMLMV cumplido"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Acquisition breakdown */}
          <div style={card}>
            <div style={cardHead(locale === "en" ? "Acquisition Breakdown" : "Desglose de Adquisición")}>
              {locale === "en" ? "Acquisition Breakdown" : "Desglose de Adquisición"}
            </div>
            <div style={cardBody}>
              <div style={{ ...rowStyle, fontWeight: 700 }}>
                <span style={resultLabel}>{locale === "en" ? "Purchase price" : "Precio de compra"}</span>
                <span style={resultValue}>{fmt(r.purchase)}</span>
              </div>
              {r.closingItems.map((item, i) => (
                <div key={i} style={rowStyle}>
                  <span style={{ ...resultLabel, color: "var(--muted)", fontSize: "0.78rem" }}>
                    {locale === "en" ? item.en : item.es}
                  </span>
                  <span style={{ ...resultValue, fontWeight: 500, fontSize: "0.78rem" }}>{fmt(item.amt)}</span>
                </div>
              ))}
              <div style={{ ...rowStyle, borderBottom: "none", fontWeight: 700, paddingTop: "12px" }}>
                <span style={resultLabel}>{locale === "en" ? "Total closing costs" : "Total costos de cierre"}</span>
                <span style={resultValue}>{fmt(r.closingTotal)}</span>
              </div>
              <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "2px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ ...resultLabel, fontWeight: 700 }}>{locale === "en" ? "Subtotal (acquisition)" : "Subtotal (adquisición)"}</span>
                <span style={{ ...resultValue, fontSize: "1rem" }}>{fmt(r.purchase + r.closingTotal)}</span>
              </div>
            </div>
          </div>

          {/* Renovation */}
          {renov !== "none" && (
            <div style={card}>
              <div style={cardHead(locale === "en" ? "Renovation Budget" : "Presupuesto de Renovación")}>
                {locale === "en" ? "Renovation Budget" : "Presupuesto de Renovación"}
              </div>
              <div style={cardBody}>
                <div style={rowStyle}>
                  <span style={resultLabel}>{locale === "en" ? "Scope" : "Alcance"}</span>
                  <span style={{ ...resultValue, fontWeight: 600 }}>
                    {renov === "basic"
                      ? (locale === "en" ? "Basic cosmetic" : "Cosmética básica")
                      : (locale === "en" ? "Full renovation" : "Renovación completa")}
                  </span>
                </div>
                <div style={rowStyle}>
                  <span style={resultLabel}>{locale === "en" ? "Low estimate" : "Estimado bajo"}</span>
                  <span style={resultValue}>{fmt(r.renovRange.lo)}</span>
                </div>
                <div style={{ ...rowStyle, borderBottom: "none" }}>
                  <span style={resultLabel}>{locale === "en" ? "High estimate" : "Estimado alto"}</span>
                  <span style={resultValue}>{fmt(r.renovRange.hi)}</span>
                </div>
                {furnished && (
                  <div style={{ marginTop: "10px", padding: "8px 0", borderTop: "1px solid var(--border)", fontSize: "0.78rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)" }}>
                    {locale === "en"
                      ? "+ Furniture budget: $4,000–$12,000 (not included above — varies by style)"
                      : "+ Presupuesto de muebles: $4.000–$12.000 (no incluido — varía según estilo)"}
                  </div>
                )}
                <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "2px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ ...resultLabel, fontWeight: 700 }}>{locale === "en" ? "Total all-in (mid est.)" : "Total todo incluido (est. medio)"}</span>
                  <span style={{ ...resultValue, fontSize: "1rem" }}>{fmt(r.totalMid)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Rental projection */}
          {useType !== "personal" && (
            <div style={card}>
              <div style={cardHead(locale === "en" ? "Rental Income Projection" : "Proyección de Ingresos de Arriendo")}>
                {locale === "en" ? "Rental Income Projection" : "Proyección de Ingresos de Arriendo"}
              </div>
              <div style={cardBody}>
                <div style={rowStyle}>
                  <span style={resultLabel}>{locale === "en" ? "Monthly rent (est.)" : "Arriendo mensual (est.)"}</span>
                  <span style={resultValue}>{fmt(r.monthlyRent)}</span>
                </div>
                <div style={rowStyle}>
                  <span style={resultLabel}>{locale === "en" ? "Annual rental income" : "Ingreso anual de arriendo"}</span>
                  <span style={resultValue}>{fmt(r.annualRent)}</span>
                </div>
                <div style={rowStyle}>
                  <span style={resultLabel}>{locale === "en" ? "Annual property tax (est.)" : "Impuesto predial anual (est.)"}</span>
                  <span style={{ ...resultValue, color: "var(--muted)", fontWeight: 500 }}>−{fmt(r.annualTax)}</span>
                </div>
                <div style={rowStyle}>
                  <span style={{ ...resultLabel, fontWeight: 700 }}>{locale === "en" ? "Annual net income (est.)" : "Ingreso neto anual (est.)"}</span>
                  <span style={{ ...resultValue, color: "var(--emerald-deep, #1f8f59)" }}>{fmt(r.annualRent - r.annualTax)}</span>
                </div>
                {r.grossYieldPct !== null && (
                  <div style={{ ...rowStyle, borderBottom: "none" }}>
                    <span style={resultLabel}>{locale === "en" ? "Gross yield" : "Rentabilidad bruta"}</span>
                    <span style={{ ...resultValue, color: "var(--emerald-deep, #1f8f59)", fontSize: "1rem" }}>{fmtPct(r.grossYieldPct)}</span>
                  </div>
                )}
                {r.fiveYearNet !== null && (
                  <div style={{ marginTop: "12px", padding: "12px", background: "rgba(31,143,89,0.06)", borderRadius: "10px", fontSize: "0.78rem", color: "var(--charcoal)", fontFamily: "var(--font-body, system-ui)", lineHeight: 1.5 }}>
                    <strong>{locale === "en" ? "5-year net income est. (rent − tax − renovation): " : "Ingreso neto 5 años est. (arriendo − impuesto − renovación): "}</strong>
                    {fmt(r.fiveYearNet)}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Annual holding costs */}
          <div style={card}>
            <div style={cardHead(locale === "en" ? "Annual Holding Costs" : "Costos Anuales de Tenencia")}>
              {locale === "en" ? "Annual Holding Costs" : "Costos Anuales de Tenencia"}
            </div>
            <div style={cardBody}>
              <div style={rowStyle}>
                <div>
                  <div style={resultLabel}>{locale === "en" ? "Property tax (predial)" : "Impuesto predial"}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)" }}>
                    {(r.cd.propertyTaxPct * 100).toFixed(2)}%{" "}
                    {locale === "en" ? "of cadastral value (est.)" : "del valor catastral (est.)"}
                  </div>
                </div>
                <span style={resultValue}>{fmt(r.annualTax)}</span>
              </div>
              <div style={{ ...rowStyle, borderBottom: "none" }}>
                <div>
                  <div style={resultLabel}>
                    {locale === "en" ? "Administration fee (if applicable)" : "Cuota de administración (si aplica)"}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)" }}>
                    {locale === "en"
                      ? "Varies by building — budget $80–$300/month for apartments"
                      : "Varía por edificio — presupuesta $80–$300/mes para apartamentos"}
                  </div>
                </div>
                <span style={{ ...resultValue, fontWeight: 500, color: "var(--muted)" }}>
                  {locale === "en" ? "Confirm with seller" : "Confirmar con vendedor"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer CTAs */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "8px" }}>
            <Link href="/listings" className="btn btn-primary" style={{ flex: 1, textAlign: "center" }}>
              {locale === "en" ? "Browse Vetted Listings →" : "Ver Listados Verificados →"}
            </Link>
            <Link href="/relocation" className="btn btn-secondary" style={{ flex: 1, textAlign: "center" }}>
              {locale === "en" ? "Relocation Guide →" : "Guía de Reubicación →"}
            </Link>
          </div>
        </div>
      </div>

      {/* Responsive override — stack on narrow screens */}
      <style>{`
        @media (max-width: 760px) {
          .cost-sim-grid { grid-template-columns: 1fr !important; }
          .cost-sim-sticky { position: static !important; }
        }
      `}</style>
    </div>
  );
}
