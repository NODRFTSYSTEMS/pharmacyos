"use client";

import { useEffect, useState } from "react";

interface FxSnapshot {
  rate: number;
  source: "live" | "fallback";
  updatedAt: string;
}

interface CurrencyWidgetProps {
  /** Initial value hydrated from server — prevents layout shift */
  initial: FxSnapshot;
  locale?: "en" | "es";
  /** "footer" = compact inline | "banner" = full-width prominent strip */
  variant?: "footer" | "banner";
}

function fmt(rate: number, locale: "en" | "es"): string {
  return new Intl.NumberFormat(locale === "es" ? "es-CO" : "en-US").format(rate);
}

function fmtTime(iso: string, locale: "en" | "es"): string {
  return new Date(iso).toLocaleString(locale === "es" ? "es-CO" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CurrencyWidget({ initial, locale = "en", variant = "footer" }: CurrencyWidgetProps) {
  const [fx, setFx] = useState<FxSnapshot>(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Client-side refresh: hit our /api/fx route once on mount if initial is a fallback
    if (initial.source === "fallback") {
      setLoading(true);
      fetch("/api/fx")
        .then((r) => r.json())
        .then((data: { rate?: number; copRate?: number; source: "live" | "fallback"; updatedAt: string }) => {
          setFx({ rate: data.copRate ?? data.rate ?? 4100, source: data.source, updatedAt: data.updatedAt });
        })
        .catch(() => {/* keep initial */})
        .finally(() => setLoading(false));
    }
  }, [initial.source]);

  const isStale = fx.source === "fallback";
  const rateLabel = locale === "en"
    ? `1 USD = COP ${fmt(fx.rate, locale)}`
    : `1 USD = COP ${fmt(fx.rate, locale)}`;
  const timeLabel = fmtTime(fx.updatedAt, locale);
  const checkedLabel = locale === "en"
    ? `Rates checked ${timeLabel}`
    : `Tasas verificadas ${timeLabel}`;

  if (variant === "footer") {
    return (
      <span
        data-testid="currency-widget"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "0.72rem",
          fontFamily: "var(--font-body, system-ui)",
          color: isStale ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.65)",
          opacity: loading ? 0.5 : 1,
          transition: "opacity 0.2s",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: isStale ? "var(--marigold, #f1c40f)" : "var(--emerald, #2ecc71)",
            flexShrink: 0,
          }}
        />
        <span>{rateLabel}</span>
        <span style={{ opacity: 0.55 }}>·</span>
        <span style={{ opacity: 0.55 }}>{checkedLabel}</span>
      </span>
    );
  }

  // banner variant — used on residency and listings pages
  return (
    <div
      data-testid="currency-widget"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 16px",
        background: isStale
          ? "rgba(241,196,15,0.10)"
          : "rgba(46,204,113,0.10)",
        border: `1px solid ${isStale ? "rgba(241,196,15,0.35)" : "rgba(46,204,113,0.30)"}`,
        borderRadius: "999px",
        fontSize: "0.82rem",
        fontFamily: "var(--font-body, system-ui)",
        color: isStale ? "var(--cacao, #4a2f1d)" : "var(--emerald-deep, #1f8f59)",
        opacity: loading ? 0.6 : 1,
        transition: "opacity 0.2s",
      }}
    >
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: isStale ? "var(--marigold, #f1c40f)" : "var(--emerald, #2ecc71)",
          flexShrink: 0,
        }}
      />
      <strong style={{ fontWeight: 700 }}>{rateLabel}</strong>
      <span style={{ opacity: 0.6, fontSize: "0.75rem" }}>
        {isStale
          ? (locale === "en" ? "· Estimated — live rate unavailable" : "· Estimado — tasa en vivo no disponible")
          : `· ${checkedLabel}`}
      </span>
    </div>
  );
}
