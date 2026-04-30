export function Skeleton({ width = "100%", height = 16, style }: {
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="skeleton"
      style={{ width, height, flexShrink: 0, ...style }}
    />
  );
}

export function SkeletonCard({ height = 180, style }: { height?: number; style?: React.CSSProperties }) {
  return (
    <div
      className="card"
      style={{ height, display: "flex", flexDirection: "column", gap: 12, padding: "20px 24px", ...style }}
    >
      <Skeleton width={80} height={10} />
      <Skeleton width="60%" height={28} />
      <Skeleton width="40%" height={10} style={{ marginTop: "auto" }} />
    </div>
  );
}

export function SkeletonRow({ cols = 4 }: { cols?: number }) {
  const widths = ["40%", "25%", "20%", "15%", "10%"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} width={widths[i] ?? "10%"} height={14} />
      ))}
    </div>
  );
}
