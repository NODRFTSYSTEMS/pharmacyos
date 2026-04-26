"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

const categories = ["All", "Fix & Flip", "Rental", "Commercial", "General"] as const;
type Category = (typeof categories)[number];

const templates: { title: string; desc: string; category: Exclude<Category, "All"> }[] = [
  { title: "Rehab Budget Template", category: "Fix & Flip", desc: "Organizes renovation scope, contractor estimates, and contingency planning against the underwriting case." },
  { title: "Scope Of Work Checklist", category: "Fix & Flip", desc: "Standardizes the scope review process before repair assumptions are locked into the model." },
  { title: "Rent Comparability Sheet", category: "Rental", desc: "Connects rent assumptions to comparable market evidence and underwriting support." },
  { title: "Expense Tracker", category: "Rental", desc: "Provides recurring operating cost structure for cleaner NOI and cash flow projections." },
  { title: "NOI And Cap Rate Analyzer", category: "Commercial", desc: "Frames commercial income quality and valuation multiples in one structured worksheet." },
  { title: "Debt Service Coverage Worksheet", category: "Commercial", desc: "Supports lender conversations and DSCR validation for stabilized commercial scenarios." },
  { title: "Purchase Contract Checklist", category: "General", desc: "Translates approved underwriting into an organized execution checklist for the next step." },
  { title: "Due Diligence Timeline", category: "General", desc: "Helps operators map critical milestones after a deal clears initial analysis." },
  { title: "Closing Cost Estimator", category: "General", desc: "Captures transaction friction that should be reflected in seller pricing and investor returns." },
];

const categoryColors: Record<Exclude<Category, "All">, string> = {
  "Fix & Flip": "var(--gold)",
  "Rental": "var(--green)",
  "Commercial": "var(--blue)",
  "General": "var(--teal)",
};

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");

  const filtered = templates.filter((t) => {
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    const matchSearch = search === "" || t.title.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Hero */}
      <section style={{ padding: "80px 0 52px" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <Link href="/academy" style={{ fontSize: "0.72rem", color: "var(--text-soft)", textDecoration: "none" }}>Academy</Link>
            <span style={{ color: "var(--text-soft)", fontSize: "0.72rem" }}>/</span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Templates</span>
            <span style={{ marginLeft: "4px", padding: "2px 8px", borderRadius: "4px", background: "var(--gold-dim)", border: "1px solid rgba(233,160,21,0.2)", fontSize: "0.65rem", color: "var(--gold)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Free</span>
          </div>
          <div className="eyebrow" style={{ marginBottom: "14px" }}>Templates</div>
          <h1 className="display compact" style={{ marginBottom: "20px" }}>
            Execution templates that turn underwriting into action.
          </h1>
          <p className="lead" style={{ maxWidth: "68ch" }}>
            Templates are the operational layer of Peak Equity Optimizer. They move users from analysis to decisions, documentation, and process control with less friction.
          </p>
        </div>
      </section>

      {/* Directory */}
      <section style={{ padding: "0 0 96px" }}>
        <div className="container">
          {/* Toolbar */}
          <div className="card" style={{ padding: "20px 24px", marginBottom: "28px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search by category, metric, or use case"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field-input"
              style={{ flex: "1", minWidth: "200px" }}
            />
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "999px",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    border: "1px solid",
                    cursor: "pointer",
                    fontFamily: "var(--sans)",
                    transition: "all 0.15s ease",
                    borderColor: activeCategory === cat ? "var(--gold)" : "var(--border)",
                    background: activeCategory === cat ? "var(--gold-dim)" : "transparent",
                    color: activeCategory === cat ? "var(--gold)" : "var(--text-muted)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div style={{ fontSize: "0.78rem", color: "var(--text-soft)", marginBottom: "20px" }}>
            {filtered.length} template{filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "All" && ` in ${activeCategory}`}
            {search && ` matching "${search}"`}
          </div>

          {/* Cards */}
          {filtered.length > 0 ? (
            <div className="grid-3">
              {filtered.map((t) => (
                <div key={t.title} className="feature-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <span style={{ padding: "3px 8px", borderRadius: "4px", fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(255,255,255,0.06)", color: categoryColors[t.category] }}>
                      {t.category}
                    </span>
                  </div>
                  <h3 className="heading-sm" style={{ marginBottom: "10px", lineHeight: 1.35 }}>
                    {t.title}
                  </h3>
                  <p className="body-xs">
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: "48px" }}>
              <p className="body-text" style={{ color: "var(--text-soft)" }}>No templates match your search.</p>
            </div>
          )}

          {/* CTA */}
          <div className="note-panel" style={{ marginTop: "48px", display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "240px" }}>
              <div className="card-kicker">Ready to use them?</div>
              <p className="body-text">
                Templates are included in paid plans. Review pricing to see which tier fits your workflow, or return to the Academy for the full educational foundation.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
              <Link href="/academy" className="button button-secondary" style={{ fontSize: "0.82rem", minHeight: "40px", padding: "9px 18px" }}>← Back to Academy</Link>
              <Link href="/pricing" className="button button-primary" style={{ fontSize: "0.82rem", minHeight: "40px", padding: "9px 18px" }}>View Pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
