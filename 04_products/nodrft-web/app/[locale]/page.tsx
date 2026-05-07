import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { Locale } from "@/content/types";
import { FadeUp } from "@/components/motion/FadeUp";
import { HeroAnimated } from "@/components/motion/HeroAnimated";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://nodrftsystems.com/${locale}`,
      languages: {
        en: "https://nodrftsystems.com/en",
        es: "https://nodrftsystems.com/es",
        "x-default": "https://nodrftsystems.com/en",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `https://nodrftsystems.com/${locale}`,
      images: [`/api/og?title=${encodeURIComponent(t("title"))}&locale=${locale}`],
    },
  };
}

const MISCONCEPTIONS = {
  en: [
    {
      q: "“We already have a website.”",
      a: "Having a site and having a site that works are different things. Most websites function as presence markers, not conversion assets. The question is whether your site is doing work when you’re not in the room.",
    },
    {
      q: "“We get business through referrals.”",
      a: "Referrals still check the site. A warm introduction gets the attention; the site either validates the referral or quietly works against it. Most referral leakage is invisible—it happens before contact is made.",
    },
    {
      q: "“A freelancer can do this cheaper.”",
      a: "The comparison that matters is total project cost and delivery outcome — not hourly rate. Scope drift, rework cycles, and sites that fail without continued developer involvement are common in underscoped builds. You’re not hiring a rate. You’re buying a result.",
    },
    {
      q: "“We just need a refresh, not a rebuild.”",
      a: "A refresh fixes surface appearance. A rebuild fixes the underlying architecture. Most refresh requests are diagnosing symptom rather than cause—the site looks dated because the structure was wrong from the start.",
    },
    {
      q: "“This is for bigger companies.”",
      a: "The firms that defer digital infrastructure investment until they’re larger often don’t get there. Structured digital presence isn’t a reward for scale—it’s a condition for it.",
    },
    {
      q: "“We’ll do this once content is ready.”",
      a: "Content readiness is managed during scoping, not as a prerequisite to it. Waiting for perfect content postpones structure, routing, and design—and perfect content rarely arrives on its own.",
    },
  ],
  es: [
    {
      q: "“Ya tenemos un sitio web.”",
      a: "Tener un sitio y tener un sitio que funcione son cosas distintas. La mayoría de los sitios web son marcadores de presencia, no activos de conversión. La pregunta es si su sitio trabaja cuando usted no está.",
    },
    {
      q: "“Conseguimos clientes por referencias.”",
      a: "Las referencias igual revisan el sitio. Una presentación cálida consigue la atención; el sitio la valida o silenciosamente trabaja en su contra. La fuga de referencias es invisible: ocurre antes de que se haga contacto.",
    },
    {
      q: "“Un freelancer puede hacerlo más barato.”",
      a: "La comparación que importa es el costo total del proyecto y el resultado final, no la tarifa por hora. La desviación del alcance, los ciclos de retrabajo y los sitios que fallan sin soporte continuo son comunes en construcciones mal definidas. No se contrata una tarifa. Se compra un resultado.",
    },
    {
      q: "“Solo necesitamos una actualización, no una reconstrucción.”",
      a: "Una actualización corrige la apariencia superficial. Una reconstrucción corrige la arquitectura subyacente. La mayoría de solicitudes de actualización diagnostican síntomas en lugar de causas.",
    },
    {
      q: "“Esto es para empresas más grandes.”",
      a: "Las empresas que difieren la inversión en infraestructura digital hasta ser más grandes a menudo no llegan. Una presencia digital estructurada no es una recompensa para la escala, es una condición para ella.",
    },
    {
      q: "“Lo haremos cuando el contenido esté listo.”",
      a: "La preparación del contenido se gestiona durante el alcance, no como requisito previo. Esperar contenido perfecto pospone estructura, enrutamiento y diseño.",
    },
  ],
};

const FIT = {
  en: {
    label: "Who we serve best",
    items: [
      "Organizations where positioning accuracy and delivery consistency are strategic requirements",
      "Teams with defined decision authority and a scope that can be locked before build begins",
      "Projects where a single accountable decision-maker holds scope authority",
      "Companies investing in systems that must remain correct through handoff — without rework cycles",
    ],
    note: "Not every project is accepted. Fit matters to the quality of the outcome. We evaluate scope clarity, timeline, decision structure, and budget reality before proposing. When it’s a strong fit, the engagement gets full commitment.",
  },
  es: {
    label: "A quiénes servimos mejor",
    items: [
      "Organizaciones donde la precisión de posicionamiento y la consistencia de entrega son requisitos estratégicos",
      "Equipos con autoridad de decisión definida y un alcance que puede cerrarse antes de construir",
      "Proyectos donde un único responsable de decisiones mantiene la autoridad de alcance",
      "Empresas que invierten en sistemas que deben mantenerse correctos hasta el traspaso — sin ciclos de retrabajo",
    ],
    note: "No todos los proyectos son aceptados. El ajuste importa para la calidad del resultado. Evaluamos la claridad del alcance, el cronograma, la estructura de decisiones y la realidad del presupuesto antes de proponer. Cuando es un ajuste sólido, el compromiso es total.",
  },
};

const PROCESS = {
  en: [
    { num: "01", title: "Discovery", body: "Clarify business goals, constraints, and fit. Confirm whether engagement is the right move." },
    { num: "02", title: "Scope Definition", body: "Confirm exactly what is being built, what is excluded, and what success means." },
    { num: "03", title: "Structure & Direction", body: "Establish content architecture, page or system logic, and design direction." },
    { num: "04", title: "Build", body: "Implementation under controlled execution with bounded milestones and review gates." },
    { num: "05", title: "Review & QA", body: "Validation, corrections, and release checks. Nothing ships without sign-off." },
    { num: "06", title: "Launch & Handoff", body: "Deployment, documentation, and next-step recommendation. Client owns the result." },
  ],
  es: [
    { num: "01", title: "Descubrimiento", body: "Clarificar objetivos de negocio, restricciones y ajuste. Confirmar si el compromiso es la decisión correcta." },
    { num: "02", title: "Definición de Alcance", body: "Confirmar exactamente qué se construye, qué se excluye y qué significa el éxito." },
    { num: "03", title: "Estructura y Dirección", body: "Establecer arquitectura de contenido, lógica de página o sistema, y dirección de diseño." },
    { num: "04", title: "Construcción", body: "Implementación bajo ejecución controlada con hitos acotados y compuertas de revisión." },
    { num: "05", title: "Revisión y Validación", body: "Validación, correcciones y verificaciones de lanzamiento. Nada se publica sin aprobación." },
    { num: "06", title: "Lanzamiento y Traspaso", body: "Despliegue, documentación y recomendación del siguiente paso. El cliente es propietario del resultado." },
  ],
};

const ENTRY_PKGS = {
  en: [
    { name: "Discovery Sprint", body: "Defines scope and execution path before any build begins.", sub: "The right first step when requirements aren’t fully defined.", timeline: "1 week" },
    { name: "Conversion Landing Page Sprint", body: "One focused page built to convert one offer, audience, or campaign objective.", sub: "One offer, one page, clear conversion path.", timeline: "10 business days" },
    { name: "Static Business Site", body: "A multi-page brochure-style site for stable content, clear positioning, and low maintenance.", sub: "No CMS overhead and no editorial workflow by default.", timeline: "10–12 business days" },
    { name: "Business Launch Site", body: "A complete CMS-backed business website structured to stay correct after handoff.", sub: "For teams that need client-editable content, not just a locked brochure build.", timeline: "15 business days" },
  ],
  es: [
    { name: "Discovery Sprint", body: "Define el alcance y el camino de ejecución antes de construir.", sub: "El primer paso correcto cuando los requisitos aún no están definidos.", timeline: "1 semana" },
    { name: "Sprint de Landing Page de Conversión", body: "Una página enfocada en convertir una oferta, audiencia u objetivo de campaña.", sub: "Una oferta, una página, camino de conversión claro.", timeline: "10 días hábiles" },
    { name: "Sitio Empresarial Estático", body: "Un sitio multipágina tipo brochure para contenido estable, posicionamiento claro y bajo mantenimiento.", sub: "Sin sobrecarga de CMS y sin flujo editorial por defecto.", timeline: "10–12 días hábiles" },
    { name: "Sitio de Lanzamiento Empresarial", body: "Un sitio empresarial con CMS estructurado para mantenerse correcto después del traspaso.", sub: "Para equipos que necesitan contenido editable, no solo un brochure bloqueado.", timeline: "15 días hábiles" },
  ],
};

const WORK_ON_RECORD = {
  en: {
    label: "Work on record",
    items: [
      "Restructured the digital presence of a 30-person professional services firm — from a static site to a structured authority build with bilingual delivery and self-qualifying intake flow.",
      "Delivered a gated PropTech application with authentication, data integration, and admin controls — scoped and executed under strict access requirements.",
    ],
    disclaimer: "Client names not disclosed. Outcomes framed qualitatively.",
    link: "View all selected engagements →",
  },
  es: {
    label: "Trabajo realizado",
    items: [
      "Reestructuración de la presencia digital de una firma de servicios profesionales de 30 personas — de un sitio estático a una plataforma de autoridad con entrega bilingüe y flujo de intake auto-calificante.",
      "Entrega de una aplicación PropTech con autenticación, integración de datos y controles de administración — definida y ejecutada bajo requisitos estrictos de acceso.",
    ],
    disclaimer: "Nombres de clientes no revelados. Resultados enmarcados cualitativamente.",
    link: "Ver todos los proyectos seleccionados →",
  },
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const loc = locale as Locale;

  const misconceptions = MISCONCEPTIONS[loc];
  const fit = FIT[loc];
  const process = PROCESS[loc];
  const entryPkgs = ENTRY_PKGS[loc];
  const workRecord = WORK_ON_RECORD[loc];

  const STRENGTHS = [
    { title: t("strength1Title"), body: t("strength1Body") },
    { title: t("strength2Title"), body: t("strength2Body") },
    { title: t("strength3Title"), body: t("strength3Body") },
    { title: t("strength4Title"), body: t("strength4Body") },
    { title: t("strength5Title"), body: t("strength5Body") },
  ];

  const COSTS = [
    { title: t("cost1Title"), body: t("cost1Body") },
    { title: t("cost2Title"), body: t("cost2Body") },
    { title: t("cost3Title"), body: t("cost3Body") },
    { title: t("cost4Title"), body: t("cost4Body") },
    { title: t("cost5Title"), body: t("cost5Body") },
    {
      title: loc === "en" ? "Rework and fragility" : "Retrabajo y fragilidad",
      body: loc === "en"
        ? "Builds scoped incorrectly don’t get extended—they get rebuilt. The short-term savings of an underscoped build are often outweighed by the rework cycle it creates."
        : "Las construcciones con alcance incorrecto no se extienden, se reconstruyen. Los ahorros a corto plazo de una construcción mal definida son superados por el ciclo de retrabajo que crean.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="nd-hero nd-geo-bg" aria-labelledby="hero-heading">
        <HeroAnimated
          label={t("markerLabel")}
          headline1={t("headline1")}
          headline2={t("headline2")}
          lead={t("lead")}
          ctaButton={t("ctaButton")}
          ctaSecondary={t("ctaSecondary")}
          locale={locale}
        />
      </section>

      {/* Why this matters */}
      <section className="nd-section alt" aria-labelledby="why-matters-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label nd-label-block">
              {t("whyLabel")}
            </span>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h2 id="why-matters-heading" className="nd-h2 nd-h2-mb6">
              {t("whyHeadline")}
            </h2>
            <p className="nd-p">{t("whyBody")}</p>
          </FadeUp>
        </div>
      </section>

      {/* Why NoDrftSystems — Strengths */}
      <section className="nd-section nd-grid-bg" aria-labelledby="strengths-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label nd-label-block-lg">
              {t("strengthsLabel")}
            </span>
          </FadeUp>
          <div className="nd-grid-why">
            {STRENGTHS.map((s, i) => (
              <FadeUp key={i} delay={i * 0.06}>
                <div className={`nd-card nd-card--h-full${i === 0 || i === 4 ? " nd-card--copper" : ""}`}>
                  <span className="nd-card__corner" aria-hidden="true" />
                  <h3 className="nd-h3 nd-h3-mb3">{s.title}</h3>
                  <p className="nd-p-sm">{s.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* What it quietly costs */}
      <section className="nd-section alt" aria-labelledby="costs-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label nd-label-block">
              {t("costsLabel")}
            </span>
            <h2 id="costs-heading" className="nd-h2 nd-h2-mb8">
              {t("costsHeadline")}
            </h2>
          </FadeUp>
          <div>
            {COSTS.map((c, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <div className="nd-cost-item">
                  <strong className="nd-cost-label">{c.title}</strong>
                  <p className="nd-p-sm">{c.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Entry packages preview */}
      <section className="nd-section nd-grid-bg" aria-labelledby="packages-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label nd-label-block">
              {loc === "en" ? "Entry packages" : "Paquetes de entrada"}
            </span>
            <h2 id="packages-heading" className="nd-h2 nd-h2-mb4">
              {loc === "en" ? "Start with the right scope." : "Comience con el alcance correcto."}
            </h2>
            <p className="nd-p nd-mb8">
              {loc === "en"
                ? "Most projects fit a defined package. If scope is unclear, start with a Discovery Sprint so the build is defined before you commit to building it."
                : "La mayoría de los proyectos encaja en un paquete definido. Si el alcance no está claro, comience con un Discovery Sprint."}
            </p>
          </FadeUp>
          <div className="nd-grid-auto nd-pkg-grid">
            {entryPkgs.map((pkg, i) => (
              <FadeUp key={i} delay={i * 0.06}>
                <div className="nd-card nd-pkg-card">
                  <span className="nd-card__corner" aria-hidden="true" />
                  <div>
                    <h3 className="nd-h3 nd-h3-mb2">{pkg.name}</h3>
                    <a href={`/${locale}/start`} className="nd-price">
                      {loc === "en" ? "Get pricing →" : "Consultar precio →"}
                    </a>
                    <p className="nd-p-sm nd-mb2">{pkg.body}</p>
                    <p className="nd-p-xs nd-pkg-subtext">{pkg.sub}</p>
                  </div>
                  <span className="nd-timeline">
                    {pkg.timeline}
                  </span>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.2}>
            <div className="nd-fit-note">
              <p className="nd-p-sm">
                {loc === "en"
                  ? "Complex needs or unclear scope? Start with a "
                  : "¿Necesidades complejas o alcance poco claro? Comience con un "}
                <a href={`/${locale}/start`}>{loc === "en" ? "Discovery Sprint" : "Discovery Sprint"}</a>
                {loc === "en"
                  ? " or visit the "
                  : " o visite la página de "}
                <a href={`/${locale}/capabilities`}>{loc === "en" ? "Website Packages" : "Paquetes Web"}</a>
                {loc === "en" ? " page for the full decision framework." : " para el marco de decisión completo."}
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Work on record */}
      <section className="nd-section alt" aria-labelledby="work-record-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label nd-label-d-block">{workRecord.label}</span>
            <hr className="nd-rule-accent" />
          </FadeUp>
          {workRecord.items.map((item, i) => (
            <FadeUp key={i} delay={i * 0.07}>
              <div className="nd-proof-item">
                <p className="nd-p">{item}</p>
              </div>
            </FadeUp>
          ))}
          <FadeUp delay={0.15}>
            <p className="nd-p-xs nd-p-italic nd-mt4">
              {workRecord.disclaimer}
            </p>
            <p className="nd-p-xs nd-mt3">
              <a href={`/${locale}/engagements`}>{workRecord.link}</a>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Common misconceptions */}
      <section className="nd-section nd-grid-bg" aria-labelledby="misconceptions-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label nd-label-block">
              {loc === "en" ? "Common misconceptions" : "Conceptos erróneos comunes"}
            </span>
            <h2 id="misconceptions-heading" className="nd-h2 nd-h2-mb8">
              {loc === "en"
                ? "What delays the decision—and why it’s worth reconsidering."
                : "Lo que retrasa la decisión y por qué vale la pena reconsiderarlo."}
            </h2>
          </FadeUp>
          <div className="nd-grid-2 nd-grid-2--gap5">
            {misconceptions.map((m, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <div className="nd-card">
                  <span className="nd-card__corner" aria-hidden="true" />
                  <p className="nd-misconception-q">{m.q}</p>
                  <p className="nd-p-sm">{m.a}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Who we serve best */}
      <section className="nd-section alt" aria-labelledby="fit-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label nd-label-d-block">{fit.label}</span>
            <hr className="nd-rule-accent" />
          </FadeUp>
          <ul className="nd-fit-list nd-mb6" aria-labelledby="fit-heading">
            {fit.items.map((item, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <li className="nd-proof-item nd-p">{item}</li>
              </FadeUp>
            ))}
          </ul>
          <FadeUp delay={0.2}>
            <div className="nd-fit-note">
              <p className="nd-p">{fit.note}</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* How it works */}
      <section className="nd-section nd-grid-bg" aria-labelledby="process-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label nd-label-block">
              {loc === "en" ? "How it works" : "Cómo funciona"}
            </span>
            <h2 id="process-heading" className="nd-h2 nd-h2-mb8">
              {loc === "en"
                ? "What to expect from first contact to handoff."
                : "Qué esperar desde el primer contacto hasta el traspaso."}
            </h2>
          </FadeUp>
          <div className="nd-grid-3">
            {process.map((step, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <div className="nd-process-step">
                  <div className="nd-process-num" aria-hidden="true">{step.num}</div>
                  <div className="nd-step-title">{step.title}</div>
                  <div className="nd-step-body">{step.body}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="nd-section alt" aria-labelledby="cta-heading">
        <div className="nd-wrap">
          <FadeUp>
            <div className="nd-section-cta">
              <span className="nd-label nd-label-block">
                {t("ctaLabel")}
              </span>
              <h2 id="cta-heading" className="nd-h2 nd-h2-mb4">
                {t("ctaHeadline")}
              </h2>
              <p className="nd-p nd-section-cta__body">{t("ctaBody")}</p>
              <div className="nd-cta-row nd-cta-row--center">
                <a href={`/${locale}/start`} className="btn btn--lg">
                  {t("ctaButton")}
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
