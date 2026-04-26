"use client";

import { useLocale } from "next-intl";
import { VettedBadge } from "@/components/listings/VettedBadge";
import type { Listing } from "@/types/listings";

interface Props {
  listing: Listing;
}

const LISTING_TYPE_LABEL: Record<string, { en: string; es: string }> = {
  sale: { en: "For Sale", es: "En Venta" },
  rental: { en: "Monthly Rental", es: "Arriendo Mensual" },
  long_term_rental: { en: "Long-Term Rental", es: "Arriendo a Largo Plazo" },
};

const PROPERTY_TYPE_LABEL: Record<string, { en: string; es: string }> = {
  apartment: { en: "Apartment", es: "Apartamento" },
  house: { en: "House", es: "Casa" },
  penthouse: { en: "Penthouse", es: "Ático" },
  studio: { en: "Studio", es: "Estudio" },
  townhouse: { en: "Townhouse", es: "Casa Adosada" },
};

export function ListingDetail({ listing }: Props) {
  const locale = useLocale() as "en" | "es";
  const isEn = locale === "en";

  const primaryImage = listing.images.find((i) => i.is_primary) ?? listing.images[0];
  const otherImages = listing.images.filter((i) => !i.is_primary).slice(0, 4);

  const typeLabel = LISTING_TYPE_LABEL[listing.listing_type]?.[locale] ?? listing.listing_type;
  const propLabel = PROPERTY_TYPE_LABEL[listing.property_type]?.[locale] ?? listing.property_type;

  const formattedPrice =
    listing.listing_type === "sale"
      ? `$${listing.price_usd.toLocaleString()} USD`
      : `$${listing.price_usd.toLocaleString()} USD / ${isEn ? "mo" : "mes"}`;

  const formattedPriceCop =
    listing.listing_type === "sale"
      ? `$${(listing.price_cop / 1_000_000).toFixed(0)}M COP`
      : `$${(listing.price_cop / 1_000_000).toFixed(1)}M COP / ${isEn ? "mo" : "mes"}`;

  const listedDate = new Date(listing.listed_at).toLocaleDateString(
    isEn ? "en-US" : "es-CO",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div style={{ background: "var(--cream, #fdf5e6)", minHeight: "60vh" }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: "var(--max, 1240px)", margin: "0 auto", padding: "20px 20px 0" }}>
        <nav
          aria-label="breadcrumb"
          style={{ fontSize: "0.8rem", color: "rgba(31,58,77,0.5)", fontFamily: "var(--font-body, system-ui)" }}
        >
          <a
            href="/listings"
            style={{ color: "var(--lagoon, #1f6f78)", textDecoration: "none" }}
          >
            {isEn ? "Listings" : "Listados"}
          </a>
          {" / "}
          <span>{listing.city}</span>
          {" / "}
          <span style={{ color: "var(--ocean, #1f3a4d)" }}>{listing.neighborhood}</span>
        </nav>
      </div>

      {/* Main grid */}
      <div
        className="listing-detail-grid"
        style={{
          maxWidth: "var(--max, 1240px)",
          margin: "0 auto",
          padding: "24px 20px 80px",
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: "40px",
          alignItems: "start",
        }}
      >
        {/* Left column */}
        <div>
          {/* Primary image */}
          <div
            style={{
              borderRadius: "var(--radius, 26px)",
              overflow: "hidden",
              background: "var(--sand, #fff8ef)",
              marginBottom: "12px",
              aspectRatio: "16/9",
            }}
          >
            <img
              src={primaryImage.url}
              alt={primaryImage.alt}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>

          {/* Thumbnail strip */}
          {otherImages.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${otherImages.length}, 1fr)`,
                gap: "8px",
                marginBottom: "32px",
              }}
            >
              {otherImages.map((img, i) => (
                <div
                  key={i}
                  style={{ borderRadius: "12px", overflow: "hidden", aspectRatio: "4/3", background: "var(--sand, #fff8ef)" }}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontFamily: "var(--font-display, Georgia, serif)",
                fontSize: "1.25rem",
                fontWeight: 400,
                color: "var(--ocean, #1f3a4d)",
                margin: "0 0 14px",
              }}
            >
              {isEn ? "About This Property" : "Sobre Esta Propiedad"}
            </h2>
            <p
              style={{
                fontSize: "0.93rem",
                lineHeight: 1.7,
                color: "rgba(31,58,77,0.75)",
                margin: 0,
                fontFamily: "var(--font-body, system-ui)",
              }}
            >
              {isEn ? listing.description_en : listing.description_es}
            </p>
          </div>

          {/* Specs grid */}
          <div style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontFamily: "var(--font-display, Georgia, serif)",
                fontSize: "1.25rem",
                fontWeight: 400,
                color: "var(--ocean, #1f3a4d)",
                margin: "0 0 14px",
              }}
            >
              {isEn ? "Property Details" : "Detalles del Inmueble"}
            </h2>
            <div
              className="specs-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}
            >
              {[
                { label: isEn ? "Type" : "Tipo", value: propLabel },
                { label: isEn ? "Listing" : "Modalidad", value: typeLabel },
                { label: isEn ? "Area" : "Área", value: `${listing.area_sqm} m²` },
                { label: isEn ? "Bedrooms" : "Habitaciones", value: listing.bedrooms.toString() },
                { label: isEn ? "Bathrooms" : "Baños", value: listing.bathrooms.toString() },
                { label: isEn ? "Parking" : "Parqueo", value: listing.parking_spots.toString() },
                { label: isEn ? "Furnished" : "Amoblado", value: listing.furnished ? (isEn ? "Yes" : "Sí") : "No" },
                { label: isEn ? "City" : "Ciudad", value: listing.city },
                { label: isEn ? "Neighborhood" : "Barrio", value: listing.neighborhood },
              ].map((spec) => (
                <div
                  key={spec.label}
                  style={{
                    background: "white",
                    borderRadius: "14px",
                    padding: "14px 16px",
                    boxShadow: "0 1px 4px rgba(31,58,77,0.06)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      color: "rgba(31,58,77,0.4)",
                      margin: "0 0 4px",
                      fontFamily: "var(--font-body, system-ui)",
                    }}
                  >
                    {spec.label}
                  </p>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "var(--ocean, #1f3a4d)",
                      margin: 0,
                      fontFamily: "var(--font-body, system-ui)",
                    }}
                  >
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Vetting report */}
          {listing.vetting_report && (
            <div style={{ marginBottom: "32px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-display, Georgia, serif)",
                  fontSize: "1.25rem",
                  fontWeight: 400,
                  color: "var(--ocean, #1f3a4d)",
                  margin: "0 0 14px",
                }}
              >
                {isEn ? "Vetting Report" : "Informe de Verificación"}
              </h2>
              <div
                style={{
                  background: "white",
                  borderRadius: "18px",
                  padding: "20px 24px",
                  boxShadow: "0 1px 4px rgba(31,58,77,0.06)",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {(
                    [
                      { key: "title_clear", en: "Title clear — no liens or encumbrances", es: "Título limpio — sin gravámenes" },
                      { key: "legal_review_complete", en: "Legal review complete", es: "Revisión legal completa" },
                      { key: "property_inspection_done", en: "Property inspection passed", es: "Inspección del inmueble aprobada" },
                      { key: "hoa_rules_reviewed", en: "HOA rules reviewed", es: "Reglamento de propiedad horizontal revisado" },
                      ...(listing.vetting_report.short_term_rental_permitted !== null
                        ? [{ key: "short_term_rental_permitted", en: "Short-term rental permitted", es: "Arriendo corto plazo permitido" }]
                        : []),
                    ] as { key: string; en: string; es: string }[]
                  ).map((item) => {
                    const passed =
                      listing.vetting_report![item.key as keyof typeof listing.vetting_report] === true;
                    return (
                      <div key={item.key} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background: passed ? "var(--emerald-deep, #1f8f59)" : "rgba(31,58,77,0.12)",
                            color: passed ? "white" : "rgba(31,58,77,0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {passed ? "✓" : "–"}
                        </span>
                        <span
                          style={{
                            fontSize: "0.85rem",
                            color: passed ? "var(--ocean, #1f3a4d)" : "rgba(31,58,77,0.4)",
                            fontFamily: "var(--font-body, system-ui)",
                          }}
                        >
                          {isEn ? item.en : item.es}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {listing.vetting_report.reviewer && (
                  <p
                    style={{
                      fontSize: "0.72rem",
                      color: "rgba(31,58,77,0.4)",
                      margin: "16px 0 0",
                      fontFamily: "var(--font-body, system-ui)",
                    }}
                  >
                    {isEn ? "Reviewed by" : "Revisado por"}: {listing.vetting_report.reviewer}
                    {listing.vetting_report.reviewed_at &&
                      ` · ${new Date(listing.vetting_report.reviewed_at).toLocaleDateString(
                        isEn ? "en-US" : "es-CO",
                        { year: "numeric", month: "short" }
                      )}`}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Listed date */}
          <p
            style={{
              fontSize: "0.75rem",
              color: "rgba(31,58,77,0.35)",
              fontFamily: "var(--font-body, system-ui)",
            }}
          >
            {isEn ? `Listed ${listedDate}` : `Publicado ${listedDate}`}
            {listing.is_synthetic && (
              <span
                style={{
                  marginLeft: "12px",
                  background: "rgba(230,126,34,0.1)",
                  color: "rgba(230,126,34,0.7)",
                  borderRadius: "999px",
                  padding: "2px 8px",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                }}
              >
                {isEn ? "Demo listing" : "Listado de demo"}
              </span>
            )}
          </p>
        </div>

        {/* Right column — sticky price card */}
        <div style={{ position: "sticky", top: "24px" }}>
          <div
            style={{
              background: "white",
              borderRadius: "var(--radius, 26px)",
              padding: "28px 24px",
              boxShadow: "0 4px 24px rgba(31,58,77,0.1)",
              marginBottom: "16px",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <VettedBadge level={listing.vetting_level} locale={locale} />
            </div>

            <p
              style={{
                fontFamily: "var(--font-display, Georgia, serif)",
                fontSize: "2rem",
                fontWeight: 400,
                color: "var(--ocean, #1f3a4d)",
                margin: "0 0 4px",
                lineHeight: 1.1,
              }}
            >
              {formattedPrice}
            </p>
            <p
              style={{
                fontSize: "0.82rem",
                color: "rgba(31,58,77,0.45)",
                margin: "0 0 20px",
                fontFamily: "var(--font-body, system-ui)",
              }}
            >
              ≈ {formattedPriceCop}
            </p>

            {/* Quick specs */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "20px",
                paddingBottom: "20px",
                borderBottom: "1px solid rgba(31,58,77,0.08)",
              }}
            >
              {[
                { icon: "🛏", value: listing.bedrooms.toString() },
                { icon: "🚿", value: listing.bathrooms.toString() },
                { icon: "📐", value: `${listing.area_sqm}m²` },
                { icon: "🚗", value: listing.parking_spots.toString() },
              ].map((s) => (
                <div key={s.icon} style={{ textAlign: "center", flex: 1 }}>
                  <p style={{ fontSize: "1rem", margin: "0 0 2px" }}>{s.icon}</p>
                  <p
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "var(--ocean, #1f3a4d)",
                      margin: 0,
                      fontFamily: "var(--font-body, system-ui)",
                    }}
                  >
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Location */}
            <p
              style={{
                fontSize: "0.83rem",
                color: "rgba(31,58,77,0.6)",
                margin: "0 0 20px",
                fontFamily: "var(--font-body, system-ui)",
              }}
            >
              📍 {listing.neighborhood}, {listing.city}
              {listing.address_summary && (
                <>
                  <br />
                  <span style={{ fontSize: "0.78rem" }}>{listing.address_summary}</span>
                </>
              )}
            </p>

            {/* Vetting bullets */}
            <ul style={{ listStyle: "none", margin: "0 0 20px", padding: 0, display: "flex", flexDirection: "column", gap: "7px" }}>
              {listing.vetting_summary_bullets.map((bullet, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    fontSize: "0.8rem",
                    color: "rgba(31,58,77,0.7)",
                    fontFamily: "var(--font-body, system-ui)",
                  }}
                >
                  <span style={{ color: "var(--emerald-deep, #1f8f59)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {bullet}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a
              href={`mailto:hello@casaclaro.co?subject=Inquiry: ${listing.slug}&body=I'm interested in ${listing.neighborhood}, ${listing.city} (${listing.slug}).`}
              style={{
                display: "block",
                width: "100%",
                padding: "14px 20px",
                background: "var(--terracotta, #e67e22)",
                color: "white",
                borderRadius: "999px",
                textAlign: "center",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                fontFamily: "var(--font-body, system-ui)",
                boxSizing: "border-box",
                marginBottom: "10px",
              }}
            >
              {isEn ? "Request Information" : "Solicitar Información"}
            </a>

            <p
              style={{
                fontSize: "0.72rem",
                color: "rgba(31,58,77,0.35)",
                textAlign: "center",
                margin: 0,
                fontFamily: "var(--font-body, system-ui)",
              }}
            >
              {isEn ? "Response within 24–48 hours" : "Respuesta en 24–48 horas"}
            </p>
          </div>

          {/* Explore cities CTA */}
          <div
            style={{
              background: "var(--ocean, #1f3a4d)",
              borderRadius: "18px",
              padding: "18px 20px",
              color: "white",
            }}
          >
            <p
              style={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
                margin: "0 0 6px",
                fontFamily: "var(--font-body, system-ui)",
              }}
            >
              {isEn ? "Considering other cities?" : "¿Considerando otras ciudades?"}
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.55)",
                margin: "0 0 12px",
                fontFamily: "var(--font-body, system-ui)",
              }}
            >
              {isEn
                ? "Compare cost of living, climate, and expat communities."
                : "Compara costo de vida, clima y comunidades de expats."}
            </p>
            <a
              href="/cities"
              style={{
                fontSize: "0.78rem",
                color: "var(--terracotta, #e67e22)",
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "var(--font-body, system-ui)",
              }}
            >
              {isEn ? "Explore Cities →" : "Explorar Ciudades →"}
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .listing-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .specs-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
