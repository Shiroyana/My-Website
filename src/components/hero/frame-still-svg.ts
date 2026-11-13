import { color } from "@/lib/tokens";
import { GRID, MEMBERS, WOOD, type Member } from "./frame-model";

/**
 * The hero's still as a standalone SVG file (served at /hero-still.svg): the finished frame as an
 * isometric drawing with grid bubbles and bay dimensions. A file, not inline markup, so the page
 * stays light and the browser can fetch it early as the LCP image. It is the whole picture on
 * phones, low-power devices and under reduced motion; the live 3D fades in over it elsewhere.
 * Styles are inline: CSS from the page does not reach an SVG loaded through <img>.
 */

const S = 20; // px per metre
const C30 = Math.cos(Math.PI / 6);
const p = (x: number, y: number, z: number): [number, number] => [
  (x - z) * C30 * S,
  ((x + z) * 0.5 - y) * S,
];
const f1 = (n: number) => n.toFixed(1);
const poly = (pts: [number, number, number][]) =>
  pts
    .map(([x, y, z]) => p(x, y, z))
    .map(([u, v]) => `${f1(u)},${f1(v)}`)
    .join(" ");

function faces(m: Member) {
  const [x0, y0, z0] = m.min;
  const [x1, y1, z1] = m.max;
  const w = WOOD[m.kind];
  return [
    {
      fill: w.z,
      pts: poly([
        [x0, y0, z1],
        [x1, y0, z1],
        [x1, y1, z1],
        [x0, y1, z1],
      ]),
    },
    {
      fill: w.x,
      pts: poly([
        [x1, y0, z0],
        [x1, y1, z0],
        [x1, y1, z1],
        [x1, y0, z1],
      ]),
    },
    {
      fill: w.top,
      pts: poly([
        [x0, y1, z0],
        [x1, y1, z0],
        [x1, y1, z1],
        [x0, y1, z1],
      ]),
    },
  ];
}

const centre = (m: Member) => [0, 1, 2].map((i) => (m.min[i] + m.max[i]) / 2);

export function frameStillSvg(): string {
  // painter's order: far to near (x + z grows toward the viewer), low to high
  const ordered = [...MEMBERS].sort((a, b) => {
    const [ax, ay, az] = centre(a);
    const [bx, by, bz] = centre(b);
    return ax + az - (bx + bz) || ay - by;
  });

  const { xs, zs } = GRID;
  const xMin = xs[0];
  const xMax = xs[xs.length - 1];
  const zMin = zs[0];
  const zMax = zs[zs.length - 1];
  const EXT = 2.6;
  const corners = [
    p(xMin - EXT, 0, zMin - EXT),
    p(xMax + EXT, 0, zMin - EXT),
    p(xMin - EXT, 0, zMax + EXT),
    p(xMax + EXT, 0, zMax + EXT),
    p(xMin, GRID.storey * GRID.levels + 0.3, zMin),
  ];
  const PAD = 28;
  const minU = Math.min(...corners.map((c) => c[0])) - PAD;
  const maxU = Math.max(...corners.map((c) => c[0])) + PAD;
  const minV = Math.min(...corners.map((c) => c[1])) - PAD;
  const maxV = Math.max(...corners.map((c) => c[1])) + PAD;

  const line = (a: [number, number, number], b: [number, number, number], style: string) => {
    const [u1, v1] = p(...a);
    const [u2, v2] = p(...b);
    return `<line x1="${f1(u1)}" y1="${f1(v1)}" x2="${f1(u2)}" y2="${f1(v2)}" ${style}/>`;
  };
  const ink = `stroke="${color.onDark}" stroke-opacity="0.55" stroke-width="1" fill="none"`;
  const hi = `stroke="${color.logoGreen}" stroke-width="1" fill="none"`;
  const label = (u: number, v: number, text: string, fill: string) =>
    `<text x="${f1(u)}" y="${f1(v)}" text-anchor="middle" fill="${fill}" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="500">${text}</text>`;

  const out: string[] = [];
  out.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minU.toFixed(0)} ${minV.toFixed(0)} ${(maxU - minU).toFixed(0)} ${(maxV - minV).toFixed(0)}" width="${(maxU - minU).toFixed(0)}" height="${(maxV - minV).toFixed(0)}">`,
  );
  // ground grid lines, dashed, with bubbles (1 to 4 along x, A to C along z)
  out.push(`<g stroke-dasharray="6 5">`);
  for (const x of xs) out.push(line([x, 0, zMin - EXT + 1.2], [x, 0, zMax + EXT - 1.2], ink));
  for (const z of zs) out.push(line([xMin - EXT + 1.2, 0, z], [xMax + EXT - 1.2, 0, z], ink));
  out.push(`</g>`);
  xs.forEach((x, i) => {
    const [u, v] = p(x, 0, zMax + EXT);
    out.push(
      `<circle cx="${f1(u)}" cy="${f1(v)}" r="11" ${ink}/>`,
      label(u, v + 4.5, String(i + 1), color.onDark),
    );
  });
  zs.forEach((z, i) => {
    const [u, v] = p(xMax + EXT, 0, z);
    out.push(
      `<circle cx="${f1(u)}" cy="${f1(v)}" r="11" ${ink}/>`,
      label(u, v + 4.5, String.fromCharCode(65 + i), color.onDark),
    );
  });
  // the frame
  out.push(
    `<g stroke="${color.blueprint}" stroke-opacity="0.45" stroke-width="0.6" stroke-linejoin="round">`,
  );
  for (const m of ordered)
    for (const f of faces(m)) out.push(`<polygon points="${f.pts}" fill="${f.fill}"/>`);
  out.push(`</g>`);
  // dimension line along the front, 6 m per bay
  const dimZ = zMax + 1.4;
  out.push(line([xMin, 0, dimZ], [xMax, 0, dimZ], hi));
  for (const x of xs) out.push(line([x - 0.25, 0, dimZ - 0.25], [x + 0.25, 0, dimZ + 0.25], hi));
  xs.slice(0, -1).forEach((x, i) => {
    const [u, v] = p((x + xs[i + 1]) / 2, 0, dimZ + 0.9);
    out.push(label(u, v, "6 m", color.onDarkSoft));
  });
  out.push(`</svg>`);
  return out.join("");
}
