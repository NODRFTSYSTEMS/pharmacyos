"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

interface PropertyPreview {
  propertyFacts: {
    squareFootage?: number;
    yearBuilt?: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
  };
  avm: {
    price: number | null;
    priceRangeLow: number | null;
    priceRangeHigh: number | null;
  };
}

export default function NewApplicationPage() {
  const t = useTranslations("sellerApplication");
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [preview, setPreview] = useState<PropertyPreview | null>(null);
  const [previewMissed, setPreviewMissed] = useState(false);

  const [form, setForm] = useState({
    address: "",
    expectedSalePrice: "",
    mortgagePayoff: "",
    timeline: "",
  });

  const isDevBypass = process.env.NEXT_PUBLIC_DEV_BYPASS === "true";

  async function handleAddressBlur() {
    if (form.address.length < 8) return;
    setLookupLoading(true);
    setPreview(null);
    setPreviewMissed(false);
    try {
      const res = await fetch(`/api/lookup/property?address=${encodeURIComponent(form.address)}`);
      const data = await res.json() as PropertyPreview;
      const hasData =
        data.propertyFacts && Object.keys(data.propertyFacts).length > 0;
      if (hasData) {
        setPreview(data);
        if (data.avm?.price && !form.expectedSalePrice) {
          setForm((f) => ({ ...f, expectedSalePrice: String(data.avm.price) }));
        }
      } else {
        setPreviewMissed(true);
      }
    } catch {
      setPreviewMissed(true);
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      address: form.address,
      expectedSalePrice: Number(form.expectedSalePrice) || 0,
      mortgagePayoff: Number(form.mortgagePayoff) || 0,
      timeline: form.timeline,
    };

    const endpoint = isDevBypass ? "/api/test/seller-analysis" : "/api/seller/application";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.application) {
        const appId = data.application.id;
        if (isDevBypass && appId.startsWith("dev-")) {
          sessionStorage.setItem(`dev-seller-${appId}`, JSON.stringify(data.application));
        }
        router.push(`/${locale}/seller/application/${appId}`);
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
    fontFamily: "var(--sans)", fontSize: "0.875rem", outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: "0.78rem", fontWeight: 600, color: "var(--text-soft)",
    textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px", display: "block",
  };
  const hintStyle: React.CSSProperties = {
    fontSize: "0.73rem", color: "var(--text-muted)", marginTop: "4px",
  };

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <section style={{ padding: "64px 0 48px" }}>
        <div className="container" style={{ maxWidth: "640px" }}>
          <div className="eyebrow" style={{ marginBottom: "10px" }}>Seller Platform</div>
          <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "var(--text)", letterSpacing: "-0.02em" }}>
            {t("formTitle")}
          </h1>
        </div>
      </section>

      <section style={{ padding: "0 0 96px" }}>
        <div className="container" style={{ maxWidth: "640px" }}>
          {error && (
            <div style={{ background: "var(--red-dim)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: "var(--radius-sm)", padding: "12px 16px", color: "var(--red)", fontSize: "0.875rem", marginBottom: "20px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Address with live lookup */}
              <div>
                <label htmlFor="seller-address" style={labelStyle}>
                  {t("address")}<span style={{ color: "var(--red)", marginLeft: "3px" }} aria-hidden>*</span>
                </label>
                <input
                  id="seller-address"
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, address: e.target.value }));
                    setPreview(null);
                    setPreviewMissed(false);
                  }}
                  onBlur={handleAddressBlur}
                  placeholder="123 Main St, City, ST 12345"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                />
                {lookupLoading && (
                  <p style={hintStyle}>{t("lookupLoading")}</p>
                )}
                {previewMissed && !lookupLoading && (
                  <p style={{ ...hintStyle, color: "var(--amber)" }}>{t("propertyNotFound")}</p>
                )}
              </div>

              {/* Property preview card */}
              {preview && (
                <div style={{ background: "var(--green-dim)", border: "1px solid rgba(39,174,96,0.25)", borderRadius: "var(--radius-sm)", padding: "14px 16px" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green)", marginBottom: "8px" }}>
                    {t("propertyFound")}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    {preview.propertyFacts.bedrooms != null && (
                      <span style={{ fontFamily: "var(--mono)", fontSize: "0.82rem", color: "var(--text)" }}>
                        {preview.propertyFacts.bedrooms} {t("beds")}
                      </span>
                    )}
                    {preview.propertyFacts.bathrooms != null && (
                      <span style={{ fontFamily: "var(--mono)", fontSize: "0.82rem", color: "var(--text)" }}>
                        {preview.propertyFacts.bathrooms} {t("baths")}
                      </span>
                    )}
                    {preview.propertyFacts.squareFootage != null && (
                      <span style={{ fontFamily: "var(--mono)", fontSize: "0.82rem", color: "var(--text)" }}>
                        {Number(preview.propertyFacts.squareFootage).toLocaleString()} {t("sqft")}
                      </span>
                    )}
                    {preview.propertyFacts.yearBuilt != null && (
                      <span style={{ fontFamily: "var(--mono)", fontSize: "0.82rem", color: "var(--text)" }}>
                        {t("built")} {preview.propertyFacts.yearBuilt}
                      </span>
                    )}
                    {preview.avm.price != null && (
                      <span style={{ fontFamily: "var(--mono)", fontSize: "0.82rem", color: "var(--gold)", fontWeight: 600 }}>
                        Est. ${Number(preview.avm.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Asking price + mortgage payoff */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label htmlFor="seller-sale-price" style={labelStyle}>{t("askingPrice")}</label>
                  <input
                    id="seller-sale-price"
                    type="text"
                    inputMode="decimal"
                    value={form.expectedSalePrice}
                    onChange={(e) => setForm((f) => ({ ...f, expectedSalePrice: e.target.value }))}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  />
                  <p style={hintStyle}>{t("askingPriceHint")}</p>
                </div>
                <div>
                  <label htmlFor="seller-mortgage" style={labelStyle}>{t("mortgagePayoff")}</label>
                  <input
                    id="seller-mortgage"
                    type="text"
                    inputMode="decimal"
                    value={form.mortgagePayoff}
                    onChange={(e) => setForm((f) => ({ ...f, mortgagePayoff: e.target.value }))}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  />
                  <p style={hintStyle}>{t("mortgagePayoffHint")}</p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label htmlFor="seller-timeline" style={labelStyle}>{t("timeline")}</label>
                <input
                  id="seller-timeline"
                  type="text"
                  value={form.timeline}
                  onChange={(e) => setForm((f) => ({ ...f, timeline: e.target.value }))}
                  placeholder={t("timelinePlaceholder")}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="button button-primary"
                  style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? t("submitting") : t("submit")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
