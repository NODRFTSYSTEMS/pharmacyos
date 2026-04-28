import { SITE_CONFIG } from "@/config/site.config";

export interface FxData {
  rate: number;
  source: "live" | "fallback";
  updatedAt: string;
}

const FALLBACK: FxData = {
  rate: SITE_CONFIG.fx_fallback_cop_per_usd,
  source: "fallback",
  updatedAt: new Date().toISOString(),
};

export async function fetchFxRate(): Promise<FxData> {
  try {
    const res = await fetch("https://api.frankfurter.dev/v2/rates?base=USD&quotes=COP", {
      next: { revalidate: 14400 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const record = Array.isArray(data) ? data[0] : data;
    const rate: number = record?.rate ?? record?.rates?.COP;
    if (!rate || rate < 2500 || rate > 7000) throw new Error("Rate out of range");
    return { rate: Math.round(rate), source: "live", updatedAt: new Date().toISOString() };
  } catch {
    return FALLBACK;
  }
}

export function formatCOPRate(rate: number, locale: "en" | "es" = "en"): string {
  const formatted = new Intl.NumberFormat(locale === "es" ? "es-CO" : "en-US").format(rate);
  return `1 USD = COP ${formatted}`;
}

export function formatTimestamp(iso: string, locale: "en" | "es" = "en"): string {
  const d = new Date(iso);
  return d.toLocaleString(locale === "es" ? "es-CO" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
