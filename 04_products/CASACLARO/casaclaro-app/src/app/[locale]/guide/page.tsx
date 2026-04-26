import { Link } from "@/i18n/navigation";

interface Props {
  params: Promise<{ locale: string }>;
}

// ─── Guide sections ────────────────────────────────────────────────────────────

const BUY_STEPS = [
  {
    stepEn: "Research and city selection",
    stepEs: "Investigación y selección de ciudad",
    descEn: "Start with city comparison: Medellín for climate and yield, Bogotá for healthcare and business depth, Cartagena for tourism-driven short-term rental income. Confirm your visa pathway alongside your property strategy — do not buy first and plan residency second.",
    descEs: "Comienza con la comparación de ciudades: Medellín por clima y rentabilidad, Bogotá por salud y negocios, Cartagena por ingresos de arriendo de corto plazo impulsados por turismo. Confirma tu ruta de visa junto con tu estrategia de propiedad — no compres primero y planifiques residencia después.",
  },
  {
    stepEn: "Appoint a Colombian real estate attorney",
    stepEs: "Designa un abogado inmobiliario colombiano",
    descEn: "This is not optional. Your attorney reviews the Certificado de Tradición y Libertad, checks for liens and disputes, verifies seller authority, and prepares or reviews the promesa de compraventa (purchase promise agreement). Foreign buyers should appoint counsel before signing anything.",
    descEs: "Esto no es opcional. Tu abogado revisa el Certificado de Tradición y Libertad, verifica gravámenes y disputas, confirma la autoridad del vendedor y prepara o revisa la promesa de compraventa. Los compradores extranjeros deben designar asesor legal antes de firmar cualquier documento.",
  },
  {
    stepEn: "Due diligence on the property",
    stepEs: "Diligencia debida de la propiedad",
    descEn: "Key checks: Certificado de Tradición y Libertad (title chain, clean title, no encumbrances), predial (property tax) current status, paz y salvo de administración (if in a copropiedad), physical inspection for structural and systems issues.",
    descEs: "Verificaciones clave: Certificado de Tradición y Libertad (cadena de título, título limpio, sin gravámenes), estado actual del predial, paz y salvo de administración (si es copropiedad), inspección física de problemas estructurales y de instalaciones.",
  },
  {
    stepEn: "Foreign investment registration",
    stepEs: "Registro de inversión extranjera",
    descEn: "If your funds originate outside Colombia, registration with DIAN and Banco de la República is mandatory before or concurrent with the transaction. This step is the most frequently missed by foreign buyers and blocks the investor visa pathway if omitted.",
    descEs: "Si tus fondos provienen del exterior, el registro ante la DIAN y el Banco de la República es obligatorio antes o durante la transacción. Este paso es el que más frecuentemente omiten los compradores extranjeros y bloquea la ruta de visa inversionista si se omite.",
  },
  {
    stepEn: "Promesa de compraventa (purchase promise agreement)",
    stepEs: "Promesa de compraventa",
    descEn: "A legally binding bilateral contract that sets the agreed price, conditions, timeline, and penalties for withdrawal. Typically 10% earnest money. Must be in writing. Do not sign without attorney review.",
    descEs: "Un contrato bilateral legalmente vinculante que establece el precio acordado, condiciones, plazos y penalizaciones por desistimiento. Generalmente 10% de arras. Debe ser por escrito. No firmes sin revisión de abogado.",
  },
  {
    stepEn: "Notarial closing (escrituración pública)",
    stepEs: "Cierre notarial (escrituración pública)",
    descEn: "The final deed transfer occurs before a Colombian notary (notaría). Both parties must be present or have a power of attorney (poder notarial) on file. The escritura pública is the legally recognized title transfer instrument in Colombia.",
    descEs: "La transferencia final de escritura ocurre ante una notaría colombiana. Ambas partes deben estar presentes o tener un poder notarial vigente. La escritura pública es el instrumento de transferencia de título legalmente reconocido en Colombia.",
  },
  {
    stepEn: "Registration with Oficina de Registro",
    stepEs: "Registro en Oficina de Registro",
    descEn: "After notarial signing, the deed must be registered at the Oficina de Registro de Instrumentos Públicos. Until registered, the transfer is not complete for legal purposes.",
    descEs: "Tras la firma notarial, la escritura debe registrarse en la Oficina de Registro de Instrumentos Públicos. Hasta el registro, la transferencia no está completa para efectos legales.",
  },
];

const CLOSING_COSTS = [
  {
    itemEn: "Notary fees (gastos notariales)",
    itemEs: "Gastos notariales",
    rangeEn: "~0.54% of declared value — split equally between buyer and seller",
    rangeEs: "~0.54% del valor declarado — dividido en partes iguales entre comprador y vendedor",
  },
  {
    itemEn: "Registration tax (impuesto de registro)",
    itemEs: "Impuesto de registro",
    rangeEn: "~1% of declared value — typically buyer",
    rangeEs: "~1% del valor declarado — generalmente a cargo del comprador",
  },
  {
    itemEn: "Retention at source (retención en la fuente)",
    itemEs: "Retención en la fuente",
    rangeEn: "1–2.5% of sale price — typically seller obligation",
    rangeEs: "1–2.5% del precio de venta — generalmente obligación del vendedor",
  },
  {
    itemEn: "Authentications and certifications",
    itemEs: "Autenticaciones y certificaciones",
    rangeEn: "COP 50,000–200,000 per document — varies",
    rangeEs: "COP 50.000–200.000 por documento — varía",
  },
  {
    itemEn: "Attorney fees",
    itemEs: "Honorarios del abogado",
    rangeEn: "Negotiated — typically 1–2% of transaction value for full service",
    rangeEs: "Negociados — generalmente 1–2% del valor de la transacción para servicio completo",
  },
  {
    itemEn: "DIAN / Banco de la República registration (foreign buyers)",
    itemEs: "Registro DIAN / Banco de la República (compradores extranjeros)",
    rangeEn: "Administrative fees only — mandatory for foreign-sourced funds",
    rangeEs: "Solo tarifas administrativas — obligatorio para fondos de origen extranjero",
  },
  {
    itemEn: "Total buyer-side closing costs (indicative)",
    itemEs: "Total costos de cierre del comprador (indicativo)",
    rangeEn: "3–5% of purchase price (Medellín/Bogotá ~4.2%; Cartagena ~4.5%)",
    rangeEs: "3–5% del precio de compra (Medellín/Bogotá ~4.2%; Cartagena ~4.5%)",
    highlight: true,
  },
];

const RENTAL_STEPS = [
  {
    stepEn: "Define your rental type",
    stepEs: "Define tu tipo de arriendo",
    descEn: "Long-term (12-month standard lease under Law 820/2003) vs. short-term (platforms like Airbnb — requires RNT registration in most cities). Short-term yields are higher but management-intensive and increasingly regulated.",
    descEs: "Largo plazo (contrato estándar de 12 meses bajo Ley 820/2003) vs. corto plazo (plataformas como Airbnb — requiere registro RNT en la mayoría de ciudades). Los arriendos de corto plazo generan mayor rendimiento pero son intensivos en gestión y cada vez más regulados.",
  },
  {
    stepEn: "Lease contract",
    stepEs: "Contrato de arriendo",
    descEn: "Long-term leases must comply with Law 820/2003. Key terms: monthly rent, deposit (typically 1 month), maintenance responsibilities, lease term, and renewal conditions. Verbal leases are legally valid but strongly inadvisable.",
    descEs: "Los arriendos de largo plazo deben cumplir con la Ley 820/2003. Términos clave: canon mensual, depósito (generalmente 1 mes), responsabilidades de mantenimiento, plazo y condiciones de renovación. Los contratos verbales son válidos pero fuertemente desaconsejados.",
  },
  {
    stepEn: "RNT registration for short-term",
    stepEs: "Registro RNT para corto plazo",
    descEn: "Registro Nacional de Turismo (RNT) is required for properties rented through tourism platforms. Cartagena adds a 1% per-night tourism tax. Bogotá requires municipal short-term rental permits in specific neighborhoods.",
    descEs: "El Registro Nacional de Turismo (RNT) es requerido para propiedades en plataformas de turismo. Cartagena añade impuesto turístico del 1% por noche. Bogotá exige permisos municipales en barrios específicos.",
  },
];

const COMMON_MISTAKES = [
  {
    en: "Buying property before confirming the visa pathway and investment registration requirements.",
    es: "Comprar propiedad antes de confirmar la ruta de visa y los requisitos de registro de inversión.",
  },
  {
    en: "Signing the promesa de compraventa without attorney review.",
    es: "Firmar la promesa de compraventa sin revisión legal.",
  },
  {
    en: "Skipping foreign investment registration with DIAN/Banco de la República when funds come from outside Colombia.",
    es: "Omitir el registro de inversión extranjera ante la DIAN/Banco de la República cuando los fondos provienen del exterior.",
  },
  {
    en: "Buying in a copropiedad without reviewing the reglamento de copropiedad and checking the paz y salvo de administración.",
    es: "Comprar en copropiedad sin revisar el reglamento y sin verificar el paz y salvo de administración.",
  },
  {
    en: "Relying on the escritura alone without completing the Oficina de Registro step — the transfer is incomplete without registration.",
    es: "Confiar solo en la escritura sin completar el paso de la Oficina de Registro — la transferencia está incompleta sin registro.",
  },
  {
    en: "Assuming the declared value (valor declarado) in the escritura equals market value — this has DIAN and tax implications.",
    es: "Asumir que el valor declarado en la escritura equivale al valor de mercado — esto tiene implicaciones tributarias ante la DIAN.",
  },
  {
    en: "Starting short-term rentals without RNT registration — this creates legal exposure and may void insurance coverage.",
    es: "Iniciar arriendos de corto plazo sin registro RNT — esto crea exposición legal y puede anular la cobertura del seguro.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function GuidePage({ params }: Props) {
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
          {locale === "en" ? "Colombia Property Guide" : "Guía de Propiedad en Colombia"}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1rem", margin: 0, maxWidth: "640px", lineHeight: 1.6, fontFamily: "var(--font-body, system-ui)" }}>
          {locale === "en"
            ? "Step-by-step guidance for buying and renting property in Colombia — process, documents, closing costs, and common mistakes for foreign buyers."
            : "Guía paso a paso para comprar y arrendar propiedad en Colombia — proceso, documentos, costos de cierre y errores comunes para compradores extranjeros."}
        </p>
      </header>

      {/* Legal disclaimer */}
      <div
        role="note"
        style={{
          padding: "14px 18px",
          background: "rgba(241,196,15,0.08)",
          border: "1px solid rgba(241,196,15,0.30)",
          borderRadius: "var(--radius-sm, 18px)",
          fontSize: "0.82rem",
          color: "var(--cacao, #4a2f1d)",
          marginBottom: "48px",
          lineHeight: 1.6,
          fontFamily: "var(--font-body, system-ui)",
        }}
      >
        <strong>{locale === "en" ? "Important" : "Importante"}:</strong>{" "}
        {locale === "en"
          ? "This is general information, not legal advice. Colombian property law, tax rates, and regulations change. Confirm all requirements with Cancillería and a licensed Colombian attorney before proceeding with any transaction."
          : "Esta es información general, no asesoría legal. El derecho inmobiliario colombiano, las tasas tributarias y las regulaciones cambian. Confirma todos los requisitos con Cancillería y un abogado colombiano habilitado antes de proceder con cualquier transacción."}
      </div>

      {/* Buying process */}
      <section style={{ marginBottom: "60px" }}>
        <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.7rem", fontWeight: 400, color: "var(--ocean)", margin: "0 0 28px" }}>
          {locale === "en" ? "The Buying Process" : "El Proceso de Compra"}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {BUY_STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "20px",
                padding: "22px 0",
                borderBottom: i < BUY_STEPS.length - 1 ? "1px solid var(--border)" : "none",
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
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-body, system-ui)",
                  marginTop: "2px",
                }}
              >
                {i + 1}
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-body, system-ui)", fontSize: "0.95rem", fontWeight: 700, color: "var(--ocean)", margin: "0 0 6px" }}>
                  {locale === "en" ? step.stepEn : step.stepEs}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--charcoal)", lineHeight: 1.65, margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
                  {locale === "en" ? step.descEn : step.descEs}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closing costs */}
      <section style={{ marginBottom: "60px" }}>
        <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.7rem", fontWeight: 400, color: "var(--ocean)", margin: "0 0 8px" }}>
          {locale === "en" ? "Closing Costs" : "Costos de Cierre"}
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", margin: "0 0 24px", fontFamily: "var(--font-body, system-ui)", lineHeight: 1.6 }}>
          {locale === "en"
            ? "Costs below are indicative and vary by declared value, municipality, and transaction specifics. Confirm with your notary and attorney before closing."
            : "Los costos a continuación son indicativos y varían por valor declarado, municipio y detalles de la transacción. Confirma con tu notaría y abogado antes del cierre."}
        </p>
        <div
          style={{
            background: "var(--card, rgba(255,252,247,0.92))",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius, 26px)",
            overflow: "hidden",
          }}
        >
          {CLOSING_COSTS.map((row, i) => (
            <div
              key={i}
              style={{
                padding: "14px 24px",
                borderBottom: i < CLOSING_COSTS.length - 1 ? "1px solid var(--border)" : "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "20px",
                background: row.highlight ? "rgba(31,58,77,0.04)" : "transparent",
              }}
            >
              <span
                style={{
                  fontSize: row.highlight ? "0.9rem" : "0.85rem",
                  fontWeight: row.highlight ? 700 : 500,
                  color: "var(--charcoal)",
                  fontFamily: "var(--font-body, system-ui)",
                  lineHeight: 1.4,
                }}
              >
                {locale === "en" ? row.itemEn : row.itemEs}
              </span>
              <span
                style={{
                  fontSize: row.highlight ? "0.9rem" : "0.82rem",
                  fontWeight: row.highlight ? 700 : 500,
                  color: row.highlight ? "var(--terracotta)" : "var(--ocean)",
                  fontFamily: "var(--font-body, system-ui)",
                  textAlign: "right",
                  flexShrink: 0,
                  maxWidth: "280px",
                  lineHeight: 1.4,
                }}
              >
                {locale === "en" ? row.rangeEn : row.rangeEs}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Renting */}
      <section style={{ marginBottom: "60px" }}>
        <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.7rem", fontWeight: 400, color: "var(--ocean)", margin: "0 0 28px" }}>
          {locale === "en" ? "Renting in Colombia" : "Arrendar en Colombia"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {RENTAL_STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                padding: "20px",
                background: "var(--card, rgba(255,252,247,0.92))",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm, 18px)",
              }}
            >
              <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--terracotta)", marginBottom: "8px", fontFamily: "var(--font-body, system-ui)" }}>
                {locale === "en" ? `Step ${i + 1}` : `Paso ${i + 1}`}
              </div>
              <h3 style={{ fontFamily: "var(--font-body, system-ui)", fontSize: "0.92rem", fontWeight: 700, color: "var(--ocean)", margin: "0 0 8px" }}>
                {locale === "en" ? step.stepEn : step.stepEs}
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--charcoal)", lineHeight: 1.6, margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
                {locale === "en" ? step.descEn : step.descEs}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Common mistakes */}
      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.7rem", fontWeight: 400, color: "var(--ocean)", margin: "0 0 24px" }}>
          {locale === "en" ? "Common Mistakes to Avoid" : "Errores Comunes que Evitar"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
          {COMMON_MISTAKES.map((m, i) => (
            <div
              key={i}
              style={{
                padding: "16px",
                background: "var(--card, rgba(255,252,247,0.92))",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm, 18px)",
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: "var(--terracotta)", fontWeight: 700, fontSize: "0.95rem", flexShrink: 0, marginTop: "1px" }}>✗</span>
              <p style={{ fontSize: "0.82rem", color: "var(--charcoal)", lineHeight: 1.55, margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
                {locale === "en" ? m.en : m.es}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        <div
          style={{
            padding: "24px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius, 26px)",
            textAlign: "center",
          }}
        >
          <p style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1rem", color: "var(--ocean)", margin: "0 0 8px" }}>
            {locale === "en" ? "Browse current listings" : "Ver listados actuales"}
          </p>
          <Link href="/listings" className="btn btn-primary">
            {locale === "en" ? "View Listings →" : "Ver Listados →"}
          </Link>
        </div>
        <div
          style={{
            padding: "24px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius, 26px)",
            textAlign: "center",
          }}
        >
          <p style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1rem", color: "var(--ocean)", margin: "0 0 8px" }}>
            {locale === "en" ? "Visa and residency guide" : "Guía de visas y residencia"}
          </p>
          <Link href="/residency" className="btn btn-secondary">
            {locale === "en" ? "Residency Guide →" : "Guía de Residencia →"}
          </Link>
        </div>
        <div
          style={{
            padding: "24px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius, 26px)",
            textAlign: "center",
          }}
        >
          <p style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1rem", color: "var(--ocean)", margin: "0 0 8px" }}>
            {locale === "en" ? "Compare city costs" : "Comparar costos por ciudad"}
          </p>
          <Link href="/cost-simulator" className="btn btn-secondary">
            {locale === "en" ? "Cost Simulator →" : "Simulador de Costos →"}
          </Link>
        </div>
      </div>
    </div>
  );
}
