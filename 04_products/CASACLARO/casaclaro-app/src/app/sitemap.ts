import type { MetadataRoute } from "next";
import { SYNTHETIC_LISTINGS } from "@/data/listings.seed";
import { CITIES } from "@/data/cities.data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://casaclaro.co";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/listings`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/cities`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/map`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/relocation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/relocation/business`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/residency`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/cost-simulator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/partners`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.65 },
    { url: `${baseUrl}/for-sellers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/for-agents`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const listingRoutes: MetadataRoute.Sitemap = SYNTHETIC_LISTINGS.map((listing) => ({
    url: `${baseUrl}/listings/${listing.slug}`,
    lastModified: new Date(listing.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const cityRoutes: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${baseUrl}/cities#${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticRoutes, ...listingRoutes, ...cityRoutes];
}
