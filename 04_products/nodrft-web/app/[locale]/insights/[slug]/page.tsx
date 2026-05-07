import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllInsightSlugs, getInsightBySlug } from "@/lib/insights";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// ---------------------------------------------------------------------------
// Static generation
// ---------------------------------------------------------------------------

/**
 * Emits one { locale, slug } entry per MDX file per locale.
 * Returns an empty array when content/insights/ is absent or empty —
 * Next.js will not pre-render any article pages until MDX files exist.
 */
export async function generateStaticParams(): Promise<
  { locale: string; slug: string }[]
> {
  const slugs = getAllInsightSlugs();
  const locales = ["en", "es"] as const;

  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getInsightBySlug(slug, locale);

  if (!article) {
    return {
      title: "Not Found — NoDrftSystems",
    };
  }

  const { frontmatter: fm } = article;

  return {
    title: `${fm.title} — NoDrftSystems`,
    description: fm.summary,
    alternates: {
      canonical: `https://nodrftsystems.com/${locale}/insights/${slug}`,
      languages: {
        en: `https://nodrftsystems.com/en/insights/${slug}`,
        es: `https://nodrftsystems.com/es/insights/${slug}`,
      },
    },
    openGraph: {
      title: fm.title,
      description: fm.summary,
      url: `https://nodrftsystems.com/${locale}/insights/${slug}`,
      images: [
        `/api/og?title=${encodeURIComponent(fm.title)}&locale=${locale}`,
      ],
    },
  };
}

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

function formatDate(isoDate: string, locale: string): string {
  try {
    return new Date(isoDate).toLocaleDateString(
      locale === "es" ? "es-ES" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  } catch {
    // Return the raw ISO string if the date is malformed rather than crashing
    return isoDate;
  }
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default async function InsightPage({ params }: Props) {
  const { locale, slug } = await params;
  const article = getInsightBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  const { frontmatter: fm, content } = article;
  const displayDate = formatDate(fm.date, locale);

  return (
    <main className="nd-section" aria-labelledby="article-title">
      <div className="nd-wrap" style={{ maxWidth: "720px" }}>

        {/* Back navigation */}
        <p className="nd-p-xs" style={{ marginBottom: "var(--space-8)" }}>
          <a href={`/${locale}/insights`}>
            {locale === "es" ? "← Volver a Recursos" : "← Back to Insights"}
          </a>
        </p>

        {/* Article header */}
        <header style={{ marginBottom: "var(--space-10)" }}>
          {/* Tags */}
          {fm.tags.length > 0 && (
            <div
              className="nd-chip-row"
              aria-label="Topics"
              style={{ marginBottom: "var(--space-4)" }}
            >
              {fm.tags.map((tag) => (
                <span key={tag} className="nd-chip">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 id="article-title" className="nd-h1" style={{ marginBottom: "var(--space-4)" }}>
            {fm.title}
          </h1>

          {/* Meta row — date + read time */}
          <p
            className="nd-p-sm"
            style={{ color: "var(--text-md)" }}
            aria-label="Article metadata"
          >
            <time dateTime={fm.date}>{displayDate}</time>
            <span aria-hidden="true" style={{ margin: "0 var(--space-2)" }}>
              ·
            </span>
            {fm.readTime}
          </p>
        </header>

        <article
          className="nd-prose"
          aria-label="Article body"
          style={{ marginBottom: "var(--space-16)" }}
        >
          <MDXRemote source={content} />
        </article>

        {/* Back navigation (bottom) */}
        <p className="nd-p-xs">
          <a href={`/${locale}/insights`}>
            {locale === "es" ? "← Volver a Recursos" : "← Back to Insights"}
          </a>
        </p>

      </div>
    </main>
  );
}
