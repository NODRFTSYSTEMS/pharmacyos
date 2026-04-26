"use client";

import { SYNTHETIC_LISTINGS } from "@/data/listings.seed";
import type { Listing } from "@/types/listings";

type ListingMode = "empty" | "synthetic" | "live";

export function useListings(): {
  listings: Listing[];
  mode: ListingMode;
  isLoading: boolean;
  hasSyntheticData: boolean;
} {
  const raw = process.env.NEXT_PUBLIC_LISTINGS_MODE;

  let mode: ListingMode;
  let listings: Listing[];

  if (raw === "live") {
    mode = "live";
    // TODO: replace with supabase.from('listings').select('*')
    listings = [];
  } else if (raw === "synthetic") {
    mode = "synthetic";
    listings = SYNTHETIC_LISTINGS;
  } else {
    // undefined, "empty", or unrecognized → safe default: show nothing
    mode = "empty";
    listings = [];
  }

  return {
    listings,
    mode,
    isLoading: false,
    hasSyntheticData: listings.some((l) => l.is_synthetic),
  };
}
