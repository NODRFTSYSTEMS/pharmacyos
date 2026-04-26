interface EmptyStateProps {
  locale?: "en" | "es";
  /** true = filters are active and returned zero results; false = database has no listings */
  isFiltered?: boolean;
}

const copy = {
  en: {
    headingFiltered: "No listings match your filters.",
    headingEmpty: "No listings yet.",
    bodyFiltered: "Adjust your filters above, or reset to see all available properties.",
    bodyEmpty:
      "New vetted properties are added regularly across Medellín, Bogotá, Cartagena, and Colombia's top relocation cities.",
    cta: "Submit a Property",
  },
  es: {
    headingFiltered: "Ningún listado coincide con tus filtros.",
    headingEmpty: "Aún no hay listados.",
    bodyFiltered: "Ajusta los filtros o restablécelos para ver todas las propiedades disponibles.",
    bodyEmpty:
      "Nuevas propiedades verificadas se agregan regularmente en Medellín, Bogotá, Cartagena y las principales ciudades de reubicación de Colombia.",
    cta: "Enviar una Propiedad",
  },
};

export function EmptyState({ locale = "en", isFiltered = false }: EmptyStateProps) {
  const t = copy[locale];
  const heading = isFiltered ? t.headingFiltered : t.headingEmpty;
  const body = isFiltered ? t.bodyFiltered : t.bodyEmpty;

  return (
    <div
      data-testid="empty-state"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.25rem",
        padding: "4rem 2rem",
        textAlign: "center",
      }}
    >
      {/* Terracotta accent bar */}
      <span
        style={{
          display: "block",
          width: "3px",
          height: "48px",
          background: "var(--terracotta, #e67e22)",
          borderRadius: "2px",
        }}
      />

      <h2
        style={{
          fontFamily: "var(--font-display, Georgia, serif)",
          fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
          fontWeight: 400,
          color: "var(--ocean, #1f3a4d)",
          margin: 0,
          lineHeight: 1.25,
        }}
      >
        {heading}
      </h2>

      <p
        style={{
          color: "var(--muted, #6b7280)",
          fontSize: "0.95rem",
          margin: 0,
          maxWidth: "420px",
          lineHeight: 1.6,
        }}
      >
        {body}
      </p>

      {!isFiltered && (
        <a
          href="/listings/submit"
          className="btn btn-secondary"
          style={{ marginTop: "0.5rem" }}
        >
          {t.cta}
        </a>
      )}
    </div>
  );
}
