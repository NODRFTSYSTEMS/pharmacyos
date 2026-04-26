"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <section className="section-hero" style={{ textAlign: "center" }}>
        <div className="container-narrow">
          <div className="eyebrow" style={{ marginBottom: "14px", color: "var(--red)" }}>Error</div>
          <h1 className="display" style={{ marginBottom: "20px" }}>We encountered an issue.</h1>
          <p className="lead" style={{ marginBottom: "32px" }}>
            An unexpected error occurred. If this persists, please contact support.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={reset}
              className="button button-primary"
            >
              Try again
            </button>
            <Link href="/" className="button button-secondary">
              Back to home
            </Link>
          </div>
          {error.digest && (
            <p className="body-xs" style={{ marginTop: "24px", color: "var(--text-soft)" }}>
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
