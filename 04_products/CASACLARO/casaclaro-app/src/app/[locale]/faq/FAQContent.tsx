"use client";

import { useState } from "react";
import { SITE_CONFIG } from "@/config/site.config";

const FAQ_ITEMS = [
  {
    category: { en: "Buying Property", es: "Compra de Propiedad" },
    items: [
      {
        q: { en: "Can foreigners buy property in Colombia?", es: "¿Los extranjeros pueden comprar propiedad en Colombia?" },
        a: {
          en: "Yes. Colombian law grants foreign nationals the same property rights as citizens. You do not need residency or a special visa to purchase real estate. You will need a valid passport and a local account or international wire transfer capability to complete the transaction.",
          es: "Sí. La ley colombiana otorga a los extranjeros los mismos derechos de propiedad que a los ciudadanos. No se requiere residencia ni visa especial para comprar bienes raíces. Necesitarás un pasaporte válido y una cuenta local o capacidad de transferencia internacional para completar la transacción.",
        },
      },
      {
        q: { en: "What are the typical closing costs in Colombia?", es: "¿Cuáles son los costos de cierre típicos en Colombia?" },
        a: {
          en: `Closing costs typically total 3–5% of the purchase price. This includes: notary fees (~${(SITE_CONFIG.notary_fee_pct * 100).toFixed(1)}%), property transfer tax (~${(SITE_CONFIG.transfer_tax_pct * 100).toFixed(1)}%), registry fees (~${(SITE_CONFIG.closing_cost_pct * 100).toFixed(1)}%), and attorney fees (negotiated separately). The buyer and seller typically split certain costs by agreement. Always confirm with your notary before closing.`,
          es: `Los costos de cierre suelen ser el 3–5% del precio de compra. Esto incluye: honorarios notariales (~${(SITE_CONFIG.notary_fee_pct * 100).toFixed(1)}%), impuesto de registro (~${(SITE_CONFIG.transfer_tax_pct * 100).toFixed(1)}%), derechos de registro (~${(SITE_CONFIG.closing_cost_pct * 100).toFixed(1)}%), y honorarios de abogado (negociados por separado). Confirma siempre con tu notario antes del cierre.`,
        },
      },
      {
        q: { en: "Do I need a Colombian bank account to buy property?", es: "¿Necesito una cuenta bancaria colombiana para comprar propiedad?" },
        a: {
          en: "Not strictly required for the purchase itself, but strongly recommended. International wire transfers are accepted at notaries, but a local account simplifies ongoing expenses (utilities, HOA fees, property tax). Opening a Colombian account as a non-resident is possible at several banks and typically requires your passport, proof of address, and income documentation.",
          es: "No es estrictamente obligatorio para la compra en sí, pero es muy recomendable. Las transferencias internacionales son aceptadas en notarías, pero una cuenta local simplifica los gastos continuos (servicios, cuotas de administración, impuesto predial). Abrir una cuenta colombiana como no residente es posible en varios bancos.",
        },
      },
      {
        q: { en: "What is a Certificado de Tradición y Libertad?", es: "¿Qué es un Certificado de Tradición y Libertad?" },
        a: {
          en: "The Certificado de Tradición y Libertad (CTL) is the official property title history document issued by the Superintendencia de Notariado y Registro. It shows the chain of ownership, any mortgages, liens, or legal restrictions on the property. Every CasaClaro listing is reviewed for a clear CTL before listing. You should also request a fresh CTL directly before closing.",
          es: "El Certificado de Tradición y Libertad (CTL) es el documento oficial de historia del título de propiedad emitido por la Superintendencia de Notariado y Registro. Muestra la cadena de propiedad, hipotecas, gravámenes o restricciones legales. Cada listado de CasaClaro es revisado para un CTL limpio antes de publicarse.",
        },
      },
    ],
  },
  {
    category: { en: "Visas & Residency", es: "Visas y Residencia" },
    items: [
      {
        q: { en: "What is the minimum property value to qualify for an investor visa?", es: "¿Cuál es el valor mínimo de propiedad para calificar a una visa de inversionista?" },
        a: {
          en: `To qualify for a Colombian investor visa through real estate, your property purchase must equal or exceed $${SITE_CONFIG.investor_visa_min_usd.toLocaleString()} USD. This threshold is set by Migración Colombia and is subject to change. Always verify current requirements before purchase.`,
          es: `Para calificar a una visa de inversionista colombiana a través de bienes raíces, tu compra debe igualar o superar USD $${SITE_CONFIG.investor_visa_min_usd.toLocaleString()}. Este umbral es establecido por Migración Colombia y puede cambiar.`,
        },
      },
      {
        q: { en: "Can I get residency through a pension income in Colombia?", es: "¿Puedo obtener residencia mediante ingresos de pensión en Colombia?" },
        a: {
          en: `Yes. The pensioner visa (Visa de Pensionado) requires a verified monthly pension income of at least ${SITE_CONFIG.pensioner_visa_smlmv_multiple}x the current SMLMV. In ${SITE_CONFIG.smlmv_year}, the SMLMV is COP ${SITE_CONFIG.smlmv_cop.toLocaleString()}, making the minimum approximately COP ${(SITE_CONFIG.smlmv_cop * SITE_CONFIG.pensioner_visa_smlmv_multiple).toLocaleString()} per month (~USD ${(SITE_CONFIG.smlmv_usd_approx * SITE_CONFIG.pensioner_visa_smlmv_multiple).toLocaleString()}).`,
          es: `Sí. La visa de pensionado requiere un ingreso mensual verificado de al menos ${SITE_CONFIG.pensioner_visa_smlmv_multiple} veces el SMLMV. En ${SITE_CONFIG.smlmv_year}, el SMLMV es COP ${SITE_CONFIG.smlmv_cop.toLocaleString()}, lo que hace el mínimo aproximadamente COP ${(SITE_CONFIG.smlmv_cop * SITE_CONFIG.pensioner_visa_smlmv_multiple).toLocaleString()} por mes.`,
        },
      },
      {
        q: { en: "How long can I stay in Colombia as a tourist?", es: "¿Cuánto tiempo puedo permanecer en Colombia como turista?" },
        a: {
          en: "Most nationalities receive 90 days upon entry, with the option to request a one-time 90-day extension from Migración Colombia — for a maximum of 180 days per calendar year. Overstaying results in fines and potential entry bans. If you plan to stay longer, explore visa options before your tourist period expires.",
          es: "La mayoría de las nacionalidades reciben 90 días al ingresar, con opción de solicitar una prórroga de 90 días — máximo 180 días por año calendario. Permanecer más tiempo genera multas y posibles prohibiciones de entrada.",
        },
      },
    ],
  },
  {
    category: { en: "Renting", es: "Arriendos" },
    items: [
      {
        q: { en: "What documents do landlords typically require from foreign renters?", es: "¿Qué documentos solicitan los arrendadores a los inquilinos extranjeros?" },
        a: {
          en: "Most landlords require: a valid passport, proof of legal stay in Colombia, 3 months of bank statements or income proof, and sometimes a Colombian guarantor (fiador) or deposit (usually 1–3 months). Furnished short-term rentals typically have fewer requirements than long-term unfurnished leases.",
          es: "La mayoría de arrendadores requieren: pasaporte válido, prueba de estadía legal en Colombia, 3 meses de extractos bancarios o comprobante de ingresos, y a veces un fiador colombiano o depósito equivalente (generalmente 1–3 meses).",
        },
      },
      {
        q: { en: "Are short-term rentals (Airbnb-style) legal in Colombia?", es: "¿Son legales los arriendos de corto plazo (estilo Airbnb) en Colombia?" },
        a: {
          en: "Short-term rentals are legal in Colombia but subject to building-level rules. Many residential buildings (propiedad horizontal) prohibit them in their internal regulations. CasaClaro's vetting process checks whether a property's HOA rules permit short-term rental before listing.",
          es: "Los arriendos de corto plazo son legales en Colombia pero sujetos a las normas del edificio. Muchos edificios residenciales los prohíben en su reglamento interno. El proceso de verificación de CasaClaro revisa si el reglamento permite arriendos de corto plazo antes de publicar.",
        },
      },
    ],
  },
  {
    category: { en: "CasaClaro Platform", es: "Plataforma CasaClaro" },
    items: [
      {
        q: { en: "What does it mean for a listing to be 'vetted'?", es: "¿Qué significa que un listado esté 'verificado'?" },
        a: {
          en: "CasaClaro's vetting process reviews: the Certificado de Tradición y Libertad, asking price against comparable market data, HOA rules for rental restrictions, and basic condition disclosure from the seller. Fully vetted listings also include a physical inspection. Vetting is not a legal opinion — always engage a licensed Colombian attorney for your due diligence.",
          es: "El proceso de verificación de CasaClaro revisa: el CTL, el precio frente a comparables de mercado, reglamento de propiedad horizontal, y revelación básica de condición. Los listados completamente verificados también incluyen inspección física. La verificación no es una opinión legal.",
        },
      },
      {
        q: { en: "Is CasaClaro a real estate brokerage?", es: "¿Es CasaClaro una agencia inmobiliaria?" },
        a: {
          en: "No. CasaClaro is a listing and information platform — not a licensed real estate brokerage or agent. We do not represent buyers or sellers in any transaction. All transactions are conducted directly between parties and their legal representatives.",
          es: "No. CasaClaro es una plataforma de listados e información — no una agencia ni agente inmobiliario con licencia. No representamos a compradores ni vendedores en ninguna transacción.",
        },
      },
      {
        q: { en: "How do I get my property listed on CasaClaro?", es: "¿Cómo puedo publicar mi propiedad en CasaClaro?" },
        a: {
          en: "Start by completing the seller intake form on our For Sellers page. We review all submissions for eligibility, title clarity, and pricing alignment before accepting a listing. The review process typically takes 3–5 business days.",
          es: "Comienza completando el formulario de ingreso de vendedores en nuestra página Para Vendedores. Revisamos todas las solicitudes por elegibilidad, título claro y alineación de precios. El proceso tarda generalmente 3–5 días hábiles.",
        },
      },
      {
        q: { en: "How current is the data on CasaClaro?", es: "¿Qué tan actualizada está la información en CasaClaro?" },
        a: {
          en: `Listing data is updated as properties are reviewed and onboarded. Regulatory data (visa requirements, SMLMV, tax rates) was last audited on ${SITE_CONFIG.data_reviewed_date}. If you notice outdated information, email us at ${SITE_CONFIG.contact_email}.`,
          es: `Los datos de listados se actualizan a medida que las propiedades son incorporadas. Los datos regulatorios fueron auditados por última vez el ${SITE_CONFIG.data_reviewed_date}. Si detectas información desactualizada, escríbenos a ${SITE_CONFIG.contact_email}.`,
        },
      },
    ],
  },
];

function FAQItem({ q, a, locale }: { q: { en: string; es: string }; a: { en: string; es: string }; locale: "en" | "es" }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(31,58,77,0.08)", paddingBottom: open ? "20px" : "0" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          textAlign: "left",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "20px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          fontFamily: "var(--font-body, system-ui)",
        }}
      >
        <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--ocean, #1f3a4d)", lineHeight: 1.45 }}>
          {locale === "en" ? q.en : q.es}
        </span>
        <span
          style={{
            color: "var(--terracotta, #e67e22)",
            fontSize: "1.1rem",
            fontWeight: 400,
            flexShrink: 0,
            transition: "transform 0.2s",
            transform: open ? "rotate(45deg)" : "none",
            display: "inline-block",
          }}
        >
          +
        </span>
      </button>
      {open && (
        <p style={{ fontSize: "0.88rem", lineHeight: 1.75, color: "rgba(31,58,77,0.7)", margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
          {locale === "en" ? a.en : a.es}
        </p>
      )}
    </div>
  );
}

export function FAQContent({ locale }: { locale: "en" | "es" }) {
  const isEn = locale === "en";

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 20px 100px" }}>
      <header style={{ marginBottom: "56px", textAlign: "center" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--terracotta, #e67e22)", margin: "0 0 14px", fontFamily: "var(--font-body, system-ui)" }}>
          {isEn ? "Help & Guidance" : "Ayuda y Orientación"}
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 400,
            color: "var(--ocean, #1f3a4d)",
            margin: "0 0 16px",
            lineHeight: 1.2,
          }}
        >
          {isEn ? "Frequently Asked Questions" : "Preguntas Frecuentes"}
        </h1>
        <p style={{ color: "var(--muted, #6b7280)", fontSize: "1rem", margin: 0, lineHeight: 1.6, maxWidth: "520px", marginLeft: "auto", marginRight: "auto", fontFamily: "var(--font-body, system-ui)" }}>
          {isEn
            ? "Answers to common questions about buying, renting, and relocating to Colombia."
            : "Respuestas a preguntas comunes sobre comprar, arrendar y reubicarse en Colombia."}
        </p>
      </header>

      {FAQ_ITEMS.map((section) => (
        <section key={section.category.en} style={{ marginBottom: "48px" }}>
          <h2
            style={{
              fontFamily: "var(--font-display, Georgia, serif)",
              fontSize: "1.25rem",
              fontWeight: 400,
              color: "var(--ocean, #1f3a4d)",
              margin: "0 0 4px",
              paddingBottom: "12px",
              borderBottom: "2px solid var(--terracotta, #e67e22)",
              display: "inline-block",
            }}
          >
            {isEn ? section.category.en : section.category.es}
          </h2>
          <div>
            {section.items.map((item) => (
              <FAQItem key={item.q.en} q={item.q} a={item.a} locale={locale} />
            ))}
          </div>
        </section>
      ))}

      <div
        style={{
          background: "var(--ocean, #1f3a4d)",
          borderRadius: "24px",
          padding: "40px",
          textAlign: "center",
          marginTop: "64px",
        }}
      >
        <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.4rem", fontWeight: 400, color: "var(--cream, #fdf5e6)", margin: "0 0 12px" }}>
          {isEn ? "Still have questions?" : "¿Todavía tienes preguntas?"}
        </h2>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.88rem", margin: "0 0 24px", fontFamily: "var(--font-body, system-ui)" }}>
          {isEn ? "Our team responds within 24–48 hours on business days." : "Nuestro equipo responde en 24–48 horas en días hábiles."}
        </p>
        <a
          href={`mailto:${SITE_CONFIG.contact_email}`}
          style={{
            display: "inline-block",
            padding: "12px 28px",
            background: "var(--terracotta, #e67e22)",
            color: "white",
            borderRadius: "999px",
            fontWeight: 600,
            fontSize: "0.88rem",
            textDecoration: "none",
            fontFamily: "var(--font-body, system-ui)",
          }}
        >
          {isEn ? `Email ${SITE_CONFIG.contact_email}` : `Escribir a ${SITE_CONFIG.contact_email}`}
        </a>
      </div>

      <p style={{ fontSize: "0.72rem", color: "rgba(31,58,77,0.4)", marginTop: "40px", lineHeight: 1.6, fontFamily: "var(--font-body, system-ui)" }}>
        {isEn
          ? "Information on this page is for general guidance only and does not constitute legal, financial, or immigration advice. Regulations change — verify all requirements with qualified Colombian legal counsel before acting."
          : "La información de esta página es solo orientación general y no constituye asesoría legal, financiera o migratoria. Las regulaciones cambian — verifica todos los requisitos con un abogado colombiano calificado antes de actuar."}
      </p>
    </div>
  );
}
