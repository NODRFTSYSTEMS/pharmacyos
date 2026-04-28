"use client";

import { useState, useEffect } from "react";

interface Props {
  lat: number;
  lng: number;
  avgTempC: { low: number; high: number };
  locale?: "en" | "es";
}

function icon(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌦️";
  if (code <= 99) return "⛈️";
  return "🌤️";
}

const pill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "3px",
  fontSize: "0.72rem",
  fontFamily: "var(--font-body, system-ui)",
  fontWeight: 500,
  padding: "2px 8px",
  borderRadius: "999px",
  background: "rgba(31,111,120,0.1)",
  color: "var(--lagoon, #1f6f78)",
  whiteSpace: "nowrap",
};

export function WeatherBadge({ lat, lng, avgTempC, locale = "en" }: Props) {
  const [temp, setTemp] = useState<number | null>(null);
  const [code, setCode] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weathercode&timezone=auto&forecast_days=1`,
      { signal: controller.signal }
    )
      .then((r) => r.json())
      .then((data) => {
        const c = data?.current;
        if (typeof c?.temperature_2m === "number") {
          setTemp(Math.round(c.temperature_2m));
          setCode(c.weathercode ?? 0);
        }
      })
      .catch(() => {})
      .finally(() => {
        clearTimeout(timer);
        setDone(true);
      });

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [lat, lng]);

  if (!done) {
    return (
      <span style={{ ...pill, opacity: 0.45 }}>
        {locale === "es" ? "clima…" : "weather…"}
      </span>
    );
  }

  if (temp === null) {
    return (
      <span style={pill} title={locale === "es" ? "Promedio histórico" : "Historical average"}>
        🌡️ {avgTempC.low}–{avgTempC.high}°C
      </span>
    );
  }

  return (
    <span
      style={pill}
      title={locale === "es" ? "Temperatura actual (Open-Meteo)" : "Current temperature (Open-Meteo)"}
    >
      {icon(code)} {temp}°C
    </span>
  );
}
