"use client";

import { useState, useEffect, useRef } from "react";

type Status = "idle" | "submitting" | "success" | "error";
type DecisionMaker = "yes" | "no" | "";

const INDUSTRY_OPTIONS = {
  en: [
    { value: "", label: "Select your industry (optional)" },
    { value: "healthcare-pharmacy", label: "Healthcare / Pharmacy" },
    { value: "automotive", label: "Automotive (dealership, car wash, services)" },
    { value: "food-beverage", label: "Food & Beverage (restaurant, café, catering)" },
    { value: "construction-trades", label: "Construction / Trades" },
    { value: "retail", label: "Retail" },
    { value: "publishing-media", label: "Publishing / Media" },
    { value: "content-creation", label: "Content Creation" },
    { value: "professional-services", label: "Professional Services (legal, financial, consulting)" },
    { value: "real-estate", label: "Real Estate" },
    { value: "technology", label: "Technology / Software" },
    { value: "other", label: "Other — I'll describe it below" },
  ],
  es: [
    { value: "", label: "Seleccione su industria (opcional)" },
    { value: "healthcare-pharmacy", label: "Salud / Farmacia" },
    { value: "automotive", label: "Automotriz (concesionario, lavado, servicios)" },
    { value: "food-beverage", label: "Alimentos y Bebidas (restaurante, café, catering)" },
    { value: "construction-trades", label: "Construcción / Oficios" },
    { value: "retail", label: "Comercio Minorista" },
    { value: "publishing-media", label: "Editorial / Medios" },
    { value: "content-creation", label: "Creación de Contenido" },
    { value: "professional-services", label: "Servicios Profesionales (legal, financiero, consultoría)" },
    { value: "real-estate", label: "Bienes Raíces" },
    { value: "technology", label: "Tecnología / Software" },
    { value: "other", label: "Otro — lo describo a continuación" },
  ],
};

const SCOPE_OPTIONS = {
  en: [
    { value: "", label: "Select a scope class" },
    { value: "website-audit", label: "Website Audit — find out what's working and what isn't" },
    { value: "discovery-sprint", label: "Discovery Sprint — I'm not sure what I need yet" },
    { value: "landing-page-sprint", label: "Single Page — one focused page with a clear call to action" },
    { value: "static-business-site", label: "Simple Business Site — pages and contact form, no CMS" },
    { value: "business-launch-site", label: "Full Business Site — I'll need to update content myself" },
    { value: "authority-website", label: "Authority Website — blog, forms, analytics, complete build" },
    { value: "platform-starter", label: "Web App / Platform — needs login, database, or integrations" },
    { value: "ecosystem-build", label: "Ecosystem Build — multiple systems, large scope" },
    { value: "not-sure", label: "Not sure yet — I need guidance" },
  ],
  es: [
    { value: "", label: "Seleccione una clase de alcance" },
    { value: "website-audit", label: "Auditoría Web — identificar qué funciona y qué no" },
    { value: "discovery-sprint", label: "Discovery Sprint — aún no sé qué necesito" },
    { value: "landing-page-sprint", label: "Página Única — una página enfocada con llamada a la acción" },
    { value: "static-business-site", label: "Sitio Simple — páginas y contacto, sin sistema de contenido" },
    { value: "business-launch-site", label: "Sitio Completo — necesitaré actualizar el contenido yo mismo" },
    { value: "authority-website", label: "Sitio de Autoridad — blog, formularios, analíticas, construcción completa" },
    { value: "platform-starter", label: "App Web / Plataforma — requiere acceso, base de datos o integraciones" },
    { value: "ecosystem-build", label: "Ecosistema Digital — múltiples sistemas, alcance amplio" },
    { value: "not-sure", label: "Aún no sé — necesito orientación" },
  ],
};

const DESCRIPTION_TEMPLATES: Record<string, { en: string; es: string }> = {
  "healthcare-pharmacy": {
    en: `We are a [pharmacy / clinic / medical practice] looking to [launch / refresh] our online presence.\n\nWe need: [online prescription refills / appointment scheduling / service and location info / patient resources]\n\nWe currently [have a site at ___ / do not have a website].\n\nPriority: [make it easy for patients to find and contact us / enable online appointment requests / display our services clearly]`,
    es: `Somos una [farmacia / clínica / práctica médica] que busca [lanzar / actualizar] nuestra presencia en línea.\n\nNecesitamos: [solicitudes de recetas en línea / programación de citas / información de servicios y ubicación / recursos para pacientes]\n\nActualmente [tenemos un sitio en ___ / no tenemos sitio web].\n\nPrioridad: [facilitar que los pacientes nos encuentren y contacten / habilitar citas en línea / mostrar nuestros servicios claramente]`,
  },
  "automotive": {
    en: `We are an [auto dealership / car wash / auto service shop] looking to [launch / refresh] our online presence.\n\nWe need: [vehicle inventory display / online service booking / promotions page / pricing / contact and location info]\n\nWe currently [have a site at ___ / do not have a website].\n\nPriority: [drive more walk-ins or bookings / display our inventory / showcase our services and pricing]`,
    es: `Somos un [concesionario / lavado de autos / taller de servicio automotriz] que busca [lanzar / actualizar] nuestra presencia en línea.\n\nNecesitamos: [exhibición de inventario / reservas de servicio en línea / página de promociones / precios / contacto y ubicación]\n\nActualmente [tenemos un sitio en ___ / no tenemos sitio web].\n\nPrioridad: [atraer más visitas o reservas / mostrar nuestro inventario / exhibir servicios y precios]`,
  },
  "food-beverage": {
    en: `We are a [restaurant / café / catering company] looking to [launch / refresh] our online presence.\n\nWe need: [online menu / reservation system / catering inquiry form / event booking / online ordering]\n\nWe currently [have a site at ___ / do not have a website].\n\nPriority: [increase reservations / showcase our menu / attract catering clients / make it easy for people to find us]`,
    es: `Somos un [restaurante / café / empresa de catering] que busca [lanzar / actualizar] nuestra presencia en línea.\n\nNecesitamos: [menú en línea / sistema de reservaciones / formulario de catering / reserva de eventos / pedidos en línea]\n\nActualmente [tenemos un sitio en ___ / no tenemos sitio web].\n\nPrioridad: [aumentar reservaciones / mostrar nuestro menú / atraer clientes de catering / facilitar que nos encuentren]`,
  },
  "construction-trades": {
    en: `We are a [general contractor / construction company / trade business] looking to [launch / refresh] our online presence.\n\nWe need: [project portfolio / quote request form / services and service area info / licensing and credentials display]\n\nWe currently [have a site at ___ / do not have a website].\n\nPriority: [generate more quote requests / showcase completed projects / build credibility and trust online]`,
    es: `Somos una [empresa constructora / contratista general / negocio de oficios] que busca [lanzar / actualizar] nuestra presencia en línea.\n\nNecesitamos: [portafolio de proyectos / formulario de cotización / área de servicio y licencias / credenciales]\n\nActualmente [tenemos un sitio en ___ / no tenemos sitio web].\n\nPrioridad: [generar más solicitudes de cotización / mostrar proyectos completados / establecer credibilidad en línea]`,
  },
  "retail": {
    en: `We are a [retail store / boutique / specialty shop] looking to [launch / refresh] our online presence.\n\nWe need: [product catalog / online store / store locator / promotions page / contact info]\n\nWe currently [have a site at ___ / do not have a website].\n\nPriority: [sell products online / drive foot traffic / build brand presence / showcase our inventory]`,
    es: `Somos una [tienda minorista / boutique / tienda especializada] que busca [lanzar / actualizar] nuestra presencia en línea.\n\nNecesitamos: [catálogo de productos / tienda en línea / localizador de tienda / promociones / información de contacto]\n\nActualmente [tenemos un sitio en ___ / no tenemos sitio web].\n\nPrioridad: [vender productos en línea / atraer tráfico a la tienda / construir presencia de marca / mostrar inventario]`,
  },
  "publishing-media": {
    en: `We are a [publisher / media outlet / news organization] looking to [launch / refresh] our online presence.\n\nWe need: [content publishing system / article categories / author profiles / subscription or newsletter / search]\n\nWe currently [have a site at ___ / do not have a website].\n\nPriority: [publish and organize content regularly / build a readership / establish editorial authority]`,
    es: `Somos una [editorial / medio de comunicación / organización de noticias] que busca [lanzar / actualizar] nuestra presencia en línea.\n\nNecesitamos: [sistema de publicación de contenido / categorías / perfiles de autores / suscripción o boletín / búsqueda]\n\nActualmente [tenemos un sitio en ___ / no tenemos sitio web].\n\nPrioridad: [publicar y organizar contenido / construir audiencia / establecer autoridad editorial]`,
  },
  "content-creation": {
    en: `We are a [content creator / production company / creative studio] looking to [launch / refresh] our online presence.\n\nWe need: [portfolio / media kit / booking or inquiry form / social media integration / content showcase]\n\nWe currently [have a site at ___ / do not have a website].\n\nPriority: [attract brand partnerships / showcase our work / make it easy for clients to hire us]`,
    es: `Somos [creadores de contenido / empresa de producción / estudio creativo] que busca [lanzar / actualizar] nuestra presencia en línea.\n\nNecesitamos: [portafolio / media kit / formulario de reserva o consulta / integración social / vitrina de contenido]\n\nActualmente [tenemos un sitio en ___ / no tenemos sitio web].\n\nPrioridad: [atraer alianzas de marca / mostrar nuestro trabajo / facilitar que los clientes nos contraten]`,
  },
  "professional-services": {
    en: `We are a [law firm / financial advisory / consulting practice] looking to [launch / refresh] our online presence.\n\nWe need: [services overview / team profiles / client inquiry form / case studies or results / location and contact info]\n\nWe currently [have a site at ___ / do not have a website].\n\nPriority: [generate qualified inquiries / establish authority in our field / convert visitors into consultations]`,
    es: `Somos un [bufete de abogados / asesoría financiera / firma consultora] que busca [lanzar / actualizar] nuestra presencia en línea.\n\nNecesitamos: [descripción de servicios / perfiles del equipo / formulario de consulta / casos de éxito / contacto y ubicación]\n\nActualmente [tenemos un sitio en ___ / no tenemos sitio web].\n\nPrioridad: [generar consultas calificadas / establecer autoridad en nuestro campo / convertir visitantes en consultas]`,
  },
  "real-estate": {
    en: `We are a [real estate agency / brokerage / property developer] looking to [launch / refresh] our online presence.\n\nWe need: [property listings / agent profiles / search or filter functionality / buyer and seller inquiry forms / market area info]\n\nWe currently [have a site at ___ / do not have a website].\n\nPriority: [display active listings / generate buyer or seller leads / establish our market presence]`,
    es: `Somos una [agencia inmobiliaria / corredora / desarrolladora] que busca [lanzar / actualizar] nuestra presencia en línea.\n\nNecesitamos: [listados de propiedades / perfiles de agentes / búsqueda y filtros / formularios para compradores y vendedores / información del mercado]\n\nActualmente [tenemos un sitio en ___ / no tenemos sitio web].\n\nPrioridad: [mostrar listados activos / generar prospectos / establecer presencia en el mercado]`,
  },
  "technology": {
    en: `We are a [tech company / software product / SaaS business] looking to [launch / refresh] our online presence.\n\nWe need: [product overview / feature highlights / pricing page / demo or trial request / user login or portal]\n\nWe currently [have a site at ___ / do not have a website].\n\nPriority: [drive product signups / explain our technology clearly / convert visitors to demos or trials]`,
    es: `Somos una [empresa tecnológica / producto de software / negocio SaaS] que busca [lanzar / actualizar] nuestra presencia en línea.\n\nNecesitamos: [descripción del producto / características destacadas / precios / solicitud de demo / acceso de usuarios]\n\nActualmente [tenemos un sitio en ___ / no tenemos sitio web].\n\nPrioridad: [impulsar registros / explicar nuestra tecnología claramente / convertir visitantes en demos o pruebas]`,
  },
  "other": {
    en: `We are a [describe your business type] looking to [launch / refresh] our online presence.\n\nWe need: [describe what you need — pages, features, functionality]\n\nWe currently [have a site at ___ / do not have a website].\n\nPriority: [describe your main goal — what success looks like for this project]`,
    es: `Somos [describa su tipo de negocio] que busca [lanzar / actualizar] nuestra presencia en línea.\n\nNecesitamos: [describa qué necesita — páginas, funciones, características]\n\nActualmente [tenemos un sitio en ___ / no tenemos sitio web].\n\nPrioridad: [describa su objetivo principal — cómo se ve el éxito para este proyecto]`,
  },
};

const TIMELINE_OPTIONS = {
  en: [
    { value: "", label: "Select a timeline" },
    { value: "asap", label: "As soon as possible" },
    { value: "1-3mo", label: "Within 1–3 months" },
    { value: "3-6mo", label: "Within 3–6 months" },
    { value: "6mo+", label: "6+ months out" },
    { value: "flexible", label: "Timeline is flexible" },
  ],
  es: [
    { value: "", label: "Seleccione un cronograma" },
    { value: "asap", label: "Lo antes posible" },
    { value: "1-3mo", label: "En 1–3 meses" },
    { value: "3-6mo", label: "En 3–6 meses" },
    { value: "6mo+", label: "Más de 6 meses" },
    { value: "flexible", label: "El cronograma es flexible" },
  ],
};

const BUDGET_OPTIONS = {
  en: [
    { value: "", label: "Select a range (optional)" },
    { value: "under-2k", label: "Under $2,000" },
    { value: "2k-5k", label: "$2,000 – $5,000" },
    { value: "5k-15k", label: "$5,000 – $15,000" },
    { value: "15k-plus", label: "$15,000+" },
    { value: "not-sure", label: "Not sure yet" },
  ],
  es: [
    { value: "", label: "Seleccione un rango (opcional)" },
    { value: "under-2k", label: "Menos de $2,000" },
    { value: "2k-5k", label: "$2,000 – $5,000" },
    { value: "5k-15k", label: "$5,000 – $15,000" },
    { value: "15k-plus", label: "$15,000+" },
    { value: "not-sure", label: "Aún no sé" },
  ],
};

const REFERRAL_OPTIONS = {
  en: [
    { value: "", label: "Select one (optional)" },
    { value: "referral", label: "Client or colleague referral" },
    { value: "search", label: "Online search" },
    { value: "social", label: "Social media" },
    { value: "returning", label: "Returning client" },
    { value: "other", label: "Other" },
  ],
  es: [
    { value: "", label: "Seleccione una opción (opcional)" },
    { value: "referral", label: "Referido de cliente o colega" },
    { value: "search", label: "Búsqueda en línea" },
    { value: "social", label: "Redes sociales" },
    { value: "returning", label: "Cliente recurrente" },
    { value: "other", label: "Otro" },
  ],
};

const COPY = {
  en: {
    org: "Organization",
    orgPh: "Company or project name",
    name: "Your name",
    namePh: "First and last name",
    email: "Email",
    emailPh: "your@email.com",
    role: "Your role / title (optional)",
    rolePh: "e.g. Founder, CTO, Director of Marketing",
    industry: "Industry (optional)",
    scope: "Scope class",
    description: "Project description",
    descriptionPh: "Describe the business problem, what you need built, and any known constraints. More context produces a better evaluation.",
    decisionMaker: "Are you the decision maker for this engagement?",
    decisionYes: "Yes, I make the final call",
    decisionNo: "No, others are involved",
    decisionOther: "Who else is involved in this decision? (optional)",
    decisionOtherPh: "e.g. Partner, board, department head",
    timeline: "Approximate timeline",
    budget: "Expected investment range (optional)",
    budgetHint: "This helps us recommend the right scope — not a commitment.",
    referral: "How did you find us? (optional)",
    referralOtherPh: "Tell us more (optional)",
    submit: "Submit brief",
    submitting: "Submitting…",
    success: "Your brief has been received. We review every submission and will be in touch within 2 business days to assess fit.",
    error: "Submission failed. Please try again or email us directly at sales@nodrftsystems.com",
    required: "Required field",
    emailInvalid: "Enter a valid email address",
    errorSummary: "Please correct the errors marked below.",
    sections: {
      org: "Your Organization",
      industry: "Your Industry",
      scope: "Project Scope",
      description: "Project Description",
      decision: "Decision Authority",
      timeline: "Timeline & Investment Signal",
      referral: "How You Found Us",
    },
  },
  es: {
    org: "Organización",
    orgPh: "Nombre de la empresa o proyecto",
    name: "Su nombre",
    namePh: "Nombre y apellido",
    email: "Correo electrónico",
    emailPh: "su@correo.com",
    role: "Su cargo / título (opcional)",
    rolePh: "p. ej. Fundador, CTO, Director de Marketing",
    industry: "Industria (opcional)",
    scope: "Clase de alcance",
    description: "Descripción del proyecto",
    descriptionPh: "Describa el problema de negocio, qué necesita construir y cualquier restricción conocida. Más contexto produce una evaluación más precisa.",
    decisionMaker: "¿Es usted el tomador de decisiones para este proyecto?",
    decisionYes: "Sí, yo tomo la decisión final",
    decisionNo: "No, hay otras personas involucradas",
    decisionOther: "¿Quién más participa en esta decisión? (opcional)",
    decisionOtherPh: "p. ej. Socio, junta directiva, jefe de departamento",
    timeline: "Cronograma aproximado",
    budget: "Rango de inversión esperado (opcional)",
    budgetHint: "Esto nos ayuda a recomendar el alcance adecuado — no es un compromiso.",
    referral: "¿Cómo nos encontró? (opcional)",
    referralOtherPh: "Cuéntenos más (opcional)",
    submit: "Enviar brief",
    submitting: "Enviando…",
    success: "Su brief ha sido recibido. Revisamos cada envío y nos pondremos en contacto en 2 días hábiles para evaluar el ajuste.",
    error: "Error al enviar. Por favor intente nuevamente o escríbanos a sales@nodrftsystems.com",
    required: "Campo requerido",
    emailInvalid: "Ingrese una dirección de correo válida",
    errorSummary: "Por favor corrija los errores marcados a continuación.",
    sections: {
      org: "Su Organización",
      industry: "Su Industria",
      scope: "Alcance del Proyecto",
      description: "Descripción del Proyecto",
      decision: "Autoridad de Decisión",
      timeline: "Cronograma e Inversión",
      referral: "Cómo Nos Encontró",
    },
  },
};

const SECTION_STYLE: React.CSSProperties = {
  marginBottom: "40px",
};

const SECTION_LABEL_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--accent)",
  borderLeft: "2px solid var(--accent)",
  paddingLeft: "10px",
  marginBottom: "20px",
};

const HINT_STYLE: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  color: "var(--muted)",
  marginTop: "6px",
};

interface Fields {
  org: string;
  name: string;
  role: string;
  email: string;
  industry: string;
  scope: string;
  description: string;
  decisionMaker: DecisionMaker;
  decisionOtherNote: string;
  timeline: string;
  budget: string;
  referral: string;
  referralOther: string;
}

interface Props {
  locale: "en" | "es";
}

export function EngagementForm({ locale }: Props) {
  const c = COPY[locale];
  const industries = INDUSTRY_OPTIONS[locale];
  const scopes = SCOPE_OPTIONS[locale];
  const timelines = TIMELINE_OPTIONS[locale];
  const budgets = BUDGET_OPTIONS[locale];
  const referrals = REFERRAL_OPTIONS[locale];

  const [status, setStatus] = useState<Status>("idle");
  const [fields, setFields] = useState<Fields>({
    org: "",
    name: "",
    role: "",
    email: "",
    industry: "",
    scope: "",
    description: "",
    decisionMaker: "",
    decisionOtherNote: "",
    timeline: "",
    budget: "",
    referral: "",
    referralOther: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const successRef = useRef<HTMLDivElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const shouldFocusSummary = useRef(false);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  useEffect(() => {
    if (!fields.industry) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFields(prev => { // derived: populate description template when industry changes and field is empty
      if (prev.description.trim()) return prev;
      const tpl = DESCRIPTION_TEMPLATES[prev.industry];
      return tpl ? { ...prev, description: tpl[locale] } : prev;
    });
  }, [fields.industry, locale]);

  useEffect(() => {
    if (shouldFocusSummary.current && Object.keys(fieldErrors).length > 0) {
      errorSummaryRef.current?.focus();
      shouldFocusSummary.current = false;
    }
  }, [fieldErrors]);

  function update<K extends keyof Fields>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      if (fieldErrors[key]) setFieldErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
    };
  }

  function updateDecisionMaker(value: DecisionMaker) {
    setFields((prev) => ({
      ...prev,
      decisionMaker: value,
      decisionOtherNote: value === "yes" ? "" : prev.decisionOtherNote,
    }));
    if (fieldErrors.decisionMaker) {
      setFieldErrors((prev) => { const n = { ...prev }; delete n.decisionMaker; return n; });
    }
  }

  function validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!fields.org.trim()) errors.org = c.required;
    if (!fields.name.trim()) errors.name = c.required;
    if (!fields.email.trim()) errors.email = c.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = c.emailInvalid;
    if (!fields.scope) errors.scope = c.required;
    if (!fields.description.trim()) errors.description = c.required;
    if (!fields.decisionMaker) errors.decisionMaker = c.required;
    if (!fields.timeline) errors.timeline = c.required;
    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      shouldFocusSummary.current = true;
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/submit/engagement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org: fields.org,
          name: fields.name,
          role: fields.role,
          email: fields.email,
          industry: fields.industry,
          scope: fields.scope,
          description: fields.description,
          decisionMaker: fields.decisionMaker,
          decisionOtherNote: fields.decisionOtherNote,
          timeline: fields.timeline,
          budget: fields.budget,
          referral: fields.referral,
          referralOther: fields.referralOther,
          locale,
        }),
      });
      const data = await res.json() as { ok?: boolean };
      if (res.ok && data.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        className="nd-form-status nd-form-status--success"
        role="status"
        tabIndex={-1}
      >
        <p className="nd-p">{c.success}</p>
      </div>
    );
  }

  return (
    <form className="nd-form" onSubmit={handleSubmit} noValidate>
      {Object.keys(fieldErrors).length > 0 && (
        <div
          ref={errorSummaryRef}
          className="nd-form-status nd-form-status--error nd-form-error-summary"
          role="alert"
          tabIndex={-1}
        >
          <p className="nd-p-sm">{c.errorSummary}</p>
        </div>
      )}

      {/* Section 1 — Your Organization */}
      <div style={SECTION_STYLE}>
        <p style={SECTION_LABEL_STYLE}>{c.sections.org}</p>

        <div className="nd-field">
          <label className="nd-field-label" htmlFor="eng-org">
            {c.org} <span className="nd-field-req" aria-label={c.required}>*</span>
          </label>
          <input
            id="eng-org"
            className="nd-input"
            type="text"
            placeholder={c.orgPh}
            value={fields.org}
            onChange={update("org")}
            autoComplete="organization"
            aria-required="true"
            aria-invalid={!!fieldErrors.org}
            aria-describedby={fieldErrors.org ? "eng-org-err" : undefined}
          />
          {fieldErrors.org && <span id="eng-org-err" className="nd-field-error" role="alert">{fieldErrors.org}</span>}
        </div>

        <div className="nd-field">
          <label className="nd-field-label" htmlFor="eng-name">
            {c.name} <span className="nd-field-req" aria-label={c.required}>*</span>
          </label>
          <input
            id="eng-name"
            className="nd-input"
            type="text"
            placeholder={c.namePh}
            value={fields.name}
            onChange={update("name")}
            autoComplete="name"
            aria-required="true"
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? "eng-name-err" : undefined}
          />
          {fieldErrors.name && <span id="eng-name-err" className="nd-field-error" role="alert">{fieldErrors.name}</span>}
        </div>

        <div className="nd-field">
          <label className="nd-field-label" htmlFor="eng-role">{c.role}</label>
          <input
            id="eng-role"
            className="nd-input"
            type="text"
            placeholder={c.rolePh}
            value={fields.role}
            onChange={update("role")}
            autoComplete="organization-title"
          />
        </div>

        <div className="nd-field">
          <label className="nd-field-label" htmlFor="eng-email">
            {c.email} <span className="nd-field-req" aria-label={c.required}>*</span>
          </label>
          <input
            id="eng-email"
            className="nd-input"
            type="email"
            placeholder={c.emailPh}
            value={fields.email}
            onChange={update("email")}
            autoComplete="email"
            aria-required="true"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "eng-email-err" : undefined}
          />
          {fieldErrors.email && <span id="eng-email-err" className="nd-field-error" role="alert">{fieldErrors.email}</span>}
        </div>
      </div>

      {/* Section 2 — Your Industry */}
      <div style={SECTION_STYLE}>
        <p style={SECTION_LABEL_STYLE}>{c.sections.industry}</p>

        <div className="nd-field">
          <label className="nd-field-label" htmlFor="eng-industry">{c.industry}</label>
          <select
            id="eng-industry"
            className="nd-select"
            value={fields.industry}
            onChange={update("industry")}
          >
            {industries.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Section 3 — Project Scope */}
      <div style={SECTION_STYLE}>
        <p style={SECTION_LABEL_STYLE}>{c.sections.scope}</p>

        <div className="nd-field">
          <label className="nd-field-label" htmlFor="eng-scope">
            {c.scope} <span className="nd-field-req" aria-label={c.required}>*</span>
          </label>
          <select
            id="eng-scope"
            className="nd-select"
            value={fields.scope}
            onChange={update("scope")}
            aria-required="true"
            aria-invalid={!!fieldErrors.scope}
            aria-describedby={fieldErrors.scope ? "eng-scope-err" : undefined}
          >
            {scopes.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                {opt.label}
              </option>
            ))}
          </select>
          {fieldErrors.scope && <span id="eng-scope-err" className="nd-field-error" role="alert">{fieldErrors.scope}</span>}
        </div>
      </div>

      {/* Section 4 — Project Description */}
      <div style={SECTION_STYLE}>
        <p style={SECTION_LABEL_STYLE}>{c.sections.description}</p>

        <div className="nd-field">
          <label className="nd-field-label" htmlFor="eng-desc">
            {c.description} <span className="nd-field-req" aria-label={c.required}>*</span>
          </label>
          <textarea
            id="eng-desc"
            className="nd-textarea"
            placeholder={c.descriptionPh}
            value={fields.description}
            onChange={update("description")}
            rows={6}
            aria-required="true"
            aria-invalid={!!fieldErrors.description}
            aria-describedby={fieldErrors.description ? "eng-desc-err" : undefined}
          />
          {fieldErrors.description && <span id="eng-desc-err" className="nd-field-error" role="alert">{fieldErrors.description}</span>}
        </div>
      </div>

      {/* Section 5 — Decision Authority */}
      <div style={SECTION_STYLE}>
        <p style={SECTION_LABEL_STYLE}>{c.sections.decision}</p>

        <div className="nd-field">
          <fieldset
            style={{ border: "none", padding: 0, margin: 0 }}
            aria-describedby={fieldErrors.decisionMaker ? "eng-decision-err" : undefined}
          >
            <legend className="nd-field-label" style={{ marginBottom: "12px" }}>
              {c.decisionMaker} <span className="nd-field-req" aria-label={c.required}>*</span>
            </legend>

            <div className="nd-field" style={{ marginBottom: "8px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="decisionMaker"
                  value="yes"
                  checked={fields.decisionMaker === "yes"}
                  onChange={() => updateDecisionMaker("yes")}
                  aria-required="true"
                />
                {c.decisionYes}
              </label>
            </div>

            <div className="nd-field" style={{ marginBottom: "0" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="decisionMaker"
                  value="no"
                  checked={fields.decisionMaker === "no"}
                  onChange={() => updateDecisionMaker("no")}
                  aria-required="true"
                />
                {c.decisionNo}
              </label>
            </div>
          </fieldset>
          {fieldErrors.decisionMaker && (
            <span id="eng-decision-err" className="nd-field-error" role="alert">
              {fieldErrors.decisionMaker}
            </span>
          )}
        </div>

        {fields.decisionMaker === "no" && (
          <div className="nd-field">
            <label className="nd-field-label" htmlFor="eng-decision-other">{c.decisionOther}</label>
            <input
              id="eng-decision-other"
              className="nd-input"
              type="text"
              placeholder={c.decisionOtherPh}
              value={fields.decisionOtherNote}
              onChange={update("decisionOtherNote")}
              autoComplete="off"
            />
          </div>
        )}
      </div>

      {/* Section 6 — Timeline & Investment Signal */}
      <div style={SECTION_STYLE}>
        <p style={SECTION_LABEL_STYLE}>{c.sections.timeline}</p>

        <div className="nd-field">
          <label className="nd-field-label" htmlFor="eng-timeline">
            {c.timeline} <span className="nd-field-req" aria-label={c.required}>*</span>
          </label>
          <select
            id="eng-timeline"
            className="nd-select"
            value={fields.timeline}
            onChange={update("timeline")}
            aria-required="true"
            aria-invalid={!!fieldErrors.timeline}
            aria-describedby={fieldErrors.timeline ? "eng-timeline-err" : undefined}
          >
            {timelines.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                {opt.label}
              </option>
            ))}
          </select>
          {fieldErrors.timeline && <span id="eng-timeline-err" className="nd-field-error" role="alert">{fieldErrors.timeline}</span>}
        </div>

        <div className="nd-field">
          <label className="nd-field-label" htmlFor="eng-budget">{c.budget}</label>
          <select
            id="eng-budget"
            className="nd-select"
            value={fields.budget}
            onChange={update("budget")}
            aria-describedby="eng-budget-hint"
          >
            {budgets.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                {opt.label}
              </option>
            ))}
          </select>
          <span id="eng-budget-hint" style={HINT_STYLE}>{c.budgetHint}</span>
        </div>
      </div>

      {/* Section 7 — How You Found Us */}
      <div style={SECTION_STYLE}>
        <p style={SECTION_LABEL_STYLE}>{c.sections.referral}</p>

        <div className="nd-field">
          <label className="nd-field-label" htmlFor="eng-referral">{c.referral}</label>
          <select
            id="eng-referral"
            className="nd-select"
            value={fields.referral}
            onChange={update("referral")}
          >
            {referrals.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {fields.referral === "other" && (
          <div className="nd-field">
            <label className="nd-field-label" htmlFor="eng-referral-other">{c.referralOtherPh}</label>
            <input
              id="eng-referral-other"
              className="nd-input"
              type="text"
              placeholder={c.referralOtherPh}
              value={fields.referralOther}
              onChange={update("referralOther")}
              autoComplete="off"
            />
          </div>
        )}
      </div>

      {status === "error" && (
        <div className="nd-form-status nd-form-status--error" role="alert">
          <p className="nd-p-sm">{c.error}</p>
        </div>
      )}

      <button
        type="submit"
        className="btn nd-form-submit-btn"
        disabled={status === "submitting"}
        aria-busy={status === "submitting"}
      >
        {status === "submitting" ? c.submitting : c.submit}
      </button>
    </form>
  );
}
