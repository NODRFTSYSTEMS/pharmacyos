export default function NotFound() {
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
      <div
        style={{
          width: "3px",
          height: "40px",
          background: "var(--terracotta)",
          borderRadius: "2px",
        }}
      />
      <h1 style={{ fontFamily: "var(--font-display)", color: "var(--ocean)", margin: 0 }}>
        Page Not Found
      </h1>
      <p style={{ color: "var(--muted)", margin: 0 }}>
        The page you're looking for doesn't exist.
      </p>
      <a href="/" className="btn btn-secondary" style={{ marginTop: "0.5rem" }}>
        Go Home
      </a>
    </div>
  );
}
