import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";
import { color } from "@/lib/tokens";

export const alt = `${site.name}: ${site.brandLine}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The share card: the blueprint sheet, the logo, the brand line. Built at build time. */
export default async function OgImage() {
  const icon = await readFile(join(process.cwd(), "public/brand/cambi-icon-512.png"));
  const src = `data:image/png;base64,${icon.toString("base64")}`;
  const grid = "rgba(244,240,230,0.10)";
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: color.blueprint,
        backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
        color: color.onDark,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- satori needs a plain img */}
        <img src={src} width={72} height={72} alt="" />
        <div style={{ fontSize: 40 }}>{site.name}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{ fontSize: 76, letterSpacing: -2, lineHeight: 1.05 }}
        >{`${site.brandLine}.`}</div>
        <div style={{ fontSize: 30, color: color.onDarkSoft }}>
          AI booking setup for HVAC, plumbing and electrical shops in NYC
        </div>
      </div>
      <div style={{ display: "flex", height: 8, width: 240 }}>
        <div style={{ flex: 1, background: color.timber300 }} />
        <div style={{ flex: 1, background: color.timber500 }} />
        <div style={{ flex: 1, background: color.timber700 }} />
      </div>
    </div>,
    size,
  );
}
