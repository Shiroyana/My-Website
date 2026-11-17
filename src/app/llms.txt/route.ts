import { SITE_URL, aiLine, audit, faqs, rubric, site, tiers } from "@/lib/site";

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
    `- [${audit.name}](${SITE_URL}/audit): free. ${audit.summary}`,
    ...tiers.flatMap((t) => [
      `- [${t.name}](${SITE_URL}/packages#${t.id}) (${t.fits}), pricing coming soon: ${t.summary}`,
      `  - Includes: ${t.includes.join("; ")}`,
    ]),
    `- [${aiLine.name}](${SITE_URL}/packages#${aiLine.id}) (optional add-on, in testing): ${aiLine.summary}`,
    "",
    `Prices for the paid plans are not published yet. The plans are being piloted with founding partner shops (${SITE_URL}/case-studies#volunteer), and prices go on the site once the pilots have results. Every shop can start with the free audit.`,
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
