import { Link } from "@/i18n/navigation";
import { CurrencyWidget } from "@/components/CurrencyWidget";
import { fetchFxRate } from "@/lib/fx";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface VisaCard {
  id: string;
  category: string;
  title: { en: string; es: string };
  subhead: { en: string; es: string };
  badgeColor: string;
  threshold: {
    label: { en: string; es: string };
    cop: string;
    copRaw: number;
  } | null;
  summary: { en: string; es: string };
  documents: { en: string[]; es: string[] };
  mustKnow: { en: string[]; es: string[] };
  source: { label: string; url: string };
}

// ─── Visa card data ─────────────────────────────────────────────────────────
// SMLMV 2026: COP 1,750,905 — Decreto 159 de 2026, Diario Oficial No. 53.403

const VISA_CARDS: VisaCard[] = [
  {
    id: "real-estate-investor",
    category: "M-Inversionista (Property)",
    title: {
      en: "Real Estate Investment Visa",
      es: "Visa de Inversión — Propiedad Raíz",
    },
    subhead: {
      en: "For foreign buyers who have purchased Colombian property at or above the required investment threshold.",
      es: "Para compradores extranjeros que han adquirido propiedad raíz igual o superior al umbral de inversión requerido.",
    },
    badgeColor: "var(--terracotta, #e67e22)",
    threshold: {
      label: {
        en: "350 SMLMV — property purchase price must meet or exceed this amount at time of application",
        es: "350 SMLMV — el precio de compra debe ser igual o superior a este monto al momento de la solicitud",
      },
      cop: "COP 612,816,750 (350 × SMLMV 2026)",
      copRaw: 612816750,
    },
    summary: {
      en: "The M-Inversionista visa issued for real estate allows foreign nationals who have purchased Colombian property at or above the 350 SMLMV threshold to qualify for a Migrant visa. The property must be formally registered through Colombia's real estate title system, and the investment must be demonstrably maintained. It is widely used by property buyers across Medellín, Bogotá, Cartagena, and the coast.",
      es: "La visa M-Inversionista emitida por propiedad raíz permite a extranjeros que adquirieron propiedad colombiana igual o superior a 350 SMLMV acceder a una visa tipo Migrante. La propiedad debe estar debidamente registrada y la inversión debe mantenerse vigente. Es ampliamente utilizada por compradores en Medellín, Bogotá, Cartagena y la costa.",
    },
    documents: {
      en: [
        "Valid passport (must be valid for the full visa duration)",
        "Certificado de Tradición y Libertad (title certificate, recent — issued within 90 days)",
        "Proof of purchase price at or above threshold (escritura pública / notarized deed)",
        "Foreign investment registration (DIAN/Banco de la República — critical if using foreign funds)",
        "Private health insurance policy covering Colombia risks",
        "Proof of no criminal record (apostilled, from country of origin)",
        "Completed Cancillería online application form",
        "Visa application fee payment receipt",
      ],
      es: [
        "Pasaporte vigente (debe cubrir la totalidad de la visa solicitada)",
        "Certificado de Tradición y Libertad (vigente — expedido con máximo 90 días de antigüedad)",
        "Prueba del precio de compra igual o superior al umbral (escritura pública)",
        "Registro de inversión extranjera (DIAN/Banco de la República — obligatorio si los fondos provienen del exterior)",
        "Póliza de salud privada con cobertura de riesgos en Colombia",
        "Certificado de antecedentes penales del país de origen (apostillado)",
        "Formulario de solicitud en línea de Cancillería diligenciado",
        "Comprobante de pago de la tarifa de visa",
      ],
    },
    mustKnow: {
      en: [
        "Do not skip foreign investment registration if your funds originated outside Colombia — this is the most common documentation gap that delays or blocks applications.",
        "The threshold is recalculated when Colombia's minimum wage changes. Confirm the current SMLMV value at Cancillería before filing.",
        "Property must be in your name (or in a legally recognized entity) — nominee arrangements are not a substitute.",
        "The Cancillería official page was reviewed by CasaClaro on March 29, 2026 (last reported update: March 18, 2026). Confirm current requirements directly before filing.",
        "Fees vary by nationality and may change. Use Cancillería's official fee checker before payment.",
      ],
      es: [
        "No omitas el registro de inversión extranjera si los fondos provienen del exterior — es el vacío documental más común que retrasa o bloquea solicitudes.",
        "El umbral se recalcula cuando cambia el salario mínimo de Colombia. Confirma el valor SMLMV vigente en Cancillería antes de radicar.",
        "La propiedad debe estar a tu nombre o en una entidad legalmente reconocida — los acuerdos de nombre no son sustitutos válidos.",
        "La página oficial de Cancillería fue revisada por CasaClaro el 29 de marzo de 2026 (última actualización reportada: 18 de marzo de 2026). Confirma los requisitos actuales antes de radicar.",
        "Las tarifas varían por nacionalidad y pueden cambiar. Usa el verificador oficial de Cancillería antes de pagar.",
      ],
    },
    source: {
      label: "Cancillería — Visa M Inversionista",
      url: "https://www.cancilleria.gov.co/tramites_servicios/visas/tipo_visa/migrante/inversionista",
    },
  },
  {
    id: "business-investor",
    category: "M-Inversionista (Business)",
    title: {
      en: "Business Investor Visa",
      es: "Visa Inversionista — Empresarial",
    },
    subhead: {
      en: "For foreign nationals making qualifying direct investments in Colombian businesses or other Cancillería-approved investment categories.",
      es: "Para extranjeros que realizan inversión extranjera directa calificada en empresas colombianas u otras categorías de inversión aprobadas por Cancillería.",
    },
    badgeColor: "var(--lagoon, #1f6f78)",
    threshold: {
      label: {
        en: "350 SMLMV — same threshold as real estate, applied to business investment",
        es: "350 SMLMV — el mismo umbral que propiedad raíz, aplicado a inversión empresarial",
      },
      cop: "COP 612,816,750 (350 × SMLMV 2026)",
      copRaw: 612816750,
    },
    summary: {
      en: "The business variant of the M-Inversionista visa covers qualifying foreign direct investment held in Colombian companies or other Cancillería-approved investment channels. Unlike the real estate path, this route requires ongoing proof that the investment is actively maintained in a qualifying business vehicle — not simply a property title. It is used by entrepreneurs, silent investors, and founders of Colombian entities.",
      es: "La variante empresarial de la visa M-Inversionista cubre la inversión extranjera directa calificada en empresas colombianas u otros canales aprobados por Cancillería. A diferencia de la ruta inmobiliaria, esta vía exige prueba continua de que la inversión se mantiene activa en un vehículo empresarial calificado. Es usada por emprendedores, inversionistas y fundadores de entidades colombianas.",
    },
    documents: {
      en: [
        "Valid passport",
        "Certificate of commercial registration (Cámara de Comercio — recent)",
        "Proof of qualifying investment amount maintained in the business",
        "Foreign investment registration with Banco de la República (mandatory for foreign-sourced capital)",
        "Corporate documents evidencing ownership stake (escritura de constitución, acta, etc.)",
        "Private health insurance covering Colombia",
        "No criminal record certificate (apostilled)",
        "Completed Cancillería online application",
      ],
      es: [
        "Pasaporte vigente",
        "Certificado de matrícula mercantil (Cámara de Comercio — reciente)",
        "Prueba del monto de inversión calificada mantenido en la empresa",
        "Registro de inversión extranjera ante el Banco de la República (obligatorio para capital de origen extranjero)",
        "Documentos societarios que acrediten participación (escritura de constitución, acta, etc.)",
        "Póliza de salud privada con cobertura en Colombia",
        "Certificado de antecedentes penales del país de origen (apostillado)",
        "Formulario de solicitud en línea de Cancillería diligenciado",
      ],
    },
    mustKnow: {
      en: [
        "Foreign investment registration with Banco de la República is non-negotiable if funds came from outside Colombia. Failing to register blocks the visa pathway.",
        "The investment must be demonstrably active and maintained — passive shell companies without ongoing business operations are not reliable vehicles.",
        "Legal counsel is strongly advised before structuring the corporate vehicle. The investment structure affects both the visa qualification and Colombian tax residency implications.",
        "Threshold is tied to minimum wage and changes annually. Verify current SMLMV before filing.",
      ],
      es: [
        "El registro de inversión extranjera ante el Banco de la República es obligatorio si los fondos provienen del exterior. No registrar bloquea el camino de la visa.",
        "La inversión debe estar activa y vigente de forma demostrable — las sociedades inactivas o de fachada no son vehículos confiables.",
        "Se recomienda fuertemente asesoría legal antes de estructurar el vehículo societario. La estructura de inversión afecta tanto la calificación de la visa como las implicaciones de residencia fiscal colombiana.",
        "El umbral está atado al salario mínimo y cambia anualmente. Verifica el SMLMV vigente antes de radicar.",
      ],
    },
    source: {
      label: "Cancillería — Visa M Inversionista",
      url: "https://www.cancilleria.gov.co/tramites_servicios/visas/tipo_visa/migrante/inversionista",
    },
  },
  {
    id: "pensionado",
    category: "M-Pensionado",
    title: {
      en: "Pensioner / Retiree Visa",
      es: "Visa Pensionado / Jubilado",
    },
    subhead: {
      en: "For retirees who can demonstrate recurring pension income from a recognized public or private source.",
      es: "Para jubilados que pueden demostrar ingresos pensionales recurrentes de una fuente pública o privada reconocida.",
    },
    badgeColor: "var(--emerald-deep, #1f8f59)",
    threshold: {
      label: {
        en: "Minimum monthly pension of 3 SMLMV — recurring, documented, from a recognized pension source",
        es: "Pensión mensual mínima de 3 SMLMV — recurrente, documentada, de una fuente pensional reconocida",
      },
      cop: "COP 5,252,715/month (3 × SMLMV 2026)",
      copRaw: 5252715,
    },
    summary: {
      en: "The M-Pensionado visa is designed for foreign retirees who receive a demonstrable recurring pension from a recognized public or private pension system. It allows holders to live long-term in Colombia without the capital threshold required by the investor path. It does not automatically confer access to Colombia's public healthcare system (EPS/SGSSS) unless a bilateral or multilateral agreement applies to the applicant's home country.",
      es: "La visa M-Pensionado está diseñada para jubilados extranjeros que reciben una pensión recurrente y demostrable de un sistema pensional público o privado reconocido. Permite vivir en Colombia a largo plazo sin el umbral de capital requerido por la vía inversionista. No otorga por sí sola acceso al sistema de salud público colombiano (EPS/SGSSS) salvo donde existan acuerdos bilaterales o multilaterales aplicables.",
    },
    documents: {
      en: [
        "Valid passport",
        "Pension certificate confirming the source, amount, and recurring nature of payments (apostilled or consularized)",
        "Bank statements showing recurring pension deposits (typically 3–6 months)",
        "Private health insurance policy covering Colombia — required regardless of origin country",
        "No criminal record certificate (apostilled, from country of origin)",
        "Completed Cancillería online application",
        "Visa application fee payment receipt",
      ],
      es: [
        "Pasaporte vigente",
        "Certificado de pensión que confirme el origen, monto y carácter recurrente de los pagos (apostillado o consularizado)",
        "Extractos bancarios que muestren los depósitos de pensión recurrentes (generalmente 3–6 meses)",
        "Póliza de salud privada con cobertura en Colombia — obligatoria independientemente del país de origen",
        "Certificado de antecedentes penales del país de origen (apostillado)",
        "Formulario de solicitud en línea de Cancillería diligenciado",
        "Comprobante de pago de la tarifa de visa",
      ],
    },
    mustKnow: {
      en: [
        "Healthcare is a first-order issue — the M-Pensionado does not automatically enroll you in Colombia's public health system. Budget for private health insurance from day one.",
        "Many retirees begin with international or prepaid private coverage while assessing longer-term options. For health-complex households, Medellín and Bogotá offer the deepest private specialist networks.",
        "The pension must be from a recognized pension system — income from investments, rental properties, or consulting does not qualify for this specific category.",
        "Threshold is tied to minimum wage (SMLMV) and recalculates annually. Confirm current requirements before filing.",
        "Cancillería official page reviewed by CasaClaro on March 29, 2026 (last reported update: March 18, 2026).",
      ],
      es: [
        "La salud es un tema prioritario — la visa M-Pensionado no te inscribe automáticamente en el sistema de salud público colombiano. Presupuesta seguro de salud privado desde el primer día.",
        "Muchos jubilados comienzan con cobertura internacional o prepagada mientras evalúan opciones a largo plazo. Para hogares con necesidades complejas de salud, Medellín y Bogotá tienen la red privada de especialistas más profunda.",
        "La pensión debe provenir de un sistema pensional reconocido — los ingresos de inversiones, propiedades en arriendo o consultoría no califican para esta categoría específica.",
        "El umbral está atado al salario mínimo (SMLMV) y se recalcula anualmente. Confirma los requisitos actuales antes de radicar.",
        "La página oficial de Cancillería fue revisada por CasaClaro el 29 de marzo de 2026 (última actualización reportada: 18 de marzo de 2026).",
      ],
    },
    source: {
      label: "Cancillería — Visa M Pensionado",
      url: "https://www.cancilleria.gov.co/tramites_servicios/visas/tipo_visa/migrante/pensionado",
    },
  },
  {
    id: "digital-nomad",
    category: "V-Nómada Digital",
    title: {
      en: "Digital Nomad Visa",
      es: "Visa Nómada Digital",
    },
    subhead: {
      en: "A transitional visa for remote workers earning foreign income who want to live in Colombia without a long-term property or residency commitment.",
      es: "Una visa de transición para trabajadores remotos con ingresos extranjeros que quieren vivir en Colombia sin un compromiso de propiedad o residencia a largo plazo.",
    },
    badgeColor: "var(--muted, #6b7280)",
    threshold: {
      label: {
        en: "3 SMLMV per month — minimum income from foreign sources, confirmed by Cancillería (2026)",
        es: "3 SMLMV al mes — ingreso mínimo de fuentes extranjeras, confirmado por Cancillería (2026)",
      },
      cop: "COP 5,252,715/month (3 × SMLMV 2026)",
      copRaw: 5252715,
    },
    summary: {
      en: "The V-Nómada Digital visa is designed for remote workers who earn income from foreign employers or clients while living in Colombia. Qualification is income and documentation dependent — not tied to a property threshold. It is most useful as a transitional visa for remote workers evaluating Medellín, Pereira, Bucaramanga, or Colombia's coast before making a larger property or residency commitment. It does not by itself substitute for independent due diligence on any property purchase.",
      es: "La visa V-Nómada Digital está diseñada para trabajadores remotos que generan ingresos de empleadores o clientes extranjeros mientras viven en Colombia. La calificación depende de ingresos y documentación — no de un umbral inmobiliario. Es más útil como visa de transición para remotos que evalúan Medellín, Pereira, Bucaramanga o la costa colombiana antes de comprometerse con una compra o ruta de residencia mayor.",
    },
    documents: {
      en: [
        "Valid passport",
        "Proof of remote work or freelance engagement — employment contract from foreign employer, or freelance contracts with foreign clients (apostilled or notarized as applicable)",
        "Proof of income meeting the 3 SMLMV monthly threshold — bank statements or pay stubs showing consistent foreign-sourced income (typically last 3 months)",
        "Private health insurance covering Colombia for the duration of the visa",
        "No criminal record certificate (apostilled, from country of residence or origin)",
        "Completed Cancillería online application and applicable fee payment",
      ],
      es: [
        "Pasaporte vigente",
        "Prueba de trabajo remoto o freelance — contrato laboral con empleador extranjero, o contratos de servicios con clientes extranjeros (apostillados o notariados según aplique)",
        "Prueba de ingresos que cumpla el umbral de 3 SMLMV mensual — extractos bancarios o comprobantes de pago con ingresos de fuente extranjera (generalmente los últimos 3 meses)",
        "Póliza de salud privada con cobertura en Colombia durante la vigencia de la visa",
        "Certificado de antecedentes penales del país de residencia u origen (apostillado)",
        "Formulario de solicitud en línea de Cancillería diligenciado y comprobante de pago de tarifa",
      ],
    },
    mustKnow: {
      en: [
        "This visa does not grant a path to permanent residency on its own — if permanent residency is the goal, the investor or pensioner path is typically required.",
        "The published income threshold is 3 SMLMV per month (COP 5,252,715 at 2026 minimum wage), earned from foreign sources. Confirm current requirements with Cancillería before filing.",
        "Treat this as a transitional visa — a way to live legally in Colombia while evaluating longer-term options, not a substitute for the investor visa if you intend to purchase property.",
        "Property purchases made during a digital nomad visa stay do not automatically convert to investor visa qualification — the investment registration process must be completed separately.",
        "Health coverage is required. Confirm that the policy explicitly covers Colombia and meets Cancillería standards before filing.",
        "Cancillería official page reviewed by CasaClaro on March 29, 2026.",
      ],
      es: [
        "Esta visa no otorga por sí sola un camino a la residencia permanente — si ese es el objetivo, generalmente se requiere la ruta inversionista o pensionado.",
        "El umbral de ingresos publicado es de 3 SMLMV al mes (COP 5.252.715 con el salario mínimo 2026), provenientes de fuentes extranjeras. Confirma los requisitos actuales con Cancillería antes de radicar.",
        "Trátala como una visa de transición — una forma de vivir legalmente en Colombia mientras evalúas opciones a largo plazo, no un sustituto de la visa inversionista si piensas comprar propiedad.",
        "Las compras de propiedad realizadas durante una estadía con visa nómada digital no se convierten automáticamente en calificación para la visa inversionista — el proceso de registro de inversión debe completarse por separado.",
        "La cobertura de salud es obligatoria. Confirma que la póliza cubra explícitamente Colombia y cumpla los estándares de Cancillería antes de radicar.",
        "Página oficial de Cancillería revisada por CasaClaro el 29 de marzo de 2026.",
      ],
    },
    source: {
      label: "Cancillería — Visa V Nómada Digital",
      url: "https://www.cancilleria.gov.co/tramites_servicios/visas/tipo_visa/visitante/nomada_digital",
    },
  },
];

// ─── Page component ────────────────────────────────────────────────────────────

interface ResidencyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ResidencyPage({ params }: ResidencyPageProps) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale === "es" ? "es" : "en";
  const fx = await fetchFxRate();

  const lastReviewed = "March 29, 2026";
  const lastReviewedEs = "29 de marzo de 2026";

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
          {locale === "en" ? "Colombia Residency Pathways" : "Rutas de Residencia en Colombia"}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1rem", margin: "0 0 20px", maxWidth: "620px", lineHeight: 1.6 }}>
          {locale === "en"
            ? "Current visa guidance reviewed against official Cancillería sources. Thresholds are tied to Colombia's minimum wage and change when regulations update. Confirm all requirements before filing."
            : "Guía de visas actualizada con fuentes oficiales de Cancillería. Los umbrales están atados al salario mínimo de Colombia y cambian con las regulaciones. Confirma todos los requisitos antes de radicar."}
        </p>

        {/* FX widget — banner variant */}
        <CurrencyWidget initial={fx} locale={locale} variant="banner" />

        {/* Review dates */}
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
            fontSize: "0.78rem",
            color: "var(--muted)",
            fontFamily: "var(--font-body, system-ui)",
          }}
        >
          <span>
            {locale === "en" ? `Content last reviewed: ${lastReviewed}` : `Contenido revisado: ${lastReviewedEs}`}
          </span>
          <span>
            {locale === "en"
              ? "Official Cancillería pages last updated: March 18, 2026"
              : "Páginas oficiales de Cancillería — última actualización reportada: 18 de marzo de 2026"}
          </span>
        </div>
      </header>

      {/* Legal disclaimer */}
      <div
        role="note"
        style={{
          padding: "14px 18px",
          background: "rgba(241,196,15,0.08)",
          border: "1px solid rgba(241,196,15,0.3)",
          borderRadius: "var(--radius-sm, 18px)",
          fontSize: "0.82rem",
          color: "var(--cacao, #4a2f1d)",
          marginBottom: "24px",
          lineHeight: 1.6,
          fontFamily: "var(--font-body, system-ui)",
        }}
      >
        <strong>{locale === "en" ? "⚠ Important" : "⚠ Importante"}:</strong>{" "}
        {locale === "en"
          ? "This guide covers four common pathways and is not a complete list of all Colombian visa categories. Visa requirements, fees, and thresholds change. This is general information, not legal advice. Confirm all requirements directly with Cancillería and consult a licensed Colombian immigration attorney before filing."
          : "Esta guía cubre cuatro rutas comunes y no es una lista completa de todas las categorías de visa colombiana. Los requisitos, tarifas y umbrales cambian. Esta es información general, no asesoría legal. Confirma todos los requisitos directamente con Cancillería y consulta con un abogado de inmigración colombiano habilitado antes de radicar."}
      </div>

      {/* Visa cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {VISA_CARDS.map((card) => (
          <VisaCardBlock key={card.id} card={card} locale={locale} fx={fx} />
        ))}
      </div>

      {/* Common mistakes section */}
      <section style={{ marginTop: "60px" }}>
        <h2
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "1.6rem",
            fontWeight: 400,
            color: "var(--ocean, #1f3a4d)",
            margin: "0 0 24px",
          }}
        >
          {locale === "en" ? "Common Mistakes to Avoid" : "Errores comunes que evitar"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
          {(locale === "en"
            ? [
                "Buying property first, then trying to reverse-engineer the visa strategy.",
                "Relying on outdated internet content — thresholds and labels change when minimum wage updates.",
                "Treating fee screenshots as durable — official schedules change without notice.",
                "Skipping foreign investment registration when the investor path is part of the plan.",
                "Assuming the pensioner visa provides access to Colombia's public health system.",
                "Using a digital nomad visa as a substitute for proper investor visa qualification.",
              ]
            : [
                "Comprar primero y luego intentar diseñar la estrategia de visa de manera retroactiva.",
                "Confiar en contenido desactualizado de internet — los umbrales y etiquetas cambian con el salario mínimo.",
                "Tratar capturas de pantalla de tarifas como definitivas — los programas oficiales cambian sin previo aviso.",
                "Omitir el registro de inversión extranjera cuando la ruta inversionista es parte del plan.",
                "Asumir que la visa pensionado da acceso al sistema de salud público de Colombia.",
                "Usar la visa nómada digital como sustituto de la calificación correcta de visa inversionista.",
              ]
          ).map((mistake, i) => (
            <div
              key={i}
              style={{
                padding: "16px",
                background: "var(--card, rgba(255,252,247,0.92))",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm, 18px)",
                fontSize: "0.85rem",
                color: "var(--charcoal)",
                lineHeight: 1.55,
                fontFamily: "var(--font-body, system-ui)",
              }}
            >
              <span style={{ color: "var(--terracotta)", fontWeight: 700, marginRight: "8px" }}>✗</span>
              {mistake}
            </div>
          ))}
        </div>
      </section>

      {/* Fee checker callout */}
      <div
        style={{
          marginTop: "48px",
          padding: "20px 24px",
          background: "var(--sand, #fff8ef)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius, 26px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-display, Georgia, serif)",
              fontSize: "1.1rem",
              color: "var(--ocean)",
              margin: "0 0 6px",
            }}
          >
            {locale === "en" ? "Always check official fees before filing" : "Siempre verifica las tarifas oficiales antes de radicar"}
          </p>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
            {locale === "en"
              ? "Fees vary by visa type, nationality, and processing office. Use Cancillería's official fee checker — do not rely on third-party estimates."
              : "Las tarifas varían por tipo de visa, nacionalidad y oficina de trámite. Usa el verificador oficial de Cancillería — no confíes en estimaciones de terceros."}
          </p>
        </div>
        <a
          href="https://www.cancilleria.gov.co/tramites_servicios/visas/tarifas"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
          style={{ whiteSpace: "nowrap", flexShrink: 0 }}
        >
          {locale === "en" ? "Cancillería Fee Checker →" : "Verificador de tarifas →"}
        </a>
      </div>

      {/* Exit CTA — listings */}
      <div
        style={{
          marginTop: "40px",
          textAlign: "center",
          padding: "32px 24px",
          background: "var(--card, rgba(255,252,247,0.92))",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius, 26px)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "1.2rem",
            color: "var(--ocean)",
            margin: "0 0 8px",
          }}
        >
          {locale === "en" ? "Looking for a qualifying property?" : "¿Buscas una propiedad calificada?"}
        </p>
        <p
          style={{
            fontSize: "0.88rem",
            color: "var(--muted)",
            margin: "0 0 20px",
            fontFamily: "var(--font-body, system-ui)",
          }}
        >
          {locale === "en"
            ? "Browse vetted listings with pricing context across Colombia's top cities."
            : "Explora listados verificados con contexto de precios en las principales ciudades de Colombia."}
        </p>
        <Link href="/listings" className="btn btn-primary">
          {locale === "en" ? "Browse Vetted Listings →" : "Ver Listados Verificados →"}
        </Link>
      </div>
    </div>
  );
}

// ─── Visa card block ────────────────────────────────────────────────────────────

function VisaCardBlock({
  card,
  locale,
  fx,
}: {
  card: VisaCard;
  locale: "en" | "es";
  fx: { rate: number; source: string };
}) {
  const fxRate = new Intl.NumberFormat(locale === "es" ? "es-CO" : "en-US").format(fx.rate);

  const usdAmount = card.threshold
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(card.threshold.copRaw / fx.rate)
    : null;

  const isMonthly = card.threshold?.cop.includes("/month") || card.threshold?.cop.includes("/mes");

  return (
    <article
      style={{
        background: "var(--card, rgba(255,252,247,0.92))",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius, 26px)",
        overflow: "hidden",
      }}
    >
      {/* Card header */}
      <div
        style={{
          padding: "24px 28px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: card.badgeColor,
              fontFamily: "var(--font-body, system-ui)",
              marginBottom: "8px",
            }}
          >
            {card.category}
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display, Georgia, serif)",
              fontSize: "clamp(1.25rem, 2.5vw, 1.6rem)",
              fontWeight: 400,
              color: "var(--ocean, #1f3a4d)",
              margin: "0 0 8px",
              lineHeight: 1.2,
            }}
          >
            {card.title[locale]}
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: 0, lineHeight: 1.5, fontFamily: "var(--font-body, system-ui)", maxWidth: "560px" }}>
            {card.subhead[locale]}
          </p>
        </div>

        {/* Threshold chip */}
        <div
          style={{
            background: "var(--sand, #fff8ef)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm, 18px)",
            padding: "12px 16px",
            minWidth: "220px",
            flexShrink: 0,
          }}
        >
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 6px", fontFamily: "var(--font-body, system-ui)" }}>
            {locale === "en" ? "Qualifying Threshold" : "Umbral de Calificación"}
          </p>
          {card.threshold ? (
            <>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ocean)", margin: "0 0 4px", fontFamily: "var(--font-body, system-ui)", lineHeight: 1.3 }}>
                {card.threshold.cop}
              </p>
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", margin: "0 0 4px", fontFamily: "var(--font-body, system-ui)" }}>
                ≈ {usdAmount}{isMonthly ? (locale === "en" ? "/month" : "/mes") : ""}
              </p>
              <p style={{ fontSize: "0.72rem", color: "var(--muted)", margin: 0, fontFamily: "var(--font-body, system-ui)", opacity: 0.7 }}>
                {locale === "en" ? `Rate used: 1 USD = COP ${fxRate}` : `Tasa usada: 1 USD = COP ${fxRate}`}
              </p>
            </>
          ) : (
            <p style={{ fontSize: "0.85rem", color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-body, system-ui)", lineHeight: 1.4 }}>
              {locale === "en"
                ? "Income-based — no property threshold. See document requirements."
                : "Basado en ingresos — sin umbral inmobiliario. Ver requisitos de documentación."}
            </p>
          )}
        </div>
      </div>

      {/* Card body — 3 columns */}
      <div
        style={{
          padding: "24px 28px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "28px",
        }}
      >
        {/* Summary */}
        <div>
          <h3 style={{ fontFamily: "var(--font-body, system-ui)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 10px" }}>
            {locale === "en" ? "Overview" : "Resumen"}
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--charcoal)", lineHeight: 1.65, margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
            {card.summary[locale]}
          </p>
        </div>

        {/* Documents */}
        <div>
          <h3 style={{ fontFamily: "var(--font-body, system-ui)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 10px" }}>
            {locale === "en" ? "Key Documents" : "Documentos Clave"}
          </h3>
          <ul style={{ margin: 0, padding: "0 0 0 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {card.documents[locale].map((doc, i) => (
              <li key={i} style={{ fontSize: "0.82rem", color: "var(--charcoal)", lineHeight: 1.5, fontFamily: "var(--font-body, system-ui)" }}>
                {doc}
              </li>
            ))}
          </ul>
        </div>

        {/* Must know */}
        <div>
          <h3 style={{ fontFamily: "var(--font-body, system-ui)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 10px" }}>
            {locale === "en" ? "Must Know" : "Debes Saber"}
          </h3>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            {card.mustKnow[locale].map((item, i) => (
              <li key={i} style={{ display: "flex", gap: "8px", fontSize: "0.82rem", color: "var(--charcoal)", lineHeight: 1.5, fontFamily: "var(--font-body, system-ui)" }}>
                <span style={{ color: "var(--terracotta)", fontWeight: 700, flexShrink: 0, marginTop: "1px" }}>→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card footer — source */}
      <div
        style={{
          padding: "12px 28px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)" }}>
          {locale === "en" ? "Source" : "Fuente"}: {card.source.label}
        </span>
        <a
          href={card.source.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "0.78rem",
            color: "var(--lagoon, #1f6f78)",
            fontWeight: 600,
            textDecoration: "none",
            fontFamily: "var(--font-body, system-ui)",
          }}
        >
          {locale === "en" ? "View official page →" : "Ver página oficial →"}
        </a>
      </div>
    </article>
  );
}
