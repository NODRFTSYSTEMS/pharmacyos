"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useLocale } from "next-intl";
import { CITIES } from "@/data/cities.data";
import type { City } from "@/types/cities";

const ColombiaMap = dynamic(
  () => import("@/components/map/ColombiaMap").then((m) => m.ColombiaMap),
  { ssr: false }
);

function DetailPanel({
  city,
  locale,
  onClose,
}: {
  city: City;
  locale: string;
  onClose: () => void;
}) {
  const loc = locale === "es" ? "es" : "en";
  const m = city.metrics;

  return (
    <aside
      aria-label={`Details for ${city.name}`}
      style={{
        width: "360px",
        flexShrink: 0,
        background: "var(--card, rgba(255,252,247,0.95))",
        borderLeft: "1px solid var(--border, rgba(35,49,63,0.1))",
        height: "620px",
        overflowY: "auto",
        padding: "28px 24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display, Georgia, serif)",
              fontSize: "1.35rem",
              fontWeight: 400,
              color: city.markerColor,
              margin: "0 0 4px",
            }}
          >
            {city.name}
          </h2>
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--muted, #6b7280)",
              margin: 0,
              fontFamily: "var(--font-body, system-ui)",
            }}
          >
            {city.department} · {city.elevationM.toLocaleString()} m · {city.region[loc]}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close city details"
          style={{
            background: "none",
            border: "none",
            fontSize: "1.4rem",
            cursor: "pointer",
            color: "var(--muted, #6b7280)",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ×
        </button>
      </div>

      {city.isHeritageVillage && (
        <span
          style={{
            display: "inline-block",
            fontSize: "0.68rem",
            fontWeight: 700,
            background: "var(--cacao, #4a2f1d)",
            color: "#fff",
            padding: "3px 10px",
            borderRadius: "999px",
            letterSpacing: "0.05em",
            fontFamily: "var(--font-body, system-ui)",
            textTransform: "uppercase",
            marginBottom: "14px",
          }}
        >
          {loc === "es" ? "Pueblo Patrimonio" : "Heritage Village"}
        </span>
      )}

      <p
        style={{
          fontFamily: "var(--font-display, Georgia, serif)",
          fontSize: "0.92rem",
          fontStyle: "italic",
          color: "var(--charcoal, #23313f)",
          margin: "0 0 12px",
        }}
      >
        &ldquo;{city.tagline[loc]}&rdquo;
      </p>

      <p
        style={{
          fontSize: "0.85rem",
          lineHeight: 1.65,
          color: "var(--charcoal, #23313f)",
          margin: "0 0 18px",
          fontFamily: "var(--font-body, system-ui)",
        }}
      >
        {city.description[loc]}
      </p>

      {/* Population */}
      <section style={{ marginBottom: "16px" }}>
        <h3 style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--ocean, #1f3a4d)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px", fontFamily: "var(--font-body, system-ui)" }}>
          {loc === "es" ? "Población" : "Population"}
        </h3>
        <div style={{ fontSize: "0.83rem", color: "var(--charcoal, #23313f)", fontFamily: "var(--font-body, system-ui)", lineHeight: 1.6 }}>
          <div>{loc === "es" ? "Ciudad" : "City"}: <strong>{city.populationCity.toLocaleString()}</strong></div>
          {city.populationMetro && <div>{loc === "es" ? "Metro" : "Metro area"}: <strong>{city.populationMetro.toLocaleString()}</strong></div>}
          <div style={{ fontSize: "0.7rem", color: "var(--muted, #6b7280)", marginTop: "2px" }}>{city.populationSource}, {city.populationYear}</div>
        </div>
      </section>

      {/* RE Metrics */}
      {(m.pricePerSqmUSD || m.metricsNote) && (
        <section style={{ marginBottom: "16px" }}>
          <h3 style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--ocean, #1f3a4d)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px", fontFamily: "var(--font-body, system-ui)" }}>
            {loc === "es" ? "Bienes Raíces" : "Real Estate"}
          </h3>
          {m.pricePerSqmUSD ? (
            <div style={{ fontSize: "0.83rem", fontFamily: "var(--font-body, system-ui)" }}>
              {[
                { label: loc === "es" ? "Precio/m²" : "Price/sqm", value: m.pricePerSqmUSD ? `$${m.pricePerSqmUSD.toLocaleString()}` : null },
                { label: loc === "es" ? "Rendimiento" : "Gross yield", value: m.grossRentalYield ? `${m.grossRentalYield}%` : null },
                { label: loc === "es" ? "Renta prom." : "Avg rent", value: m.avgRent2BR ? `$${m.avgRent2BR.toLocaleString()}/mo` : null },
              ].filter((r) => r.value).map((r) => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--border, rgba(35,49,63,0.07))" }}>
                  <span style={{ color: "var(--muted, #6b7280)" }}>{r.label}</span>
                  <span style={{ fontWeight: 600 }}>{r.value}</span>
                </div>
              ))}
              {m.metricsNote && <p style={{ fontSize: "0.7rem", color: "var(--muted, #6b7280)", margin: "6px 0 0", fontStyle: "italic" }}>* {m.metricsNote[loc]}</p>}
            </div>
          ) : (
            <p style={{ fontSize: "0.83rem", color: "var(--charcoal, #23313f)", lineHeight: 1.55, fontFamily: "var(--font-body, system-ui)" }}>{m.metricsNote?.[loc]}</p>
          )}
        </section>
      )}

      {/* Why it matters */}
      <section style={{ marginBottom: "16px" }}>
        <h3 style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--ocean, #1f3a4d)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px", fontFamily: "var(--font-body, system-ui)" }}>
          {loc === "es" ? "Por Qué Importa" : "Why It Matters"}
        </h3>
        <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
          {city.whyItMatters[loc].map((item) => (
            <li key={item} style={{ fontSize: "0.82rem", color: "var(--charcoal, #23313f)", marginBottom: "4px", lineHeight: 1.5, fontFamily: "var(--font-body, system-ui)" }}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Nicknames */}
      {city.nicknames.length > 0 && (
        <section style={{ marginBottom: "16px" }}>
          <h3 style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--ocean, #1f3a4d)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px", fontFamily: "var(--font-body, system-ui)" }}>
            {loc === "es" ? "Apodos" : "Nicknames"}
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {city.nicknames.map((n) => (
              <span key={n} style={{ fontSize: "0.7rem", padding: "3px 9px", borderRadius: "999px", background: `${city.markerColor}18`, color: city.markerColor, fontFamily: "var(--font-body, system-ui)", fontWeight: 500 }}>
                {n}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Neighborhoods */}
      {city.neighborhoods.length > 0 && (
        <section style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--ocean, #1f3a4d)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px", fontFamily: "var(--font-body, system-ui)" }}>
            {loc === "es" ? "Barrios" : "Neighborhoods"}
          </h3>
          <div style={{ fontSize: "0.82rem", color: "var(--charcoal, #23313f)", fontFamily: "var(--font-body, system-ui)" }}>
            {city.neighborhoods.join(" · ")}
          </div>
        </section>
      )}

      {/* CTAs */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <a href="/listings" style={{ display: "block", background: city.markerColor, color: "#fff", textAlign: "center", padding: "10px", borderRadius: "10px", textDecoration: "none", fontSize: "0.83rem", fontWeight: 600, fontFamily: "var(--font-body, system-ui)" }}>
          {loc === "es" ? `Propiedades en ${city.name}` : `Listings in ${city.name}`}
        </a>
        <a href="/relocation" style={{ display: "block", background: "transparent", color: "var(--ocean, #1f3a4d)", textAlign: "center", padding: "10px", borderRadius: "10px", textDecoration: "none", fontSize: "0.83rem", fontWeight: 600, border: "1px solid var(--border, rgba(35,49,63,0.15))", fontFamily: "var(--font-body, system-ui)" }}>
          {loc === "es" ? "Guía de reubicación" : "Relocation guide"}
        </a>
      </div>
    </aside>
  );
}

export default function MapPage() {
  const locale = useLocale();
  const loc = locale === "es" ? "es" : "en";
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedCity = CITIES.find((c) => c.id === selectedId) ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Header strip */}
      <div
        style={{
          background: "var(--ocean, #1f3a4d)",
          color: "#fff",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexShrink: 0,
        }}
      >
        <div>
          <h1 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.05rem", fontWeight: 400, margin: 0 }}>
            {loc === "es" ? "Mapa de Colombia" : "Colombia Map"}
          </h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", margin: "2px 0 0", fontFamily: "var(--font-body, system-ui)" }}>
            {loc === "es"
              ? "Haz clic en una ciudad para ver su perfil"
              : "Click any city to view its profile"}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {CITIES.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedId(city.id)}
              title={city.name}
              aria-label={city.name}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: city.markerColor,
                border: selectedId === city.id ? "2.5px solid #fff" : "2px solid transparent",
                cursor: "pointer",
                transition: "transform 0.1s",
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Map + panel */}
      <div style={{ display: "flex", minHeight: "620px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <ColombiaMap
            cities={CITIES}
            selectedCityId={selectedId}
            onCitySelect={setSelectedId}
            height="620px"
          />
        </div>
        {selectedCity ? (
          <DetailPanel city={selectedCity} locale={loc} onClose={() => setSelectedId(null)} />
        ) : (
          <div
            style={{
              width: "280px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--sand, #fff8ef)",
              borderLeft: "1px solid var(--border, rgba(35,49,63,0.1))",
            }}
          >
            <p
              style={{
                fontSize: "0.87rem",
                color: "var(--muted, #6b7280)",
                textAlign: "center",
                padding: "0 20px",
                lineHeight: 1.6,
                fontFamily: "var(--font-body, system-ui)",
              }}
            >
              {loc === "es"
                ? "Selecciona una ciudad en el mapa para ver su perfil completo."
                : "Select a city on the map to view its full profile."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
