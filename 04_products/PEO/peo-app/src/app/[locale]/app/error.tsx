"use client";

import { useEffect } from "react";

/* ------------------------------------------------------------------
 * App Shell Error Boundary
 * Authority: DSS · TVA
 * ------------------------------------------------------------------
 * Catches errors inside /app routes while preserving sidebar context.
 * Falls back to root error.tsx for errors outside /app.
 * ------------------------------------------------------------------ */

export default function AppShellError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console in development; in production this would go to an error tracker
    if (process.env.NODE_ENV === "development") {
      console.error("App shell error:", error);
    }
  }, [error]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      gap: "20px",
      padding: "40px",
      textAlign: "center",
    }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "var(--red-dim)",
        border: "1px solid rgba(244,63,94,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.8rem",
      }}>
        ⚠
      </div>
      <h2 style={{
        fontFamily: "var(--display)",
        fontWeight: 700,
        fontSize: "1.4rem",
        color: "var(--text)",
        margin: 0,
      }}>
        We encountered an issue.
      </h2>
      <p style={{
        fontSize: "0.875rem",
        color: "var(--text-muted)",
        maxWidth: "48ch",
        lineHeight: 1.6,
        margin: 0,
      }}>
        Something went wrong in this section. Try refreshing or return to the dashboard.
      </p>
      {error.digest && (
        <code style={{
          fontFamily: "var(--mono)",
          fontSize: "0.72rem",
          color: "var(--text-soft)",
          padding: "8px 14px",
          background: "var(--bg-alt)",
          borderRadius: 6,
          border: "1px solid var(--border)",
        }}>
          Error ID: {error.digest}
        </code>
      )}
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button
          onClick={reset}
          className="button button-primary"
          style={{ fontSize: "0.82rem", minHeight: 40, padding: "8px 20px" }}
        >
          Try Again
        </button>
        <a
          href="/app"
          className="button button-secondary"
          style={{ fontSize: "0.82rem", minHeight: 40, padding: "8px 20px", textDecoration: "none" }}
        >
          Dashboard
        </a>
      </div>
    </div>
  );
}
