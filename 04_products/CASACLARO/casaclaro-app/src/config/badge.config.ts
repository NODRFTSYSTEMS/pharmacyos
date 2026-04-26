import type { VettingLevel } from "@/types/listings";

export interface BadgeConfig {
  level: VettingLevel;
  label: { en: string; es: string };
  tooltip: { en: string; es: string };
  /** Inline styles for the badge chip — uses CSS variables for theme fidelity */
  chipStyle: React.CSSProperties;
  /** Background color for the status dot */
  dotColor: string;
}

export const BADGE_CONFIG: Record<VettingLevel, BadgeConfig> = {
  fully_vetted: {
    level: "fully_vetted",
    label: {
      en: "Fully Vetted",
      es: "Verificado Completo",
    },
    tooltip: {
      en: "Title is clear, documents legally reviewed, property physically inspected, and HOA rules confirmed by a CasaClaro professional.",
      es: "Título limpio, revisión legal completa, inspección física y reglamento de propiedad horizontal confirmados por un profesional CasaClaro.",
    },
    chipStyle: {
      background: "var(--badge-vetted-bg)",
      color: "var(--badge-vetted-text)",
      border: "1px solid var(--badge-vetted-border)",
    },
    dotColor: "var(--emerald)",
  },
  professional_review: {
    level: "professional_review",
    label: {
      en: "Professional Review",
      es: "Revisión Profesional",
    },
    tooltip: {
      en: "A licensed professional has reviewed key documents. Full inspection vetting is in progress or partially complete.",
      es: "Un profesional habilitado revisó documentos clave. La verificación completa está en proceso o parcialmente realizada.",
    },
    chipStyle: {
      background: "var(--badge-pro-bg)",
      color: "var(--badge-pro-text)",
      border: "1px solid var(--badge-pro-border)",
    },
    dotColor: "var(--lagoon)",
  },
  basic: {
    level: "basic",
    label: {
      en: "Basic",
      es: "Básico",
    },
    tooltip: {
      en: "Listing has been reviewed for completeness. Full legal and property vetting has not been completed.",
      es: "El listado fue revisado para completitud. La verificación legal y de propiedad completa no fue realizada.",
    },
    chipStyle: {
      background: "var(--badge-basic-bg)",
      color: "var(--badge-basic-text)",
      border: "1px solid var(--badge-basic-border)",
    },
    dotColor: "var(--muted)",
  },
};
