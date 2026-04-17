import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/investor/analysis/",
          "/seller/application/",
          "/test/",
          "/api/",
        ],
      },
    ],
    sitemap: "https://peakequityoptimizer.com/sitemap.xml",
    host: "https://peakequityoptimizer.com",
  };
}
