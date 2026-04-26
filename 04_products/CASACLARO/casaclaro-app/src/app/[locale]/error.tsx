"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "2rem",
      }}
    >
      <h2 style={{ fontFamily: "var(--font-display)", color: "var(--ocean)", margin: 0 }}>
        Something went wrong
      </h2>
      <p style={{ color: "var(--muted)", margin: 0 }}>
        We encountered an unexpected error.
      </p>
      <button className="btn btn-secondary" onClick={reset} style={{ marginTop: "0.5rem" }}>
        Try Again
      </button>
    </div>
  );
}
