"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useUserRole } from "@/hooks/useUserRole";

interface VendorLead {
  id: string;
  source: string;
  payload: Record<string, unknown>;
  contacted: boolean;
  createdAt: string;
}

interface Review {
  id: string;
  rating: number;
}

interface VendorProfile {
  id: string;
  companyName: string;
  services: string[];
  markets: string[];
  website: string | null;
  bio: string | null;
  status: string;
  leads: VendorLead[];
  reviews: Review[];
}

interface DirectoryVendor {
  id: string;
  companyName: string;
  services: string[];
  markets: string[];
  website: string | null;
  bio: string | null;
  reviewCount: number;
  rating: number;
}

const tagStyle: React.CSSProperties = {
  fontSize: "0.68rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  padding: "2px 8px",
  borderRadius: 4,
  background: "var(--bg-alt)",
  color: "var(--text-soft)",
  border: "1px solid var(--border)",
};

const thStyle: React.CSSProperties = {
  fontSize: "0.68rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--text-soft)",
  padding: "8px 12px",
  textAlign: "left",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: "0.82rem",
  color: "var(--text)",
  borderBottom: "1px solid rgba(255,255,255,0.04)",
  verticalAlign: "middle",
};

function avgRating(reviews: Review[]): number {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

function leadSummary(payload: Record<string, unknown>): string {
  const candidates = ["address", "propertyAddress", "summary", "note", "message", "property"];
  for (const k of candidates) {
    if (payload[k] && typeof payload[k] === "string") return payload[k] as string;
  }
  const entries = Object.entries(payload).slice(0, 2);
  return entries.map(([k, v]) => `${k}: ${v}`).join(" · ") || "—";
}

export default function VendorPage() {
  const t = useTranslations("vendorDashboard");
  const { role, loading: roleLoading } = useUserRole();

  const isVendorUser = role === "vendor";

  // Vendor personal dashboard state
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMissing, setProfileMissing] = useState(false);
  const [contactedUpdating, setContactedUpdating] = useState<string | null>(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyDone, setApplyDone] = useState(false);
  const [applyCompanyName, setApplyCompanyName] = useState("");
  const [applyServices, setApplyServices] = useState("");
  const [applyMarkets, setApplyMarkets] = useState("");
  const [applyWebsite, setApplyWebsite] = useState("");

  // Directory state
  const [vendors, setVendors] = useState<DirectoryVendor[]>([]);
  const [directoryLoading, setDirectoryLoading] = useState(false);
  const [serviceFilter, setServiceFilter] = useState("");

  // Profile fetch — runs only for vendor-role users
  useEffect(() => {
    if (roleLoading || !isVendorUser) return;
    setProfileLoading(true);
    fetch("/api/vendor/profile")
      .then((r) => {
        if (r.status === 404) { setProfileMissing(true); setProfileLoading(false); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.vendor) {
          setProfile(data.vendor);
        } else {
          setProfileMissing(true);
        }
        setProfileLoading(false);
      })
      .catch(() => { setProfileMissing(true); setProfileLoading(false); });
  }, [roleLoading, isVendorUser]);

  // Directory fetch — runs only for non-vendor users; re-runs when serviceFilter changes
  useEffect(() => {
    if (roleLoading || isVendorUser) return;
    setDirectoryLoading(true);
    const qs = serviceFilter ? `?service=${encodeURIComponent(serviceFilter)}` : "";
    fetch(`/api/vendor/directory${qs}`)
      .then((r) => r.json())
      .then((data) => { setVendors(data.vendors ?? []); setDirectoryLoading(false); })
      .catch(() => setDirectoryLoading(false));
  }, [roleLoading, isVendorUser, serviceFilter]);

  async function toggleContacted(leadId: string, current: boolean) {
    setContactedUpdating(leadId);
    try {
      await fetch(`/api/vendor/leads/${leadId}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contacted: !current }),
      });
      setProfile((p) =>
        p ? { ...p, leads: p.leads.map((l) => l.id === leadId ? { ...l, contacted: !current } : l) } : p
      );
    } catch {
      // fail silently — UI state unchanged
    } finally {
      setContactedUpdating(null);
    }
  }

  async function handleApply() {
    const services = applyServices.split(",").map((s) => s.trim()).filter(Boolean);
    const markets = applyMarkets.split(",").map((s) => s.trim()).filter(Boolean);
    if (!applyCompanyName.trim() || services.length === 0 || markets.length === 0) return;
    setApplyLoading(true);
    try {
      const res = await fetch("/api/vendor/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: applyCompanyName.trim(),
          services,
          markets,
          website: applyWebsite.trim() || "",
        }),
      });
      if (res.ok || res.status === 409) setApplyDone(true);
    } catch {
      // ignore
    } finally {
      setApplyLoading(false);
    }
  }

  if (roleLoading) {
    return <div style={{ color: "var(--text-muted)", padding: 24 }}>{t("loading")}</div>;
  }

  /* ---- Vendor personal dashboard ---- */
  if (isVendorUser) {
    if (profileLoading) {
      return <div style={{ color: "var(--text-muted)", padding: 24 }}>{t("loading")}</div>;
    }

    if (profileMissing || !profile) {
      return (
        <div style={{ maxWidth: 640 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>{t("profileEyebrow")}</div>
          <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 24 }}>
            {t("profileTitle")}
          </h1>
          <div className="card" style={{ textAlign: "center", padding: 48 }}>
            {applyDone ? (
              <>
                <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>✓</div>
                <h2 style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "1.1rem", color: "var(--text)", marginBottom: 8 }}>{t("pendingTitle")}</h2>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", maxWidth: "44ch", margin: "0 auto", lineHeight: 1.6 }}>{t("pendingBody")}</p>
              </>
            ) : (
              <>
                <h2 style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "1.1rem", color: "var(--text)", marginBottom: 8 }}>{t("applyTitle")}</h2>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", maxWidth: "44ch", margin: "0 auto", lineHeight: 1.6, marginBottom: 20 }}>{t("applyBody")}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left", maxWidth: 360, margin: "0 auto" }}>
                  {([
                    { key: "applyCompanyName", label: t("applyCompanyNameLabel"), value: applyCompanyName, setter: setApplyCompanyName, placeholder: "Your Company", required: true },
                    { key: "applyServices", label: t("services"), value: applyServices, setter: setApplyServices, placeholder: "Inspections, Title Services", required: true },
                    { key: "applyMarkets", label: t("markets"), value: applyMarkets, setter: setApplyMarkets, placeholder: "Atlanta, GA; Miami, FL", required: true },
                    { key: "applyWebsite", label: `${t("website")} (optional)`, value: applyWebsite, setter: setApplyWebsite, placeholder: "https://yoursite.com", required: false },
                  ] as { key: string; label: string; value: string; setter: (v: string) => void; placeholder: string; required: boolean }[]).map((f) => (
                    <div key={f.key}>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-soft)", marginBottom: 4 }}>{f.label}</label>
                      <input
                        type="text"
                        value={f.value}
                        onChange={(e) => f.setter(e.target.value)}
                        placeholder={f.placeholder}
                        style={{ width: "100%", background: "var(--surface-strong)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "8px 12px", color: "var(--text)", fontSize: "0.82rem", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                  <button
                    className="button button-primary"
                    onClick={handleApply}
                    disabled={applyLoading || !applyCompanyName.trim() || !applyServices.trim() || !applyMarkets.trim()}
                    style={{ opacity: (applyLoading || !applyCompanyName.trim() || !applyServices.trim() || !applyMarkets.trim()) ? 0.6 : 1, marginTop: 4 }}
                  >
                    {t("applyButton")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    if (profile.status === "pending") {
      return (
        <div style={{ maxWidth: 640 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>{t("profileEyebrow")}</div>
          <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 24 }}>
            {profile.companyName}
          </h1>
          <div className="card" style={{ background: "var(--amber-dim)", border: "1px solid rgba(243,156,18,0.25)", padding: "20px 24px", marginBottom: 24 }}>
            <div style={{ fontWeight: 600, color: "var(--amber)", marginBottom: 6 }}>{t("pendingTitle")}</div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{t("pendingBody")}</p>
          </div>
          <ProfileDetails profile={profile} />
        </div>
      );
    }

    const rating = avgRating(profile.reviews);

    return (
      <div style={{ maxWidth: 1100 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>{t("profileEyebrow")}</div>
        <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 24 }}>
          {profile.companyName}
        </h1>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 24 }}>
          <div className="card">
            <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-soft)", marginBottom: 8 }}>{t("statsLeads")}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "1.6rem", fontWeight: 500, color: "var(--text)" }}>{profile.leads.length}</div>
          </div>
          <div className="card">
            <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-soft)", marginBottom: 8 }}>{t("statsReviews")}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "1.6rem", fontWeight: 500, color: "var(--text)" }}>{profile.reviews.length}</div>
          </div>
          {profile.reviews.length > 0 && (
            <div className="card">
              <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-soft)", marginBottom: 8 }}>Avg Rating</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "1.6rem", fontWeight: 500, color: "var(--gold)" }}>{rating.toFixed(1)}</div>
            </div>
          )}
        </div>

        {/* Profile details */}
        <ProfileDetails profile={profile} />

        {/* Leads table */}
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "1rem", color: "var(--text)", marginBottom: 16 }}>{t("leadsTitle")}</h2>
          {profile.leads.length === 0 ? (
            <div className="card" style={{ padding: "24px 20px", color: "var(--text-muted)", fontSize: "0.875rem" }}>{t("noLeads")}</div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>{t("leadSource")}</th>
                      <th style={thStyle}>Summary</th>
                      <th style={thStyle}>{t("leadReceived")}</th>
                      <th style={thStyle}>{t("leadStatus")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.leads.map((lead) => (
                      <tr key={lead.id}>
                        <td style={tdStyle}>
                          <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text-soft)" }}>{lead.source}</span>
                        </td>
                        <td style={{ ...tdStyle, maxWidth: 260 }}>
                          <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-muted)", fontSize: "0.78rem" }}>
                            {leadSummary(lead.payload)}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text-soft)" }}>
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <button
                            onClick={() => toggleContacted(lead.id, lead.contacted)}
                            disabled={contactedUpdating === lead.id}
                            style={{
                              fontSize: "0.72rem",
                              fontWeight: 600,
                              padding: "3px 10px",
                              borderRadius: 6,
                              border: "1px solid",
                              cursor: contactedUpdating === lead.id ? "wait" : "pointer",
                              background: lead.contacted ? "var(--green-dim)" : "transparent",
                              color: lead.contacted ? "var(--green)" : "var(--text-soft)",
                              borderColor: lead.contacted ? "rgba(39,174,96,0.3)" : "var(--border)",
                              transition: "all 0.15s ease",
                            }}
                          >
                            {lead.contacted ? t("contacted") : t("markContacted")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ---- Directory view (admin, investors, everyone else) ---- */
  const allServices = Array.from(new Set(vendors.flatMap((v) => v.services))).sort();

  return (
    <div style={{ maxWidth: 1200 }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{t("eyebrow")}</div>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 24 }}>
        {t("title")}
      </h1>

      {/* Filter bar */}
      {!directoryLoading && allServices.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          <button
            onClick={() => setServiceFilter("")}
            style={{
              fontSize: "0.72rem", fontWeight: 600, padding: "4px 12px", borderRadius: 6,
              border: "1px solid", cursor: "pointer", transition: "all 0.15s ease",
              background: serviceFilter === "" ? "var(--gold-dim)" : "transparent",
              color: serviceFilter === "" ? "var(--gold)" : "var(--text-soft)",
              borderColor: serviceFilter === "" ? "rgba(233,160,21,0.3)" : "var(--border)",
            }}
          >
            All
          </button>
          {allServices.map((svc) => (
            <button
              key={svc}
              onClick={() => setServiceFilter(svc === serviceFilter ? "" : svc)}
              style={{
                fontSize: "0.72rem", fontWeight: 600, padding: "4px 12px", borderRadius: 6,
                border: "1px solid", cursor: "pointer", transition: "all 0.15s ease",
                background: serviceFilter === svc ? "var(--gold-dim)" : "transparent",
                color: serviceFilter === svc ? "var(--gold)" : "var(--text-soft)",
                borderColor: serviceFilter === svc ? "rgba(233,160,21,0.3)" : "var(--border)",
              }}
            >
              {svc}
            </button>
          ))}
        </div>
      )}

      {directoryLoading ? (
        <p style={{ color: "var(--text-muted)" }}>{t("loading")}</p>
      ) : vendors.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <h2 style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "1.2rem", color: "var(--text)", marginBottom: 8 }}>{t("comingSoonTitle")}</h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", maxWidth: "48ch", margin: "0 auto", lineHeight: 1.6 }}>
            {t("comingSoonBody")}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {vendors.map((v) => (
            <div key={v.id} className="card">
              <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "1rem", color: "var(--text)", marginBottom: 6 }}>{v.companyName}</div>
              {v.bio && <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{v.bio}</p>}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {v.services.map((s) => <span key={s} style={tagStyle}>{s}</span>)}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                <span>⭐ {v.rating.toFixed(1)} ({v.reviewCount})</span>
                {v.website && (
                  <a href={v.website} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)", textDecoration: "none", fontSize: "0.75rem" }}>
                    {t("website")} →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileDetails({ profile }: { profile: VendorProfile }) {
  const t = useTranslations("vendorDashboard");
  return (
    <div className="card" style={{ padding: "20px 24px" }}>
      {profile.bio && (
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 16 }}>{profile.bio}</p>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {profile.services.length > 0 && (
          <div>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-soft)", marginBottom: 8 }}>{t("services")}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {profile.services.map((s) => <span key={s} style={{ ...tagStyle, color: "var(--gold)", borderColor: "rgba(233,160,21,0.2)", background: "var(--gold-dim)" }}>{s}</span>)}
            </div>
          </div>
        )}
        {profile.markets.length > 0 && (
          <div>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-soft)", marginBottom: 8 }}>{t("markets")}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {profile.markets.map((m) => <span key={m} style={tagStyle}>{m}</span>)}
            </div>
          </div>
        )}
      </div>
      {profile.website && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-soft)", marginBottom: 6 }}>{t("website")}</div>
          <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)", fontSize: "0.875rem", textDecoration: "none" }}>
            {profile.website}
          </a>
        </div>
      )}
    </div>
  );
}
