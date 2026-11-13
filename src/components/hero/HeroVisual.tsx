"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";

const TimberFrame3D = dynamic(() => import("./TimberFrame3D"), { ssr: false });

/** Live 3D only on a wide screen, a capable device, with motion allowed and data not saved. */
function canRunLive(): boolean {
  if (typeof window === "undefined") return false;
  // ?still forces the still drawing (to measure the page without the 3D)
  if (new URLSearchParams(window.location.search).has("still")) return false;
  if (!window.matchMedia("(min-width: 1024px)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if ((nav.hardwareConcurrency ?? 8) <= 4) return false;
  if (nav.deviceMemory != null && nav.deviceMemory < 4) return false;
  if (nav.connection?.saveData) return false;
  try {
    const c = document.createElement("canvas");
    if (!(c.getContext("webgl2") || c.getContext("webgl"))) return false;
  } catch {
    return false;
  }
  return true;
}

/** If WebGL fails at runtime, keep the still and drop the live layer quietly. */
class Quiet extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The hero picture. `children` is the server-rendered still (the LCP element everywhere); the live
 * 3D loads after the page is idle and fades in over it once its first frame is drawn.
 */
export function HeroVisual({ children }: { children: ReactNode }) {
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!canRunLive()) return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => setLive(true));
    return () => cancel(id);
  }, []);

  return (
    <>
      {children}
      {live ? (
        <div className="hero-visual__live" data-ready={ready ? "" : undefined}>
          <Quiet>
            <TimberFrame3D onReady={() => setReady(true)} />
          </Quiet>
        </div>
      ) : null}
    </>
  );
}
