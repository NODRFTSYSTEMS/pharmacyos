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
