import Image from "next/image";

export default function RootNotFound() {
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
            <Image
              src="/logo.png"
              alt="CasaClaro"
              width={995}
              height={1024}
              style={{ width: "140px", height: "auto", objectFit: "contain" }}
              priority
            />
          </a>

          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(4rem, 12vw, 7rem)",
              fontWeight: 400,
              color: "rgba(31,58,77,0.08)",
              margin: "0 0 -24px",
              lineHeight: 1,
            }}
          >
            404
          </p>

          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
              fontWeight: 400,
              color: "#1f3a4d",
              margin: "0 0 16px",
            }}
          >
            Page not found.
          </h1>

          <p
            style={{
              fontSize: "1rem",
              color: "rgba(31,58,77,0.5)",
              margin: "0 0 40px",
              maxWidth: "400px",
              lineHeight: 1.65,
            }}
          >
            The page you're looking for doesn't exist or has moved.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href="/en/listings"
              style={{
                display: "inline-block",
                padding: "13px 28px",
                background: "#e67e22",
                color: "white",
                borderRadius: "999px",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              Browse Listings
            </a>
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
