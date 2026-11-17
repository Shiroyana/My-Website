import type { Metadata } from "next";
import { Arrow } from "@/components/Arrow";
import { JsonLd } from "@/components/JsonLd";
import { ComingSoonPrice, FreePrice } from "@/components/TierPrice";
import { breadcrumbJsonLd, faqJsonLd, servicesJsonLd } from "@/lib/jsonld";
import { MAIN_ACTION, aiLine, audit, site, tiers } from "@/lib/site";

export const metadata: Metadata = {
  title: "Packages and prices",
  description:
    "Starter, Booked and Growth Partner plans for NYC HVAC, plumbing and electrical shops. The plans are being piloted with founding shops and prices are coming soon; every shop can start with a free AI readiness audit.",
  alternates: { canonical: "/packages" },
};

const pricingFaqs = [
  {
    q: "When will prices be published?",
    a: "Once the first pilot shops have results. We are setting the prices from what the pilots show, so we are not publishing numbers before then.",
  },
  {
    q: "Can I start before prices are published?",
    a: "Yes. The audit is free today, and a few shops can join as founding partners: no setup fee, and half the monthly rate for the first 6 months.",
  },
  {
    q: "Do you charge per lead or per booking?",
    a: "No. Plans will be a flat monthly however many leads or bookings come in, and nobody else gets your customers.",
  },
  {
    q: "Will there be a setup fee?",
    a: "Founding partners pay none. For everyone else, the setup and monthly prices are being set from the pilots, with a $0 down option planned.",
  },
] as const;

/* what each plan includes, in the order an owner compares them; true, false or a short value */
const compare: { row: string; cols: (boolean | string)[] }[] = [
  { row: "Score out of 100 and the top three fixes", cols: [true, true, true, true] },
  { row: "AI-readable pages added to your website", cols: [false, true, true, true] },
  { row: "Price book (ranges you approve)", cols: [false, "Top 10 jobs", "Top 20 jobs + fees", "Every trade"] },
  { row: "Google Business Profile cleaned up", cols: [false, true, true, true] },
  { row: "Booking", cols: [false, "Request form", "Open slots", "Open slots"] },
  { row: "Booking requests from verified AI agents", cols: [false, false, "With the pilots", "With the pilots"] },
  { row: "Pages per service and per borough", cols: [false, false, true, true] },
  { row: "Checks and price updates", cols: [false, "Monthly, 2 updates", "Weekly, unlimited", "Weekly, unlimited"] },
  { row: "Report of the AI agents that asked", cols: [false, true, true, true] },
  { row: "Your own allow and block rules per AI agent", cols: [false, false, false, true] },
  { row: "New AI channels as they launch", cols: [false, "Add-on", "Included", "First"] },
  { row: "Quarterly strategy review and roadmap call", cols: [false, false, false, true] },
];

function Cell({ v }: { v: boolean | string }) {
  if (typeof v === "string") return <span>{v}</span>;
  return v ? (
    <span className="compare__yes">
      <span aria-hidden="true">&#10003;</span>
      <span className="visually-hidden">Included</span>
    </span>
  ) : (
    <span className="compare__no">
      <span aria-hidden="true">&middot;</span>
      <span className="visually-hidden">Not included</span>
    </span>
  );
}

export default function PackagesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Packages", "/packages")} />
      <JsonLd data={servicesJsonLd()} />
      <JsonLd data={faqJsonLd(pricingFaqs)} />

      <section
        className="section ground-inverse bp-sheet"
        id="top-packages"
        data-enter
        aria-labelledby="hero-h"
        style={{ ["--h" as string]: 1 }}
      >
        <div className="wrap">
          <div className="section-head">
            <h1 id="hero-h">Packages and prices for NYC trade shops</h1>
            <p>
              Every shop can start with the free audit today. The paid plans are being piloted
              with founding shops now, and their prices are coming soon.
            </p>
          </div>
          <div className="grid">
            <article
              id={audit.id}
              className="card card--plan ground-base glass-light span-3"
              aria-labelledby="audit-h"
            >
              <h2 id="audit-h" className="t-card">
                {audit.name}
              </h2>
              <FreePrice />
              <ul className="plan-list">
                {audit.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="t-small muted">For: {audit.fits}</p>
              <a className="link card__action" href="/audit">
                Request the audit
              </a>
            </article>
            {tiers.map((t) => (
              <article
                key={t.id}
                id={t.id}
                className={`card card--plan ground-base glass-light span-3${t.featured ? " is-featured timber-edge" : ""}`}
                aria-labelledby={`${t.id}-h`}
              >
                <h2 id={`${t.id}-h`} className="t-card">
                  {t.name}
                </h2>
                <ComingSoonPrice />
                <ul className="plan-list">
                  {t.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="t-small muted">For: {t.fits}</p>
                <a
                  className="link card__action"
                  href={`mailto:${site.email}?subject=${encodeURIComponent(`${t.name} plan`)}`}
                >
                  Email about {t.name}
                </a>
              </article>
            ))}
          </div>
          <p className="founding-link">
            <a className="link" href="/case-studies#volunteer">
              Interested in being a founding partner?
            </a>
          </p>
        </div>
      </section>

      <section className="section" id="compare" aria-labelledby="compare-h">
        <div className="wrap">
          <div className="section-head">
            <h2 id="compare-h">What each plan includes</h2>
          </div>
          <div className="table-scroll">
            <table className="compare">
              <thead>
                <tr>
                  <th scope="col">
                    <span className="visually-hidden">What is included</span>
                  </th>
                  <th scope="col">
                    <span className="compare__name">{audit.name}</span>
                    <span className="compare__price">Free</span>
                  </th>
                  {tiers.map((t) => (
                    <th scope="col" key={t.id}>
                      <span className="compare__name">{t.name}</span>
                      <span className="compare__price">Coming soon</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compare.map((r) => (
                  <tr key={r.row}>
                    <th scope="row">{r.row}</th>
                    {r.cols.map((v, i) => (
                      <td key={i}>
                        <Cell v={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="addon" id={aiLine.id}>
            <h3 className="t-card">Optional add-on: {aiLine.name}</h3>
            <p>{aiLine.summary}</p>
            <ul className="plan-list">
              {aiLine.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="t-small muted">In testing with pilot shops. Coming soon.</p>
          </div>
        </div>
      </section>

      <section
        className="section section--fit ground-surface"
        id="pricing-questions"
        aria-labelledby="pq-h"
      >
        <div className="wrap">
          {/* the same layout as the home page's questions: heading on top, two columns below */}
          <div className="section-head section-head--row">
            <h2 id="pq-h">Questions about prices</h2>
            <a className="btn btn--primary" href={MAIN_ACTION.href}>
              {MAIN_ACTION.label}
              <Arrow />
            </a>
          </div>
          <div className="faq faq--cols">
            {pricingFaqs.map((f) => (
              <details key={f.q} open>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
