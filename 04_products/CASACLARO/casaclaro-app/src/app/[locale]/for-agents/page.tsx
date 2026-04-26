import { ContactForm } from "@/components/ContactForm";

interface Props {
  params: Promise<{ locale: string }>;
}

// ─── Partner standards ─────────────────────────────────────────────────────────

const STANDARDS = [
  {
    titleEn: "Licensed or formally registered",
    titleEs: "Con licencia o registro formal",
    descEn: "Partners operating as real estate agents must be registered with Lonja de Propiedad Raíz or hold equivalent formal credentials. Attorneys and property managers must hold verifiable professional registration.",
    descEs: "Los socios que operan como agentes inmobiliarios deben estar registrados en la Lonja de Propiedad Raíz o contar con credenciales formales equivalentes. Abogados y administradores deben tener registro profesional verificable.",
  },
  {
    titleEn: "Disclosure-compliant",
    titleEs: "Cumplimiento de revelación",
    descEn: "All known material defects, encumbrances, and title issues must be disclosed before a listing is submitted. Partners who submit properties with withheld material information are permanently removed.",
    descEs: "Todos los defectos materiales conocidos, gravámenes y problemas de título deben declararse antes de enviar un listado. Los socios que presenten propiedades con información relevante ocultada son retirados permanentemente.",
  },
  {
    titleEn: "Market-honest pricing",
    titleEs: "Precios honestos de mercado",
    descEn: "We do not activate listings priced to deceive or obscure true market value. Partners are expected to present properties at defensible, comparable-supported pricing.",
    descEs: "No activamos listados con precios para engañar u obscurecer el valor real de mercado. Se espera que los socios presenten propiedades con precios defendibles y respaldados por comparables.",
  },
  {
    titleEn: "Bilingual readiness",
    titleEs: "Disponibilidad bilingüe",
    descEn: "CasaClaro's audience is predominantly English-speaking. Partners or their teams should be able to communicate in English at a functional level, or designate a bilingual point of contact.",
    descEs: "La audiencia de CasaClaro es predominantemente angloparlante. Los socios o sus equipos deben poder comunicarse en inglés a nivel funcional, o designar un punto de contacto bilingüe.",
  },
  {
    titleEn: "Response standards",
    titleEs: "Estándares de respuesta",
    descEn: "Qualified buyer and renter inquiries must receive a response within 48 hours on business days. Persistent non-response results in listing suspension.",
    descEs: "Las consultas calificadas de compradores e inquilinos deben recibir respuesta en 48 horas en días hábiles. La falta de respuesta persistente resulta en suspensión del listado.",
  },
];

// ─── Partner types we work with ────────────────────────────────────────────────

const PARTNER_TYPES = [
  {
    typeEn: "Real estate agents and brokers",
    typeEs: "Agentes y brokers inmobiliarios",
    descEn: "Licensed agents with active inventory in Medellín, Bogotá, Cartagena, or other Colombian cities. Must be able to support international buyers through the transaction process including notarial steps.",
    descEs: "Agentes con licencia activos en Medellín, Bogotá, Cartagena u otras ciudades colombianas. Deben poder acompañar a compradores internacionales en el proceso de transacción, incluidos los pasos notariales.",
  },
  {
    typeEn: "Real estate attorneys",
    typeEs: "Abogados inmobiliarios",
    descEn: "Attorneys specializing in Colombian property law, title review, contract preparation, closing support, and foreign investment registration. Bilingual capability strongly preferred.",
    descEs: "Abogados especializados en derecho inmobiliario colombiano, revisión de títulos, preparación de contratos, apoyo en cierres y registro de inversión extranjera. Capacidad bilingüe fuertemente preferida.",
  },
  {
    typeEn: "Property managers",
    typeEs: "Administradores de propiedad",
    descEn: "Operators handling rental management, maintenance coordination, tenant screening, and rent collection for foreign-owned properties in Colombia.",
    descEs: "Operadores que gestionan arrendamiento, coordinación de mantenimiento, selección de inquilinos y cobro de arriendo para propiedades de propietarios extranjeros en Colombia.",
  },
  {
    typeEn: "Local operators and relocation consultants",
    typeEs: "Operadores locales y consultores de reubicación",
    descEn: "Service providers who help incoming expats navigate practical relocation steps: banking, SIM cards, neighborhood orientation, first-30-days logistics.",
    descEs: "Proveedores de servicios que ayudan a los expatriados entrantes a navegar los pasos prácticos de reubicación: bancos, SIM cards, orientación de barrio, logística de los primeros 30 días.",
  },
];

// ─── What partners receive ─────────────────────────────────────────────────────

const BENEFITS = [
  {
    en: "Your listings reach a bilingual international buyer and renter audience actively researching Colombian real estate",
    es: "Tus listados llegan a una audiencia internacional bilingüe de compradores e inquilinos que investigan activamente bienes raíces colombianos",
  },
  {
    en: "Qualified inquiries forwarded to you with buyer context — not unfiltered cold traffic",
    es: "Consultas calificadas enviadas directamente con contexto del comprador — no tráfico frío sin filtrar",
  },
  {
    en: "Listings displayed with neighborhood pricing context, legal status, and CasaClaro review notation",
    es: "Listados mostrados con contexto de precios de barrio, estado legal y nota de revisión CasaClaro",
  },
  {
    en: "Bilingual listing copy — we write and translate property descriptions from your provided information",
    es: "Contenido bilingüe del listado — redactamos y traducimos las descripciones de propiedad a partir de tu información",
  },
  {
    en: "No subscription fee — partnership is performance-based (contact us for current fee structure)",
    es: "Sin tarifa de suscripción — la alianza se basa en desempeño (contáctanos para la estructura de tarifas actual)",
  },
];

// ─── How to apply ──────────────────────────────────────────────────────────────

const APPLY_STEPS = [
  {
    stepEn: "Submit your partner intake",
    stepEs: "Envía tu solicitud de socio",
    descEn: "Send us your name, company, professional registration number, city or cities where you operate, property types, and a brief description of your practice.",
    descEs: "Envíanos tu nombre, empresa, número de registro profesional, ciudad o ciudades donde operas, tipos de propiedad y una breve descripción de tu actividad.",
  },
  {
    stepEn: "Credential review (3–5 business days)",
    stepEs: "Revisión de credenciales (3–5 días hábiles)",
    descEn: "We verify professional registration, review your existing listings or property portfolio, and confirm compliance with our disclosure and pricing standards.",
    descEs: "Verificamos el registro profesional, revisamos tus listados o cartera de propiedad existentes y confirmamos el cumplimiento con nuestros estándares de revelación y precios.",
  },
  {
    stepEn: "Onboarding call",
    stepEs: "Llamada de incorporación",
    descEn: "A brief call to confirm expectations, data format requirements, and the logistics of how inquiries will be forwarded to you.",
    descEs: "Una breve llamada para confirmar expectativas, requisitos de formato de datos y la logística de cómo se te reenviarán las consultas.",
  },
  {
    stepEn: "First listing activation",
    stepEs: "Activación del primer listado",
    descEn: "Submit your first property with complete documentation and photos. After review and approval, the listing is activated.",
    descEs: "Envía tu primera propiedad con documentación y fotos completas. Tras revisión y aprobación, el listado se activa.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ForAgentsPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale = raw === "es" ? "es" : "en";

  return (
    <div style={{ maxWidth: "var(--max, 1240px)", margin: "0 auto", padding: "40px 20px 100px" }}>

      {/* Page header */}
      <header style={{ marginBottom: "40px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 400,
            color: "var(--ocean, #1f3a4d)",
            margin: "0 0 12px",
            lineHeight: 1.1,
          }}
        >
          {locale === "en" ? "Partner with CasaClaro" : "Sé Socio de CasaClaro"}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1rem", margin: 0, maxWidth: "640px", lineHeight: 1.6, fontFamily: "var(--font-body, system-ui)" }}>
          {locale === "en"
            ? "CasaClaro works with licensed agents, attorneys, property managers, and local operators to connect international buyers and renters with verified Colombian real estate."
            : "CasaClaro trabaja con agentes, abogados, administradores de propiedad y operadores locales habilitados para conectar compradores e inquilinos internacionales con bienes raíces colombianos verificados."}
        </p>
      </header>

      {/* Partner types */}
      <section style={{ marginBottom: "60px" }}>
        <h2
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "1.7rem",
            fontWeight: 400,
            color: "var(--ocean)",
            margin: "0 0 24px",
          }}
        >
          {locale === "en" ? "Who We Work With" : "Con Quiénes Trabajamos"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {PARTNER_TYPES.map((p, i) => (
            <div
              key={i}
              style={{
                padding: "20px",
                background: "var(--card, rgba(255,252,247,0.92))",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm, 18px)",
              }}
            >
              <h3 style={{ fontFamily: "var(--font-body, system-ui)", fontSize: "0.9rem", fontWeight: 700, color: "var(--ocean)", margin: "0 0 8px" }}>
                {locale === "en" ? p.typeEn : p.typeEs}
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--charcoal)", lineHeight: 1.6, margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
                {locale === "en" ? p.descEn : p.descEs}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Partner standards */}
      <section style={{ marginBottom: "60px" }}>
        <h2
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "1.7rem",
            fontWeight: 400,
            color: "var(--ocean)",
            margin: "0 0 24px",
          }}
        >
          {locale === "en" ? "Partner Standards" : "Estándares de Socios"}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {STANDARDS.map((s, i) => (
            <div
              key={i}
              style={{
                padding: "20px 0",
                borderBottom: i < STANDARDS.length - 1 ? "1px solid var(--border)" : "none",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: "var(--terracotta)", fontWeight: 700, fontSize: "1.1rem", flexShrink: 0, marginTop: "2px" }}>→</span>
              <div>
                <h3 style={{ fontFamily: "var(--font-body, system-ui)", fontSize: "0.92rem", fontWeight: 700, color: "var(--ocean)", margin: "0 0 6px" }}>
                  {locale === "en" ? s.titleEn : s.titleEs}
                </h3>
                <p style={{ fontSize: "0.84rem", color: "var(--charcoal)", lineHeight: 1.6, margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
                  {locale === "en" ? s.descEn : s.descEs}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What partners receive */}
      <section style={{ marginBottom: "60px" }}>
        <h2
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "1.7rem",
            fontWeight: 400,
            color: "var(--ocean)",
            margin: "0 0 24px",
          }}
        >
          {locale === "en" ? "What Partners Receive" : "Qué Reciben los Socios"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" }}>
          {BENEFITS.map((b, i) => (
            <div
              key={i}
              style={{
                padding: "16px 18px",
                background: "var(--card, rgba(255,252,247,0.92))",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm, 18px)",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: "var(--emerald-deep, #1f8f59)", fontWeight: 700, fontSize: "1rem", flexShrink: 0, marginTop: "1px" }}>✓</span>
              <p style={{ fontSize: "0.84rem", color: "var(--charcoal)", lineHeight: 1.55, margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
                {locale === "en" ? b.en : b.es}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How to apply */}
      <section style={{ marginBottom: "48px" }}>
        <h2
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "1.7rem",
            fontWeight: 400,
            color: "var(--ocean)",
            margin: "0 0 28px",
          }}
        >
          {locale === "en" ? "How to Apply" : "Cómo Solicitar"}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {APPLY_STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "20px",
                padding: "20px 0",
                borderBottom: i < APPLY_STEPS.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--lagoon, #1f6f78)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-body, system-ui)",
                }}
              >
                {i + 1}
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-body, system-ui)", fontSize: "0.95rem", fontWeight: 700, color: "var(--ocean)", margin: "0 0 6px" }}>
                  {locale === "en" ? step.stepEn : step.stepEs}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--charcoal)", lineHeight: 1.6, margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
                  {locale === "en" ? step.descEn : step.descEs}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact form */}
      <ContactForm type="agent" locale={locale} />

      {/* Disclaimer */}
      <div
        role="note"
        style={{
          marginTop: "32px",
          padding: "14px 18px",
          background: "rgba(241,196,15,0.08)",
          border: "1px solid rgba(241,196,15,0.30)",
          borderRadius: "var(--radius-sm, 18px)",
          fontSize: "0.78rem",
          color: "var(--cacao, #4a2f1d)",
          lineHeight: 1.6,
          fontFamily: "var(--font-body, system-ui)",
        }}
      >
        {locale === "en"
          ? "CasaClaro is a listing and information platform. Acceptance as a partner does not constitute endorsement of any partner's services. Buyers and renters are responsible for independently verifying agent credentials, legal representation, and transaction terms before proceeding."
          : "CasaClaro es una plataforma de listados e información. La aceptación como socio no constituye un respaldo de los servicios del socio. Los compradores e inquilinos son responsables de verificar de forma independiente las credenciales del agente, la representación legal y los términos de la transacción antes de proceder."}
      </div>
    </div>
  );
}
