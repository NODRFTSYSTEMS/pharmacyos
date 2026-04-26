import { ListingCard } from "./ListingCard";
import { EmptyState } from "./EmptyState";
import type { Listing } from "@/types/listings";

interface ListingsGridProps {
  listings: Listing[];
  isLoading: boolean;
  locale?: "en" | "es";
  /** Pass true when filters are active so EmptyState shows the correct message */
  isFiltered?: boolean;
}

function SkeletonCard() {
  return (
    <div
      style={{
        background: "var(--card, rgba(255,252,247,0.92))",
        borderRadius: "var(--radius, 26px)",
        overflow: "hidden",
        border: "1px solid var(--border, rgba(35,49,63,0.08))",
      }}
    >
      <div
        style={{
          aspectRatio: "16 / 10",
          background: "linear-gradient(90deg, var(--sand, #fff8ef) 25%, var(--rose, #f7e1d0) 50%, var(--sand, #fff8ef) 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.6s infinite",
        }}
      />
      <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {[80, 120, 60].map((w, i) => (
          <div
            key={i}
            style={{
              height: "14px",
              width: `${w}%`,
              background: "var(--rose, #f7e1d0)",
              borderRadius: "6px",
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function ListingsGrid({ listings, isLoading, locale = "en", isFiltered = false }: ListingsGridProps) {
  if (isLoading) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "24px",
        }}
      >
        {[1, 2, 3].map((n) => (
          <SkeletonCard key={n} />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return <EmptyState locale={locale} isFiltered={isFiltered} />;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "24px",
      }}
    >
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} locale={locale} />
      ))}
    </div>
  );
}
