"use client";

import { useState, useEffect, useCallback } from "react";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "MXN" | "BRL" | "COP";

interface FxResponse {
  rates: Record<string, number>;
  copRate: number;
  source: "live" | "fallback";
  updatedAt: string;
}

const CURRENCIES: { code: CurrencyCode; label: string }[] = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "GBP", label: "GBP — British Pound" },
  { code: "CAD", label: "CAD — Canadian Dollar" },
  { code: "AUD", label: "AUD — Australian Dollar" },
  { code: "MXN", label: "MXN — Mexican Peso" },
  { code: "BRL", label: "BRL — Brazilian Real" },
  { code: "COP", label: "COP — Colombian Peso" },
];

const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.38,
  AUD: 1.62,
  MXN: 17.5,
  BRL: 5.86,
  COP: 4100,
};

interface Props {
  locale?: "en" | "es";
}

export function CurrencyConverter({ locale = "en" }: Props) {
  const [amount, setAmount] = useState<string>("1000");
  const [from, setFrom] = useState<CurrencyCode>("USD");
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [source, setSource] = useState<"live" | "fallback">("fallback");
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRates = useCallback(async () => {
    try {
      const res = await fetch("/api/fx");
      if (!res.ok) throw new Error("API error");
      const data: FxResponse = await res.json();
      setRates(data.rates);
      setSource(data.source);
      setUpdatedAt(data.updatedAt);
      setError(false);
    } catch {
      setError(true);
      setSource("fallback");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const numAmount = parseFloat(amount) || 0;
  // Cross-rate: COP per unit of `from` = rates.COP / rates[from]
  const copPerUnit = from === "COP" ? 1 : (rates.COP ?? 4100) / (rates[from] ?? 1);
  const resultCOP = numAmount * copPerUnit;

  const fmtCOP = (n: number) =>
    new Intl.NumberFormat(locale === "es" ? "es-CO" : "en-US", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(n);

  const fmtInput = (n: number) =>
    new Intl.NumberFormat(locale === "es" ? "es-CO" : "en-US", {
      style: "currency",
      currency: from,
      maximumFractionDigits: from === "COP" ? 0 : 2,
    }).format(n);

  const updatedLabel =
    locale === "es" ? "Actualizado" : "Updated";
  const sourceLabel =
    source === "live"
      ? locale === "es" ? "Tipo de cambio en vivo" : "Live exchange rate"
      : locale === "es" ? "Tipo de cambio de respaldo" : "Fallback rate";

  return (
    <div
      style={{
        background: "var(--card, rgba(255,252,247,0.92))",
        border: "1px solid var(--border, rgba(35,49,63,0.1))",
        borderRadius: "var(--radius-sm, 18px)",
        padding: "28px 24px",
        maxWidth: "480px",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-display, Georgia, serif)",
          fontSize: "1.15rem",
          fontWeight: 400,
          color: "var(--ocean, #1f3a4d)",
          margin: "0 0 20px",
        }}
      >
        {locale === "es" ? "Convertidor de Divisas" : "Currency Converter"}
      </h3>

      {/* Input row */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        <input
          type="number"
          value={amount}
          min={0}
          onChange={(e) => setAmount(e.target.value)}
          aria-label={locale === "es" ? "Cantidad a convertir" : "Amount to convert"}
          style={{
            flex: "1 1 120px",
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid var(--border, rgba(35,49,63,0.15))",
            fontSize: "1rem",
            fontFamily: "var(--font-body, system-ui)",
            color: "var(--charcoal, #23313f)",
            background: "#fff",
            outline: "none",
          }}
        />
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value as CurrencyCode)}
          aria-label={locale === "es" ? "Moneda de origen" : "From currency"}
          style={{
            flex: "1 1 160px",
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid var(--border, rgba(35,49,63,0.15))",
            fontSize: "0.9rem",
            fontFamily: "var(--font-body, system-ui)",
            color: "var(--charcoal, #23313f)",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Arrow */}
      <div
        style={{
          textAlign: "center",
          fontSize: "1.4rem",
          color: "var(--muted, #6b7280)",
          marginBottom: "16px",
        }}
        aria-hidden="true"
      >
        ↓
      </div>

      {/* Result */}
      <div
        style={{
          background: "var(--sand, #fff8ef)",
          borderRadius: "12px",
          padding: "18px 20px",
          marginBottom: "16px",
        }}
      >
        {loading ? (
          <div style={{ color: "var(--muted, #6b7280)", fontSize: "0.9rem" }}>
            {locale === "es" ? "Cargando tasas…" : "Loading rates…"}
          </div>
        ) : (
          <>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--muted, #6b7280)",
                marginBottom: "4px",
                fontFamily: "var(--font-body, system-ui)",
              }}
            >
              {fmtInput(numAmount)} → COP
            </div>
            <div
              style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "var(--ocean, #1f3a4d)",
                fontFamily: "var(--font-body, system-ui)",
                letterSpacing: "-0.02em",
              }}
            >
              {fmtCOP(resultCOP)}
            </div>
          </>
        )}
      </div>

      {/* Meta row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "6px",
        }}
      >
        <span
          style={{
            fontSize: "0.72rem",
            color: error ? "var(--terracotta, #e67e22)" : "var(--muted, #6b7280)",
            fontFamily: "var(--font-body, system-ui)",
          }}
        >
          {error
            ? locale === "es"
              ? "⚠ API no disponible — usando tasa de respaldo"
              : "⚠ API unavailable — using fallback rate"
            : sourceLabel}
        </span>
        {updatedAt && !error && (
          <span
            style={{
              fontSize: "0.72rem",
              color: "var(--muted, #6b7280)",
              fontFamily: "var(--font-body, system-ui)",
            }}
          >
            {updatedLabel}:{" "}
            {new Date(updatedAt).toLocaleTimeString(locale === "es" ? "es-CO" : "en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>

      <p
        style={{
          fontSize: "0.68rem",
          color: "var(--muted, #6b7280)",
          margin: "10px 0 0",
          fontFamily: "var(--font-body, system-ui)",
          lineHeight: 1.4,
        }}
      >
        {locale === "es"
          ? "Fuente: Frankfurter (BCE). Solo para referencia — no para transacciones financieras."
          : "Source: Frankfurter (ECB). For reference only — not for financial transactions."}
      </p>
    </div>
  );
}
