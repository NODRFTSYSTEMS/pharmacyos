"use client";

import React from "react";

interface Point {
  x: string;
  y: number;
}

interface LineChartProps {
  data: Point[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showDots?: boolean;
  showArea?: boolean;
  formatY?: (v: number) => string;
}

export function LineChart({
  data,
  width = 400,
  height = 180,
  color = "var(--gold)",
  strokeWidth = 2,
  showDots = true,
  showArea = true,
  formatY = (v) => `$${v.toLocaleString()}`,
}: LineChartProps) {
  const last = data[data.length - 1];
  const ariaLabel = `Line chart with ${data.length} data points. Latest value: ${last ? formatY(last.y) : "N/A"}.`;
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartW = width - margin.left - margin.right;
  const chartH = height - margin.top - margin.bottom;

  const values = data.map((d) => d.y);
  const minY = Math.min(...values, 0);
  const maxY = Math.max(...values, minY + 1);
  const range = maxY - minY || 1;

  const xScale = (i: number) => (i / (data.length - 1)) * chartW;
  const yScale = (v: number) => chartH - ((v - minY) / range) * chartH;

  const pathD = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(d.y)}`)
    .join(" ");

  const areaD =
    pathD +
    ` L ${xScale(data.length - 1)} ${chartH} L ${xScale(0)} ${chartH} Z`;

  return (
    <svg width={width} height={height} style={{ display: "block" }} role="img" aria-label={ariaLabel}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Y axis grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = chartH * (1 - pct);
          const val = minY + range * pct;
          return (
            <g key={pct}>
              <line
                x1={0}
                y1={y}
                x2={chartW}
                y2={y}
                stroke="var(--border)"
                strokeDasharray="2,2"
                opacity={0.4}
              />
              <text
                x={-8}
                y={y + 4}
                textAnchor="end"
                fontSize="9"
                fontFamily="var(--mono)"
                fill="var(--text-soft)"
              >
                {formatY(val)}
              </text>
            </g>
          );
        })}

        {/* Area */}
        {showArea && (
          <path d={areaD} fill="url(#areaGrad)" stroke="none" />
        )}

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {showDots &&
          data.map((d, i) => (
            <circle
              key={i}
              cx={xScale(i)}
              cy={yScale(d.y)}
              r={3.5}
              fill={color}
              stroke="var(--bg)"
              strokeWidth={2}
            />
          ))}

        {/* X labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={xScale(i)}
            y={chartH + 18}
            textAnchor="middle"
            fontSize="9"
            fontFamily="var(--sans)"
            fill="var(--text-soft)"
          >
            {d.x}
          </text>
        ))}
      </g>
    </svg>
  );
}
