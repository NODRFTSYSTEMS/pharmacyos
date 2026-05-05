import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { Locale } from "@/content/types";
import { CareersForm } from "@/components/forms/CareersForm";
import { FadeUp } from "@/components/motion/FadeUp";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.careers" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://nodrftsystems.com/${locale}/careers`,
      languages: {
        en: "https://nodrftsystems.com/en/careers",
        es: "https://nodrftsystems.com/es/careers",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `https://nodrftsystems.com/${locale}/careers`,
      images: [`/api/og?title=${encodeURIComponent(t("title"))}&locale=${locale}`],
    },
  };
}

const COPY = {
  en: {
    label: "Specialists",
    heading: "The roster is small on purpose.",
    lead: "NoDrftSystems is a lean, delivery-focused studio. When a project requires a specific skill, we bring in a specialist who meets the quality and governance standard — not a generalist who approximates it.",
    whatLabel: "What we look for",
    what: [
      {
        heading: "Execution precision",
        body: "The work ships correct. Not approximately correct. Scope boundaries are respected. Handoff is clean. If something goes wrong, you diagnose and resolve — you don't manage around it.",
      },
      {
        heading: "Domain depth",
        body: "You have a specific area where you're genuinely strong. We're not looking for full-stack generalists or designers who also do SEO who also do copy. Specialists who know what they are.",
      },
      {
        heading: "Quality standard alignment",
        body: "NoDrftSystems operates under multi-pass QA review, structured scope control, and explicit handoff. If that's friction to how you normally work — this isn't the right fit.",
      },
    ],
    disciplinesLabel: "Disciplines we engage",
    disciplines: [
      "Frontend development (Next.js, React, TypeScript)",
      "Backend / API development (Node.js, Supabase, PostgreSQL)",
      "UX and interaction design",
      "Visual and brand design",
      "Technical SEO",
      "Content strategy and copywriting (EN or ES)",
      "Quality assurance and testing",
      "Accessibility review (WCAG 2.1 AA)",
    ],
    notLabel: "Not a fit if",
    notFit: [
      "You need ongoing predictable hours — we engage per-project, not on retainer by default.",
      "You prefer loose briefs and open-ended scope — every engagement here is structured.",
      "Generic is acceptable — it isn't here.",
    ],
    formLabel: "Submit an application",
    formNote: "We review every application. We reach out when there's a fit with an active project need. Response time is not guaranteed — this is not a job board.",
  },
  es: {
    label: "Especialistas",
    heading: "Trabajamos con especialistas, no generalistas.",
    lead: "NoDrftSystems es un estudio compacto y orientado a la entrega. Cuando un proyecto requiere una habilidad específica, incorporamos a un especialista que cumple el estándar de calidad y gobernanza — no a un generalista que lo aproxima.",
    whatLabel: "Qué buscamos",
    what: [
      {
        heading: "Precisión de ejecución",
        body: "El trabajo se entrega correcto. No aproximadamente correcto. Se respetan los límites de alcance. La entrega final es limpia. Si algo sale mal, se diagnostica y se resuelve — no se gestiona alrededor del problema.",
      },
      {
        heading: "Profundidad en el dominio",
        body: "Tiene un área específica en la que es genuinamente sólido. No buscamos generalistas full-stack o diseñadores que también hacen SEO que también hacen copy. Especialistas que saben lo que son.",
      },
      {
        heading: "Alineación con el estándar de calidad",
        body: "NoDrftSystems opera bajo revisión QA multi-paso, control estructurado de alcance y traspaso explícito. Si eso genera fricción con su forma habitual de trabajar — este no es el ajuste correcto.",
      },
    ],
    disciplinesLabel: "Disciplinas que incorporamos",
    disciplines: [
      "Desarrollo frontend (Next.js, React, TypeScript)",
      "Desarrollo backend / API (Node.js, Supabase, PostgreSQL)",
      "Diseño UX e interacción",
      "Diseño visual y de marca",
      "SEO técnico",
      "Estrategia de contenido y redacción (EN o ES)",
      "Aseguramiento de calidad y pruebas",
      "Revisión de accesibilidad (WCAG 2.1 AA)",
    ],
    notLabel: "No es un ajuste si",
    notFit: [
      "Necesita horas predecibles continuas — trabajamos por proyecto, no en retainer por defecto.",
      "Prefiere briefs abiertos y alcance sin definir — cada proyecto aquí está estructurado.",
      "Lo genérico es aceptable — aquí no lo es.",
    ],
    formLabel: "Enviar una aplicación",
    formNote: "Revisamos cada aplicación. Nos comunicamos cuando hay un ajuste con una necesidad activa. El tiempo de respuesta no está garantizado — esto no es un tablero de empleos.",
  },
};

export default async function CareersPage({ params }: Props) {
  const { locale } = await params;
  const loc = locale as Locale;
  const copy = COPY[loc];

  return (
    <>
      <section className="nd-section nd-geo-bg" aria-labelledby="careers-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label" style={{ display: "block", marginBottom: "var(--space-4)" }}>
              {copy.label}
            </span>
            <h1 id="careers-heading" className="nd-h1" style={{ marginBottom: "var(--space-6)" }}>
              {copy.heading}
            </h1>
            <p className="nd-lead">{copy.lead}</p>
          </FadeUp>
        </div>
      </section>

      <section className="nd-section alt" aria-labelledby="what-heading">
        <div className="nd-wrap">
          <FadeUp>
            <span className="nd-label" style={{ display: "block", marginBottom: "var(--space-6)" }}>
              {copy.whatLabel}
            </span>
          </FadeUp>
          <div className="nd-grid-why">
            {copy.what.map((item, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div className="nd-card" style={{ position: "relative" }}>
                  <span className="nd-card__corner" aria-hidden="true" />
                  <h2 className="nd-h3" style={{ marginBottom: "var(--space-3)" }}>{item.heading}</h2>
                  <p className="nd-p-sm">{item.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="nd-section" aria-labelledby="disciplines-heading">
        <div className="nd-wrap">
          <div className="nd-grid-2">
            <FadeUp>
              <span className="nd-label" style={{ display: "block", marginBottom: "var(--space-4)" }}>
                {copy.disciplinesLabel}
              </span>
              <ul className="nd-discipline-list">
                {copy.disciplines.map((d, i) => (
                  <li key={i} className="nd-p-sm nd-discipline-item">{d}</li>
                ))}
              </ul>
            </FadeUp>
            <FadeUp delay={0.07}>
              <span className="nd-label" style={{ display: "block", marginBottom: "var(--space-4)" }}>
                {copy.notLabel}
              </span>
              <ul className="nd-not-fit-list">
                {copy.notFit.map((item, i) => (
                  <li key={i} className="nd-p-sm nd-not-fit-item">{item}</li>
                ))}
              </ul>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="nd-section alt" aria-labelledby="careers-form-label">
        <div className="nd-wrap-narrow">
          <FadeUp>
            <span id="careers-form-label" className="nd-label" style={{ display: "block", marginBottom: "var(--space-3)" }}>
              {copy.formLabel}
            </span>
            <p className="nd-p-xs nd-pkg-subtext" style={{ marginBottom: "var(--space-6)" }}>
              {copy.formNote}
            </p>
            <CareersForm locale={loc} />
          </FadeUp>
        </div>
      </section>
    </>
  );
}
