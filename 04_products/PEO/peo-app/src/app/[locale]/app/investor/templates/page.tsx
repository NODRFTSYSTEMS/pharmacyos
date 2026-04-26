"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/* ------------------------------------------------------------------
 * Document Templates — Surpasses Deal Underwriter Pro v4.2
 * Authority: DSS · CSM
 * ------------------------------------------------------------------
 * Templates: LOI, Price Reduction, EMD Agreement, Assignment Contract
 * ------------------------------------------------------------------ */

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
}

const TEMPLATES: Template[] = [
  {
    id: "loi",
    title: "Letter of Intent (LOI)",
    description: "Non-binding expression of interest for purchase. Sets terms before formal contract.",
    category: "Acquisition",
    content: `LETTER OF INTENT

Date: _______________

Seller: _______________
Property: _______________
Buyer: _______________

1. PURCHASE PRICE: $_______________
2. EARNEST MONEY: $_______________
3. DUE DILIGENCE PERIOD: ___ days
4. CLOSING DATE: _______________
5. CONTINGENCIES: [ ] Financing [ ] Inspection [ ] Appraisal
6. ASSIGNMENT: [ ] Permitted [ ] Not permitted

This letter constitutes an expression of intent only and is not legally binding except for confidentiality and exclusivity provisions.

Signature: _______________ Date: _______________`,
  },
  {
    id: "price-reduction",
    title: "Price Reduction Request",
    description: "Formal request to reduce contract price based on inspection findings or appraisal gap.",
    category: "Negotiation",
    content: `PRICE REDUCTION REQUEST

Date: _______________
Re: Property at _______________
Contract Date: _______________

Dear Seller / Seller's Agent:

Pursuant to the inspection contingency in the purchase agreement dated _______________, the buyer requests a price reduction of $_______________ based on the following findings:

1. _______________ — Est. cost: $_______
2. _______________ — Est. cost: $_______
3. _______________ — Est. cost: $_______

Total requested reduction: $_______________
Revised purchase price: $_______________

This request expires at 5:00 PM on _______________. Failure to respond constitutes rejection.

Buyer Signature: _______________`,
  },
  {
    id: "emd",
    title: "Earnest Money Agreement",
    description: "Defines EMD amount, holding instructions, release conditions, and default provisions.",
    category: "Escrow",
    content: `EARNEST MONEY DEPOSIT AGREEMENT

Date: _______________
Property: _______________
Buyer: _______________
Seller: _______________

DEPOSIT AMOUNT: $_______________
HOLDING AGENT: _______________
ESCROW ACCOUNT: _______________

RELEASE CONDITIONS:
1. Closing — EMD applied to purchase price
2. Buyer default — Forfeited to seller
3. Seller default — Returned to buyer + $_______________ liquidated damages
4. Mutual cancellation — Returned to buyer
5. Financing denial (if contingent) — Returned to buyer within 3 business days

DISPUTE RESOLUTION: Mediation → Arbitration

Buyer: _______________ Date: _______________
Seller: _______________ Date: _______________`,
  },
  {
    id: "assignment",
    title: "Assignment of Contract",
    description: "Assigns purchase contract rights to end buyer. Defines assignment fee and liability.",
    category: "Wholesale",
    content: `ASSIGNMENT OF REAL ESTATE PURCHASE AGREEMENT

Date: _______________
Original Contract Date: _______________
Property: _______________

Assignor (Wholesaler): _______________
Assignee (End Buyer): _______________

ORIGINAL CONTRACT PRICE: $_______________
ASSIGNMENT FEE: $_______________
ASSIGNEE TOTAL PRICE: $_______________

TERMS:
1. Assignor assigns all rights in the original contract to Assignee.
2. Assignee assumes all obligations of Assignor under original contract.
3. Assignor makes no representations about property condition.
4. Assignee acknowledges receipt of original contract and all addenda.
5. EMD of $_______________ is [ ] transferred [ ] refunded to Assignor.

Assignor: _______________ Date: _______________
Assignee: _______________ Date: _______________`,
  },
];

export default function TemplatesPage() {
  const t = useTranslations("investorDashboard");
  const [activeId, setActiveId] = useState<string>(TEMPLATES[0].id);
  const [copied, setCopied] = useState(false);

  const active = TEMPLATES.find((t) => t.id === activeId) ?? TEMPLATES[0];

  function handleCopy() {
    navigator.clipboard.writeText(active.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([active.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `peo-template-${active.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{t("eyebrow")}</div>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 24 }}>
        {t("templatesTitle")}
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}>
        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              style={{
                textAlign: "left",
                padding: "12px 16px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: activeId === t.id ? "var(--gold-dim)" : "transparent",
                color: activeId === t.id ? "var(--gold)" : "var(--text-muted)",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 2 }}>{t.title}</div>
              <div style={{ fontSize: "0.72rem", opacity: 0.8 }}>{t.category}</div>
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "1.1rem", color: "var(--text)" }}>{active.title}</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 4 }}>{active.description}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleCopy} className="button button-secondary" style={{ fontSize: "0.78rem", padding: "8px 14px", minHeight: 36 }}>
                {copied ? "Copied!" : "Copy"}
              </button>
              <button onClick={handleDownload} className="button button-primary" style={{ fontSize: "0.78rem", padding: "8px 14px", minHeight: 36 }}>
                Download
              </button>
            </div>
          </div>
          <pre style={{
            padding: "24px",
            margin: 0,
            fontFamily: "var(--mono)",
            fontSize: "0.82rem",
            lineHeight: 1.7,
            color: "var(--text)",
            background: "var(--bg-alt)",
            overflow: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}>
            {active.content}
          </pre>
        </div>
      </div>
    </div>
  );
}
