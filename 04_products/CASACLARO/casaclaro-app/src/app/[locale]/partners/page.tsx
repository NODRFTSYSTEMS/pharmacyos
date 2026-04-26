import { Link } from "@/i18n/navigation";
import { ContactForm } from "@/components/ContactForm";

interface Props {
  params: Promise<{ locale: string }>;
}

// ─── Partner profiles — synthetic placeholders, reviewed 2026-04 ──────────────
// All profiles are representative examples of the partner types CasaClaro
// works with. Real partner onboarding is in progress.

interface PartnerProfile {
  id: string;
  name: string;
  title: { en: string; es: string };
  city: string;
  bio: { en: string; es: string };
  languages: string[];
  portraitSeed: string;
}

interface PartnerType {
  id: string;
  heading: { en: string; es: string };
  description: { en: string; es: string };
  profiles: PartnerProfile[];
}

const PARTNER_TYPES: PartnerType[] = [
  {
    id: "real-estate-agents",
    heading: { en: "Real Estate Agents", es: "Agentes de Bienes Raíces" },
    description: {
      en: "Licensed Colombian agents with verified track records working with foreign buyers — from initial search through title closing.",
      es: "Agentes colombianos habilitados con historial verificado trabajando con compradores extranjeros — desde la búsqueda inicial hasta el cierre de título.",
    },
    profiles: [
      {
        id: "valentina-torres",
        name: "Valentina Torres",
        title: { en: "Residential Sales — El Poblado & Laureles", es: "Ventas Residenciales — El Poblado y Laureles" },
        city: "Medellín",
        bio: {
          en: "Eight years placing international buyers in Medellín's top neighborhoods. Valentina handles the full purchase cycle — property sourcing, due diligence coordination, and notary scheduling — entirely in English.",
          es: "Ocho años ubicando compradores internacionales en los mejores barrios de Medellín. Valentina gestiona el ciclo completo de compra — búsqueda, coordinación de diligencia debida y agenda notarial — completamente en inglés.",
        },
        languages: ["English", "Español"],
        portraitSeed: "cc-partner-001",
      },
      {
        id: "carlos-mejia",
        name: "Carlos Mejía Vargas",
        title: { en: "Investment & Residential — Bogotá and Cartagena", es: "Inversión y Residencial — Bogotá y Cartagena" },
        city: "Bogotá · Cartagena",
        bio: {
          en: "Carlos specializes in foreign-investment purchases across Colombia's two largest property markets. He has coordinated over 60 foreign-buyer transactions and provides bilingual support from search through Banco de la República registration.",
          es: "Carlos se especializa en compras de inversión extranjera en los dos mercados inmobiliarios más grandes de Colombia. Ha coordinado más de 60 transacciones de compradores extranjeros con apoyo bilingüe desde la búsqueda hasta el registro en el Banco de la República.",
        },
        languages: ["Español", "English"],
        portraitSeed: "cc-partner-002",
      },
    ],
  },
  {
    id: "immigration-lawyers",
    heading: { en: "Immigration Lawyers", es: "Abogados de Inmigración" },
    description: {
      en: "Colombian immigration attorneys who handle visa applications, residency petitions, and foreign investment registrations for property buyers.",
      es: "Abogados colombianos de inmigración que gestionan solicitudes de visa, peticiones de residencia y registros de inversión extranjera para compradores de propiedad.",
    },
    profiles: [
      {
        id: "maria-fernanda-soto",
        name: "María Fernanda Soto Ríos",
        title: { en: "Immigration Law — M-Inversionista & R-Residente", es: "Derecho Migratorio — M-Inversionista y R-Residente" },
        city: "Medellín",
        bio: {
          en: "María Fernanda focuses exclusively on immigration law for foreign property buyers. Her practice covers M-Inversionista applications, the path to R-Residente after five cumulative years, and digital nomad visa filings — all with full bilingual documentation support.",
          es: "María Fernanda se enfoca exclusivamente en derecho migratorio para compradores extranjeros de propiedad. Su práctica abarca solicitudes M-Inversionista, la ruta a R-Residente tras cinco años acumulados y radicación de visas para nómadas digitales — todo con apoyo documental bilingüe completo.",
        },
        languages: ["Español", "English"],
        portraitSeed: "cc-partner-003",
      },
      {
        id: "andres-restrepo",
        name: "Andrés Felipe Restrepo Gómez",
        title: { en: "Immigration Law — All Visa Categories", es: "Derecho Migratorio — Todas las Categorías de Visa" },
        city: "Bogotá",
        bio: {
          en: "Andrés handles the full spectrum of Colombian immigration — visitor visas, pensionado applications, corporate immigration for business owners, and residency petitions. Based in Bogotá, he covers clients across all regions and coordinates with notaries nationwide.",
          es: "Andrés maneja el espectro completo de la inmigración colombiana — visas de visitante, solicitudes de pensionado, inmigración corporativa para empresarios y peticiones de residencia. Con sede en Bogotá, atiende clientes en todas las regiones y coordina con notarías a nivel nacional.",
        },
        languages: ["Español", "English", "Français"],
        portraitSeed: "cc-partner-004",
      },
    ],
  },
  {
    id: "architects-designers",
    heading: { en: "Architects & Interior Designers", es: "Arquitectos y Diseñadores de Interiores" },
    description: {
      en: "Design professionals who understand foreign-buyer priorities — rental yield optimization, permit coordination, and renovation management with bilingual communication throughout.",
      es: "Profesionales de diseño que entienden las prioridades del comprador extranjero — optimización de rentabilidad de arriendo, coordinación de permisos y gestión de renovación con comunicación bilingüe.",
    },
    profiles: [
      {
        id: "laura-ossa",
        name: "Laura Ossa Martínez",
        title: { en: "Interior Architecture — Rental-Optimized Renovations", es: "Arquitectura Interior — Renovaciones Optimizadas para Arriendo" },
        city: "Medellín",
        bio: {
          en: "Laura designs renovation plans with rental income in mind — efficient layouts, durable materials, and finishes that photograph well for short-term listings. She works primarily in El Poblado, Laureles, and Envigado and produces full bilingual project documentation.",
          es: "Laura diseña planes de renovación pensando en el ingreso de arriendo — distribuciones eficientes, materiales duraderos y acabados que fotografían bien para listados de corto plazo. Trabaja principalmente en El Poblado, Laureles y Envigado con documentación completa del proyecto en dos idiomas.",
        },
        languages: ["Español", "English"],
        portraitSeed: "cc-partner-005",
      },
      {
        id: "pablo-neira",
        name: "Pablo Neira Cárdenas",
        title: { en: "Restoration Architecture — Colonial Properties", es: "Arquitectura de Restauración — Propiedades Coloniales" },
        city: "Cartagena",
        bio: {
          en: "Pablo specializes in the restoration of colonial-era properties in Cartagena's Centro Histórico and Getsemaní. His practice includes ICANH coordination for properties in the UNESCO buffer zone and heritage permit management — an essential capability for buyers in the walled city.",
          es: "Pablo se especializa en la restauración de propiedades de época colonial en el Centro Histórico y Getsemaní de Cartagena. Su práctica incluye coordinación con el ICANH para propiedades en la zona de amortiguamiento de la UNESCO y gestión de permisos patrimoniales — una capacidad esencial para compradores en la ciudad amurallada.",
        },
        languages: ["Español", "English"],
        portraitSeed: "cc-partner-006",
      },
    ],
  },
  {
    id: "general-contractors",
    heading: { en: "General Contractors", es: "Contratistas Generales" },
    description: {
      en: "Construction and renovation contractors with documented experience managing projects for foreign owners — including remote-client coordination and bilingual progress reporting.",
      es: "Contratistas de construcción y renovación con experiencia documentada gestionando proyectos para propietarios extranjeros — incluida la coordinación con clientes remotos e informes de avance bilingües.",
    },
    profiles: [
      {
        id: "ricardo-cano",
        name: "Ricardo Cano Herrera",
        title: { en: "General Contractor — Full Residential Renovations", es: "Contratista General — Renovaciones Residenciales Completas" },
        city: "Medellín · Envigado",
        bio: {
          en: "Ricardo manages full apartment and house renovations across Medellín and Envigado. He coordinates all subcontractors, handles material procurement, and sends weekly photo and video progress reports to remote owners. His crew has completed over 40 renovation projects for foreign buyers.",
          es: "Ricardo gestiona renovaciones completas de apartamentos y casas en Medellín y Envigado. Coordina todos los subcontratistas, gestiona la compra de materiales y envía informes semanales con fotos y videos de avance a propietarios remotos. Su equipo ha completado más de 40 proyectos de renovación para compradores extranjeros.",
        },
        languages: ["Español", "English (basic)"],
        portraitSeed: "cc-partner-007",
      },
      {
        id: "juliana-vargas",
        name: "Juliana Vargas Ospina",
        title: { en: "Contractor — Apartment Refurbishment & Build-Outs", es: "Contratista — Remodelación de Apartamentos" },
        city: "Bogotá",
        bio: {
          en: "Juliana focuses on apartment refurbishment and interior build-outs in Bogotá's Chapinero, Zona G, and Parque 93 neighborhoods. She is known for staying on schedule and provides itemized cost breakdowns before and after each phase — critical for foreign buyers managing projects from abroad.",
          es: "Juliana se enfoca en la remodelación de apartamentos e interiores en los barrios Chapinero, Zona G y Parque 93 de Bogotá. Es conocida por cumplir los plazos y entrega desgloses de costos detallados antes y después de cada fase — fundamental para compradores extranjeros que gestionan proyectos desde el exterior.",
        },
        languages: ["Español", "English"],
        portraitSeed: "cc-partner-008",
      },
    ],
  },
  {
    id: "relocation-specialists",
    heading: { en: "Relocation Specialists", es: "Especialistas en Reubicación" },
    description: {
      en: "Full-service relocation professionals who handle the non-property logistics of moving to Colombia — banking setup, school search, utility connections, neighborhood orientation, and settling-in support.",
      es: "Profesionales de reubicación integral que gestionan la logística no inmobiliaria de mudarse a Colombia — apertura de cuentas bancarias, búsqueda de colegios, conexión de servicios, orientación de barrio y apoyo en el proceso de instalación.",
    },
    profiles: [
      {
        id: "sofia-herrera",
        name: "Sofía Herrera Montoya",
        title: { en: "Full-Service Relocation — Medellín", es: "Reubicación Integral — Medellín" },
        city: "Medellín",
        bio: {
          en: "Sofía has helped over 80 families and individuals relocate to Medellín. Her service covers pre-arrival planning, neighborhood selection, banking setup, school search, utility activation, and a structured first-month orientation program. She manages the entire process in English so clients can focus on settling in.",
          es: "Sofía ha ayudado a más de 80 familias e individuos a reubicarse en Medellín. Su servicio abarca planificación previa a la llegada, selección de barrio, apertura de cuenta bancaria, búsqueda de colegio, activación de servicios públicos y un programa de orientación estructurado para el primer mes. Gestiona todo el proceso en inglés para que los clientes se concentren en instalarse.",
        },
        languages: ["English", "Español"],
        portraitSeed: "cc-partner-009",
      },
      {
        id: "daniel-ospina",
        name: "Daniel Ospina Ruiz",
        title: { en: "Corporate & Family Relocation — Bogotá", es: "Reubicación Corporativa y Familiar — Bogotá" },
        city: "Bogotá",
        bio: {
          en: "Daniel serves both corporate transferees and independent families relocating to Bogotá. His specialties include pet importation coordination, international school enrollment, domestic staff sourcing, and corporate housing arrangements. He has handled relocations from North America, Europe, and across Latin America.",
          es: "Daniel atiende tanto a empleados de traslado corporativo como a familias independientes que se reubican en Bogotá. Sus especialidades incluyen coordinación para importación de mascotas, matrícula en colegios internacionales, búsqueda de personal doméstico y arreglos de vivienda corporativa. Ha gestionado reubicaciones desde Norteamérica, Europa y toda América Latina.",
        },
        languages: ["Español", "English", "Português"],
        portraitSeed: "cc-partner-010",
      },
    ],
  },
  {
    id: "tour-guides",
    heading: { en: "Tour Guides & Local Experts", es: "Guías de Turismo y Expertos Locales" },
    description: {
      en: "Local guides who provide the street-level context that no website can give — neighborhood character, safety, community feel, and the practical realities of daily life in your target city.",
      es: "Guías locales que brindan el contexto a pie de calle que ningún sitio web puede dar — carácter del barrio, seguridad, ambiente comunitario y las realidades prácticas de la vida cotidiana en tu ciudad objetivo.",
    },
    profiles: [
      {
        id: "alejandra-munoz",
        name: "Alejandra Muñoz Pérez",
        title: { en: "Cultural & Historical Guide — Cartagena", es: "Guía Cultural e Histórica — Cartagena" },
        city: "Cartagena",
        bio: {
          en: "Alejandra leads specialized tours of Cartagena's Centro Histórico, Getsemaní, and Las Murallas for prospective buyers and newly arrived expats. Her tours are designed to answer the question foreign buyers actually have: what is it like to live here, not just to visit. She has guided over 300 international visitors over the past four years.",
          es: "Alejandra conduce tours especializados del Centro Histórico, Getsemaní y Las Murallas de Cartagena para compradores potenciales y expatriados recién llegados. Sus tours están diseñados para responder la pregunta que realmente tienen los compradores extranjeros: cómo es vivir aquí, no solo visitarlo. Ha guiado a más de 300 visitantes internacionales en los últimos cuatro años.",
        },
        languages: ["Español", "English", "Italiano"],
        portraitSeed: "cc-partner-011",
      },
      {
        id: "juan-camilo-diaz",
        name: "Juan Camilo Díaz Torres",
        title: { en: "Urban Transformation & Neighborhoods — Medellín", es: "Transformación Urbana y Barrios — Medellín" },
        city: "Medellín",
        bio: {
          en: "Juan Camilo specializes in Medellín's urban transformation story — from its past to its present as one of Latin America's most innovative cities. He offers neighborhood-by-neighborhood walks across El Poblado, Laureles, Envigado, and Sabaneta, with honest assessments of what each area is like for foreign residents rather than tourists.",
          es: "Juan Camilo se especializa en la historia de transformación urbana de Medellín — desde su pasado hasta su presente como una de las ciudades más innovadoras de América Latina. Ofrece recorridos barrio por barrio por El Poblado, Laureles, Envigado y Sabaneta, con evaluaciones honestas de cómo es cada zona para residentes extranjeros, no para turistas.",
        },
        languages: ["Español", "English"],
        portraitSeed: "cc-partner-012",
      },
    ],
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function PartnersPage({ params }: Props) {
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
          {locale === "en" ? "Vetted Partners" : "Socios Verificados"}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1rem", margin: 0, maxWidth: "640px", lineHeight: 1.6, fontFamily: "var(--font-body, system-ui)" }}>
          {locale === "en"
            ? "CasaClaro works exclusively with professionals who have been reviewed for experience, communication standards, and track record with foreign buyers. Introductions are available to buyers with active property searches."
            : "CasaClaro trabaja exclusivamente con profesionales que han sido revisados por experiencia, estándares de comunicación y historial con compradores extranjeros. Las presentaciones están disponibles para compradores con búsquedas de propiedad activas."}
        </p>
      </header>

      {/* Synthetic data note */}
      <div
        role="note"
        style={{
          padding: "12px 16px",
          background: "rgba(241,196,15,0.08)",
          border: "1px solid rgba(241,196,15,0.30)",
          borderRadius: "var(--radius-sm, 18px)",
          fontSize: "0.78rem",
          color: "var(--cacao, #4a2f1d)",
          marginBottom: "52px",
          lineHeight: 1.6,
          fontFamily: "var(--font-body, system-ui)",
        }}
      >
        {locale === "en"
          ? "The profiles below are representative examples of the professional types in the CasaClaro network. Individual partner onboarding is ongoing. Contact us to request an introduction."
          : "Los perfiles a continuación son ejemplos representativos de los tipos de profesionales en la red CasaClaro. La incorporación individual de socios está en curso. Contáctanos para solicitar una presentación."}
      </div>

      {/* Partner type sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "72px" }}>
        {PARTNER_TYPES.map((type) => (
          <section key={type.id}>

            {/* Section heading */}
            <div style={{ marginBottom: "28px", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
              <h2
                style={{
                  fontFamily: "var(--font-display, Georgia, serif)",
                  fontSize: "1.6rem",
                  fontWeight: 400,
                  color: "var(--ocean, #1f3a4d)",
                  margin: "0 0 6px",
                }}
              >
                {type.heading[locale]}
              </h2>
              <p style={{ fontSize: "0.88rem", color: "var(--muted)", margin: 0, maxWidth: "620px", lineHeight: 1.6, fontFamily: "var(--font-body, system-ui)" }}>
                {type.description[locale]}
              </p>
            </div>

            {/* Profile cards grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
              {type.profiles.map((profile) => (
                <article
                  key={profile.id}
                  style={{
                    background: "var(--card, rgba(255,252,247,0.92))",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius, 26px)",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {/* Profile header */}
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>

                    {/* Portrait */}
                    <img
                      src={`https://picsum.photos/seed/${profile.portraitSeed}/200/200`}
                      alt={profile.name}
                      width={72}
                      height={72}
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        flexShrink: 0,
                        border: "2px solid var(--border)",
                      }}
                    />

                    {/* Name + title + city */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        style={{
                          fontFamily: "var(--font-display, Georgia, serif)",
                          fontSize: "1.05rem",
                          fontWeight: 400,
                          color: "var(--ocean, #1f3a4d)",
                          margin: "0 0 4px",
                          lineHeight: 1.2,
                        }}
                      >
                        {profile.name}
                      </h3>
                      <div
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          letterSpacing: "0.07em",
                          textTransform: "uppercase",
                          color: "var(--terracotta, #e67e22)",
                          fontFamily: "var(--font-body, system-ui)",
                          marginBottom: "4px",
                          lineHeight: 1.3,
                        }}
                      >
                        {profile.title[locale]}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)" }}>
                        {profile.city}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--charcoal, #23313f)",
                      fontFamily: "var(--font-body, system-ui)",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {profile.bio[locale]}
                  </p>

                  {/* Languages */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-body, system-ui)" }}>
                      {locale === "en" ? "Languages:" : "Idiomas:"}
                    </span>
                    {profile.languages.map((lang) => (
                      <span
                        key={lang}
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          color: "var(--ocean, #1f3a4d)",
                          background: "rgba(31,58,77,0.07)",
                          borderRadius: "999px",
                          padding: "2px 8px",
                          fontFamily: "var(--font-body, system-ui)",
                        }}
                      >
                        {lang}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div style={{ marginTop: "4px" }}>
                    <Link
                      href="/for-agents"
                      className="partner-cta-link"
                      style={{
                        display: "inline-block",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "var(--lagoon, #1f6f78)",
                        textDecoration: "none",
                        fontFamily: "var(--font-body, system-ui)",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {locale === "en" ? "Request Introduction →" : "Solicitar Presentación →"}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Join the partner network */}
      <div style={{ marginTop: "72px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.6rem", fontWeight: 400, color: "var(--ocean, #1f3a4d)", margin: "0 0 8px" }}>
            {locale === "en" ? "Apply to the partner network" : "Aplicar a la red de socios"}
          </h2>
          <p style={{ fontSize: "0.88rem", color: "var(--muted)", margin: 0, maxWidth: "560px", lineHeight: 1.6, fontFamily: "var(--font-body, system-ui)" }}>
            {locale === "en"
              ? "CasaClaro accepts applications from licensed agents, attorneys, property managers, and local experts who serve the foreign-buyer market in Colombia."
              : "CasaClaro acepta solicitudes de agentes habilitados, abogados, administradores de propiedad y expertos locales que atienden el mercado de compradores extranjeros en Colombia."}
          </p>
        </div>
        <ContactForm type="agent" locale={locale} />
      </div>

      <style>{`.partner-cta-link:hover { color: var(--terracotta, #e67e22) !important; }`}</style>
    </div>
  );
}
