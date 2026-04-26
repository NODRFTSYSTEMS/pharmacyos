"use client";

import { useState } from "react";

type Intent = "buyer" | "renter" | "agent" | "just_looking";

interface Props {
  locale?: "en" | "es";
  variant?: "inline" | "banner";
  source?: string;
}

const INTENT_OPTIONS: { value: Intent; en: string; es: string }[] = [
  { value: "buyer", en: "Looking to buy", es: "Quiero comprar" },
  { value: "renter", en: "Looking to rent", es: "Quiero arrendar" },
  { value: "agent", en: "I'm an agent / partner", es: "Soy agente / socio" },
  { value: "just_looking", en: "Just exploring", es: "Solo explorando" },
];

export function EmailCapture({ locale = "en", variant = "inline", source = "unknown" }: Props) {
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState<Intent>("buyer");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const isEn = locale === "en";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, intent, source }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        style={{
          background: variant === "banner" ? "rgba(31,143,89,0.1)" : "var(--sand, #fff8ef)",
          border: "1px solid rgba(31,143,89,0.25)",
          borderRadius: "var(--radius, 26px)",
          padding: variant === "banner" ? "20px 24px" : "24px 28px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "1.1rem", margin: "0 0 6px", fontFamily: "var(--font-display, Georgia, serif)", color: "var(--ocean, #1f3a4d)" }}>
          {isEn ? "You're on the list." : "Estás en la lista."}
        </p>
        <p style={{ fontSize: "0.83rem", color: "rgba(31,58,77,0.55)", margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
          {isEn
            ? "We'll notify you when new listings match your criteria."
            : "Te avisaremos cuando haya nuevos listados que coincidan."}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: variant === "banner" ? "var(--ocean, #1f3a4d)" : "var(--sand, #fff8ef)",
        borderRadius: "var(--radius, 26px)",
        padding: variant === "banner" ? "32px 36px" : "28px 32px",
        border: variant === "banner" ? "none" : "1px solid rgba(31,58,77,0.08)",
      }}
    >
      {/* Heading */}
      <p
        style={{
          fontFamily: "var(--font-display, Georgia, serif)",
          fontSize: "1.2rem",
          fontWeight: 400,
          color: variant === "banner" ? "var(--cream, #fdf5e6)" : "var(--ocean, #1f3a4d)",
          margin: "0 0 6px",
        }}
      >
        {isEn ? "Get notified about new listings" : "Recibe alertas de nuevos listados"}
      </p>
      <p
        style={{
          fontSize: "0.82rem",
          color: variant === "banner" ? "rgba(255,255,255,0.55)" : "rgba(31,58,77,0.5)",
          margin: "0 0 20px",
          fontFamily: "var(--font-body, system-ui)",
        }}
      >
        {isEn
          ? "Be the first to see vetted properties in your target city."
          : "Sé el primero en ver inmuebles verificados en tu ciudad."}
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Intent selector */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {INTENT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setIntent(opt.value)}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                border: `1px solid ${intent === opt.value ? "var(--terracotta, #e67e22)" : variant === "banner" ? "rgba(255,255,255,0.2)" : "rgba(31,58,77,0.15)"}`,
                background: intent === opt.value ? "var(--terracotta, #e67e22)" : "transparent",
                color: intent === opt.value ? "white" : variant === "banner" ? "rgba(255,255,255,0.65)" : "rgba(31,58,77,0.6)",
                fontSize: "0.76rem",
                fontWeight: intent === opt.value ? 600 : 400,
                cursor: "pointer",
                fontFamily: "var(--font-body, system-ui)",
                transition: "all 0.15s",
              }}
            >
              {isEn ? opt.en : opt.es}
            </button>
          ))}
        </div>

        {/* Email row */}
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isEn ? "your@email.com" : "tu@correo.com"}
            required
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "999px",
              border: `1px solid ${variant === "banner" ? "rgba(255,255,255,0.2)" : "rgba(31,58,77,0.15)"}`,
              background: variant === "banner" ? "rgba(255,255,255,0.08)" : "white",
              color: variant === "banner" ? "white" : "var(--ocean, #1f3a4d)",
              fontSize: "0.88rem",
              fontFamily: "var(--font-body, system-ui)",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={status === "loading" || !email}
            style={{
              padding: "12px 22px",
              borderRadius: "999px",
              background: status === "loading" ? "rgba(230,126,34,0.6)" : "var(--terracotta, #e67e22)",
              color: "white",
              border: "none",
              fontWeight: 600,
              fontSize: "0.86rem",
              cursor: status === "loading" ? "not-allowed" : "pointer",
              fontFamily: "var(--font-body, system-ui)",
              whiteSpace: "nowrap",
              transition: "opacity 0.15s",
            }}
          >
            {status === "loading"
              ? (isEn ? "..." : "...")
              : (isEn ? "Notify me" : "Notificarme")}
          </button>
        </div>

        {status === "error" && (
          <p style={{ fontSize: "0.75rem", color: "#e53e3e", margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
            {isEn ? "Something went wrong. Try again." : "Algo salió mal. Intenta de nuevo."}
          </p>
        )}

        <p style={{ fontSize: "0.69rem", color: variant === "banner" ? "rgba(255,255,255,0.3)" : "rgba(31,58,77,0.3)", margin: 0, fontFamily: "var(--font-body, system-ui)" }}>
          {isEn ? "No spam. Unsubscribe anytime." : "Sin spam. Cancela cuando quieras."}
        </p>
      </form>
    </div>
  );
}
