import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { InsightFrontmatter } from "@/content/types";

const CONTENT_DIR = path.join(process.cwd(), "content", "insights");

// ---------------------------------------------------------------------------
// Validation helper
//
// Surface a descriptive error at build time rather than silently returning
// malformed frontmatter that would corrupt the page at runtime.
// ---------------------------------------------------------------------------

function assertFrontmatter(
  slug: string,
  data: Record<string, unknown>
): InsightFrontmatter {
  const required: Array<keyof InsightFrontmatter> = [
    "title",
    "slug",
    "date",
    "summary",
    "readTime",
    "tags",
  ];

  for (const field of required) {
    if (data[field] === undefined || data[field] === "") {
      throw new Error(
        `[insights] Missing required frontmatter field "${field}" in ${slug}.mdx`
      );
    }
  }

  if (!Array.isArray(data["tags"])) {
    throw new Error(
      `[insights] "tags" must be a YAML sequence in ${slug}.mdx`
    );
  }

  return {
    title: String(data["title"]),
    slug: String(data["slug"]),
    date: String(data["date"]),
    summary: String(data["summary"]),
    readTime: String(data["readTime"]),
    tags: (data["tags"] as unknown[]).map(String),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns all canonical slugs (EN primary files only — excludes *.es.mdx).
 * Returns an empty array when content/insights/ is absent or empty.
 */
export function getAllInsightSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") && !f.endsWith(".es.mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

/**
 * Reads and parses a single MDX file by slug and locale.
 * For locale "es", tries slug.es.mdx first and falls back to slug.mdx.
 * Returns null if no file exists.
 */
export function getInsightBySlug(
  slug: string,
  locale = "en"
): { frontmatter: InsightFrontmatter; content: string } | null {
  const candidates =
    locale === "es"
      ? [path.join(CONTENT_DIR, `${slug}.es.mdx`), path.join(CONTENT_DIR, `${slug}.mdx`)]
      : [path.join(CONTENT_DIR, `${slug}.mdx`)];

  const filePath = candidates.find((p) => fs.existsSync(p));
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = assertFrontmatter(slug, data as Record<string, unknown>);

  return { frontmatter, content };
}

/**
 * Returns all InsightFrontmatter objects sorted newest-first by date.
 * Files that fail frontmatter validation are surfaced as build-time errors,
 * not silently skipped, so malformed content does not produce ghost entries.
 */
export function getAllInsights(): InsightFrontmatter[] {
  const slugs = getAllInsightSlugs();

  return slugs
    .map((slug): InsightFrontmatter | null => {
      const result = getInsightBySlug(slug);
      return result?.frontmatter ?? null;
    })
    .filter((fm): fm is InsightFrontmatter => fm !== null)
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}
