import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "./utils/render-with-intl";

// Mock the useListings hook to control listing data per test
vi.mock("@/hooks/useListings", () => ({
  useListings: vi.fn(),
}));

// Mock SEED_CITY_OPTIONS to avoid loading full seed file
vi.mock("@/data/listings.seed", () => ({
  SEED_CITY_OPTIONS: [{ slug: "medellin", label: "Medellín" }],
}));

import { useListings } from "@/hooks/useListings";
import type { Listing } from "@/types/listings";
import CurrentListingsPage from "@/app/[locale]/listings/page";

const mockSyntheticListing: Listing = {
  id: "syn-001",
  slug: "syn-listing",
  listing_type: "sale",
  property_type: "apartment",
  city: "Medellín",
  city_slug: "medellin",
  neighborhood: "El Poblado",
  price_usd: 200000,
  price_cop: 820000000,
  area_sqm: 75,
  bedrooms: 2,
  bathrooms: 1,
  parking_spots: 1,
  furnished: false,
  vetting_level: "basic",
  vetting_summary_bullets: ["Listing reviewed for completeness"],
  images: [
    { url: "https://picsum.photos/seed/syn-1/900/600", alt: "Test", is_primary: true },
  ],
  description_en: "A test listing.",
  description_es: "Un listado de prueba.",
  is_synthetic: true,
  listed_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

const mockUseListings = useListings as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CurrentListingsPage", () => {
  it("renders empty state when listings array is empty and no synthetic data", () => {
    mockUseListings.mockReturnValue({
      listings: [],
      mode: "empty",
      isLoading: false,
      hasSyntheticData: false,
    });
    renderWithIntl(<CurrentListingsPage />);
    expect(screen.getByTestId("empty-state")).toBeTruthy();
    expect(screen.queryByTestId("listing-card")).toBeNull();
  });

  it("renders listing cards when synthetic mode returns data", () => {
    mockUseListings.mockReturnValue({
      listings: [mockSyntheticListing],
      mode: "synthetic",
      isLoading: false,
      hasSyntheticData: true,
    });
    renderWithIntl(<CurrentListingsPage />);
    expect(screen.getAllByTestId("listing-card").length).toBeGreaterThan(0);
  });

  it("renders synthetic banner when hasSyntheticData is true", () => {
    mockUseListings.mockReturnValue({
      listings: [mockSyntheticListing],
      mode: "synthetic",
      isLoading: false,
      hasSyntheticData: true,
    });
    renderWithIntl(<CurrentListingsPage />);
    expect(screen.getByTestId("synthetic-banner")).toBeTruthy();
  });

  it("does not render synthetic banner when hasSyntheticData is false (live stub)", () => {
    mockUseListings.mockReturnValue({
      listings: [],
      mode: "live",
      isLoading: false,
      hasSyntheticData: false,
    });
    renderWithIntl(<CurrentListingsPage />);
    expect(screen.queryByTestId("synthetic-banner")).toBeNull();
    expect(screen.getByTestId("empty-state")).toBeTruthy();
  });
});
