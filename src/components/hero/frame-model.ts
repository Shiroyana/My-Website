import { color } from "@/lib/tokens";

/**
 * A three-storey mass-timber frame: glulam columns and beams on a 3 x 2 bay grid, CLT floor panels,
 * the top floor still going in. One model feeds the static drawing (FrameStill) and the live 3D
 * (TimberFrame3D), so the still is exactly the finished state of the animation.
 * Units: metres. Origin at the centre of the footprint, y up.
 */

export type Kind = "column" | "beam" | "slab";

export type Member = {
  kind: Kind;
  min: [number, number, number];
  max: [number, number, number];
  /** 0..1, when this member draws in during the build animation */
  at: number;
};

const BAY = 6;
const XS = [0, 1, 2, 3].map((i) => i * BAY - 9); // 4 grid lines along x
const ZS = [0, 1, 2].map((i) => i * BAY - 6); // 3 grid lines along z
const STOREY = 3.6;
const LEVELS = 3;
const COL = 0.5;
const BEAM_W = 0.4;
const BEAM_D = 0.6;
const SLAB = 0.22;

export const GRID = { xs: XS, zs: ZS, storey: STOREY, levels: LEVELS };

function build(): Member[] {
  const out: Member[] = [];
  // the order of the build: each storey's columns, then its beams, then its floor
  const steps = LEVELS * 3;
  const t = (level: number, phase: number) => (level * 3 + phase) / steps;

  for (let l = 0; l < LEVELS; l++) {
    const y0 = l * STOREY;
    const y1 = (l + 1) * STOREY;
    for (const x of XS)
      for (const z of ZS)
        out.push({
          kind: "column",
          min: [x - COL / 2, y0, z - COL / 2],
          max: [x + COL / 2, y1 - BEAM_D, z + COL / 2],
          at: t(l, 0),
        });
    // beams along x on every grid line z, one per bay
    for (const z of ZS)
      for (let i = 0; i < XS.length - 1; i++)
        out.push({
          kind: "beam",
          min: [XS[i] - COL / 2, y1 - BEAM_D, z - BEAM_W / 2],
          max: [XS[i + 1] + COL / 2, y1, z + BEAM_W / 2],
          at: t(l, 1),
        });
    // CLT panels, one per bay; the top floor has its last two panels still to come
    for (let i = 0; i < XS.length - 1; i++)
      for (let j = 0; j < ZS.length - 1; j++) {
        if (l === LEVELS - 1 && i === XS.length - 2) continue;
        out.push({
          kind: "slab",
          min: [XS[i] + 0.04, y1, ZS[j] + 0.04],
          max: [XS[i + 1] - 0.04, y1 + SLAB, ZS[j + 1] - 0.04],
          at: t(l, 2),
        });
      }
  }
  return out;
}

export const MEMBERS: Member[] = build();

/** Timber tones from DESIGN.md (tints and shades of the brand amber), per face. */
export const WOOD: Record<Kind, { top: string; x: string; z: string }> = {
  column: { top: color.timber300, x: color.timber500, z: color.timber700 },
  beam: { top: color.timber300, x: color.timber500, z: color.timber700 },
  slab: { top: color.timber100, x: color.timber300, z: color.timber500 },
};
