import { ImageResponse } from "next/og";

export const alt =
  "Your First Keploy Test with Go: from a real API request to a replayed test";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card, generated at build time by next/og. Deliberately plain: a warm
 * dark panel, the tutorial title, and the stack. No gradients, no stock imagery.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c0a09",
          padding: "76px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "#d97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "30px",
              fontWeight: 700,
            }}
          >
            →
          </div>
          <div
            style={{
              color: "#fcd34d",
              fontSize: "26px",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            Keploy · Go quickstart
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            style={{
              color: "#f5f5f4",
              fontSize: "74px",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-2px",
            }}
          >
            Your First Keploy Test with Go
          </div>
          <div style={{ color: "#a8a29e", fontSize: "34px" }}>
            From a real API request to a replayed test
          </div>
        </div>

        <div style={{ display: "flex", gap: "18px", color: "#8a8177", fontSize: "24px" }}>
          <span>Keploy</span>
          <span>·</span>
          <span>Go</span>
          <span>·</span>
          <span>Docker</span>
          <span>·</span>
          <span>PostgreSQL</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
