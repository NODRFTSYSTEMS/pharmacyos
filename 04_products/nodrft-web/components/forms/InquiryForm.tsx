"use client";

import { useState, useEffect, useRef } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const URGENCY_OPTIONS = {
  en: [
    { value: "", label: "Select urgency level" },
    { value: "exploratory", label: "Exploratory — no timeline yet" },
    { value: "3mo", label: "Within 3 months" },
    { value: "1mo", label: "Within 1 month" },
  ],
  es: [
    { value: "", label: "Seleccione nivel de urgencia" },
    { value: "exploratory", label: "Exploratorio — sin cronograma aún" },
    { value: "3mo", label: "En 3 meses" },
    { value: "1mo", label: "En 1 mes" },
  ],
};

const COPY = {
  en: {
    name: "Your name",
    namePh: "First and last name",
    email: "Email",
    emailPh: "your@email.com",
    org: "Organization (optional)",
    orgPh: "Company or project name",
    body: "What are you looking to explore?",
    bodyPh: "Describe what you're thinking about — a project, a problem, a question about scope or fit. No commitment, no pressure.",
    urgency: "How urgent is this?",
    submit: "Send inquiry",
    submitting: "Sending…",
    success: "Your inquiry has been received. We review every message and will respond within 2 business days.",
    error: "Submission failed. Please try again or email us at sales@nodrftsystems.com",
    required: "Required field",
    emailInvalid: "Enter a valid email address",
    errorSummary: "Please correct the errors marked below.",
  },
  es: {
    name: "Su nombre",
    namePh: "Nombre y apellido",
    email: "Correo electrónico",
    emailPh: "su@correo.com",
    org: "Organización (opcional)",
    orgPh: "Nombre de la empresa o proyecto",
    body: "¿Qué desea explorar?",
    bodyPh: "Describa lo que tiene en mente — un proyecto, un problema, una pregunta sobre alcance o ajuste. Sin compromiso, sin presión.",
    urgency: "¿Qué tan urgente es esto?",
    submit: "Enviar consulta",
    submitting: "Enviando…",
    success: "Su consulta ha sido recibida. Revisamos cada mensaje y responderemos en 2 días hábiles.",
    error: "Error al enviar. Por favor intente nuevamente o escríbanos a sales@nodrftsystems.com",
    required: "Campo requerido",
    emailInvalid: "Ingrese una dirección de correo válida",
    errorSummary: "Por favor corrija los errores marcados a continuación.",
  },
};

interface Props {
  locale: "en" | "es";
}

export function InquiryForm({ locale }: Props) {
  const c = COPY[locale];
  const urgencies = URGENCY_OPTIONS[locale];

  const [status, setStatus] = useState<Status>("idle");
  const [fields, setFields] = useState({
    name: "",
    email: "",
    org: "",
    body: "",
    urgency: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const successRef = useRef<HTMLDivElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const shouldFocusSummary = useRef(false);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  useEffect(() => {
    if (shouldFocusSummary.current && Object.keys(fieldErrors).length > 0) {
      errorSummaryRef.current?.focus();
      shouldFocusSummary.current = false;
    }
  }, [fieldErrors]);

  function update(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      if (fieldErrors[key]) setFieldErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
    };
  }

  function validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!fields.name.trim()) errors.name = c.required;
    if (!fields.email.trim()) errors.email = c.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = c.emailInvalid;
    if (!fields.body.trim()) errors.body = c.required;
    if (!fields.urgency) errors.urgency = c.required;
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
      const res = await fetch("/api/submit/inquiry", {
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
      <div className="nd-field">
        <label className="nd-field-label" htmlFor="inq-name">
          {c.name} <span className="nd-field-req" aria-label={c.required}>*</span>
        </label>
        <input
          id="inq-name"
          className="nd-input"
          type="text"
          placeholder={c.namePh}
          value={fields.name}
          onChange={update("name")}
          autoComplete="name"
          aria-invalid={fieldErrors.name ? "true" : undefined}
          aria-describedby={fieldErrors.name ? "inq-name-err" : undefined}
        />
        {fieldErrors.name && <span id="inq-name-err" className="nd-field-error" role="alert">{fieldErrors.name}</span>}
      </div>

      <div className="nd-field">
        <label className="nd-field-label" htmlFor="inq-email">
          {c.email} <span className="nd-field-req" aria-label={c.required}>*</span>
        </label>
        <input
          id="inq-email"
          className="nd-input"
          type="email"
          placeholder={c.emailPh}
          value={fields.email}
          onChange={update("email")}
          autoComplete="email"
          aria-invalid={fieldErrors.email ? "true" : undefined}
          aria-describedby={fieldErrors.email ? "inq-email-err" : undefined}
        />
        {fieldErrors.email && <span id="inq-email-err" className="nd-field-error" role="alert">{fieldErrors.email}</span>}
      </div>

      <div className="nd-field">
        <label className="nd-field-label" htmlFor="inq-org">
          {c.org}
        </label>
        <input
          id="inq-org"
          className="nd-input"
          type="text"
          placeholder={c.orgPh}
          value={fields.org}
          onChange={update("org")}
          autoComplete="organization"
        />
      </div>

      <div className="nd-field">
        <label className="nd-field-label" htmlFor="inq-body">
          {c.body} <span className="nd-field-req" aria-label={c.required}>*</span>
        </label>
        <textarea
          id="inq-body"
          className="nd-textarea"
          placeholder={c.bodyPh}
          value={fields.body}
          onChange={update("body")}
          rows={5}
          aria-invalid={fieldErrors.body ? "true" : undefined}
          aria-describedby={fieldErrors.body ? "inq-body-err" : undefined}
        />
        {fieldErrors.body && <span id="inq-body-err" className="nd-field-error" role="alert">{fieldErrors.body}</span>}
      </div>

      <div className="nd-field">
        <label className="nd-field-label" htmlFor="inq-urgency">
          {c.urgency} <span className="nd-field-req" aria-label={c.required}>*</span>
        </label>
        <select
          id="inq-urgency"
          className="nd-select"
          value={fields.urgency}
          onChange={update("urgency")}
          aria-invalid={fieldErrors.urgency ? "true" : undefined}
          aria-describedby={fieldErrors.urgency ? "inq-urgency-err" : undefined}
        >
          {urgencies.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
              {opt.label}
            </option>
          ))}
        </select>
        {fieldErrors.urgency && <span id="inq-urgency-err" className="nd-field-error" role="alert">{fieldErrors.urgency}</span>}
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
        aria-busy={status === "submitting" ? "true" : undefined}
      >
        {status === "submitting" ? c.submitting : c.submit}
      </button>
    </form>
  );
}
