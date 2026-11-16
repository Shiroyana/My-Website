import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { clients } from "@/lib/site";

export const metadata: Metadata = {
  title: "Web design work",
  description:
    "Websites Cambi Growth built and runs for small businesses: AAFARMA Inc., African Green Manor and VitalCare Essential Supplies Corp.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Web design work", "/work")} />
      <section
        className="section"
        data-enter
        aria-labelledby="hero-h"
        style={{ ["--h" as string]: 1 }}
      >
        <div className="wrap">
          <div className="section-head">
            <h1 id="hero-h">
              Web design work for our existing clients
            </h1>
            <p>
              We built and still run these three sites. Existing clients keep their support as we
              focus on AI booking for trade shops.
            </p>
          </div>
          <div className="grid">
            {clients.map((c) => (
              <a
                key={c.name}
                className="card card--open span-4"
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="frame frame--photo" style={{ ["--ratio" as string]: "62.5%" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- static 640x400 screenshots */}
                  <img
                    className="frame__img"
                    src={c.image}
                    alt={`Home page of the ${c.name} website`}
                    width={640}
                    height={400}
                    decoding="async"
                  />
                </div>
                <p className="t-card">{c.name}</p>
                <p>{c.line}</p>
                <span className="visually-hidden">(opens in a new tab)</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
