export type VettingLevel = "fully_vetted" | "professional_review" | "basic";

export type ListingType = "sale" | "rental" | "long_term_rental";

export type PropertyType =
  | "apartment"
  | "house"
  | "penthouse"
  | "studio"
  | "townhouse";

export interface ListingImage {
  url: string;
  alt: string;
  is_primary: boolean;
}

export interface VettingReport {
  title_clear: boolean;
  legal_review_complete: boolean;
  property_inspection_done: boolean;
  hoa_rules_reviewed: boolean;
  /** null = not applicable for this property type */
  short_term_rental_permitted: boolean | null;
  reviewer?: string;
  /** ISO 8601 date string */
  reviewed_at?: string;
}

export interface Listing {
  id: string;
  slug: string;
  listing_type: ListingType;
  property_type: PropertyType;
  /** Display name e.g. "Medellín" */
  city: string;
  /** Matches cities.json slug e.g. "medellin" */
  city_slug: string;
  /** Must be a real neighborhood name from cities.json or the verified city list */
  neighborhood: string;
  /** Vicinity description only — never an exact street address */
  address_summary?: string;
  price_usd: number;
  price_cop: number;
  area_sqm: number;
  bedrooms: number;
  bathrooms: number;
  parking_spots: number;
  furnished: boolean;
  vetting_level: VettingLevel;
  vetting_report?: VettingReport;
  /** 2–4 short English bullet strings displayed on the card */
  vetting_summary_bullets: string[];
  /** Minimum 8 images for synthetic records */
  images: ListingImage[];
  description_en: string;
  description_es: string;
  /** MUST be true for all seed/synthetic records — never omit */
  is_synthetic: boolean;
  /** ISO 8601 */
  listed_at: string;
  /** ISO 8601 */
  updated_at: string;
}

export interface ListingFilters {
  listing_type: ListingType | "all";
  city_slug: string | "all";
  property_type: PropertyType | "all";
  price_min: number | null;
  price_max: number | null;
  vetting_level: VettingLevel | "all";
}

export const DEFAULT_FILTERS: ListingFilters = {
  listing_type: "all",
  city_slug: "all",
  property_type: "all",
  price_min: null,
  price_max: null,
  vetting_level: "all",
};

/** Pure function — applies all active filters to a listing array */
export function applyFilters(
  listings: Listing[],
  filters: ListingFilters
): Listing[] {
  return listings.filter((l) => {
    if (filters.listing_type !== "all" && l.listing_type !== filters.listing_type)
      return false;
    if (filters.city_slug !== "all" && l.city_slug !== filters.city_slug)
      return false;
    if (filters.property_type !== "all" && l.property_type !== filters.property_type)
      return false;
    if (filters.vetting_level !== "all" && l.vetting_level !== filters.vetting_level)
      return false;
    if (filters.price_min !== null && l.price_usd < filters.price_min)
      return false;
    if (filters.price_max !== null && l.price_usd > filters.price_max)
      return false;
    return true;
  });
}
