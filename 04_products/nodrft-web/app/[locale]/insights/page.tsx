import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { Locale } from "@/content/types";
import { InsightCard } from "@/components/sections/InsightCard";
import { FadeUp } from "@/components/motion/FadeUp";
import { getAllInsights } from "@/lib/insights";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.insights" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://nodrftsystems.com/${locale}/insights`,
      languages: {
        en: "https://nodrftsystems.com/en/insights",
        es: "https://nodrftsystems.com/es/insights",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `https://nodrftsystems.com/${locale}/insights`,
      images: [`/api/og?title=${encodeURIComponent(t("title"))}&locale=${locale}`],
    },
  };
}

const COPY = {
  en: {
    label: "Insights",
    heading: "Practical guidance before you choose the right package.",
    lead: "This page covers package fit, release discipline, handover quality, and proof posture for buyers evaluating website or digital build work — before scope conversations begin.",
    featuredLabel: "Featured Resources",
    featuredHeading: "Four resources that help buyers and operators get clear before starting a scope conversation.",
    featuredSub: "Designed to be useful, not performative — no newsletter, no gated downloads, no thought-leadership padding.",
    cards: [
      {
        type: "Guide",
        heading: "How to tell whether you need a Discovery Sprint or a larger build.",
        body: "The first decision is usually not technical. It is whether the business objective, scope, and next step are already clear enough for a direct website package.",
        bullets: [
          "Choose a Discovery Sprint when the offer, audience, or scope still feels unresolved.",
          "Choose a website package when the business already knows what must be launched, rebuilt, or clarified.",
          "Treat broader platform work as the next layer only when the website foundation is already credible.",
        ],
        chips: ["Package fit", "Buyer clarity"],
        linkHref: "#",
        linkLabel: "Review Website Packages →",
      },
      {
        type: "Brief",
        heading: "Release discipline matters more than feature volume.",
        body: "A website or digital build is not stronger just because it does more. It is stronger when review, scope boundaries, and launch conditions are explicit.",
        bullets: [
          "Make scope visible before the build absorbs extras that were never approved.",
          "Keep launch decisions tied to what is ready now, not to what might be added later.",
          "Use clear review gates whenever the public message, proof, or workflow notice could drift.",
        ],
        chips: ["Release discipline", "Scope control"],
        linkHref: "#",
        linkLabel: "See this in practice →",
      },
      {
        type: "Checklist",
        heading: "What a usable handover should include.",
        body: "A project is not durable if only the builder knows how it works. The next operator should be able to update, review, and manage the site without guessing.",
        bullets: [
          "A clear explanation of what was delivered and what was intentionally left out.",
          "Usable notes for the editing interface, launch assumptions, and next-step priorities.",
          "Named decision responsibility for who handles updates, approvals, and follow-on support.",
        ],
        chips: ["Handover", "Operations"],
        linkHref: "#",
        linkLabel: "See how we deliver →",
      },
      {
        type: "Note",
        heading: "Why public proof stays restrained.",
        body: "Selected Engagements is designed to be relevant without turning client work into a generic public portfolio. Restraint is part of the trust posture.",
        bullets: [
          "Problem classes and outcome direction can be public even when names and numbers stay private.",
          "Unsupported metrics should be removed instead of softened with polished design.",
          "If evidence is incomplete, the safer move is restraint, not storytelling.",
        ],
        chips: ["Proof posture", "Trust"],
        linkHref: "#",
        linkLabel: "View Selected Engagements →",
      },
    ],
    audienceLabel: "Who this helps",
    audienceHeading: "Different readers come here for different kinds of clarity.",
    audienceSub: "The same resource surface should help founders, delivery owners, and internal operators decide whether they have a package-fit issue, a release issue, or a clarity issue.",
    audience: [
      {
        heading: "Founders and leaders",
        body: "Use these briefs to separate presentation polish from actual readiness. The material is built to make scope, trust, and next-step decisions easier before money and time are committed.",
      },
      {
        heading: "Delivery owners",
        body: "Use them to reduce avoidable drift before a build expands. The guidance helps make scope boundaries, review discipline, and handover expectations visible earlier.",
      },
      {
        heading: "Teams planning a larger build",
        body: "Use the page to confirm whether the website foundation comes first. Many larger builds move faster after the public story, package fit, and buyer path are clarified through the website layer first.",
      },
    ],
    ctaHeading: "Use the guidance, then choose the right route.",
    ctaBody: "If the need is concrete, move into Start an Engagement. If the conversation is still exploratory, open an inquiry instead of forcing the buyer path too early.",
    ctaPrimary: "Start an Engagement",
    ctaSecondary: "Open an Inquiry",
  },
  es: {
    label: "Recursos",
    heading: "Guía práctica antes de elegir el paquete correcto.",
    lead: "Esta página cubre el ajuste de paquetes, la disciplina de release, la calidad de entrega y la postura de prueba para compradores que evalúan trabajo web o proyectos digitales — antes de que comiencen las conversaciones de alcance.",
    featuredLabel: "Recursos destacados",
    featuredHeading: "Cuatro recursos que ayudan a compradores y operadores a ganar claridad antes de iniciar una conversación de alcance.",
    featuredSub: "Diseñada para ser útil, no performativa — sin newsletter, sin descargas bloqueadas, sin relleno de liderazgo de pensamiento.",
    cards: [
      {
        type: "Guía",
        heading: "Cómo saber si necesita un Discovery Sprint o un proyecto mayor.",
        body: "La primera decisión normalmente no es técnica. Es definir si el objetivo del negocio, el alcance y el siguiente paso ya están lo bastante claros para entrar directo a un paquete web.",
        bullets: [
          "Elija un Discovery Sprint cuando la oferta, la audiencia o el alcance todavía se sientan sin resolver.",
          "Elija un paquete web cuando el negocio ya sabe qué debe lanzar, reconstruir o aclarar.",
          "Trate el trabajo de plataforma más amplio como la siguiente capa solo cuando la base web ya sea creíble.",
        ],
        chips: ["Ajuste de paquete", "Claridad comercial"],
        linkHref: "#",
        linkLabel: "Ver Paquetes Web →",
      },
      {
        type: "Resumen",
        heading: "La disciplina de release importa más que el volumen de funciones.",
        body: "Un sitio web o proyecto digital no es mejor solo porque haga más cosas. Es mejor cuando la revisión, los límites de alcance y las condiciones de lanzamiento son explícitos.",
        bullets: [
          "Haga visible el alcance antes de que el proyecto absorba extras que nunca fueron aprobados.",
          "Mantenga las decisiones de lanzamiento atadas a lo que está listo ahora, no a lo que podría agregarse después.",
          "Use puertas claras de revisión cada vez que el mensaje público, la prueba o un aviso de flujo puedan derivar.",
        ],
        chips: ["Disciplina de release", "Control de alcance"],
        linkHref: "#",
        linkLabel: "Ver esto en práctica →",
      },
      {
        type: "Checklist",
        heading: "Qué debe incluir una entrega final útil.",
        body: "Un proyecto no es durable si solo quien lo construyó sabe cómo funciona. La siguiente persona operadora debe poder actualizar, revisar y gestionar el sitio sin adivinar.",
        bullets: [
          "Una explicación clara de lo que se entregó y de lo que se dejó fuera de forma intencional.",
          "Notas utilizables sobre la interfaz de edición, los supuestos de lanzamiento y las prioridades del siguiente paso.",
          "Responsabilidad de decisión definida para quien maneja actualizaciones, aprobaciones y soporte posterior.",
        ],
        chips: ["Entrega final", "Operación"],
        linkHref: "#",
        linkLabel: "Ver cómo entregamos →",
      },
      {
        type: "Nota",
        heading: "Por qué la prueba pública se mantiene contenida.",
        body: "Selected Engagements está diseñado para ser relevante sin convertir el trabajo de clientes en un portafolio público genérico. La contención forma parte de la postura de confianza.",
        bullets: [
          "Las clases de problema y la dirección del resultado pueden ser públicas aunque los nombres y los números permanezcan privados.",
          "Las métricas no respaldadas deben eliminarse en lugar de suavizarse con un diseño pulido.",
          "Si la evidencia está incompleta, el movimiento más seguro es la contención, no la narrativa.",
        ],
        chips: ["Postura de prueba", "Confianza"],
        linkHref: "#",
        linkLabel: "Ver Proyectos Seleccionados →",
      },
    ],
    audienceLabel: "A quién ayuda",
    audienceHeading: "Distintas personas llegan aquí buscando distintos tipos de claridad.",
    audienceSub: "La misma superficie de recursos debe ayudar a fundadores, responsables de entrega y operadores internos a decidir si tienen un problema de ajuste de paquete, de release o de claridad.",
    audience: [
      {
        heading: "Fundadores y líderes",
        body: "Use estas guías para separar el pulido de presentación de la preparación real. El material está construido para facilitar decisiones sobre alcance, confianza y siguiente paso antes de comprometer tiempo y dinero.",
      },
      {
        heading: "Responsables de entrega",
        body: "Úselas para reducir deriva evitable antes de que el proyecto crezca. La guía ayuda a volver visibles antes los límites de alcance, la disciplina de revisión y las expectativas de entrega final.",
      },
      {
        heading: "Equipos que planean un proyecto mayor",
        body: "Use la página para confirmar si la base web debe venir primero. Muchos proyectos mayores avanzan más rápido después de aclarar primero la historia pública, el ajuste del paquete y la ruta comercial desde la capa web.",
      },
    ],
    ctaHeading: "Use la guía y luego elija la ruta correcta.",
    ctaBody: "Si la necesidad ya es concreta, pase a Iniciar un proyecto. Si la conversación sigue siendo exploratoria, abra una consulta en lugar de forzar la ruta comercial demasiado pronto.",
    ctaPrimary: "Iniciar un proyecto",
    ctaSecondary: "Abrir una consulta",
  },
};

// ---------------------------------------------------------------------------
// Published articles copy — bilingual labels for the MDX article list
// ---------------------------------------------------------------------------

const ARTICLES_COPY = {
  en: {
    sectionLabel: "Published Articles",
    sectionHeading: "In-depth guides and briefs from the field.",
    emptyState:
      "No articles published yet. Check back soon.",
    readLabel: "Read article",
    dateLabel: "Published",
  },
  es: {
    sectionLabel: "Artículos publicados",
    sectionHeading: "Guías detalladas y resúmenes del trabajo real.",
    emptyState:
      "Aún no hay artículos publicados. Vuelva pronto.",
    readLabel: "Leer artículo",
    dateLabel: "Publicado",
  },
} as const;

function formatArticleDate(isoDate: string, locale: string): string {
  try {
    return new Date(isoDate).toLocaleDateString(
      locale === "es" ? "es-ES" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  } catch {
    return isoDate;
  }
}

export default async function InsightsPage({ params }: Props) {
  const { locale } = await params;
  const loc = locale as Locale;
  const copy = COPY[loc];
  const articlesCopy = ARTICLES_COPY[loc];

  // getAllInsights() returns [] when content/insights/ is absent — safe.
  const articles = getAllInsights();

  return (
    <>
      {/* Header */}
      <section className="nd-section nd-geo-bg" aria-labelledby="insights-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label" style={{ display: "block", marginBottom: "var(--space-4)" }}>
              {copy.label}
            </span>
            <h1 id="insights-heading" className="nd-h1" style={{ marginBottom: "var(--space-6)" }}>
              {copy.heading}
            </h1>
            <p className="nd-lead">{copy.lead}</p>
          </FadeUp>
        </div>
      </section>

      {/* Featured resources */}
      <section className="nd-section alt" aria-labelledby="featured-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label" style={{ display: "block", marginBottom: "var(--space-4)" }}>
              {copy.featuredLabel}
            </span>
            <h2 id="featured-heading" className="nd-h2" style={{ marginBottom: "var(--space-4)" }}>
              {copy.featuredHeading}
            </h2>
            <p className="nd-p" style={{ marginBottom: "var(--space-8)" }}>{copy.featuredSub}</p>
          </FadeUp>
          <div className="nd-grid-2 nd-insights-grid">
            {copy.cards.map((card, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <InsightCard
                  locale={loc}
                  type={card.type}
                  heading={card.heading}
                  body={card.body}
                  bullets={card.bullets}
                  chips={card.chips}
                  linkHref={i === 0 ? `/${locale}/capabilities` : `/${locale}/engagements`}
                  linkLabel={card.linkLabel}
                />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Published MDX articles */}
      <section className="nd-section" aria-labelledby="articles-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label" style={{ display: "block", marginBottom: "var(--space-4)" }}>
              {articlesCopy.sectionLabel}
            </span>
            <h2 id="articles-heading" className="nd-h2" style={{ marginBottom: "var(--space-8)" }}>
              {articlesCopy.sectionHeading}
            </h2>
          </FadeUp>

          {articles.length === 0 ? (
            <FadeUp>
              <p className="nd-p" style={{ color: "var(--text-md)" }}>
                {articlesCopy.emptyState}
              </p>
            </FadeUp>
          ) : (
            <ul
              style={{ listStyle: "none", padding: 0, margin: 0 }}
              aria-label={articlesCopy.sectionLabel}
            >
              {articles.map((article, i) => (
                <FadeUp key={article.slug} delay={i * 0.07}>
                  <li
                    style={{
                      borderTop: "1px solid var(--border)",
                      padding: "var(--space-6) 0",
                    }}
                  >
                    <article aria-labelledby={`article-title-${article.slug}`}>
                      {/* Tags */}
                      {article.tags.length > 0 && (
                        <div
                          className="nd-chip-row"
                          aria-label="Topics"
                          style={{ marginBottom: "var(--space-3)" }}
                        >
                          {article.tags.map((tag) => (
                            <span key={tag} className="nd-chip">{tag}</span>
                          ))}
                        </div>
                      )}

                      <h3
                        id={`article-title-${article.slug}`}
                        className="nd-h3"
                        style={{ marginBottom: "var(--space-2)" }}
                      >
                        <a href={`/${locale}/insights/${article.slug}`}>
                          {article.title}
                        </a>
                      </h3>

                      <p className="nd-p-sm" style={{ marginBottom: "var(--space-3)", color: "var(--text-md)" }}>
                        <time dateTime={article.date}>
                          {formatArticleDate(article.date, locale)}
                        </time>
                        <span aria-hidden="true" style={{ margin: "0 var(--space-2)" }}>·</span>
                        {article.readTime}
                      </p>

                      <p className="nd-p-sm" style={{ marginBottom: "var(--space-4)" }}>
                        {article.summary}
                      </p>

                      <p className="nd-p-xs">
                        <a href={`/${locale}/insights/${article.slug}`}>
                          {articlesCopy.readLabel} →
                        </a>
                      </p>
                    </article>
                  </li>
                </FadeUp>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Audience */}
      <section className="nd-section" aria-labelledby="audience-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label" style={{ display: "block", marginBottom: "var(--space-4)" }}>
              {copy.audienceLabel}
            </span>
            <h2 id="audience-heading" className="nd-h2" style={{ marginBottom: "var(--space-4)" }}>
              {copy.audienceHeading}
            </h2>
            <p className="nd-p" style={{ marginBottom: "var(--space-8)" }}>{copy.audienceSub}</p>
          </FadeUp>
          <div className="nd-grid-why">
            {copy.audience.map((a, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div className="nd-card" style={{ position: "relative" }}>
                  <span className="nd-card__corner" aria-hidden="true" />
                  <h3 className="nd-h3" style={{ marginBottom: "var(--space-3)" }}>{a.heading}</h3>
                  <p className="nd-p-sm">{a.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="nd-section alt" aria-labelledby="insights-cta-heading">
        <div className="nd-wrap">
          <FadeUp>
            <div className="nd-section-cta">
              <h2 id="insights-cta-heading" className="nd-h2" style={{ marginBottom: "var(--space-4)" }}>
                {copy.ctaHeading}
              </h2>
              <p className="nd-p nd-section-cta__body">{copy.ctaBody}</p>
              <div className="nd-cta-row" style={{ justifyContent: "center" }}>
                <a href={`/${locale}/start`} className="btn">{copy.ctaPrimary}</a>
                <a href={`/${locale}/inquiries`} className="btn--ghost">{copy.ctaSecondary}</a>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
