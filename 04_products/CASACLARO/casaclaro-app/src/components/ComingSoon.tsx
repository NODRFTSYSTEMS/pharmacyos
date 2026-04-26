interface ComingSoonProps {
  titleEn: string;
  titleEs: string;
  descEn: string;
  descEs: string;
  locale?: "en" | "es";
}

export function ComingSoon({ titleEn, titleEs, descEn, descEs, locale = "en" }: ComingSoonProps) {
  return (
    <main
      style={{
        maxWidth: "var(--max, 1240px)",
        margin: "0 auto",
        padding: "80px 20px 120px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "1.5rem",
      }}
    >
      <span
        style={{
          display: "block",
          width: "3px",
          height: "48px",
          background: "var(--terracotta, #e67e22)",
          borderRadius: "2px",
        }}
      />
      <h1
        style={{
          fontFamily: "var(--font-display, Georgia, serif)",
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
          fontWeight: 400,
          color: "var(--ocean, #1f3a4d)",
          margin: 0,
          lineHeight: 1.15,
        }}
      >
        {locale === "en" ? titleEn : titleEs}
      </h1>
      <p
        style={{
          fontSize: "1rem",
          color: "var(--muted, #6b7280)",
          margin: 0,
          maxWidth: "480px",
          lineHeight: 1.65,
          fontFamily: "var(--font-body, system-ui)",
        }}
      >
        {locale === "en" ? descEn : descEs}
      </p>
      <a
        href="/listings"
        className="btn btn-primary"
        style={{ marginTop: "0.5rem" }}
      >
        {locale === "en" ? "Browse Current Listings →" : "Ver Listados Actuales →"}
      </a>
    </main>
  );
}
