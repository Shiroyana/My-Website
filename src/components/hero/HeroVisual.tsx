"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { LIVE_ATTR } from "./live-check";

const TimberFrame3D = dynamic(() => import("./TimberFrame3D"), { ssr: false });

/** Live 3D only on a wide screen, a capable device, with motion allowed and data not saved. */
function canRunLive(): boolean {
  if (typeof window === "undefined") return false;
  // ?still forces the still image (to measure the page without the 3D)
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

/** Show the finished still again (the live build will not play or failed). */
function showStill() {
  document.documentElement.removeAttribute(LIVE_ATTR);
}

/** If WebGL fails at runtime, show the still and drop the live layer quietly. */
class Quiet extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    showStill();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The hero picture. `children` is the server-rendered still (the LCP element everywhere); the live
 * 3D loads after the page is idle and fades in over it once its first frame is drawn. When the
 * build has finished, a button lets the visitor watch it again.
 */
export function HeroVisual({ children }: { children: ReactNode }) {
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);
  const [run, setRun] = useState(0);
  const [doneRun, setDoneRun] = useState(-1);
  const settled = doneRun === run;

  // X-ray: on while the pointer is over the building, or pinned with the button
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [fading, setFading] = useState(false);
  const fadeTimer = useRef<number | undefined>(undefined);
  const xray = settled && (hover || pinned);
  /** keep the 3D loop running long enough for the walls to finish fading */
  const fade = () => {
    setFading(true);
    window.clearTimeout(fadeTimer.current);
    fadeTimer.current = window.setTimeout(() => setFading(false), 900);
  };
  useEffect(() => () => window.clearTimeout(fadeTimer.current), []);

  useEffect(() => {
    if (!canRunLive()) {
      showStill();
      return;
    }
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => setLive(true));
    return () => cancel(id);
  }, []);

  // a safety net: if the first live frame has not drawn after 8 seconds, show the still
  useEffect(() => {
    if (ready) return;
    const t = window.setTimeout(showStill, 8000);
    return () => window.clearTimeout(t);
  }, [ready]);

  return (
    <>
      {children}
      {live ? (
        <>
          <div
            className="hero-visual__live"
            data-ready={ready ? "" : undefined}
            onPointerEnter={() => {
              setHover(true);
              fade();
            }}
            onPointerLeave={() => {
              setHover(false);
              fade();
            }}
          >
            <Quiet>
              <TimberFrame3D
                run={run}
                settled={settled}
                xray={xray}
                fading={fading}
                onReady={() => setReady(true)}
                onSettled={() => setDoneRun(run)}
              />
            </Quiet>
          </div>
          {ready && settled ? (
            <div className="hero-tools">
              {/* the same X-ray as hovering the building, for keyboards and touch screens */}
              <button
                type="button"
                className="hero-tool hero-tool--text glass-dark"
                aria-pressed={pinned}
                onClick={() => {
                  setPinned((p) => !p);
                  fade();
                }}
              >
                X-ray
              </button>
              <button
                type="button"
                className="hero-tool glass-dark"
                aria-label="Replay the build animation"
                onClick={() => {
                  setPinned(false);
                  setRun((r) => r + 1);
                }}
              >
                <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                  <path
                    d="M4 10a6 6 0 1 0 2-4.5M4 3.5V6h2.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </>
  );
}
