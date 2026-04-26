"use client";

import React from "react";

interface RadarAxis {
  label: string;
  key: string;
}

interface RadarDataset {
  label: string;
  values: Record<string, number>;
  color: string;
  fillOpacity?: number;
}

interface RadarChartProps {
  axes: RadarAxis[];
  datasets: RadarDataset[];
  size?: number;
  maxValue?: number;
}

export function RadarChart({
  axes,
  datasets,
  size = 220,
  maxValue = 100,
}: RadarChartProps) {
  const ariaLabel = `Radar chart comparing ${datasets.length} datasets across ${axes.length} dimensions.`;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 30;
  const angleStep = (Math.PI * 2) / axes.length;

  function point(angle: number, value: number) {
    const r = (value / maxValue) * radius;
    return {
      x: cx + r * Math.cos(angle - Math.PI / 2),
      y: cy + r * Math.sin(angle - Math.PI / 2),
    };
  }

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <svg width={size} height={size} style={{ display: "block" }} role="img" aria-label={ariaLabel}>
      {/* Grid */}
      {gridLevels.map((lvl) => {
        const pts = axes.map((_, i) => {
          const p = point(i * angleStep, maxValue * lvl);
          return `${p.x},${p.y}`;
        });
        return (
          <polygon
            key={lvl}
            points={pts.join(" ")}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1}
            opacity={0.4}
          />
        );
      })}

      {/* Axes */}
      {axes.map((axis, i) => {
        const p = point(i * angleStep, maxValue);
        return (
          <g key={axis.key}>
            <line
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="var(--border)"
              strokeWidth={1}
              opacity={0.3}
            />
            <text
              x={p.x + (p.x - cx) * 0.15}
              y={p.y + (p.y - cy) * 0.15}
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--sans)"
              fill="var(--text-soft)"
            >
              {axis.label}
            </text>
          </g>
        );
      })}

      {/* Datasets */}
      {datasets.map((ds, di) => {
        const pts = axes.map((axis, i) => {
          const val = ds.values[axis.key] ?? 0;
          const p = point(i * angleStep, val);
          return `${p.x},${p.y}`;
        });
        const first = axes[0];
        const firstVal = ds.values[first.key] ?? 0;
        const firstP = point(0, firstVal);

        return (
          <g key={di}>
            <polygon
              points={pts.join(" ")}
              fill={ds.color}
              fillOpacity={ds.fillOpacity ?? 0.15}
              stroke={ds.color}
              strokeWidth={2}
            />
            {axes.map((axis, i) => {
              const val = ds.values[axis.key] ?? 0;
              const p = point(i * angleStep, val);
              return (
                <circle
                  key={axis.key}
                  cx={p.x}
                  cy={p.y}
                  r={3}
                  fill={ds.color}
                  stroke="var(--bg)"
                  strokeWidth={1.5}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
