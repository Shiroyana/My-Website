import credits from "../../public/photos/credits.json";

/**
 * Photographs (public domain, Wikimedia Commons) until the owner supplies their own. Served through
 * next/image, so each screen gets a right-sized file. Each one is credited in the footer line.
 * To swap one: drop the new file in public/photos and change its entry here.
 */
export type Photo = {
  id: string;
  src: string;
  /** what the picture shows, written for this page (not the archive title) */
  alt: string;
  width: number;
  height: number;
  /** object-position for the crop */
  pos?: string;
};

export const photos = {
  street: {
    id: "f26889597",
    src: "/photos/photo-f26889597-1920.jpg",
    alt: "Broadway in Lower Manhattan on a sunny day, with delivery trucks at the curb",
    width: 1920,
    height: 1440,
    pos: "40% 60%",
  },
  gauges: {
    id: "f56892310",
    src: "/photos/photo-f56892310-1920.jpg",
    alt: "A technician reads refrigerant gauges connected to a rooftop air conditioning unit",
    width: 1920,
    height: 1371,
    pos: "60% 40%",
  },
  hands: {
    id: "f160025964",
    src: "/photos/photo-f160025964-1920.jpg",
    alt: "Two technicians’ hands setting gauge hoses on an outdoor condenser",
    width: 1920,
    height: 1280,
    pos: "45% 50%",
  },
} satisfies Record<string, Photo>;

type CreditEntry = (typeof credits.photos)[number];

/** The one footer credits line (Taste house rule 1: no captions, credits once in the footer). */
export function photoCredits(): { summary: string; detail: string } | null {
  const used = new Set(Object.values(photos).map((p) => p.id));
  const list: CreditEntry[] = credits.photos.filter((c) => used.has(c.id));
  if (list.length === 0) return null;
  const names = [...new Set(list.map((c) => c.by))];
  return {
    summary: "Photographs: public domain, via Wikimedia Commons",
    detail: `Photographs by ${names.join("; ")}. Public domain (Public Domain Mark 1.0), from Wikimedia Commons.`,
  };
}
