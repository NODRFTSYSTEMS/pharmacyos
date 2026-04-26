"use client";

import React from "react";

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarData[];
  width?: number;
  height?: number;
  maxValue?: number;
  barColor?: string;
  showValues?: boolean;
  formatValue?: (v: number) => string;
}

export function BarChart({
  data,
  width = 400,
  height = 200,
  maxValue,
  barColor = "var(--gold)",
  showValues = true,
  formatValue = (v) => `$${v.toLocaleString()}`,
}: BarChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const ariaLabel = `Bar chart showing ${data.length} categories. Total: ${formatValue(total)}.`;
  const margin = { top: 10, right: 10, bottom: 30, left: 10 };
  const chartW = width - margin.left - margin.right;
  const chartH = height - margin.top - margin.bottom;

  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);
  const barWidth = (chartW / data.length) * 0.6;
  const gap = (chartW / data.length) * 0.4;

  return (
    <svg width={width} height={height} style={{ display: "block" }} role="img" aria-label={ariaLabel}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = chartH * (1 - pct);
          return (
            <line
              key={pct}
              x1={0}
              y1={y}
              x2={chartW}
              y2={y}
              stroke="var(--border)"
              strokeDasharray="2,2"
              opacity={0.5}
            />
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const barH = (d.value / max) * chartH;
          const x = i * (barWidth + gap) + gap / 2;
          const y = chartH - barH;
          const color = d.color ?? barColor;

          return (
            <g key={d.label}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                fill={color}
                rx={3}
                opacity={0.85}
              />
              {showValues && (
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="var(--mono)"
                  fill="var(--text)"
                >
                  {formatValue(d.value)}
                </text>
              )}
              <text
                x={x + barWidth / 2}
                y={chartH + 16}
                textAnchor="middle"
                fontSize="10"
                fontFamily="var(--sans)"
                fill="var(--text-soft)"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
