import { ContactForm } from "@/components/ContactForm";

interface Props {
  params: Promise<{ locale: string }>;
}

// ─── What CasaClaro looks for ──────────────────────────────────────────────────

const CRITERIA = [
  {
    titleEn: "Clear legal title",
    titleEs: "Título legal claro",
    descEn: "Property must have a clean Certificado de Tradición y Libertad with no unresolved liens, encumbrances, or disputed ownership. If there is an active mortgage, it must be disclosed upfront.",
    descEs: "La propiedad debe tener un Certificado de Tradición y Libertad limpio, sin gravámenes, embargos ni disputas de titularidad. Si hay hipoteca activa, debe declararse desde el inicio.",
  },
  {
    titleEn: "Accurate pricing",
    titleEs: "Precio preciso",
    descEn: "We list at market-grounded pricing. Properties significantly above comparable neighborhood comps will be declined or asked to reprice before activation. We provide pricing context as part of review.",
    descEs: "Publicamos a precios con respaldo de mercado. Las propiedades significativamente por encima de comparables de barrio serán rechazadas o se solicitará repricing antes de activación. Brindamos contexto de precios como parte de la revisión.",
  },
  {
    titleEn: "Current cadastral status",
    titleEs: "Estado catastral vigente",
    descEn: "Property tax (predial) must be current. Outstanding municipal balances are a disclosure item. We verify before listing.",
    descEs: "El impuesto predial debe estar al día. Los saldos municipales pendientes son un ítem de revelación. Verificamos antes de publicar.",
  },
  {
    titleEn: "Accurate condition disclosure",
    titleEs: "Revelación precisa del estado",
    descEn: "Known structural, electrical, or plumbing issues must be disclosed. We do not list properties with undisclosed critical defects. Sellers who omit known issues are removed from the platform.",
    descEs: "Los problemas estructurales, eléctricos o hidráulicos conocidos deben revelarse. No publicamos propiedades con defectos críticos no declarados. Los vendedores que omiten problemas conocidos son retirados de la plataforma.",
  },
  {
    titleEn: "Responsive seller",
    titleEs: "Vendedor disponible",
    descEn: "CasaClaro buyers are active and often time-sensitive. Sellers must respond to inquiry pings within 48 hours during active listing. Listings that go dark without notice are paused.",
    descEs: "Los compradores de CasaClaro son activos y frecuentemente tienen prioridades de tiempo. Los vendedores deben responder consultas en 48 horas durante la publicación activa. Los listados sin actividad son pausados.",
  },
];

// ─── Document checklist ────────────────────────────────────────────────────────

const DOCS = [
  {
    labelEn: "Certificado de Tradición y Libertad",
    labelEs: "Certificado de Tradición y Libertad",
    noteEn: "Issued within 90 days — from the Superintendencia de Notariado y Registro",
    noteEs: "Expedido con máximo 90 días de antigüedad — de la Superintendencia de Notariado y Registro",
    required: true,
  },
  {
    labelEn: "Escritura pública (notarized deed)",
    labelEs: "Escritura pública",
    noteEn: "Most recent deed showing current registered ownership",
    noteEs: "Escritura más reciente con la titularidad registrada vigente",
    required: true,
  },
  {
    labelEn: "Predial (property tax) receipt",
    labelEs: "Paz y salvo predial",
    noteEn: "Proof that property tax is current — from the relevant municipality",
    noteEs: "Prueba de que el impuesto predial está al día — del municipio correspondiente",
    required: true,
  },
  {
    labelEn: "Paz y salvo de administración",
    labelEs: "Paz y salvo de administración",
    noteEn: "If property is in a condominium or copropiedad — confirms zero admin balance",
    noteEs: "Si la propiedad está en copropiedad — confirma saldo cero de administración",
    required: false,
  },
  {
    labelEn: "Seller identification",
    labelEs: "Identificación del vendedor",
    noteEn: "Cédula de ciudadanía (nationals) or passport + Cédula de Extranjería (foreign sellers)",
    noteEs: "Cédula de ciudadanía (nacionales) o pasaporte + Cédula de Extranjería (vendedores extranjeros)",
    required: true,
  },
  {
    labelEn: "RUT (DIAN tax registration)",
    labelEs: "RUT (DIAN)",
    noteEn: "Required for sellers with Colombian tax obligations",
    noteEs: "Requerido para vendedores con obligaciones tributarias colombianas",
    required: false,
  },
  {
    labelEn: "Property photos",
    labelEs: "Fotografías de la propiedad",
    noteEn: "Minimum 10 quality photos: living areas, bedrooms, kitchen, bathrooms, building exterior",
    noteEs: "Mínimo 10 fotos de calidad: áreas sociales, habitaciones, cocina, baños, exterior del edificio",
    required: true,
  },
  {
    labelEn: "Floor plan or measured layout (optional but strongly recommended)",
    labelEs: "Plano o distribución medida (opcional pero muy recomendado)",
    noteEn: "Even a rough annotated floor plan significantly increases buyer conversion",
    noteEs: "Incluso un plano anotado aproximado aumenta significativamente la conversión de compradores",
    required: false,
  },
];

// ─── How to submit ─────────────────────────────────────────────────────────────

const SUBMIT_STEPS = [
  {
    stepEn: "Prepare documents",
    stepEs: "Prepara los documentos",
    descEn: "Gather all required documents from the checklist below. Incomplete submissions delay review.",
    descEs: "Reúne todos los documentos requeridos de la lista de verificación. Las solicitudes incompletas retrasan la revisión.",
  },
  {
    stepEn: "Submit via the seller intake form",
    stepEs: "Envía por el formulario de ingreso para vendedores",
    descEn: "Complete the structured intake form linked below. Include property address, asking price, condition disclosure, and contact information.",
    descEs: "Completa el formulario estructurado de ingreso enlazado a continuación. Incluye dirección, precio de venta, revelación del estado y datos de contacto.",
  },
  {
    stepEn: "CasaClaro review (3–5 business days)",
    stepEs: "Revisión CasaClaro (3–5 días hábiles)",
    descEn: "Our team reviews legal status, pricing alignment, and documentation completeness. We may request additional materials or a pricing conversation.",
    descEs: "Nuestro equipo revisa el estado legal, la alineación de precios y la documentación. Podemos solicitar materiales adicionales o una conversación de precios.",
  },
  {
    stepEn: "Activation",
    stepEs: "Activación",
    descEn: "Approved listings are activated with bilingual copy, neighborhood context, and visibility to our buyer and renter network.",
    descEs: "Los listados aprobados se activan con contenido bilingüe, contexto de barrio y visibilidad en nuestra red de compradores e inquilinos.",
  },
  {
    stepEn: "Buyer inquiries and updates",
    stepEs: "Consultas de compradores y actualizaciones",
    descEn: "Qualified buyer inquiries are forwarded to you within 24 hours. You remain responsible for responding and advancing the transaction with your notary and legal team.",
    descEs: "Las consultas de compradores calificados se te reenvían en 24 horas. Eres responsable de responder y avanzar en la transacción con tu notaría y equipo legal.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ForSellersPage({ params }: Props) {
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
          {locale === "en" ? "List Your Property on CasaClaro" : "Publica tu Propiedad en CasaClaro"}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1rem", margin: 0, maxWidth: "640px", lineHeight: 1.6, fontFamily: "var(--font-body, system-ui)" }}>
          {locale === "en"
            ? "CasaClaro connects verified properties with an active bilingual network of buyers, renters, and investors — primarily international clients researching Colombian real estate."
            : "CasaClaro conecta propiedades verificadas con una red bilingüe activa de compradores, arrendatarios e inversores — principalmente clientes internacionales que investigan bienes raíces colombianos."}
        </p>
      </header>

      {/* What we look for */}
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
          {locale === "en" ? "What CasaClaro Looks For" : "Qué Busca CasaClaro"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {CRITERIA.map((c, i) => (
            <div
              key={i}
              style={{
                padding: "20px",
                background: "var(--card, rgba(255,252,247,0.92))",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm, 18px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
                <span style={{ color: "var(--terracotta)", fontWeight: 700, fontSize: "1rem", flexShrink: 0, marginTop: "1px" }}>✓</span>
                <h3 style={{ fontFamily: "var(--font-body, system-ui)", fontSize: "0.9rem", fontWeight: 700, color: "var(--ocean)", margin: 0 }}>
                  {locale === "en" ? c.titleEn : c.titleEs}
                </h3>
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--charcoal)", lineHeight: 1.6, margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
                {locale === "en" ? c.descEn : c.descEs}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Document checklist */}
      <section style={{ marginBottom: "60px" }}>
        <h2
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "1.7rem",
            fontWeight: 400,
            color: "var(--ocean)",
            margin: "0 0 8px",
          }}
        >
          {locale === "en" ? "Document Checklist" : "Lista de Documentos"}
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", margin: "0 0 24px", fontFamily: "var(--font-body, system-ui)", lineHeight: 1.6 }}>
          {locale === "en"
            ? "Required documents must be in hand before submitting. Optional documents improve listing quality and buyer confidence."
            : "Los documentos requeridos deben estar disponibles antes de enviar. Los documentos opcionales mejoran la calidad del listado y la confianza del comprador."}
        </p>

        <div
          style={{
            background: "var(--card, rgba(255,252,247,0.92))",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius, 26px)",
            overflow: "hidden",
          }}
        >
          {DOCS.map((doc, i) => (
            <div
              key={i}
              style={{
                padding: "16px 24px",
                borderBottom: i < DOCS.length - 1 ? "1px solid var(--border)" : "none",
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: doc.required ? "var(--terracotta)" : "var(--muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  color: "#fff",
                  fontWeight: 700,
                  marginTop: "2px",
                  fontFamily: "var(--font-body, system-ui)",
                }}
              >
                {doc.required ? "R" : "O"}
              </span>
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--charcoal)", marginBottom: "3px", fontFamily: "var(--font-body, system-ui)" }}>
                  {locale === "en" ? doc.labelEn : doc.labelEs}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)", lineHeight: 1.5 }}>
                  {locale === "en" ? doc.noteEn : doc.noteEs}
                </div>
              </div>
              <span style={{ marginLeft: "auto", flexShrink: 0, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: doc.required ? "var(--terracotta)" : "var(--muted)", fontFamily: "var(--font-body, system-ui)" }}>
                {doc.required ? (locale === "en" ? "Required" : "Requerido") : (locale === "en" ? "Optional" : "Opcional")}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* How to submit */}
      <section style={{ marginBottom: "60px" }}>
        <h2
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "1.7rem",
            fontWeight: 400,
            color: "var(--ocean)",
            margin: "0 0 28px",
          }}
        >
          {locale === "en" ? "How to Submit" : "Cómo Enviar"}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {SUBMIT_STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "20px",
                padding: "20px 0",
                borderBottom: i < SUBMIT_STEPS.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--ocean)",
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
      <ContactForm type="seller" locale={locale} />

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
          ? "CasaClaro is a listing and information platform. We do not act as a real estate broker or agent. All transactions are conducted directly between buyers, sellers, and their respective legal representatives. Consult a licensed Colombian notary and attorney for title transfer, contract preparation, and closing."
          : "CasaClaro es una plataforma de listados e información. No actuamos como corredor o agente inmobiliario. Todas las transacciones se realizan directamente entre compradores, vendedores y sus representantes legales. Consulta con un notario y abogado colombiano habilitado para transferencia de título, preparación de contratos y cierre."}
      </div>
    </div>
  );
}
