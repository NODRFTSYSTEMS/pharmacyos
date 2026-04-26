"use client";

import { useState } from "react";

type FormType = "seller" | "agent";

interface Field {
  key: string;
  en: string;
  es: string;
  type: "text" | "email" | "select" | "textarea";
  required: boolean;
  options?: { value: string; en: string; es: string }[];
  placeholder?: { en: string; es: string };
}

const SELLER_FIELDS: Field[] = [
  { key: "name", en: "Your name", es: "Tu nombre", type: "text", required: true, placeholder: { en: "Full name", es: "Nombre completo" } },
  { key: "email", en: "Email", es: "Correo electrónico", type: "email", required: true, placeholder: { en: "your@email.com", es: "tu@correo.com" } },
  { key: "city", en: "Property city", es: "Ciudad del inmueble", type: "select", required: true, options: [
    { value: "bogota", en: "Bogotá", es: "Bogotá" },
    { value: "medellin", en: "Medellín", es: "Medellín" },
    { value: "cartagena", en: "Cartagena", es: "Cartagena" },
    { value: "cali", en: "Cali", es: "Cali" },
    { value: "santa_marta", en: "Santa Marta", es: "Santa Marta" },
    { value: "barranquilla", en: "Barranquilla", es: "Barranquilla" },
    { value: "pereira", en: "Pereira", es: "Pereira" },
    { value: "other", en: "Other city", es: "Otra ciudad" },
  ]},
  { key: "property_type", en: "Property type", es: "Tipo de inmueble", type: "select", required: true, options: [
    { value: "apartment", en: "Apartment", es: "Apartamento" },
    { value: "house", en: "House", es: "Casa" },
    { value: "penthouse", en: "Penthouse", es: "Ático" },
    { value: "studio", en: "Studio", es: "Estudio" },
    { value: "other", en: "Other", es: "Otro" },
  ]},
  { key: "listing_type", en: "Listing type", es: "Modalidad", type: "select", required: true, options: [
    { value: "sale", en: "For sale", es: "En venta" },
    { value: "rental", en: "For rent", es: "En arriendo" },
    { value: "both", en: "Both", es: "Ambas" },
  ]},
  { key: "price_range", en: "Asking price (USD)", es: "Precio pedido (USD)", type: "select", required: false, options: [
    { value: "under_100k", en: "Under $100K", es: "Menos de $100K" },
    { value: "100_250k", en: "$100K – $250K", es: "$100K – $250K" },
    { value: "250_500k", en: "$250K – $500K", es: "$250K – $500K" },
    { value: "500k_plus", en: "$500K+", es: "$500K+" },
    { value: "rental", en: "Monthly rental", es: "Arriendo mensual" },
  ]},
  { key: "notes", en: "Brief description", es: "Descripción breve", type: "textarea", required: false, placeholder: { en: "Neighborhood, condition, any known issues...", es: "Barrio, estado del inmueble, situaciones conocidas..." } },
];

const AGENT_FIELDS: Field[] = [
  { key: "name", en: "Full name", es: "Nombre completo", type: "text", required: true, placeholder: { en: "Full name", es: "Nombre completo" } },
  { key: "email", en: "Email", es: "Correo electrónico", type: "email", required: true, placeholder: { en: "your@email.com", es: "tu@correo.com" } },
  { key: "role", en: "Your role", es: "Tu rol", type: "select", required: true, options: [
    { value: "agent", en: "Real estate agent", es: "Agente inmobiliario" },
    { value: "attorney", en: "Property attorney", es: "Abogado inmobiliario" },
    { value: "property_manager", en: "Property manager", es: "Administrador de propiedad" },
    { value: "accountant", en: "Tax/accounting advisor", es: "Asesor contable/tributario" },
    { value: "other", en: "Other", es: "Otro" },
  ]},
  { key: "city", en: "City you operate in", es: "Ciudad donde operas", type: "select", required: true, options: [
    { value: "bogota", en: "Bogotá", es: "Bogotá" },
    { value: "medellin", en: "Medellín", es: "Medellín" },
    { value: "cartagena", en: "Cartagena", es: "Cartagena" },
    { value: "cali", en: "Cali", es: "Cali" },
    { value: "santa_marta", en: "Santa Marta", es: "Santa Marta" },
    { value: "barranquilla", en: "Barranquilla", es: "Barranquilla" },
    { value: "multiple", en: "Multiple cities", es: "Varias ciudades" },
  ]},
  { key: "english_level", en: "English level", es: "Nivel de inglés", type: "select", required: true, options: [
    { value: "fluent", en: "Fluent", es: "Fluido" },
    { value: "functional", en: "Functional (can work in English)", es: "Funcional (puede trabajar en inglés)" },
    { value: "limited", en: "Limited — have bilingual colleague", es: "Limitado — tengo colega bilingüe" },
  ]},
  { key: "license_or_registration", en: "License / registration (optional)", es: "Licencia / registro (opcional)", type: "text", required: false, placeholder: { en: "Lonja registration, bar association, etc.", es: "Registro Lonja, colegio de abogados, etc." } },
  { key: "notes", en: "How can you help CasaClaro clients?", es: "¿Cómo puedes ayudar a los clientes de CasaClaro?", type: "textarea", required: false, placeholder: { en: "Specialties, languages, typical transaction size...", es: "Especialidades, idiomas, tamaño típico de transacción..." } },
];

const STYLE = {
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(31,58,77,0.15)",
    background: "white",
    color: "var(--ocean, #1f3a4d)",
    fontSize: "0.88rem",
    fontFamily: "var(--font-body, system-ui)",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  label: {
    display: "block" as const,
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "rgba(31,58,77,0.55)",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
    marginBottom: "6px",
    fontFamily: "var(--font-body, system-ui)",
  },
};

interface Props {
  type: FormType;
  locale?: "en" | "es";
}

export function ContactForm({ type, locale = "en" }: Props) {
  const isEn = locale === "en";
  const fields = type === "seller" ? SELLER_FIELDS : AGENT_FIELDS;
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function set(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...values }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div style={{ padding: "32px 28px", background: "rgba(31,143,89,0.08)", border: "1px solid rgba(31,143,89,0.2)", borderRadius: "var(--radius, 26px)", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.3rem", color: "var(--ocean, #1f3a4d)", margin: "0 0 8px" }}>
          {isEn ? "Submission received." : "Solicitud recibida."}
        </p>
        <p style={{ fontSize: "0.85rem", color: "rgba(31,58,77,0.55)", margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
          {isEn
            ? "We'll review your submission and follow up within 3–5 business days."
            : "Revisaremos tu solicitud y te escribiremos en un plazo de 3–5 días hábiles."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "var(--sand, #fff8ef)",
        border: "1px solid rgba(31,58,77,0.08)",
        borderRadius: "var(--radius, 26px)",
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      <p style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.2rem", color: "var(--ocean, #1f3a4d)", margin: "0 0 4px" }}>
        {type === "seller"
          ? (isEn ? "Submit Your Property" : "Enviar tu Propiedad")
          : (isEn ? "Apply to Partner Network" : "Aplicar a la Red de Socios")}
      </p>

      {fields.map((field) => (
        <div key={field.key}>
          <label htmlFor={field.key} style={STYLE.label}>
            {isEn ? field.en : field.es}
            {field.required && <span style={{ color: "var(--terracotta, #e67e22)", marginLeft: "3px" }}>*</span>}
          </label>

          {field.type === "select" ? (
            <select
              id={field.key}
              required={field.required}
              value={values[field.key] ?? ""}
              onChange={(e) => set(field.key, e.target.value)}
              style={{ ...STYLE.input, cursor: "pointer" }}
            >
              <option value="">{isEn ? "Select..." : "Seleccionar..."}</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {isEn ? opt.en : opt.es}
                </option>
              ))}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              id={field.key}
              required={field.required}
              rows={3}
              value={values[field.key] ?? ""}
              onChange={(e) => set(field.key, e.target.value)}
              placeholder={field.placeholder ? (isEn ? field.placeholder.en : field.placeholder.es) : undefined}
              style={{ ...STYLE.input, resize: "vertical" as const }}
            />
          ) : (
            <input
              id={field.key}
              type={field.type}
              required={field.required}
              value={values[field.key] ?? ""}
              onChange={(e) => set(field.key, e.target.value)}
              placeholder={field.placeholder ? (isEn ? field.placeholder.en : field.placeholder.es) : undefined}
              style={STYLE.input}
            />
          )}
        </div>
      ))}

      {status === "error" && (
        <p style={{ fontSize: "0.78rem", color: "#e53e3e", margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
          {isEn ? "Something went wrong. Try again or email hello@casaclaro.co" : "Algo salió mal. Intenta de nuevo o escribe a hello@casaclaro.co"}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          padding: "13px 24px",
          background: status === "loading" ? "rgba(230,126,34,0.6)" : "var(--terracotta, #e67e22)",
          color: "white",
          border: "none",
          borderRadius: "999px",
          fontWeight: 600,
          fontSize: "0.9rem",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          fontFamily: "var(--font-body, system-ui)",
          alignSelf: "flex-start",
        }}
      >
        {status === "loading"
          ? (isEn ? "Submitting..." : "Enviando...")
          : type === "seller"
            ? (isEn ? "Submit Property →" : "Enviar Propiedad →")
            : (isEn ? "Apply to Partner Network →" : "Aplicar a la Red →")}
      </button>

      <p style={{ fontSize: "0.72rem", color: "rgba(31,58,77,0.35)", margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
        {isEn
          ? "We review all submissions within 3–5 business days. No spam."
          : "Revisamos todas las solicitudes en 3–5 días hábiles. Sin spam."}
      </p>
    </form>
  );
}
