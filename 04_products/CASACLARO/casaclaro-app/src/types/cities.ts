export interface CityMetrics {
  pricePerSqmUSD?: number;
  grossRentalYield?: number;
  avgRent2BR?: number;
  closingCostPct?: number;
  suitabilityScore?: number;
  costOfLiving?: string;
  metricsNote?: { en: string; es: string };
}

export interface City {
  id: string;
  slug: string;
  name: string;
  department: string;
  lat: number;
  lng: number;

  populationCity: number;
  populationMetro?: number;
  populationSource: string;
  populationYear: number;

  elevationM: number;
  region: { en: string; es: string };
  climate: { en: string; es: string };
  avgTempC: { low: number; high: number };

  nicknames: string[];
  tagline: { en: string; es: string };
  description: { en: string; es: string };
  whyItMatters: { en: string[]; es: string[] };

  metrics: CityMetrics;
  keyIndustries: { en: string[]; es: string[] };
  neighborhoods: string[];

  markerColor: string;
  color: string;
  isHeritageVillage?: boolean;
}
