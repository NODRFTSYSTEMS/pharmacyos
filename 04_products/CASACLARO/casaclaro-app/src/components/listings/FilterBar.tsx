"use client";

import { DEFAULT_FILTERS } from "@/types/listings";
import type { ListingFilters } from "@/types/listings";

interface FilterBarProps {
  filters: ListingFilters;
  cities: { slug: string; label: string }[];
  onChange: (f: ListingFilters) => void;
  locale?: "en" | "es";
}

const labels = {
  en: {
    listingType: "Listing Type",
    allTypes: "All Types",
    forSale: "For Sale",
    forRent: "For Rent",
    longTerm: "Long-Term",
    city: "City",
    allCities: "All Cities",
    propertyType: "Property Type",
    allProperties: "All Properties",
    apartment: "Apartment",
    house: "House",
    penthouse: "Penthouse",
    studio: "Studio",
    townhouse: "Townhouse",
    price: "Price Range",
    allPrices: "Any Price",
    under100: "Under $100k",
    "100to250": "$100k – $250k",
    "250to500": "$250k – $500k",
    over500: "Over $500k",
    under1000: "Under $1,000/mo",
    "1000to2000": "$1,000 – $2,000/mo",
    over2000: "Over $2,000/mo",
    vettingLevel: "Vetting Level",
    allLevels: "All Levels",
    fullyVetted: "Fully Vetted",
    professionalReview: "Professional Review",
    basic: "Basic",
    reset: "Reset Filters",
  },
  es: {
    listingType: "Tipo de Listado",
    allTypes: "Todos los Tipos",
    forSale: "En Venta",
    forRent: "En Arriendo",
    longTerm: "Largo Plazo",
    city: "Ciudad",
    allCities: "Todas las Ciudades",
    propertyType: "Tipo de Propiedad",
    allProperties: "Todas las Propiedades",
    apartment: "Apartamento",
    house: "Casa",
    penthouse: "Penthouse",
    studio: "Estudio",
    townhouse: "Townhouse",
    price: "Rango de Precio",
    allPrices: "Cualquier Precio",
    under100: "Menos de $100k",
    "100to250": "$100k – $250k",
    "250to500": "$250k – $500k",
    over500: "Más de $500k",
    under1000: "Menos de $1.000/mes",
    "1000to2000": "$1.000 – $2.000/mes",
    over2000: "Más de $2.000/mes",
    vettingLevel: "Nivel de Verificación",
    allLevels: "Todos los Niveles",
    fullyVetted: "Verificado Completo",
    professionalReview: "Revisión Profesional",
    basic: "Básico",
    reset: "Restablecer Filtros",
  },
};

const selectStyle: React.CSSProperties = {
  background: "var(--card-strong, rgba(255,255,255,0.96))",
  border: "1px solid var(--border, rgba(35,49,63,0.12))",
  borderRadius: "var(--radius-sm, 18px)",
  padding: "8px 14px",
  fontSize: "0.85rem",
  color: "var(--ocean, #1f3a4d)",
  fontFamily: "var(--font-body, system-ui)",
  cursor: "pointer",
  minWidth: "140px",
  appearance: "none" as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231f3a4d' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: "32px",
};

function priceOptions(t: typeof labels["en"], listingType: ListingFilters["listing_type"]) {
  const isSale = listingType === "sale";
  const isRental = listingType === "rental" || listingType === "long_term_rental";

  if (isSale) {
    return (
      <>
        <option value="">{ t.allPrices }</option>
        <option value="0-100000">{ t.under100 }</option>
        <option value="100000-250000">{ t["100to250"] }</option>
        <option value="250000-500000">{ t["250to500"] }</option>
        <option value="500000-99999999">{ t.over500 }</option>
      </>
    );
  }
  if (isRental) {
    return (
      <>
        <option value="">{ t.allPrices }</option>
        <option value="0-1000">{ t.under1000 }</option>
        <option value="1000-2000">{ t["1000to2000"] }</option>
        <option value="2000-99999999">{ t.over2000 }</option>
      </>
    );
  }
  return (
    <>
      <option value="">{ t.allPrices }</option>
      <option value="0-100000">{ t.under100 }</option>
      <option value="100000-250000">{ t["100to250"] }</option>
      <option value="250000-500000">{ t["250to500"] }</option>
      <option value="500000-99999999">{ t.over500 }</option>
    </>
  );
}

function parsePriceRange(value: string): { price_min: number | null; price_max: number | null } {
  if (!value) return { price_min: null, price_max: null };
  const [min, max] = value.split("-").map(Number);
  return { price_min: min, price_max: max >= 99999999 ? null : max };
}

function encodePriceRange(min: number | null, max: number | null): string {
  if (min === null && max === null) return "";
  return `${min ?? 0}-${max ?? 99999999}`;
}

export function FilterBar({ filters, cities, onChange, locale = "en" }: FilterBarProps) {
  const t = labels[locale];

  function update(patch: Partial<ListingFilters>) {
    onChange({ ...filters, ...patch });
  }

  return (
    <div
      data-testid="filter-bar"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        alignItems: "center",
        padding: "16px 20px",
        background: "var(--sand, #fff8ef)",
        borderRadius: "var(--radius, 26px)",
        border: "1px solid var(--border, rgba(35,49,63,0.08))",
      }}
    >
      {/* Listing type */}
      <select
        aria-label={t.listingType}
        value={filters.listing_type}
        style={selectStyle}
        onChange={(e) =>
          update({
            listing_type: e.target.value as ListingFilters["listing_type"],
            price_min: null,
            price_max: null,
          })
        }
      >
        <option value="all">{t.allTypes}</option>
        <option value="sale">{t.forSale}</option>
        <option value="rental">{t.forRent}</option>
        <option value="long_term_rental">{t.longTerm}</option>
      </select>

      {/* City */}
      <select
        aria-label={t.city}
        value={filters.city_slug}
        style={selectStyle}
        onChange={(e) => update({ city_slug: e.target.value })}
      >
        <option value="all">{t.allCities}</option>
        {cities.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.label}
          </option>
        ))}
      </select>

      {/* Property type */}
      <select
        aria-label={t.propertyType}
        value={filters.property_type}
        style={selectStyle}
        onChange={(e) =>
          update({ property_type: e.target.value as ListingFilters["property_type"] })
        }
      >
        <option value="all">{t.allProperties}</option>
        <option value="apartment">{t.apartment}</option>
        <option value="house">{t.house}</option>
        <option value="penthouse">{t.penthouse}</option>
        <option value="studio">{t.studio}</option>
        <option value="townhouse">{t.townhouse}</option>
      </select>

      {/* Price range */}
      <select
        aria-label={t.price}
        value={encodePriceRange(filters.price_min, filters.price_max)}
        style={selectStyle}
        onChange={(e) => update(parsePriceRange(e.target.value))}
      >
        {priceOptions(t, filters.listing_type)}
      </select>

      {/* Vetting level */}
      <select
        aria-label={t.vettingLevel}
        value={filters.vetting_level}
        style={selectStyle}
        onChange={(e) =>
          update({ vetting_level: e.target.value as ListingFilters["vetting_level"] })
        }
      >
        <option value="all">{t.allLevels}</option>
        <option value="fully_vetted">{t.fullyVetted}</option>
        <option value="professional_review">{t.professionalReview}</option>
        <option value="basic">{t.basic}</option>
      </select>

      {/* Reset */}
      <button
        type="button"
        onClick={() => onChange(DEFAULT_FILTERS)}
        style={{
          background: "transparent",
          border: "1px solid var(--terracotta, #e67e22)",
          color: "var(--terracotta, #e67e22)",
          borderRadius: "999px",
          padding: "8px 16px",
          fontSize: "0.82rem",
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "var(--font-body, system-ui)",
          whiteSpace: "nowrap",
        }}
      >
        {t.reset}
      </button>
    </div>
  );
}
