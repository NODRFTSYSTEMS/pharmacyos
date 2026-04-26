import Image from "next/image";
import { CurrencyWidget } from "./CurrencyWidget";
import { fetchFxRate } from "@/lib/fx";

const footerColumns = {
  explore: {
    labelEn: "Explore",
    labelEs: "Explorar",
    links: [
      { href: "/listings", en: "Listings", es: "Listados" },
      { href: "/cities", en: "Cities", es: "Ciudades" },
      { href: "/map", en: "Map View", es: "Vista de Mapa" },
      { href: "/relocation", en: "Relocate", es: "Reubicarse" },
      { href: "/residency", en: "Residency", es: "Residencia" },
      { href: "/partners", en: "Partners", es: "Socios" },
    ],
  },
  resources: {
    labelEn: "Resources",
    labelEs: "Recursos",
    links: [
      { href: "/cost-simulator", en: "Property Cost Simulator", es: "Simulador de Costos" },
      { href: "/guide", en: "Property Guide", es: "Guía de Propiedad" },
      { href: "/relocation/business", en: "Business Setup", es: "Iniciar Negocio" },
    ],
  },
  company: {
    labelEn: "Company",
    labelEs: "Empresa",
    links: [
      { href: "/for-sellers", en: "For Sellers", es: "Para Vendedores" },
      { href: "/for-agents", en: "For Agents", es: "Para Agentes" },
      { href: "/terms", en: "Terms of Service", es: "Términos de Servicio" },
    ],
  },
};

interface FooterProps {
  locale?: "en" | "es";
}

export async function Footer({ locale = "en" }: FooterProps) {
  const year = new Date().getFullYear();
  const fx = await fetchFxRate();

  return (
    <>
      <footer
        style={{
          background: "var(--ocean, #1f3a4d)",
          color: "rgba(255,255,255,0.75)",
          padding: "48px 20px 32px",
          marginTop: "auto",
        }}
      >
        <div
          className="footer-grid"
          style={{
            maxWidth: "var(--max, 1240px)",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr repeat(3, auto)",
            gap: "40px",
            alignItems: "start",
          }}
        >
          {/* Brand */}
          <div>
            <a href="/" style={{ display: "inline-block", margin: "0 0 10px" }}>
              <Image
                src="/logo.png"
                alt="CasaClaro"
                width={1024}
                height={1024}
                style={{ objectFit: "contain", height: "140px", width: "auto" }}
              />
            </a>
            <p
              style={{
                fontSize: "0.83rem",
                lineHeight: 1.65,
                margin: "0 0 16px",
                maxWidth: "280px",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              {locale === "en"
                ? "Read Colombia clearly. Buy, rent, move, or list with real context."
                : "Lee Colombia con claridad. Compra, arrienda, reubícate o publica con contexto real."}
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[
                { href: "/listings", label: locale === "en" ? "Browse Listings" : "Ver Listados" },
                { href: "/cities", label: locale === "en" ? "Explore Cities" : "Explorar Ciudades" },
              ].map((cta) => (
                <a
                  key={cta.href}
                  href={cta.href}
                  style={{
                    display: "inline-block",
                    padding: "7px 14px",
                    borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    textDecoration: "none",
                    fontFamily: "var(--font-body, system-ui)",
                    transition: "border-color 0.15s",
                  }}
                >
                  {cta.label}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.values(footerColumns).map((col) => (
            <div key={col.labelEn}>
              <p
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  margin: "0 0 14px",
                  fontFamily: "var(--font-body, system-ui)",
                }}
              >
                {locale === "en" ? col.labelEn : col.labelEs}
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "9px" }}>
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      style={{
                        fontSize: "0.84rem",
                        color: "rgba(255,255,255,0.65)",
                        textDecoration: "none",
                        fontFamily: "var(--font-body, system-ui)",
                        transition: "color 0.12s",
                      }}
                    >
                      {locale === "en" ? link.en : link.es}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            maxWidth: "var(--max, 1240px)",
            margin: "36px auto 0",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              margin: 0,
              color: "rgba(255,255,255,0.35)",
              fontFamily: "var(--font-body, system-ui)",
            }}
          >
            © {year} CasaClaro.{" "}
            {locale === "en"
              ? "All rights reserved. Not financial or legal advice."
              : "Todos los derechos reservados. No es asesoría financiera ni legal."}
          </p>
          <CurrencyWidget initial={fx} locale={locale} variant="footer" />
        </div>
      </footer>

      <style>{`
        @media (max-width: 760px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 28px !important;
          }
          .footer-grid > div:first-child {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
