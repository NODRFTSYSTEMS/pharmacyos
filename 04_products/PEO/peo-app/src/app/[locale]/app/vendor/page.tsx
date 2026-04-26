"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/* ------------------------------------------------------------------
 * Vendor Marketplace — Placeholder for Phase 6
 * Authority: CSM · SCA
 * ------------------------------------------------------------------ */

interface VendorProfile {
  id: string;
  companyName: string;
  services: string[];
  markets: string[];
  rating: number;
  reviewCount: number;
  leads: number;
}

export default function VendorDashboardPage() {
  const t = useTranslations("vendorDashboard");
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vendor/directory")
      .then((res) => res.json())
      .then((data) => {
        setVendors(data.vendors ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 1200 }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{t("eyebrow")}</div>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 24 }}>
        {t("title")}
      </h1>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>{t("loading")}</p>
      ) : vendors.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🏗️</div>
          <h2 style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "1.2rem", color: "var(--text)", marginBottom: 8 }}>{t("comingSoonTitle")}</h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", maxWidth: "48ch", margin: "0 auto", lineHeight: 1.6 }}>
            {t("comingSoonBody")}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {vendors.map((v) => (
            <div key={v.id} className="card">
              <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "1rem", color: "var(--text)", marginBottom: 8 }}>{v.companyName}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {v.services.map((s) => (
                  <span key={s} style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", padding: "2px 8px", borderRadius: 4, background: "var(--bg-alt)", color: "var(--text-soft)", border: "1px solid var(--border)" }}>{s}</span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                <span>⭐ {v.rating} ({v.reviewCount})</span>
                <span>{v.leads} leads</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
