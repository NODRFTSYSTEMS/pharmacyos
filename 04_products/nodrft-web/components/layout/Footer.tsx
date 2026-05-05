import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";

export async function Footer() {
  const t = await getTranslations("footer");
  const locale = await getLocale();

  function localHref(href: string) {
    return `/${locale}${href === "/" ? "" : href}`;
  }

  const workLinks = [
    { href: "/capabilities", key: "capabilities" as const },
    { href: "/engagements", key: "engagements" as const },
    { href: "/insights", key: "insights" as const },
  ];

  const companyLinks = [
    { href: "/about", key: "about" as const },
    { href: "/careers", key: "careers" as const },
    { href: "/inquiries", key: "inquiries" as const },
  ];

  return (
    <footer className="nd-footer" role="contentinfo">
      <div className="nd-wrap-wide">
        <div className="nd-footer-inner">
          <div className="nd-footer-top">
            <div>
              <Link href={localHref("/")} className="nd-footer-wordmark" aria-label="NoDrftSystems home">
                <svg
                  className="nd-footer-logo-mark"
                  viewBox="0 0 38 48"
                  width="18"
                  height="22"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="ft-copper" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9C5B28" />
                      <stop offset="100%" stopColor="#7A4620" />
                    </linearGradient>
                    <linearGradient id="ft-teal" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2B5854" />
                      <stop offset="100%" stopColor="#3A7A74" />
                    </linearGradient>
                  </defs>
                  <path d="M0 24 L18 0 L18 48 L0 24Z" fill="url(#ft-copper)" opacity="0.9" />
                  <path d="M20 24 L38 0 L38 48 L20 24Z" fill="url(#ft-teal)" />
                  <path d="M18 16 L20 16 L20 32 L18 32 Z" fill="#1D3F3C" />
                </svg>
                NoDrft<span className="nd-footer-wordmark__accent">Systems</span>
              </Link>
              <p className="nd-footer-tagline">{t("tagline")}</p>
              <a href="mailto:sales@nodrftsystems.com" className="nd-footer-email">
                sales@nodrftsystems.com
              </a>
            </div>

            <div className="nd-footer-cols">
              <div>
                <p className="nd-footer-col-label">{t("workLabel")}</p>
                <ul className="nd-footer-links">
                  {workLinks.map(({ href, key }) => (
                    <li key={href}>
                      <Link href={localHref(href)} className="nd-footer-link">
                        {t(key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="nd-footer-col-label">{t("companyLabel")}</p>
                <ul className="nd-footer-links">
                  {companyLinks.map(({ href, key }) => (
                    <li key={href}>
                      <Link href={localHref(href)} className="nd-footer-link">
                        {t(key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="nd-footer-bottom">
            <p className="nd-footer-copy">{t("copyright", { year: new Date().getFullYear() })}</p>
            <nav className="nd-footer-legal" aria-label={locale === "en" ? "Legal" : "Legal"}>
              <Link href={localHref("/privacy")} className="nd-footer-legal-link">
                {t("privacy")}
              </Link>
              <Link href={localHref("/terms")} className="nd-footer-legal-link">
                {t("terms")}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
