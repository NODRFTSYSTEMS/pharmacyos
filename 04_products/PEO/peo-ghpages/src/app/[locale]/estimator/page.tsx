"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { TermTooltip } from "@/components/TermTooltip";

export default function EstimatorPage() {
  const t = useTranslations("estimator");
  const ts = useTranslations("estimator.seller");
  const ti = useTranslations("estimator.investor");
  const tb = useTranslations("estimator.brrrr");
  const tw = useTranslations("estimator.wholesale");
  const tg = useTranslations("estimator.buyHoldGated");
  const tgloss = useTranslations("glossary");

  const [mode, setMode] = useState<"seller" | "investor">("seller");
  const [strategy, setStrategy] = useState<"flip" | "brrrr" | "wholesale" | "buyHold">("flip");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, number> | null>(null);
  const [resultMode, setResultMode] = useState<string | null>(null);

  const [sellerInputs, setSellerInputs] = useState({
    expectedSalePrice: "",
    mortgagePayoff: "",
    prepCosts: "",
    saleCostRate: "0.08",
    concessions: "",
  });

  const [flipInputs, setFlipInputs] = useState({
    purchasePrice: "",
    arv: "",
    repairs: "",
    holdMonths: "6",
    purchaseClosingRate: "0.02",
    dispositionCostRate: "0.09",
    annualInterestRate: "0.12",
    pointsRate: "0.02",
  });

  const [brrrrInputs, setBrrrrInputs] = useState({
    purchasePrice: "",
    repairs: "",
    arv: "",
    refiLtv: "0.75",
    refiInterestRate: "0.075",
    monthlyRent: "",
    operatingExpenseRate: "0.35",
  });

  const [wholesaleInputs, setWholesaleInputs] = useState({
    askPrice: "",
    arv: "",
    repairs: "",
    assignmentFee: "15000",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let body: Record<string, unknown> = { mode: "seller" };

    if (mode === "seller") {
      body = {
        mode: "seller",
        expectedSalePrice: Number(sellerInputs.expectedSalePrice) || 0,
        mortgagePayoff: Number(sellerInputs.mortgagePayoff) || 0,
        prepCosts: Number(sellerInputs.prepCosts) || 0,
        saleCostRate: Number(sellerInputs.saleCostRate) || 0,
        concessions: Number(sellerInputs.concessions) || 0,
      };
    } else if (strategy === "flip") {
      body = {
        mode: "investor",
        purchasePrice: Number(flipInputs.purchasePrice) || 0,
        arv: Number(flipInputs.arv) || 0,
        repairs: Number(flipInputs.repairs) || 0,
        holdMonths: Number(flipInputs.holdMonths) || 0,
        purchaseClosingRate: Number(flipInputs.purchaseClosingRate) || 0,
        dispositionCostRate: Number(flipInputs.dispositionCostRate) || 0,
        annualInterestRate: Number(flipInputs.annualInterestRate) || 0,
        pointsRate: Number(flipInputs.pointsRate) || 0,
      };
    } else if (strategy === "brrrr") {
      body = {
        mode: "brrrr",
        purchasePrice: Number(brrrrInputs.purchasePrice) || 0,
        repairs: Number(brrrrInputs.repairs) || 0,
        arv: Number(brrrrInputs.arv) || 0,
        refiLtv: Number(brrrrInputs.refiLtv) || 0,
        refiInterestRate: Number(brrrrInputs.refiInterestRate) || 0,
        monthlyRent: Number(brrrrInputs.monthlyRent) || 0,
        operatingExpenseRate: Number(brrrrInputs.operatingExpenseRate) || 0,
      };
    } else if (strategy === "wholesale") {
      body = {
        mode: "wholesale",
        askPrice: Number(wholesaleInputs.askPrice) || 0,
        arv: Number(wholesaleInputs.arv) || 0,
        repairs: Number(wholesaleInputs.repairs) || 0,
        assignmentFee: Number(wholesaleInputs.assignmentFee) || 0,
      };
    }

    try {
      const res = await fetch("/api/estimator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.result) {
        setResult(data.result);
        setResultMode(data.mode as string);
      }
    } finally {
      setLoading(false);
    }
  }

  const strategyTabs = (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
      <div style={{
        display: "inline-flex",
        background: "var(--surface-strong)",
        border: "1px solid var(--border)",
        borderRadius: "999px",
        padding: "4px",
        gap: "2px",
        flexWrap: "wrap",
      }}>
        {([
          { key: "flip", label: t("strategyFlip"), locked: false },
          { key: "brrrr", label: t("strategyBrrrr"), locked: false },
          { key: "wholesale", label: t("strategyWholesale"), locked: false },
          { key: "buyHold", label: t("strategyBuyHold"), locked: true },
        ] as const).map((s) => {
          const active = strategy === s.key;
          if (s.locked) {
            return (
              <Link
                key={s.key}
                href="/pricing"
                style={{
                  padding: "8px 18px",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  color: "var(--text-soft)",
                  background: "transparent",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  opacity: 0.7,
                }}
              >
                {s.label}
                <span style={{ fontSize: "0.65rem" }}>🔒</span>
              </Link>
            );
          }
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => { setStrategy(s.key as typeof strategy); setResult(null); }}
              style={{
                padding: "8px 18px",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                transition: "all 0.18s ease",
                background: active ? "var(--gold-dim)" : "transparent",
                color: active ? "var(--gold)" : "var(--text-muted)",
                fontFamily: "var(--sans)",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderInvestorForm = () => {
    if (strategy === "buyHold") {
      return (
        <div className="card" style={{ padding: "28px", textAlign: "center", background: "var(--surface-strong)", borderStyle: "dashed" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-soft)", marginBottom: "8px" }}>{tg("headline")}</div>
          <p className="body-sm" style={{ marginBottom: "16px" }}>{tg("body")}</p>
          <Link href="/pricing" className="button button-primary" style={{ fontSize: "0.82rem" }}>{tg("cta")}</Link>
        </div>
      );
    }

    return (
      <div className="card" style={{ padding: "32px", marginBottom: "24px" }}>
        {mode === "investor" && strategyTabs}
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {strategy === "flip" && (
              <>
                <InputRow id="flip-purchase-price" label={
                  <TermTooltip term={ti("purchasePrice")} definition={tgloss("basis.short")} detailHref="/academy/glossary#term-basis">
                    {ti("purchasePrice")}
                  </TermTooltip>
                } value={flipInputs.purchasePrice} onChange={(v) => setFlipInputs((s) => ({ ...s, purchasePrice: v }))} />
                <InputRow id="flip-arv" label={
                  <TermTooltip term={ti("arv")} definition={tgloss("arv.short")} detailHref="/academy/glossary#term-arv">
                    {ti("arv")}
                  </TermTooltip>
                } value={flipInputs.arv} onChange={(v) => setFlipInputs((s) => ({ ...s, arv: v }))} />
                <InputRow id="flip-repairs" label={
                  <TermTooltip term={ti("repairs")} definition={tgloss("basis.short")} detailHref="/academy/glossary#term-basis">
                    {ti("repairs")}
                  </TermTooltip>
                } value={flipInputs.repairs} onChange={(v) => setFlipInputs((s) => ({ ...s, repairs: v }))} />
                <InputRow id="flip-hold-months" label={
                  <TermTooltip term={ti("holdMonths")} definition={tgloss("holdTime.short")} detailHref="/academy/glossary#term-holdTime">
                    {ti("holdMonths")}
                  </TermTooltip>
                } value={flipInputs.holdMonths} onChange={(v) => setFlipInputs((s) => ({ ...s, holdMonths: v }))} />
                <InputRow id="flip-purchase-closing-rate" label={ti("purchaseClosingRate")} value={flipInputs.purchaseClosingRate} onChange={(v) => setFlipInputs((s) => ({ ...s, purchaseClosingRate: v }))} />
                <InputRow id="flip-disposition-cost-rate" label={
                  <TermTooltip term={ti("dispositionCostRate")} definition={tgloss("dispositionCosts.short")} detailHref="/academy/glossary#term-dispositionCosts">
                    {ti("dispositionCostRate")}
                  </TermTooltip>
                } value={flipInputs.dispositionCostRate} onChange={(v) => setFlipInputs((s) => ({ ...s, dispositionCostRate: v }))} />
                <InputRow id="flip-annual-interest-rate" label={ti("annualInterestRate")} value={flipInputs.annualInterestRate} onChange={(v) => setFlipInputs((s) => ({ ...s, annualInterestRate: v }))} />
                <InputRow id="flip-points-rate" label={
                  <TermTooltip term={ti("pointsRate")} definition={tgloss("points.short")} detailHref="/academy/glossary#term-points">
                    {ti("pointsRate")}
                  </TermTooltip>
                } value={flipInputs.pointsRate} onChange={(v) => setFlipInputs((s) => ({ ...s, pointsRate: v }))} />
              </>
            )}

            {strategy === "brrrr" && (
              <>
                <InputRow id="brrrr-purchase-price" label={tb("purchasePrice")} value={brrrrInputs.purchasePrice} onChange={(v) => setBrrrrInputs((s) => ({ ...s, purchasePrice: v }))} />
                <InputRow id="brrrr-repairs" label={tb("repairs")} value={brrrrInputs.repairs} onChange={(v) => setBrrrrInputs((s) => ({ ...s, repairs: v }))} />
                <InputRow id="brrrr-arv" label={
                  <TermTooltip term={tb("arv")} definition={tgloss("arv.short")} detailHref="/academy/glossary#term-arv">
                    {tb("arv")}
                  </TermTooltip>
                } value={brrrrInputs.arv} onChange={(v) => setBrrrrInputs((s) => ({ ...s, arv: v }))} />
                <InputRow id="brrrr-refi-ltv" label={
                  <TermTooltip term={tb("refiLtv")} definition={tgloss("ltv.short")} detailHref="/academy/glossary#term-ltv">
                    {tb("refiLtv")}
                  </TermTooltip>
                } value={brrrrInputs.refiLtv} onChange={(v) => setBrrrrInputs((s) => ({ ...s, refiLtv: v }))} />
                <InputRow id="brrrr-refi-rate" label={tb("refiInterestRate")} value={brrrrInputs.refiInterestRate} onChange={(v) => setBrrrrInputs((s) => ({ ...s, refiInterestRate: v }))} />
                <InputRow id="brrrr-monthly-rent" label={tb("monthlyRent")} value={brrrrInputs.monthlyRent} onChange={(v) => setBrrrrInputs((s) => ({ ...s, monthlyRent: v }))} />
                <InputRow id="brrrr-operating-expense-rate" label={
                  <TermTooltip term={tb("operatingExpenseRate")} definition={tgloss("opexRate.short")} detailHref="/academy/glossary#term-opexRate">
                    {tb("operatingExpenseRate")}
                  </TermTooltip>
                } value={brrrrInputs.operatingExpenseRate} onChange={(v) => setBrrrrInputs((s) => ({ ...s, operatingExpenseRate: v }))} />
              </>
            )}

            {strategy === "wholesale" && (
              <>
                <InputRow id="wholesale-ask" label={tw("askPrice")} value={wholesaleInputs.askPrice} onChange={(v) => setWholesaleInputs((s) => ({ ...s, askPrice: v }))} />
                <InputRow id="wholesale-arv" label={
                  <TermTooltip term={tw("arv")} definition={tgloss("arv.short")} detailHref="/academy/glossary#term-arv">
                    {tw("arv")}
                  </TermTooltip>
                } value={wholesaleInputs.arv} onChange={(v) => setWholesaleInputs((s) => ({ ...s, arv: v }))} />
                <InputRow id="wholesale-repairs" label={tw("repairs")} value={wholesaleInputs.repairs} onChange={(v) => setWholesaleInputs((s) => ({ ...s, repairs: v }))} />
                <InputRow id="wholesale-fee" label={tw("assignmentFee")} value={wholesaleInputs.assignmentFee} onChange={(v) => setWholesaleInputs((s) => ({ ...s, assignmentFee: v }))} />
              </>
            )}
          </div>

          <div style={{ marginTop: "28px" }}>
            <button
              type="submit"
              disabled={loading}
              className="button button-primary"
              style={{ width: "100%", justifyContent: "center", borderRadius: "var(--radius-sm)", opacity: loading ? 0.65 : 1 }}
            >
              {loading ? "Calculating…" : (
                strategy === "flip" ? ti("calculate") :
                strategy === "brrrr" ? tb("calculate") :
                strategy === "wholesale" ? tw("calculate") : "Calculate"
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const resultTitle = () => {
    if (resultMode === "seller") return ts("resultTitle");
    if (resultMode === "investor") return ti("resultTitle");
    if (resultMode === "brrrr") return tb("resultTitle");
    if (resultMode === "wholesale") return tw("resultTitle");
    return "";
  };

  const resultLabels: Record<string, string> = {
    mao: ti("mao"),
    seventyPercentMao: ti("seventyRule"),
    profit: ti("profit"),
    roi: ti("roi"),
    refiProceeds: tb("refiProceeds"),
    cashLeftIn: tb("cashLeftIn"),
    monthlyPayment: tb("monthlyPayment"),
    monthlyCashFlow: tb("monthlyCashFlow"),
    cashOnCash: tb("cashOnCash"),
    equityCapture: tb("equityCapture"),
    maxOffer: tw("maxOffer"),
    spread: tw("spread"),
    assignmentFee: tw("assignmentFeeLabel"),
    emd: tw("emd"),
    viability: tw("viability"),
  };

  return (
    <div style={{ position: "relative", zIndex: 1, padding: "64px 0 96px" }}>
      <div className="container-wide">
        {/* Header */}
        <div className="section-opener">
          <div className="eyebrow" style={{ marginBottom: "12px" }}>Free Estimator</div>
          <h1 className="heading-lg" style={{ marginBottom: "12px" }}>
            {t("title")}
          </h1>
          <p className="body-text" style={{ maxWidth: "52ch", margin: "0 auto" }}>
            {t("subtitle")}
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
          <div style={{
            display: "inline-flex",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "999px",
            padding: "4px",
            gap: "2px",
          }}>
            {(["seller", "investor"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setResult(null); }}
                style={{
                  padding: "9px 22px",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  background: mode === m ? "var(--gold)" : "transparent",
                  color: mode === m ? "#070a10" : "var(--text-muted)",
                  fontFamily: "var(--sans)",
                }}
              >
                {m === "seller" ? t("modeSeller") : t("modeInvestor")}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        {mode === "seller" ? (
          <div className="card" style={{ padding: "32px", marginBottom: "24px" }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <InputRow id="seller-expected-sale-price" label={ts("expectedSalePrice")} value={sellerInputs.expectedSalePrice} onChange={(v) => setSellerInputs((s) => ({ ...s, expectedSalePrice: v }))} />
                <InputRow id="seller-mortgage-payoff" label={ts("mortgagePayoff")} value={sellerInputs.mortgagePayoff} onChange={(v) => setSellerInputs((s) => ({ ...s, mortgagePayoff: v }))} />
                <InputRow id="seller-prep-costs" label={ts("prepCosts")} value={sellerInputs.prepCosts} onChange={(v) => setSellerInputs((s) => ({ ...s, prepCosts: v }))} />
                <InputRow id="seller-sale-cost-rate" label={ts("saleCostRate")} value={sellerInputs.saleCostRate} onChange={(v) => setSellerInputs((s) => ({ ...s, saleCostRate: v }))} />
                <InputRow id="seller-concessions" label={ts("concessions")} value={sellerInputs.concessions} onChange={(v) => setSellerInputs((s) => ({ ...s, concessions: v }))} />
              </div>
              <div style={{ marginTop: "28px" }}>
                <button type="submit" disabled={loading} className="button button-primary" style={{ width: "100%", justifyContent: "center", borderRadius: "var(--radius-sm)", opacity: loading ? 0.65 : 1 }}>
                  {loading ? "Calculating…" : ts("calculate")}
                </button>
              </div>
            </form>
          </div>
        ) : renderInvestorForm()}

        {/* Results */}
        {result && (
          <div className="card" style={{ padding: "28px" }}>
            <h2 className="heading-sm" style={{ marginBottom: "20px" }}>
              {resultTitle()}
            </h2>
            <div className="terminal-grid">
              {Object.entries(result).map(([key, value]) => {
                const label = resultLabels[key] ?? key.replace(/([A-Z])/g, " $1").trim();
                const isPct = ["roi", "cashOnCash"].includes(key);
                const isViability = key === "viability";
                return (
                  <div key={key} className="terminal-row">
                    <span className="label">{label}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", color: isViability ? (value ? "var(--green)" : "var(--red)") : "var(--gold)", textAlign: "right" }}>
                      {isViability ? (value ? "Viable" : "Not viable") :
                       isPct ? `${value}%` :
                       typeof value === "number" ? `$${value.toLocaleString()}` : value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Post-result upgrade prompt */}
        {result && (
          <div className="card" style={{ marginTop: "24px", padding: "28px 32px" }}>
            <div className="eyebrow" style={{ marginBottom: "10px" }}>Ready for verified data?</div>
            <h3 className="heading-sm" style={{ marginBottom: "10px", lineHeight: 1.35 }}>
              These are manual estimates. Get live comps, verified ARV, and a full deal analysis.
            </h3>
            <p className="body-xs" style={{ marginBottom: "20px" }}>
              Paid tiers pull real property data and qualified sold comps automatically — no manual entry required.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/investor/analyze" className="button button-primary" style={{ fontSize: "0.85rem" }}>
                Start Investor Analysis →
              </Link>
              <Link href="/pricing" className="button button-secondary" style={{ fontSize: "0.85rem" }}>
                See Pricing →
              </Link>
            </div>
          </div>
        )}

        <p style={{ marginTop: "20px", fontSize: "0.75rem", color: "var(--text-soft)", textAlign: "center", lineHeight: 1.6 }}>
          {t("disclaimer")}
        </p>
      </div>
    </div>
  );
}

function InputRow({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="input-row">
      <label
        htmlFor={id}
        className="input-row-label"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field-input"
      />
    </div>
  );
}
