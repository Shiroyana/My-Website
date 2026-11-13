import { Arrow } from "@/components/Arrow";
import { MAIN_ACTION } from "@/lib/site";

export default function NotFound() {
  return (
    <section
      className="section ground-inverse bp-sheet"
      aria-labelledby="hero-h"
      style={{ ["--h" as string]: 1 }}
    >
      <div className="wrap">
        <div className="section-head">
          <p className="t-label">Error 404</p>
          <h1 id="hero-h" className="t-h2">
            This page is not on the plans
          </h1>
          <p>The link may be old, or the address may have a typo.</p>
          <div className="btn-row">
            <a className="btn btn--primary" href={MAIN_ACTION.href}>
              {MAIN_ACTION.label}
              <Arrow />
            </a>
            <a className="btn btn--secondary" href="/">
              Go to the home page
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
