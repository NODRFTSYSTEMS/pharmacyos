"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Gauge } from "@/components/charts/Gauge";

/* ------------------------------------------------------------------
 * Seller Hub — Market positioning + readiness + deal tracker
 * Authority: CSM · SCA
 * ------------------------------------------------------------------ */

interface SellerApplication {
  id: string;
  address: string;
  status: "draft" | "submitted" | "under_review" | "approved" | "listed";
  estimatedArv: number;
  marketVelocity: string;
  readinessScore: number;
  createdAt: string;
}

function statusColor(status: SellerApplication["status"]): string {
  switch (status) {
    case "listed": return "var(--green)";
    case "approved": return "var(--green)";
    case "under_review": return "var(--gold)";
    case "submitted": return "var(--blue)";
    default: return "var(--text-soft)";
  }
}

function statusLabel(status: SellerApplication["status"]): string {
  const map: Record<string, string> = {
    draft: "Draft",
    submitted: "Submitted",
    under_review: "Under Review",
    approved: "Approved",
    listed: "Listed",
  };
  return map[status] ?? status;
}

function scanDevApps(): SellerApplication[] {
  if (typeof window === "undefined") return [];
  const apps: SellerApplication[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key?.startsWith("dev-seller-")) {
      try {
        const raw = sessionStorage.getItem(key);
        if (!raw) continue;
        const data = JSON.parse(raw);
        apps.push({
          id: data.id ?? key.replace("dev-seller-", ""),
          address: data.address ?? "Unknown",
          status: data.status ?? "draft",
          estimatedArv: data.askingPrice ?? data.expectedSalePrice ?? 0,
          marketVelocity: "—",
          readinessScore: 0,
          createdAt: data.createdAt ?? new Date().toISOString(),
        });
      } catch {
        // ignore parse errors
      }
    }
  }
  return apps;
}

export default function SellerHubPage() {
  const t = useTranslations("sellerHub");
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/seller/applications")
      .then((res) => res.json())
      .then((data) => {
        const serverApps: SellerApplication[] = data.applications ?? [];
        const devApps = scanDevApps();
        // Merge dev apps on top, dedupe by id
        const map = new Map<string, SellerApplication>();
        for (const app of serverApps) map.set(app.id, app);
        for (const app of devApps) map.set(app.id, app);
        setApplications(Array.from(map.values()).sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
        setLoading(false);
      })
      .catch(() => {
        setApplications(scanDevApps());
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{t("loading")}</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: 1200 }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: "6px" }}>{t("eyebrow")}</div>
        <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: "var(--text)", letterSpacing: "-0.02em" }}>
          {t("title")}
        </h1>
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="card-kicker">{t("newListing")}</div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{t("newListingDesc")}</p>
          <Link href="/seller/application" className="button button-primary" style={{ fontSize: "0.8rem", padding: "8px 16px", minHeight: 36, alignSelf: "flex-start" }}>
            {t("startApplication")}
          </Link>
        </div>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="card-kicker">{t("marketPosition")}</div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{t("marketPositionDesc")}</p>
          <Link href="/app/seller/market" className="button button-secondary" style={{ fontSize: "0.8rem", padding: "8px 16px", minHeight: 36, alignSelf: "flex-start" }}>
            {t("checkValue")}
          </Link>
        </div>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="card-kicker">{t("readinessPlan")}</div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{t("readinessPlanDesc")}</p>
          <Link href="/app/seller/readiness" className="button button-secondary" style={{ fontSize: "0.8rem", padding: "8px 16px", minHeight: 36, alignSelf: "flex-start" }}>
            {t("viewPlan")}
          </Link>
        </div>
      </div>

      {/* Applications table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="card-kicker" style={{ margin: 0 }}>{t("myApplications")}</div>
          <span style={{ fontSize: "0.72rem", color: "var(--text-soft)" }}>{applications.length} total</span>
        </div>
        {applications.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>{t("noApplications")}</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ background: "var(--surface-strong)", borderBottom: "1px solid var(--border-strong)" }}>
                  {[t("address"), t("status"), t("arv"), t("readiness"), t("date"), ""].map((h) => (
                    <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-soft)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--mono)", color: "var(--text)", minWidth: 180 }}>{app.address}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{
                        fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em",
                        color: statusColor(app.status), padding: "2px 8px", borderRadius: "4px",
                        background: `${statusColor(app.status)}15`, border: `1px solid ${statusColor(app.status)}30`,
                      }}>{statusLabel(app.status)}</span>
                    </td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--mono)", color: "var(--gold)" }}>${app.estimatedArv.toLocaleString()}</td>
                    <td style={{ padding: "10px 14px" }}><Gauge value={app.readinessScore} size={48} stroke={4} /></td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--mono)", color: "var(--text-soft)", fontSize: "0.75rem" }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <Link href={`/seller/application/${app.id}`} style={{ color: "var(--gold)", fontSize: "0.78rem", textDecoration: "none" }}>{t("view")} →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
