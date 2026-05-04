import type { EngagementRecord } from "@/content/engagements";
import type { Locale } from "@/content/types";
import { pick } from "@/content/types";

interface EngagementCardProps {
  record: EngagementRecord;
  locale: Locale;
}

export function EngagementCard({ record, locale }: EngagementCardProps) {
  return (
    <article
      className="nd-card nd-card-spaced"
      aria-labelledby={`eng-${record.id}`}
      style={{ position: "relative" }}
    >
      <span className="nd-card__corner" aria-hidden="true" />
      <span className="nd-label" style={{ display: "block", marginBottom: "var(--space-4)" }}>
        {pick(record.label, locale)}
      </span>
      <p className="nd-p">{pick(record.summary, locale)}</p>
      <dl className="nd-eng-meta" aria-label={locale === "en" ? "Engagement details" : "Detalles del proyecto"}>
        {record.meta.map((item, i) => (
          <div key={i} style={{ display: "contents" }}>
            <dt className="nd-eng-key">{pick(item.key, locale)}</dt>
            <dd className="nd-eng-val">{pick(item.value, locale)}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
