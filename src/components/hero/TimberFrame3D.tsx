"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BoxGeometry,
  BufferGeometry,
  Color,
  CylinderGeometry,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  type Material,
  MeshStandardMaterial,
  type Object3D,
  type PerspectiveCamera,
  type PointLight,
} from "three";
import { color } from "@/lib/tokens";
import {
  ARRIVE_FOR,
  BUILD_END,
  LIGHTS_ON,
  PIECES,
  PLAN_LINES,
  type Kind,
} from "./duplex-model";

/**
 * The live hero: a mass-timber duplex assembles on its blueprint plan. Foundations, columns, walls,
 * the trades (ducts, pipes, conduit, fixtures, chutes), beams and CLT decks fall into place storey by
 * storey; heat pumps and solar land on the roof; the glazing slides in from the sides; the lights
 * come on. All motion ends at BUILD_END (under 5 s, WCAG 2.2.2), then the render loop stops.
 *
 * X-ray: once built, the walls, floors and roofs can fade to an outline so the trades inside show
 * (on hover, or pinned with the X-ray button in HeroVisual). The loop runs only while it fades.
 *
 * Loaded client-only and lazily by HeroVisual; never on phones, low-power devices or under reduced
 * motion (the still image shows there).
 */

/** the frame the still image was captured at; other shapes crop like object-fit: cover */
const BASE_ASPECT = 628 / 716;
const DROP = 9; // metres a falling piece starts above its place
const SLIDE = 7; // metres a sliding window starts out to the side
const TURN_FROM = 0.12; // the building turns slowly toward the viewer as it rises
const TURN_TO = -0.2;
const XRAY_FOR = 0.45; // seconds for the walls to fade
const XRAY_OPACITY = 0.07; // how solid the enclosure stays in the X-ray view

/** one lamp per room: [x, y, z] in the model's metres */
const LAMPS: [number, number, number][] = [
  [-3.1, 2.2, 0.6],
  [-3.1, 5.5, 0.6],
  [3.1, 2.2, 2.1],
  [3.1, 5.5, 2.1],
];
const LAMP_POWER = 26;

const easeOut = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3));
const easeInOut = (t: number) =>
  t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const LOOK: Record<Kind, { color: string; rough?: number; metal?: number }> = {
  foundation: { color: color.onDarkFaint, rough: 0.95 },
  finish: { color: color.timber100, rough: 0.8 },
  column: { color: color.timber500, rough: 0.75 },
  beam: { color: color.timber700, rough: 0.75 },
  floor: { color: color.timber100, rough: 0.8 },
  wall: { color: color.timber300, rough: 0.85 },
  roof: { color: color.timber100, rough: 0.8 },
  glass: { color: color.onDarkSoft, rough: 0.08 },
  door: { color: color.timber900, rough: 0.7 },
  duct: { color: color.onDarkSoft, rough: 0.35, metal: 0.6 },
  unit: { color: color.onDarkFaint, rough: 0.5, metal: 0.4 },
  grille: { color: color.logoTile, rough: 0.6 },
  pipe: { color: color.logoGreen, rough: 0.45, metal: 0.2 },
  tank: { color: color.onDark, rough: 0.4, metal: 0.2 },
  conduit: { color: color.teal, rough: 0.5, metal: 0.3 },
  panel: { color: color.teal, rough: 0.5, metal: 0.3 },
  light: { color: color.accentOnDark, rough: 0.4 },
  solar: { color: color.logoTile, rough: 0.25, metal: 0.5 },
  fixture: { color: color.onDark, rough: 0.35 },
  copper: { color: color.accentOnDark, rough: 0.35, metal: 0.6 },
  chute: { color: color.onDarkFaint, rough: 0.4, metal: 0.5 },
};
/** kinds drawn with a fine outline, like linework on a drawing */
const OUTLINED = new Set<Kind>(["foundation", "column", "beam", "floor", "wall", "roof", "glass", "solar", "unit", "chute"]);
/** the enclosure: what fades away in the X-ray view */
const ENCLOSURE = new Set<Kind>(["wall", "floor", "roof", "door", "solar"]);

const INK = new Color(color.blueprint);
const LINE = new Color(color.onDark);

function Duplex({
  xray,
  onReady,
  onSettled,
}: {
  xray: boolean;
  onReady: () => void;
  onSettled: () => void;
}) {
  const group = useRef<Group>(null);
  const nodes = useRef<(Object3D | null)[]>([]);
  const lamps = useRef<(PointLight | null)[]>([]);
  const start = useRef<number | null>(null);
  const told = useRef({ ready: false, settled: false });
  const see = useRef({ want: false, now: 0 });

  useEffect(() => {
    see.current.want = xray;
  }, [xray]);

  const kit = useMemo(() => {
    const mats = Object.fromEntries(
      (Object.keys(LOOK) as Kind[]).map((k) => {
        const l = LOOK[k];
        const m = new MeshStandardMaterial({ color: l.color, roughness: l.rough ?? 0.7, metalness: l.metal ?? 0 });
        if (k === "glass") {
          m.transparent = true;
          m.opacity = 0.1;
          m.depthWrite = false;
        }
        // the enclosure is always in the transparent pass, so fading it never recompiles a shader
        if (ENCLOSURE.has(k)) m.transparent = true;
        if (k === "light") {
          m.emissive.set(color.accentOnDark);
          m.emissiveIntensity = 0;
        }
        return [k, m];
      }),
    ) as Record<Kind, MeshStandardMaterial>;
    const edge = new LineBasicMaterial({ color: color.blueprint, transparent: true, opacity: 0.32 });
    const edgeX = new LineBasicMaterial({ color: color.blueprint, transparent: true, opacity: 0.32 });
    const plan = new LineBasicMaterial({ color: color.logoGreen, transparent: true, opacity: 0 });

    const parts = PIECES.map((p) => {
      const size: [number, number, number] = [p.max[0] - p.min[0], p.max[1] - p.min[1], p.max[2] - p.min[2]];
      const home: [number, number, number] = [
        (p.min[0] + p.max[0]) / 2,
        (p.min[1] + p.max[1]) / 2,
        (p.min[2] + p.max[2]) / 2,
      ];
      const geo =
        p.kind === "tank" ? new CylinderGeometry(size[0] / 2, size[0] / 2, size[1], 20) : new BoxGeometry(...size);
      return { p, size, home, geo, edges: OUTLINED.has(p.kind) ? new EdgesGeometry(geo) : null };
    });

    const pts: number[] = [];
    for (const [x1, z1, x2, z2] of PLAN_LINES) pts.push(x1, 0.02, z1, x2, 0.02, z2);
    const planGeo = new BufferGeometry();
    planGeo.setAttribute("position", new Float32BufferAttribute(pts, 3));

    return { mats, edge, edgeX, plan, parts, planGeo };
  }, []);

  useEffect(
    () => () => {
      for (const part of kit.parts) {
        part.geo.dispose();
        part.edges?.dispose();
      }
      (Object.values(kit.mats) as Material[]).forEach((m) => m.dispose());
      kit.edge.dispose();
      kit.edgeX.dispose();
      kit.plan.dispose();
      kit.planGeo.dispose();
    },
    [kit],
  );

  /* eslint-disable react-hooks/immutability -- three.js objects, materials and the camera are mutable
     scene objects, not React state; updating them per frame inside useFrame is react-three-fiber's
     intended pattern. */
  useFrame((state, delta) => {
    const now = state.clock.getElapsedTime();
    if (start.current == null) start.current = now;
    // once built, any later frame (an X-ray fade, a redraw after a resize) shows the finished state
    const t = told.current.settled ? BUILD_END + 1 : now - start.current;

    // other frame shapes crop like object-fit: cover, so the live scene lines up with the still
    const cam = state.camera as PerspectiveCamera;
    const zoom = Math.max(1, state.size.width / state.size.height / BASE_ASPECT);
    if (cam.zoom !== zoom) {
      cam.zoom = zoom;
      cam.updateProjectionMatrix();
    }

    kit.plan.opacity = 0.6 * easeOut(t / 0.5);

    // X-ray: the enclosure fades to an outline (only once the build has finished)
    const s = see.current;
    const step = Math.min(delta, 0.05) / XRAY_FOR;
    s.now = told.current.settled ? Math.min(1, Math.max(0, s.now + (s.want ? step : -step))) : 0;
    const x = easeInOut(s.now);
    for (const k of ENCLOSURE) {
      const m = kit.mats[k];
      m.opacity = 1 - (1 - XRAY_OPACITY) * x;
      m.depthWrite = x < 0.04;
    }
    kit.mats.glass.opacity = 0.1 * (1 - 0.6 * x);
    kit.edgeX.color.lerpColors(INK, LINE, x);
    kit.edgeX.opacity = 0.32 + 0.33 * x;

    kit.parts.forEach((part, i) => {
      const node = nodes.current[i];
      if (!node) return;
      const k = easeOut((t - part.p.at) / ARRIVE_FOR);
      node.visible = t >= part.p.at;
      // a see-through wall casts no shadow, so the rooms light up in the X-ray view
      if (ENCLOSURE.has(part.p.kind)) node.children[0].castShadow = x < 0.5;
      const [hx, hy, hz] = part.home;
      const rest = 1 - k;
      switch (part.p.arrive) {
        case "drop":
          node.position.set(hx, hy + DROP * rest, hz);
          break;
        case "slideX":
          node.position.set(hx + SLIDE * rest, hy, hz);
          break;
        case "slideZ":
          node.position.set(hx, hy, hz + SLIDE * rest);
          break;
        case "growX": {
          const g = Math.max(k, 0.001);
          node.scale.set(g, 1, 1);
          node.position.set(part.p.min[0] + (part.size[0] * g) / 2, hy, hz);
          break;
        }
        case "growY": {
          const g = Math.max(k, 0.001);
          node.scale.set(1, g, 1);
          node.position.set(hx, part.p.min[1] + (part.size[1] * g) / 2, hz);
          break;
        }
        case "growZ": {
          const g = Math.max(k, 0.001);
          node.scale.set(1, 1, g);
          node.position.set(hx, hy, part.p.min[2] + (part.size[2] * g) / 2);
          break;
        }
      }
    });

    const glow = easeOut((t - LIGHTS_ON) / 0.4);
    kit.mats.light.emissiveIntensity = 1.7 * glow;
    for (const lamp of lamps.current) if (lamp) lamp.intensity = LAMP_POWER * glow;

    if (group.current) {
      group.current.rotation.y = TURN_FROM + (TURN_TO - TURN_FROM) * easeInOut(t / BUILD_END);
    }

    // Hand over from the still only once every shader program compiled and linked; a strict GPU
    // that rejects one leaves the still image in place.
    if (!told.current.ready && t > 0.1) {
      told.current.ready = true;
      const programs = (state.gl.info.programs ?? []) as { diagnostics?: { runnable: boolean } }[];
      if (programs.length > 0 && programs.every((p) => !p.diagnostics || p.diagnostics.runnable)) {
        onReady();
      }
    }
    if (!told.current.settled && t > BUILD_END + 0.1) {
      told.current.settled = true;
      onSettled();
    }
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <group ref={group} position={[0, -1.1, -0.6]}>
      <lineSegments geometry={kit.planGeo} material={kit.plan} />
      {/* a warm lamp in each room, switched on with the fixtures once the glazing is in */}
      {LAMPS.map((pos, i) => (
        <pointLight
          key={i}
          ref={(n) => {
            lamps.current[i] = n;
          }}
          position={pos}
          color={color.accentOnDark}
          intensity={0}
          distance={11}
          decay={1.6}
        />
      ))}
      {kit.parts.map((part, i) => (
        <group
          key={i}
          ref={(n) => {
            nodes.current[i] = n;
          }}
          visible={false}
        >
          <mesh
            geometry={part.geo}
            material={kit.mats[part.p.kind]}
            castShadow={part.p.kind !== "glass"}
            receiveShadow={part.p.kind !== "glass"}
          />
          {part.edges ? (
            <lineSegments geometry={part.edges} material={ENCLOSURE.has(part.p.kind) ? kit.edgeX : kit.edge} />
          ) : null}
        </group>
      ))}
    </group>
  );
}

/** Once the build is done the render loop stops; this redraws the finished frame after a resize. */
function Redraw({ when }: { when: boolean }) {
  const advance = useThree((s) => s.advance);
  const size = useThree((s) => s.size);
  useEffect(() => {
    if (when) advance(performance.now() / 1000);
  }, [when, size, advance]);
  return null;
}

export default function TimberFrame3D({
  run,
  settled,
  xray,
  fading,
  onReady,
  onSettled,
}: {
  /** changes when the visitor replays the build */
  run: number;
  settled: boolean;
  /** show the X-ray view (only has an effect once the build has finished) */
  xray: boolean;
  /** true for a moment after `xray` changes, so the loop runs while the walls fade */
  fading: boolean;
  onReady: () => void;
  onSettled: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  // pause the build when the frame is off screen or the tab is hidden
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
    <div
      ref={host}
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
      data-settled={settled ? "" : undefined}
    >
      <Canvas
        // every frame while it builds on screen or the X-ray fades; otherwise the loop is stopped
        frameloop={(!settled && active) || fading ? "always" : "never"}
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [27, 17, 27], fov: 30, near: 1, far: 200 }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <hemisphereLight args={[color.onDark, color.blueprint, 1.0]} />
        <directionalLight
          position={[10, 24, 18]}
          intensity={2.1}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0006}
          shadow-camera-left={-14}
          shadow-camera-right={14}
          shadow-camera-top={14}
          shadow-camera-bottom={-14}
          shadow-camera-near={1}
          shadow-camera-far={70}
        />
        <directionalLight position={[-12, 9, -8]} intensity={0.45} />
        <Duplex key={run} xray={xray} onReady={onReady} onSettled={onSettled} />
        <Redraw when={settled && !fading} />
      </Canvas>
    </div>
  );
}
