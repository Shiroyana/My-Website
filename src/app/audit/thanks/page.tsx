import type { Metadata } from "next";
import { TrackConversion } from "@/components/TrackConversion";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Audit request received",
  robots: { index: false, follow: false },
  alternates: { canonical: "/audit/thanks" },
};

/** Reached only after a real send (the server action redirects here). The main conversion. */
export default function ThanksPage() {
  return (
    <section className="section" aria-labelledby="hero-h" style={{ ["--h" as string]: 1 }}>
      <TrackConversion event="audit-request" />
      <div className="wrap">
        <div className="section-head">
          <h1 id="hero-h">
            Your audit request is in
          </h1>
          <p>
            We will run the seven checks and email your report. If you think of anything we should
            know, write to{" "}
            <a className="link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
          <div className="btn-row">
            <a className="btn btn--secondary" href="/packages">
              See packages
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
