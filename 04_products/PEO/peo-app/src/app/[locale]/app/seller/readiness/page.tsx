"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Gauge } from "@/components/charts/Gauge";

/* ------------------------------------------------------------------
 * Seller Readiness Plan — Pre-listing checklist tracker
 * Authority: CSM · SCA
 * ------------------------------------------------------------------ */

interface Task {
  id: string;
  label: string;
  category: string;
  completed: boolean;
  impact: "high" | "medium" | "low";
}

const DEFAULT_TASKS: Task[] = [
  { id: "t1", label: "Order pre-listing inspection", category: "Inspection", completed: false, impact: "high" },
  { id: "t2", label: "Complete deferred maintenance items", category: "Repairs", completed: false, impact: "high" },
  { id: "t3", label: "Deep clean interior + exterior", category: "Presentation", completed: false, impact: "medium" },
  { id: "t4", label: "Stage main living areas", category: "Presentation", completed: false, impact: "medium" },
  { id: "t5", label: "Professional photography scheduled", category: "Marketing", completed: false, impact: "high" },
  { id: "t6", label: "Gather improvement receipts", category: "Documentation", completed: false, impact: "medium" },
  { id: "t7", label: "Verify permit status for additions", category: "Documentation", completed: false, impact: "high" },
  { id: "t8", label: "Review HOA docs and rules", category: "Documentation", completed: false, impact: "low" },
  { id: "t9", label: "Confirm mortgage payoff amount", category: "Financial", completed: false, impact: "high" },
  { id: "t10", label: "Set target net proceeds floor", category: "Financial", completed: false, impact: "high" },
  { id: "t11", label: "Landscaping + curb appeal", category: "Presentation", completed: false, impact: "medium" },
  { id: "t12", label: "Paint touch-ups / neutral colors", category: "Presentation", completed: false, impact: "medium" },
];

function impactColor(impact: Task["impact"]): string {
  switch (impact) {
    case "high": return "var(--red)";
    case "medium": return "var(--amber)";
    case "low": return "var(--text-soft)";
  }
}

export default function SellerReadinessPage() {
  const t = useTranslations("sellerHub");
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);

  const completed = tasks.filter((t) => t.completed).length;
  const score = Math.round((completed / tasks.length) * 100);

  const byCategory = tasks.reduce<Record<string, Task[]>>((acc, t) => {
    acc[t.category] = acc[t.category] ?? [];
    acc[t.category].push(t);
    return acc;
  }, {});

  function toggle(id: string) {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{t("eyebrow")}</div>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 24 }}>
        {t("readinessPlan")}
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Gauge value={score} size={100} stroke={6} label="Readiness" />
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Progress</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "1.4rem", color: "var(--gold)", fontWeight: 500 }}>{completed}/{tasks.length}</div>
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize: "0.72rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>High Impact Remaining</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "1.4rem", color: "var(--red)", fontWeight: 500 }}>
            {tasks.filter((t) => t.impact === "high" && !t.completed).length}
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize: "0.72rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Categories</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "1.4rem", color: "var(--text)", fontWeight: 500 }}>
            {Object.keys(byCategory).length}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {Object.entries(byCategory).map(([category, items]) => (
          <div key={category} className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", background: "var(--surface-strong)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--gold)" }}>{category}</div>
            </div>
            <div style={{ padding: "8px 0" }}>
              {items.map((t) => (
                <label key={t.id} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 24px", cursor: "pointer",
                  transition: "background 0.15s ease",
                }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                  <input type="checkbox" checked={t.completed} onChange={() => toggle(t.id)} style={{ cursor: "pointer", width: 18, height: 18 }} />
                  <span style={{
                    flex: 1, fontSize: "0.85rem",
                    color: t.completed ? "var(--text-soft)" : "var(--text)",
                    textDecoration: t.completed ? "line-through" : "none",
                    opacity: t.completed ? 0.6 : 1,
                  }}>
                    {t.label}
                  </span>
                  <span style={{
                    fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                    padding: "2px 8px", borderRadius: 4,
                    color: impactColor(t.impact),
                    background: `${impactColor(t.impact)}15`,
                    border: `1px solid ${impactColor(t.impact)}30`,
                  }}>
                    {t.impact}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
