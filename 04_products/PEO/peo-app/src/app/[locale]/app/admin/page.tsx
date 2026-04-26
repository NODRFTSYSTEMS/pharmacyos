"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/* ------------------------------------------------------------------
 * Admin Dashboard — Placeholder for Phase 6
 * Authority: DSS · SCA
 * ------------------------------------------------------------------ */

interface AdminMetric {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const [metrics, setMetrics] = useState<AdminMetric[]>([
    { label: t("totalUsers"), value: "—", change: "", positive: true },
    { label: t("activeAnalyses"), value: "—", change: "", positive: true },
    { label: t("revenueMtd"), value: "$—", change: "", positive: true },
    { label: t("churnRate"), value: "—", change: "", positive: true },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/users").then((r) => r.json()).catch(() => ({ total: 0 })),
      fetch("/api/admin/applications").then((r) => r.json()).catch(() => ({ total: 0 })),
    ]).then(([users, apps]) => {
      setMetrics([
        { label: t("totalUsers"), value: String(users.total ?? 0), change: "", positive: true },
        { label: t("activeAnalyses"), value: String(apps.total ?? 0), change: "", positive: true },
        { label: t("revenueMtd"), value: "$—", change: "", positive: true },
        { label: t("churnRate"), value: "—", change: "", positive: true },
      ]);
      setLoading(false);
    });
  }, [t]);

  return (
    <div style={{ maxWidth: 1200 }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{t("eyebrow")}</div>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 24 }}>
        {t("title")}
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {metrics.map((m) => (
          <div key={m.label} className="card">
            <div style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-soft)", marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "1.6rem", fontWeight: 500, color: "var(--text)", letterSpacing: "-0.02em" }}>{m.value}</div>
            <div style={{ fontSize: "0.78rem", color: m.positive ? "var(--green)" : "var(--red)", marginTop: 4 }}>{m.change}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>🚧</div>
        <h2 style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "1.2rem", color: "var(--text)", marginBottom: 8 }}>{t("comingSoonTitle")}</h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", maxWidth: "48ch", margin: "0 auto", lineHeight: 1.6 }}>
          {t("comingSoonBody")}
        </p>
      </div>
    </div>
  );
}
