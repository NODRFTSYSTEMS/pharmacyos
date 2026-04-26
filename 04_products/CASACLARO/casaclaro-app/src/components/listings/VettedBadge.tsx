"use client";

import { useState } from "react";
import { BADGE_CONFIG } from "@/config/badge.config";
import type { VettingLevel } from "@/types/listings";

interface VettedBadgeProps {
  level: VettingLevel;
  locale?: "en" | "es";
  className?: string;
}

export function VettedBadge({ level, locale = "en", className = "" }: VettedBadgeProps) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const config = BADGE_CONFIG[level];
  const label = config.label[locale];
  const tooltip = config.tooltip[locale];
  const tooltipId = `badge-tooltip-${level}`;

  return (
    <span
      data-testid="vetted-badge"
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        borderRadius: "999px",
        padding: "4px 10px 4px 8px",
        fontSize: "0.72rem",
        fontFamily: "var(--font-body, system-ui)",
        fontWeight: 600,
        letterSpacing: "0.02em",
        position: "relative",
        ...config.chipStyle,
      }}
    >
      {/* Status dot */}
      <span
        style={{
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          background: config.dotColor,
          flexShrink: 0,
        }}
      />

      {/* Label */}
      {label}

      {/* Info button */}
      <button
        type="button"
        aria-label={`${label} — what this means`}
        aria-describedby={tooltipId}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        onFocus={() => setTooltipVisible(true)}
        onBlur={() => setTooltipVisible(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          border: `1px solid currentColor`,
          background: "transparent",
          cursor: "pointer",
          fontSize: "0.6rem",
          fontWeight: 700,
          color: "inherit",
          opacity: 0.7,
          padding: 0,
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        i
      </button>

      {/* Tooltip */}
      {tooltipVisible && (
        <span
          id={tooltipId}
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--ocean, #1f3a4d)",
            color: "#fff",
            borderRadius: "10px",
            padding: "8px 12px",
            fontSize: "0.72rem",
            fontWeight: 400,
            lineHeight: 1.5,
            whiteSpace: "normal",
            width: "220px",
            zIndex: 50,
            boxShadow: "0 4px 16px rgba(31,58,77,0.18)",
            pointerEvents: "none",
          }}
        >
          {tooltip}
        </span>
      )}
    </span>
  );
}
