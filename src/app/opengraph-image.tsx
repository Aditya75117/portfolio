import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#f3eee6",
          background:
            "radial-gradient(circle at 82% 18%, #42372b 0%, #171310 38%, #0b0a09 72%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 54,
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
        >
          AD.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              maxWidth: 950,
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.045em",
            }}
          >
            {site.title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#c8bbaa",
              letterSpacing: "0.02em",
            }}
          >
            {site.role} · {site.location}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
