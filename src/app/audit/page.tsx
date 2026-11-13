import type { Metadata } from "next";
import { AuditForm } from "@/components/AuditForm";
import { JsonLd } from "@/components/JsonLd";
import { SampleReport } from "@/components/SampleReport";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { rubric } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free AI readiness audit for NYC trade shops",
  description:
    "Find out how ChatGPT, Gemini and Google see your HVAC, plumbing or electrical shop. Free score out of 100 across seven checks, with the top three fixes.",
  alternates: { canonical: "/audit" },
};

const steps = [
  {
    t: "We check what customers and AI can see",
    d: "Your Google profile, website, prices, booking, phone answer and licenses. Nothing to install, no logins needed.",
  },
  {
    t: "We ask the assistants",
    d: "ChatGPT, Gemini and Google are asked to find and price a job at your shop, the way a customer would.",
  },
  {
    t: "You get the report by email",
    d: "One page: your score, what each check found, and the three fixes that matter most. It is yours to keep.",
  },
];

export default function AuditPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Free audit", "/audit")} />

      {/* a section, not the kit's fixed one-screen hero: text plus the form outgrows one screen on
          short and narrow screens, and nothing may slide under the next section */}
      <section className="section audit-hero" data-enter aria-labelledby="hero-h">
        <div className="wrap">
          <div className="grid">
            <div className="hero__text span-5">
              <p className="hero__kicker">
                <span className="dot" aria-hidden="true" />
                Free for HVAC, plumbing and electrical shops in NYC
              </p>
              <h1 id="hero-h">Free AI readiness audit for your shop</h1>
              <p className="hero__lead">
                We test how ChatGPT, Gemini and Google see your shop today, score it out of 100
                across seven checks, and email you a one-page report with the three fixes that
                matter most.
              </p>
            </div>
            <div className="span-6 start-7">
              <div className="card">
                <h2 id="audit-form-h" className="t-h3">
                  Request your audit
                </h2>
                <AuditForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section ground-surface" id="sample" aria-labelledby="sample-h">
        <div className="wrap">
          <div className="section-head">
            <h2 id="sample-h">Sample report</h2>
            <p>
              This is what lands in your inbox. The shop and its numbers here are an example; yours
              are measured on your own listings.
            </p>
          </div>
          <SampleReport />
        </div>
      </section>

      <section className="section" id="checks" aria-labelledby="checks-h">
        <div className="wrap">
          <div className="grid">
            <div className="span-6">
              <div className="section-head">
                <h2 id="checks-h">The seven checks and their points</h2>
              </div>
              <ul className="rows">
                {rubric.map((r) => (
                  <li key={r.check}>
                    <span className="rows__name">{r.check}</span>
                    <span className="rows__value">{r.points}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="span-6 start-7">
              <div className="section-head">
                <h2 className="t-h3">What happens after you send the form</h2>
              </div>
              <ol className="steps-list">
                {steps.map((s, i) => (
                  <li key={s.t}>
                    <span className="steps-list__n figures" aria-hidden="true">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="t-card">{s.t}</h3>
                      <p>{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
