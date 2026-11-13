import { SITE_URL, faqs, packages, priceLabel, rubric, site } from "@/lib/site";

export const dynamic = "force-static";

/** /llms.txt: a plain summary for AI assistants, built from the same facts as the pages. */
export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `- Area served: ${site.boroughs.join(", ")} (New York City)`,
    `- Trades: ${site.trades.join(", ")}; shops with 1 to 10 trucks`,
    `- Contact: ${site.email}`,
    `- Start here: free AI readiness audit at ${SITE_URL}/audit`,
    "",
    "## Packages",
    "",
    ...packages.map(
      (p) =>
        `- [${p.name}](${SITE_URL}${p.id === "audit" ? "/audit" : `/packages#${p.id}`}): ${priceLabel(p)}. ${p.summary}`,
    ),
    "",
    'Prices shown as "$X" are not yet published; email for a quote.',
    "",
    "## The audit's seven checks (100 points)",
    "",
    ...rubric.map((r) => `- ${r.check}: ${r.points} points`),
    "",
    "## Questions",
    "",
    ...faqs.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    "## Pages",
    "",
    `- [Home](${SITE_URL}/)`,
    `- [Free audit](${SITE_URL}/audit)`,
    `- [Packages and prices](${SITE_URL}/packages)`,
    `- [Case studies](${SITE_URL}/case-studies)`,
    `- [About](${SITE_URL}/about)`,
    `- [Contact](${SITE_URL}/contact)`,
    `- [Web design work](${SITE_URL}/work)`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
