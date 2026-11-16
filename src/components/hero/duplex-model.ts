/**
 * The hero's building: a two-storey mass-timber duplex (glulam columns and beams, CLT floors, walls
 * and roofs) with its trades roughed in: HVAC ducts and rooftop heat pumps, plumbing stacks and
 * supply lines, electrical panels, conduit, lights and solar. Everything is an axis-aligned box in
 * metres (y up), listed in build order with the moment it arrives and how it arrives.
 *
 * The camera looks from +x, +y, +z, so the +z fronts and unit B's +x side are glazed and the far
 * sides are solid: the trades stay visible inside the finished building.
 */

export type Kind =
  | "foundation"
  | "finish"
  | "column"
  | "beam"
  | "floor"
  | "wall"
  | "roof"
  | "glass"
  | "door"
  | "duct"
  | "unit"
  | "grille"
  | "pipe"
  | "tank"
  | "conduit"
  | "panel"
  | "light"
  | "solar"
  | "fixture"
  | "copper"
  | "chute";

/** drop: falls from above. slideX / slideZ: slides in from the +x / +z side. grow*: extends from its start end. */
export type Arrive = "drop" | "slideX" | "slideZ" | "growX" | "growY" | "growZ";

export type Piece = {
  kind: Kind;
  min: [number, number, number];
  max: [number, number, number];
  /** seconds into the build when it starts to arrive */
  at: number;
  arrive: Arrive;
};

const H = 3.2; // storey height
const LEVELS = 2;
const COL = 0.3;
const BEAM = 0.4;
const SLAB = 0.2;
const WALL = 0.16;

/** when each storey's steps begin (seconds); storey 1 starts after storey 0's floor closes */
const LEVEL_START = [0.6, 1.85];
const STEP = { columns: 0, walls: 0.25, trades: 0.45, beams: 0.75, deck: 1.0 };
const ROOF_KIT = 3.1;
const GLAZING = 3.25;
export const LIGHTS_ON = 3.9;
/** every piece has arrived and the camera has settled: all motion stops here (under 5 s) */
export const BUILD_END = 4.6;
/** how long one piece takes to arrive */
export const ARRIVE_FOR = 0.42;

type Unit = { x0: number; x1: number; z0: number; z1: number; glazedSide: boolean };
const UNITS: Unit[] = [
  { x0: -6.1, x1: -0.1, z0: -4.5, z1: 4.5, glazedSide: false },
  { x0: 0.1, x1: 6.1, z0: -3, z1: 6, glazedSide: true },
];

function build(): Piece[] {
  const out: Piece[] = [];
  const add = (
    kind: Kind,
    min: [number, number, number],
    max: [number, number, number],
    at: number,
    arrive: Arrive = "drop",
  ) => out.push({ kind, min, max, at, arrive });

  UNITS.forEach((u, ui) => {
    const { x0, x1, z0, z1 } = u;
    const lag = ui * 0.1; // unit B follows unit A by a beat
    const zs = [0, 1, 2, 3].map((i) => z0 + COL / 2 + i * ((z1 - z0 - COL) / 3));
    const xs = [x0 + COL / 2, x1 - COL / 2];

    // foundation and ground floor
    add("foundation", [ui === 0 ? x0 - 0.3 : 0, -0.45, z0 - 0.3], [ui === 0 ? 0 : x1 + 0.3, 0, z1 + 0.3], 0.15 + lag);
    add("finish", [x0 + 0.05, 0, z0 + 0.05], [x1 - 0.05, 0.08, z1 - 0.05], 0.42 + lag);

    for (let l = 0; l < LEVELS; l++) {
      const t0 = LEVEL_START[l] + lag;
      const base = l * H + (l > 0 ? SLAB : 0.08); // top of the floor below
      const beamBottom = (l + 1) * H - BEAM;
      const beamTop = (l + 1) * H;
      const top = l === LEVELS - 1;

      // glulam columns
      xs.forEach((x, xi) =>
        zs.forEach((z, zi) =>
          add(
            "column",
            [x - COL / 2, base, z - COL / 2],
            [x + COL / 2, beamBottom, z + COL / 2],
            t0 + STEP.columns + (xi * 4 + zi) * 0.012,
          ),
        ),
      );

      // CLT walls on the far sides: the back, and unit A's outer side or unit B's party wall
      add("wall", [x0 + COL, base, z0 + 0.07], [x1 - COL, beamBottom, z0 + 0.07 + WALL], t0 + STEP.walls);
      add("wall", [x0 + 0.07, base, z0 + COL], [x0 + 0.07 + WALL, beamBottom, z1 - COL], t0 + STEP.walls + 0.05);

      // ---- trades, roughed in before the deck above closes the storey ----
      const tr = t0 + STEP.trades;
      // HVAC: a riser at the back, a trunk under the beams, two branches
      const dx = x0 + 1.6;
      add("duct", [dx - 0.2, base, z0 + 0.4], [dx + 0.2, top ? beamTop + SLAB + 0.3 : beamTop + SLAB, z0 + 0.8], tr, "growY");
      add("duct", [dx - 0.28, beamBottom - 0.36, z0 + 0.5], [dx + 0.28, beamBottom - 0.06, z1 - 1], tr + 0.06, "growZ");
      [z0 + 2.3, z0 + 5.7].forEach((z, i) =>
        add("duct", [dx + 0.28, beamBottom - 0.32, z - 0.15], [x1 - 0.9, beamBottom - 0.1, z + 0.15], tr + 0.16 + i * 0.05, "growX"),
      );
      // plumbing: a stack at the back, a branch along the back wall, a supply line to the front
      const px = x1 - 1.0;
      add("pipe", [px - 0.07, l === 0 ? -0.2 : base - SLAB, z0 + 0.42], [px + 0.07, top ? beamTop + SLAB + 0.55 : beamTop, z0 + 0.56], tr + 0.03, "growY");
      add("pipe", [x0 + 2.5, base + 0.3, z0 + 0.3], [px - 0.07, base + 0.4, z0 + 0.4], tr + 0.1, "growX");
      add("pipe", [x1 - 0.74, beamBottom - 0.2, z0 + 0.56], [x1 - 0.66, beamBottom - 0.12, z1 - 1.6], tr + 0.14, "growZ");
      // electrical: conduit up the back wall and along the ceiling, with two lights
      const ex = x0 + 3.3;
      add("conduit", [ex - 0.03, l === 0 ? 2.0 : base, z0 + 0.25], [ex + 0.03, beamBottom - 0.02, z0 + 0.31], tr + 0.05, "growY");
      add("conduit", [ex - 0.03, beamBottom - 0.08, z0 + 0.31], [ex + 0.03, beamBottom - 0.02, z1 - 0.7], tr + 0.12, "growZ");
      [z0 + 3.2, z0 + 6.4].forEach((z, i) =>
        add("light", [ex - 0.28, beamBottom - 0.2, z - 0.28], [ex + 0.28, beamBottom - 0.12, z + 0.28], tr + 0.22 + i * 0.05),
      );
      if (l === 0) {
        add("panel", [ex - 0.28, 1.15, z0 + 0.23], [ex + 0.28, 2.0, z0 + 0.36], tr);
        add("tank", [px - 0.32, 0.08, z0 + 0.8], [px + 0.32, 1.6, z0 + 1.44], tr + 0.02);
      }

      // HVAC, continued: the central air handler, a return duct, ceiling vents, the refrigerant line
      if (l === 0) {
        add("unit", [dx - 0.45, base, z0 + 0.95], [dx + 0.45, base + 1.7, z0 + 1.75], tr + 0.02);
        add("duct", [dx - 0.2, base + 1.7, z0 + 1.15], [dx + 0.2, beamBottom - 0.36, z0 + 1.55], tr + 0.1, "growY");
        // kitchen range hood and its exhaust
        add("unit", [x0 + 4.1, base + 1.9, z1 - 2.7], [x0 + 4.9, base + 2.12, z1 - 2.1], tr + 0.12);
        add("duct", [x0 + 4.4, base + 2.12, z1 - 2.5], [x0 + 4.6, beamBottom, z1 - 2.3], tr + 0.2, "growY");
      }
      add("duct", [dx + 0.28, beamBottom - 0.34, z0 + 0.95], [x1 - 1.7, beamBottom - 0.12, z0 + 1.3], tr + 0.12, "growX");
      [z0 + 2.3, z0 + 5.7].forEach((z, i) =>
        add("grille", [x1 - 1.25, beamBottom - 0.38, z - 0.25], [x1 - 0.75, beamBottom - 0.32, z + 0.25], tr + 0.26 + i * 0.03),
      );
      [z0 + 4, z1 - 1.4].forEach((z, i) =>
        add("grille", [dx - 0.25, beamBottom - 0.42, z - 0.25], [dx + 0.25, beamBottom - 0.36, z + 0.25], tr + 0.24 + i * 0.03),
      );
      add("copper", [dx + 0.27, base, z0 + 0.47], [dx + 0.33, top ? beamTop + SLAB + 0.25 : beamTop + SLAB, z0 + 0.53], tr + 0.08, "growY");

      // plumbing, continued: a bathroom on each floor, a kitchen sink, a hot line beside the cold
      add("fixture", [x1 - 2.2, base, z0 + 0.5], [x1 - 1.8, base + 0.75, z0 + 1.1], tr + 0.16);
      add("fixture", [x1 - 3.2, base, z0 + 0.45], [x1 - 2.5, base + 0.85, z0 + 0.95], tr + 0.18);
      add("copper", [x1 - 0.6, beamBottom - 0.2, z0 + 0.56], [x1 - 0.54, beamBottom - 0.14, z1 - 1.6], tr + 0.17, "growZ");
      if (l === 0) {
        add("fixture", [x1 - 0.95, base, z1 - 3.2], [x1 - 0.35, base + 0.9, z1 - 1.4], tr + 0.2);
        add("pipe", [x1 - 0.74, base + 0.9, z1 - 1.7], [x1 - 0.66, beamBottom - 0.2, z1 - 1.62], tr + 0.24, "growY");
      } else {
        add("fixture", [x1 - 2.0, base, z0 + 1.6], [x1 - 0.4, base + 0.55, z0 + 2.4], tr + 0.2);
        add("pipe", [px - 0.05, base + 0.08, z0 + 0.56], [px + 0.05, base + 0.18, z0 + 1.6], tr + 0.24, "growZ");
      }

      // electrical, continued: wall circuits with outlets, and a feed across the ceiling to each light
      add("conduit", [x0 + 0.4, base + 0.38, z0 + 0.25], [x1 - 0.4, base + 0.42, z0 + 0.29], tr + 0.14, "growX");
      add("conduit", [x0 + 0.25, base + 0.38, z0 + 0.3], [x0 + 0.29, base + 0.42, z1 - 0.4], tr + 0.16, "growZ");
      [x0 + 1, x0 + 2.4, x0 + 5].forEach((x, i) =>
        add("panel", [x - 0.08, base + 0.31, z0 + 0.23], [x + 0.08, base + 0.49, z0 + 0.31], tr + 0.24 + i * 0.02),
      );
      [z0 + 2, z0 + 4.5, z0 + 7].forEach((z, i) =>
        add("panel", [x0 + 0.23, base + 0.31, z - 0.08], [x0 + 0.31, base + 0.49, z + 0.08], tr + 0.26 + i * 0.02),
      );
      [z0 + 3.2, z0 + 6.4].forEach((z, i) =>
        add("conduit", [x0 + 0.3, beamBottom - 0.08, z - 0.03], [ex - 0.03, beamBottom - 0.02, z + 0.03], tr + 0.2 + i * 0.04, "growX"),
      );

      // laundry chute: from a hatch upstairs down to a bin on the ground floor
      if (l === 0) {
        add("fixture", [x0 + 0.38, base, z1 - 3.5], [x0 + 1.06, base + 0.85, z1 - 2.8], tr + 0.1);
        add("chute", [x0 + 0.47, base + 0.85, z1 - 3.4], [x0 + 0.97, beamTop + SLAB, z1 - 2.9], tr + 0.18, "growY");
      } else {
        add("chute", [x0 + 0.47, base, z1 - 3.4], [x0 + 0.97, base + 1.15, z1 - 2.9], tr + 0.18, "growY");
        add("grille", [x0 + 0.97, base + 0.7, z1 - 3.3], [x0 + 1.0, base + 1.05, z1 - 3.0], tr + 0.3);
      }

      // glulam beams: one along each side, one across at every column line
      xs.forEach((x, i) =>
        add("beam", [x - COL / 2, beamBottom, z0], [x + COL / 2, beamTop, z1], t0 + STEP.beams + i * 0.04),
      );
      zs.forEach((z, i) =>
        add("beam", [x0 + COL, beamBottom, z - 0.12], [x1 - COL, beamTop, z + 0.12], t0 + STEP.beams + 0.06 + i * 0.03),
      );

      // the CLT deck: three panels, the roof with an overhang toward the viewer
      const over = top ? 0.45 : 0;
      for (let i = 0; i < 3; i++) {
        const za = z0 + i * 3 + 0.02;
        const zb = z0 + (i + 1) * 3 - 0.02 + (i === 2 ? over : 0);
        add(top ? "roof" : "floor", [x0, beamTop, za], [x1 + (u.glazedSide ? over : 0), beamTop + SLAB, zb], t0 + STEP.deck + i * 0.06);
      }

      // ---- glazing slides in from the sides once the frame stands ----
      const gy0 = base + 0.02;
      const gy1 = beamBottom - 0.02;
      const g = GLAZING + l * 0.12 + lag;
      // front (+z): a door on the ground floor, glass for the rest
      const fz = zs[3];
      if (l === 0) {
        add("door", [x0 + COL + 0.2, gy0, fz - 0.05], [x0 + COL + 1.3, gy0 + 2.2, fz + 0.05], g + 0.22, "slideZ");
        add("glass", [x0 + COL + 1.5, gy0, fz - 0.04], [x1 - COL, gy1, fz + 0.04], g, "slideZ");
      } else {
        add("glass", [x0 + COL, gy0, fz - 0.04], [x1 - COL, gy1, fz + 0.04], g, "slideZ");
      }
      // unit B's side (+x): two glazed bays and one CLT bay per storey, alternating
      if (u.glazedSide) {
        const sx = xs[1];
        for (let b = 0; b < 3; b++) {
          const za = zs[b] + COL / 2;
          const zb = zs[b + 1] - COL / 2;
          const solid = b === (l === 0 ? 0 : 1);
          if (solid) add("wall", [sx - WALL / 2, gy0 - 0.02, za], [sx + WALL / 2, gy1 + 0.02, zb], t0 + STEP.walls + 0.1);
          else add("glass", [sx - 0.04, gy0, za], [sx + 0.04, gy1, zb], g + 0.1 + b * 0.06, "slideX");
        }
      }
    }

    // ---- roof kit: a heat pump on each roof, solar on unit B, and the lights come on ----
    const roofTop = LEVELS * H + SLAB;
    const hx = x0 + 1.6;
    add("unit", [hx - 0.6, roofTop, z0 + 1.3], [hx + 0.6, roofTop + 0.95, z0 + 2.4], ROOF_KIT + lag);
    add("grille", [hx - 0.42, roofTop + 0.95, z0 + 1.45], [hx + 0.42, roofTop + 1.0, z0 + 2.25], ROOF_KIT + lag + 0.02);
    if (u.glazedSide) {
      for (let i = 0; i < 3; i++)
        add("solar", [x0 + 3.0, roofTop + 0.18, z0 + 1.0 + i * 2.4], [x1 - 0.5, roofTop + 0.24, z0 + 3.0 + i * 2.4], ROOF_KIT + 0.12 + i * 0.06);
      // the solar feed back to the panel riser
      add("conduit", [x0 + 2.86, roofTop, z0 + 0.3], [x0 + 2.94, roofTop + 0.08, z0 + 7.8], ROOF_KIT + 0.3, "growZ");
    }
  });

  return out;
}

export const PIECES: Piece[] = build();

/** the plan drawn on the ground before anything lands: each unit's footprint and its column lines */
export const PLAN_LINES: [number, number, number, number][] = UNITS.flatMap(({ x0, x1, z0, z1 }) => {
  const e = 1.4; // lines run past the footprint, like grid lines on a drawing
  const zs = [0, 1, 2, 3].map((i) => z0 + COL / 2 + i * ((z1 - z0 - COL) / 3));
  return [
    [x0, z0, x1, z0],
    [x1, z0, x1, z1],
    [x1, z1, x0, z1],
    [x0, z1, x0, z0],
    ...zs.map((z): [number, number, number, number] => [x0 - e, z, x1 + e, z]),
    [x0 + COL / 2, z0 - e, x0 + COL / 2, z1 + e] as [number, number, number, number],
    [x1 - COL / 2, z0 - e, x1 - COL / 2, z1 + e] as [number, number, number, number],
  ];
});
