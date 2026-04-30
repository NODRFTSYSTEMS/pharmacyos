"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";

interface AdminUser {
  id: string;
  clerkId: string;
  email: string;
  role: string;
  preferredLang: string;
  createdAt: string;
}

interface AdminApplication {
  id: string;
  context: string;
  address: string;
  userId: string;
  createdAt: string;
  user?: { email?: string };
}

type RoleStatus = "idle" | "saving" | "saved" | "error";

const ROLES = [
  "anonymous_visitor",
  "free_user",
  "seller",
  "investor_core",
  "investor_elite",
  "vendor",
  "admin_internal",
];

const ROLE_COLORS: Record<string, string> = {
  admin_internal: "var(--red)",
  investor_elite: "var(--gold)",
  investor_core: "#7c7ce8",
  seller: "var(--green)",
  vendor: "var(--amber)",
  free_user: "var(--text-soft)",
  anonymous_visitor: "var(--text-muted)",
};

const thStyle: React.CSSProperties = {
  fontSize: "0.68rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--text-soft)",
  padding: "8px 14px",
  textAlign: "left",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 14px",
  fontSize: "0.82rem",
  color: "var(--text)",
  borderBottom: "1px solid rgba(255,255,255,0.04)",
  verticalAlign: "middle",
};

export default function AdminDashboardPage() {
  const t = useTranslations("admin");

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersTotal, setUsersTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [roleStatus, setRoleStatus] = useState<Record<string, RoleStatus>>({});

  // Applications state
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [appsTotal, setAppsTotal] = useState(0);
  const [contextFilter, setContextFilter] = useState("");

  const loadUsers = useCallback(() => {
    setUsersLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (roleFilter) params.set("role", roleFilter);
    fetch(`/api/admin/users?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users ?? []);
        setUsersTotal(data.total ?? 0);
        setUsersLoading(false);
      })
      .catch(() => setUsersLoading(false));
  }, [debouncedSearch, roleFilter]);

  const loadApplications = useCallback(() => {
    setAppsLoading(true);
    const params = new URLSearchParams();
    if (contextFilter) params.set("context", contextFilter);
    fetch(`/api/admin/applications?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setApplications(data.applications ?? []);
        setAppsTotal(data.total ?? 0);
        setAppsLoading(false);
      })
      .catch(() => setAppsLoading(false));
  }, [contextFilter]);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm), 350);
    return () => clearTimeout(id);
  }, [searchTerm]);

  useEffect(() => { loadUsers(); }, [loadUsers]);
  useEffect(() => { loadApplications(); }, [loadApplications]);

  async function assignRole(userId: string, newRole: string) {
    setRoleStatus((s) => ({ ...s, [userId]: "saving" }));
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
        setRoleStatus((s) => ({ ...s, [userId]: "saved" }));
        setTimeout(() => setRoleStatus((s) => ({ ...s, [userId]: "idle" })), 2000);
      } else {
        setRoleStatus((s) => ({ ...s, [userId]: "error" }));
        setTimeout(() => setRoleStatus((s) => ({ ...s, [userId]: "idle" })), 2000);
      }
    } catch {
      setRoleStatus((s) => ({ ...s, [userId]: "error" }));
      setTimeout(() => setRoleStatus((s) => ({ ...s, [userId]: "idle" })), 2000);
    }
  }

  const inputStyle: React.CSSProperties = {
    background: "var(--surface-strong)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "7px 12px",
    color: "var(--text)",
    fontFamily: "var(--sans)",
    fontSize: "0.82rem",
    outline: "none",
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{t("eyebrow")}</div>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 24 }}>
        {t("title")}
      </h1>

      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {([
          { label: t("totalUsers"), value: usersLoading ? "…" : String(usersTotal) },
          { label: t("activeAnalyses"), value: appsLoading ? "…" : String(appsTotal) },
          { label: t("revenueMtd"), value: "$—" },
          { label: t("churnRate"), value: "—" },
        ] as { label: string; value: string }[]).map((m) => (
          <div key={m.label} className="card">
            <div style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-soft)", marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "1.6rem", fontWeight: 500, color: "var(--text)", letterSpacing: "-0.02em" }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Users section */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <h2 style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "1rem", color: "var(--text)" }}>
            {t("usersSection")} {usersTotal > 0 && <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text-soft)", fontWeight: 400 }}>({usersTotal})</span>}
          </h2>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="text"
              placeholder={t("searchUsers")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...inputStyle, width: 200 }}
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">{t("filterRole")}</option>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {usersLoading ? (
            <div style={{ padding: "24px 20px", color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading…</div>
          ) : users.length === 0 ? (
            <div style={{ padding: "24px 20px", color: "var(--text-muted)", fontSize: "0.875rem" }}>{t("noUsers")}</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>{t("email")}</th>
                    <th style={thStyle}>{t("role")}</th>
                    <th style={thStyle}>{t("joined")}</th>
                    <th style={thStyle}>{t("assignRole")}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const status = roleStatus[user.id] ?? "idle";
                    return (
                      <tr key={user.id}>
                        <td style={tdStyle}>
                          <span style={{ fontSize: "0.82rem" }}>{user.email}</span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            padding: "2px 8px",
                            borderRadius: 4,
                            border: "1px solid",
                            color: ROLE_COLORS[user.role] ?? "var(--text-soft)",
                            borderColor: `${ROLE_COLORS[user.role] ?? "var(--border)"}44`,
                            background: `${ROLE_COLORS[user.role] ?? "transparent"}18`,
                          }}>
                            {user.role}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text-soft)" }}>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <select
                              value={user.role}
                              onChange={(e) => { if (e.target.value !== user.role) assignRole(user.id, e.target.value); }}
                              disabled={status === "saving"}
                              style={{
                                ...inputStyle,
                                padding: "4px 8px",
                                fontSize: "0.75rem",
                                cursor: status === "saving" ? "wait" : "pointer",
                                opacity: status === "saving" ? 0.6 : 1,
                              }}
                            >
                              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                            {status === "saved" && (
                              <span style={{ fontSize: "0.72rem", color: "var(--green)", fontWeight: 600 }}>{t("roleSaved")}</span>
                            )}
                            {status === "error" && (
                              <span style={{ fontSize: "0.72rem", color: "var(--red)", fontWeight: 600 }}>{t("roleError")}</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Applications section */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <h2 style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "1rem", color: "var(--text)" }}>
            {t("applicationsSection")} {appsTotal > 0 && <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text-soft)", fontWeight: 400 }}>({appsTotal})</span>}
          </h2>
          <select
            value={contextFilter}
            onChange={(e) => setContextFilter(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="">All Types</option>
            <option value="seller_analysis">Seller</option>
            <option value="investor_basic">Investor Basic</option>
            <option value="investor_advanced">Investor Advanced</option>
          </select>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {appsLoading ? (
            <div style={{ padding: "24px 20px", color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading…</div>
          ) : applications.length === 0 ? (
            <div style={{ padding: "24px 20px", color: "var(--text-muted)", fontSize: "0.875rem" }}>{t("noApplications")}</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>{t("addressCol")}</th>
                    <th style={thStyle}>{t("typeCol")}</th>
                    <th style={thStyle}>{t("userCol")}</th>
                    <th style={thStyle}>{t("dateCol")}</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td style={tdStyle}>
                        <span style={{ fontSize: "0.82rem" }}>{app.address || "—"}</span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: "var(--bg-alt)",
                          color: "var(--text-soft)",
                          border: "1px solid var(--border)",
                        }}>
                          {app.context}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          {app.user?.email ?? app.userId.slice(0, 8) + "…"}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text-soft)" }}>
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
