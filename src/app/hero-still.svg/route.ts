import { frameStillSvg } from "@/components/hero/frame-still-svg";

export const dynamic = "force-static";

/** /hero-still.svg: the hero's still drawing, generated at build time from the frame model. */
export function GET() {
  return new Response(frameStillSvg(), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
