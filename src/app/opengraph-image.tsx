import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/site";

export const alt = "museum of my mind — personal image archive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#fefefe",
          color: "#171717",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(23, 23, 23, 0.14)",
            bottom: "54px",
            display: "flex",
            left: "54px",
            position: "absolute",
            right: "54px",
            top: "54px",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "84px",
              fontStyle: "italic",
              letterSpacing: "-4px",
              lineHeight: 1,
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              color: "#76736d",
              fontFamily: "monospace",
              fontSize: "18px",
              letterSpacing: "6px",
              textTransform: "uppercase",
            }}
          >
            personal image archive
          </div>
        </div>
      </div>
    ),
    size,
  );
}
