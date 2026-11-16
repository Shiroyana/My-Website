import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { VolunteerForm } from "@/components/VolunteerForm";
import { evidence } from "@/lib/evidence";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Case studies",
  description:
    "Before and after results from NYC trade shops set up for AI booking, dated evidence that AI assistants already call and book local services, and how to volunteer your shop.",
  alternates: { canonical: "/case-studies" },
};

/**
 * Case studies. There are none yet, so the page shows the template every case study will follow,
 * an honest empty state, sourced evidence that AI calling and booking are rising (lib/evidence.ts),
 * and a form for owners to volunteer their shop. Add an entry to `studies` to publish one; never
 * publish an invented result.
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

const volunteerTerms = [
  "No setup fee: it is waived for founding shops",
  "50% off your monthly for the first 6 months (6-month minimum)",
  "Your founding rate locked for 24 months after that",
  "Before and after numbers for your own shop, whether or not we publish them",
  "In return: your feedback each month, and a case study if you agree to one",
];

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Case studies", "/case-studies")} />

      {/* 1 RESULTS: the template and the honest empty state */}
      <section
        className="section"
        data-enter
        aria-labelledby="hero-h"
        style={{ ["--h" as string]: 1 }}
      >
        <div className="wrap">
          <div className="grid">
            <div className="span-5 section-head">
              <h1 id="hero-h">
                Case studies from NYC trade shops
              </h1>
              <p>
                Each case study shows a real shop&rsquo;s numbers before and after setup. We publish
                them only with the owner&rsquo;s permission, and we never round a result up.
              </p>
              <p>
                <a className="link" href="#volunteer">
                  Become a founding partner
                </a>
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

      {/* 2 EVIDENCE: dated, sourced, newest last so it reads as a rising line */}
      <section className="section ground-surface" id="evidence" aria-labelledby="evidence-h">
        <div className="wrap">
          <div className="section-head">
            <h2 id="evidence-h">AI assistants already call and book local pros</h2>
            <p>
              This is moving fast. Until our own results are in, here is what others have measured.
              Every line links to its source.
            </p>
          </div>
          <ol className="evidence">
            {evidence.map((e) => (
              <li key={e.fact} className="evidence__item">
                <time className="evidence__when figures" dateTime={e.iso}>
                  {e.when}
                </time>
                <p className="evidence__fact">{e.fact}</p>
                <a
                  className="link evidence__source"
                  href={e.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read the source: {e.source.name}
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3 VOLUNTEER: owners offer their shop as a pilot and case study */}
      <section className="section" id="volunteer" aria-labelledby="volunteer-h">
        <div className="wrap">
          <div className="grid">
            <div className="span-6 section-head">
              <h2 id="volunteer-h">Become a founding partner</h2>
              <p>
                Be one of the first shops in your borough that AI can book. We are taking a few
                HVAC, plumbing and electrical shops in the five boroughs, set up and measured openly.
              </p>
              <ul className="plan-list">
                {volunteerTerms.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="span-6 start-7">
              <div className="card">
                <h3 id="volunteer-form-h" className="t-card">
                  Tell us about your shop
                </h3>
                <VolunteerForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
