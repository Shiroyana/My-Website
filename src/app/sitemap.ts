import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const routes: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/audit", priority: 0.9 },
  { path: "/packages", priority: 0.8 },
  { path: "/case-studies", priority: 0.5 },
  { path: "/about", priority: 0.5 },
  { path: "/contact", priority: 0.5 },
  { path: "/work", priority: 0.4 },
  { path: "/privacy", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: r.priority,
  }));
}
