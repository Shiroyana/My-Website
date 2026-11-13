"use client";

import { useEffect } from "react";

/**
 * Starts the Taste Skill kit scripts (nav sheet, hover and press layer, moments, layout helpers)
 * after React has hydrated, so their DOM changes never race hydration. Pages link with plain <a>
 * (full page loads), so each page starts the scripts fresh.
 */
export function TasteRuntime() {
  useEffect(() => {
    const load = (src: string) =>
      import(/* webpackIgnore: true */ /* turbopackIgnore: true */ src).catch(() => {
        document.documentElement.classList.add("m-enter-done", "mo-safe");
      });
    // after first paint, when the browser is idle (at most 1.5 s later), so they never compete with LCP
    const start = () => {
      void load("/assets/system.js");
      void load("/assets/motion/motion.js");
      void load("/assets/layout/layout.js");
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(start, 300);
    return () => clearTimeout(t);
  }, []);
  return null;
}
