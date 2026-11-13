"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BoxGeometry,
  BufferGeometry,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  MeshStandardMaterial,
} from "three";
import { GRID, MEMBERS, WOOD } from "./frame-model";
import { color } from "@/lib/tokens";

/**
 * The live hero: the frame draws in as blueprint lines, member by member in build order, then
 * fills with timber, then sways slowly. Loaded client-only and lazily by HeroVisual; never on
 * phones, low-power devices or under reduced motion (the still shows there).
 */

const LINES_FOR = 2.2; // s: every member's outline drawn
const FILL_FOR = 1.4; // s: timber fills in, in the same order
const DONE = LINES_FOR + FILL_FOR;
const SETTLE_FOR = 1.0; // s: one slow quarter-turn settle, then everything rests
// All motion ends before 5 s (WCAG 2.2.2: no pause control needed), then the render loop stops.
const END = DONE + SETTLE_FOR;
const ON_DARK = color.onDark;
const LOGO_GREEN = color.logoGreen;

const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3));

function Frame({ onReady, onSettled }: { onReady: () => void; onSettled: () => void }) {
  const group = useRef<Group>(null);
  const start = useRef<number | null>(null);
  const told = useRef(false);

  const parts = useMemo(
    () =>
      MEMBERS.map((m) => {
        const size: [number, number, number] = [
          m.max[0] - m.min[0],
          m.max[1] - m.min[1],
          m.max[2] - m.min[2],
        ];
        const pos: [number, number, number] = [
          (m.min[0] + m.max[0]) / 2,
          (m.min[1] + m.max[1]) / 2,
          (m.min[2] + m.max[2]) / 2,
        ];
        const box = new BoxGeometry(...size);
        return {
          m,
          pos,
          box,
          edges: new EdgesGeometry(box),
          wood: new MeshStandardMaterial({
            color: m.kind === "slab" ? WOOD.slab.top : WOOD[m.kind].x,
            roughness: 0.85,
            metalness: 0,
            transparent: true,
            opacity: 0,
          }),
          ink: new LineBasicMaterial({ color: ON_DARK, transparent: true, opacity: 0 }),
        };
      }),
    [],
  );

  // the plan grid on the ground, in the logo green
  const grid = useMemo(() => {
    const ext = 2.6;
    const xs = GRID.xs;
    const zs = GRID.zs;
    const pts: number[] = [];
    for (const x of xs) pts.push(x, 0, zs[0] - ext, x, 0, zs[zs.length - 1] + ext);
    for (const z of zs) pts.push(xs[0] - ext, 0, z, xs[xs.length - 1] + ext, 0, z);
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  const gridInk = useMemo(
    () => new LineBasicMaterial({ color: LOGO_GREEN, transparent: true, opacity: 0.55 }),
    [],
  );

  useEffect(
    () => () => {
      for (const p of parts) {
        p.box.dispose();
        p.edges.dispose();
        p.wood.dispose();
        p.ink.dispose();
      }
      grid.dispose();
      gridInk.dispose();
    },
    [parts, grid, gridInk],
  );

  /* eslint-disable react-hooks/immutability -- three.js materials are mutable scene objects, not
     React state; updating them per frame inside useFrame is react-three-fiber's intended pattern. */
  useFrame((state) => {
    const now = state.clock.getElapsedTime();
    if (start.current == null) start.current = now;
    const t = now - start.current;

    for (const p of parts) {
      const lineT = ease((t - p.m.at * (LINES_FOR - 0.4)) / 0.4);
      const fillT = ease((t - LINES_FOR - p.m.at * (FILL_FOR - 0.5)) / 0.5);
      p.ink.opacity = lineT * (1 - 0.7 * fillT);
      p.wood.opacity = fillT;
      p.wood.transparent = fillT < 1;
    }

    if (group.current) {
      group.current.rotation.y = -0.18 - 0.16 * ease((t - DONE) / SETTLE_FOR);
    }
    if (t > END + 0.1) onSettled();

    // Hand over from the still only once every shader program compiled and linked; a strict GPU
    // that rejects one leaves the still drawing in place.
    if (!told.current && t > 0.1) {
      told.current = true;
      const programs = (state.gl.info.programs ?? []) as { diagnostics?: { runnable: boolean } }[];
      if (programs.length > 0 && programs.every((p) => !p.diagnostics || p.diagnostics.runnable)) {
        onReady();
      }
    }
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <group ref={group} position={[0, -5, 0]}>
      <lineSegments geometry={grid} material={gridInk} />
      {parts.map((p, i) => (
        <group key={i} position={p.pos}>
          <mesh geometry={p.box} material={p.wood} />
          <lineSegments geometry={p.edges} material={p.ink} />
        </group>
      ))}
    </group>
  );
}

export default function TimberFrame3D({ onReady }: { onReady: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [settled, setSettled] = useState(false);

  // pause the render loop when the frame is off screen or the tab is hidden
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let inView = true;
    const update = () => setActive(inView && document.visibilityState === "visible");
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      update();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <div ref={host} style={{ width: "100%", height: "100%" }} aria-hidden="true">
      <Canvas
        frameloop={active && !settled ? "always" : "never"}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [40, 28, 40], fov: 30, near: 1, far: 250 }}
        onCreated={({ camera }) => camera.lookAt(0, -0.5, 0)}
      >
        <hemisphereLight args={[color.onDark, color.blueprint, 1.1]} />
        <directionalLight position={[14, 24, 10]} intensity={1.8} />
        <Frame onReady={onReady} onSettled={() => setSettled(true)} />
      </Canvas>
    </div>
  );
}
