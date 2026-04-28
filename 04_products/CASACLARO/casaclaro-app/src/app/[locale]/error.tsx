"use client";

import Image from "next/image";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "60px 24px",
        background: "var(--cream, #fdf5e6)",
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

      <div
        style={{
          width: "48px",
          height: "3px",
          background: "var(--terracotta, #e67e22)",
          borderRadius: "2px",
          marginBottom: "28px",
        }}
      />

      <h1
        style={{
          fontFamily: "var(--font-display, Georgia, serif)",
          fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
          fontWeight: 400,
          color: "var(--ocean, #1f3a4d)",
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
          fontFamily: "var(--font-body, system-ui)",
        }}
      >
        We hit an unexpected error. Try again or head back to the homepage.
      </p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={reset}
          style={{
            padding: "13px 28px",
            background: "var(--terracotta, #e67e22)",
            color: "white",
            borderRadius: "999px",
            fontWeight: 600,
            fontSize: "0.9rem",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body, system-ui)",
          }}
        >
          Try Again
        </button>
        <a
          href="/"
          style={{
            display: "inline-block",
            padding: "13px 28px",
            background: "transparent",
            color: "var(--ocean, #1f3a4d)",
            borderRadius: "999px",
            fontWeight: 600,
            fontSize: "0.9rem",
            textDecoration: "none",
            fontFamily: "var(--font-body, system-ui)",
            border: "1.5px solid rgba(31,58,77,0.18)",
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
