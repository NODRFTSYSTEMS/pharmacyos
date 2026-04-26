export default function Loading() {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <section className="section-hero" style={{ textAlign: "center" }}>
        <div className="container-narrow">
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "2px solid var(--border)",
              borderTopColor: "var(--gold)",
              animation: "spin 0.7s linear infinite",
              margin: "0 auto 24px",
            }}
          />
          <p className="body-text" style={{ color: "var(--text-soft)" }}>Loading your analysis…</p>
        </div>
      </section>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
