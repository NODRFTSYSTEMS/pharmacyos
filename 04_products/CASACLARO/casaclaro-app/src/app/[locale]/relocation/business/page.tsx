"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

type Intent = "investing" | "employed" | "freelance" | "";
type Stay = "short" | "long" | "";

const BUSINESS_STRUCTURES = [
  {
    name: "S.A.S.",
    full: { en: "Simplified Shares Company (S.A.S.)", es: "Sociedad por Acciones Simplificada" },
    desc: {
      en: "The most common structure for foreign entrepreneurs. Single shareholder permitted, limited liability, flexible governance. Fast registration through RUES.",
      es: "La estructura más común para emprendedores extranjeros. Se permite un solo accionista, responsabilidad limitada, gobernanza flexible. Registro rápido a través del RUES.",
    },
    bestFor: { en: "Most businesses, startups, consulting", es: "La mayoría de negocios, startups, consultoría" },
    capitalNote: {
      en: "No minimum capital requirement by law, but banks may ask for a minimum deposit to open a business account.",
      es: "Sin requisito de capital mínimo por ley, pero los bancos pueden pedir un depósito mínimo para abrir una cuenta empresarial.",
    },
  },
  {
    name: "Sucursal",
    full: { en: "Branch of a Foreign Company", es: "Sucursal de Sociedad Extranjera" },
    desc: {
      en: "An extension of your existing foreign company operating in Colombia. Requires registration with the Chamber of Commerce and notarized parent company documents.",
      es: "Una extensión de su empresa extranjera existente operando en Colombia. Requiere registro en la Cámara de Comercio y documentos notarizados de la empresa matriz.",
    },
    bestFor: {
      en: "Companies with existing operations abroad expanding to Colombia",
      es: "Empresas con operaciones existentes en el exterior que se expanden a Colombia",
    },
    capitalNote: {
      en: "The parent company assumes full liability for the Colombian branch.",
      es: "La empresa matriz asume responsabilidad total por la sucursal colombiana.",
    },
  },
  {
    name: "Persona Natural",
    full: { en: "Sole Proprietorship (Persona Natural)", es: "Persona Natural con actividad económica" },
    desc: {
      en: "Operate as an individual — simplest path for freelancers and consultants. Full personal liability. Tax regime varies based on income.",
      es: "Operar como persona individual — la vía más simple para freelancers y consultores. Responsabilidad personal total. Régimen tributario varía según los ingresos.",
    },
    bestFor: { en: "Freelancers, consultants, small service providers", es: "Freelancers, consultores, pequeños prestadores de servicios" },
    capitalNote: {
      en: "No capital requirement. Must register with DIAN for tax purposes.",
      es: "Sin requisito de capital. Debe registrarse ante la DIAN para efectos fiscales.",
    },
  },
];

const STEPS = [
  {
    en: "Obtain a valid Colombian visa that permits work or investment activities.",
    es: "Obtener una visa colombiana válida que permita actividades laborales o de inversión.",
  },
  {
    en: "Get a Cédula de Extranjería (foreign ID) from Migración Colombia once you have a long-term visa.",
    es: "Obtener la Cédula de Extranjería de Migración Colombia una vez tenga visa de largo plazo.",
  },
  {
    en: "Draft company bylaws (estatutos) — most attorneys provide a template S.A.S. deed.",
    es: "Redactar los estatutos de la empresa — la mayoría de abogados proveen una escritura modelo de S.A.S.",
  },
  {
    en: "Register your company with the local Chamber of Commerce (Cámara de Comercio) via RUES.",
    es: "Registrar la empresa en la Cámara de Comercio local a través del RUES.",
  },
  {
    en: "Register with DIAN (Colombia's tax authority) and obtain your NIT (tax ID number).",
    es: "Registrarse ante la DIAN (autoridad tributaria de Colombia) y obtener su NIT.",
  },
  {
    en: "Open a Colombian business bank account — most banks require NIT, registration certificate, and minimum deposit.",
    es: "Abrir una cuenta bancaria empresarial colombiana — la mayoría requiere NIT, certificado de registro y depósito mínimo.",
  },
  {
    en: "Register for ICA (industry and commerce tax) with your local municipality if applicable.",
    es: "Registrarse para el ICA (impuesto de industria y comercio) ante su municipio si aplica.",
  },
];

function DecisionHelper({ locale }: { locale: string }) {
  const loc = locale === "es" ? "es" : "en";
  const [intent, setIntent] = useState<Intent>("");
  const [stay, setStay] = useState<Stay>("");

  const result: { visa: string; structure: string; note: string } | null =
    intent && stay
      ? intent === "investing" && stay === "long"
        ? {
            visa: loc === "es" ? "M-Inversionista (Visa Migrante)" : "M-Investor (Migrant Visa)",
            structure: "S.A.S. or Sucursal",
            note:
              loc === "es"
                ? "Requiere inversión mínima de 350 SMLMV (~$149,467 USD). Permite residencia a largo plazo."
                : "Requires minimum investment of 350 SMLMV (~$149,467 USD). Enables long-term residency.",
          }
        : intent === "investing" && stay === "short"
        ? {
            visa: loc === "es" ? "Visa de Visitante (V)" : "Visitor Visa (V)",
            structure: "S.A.S. (pre-register before arrival)",
            note:
              loc === "es"
                ? "Adecuada para períodos cortos. Explore la inversión y regrese una vez lista la estructura."
                : "Suitable for short periods. Scout the investment and return once your structure is ready.",
          }
        : intent === "employed" && stay === "long"
        ? {
            visa: loc === "es" ? "M-Empleado (Migrant Worker)" : "M-Employee (Migrant Worker)",
            structure: "Persona Natural (empleado de empresa colombiana)",
            note:
              loc === "es"
                ? "La empresa colombiana que lo contrata debe estar registrada y cumplir los requisitos laborales."
                : "The Colombian company hiring you must be registered and meet labor requirements.",
          }
        : intent === "freelance" && stay === "long"
        ? {
            visa: loc === "es" ? "M-Independiente (Migrante)" : "M-Independent Worker (Migrant)",
            structure: "Persona Natural or S.A.S.",
            note:
              loc === "es"
                ? "Demuestre ingresos recurrentes equivalentes a 3× SMLMV o más. Contrato de servicios puede servir como soporte."
                : "Demonstrate recurring income of 3× SMLMV or more. A services contract can serve as supporting documentation.",
          }
        : {
            visa: loc === "es" ? "Visa de Visitante (V)" : "Visitor Visa (V)",
            structure: "N/A",
            note:
              loc === "es"
                ? "Para estadías cortas sin intención de establecerse, la visa de visitante es suficiente."
                : "For short stays with no intent to establish, a visitor visa is sufficient.",
          }
      : null;

  const btn = (value: string, current: string, label: string, setter: (v: never) => void) => (
    <button
      onClick={() => setter(value as never)}
      aria-pressed={current === value}
      style={{
        padding: "9px 16px",
        borderRadius: "10px",
        border: "1px solid var(--border, rgba(35,49,63,0.15))",
        background: current === value ? "var(--ocean, #1f3a4d)" : "#fff",
        color: current === value ? "#fff" : "var(--charcoal, #23313f)",
        fontSize: "0.84rem",
        fontWeight: current === value ? 600 : 400,
        cursor: "pointer",
        fontFamily: "var(--font-body, system-ui)",
        transition: "all 0.12s",
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        background: "var(--card, rgba(255,252,247,0.92))",
        border: "1px solid var(--border, rgba(35,49,63,0.1))",
        borderRadius: "var(--radius-sm, 18px)",
        padding: "28px",
        maxWidth: "560px",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-display, Georgia, serif)",
          fontSize: "1.1rem",
          fontWeight: 400,
          color: "var(--ocean, #1f3a4d)",
          margin: "0 0 20px",
        }}
      >
        {loc === "es" ? "¿Cuál es tu situación?" : "What's your situation?"}
      </h3>

      <p style={{ fontSize: "0.85rem", color: "var(--muted, #6b7280)", margin: "0 0 8px", fontFamily: "var(--font-body, system-ui)" }}>
        {loc === "es" ? "Propósito principal:" : "Primary purpose:"}
      </p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        {btn("investing", intent, loc === "es" ? "Invertir / operar negocio" : "Invest / run a business", setIntent as (v: never) => void)}
        {btn("employed", intent, loc === "es" ? "Trabajar para empresa colombiana" : "Work for a Colombian employer", setIntent as (v: never) => void)}
        {btn("freelance", intent, loc === "es" ? "Trabajo independiente" : "Freelance / independent", setIntent as (v: never) => void)}
      </div>

      <p style={{ fontSize: "0.85rem", color: "var(--muted, #6b7280)", margin: "0 0 8px", fontFamily: "var(--font-body, system-ui)" }}>
        {loc === "es" ? "Duración prevista:" : "Intended stay:"}
      </p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
        {btn("short", stay, loc === "es" ? "Corta (< 6 meses)" : "Short (< 6 months)", setStay as (v: never) => void)}
        {btn("long", stay, loc === "es" ? "Larga (6+ meses)" : "Long-term (6+ months)", setStay as (v: never) => void)}
      </div>

      {result && (
        <div
          style={{
            background: "var(--sand, #fff8ef)",
            borderRadius: "12px",
            padding: "18px 20px",
          }}
        >
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ocean, #1f3a4d)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px", fontFamily: "var(--font-body, system-ui)" }}>
            {loc === "es" ? "Ruta sugerida" : "Suggested path"}
          </div>
          <div style={{ fontSize: "0.84rem", fontFamily: "var(--font-body, system-ui)", color: "var(--charcoal, #23313f)", lineHeight: 1.6 }}>
            <div style={{ marginBottom: "6px" }}>
              <strong>{loc === "es" ? "Visa: " : "Visa: "}</strong>{result.visa}
            </div>
            <div style={{ marginBottom: "10px" }}>
              <strong>{loc === "es" ? "Estructura: " : "Structure: "}</strong>{result.structure}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted, #6b7280)" }}>{result.note}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BusinessPage() {
  const locale = useLocale();
  const loc = locale === "es" ? "es" : "en";

  return (
    <div style={{ minHeight: "80vh", background: "var(--cream, #fdf5e6)" }}>
      {/* Header */}
      <section
        style={{
          maxWidth: "var(--max, 1240px)",
          margin: "0 auto",
          padding: "60px 24px 40px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--sand, #fff8ef)",
            border: "1px solid var(--border, rgba(35,49,63,0.1))",
            borderRadius: "999px",
            padding: "5px 14px",
            fontSize: "0.75rem",
            color: "var(--muted, #6b7280)",
            fontFamily: "var(--font-body, system-ui)",
            marginBottom: "20px",
          }}
        >
          <a href="/relocation" style={{ color: "var(--terracotta, #e67e22)", textDecoration: "none", fontWeight: 600 }}>
            {loc === "es" ? "Reubicación" : "Relocate"}
          </a>
          <span>›</span>
          <span>{loc === "es" ? "Iniciar un Negocio" : "Starting a Business"}</span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: 400,
            color: "var(--ocean, #1f3a4d)",
            margin: "0 0 16px",
          }}
        >
          {loc === "es" ? "Iniciar un Negocio en Colombia" : "Starting a Business in Colombia"}
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--muted, #6b7280)",
            maxWidth: "620px",
            lineHeight: 1.65,
            margin: 0,
            fontFamily: "var(--font-body, system-ui)",
          }}
        >
          {loc === "es"
            ? "Una guía práctica para extranjeros que consideran operar en Colombia — estructuras, capital requerido y cómo se conecta con su ruta de visa."
            : "A practical guide for foreigners considering operating in Colombia — structures, required capital, and how it connects to your visa path."}
        </p>

        {/* Disclaimer */}
        <div
          role="note"
          style={{
            background: "var(--rose, #f7e1d0)",
            borderLeft: "4px solid var(--terracotta, #e67e22)",
            borderRadius: "0 10px 10px 0",
            padding: "14px 18px",
            marginTop: "28px",
            maxWidth: "620px",
            fontSize: "0.82rem",
            color: "var(--charcoal, #23313f)",
            lineHeight: 1.6,
            fontFamily: "var(--font-body, system-ui)",
          }}
        >
          <strong>{loc === "es" ? "Aviso legal:" : "Legal notice:"}</strong>{" "}
          {loc === "es"
            ? "Esta guía es de carácter informativo únicamente. No constituye asesoría legal, fiscal o migratoria. Consulte con un abogado colombiano calificado antes de tomar decisiones."
            : "This guide is for informational purposes only. It does not constitute legal, tax, or immigration advice. Consult a qualified Colombian attorney before making any decisions."}
        </div>
      </section>

      {/* Business structures */}
      <section
        style={{
          maxWidth: "var(--max, 1240px)",
          margin: "0 auto",
          padding: "0 24px 48px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "1.5rem",
            fontWeight: 400,
            color: "var(--ocean, #1f3a4d)",
            margin: "0 0 24px",
          }}
        >
          {loc === "es" ? "Estructuras Empresariales Comunes" : "Common Business Structures"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {BUSINESS_STRUCTURES.map((s) => (
            <div
              key={s.name}
              style={{
                background: "var(--card, rgba(255,252,247,0.92))",
                border: "1px solid var(--border, rgba(35,49,63,0.1))",
                borderRadius: "var(--radius-sm, 18px)",
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background: "var(--ocean, #1f3a4d)",
                  color: "#fff",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "6px",
                  marginBottom: "10px",
                  fontFamily: "var(--font-body, system-ui)",
                  letterSpacing: "0.03em",
                }}
              >
                {s.name}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display, Georgia, serif)",
                  fontSize: "1rem",
                  fontWeight: 400,
                  color: "var(--ocean, #1f3a4d)",
                  margin: "0 0 10px",
                }}
              >
                {s.full[loc]}
              </h3>
              <p style={{ fontSize: "0.84rem", color: "var(--charcoal, #23313f)", lineHeight: 1.6, margin: "0 0 12px", fontFamily: "var(--font-body, system-ui)" }}>
                {s.desc[loc]}
              </p>
              <div style={{ fontSize: "0.78rem", fontFamily: "var(--font-body, system-ui)", color: "var(--muted, #6b7280)" }}>
                <strong style={{ color: "var(--charcoal, #23313f)" }}>
                  {loc === "es" ? "Ideal para: " : "Best for: "}
                </strong>
                {s.bestFor[loc]}
              </div>
              <div
                style={{
                  marginTop: "12px",
                  padding: "10px 14px",
                  background: "var(--sand, #fff8ef)",
                  borderRadius: "8px",
                  fontSize: "0.78rem",
                  color: "var(--charcoal, #23313f)",
                  lineHeight: 1.5,
                  fontFamily: "var(--font-body, system-ui)",
                }}
              >
                <strong>{loc === "es" ? "Capital: " : "Capital: "}</strong>
                {s.capitalNote[loc]}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Registration steps */}
      <section
        style={{
          maxWidth: "var(--max, 1240px)",
          margin: "0 auto",
          padding: "0 24px 48px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "1.5rem",
            fontWeight: 400,
            color: "var(--ocean, #1f3a4d)",
            margin: "0 0 24px",
          }}
        >
          {loc === "es" ? "Pasos Generales de Registro" : "General Registration Steps"}
        </h2>
        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
          {STEPS.map((step, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
                background: "var(--card, rgba(255,252,247,0.92))",
                border: "1px solid var(--border, rgba(35,49,63,0.1))",
                borderRadius: "12px",
                padding: "16px 20px",
              }}
            >
              <span
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "var(--terracotta, #e67e22)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-body, system-ui)",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: "0.88rem", color: "var(--charcoal, #23313f)", lineHeight: 1.6, fontFamily: "var(--font-body, system-ui)" }}>
                {step[loc]}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Decision helper */}
      <section
        style={{
          maxWidth: "var(--max, 1240px)",
          margin: "0 auto",
          padding: "0 24px 48px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "1.5rem",
            fontWeight: 400,
            color: "var(--ocean, #1f3a4d)",
            margin: "0 0 8px",
          }}
        >
          {loc === "es" ? "Ayuda para Decidir" : "Decision Helper"}
        </h2>
        <p style={{ fontSize: "0.88rem", color: "var(--muted, #6b7280)", margin: "0 0 24px", fontFamily: "var(--font-body, system-ui)" }}>
          {loc === "es"
            ? "Selecciona tu situación para obtener una ruta orientativa. Solo de referencia — consulta con un abogado."
            : "Select your situation for a suggested path. For guidance only — consult an attorney."}
        </p>
        <DecisionHelper locale={loc} />
      </section>

      {/* Official resources */}
      <section
        style={{
          maxWidth: "var(--max, 1240px)",
          margin: "0 auto",
          padding: "0 24px 48px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "1.5rem",
            fontWeight: 400,
            color: "var(--ocean, #1f3a4d)",
            margin: "0 0 16px",
          }}
        >
          {loc === "es" ? "Recursos Oficiales" : "Official Resources"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "12px" }}>
          {[
            { label: "RUES — Business Registration", url: "https://www.rues.org.co" },
            { label: "DIAN — Tax Registration", url: "https://www.dian.gov.co" },
            { label: "Cámara de Comercio de Bogotá", url: "https://www.ccb.org.co" },
            { label: "Migración Colombia — Visas", url: "https://www.migracioncolombia.gov.co" },
            { label: "Procolombia — Foreign Investment", url: "https://www.procolombia.co" },
          ].map((r) => (
            <a
              key={r.label}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                padding: "14px 18px",
                background: "var(--card, rgba(255,252,247,0.92))",
                border: "1px solid var(--border, rgba(35,49,63,0.1))",
                borderRadius: "12px",
                fontSize: "0.84rem",
                color: "var(--ocean, #1f3a4d)",
                fontWeight: 500,
                textDecoration: "none",
                fontFamily: "var(--font-body, system-ui)",
                transition: "border-color 0.15s",
              }}
            >
              {r.label} ↗
            </a>
          ))}
        </div>
      </section>

      {/* Bottom CTAs */}
      <section
        style={{
          maxWidth: "var(--max, 1240px)",
          margin: "0 auto",
          padding: "0 24px 80px",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <a
          href="/partners"
          style={{
            display: "inline-block",
            background: "var(--terracotta, #e67e22)",
            color: "#fff",
            padding: "13px 28px",
            borderRadius: "999px",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 600,
            fontFamily: "var(--font-body, system-ui)",
          }}
        >
          {loc === "es" ? "Habla con un abogado →" : "Talk to a partner attorney →"}
        </a>
        <a
          href="/residency"
          style={{
            display: "inline-block",
            background: "transparent",
            color: "var(--ocean, #1f3a4d)",
            padding: "13px 28px",
            borderRadius: "999px",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 600,
            border: "1px solid var(--border, rgba(35,49,63,0.2))",
            fontFamily: "var(--font-body, system-ui)",
          }}
        >
          {loc === "es" ? "Ver rutas de visa →" : "View visa pathways →"}
        </a>
        <a
          href="/cost-simulator"
          style={{
            display: "inline-block",
            background: "transparent",
            color: "var(--ocean, #1f3a4d)",
            padding: "13px 28px",
            borderRadius: "999px",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 600,
            border: "1px solid var(--border, rgba(35,49,63,0.2))",
            fontFamily: "var(--font-body, system-ui)",
          }}
        >
          {loc === "es" ? "Simulador de costos de propiedad →" : "Property Cost Simulator →"}
        </a>
      </section>
    </div>
  );
}
