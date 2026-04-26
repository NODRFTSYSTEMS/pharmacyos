import { MetadataRoute } from "next";

const BASE_URL = "https://peakequityoptimizer.com";

const staticRoutes = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/how-it-works", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/for-sellers", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/for-investors", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/estimator", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/trust", priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/academy", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/academy/methodology", priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/academy/strategies", priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/academy/templates", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/academy/formula-stack", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/legal/disclosures", priority: 0.3, changeFrequency: "yearly" as const },
];

const locales = ["en", "es"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of staticRoutes) {
    for (const locale of locales) {
      const localePath = locale === "en" ? route.path : `/es${route.path}`;
      entries.push({
        url: `${BASE_URL}${localePath}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: locale === "en" ? route.priority : route.priority * 0.9,
      });
    }
  }

  return entries;
}
