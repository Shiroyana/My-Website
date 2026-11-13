import { MAIN_ACTION, site } from "@/lib/site";
import { Arrow } from "./Arrow";
import { photoCredits } from "@/lib/photos";

/* footer-dark (dealt) with close-type (dealt): row 1 the close, row 2 the links, on the blueprint sheet. */
export function Footer() {
  const year = new Date().getFullYear();
  const credits = photoCredits();
  return (
    <footer
      className="footer closing footer--dark ground-inverse bp-sheet"
      id="contact"
      aria-labelledby="close-h"
    >
      <div className="wrap">
        <div className="closing__cta close--type">
          <div className="section-head">
            <h2 id="close-h">{site.brandLine}.</h2>
            <p>The audit is free, and the report is yours to keep.</p>
          </div>
          <a className="btn btn--primary btn--xl btn--wide" href={MAIN_ACTION.href}>
            {MAIN_ACTION.label}
            <Arrow />
          </a>
        </div>
        <div className="closing__links">
          <div className="grid">
            <div className="span-4 stack-4">
              <a className="nav__logo" href="/">
                {/* eslint-disable-next-line @next/next/no-img-element -- brand PNG as is */}
                <img src="/brand/brand-mark.png" alt="" width={28} height={28} />
                <span translate="no">{site.name}</span>
              </a>
              <p className="footer__lede">
                AI booking setup for HVAC, plumbing and electrical shops in all five NYC boroughs.
              </p>
            </div>
            <div className="span-2 footer__col">
              <h3>Services</h3>
              <ul>
                <li>
                  <a href="/audit">Free audit</a>
                </li>
                <li>
                  <a href="/packages">Packages</a>
                </li>
                <li>
                  <a href="/work">Web design</a>
                </li>
              </ul>
            </div>
            <div className="span-2 footer__col">
              <h3>Company</h3>
              <ul>
                <li>
                  <a href="/about">About</a>
                </li>
                <li>
                  <a href="/case-studies">Case studies</a>
                </li>
                <li>
                  <a href="/contact">Contact</a>
                </li>
              </ul>
            </div>
            <div className="span-4 footer__col">
              <h3>Email</h3>
              <ul>
                <li>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </li>
                <li>New York City, all five boroughs</li>
              </ul>
            </div>
          </div>
          <div className="footer__legal">
            <span>
              &copy; {year} {site.name} &nbsp; <a href="/privacy">Privacy</a>
            </span>
            {credits ? (
              <details className="credits">
                <summary>{credits.summary}</summary>
                <p>{credits.detail}</p>
              </details>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
