"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useLocale } from "next-intl";
import { CITIES } from "@/data/cities.data";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { EmailCapture } from "@/components/EmailCapture";
import { WeatherBadge } from "@/components/WeatherBadge";
import type { City } from "@/types/cities";

const ColombiaMap = dynamic(
  () => import("@/components/map/ColombiaMap").then((m) => m.ColombiaMap),
  { ssr: false }
);

type View = "list" | "map" | "compare";

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 0",
        borderBottom: "1px solid var(--border, rgba(35,49,63,0.07))",
        fontSize: "0.83rem",
        fontFamily: "var(--font-body, system-ui)",
      }}
    >
      <span style={{ color: "var(--muted, #6b7280)" }}>{label}</span>
      <span style={{ color: "var(--charcoal, #23313f)", fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function CityCard({
  city,
  locale,
  selected,
  onSelect,
}: {
  city: City;
  locale: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const loc = locale === "es" ? "es" : "en";
  const m = city.metrics;

  return (
    <article
      onClick={onSelect}
      style={{
        background: selected ? "var(--sand, #fff8ef)" : "var(--card, rgba(255,252,247,0.92))",
        border: selected
          ? `2px solid ${city.markerColor}`
          : "1px solid var(--border, rgba(35,49,63,0.1))",
        borderRadius: "var(--radius-sm, 18px)",
        padding: "24px",
        cursor: "pointer",
        transition: "box-shadow 0.15s, border 0.15s",
        boxShadow: selected ? `0 4px 20px ${city.markerColor}30` : "none",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: city.markerColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1rem",
            fontFamily: "var(--font-body, system-ui)",
            flexShrink: 0,
          }}
        >
          {city.name.charAt(0)}
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <h2
              style={{
                fontFamily: "var(--font-display, Georgia, serif)",
                fontSize: "1.2rem",
                fontWeight: 400,
                color: "var(--ocean, #1f3a4d)",
                margin: 0,
              }}
            >
              {city.name}
            </h2>
            {city.isHeritageVillage && (
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  background: "var(--cacao, #4a2f1d)",
                  color: "#fff",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  letterSpacing: "0.05em",
                  fontFamily: "var(--font-body, system-ui)",
                  textTransform: "uppercase",
                }}
              >
                {loc === "es" ? "Pueblo Patrimonio" : "Heritage Village"}
              </span>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              fontSize: "0.78rem",
              color: "var(--muted, #6b7280)",
              fontFamily: "var(--font-body, system-ui)",
            }}
          >
            <span>{city.department} · {city.elevationM.toLocaleString()} m</span>
            <WeatherBadge lat={city.lat} lng={city.lng} avgTempC={city.avgTempC} locale={loc} />
          </div>
        </div>
      </div>

      {/* Tagline */}
      <p
        style={{
          fontFamily: "var(--font-display, Georgia, serif)",
          fontSize: "0.92rem",
          color: "var(--charcoal, #23313f)",
          margin: "0 0 12px",
          fontStyle: "italic",
        }}
      >
        &ldquo;{city.tagline[loc]}&rdquo;
      </p>

      {/* Description */}
      <p
        style={{
          fontSize: "0.84rem",
          color: "var(--charcoal, #23313f)",
          lineHeight: 1.6,
          margin: "0 0 16px",
          fontFamily: "var(--font-body, system-ui)",
        }}
      >
        {city.description[loc]}
      </p>

      {/* Metrics */}
      {m.pricePerSqmUSD ? (
        <div style={{ marginBottom: "12px" }}>
          <MetricRow
            label={loc === "es" ? "Precio/m²" : "Price/sqm"}
            value={`$${m.pricePerSqmUSD.toLocaleString()} USD`}
          />
          {m.grossRentalYield && (
            <MetricRow
              label={loc === "es" ? "Rendimiento bruto" : "Gross yield"}
              value={`${m.grossRentalYield}%`}
            />
          )}
          {m.avgRent2BR && (
            <MetricRow
              label={loc === "es" ? "Renta prom. 2 hab." : "Avg. 2BR rent"}
              value={`$${m.avgRent2BR.toLocaleString()} USD/mo`}
            />
          )}
          {m.costOfLiving && (
            <MetricRow
              label={loc === "es" ? "Costo de vida est." : "Est. cost of living"}
              value={m.costOfLiving}
            />
          )}
          {m.metricsNote && (
            <p
              style={{
                fontSize: "0.72rem",
                color: "var(--muted, #6b7280)",
                margin: "8px 0 0",
                fontStyle: "italic",
                fontFamily: "var(--font-body, system-ui)",
              }}
            >
              * {m.metricsNote[loc]}
            </p>
          )}
        </div>
      ) : m.metricsNote ? (
        <div
          style={{
            background: "var(--sand, #fff8ef)",
            borderRadius: "10px",
            padding: "10px 14px",
            marginBottom: "12px",
            fontSize: "0.78rem",
            color: "var(--charcoal, #23313f)",
            fontFamily: "var(--font-body, system-ui)",
            lineHeight: 1.5,
          }}
        >
          {m.metricsNote[loc]}
        </div>
      ) : null}

      {/* Nicknames */}
      {city.nicknames.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {city.nicknames.map((n) => (
            <span
              key={n}
              style={{
                fontSize: "0.7rem",
                padding: "3px 10px",
                borderRadius: "999px",
                background: `${city.markerColor}18`,
                color: city.markerColor,
                fontFamily: "var(--font-body, system-ui)",
                fontWeight: 500,
              }}
            >
              {n}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

function CompareTable({ cities, locale }: { cities: City[]; locale: string }) {
  const loc = locale === "es" ? "es" : "en";
  if (cities.length < 2) {
    return (
      <p style={{ color: "var(--muted, #6b7280)", textAlign: "center", padding: "40px 0" }}>
        {loc === "es"
          ? "Selecciona 2–3 ciudades de la lista para comparar."
          : "Select 2–3 cities from the list to compare."}
      </p>
    );
  }

  const rows: { label: { en: string; es: string }; getValue: (c: City) => string }[] = [
    {
      label: { en: "Department", es: "Departamento" },
      getValue: (c) => c.department,
    },
    {
      label: { en: "Elevation", es: "Elevación" },
      getValue: (c) => `${c.elevationM.toLocaleString()} m`,
    },
    {
      label: { en: "Population (city)", es: "Población (ciudad)" },
      getValue: (c) => c.populationCity.toLocaleString(),
    },
    {
      label: { en: "Climate", es: "Clima" },
      getValue: (c) => c.climate[loc],
    },
    {
      label: { en: "Price/sqm (USD)", es: "Precio/m² (USD)" },
      getValue: (c) => (c.metrics.pricePerSqmUSD ? `$${c.metrics.pricePerSqmUSD.toLocaleString()}` : "—"),
    },
    {
      label: { en: "Gross yield", es: "Rendimiento bruto" },
      getValue: (c) => (c.metrics.grossRentalYield ? `${c.metrics.grossRentalYield}%` : "—"),
    },
    {
      label: { en: "Avg 2BR rent/mo", es: "Renta prom. 2 hab./mes" },
      getValue: (c) =>
        c.metrics.avgRent2BR ? `$${c.metrics.avgRent2BR.toLocaleString()} USD` : "—",
    },
    {
      label: { en: "Cost of living", es: "Costo de vida" },
      getValue: (c) => c.metrics.costOfLiving ?? "—",
    },
    {
      label: { en: "Key industries", es: "Industrias clave" },
      getValue: (c) => c.keyIndustries[loc].slice(0, 3).join(", "),
    },
  ];

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "var(--font-body, system-ui)",
          fontSize: "0.84rem",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                padding: "10px 14px",
                color: "var(--muted, #6b7280)",
                fontWeight: 500,
                borderBottom: "2px solid var(--border, rgba(35,49,63,0.12))",
                whiteSpace: "nowrap",
              }}
            >
              {loc === "es" ? "Característica" : "Feature"}
            </th>
            {cities.map((c) => (
              <th
                key={c.id}
                style={{
                  textAlign: "center",
                  padding: "10px 14px",
                  color: c.markerColor,
                  fontWeight: 700,
                  borderBottom: "2px solid var(--border, rgba(35,49,63,0.12))",
                  whiteSpace: "nowrap",
                }}
              >
                {c.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label.en}>
              <td
                style={{
                  padding: "9px 14px",
                  color: "var(--muted, #6b7280)",
                  borderBottom: "1px solid var(--border, rgba(35,49,63,0.07))",
                  whiteSpace: "nowrap",
                }}
              >
                {row.label[loc]}
              </td>
              {cities.map((c) => (
                <td
                  key={c.id}
                  style={{
                    padding: "9px 14px",
                    textAlign: "center",
                    color: "var(--charcoal, #23313f)",
                    borderBottom: "1px solid var(--border, rgba(35,49,63,0.07))",
                  }}
                >
                  {row.getValue(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CitiesPage() {
  const locale = useLocale();
  const loc = locale === "es" ? "es" : "en";

  const [view, setView] = useState<View>("list");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());

  const filteredCities = useMemo(() => {
    if (!query.trim()) return CITIES;
    const q = query.toLowerCase();
    return CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.nicknames.some((n) => n.toLowerCase().includes(q)) ||
        c.region[loc].toLowerCase().includes(q)
    );
  }, [query, loc]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 3) {
        next.add(id);
      }
      return next;
    });
  };

  const compareCities = CITIES.filter((c) => compareIds.has(c.id));
  const selectedCity = CITIES.find((c) => c.id === selectedId) ?? null;

  const viewBtn = (v: View, label: string) => (
    <button
      onClick={() => setView(v)}
      aria-pressed={view === v}
      style={{
        padding: "8px 18px",
        borderRadius: "999px",
        border: "1px solid var(--border, rgba(35,49,63,0.15))",
        background: view === v ? "var(--ocean, #1f3a4d)" : "transparent",
        color: view === v ? "#fff" : "var(--charcoal, #23313f)",
        fontSize: "0.82rem",
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "var(--font-body, system-ui)",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ minHeight: "80vh", background: "var(--cream, #fdf5e6)" }}>
      {/* Page header */}
      <section
        style={{
          maxWidth: "var(--max, 1240px)",
          margin: "0 auto",
          padding: "60px 24px 32px",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 400,
            color: "var(--ocean, #1f3a4d)",
            margin: "0 0 12px",
          }}
        >
          {loc === "es" ? "Ciudades de Colombia" : "Cities of Colombia"}
        </h1>
        <p
          style={{
            fontSize: "1.05rem",
            color: "var(--muted, #6b7280)",
            maxWidth: "600px",
            margin: "0 0 32px",
            lineHeight: 1.6,
            fontFamily: "var(--font-body, system-ui)",
          }}
        >
          {loc === "es"
            ? "Explora 7 ciudades con datos de población verificados, métricas de bienes raíces y perfiles de calidad de vida."
            : "Explore 7 cities with verified population data, real estate metrics, and quality-of-life profiles."}
        </p>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          {/* Search */}
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={loc === "es" ? "Buscar ciudad…" : "Search cities…"}
            aria-label={loc === "es" ? "Buscar ciudades" : "Search cities"}
            style={{
              padding: "9px 16px",
              borderRadius: "999px",
              border: "1px solid var(--border, rgba(35,49,63,0.15))",
              fontSize: "0.87rem",
              fontFamily: "var(--font-body, system-ui)",
              color: "var(--charcoal, #23313f)",
              background: "#fff",
              minWidth: "200px",
              outline: "none",
            }}
          />
          {/* View toggle */}
          <div style={{ display: "flex", gap: "6px" }}>
            {viewBtn("list", loc === "es" ? "Lista" : "List")}
            {viewBtn("map", loc === "es" ? "Mapa" : "Map")}
            {viewBtn("compare", loc === "es" ? "Comparar" : "Compare")}
          </div>
        </div>

        {view === "compare" && (
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--muted, #6b7280)",
              margin: "4px 0 0",
              fontFamily: "var(--font-body, system-ui)",
            }}
          >
            {loc === "es"
              ? `Selecciona hasta 3 ciudades para comparar (${compareIds.size}/3 seleccionadas).`
              : `Select up to 3 cities to compare (${compareIds.size}/3 selected).`}
          </p>
        )}
      </section>

      {/* Map view */}
      {view === "map" && (
        <section
          style={{
            maxWidth: "var(--max, 1240px)",
            margin: "0 auto",
            padding: "0 24px 60px",
            display: "grid",
            gridTemplateColumns: selectedCity ? "1fr 360px" : "1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <ColombiaMap
            cities={CITIES}
            selectedCityId={selectedId}
            onCitySelect={setSelectedId}
            height="560px"
          />
          {selectedCity && (
            <div
              style={{
                background: "var(--card, rgba(255,252,247,0.92))",
                border: "1px solid var(--border, rgba(35,49,63,0.1))",
                borderRadius: "var(--radius-sm, 18px)",
                padding: "24px",
                position: "sticky",
                top: "80px",
              }}
            >
              <button
                onClick={() => setSelectedId(null)}
                aria-label="Close city panel"
                style={{
                  float: "right",
                  background: "none",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  color: "var(--muted, #6b7280)",
                }}
              >
                ×
              </button>
              <h2
                style={{
                  fontFamily: "var(--font-display, Georgia, serif)",
                  fontSize: "1.3rem",
                  fontWeight: 400,
                  color: selectedCity.markerColor,
                  margin: "0 0 4px",
                }}
              >
                {selectedCity.name}
              </h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                  fontSize: "0.8rem",
                  color: "var(--muted, #6b7280)",
                  margin: "0 0 12px",
                  fontFamily: "var(--font-body, system-ui)",
                }}
              >
                <span>{selectedCity.department} · {selectedCity.elevationM.toLocaleString()} m</span>
                <WeatherBadge lat={selectedCity.lat} lng={selectedCity.lng} avgTempC={selectedCity.avgTempC} locale={loc} />
              </div>
              <p
                style={{
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  color: "var(--charcoal, #23313f)",
                  margin: "0 0 16px",
                  fontFamily: "var(--font-body, system-ui)",
                }}
              >
                {selectedCity.description[loc]}
              </p>
              <div style={{ marginBottom: "12px" }}>
                <MetricRow
                  label={loc === "es" ? "Población" : "Population"}
                  value={selectedCity.populationCity.toLocaleString()}
                />
                {selectedCity.metrics.pricePerSqmUSD && (
                  <MetricRow
                    label={loc === "es" ? "Precio/m²" : "Price/sqm"}
                    value={`$${selectedCity.metrics.pricePerSqmUSD.toLocaleString()} USD`}
                  />
                )}
                {selectedCity.metrics.grossRentalYield && (
                  <MetricRow
                    label={loc === "es" ? "Rendimiento bruto" : "Gross yield"}
                    value={`${selectedCity.metrics.grossRentalYield}%`}
                  />
                )}
              </div>
              <h4
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "var(--ocean, #1f3a4d)",
                  margin: "0 0 6px",
                  fontFamily: "var(--font-body, system-ui)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {loc === "es" ? "Por qué importa" : "Why It Matters"}
              </h4>
              <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
                {selectedCity.whyItMatters[loc].map((item) => (
                  <li
                    key={item}
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--charcoal, #23313f)",
                      marginBottom: "4px",
                      fontFamily: "var(--font-body, system-ui)",
                      lineHeight: 1.5,
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* List view */}
      {view === "list" && (
        <section
          style={{
            maxWidth: "var(--max, 1240px)",
            margin: "0 auto",
            padding: "0 24px 60px",
          }}
        >
          {filteredCities.length === 0 ? (
            <p style={{ color: "var(--muted, #6b7280)", textAlign: "center", padding: "60px 0" }}>
              {loc === "es"
                ? "No se encontraron ciudades. Intenta otro término."
                : "No cities found. Try a different search."}
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: "20px",
              }}
            >
              {filteredCities.map((city) => (
                <CityCard
                  key={city.id}
                  city={city}
                  locale={loc}
                  selected={selectedId === city.id}
                  onSelect={() => setSelectedId(selectedId === city.id ? null : city.id)}
                />
              ))}
            </div>
          )}

          {/* Currency Converter widget */}
          <div style={{ marginTop: "60px", display: "flex", justifyContent: "center" }}>
            <CurrencyConverter locale={loc as "en" | "es"} />
          </div>
        </section>
      )}

      {/* Compare view */}
      {view === "compare" && (
        <section
          style={{
            maxWidth: "var(--max, 1240px)",
            margin: "0 auto",
            padding: "0 24px 60px",
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* Selection sidebar */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display, Georgia, serif)",
                fontSize: "1rem",
                fontWeight: 400,
                color: "var(--ocean, #1f3a4d)",
                margin: "0 0 12px",
              }}
            >
              {loc === "es" ? "Seleccionar ciudades" : "Select cities"}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {CITIES.map((city) => {
                const checked = compareIds.has(city.id);
                const disabled = !checked && compareIds.size >= 3;
                return (
                  <label
                    key={city.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: `1px solid ${checked ? city.markerColor : "var(--border, rgba(35,49,63,0.1))"}`,
                      background: checked ? `${city.markerColor}10` : "#fff",
                      cursor: disabled ? "not-allowed" : "pointer",
                      opacity: disabled ? 0.5 : 1,
                      fontFamily: "var(--font-body, system-ui)",
                      fontSize: "0.87rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggleCompare(city.id)}
                      style={{ accentColor: city.markerColor }}
                    />
                    <span style={{ fontWeight: checked ? 600 : 400, color: "var(--charcoal, #23313f)" }}>
                      {city.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Comparison table */}
          <div
            style={{
              background: "var(--card, rgba(255,252,247,0.92))",
              border: "1px solid var(--border, rgba(35,49,63,0.1))",
              borderRadius: "var(--radius-sm, 18px)",
              padding: "24px",
              overflowX: "auto",
            }}
          >
            <CompareTable cities={compareCities} locale={loc} />
          </div>
        </section>
      )}

      {/* Email capture */}
      <section style={{ maxWidth: "var(--max, 1240px)", margin: "0 auto", padding: "0 24px 40px" }}>
        <EmailCapture locale={loc} variant="banner" source="cities-page" />
      </section>

      {/* Data source footnote */}
      <section
        style={{
          maxWidth: "var(--max, 1240px)",
          margin: "0 auto",
          padding: "0 24px 60px",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--muted, #6b7280)",
            fontFamily: "var(--font-body, system-ui)",
            lineHeight: 1.5,
          }}
        >
          {loc === "es"
            ? "Fuentes de población: World Population Review 2025; DANE (Colombia). Métricas de bienes raíces: datos de mercado recopilados 2025–2026. Algunos mercados tienen datos limitados — ver notas individuales. No constituye asesoría financiera."
            : "Population sources: World Population Review 2025; DANE (Colombia). Real estate metrics: market data compiled 2025–2026. Some markets have limited data — see individual notes. Not financial advice."}
        </p>
      </section>
    </div>
  );
}
