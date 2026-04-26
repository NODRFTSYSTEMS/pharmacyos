"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "@/i18n/navigation";

interface TermTooltipProps {
  term: string;
  definition: string;
  detailHref?: string;
  children: React.ReactNode;
}

export function TermTooltip({ term, definition, detailHref, children }: TermTooltipProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipId = `tooltip-${term.toLowerCase().replace(/\s+/g, "-")}`;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <span
      ref={triggerRef}
      style={{ display: "inline-flex", alignItems: "center", gap: "6px", position: "relative" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      <button
        type="button"
        aria-describedby={tooltipId}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          border: "1px solid var(--border-strong)",
          background: "var(--surface-strong)",
          color: "var(--gold)",
          fontSize: "0.65rem",
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
          padding: 0,
          lineHeight: 1,
        }}
      >
        ⓘ
      </button>

      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "max-content",
            maxWidth: "280px",
            background: "var(--surface-elevated)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-sm)",
            padding: "12px 14px",
            boxShadow: "var(--shadow-panel)",
            zIndex: 100,
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            lineHeight: 1.6,
          }}
        >
          <span style={{ display: "block", fontWeight: 600, color: "var(--text)", marginBottom: "4px" }}>
            {term}
          </span>
          <span style={{ display: "block" }}>{definition}</span>
          {detailHref && (
            <Link
              href={detailHref}
              onClick={() => setOpen(false)}
              style={{
                display: "inline-block",
                marginTop: "8px",
                color: "var(--gold)",
                fontWeight: 500,
                textDecoration: "none",
                fontSize: "0.72rem",
              }}
            >
              Learn more →
            </Link>
          )}
          {/* Arrow */}
          <span
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid var(--border-strong)",
            }}
          />
        </span>
      )}
    </span>
  );
}
