import { Link } from "@/i18n/navigation";
import { EmailCapture } from "@/components/EmailCapture";
import { CITIES } from "@/data/cities.data";
import { SYNTHETIC_LISTINGS } from "@/data/listings.seed";

interface Props {
  params: Promise<{ locale: string }>;
}

const FEATURED_CITY_SLUGS = ["medellin", "cartagena", "bogota", "cali"];
const FEATURED_LISTING_SLUGS = [
  "el-poblado-modern-apartment-mde-001",
  "bocagrande-beachfront-rental-ctg-001",
  "chico-penthouse-sale-bog-001",
];

const HOW_IT_WORKS = [
  {
    n: "01",
    en: "Compare cities and neighborhoods",
    es: "Compara ciudades y barrios",
    bodyEn: "Use real cost-of-living data, climate, expat community size, and rental ranges to narrow your search before you visit.",
    bodyEs: "Usa datos reales de costo de vida, clima, tamaño de la comunidad expat y rangos de arriendo para enfocar tu búsqueda antes de visitar.",
    href: "/cities",
    ctaEn: "Explore Cities",
    ctaEs: "Explorar Ciudades",
  },
  {
    n: "02",
    en: "Browse vetted listings",
    es: "Navega listados verificados",
    bodyEn: "Every property on CasaClaro is reviewed for clear title, accurate pricing, and proper condition disclosure before it's listed.",
    bodyEs: "Cada propiedad en CasaClaro es revisada por título limpio, precio preciso y revelación correcta del estado antes de publicarse.",
    href: "/listings",
    ctaEn: "Browse Listings",
    ctaEs: "Ver Listados",
  },
  {
    n: "03",
    en: "Navigate the move with context",
    es: "Gestiona la mudanza con contexto",
    bodyEn: "Visa pathways, property cost breakdowns, business setup, and a vetted professional network — everything in one bilingual platform.",
    bodyEs: "Vías de visa, desglose de costos, apertura de empresa y una red de profesionales verificados — todo en una plataforma bilingüe.",
    href: "/relocation",
    ctaEn: "Relocation Guide",
    ctaEs: "Guía de Reubicación",
  },
];

export default async function Home({ params }: Props) {
  const { locale: raw } = await params;
  const locale = raw === "es" ? "es" : "en";
  const isEn = locale === "en";

  const featuredCities = FEATURED_CITY_SLUGS
    .map((slug) => CITIES.find((c) => c.slug === slug))
    .filter(Boolean) as (typeof CITIES)[number][];

  const featuredListings = FEATURED_LISTING_SLUGS
    .map((slug) => SYNTHETIC_LISTINGS.find((l) => l.slug === slug))
    .filter(Boolean) as (typeof SYNTHETIC_LISTINGS)[number][];

  return (
    <div>
      {/* ─── Hero ────────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: "var(--max, 1240px)",
          margin: "0 auto",
          padding: "88px 20px 72px",
          textAlign: "center",
        }}
      >
        <p style={{ fontFamily: "var(--font-body, system-ui)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--terracotta, #e67e22)", margin: "0 0 20px" }}>
          CasaClaro
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "clamp(2.4rem, 5.5vw, 3.8rem)",
            fontWeight: 400,
            color: "var(--ocean, #1f3a4d)",
            margin: "0 0 24px",
            lineHeight: 1.08,
            maxWidth: "760px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {isEn
            ? "Read Colombia clearly before you buy, rent, or relocate."
            : "Entiende Colombia con claridad antes de comprar, arrendar o mudarte."}
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--muted, #6b7280)", margin: "0 0 40px", maxWidth: "560px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.65, fontFamily: "var(--font-body, system-ui)" }}>
          {isEn
            ? "Bilingual property platform for buyers, renters, and expats. Vetted listings, real neighborhood data, and full relocation context — built for the international Colombia market."
            : "Plataforma bilingüe para compradores, arrendatarios y expats. Listados verificados, datos reales de barrio y contexto completo de reubicación."}
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/listings" className="btn btn-primary" style={{ fontSize: "0.95rem", padding: "14px 32px" }}>
            {isEn ? "Browse Listings" : "Ver Listados"}
          </Link>
          <Link href="/cities" className="btn btn-secondary" style={{ fontSize: "0.95rem", padding: "14px 32px" }}>
            {isEn ? "Compare Cities" : "Comparar Ciudades"}
          </Link>
        </div>

        {/* Stat bar */}
        <div style={{ display: "flex", gap: "0", justifyContent: "center", marginTop: "56px", flexWrap: "wrap", borderTop: "1px solid rgba(31,58,77,0.08)", paddingTop: "40px" }}>
          {[
            { n: "8", label: isEn ? "Cities covered" : "Ciudades cubiertas" },
            { n: "20+", label: isEn ? "Vetted listings" : "Listados verificados" },
            { n: "EN/ES", label: isEn ? "Fully bilingual" : "Completamente bilingüe" },
            { n: "3", label: isEn ? "Vetting tiers" : "Niveles de verificación" },
          ].map((stat, i) => (
            <div key={i} style={{ flex: "1 1 140px", padding: "0 24px", borderRight: i < 3 ? "1px solid rgba(31,58,77,0.08)" : "none", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "2rem", fontWeight: 400, color: "var(--ocean, #1f3a4d)", margin: "0 0 4px", lineHeight: 1 }}>
                {stat.n}
              </p>
              <p style={{ fontSize: "0.75rem", color: "rgba(31,58,77,0.45)", margin: 0, fontFamily: "var(--font-body, system-ui)", letterSpacing: "0.02em" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Featured Cities ─────────────────────────────────────────────────── */}
      <section style={{ background: "white", padding: "72px 20px" }}>
        <div style={{ maxWidth: "var(--max, 1240px)", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--terracotta, #e67e22)", margin: "0 0 8px", fontFamily: "var(--font-body, system-ui)" }}>
                {isEn ? "Where to Look" : "Dónde Buscar"}
              </p>
              <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 400, color: "var(--ocean, #1f3a4d)", margin: 0 }}>
                {isEn ? "Colombia's top expat destinations" : "Los mejores destinos expat de Colombia"}
              </h2>
            </div>
            <a href="/cities" style={{ fontSize: "0.84rem", fontWeight: 600, color: "var(--lagoon, #1f6f78)", textDecoration: "none", fontFamily: "var(--font-body, system-ui)", whiteSpace: "nowrap" }}>
              {isEn ? "Compare all cities →" : "Comparar todas →"}
            </a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
            {featuredCities.map((city) => (
              <a
                key={city.slug}
                href="/cities"
                className="city-card-link"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="city-card" style={{ background: "var(--cream, #fdf5e6)", borderRadius: "var(--radius, 26px)", padding: "28px 24px", border: "1px solid rgba(31,58,77,0.06)", height: "100%", boxSizing: "border-box" }}>
                  {/* Color dot */}
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: city.markerColor, marginBottom: "14px" }} />
                  <p style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.35rem", fontWeight: 400, color: "var(--ocean, #1f3a4d)", margin: "0 0 4px" }}>
                    {city.name}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(31,58,77,0.45)", margin: "0 0 14px", fontFamily: "var(--font-body, system-ui)" }}>
                    {isEn ? city.tagline.en : city.tagline.es}
                  </p>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div>
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(31,58,77,0.35)", margin: "0 0 2px", fontFamily: "var(--font-body, system-ui)" }}>
                        {isEn ? "2BR Rent" : "Arriendo 2H"}
                      </p>
                      <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--ocean, #1f3a4d)", margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
                        {city.metrics.avgRent2BR ? `$${city.metrics.avgRent2BR.toLocaleString()}/mo` : "—"}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(31,58,77,0.35)", margin: "0 0 2px", fontFamily: "var(--font-body, system-ui)" }}>
                        {isEn ? "Climate" : "Clima"}
                      </p>
                      <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--ocean, #1f3a4d)", margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
                        {city.avgTempC.low}–{city.avgTempC.high}°C
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Listings ───────────────────────────────────────────────── */}
      <section style={{ padding: "72px 20px", background: "var(--cream, #fdf5e6)" }}>
        <div style={{ maxWidth: "var(--max, 1240px)", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--terracotta, #e67e22)", margin: "0 0 8px", fontFamily: "var(--font-body, system-ui)" }}>
                {isEn ? "Current Listings" : "Listados Actuales"}
              </p>
              <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 400, color: "var(--ocean, #1f3a4d)", margin: 0 }}>
                {isEn ? "Vetted properties, reviewed for clarity" : "Propiedades verificadas, revisadas con claridad"}
              </h2>
            </div>
            <a href="/listings" style={{ fontSize: "0.84rem", fontWeight: 600, color: "var(--lagoon, #1f6f78)", textDecoration: "none", fontFamily: "var(--font-body, system-ui)", whiteSpace: "nowrap" }}>
              {isEn ? "View all listings →" : "Ver todos los listados →"}
            </a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {featuredListings.map((listing) => {
              const primaryImg = listing.images.find((i) => i.is_primary) ?? listing.images[0];
              const typeLabel = listing.listing_type === "sale" ? (isEn ? "For Sale" : "En Venta") : (isEn ? "For Rent" : "En Arriendo");
              const price = listing.listing_type === "sale"
                ? `$${listing.price_usd.toLocaleString()}`
                : `$${listing.price_usd.toLocaleString()}/mo`;

              return (
                <a key={listing.slug} href={`/listings/${listing.slug}`} className="listing-card-link" style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="listing-card" style={{ background: "white", borderRadius: "var(--radius, 26px)", overflow: "hidden", border: "1px solid rgba(31,58,77,0.06)", boxShadow: "0 2px 12px rgba(31,58,77,0.05)" }}>
                    <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
                      <img src={primaryImg.url} alt={primaryImg.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      <span style={{ position: "absolute", top: "12px", left: "12px", background: "var(--terracotta, #e67e22)", color: "white", borderRadius: "999px", padding: "3px 10px", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", fontFamily: "var(--font-body, system-ui)" }}>
                        {typeLabel}
                      </span>
                    </div>
                    <div style={{ padding: "18px 20px" }}>
                      <p style={{ fontSize: "0.75rem", color: "rgba(31,58,77,0.45)", margin: "0 0 6px", fontFamily: "var(--font-body, system-ui)" }}>
                        {listing.neighborhood}, {listing.city}
                      </p>
                      <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--ocean, #1f3a4d)", margin: "0 0 10px", fontFamily: "var(--font-body, system-ui)", lineHeight: 1.1 }}>
                        {price}
                      </p>
                      <div style={{ display: "flex", gap: "12px", fontSize: "0.8rem", color: "var(--ocean, #1f3a4d)", fontFamily: "var(--font-body, system-ui)" }}>
                        <span>🛏 {listing.bedrooms}</span>
                        <span>🚿 {listing.bathrooms}</span>
                        <span>📐 {listing.area_sqm}m²</span>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────────────────────── */}
      <section style={{ background: "white", padding: "72px 20px" }}>
        <div style={{ maxWidth: "var(--max, 1240px)", margin: "0 auto" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--terracotta, #e67e22)", margin: "0 0 8px", fontFamily: "var(--font-body, system-ui)", textAlign: "center" }}>
            {isEn ? "How It Works" : "Cómo Funciona"}
          </p>
          <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 400, color: "var(--ocean, #1f3a4d)", margin: "0 0 48px", textAlign: "center" }}>
            {isEn ? "One platform, end to end" : "Una plataforma, de principio a fin"}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {HOW_IT_WORKS.map((step) => (
              <div key={step.n} style={{ padding: "28px 24px", background: "var(--cream, #fdf5e6)", borderRadius: "var(--radius, 26px)", border: "1px solid rgba(31,58,77,0.06)" }}>
                <p style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "2.4rem", fontWeight: 400, color: "rgba(31,58,77,0.12)", margin: "0 0 16px", lineHeight: 1 }}>
                  {step.n}
                </p>
                <h3 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.15rem", fontWeight: 400, color: "var(--ocean, #1f3a4d)", margin: "0 0 10px" }}>
                  {isEn ? step.en : step.es}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "rgba(31,58,77,0.6)", lineHeight: 1.65, margin: "0 0 18px", fontFamily: "var(--font-body, system-ui)" }}>
                  {isEn ? step.bodyEn : step.bodyEs}
                </p>
                <a href={step.href} style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--terracotta, #e67e22)", textDecoration: "none", fontFamily: "var(--font-body, system-ui)" }}>
                  {isEn ? step.ctaEn : step.ctaEs} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Platform value props ────────────────────────────────────────────── */}
      <section style={{ background: "var(--ocean, #1f3a4d)", padding: "72px 20px" }}>
        <div style={{ maxWidth: "var(--max, 1240px)", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 400, color: "var(--cream, #fdf5e6)", margin: "0 0 48px", textAlign: "center" }}>
            {isEn ? "Why CasaClaro" : "Por qué CasaClaro"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
            {[
              {
                en: "Vetted listings only",
                es: "Solo listados verificados",
                bodyEn: "Every property is reviewed for clear title, accurate pricing, and disclosed condition before going live.",
                bodyEs: "Cada propiedad es revisada por título limpio, precio preciso y estado declarado antes de publicarse.",
              },
              {
                en: "Fully bilingual",
                es: "Completamente bilingüe",
                bodyEn: "Every listing, city guide, relocation resource, and legal note is in English and Spanish — transcreated, not translated.",
                bodyEs: "Cada listado, guía de ciudad y recurso de reubicación está en inglés y español — transcreado, no traducido.",
              },
              {
                en: "Neighborhood context built in",
                es: "Contexto de barrio incluido",
                bodyEn: "Pricing comps, climate data, expat community size, cost of living, and rental ranges — on every city page.",
                bodyEs: "Comparables de precios, clima, tamaño de comunidad expat, costo de vida y rangos de arriendo en cada página de ciudad.",
              },
              {
                en: "Honest. No generic copy.",
                es: "Honesto. Sin texto genérico.",
                bodyEn: "No inflated claims, no invented statistics, no vague neighborhood descriptions. Context you can act on.",
                bodyEs: "Sin afirmaciones infladas, sin estadísticas inventadas, sin descripciones vagas de barrio. Contexto con el que puedes actuar.",
              },
            ].map((prop, i) => (
              <div key={i} style={{ padding: "24px", background: "rgba(255,255,255,0.05)", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <h3 style={{ fontFamily: "var(--font-body, system-ui)", fontSize: "0.92rem", fontWeight: 700, color: "var(--cream, #fdf5e6)", margin: "0 0 10px" }}>
                  {isEn ? prop.en : prop.es}
                </h3>
                <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
                  {isEn ? prop.bodyEn : prop.bodyEs}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .city-card { transition: transform 0.18s, box-shadow 0.18s; }
        .city-card-link:hover .city-card { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(31,58,77,0.1); }
        .listing-card { transition: transform 0.18s, box-shadow 0.18s; }
        .listing-card-link:hover .listing-card { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(31,58,77,0.12); }
      `}</style>

      {/* ─── Email capture ───────────────────────────────────────────────────── */}
      <section style={{ padding: "72px 20px", background: "var(--cream, #fdf5e6)" }}>
        <div style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--terracotta, #e67e22)", margin: "0 0 12px", fontFamily: "var(--font-body, system-ui)" }}>
            {isEn ? "Stay informed" : "Mantente informado"}
          </p>
          <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.8rem", fontWeight: 400, color: "var(--ocean, #1f3a4d)", margin: "0 0 28px" }}>
            {isEn ? "New listings and city updates" : "Nuevos listados y actualizaciones de ciudades"}
          </h2>
          <EmailCapture locale={locale} variant="inline" source="homepage-bottom" />
        </div>
      </section>
    </div>
  );
}
