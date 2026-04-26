import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#1f3a4d",
          padding: "60px 72px",
          position: "relative",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at 80% 20%, rgba(230,126,34,0.15) 0%, transparent 60%), radial-gradient(ellipse at 10% 80%, rgba(31,111,120,0.2) 0%, transparent 50%)",
          }}
        />

        {/* Tagline badge */}
        <div
          style={{
            display: "flex",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              background: "rgba(230,126,34,0.15)",
              border: "1px solid rgba(230,126,34,0.4)",
              borderRadius: "999px",
              padding: "8px 20px",
              color: "#e67e22",
              fontSize: "18px",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            Colombia Property Intelligence
          </div>
        </div>

        {/* Wordmark */}
        <div
          style={{
            color: "#fdf5e6",
            fontSize: "88px",
            fontWeight: 300,
            lineHeight: 1,
            marginBottom: "20px",
            letterSpacing: "-0.02em",
          }}
        >
          CasaClaro
        </div>

        {/* Description */}
        <div
          style={{
            color: "rgba(255,255,255,0.65)",
            fontSize: "26px",
            lineHeight: 1.5,
            maxWidth: "720px",
          }}
        >
          Buy, rent, relocate, or list Colombian real estate — with real context for expats and foreign buyers.
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            right: "72px",
            color: "rgba(255,255,255,0.3)",
            fontSize: "18px",
          }}
        >
          casaclaro.co
        </div>

        {/* Accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "6px",
            height: "100%",
            background: "linear-gradient(180deg, #e67e22 0%, #1f6f78 100%)",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
