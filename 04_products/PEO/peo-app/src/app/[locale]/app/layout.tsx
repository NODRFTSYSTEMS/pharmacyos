"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import { UserButton } from "@clerk/nextjs";

/* ------------------------------------------------------------------
 * Unified App Shell — Persona-aware navigation
 * Authority: DSS · CSM · SCA
 * ------------------------------------------------------------------ */

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

function SidebarNav({ items, collapsed }: { items: NavItem[]; collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              borderRadius: "10px",
              fontSize: "0.82rem",
              fontWeight: 500,
              textDecoration: "none",
              color: isActive ? "var(--gold)" : "var(--text-muted)",
              background: isActive ? "var(--gold-dim)" : "transparent",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = "var(--text)";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.background = "transparent";
              }
            }}
            title={collapsed ? item.label : undefined}
          >
            <span style={{ flexShrink: 0, width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {item.icon}
            </span>
            {!collapsed && (
              <span style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
                {item.label}
                {item.badge && (
                  <span style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "1px 6px",
                    borderRadius: "999px",
                    background: "var(--gold-dim)",
                    color: "var(--gold)",
                    border: "1px solid rgba(233,160,21,0.2)",
                  }}>
                    {item.badge}
                  </span>
                )}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("appShell");
  const pathname = usePathname();
  const { role, loading } = useUserRole();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [savedDealCount, setSavedDealCount] = useState<number | null>(null);

  const userRole = role ?? "anonymous_visitor";
  const isAdmin = userRole === "admin_internal";
  const isSeller = userRole === "seller" || isAdmin;
  const isInvestor = userRole.startsWith("investor") || isAdmin || userRole === "free_user";
  const isVendor = userRole === "vendor" || isAdmin;
  const activePersona = pathname.startsWith("/app/seller") ? "seller" : "investor";

  useEffect(() => {
    if (loading || !isInvestor) return;
    fetch("/api/investor/analysis")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.analyses)) setSavedDealCount(d.analyses.length); })
      .catch(() => {});
  }, [loading, isInvestor]);

  const investorNav: NavItem[] = [
    {
      href: "/app/investor",
      label: t("portfolio"),
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 6-6"/></svg>,
    },
    {
      href: "/investor/analyze",
      label: t("newAnalysis"),
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
    },
    {
      href: "/app/investor/deals",
      label: t("savedDeals"),
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>,
      badge: savedDealCount != null && savedDealCount > 0 ? String(savedDealCount) : undefined,
    },
    {
      href: "/app/investor/compare",
      label: t("compare"),
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 3h3v3h-3zM8 3h3v3H8zM5 8h14v13H5z"/></svg>,
    },
    {
      href: "/app/investor/templates",
      label: t("templates"),
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>,
    },
    {
      href: "/academy/glossary",
      label: t("glossary"),
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    },
  ];

  const sellerNav: NavItem[] = [
    {
      href: "/app/seller",
      label: t("myDeals"),
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>,
    },
    {
      href: "/seller/application",
      label: t("newListing"),
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14"/></svg>,
    },
    {
      href: "/app/seller/market",
      label: t("marketPosition"),
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
    },
    {
      href: "/app/seller/readiness",
      label: t("readinessPlan"),
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
    },
  ];

  const vendorNav: NavItem[] = [
    {
      href: "/app/vendor",
      label: t("vendorPortal"),
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
    },
  ];

  const adminNav: NavItem[] = [
    {
      href: "/app/admin",
      label: "Admin",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 4a4 4 0 100 8 4 4 0 000-8z"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>,
    },
  ];

  const sidebarWidth = collapsed ? 64 : 220;

  const tierBadge = userRole === "investor_elite" ? "Investor Elite" : userRole === "investor_core" ? "Investor Core" : userRole === "seller" ? "Seller Pro" : userRole === "admin_internal" ? "Admin" : "Free";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Desktop Sidebar */}
      <aside
        className="app-sidebar-desktop"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: sidebarWidth,
          height: "100vh",
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          padding: "20px 12px",
          zIndex: 40,
          transition: "width 250ms ease",
          overflow: "hidden",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px", padding: "0 4px" }}>
          <img src="/icon.svg" alt="" width={28} height={28} style={{ flexShrink: 0 }} />
          {!collapsed && (
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <span style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "0.78rem", color: "var(--text)" }}>PEAK EQUITY</span>
              <span style={{ fontSize: "0.52rem", color: "var(--text-soft)", letterSpacing: "0.15em" }}>OPTIMIZER</span>
            </div>
          )}
        </div>

        {/* Persona switcher */}
        {!collapsed && (isSeller && isInvestor) && (
          <div style={{
            display: "flex",
            gap: "4px",
            padding: "4px",
            background: "var(--bg-alt)",
            borderRadius: "10px",
            marginBottom: "16px",
          }}>
            <Link href="/app/investor" style={{
              flex: 1,
              padding: "6px 0",
              borderRadius: "8px",
              fontSize: "0.72rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              textDecoration: "none",
              textAlign: "center",
              background: activePersona === "investor" ? "var(--gold-dim)" : "transparent",
              color: activePersona === "investor" ? "var(--gold)" : "var(--text-soft)",
            }}>
              {t("investor")}
            </Link>
            <Link href="/app/seller" style={{
              flex: 1,
              padding: "6px 0",
              borderRadius: "8px",
              fontSize: "0.72rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              textDecoration: "none",
              textAlign: "center",
              background: activePersona === "seller" ? "var(--gold-dim)" : "transparent",
              color: activePersona === "seller" ? "var(--gold)" : "var(--text-soft)",
            }}>
              {t("seller")}
            </Link>
          </div>
        )}

        {/* Investor nav */}
        {isInvestor && (
          <>
            {!collapsed && (
              <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-soft)", padding: "0 14px", marginBottom: "8px" }}>
                {t("investor")}
              </div>
            )}
            <SidebarNav items={investorNav} collapsed={collapsed} />
          </>
        )}

        {/* Vendor nav */}
        {isVendor && (
          <>
            {!collapsed && (
              <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-soft)", padding: "0 14px", marginBottom: "8px", marginTop: isInvestor ? "16px" : "0" }}>
                {t("vendor")}
              </div>
            )}
            <SidebarNav items={vendorNav} collapsed={collapsed} />
          </>
        )}

        <div style={{ flex: 1 }} />

        {/* Seller nav */}
        {isSeller && (
          <>
            {!collapsed && (
              <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-soft)", padding: "0 14px", marginBottom: "8px", marginTop: "16px" }}>
                {t("seller")}
              </div>
            )}
            <SidebarNav items={sellerNav} collapsed={collapsed} />
          </>
        )}

        {/* Admin nav */}
        {isAdmin && (
          <>
            <div style={{ flex: 1 }} />
            {!collapsed && (
              <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-soft)", padding: "0 14px", marginBottom: "8px", marginTop: "16px" }}>
                Admin
              </div>
            )}
            <SidebarNav items={adminNav} collapsed={collapsed} />
          </>
        )}

        <div style={{ flex: 1 }} />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-soft)",
            cursor: "pointer",
            fontSize: "0.72rem",
            marginTop: "12px",
          }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: collapsed ? "rotate(180deg)" : "none" }}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 45,
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className="app-sidebar-mobile"
        style={{
          position: "fixed",
          top: 0,
          left: mobileOpen ? 0 : -260,
          width: 260,
          height: "100vh",
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          padding: "20px 16px",
          zIndex: 50,
          transition: "left 250ms ease",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/icon.svg" alt="" width={28} height={28} />
            <span style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "0.85rem", color: "var(--text)" }}>PEAK EQUITY</span>
          </div>
          <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        {isInvestor && <SidebarNav items={investorNav} collapsed={false} />}
        {isVendor && <div style={{ marginTop: isInvestor ? 16 : 0 }}><SidebarNav items={vendorNav} collapsed={false} /></div>}
        {isSeller && <div style={{ marginTop: 16 }}><SidebarNav items={sellerNav} collapsed={false} /></div>}
        {isAdmin && <div style={{ marginTop: 16 }}><SidebarNav items={adminNav} collapsed={false} /></div>}
      </aside>

      {/* Main content area */}
      <main
        className="app-shell-main"
        style={{
          marginLeft: sidebarWidth,
          flex: 1,
          minWidth: 0,
          transition: "margin-left 250ms ease",
        }}
      >
        {/* Top bar */}
        <div style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: "rgba(7, 10, 16, 0.88)",
          borderBottom: "1px solid var(--border)",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              className="app-sidebar-mobile-toggle"
              onClick={() => setMobileOpen(true)}
              style={{
                background: "none",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "6px",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
            <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>
              {t("dashboard")}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {!loading && (
              <span style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--gold)",
                padding: "3px 10px",
                borderRadius: "6px",
                background: "var(--gold-dim)",
                border: "1px solid rgba(233,160,21,0.2)",
              }}>
                {tierBadge}
              </span>
            )}
            <UserButton
              appearance={{ elements: { avatarBox: { width: "30px", height: "30px" } } }}
            />
          </div>
        </div>

        <div style={{ padding: "24px" }}>
          {children}
        </div>
      </main>

    </div>
  );
}
