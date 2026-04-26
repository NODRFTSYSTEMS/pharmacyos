import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ListingCard } from "@/components/listings/ListingCard";
import type { Listing } from "@/types/listings";

const mockListing: Listing = {
  id: "test-001",
  slug: "test-listing",
  listing_type: "sale",
  property_type: "apartment",
  city: "Medellín",
  city_slug: "medellin",
  neighborhood: "El Poblado",
  price_usd: 250000,
  price_cop: 1025000000,
  area_sqm: 85,
  bedrooms: 2,
  bathrooms: 2,
  parking_spots: 1,
  furnished: true,
  vetting_level: "fully_vetted",
  vetting_summary_bullets: ["Title verified clean", "Structural inspection passed"],
  images: [
    { url: "https://picsum.photos/seed/test-1/900/600", alt: "Test image", is_primary: true },
  ],
  description_en: "A beautiful apartment in El Poblado.",
  description_es: "Un bello apartamento en El Poblado.",
  is_synthetic: true,
  listed_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

describe("ListingCard", () => {
  it("renders price in USD", () => {
    render(<ListingCard listing={mockListing} />);
    expect(screen.getByText(/\$250,000/)).toBeTruthy();
  });

  it("renders city and neighborhood", () => {
    render(<ListingCard listing={mockListing} />);
    expect(screen.getByText(/Medellín.*El Poblado/)).toBeTruthy();
  });

  it("renders bed, bath, and area figures", () => {
    render(<ListingCard listing={mockListing} />);
    expect(screen.getByTitle("Bedrooms")).toBeTruthy();
    expect(screen.getByTitle("Bathrooms")).toBeTruthy();
    expect(screen.getByTitle("Area")).toBeTruthy();
  });

  it("renders VettedBadge with correct level", () => {
    render(<ListingCard listing={mockListing} />);
    expect(screen.getByTestId("vetted-badge")).toBeTruthy();
    expect(screen.getByText("Fully Vetted")).toBeTruthy();
  });

  it("renders at least one vetting summary bullet", () => {
    render(<ListingCard listing={mockListing} />);
    expect(screen.getByText("Title verified clean")).toBeTruthy();
  });
});
