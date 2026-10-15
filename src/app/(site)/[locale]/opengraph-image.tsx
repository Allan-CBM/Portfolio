import { ImageResponse } from "next/og";

import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export const alt = "Allan Martins — Graphic & Product Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const dict = getDictionary(isLocale(raw) ? raw : "en");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#050505",
          color: "#ffffff",
          fontFamily: "sans-serif",
          backgroundImage:
            "radial-gradient(circle at 85% 20%, rgba(139,92,246,0.35), transparent 45%), radial-gradient(circle at 15% 90%, rgba(110,231,255,0.25), transparent 45%)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 6, color: "#888888" }}>
          <span>{dict.hero.roles.join("  ·  ").toUpperCase()}</span>
          <span style={{ color: "#6EE7FF" }}>AM</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 150, fontWeight: 700, lineHeight: 0.88, letterSpacing: -6 }}>
          <span>ALLAN</span>
          <span style={{ color: "transparent", WebkitTextStroke: "2px rgba(255,255,255,0.6)" }}>MARTINS</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#bbbbbb" }}>
          <span>{dict.hero.headline.replace(/\n/g, " ")}</span>
        </div>
      </div>
    ),
    size,
  );
}
