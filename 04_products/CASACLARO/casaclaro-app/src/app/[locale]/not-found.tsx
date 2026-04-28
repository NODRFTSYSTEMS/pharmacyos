import Image from "next/image";
import { getLocale } from "next-intl/server";

export default async function NotFound() {
  let locale: "en" | "es" = "en";
  try {
    const raw = await getLocale();
    locale = raw === "es" ? "es" : "en";
  } catch {
    // outside locale context — default to en
  }
  const isEn = locale === "en";

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

      <p
        style={{
          fontFamily: "var(--font-display, Georgia, serif)",
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
          fontFamily: "var(--font-display, Georgia, serif)",
          fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
          fontWeight: 400,
          color: "var(--ocean, #1f3a4d)",
          margin: "0 0 16px",
        }}
      >
        {isEn ? "Page not found." : "Página no encontrada."}
      </h1>

      <p
        style={{
          fontSize: "1rem",
          color: "rgba(31,58,77,0.5)",
          margin: "0 0 40px",
          maxWidth: "400px",
          lineHeight: 1.65,
          fontFamily: "var(--font-body, system-ui)",
        }}
      >
        {isEn
          ? "The page you're looking for doesn't exist or has moved. Let's get you back on track."
          : "La página que buscas no existe o fue movida. Volvamos al camino."}
      </p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <a
          href={`/${locale}/listings`}
          style={{
            display: "inline-block",
            padding: "13px 28px",
            background: "var(--terracotta, #e67e22)",
            color: "white",
            borderRadius: "999px",
            fontWeight: 600,
            fontSize: "0.9rem",
            textDecoration: "none",
            fontFamily: "var(--font-body, system-ui)",
          }}
        >
          {isEn ? "Browse Listings" : "Ver Listados"}
        </a>
        <a
          href={`/${locale}`}
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
          {isEn ? "Go Home" : "Ir al Inicio"}
        </a>
      </div>

      <div
        style={{
          marginTop: "64px",
          paddingTop: "32px",
          borderTop: "1px solid rgba(31,58,77,0.08)",
          display: "flex",
          gap: "24px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          { href: `/${locale}/cities`, en: "Compare Cities", es: "Comparar Ciudades" },
          { href: `/${locale}/guide`, en: "Property Guide", es: "Guía de Propiedad" },
          { href: `/${locale}/faq`, en: "FAQ", es: "Preguntas Frecuentes" },
          { href: `/${locale}/relocation`, en: "Relocate", es: "Reubicarse" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{
              fontSize: "0.83rem",
              color: "var(--lagoon, #1f6f78)",
              textDecoration: "none",
              fontWeight: 500,
              fontFamily: "var(--font-body, system-ui)",
            }}
          >
            {isEn ? link.en : link.es}
          </a>
        ))}
      </div>
    </div>
  );
}
