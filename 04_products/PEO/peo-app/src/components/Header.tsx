"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);

  const otherLocale = locale === "en" ? "es" : "en";

  const mainNavItems = [
    { href: "/for-sellers", label: t("forSellers") },
    { href: "/for-investors", label: t("forInvestors") },
    { href: "/pricing", label: t("pricing") },
  ];

  const resourcesItems = [
    { href: "/how-it-works", label: t("howItWorks") },
    { href: "/trust", label: t("trust") },
    { href: "/faq", label: t("faq") },
  ];

  const isResourcesActive = resourcesItems.some((item) => pathname === item.href);
  const isAcademyActive = pathname.startsWith("/academy");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setResourcesOpen(false);
      }
    }
    if (resourcesOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [resourcesOpen]);

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "var(--surface-elevated)",
    border: "1px solid var(--border-strong)",
    borderRadius: "var(--radius-sm)",
    boxShadow: "var(--shadow-panel)",
    minWidth: "180px",
    overflow: "hidden",
    zIndex: 100,
  };

  const dropdownLinkBase: React.CSSProperties = {
    display: "block",
    padding: "10px 16px",
    fontSize: "0.85rem",
    textDecoration: "none",
    borderBottom: "1px solid var(--border)",
    transition: "all 0.12s ease",
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background: "rgba(7, 10, 16, 0.88)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>

          {/* Brand */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div
              aria-hidden="true"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "8px",
                background: "var(--gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--display)",
                fontWeight: 800,
                fontSize: "0.85rem",
                color: "#070a10",
                flexShrink: 0,
              }}
            >
              PE
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <span style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text)" }}>
                Peak Equity
              </span>
              <span style={{ fontSize: "0.65rem", color: "var(--text-soft)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Optimizer
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="nav-desktop" style={{ alignItems: "center", gap: "2px" }}>
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`nav-link${pathname === item.href ? " nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            ))}

            {/* Resources dropdown */}
            <div ref={resourcesRef} style={{ position: "relative" }}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={resourcesOpen}
                onClick={() => setResourcesOpen((v) => !v)}
                className={`nav-link${isResourcesActive ? " nav-link-active" : ""}`}
                style={{
                  background: resourcesOpen && !isResourcesActive ? "rgba(255,255,255,0.05)" : undefined,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {t("resources")}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{ opacity: 0.6, transform: resourcesOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }}>
                  <path d="M6 8L1 3h10L6 8z" />
                </svg>
              </button>

              {resourcesOpen && (
                <div role="menu" style={dropdownStyle}>
                  {resourcesItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      aria-current={pathname === item.href ? "page" : undefined}
                      onClick={() => setResourcesOpen(false)}
                      style={{
                        ...dropdownLinkBase,
                        color: pathname === item.href ? "var(--gold)" : "var(--text-muted)",
                        background: pathname === item.href ? "var(--gold-dim)" : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (pathname !== item.href) {
                          (e.currentTarget as HTMLElement).style.color = "var(--text)";
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (pathname !== item.href) {
                          (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Academy link */}
            <Link
              href="/academy"
              aria-current={isAcademyActive ? "page" : undefined}
              className={`nav-link${isAcademyActive ? " nav-link-active" : ""}`}
            >
              {t("academy")}
            </Link>

            {/* Language toggle */}
            <Link
              href={pathname}
              locale={otherLocale}
              className="lang-toggle"
              aria-label={`Switch to ${otherLocale.toUpperCase()}`}
            >
              {otherLocale.toUpperCase()}
            </Link>

            {/* Primary CTA */}
            <Link
              href="/estimator"
              className="button button-primary"
              style={{ marginLeft: "8px", padding: "8px 18px", fontSize: "0.82rem" }}
            >
              {t("tryFree")}
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            onClick={() => setMobileOpen((v) => !v)}
            className="nav-mobile-btn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          role="navigation"
          aria-label="Mobile navigation"
          style={{ borderTop: "1px solid var(--border)", background: "rgba(7,10,16,0.97)" }}
        >
          <nav style={{ display: "flex", flexDirection: "column", padding: "16px", gap: "4px" }}>
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  color: pathname === item.href ? "var(--gold)" : "var(--text-muted)",
                  background: pathname === item.href ? "var(--gold-dim)" : "transparent",
                }}
              >
                {item.label}
              </Link>
            ))}

            {/* Resources section in mobile */}
            <details style={{ marginTop: "4px" }}>
              <summary style={{
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: isResourcesActive ? "var(--gold)" : "var(--text-muted)",
                background: isResourcesActive ? "var(--gold-dim)" : "transparent",
                cursor: "pointer",
                listStyle: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                {t("resources")}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{ opacity: 0.5 }}>
                  <path d="M6 8L1 3h10L6 8z" />
                </svg>
              </summary>
              {resourcesItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block",
                    padding: "10px 28px",
                    borderRadius: "10px",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    color: pathname === item.href ? "var(--gold)" : "var(--text-muted)",
                    background: pathname === item.href ? "var(--gold-dim)" : "transparent",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </details>

            {/* Academy link in mobile */}
            <Link
              href="/academy"
              onClick={() => setMobileOpen(false)}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "0.9rem",
                fontWeight: 500,
                textDecoration: "none",
                color: isAcademyActive ? "var(--gold)" : "var(--text-muted)",
                background: isAcademyActive ? "var(--gold-dim)" : "transparent",
              }}
            >
              {t("academy")}
            </Link>

            <Link
              href={pathname}
              locale={otherLocale}
              onClick={() => setMobileOpen(false)}
              className="lang-toggle-mobile"
            >
              {t("switchLocale", { locale: otherLocale.toUpperCase() })}
            </Link>

            <Link
              href="/estimator"
              onClick={() => setMobileOpen(false)}
              className="button button-primary"
              style={{ marginTop: "8px", justifyContent: "center" }}
            >
              {t("tryFree")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
