"use client";

import { useEffect } from "react";

type Umami = { track: (event: string) => void };

/** Sends one Umami event when the page loads (Umami's script may arrive a moment later). */
export function TrackConversion({ event }: { event: string }) {
  useEffect(() => {
    let tries = 0;
    const id = window.setInterval(() => {
      const u = (window as Window & { umami?: Umami }).umami;
      if (u) {
        u.track(event);
        window.clearInterval(id);
      } else if (++tries > 20) {
        window.clearInterval(id);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [event]);
  return null;
}
