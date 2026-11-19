import type { Metadata } from "next";
import { Arrow } from "@/components/Arrow";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, MAIN_ACTION, site } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "About",
  description:
    "Cambi Growth is run by Yan, an NYU student in New York with a background in engineering and finance, who sets up NYC trade shops to be found and booked by AI assistants.",
  alternates: { canonical: "/about" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.founder,
  jobTitle: "Founder",
  worksFor: { "@id": `${SITE_URL}/#business` },
  affiliation: { "@type": "CollegeOrUniversity", name: "New York University" },
  homeLocation: { "@type": "City", name: "New York" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("About", "/about")} />
      <JsonLd data={personJsonLd} />

      <section
        className="section"
        data-enter
        aria-labelledby="hero-h"
        style={{ ["--h" as string]: 1 }}
      >
        <div className="wrap">
          <div className="grid">
            <div className="span-8 split-col">
              <div className="section-head">
                <h1 id="hero-h">
                  An NYC business that builds for NYC shops
                </h1>
                <p>
                  Cambi Growth is run by {site.founder}, a student at NYU who lives and works in New
                  York. The background is engineering and finance: building systems that work, and
                  checking that they pay for themselves.
                </p>
                <p>
                  We started by building websites for small businesses. We now focus on one thing:
                  making sure that when a customer asks an AI assistant for a plumber, an
                  electrician or an HVAC tech, it can find your prices, your hours and an open slot,
                  and book you.
                </p>
              </div>
              <div className="split-col__end btn-row">
                <a className="btn btn--primary" href={MAIN_ACTION.href}>
                  {MAIN_ACTION.label}
                  <Arrow />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section ground-surface"
        id="why"
        aria-labelledby="why-h"
        style={{ ["--h" as string]: 1 }}
      >
        <div className="wrap">
          <div className="grid">
            <div className="span-5 section-head">
              <h2 id="why-h">Why small trade shops</h2>
            </div>
            <div className="span-6 start-7 stack-5">
              <p className="t-lead">
                Big companies have teams to keep their listings, prices and booking up to date. A
                shop with three trucks has an owner who is under a sink at 10 a.m.
              </p>
              <p>
                AI assistants are starting to do the searching and the calling for customers. They
                pick the shop they can read. We want that to be the shop that does good work, not
                the one with the biggest marketing budget.
              </p>
              <p>
                So we keep it practical: you set your prices, we publish them where AI can read
                them, and you own everything we build.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
