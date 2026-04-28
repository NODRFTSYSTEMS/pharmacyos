"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#fdf5e6", fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "60px 24px",
          }}
        >
          <a href="/" style={{ display: "inline-block", marginBottom: "40px" }}>
            <img
              src="/logo.png"
              alt="CasaClaro"
              style={{ width: "140px", height: "auto" }}
            />
          </a>

          <div
            style={{
              width: "48px",
              height: "3px",
              background: "#e67e22",
              borderRadius: "2px",
              marginBottom: "28px",
            }}
          />

          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
              fontWeight: 400,
              color: "#1f3a4d",
              margin: "0 0 16px",
            }}
          >
            Something went wrong.
          </h1>

          <p
            style={{
              fontSize: "1rem",
              color: "rgba(31,58,77,0.5)",
              margin: "0 0 40px",
              maxWidth: "380px",
              lineHeight: 1.65,
            }}
          >
            We hit an unexpected error. Try again or head back to the homepage.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={reset}
              style={{
                padding: "13px 28px",
                background: "#e67e22",
                color: "white",
                borderRadius: "999px",
                fontWeight: 600,
                fontSize: "0.9rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            <a
              href="/en"
              style={{
                display: "inline-block",
                padding: "13px 28px",
                color: "#1f3a4d",
                borderRadius: "999px",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                border: "1.5px solid rgba(31,58,77,0.18)",
              }}
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
