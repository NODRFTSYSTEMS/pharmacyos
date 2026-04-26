"use client";

import React from "react";

interface GaugeProps {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}

export function Gauge({ value, size = 120, stroke = 10, label, sublabel }: GaugeProps) {
  const ariaLabel = `Gauge showing ${value} out of 100${label ? ` for ${label}` : ""}.`;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - stroke) / 2 - 4;
  const circumference = Math.PI * r; // half circle
  const progress = Math.min(Math.max(value, 0), 100) / 100;
  const dashoffset = circumference * (1 - progress);

  const color =
    value >= 80 ? "var(--green)" : value >= 60 ? "var(--gold)" : value >= 40 ? "var(--amber)" : "var(--red)";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
      <svg width={size} height={size / 2 + 10} style={{ display: "block" }} role="img" aria-label={ariaLabel}>
        <g transform={`translate(${cx},${size / 2 + 4})`}>
          {/* Background arc */}
          <path
            d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0`}
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0`}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            style={{ transition: "stroke-dashoffset 800ms ease" }}
          />
        </g>
      </svg>
      <div style={{ textAlign: "center", marginTop: -6 }}>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: "1.4rem",
            fontWeight: 700,
            color,
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        {label && (
          <div style={{ fontSize: "0.72rem", color: "var(--text-soft)", marginTop: 2 }}>{label}</div>
        )}
        {sublabel && (
          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: 1 }}>{sublabel}</div>
        )}
      </div>
    </div>
  );
}
