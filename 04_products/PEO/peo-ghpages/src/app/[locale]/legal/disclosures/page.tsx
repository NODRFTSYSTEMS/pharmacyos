export default function DisclosuresPage() {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <section className="section-hero">
        <div className="container-narrow">
          <div className="eyebrow" style={{ marginBottom: "14px" }}>Legal</div>
          <h1 className="display" style={{ marginBottom: "20px" }}>Disclosures</h1>
          <p className="lead">
            Final legal text pending counsel review (O-002).
          </p>
        </div>
      </section>

      <section style={{ padding: "0 0 96px" }}>
        <div className="container-narrow">
          <div className="card">
            <p className="body-sm" style={{ marginBottom: "16px" }}>
              This is a placeholder. Do not publish this page externally until the
              final disclosures are reviewed and approved.
            </p>
            <p className="body-sm" style={{ margin: 0 }}>
              Final legal text pending counsel review (O-002).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
