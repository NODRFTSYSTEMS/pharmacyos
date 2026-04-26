"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import { useListings } from "@/hooks/useListings";
import { FilterBar } from "@/components/listings/FilterBar";
import { ListingsGrid } from "@/components/listings/ListingsGrid";
import { EmailCapture } from "@/components/EmailCapture";
import { DEFAULT_FILTERS, applyFilters } from "@/types/listings";
import { SEED_CITY_OPTIONS } from "@/data/listings.seed";
import type { ListingFilters } from "@/types/listings";

export default function CurrentListingsPage() {
  const { listings, isLoading, hasSyntheticData } = useListings();
  const [filters, setFilters] = useState<ListingFilters>(DEFAULT_FILTERS);

  const filteredListings = useMemo(
    () => applyFilters(listings, filters),
    [listings, filters]
  );

  const rawLocale = useLocale();
  const locale = (rawLocale === "es" ? "es" : "en") as "en" | "es";

  return (
    <div style={{ maxWidth: "var(--max, 1240px)", margin: "0 auto", padding: "40px 20px 80px" }}>

      {/* Page header */}
      <header style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 400,
            color: "var(--ocean, #1f3a4d)",
            margin: "0 0 10px",
            lineHeight: 1.15,
          }}
        >
          {locale === "en" ? "Listings" : "Listados"}
        </h1>
        <p
          style={{
            color: "var(--muted, #6b7280)",
            fontSize: "1rem",
            margin: 0,
            maxWidth: "580px",
            lineHeight: 1.6,
          }}
        >
          {locale === "en"
            ? "Vetted properties across Colombian cities — reviewed for legal standing and pricing context."
            : "Propiedades verificadas en ciudades colombianas — revisadas por estado legal y contexto de precios."}
        </p>
      </header>

      {/* Synthetic data banner */}
      {hasSyntheticData && (
        <div
          data-testid="synthetic-banner"
          role="alert"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            padding: "14px 18px",
            background: "rgba(241,196,15,0.1)",
            border: "1px solid rgba(241,196,15,0.4)",
            borderRadius: "var(--radius-sm, 18px)",
            marginBottom: "28px",
            fontSize: "0.85rem",
            color: "var(--cacao, #4a2f1d)",
            fontFamily: "var(--font-body, system-ui)",
            lineHeight: 1.55,
          }}
        >
          <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: "1px" }}>⚠️</span>
          <span>
            <strong>{locale === "en" ? "Sample listings only" : "Solo listados de muestra"}</strong>
            {locale === "en"
              ? " — these do not represent real properties for sale or rent."
              : " — estos no representan propiedades reales en venta o arriendo."}
          </span>
        </div>
      )}

      {/* Filter bar */}
      <div style={{ marginBottom: "24px" }}>
        <FilterBar
          filters={filters}
          cities={SEED_CITY_OPTIONS}
          onChange={setFilters}
          locale={locale}
        />
      </div>

      {/* Listing count */}
      {!isLoading && listings.length > 0 && (
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--muted, #6b7280)",
            margin: "0 0 20px",
            fontFamily: "var(--font-body, system-ui)",
          }}
        >
          {locale === "en"
            ? `Showing ${filteredListings.length} of ${listings.length} listing${listings.length !== 1 ? "s" : ""}`
            : `Mostrando ${filteredListings.length} de ${listings.length} listado${listings.length !== 1 ? "s" : ""}`}
        </p>
      )}

      {/* Listings grid */}
      <ListingsGrid
        listings={filteredListings}
        isLoading={isLoading}
        locale={locale}
        isFiltered={listings.length > 0 && filteredListings.length === 0}
      />

      {/* Email capture — below grid */}
      <div style={{ marginTop: "56px" }}>
        <EmailCapture locale={locale} variant="banner" source="listings-page" />
      </div>
    </div>
  );
}
