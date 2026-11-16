import type { Metadata } from "next";
import { Arrow } from "@/components/Arrow";
import { JsonLd } from "@/components/JsonLd";
import { PayToggle } from "@/components/PayToggle";
import { FreePrice, TierPrice } from "@/components/TierPrice";
import { breadcrumbJsonLd, faqJsonLd, servicesJsonLd } from "@/lib/jsonld";
import {
  MAIN_ACTION,
  ZERO_DOWN_MONTHS,
  aiLine,
  audit,
  money,
  site,
  tiers,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Packages and prices",
  description:
    "Starter, Booked and Growth Partner plans for NYC HVAC, plumbing and electrical shops: start at $0 down, or pay the standard setup for a lower monthly. Every shop starts with a free AI readiness audit.",
  alternates: { canonical: "/packages" },
};

const starter = tiers[0];

const pricingFaqs = [
  {
    q: "What does $0 down mean?",
    a: `No setup fee up front. The setup is spread over the first ${ZERO_DOWN_MONTHS} months at a higher monthly, and from month ${ZERO_DOWN_MONTHS + 1} you pay the standard monthly. Over the first year it costs $300 to $450 more than the standard option.`,
  },
  {
    q: "Why is there a setup fee?",
    a: `Setup is the work done once: your website or AI-readable pages, the price workshop, your Google profile and the booking or request link. On Starter that is ${money(starter.setup)}, about what a small-business website alone costs.`,
  },
  {
    q: "Can I pay off the setup early?",
    a: "Yes. A $0 down shop can pay the rest of its setup at any time and move to the standard monthly from the next bill.",
  },
  {
    q: "Can I move up a tier?",
    a: "Yes, any time. The setup you have already paid counts in full toward the next tier’s setup.",
  },
  {
    q: "Do you charge per lead or per booking?",
    a: "No. You pay a flat monthly however many leads or bookings come in, and nobody else gets your customers.",
  },
  {
    q: "Can I cancel?",
    a: `On the standard option, the plan is month to month after the first 3 months. On $0 down the term is ${ZERO_DOWN_MONTHS} months, since the setup is spread across it. Either way you keep your website, price book and Google profile.`,
  },
] as const;

/* what each tier includes, in the order an owner compares them; true, false or a short value */
const compare: { row: string; cols: (boolean | string)[] }[] = [
  { row: "Score out of 100 and the top three fixes", cols: [true, true, true, true] },
  { row: "New website with hosting, or AI-readable pages added to yours", cols: [false, true, true, true] },
  { row: "Price book (ranges you approve)", cols: [false, "Top 10 jobs", "Top 20 jobs + fees", "Every trade"] },
  { row: "MCP connection for AI assistants", cols: [false, "Read prices, hours, area", "Plus booking requests", "Plus booking requests"] },
  { row: "Google Business Profile cleaned up", cols: [false, true, true, true] },
  { row: "Booking", cols: [false, "Request form", "Live open slots", "Live open slots"] },
  { row: "Only verified AI agents can request bookings", cols: [false, false, true, true] },
  { row: "Pages per service and per borough", cols: [false, false, true, true] },
  { row: "Checks and price updates", cols: [false, "Monthly, 2 updates", "Weekly, unlimited", "Weekly, unlimited"] },
  { row: "Report of every AI agent that asked", cols: [false, true, true, true] },
  { row: "Your own allow and block rules per AI agent", cols: [false, false, false, true] },
  { row: "New AI channels as they launch", cols: [false, "Add-on", "Standard setup fee", "First, no setup fee"] },
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
          <div className="section-head section-head--row">
            <div>
              <h1 id="hero-h">
                Packages and prices for NYC trade shops
              </h1>
              <p>
                Every shop starts with the free audit. Then start at $0 down, or pay the standard
                setup for the lowest monthly.
              </p>
            </div>
            <PayToggle scopeId="top-packages" />
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
                <TierPrice tier={t} />
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
          <div className="section-head section-head--row">
            <h2 id="compare-h">What each plan includes</h2>
            <PayToggle scopeId="compare" tone="light" />
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
                    <span className="compare__price figures">Free</span>
                  </th>
                  {tiers.map((t) => (
                    <th scope="col" key={t.id}>
                      <span className="compare__name">{t.name}</span>
                      <span className="compare__price figures" data-pay="zerodown">
                        <span className="compare__fig">{money(t.zeroDownMonthly)}/mo</span> for{" "}
                        {ZERO_DOWN_MONTHS} months, then{" "}
                        <span className="compare__fig">{money(t.monthly)}/mo</span>
                      </span>
                      <span className="compare__price figures" data-pay="upfront">
                        <span className="compare__fig">{money(t.monthly)}/mo</span> +{" "}
                        <span className="compare__fig">{money(t.setup)} setup</span>
                      </span>
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
            <p className="t-small muted">Price on request while we test it with a few shops.</p>
          </div>
        </div>
      </section>

      <section className="section section--fit ground-surface" id="pricing-questions" aria-labelledby="pq-h">
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
