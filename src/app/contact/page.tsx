import type { Metadata } from "next";
import { Arrow } from "@/components/Arrow";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { MAIN_ACTION, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Email Cambi Growth at ${site.email}. We work with HVAC, plumbing and electrical shops in all five NYC boroughs.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Contact", "/contact")} />
      <section
        className="section"
        data-enter
        aria-labelledby="hero-h"
        style={{ ["--h" as string]: 1 }}
      >
        <div className="wrap">
          <div className="grid">
            <div className="span-6 section-head">
              <h1 id="hero-h">
                Contact Cambi Growth
              </h1>
              <p>
                The fastest way to start is the free audit. For anything else, email us and a person
                will answer.
              </p>
              <div className="btn-row">
                <a className="btn btn--primary" href={MAIN_ACTION.href}>
                  {MAIN_ACTION.label}
                  <Arrow />
                </a>
              </div>
            </div>
            <div className="span-6 start-7">
              <dl className="rows contact-rows">
                <div>
                  <dt className="rows__name">Email</dt>
                  <dd>
                    <a className="link" href={`mailto:${site.email}`}>
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="rows__name">Area</dt>
                  <dd>{site.boroughs.join(", ")}</dd>
                </div>
                <div>
                  <dt className="rows__name">Trades</dt>
                  <dd>HVAC, plumbing and electrical shops with 1 to 10 trucks</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
