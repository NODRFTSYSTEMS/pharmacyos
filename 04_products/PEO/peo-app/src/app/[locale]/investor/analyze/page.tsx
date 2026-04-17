"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { TermTooltip } from "@/components/TermTooltip";

type KillSwitchId =
  | "foundation" | "knob-tube" | "galvanized-plumbing" | "active-roof-leak"
  | "lead-paint" | "moisture-mold" | "unpermitted-work" | "failed-septic" | "hvac-replacement";

type KillSwitchSeverity = "CRITICAL" | "HIGH" | "MEDIUM";

const KILL_SWITCHES: { id: KillSwitchId; label: string; severity: KillSwitchSeverity; costRange: string }[] = [
  { id: "foundation",          label: "Foundation Issues",       severity: "CRITICAL", costRange: "$18k–$45k" },
  { id: "knob-tube",           label: "Knob-and-Tube Wiring",    severity: "HIGH",     costRange: "$8k–$18k"  },
  { id: "galvanized-plumbing", label: "Galvanized Plumbing",     severity: "HIGH",     costRange: "$6k–$14k"  },
  { id: "active-roof-leak",    label: "Active Roof Leak",        severity: "HIGH",     costRange: "$5k–$13k"  },
  { id: "lead-paint",          label: "Lead Paint",              severity: "MEDIUM",   costRange: "$1.5k–$7k" },
  { id: "moisture-mold",       label: "Moisture / Mold",         severity: "HIGH",     costRange: "$3k–$12k"  },
  { id: "unpermitted-work",    label: "Unpermitted Work",        severity: "MEDIUM",   costRange: "$2k–$10k"  },
  { id: "failed-septic",       label: "Failed Septic System",    severity: "CRITICAL", costRange: "$15k–$35k" },
  { id: "hvac-replacement",    label: "HVAC Replacement",        severity: "MEDIUM",   costRange: "$5k–$12k"  },
];

const SEVERITY_COLORS: Record<KillSwitchSeverity, string> = {
  CRITICAL: "var(--red)",
  HIGH:     "var(--amber)",
  MEDIUM:   "var(--text-soft)",
};

export default function InvestorAnalyzePage() {
  const t = useTranslations("investorAnalysis");
  const tg = useTranslations("glossary");
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showKillSwitches, setShowKillSwitches] = useState(false);

  const [activeKillSwitches, setActiveKillSwitches] = useState<Set<KillSwitchId>>(new Set());
  const [investorProfile, setInvestorProfile] = useState<"conservative" | "balanced" | "aggressive">("balanced");

  const [form, setForm] = useState({
    address: "",
    purchasePrice: "",
    arv: "",
    repairs: "",
    holdMonths: "6",
    purchaseClosingRate: "0.02",
    dispositionCostRate: "0.09",
    annualInterestRate: "0.12",
    pointsRate: "0.02",
    monthlyRent: "",
    operatingExpenseRate: "",
    refiLtv: "",
    refiInterestRate: "",
    refiTermYears: "",
    contractPrice: "",
    cashInvested: "",
    globalRegionalMultiplier: "1",
  });

  const [rehabItems, setRehabItems] = useState<
    { category: string; description: string; quantity: string; unitCost: string; regionalMultiplier: string }[]
  >([]);

  function toggleKillSwitch(id: KillSwitchId) {
    setActiveKillSwitches((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: Record<string, unknown> = {
      address: form.address,
      purchasePrice: Number(form.purchasePrice) || 0,
      arv: Number(form.arv) || 0,
      repairs: Number(form.repairs) || 0,
      holdMonths: Number(form.holdMonths) || 6,
      purchaseClosingRate: Number(form.purchaseClosingRate) || 0.02,
      dispositionCostRate: Number(form.dispositionCostRate) || 0.09,
      annualInterestRate: Number(form.annualInterestRate) || 0.12,
      pointsRate: Number(form.pointsRate) || 0.02,
      activeKillSwitches: Array.from(activeKillSwitches),
      investorProfile,
    };

    if (showAdvanced) {
      payload.monthlyRent = Number(form.monthlyRent) || 0;
      payload.operatingExpenseRate = Number(form.operatingExpenseRate) || 0;
      payload.refiLtv = Number(form.refiLtv) || 0;
      payload.refiInterestRate = Number(form.refiInterestRate) || 0;
      payload.refiTermYears = Number(form.refiTermYears) || 0;
      payload.contractPrice = Number(form.contractPrice) || 0;
      payload.cashInvested = Number(form.cashInvested) || 0;
      payload.globalRegionalMultiplier = Number(form.globalRegionalMultiplier) || 1;
      payload.rehabItems = rehabItems.map((item) => ({
        category: item.category,
        description: item.description,
        quantity: Number(item.quantity) || 0,
        unitCost: Number(item.unitCost) || 0,
        regionalMultiplier: Number(item.regionalMultiplier) || undefined,
      }));
    }

    const endpoint =
      process.env.NEXT_PUBLIC_DEV_BYPASS === "true"
        ? "/api/test/analysis"
        : "/api/investor/analysis";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.analysis?.applicationId) {
        const aid = data.analysis.applicationId;
        if (aid.startsWith("dev-")) {
          sessionStorage.setItem(`dev-analysis-${aid}`, JSON.stringify(data.analysis));
        }
        router.push(`/${locale}/investor/analysis/${aid}`);
      } else {
        setError(data.error || t("submitError"));
      }
    } catch {
      setError(t("submitError"));
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--surface-strong)", border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)", padding: "10px 12px", color: "var(--text)",
    fontFamily: "var(--sans)", fontSize: "0.875rem", outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: "0.78rem", fontWeight: 600, color: "var(--text-soft)",
    textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px", display: "block",
  };
  const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" };
  const grid3: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" };

  const killSwitchCount = activeKillSwitches.size;

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <section style={{ padding: "64px 0 48px" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <div className="eyebrow" style={{ marginBottom: "10px" }}>Investor Platform</div>
          <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "8px" }}>
            {t("newTitle")}
          </h1>
        </div>
      </section>

      <section style={{ padding: "0 0 96px" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          {error && (
            <div style={{ background: "var(--red-dim)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: "var(--radius-sm)", padding: "12px 16px", color: "var(--red)", fontSize: "0.875rem", marginBottom: "20px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Address */}
              <InputField id="inv-address" label={t("address")} value={form.address}
                onChange={(v) => setForm((f) => ({ ...f, address: v }))} required
                inputStyle={inputStyle} labelStyle={labelStyle} />

              {/* Core fields */}
              <div style={grid2}>
                <InputField id="inv-purchase-price" label={t("purchasePrice")} value={form.purchasePrice}
                  onChange={(v) => setForm((f) => ({ ...f, purchasePrice: v }))} inputMode="decimal" required
                  inputStyle={inputStyle} labelStyle={labelStyle} />
                <InputField id="inv-arv" label={
                  <TermTooltip term={t("arv")} definition={tg("arv.short")} detailHref="/academy/glossary#term-arv">
                    {t("arv")}
                  </TermTooltip>
                } value={form.arv}
                  onChange={(v) => setForm((f) => ({ ...f, arv: v }))} inputMode="decimal" required
                  inputStyle={inputStyle} labelStyle={labelStyle} />
              </div>

              <div style={grid2}>
                <InputField id="inv-repairs" label={t("repairs")} value={form.repairs}
                  onChange={(v) => setForm((f) => ({ ...f, repairs: v }))} inputMode="decimal" required
                  inputStyle={inputStyle} labelStyle={labelStyle} />
                <InputField id="inv-hold-months" label={
                  <TermTooltip term={t("holdMonths")} definition={tg("holdTime.short")} detailHref="/academy/glossary#term-holdTime">
                    {t("holdMonths")}
                  </TermTooltip>
                } value={form.holdMonths}
                  onChange={(v) => setForm((f) => ({ ...f, holdMonths: v }))} inputMode="decimal" required
                  inputStyle={inputStyle} labelStyle={labelStyle} />
              </div>

              <div style={grid2}>
                <InputField id="inv-purchase-closing" label={t("purchaseClosingRate")} value={form.purchaseClosingRate}
                  onChange={(v) => setForm((f) => ({ ...f, purchaseClosingRate: v }))} inputMode="decimal" required
                  inputStyle={inputStyle} labelStyle={labelStyle} />
                <InputField id="inv-disposition" label={
                  <TermTooltip term={t("dispositionCostRate")} definition={tg("dispositionCosts.short")} detailHref="/academy/glossary#term-dispositionCosts">
                    {t("dispositionCostRate")}
                  </TermTooltip>
                } value={form.dispositionCostRate}
                  onChange={(v) => setForm((f) => ({ ...f, dispositionCostRate: v }))} inputMode="decimal" required
                  inputStyle={inputStyle} labelStyle={labelStyle} />
              </div>

              <div style={grid2}>
                <InputField id="inv-interest" label={t("annualInterestRate")} value={form.annualInterestRate}
                  onChange={(v) => setForm((f) => ({ ...f, annualInterestRate: v }))} inputMode="decimal" required
                  inputStyle={inputStyle} labelStyle={labelStyle} />
                <InputField id="inv-points" label={
                  <TermTooltip term={t("pointsRate")} definition={tg("points.short")} detailHref="/academy/glossary#term-points">
                    {t("pointsRate")}
                  </TermTooltip>
                } value={form.pointsRate}
                  onChange={(v) => setForm((f) => ({ ...f, pointsRate: v }))} inputMode="decimal" required
                  inputStyle={inputStyle} labelStyle={labelStyle} />
              </div>

              {/* Kill Switch Checklist */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setShowKillSwitches((s) => !s)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setShowKillSwitches((s) => !s); } }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)", fontSize: "0.85rem", fontWeight: 600, padding: 0, display: "flex", alignItems: "center", gap: "8px", width: "100%" }}
                >
                  <span style={{ fontSize: "0.7rem" }}>{showKillSwitches ? "▾" : "▸"}</span>
                  <TermTooltip term="Property Condition Flags (Kill Switches)" definition={tg("killSwitch.short")} detailHref="/academy/glossary#term-killSwitch">
                    <span>Property Condition Flags (Kill Switches)</span>
                  </TermTooltip>
                  {killSwitchCount > 0 && (
                    <span style={{ marginLeft: "auto", background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: "4px", padding: "2px 8px", fontSize: "0.72rem", fontWeight: 700 }}>
                      {killSwitchCount} active
                    </span>
                  )}
                </div>

                {showKillSwitches && (
                  <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-soft)", marginBottom: "10px", lineHeight: 1.6 }}>
                      Check any condition issues present. These adjust the MAO downward before the 70% rule is applied.
                    </p>
                    {KILL_SWITCHES.map((ks) => (
                      <label
                        key={ks.id}
                        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", background: activeKillSwitches.has(ks.id) ? "var(--red-dim)" : "var(--surface-strong)", border: `1px solid ${activeKillSwitches.has(ks.id) ? "rgba(231,76,60,0.3)" : "var(--border)"}`, borderRadius: "var(--radius-sm)", cursor: "pointer" }}
                      >
                        <input
                          type="checkbox"
                          checked={activeKillSwitches.has(ks.id)}
                          onChange={() => toggleKillSwitch(ks.id)}
                          style={{ accentColor: "var(--red)", width: "15px", height: "15px", flexShrink: 0 }}
                        />
                        <TermTooltip term={ks.label} definition={tg("killSwitch.short")} detailHref="/academy/glossary#term-killSwitch">
                          <span style={{ flex: 1, fontSize: "0.85rem", color: "var(--text)", fontWeight: activeKillSwitches.has(ks.id) ? 600 : 400 }}>
                            {ks.label}
                          </span>
                        </TermTooltip>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: SEVERITY_COLORS[ks.severity], letterSpacing: "0.06em", flexShrink: 0 }}>
                          {ks.severity}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", flexShrink: 0, fontFamily: "var(--mono)" }}>
                          {ks.costRange}
                        </span>
                      </label>
                    ))}
                    {killSwitchCount > 0 && (
                      <div style={{ marginTop: "8px", padding: "10px 14px", background: "var(--red-dim)", border: "1px solid rgba(231,76,60,0.2)", borderRadius: "var(--radius-sm)", fontSize: "0.78rem", color: "var(--red)" }}>
                        {killSwitchCount} issue{killSwitchCount > 1 ? "s" : ""} flagged — midpoint cost estimates will be deducted from MAO.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Investor Profile — visible to all */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                <div style={labelStyle}>
                  <TermTooltip term="Investor Profile" definition={tg("riskBand.short")} detailHref="/academy/glossary#term-riskBand">
                    Investor Profile
                  </TermTooltip>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  {(["conservative", "balanced", "aggressive"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setInvestorProfile(p)}
                      style={{
                        flex: 1, padding: "10px 8px", border: `1px solid ${investorProfile === p ? "var(--gold)" : "var(--border)"}`,
                        borderRadius: "var(--radius-sm)", background: investorProfile === p ? "var(--gold-dim)" : "var(--surface-strong)",
                        color: investorProfile === p ? "var(--gold)" : "var(--text-soft)", cursor: "pointer",
                        fontSize: "0.78rem", fontWeight: investorProfile === p ? 700 : 400, textTransform: "capitalize", letterSpacing: "0.04em",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-soft)", marginTop: "6px" }}>
                  {investorProfile === "conservative" && "Conservative — $40k profit floor, 22% target ROI, 16% elevated threshold"}
                  {investorProfile === "balanced"     && "Balanced — $30k profit floor, 15% target ROI, 15% elevated threshold (default)"}
                  {investorProfile === "aggressive"   && "Aggressive — $22k profit floor, 12% target ROI, 12% elevated threshold"}
                </div>
              </div>

              {/* Advanced toggle */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setShowAdvanced((s) => !s)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gold)", fontSize: "0.85rem", fontWeight: 600, padding: 0, display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span style={{ fontSize: "0.7rem" }}>{showAdvanced ? "▾" : "▸"}</span>
                  {showAdvanced ? t("hideAdvanced") : t("showAdvanced")}
                </button>
              </div>

              {showAdvanced && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {t("advancedFields")}
                  </div>

                  <div style={grid2}>
                    <InputField id="inv-monthly-rent" label={t("monthlyRent")} value={form.monthlyRent}
                      onChange={(v) => setForm((f) => ({ ...f, monthlyRent: v }))} inputMode="decimal"
                      inputStyle={inputStyle} labelStyle={labelStyle} />
                    <InputField id="inv-operating-expense" label={
                      <TermTooltip term={t("operatingExpenseRate")} definition={tg("opexRate.short")} detailHref="/academy/glossary#term-opexRate">
                        {t("operatingExpenseRate")}
                      </TermTooltip>
                    } value={form.operatingExpenseRate}
                      onChange={(v) => setForm((f) => ({ ...f, operatingExpenseRate: v }))} inputMode="decimal"
                      inputStyle={inputStyle} labelStyle={labelStyle} />
                  </div>

                  <div style={grid3}>
                    <InputField id="inv-refi-ltv" label={
                      <TermTooltip term={t("refiLtv")} definition={tg("ltv.short")} detailHref="/academy/glossary#term-ltv">
                        {t("refiLtv")}
                      </TermTooltip>
                    } value={form.refiLtv}
                      onChange={(v) => setForm((f) => ({ ...f, refiLtv: v }))} inputMode="decimal"
                      inputStyle={inputStyle} labelStyle={labelStyle} />
                    <InputField id="inv-refi-rate" label={t("refiInterestRate")} value={form.refiInterestRate}
                      onChange={(v) => setForm((f) => ({ ...f, refiInterestRate: v }))} inputMode="decimal"
                      inputStyle={inputStyle} labelStyle={labelStyle} />
                    <InputField id="inv-refi-term" label={t("refiTermYears")} value={form.refiTermYears}
                      onChange={(v) => setForm((f) => ({ ...f, refiTermYears: v }))} inputMode="decimal"
                      inputStyle={inputStyle} labelStyle={labelStyle} />
                  </div>

                  <div style={grid3}>
                    <InputField id="inv-contract-price" label={t("contractPrice")} value={form.contractPrice}
                      onChange={(v) => setForm((f) => ({ ...f, contractPrice: v }))} inputMode="decimal"
                      inputStyle={inputStyle} labelStyle={labelStyle} />
                    <InputField id="inv-cash-invested" label={
                      <TermTooltip term={t("cashInvested")} definition={tg("cashOnCash.short")} detailHref="/academy/glossary#term-cashOnCash">
                        {t("cashInvested")}
                      </TermTooltip>
                    } value={form.cashInvested}
                      onChange={(v) => setForm((f) => ({ ...f, cashInvested: v }))} inputMode="decimal"
                      inputStyle={inputStyle} labelStyle={labelStyle} />
                    <InputField id="inv-regional-multiplier" label={t("globalRegionalMultiplier")} value={form.globalRegionalMultiplier}
                      onChange={(v) => setForm((f) => ({ ...f, globalRegionalMultiplier: v }))} inputMode="decimal"
                      inputStyle={inputStyle} labelStyle={labelStyle} />
                  </div>

                  {/* Rehab items */}
                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
                      {t("rehabItems")}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {rehabItems.map((item, idx) => (
                        <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 80px 80px 32px", gap: "8px", alignItems: "end" }}>
                          <input type="text" placeholder="Category" value={item.category}
                            onChange={(e) => { const n = [...rehabItems]; n[idx].category = e.target.value; setRehabItems(n); }}
                            style={inputStyle} />
                          <input type="text" placeholder="Description" value={item.description}
                            onChange={(e) => { const n = [...rehabItems]; n[idx].description = e.target.value; setRehabItems(n); }}
                            style={inputStyle} />
                          <input type="text" inputMode="decimal" placeholder="Qty" value={item.quantity}
                            onChange={(e) => { const n = [...rehabItems]; n[idx].quantity = e.target.value; setRehabItems(n); }}
                            style={inputStyle} />
                          <input type="text" inputMode="decimal" placeholder="Cost" value={item.unitCost}
                            onChange={(e) => { const n = [...rehabItems]; n[idx].unitCost = e.target.value; setRehabItems(n); }}
                            style={inputStyle} />
                          <button type="button"
                            onClick={() => { const n = [...rehabItems]; n.splice(idx, 1); setRehabItems(n); }}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)", fontSize: "1rem", padding: "8px 0" }}>
                            ×
                          </button>
                        </div>
                      ))}
                      <button type="button"
                        onClick={() => setRehabItems((items) => [...items, { category: "", description: "", quantity: "", unitCost: "", regionalMultiplier: "" }])}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gold)", fontSize: "0.82rem", fontWeight: 600, padding: 0, textAlign: "left", width: "fit-content" }}>
                        + {t("addRehabItem")}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
                <button type="submit" disabled={loading} className="button button-primary"
                  style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.6 : 1 }}>
                  {loading ? t("running") : t("runAnalysis")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

function InputField({
  id, label, value, onChange, required, inputMode, inputStyle, labelStyle,
}: {
  id: string; label: React.ReactNode; value: string;
  onChange: (v: string) => void;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  inputStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor={id} style={labelStyle}>
        {label}{required && <span style={{ color: "var(--red)", marginLeft: "3px" }} aria-hidden>*</span>}
      </label>
      <input
        id={id} type="text" inputMode={inputMode}
        required={required} aria-required={required}
        value={value} onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      />
    </div>
  );
}
