import type { Metadata } from "next";
import { Arrow } from "@/components/Arrow";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, faqJsonLd, servicesJsonLd } from "@/lib/jsonld";
import { MAIN_ACTION, packages, priceLabel, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Packages and prices",
  description:
    "Free AI readiness audit, Agent-ready setup, Agent-ready monthly and a voice add-on for NYC HVAC, plumbing and electrical shops. What each includes and what it costs.",
  alternates: { canonical: "/packages" },
};

const pricingFaqs = [
  {
    q: "Why is there a setup fee?",
    a: "Setup is the work done once: the price workshop, your Google profile, the services page and the booking link. The monthly plan keeps it right afterwards.",
  },
  {
    q: "Do I have to take the monthly plan?",
    a: "No. You can buy the setup alone and keep everything we build. The monthly plan is for shops that change prices or hours often and want them kept in step.",
  },
  {
    q: "Can I cancel?",
    a: "Yes, the monthly plan and the voice add-on can be cancelled at the end of any month. You keep your price book, profile and pages.",
  },
] as const;

const compare = [
  { row: "Score out of 100 and top three fixes", cols: [true, true, true, false] },
  { row: "Price workshop and price book", cols: [false, true, false, false] },
  { row: "Google Business Profile fixed", cols: [false, true, false, false] },
  { row: "Services page AI can read", cols: [false, true, false, false] },
  { row: "Booking link or request form", cols: [false, true, false, false] },
  { row: "Weekly checks and price updates", cols: [false, false, true, false] },
  { row: "Monthly report", cols: [false, false, true, false] },
  { row: "After-hours and overflow call answering", cols: [false, false, false, true] },
] as const;

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
            <h1 id="hero-h" className="t-h2">
              Packages and prices for NYC trade shops
            </h1>
            <p>
              Every shop starts with the free audit. Prices marked &ldquo;from $X&rdquo; are being
              set now; email us for a quote in the meantime.
            </p>
          </div>
          <div className="grid">
            {packages.map((p) => (
              <article
                key={p.id}
                id={p.id}
                className={`card card--plan ground-base glass-light span-3${p.featured ? " is-featured timber-edge" : ""}`}
                aria-labelledby={`${p.id}-h`}
              >
                <h2 id={`${p.id}-h`} className="t-card">
                  {p.name}
                </h2>
                <p className="figures">
                  <strong>{priceLabel(p)}</strong>
                </p>
                <ul className="plan-list">
                  {p.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="t-small muted">For: {p.suits}</p>
                {p.id === "audit" ? (
                  <a className="link card__action" href="/audit">
                    Request the audit
                  </a>
                ) : (
                  <a
                    className="link card__action"
                    href={`mailto:${site.email}?subject=${encodeURIComponent(`Quote: ${p.name}`)}`}
                  >
                    Email for a quote
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="compare" aria-labelledby="compare-h">
        <div className="wrap">
          <div className="section-head">
            <h2 id="compare-h">What each package includes</h2>
          </div>
          <div className="table-scroll">
            <table className="compare">
              <thead>
                <tr>
                  <th scope="col">Included</th>
                  {packages.map((p) => (
                    <th scope="col" key={p.id}>
                      {p.name}
                      <span className="compare__price figures">{priceLabel(p)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compare.map((r) => (
                  <tr key={r.row}>
                    <th scope="row">{r.row}</th>
                    {r.cols.map((on, i) => (
                      <td key={i}>
                        {on ? (
                          <span className="compare__yes">
                            <span aria-hidden="true">&#10003;</span>
                            <span className="visually-hidden">Included</span>
                          </span>
                        ) : (
                          <span className="compare__no">
                            <span aria-hidden="true">&middot;</span>
                            <span className="visually-hidden">Not included</span>
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section ground-surface" id="pricing-questions" aria-labelledby="pq-h">
        <div className="wrap">
          <div className="grid">
            <div className="span-6 section-head">
              <h2 id="pq-h">Questions about prices</h2>
              <div className="btn-row">
                <a className="btn btn--primary" href={MAIN_ACTION.href}>
                  {MAIN_ACTION.label}
                  <Arrow />
                </a>
              </div>
            </div>
            <div className="span-6 start-7 faq">
              {pricingFaqs.map((f) => (
                <details key={f.q} open>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
