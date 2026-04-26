import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Peak Equity Optimizer — Real Estate Deal Analysis Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "64px 72px",
          background: "#070a10",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top accent bar — lime green matching logo */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "#7FD416", display: "flex" }} />

        {/* Brand mark — shield icon approximation + wordmark */}
        <div style={{ position: "absolute", top: "52px", left: "72px", display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Shield mark */}
          <div style={{
            width: "52px", height: "52px", borderRadius: "4px",
            background: "#0A1628",
            border: "2px solid #8A9BAD",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Mountain shape */}
            <div style={{
              position: "absolute", bottom: "12px", left: "6px", right: "6px",
              height: "22px",
              background: "#1A3A6A",
              clipPath: "polygon(0% 100%, 30% 30%, 48% 60%, 60% 25%, 75% 55%, 100% 100%)",
              display: "flex",
            }} />
            {/* Green bottom bar */}
            <div style={{
              position: "absolute", bottom: "6px", left: "6px", right: "6px",
              height: "3px", background: "#7FD416", borderRadius: "2px",
              display: "flex",
            }} />
            {/* Blue bar chart */}
            <div style={{
              position: "absolute", top: "8px", right: "8px",
              display: "flex", alignItems: "flex-end", gap: "2px",
            }}>
              <div style={{ width: "5px", height: "12px", background: "#1E6FCC", borderRadius: "1px", display: "flex" }} />
              <div style={{ width: "5px", height: "18px", background: "#2B8AE0", borderRadius: "1px", display: "flex" }} />
            </div>
          </div>

          {/* Wordmark */}
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "7px" }}>
              <span style={{ color: "#ffffff", fontSize: "22px", fontWeight: 800, letterSpacing: "0.04em" }}>PEAK</span>
              <span style={{ color: "#7FD416", fontSize: "22px", fontWeight: 800, letterSpacing: "0.04em" }}>EQUITY</span>
            </div>
            <span style={{ color: "#8A9BAD", fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em", marginTop: "3px" }}>OPTIMIZER</span>
          </div>
        </div>

        {/* Main copy */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ color: "#7FD416", fontSize: "15px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Real Estate Intelligence Platform
          </div>
          <div style={{ color: "#ffffff", fontSize: "52px", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: "820px" }}>
            Verify ARV. Calculate MAO. Make confident offers.
          </div>
          <div style={{ color: "#8892a0", fontSize: "22px", fontWeight: 400, lineHeight: 1.4, maxWidth: "720px" }}>
            Live comps · Verified ARV · Flip, BRRRR, Rental &amp; Wholesale analysis
          </div>
        </div>

        {/* Bottom URL */}
        <div style={{ position: "absolute", bottom: "52px", right: "72px", color: "#4a5568", fontSize: "15px" }}>
          peakequityoptimizer.com
        </div>

        {/* Bottom right accent — green glow strip */}
        <div style={{ position: "absolute", bottom: 0, right: 0, width: "320px", height: "3px", background: "#5CB800", display: "flex" }} />
      </div>
    ),
    { ...size }
  );
}
