import { NextResponse } from "next/server";

const FALLBACK_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.38,
  AUD: 1.62,
  MXN: 17.5,
  BRL: 5.86,
  COP: 4100,
};

const FX_API =
  "https://api.frankfurter.dev/v2/rates?base=USD&quotes=EUR,GBP,CAD,AUD,MXN,BRL,COP";

export const revalidate = 14400; // 4-hour cache

export async function GET() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(FX_API, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: 14400 },
    });

    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const record = Array.isArray(data) ? data[0] : data;
    const rawRates = record?.rates as Record<string, number> | undefined;

    if (!rawRates?.COP || rawRates.COP < 2500 || rawRates.COP > 7000) {
      throw new Error("COP rate out of plausible range");
    }

    const rates = { USD: 1, ...rawRates };

    return NextResponse.json({
      rates,
      copRate: Math.round(rawRates.COP),
      source: "live",
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      rates: FALLBACK_RATES,
      copRate: FALLBACK_RATES.COP,
      source: "fallback",
      updatedAt: new Date().toISOString(),
    });
  }
}
