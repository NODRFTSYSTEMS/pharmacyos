import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");

  const columns = [
    {
      heading: t("col1Heading"),
      links: [
        { href: "/estimator", label: t("linkEstimator") },
        { href: "/how-it-works", label: t("linkHowItWorks") },
        { href: "/pricing", label: t("linkPricing") },
        { href: "/academy", label: t("linkAcademy") },
      ],
    },
    {
      heading: t("col2Heading"),
      links: [
        { href: "/for-sellers", label: t("linkSellers") },
        { href: "/for-investors", label: t("linkInvestors") },
        { href: "/trust", label: t("linkTrust") },
        { href: "/faq", label: t("linkFaq") },
      ],
    },
    {
      heading: t("col3Heading"),
      links: [
        { href: "/academy/methodology", label: t("linkMethodology") },
        { href: "/academy/formula-stack", label: t("linkFormulaStack") },
        { href: "/academy/glossary", label: t("linkGlossary") },
        { href: "/academy/templates", label: t("linkTemplates") },
      ],
    },
    {
      heading: t("col4Heading"),
      links: [
        { href: "/legal/terms", label: t("terms") },
        { href: "/legal/privacy", label: t("privacy") },
        { href: "/legal/disclosures", label: t("disclosures") },
      ],
    },
  ];

  return (
    <footer style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)", position: "relative", zIndex: 10 }}>
      <div className="container" style={{ padding: "56px 0 32px" }}>
        {/* Top row: brand + nav columns */}
        <div className="footer-top">
          {/* Brand column */}
          <div className="footer-brand">
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "12px" }}>
              <div
                aria-hidden="true"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "var(--gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--display)",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  color: "#070a10",
                  flexShrink: 0,
                }}
              >
                PE
              </div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                <span style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>
                  Peak Equity
                </span>
                <span style={{ fontSize: "0.6rem", color: "var(--text-soft)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Optimizer
                </span>
              </div>
            </Link>
            <p className="body-xs" style={{ maxWidth: "200px", margin: 0 }}>
              {t("tagline")}
            </p>
          </div>

          {/* Nav columns */}
          <div className="footer-grid">
            {columns.map((col) => (
              <div key={col.heading}>
                <div className="footer-col-heading">{col.heading}</div>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="footer-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-rights">
            {t("rights")}
          </p>
          <p className="footer-disclaimer">
            {t("disclaimerLine")}
          </p>
        </div>
      </div>
    </footer>
  );
}
