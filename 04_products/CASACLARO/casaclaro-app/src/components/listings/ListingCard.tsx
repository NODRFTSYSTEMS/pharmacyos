import Image from "next/image";
import { VettedBadge } from "./VettedBadge";
import type { Listing } from "@/types/listings";

interface ListingCardProps {
  listing: Listing;
  locale?: "en" | "es";
}

function formatUSD(n: number, type: Listing["listing_type"]): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
  return type === "sale" ? formatted : `${formatted}/mo`;
}

function formatCOP(n: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
}

const listingTypeLabel: Record<Listing["listing_type"], { en: string; es: string }> = {
  sale: { en: "For Sale", es: "En Venta" },
  rental: { en: "For Rent", es: "En Arriendo" },
  long_term_rental: { en: "Long-Term Rental", es: "Arriendo Largo Plazo" },
};

export function ListingCard({ listing, locale = "en" }: ListingCardProps) {
  const primaryImage =
    listing.images.find((img) => img.is_primary) ?? listing.images[0];

  const typeTag = listingTypeLabel[listing.listing_type][locale];

  return (
    <article
      data-testid="listing-card"
      style={{
        background: "var(--card, rgba(255,252,247,0.92))",
        borderRadius: "var(--radius, 26px)",
        overflow: "hidden",
        border: "1px solid var(--border, rgba(35,49,63,0.08))",
        boxShadow: "0 4px 24px rgba(35,49,63,0.06)",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow, 0 20px 60px rgba(35,49,63,0.12))";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(35,49,63,0.06)";
      }}
    >
      <a
        href={`/listings/${listing.slug}`}
        aria-label={`View listing: ${listing.neighborhood}, ${listing.city}`}
        style={{ display: "contents", textDecoration: "none", color: "inherit" }}
      >
      {/* Hero image — 16:10 */}
      <div style={{ position: "relative", aspectRatio: "16 / 10", overflow: "hidden" }}>
        <Image
          src={primaryImage.url}
          alt={primaryImage.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
        />
        {/* Listing type tag */}
        <span
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            background: "var(--terracotta, #e67e22)",
            color: "#fff",
            borderRadius: "999px",
            padding: "3px 10px",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            fontFamily: "var(--font-body, system-ui)",
          }}
        >
          {typeTag}
        </span>
      </div>

      {/* Card body */}
      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>

        {/* Location */}
        <p
          style={{
            margin: 0,
            fontSize: "0.78rem",
            color: "var(--muted, #6b7280)",
            fontFamily: "var(--font-body, system-ui)",
            letterSpacing: "0.02em",
          }}
        >
          {listing.city} · {listing.neighborhood}
        </p>

        {/* Price */}
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--ocean, #1f3a4d)",
              fontFamily: "var(--font-body, system-ui)",
              lineHeight: 1.1,
            }}
          >
            {formatUSD(listing.price_usd, listing.listing_type)}
          </p>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: "0.75rem",
              color: "var(--muted, #6b7280)",
              fontFamily: "var(--font-body, system-ui)",
            }}
          >
            {formatCOP(listing.price_cop)}
          </p>
        </div>

        {/* Specs row */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            fontSize: "0.82rem",
            color: "var(--charcoal, #23313f)",
            fontFamily: "var(--font-body, system-ui)",
          }}
        >
          <span title="Bedrooms">🛏 {listing.bedrooms}</span>
          <span title="Bathrooms">🚿 {listing.bathrooms}</span>
          <span title="Area">📐 {listing.area_sqm} m²</span>
          {listing.parking_spots > 0 && (
            <span title="Parking">🚗 {listing.parking_spots}</span>
          )}
        </div>

        {/* Vetting badge */}
        <VettedBadge level={listing.vetting_level} locale={locale} />

        {/* Vetting summary bullets */}
        {listing.vetting_summary_bullets.length > 0 && (
          <ul
            style={{
              margin: 0,
              padding: "0 0 0 14px",
              display: "flex",
              flexDirection: "column",
              gap: "3px",
            }}
          >
            {listing.vetting_summary_bullets.map((bullet, i) => (
              <li
                key={i}
                style={{
                  fontSize: "0.75rem",
                  color: "var(--muted, #6b7280)",
                  fontFamily: "var(--font-body, system-ui)",
                  lineHeight: 1.4,
                }}
              >
                {bullet}
              </li>
            ))}
          </ul>
        )}

        {/* Furnished indicator */}
        {listing.furnished && (
          <p
            style={{
              margin: 0,
              fontSize: "0.72rem",
              color: "var(--emerald-deep, #1f8f59)",
              fontWeight: 600,
              fontFamily: "var(--font-body, system-ui)",
            }}
          >
            ✓ {locale === "en" ? "Fully Furnished" : "Completamente Amueblado"}
          </p>
        )}

        {/* CTA */}
        <div style={{ marginTop: "auto", paddingTop: "12px" }}>
          <span
            style={{
              display: "block",
              width: "100%",
              padding: "10px 16px",
              background: "var(--ocean, #1f3a4d)",
              color: "white",
              borderRadius: "999px",
              textAlign: "center",
              fontWeight: 600,
              fontSize: "0.82rem",
              fontFamily: "var(--font-body, system-ui)",
              boxSizing: "border-box",
            }}
          >
            {locale === "en" ? "View Details →" : "Ver Detalles →"}
          </span>
        </div>
      </div>
      </a>
    </article>
  );
}
