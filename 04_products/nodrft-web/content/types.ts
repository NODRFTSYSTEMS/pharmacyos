export type BilingualText = { en: string; es: string };

export type Locale = "en" | "es";

export function pick<T extends { en: string; es: string }>(
  field: T,
  locale: Locale
): string {
  return field[locale];
}

// ---------------------------------------------------------------------------
// MDX Insights pipeline types
// ---------------------------------------------------------------------------

/**
 * Shape of the YAML frontmatter block at the top of every .mdx file
 * inside content/insights/. All fields are required — the pipeline
 * will surface a runtime error if any are missing.
 *
 * date    — ISO 8601 date string, e.g. "2026-05-07"
 * summary — displayed as og:description; keep under 150 characters
 * readTime — human label shown in the article header, e.g. "7 min read"
 */
export interface InsightFrontmatter {
  title: string;
  slug: string;
  date: string;
  summary: string;
  readTime: string;
  tags: string[];
}
