"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, Link } from "@/i18n/navigation";

const navLinks = [
  { href: "/", labelEn: "Home", labelEs: "Inicio" },
  { href: "/listings", labelEn: "Listings", labelEs: "Listados" },
  { href: "/cities", labelEn: "Cities", labelEs: "Ciudades" },
  { href: "/relocation", labelEn: "Relocate", labelEs: "Reubicarse" },
  { href: "/partners", labelEn: "Partners", labelEs: "Socios" },
  { href: "/guide", labelEn: "Guide", labelEs: "Guía" },
  { href: "/faq", labelEn: "FAQ", labelEs: "FAQ" },
];

interface HeaderProps {
  locale?: string;
}

export function Header({ locale = "en" }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const safeLocale = locale === "es" ? "es" : "en";
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        style={{
          background: "var(--sand, #fff8ef)",
          borderBottom: "1px solid var(--border, rgba(35,49,63,0.1))",
          position: "sticky",
          top: 0,
          zIndex: 40,
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--max, 1240px)",
            margin: "0 auto",
            padding: "8px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
            <Image
              src="/logo.png"
              alt="CasaClaro"
              width={995}
              height={1024}
              priority
              style={{ objectFit: "contain", width: "176px", height: "auto" }}
            />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                gap: "4px",
                alignItems: "center",
              }}
            >
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href as "/"}
                      style={{
                        display: "block",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontFamily: "var(--font-body, system-ui)",
                        fontSize: "0.83rem",
                        fontWeight: active ? 600 : 500,
                        color: active ? "var(--terracotta, #e67e22)" : "var(--charcoal, #23313f)",
                        textDecoration: "none",
                        letterSpacing: "0.01em",
                        background: active ? "rgba(230,126,34,0.08)" : "transparent",
                        transition: "background 0.12s, color 0.12s",
                        whiteSpace: "nowrap",
                      }}
                      aria-current={active ? "page" : undefined}
                    >
                      {safeLocale === "en" ? link.labelEn : link.labelEs}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right side: lang toggle + mobile hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            {/* Language toggle */}
            <div style={{ display: "flex", gap: "3px" }}>
              {(["en", "es"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  aria-label={`Switch to ${lang === "en" ? "English" : "Español"}`}
                  aria-pressed={safeLocale === lang}
                  onClick={() => router.replace(pathname, { locale: lang })}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    border: "1px solid var(--border, rgba(35,49,63,0.12))",
                    background: safeLocale === lang ? "var(--ocean, #1f3a4d)" : "transparent",
                    color: safeLocale === lang ? "#fff" : "var(--muted, #6b7280)",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--font-body, system-ui)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    transition: "all 0.15s",
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              style={{
                display: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                color: "var(--charcoal, #23313f)",
              }}
              className="mobile-menu-btn"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                {mobileOpen ? (
                  <>
                    <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <div
            style={{
              borderTop: "1px solid var(--border, rgba(35,49,63,0.1))",
              background: "var(--sand, #fff8ef)",
              padding: "12px 20px 20px",
            }}
          >
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href as "/"}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: "block",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        fontFamily: "var(--font-body, system-ui)",
                        fontSize: "0.95rem",
                        fontWeight: active ? 600 : 400,
                        color: active ? "var(--terracotta, #e67e22)" : "var(--charcoal, #23313f)",
                        textDecoration: "none",
                        background: active ? "rgba(230,126,34,0.08)" : "transparent",
                        marginBottom: "2px",
                      }}
                      aria-current={active ? "page" : undefined}
                    >
                      {safeLocale === "en" ? link.labelEn : link.labelEs}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 720px) {
          .mobile-menu-btn { display: block !important; }
          header nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
