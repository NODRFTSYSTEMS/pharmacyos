"use client";

import { useState, useEffect, useRef } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const SCOPE_OPTIONS = {
  en: [
    { value: "", label: "Select a scope class" },
    { value: "website-audit", label: "Website Audit" },
    { value: "discovery-sprint", label: "Discovery Sprint" },
    { value: "landing-page-sprint", label: "Conversion Landing Page Sprint" },
    { value: "static-business-site", label: "Static Business Site" },
    { value: "business-launch-site", label: "Business Launch Site" },
    { value: "authority-website", label: "Authority Website" },
    { value: "platform-starter", label: "Platform Starter" },
    { value: "ecosystem-build", label: "Ecosystem Build" },
    { value: "not-sure", label: "Not sure yet — I need guidance" },
  ],
  es: [
    { value: "", label: "Seleccione una clase de alcance" },
    { value: "website-audit", label: "Auditoría de Sitio Web" },
    { value: "discovery-sprint", label: "Discovery Sprint" },
    { value: "landing-page-sprint", label: "Sprint de Landing Page de Conversión" },
    { value: "static-business-site", label: "Sitio Empresarial Estático" },
    { value: "business-launch-site", label: "Sitio de Lanzamiento Empresarial" },
    { value: "authority-website", label: "Sitio de Autoridad" },
    { value: "platform-starter", label: "Plataforma Inicial" },
    { value: "ecosystem-build", label: "Construcción de Ecosistema" },
    { value: "not-sure", label: "No estoy seguro — necesito orientación" },
  ],
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

const COPY = {
  en: {
    org: "Organization",
    orgPh: "Company or project name",
    name: "Your name",
    namePh: "First and last name",
    email: "Email",
    emailPh: "your@email.com",
    scope: "Scope class",
    description: "Project description",
    descriptionPh: "Describe the business problem, what you need built, and any known constraints. More context produces a better evaluation.",
    timeline: "Approximate timeline",
    referral: "How did you hear about us? (optional)",
    referralPh: "Referral, search, LinkedIn, etc.",
    submit: "Submit brief",
    submitting: "Submitting…",
    success: "Your brief has been received. We review every submission and will be in touch within 2 business days to assess fit.",
    error: "Submission failed. Please try again or email us directly at sales@nodrftsystems.com",
    required: "Required field",
    emailInvalid: "Enter a valid email address",
  },
  es: {
    org: "Organización",
    orgPh: "Nombre de la empresa o proyecto",
    name: "Su nombre",
    namePh: "Nombre y apellido",
    email: "Correo electrónico",
    emailPh: "su@correo.com",
    scope: "Clase de alcance",
    description: "Descripción del proyecto",
    descriptionPh: "Describa el problema de negocio, qué necesita construir y cualquier restricción conocida. Más contexto produce una evaluación más precisa.",
    timeline: "Cronograma aproximado",
    referral: "¿Cómo nos encontró? (opcional)",
    referralPh: "Referido, búsqueda, LinkedIn, etc.",
    submit: "Enviar brief",
    submitting: "Enviando…",
    success: "Su brief ha sido recibido. Revisamos cada envío y nos pondremos en contacto en 2 días hábiles para evaluar el ajuste.",
    error: "Error al enviar. Por favor intente nuevamente o escríbanos a sales@nodrftsystems.com",
    required: "Campo requerido",
    emailInvalid: "Ingrese una dirección de correo válida",
  },
};

interface Props {
  locale: "en" | "es";
}

export function EngagementForm({ locale }: Props) {
  const c = COPY[locale];
  const scopes = SCOPE_OPTIONS[locale];
  const timelines = TIMELINE_OPTIONS[locale];

  const [status, setStatus] = useState<Status>("idle");
  const [fields, setFields] = useState({
    org: "",
    name: "",
    email: "",
    scope: "",
    description: "",
    timeline: "",
    referral: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  function update(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      if (fieldErrors[key]) setFieldErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
    };
  }

  function validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!fields.org.trim()) errors.org = c.required;
    if (!fields.name.trim()) errors.name = c.required;
    if (!fields.email.trim()) errors.email = c.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = c.emailInvalid;
    if (!fields.scope) errors.scope = c.required;
    if (!fields.description.trim()) errors.description = c.required;
    if (!fields.timeline) errors.timeline = c.required;
    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/submit/engagement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, locale }),
      });
      const data = await res.json();
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
          aria-invalid={fieldErrors.org ? "true" : undefined}
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
          aria-invalid={fieldErrors.name ? "true" : undefined}
          aria-describedby={fieldErrors.name ? "eng-name-err" : undefined}
        />
        {fieldErrors.name && <span id="eng-name-err" className="nd-field-error" role="alert">{fieldErrors.name}</span>}
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
          aria-invalid={fieldErrors.email ? "true" : undefined}
          aria-describedby={fieldErrors.email ? "eng-email-err" : undefined}
        />
        {fieldErrors.email && <span id="eng-email-err" className="nd-field-error" role="alert">{fieldErrors.email}</span>}
      </div>

      <div className="nd-field">
        <label className="nd-field-label" htmlFor="eng-scope">
          {c.scope} <span className="nd-field-req" aria-label={c.required}>*</span>
        </label>
        <select
          id="eng-scope"
          className="nd-select"
          value={fields.scope}
          onChange={update("scope")}
          aria-invalid={fieldErrors.scope ? "true" : undefined}
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
          aria-invalid={fieldErrors.description ? "true" : undefined}
          aria-describedby={fieldErrors.description ? "eng-desc-err" : undefined}
        />
        {fieldErrors.description && <span id="eng-desc-err" className="nd-field-error" role="alert">{fieldErrors.description}</span>}
      </div>

      <div className="nd-field">
        <label className="nd-field-label" htmlFor="eng-timeline">
          {c.timeline} <span className="nd-field-req" aria-label={c.required}>*</span>
        </label>
        <select
          id="eng-timeline"
          className="nd-select"
          value={fields.timeline}
          onChange={update("timeline")}
          aria-invalid={fieldErrors.timeline ? "true" : undefined}
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
        <label className="nd-field-label" htmlFor="eng-referral">
          {c.referral}
        </label>
        <input
          id="eng-referral"
          className="nd-input"
          type="text"
          placeholder={c.referralPh}
          value={fields.referral}
          onChange={update("referral")}
          autoComplete="off"
        />
      </div>

      {status === "error" && (
        <div className="nd-form-status nd-form-status--error" role="alert">
          <p className="nd-p-sm">{c.error}</p>
        </div>
      )}

      <button
        type="submit"
        className="btn"
        disabled={status === "submitting"}
        aria-busy={status === "submitting" ? "true" : undefined}
        style={{ marginTop: "var(--space-5)", width: "100%" }}
      >
        {status === "submitting" ? c.submitting : c.submit}
      </button>
    </form>
  );
}
