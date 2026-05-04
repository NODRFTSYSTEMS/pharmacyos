import type { PackageRecord } from "@/content/capabilities";
import type { Locale } from "@/content/types";
import { pick } from "@/content/types";

interface PackageCardProps {
  pkg: PackageRecord;
  locale: Locale;
  startHref: string;
  alt?: boolean;
}

export function PackageCard({ pkg, locale, startHref, alt = false }: PackageCardProps) {
  return (
    <section
      id={pkg.id}
      className={`nd-section${alt ? " alt" : ""}`}
      aria-labelledby={`${pkg.id}-heading`}
      style={{ scrollMarginTop: "var(--nav-height)" }}
    >
      <div className="nd-wrap">
        <span className={`nd-pkg-tier ${pkg.tier}`}>
          {pick(pkg.tierLabel, locale)}
        </span>

        <div className="nd-pkg-header">
          <div>
            <h2 id={`${pkg.id}-heading`} className="nd-h2" style={{ marginBottom: "4px" }}>
              {pick(pkg.name, locale)}
            </h2>
          </div>
          <a href={startHref} className="nd-price">
            {locale === "en" ? "Get pricing →" : "Consultar precio →"}
          </a>
        </div>

        <p className="nd-p" style={{ marginBottom: "8px" }}>
          {pick(pkg.summary, locale)}
        </p>
        <p className="nd-p-xs nd-pkg-subtext" style={{ marginBottom: "24px" }}>
          {pick(pkg.subtext, locale)}
        </p>

        {pkg.startHereNote && (
          <div className="nd-start-here-note">
            <p className="nd-p-xs nd-note-copy">
              {pick(pkg.startHereNote, locale)}
            </p>
          </div>
        )}

        {pkg.notFor && (
          <div className="nd-not-for-note">
            <p className="nd-p-xs nd-note-copy">
              <strong>{locale === "en" ? "Not for: " : "No es para: "}</strong>
              {pick(pkg.notFor, locale)}
            </p>
          </div>
        )}

        <div className="nd-grid-2" style={{ marginBottom: "24px" }}>
          <div>
            <h3 className="nd-h3" style={{ marginBottom: "var(--space-4)" }}>
              {locale === "en" ? "Includes" : "Incluye"}
            </h3>
            {pkg.includes.map((item, i) => (
              <span key={i} className="nd-inc">{pick(item, locale)}</span>
            ))}
          </div>
          <div>
            <h3 className="nd-h3" style={{ color: "var(--text-md)", marginBottom: "var(--space-4)" }}>
              {locale === "en" ? "Does not include" : "No incluye"}
            </h3>
            {pkg.excludes.map((item, i) => (
              <span key={i} className="nd-exc">{pick(item, locale)}</span>
            ))}
          </div>
        </div>

        <div className="nd-pkg-footer">
          <span className="nd-timeline">{pick(pkg.timeline, locale)}</span>
          <a href={startHref} className="btn--ghost">
            {locale === "en" ? "Start an Engagement" : "Iniciar un Proyecto"}
          </a>
        </div>
      </div>
    </section>
  );
}
