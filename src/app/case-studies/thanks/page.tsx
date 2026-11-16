import type { Metadata } from "next";
import { TrackConversion } from "@/components/TrackConversion";
import { MAIN_ACTION, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Founding partner application received",
  robots: { index: false, follow: false },
  alternates: { canonical: "/case-studies/thanks" },
};

/** Reached only after a real send (the server action redirects here). */
export default function VolunteerThanksPage() {
  return (
    <section className="section" aria-labelledby="hero-h" style={{ ["--h" as string]: 1 }}>
      <TrackConversion event="case-study-volunteer" />
      <div className="wrap">
        <div className="section-head">
          <h1 id="hero-h">
            Thanks for applying as a founding partner
          </h1>
          <p>
            We will email you to set up a short call. Questions in the meantime:{" "}
            <a className="link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
          <div className="btn-row">
            <a className="btn btn--secondary" href={MAIN_ACTION.href}>
              {MAIN_ACTION.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
