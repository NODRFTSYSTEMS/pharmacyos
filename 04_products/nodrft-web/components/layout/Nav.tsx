"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";

type NavKey =
  | "home"
  | "capabilities"
  | "engagements"
  | "insights"
  | "about"
  | "start"
  | "careers"
  | "inquiries";

type NavLink = {
  href: string;
  key: NavKey;
};

const NAV_LINKS: NavLink[] = [
  { href: "/", key: "home" },
  { href: "/capabilities", key: "capabilities" },
  { href: "/engagements", key: "engagements" },
  { href: "/insights", key: "insights" },
  { href: "/about", key: "about" },
  { href: "/start", key: "start" },
  { href: "/careers", key: "careers" },
  { href: "/inquiries", key: "inquiries" },
];

export function Nav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Keyboard trap + Escape in mobile menu
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Focus trap in mobile menu
  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;
    const focusable = menuRef.current.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    function onTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    }
    document.addEventListener("keydown", onTab);
    return () => document.removeEventListener("keydown", onTab);
  }, [menuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        toggleRef.current && !toggleRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  function isActive(href: string) {
    if (href === "/") return pathname === `/${locale}`;
    return pathname.startsWith(localHref(href));
  }

  function localHref(href: string) {
    return `/${locale}${href === "/" ? "" : href}`;
  }

  return (
    <>
      <header role="banner">
        <nav
          className="nav"
          aria-label={t("ariaLabel")}
          style={
            scrolled
              ? {
                  borderBottomColor: "var(--border)",
                  boxShadow: "0 1px 0 var(--border), 0 2px 12px rgba(0,0,0,0.18)",
                  background: "var(--nav-bg-scrolled)",
                }
              : undefined
          }
        >
          <div className="nav__inner">
            {/* Logo */}
            <Link href={localHref("/")} className="nav__logo" aria-label="NoDrftSystems home">
              <svg
                className="nav__logo-svg"
                viewBox="0 0 280 60"
                width="206"
                height="44"
                role="img"
                aria-labelledby="navLogoTitle"
              >
                <title id="navLogoTitle">NoDrftSystems</title>
                <defs>
                  <linearGradient id="nav-teal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2B5854" />
                    <stop offset="100%" stopColor="#3A7A74" />
                  </linearGradient>
                  <linearGradient id="nav-copper" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9C5B28" />
                    <stop offset="100%" stopColor="#7A4620" />
                  </linearGradient>
                </defs>
                <g transform="translate(6 6)">
                  <path d="M0 24 L18 0 L18 48 L0 24Z" fill="url(#nav-copper)" opacity="0.9" />
                  <path d="M20 24 L38 0 L38 48 L20 24Z" fill="url(#nav-teal)" />
                  <path d="M18 16 L20 16 L20 32 L18 32 Z" fill="#1D3F3C" />
                </g>
                <g transform="translate(56 14)">
                  <text
                    x="0"
                    y="28"
                    fill="var(--ink)"
                    fontFamily="Inter, Helvetica Neue, Arial, sans-serif"
                    fontSize="30"
                    fontWeight="600"
                    letterSpacing="-0.8"
                  >
                    NoDrft
                    <tspan fill="var(--accent)" fontWeight="700">
                      Systems
                    </tspan>
                  </text>
                </g>
              </svg>
            </Link>

            {/* Desktop links */}
            <ul className="nav__links" role="list">
              {NAV_LINKS.map(({ href, key }) => (
                <li key={href}>
                  <Link
                    href={localHref(href)}
                    className="nav__link"
                    aria-current={isActive(href) ? "page" : undefined}
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="nav__actions">
              <ThemeToggle />
              <LanguageToggle />
              {/* Mobile toggle */}
              <button
                ref={toggleRef}
                className="nav__toggle"
                type="button"
                aria-expanded={menuOpen ? "true" : "false"}
                aria-controls="mobile-nav"
                aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
                onClick={() => setMenuOpen((v) => !v)}
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "5px",
                  padding: "8px",
                  minWidth: "44px",
                  minHeight: "44px",
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: "22px",
                    height: "2px",
                    background: "var(--ink)",
                    transition: "transform 150ms ease, opacity 150ms ease",
                    transform: menuOpen ? "translateY(7px) rotate(45deg)" : undefined,
                  }}
                />
                <span
                  style={{
                    display: "block",
                    width: "22px",
                    height: "2px",
                    background: "var(--ink)",
                    transition: "transform 150ms ease, opacity 150ms ease",
                    opacity: menuOpen ? 0 : 1,
                  }}
                />
                <span
                  style={{
                    display: "block",
                    width: "22px",
                    height: "2px",
                    background: "var(--ink)",
                    transition: "transform 150ms ease, opacity 150ms ease",
                    transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : undefined,
                  }}
                />
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile nav */}
        {menuOpen && (
          <div
            id="mobile-nav"
            ref={menuRef}
            role="navigation"
            aria-label={t("mobileMenuLabel")}
            style={{
              display: "flex",
              flexDirection: "column",
              background: "var(--bg)",
              borderBottom: "1px solid var(--border)",
              padding: "16px var(--space-4) 24px",
              gap: "4px",
              position: "sticky",
              top: "var(--nav-height)",
              zIndex: 99,
            }}
          >
            {NAV_LINKS.map(({ href, key }) => (
              <Link
                key={href}
                href={localHref(href)}
                aria-current={isActive(href) ? "page" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "13px 0 13px 12px",
                  fontSize: "15px",
                  color: isActive(href) ? "var(--accent)" : "var(--text)",
                  textDecoration: "none",
                  borderBottom: "1px solid var(--border-light)",
                  borderLeft: isActive(href)
                    ? "3px solid var(--accent)"
                    : "3px solid transparent",
                  fontWeight: isActive(href) ? 600 : 400,
                  minHeight: "44px",
                  transition: "color var(--transition-fast), border-left-color var(--transition-fast)",
                  background: isActive(href) ? "var(--accent-subtle)" : undefined,
                }}
              >
                {t(key)}
              </Link>
            ))}
            <Link
              href={localHref("/start")}
              aria-hidden="true"
              tabIndex={-1}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "12px",
                padding: "13px 24px",
                minHeight: "44px",
                background: "var(--accent)",
                color: "var(--white)",
                textDecoration: "none",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {t("start")}
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
