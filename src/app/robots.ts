import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Every crawler, AI assistants' included, may read the site: being read is the product. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/audit/thanks", "/__forms.html"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
