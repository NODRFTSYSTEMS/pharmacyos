"use client";

import React, { useState } from "react";

interface Slice {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: Slice[];
  size?: number;
  innerRadius?: number;
  showLegend?: boolean;
}

export function PieChart({
  data,
  size = 160,
  innerRadius = 0.55,
  showLegend = true,
}: PieChartProps) {
  const ariaLabel = `Pie chart showing ${data.length} segments: ${data.map((d) => `${d.label} ${d.value}`).join(", ")}.`;
  const [hovered, setHovered] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = size / 2 - 4;
  const innerR = radius * innerRadius;
  const cx = size / 2;
  const cy = size / 2;

  let currentAngle = -Math.PI / 2;

  const slices = data.map((d, i) => {
    const angle = (d.value / total) * Math.PI * 2;
    const start = currentAngle;
    const end = currentAngle + angle;
    currentAngle = end;
    return { ...d, start, end, index: i, pct: (d.value / total) * 100 };
  });

  function arcPath(start: number, end: number, r: number) {
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  }

  function donutArc(start: number, end: number, outer: number, inner: number) {
    const large = end - start > Math.PI ? 1 : 0;
    const x1o = cx + outer * Math.cos(start);
    const y1o = cy + outer * Math.sin(start);
    const x2o = cx + outer * Math.cos(end);
    const y2o = cy + outer * Math.sin(end);
    const x1i = cx + inner * Math.cos(end);
    const y1i = cy + inner * Math.sin(end);
    const x2i = cx + inner * Math.cos(start);
    const y2i = cy + inner * Math.sin(start);
    return `M ${x1o} ${y1o} A ${outer} ${outer} 0 ${large} 1 ${x2o} ${y2o} L ${x1i} ${y1i} A ${inner} ${inner} 0 ${large} 0 ${x2i} ${y2i} Z`;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
      <svg width={size} height={size} style={{ display: "block", flexShrink: 0 }} role="img" aria-label={ariaLabel}>
        {slices.map((s) => (
          <path
            key={s.index}
            d={donutArc(s.start, s.end, radius, innerR)}
            fill={s.color}
            opacity={hovered === null || hovered === s.index ? 0.9 : 0.4}
            stroke="var(--bg)"
            strokeWidth={2}
            style={{ cursor: "pointer", transition: "opacity 200ms" }}
            onMouseEnter={() => setHovered(s.index)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
        {/* Center label */}
        {hovered !== null && (
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fontSize="11"
            fontFamily="var(--mono)"
            fontWeight={700}
            fill="var(--text)"
          >
            {slices[hovered].pct.toFixed(1)}%
          </text>
        )}
        {hovered !== null && (
          <text
            x={cx}
            y={cy + 10}
            textAnchor="middle"
            fontSize="8"
            fontFamily="var(--sans)"
            fill="var(--text-soft)"
          >
            {slices[hovered].label}
          </text>
        )}
      </svg>

      {showLegend && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {slices.map((s) => (
            <div
              key={s.index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.78rem",
                color: "var(--text-soft)",
                cursor: "pointer",
                opacity: hovered === null || hovered === s.index ? 1 : 0.4,
                transition: "opacity 200ms",
              }}
              onMouseEnter={() => setHovered(s.index)}
              onMouseLeave={() => setHovered(null)}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: s.color,
                  display: "inline-block",
                }}
              />
              <span>{s.label}</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: "0.72rem" }}>
                {s.pct.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
