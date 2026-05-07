import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { Locale } from "@/content/types";
import { packages, compareRows } from "@/content/capabilities";
import { PackageCard } from "@/components/ui/PackageCard";
import { FadeUp } from "@/components/motion/FadeUp";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.capabilities" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://nodrftsystems.com/${locale}/capabilities`,
      languages: {
        en: "https://nodrftsystems.com/en/capabilities",
        es: "https://nodrftsystems.com/es/capabilities",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `https://nodrftsystems.com/${locale}/capabilities`,
      images: [`/api/og?title=${encodeURIComponent(t("title"))}&locale=${locale}`],
    },
  };
}

const COPY = {
  en: {
    label: "Website Packages",
    heading: "Every scope is defined before build starts. Every deliverable hands off clean.",
    lead: "Eight defined scopes. Each one with explicit boundaries: what's in, what's out, what you own at the end, and what comes next.",
    sub: "Pricing is provided after an engagement inquiry. Scope determines price, and scope is established through a conversation.",
    findLabel: "Find your package",
    findSub: "Select the package that fits your situation.",
    pathLabel: "Which path fits",
    pathHeading: "Three starting situations. One right entry point each.",
    paths: [
      {
        tag: "You have a live site",
        heading: "Something about your current site is off.",
        body: "You're not sure whether to rebuild, refresh, or stay put. A Website Audit gives you a scored report and a clear recommendation before you commit to anything. If the scope for a rebuild is already clear, jump directly to the relevant build package.",
        cta: "Go to Website Audit →",
        href: "#pkg-audit",
      },
      {
        tag: "You need a new presence",
        heading: "You don't have a site, or yours doesn't represent you.",
        body: "Start with a Discovery Sprint if scope is unclear — multiple decision-makers, unknown platform requirements, an inherited situation, or a build that carries real business risk. If scope is already defined, go directly to Landing Page Sprint, Static Business Site, Business Launch Site, or Authority Website depending on page count and content management needs.",
        cta: "Go to Discovery Sprint →",
        href: "#pkg-discovery",
      },
      {
        tag: "You need more than a website",
        heading: "User accounts, dashboards, workflows, or data integrations.",
        body: "When the requirement is an application layer — not just a public-facing site — the entry point is Platform Starter (bounded: user login, dashboard, structured data intake, up to three integrations) or Ecosystem Build (multi-surface: public site, application, and admin panel as a single coordinated program). A Discovery Sprint is required before either.",
        cta: "Go to Platform Starter →",
        href: "#pkg-platform",
      },
    ],
    compareLabel: "Compare packages",
    compareHeading: "All eight packages at a glance.",
    compareColName: "Package",
    compareColBest: "Best for",
    compareColPrice: "Pricing",
    compareColTime: "Timeline",
    compareColNot: "Not for",
    thresholdLabel: "Scope guidance",
    thresholdHeading: "When to move to the next package.",
    thresholds: [
      {
        from: "Discovery Sprint",
        to: "any build package",
        trigger: "Scope has been defined. You know what must be built, who owns the decisions, and what comes first.",
      },
      {
        from: "Landing Page / Static Site",
        to: "Business Launch Site",
        trigger: "The client needs to edit content after launch without involving a developer.",
      },
      {
        from: "Business Launch Site",
        to: "Authority Website",
        trigger: "More than 5 pages, a content-driven credibility structure, search visibility as a primary objective, or three or more form types required.",
      },
      {
        from: "Authority Website",
        to: "Platform Starter",
        trigger: "The requirement includes a login layer, user-specific data, or a structured workflow that a content management system cannot handle.",
      },
      {
        from: "Platform Starter",
        to: "Ecosystem Build",
        trigger: "Multiple coordinated surfaces are required together: public marketing site, application layer, and admin panel as a single program.",
      },
    ],
    ctaHeading: "Ready to start?",
    ctaBody: "Submit a project brief if scope is clear. Open an inquiry if you need scope clarity first — we'll assess fit and recommend the right starting point.",
    ctaPrimary: "Start an Engagement",
    ctaSecondary: "Open an Inquiry",
  },
  es: {
    label: "Paquetes Web",
    heading: "Cada alcance se define antes de construir. Cada entregable se traspasa en orden.",
    lead: "Ocho alcances definidos. Cada uno con límites explícitos: qué incluye, qué no, qué usted posee al final y cuál es el siguiente paso.",
    sub: "El precio se proporciona tras una consulta de proyecto. El alcance determina el precio, y el alcance se establece mediante una conversación.",
    findLabel: "Encuentre su paquete",
    findSub: "Seleccione el paquete que se ajuste a su situación.",
    pathLabel: "Cuál ruta encaja",
    pathHeading: "Tres situaciones de partida. Un punto de entrada correcto para cada una.",
    paths: [
      {
        tag: "Tiene un sitio activo",
        heading: "Algo en su sitio actual no está funcionando.",
        body: "No está seguro de si reconstruir, actualizar o quedarse donde está. Una Auditoría de Sitio le da un informe puntuado y una recomendación clara antes de comprometerse. Si el alcance de reconstrucción ya está claro, salte directamente al paquete de construcción correspondiente.",
        cta: "Ir a Auditoría de Sitio →",
        href: "#pkg-audit",
      },
      {
        tag: "Necesita una nueva presencia",
        heading: "No tiene un sitio, o el suyo no lo representa.",
        body: "Comience con un Discovery Sprint si el alcance no está claro: múltiples responsables de decisión, requisitos de plataforma desconocidos, una situación heredada, o una construcción que conlleva riesgo real. Si el alcance ya está definido, vaya directamente a Sprint de Landing, Sitio Estático, Sitio de Lanzamiento o Sitio de Autoridad según el número de páginas y necesidades de gestión de contenido.",
        cta: "Ir a Discovery Sprint →",
        href: "#pkg-discovery",
      },
      {
        tag: "Necesita más que un sitio",
        heading: "Cuentas de usuario, paneles, flujos de trabajo o integraciones de datos.",
        body: "Cuando el requisito es una capa de aplicación — no solo un sitio público — el punto de entrada es Plataforma Inicial (acotado: acceso de usuario, panel, intake de datos estructurado, hasta tres integraciones) o Construcción de Ecosistema (multi-superficie: sitio público, aplicación y panel de administración como un programa coordinado único). Se requiere un Discovery Sprint antes de ambos.",
        cta: "Ir a Plataforma Inicial →",
        href: "#pkg-platform",
      },
    ],
    compareLabel: "Comparar paquetes",
    compareHeading: "Los ocho paquetes de un vistazo.",
    compareColName: "Paquete",
    compareColBest: "Ideal para",
    compareColPrice: "Precio",
    compareColTime: "Cronograma",
    compareColNot: "No es para",
    thresholdLabel: "Guía de alcance",
    thresholdHeading: "Cuándo pasar al siguiente paquete.",
    thresholds: [
      {
        from: "Discovery Sprint",
        to: "cualquier paquete de construcción",
        trigger: "El alcance ha sido definido. Usted sabe qué debe construirse, quién toma las decisiones y qué va primero.",
      },
      {
        from: "Landing Page / Sitio Estático",
        to: "Sitio de Lanzamiento",
        trigger: "El cliente necesita editar contenido tras el lanzamiento sin involucrar a un desarrollador.",
      },
      {
        from: "Sitio de Lanzamiento",
        to: "Sitio de Autoridad",
        trigger: "Más de 5 páginas, estructura de credibilidad basada en contenido, visibilidad en búsquedas como objetivo principal, o tres o más tipos de formulario.",
      },
      {
        from: "Sitio de Autoridad",
        to: "Plataforma Inicial",
        trigger: "El requisito incluye una capa de acceso, datos específicos por usuario, o un flujo estructurado que un gestor de contenido no puede manejar.",
      },
      {
        from: "Plataforma Inicial",
        to: "Construcción de Ecosistema",
        trigger: "Se requieren múltiples superficies coordinadas: sitio de marketing público, capa de aplicación y panel de administración como un programa único.",
      },
    ],
    ctaHeading: "¿Listo para comenzar?",
    ctaBody: "Envíe un brief de proyecto si el alcance es claro. Abra una consulta si necesita definir el alcance primero — evaluaremos el ajuste y recomendaremos el punto de partida correcto.",
    ctaPrimary: "Iniciar un Proyecto",
    ctaSecondary: "Abrir una Consulta",
  },
};

const JUMP_LABELS = {
  "pkg-audit":     { en: "Website Audit",        es: "Auditoría de Sitio" },
  "pkg-discovery": { en: "Discovery Sprint",      es: "Discovery Sprint" },
  "pkg-landing":   { en: "Landing Page Sprint",   es: "Sprint de Landing" },
  "pkg-static":    { en: "Static Business Site",  es: "Sitio Estático" },
  "pkg-launch":    { en: "Business Launch Site",  es: "Sitio de Lanzamiento" },
  "pkg-authority": { en: "Authority Website",     es: "Sitio de Autoridad" },
  "pkg-platform":  { en: "Platform Starter",      es: "Plataforma Inicial" },
  "pkg-ecosystem": { en: "Ecosystem Build",       es: "Ecosistema" },
} as const;

export default async function CapabilitiesPage({ params }: Props) {
  const { locale } = await params;
  const loc = locale as Locale;
  const copy = COPY[loc];

  return (
    <>
      {/* Header */}
      <section className="nd-section nd-geo-bg" aria-labelledby="cap-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label" style={{ display: "block", marginBottom: "var(--space-4)" }}>
              {copy.label}
            </span>
            <h1 id="cap-heading" className="nd-h1" style={{ marginBottom: "var(--space-6)" }}>
              {copy.heading}
            </h1>
            <p className="nd-lead" style={{ marginBottom: "var(--space-4)" }}>{copy.lead}</p>
            <p className="nd-p-xs nd-pkg-subtext">{copy.sub}</p>
          </FadeUp>
        </div>
      </section>

      {/* Jump menu */}
      <section className="nd-section alt" aria-label={copy.findLabel}>
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label" style={{ display: "block", marginBottom: "var(--space-3)" }}>
              {copy.findLabel}
            </span>
            <p className="nd-p-xs" style={{ marginBottom: "var(--space-5)", color: "var(--text-md)" }}>
              {copy.findSub}
            </p>
            <div className="nd-chips" role="list">
              {packages.map((pkg) => {
                const label = JUMP_LABELS[pkg.id as keyof typeof JUMP_LABELS];
                return (
                  <a
                    key={pkg.id}
                    href={`#${pkg.id}`}
                    role="listitem"
                    className={`nd-chip nd-chip--jump nd-chip--${pkg.tier}`}
                  >
                    {label ? label[loc] : pkg.id}
                  </a>
                );
              })}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Problem paths */}
      <section className="nd-section" aria-labelledby="paths-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label" style={{ display: "block", marginBottom: "var(--space-4)" }}>
              {copy.pathLabel}
            </span>
            <h2 id="paths-heading" className="nd-h2" style={{ marginBottom: "var(--space-8)" }}>
              {copy.pathHeading}
            </h2>
          </FadeUp>
          <div className="nd-grid-why">
            {copy.paths.map((path, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div className="nd-card nd-path-card" style={{ position: "relative" }}>
                  <span className="nd-card__corner" aria-hidden="true" />
                  <span className="nd-label nd-path-tag" style={{ display: "block", marginBottom: "var(--space-3)" }}>
                    {path.tag}
                  </span>
                  <h3 className="nd-h3" style={{ marginBottom: "var(--space-3)" }}>{path.heading}</h3>
                  <p className="nd-p-sm" style={{ marginBottom: "var(--space-5)" }}>{path.body}</p>
                  <a href={path.href} className="nd-link-arrow">{path.cta}</a>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Compare strip */}
      <section className="nd-section alt" aria-labelledby="compare-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label" style={{ display: "block", marginBottom: "var(--space-4)" }}>
              {copy.compareLabel}
            </span>
            <h2 id="compare-heading" className="nd-h2" style={{ marginBottom: "var(--space-6)" }}>
              {copy.compareHeading}
            </h2>
          </FadeUp>
          <FadeUp delay={0.07}>
            <div className="nd-compare-wrap">
              <table className="nd-compare-table" role="table">
                <thead>
                  <tr>
                    <th scope="col">{copy.compareColName}</th>
                    <th scope="col">{copy.compareColBest}</th>
                    <th scope="col">{copy.compareColPrice}</th>
                    <th scope="col">{copy.compareColTime}</th>
                    <th scope="col">{copy.compareColNot}</th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <a href={`#${row.id}`} className="nd-table-link">
                          {row.name[loc]}
                        </a>
                      </td>
                      <td>{row.best[loc]}</td>
                      <td className="nd-table-price">{row.price[loc]}</td>
                      <td className="nd-table-time">{row.time[loc]}</td>
                      <td className="nd-table-not">{row.notFor[loc]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Package sections — rendered from data, alternating background */}
      {packages.map((pkg, i) => (
        <PackageCard
          key={pkg.id}
          pkg={pkg}
          locale={loc}
          startHref={`/${locale}/start`}
          alt={i % 2 !== 0}
        />
      ))}

      {/* Scope threshold ladder */}
      <section className="nd-section alt" aria-labelledby="threshold-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label" style={{ display: "block", marginBottom: "var(--space-4)" }}>
              {copy.thresholdLabel}
            </span>
            <h2 id="threshold-heading" className="nd-h2" style={{ marginBottom: "var(--space-8)" }}>
              {copy.thresholdHeading}
            </h2>
          </FadeUp>
          <div className="nd-threshold-list">
            {copy.thresholds.map((item, i) => (
              <FadeUp key={i} delay={i * 0.06}>
                <div className="nd-threshold-item">
                  <div className="nd-threshold-from">
                    <span className="nd-label">{item.from}</span>
                    <span className="nd-threshold-arrow" aria-hidden="true">→</span>
                    <span className="nd-label nd-threshold-to">{item.to}</span>
                  </div>
                  <p className="nd-p-sm nd-threshold-trigger">{item.trigger}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Hourly Advisory */}
      <section id="pkg-advisory" className="nd-section alt" aria-labelledby="advisory-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label" style={{ display: "block", marginBottom: "var(--space-3)" }}>
              {loc === "en" ? "ADVISORY" : "CONSULTORÍA"}
            </span>
            <h2 id="advisory-heading" className="nd-h2" style={{ marginBottom: "var(--space-3)" }}>
              {loc === "en" ? "Hourly Advisory" : "Consultoría por Hora"}
            </h2>
            <p className="nd-p" style={{ maxWidth: "600px", marginBottom: "var(--space-8)" }}>
              {loc === "en"
                ? "For consultations, audits, and bounded expert input before or outside a fixed build commitment. Advisory is documented, time-boxed, and not a substitute for a fixed package."
                : "Para consultas, auditorías y apoyo experto acotado antes o fuera de un compromiso de build fijo. No sustituye un paquete fijo."}
            </p>
          </FadeUp>
          <FadeUp delay={0.05}>
            <div style={{ overflowX: "auto", marginBottom: "var(--space-8)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th style={{ textAlign: "left", padding: "8px 12px 10px 0", color: "var(--text-md)", fontWeight: 500 }}>
                      {loc === "en" ? "Discipline" : "Disciplina"}
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 12px 10px 12px", color: "var(--text-md)", fontWeight: 500 }}>
                      {loc === "en" ? "Rate" : "Tarifa"}
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 0 10px 12px", color: "var(--text-md)", fontWeight: 500 }}>
                      {loc === "en" ? "Minimum" : "Mínimo"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      discipline: { en: "Implementation support", es: "Soporte de implementación" },
                      rate: { en: "From $95 / hr", es: "Desde $95 / hr" },
                      minimum: { en: "Signed scope addendum required", es: "Requiere addendum de alcance firmado" },
                    },
                    {
                      discipline: { en: "Strategy, QA, and security review", es: "Estrategia, QA y revisión de seguridad" },
                      rate: { en: "$125–$175 / hr", es: "$125–$175 / hr" },
                      minimum: { en: "2 hours", es: "2 horas" },
                    },
                    {
                      discipline: { en: "Architecture, AI systems, and rescue", es: "Arquitectura, sistemas de IA y rescate" },
                      rate: { en: "Quoted separately", es: "Cotización separada" },
                      minimum: { en: "2 hours", es: "2 horas" },
                    },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: i < 2 ? "1px solid var(--border-subtle)" : undefined }}>
                      <td style={{ padding: "12px 12px 12px 0", color: "var(--ink)" }}>{row.discipline[loc]}</td>
                      <td style={{ padding: "12px", color: "var(--ink)", fontWeight: 600, fontFamily: "var(--nd-font-mono)", letterSpacing: "-0.01em" }}>{row.rate[loc]}</td>
                      <td style={{ padding: "12px 0 12px 12px", color: "var(--text-md)" }}>{row.minimum[loc]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div style={{ display: "flex", gap: "var(--space-10)", flexWrap: "wrap", marginBottom: "var(--space-6)" }}>
              <div>
                <h3 className="nd-h3" style={{ marginBottom: "var(--space-4)" }}>
                  {loc === "en" ? "What advisory covers" : "Qué cubre la consultoría"}
                </h3>
                {(loc === "en" ? [
                  "Expert consultation session with written summary note",
                  "Written review of an existing site, codebase, or document",
                  "Pre-build advisory for teams evaluating whether to proceed",
                ] : [
                  "Sesión experta con nota de resumen escrita",
                  "Revisión escrita de un sitio, código o documento existente",
                  "Consultoría previa al build para equipos que evalúan si seguir",
                ]).map((item, i) => (
                  <p key={i} className="nd-inc" style={{ marginBottom: "var(--space-2)" }}>{item}</p>
                ))}
              </div>
              <div>
                <h3 className="nd-h3" style={{ marginBottom: "var(--space-4)", color: "var(--text-md)" }}>
                  {loc === "en" ? "What advisory does not cover" : "Qué no cubre la consultoría"}
                </h3>
                {(loc === "en" ? [
                  "Full website or platform builds — use fixed packages",
                  "Ongoing support and iteration — use a Maintenance Retainer",
                  "Open-ended delivery without a defined scope and signed agreement",
                ] : [
                  "Builds completos de sitio o plataforma — use paquetes fijos",
                  "Soporte e iteración continua — use un Retainer de Mantenimiento",
                  "Entrega abierta sin alcance definido y acuerdo firmado",
                ]).map((item, i) => (
                  <p key={i} className="nd-exc" style={{ marginBottom: "var(--space-2)" }}>{item}</p>
                ))}
              </div>
            </div>
            <p className="nd-p-sm" style={{ color: "var(--text-md)", fontStyle: "italic" }}>
              {loc === "en"
                ? "Quoted by appointment. Fixed packages remain the default for production work."
                : "Cotizado con cita previa. Los paquetes fijos siguen siendo el estándar para producción."}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Social Content Creation */}
      <section id="pkg-social" className="nd-section" aria-labelledby="social-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label" style={{ display: "block", marginBottom: "var(--space-3)" }}>
              {loc === "en" ? "CONTENT CREATION" : "CREACIÓN DE CONTENIDO"}
            </span>
            <h2 id="social-heading" className="nd-h2" style={{ marginBottom: "var(--space-3)" }}>
              {loc === "en" ? "Social Content Production" : "Producción de Contenido Social"}
            </h2>
            <p className="nd-p" style={{ maxWidth: "640px", marginBottom: "var(--space-8)" }}>
              {loc === "en"
                ? "Platform-native content for Instagram, TikTok, and Facebook — strategy, copy, design, and delivery. Platform boosting and ad spend are client-managed and client-paid, separate from production fees."
                : "Contenido nativo para Instagram, TikTok y Facebook — estrategia, redacción, diseño y entrega. El impulso de plataforma y el gasto en publicidad son administrados y pagados directamente por el cliente, separados de las tarifas de producción."}
            </p>
          </FadeUp>
          <FadeUp delay={0.05}>
            <div style={{ overflowX: "auto", marginBottom: "var(--space-8)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th style={{ textAlign: "left", padding: "8px 12px 10px 0", color: "var(--text-md)", fontWeight: 500 }}>
                      {loc === "en" ? "Package" : "Paquete"}
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 12px 10px 12px", color: "var(--text-md)", fontWeight: 500 }}>
                      {loc === "en" ? "Volume" : "Volumen"}
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 12px 10px 12px", color: "var(--text-md)", fontWeight: 500 }}>
                      {loc === "en" ? "Platforms" : "Plataformas"}
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 0 10px 12px", color: "var(--text-md)", fontWeight: 500 }}>
                      {loc === "en" ? "Pricing" : "Precio"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: { en: "Content Foundation", es: "Base de Contenido" },
                      volume: { en: "8 posts / month", es: "8 publicaciones / mes" },
                      platforms: { en: "Instagram + TikTok", es: "Instagram + TikTok" },
                      price: { en: "Quoted on inquiry", es: "Cotización en consulta" },
                    },
                    {
                      name: { en: "Content Engine", es: "Motor de Contenido" },
                      volume: { en: "16 posts / month", es: "16 publicaciones / mes" },
                      platforms: { en: "Instagram, TikTok, Facebook", es: "Instagram, TikTok, Facebook" },
                      price: { en: "Quoted on inquiry", es: "Cotización en consulta" },
                    },
                    {
                      name: { en: "Content System", es: "Sistema de Contenido" },
                      volume: { en: "24–30 posts / month", es: "24–30 publicaciones / mes" },
                      platforms: { en: "Instagram, TikTok, Facebook", es: "Instagram, TikTok, Facebook" },
                      price: { en: "Quoted on inquiry", es: "Cotización en consulta" },
                    },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: i < 2 ? "1px solid var(--border-subtle)" : undefined }}>
                      <td style={{ padding: "12px 12px 12px 0", color: "var(--ink)", fontWeight: 600 }}>{row.name[loc]}</td>
                      <td style={{ padding: "12px", color: "var(--ink)" }}>{row.volume[loc]}</td>
                      <td style={{ padding: "12px", color: "var(--text-md)" }}>{row.platforms[loc]}</td>
                      <td style={{ padding: "12px 0 12px 12px", color: "var(--ink)", fontFamily: "var(--nd-font-mono)", letterSpacing: "-0.01em" }}>{row.price[loc]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div style={{ display: "flex", gap: "var(--space-10)", flexWrap: "wrap", marginBottom: "var(--space-6)" }}>
              <div>
                <h3 className="nd-h3" style={{ marginBottom: "var(--space-4)" }}>
                  {loc === "en" ? "What content production covers" : "Qué cubre la producción de contenido"}
                </h3>
                {(loc === "en" ? [
                  "Monthly content calendar planned and delivered in advance",
                  "Copywriting, caption strategy, and hashtag research",
                  "Static and animated graphics matched to brand standards",
                  "Video concept scripts and creative direction briefs",
                  "Client approval round before any post is scheduled",
                ] : [
                  "Calendario de contenido mensual planificado y entregado con anticipación",
                  "Redacción, estrategia de captions e investigación de hashtags",
                  "Gráficos estáticos y animados alineados con los estándares de marca",
                  "Guiones de concepto de video y briefs de dirección creativa",
                  "Ronda de aprobación del cliente antes de programar cualquier publicación",
                ]).map((item, i) => (
                  <p key={i} className="nd-inc" style={{ marginBottom: "var(--space-2)" }}>{item}</p>
                ))}
              </div>
              <div>
                <h3 className="nd-h3" style={{ marginBottom: "var(--space-4)", color: "var(--text-md)" }}>
                  {loc === "en" ? "What content production does not cover" : "Qué no cubre la producción de contenido"}
                </h3>
                {(loc === "en" ? [
                  "Platform ad spend and boosting — client pays these directly to the platform",
                  "Video filming or on-site production — scripting and direction are included; camera work is not",
                  "Platform account management without a content production engagement",
                ] : [
                  "Gasto en publicidad e impulso en plataformas — el cliente paga esto directamente a la plataforma",
                  "Filmación de video o producción en sitio — guiones y dirección incluidos; trabajo de cámara no",
                  "Gestión de cuentas de plataforma sin un compromiso de producción de contenido",
                ]).map((item, i) => (
                  <p key={i} className="nd-exc" style={{ marginBottom: "var(--space-2)" }}>{item}</p>
                ))}
              </div>
            </div>
            <p className="nd-p-sm" style={{ color: "var(--text-md)", fontStyle: "italic" }}>
              {loc === "en"
                ? "All tiers are monthly retainer engagements. Scope and platform mix confirmed at onboarding."
                : "Todos los niveles son compromisos de retención mensual. El alcance y la combinación de plataformas se confirman en el inicio."}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section className="nd-section" aria-labelledby="cap-cta-heading">
        <div className="nd-wrap">
          <FadeUp>
            <div className="nd-section-cta">
              <h2 id="cap-cta-heading" className="nd-h2" style={{ marginBottom: "var(--space-4)" }}>
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
