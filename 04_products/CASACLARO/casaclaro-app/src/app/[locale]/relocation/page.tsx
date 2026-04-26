import { Link } from "@/i18n/navigation";
import { EmailCapture } from "@/components/EmailCapture";

interface Props {
  params: Promise<{ locale: string }>;
}

// ─── City cards — condensed for hub use (full detail at /cities) ──────────────

const CITY_PICKS = [
  {
    slug: "medellin",
    name: "Medellín",
    tagline: { en: "City of Eternal Spring", es: "Ciudad de la Eterna Primavera" },
    suitability: 9.2,
    costOfLiving: "$1,200–1,800/mo",
    climate: { en: "Spring-like, 22°C year-round", es: "Primaveral, 22°C todo el año" },
    bestFor: { en: "Digital nomads, retirees, property investors targeting yield", es: "Nómadas digitales, jubilados, inversores que buscan rentabilidad" },
    color: "var(--terracotta, #e67e22)",
  },
  {
    slug: "bogota",
    name: "Bogotá",
    tagline: { en: "The Andean Capital", es: "La Capital Andina" },
    suitability: 8.4,
    costOfLiving: "$1,400–2,200/mo",
    climate: { en: "Cool year-round, 13–18°C", es: "Fresco todo el año, 13–18°C" },
    bestFor: { en: "Business operators, culture seekers, complex healthcare needs", es: "Empresarios, amantes de la cultura, necesidades médicas complejas" },
    color: "var(--ocean, #1f3a4d)",
  },
  {
    slug: "cartagena",
    name: "Cartagena",
    tagline: { en: "Jewel of the Caribbean", es: "Joya del Caribe" },
    suitability: 7.8,
    costOfLiving: "$1,500–2,500/mo",
    climate: { en: "Tropical, 29°C+ year-round", es: "Tropical, 29°C+ todo el año" },
    bestFor: { en: "Short-term rental investors, coastal lifestyle, retirees who prefer heat", es: "Inversores STR, estilo de vida costero, jubilados que prefieren el calor" },
    color: "var(--lagoon, #1f6f78)",
  },
];

// ─── Visa quick reference — abbreviated (full guide at /residency) ─────────────
// SMLMV 2026: COP 1,750,905 — Decreto 159 de 2026

const VISA_QUICK = [
  {
    type: "V-Nómada Digital",
    key: { en: "3 SMLMV/month foreign income", es: "3 SMLMV/mes ingreso extranjero" },
    amount: "~$1,281/mo",
    duration: { en: "Up to 2 years", es: "Hasta 2 años" },
    note: { en: "No direct path to residency", es: "Sin ruta directa a residencia" },
    color: "var(--emerald-deep, #1f8f59)",
  },
  {
    type: "M-Inversionista",
    key: { en: "350 SMLMV minimum property value", es: "Propiedad mínima 350 SMLMV" },
    amount: "~$149,467",
    duration: { en: "3 years renewable", es: "3 años renovable" },
    note: { en: "Path to R-Residente after 5 years", es: "Ruta a R-Residente tras 5 años" },
    color: "var(--terracotta, #e67e22)",
  },
  {
    type: "M-Pensionado",
    key: { en: "3 SMLMV/month pension income", es: "Pensión de 3 SMLMV/mes" },
    amount: "~$1,281/mo",
    duration: { en: "3 years renewable", es: "3 años renovable" },
    note: { en: "Path to R-Residente after 5 years", es: "Ruta a R-Residente tras 5 años" },
    color: "var(--ocean, #1f3a4d)",
  },
  {
    type: "V-Rentista",
    key: { en: "10 SMLMV/month passive income", es: "10 SMLMV/mes ingreso pasivo" },
    amount: "~$4,270/mo",
    duration: { en: "Up to 2 years", es: "Hasta 2 años" },
    note: { en: "Visitor visa category", es: "Categoría visa de visitante" },
    color: "var(--lagoon, #1f6f78)",
  },
];

// ─── Pre-arrival checklist ────────────────────────────────────────────────────

const CHECKLIST: { en: string; es: string }[] = [
  {
    en: "Confirm your visa path — property purchase, pension, income, or digital nomad",
    es: "Confirma tu ruta de visa — compra de propiedad, pensión, ingresos o nómada digital",
  },
  {
    en: "Consult a Colombian immigration lawyer before filing any application",
    es: "Consulta a un abogado de inmigración colombiano antes de radicar cualquier solicitud",
  },
  {
    en: "Open a Colombian bank account (Bancolombia or Davivienda — bring original passport)",
    es: "Abre una cuenta bancaria colombiana (Bancolombia o Davivienda — lleva pasaporte original)",
  },
  {
    en: "Register foreign investment with Banco de la República if using funds from abroad",
    es: "Registra la inversión extranjera ante el Banco de la República si usas fondos del exterior",
  },
  {
    en: "Obtain private health insurance valid in Colombia before arrival",
    es: "Obtén seguro de salud privado válido en Colombia antes de llegar",
  },
  {
    en: "Apply for your Cédula de Extranjería within 15 days of M or R visa issuance",
    es: "Solicita tu Cédula de Extranjería dentro de los 15 días de expedición de visa M o R",
  },
  {
    en: "Register with your home country embassy within the first 30 days",
    es: "Regístrate en la embajada de tu país dentro de los primeros 30 días",
  },
  {
    en: "Connect with a relocation specialist for banking, utilities, and neighborhood orientation",
    es: "Conéctate con un especialista en reubicación para bancos, servicios públicos y orientación de barrio",
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function RelocationPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale = raw === "es" ? "es" : "en";

  return (
    <div style={{ maxWidth: "var(--max, 1240px)", margin: "0 auto", padding: "40px 20px 100px" }}>

      {/* Page header */}
      <header style={{ marginBottom: "16px" }}>
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
          {locale === "en" ? "Relocate to Colombia" : "Reubicarse en Colombia"}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1rem", margin: "0 0 8px", maxWidth: "640px", lineHeight: 1.6, fontFamily: "var(--font-body, system-ui)" }}>
          {locale === "en"
            ? "Colombia has three established gateway cities for foreign residents — each with distinct climate, cost structure, visa fit, and lifestyle trade-offs. This guide covers the decisions that matter before you move."
            : "Colombia tiene tres ciudades principales establecidas para residentes extranjeros — cada una con clima, estructura de costos, encaje migratorio y opciones de estilo de vida distintos. Esta guía cubre las decisiones que importan antes de mudarte."}
        </p>
      </header>

      {/* Disclaimer */}
      <div
        role="note"
        style={{
          padding: "14px 18px",
          background: "rgba(241,196,15,0.08)",
          border: "1px solid rgba(241,196,15,0.30)",
          borderRadius: "var(--radius-sm, 18px)",
          fontSize: "0.82rem",
          color: "var(--cacao, #4a2f1d)",
          marginBottom: "52px",
          lineHeight: 1.6,
          fontFamily: "var(--font-body, system-ui)",
        }}
      >
        <strong>{locale === "en" ? "Important" : "Importante"}:</strong>{" "}
        {locale === "en"
          ? "General information only — not legal or financial advice. Visa thresholds, SMLMV values, and regulations change. Confirm all requirements with Cancillería and consult a licensed immigration attorney before filing."
          : "Solo información general — no es asesoría legal ni financiera. Los umbrales de visa, los valores del SMLMV y las regulaciones cambian. Confirma todos los requisitos con Cancillería y consulta con un abogado de inmigración habilitado antes de radicar."}
      </div>

      {/* ── Section 1: Which City Is Right for You ────────────────────────────── */}
      <section style={{ marginBottom: "64px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
          <h2
            style={{
              fontFamily: "var(--font-display, Georgia, serif)",
              fontSize: "1.7rem",
              fontWeight: 400,
              color: "var(--ocean, #1f3a4d)",
              margin: 0,
            }}
          >
            {locale === "en" ? "Which City Is Right for You?" : "¿Qué Ciudad Es Para Ti?"}
          </h2>
          <Link
            href="/cities"
            style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--lagoon, #1f6f78)", textDecoration: "none", fontFamily: "var(--font-body, system-ui)", whiteSpace: "nowrap" }}
          >
            {locale === "en" ? "Full city guide with neighborhoods + pricing →" : "Guía completa con barrios y precios →"}
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {CITY_PICKS.map((city) => (
            <div
              key={city.slug}
              style={{
                background: "var(--card, rgba(255,252,247,0.92))",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius, 26px)",
                overflow: "hidden",
              }}
            >
              {/* City color bar + name */}
              <div style={{ padding: "22px 24px 16px", borderBottom: "3px solid " + city.color }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: city.color, fontFamily: "var(--font-body, system-ui)", marginBottom: "4px" }}>
                  {city.tagline[locale]}
                </div>
                <h3 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.4rem", fontWeight: 400, color: "var(--ocean, #1f3a4d)", margin: 0 }}>
                  {city.name}
                </h3>
              </div>

              {/* Stats */}
              <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: city.color, fontFamily: "var(--font-body, system-ui)" }}>{city.suitability}</div>
                  <div style={{ fontSize: "0.62rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "var(--font-body, system-ui)" }}>
                    {locale === "en" ? "Suitability" : "Aptitud"}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ocean, #1f3a4d)", fontFamily: "var(--font-body, system-ui)" }}>{city.costOfLiving}</div>
                  <div style={{ fontSize: "0.62rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "var(--font-body, system-ui)" }}>
                    {locale === "en" ? "Cost of Living" : "Costo de Vida"}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--ocean, #1f3a4d)", fontFamily: "var(--font-body, system-ui)" }}>{city.climate[locale].split(",")[0]}</div>
                  <div style={{ fontSize: "0.62rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "var(--font-body, system-ui)" }}>
                    {locale === "en" ? "Climate" : "Clima"}
                  </div>
                </div>
              </div>

              {/* Best for */}
              <div style={{ padding: "14px 24px" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "6px", fontFamily: "var(--font-body, system-ui)" }}>
                  {locale === "en" ? "Best for" : "Ideal para"}
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--charcoal, #23313f)", lineHeight: 1.55, margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
                  {city.bestFor[locale]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 2: Choose Your Visa Path ─────────────────────────────────── */}
      <section style={{ marginBottom: "64px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <h2
            style={{
              fontFamily: "var(--font-display, Georgia, serif)",
              fontSize: "1.7rem",
              fontWeight: 400,
              color: "var(--ocean, #1f3a4d)",
              margin: 0,
            }}
          >
            {locale === "en" ? "Choose Your Visa Path" : "Elige Tu Ruta de Visa"}
          </h2>
          <Link
            href="/residency"
            style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--lagoon, #1f6f78)", textDecoration: "none", fontFamily: "var(--font-body, system-ui)", whiteSpace: "nowrap" }}
          >
            {locale === "en" ? "Full residency guide with documents →" : "Guía completa de residencia con documentos →"}
          </Link>
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", margin: "0 0 24px", fontFamily: "var(--font-body, system-ui)", lineHeight: 1.6, maxWidth: "620px" }}>
          {locale === "en"
            ? "Colombia's SMLMV (minimum wage unit) sets the threshold for most income and investment visa requirements. SMLMV 2026: COP 1,750,905 (Decreto 159/2026). Thresholds recalculate when the minimum wage is updated — confirm before filing."
            : "El SMLMV (salario mínimo mensual legal vigente) establece el umbral para la mayoría de los requisitos de visas por ingresos e inversión. SMLMV 2026: COP 1.750.905 (Decreto 159/2026). Los umbrales se recalculan cuando se actualiza el salario mínimo — confirma antes de radicar."}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
          {VISA_QUICK.map((v) => (
            <div
              key={v.type}
              style={{
                background: "var(--card, rgba(255,252,247,0.92))",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm, 18px)",
                padding: "20px",
                borderTop: "3px solid " + v.color,
              }}
            >
              <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: v.color, marginBottom: "10px", fontFamily: "var(--font-body, system-ui)" }}>
                {v.type}
              </div>
              <div style={{ fontFamily: "var(--font-body, system-ui)", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--charcoal, #23313f)" }}>{v.key[locale]}</span>
                {" "}
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ocean, #1f3a4d)" }}>({v.amount})</span>
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--charcoal, #23313f)", fontFamily: "var(--font-body, system-ui)", marginBottom: "4px" }}>
                <strong>{locale === "en" ? "Duration: " : "Duración: "}</strong>{v.duration[locale]}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)", fontStyle: "italic" }}>
                {v.note[locale]}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: Practical Checklist ───────────────────────────────────── */}
      <section style={{ marginBottom: "64px" }}>
        <h2
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "1.7rem",
            fontWeight: 400,
            color: "var(--ocean, #1f3a4d)",
            margin: "0 0 8px",
          }}
        >
          {locale === "en" ? "Before You Arrive — Practical Checklist" : "Antes de Llegar — Lista de Verificación Práctica"}
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", margin: "0 0 24px", fontFamily: "var(--font-body, system-ui)", lineHeight: 1.6, maxWidth: "560px" }}>
          {locale === "en"
            ? "Steps that apply regardless of which city you choose. Sequence matters — banking before utilities, visa before Cédula."
            : "Pasos que aplican independientemente de la ciudad que elijas. El orden importa — banco antes de servicios, visa antes de Cédula."}
        </p>

        <div
          style={{
            background: "var(--card, rgba(255,252,247,0.92))",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius, 26px)",
            overflow: "hidden",
          }}
        >
          {CHECKLIST.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "16px",
                padding: "16px 24px",
                borderBottom: i < CHECKLIST.length - 1 ? "1px solid var(--border)" : "none",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "rgba(230,126,34,0.12)",
                  border: "1.5px solid var(--terracotta, #e67e22)",
                  color: "var(--terracotta, #e67e22)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-body, system-ui)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "1px",
                }}
              >
                {i + 1}
              </div>
              <p style={{ fontSize: "0.88rem", color: "var(--charcoal, #23313f)", fontFamily: "var(--font-body, system-ui)", lineHeight: 1.55, margin: 0 }}>
                {item[locale]}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "14px", textAlign: "right" }}>
          <Link
            href="/partners"
            style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--lagoon, #1f6f78)", textDecoration: "none", fontFamily: "var(--font-body, system-ui)" }}
          >
            {locale === "en" ? "Connect with a relocation specialist →" : "Conectar con un especialista en reubicación →"}
          </Link>
        </div>
      </section>

      {/* ── Section 4: Starting a Business ──────────────────────────────────── */}
      <section style={{ marginBottom: "64px" }}>
        <div
          style={{
            background: "var(--card, rgba(255,252,247,0.92))",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius, 26px)",
            padding: "36px 32px",
            display: "flex",
            alignItems: "flex-start",
            gap: "28px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "rgba(31,58,77,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            🏢
          </div>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <h2
              style={{
                fontFamily: "var(--font-display, Georgia, serif)",
                fontSize: "1.5rem",
                fontWeight: 400,
                color: "var(--ocean, #1f3a4d)",
                margin: "0 0 10px",
              }}
            >
              {locale === "en" ? "Starting a Business in Colombia" : "Iniciar un Negocio en Colombia"}
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--muted)", margin: "0 0 20px", maxWidth: "520px", lineHeight: 1.6, fontFamily: "var(--font-body, system-ui)" }}>
              {locale === "en"
                ? "Foreign entrepreneurs can register a Colombian S.A.S. with no minimum capital requirement. Our guide covers structures, registration steps, capital considerations, and how it connects to your visa path."
                : "Los emprendedores extranjeros pueden registrar una S.A.S. colombiana sin capital mínimo requerido. Nuestra guía cubre estructuras, pasos de registro, consideraciones de capital y cómo se conecta con tu ruta de visa."}
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {[
                { label: locale === "en" ? "S.A.S. — most common structure" : "S.A.S. — estructura más común", icon: "✓" },
                { label: locale === "en" ? "No minimum capital by law" : "Sin capital mínimo por ley", icon: "✓" },
                { label: locale === "en" ? "Links to investor visa path" : "Vinculado a la visa inversora", icon: "✓" },
              ].map((f) => (
                <div key={f.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--charcoal, #23313f)", fontFamily: "var(--font-body, system-ui)" }}>
                  <span style={{ color: "var(--emerald-deep, #1f8f59)", fontWeight: 700 }}>{f.icon}</span>
                  {f.label}
                </div>
              ))}
            </div>
            <Link href="/relocation/business" className="btn btn-primary" style={{ display: "inline-block", marginTop: "20px" }}>
              {locale === "en" ? "Business Setup Guide →" : "Guía de Constitución de Empresa →"}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 5: Estimate Your Costs ───────────────────────────────────── */}
      <section style={{ marginBottom: "48px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, rgba(31,58,77,0.04) 0%, rgba(230,126,34,0.06) 100%)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius, 26px)",
            padding: "36px 32px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display, Georgia, serif)",
              fontSize: "1.5rem",
              fontWeight: 400,
              color: "var(--ocean, #1f3a4d)",
              margin: "0 0 10px",
            }}
          >
            {locale === "en" ? "Estimate the Numbers" : "Estima los Números"}
          </h2>
          <p style={{ fontSize: "0.88rem", color: "var(--muted)", margin: "0 0 24px", maxWidth: "560px", lineHeight: 1.6, fontFamily: "var(--font-body, system-ui)" }}>
            {locale === "en"
              ? "Colombia's cost structure is more transparent than most markets. Use the cost simulator to understand acquisition pricing, closing fees, renovation costs, and projected rental yield for each city — before you make an offer."
              : "La estructura de costos de Colombia es más transparente que la mayoría de los mercados. Usa el simulador de costos para entender los precios de adquisición, comisiones de cierre, costos de renovación y rentabilidad proyectada por ciudad — antes de hacer una oferta."}
          </p>

          {/* Quick stat teasers */}
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "28px" }}>
            {[
              { label: locale === "en" ? "Avg price/m² — Medellín" : "Precio prom./m² — Medellín", value: "$1,850" },
              { label: locale === "en" ? "Typical closing costs" : "Costos de cierre típicos", value: "~4.2%" },
              { label: locale === "en" ? "Gross rental yield — Medellín" : "Rentabilidad bruta — Medellín", value: "9.2%" },
            ].map((stat) => (
              <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--terracotta, #e67e22)", fontFamily: "var(--font-body, system-ui)", lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "var(--font-body, system-ui)" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <Link href="/cost-simulator" className="btn btn-primary">
            {locale === "en" ? "Open Property Cost Simulator →" : "Abrir Simulador de Costos →"}
          </Link>
        </div>
      </section>

      {/* ── Bottom CTAs ──────────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
        <div
          style={{
            padding: "28px 24px",
            background: "var(--card, rgba(255,252,247,0.92))",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius, 26px)",
            textAlign: "center",
          }}
        >
          <p style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1rem", color: "var(--ocean, #1f3a4d)", margin: "0 0 8px", lineHeight: 1.3 }}>
            {locale === "en" ? "Browse vetted properties" : "Explorar propiedades verificadas"}
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)", margin: "0 0 16px", lineHeight: 1.5 }}>
            {locale === "en" ? "Medellín, Bogotá, and Cartagena — all with legal status confirmed." : "Medellín, Bogotá y Cartagena — todas con estado legal confirmado."}
          </p>
          <Link href="/listings" className="btn btn-primary">
            {locale === "en" ? "Browse Listings →" : "Ver Listados →"}
          </Link>
        </div>
        <div
          style={{
            padding: "28px 24px",
            background: "var(--card, rgba(255,252,247,0.92))",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius, 26px)",
            textAlign: "center",
          }}
        >
          <p style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1rem", color: "var(--ocean, #1f3a4d)", margin: "0 0 8px", lineHeight: 1.3 }}>
            {locale === "en" ? "Full visa and residency guide" : "Guía completa de visas y residencia"}
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)", margin: "0 0 16px", lineHeight: 1.5 }}>
            {locale === "en" ? "Document checklists, SMLMV thresholds, and must-know rules for each visa type." : "Listas de documentos, umbrales SMLMV y reglas clave para cada tipo de visa."}
          </p>
          <Link href="/residency" className="btn btn-secondary">
            {locale === "en" ? "Residency Guide →" : "Guía de Residencia →"}
          </Link>
        </div>
        <div
          style={{
            padding: "28px 24px",
            background: "var(--card, rgba(255,252,247,0.92))",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius, 26px)",
            textAlign: "center",
          }}
        >
          <p style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1rem", color: "var(--ocean, #1f3a4d)", margin: "0 0 8px", lineHeight: 1.3 }}>
            {locale === "en" ? "Vetted professional network" : "Red de profesionales verificados"}
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)", margin: "0 0 16px", lineHeight: 1.5 }}>
            {locale === "en" ? "Agents, lawyers, contractors, and relocation specialists who work with foreign buyers." : "Agentes, abogados, contratistas y especialistas en reubicación que trabajan con compradores extranjeros."}
          </p>
          <Link href="/partners" className="btn btn-secondary">
            {locale === "en" ? "Meet the Partners →" : "Conocer a los Socios →"}
          </Link>
        </div>
      </div>

      {/* Email capture */}
      <div style={{ marginTop: "48px" }}>
        <EmailCapture locale={locale} variant="banner" source="relocation-page" />
      </div>

    </div>
  );
}
