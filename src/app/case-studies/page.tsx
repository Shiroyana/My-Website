import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Case studies",
  description:
    "Before and after results from NYC trade shops set up for AI booking. Our first NYC pilot is underway; results are published here when it ends.",
  alternates: { canonical: "/case-studies" },
};

/**
 * Case studies. There are none yet, so the page shows the template every case study will follow and
 * an honest empty state. Add an entry to `studies` to publish one; never publish an invented result.
 */
type Study = {
  shop: string;
  trade: string;
  borough: string;
  scoreBefore: number;
  scoreAfter: number;
  bookedChange: string;
  quote?: { text: string; by: string };
};

const studies: Study[] = [];

const template = [
  { k: "Shop, trade and borough", v: "Named with the owner’s permission" },
  { k: "Readiness score", v: "Before and after, out of 100" },
  { k: "Assistant tests", v: "What ChatGPT, Gemini, Claude and Google answered, before and after" },
  { k: "Booked jobs", v: "Change over 60 to 90 days, from the shop’s own records" },
  { k: "Owner’s words", v: "Only a real quote, with their name" },
];

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Case studies", "/case-studies")} />
      <section
        className="section"
        data-enter
        aria-labelledby="hero-h"
        style={{ ["--h" as string]: 1 }}
      >
        <div className="wrap">
          <div className="grid">
            <div className="span-5 section-head">
              <h1 id="hero-h" className="t-h2">
                Case studies from NYC trade shops
              </h1>
              <p>
                Each case study shows a real shop&rsquo;s numbers before and after setup. We publish
                them only with the owner&rsquo;s permission, and we never round a result up.
              </p>
            </div>
            <div className="span-6 start-7">
              {studies.length === 0 ? (
                <div className="card empty-state bp-sheet ground-inverse">
                  <h2 className="t-h3">First NYC pilot underway</h2>
                  <p>
                    Our first pilot shop is being set up now. Its before and after results go here
                    when the 90-day pilot ends.
                  </p>
                </div>
              ) : null}
              <div className="card">
                <h2 className="t-card">What every case study shows</h2>
                <ul className="rows rows--stacked">
                  {template.map((t) => (
                    <li key={t.k}>
                      <span className="rows__name">{t.k}</span>
                      <span className="muted">{t.v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
